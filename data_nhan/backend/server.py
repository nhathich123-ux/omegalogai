"""
CHATBOT CẨM NANG NHÂN VIÊN KHO - Backend Server
=================================================
Server Flask chạy 100% local, không dùng API bên ngoài.
Sử dụng Naive Bayes + TF-IDF + Fuzzy Matching cho NLP tiếng Việt.
"""

import os
import sys
import json
import math
import random
import re
import unicodedata
import urllib.request
import urllib.parse
from collections import Counter

from flask import Flask, request, jsonify, send_from_directory
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# ============================================================
# CẤU HÌNH
# ============================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KNOWLEDGE_FILE = os.path.join(BASE_DIR, "knowledge_base.db")
# Phục vụ static files từ thư mục cha (thư mục gốc chứa index.html, style.css, app.js)
STATIC_DIR = os.path.dirname(BASE_DIR)
LAST_USER_MESSAGE = ""
SESSION_CONTEXT = {
    "last_topic_id": None,
    "last_step": 0
}

# ============================================================
# USER STYLE ANALYZER - Học phong cách giao tiếp người dùng
# ============================================================
class UserStyleAnalyzer:
    """
    Phân tích và ghi nhớ phong cách giao tiếp của người dùng.
    Tự điều chỉnh cách trả lời để phù hợp hơn với người dùng.
    """

    INFORMAL_MARKERS = [
        'tui', 'mình', 'bạn', 'cậu', 'mày', 'tao', 'oke', 'ok', 'okê',
        'nha', 'nhé', 'nè', 'hả', 'vậy', 'hông', 'hong', 'ha', 'ờ',
        'ừ', 'ừm', 'hmm', 'ơ', 'á', 'đó', 'này', 'thế', 'vậy',
        'gì', 'sao', 'kiểu', 'kiểu như', 'tức là', 'ý là', 'genre',
        'bro', 'sis', 'mn', 'ae', 'anh', 'chị', 'em'
    ]

    SLANGS = [
        'ntn', 'đc', 'k', 'ko', 'không', 'vs', 'với', 'đừng',
        'mk', 'thx', 'ty', 'ik', 'idk', 'brb', 'tbh', 'btw',
        'haha', 'hihi', 'huhu', 'hehe', ':)', ':D', 'xD', '😂', '🤣', '😊',
        'lol', 'omg', 'omfg', 'wtf', 'fr', 'ngl', 'fyi'
    ]

    def __init__(self, db_path):
        self.db_path = db_path
        self.profile = {
            'avg_msg_length': 20,
            'informal_ratio': 0.3,
            'slang_count': 0,
            'emoji_count': 0,
            'question_ratio': 0.5,
            'short_msg_ratio': 0.4,
            'total_messages': 0,
            'preferred_pronoun': 'cậu',
            'style': 'balanced'
        }
        self._load_profile()

    def _load_profile(self):
        """Load profile từ database."""
        import sqlite3
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT key, value FROM user_style_profile")
            rows = cursor.fetchall()
            conn.close()
            for key, value in rows:
                try:
                    self.profile[key] = float(value) if '.' in str(value) else int(value)
                except (ValueError, TypeError):
                    self.profile[key] = value
        except Exception:
            pass

    def _save_profile(self):
        """Lưu profile vào database."""
        import sqlite3
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_style_profile (
                    key TEXT PRIMARY KEY,
                    value TEXT,
                    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
            for key, value in self.profile.items():
                cursor.execute(
                    "INSERT OR REPLACE INTO user_style_profile (key, value) VALUES (?, ?)",
                    (key, str(value))
                )
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[UserStyle] Save error: {e}")

    def _save_message(self, message):
        """Lưu tin nhắn người dùng vào DB để phân tích sau."""
        import sqlite3
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_style (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT DEFAULT 'default',
                    message TEXT,
                    analyzed_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            """)
            cursor.execute(
                "INSERT INTO user_style (session_id, message) VALUES ('default', ?)",
                (message,)
            )
            cursor.execute("""
                DELETE FROM user_style WHERE id NOT IN (
                    SELECT id FROM user_style ORDER BY id DESC LIMIT 500
                )
            """)
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[UserStyle] Message save error: {e}")

    def analyze(self, message):
        """Phân tích tin nhắn của người dùng và cập nhật profile."""
        # self._save_message(message)  # Tắt ghi log tin nhắn để tránh Live Server tự động reload trang

        msg_lower = message.lower().strip()
        msg_len = len(message)
        n = self.profile['total_messages']

        self.profile['avg_msg_length'] = (
            (self.profile['avg_msg_length'] * n + msg_len) / (n + 1)
        )

        informal_found = sum(1 for w in self.INFORMAL_MARKERS if w in msg_lower)
        self.profile['informal_ratio'] = min(1.0, (
            (self.profile['informal_ratio'] * n + min(1.0, informal_found * 0.3)) / (n + 1)
        ))

        slang_found = sum(1 for s in self.SLANGS if s in msg_lower)
        if slang_found > 0:
            self.profile['slang_count'] = self.profile.get('slang_count', 0) + slang_found

        emoji_count = sum(1 for c in message if ord(c) > 127000)
        if emoji_count > 0:
            self.profile['emoji_count'] = self.profile.get('emoji_count', 0) + emoji_count

        is_question = '?' in message or any(w in msg_lower for w in ['là gì', 'sao', 'tại sao', 'thế nào', 'như nào'])
        self.profile['question_ratio'] = (
            (self.profile['question_ratio'] * n + (1 if is_question else 0)) / (n + 1)
        )

        is_short = msg_len < 40
        self.profile['short_msg_ratio'] = (
            (self.profile['short_msg_ratio'] * n + (1 if is_short else 0)) / (n + 1)
        )

        if 'tui' in msg_lower or 'mình' in msg_lower:
            self.profile['preferred_pronoun'] = 'bạn'
        elif 'mày' in msg_lower or 'tao' in msg_lower:
            self.profile['preferred_pronoun'] = 'mày'

        self.profile['total_messages'] = n + 1

        if self.profile['informal_ratio'] > 0.5 or self.profile['slang_count'] > 5:
            self.profile['style'] = 'casual'
        elif self.profile['informal_ratio'] < 0.2 and self.profile['avg_msg_length'] > 60:
            self.profile['style'] = 'formal'
        else:
            self.profile['style'] = 'balanced'

        # if (n + 1) % 5 == 0:
        #     self._save_profile()  # Tắt lưu profile để tránh Live Server tự động reload trang


    def adapt_response(self, response, topic_title=None):
        """Điều chỉnh câu trả lời theo phong cách người dùng."""
        if not response or self.profile['total_messages'] < 3:
            return response

        style = self.profile.get('style', 'balanced')
        pronoun = self.profile.get('preferred_pronoun', 'cậu')

        if style == 'casual':
            if pronoun != 'cậu':
                response = response.replace('cậu', pronoun)

            casual_intros = ['✅ ', '👇 ', '💪 ', '📌 ']
            if response.startswith('Tớ hiểu rồi'):
                import random as _r
                response = _r.choice(casual_intros) + response

            if not response.strip().endswith(('nha', 'nhé', '😊', '!')):
                endings = [' Hỏi thêm tớ nha! 😊', ' Cần gì cứ hỏi nhé! 👍', ' Mình giải thích thêm được nha!']
                import random as _r
                response = response + _r.choice(endings)

        elif style == 'formal':
            emoji_chars = [c for c in response if ord(c) > 127000]
            if len(emoji_chars) > 3:
                for e in emoji_chars[3:]:
                    response = response.replace(e, '', 1)

        return response

# Đọc file .env nếu có
ENV_FILE = os.path.join(BASE_DIR, ".env")
if os.path.exists(ENV_FILE):
    try:
        with open(ENV_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    if '=' in line:
                        k, v = line.split('=', 1)
                        os.environ[k.strip()] = v.strip()
        print("[INFO] Loaded environment variables from .env")
    except Exception as e:
        print(f"[WARNING] Failed to load .env: {e}")

app = Flask(__name__, static_folder=None)

# CORS
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# ============================================================
# VIETNAMESE NLP PIPELINE
# ============================================================
class VietnameseNLP:
    """Pipeline xử lý ngôn ngữ tự nhiên tiếng Việt hoàn toàn offline."""

    DIACRITICS_MAP = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'đ': 'd',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    }

    STOPWORDS = {
        'là', 'của', 'và', 'các', 'có', 'được', 'trong', 'cho',
        'với', 'này', 'đã', 'để', 'từ', 'một', 'những', 'về',
        'theo', 'tại', 'trên', 'khi', 'đó', 'bị', 'ra', 'vào',
        'thì', 'mà', 'hay', 'hoặc', 'nhưng', 'vì', 'nên', 'do',
        'cũng', 'rất', 'đều', 'sẽ', 'đang', 'rồi', 'lại', 'vẫn',
        'hơn', 'nhất', 'quá', 'chỉ', 'cả', 'mọi', 'nào', 'gì',
        'tớ', 'cậu', 'mình', 'bạn', 'mày', 'tao', 'ấy', 'ơi', 
        'nha', 'nhe', 'nhé', 'nè', 'ní', 'nì', 'à', 'uh', 'uhm',
        'đi', 'giùm', 'hộ', 'nhỉ', 'hả', 'đấy', 'thế', 'tẹo', 
        'chút', 'nữa', 'cơ', 'cái', 'tui', 'tự', 'ta', 'nữa',
        'vậy', 'vại', 'được', 'nhỉ', 'chứ', 'ư', 'á', 'ơ', 'a',
        'ok', 'oke', 'okie', 'tôi', 'hướng', 'dẫn', 'giúp', 'cách', 'làm'
    }

    def __init__(self, abbreviation_map=None):
        self.abbreviation_map = abbreviation_map or {}

    def normalize_unicode(self, text):
        return unicodedata.normalize('NFC', text)

    def lowercase(self, text):
        return text.lower().strip()

    def remove_extra_chars(self, text):
        text = re.sub(r'[^\w\sàáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def remove_diacritics(self, text):
        result = []
        for char in text:
            result.append(self.DIACRITICS_MAP.get(char, char))
        return ''.join(result)

    def expand_abbreviations(self, text):
        words = text.split()
        expanded = []
        for word in words:
            lower_word = word.lower()
            if lower_word in self.abbreviation_map:
                expanded.append(self.abbreviation_map[lower_word])
            else:
                expanded.append(word)
        return ' '.join(expanded)

    def tokenize(self, text):
        tokens = text.split()
        filtered = []
        for t in tokens:
            lower_t = t.lower()
            if lower_t in self.STOPWORDS:
                continue
            if len(t) > 1 or t.isdigit() or lower_t in ['h', 'm', 'g', 's', 'l'] or lower_t in self.abbreviation_map:
                filtered.append(t)
        return filtered

    def process(self, text):
        text = self.normalize_unicode(text)
        text = self.lowercase(text)
        text = re.sub(r'(\d+)([a-zA-Zàáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]+)', r'\1 \2', text)
        text = re.sub(r'([a-zA-Zàáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]+)(\d+)', r'\1 \2', text)
        text = self.expand_abbreviations(text)
        text = self.remove_extra_chars(text)
        tokens = self.tokenize(text)
        return tokens

    def process_to_text(self, text):
        tokens = self.process(text)
        return ' '.join(tokens)

    def process_no_diacritics(self, text):
        processed = self.process_to_text(text)
        return self.remove_diacritics(processed)


WHY_INDICATORS = [
    "tại sao", "tai sao", "vì sao", "vi sao", 
    "sao thế", "sao the", "sao lại", "sao lai", 
    "sao chỉ", "sao chi", "ý là sao", "y la sao",
    "ý là tại sao", "y la tai sao", "tại sao thế", "tai sao the",
    "tại sao vậy", "tai sao vay", "sao vậy", "sao vay",
    "tại sao phải", "tai sao phai", "sao phải", "sao phai",
    "sao chỉ được", "sao chi duoc", "sao lại chỉ", "sao lai chi",
    "ùa sao", "ua sao"
]


CONFUSED_WORDS = [
    "chưa hiểu", "chua hieu", 
    "chưa rõ", "chua ro", 
    "nói rõ hơn", "noi ro hon", 
    "giải thích thêm", "giai thich them", 
    "kỹ hơn", "ky hon", 
    "chi tiết hơn", "chi tiet hon",
    "là sao", "la sao",
    "giải thích lại", "giai thich lai",
    "chưa nắm được", "chua nam duoc",
    "hướng dẫn thêm", "huong dan them",
    "cụ thể", "cu the",
    "chưa rõ lắm", "chua ro lam",
    "chưa hiểu lắm", "chua hieu lam",
    "chưa được rõ", "chua duoc ro",
    "giải thích đi", "giai thich di",
    "giải thích rõ hơn", "giai thich ro hon",
    "giải thích chi tiết", "giai thich chi tiet",
    "làm rõ hơn", "lam ro hon",
    "rõ hơn", "ro hon",
    "nói chi tiết", "noi chi tiet",
    "chưa hiểu rõ", "chua hieu ro"
]


def is_why_query(query):
    query_lower = query.lower()
    return any(indicator in query_lower for indicator in WHY_INDICATORS)


def is_confused_query(query):
    query_lower = query.lower()
    return any(word in query_lower for word in CONFUSED_WORDS)


def is_execution_query(query):
    query_lower = query.lower()
    exec_words = [
        "bắt đầu thực hiện", "bat dau thuc hien",
        "bắt đầu làm", "bat dau lam",
        "hướng dẫn thực hiện", "huong dan thuc hien",
        "hướng dẫn từng bước", "huong dan tung buoc",
        "làm thế nào để bắt đầu", "lam the nao de bat dau",
        "từng bước một", "tung buoc mot",
        "các bước thực hiện", "cac buoc thuc hien",
        "bắt đầu như thế nào", "bat dau nhu the nao",
        "chỉ cách làm", "chi cach lam",
        "các bước cụ thể", "cac buoc cu the",
        "làm luôn", "lam luon",
        "tiến hành", "tien hanh",
        "hướng dẫn làm", "huong dan lam",
        "bước tiếp theo", "buoc tiep theo",
        "giờ làm sao", "gio lam sao",
        "làm thế nào", "lam the nao",
        "chỉ tớ làm", "chi to lam",
        "làm ntn", "lam ntn",
        "chỉ tớ cách", "chi to cach",
        "hướng dẫn chi tiết bước", "huong dan chi tiet buoc",
        "các bước", "cac buoc",
        "chỉ tớ", "chi to",
        "chỉ cách", "chi cach",
        "hướng dẫn các bước", "huong dan cac buoc",
        "làm cụ thể", "lam cu the",
        "thực hiện ntn", "thuc hien ntn",
        "bước 1", "buoc 1",
        "hướng dẫn cách", "huong dan cach",
        "chỉ tui", "chi tui",
        "chỉ mình", "chi minh",
        "chỉ em", "chi em",
        "chỉ anh", "chi anh"
    ]
    return any(word in query_lower for word in exec_words)


def detect_step_query(query):
    query_lower = query.lower().strip()
    numeral_map = {
        "một": 1, "mot": 1, "01": 1, "1": 1,
        "hai": 2, "02": 2, "2": 2,
        "ba": 3, "03": 3, "3": 3,
        "bốn": 4, "bon": 4, "tư": 4, "tu": 4, "04": 4, "4": 4,
        "năm": 5, "nam": 5, "05": 5, "5": 5,
        "sáu": 6, "sau": 6, "06": 6, "6": 6,
        "bảy": 7, "bay": 7, "07": 7, "7": 7,
        "tám": 8, "tam": 8, "08": 8, "8": 8,
        "chín": 9, "chin": 9, "09": 9, "9": 9,
        "mười": 10, "muoi": 10, "10": 10
    }
    pattern = r'\b(?:bước|buoc|step|b)\s*(?:thứ|thu|số|so)?\s*(\d+|một|mot|hai|ba|bốn|bon|tư|tu|năm|nam|sáu|sau|bảy|bay|tám|tam|chín|chin|mười|muoi)\b'
    match = re.search(pattern, query_lower)
    if match:
        val = match.group(1)
        if val in numeral_map:
            return numeral_map[val]
    return None


def is_next_step_query(query):
    query_lower = query.lower().strip()
    next_words = [
        "tiếp đi", "tiep di",
        "tiếp tục", "tiep tuc",
        "bước tiếp theo", "buoc tiep theo",
        "bước tiếp", "buoc tiep",
        "tiếp", "tiep",
        "nói tiếp", "noi tiep",
        "hướng dẫn tiếp", "huong dan tiep",
        "tiếp theo là gì", "tiep theo la gi",
        "làm gì tiếp", "lam gi tiep"
    ]
    return any(word in query_lower for word in next_words)


def levenshtein_distance(s1, s2):
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)

    prev_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        curr_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = prev_row[j + 1] + 1
            deletions = curr_row[j] + 1
            substitutions = prev_row[j] + (c1 != c2)
            curr_row.append(min(insertions, deletions, substitutions))
        prev_row = curr_row
    return prev_row[-1]


def fuzzy_match_score(query_word, target_word, threshold=0.6):
    if query_word == target_word:
        return 1.0
    max_len = max(len(query_word), len(target_word))
    if max_len == 0:
        return 0.0
    distance = levenshtein_distance(query_word, target_word)
    similarity = 1.0 - (distance / max_len)
    return similarity if similarity >= threshold else 0.0


# ============================================================
# NAIVE BAYES INTENT CLASSIFIER
# ============================================================
class NaiveBayesClassifier:
    def __init__(self):
        self.vocabulary = set()
        self.labels = []
        self.priors = {}
        self.cond_probs = {}
        self.class_denominators = {}
        self.alpha = 0.5
        self.vocab_size = 0
        self.trained = False
        self.idfs = {}

    def train(self, training_data):
        vocab_set = set()
        class_doc_counts = Counter()
        class_token_counts = {}
        all_labels = list(set(d["label"] for d in training_data))

        for label in all_labels:
            class_token_counts[label] = Counter()

        total_docs = len(training_data)
        doc_counts = Counter()

        for doc in training_data:
            label = doc["label"]
            class_doc_counts[label] += 1
            unique_tokens = set(doc["tokens"])
            for token in unique_tokens:
                vocab_set.add(token)
                doc_counts[token] += 1
                
            for token in doc["tokens"]:
                class_token_counts[label][token] += 1

        self.vocabulary = vocab_set
        self.labels = all_labels
        self.vocab_size = len(vocab_set)

        self.idfs = {}
        for token in vocab_set:
            count = doc_counts.get(token, 0)
            self.idfs[token] = math.log((1 + total_docs) / (1 + count)) + 1

        for label in all_labels:
            self.priors[label] = (class_doc_counts[label] + 1) / (total_docs + len(all_labels))

        self.cond_probs = {}
        self.class_denominators = {}

        for label in all_labels:
            total_tokens_in_class = sum(class_token_counts[label].values())
            self.class_denominators[label] = total_tokens_in_class + self.alpha * self.vocab_size
            self.cond_probs[label] = {}
            for token in vocab_set:
                count = class_token_counts[label].get(token, 0)
                self.cond_probs[label][token] = (count + self.alpha) / self.class_denominators[label]

        self.trained = True
        print(f"[NaiveBayes] Trained: {len(all_labels)} labels, {self.vocab_size} vocab, {total_docs} docs")

    def predict(self, tokens):
        if not self.trained:
            return None

        scores = {}
        for label in self.labels:
            log_prob = math.log(self.priors[label])
            for token in tokens:
                if token in self.cond_probs[label]:
                    log_prob += math.log(self.cond_probs[label][token])
                else:
                    log_prob += math.log(self.alpha / self.class_denominators[label])
            scores[label] = log_prob

        best_label = max(scores, key=scores.get)
        max_score = scores[best_label]
        exp_scores = {}
        for label, score in scores.items():
            exp_scores[label] = math.exp(score - max_score)
        total = sum(exp_scores.values())
        confidence = exp_scores[best_label] / total if total > 0 else 0

        matched_tokens = []
        for token in tokens:
            if token in self.cond_probs[best_label]:
                smooth_prob = self.alpha / self.class_denominators[best_label]
                if self.cond_probs[best_label][token] > smooth_prob:
                    matched_tokens.append(token)
        
        if not tokens:
            confidence = 0.0
        else:
            total_query_idf = sum(self.idfs.get(t, 1.0) for t in tokens)
            matched_query_idf = sum(self.idfs.get(t, 1.0) for t in matched_tokens)
            
            if total_query_idf > 0:
                match_factor = matched_query_idf / total_query_idf
            else:
                match_factor = 0.0
                
            if matched_tokens:
                confidence = confidence * (0.2 + 0.8 * match_factor)
            else:
                confidence = 0.0

        return {
            "label": best_label,
            "confidence": confidence,
            "scores": scores
        }

    def save_to_db(self, db_path):
        import sqlite3
        data = {
            "vocabulary": list(self.vocabulary),
            "labels": self.labels,
            "priors": self.priors,
            "cond_probs": self.cond_probs,
            "class_denominators": self.class_denominators,
            "alpha": self.alpha,
            "vocab_size": self.vocab_size,
            "trained": self.trained,
            "idfs": self.idfs
        }
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO model_states (model_name, state_data)
                VALUES (?, ?)
            """, ("naive_bayes", json.dumps(data, ensure_ascii=False)))
            conn.commit()
            conn.close()
            print(f"[NaiveBayes] Model state saved to database: {db_path}")
            return True
        except Exception as e:
            print(f"[NaiveBayes] Save to DB error: {e}")
            return False

    def load_from_db(self, db_path):
        import sqlite3
        if not os.path.exists(db_path):
            return False
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT state_data FROM model_states WHERE model_name = ?", ("naive_bayes",))
            row = cursor.fetchone()
            conn.close()
            
            if not row:
                return False
                
            data = json.loads(row[0])
            self.vocabulary = set(data["vocabulary"])
            self.labels = data["labels"]
            self.priors = data["priors"]
            self.cond_probs = data["cond_probs"]
            self.class_denominators = data["class_denominators"]
            self.alpha = data["alpha"]
            self.vocab_size = data["vocab_size"]
            self.trained = data["trained"]
            self.idfs = data.get("idfs", {})
            print("[NaiveBayes] Loaded model state from SQLite database.")
            return True
        except Exception as e:
            print(f"[NaiveBayes] Load from DB error: {e}")
            return False


# ============================================================
# UTILITIES FOR RAG
# ============================================================
def extract_text_from_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.txt':
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
        except Exception as e:
            print(f"[ERROR] TXT reading failed: {e}")
            return ""
    elif ext == '.pdf':
        try:
            import pypdf
            reader = pypdf.PdfReader(file_path)
            text_parts = []
            for idx, page in enumerate(reader.pages):
                text_parts.append(page.extract_text() or "")
            return "\n\n".join(text_parts)
        except Exception as e:
            print(f"[ERROR] PDF extraction failed: {e}")
            return ""
    return ""

def chunk_text(text, chunk_size=600, overlap=150):
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""
    
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        
        if len(current_chunk) + len(para) + 2 > chunk_size:
            if current_chunk:
                chunks.append(current_chunk)
                current_chunk = current_chunk[-overlap:] if overlap < len(current_chunk) else current_chunk
            
            if len(para) > chunk_size:
                words = para.split(' ')
                word_chunk = ""
                for word in words:
                    if len(word_chunk) + len(word) + 1 > chunk_size:
                        if word_chunk:
                            chunks.append(word_chunk)
                            word_chunk = word_chunk[-overlap:] if overlap < len(word_chunk) else word_chunk
                        word_chunk = (word_chunk + " " + word).strip()
                    else:
                        word_chunk = (word_chunk + " " + word).strip()
                if word_chunk:
                    current_chunk = word_chunk
            else:
                current_chunk = para
        else:
            if current_chunk:
                current_chunk += "\n\n" + para
            else:
                current_chunk = para
                
    if current_chunk:
        chunks.append(current_chunk)
        
    return chunks

# ============================================================
# KNOWLEDGE ENGINE (RAG WITH TF-IDF)
# ============================================================
class KnowledgeEngine:
    """Engine truy xuất tri thức dựa trên RAG với TF-IDF Cosine Similarity."""

    def __init__(self):
        self.knowledge = None
        self.topics = []
        self.nlp = None
        self.classifier = NaiveBayesClassifier()
        self.tfidf_vectorizer = None
        self.tfidf_matrix = None
        self.db_chunks = []
        self.trained = False
        self._db_path = None
        self.style_analyzer = None

    def load_knowledge(self, db_path):
        """Load knowledge base metadata từ database SQLite."""
        import sqlite3
        if not os.path.exists(db_path):
            print(f"[ERROR] Database file not found: {db_path}")
            return False
            
        try:
            self.style_analyzer = UserStyleAnalyzer(db_path)
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()

            # Load config
            self.knowledge = {}
            cursor.execute("SELECT key, value FROM config")
            for key, value in cursor.fetchall():
                if key in ["fallback_responses", "initial_suggestions"]:
                    try:
                        self.knowledge[key] = json.loads(value)
                    except Exception:
                        self.knowledge[key] = [value]
                else:
                    self.knowledge[key] = value

            # Load abbreviation_map
            abbr_map = {}
            cursor.execute("SELECT abbr, expansion FROM abbreviations")
            for abbr, expansion in cursor.fetchall():
                abbr_map[abbr] = expansion
            self.knowledge["abbreviation_map"] = abbr_map

            # Setup NLP pipeline
            self.nlp = VietnameseNLP(abbr_map)

            # Load topics
            self.topics_metadata = {}
            cursor.execute("SELECT id, category, title FROM topics")
            for tid, cat, title in cursor.fetchall():
                self.topics_metadata[tid] = {"category": cat, "title": title}

            # Load responses
            self.responses = {}
            cursor.execute("SELECT topic_id, content FROM responses")
            for tid, content in cursor.fetchall():
                if tid not in self.responses:
                    self.responses[tid] = []
                self.responses[tid].append(content)

            # Load deep explanations
            self.deep_explanations = {}
            cursor.execute("SELECT topic_id, content FROM deep_explanations")
            for tid, content in cursor.fetchall():
                self.deep_explanations[tid] = content

            # Load execution steps
            self.execution_steps = {}
            cursor.execute("SELECT topic_id, content FROM execution_steps")
            for tid, content in cursor.fetchall():
                self.execution_steps[tid] = content

            # Load step explanations
            self.step_explanations = {}
            cursor.execute("SELECT topic_id, step_num, content FROM step_explanations")
            for tid, step_num, content in cursor.fetchall():
                if tid not in self.step_explanations:
                    self.step_explanations[tid] = {}
                self.step_explanations[tid][int(step_num)] = content

            # Train Naive Bayes Classifier on SQLite training samples
            self.classifier = NaiveBayesClassifier()
            cursor.execute("SELECT topic_id, phrase FROM training_samples")
            training_data = []
            for topic_id, phrase in cursor.fetchall():
                tokens = self.nlp.process(phrase)
                training_data.append({"label": topic_id, "tokens": tokens})
            
            if training_data:
                self.classifier.train(training_data)

            conn.close()
            self._db_path = db_path
            print("[Engine] Initial metadata loaded and Naive Bayes trained from SQLite.")
            return True
        except Exception as e:
            print(f"[ERROR] Failed to load knowledge from database: {e}")
            return False

    def build_index(self):
        """Xây dựng TF-IDF index trên toàn bộ các chunks trong database."""
        import sqlite3
        if not os.path.exists(self._db_path):
            return False

        try:
            conn = sqlite3.connect(self._db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT id, doc_name, chunk_content, section_ref FROM vector_chunks")
            rows = cursor.fetchall()
            conn.close()

            self.db_chunks = []
            corpus_texts = []
            
            for cid, doc_name, chunk_content, section_ref in rows:
                self.db_chunks.append({
                    "id": cid,
                    "doc_name": doc_name,
                    "chunk_content": chunk_content,
                    "section_ref": section_ref
                })
                # Chuẩn hóa để đưa vào không gian vector (kết hợp cả có dấu và không dấu)
                norm_text = self.nlp.process_to_text(chunk_content)
                norm_text_no_diac = self.nlp.remove_diacritics(norm_text)
                combined_text = norm_text + " " + norm_text_no_diac
                corpus_texts.append(combined_text)

            if not corpus_texts:
                # Tránh lỗi nếu database trống hoàn toàn
                corpus_texts = ["quy trình kho hàng"]
                self.db_chunks = [{
                    "id": 0,
                    "doc_name": "he_thong",
                    "chunk_content": "Chưa có quy trình nào trong cơ sở dữ liệu.",
                    "section_ref": "Mục 0"
                }]

            self.tfidf_vectorizer = TfidfVectorizer(
                analyzer='word',
                token_pattern=r'\b\w+\b',
                min_df=1,
                max_df=0.95,
                ngram_range=(1, 2)
            )
            self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(corpus_texts)
            self.trained = True
            print(f"[RAG Engine] Index built with {len(corpus_texts)} chunks successfully.")
            return True
        except Exception as e:
            print(f"[RAG Engine] Error building index: {e}")
            return False

    def search(self, query, top_k=2):
        if not self.trained or not self.db_chunks:
            return []

        processed_query = self.nlp.process_to_text(query)
        if not processed_query.strip():
            return []

        try:
            processed_query_no_diac = self.nlp.remove_diacritics(processed_query)
            combined_query = processed_query + " " + processed_query_no_diac
            query_vec = self.tfidf_vectorizer.transform([combined_query])
            cos_sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

            results = []
            for idx, sim in enumerate(cos_sims):
                chunk = self.db_chunks[idx]
                results.append({
                    "id": chunk["id"],
                    "doc_name": chunk["doc_name"],
                    "chunk_content": chunk["chunk_content"],
                    "section_ref": chunk["section_ref"],
                    "score": float(sim)
                })

            # Sắp xếp theo điểm cosine similarity giảm dần
            results = sorted(results, key=lambda x: x["score"], reverse=True)
            return results[:top_k]
        except Exception as e:
            print(f"[RAG Engine] Search error: {e}")
            return []

    def get_response(self, query, detail_level='detailed', last_topic_id=None):
        """Lấy câu trả lời tốt nhất theo cơ chế Hybrid: Intent Classification + Contextual + RAG."""
        if self.style_analyzer:
            self.style_analyzer.analyze(query)

        query_lower = query.lower().strip()
        query_tokens = self.nlp.process(query)

        # Sync with global session context
        global SESSION_CONTEXT
        req_last_topic_id = last_topic_id
        if req_last_topic_id:
            if SESSION_CONTEXT.get("last_topic_id") != req_last_topic_id:
                SESSION_CONTEXT["last_topic_id"] = req_last_topic_id
                SESSION_CONTEXT["last_step"] = 0  # Reset step counter
        else:
            req_last_topic_id = SESSION_CONTEXT.get("last_topic_id")

        # 1. Phân tích ngữ cảnh (Contextual Follow-up) dựa trên req_last_topic_id
        # Chỉ chạy khi chủ đề trước đó thuộc loại quy trình (procedure) để tránh bị chitchat hoặc các phần khác làm gián đoạn
        if req_last_topic_id and req_last_topic_id in self.topics_metadata and self.topics_metadata[req_last_topic_id].get("category") == "procedure":
            # A. Câu hỏi bước tiếp theo: "tiếp đi", "bước tiếp theo", "chỉ tui tiếp đi"
            if is_next_step_query(query):
                current_step = SESSION_CONTEXT.get("last_step", 0)
                next_step = current_step + 1
                
                step_exp = self.step_explanations.get(req_last_topic_id, {}).get(next_step)
                if step_exp:
                    response_body = step_exp
                    if self.style_analyzer:
                        response_body = self.style_analyzer.adapt_response(response_body)
                        
                    # Cập nhật session context
                    SESSION_CONTEXT["last_step"] = next_step
                    SESSION_CONTEXT["last_topic_id"] = req_last_topic_id
                    
                    return {
                        "response": response_body,
                        "topic_id": req_last_topic_id,
                        "topic_title": f"Bước {next_step}: {self.topics_metadata[req_last_topic_id]['title']}",
                        "confidence": 1.0,
                        "method": f"contextual-followup: next-step {next_step}",
                        "suggestions": self._get_related_suggestions(req_last_topic_id),
                        "system_prompt": f"Temperature = 0\n[SYSTEM] Hướng dẫn tiếp nối bước {next_step} cho chủ đề: {req_last_topic_id}",
                        "retrieved_chunks": []
                    }
                else:
                    # Đã hết các bước
                    response_body = "Đó là toàn bộ các bước trong quy trình này rồi cậu nhé. Cậu có thắc mắc gì khác về quy trình kho không?"
                    return {
                        "response": response_body,
                        "topic_id": req_last_topic_id,
                        "topic_title": self.topics_metadata[req_last_topic_id]['title'],
                        "confidence": 1.0,
                        "method": "contextual-followup: steps-completed",
                        "suggestions": self._get_related_suggestions(None),
                        "system_prompt": "Temperature = 0\n[SYSTEM] Thông báo hoàn thành quy trình.",
                        "retrieved_chunks": []
                    }

            # B. Câu hỏi bước cụ thể: "bước 1", "bước 2"
            step_num = detect_step_query(query)
            if step_num is not None:
                step_exp = self.step_explanations.get(req_last_topic_id, {}).get(step_num)
                if step_exp:
                    response_body = step_exp
                    if self.style_analyzer:
                        response_body = self.style_analyzer.adapt_response(response_body)
                        
                    # Cập nhật session context
                    SESSION_CONTEXT["last_step"] = step_num
                    SESSION_CONTEXT["last_topic_id"] = req_last_topic_id
                    
                    return {
                        "response": response_body,
                        "topic_id": req_last_topic_id,
                        "topic_title": f"Bước {step_num}: {self.topics_metadata[req_last_topic_id]['title']}",
                        "confidence": 1.0,
                        "method": f"contextual-followup: step {step_num}",
                        "suggestions": self._get_related_suggestions(req_last_topic_id),
                        "system_prompt": f"Temperature = 0\n[SYSTEM] Hướng dẫn chi tiết bước {step_num} cho chủ đề: {req_last_topic_id}",
                        "retrieved_chunks": []
                    }

            # C. Câu hỏi "tại sao": "tại sao?", "sao thế?"
            if is_why_query(query):
                explanation = self.deep_explanations.get(req_last_topic_id)
                if explanation:
                    topic_title = self.topics_metadata.get(req_last_topic_id, {}).get("title", "Quy trình")
                    response_body = explanation.replace("{topic_title}", topic_title)
                    if self.style_analyzer:
                        response_body = self.style_analyzer.adapt_response(response_body)
                    return {
                        "response": response_body,
                        "topic_id": req_last_topic_id,
                        "topic_title": f"Giải thích: {self.topics_metadata[req_last_topic_id]['title']}",
                        "confidence": 1.0,
                        "method": "contextual-followup: why",
                        "suggestions": self._get_related_suggestions(req_last_topic_id),
                        "system_prompt": f"Temperature = 0\n[SYSTEM] Trả lời câu hỏi tại sao cho chủ đề: {req_last_topic_id}",
                        "retrieved_chunks": []
                    }

            # D. Câu hỏi thực hiện: "làm thế nào?", "bắt đầu thực hiện?"
            if is_execution_query(query):
                guide = self.execution_steps.get(req_last_topic_id)
                if guide:
                    response_body = guide
                    if self.style_analyzer:
                        response_body = self.style_analyzer.adapt_response(response_body)
                    return {
                        "response": response_body,
                        "topic_id": req_last_topic_id,
                        "topic_title": f"Thực hiện: {self.topics_metadata[req_last_topic_id]['title']}",
                        "confidence": 1.0,
                        "method": "contextual-followup: execution",
                        "suggestions": self._get_related_suggestions(req_last_topic_id),
                        "system_prompt": f"Temperature = 0\n[SYSTEM] Hướng dẫn các bước tiến hành cho chủ đề: {req_last_topic_id}",
                        "retrieved_chunks": []
                    }

            # E. Câu hỏi băn khoăn: "chưa hiểu", "giải thích thêm"
            if is_confused_query(query):
                explanation = self.deep_explanations.get(req_last_topic_id)
                if explanation:
                    topic_title = self.topics_metadata.get(req_last_topic_id, {}).get("title", "Quy trình")
                    response_body = explanation.replace("{topic_title}", topic_title)
                    
                    steps_dict = self.step_explanations.get(req_last_topic_id, {})
                    if steps_dict:
                        steps_text = "\n\n".join(steps_dict[s] for s in sorted(steps_dict.keys()))
                        response_body += "\n\n---\n### 📋 Hướng dẫn chi tiết từng bước:\n\n" + steps_text
                    
                    if self.style_analyzer:
                        response_body = self.style_analyzer.adapt_response(response_body)
                    return {
                        "response": response_body,
                        "topic_id": req_last_topic_id,
                        "topic_title": f"Giải thích rõ: {self.topics_metadata[req_last_topic_id]['title']}",
                        "confidence": 1.0,
                        "method": "contextual-followup: confused",
                        "suggestions": self._get_related_suggestions(req_last_topic_id),
                        "system_prompt": f"Temperature = 0\n[SYSTEM] Trả lời giải thích chi tiết cho chủ đề: {req_last_topic_id}",
                        "retrieved_chunks": []
                    }

        # 2. Dự đoán intent qua Naive Bayes Classifier
        intent_pred = None
        if self.classifier and self.classifier.trained:
            intent_pred = self.classifier.predict(query_tokens)

        # 3. Xử lý các câu chào hỏi/cảm ơn/tạm biệt từ chitchat intent
        if intent_pred and intent_pred["confidence"] >= 0.25:
            label = intent_pred["label"]
            if label in ["greeting", "thanks", "goodbye", "bot-capabilities"]:
                responses_list = self.responses.get(label, [])
                if responses_list:
                    response_body = random.choice(responses_list)
                else:
                    if label == "greeting":
                        bot_name = self.knowledge.get("bot_name", "Tùng")
                        response_body = self.knowledge.get("initial_greeting", f"Xin chào! Tớ là {bot_name}, trợ lý cẩm nang kho hàng. Tớ có thể giúp gì cho cậu hôm nay?")
                    else:
                        response_body = "Cảm ơn cậu nha! Tớ có thể giúp gì thêm không?"
                
                if self.style_analyzer:
                    response_body = self.style_analyzer.adapt_response(response_body)

                return {
                    "response": response_body,
                    "topic_id": None if label == "greeting" else label,
                    "topic_title": self.topics_metadata.get(label, {}).get("title", "Trò chuyện"),
                    "confidence": intent_pred["confidence"],
                    "method": f"intent-classification: {label} (conf={intent_pred['confidence']:.3f})",
                    "suggestions": self._get_related_suggestions(None),
                    "system_prompt": f"Temperature = 0\n[SYSTEM] Phản hồi chitchat: {label}",
                    "retrieved_chunks": []
                }

        # 4. Ưu tiên khớp chủ đề bằng Naive Bayes phân loại ý định độ tự tin cực cao (>= 0.45)
        # Hoặc độ tự tin trung bình (>= 0.25) khi người dùng hỏi các câu hỏi thực hiện/tổng quan
        # Để đảm bảo bắt đầu đúng Bước 1 và xem được Overview hoàn chỉnh
        if intent_pred and (intent_pred["confidence"] >= 0.45 or (intent_pred["confidence"] >= 0.25 and (is_execution_query(query) or "quy trình" in query_lower or "cách" in query_lower))):
            label = intent_pred["label"]
            if label in self.responses:
                response_body = self.responses[label][0]
                if self.style_analyzer:
                    response_body = self.style_analyzer.adapt_response(response_body)

                # Khởi tạo context
                SESSION_CONTEXT["last_topic_id"] = label
                SESSION_CONTEXT["last_step"] = 1  # Bắt đầu tại bước 1

                return {
                    "response": response_body,
                    "topic_id": label,
                    "topic_title": self.topics_metadata.get(label, {}).get("title", "Quy trình"),
                    "confidence": intent_pred["confidence"],
                    "method": f"intent-classification: {label} (conf={intent_pred['confidence']:.3f})",
                    "suggestions": self._get_related_suggestions(label),
                    "system_prompt": f"Temperature = 0\n[SYSTEM] Trả lời tổng quan quy trình: {label}",
                    "retrieved_chunks": []
                }

        # 5. So khớp tài liệu ngữ cảnh RAG
        search_results = self.search(query, top_k=2)
        top_score = search_results[0]["score"] if search_results else 0.0

        if search_results and top_score >= 0.08:
            top_chunk = search_results[0]
            matched_chunks = [top_chunk]
            if len(search_results) > 1 and search_results[1]["score"] >= 0.08:
                matched_chunks.append(search_results[1])

            # Ánh xạ tên tài liệu sang topic_id
            doc_to_topic_map = {
                "Quy-trinh-nhap-kho.pdf": "receiving-goods",
                "Quy-trinh-xuat-kho.pdf": "shipping-goods",
                "Quy-trinh-xu-ly-hang-rach-hong.pdf": "damaged-goods",
                "Huong-dan-dong-goi-hang-de-vo.pdf": "fragile-packaging",
                "Huong-dan-van-hanh-may-in-ma-vach.pdf": "barcode-printer",
                "Quy-tac-an-toan-lao-dong.pdf": "safety-rules",
            }
            mapped_topic_id = doc_to_topic_map.get(top_chunk["doc_name"])

            topic_title = f"{top_chunk['doc_name']} ({top_chunk['section_ref']})"
            if mapped_topic_id and mapped_topic_id in self.topics_metadata:
                topic_title = self.topics_metadata[mapped_topic_id]["title"]

            system_prompt = (
                "VAI TRÒ: Tùng - Trợ lý vạn năng hướng dẫn quy trình kho hàng.\n"
                "THAM SỐ: Temperature = 0 (Chỉ trả lời dựa trên tài liệu được cung cấp bên dưới, KHÔNG tự bịa quy trình).\n"
                "TÀI LIỆU NỘI BỘ TRÍCH XUẤT ĐƯỢC:\n"
            )
            for chunk in matched_chunks:
                system_prompt += f"---\n[Nguồn: {chunk['doc_name']} - {chunk['section_ref']}]\nNội dung: {chunk['chunk_content']}\n---\n"

            response_body = self._generate_simulated_response(query, matched_chunks)

            # Thay thế {topic_title} nếu còn tồn tại trong tài liệu cũ
            final_topic_id = mapped_topic_id or top_chunk["id"]
            actual_topic_title = self.topics_metadata.get(final_topic_id, {}).get("title", "Quy trình")
            response_body = response_body.replace("{topic_title}", actual_topic_title)

            if self.style_analyzer:
                response_body = self.style_analyzer.adapt_response(response_body, top_chunk["doc_name"])

            # Cập nhật context
            final_topic_id = mapped_topic_id or top_chunk["id"]
            SESSION_CONTEXT["last_topic_id"] = final_topic_id
            # Trích xuất xem chunk này có nói về bước cụ thể nào không
            step_match = re.search(r'(?:bước|buoc|mục|muc)\s*(\d+)', query.lower() + " " + top_chunk["section_ref"].lower())
            SESSION_CONTEXT["last_step"] = int(step_match.group(1)) if step_match else 1

            return {
                "response": response_body,
                "topic_id": final_topic_id,
                "topic_title": topic_title,
                "confidence": top_score,
                "method": f"rag-retrieval: score={top_score:.3f}",
                "suggestions": self._get_related_suggestions(final_topic_id),
                "system_prompt": system_prompt,
                "retrieved_chunks": [{
                    "doc_name": c["doc_name"],
                    "section_ref": c["section_ref"],
                    "chunk_content": c["chunk_content"],
                    "score": c["score"]
                } for c in matched_chunks]
            }

        # 6. Fallback về phân loại ý định độ tự tin trung bình (>= 0.30)
        if intent_pred and intent_pred["confidence"] >= 0.30:
            label = intent_pred["label"]
            if label in self.responses:
                response_body = self.responses[label][0]
                if self.style_analyzer:
                    response_body = self.style_analyzer.adapt_response(response_body)

                SESSION_CONTEXT["last_topic_id"] = label
                SESSION_CONTEXT["last_step"] = 1

                return {
                    "response": response_body,
                    "topic_id": label,
                    "topic_title": self.topics_metadata.get(label, {}).get("title", "Quy trình"),
                    "confidence": intent_pred["confidence"],
                    "method": f"intent-classification-fallback: {label} (conf={intent_pred['confidence']:.3f})",
                    "suggestions": self._get_related_suggestions(label),
                    "system_prompt": f"Temperature = 0\n[SYSTEM] Phục hồi từ Intent: {label}",
                    "retrieved_chunks": []
                }

        # 7. Ngăn ảo giác (Hallucination Control / Fallback)
        system_prompt = (
            "VAI TRÒ: Tùng - Trợ lý vạn năng hướng dẫn quy trình kho hàng.\n"
            "THAM SỐ: Temperature = 0 (Chỉ trả lời dựa trên tài liệu, tránh ảo giác).\n"
            "TRẠNG THÁI: Không tìm thấy tài liệu nào khớp ngữ nghĩa (Cosine Similarity < 0.08).\n"
        )
        response_body = (
            "Tớ rất tiếc nhưng tài liệu nội bộ hiện tại không quy định về nội dung câu hỏi này của cậu.\n\n"
            "Để đảm bảo an toàn vận hành kho và tránh cung cấp thông tin sai lệch (ảo giác), tớ không tự sáng tác quy trình. "
            "Cậu vui lòng liên hệ quản lý kho hoặc kiểm tra lại file tài liệu hướng dẫn xem sao nhé! 😊"
        )
        if self.style_analyzer:
            response_body = self.style_analyzer.adapt_response(response_body)

        return {
            "response": response_body,
            "topic_id": None,
            "topic_title": "Không tìm thấy tài liệu phù hợp",
            "confidence": top_score,
            "method": "hallucination-prevention-fallback",
            "suggestions": self._get_related_suggestions(None),
            "system_prompt": system_prompt,
            "retrieved_chunks": []
        }

    def _generate_simulated_response(self, query, matched_chunks):
        """Tạo sinh phản hồi có cấu trúc và trích dẫn nguồn dựa trên các chunks tài liệu."""
        formatted_chunks = []
        for chunk in matched_chunks:
            doc_name = chunk["doc_name"]
            section_ref = chunk["section_ref"]
            content = chunk["chunk_content"]
            
            # Dọn dẹp tiêu đề nhưng vẫn giữ nguyên cấu trúc đoạn văn của tài liệu gốc
            lines = content.split('\n')
            cleaned_lines = []
            for line in lines:
                line_str = line.strip()
                if line_str.startswith("#"):
                    h_text = line_str.lstrip('#').strip()
                    cleaned_lines.append(f"### {h_text}")
                else:
                    cleaned_lines.append(line.rstrip())
            
            cleaned_content = "\n".join(cleaned_lines)
            
            # Nếu có nhiều mảnh tài liệu, hiển thị rõ ràng từng phân đoạn trích dẫn
            if len(matched_chunks) > 1:
                chunk_header = f"#### 📍 Trích đoạn từ *{doc_name}* ({section_ref}):"
                formatted_chunks.append(f"{chunk_header}\n\n{cleaned_content}")
            else:
                formatted_chunks.append(cleaned_content)
                
        body = "\n\n---\n\n".join(formatted_chunks)
        
        # Tạo danh sách nguồn
        citations = []
        for chunk in matched_chunks:
            citation_str = f"**{chunk['doc_name']}** ({chunk['section_ref']})"
            if citation_str not in citations:
                citations.append(citation_str)
                
        citation_line = f"*(Nguồn trích dẫn: {', '.join(citations)})*"
        
        response = (
            f"Chào cậu! Dựa trên tài liệu quy định nội bộ kho hàng, Tùng xin hướng dẫn như sau:\n\n"
            f"{body}\n\n"
            f"{citation_line}"
        )
        return response

    def _get_related_suggestions(self, current_chunk_id):
        """Lấy ngẫu nhiên các file cẩm nang để gợi ý cho nhân viên kho."""
        import sqlite3
        suggestions = []
        try:
            conn = sqlite3.connect(self._db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT doc_name FROM uploaded_documents")
            rows = cursor.fetchall()
            conn.close()
            for row in rows:
                doc_name = row[0]
                # Làm sạch tên file để đưa lên gợi ý
                clean_name = doc_name.replace(".pdf", "").replace(".txt", "").replace("-", " ")
                suggestions.append(f"Quy trình {clean_name}")
        except Exception:
            pass
            
        if not suggestions:
            suggestions = ["Quy trình nhập kho", "Quy trình xuất kho", "Quy tắc an toàn"]
            
        random.shuffle(suggestions)
        return suggestions[:4]

# ============================================================
# KHỞI TẠO ENGINE
# ============================================================
engine = KnowledgeEngine()

import atexit

def save_profile_at_exit():
    if engine and engine.style_analyzer:
        print("\n[Engine] Saving user style profile to database before exit...")
        engine.style_analyzer._save_profile()

atexit.register(save_profile_at_exit)


def initialize_engine():
    """Load knowledge base và build index."""
    global engine
    if not os.path.exists(KNOWLEDGE_FILE):
        print(f"[WARNING] Database file not found at: {KNOWLEDGE_FILE}")
        print("[INFO] Attempting to automatically initialize the database...")
        try:
            from .init_db import init_db
        except ImportError:
            import init_db
            from init_db import init_db
        init_db(force=True)

    if not engine.load_knowledge(KNOWLEDGE_FILE):
        return False
        
    engine.build_index()
    return True


# ============================================================
# FLASK API ROUTES
# ============================================================

@app.route('/api/chat', methods=['POST'])
def chat():
    """API chính: nhận tin nhắn, trả câu trả lời RAG."""
    data = request.get_json() or {}
    if 'message' not in data:
        return jsonify({"error": "Missing 'message' field"}), 400

    user_message = data['message'].strip()
    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    detail_level = data.get('detail_level', 'detailed')
    last_topic_id = data.get('last_topic_id')

    global LAST_USER_MESSAGE
    result = engine.get_response(user_message, detail_level=detail_level, last_topic_id=last_topic_id)
    LAST_USER_MESSAGE = user_message

    return jsonify({
        "success": True,
        "response": result["response"],
        "topic_id": result.get("topic_id"),
        "topic_title": result.get("topic_title"),
        "confidence": result.get("confidence", 0),
        "debug_method": result.get("method", ""),
        "suggestions": result.get("suggestions", []),
        "system_prompt": result.get("system_prompt", ""),
        "retrieved_chunks": result.get("retrieved_chunks", [])
    })


@app.route('/api/upload_doc', methods=['POST'])
def upload_doc():
    """Tải lên tài liệu, băm nhỏ và vector hóa vào database SQLite."""
    if 'file' not in request.files:
        return jsonify({"error": "Không tìm thấy file gửi lên"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Tên file trống"}), 400
        
    doc_name = file.filename
    
    # Tạo thư mục lưu file tạm trong backend
    temp_dir = os.path.join(STATIC_DIR, "backend", "uploads")
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, doc_name)
    file.save(file_path)
    
    try:
        # Bước 1: Trích xuất nội dung chữ
        text = extract_text_from_file(file_path)
        char_count = len(text)
        if char_count == 0:
            return jsonify({"error": "Không thể trích xuất chữ hoặc file trống"}), 400
            
        # Bước 2: Băm nhỏ văn bản (Chunking)
        chunks = chunk_text(text, chunk_size=600, overlap=150)
        
        # Bước 3 & 4: Vector hóa (Simulated) và lưu vào SQLite DB
        import sqlite3
        import datetime
        now_str = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
        
        conn = sqlite3.connect(KNOWLEDGE_FILE)
        cursor = conn.cursor()
        
        # Thêm/cập nhật thông tin file vào danh sách
        cursor.execute("INSERT OR REPLACE INTO uploaded_documents (doc_name, upload_date, char_count, status) VALUES (?, ?, ?, ?)",
                       (doc_name, now_str, char_count, "Đã số hóa"))
                       
        # Xóa các chunk cũ nếu tải đè file cùng tên
        cursor.execute("DELETE FROM vector_chunks WHERE doc_name = ?", (doc_name,))
        
        # Lưu các chunk mới
        for idx, chunk_content in enumerate(chunks):
            section_ref = f"Mục {idx+1}"
            cursor.execute("INSERT INTO vector_chunks (doc_name, chunk_content, section_ref, embedding) VALUES (?, ?, ?, ?)",
                           (doc_name, chunk_content, section_ref, ""))
                           
        conn.commit()
        conn.close()
        
        # Cập nhật lại vector index của công cụ tìm kiếm
        engine.build_index()
        
        return jsonify({
            "success": True,
            "doc_name": doc_name,
            "char_count": char_count,
            "chunks_count": len(chunks)
        })
        
    except Exception as e:
        print(f"[Upload Error] {e}")
        return jsonify({"error": f"Lỗi xử lý file cẩm nang: {str(e)}"}), 500


@app.route('/api/list_docs', methods=['GET'])
def list_docs():
    """Lấy danh sách các tài liệu đã được số hóa lưu trong database."""
    import sqlite3
    try:
        conn = sqlite3.connect(KNOWLEDGE_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT doc_name, upload_date, char_count, status FROM uploaded_documents")
        rows = cursor.fetchall()
        conn.close()
        
        docs = []
        for doc_name, upload_date, char_count, status in rows:
            docs.append({
                "doc_name": doc_name,
                "upload_date": upload_date,
                "char_count": char_count,
                "status": status
            })
        return jsonify({"success": True, "documents": docs})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/delete_doc', methods=['POST'])
def delete_doc():
    """Xóa một tài liệu và các chunk tương ứng khỏi cơ sở dữ liệu."""
    data = request.get_json() or {}
    doc_name = data.get('doc_name')
    if not doc_name:
        return jsonify({"error": "Thiếu tên tài liệu cần xóa"}), 400
        
    import sqlite3
    try:
        conn = sqlite3.connect(KNOWLEDGE_FILE)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM uploaded_documents WHERE doc_name = ?", (doc_name,))
        cursor.execute("DELETE FROM vector_chunks WHERE doc_name = ?", (doc_name,))
        conn.commit()
        conn.close()
        
        # Xây dựng lại index sau khi xóa
        engine.build_index()
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/status', methods=['GET'])
def status():
    """Kiểm tra trạng thái hệ thống RAG."""
    return jsonify({
        "trained": engine.trained,
        "chunks_count": len(engine.db_chunks),
        "bot_name": engine.knowledge.get("bot_name", "Tùng") if engine.knowledge else "Tùng"
    })


@app.route('/api/init', methods=['GET'])
def init_data():
    """Trả về thông tin khởi tạo cho giao diện chat."""
    if not engine.knowledge:
        return jsonify({"error": "Engine not initialized"}), 500

    return jsonify({
        "bot_name": engine.knowledge.get("bot_name", "Tùng"),
        "greeting": engine.knowledge.get("initial_greeting", "Xin chào!"),
        "suggestions": engine.knowledge.get("initial_suggestions", []),
    })


@app.route('/api/retrain', methods=['POST'])
def retrain():
    """Tải lại tri thức và xây dựng lại vector index."""
    success = initialize_engine()
    return jsonify({"success": success})


@app.route('/api/uploads/<path:filename>')
def serve_upload(filename):
    """Phục vụ các file tài liệu đã tải lên để xem trực tiếp (PDF, TXT)."""
    uploads_dir = os.path.join(BASE_DIR, "uploads")
    return send_from_directory(uploads_dir, filename)


# ============================================================
# STATIC FILE ROUTES
# ============================================================

@app.route('/')
@app.route('/index.html')
def serve_index():
    return send_from_directory(STATIC_DIR, 'index.html')


@app.route('/style.css')
def serve_css():
    return send_from_directory(STATIC_DIR, 'style.css')


@app.route('/app.js')
def serve_js():
    return send_from_directory(STATIC_DIR, 'app.js')


# ============================================================
# MAIN
# ============================================================
if __name__ == '__main__':
    print("=" * 60)
    print("  CHATBOT CẨM NANG NHÂN VIÊN KHO - RAG LLM")
    print("  Server 100% Local - Không dùng API bên ngoài")
    print("=" * 60)

    if initialize_engine():
        print("\n[OK] RAG Engine initialized successfully!")
        print(f"[OK] Open browser: http://localhost:5000\n")
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        print("\n[FAIL] Cannot initialize RAG Engine.")
        sys.exit(1)
