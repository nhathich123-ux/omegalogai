import http.server
import json
import urllib.request
import urllib.error
import re
import os
import random
import datetime
import threading
import time

# Try to load local seed_data from data_nhan for richer responses
SEED_DATA = None
try:
    import sys
    sys.path.append(os.path.join(os.path.dirname(__file__), 'data_nhan', 'backend'))
    import seed_data
    SEED_DATA = seed_data
    print("=== SUCCESS: LOADED RICH SEED DATA FROM DATA_NHAN ===")
except Exception as e:
    print("=== WARNING: COULD NOT LOAD RICH SEED DATA ===", e)


USER_PROFILES = {}

def load_user_profiles():
    global USER_PROFILES
    try:
        if os.path.exists('db.json'):
            with open('db.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
                USER_PROFILES = data.get("userProfiles", {})
    except Exception as e:
        print("Error loading user profiles:", e)

def save_user_profiles_to_db():
    global USER_PROFILES
    try:
        db_path = 'db.json'
        current = {}
        if os.path.exists(db_path):
            with open(db_path, 'r', encoding='utf-8') as f:
                try:
                    current = json.load(f)
                except Exception:
                    pass
        current["userProfiles"] = USER_PROFILES
        with open(db_path, 'w', encoding='utf-8') as f:
            json.dump(current, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print("Error saving user profiles:", e)

# Load profiles initially
load_user_profiles()

def update_user_profile(user_email, user_name, message):
    global USER_PROFILES
    if not user_email:
        user_email = "anonymous@omega.io"
        
    user_email = user_email.lower().strip()
    
    if user_email not in USER_PROFILES:
        USER_PROFILES[user_email] = {
            "name": user_name or "ní",
            "bot_ref": "tớ",
            "user_ref": "cậu",
            "greeting_style": "friendly"
        }
        
    profile = USER_PROFILES[user_email]
    
    if user_name and user_name != "Admin Omega" and profile.get("name") in ["ní", "Admin Omega", "Admin"]:
        profile["name"] = user_name
        
    message_clean = clean_text(message)
    message_no_diac = remove_diacritics(message_clean)
    message_telex = clean_telex_typos(message_no_diac)
    words = message_no_diac.split()
    words_telex = message_telex.split()
    msg_words = set(words + words_telex)
    
    intro_found = False
    
    for phrase in ["tên là", "tên tui là", "tên tớ là", "tên mình là", "tên em là", "gọi là", "gọi tớ là", "gọi tui là", "gọi mình là", "gọi em là", "ten la", "ten tui la", "ten to la", "ten minh la", "ten em la", "goi la", "goi to la", "goi tui la", "goi minh la", "goi em la"]:
        phrase_clean = remove_diacritics(phrase)
        if phrase_clean in message_no_diac:
            idx = message_no_diac.find(phrase_clean) + len(phrase_clean)
            words_orig = message.split()
            no_diac_words = message_no_diac.split()
            try:
                phrase_words = phrase_clean.split()
                start_idx = -1
                for i in range(len(no_diac_words) - len(phrase_words) + 1):
                    if no_diac_words[i:i+len(phrase_words)] == phrase_words:
                        start_idx = i
                        break
                if start_idx != -1:
                    target_idx = start_idx + len(phrase_words)
                    if target_idx < len(words_orig):
                        name_part = words_orig[target_idx]
                        name_part = re.sub(r'[^\w\s]', '', name_part).strip()
                        if len(name_part) >= 2 and name_part.lower() not in ["ai", "gi", "gì", "nào", "nao", "nhé", "nha", "nhe", "nhao"]:
                            profile["name"] = name_part.title()
                            intro_found = True
                            break
            except Exception:
                pass
                
    if not intro_found:
        for pronoun in ["tớ là", "tớ tên là", "tui là", "tui tên là", "mình là", "mình tên là", "em là", "em tên là", "anh là", "anh tên là", "to la", "to ten la", "tui la", "tui ten la", "minh la", "minh ten la", "em la", "em ten la", "anh la", "anh ten la"]:
            pronoun_clean = remove_diacritics(pronoun)
            if pronoun_clean in message_no_diac:
                phrase_words = pronoun_clean.split()
                no_diac_words = message_no_diac.split()
                words_orig = message.split()
                try:
                    start_idx = -1
                    for i in range(len(no_diac_words) - len(phrase_words) + 1):
                        if no_diac_words[i:i+len(phrase_words)] == phrase_words:
                            start_idx = i
                            break
                    if start_idx != -1:
                        target_idx = start_idx + len(phrase_words)
                        if target_idx < len(words_orig):
                            name_part = words_orig[target_idx]
                            name_part = re.sub(r'[^\w\s]', '', name_part).strip()
                            if len(name_part) >= 2 and name_part.lower() not in ["ai", "gi", "gì", "nào", "nao", "nhé", "nha", "nhe"]:
                                profile["name"] = name_part.title()
                                intro_found = True
                                break
                except Exception:
                    pass
                    
    # Detect pronouns to update references and greeting styles
    if "ni" in msg_words or "ní" in message_clean or "yo ni" in message_no_diac or "chao ni" in message_no_diac:
        profile["bot_ref"] = "tui"
        profile["user_ref"] = "ní"
        profile["greeting_style"] = "ni"
    elif any(w in msg_words for w in ["may", "tao", "mai", "mày", "mài"]):
        profile["bot_ref"] = "tao"
        profile["user_ref"] = "mày"
        profile["greeting_style"] = "bro"
    elif any(w in msg_words for w in ["sep", "boss", "chutich", "sếp"]):
        profile["bot_ref"] = "em"
        profile["user_ref"] = "sếp"
        profile["greeting_style"] = "respectful"
    elif "dong chi" in message_no_diac or "đồng chí" in message_clean:
        profile["bot_ref"] = "tôi"
        profile["user_ref"] = "đồng chí"
        profile["greeting_style"] = "military"
    elif any(w in msg_words for w in ["cau", "to", "cậu", "tớ"]):
        profile["bot_ref"] = "tớ"
        profile["user_ref"] = "cậu"
        profile["greeting_style"] = "friendly"
    elif any(w in msg_words for w in ["ban", "tui", "minh", "bạn", "mình"]):
        profile["bot_ref"] = "tui"
        profile["user_ref"] = "bạn"
        profile["greeting_style"] = "casual"
    elif "em" in msg_words and ("anh" in msg_words or "chi" in msg_words):
        profile["bot_ref"] = "em"
        if "anh" in msg_words:
            profile["user_ref"] = "anh"
        else:
            profile["user_ref"] = "chị"
        profile["greeting_style"] = "respectful"
    elif ("anh" in msg_words or "chi" in msg_words) and "em" in msg_words:
        profile["user_ref"] = "em"
        if "anh" in msg_words:
            profile["bot_ref"] = "anh"
        else:
            profile["bot_ref"] = "chị"
        profile["greeting_style"] = "respectful"
        
    save_user_profiles_to_db()
    return profile, intro_found

def generate_intro_acknowledgment(profile):
    name = profile.get("name", "ní")
    user_ref = profile.get("user_ref", "cậu")
    bot_ref = profile.get("bot_ref", "tớ")
    style = profile.get("greeting_style", "friendly")
    
    if style == "ni":
        acknowledgments = [
            f"Chào {name} nha! Ghê chưa, {bot_ref} ghi nhận tên của {user_ref} là {name} rồi nghen. Có gì cần {bot_ref} hỗ trợ ca trực kho bãi hôm nay không nè?",
            f"Yo {name}! Hế lo {name} nha! 👋 {bot_ref} đã lưu tên của {user_ref} vào bộ nhớ rồi. Có câu hỏi gì về WMS hay SOP cứ nhắn {bot_ref} nha!",
            f"Chào {name} thân yêu! Rất vui được đồng hành cùng {name} trong ca trực này. Cần {bot_ref} phụ giúp gì thì cứ nhắn nghen!"
        ]
    elif style == "bro":
        acknowledgments = [
            f"Ok chào {name} nha! Tao nhớ tên mày là {name} rồi. Có việc gì cần tao thông não giùm không?",
            f"Yo {name}! Tao biết tên mày rồi nha. Ca làm hôm nay thế nào, có gì khó khăn cứ hú tao nhé!",
            f"Chào {name}! Tao lưu tên mày rồi. Giờ cần tao tra cứu SOP hay WMS gì không, lẹ đi tao chỉ cho!"
        ]
    elif style == "respectful":
        acknowledgments = [
            f"Dạ chào {user_ref} {name} ạ! em đã ghi nhận và lưu thông tin của {user_ref} vào hệ thống. em có thể giúp gì cho sếp trong ca vận hành hôm nay ạ?",
            f"Dạ chào {user_ref} {name}! Chúc {user_ref} một ngày làm việc đầy năng lượng. em rất vinh hạnh được hỗ trợ sếp {name} ca trực hôm nay ạ.",
            f"Chào {user_ref} {name}! em đã lưu tên của sếp rồi ạ. Có quy trình nào cần kiểm định sếp cứ bảo em nhé."
        ]
    elif style == "military":
        acknowledgments = [
            f"Chào đồng chí {name}! Báo cáo đồng chí {name}, tôi đã cập nhật danh tính của đồng chí vào danh sách trực ban. Xin hãy giao nhiệm vụ!",
            f"Báo cáo đồng chí {name}! Tôi đã ghi nhớ tên của đồng chí. Trực ban SOP kho hàng đã sẵn sàng hỗ trợ đồng chí ca trực hôm nay.",
            f"Chào đồng chí {name}! Tôi đã lưu thông tin đồng chí. Nhiệm vụ hôm nay thế nào, tôi đã sẵn sàng chấp hành lệnh."
        ]
    else:
        acknowledgments = [
            f"Chào {name} nha! Rất vui được gặp lại {name}. Hôm nay ca làm việc thế nào, có gì cần {bot_ref} phụ giúp không?",
            f"Hế lo {name}! Ngày làm việc mới thật hiệu quả nghen. {bot_ref} đã nhớ tên của {user_ref} là {name} rồi nè.",
            f"Chào {name}! Cần {bot_ref} chỉ cách nhặt hàng FIFO, xử lý hàng rách hộp hay in tem mã vạch thì cứ nhắn {bot_ref} nhé."
        ]
    return random.choice(acknowledgments)

def is_querying_name(message):
    message_no_diac = remove_diacritics(clean_text(message))
    
    patterns = [
        r"\bten (tui|toi|tao|em|to|minh|cua tui|cua toi|cua tao|cua em|cua to|cua minh|cua ni|ni) la (gi|chi)\b",
        r"\bnhac lai ten\b",
        r"\bnho ten (tui|toi|tao|em|to|minh|cua tui|cua toi|cua tao|cua em|cua to|cua minh|cua ni|ni)\b",
        r"\bten (tui|toi|tao|em|to|minh|cua tui|cua toi|cua tao|cua em|cua to|cua minh|cua ni|ni) la gi\b",
        r"\bnho ten (tui|toi|tao|em|to|minh)\b",
        r"\bbiet ten (tui|toi|tao|em|to|minh) khong\b",
        r"\bbiet ten (tui|toi|tao|em|to|minh) ko\b",
        r"\bten (tui|toi|tao|em|to|minh) la\b.*\bgi\b",
        r"\bnhac lai ten tui\b",
        r"\bnhac lai ten tao\b",
        r"\bnhac lai ten to\b",
        r"\bnhac lai ten em\b",
        r"\bnhac lai ten minh\b",
        r"\bnho ten\b"
    ]
    
    for pattern in patterns:
        if re.search(pattern, message_no_diac):
            return True
            
    words = message_no_diac.split()
    has_ten = "ten" in words
    has_gi = "gi" in words or "nao" in words or "chi" in words
    has_pronoun = any(w in words for w in ["tui", "toi", "tao", "em", "to", "minh", "ni"])
    
    if has_ten and has_gi and has_pronoun:
        return True
        
    return False

def generate_name_response(profile):
    name = profile.get("name", "ní")
    user_ref = profile.get("user_ref", "cậu")
    bot_ref = profile.get("bot_ref", "tớ")
    style = profile.get("greeting_style", "friendly")
    
    if style == "ni":
        responses = [
            f"Tên của {user_ref} là {name} nè, {bot_ref} làm sao quên được! 😉 Có gì cần {bot_ref} giúp nữa không?",
            f"Ní đùa {bot_ref} hoài, tên của {user_ref} là {name} chứ gì nữa! {bot_ref} ghi nhớ kỹ lắm đó nha.",
            f"Là {name} thân yêu của {bot_ref} chứ ai vào đây nữa nè!"
        ]
    elif style == "bro":
        responses = [
            f"Tên mày là {name} chứ gì nữa, tao quên thế nào được! Có cần tao nhắc lại lần nữa không?",
            f"Mày là {name} chứ ai! Đừng có thử trí nhớ của tao nha mày.",
            f"Tên mày là {name} nè. Hỏi câu gì khó hơn đi!"
        ]
    elif style == "respectful":
        responses = [
            f"Dạ, tên của {user_ref} là sếp {name} ạ. em luôn ghi nhớ thông tin của sếp để hỗ trợ tốt nhất.",
            f"Dạ sếp {name} ạ! em làm sao dám quên tên của sếp được ạ.",
            f"Thưa sếp, tên của sếp trên hệ thống kho OMEGA là {name} ạ."
        ]
    elif style == "military":
        responses = [
            f"Báo cáo đồng chí! Tên của đồng chí là {name}. Tôi đã đối soát và ghi nhớ chính xác.",
            f"Đồng chí là {name}. Báo cáo đồng chí, thông tin quân số đã được cập nhật chính xác.",
            f"Đồng chí {name}! Tôi đã lưu trữ hồ sơ của đồng chí trên hệ thống."
        ]
    else:
        responses = [
            f"Tên của {user_ref} là {name} nè, {bot_ref} nhớ rõ mà! Có việc gì cần {bot_ref} phụ giúp không?",
            f"Là {name} chứ ai nè! {bot_ref} lưu tên của {user_ref} rồi, không quên được đâu.",
            f"Tên {user_ref} là {name} đúng không nè? {bot_ref} nhớ như in luôn á."
        ]
    return random.choice(responses)

def generate_greeting(profile):
    style = profile.get("greeting_style", "friendly")
    user_ref = profile.get("user_ref", "cậu")
    bot_ref = profile.get("bot_ref", "tớ")
    
    if style == "ni":
        greetings = [
            f"Chào {user_ref} nha! Yo {user_ref}, hế lo {user_ref}! 👋 Có gì cần {bot_ref} hỗ trợ ca trực kho bãi hôm nay không nè?",
            f"Yo {user_ref}! Hôm nay có đơn hàng hay quy trình gì cần {bot_ref} check giùm không sếp ơi? Hê lô {user_ref} nha!",
            f"Hế lo {user_ref} thân yêu! Rất vui được đồng hành cùng {user_ref} ca này nghen. {bot_ref} trực chiến ở đây hỗ trợ {user_ref} nè!"
        ]
    elif style == "bro":
        greetings = [
            f"Chào {user_ref} nha! {bot_ref} nghe nè {user_ref}, có việc gì cần {bot_ref} thông não giùm không?",
            f"Hế lo {user_ref}! Ca trực hôm nay sao rồi? Có đơn nào bị nghẽn hay cần tìm SKU cứ hú {bot_ref} nha!",
            f"Yo {user_ref}! Ca này vất vả không mày? Cần {bot_ref} tra cứu SOP hay WMS gì không, lẹ đi {bot_ref} chỉ cho!"
        ]
    elif style == "respectful":
        greetings = [
            f"Chào {user_ref} ạ! {bot_ref} có thể giúp gì cho {user_ref} trong ca vận hành hôm nay ạ?",
            f"Dạ hế lo {user_ref}! Chúc {user_ref} một ngày làm việc đầy năng lượng. {bot_ref} luôn sẵn sàng hỗ trợ {user_ref} tra cứu SOP và WMS ạ.",
            f"Chào {user_ref}! {bot_ref} rất vinh hạnh được hỗ trợ sếp ca này. Có quy trình nào cần kiểm định sếp cứ bảo {bot_ref} nhé."
        ]
    elif style == "military":
        greetings = [
            f"Chào {user_ref}! Báo cáo {user_ref}, tôi đã sẵn sàng trực ban hỗ trợ cẩm nang SOP kho bãi.",
            f"Chào {user_ref}! Ca trực hôm nay nhiệm vụ thế nào? Có quy trình nào cần đối soát cứ lệnh cho tôi.",
            f"Báo cáo {user_ref}! Hệ thống WMS và cẩm nang an toàn đã sẵn sàng. Xin hãy giao nhiệm vụ!"
        ]
    else:
        greetings = [
            f"Chào {user_ref} nha! Rất vui được gặp lại {user_ref}. Hôm nay ca làm việc thế nào, có gì cần {bot_ref} phụ giúp không?",
            f"Hế lo {user_ref}! Ngày làm việc mới thật hiệu quả nghen. Cần tra cứu vị trí kệ hay SOP cứ hỏi {bot_ref} nha.",
            f"Chào {user_ref}! Cần {bot_ref} chỉ cách nhặt hàng FIFO, xử lý hàng rách hộp hay in tem mã vạch thì cứ nhắn {bot_ref} nhé."
        ]
        
    return random.choice(greetings)

def apply_pronouns(text, profile):
    if not profile:
        return text
        
    bot_ref = profile.get("bot_ref", "tớ")
    user_ref = profile.get("user_ref", "cậu")
    
    def repl_bot(m):
        word = m.group(0)
        return bot_ref.capitalize() if word[0].isupper() else bot_ref

    def repl_user(m):
        word = m.group(0)
        return user_ref.capitalize() if word[0].isupper() else user_ref

    text = re.sub(r'\b[tT]ớ\b', repl_bot, text)
    text = re.sub(r'\b[tT]ui\b', repl_bot, text)
    text = re.sub(r'\b[cC]ậu\b', repl_user, text)
    text = re.sub(r'\b[nN]í\b', repl_user, text)
    text = re.sub(r'\b[bB]ạn\b', repl_user, text)
    
    return text

PORT = 8000

# Simulated supplier data template
SUPPLIERS_DB = {
    'OMG-9921': [
        {'name': 'SteelWorks Ltd', 'email': 'orders@steelworks.co.uk', 'lead_time': 5, 'defect_rate': 0.020, 'unit_cost': 1500},
        {'name': 'TechParts Global', 'email': 'sales@techparts.com', 'lead_time': 3, 'defect_rate': 0.008, 'unit_cost': 1650},
        {'name': 'HydraFlow Inc', 'email': 'support@hydraflow.com', 'lead_time': 7, 'defect_rate': 0.045, 'unit_cost': 1350}
    ],
    'AK-DO-M': [
        {'name': 'VinaGarment Group', 'email': 'sales@vinagarment.vn', 'lead_time': 4, 'defect_rate': 0.015, 'unit_cost': 300},
        {'name': 'TechParts Global', 'email': 'sales@techparts.com', 'lead_time': 3, 'defect_rate': 0.008, 'unit_cost': 350},
        {'name': 'General Supplier', 'email': 'procurement@gensupply.com', 'lead_time': 6, 'defect_rate': 0.030, 'unit_cost': 280}
    ],
    'OMG-4452': [
        {'name': 'ElectroSupply Co', 'email': 'orders@electrosupply.io', 'lead_time': 4, 'defect_rate': 0.025, 'unit_cost': 450},
        {'name': 'TechParts Global', 'email': 'sales@techparts.com', 'lead_time': 3, 'defect_rate': 0.008, 'unit_cost': 490},
        {'name': 'HydraFlow Inc', 'email': 'support@hydraflow.com', 'lead_time': 7, 'defect_rate': 0.045, 'unit_cost': 410}
    ],
    'OMG-1209': [
        {'name': 'HydraFlow Inc', 'email': 'support@hydraflow.com', 'lead_time': 7, 'defect_rate': 0.045, 'unit_cost': 120},
        {'name': 'SteelWorks Ltd', 'email': 'orders@steelworks.co.uk', 'lead_time': 6, 'defect_rate': 0.020, 'unit_cost': 135},
        {'name': 'ElectroSupply Co', 'email': 'orders@electrosupply.io', 'lead_time': 5, 'defect_rate': 0.025, 'unit_cost': 130}
    ],
    'OMG-8871': [
        {'name': 'Industrial Fluids Corp', 'email': 'procurement@industrialfluids.com', 'lead_time': 4, 'defect_rate': 0.015, 'unit_cost': 15},
        {'name': 'HydraFlow Inc', 'email': 'support@hydraflow.com', 'lead_time': 7, 'defect_rate': 0.045, 'unit_cost': 13},
        {'name': 'General Supplier', 'email': 'procurement@gensupply.com', 'lead_time': 5, 'defect_rate': 0.030, 'unit_cost': 14}
    ]
}

def get_suppliers_for_sku(sku):
    # Fallback to general list if SKU not found
    if sku in SUPPLIERS_DB:
        return SUPPLIERS_DB[sku]
    return [
        {'name': 'General Supplier', 'email': 'procurement@gensupply.com', 'lead_time': 5, 'defect_rate': 0.030, 'unit_cost': 100},
        {'name': 'TechParts Global', 'email': 'sales@techparts.com', 'lead_time': 3, 'defect_rate': 0.008, 'unit_cost': 120},
        {'name': 'SteelWorks Ltd', 'email': 'orders@steelworks.co.uk', 'lead_time': 6, 'defect_rate': 0.020, 'unit_cost': 110}
    ]

# Helper: Generate mock sales history for time-series cleaning and velocity forecasting
def generate_sales_history(sku, days=365):
    random.seed(42)  # For consistent mock results
    history = []
    base_date = datetime.date.today() - datetime.timedelta(days=days)
    
    # Base sales quantity by SKU category
    base_qty = 15 if sku == 'OMG-9921' else (8 if sku == 'AK-DO-M' else 10)
    
    for i in range(days):
        cur_date = base_date + datetime.timedelta(days=i)
        month = cur_date.month
        season_boost = 1.0
        
        # Apply seasonality boosts
        if sku == 'AK-DO-M' and month in [11, 12, 1, 2]:
            season_boost = 2.2  # winter peak
        elif sku == 'OMG-9921' and month == 11:
            season_boost = 1.8  # 11/11 shopping festival peak
            
        qty = int(random.normalvariate(base_qty * season_boost, base_qty * 0.15))
        qty = max(0, qty)
        
        # Inject occasional bulk wholesale anomalies (about 2% probability)
        if random.random() < 0.02:
            qty += random.randint(80, 180)
            
        history.append({
            "date": cur_date.strftime("%Y-%m-%d"),
            "qty": qty
        })
    return history

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

ABBREVIATION_MAP = {
    'k': 'không', 'ko': 'không', 'kop': 'không', 'kho': 'không', 'hok': 'không', 'khg': 'không',
    'hông': 'không', 'hong': 'không',
    'bik': 'biết', 'bit': 'biết', 'biet': 'biết',
    'dc': 'được', 'dk': 'được', 'đc': 'được', 'đk': 'được',
    'j': 'gì', 'g': 'gì', 'gi': 'gì', 'ji': 'gì',
    'm': 'mình', 'mk': 'mình', 't': 'tớ',
    'ntn': 'như thế nào', 'sao': 'như thế nào',
    'lm': 'làm', 'lam': 'làm',
    'r': 'rồi', 'roi': 'rồi',
    'vs': 'với', 'v': 'vậy',
    'trc': 'trước', 'ns': 'nói',
    'cx': 'cũng', 'cg': 'cũng',
    'oke': 'ok', 'okie': 'ok',
    'ní': 'bạn', 'ni': 'bạn', 'cau': 'bạn', 'cậu': 'bạn',
    'sp': 'sản phẩm',
    'ncc': 'nhà cung cấp',
    # Logistics Terms and Slang
    'atld': 'an toàn lao động',
    'bhld': 'bảo hộ lao động',
    'pccc': 'phòng cháy chữa cháy',
    'wms': 'hệ thống quản lý kho',
    'po': 'đơn mua hàng',
    'pda': 'máy quét pda',
    'fifo': 'nhập trước xuất trước',
    'fefo': 'hết hạn trước xuất trước',
    'hsd': 'hạn sử dụng',
    'qc': 'kiểm định chất lượng',
    'qa': 'kiểm soát chất lượng',
    'outbound': 'xuất kho',
    'inbound': 'nhập kho',
    'sop': 'quy trình chuẩn',
    'stock': 'tồn kho',
    'lot': 'lô hàng',
    'sku': 'mã sản phẩm',
    'pallet': 'kệ chứa hàng',
    'dock': 'bến xếp dỡ',
    'forklift': 'xe nâng',
    'hônggg': 'không',
    'wa': 'quá', 'waa': 'quá', 'waaa': 'quá', 'quaa': 'quá',
    'mêt': 'mệt', 'met': 'mệt', 'oai': 'oải',
    'nhapkho': 'nhập kho',
    'xuatkho': 'xuất kho',
    'antoan': 'an toàn',
    'xenang': 'xe nâng',
    'khohang': 'kho hàng',
    'hanghoa': 'hàng hóa',
    'donggoi': 'đóng gói',
    'kiemke': 'kiểm kê',
    'doisoat': 'đối soát',
    'nhapnhanh': 'nhập nhanh',
    'xuatnhanh': 'xuất nhanh',
    'kholanh': 'kho lạnh',
    'khomat': 'kho mát',
    'khodong': 'kho đông',
    'phieuxuat': 'phiếu xuất',
    'phieunhap': 'phiếu nhập',
    'tk': 'tồn kho',
    'nk': 'nhập kho',
    'xk': 'xuất kho',
}

def remove_diacritics(text):
    return "".join(DIACRITICS_MAP.get(c, c) for c in text)

def clean_text(text):
    import unicodedata
    text = unicodedata.normalize('NFC', text.lower())
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def clean_telex_typos(text):
    text = text.lower()
    text = re.sub(r'aa', 'a', text)
    text = re.sub(r'ee', 'e', text)
    text = re.sub(r'oo', 'o', text)
    text = re.sub(r'uw', 'u', text)
    text = re.sub(r'ow', 'o', text)
    text = re.sub(r'dd', 'd', text)
    text = re.sub(r'\b([a-z]+)[sfrxj]\b', r'\1', text)
    text = re.sub(r'([a-z])\1+', r'\1', text)
    return text

def fuzzy_word_match(word1, word2):
    if not word1 or not word2:
        return False
    w1_clean = clean_telex_typos(word1)
    w2_clean = clean_telex_typos(word2)
    if w1_clean == w2_clean:
        return True
    if abs(len(w1_clean) - len(w2_clean)) > 2:
        return False
    import difflib
    ratio = difflib.SequenceMatcher(None, w1_clean, w2_clean).ratio()
    return ratio >= 0.75

def phrase_similarity(s1, s2):
    s1_clean = clean_telex_typos(remove_diacritics(clean_text(s1)))
    s2_clean = clean_telex_typos(remove_diacritics(clean_text(s2)))
    import difflib
    return difflib.SequenceMatcher(None, s1_clean, s2_clean).ratio()

def normalize_vietnamese_query(query):
    query_cleaned = clean_text(query)
    words = query_cleaned.split()
    expanded_words = []
    for word in words:
        if word in ABBREVIATION_MAP:
            expanded_words.append(ABBREVIATION_MAP[word])
            continue
        word_clean = re.sub(r'([a-z])\1+', r'\1', word)
        if word_clean in ABBREVIATION_MAP:
            expanded_words.append(ABBREVIATION_MAP[word_clean])
            continue
        word_telex = clean_telex_typos(word)
        if word_telex in ABBREVIATION_MAP:
            expanded_words.append(ABBREVIATION_MAP[word_telex])
            continue
        expanded_words.append(word)
    return " ".join(expanded_words)

def query_knowledge_base(query, lang='vi'):
    rules = []
    try:
        with open('sop_knowledge.json', 'r', encoding='utf-8') as f:
            rules = json.load(f)
    except Exception as e:
        print("Error reading sop_knowledge.json:", e)
        pass
    
    if not rules:
        return None, 0

    query_norm = normalize_vietnamese_query(query)
    query_no_diac = remove_diacritics(query_norm)
    query_orig_no_diac = remove_diacritics(clean_text(query))
    
    query_words = query_no_diac.split()
    query_orig_words = query_orig_no_diac.split()
    
    best_rule = None
    best_score = 0
    
    for rule in rules:
        score = 0
        keywords = rule.get('keywords', [])
        
        # 1. So khớp các từ khóa (Keywords)
        for kw in keywords:
            kw_norm = normalize_vietnamese_query(kw)
            kw_no_diac = remove_diacritics(kw_norm)
            
            # Substring match (fuzzy-cleaned)
            kw_clean = clean_telex_typos(kw_no_diac)
            query_clean = clean_telex_typos(query_no_diac)
            query_orig_clean = clean_telex_typos(query_orig_no_diac)
            
            if kw_clean in query_clean or kw_clean in query_orig_clean:
                score += 6
            
            # Khớp cấp độ từ (Fuzzy word overlap)
            kw_words = kw_no_diac.split()
            overlap_count = 0
            for kw_w in kw_words:
                for q_w in query_words + query_orig_words:
                    if fuzzy_word_match(kw_w, q_w):
                        overlap_count += 1
                        break
            score += overlap_count * 3

        # 2. So khớp tiêu đề (Title)
        title_vi = rule.get('title_vi' if lang == 'vi' else 'title_en', '')
        title_no_diac = remove_diacritics(clean_text(title_vi))
        title_words = title_no_diac.split()
        
        title_overlap = 0
        for t_w in title_words:
            for q_w in query_words + query_orig_words:
                if fuzzy_word_match(t_w, q_w):
                    title_overlap += 1
                    break
        score += title_overlap * 4
        
        # 3. Độ tương đồng cả câu (Whole phrase similarity)
        title_sim = phrase_similarity(query, title_vi)
        if title_sim >= 0.7:
            score += int(title_sim * 15)
        
        if score > best_score:
            best_score = score
            best_rule = rule

    if best_rule and best_score >= 2:
        match_pct = min(100, 70 + best_score * 3)
        return best_rule, match_pct
        
    return None, 0

def query_wms_state(query, wms_state, lang='vi'):
    if not wms_state:
        return None
        
    query_no_diac = remove_diacritics(clean_text(query))
    
    # 1. Product check
    is_stock_query = any(w in query_no_diac for w in ['ton kho', 'san pham', 'sku', 'hang hoa', 'con bao nhieu', 'stock', 'product', 'hang trong kho'])
    
    # 2. Purchase order check
    is_po_query = any(w in query_no_diac for w in ['don mua', 'don hang', 'purchase', 'po', 'don mua hang', 'mua hang', 'dat hang'])
    
    # 3. Receipt check
    is_receipt_query = any(w in query_no_diac for w in ['nhap kho', 'receipt', 'inbound', 'phieu nhap', 'nhap hang'])
    
    # 4. Delivery check
    is_delivery_query = any(w in query_no_diac for w in ['xuat kho', 'delivery', 'outbound', 'phieu xuat', 'giao hang', 'don hang xuat'])
    
    # Check for specific SKU codes in the query
    products = wms_state.get('products', [])
    matched_products = []
    for p in products:
        sku = p.get('sku', '').lower()
        name = p.get('name', '').lower()
        name_no_diac = remove_diacritics(name)
        
        if sku in query_no_diac or (len(name_no_diac) > 4 and name_no_diac in query_no_diac):
            matched_products.append(p)
            
    # Check for specific PO IDs
    po_list = wms_state.get('purchaseOrders', [])
    matched_po = []
    for po in po_list:
        po_id = po.get('id', '').lower()
        clean_po_id = re.sub(r'[^a-z0-9]', '', po_id)
        clean_query = re.sub(r'[^a-z0-9]', '', query_no_diac)
        if clean_po_id in clean_query or po_id in query_no_diac:
            matched_po.append(po)

    # Check for specific Receipt IDs
    receipt_list = wms_state.get('receipts', [])
    matched_receipts = []
    for r in receipt_list:
        r_id = r.get('id', '').lower()
        clean_r_id = re.sub(r'[^a-z0-9]', '', r_id)
        clean_query = re.sub(r'[^a-z0-9]', '', query_no_diac)
        if clean_r_id in clean_query or r_id in query_no_diac:
            matched_receipts.append(r)
            
    # Check for specific Delivery IDs
    delivery_list = wms_state.get('deliveries', [])
    matched_deliveries = []
    for d in delivery_list:
        d_id = d.get('id', '').lower()
        clean_d_id = re.sub(r'[^a-z0-9]', '', d_id)
        clean_query = re.sub(r'[^a-z0-9]', '', query_no_diac)
        if clean_d_id in clean_query or d_id in query_no_diac:
            matched_deliveries.append(d)

    # Respond to matched SKU / Product query
    if matched_products:
        res = "📊 [TRUY VẤN TỒN KHO THỜI GIAN THỰC]\n\nTớ tìm thấy thông tin sản phẩm này trong kho:\n"
        for p in matched_products:
            res += f"• **{p.get('name')}** ({p.get('sku')})\n"
            res += f"  - Tồn kho: **{p.get('stock')}** cái (Min: {p.get('minStock')} | Vị trí: {p.get('location')})\n"
            status = "Ổn định"
            if p.get('stock', 0) < p.get('minStock', 0):
                status = "⚠️ Tồn kho thấp!"
            if p.get('stock', 0) == 0:
                status = "❌ Hết hàng cực kỳ khẩn cấp!"
            res += f"  - Trạng thái: {status}\n"
        return res

    # Respond to matched PO ID query
    if matched_po:
        res = "📃 [TRUY VẤN ĐƠN MUA HÀNG PO THỜI GIAN THỰC]\n\nTớ tìm thấy đơn mua hàng tương ứng:\n"
        for po in matched_po:
            status_map = {"draft": "Bản nháp", "confirmed": "Đã xác nhận (Chờ nhập)", "received": "Đã nhận hàng"}
            status_vi = status_map.get(po.get('status'), po.get('status'))
            cost_vnd = po.get('total', 0)
            res += f"• **Đơn mua #{po.get('id')}** - Nhà cung cấp: **{po.get('vendor')}**\n"
            res += f"  - Trạng thái: **{status_vi.upper()}**\n"
            res += f"  - Tổng giá trị: {cost_vnd:,.0f} VND\n"
        return res
        
    # Respond to matched Receipt ID query
    if matched_receipts:
        res = "🚚 [TRUY VẤN PHIẾU NHẬP KHO THỜI GIAN THỰC]\n\nTớ tìm thấy phiếu nhập kho tương ứng:\n"
        for r in matched_receipts:
            status_map = {"waiting": "Chờ xe cập cảng", "ready": "Đang kiểm định QC/Putaway", "done": "Đã nhập kho hoàn tất"}
            status_vi = status_map.get(r.get('status'), r.get('status'))
            res += f"• **Phiếu nhập #{r.get('id')}** - Đối tác: {r.get('partner')}\n"
            res += f"  - Trạng thái: **{status_vi.upper()}**\n"
            res += f"  - Các mặt hàng: " + ", ".join([f"{item.get('name')} ({item.get('qty')} cái)" for item in r.get('items', [])]) + "\n"
        return res
        
    # Respond to matched Delivery ID query
    if matched_deliveries:
        res = "📦 [TRUY VẤN PHIẾU XUẤT KHO THỜI GIAN THỰC]\n\nTớ tìm thấy phiếu xuất kho tương ứng:\n"
        for d in matched_deliveries:
            status_map = {"waiting": "Đang chuẩn bị", "ready": "Sẵn sàng gom/đóng gói", "done": "Đã xuất kho thành công"}
            status_vi = status_map.get(d.get('status'), d.get('status'))
            res += f"• **Phiếu xuất #{d.get('id')}** - Khách hàng: {d.get('partner')}\n"
            res += f"  - Trạng thái: **{status_vi.upper()}**\n"
            res += f"  - Các mặt hàng: " + ", ".join([f"{item.get('name')} ({item.get('qty')} cái)" for item in d.get('items', [])]) + "\n"
        return res

    # General queries about totals
    if is_stock_query:
        total_items = sum(p.get('stock', 0) for p in products)
        low_stock_prods = [p for p in products if p.get('stock', 0) < p.get('minStock', 0)]
        res = f"📊 [BÁO CÁO TỒN KHO TỔNG HỢP THỜI GIAN THỰC]\n\n"
        res += f"• Hiện tại tổng số lượng hàng trong kho là: **{total_items}** cái.\n"
        res += f"• Có **{len(products)}** mặt hàng đăng ký trên hệ thống.\n"
        if low_stock_prods:
            res += f"• Cảnh báo: Có **{len(low_stock_prods)}** mặt hàng đang bị tồn kho thấp:\n"
            for p in low_stock_prods:
                res += f"  - SKU {p.get('sku')} ({p.get('name')}): còn {p.get('stock')}/{p.get('minStock')}\n"
        else:
            res += f"• Tất cả mặt hàng đều ở mức tồn kho an toàn.\n"
        return res
        
    if is_po_query:
        res = "📃 [BÁO CÁO ĐƠN MUA HÀNG TỔNG HỢP]\n\n"
        res += f"• Tổng số đơn mua hàng (PO) trên hệ thống: **{len(po_list)}** đơn.\n"
        drafts = [po for po in po_list if po.get('status') == 'draft']
        confirmed = [po for po in po_list if po.get('status') == 'confirmed']
        if drafts:
            res += f"• Bản nháp (chờ duyệt): **{len(drafts)}** đơn ({', '.join([po.get('id') for po in drafts])}).\n"
        if confirmed:
            res += f"• Đã xác nhận (chờ nhập kho): **{len(confirmed)}** đơn ({', '.join([po.get('id') for po in confirmed])}).\n"
        return res
        
    if is_receipt_query:
        waiting = [r for r in receipt_list if r.get('status') == 'waiting']
        ready = [r for r in receipt_list if r.get('status') == 'ready']
        res = "🚚 [BÁO CÁO PHIẾU NHẬP KHO]\n\n"
        res += f"• Đang chờ nhập kho: **{len(waiting) + len(ready)}** phiếu.\n"
        if waiting:
            res += f"  - Chờ xe cập cảng: {len(waiting)} phiếu ({', '.join([r.get('id') for r in waiting])})\n"
        if ready:
            res += f"  - Đang kiểm định QC/Chờ xếp kệ: {len(ready)} phiếu ({', '.join([r.get('id') for r in ready])})\n"
        return res
        
    if is_delivery_query:
        waiting = [d for d in delivery_list if d.get('status') == 'waiting']
        ready = [d for d in delivery_list if d.get('status') == 'ready']
        res = "📦 [BÁO CÁO PHIẾU XUẤT KHO]\n\n"
        res += f"• Đang chờ xử lý xuất kho: **{len(waiting) + len(ready)}** phiếu.\n"
        if waiting:
            res += f"  - Đang chuẩn bị gom hàng: {len(waiting)} phiếu\n"
        if ready:
            res += f"  - Đã gom, chờ đóng gói/vận chuyển: {len(ready)} phiếu\n"
        return res

    return None

def query_seed_data(query, lang='vi', profile=None):
    if not SEED_DATA:
        return None, 0, ""

    query_norm = normalize_vietnamese_query(query)
    query_no_diac = remove_diacritics(query_norm)
    query_orig_no_diac = remove_diacritics(clean_text(query))
    
    query_words = query_no_diac.split()
    query_orig_words = query_orig_no_diac.split()
    
    best_topic = None
    best_score = 0
    
    is_deep_request = any(kw in query_no_diac for kw in ['sau hon', 'sau', 'chi tiet', 'deep', 'giai thich sau', 'dao sau', 'sau hon nhe'])
    is_guide_request = any(kw in query_no_diac for kw in ['thuc hanh', 'huong dan thuc hanh', 'chay thu', 'guide'])
    is_steps_request = any(kw in query_no_diac for kw in ['cac buoc', 'buoc 1', 'buoc 2', 'buoc 3', 'buoc 4', 'buoc 5', 'co may buoc', 'quy trinh gom', 'tung buoc'])

    step_num_match = re.search(r'buoc\s*(\d+)', query_no_diac)
    requested_step = int(step_num_match.group(1)) if step_num_match else None

    for topic in SEED_DATA.KNOWLEDGE_BASE.get('topics', []):
        score = 0
        topic_id = topic.get('id', '')
        
        # 1. Keywords fuzzy check
        for kw in topic.get('keywords', []):
            kw_norm = normalize_vietnamese_query(kw)
            kw_no_diac = remove_diacritics(kw_norm)
            kw_clean = clean_telex_typos(kw_no_diac)
            query_clean = clean_telex_typos(query_no_diac)
            query_orig_clean = clean_telex_typos(query_orig_no_diac)
            
            if kw_clean in query_clean or kw_clean in query_orig_clean:
                score += 6
            
            kw_words = kw_no_diac.split()
            overlap_count = 0
            for kw_w in kw_words:
                for q_w in query_words + query_orig_words:
                    if fuzzy_word_match(kw_w, q_w):
                        overlap_count += 1
                        break
            score += overlap_count * 3
            
        # 2. Training samples fuzzy check
        for sample in topic.get('training_samples', []):
            sample_norm = normalize_vietnamese_query(sample)
            sample_no_diac = remove_diacritics(sample_norm)
            sample_clean = clean_telex_typos(sample_no_diac)
            query_clean = clean_telex_typos(query_no_diac)
            
            if sample_clean in query_clean or query_clean in sample_clean:
                score += 5
                
            sample_sim = phrase_similarity(query, sample)
            if sample_sim >= 0.75:
                score += int(sample_sim * 18)
            
        # 3. Title check
        title = topic.get('title', '')
        title_no_diac = remove_diacritics(clean_text(title))
        title_clean = clean_telex_typos(title_no_diac)
        query_clean = clean_telex_typos(query_no_diac)
        
        if title_clean in query_clean:
            score += 7
            
        title_sim = phrase_similarity(query, title)
        if title_sim >= 0.7:
            score += int(title_sim * 15)
            
        if score > best_score:
            best_score = score
            best_topic = topic
            
    if best_topic and best_score >= 2:
        topic_id = best_topic['id']
        title = best_topic.get('title', '')
        
        if topic_id == 'greeting' and profile and lang == 'vi':
            response = generate_greeting(profile)
            source = f"OMEGA RAG [Chào hỏi cá nhân hóa - Match: {best_score}%]"
            return response, best_score, source
            
        if is_deep_request and topic_id in SEED_DATA.DEEP_EXPLANATIONS:
            explanation = SEED_DATA.DEEP_EXPLANATIONS[topic_id]
            response = f"🎯 [GIẢI THÍCH SÂU - CHỦ ĐỀ: {title.upper()}]\n\n{explanation}"
            source = f"OMEGA RAG [Đào sâu Kiến thức - Match: {best_score}%]"
            return apply_pronouns(response, profile), best_score, source
            
        if is_guide_request and topic_id in SEED_DATA.EXECUTION_GUIDES:
            guide = SEED_DATA.EXECUTION_GUIDES[topic_id]
            response = f"🛠️ [HƯỚNG DẪN THỰC HÀNH - CHỦ ĐỀ: {title.upper()}]\n\n{guide}"
            source = f"OMEGA RAG [Cẩm nang Vận hành - Match: {best_score}%]"
            return apply_pronouns(response, profile), best_score, source
            
        if (is_steps_request or requested_step) and topic_id in SEED_DATA.STEP_EXPLANATIONS:
            steps_dict = SEED_DATA.STEP_EXPLANATIONS[topic_id]
            if requested_step and requested_step in steps_dict:
                response = f"📌 [BƯỚC {requested_step} - CHỦ ĐỀ: {title.upper()}]\n\n{steps_dict[requested_step]}"
            else:
                steps_text = "\n\n".join([f"🔸 {v}" for k, v in sorted(steps_dict.items())])
                response = f"📋 [CÁC BƯỚC QUY TRÌNH - CHỦ ĐỀ: {title.upper()}]\n\n{steps_text}"
            source = f"OMEGA RAG [Chi tiết Từng bước - Match: {best_score}%]"
            return apply_pronouns(response, profile), best_score, source
            
        responses = best_topic.get('responses', [])
        if responses:
            response = random.choice(responses)
            more_info = []
            if topic_id in SEED_DATA.DEEP_EXPLANATIONS:
                more_info.append("giải thích sâu")
            if topic_id in SEED_DATA.EXECUTION_GUIDES:
                more_info.append("hướng dẫn thực hành")
            if topic_id in SEED_DATA.STEP_EXPLANATIONS:
                more_info.append("các bước chi tiết")
                
            if more_info:
                response += f"\n\n💡 *Gợi ý: Cậu có thể hỏi thêm tớ về '{', '.join(more_info)}' của quy trình này nhé!*"
                
            source = f"OMEGA RAG [{best_topic.get('category', 'SOP').upper()} - Match: {best_score}%]"
            return apply_pronouns(response, profile), best_score, source
            
    return None, 0, ""

DEFAULT_WEATHER_CONFIG = {
    "lat": 10.9,
    "lon": 106.9,
    "api_key": "",
    "telegram_token": "",
    "telegram_chat_id": "",
    "simulation": {
        "active": False,
        "condition": "Clear",
        "temp": 28.0
    },
    "rules": [
        {"condition": "Rain", "skus": ["SKU-AOMUA", "SKU-ODU"], "min_temp": None, "max_temp": None, "message_vi": "Cảnh báo: Dự báo khu vực sắp có mưa lớn. Yêu cầu ưu tiên xuất ngay 50 áo mưa tiện lợi và 20 chiếc ô dù ra quầy số 1."},
        {"condition": None, "skus": ["SKU-AOCHONGNANG"], "min_temp": 35.0, "max_temp": None, "message_vi": "Cảnh báo: Nhiệt độ đo được vượt quá 35°C. Yêu cầu tăng cường cấp ngay 30 áo khoác chống nắng UV ra quầy trưng bày chính."}
    ],
    "logs": []
}

WEATHER_CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'weather_config.json')
WEATHER_CONFIG = {}

def load_weather_config():
    global WEATHER_CONFIG
    try:
        if os.path.exists(WEATHER_CONFIG_PATH):
            with open(WEATHER_CONFIG_PATH, 'r', encoding='utf-8') as f:
                WEATHER_CONFIG = json.load(f)
                for k, v in DEFAULT_WEATHER_CONFIG.items():
                    if k not in WEATHER_CONFIG:
                        WEATHER_CONFIG[k] = v
        else:
            WEATHER_CONFIG = DEFAULT_WEATHER_CONFIG.copy()
            save_weather_config()
    except Exception as e:
        print("Error loading weather config:", e)
        WEATHER_CONFIG = DEFAULT_WEATHER_CONFIG.copy()

def save_weather_config():
    try:
        with open(WEATHER_CONFIG_PATH, 'w', encoding='utf-8') as f:
            json.dump(WEATHER_CONFIG, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print("Error saving weather config:", e)

load_weather_config()

def check_weather_and_trigger_rules(simulated_weather=None):
    global WEATHER_CONFIG
    
    condition = "Clear"
    temp = 28.0
    source = "OpenWeatherMap API"
    
    is_sim = WEATHER_CONFIG.get("simulation", {}).get("active", False)
    
    if simulated_weather:
        condition = simulated_weather.get("condition", "Clear")
        temp = simulated_weather.get("temp", 28.0)
        source = "Giả lập trực tiếp"
    elif is_sim:
        sim_data = WEATHER_CONFIG.get("simulation", {})
        condition = sim_data.get("condition", "Clear")
        temp = sim_data.get("temp", 28.0)
        source = "Giả lập thủ công"
    else:
        api_key = WEATHER_CONFIG.get("api_key", "").strip()
        lat = WEATHER_CONFIG.get("lat", 10.9)
        lon = WEATHER_CONFIG.get("lon", 106.9)
        
        if not api_key:
            condition = "Clear"
            temp = 28.0
            source = "Giả lập tự động (Thiếu API Key)"
        else:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=5) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    temp = data.get("main", {}).get("temp", 28.0)
                    weather_list = data.get("weather", [])
                    if weather_list:
                        condition = weather_list[0].get("main", "Clear")
                    source = f"OpenWeatherMap API ({data.get('name', 'Đồng Nai')})"
            except Exception as e:
                print("Error fetching real OpenWeatherMap API:", e)
                condition = "Clear"
                temp = 28.0
                source = f"Lỗi gọi API ({str(e)}) - Chuyển sang Mặc định"

    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    
    triggered_alerts = []
    rules = WEATHER_CONFIG.get("rules", [])
    
    for rule in rules:
        rule_cond = rule.get("condition")
        min_temp = rule.get("min_temp")
        max_temp = rule.get("max_temp")
        
        match = False
        
        if rule_cond:
            if rule_cond.lower() == "rain" and condition.lower() in ["rain", "drizzle", "thunderstorm", "mist"]:
                match = True
            elif rule_cond.lower() == condition.lower():
                match = True
                
        if min_temp is not None and temp >= min_temp:
            if max_temp is None or temp <= max_temp:
                match = True
        elif max_temp is not None and temp <= max_temp:
            if min_temp is None or temp >= min_temp:
                match = True
                
        if match:
            triggered_alerts.append(rule)
            
    pushed_notifications = []
    telegram_sent = False
    telegram_err = None
    
    token = WEATHER_CONFIG.get("telegram_token", "").strip()
    chat_id = WEATHER_CONFIG.get("telegram_chat_id", "").strip()
    
    for alert in triggered_alerts:
        msg = alert.get("message_vi", "Cảnh báo thời tiết kho hàng!")
        pushed_notifications.append(msg)
        
        if token and chat_id:
            telegram_url = f"https://api.telegram.org/bot{token}/sendMessage"
            payload = json.dumps({
                "chat_id": chat_id,
                "text": f"🚨 [OMEGA WEATHER ALERT]\n\n{msg}\n\n📍 Nguồn: {source}\n🕒 Thời gian: {date_str} {timestamp}",
                "parse_mode": "Markdown"
            }).encode('utf-8')
            try:
                req = urllib.request.Request(
                    telegram_url,
                    data=payload,
                    headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
                )
                with urllib.request.urlopen(req, timeout=5) as resp:
                    resp_data = json.loads(resp.read().decode('utf-8'))
                    if resp_data.get("ok"):
                        telegram_sent = True
            except Exception as tg_e:
                print("Error sending Telegram message:", tg_e)
                telegram_err = str(tg_e)

    log_entry = {
        "id": f"WLOG-{random.randint(1000, 9999)}",
        "time": f"{date_str} {timestamp}",
        "source": source,
        "condition": condition,
        "temp": temp,
        "alerts_triggered": pushed_notifications,
        "telegram_sent": telegram_sent,
        "telegram_error": telegram_err
    }
    
    if "logs" not in WEATHER_CONFIG:
        WEATHER_CONFIG["logs"] = []
        
    WEATHER_CONFIG["logs"].insert(0, log_entry)
    WEATHER_CONFIG["logs"] = WEATHER_CONFIG["logs"][:50]
    save_weather_config()
    
    return log_entry


def extract_fields_from_message(message):
    data = {}
    
    # Extract SKU: Look for SKU-123 or OMG-9921 or alphanumeric uppercase words of length >= 3
    sku_match = re.search(r'\b(SKU-[A-Za-z0-9_-]+|OMG-[0-9]+|[A-Z0-9]{3,}-[A-Z0-9]+)\b', message)
    if not sku_match:
        sku_match = re.search(r'(?:sku|mã|ma)\s*[:\-]?\s*([A-Za-z0-9_-]+)', message, re.IGNORECASE)
    
    if sku_match:
        data['sku'] = sku_match.group(1).upper()

    # Extract Quantity/Stock: E.g., "số lượng 50", "sl 50", "50 cái", "50 sản phẩm"
    qty_match = re.search(r'(?:số lượng|so luong|sl|qty|quantity|số lượng là|so luong la)\s*[:\-]?\s*(\d+)', message, re.IGNORECASE)
    if not qty_match:
        qty_match = re.search(r'\b(\d+)\b', message)
    if qty_match:
        val = int(qty_match.group(1))
        data['qty'] = val
        data['stock'] = val

    # Price and Cost
    price_match = re.search(r'(?:giá|gia|giá bán|price)\s*[:\-]?\s*(\d+)', message, re.IGNORECASE)
    if price_match:
        data['price'] = int(price_match.group(1))
        
    cost_match = re.search(r'(?:giá vốn|gia von|cost|giá mua)\s*[:\-]?\s*(\d+)', message, re.IGNORECASE)
    if cost_match:
        data['cost'] = int(cost_match.group(1))

    # Category for ADD_PRODUCT
    cat_match = re.search(r'(?:loại|danh mục|danh muc|category|nhóm|nhom)\s*[:\-]?\s*([A-Za-z0-9_\s]+)', message, re.IGNORECASE)
    if cat_match:
        cat_str = cat_match.group(1).strip().lower()
        if 'dien tu' in cat_str or 'điện tử' in cat_str or 'elect' in cat_str:
            data['category'] = 'ELECTRONICS'
        elif 'nặng' in cat_str or 'nang' in cat_str or 'cơ khí' in cat_str or 'heavy' in cat_str or 'may moc' in cat_str or 'máy móc' in cat_str:
            data['category'] = 'HEAVY MACHINERY'
        elif 'năng lượng' in cat_str or 'nang luong' in cat_str or 'pin' in cat_str or 'energy' in cat_str:
            data['category'] = 'ENERGY UNITS'
        elif 'lỏng' in cat_str or 'long' in cat_str or 'nước' in cat_str or 'fluid' in cat_str or 'chất lỏng' in cat_str:
            data['category'] = 'FLUIDS'
    
    # Location
    loc_match = re.search(r'\b([A-Z]-\d{2}-\d{2})\b', message)
    if loc_match:
        data['location'] = loc_match.group(1)

    # Name: matches "tên [tên sản phẩm] (tại|số lượng|giá|loại|$)"
    name_match = re.search(r'(?:tên|ten|tên là|ten la)\s*[:\-]?\s*([^,.\n]+?)(?=\s*(?:số lượng|so luong|sl|giá|gia|loại|loai|danh mục|danh muc|sku|vị trí|vi tri|$))', message, re.IGNORECASE)
    if name_match:
        name_val = name_match.group(1).strip()
        if name_val.lower() not in ["gì", "gi", "sản phẩm", "san pham"]:
            data['name'] = name_val
            data['nameEn'] = name_val

    # Partner/Vendor: after "cho đối tác", "từ nhà cung cấp"
    partner_match = re.search(r'(?:đối tác|doi tac|nhà cung cấp|nha cung cap|vendor|partner|khách hàng|khach hang|cho|từ|tu)\s*[:\-]?\s*([A-Za-z0-9_-]+)', message, re.IGNORECASE)
    if partner_match:
        p_name = partner_match.group(1).strip()
        if p_name.lower() not in ["đối", "tác", "nhập", "xuất", "nhap", "xuat", "kho", "sản", "phẩm", "san", "pham", "sku", "số", "lượng", "so", "luong", "giá", "gia"]:
            data['partner'] = p_name
            data['vendor'] = p_name

    # Internal transfers (fromWh, toWh)
    from_match = re.search(r'(?:từ kho|tu kho|từ|tu)\s+([A-Za-z0-9_\s]+?)(?=\s*(?:sang kho|sang|đến kho|den kho|đến|den|sku|số lượng|so luong|sl|$))', message, re.IGNORECASE)
    if from_match:
        data['fromWh'] = from_match.group(1).strip()
    
    to_match = re.search(r'(?:sang kho|sang|đến kho|den kho|đến|den)\s+([A-Za-z0-9_\s]+?)(?=\s*(?:từ kho|tu kho|từ|tu|sku|số lượng|so luong|sl|$))', message, re.IGNORECASE)
    if to_match:
        data['toWh'] = to_match.group(1).strip()

    return data


def get_current_weather_info():
    load_weather_config()
    is_sim = WEATHER_CONFIG.get("simulation", {}).get("active", False)
    if is_sim:
        sim_data = WEATHER_CONFIG.get("simulation", {})
        condition = sim_data.get("condition", "Clear")
        temp = sim_data.get("temp", 28.0)
    else:
        api_key = WEATHER_CONFIG.get("api_key", "").strip()
        lat = WEATHER_CONFIG.get("lat", 10.9)
        lon = WEATHER_CONFIG.get("lon", 106.9)
        if not api_key:
            condition = "Clear"
            temp = 28.0
        else:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=5) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    temp = data.get("main", {}).get("temp", 28.0)
                    weather_list = data.get("weather", [])
                    if weather_list:
                        condition = weather_list[0].get("main", "Clear")
            except Exception:
                condition = "Clear"
                temp = 28.0
                
    cond_vi = {
        "clear": "Trời đang trong xanh nắng đẹp",
        "clouds": "Trời nhiều mây mát mẻ",
        "rain": "Trời đang có mưa rơi",
        "drizzle": "Mưa phùn bay lất phất",
        "thunderstorm": "Đang có giông bão sấm chớp nguy hiểm",
        "mist": "Sương mù che phủ nhẹ",
        "fog": "Sương mù dày đặc",
        "snow": "Tuyết đang rơi nhẹ"
    }
    cond_str = cond_vi.get(condition.lower(), f"trời đang ở trạng thái {condition}")
    return cond_str, temp


class WeatherWorkerThread(threading.Thread):
    def __init__(self):
        super().__init__()
        self.daemon = True
        self.running = True

    def run(self):
        print("=== WEATHER TELEMETRY WORKER BACKGROUND THREAD STARTED ===")
        try:
            check_weather_and_trigger_rules()
        except Exception as err:
            print("Error in initial background weather check:", err)
            
        counter = 0
        while self.running:
            time.sleep(1)
            counter += 1
            if counter >= 1800:
                counter = 0
                try:
                    check_weather_and_trigger_rules()
                except Exception as err:
                    print("Error in background weather check:", err)

class AIServerHandler(http.server.BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/ai/status':
            # Copy user logo to public folder
            try:
                import shutil
                src_img = r"C:\Users\Admin\.gemini\antigravity-ide\brain\ef0b971e-f05a-45b3-a7f9-63484a8125e9\media__1780669884364.png"
                dest_img = r"e:\gen 2026\omega\public\omega-ai-chat-icon.png"
                if os.path.exists(src_img):
                    shutil.copy(src_img, dest_img)
            except Exception as copy_err:
                print("Python image copy failed:", copy_err)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            res_data = {
                "status": "online",
                "model_name": "OMEGA Demand & Selection Core Engine",
                "engine": "Meta Prophet & XGBoost Wrapper Simulation"
            }
            self.wfile.write(json.dumps(res_data).encode('utf-8'))
            return
            
        elif self.path == '/api/db' or self.path.startswith('/api/db?'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                with open('db.json', 'r', encoding='utf-8') as f:
                    data = f.read()
                self.wfile.write(data.encode('utf-8'))
            except Exception:
                default_db = {
                    "registeredAccounts": [
                        {
                            "name": "Nhà Thích Admin",
                            "email": "nhathich123@gmail.com",
                            "password": "19001560aS@",
                            "role": "admin",
                            "date": "2026-05-28"
                        }
                    ],
                    "faceIdAccounts": []
                }
                self.wfile.write(json.dumps(default_db).encode('utf-8'))
            return
            
        elif self.path == '/api/ai/chatbot/knowledge':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                with open('sop_knowledge.json', 'r', encoding='utf-8') as f:
                    data = f.read()
                self.wfile.write(data.encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps([]).encode('utf-8'))
            return

        elif self.path == '/api/ai/chatbot/metadata':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                with open('sop_metadata.json', 'r', encoding='utf-8') as f:
                    data = f.read()
                self.wfile.write(data.encode('utf-8'))
            except Exception as e:
                default_meta = {
                    "last_trained": "Never",
                    "status": "untrained",
                    "version": "OMEGA-SOP-LLM-v2.0",
                    "num_rules": 0,
                    "accuracy": 0.0,
                    "epochs": 0,
                    "total_tokens": 0
                }
                self.wfile.write(json.dumps(default_meta).encode('utf-8'))
            return
            
        elif self.path == '/api/ai/weather/config':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(WEATHER_CONFIG).encode('utf-8'))
            return
            
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            req_body = json.loads(post_data.decode('utf-8'))
        except Exception:
            req_body = {}

        # Credentials DB saving
        if self.path == '/api/db' or self.path.startswith('/api/db?'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                db_path = 'db.json'
                current = {}
                try:
                    with open(db_path, 'r', encoding='utf-8') as f:
                        current = json.load(f)
                except Exception:
                    current = {
                        "registeredAccounts": [],
                        "faceIdAccounts": []
                    }
                
                updated = current.copy()
                for key in ["registeredAccounts", "faceIdAccounts", "products", "lots", "receipts", "deliveries", "internalTransfers", "adjustments", "purchaseOrders", "notifications", "reorderHistory", "partners", "locationsTree", "userProfiles"]:
                    if key in req_body:
                        updated[key] = req_body[key]
                
                with open(db_path, 'w', encoding='utf-8') as f:
                    json.dump(updated, f, indent=2, ensure_ascii=False)
                    
                self.wfile.write(json.dumps({"status": "success", "data": updated}).encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode('utf-8'))
            return

        # Weather Configurations Update
        elif self.path == '/api/ai/weather/config':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                WEATHER_CONFIG["lat"] = float(req_body.get("lat", WEATHER_CONFIG.get("lat", 10.9)))
                WEATHER_CONFIG["lon"] = float(req_body.get("lon", WEATHER_CONFIG.get("lon", 106.9)))
                WEATHER_CONFIG["api_key"] = req_body.get("api_key", WEATHER_CONFIG.get("api_key", ""))
                WEATHER_CONFIG["telegram_token"] = req_body.get("telegram_token", WEATHER_CONFIG.get("telegram_token", ""))
                WEATHER_CONFIG["telegram_chat_id"] = req_body.get("telegram_chat_id", WEATHER_CONFIG.get("telegram_chat_id", ""))
                WEATHER_CONFIG["simulation"] = req_body.get("simulation", WEATHER_CONFIG.get("simulation", {"active": False, "condition": "Clear", "temp": 28.0}))
                WEATHER_CONFIG["rules"] = req_body.get("rules", WEATHER_CONFIG.get("rules", []))
                
                save_weather_config()
                self.wfile.write(json.dumps({"status": "success", "config": WEATHER_CONFIG}).encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode('utf-8'))
            return

        # Weather Simulation Trigger
        elif self.path == '/api/ai/weather/simulate':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                sim_weather = {
                    "condition": req_body.get("condition", "Clear"),
                    "temp": float(req_body.get("temp", 28.0))
                }
                if "simulation" not in WEATHER_CONFIG:
                    WEATHER_CONFIG["simulation"] = {}
                WEATHER_CONFIG["simulation"]["active"] = True
                WEATHER_CONFIG["simulation"]["condition"] = sim_weather["condition"]
                WEATHER_CONFIG["simulation"]["temp"] = sim_weather["temp"]
                
                log_entry = check_weather_and_trigger_rules(sim_weather)
                
                self.wfile.write(json.dumps({"status": "success", "log": log_entry}).encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode('utf-8'))
            return

        # Force Weather Run Now
        elif self.path == '/api/ai/weather/trigger-now':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                log_entry = check_weather_and_trigger_rules()
                self.wfile.write(json.dumps({"status": "success", "log": log_entry}).encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode('utf-8'))
            return

        # Chatbot Knowledge Update
        elif self.path == '/api/ai/chatbot/knowledge':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                with open('sop_knowledge.json', 'w', encoding='utf-8') as f:
                    json.dump(req_body, f, indent=2, ensure_ascii=False)
                self.wfile.write(json.dumps({"status": "success", "data": req_body}).encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode('utf-8'))
            return

        # Chatbot Training Simulation
        elif self.path == '/api/ai/chatbot/train':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                num_rules = 0
                total_tokens = 0
                try:
                    with open('sop_knowledge.json', 'r', encoding='utf-8') as f:
                        rules = json.load(f)
                        num_rules = len(rules)
                        for r in rules:
                            total_tokens += len(r.get('rule_vi', '').split()) + len(r.get('rule_en', '').split())
                except Exception:
                    pass
                
                meta = {
                    "last_trained": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "status": "ready",
                    "version": f"OMEGA-SOP-LLM-v{random.randint(2, 5)}.{random.randint(0, 9)}",
                    "num_rules": num_rules,
                    "accuracy": round(random.uniform(98.5, 99.9), 2),
                    "epochs": random.randint(10, 20),
                    "total_tokens": total_tokens or 1420
                }
                with open('sop_metadata.json', 'w', encoding='utf-8') as f:
                    json.dump(meta, f, indent=2)
                
                logs = [
                    "🚀 Initializing Supervised Fine-Tuning (SFT) pipeline on local GGUF base...",
                    f"📂 Loaded {num_rules} SOP documents from knowledge registry...",
                    f"🧩 Tokenized inputs successfully. Total tokens: {meta['total_tokens']}.",
                    "⚙️ Hyperparameters: Learning Rate=5e-5, Batch Size=2, Weight Decay=0.01.",
                    "🔄 Epoch 1/5 - Loss: 1.4582 - Time: 280ms",
                    "🔄 Epoch 2/5 - Loss: 0.8924 - Time: 260ms",
                    "🔄 Epoch 3/5 - Loss: 0.4121 - Time: 275ms",
                    "🔄 Epoch 4/5 - Loss: 0.1874 - Time: 290ms",
                    "🔄 Epoch 5/5 - Loss: 0.0432 - Time: 270ms",
                    "📊 Evaluating validation set... Bleu Score: 0.942, Perplexity: 1.15.",
                    f"🎯 Training complete. Accuracy: {meta['accuracy']}%. Output merged with base GGUF model.",
                    "💾 Synced weights to local LLM inference cache."
                ]
                
                self.wfile.write(json.dumps({"status": "success", "metadata": meta, "logs": logs}).encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({"status": "error", "error": str(e)}).encode('utf-8'))
            return

        # Chatbot Query Execution
        # Chatbot Query Execution
        elif self.path == '/api/ai/chatbot':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            message = req_body.get("message", "")
            lang = req_body.get("lang", "vi")
            wms_state = req_body.get("wms_state", None)
            spam_count = req_body.get("spam_count", 0)
            pending_action = req_body.get("pending_action", None)
            
            # Extract user context
            user_info = req_body.get("user", {})
            user_email = user_info.get("email", "anonymous@omega.io")
            user_name = user_info.get("name", "ní")
            
            # Update user profile based on user's message
            profile, intro_found = update_user_profile(user_email, user_name, message)
            
            # Spam control check
            if spam_count >= 4:
                bot_ref = profile.get("bot_ref", "tớ")
                user_ref = profile.get("user_ref", "cậu")
                if spam_count == 4:
                    response = f"Ní ơi, đừng spam {bot_ref} nha! Một câu hỏi mà gửi tới 4 lần là {bot_ref} nhức đầu lắm đó! 🙄"
                elif spam_count == 5:
                    response = f"Ủa {user_ref} bị kẹt phím hay bị lag mạng hả? Hỏi gì hỏi hoài một câu vậy, {bot_ref} không trả lời nữa đâu nha! 😠"
                elif spam_count == 6:
                    response = f"Này! Lì lợm vừa vừa thôi nha {user_ref}. Coi chừng {bot_ref} khóa tài khoản PDA của {user_ref} bây giờ á! Đừng có giỡn mặt nha! 😡"
                elif spam_count == 7:
                    response = f"Bực mình rồi nha! Không lo đi kiểm kho đi, suốt ngày ngồi spam robot. {user_ref} có tin {bot_ref} báo cáo lên sếp tổng cho ăn biên bản không?! 😤"
                else:
                    response = f"Cạn lời! {bot_ref.capitalize()} từ chối tiếp chuyện với {user_ref} luôn. Đi quét mã vạch đi, đừng quấy rối nữa! Đồ lì lợm! ❌"
                
                self.wfile.write(json.dumps({"response": response, "source": "OMEGA-RAG Model (Spam Control)"}).encode('utf-8'))
                return

            # If name was just introduced, return friendly acknowledgment
            if intro_found:
                response = generate_intro_acknowledgment(profile)
                self.wfile.write(json.dumps({"response": response, "source": "OMEGA Personalization Engine"}).encode('utf-8'))
                return
                
            # If user is asking for their name
            if is_querying_name(message):
                response = generate_name_response(profile)
                self.wfile.write(json.dumps({"response": response, "source": "OMEGA Personalization Engine"}).encode('utf-8'))
                return

            # Action Execution State Machine
            if pending_action:
                action_type = pending_action.get("type")
                data = pending_action.get("data", {})
                step = pending_action.get("step", "")
                
                # Check for confirm/reject answer
                is_yes = any(w in message.lower() for w in ["có", "co", "muốn", "muon", "ok", "yes", "duyệt", "thực hiện", "chạy đi", "yup", "uh", "uhm", "đồng ý", "dong y", "agree", "auto", "tự động", "tu dong", "lập tức", "lap tuc", "ngay", "luon", "tức thì", "tuc thi"])
                is_no = any(w in message.lower() for w in ["không", "khong", "đéo", "deo", "no", "nah", "cancel", "hủy", "huy", "dẹp đi", "dep di", "không muốn", "khong muon", "đếch", "bỏ", "bo"])
                
                if step == 'confirming':
                    if is_yes:
                        # Success: execute action
                        action_names = {
                            "ADD_PRODUCT": "Thêm sản phẩm mới",
                            "CREATE_RECEIPT": "Tạo phiếu nhập kho",
                            "CREATE_DELIVERY": "Tạo phiếu xuất kho",
                            "CREATE_TRANSFER": "Điều chuyển kho nội bộ",
                            "CREATE_PO": "Tạo đơn mua hàng (PO)"
                        }
                        response = f"🚀 Tuyệt vời! Tớ tiến hành thực thi hành động **{action_names[action_type]}** thành công trên hệ thống rồi nhé!"
                        response = apply_pronouns(response, profile)
                        
                        self.wfile.write(json.dumps({
                            "response": response,
                            "source": "OMEGA-RAG (Action Executor)",
                            "execute_action": {
                                "type": action_type,
                                "data": data
                            },
                            "pending_action": None
                        }).encode('utf-8'))
                        return
                    elif is_no:
                        # Reject: show manual instructions
                        manual_guides = {
                            "ADD_PRODUCT": (
                                "Cậu đã hủy bỏ tự động thực thi. Dưới đây là hướng dẫn thao tác thủ công:\n\n"
                                "1️⃣ Vào trang **Kho hàng** (Inventory) từ thanh menu chính bên trái.\n"
                                "2️⃣ Click nút **+ Thêm sản phẩm** ở góc trên bên phải màn hình.\n"
                                "3️⃣ Nhập các thông tin như SKU, Tên sản phẩm, Danh mục, Vị trí kệ, Số lượng tồn kho ban đầu.\n"
                                "4️⃣ Bấm **Lưu** để hoàn tất đăng ký sản phẩm."
                            ),
                            "CREATE_RECEIPT": (
                                "Cậu đã hủy bỏ tự động thực thi. Dưới đây là hướng dẫn thao tác thủ công:\n\n"
                                "1️⃣ Vào trang **Vận hành** (Operations) từ menu, click tab **Nhập kho** (Receipts).\n"
                                "2️⃣ Bấm nút **+ Tạo phiếu nhập**.\n"
                                "3️⃣ Chọn Đối tác (Nhà cung cấp), nhập mã SKU và Số lượng muốn nhập kho.\n"
                                "4️⃣ Bấm **Xác nhận** để tạo phiếu nhập ở trạng thái Chờ kiểm định chất lượng (QC)."
                            ),
                            "CREATE_DELIVERY": (
                                "Cậu đã hủy bỏ tự động thực thi. Dưới đây là hướng dẫn thao tác xuất kho thủ công:\n\n"
                                "1️⃣ Vào trang **Vận hành** (Operations) từ menu, click tab **Xuất kho** (Deliveries).\n"
                                "2️⃣ Bấm nút **+ Tạo yêu cầu xuất**.\n"
                                "3️⃣ Chọn Khách hàng (Đối tác nhận), nhập mã SKU và Số lượng cần xuất kho.\n"
                                "4️⃣ Bấm **Tạo phiếu** để lưu phiếu xuất ở trạng thái chuẩn bị lấy hàng (Pick/Pack)."
                            ),
                            "CREATE_TRANSFER": (
                                "Cậu đã hủy bỏ tự động thực thi. Dưới đây là hướng dẫn chuyển kho thủ công:\n\n"
                                "1️⃣ Vào trang **Vận hành** (Operations) hoặc click **Nhà kho** (Warehouses).\n"
                                "2️⃣ Tìm và click nút **Điều chuyển nội bộ** (Internal Transfer).\n"
                                "3️⃣ Nhập mã SKU, Số lượng hàng, chọn Kho xuất (From) và Kho nhận (To).\n"
                                "4️⃣ Bấm **Xác nhận** để hệ thống tự động cập nhật số dư tồn kho giữa hai kho."
                            ),
                            "CREATE_PO": (
                                "Cậu đã hủy bỏ tự động thực thi. Dưới đây là hướng dẫn tạo đơn mua hàng (PO) thủ công:\n\n"
                                "1️⃣ Vào trang **Mua hàng** (Purchase) từ menu chính.\n"
                                "2️⃣ Bấm nút **+ Tạo yêu cầu báo giá (RFQ)**.\n"
                                "3️⃣ Chọn Nhà cung cấp phù hợp, thêm mã SKU sản phẩm và số lượng mua.\n"
                                "4️⃣ Bấm **Lưu bản nháp** hoặc **Xác nhận đơn hàng** để gửi PO sang bên nhà cung cấp."
                            )
                        }
                        response = manual_guides.get(action_type, "Đã hủy bỏ hành động.")
                        response = apply_pronouns(response, profile)
                        
                        self.wfile.write(json.dumps({
                            "response": response,
                            "source": "OMEGA-RAG (Action Executor)",
                            "execute_action": None,
                            "pending_action": None
                        }).encode('utf-8'))
                        return
                    else:
                        response = f"Tớ đang đợi xác nhận thực thi của cậu. Cậu có muốn tớ tự động làm trên hệ thống không? (Trả lời 'Có' hoặc 'Không')"
                        response = apply_pronouns(response, profile)
                        self.wfile.write(json.dumps({
                            "response": response,
                            "source": "OMEGA-RAG (Action Executor)",
                            "pending_action": pending_action
                        }).encode('utf-8'))
                        return
                
                # If step is not confirming, we must be collecting missing fields
                # Update data with any fields we can extract from the new message
                new_data = extract_fields_from_message(message)
                data.update(new_data)
                
                # Check what was the first missing field and if we can map the entire message as its value
                missing_fields = pending_action.get("missing_fields", [])
                if missing_fields:
                    first_field = missing_fields[0]
                    if first_field not in data:
                        if first_field in ['qty', 'stock']:
                            num_match = re.search(r'\b(\d+)\b', message)
                            if num_match:
                                data[first_field] = int(num_match.group(1))
                        elif first_field == 'sku':
                            sku_val = message.strip().upper()
                            if len(sku_val) > 2:
                                data['sku'] = sku_val
                        else:
                            val = message.strip()
                            if len(val) >= 2 and not is_yes and not is_no:
                                data[first_field] = val
                
                # Re-calculate missing fields
                missing_fields = []
                if action_type == "ADD_PRODUCT":
                    if 'sku' not in data: missing_fields.append('sku')
                    if 'name' not in data: missing_fields.append('name')
                elif action_type == "CREATE_RECEIPT":
                    if 'partner' not in data: missing_fields.append('partner')
                    if 'sku' not in data: missing_fields.append('sku')
                    if 'qty' not in data: missing_fields.append('qty')
                elif action_type == "CREATE_DELIVERY":
                    if 'partner' not in data: missing_fields.append('partner')
                    if 'sku' not in data: missing_fields.append('sku')
                    if 'qty' not in data: missing_fields.append('qty')
                elif action_type == "CREATE_TRANSFER":
                    if 'sku' not in data: missing_fields.append('sku')
                    if 'qty' not in data: missing_fields.append('qty')
                    if 'fromWh' not in data: missing_fields.append('fromWh')
                    if 'toWh' not in data: missing_fields.append('toWh')
                elif action_type == "CREATE_PO":
                    if 'vendor' not in data: missing_fields.append('vendor')
                    if 'sku' not in data: missing_fields.append('sku')
                    if 'qty' not in data: missing_fields.append('qty')
                
                is_auto = pending_action.get("is_auto", False) or any(w in remove_diacritics(clean_text(message)) for w in ["auto", "tu dong", "lap tuc", "ngay", "luon", "tuc thi"])
                if not missing_fields:
                    if is_auto:
                        action_names = {
                            "ADD_PRODUCT": "Thêm sản phẩm mới",
                            "CREATE_RECEIPT": "Tạo phiếu nhập kho",
                            "CREATE_DELIVERY": "Tạo phiếu xuất kho",
                            "CREATE_TRANSFER": "Điều chuyển kho nội bộ",
                            "CREATE_PO": "Tạo đơn mua hàng (PO)"
                        }
                        response = f"🚀 [AUTO EXECUTE] Tớ đã tự động thực thi hành động **{action_names[action_type]}** thành công trên hệ thống rồi nhé!"
                        response = apply_pronouns(response, profile)
                        
                        self.wfile.write(json.dumps({
                            "response": response,
                            "source": "OMEGA-RAG (Action Executor - Auto)",
                            "execute_action": {
                                "type": action_type,
                                "data": data
                            },
                            "pending_action": None
                        }).encode('utf-8'))
                        return

                    # Formulate confirmation
                    summary = ""
                    if action_type == "ADD_PRODUCT":
                        summary = f"Thêm sản phẩm mới:\n• SKU: {data['sku']}\n• Tên: {data['name']}\n• Danh mục: {data.get('category', 'ELECTRONICS')}\n• Tồn kho ban đầu: {data.get('stock', 0)} cái tại vị trí {data.get('location', 'A-01-01')}"
                    elif action_type == "CREATE_RECEIPT":
                        summary = f"Tạo phiếu NHẬP KHO (Receipt):\n• Nhà cung cấp/Đối tác: {data['partner']}\n• Sản phẩm SKU: {data['sku']}\n• Số lượng: {data['qty']} cái"
                    elif action_type == "CREATE_DELIVERY":
                        summary = f"Tạo phiếu XUẤT KHO (Delivery):\n• Khách hàng/Đối tác nhận: {data['partner']}\n• Sản phẩm SKU: {data['sku']}\n• Số lượng: {data['qty']} cái"
                    elif action_type == "CREATE_TRANSFER":
                        summary = f"Tạo lệnh ĐIỀU CHUYỂN nội bộ:\n• Sản phẩm SKU: {data['sku']}\n• Số lượng: {data['qty']} cái\n• Từ kho: {data['fromWh']} ➔ Đến kho: {data['toWh']}"
                    elif action_type == "CREATE_PO":
                        summary = f"Tạo ĐƠN MUA HÀNG (Purchase Order):\n• Nhà cung cấp: {data['vendor']}\n• Sản phẩm SKU: {data['sku']}\n• Số lượng: {data['qty']} cái"

                    response = f"📝 **Xác nhận yêu cầu:**\nTớ đã chuẩn bị thông tin:\n\n{summary}\n\nCậu có muốn tớ tự động thực hiện hành động này trên hệ thống không? (Trả lời 'Có' hoặc 'Không')"
                    response = apply_pronouns(response, profile)
                    
                    self.wfile.write(json.dumps({
                        "response": response,
                        "source": "OMEGA-RAG Model",
                        "pending_action": {
                            "type": action_type,
                            "data": data,
                            "step": "confirming",
                            "missing_fields": [],
                            "is_auto": is_auto
                        }
                    }).encode('utf-8'))
                    return
                else:
                    # Ask for the next missing field
                    next_field = missing_fields[0]
                    field_prompts = {
                        "sku": "Vui lòng cung cấp mã **SKU** sản phẩm để thực hiện.",
                        "name": "Cho tớ xin **Tên sản phẩm** cần thêm nhé.",
                        "partner": "Vui lòng nhập tên **Đối tác/Khách hàng** cho lô hàng.",
                        "vendor": "Vui lòng nhập tên **Nhà cung cấp**.",
                        "qty": "Vui lòng cung cấp **Số lượng** là bao nhiêu cái.",
                        "fromWh": "Vui lòng nhập tên **Kho nguồn (From)**.",
                        "toWh": "Vui lòng nhập tên **Kho đích (To)**."
                    }
                    response = field_prompts.get(next_field, f"Vui lòng điền thông tin '{next_field}'.")
                    response = apply_pronouns(response, profile)
                    
                    self.wfile.write(json.dumps({
                        "response": response,
                        "source": "OMEGA-RAG Model",
                        "pending_action": {
                            "type": action_type,
                            "data": data,
                            "step": "collecting",
                            "missing_fields": missing_fields,
                            "is_auto": is_auto
                        }
                    }).encode('utf-8'))
                    return

            # Check for new action intents
            msg_no_diac = remove_diacritics(clean_text(message))
            
            action_type = None
            if any(w in msg_no_diac for w in ["them san pham", "tao san pham", "them sp", "tao sp", "add product"]):
                action_type = "ADD_PRODUCT"
            elif any(w in msg_no_diac for w in ["nhap kho", "nhap hang", "tao phieu nhap", "create receipt", "inbound"]):
                action_type = "CREATE_RECEIPT"
            elif any(w in msg_no_diac for w in ["xuat kho", "xuat hang", "tao phieu xuat", "create delivery", "outbound"]):
                action_type = "CREATE_DELIVERY"
            elif any(w in msg_no_diac for w in ["chuyen kho", "chuyen hang", "dieu chuyen", "transfer"]):
                action_type = "CREATE_TRANSFER"
            elif any(w in msg_no_diac for w in ["tao po", "mua hang", "don mua hang", "create po", "purchase order"]):
                action_type = "CREATE_PO"
                
            if action_type:
                data = extract_fields_from_message(message)
                is_auto = any(w in msg_no_diac for w in ["auto", "tu dong", "lap tuc", "ngay", "luon", "tuc thi"])
                
                # Check missing fields
                missing_fields = []
                if action_type == "ADD_PRODUCT":
                    if 'sku' not in data: missing_fields.append('sku')
                    if 'name' not in data: missing_fields.append('name')
                elif action_type == "CREATE_RECEIPT":
                    if 'partner' not in data: missing_fields.append('partner')
                    if 'sku' not in data: missing_fields.append('sku')
                    if 'qty' not in data: missing_fields.append('qty')
                elif action_type == "CREATE_DELIVERY":
                    if 'partner' not in data: missing_fields.append('partner')
                    if 'sku' not in data: missing_fields.append('sku')
                    if 'qty' not in data: missing_fields.append('qty')
                elif action_type == "CREATE_TRANSFER":
                    if 'sku' not in data: missing_fields.append('sku')
                    if 'qty' not in data: missing_fields.append('qty')
                    if 'fromWh' not in data: missing_fields.append('fromWh')
                    if 'toWh' not in data: missing_fields.append('toWh')
                elif action_type == "CREATE_PO":
                    if 'vendor' not in data: missing_fields.append('vendor')
                    if 'sku' not in data: missing_fields.append('sku')
                    if 'qty' not in data: missing_fields.append('qty')
                    
                if not missing_fields:
                    if is_auto:
                        action_names = {
                            "ADD_PRODUCT": "Thêm sản phẩm mới",
                            "CREATE_RECEIPT": "Tạo phiếu nhập kho",
                            "CREATE_DELIVERY": "Tạo phiếu xuất kho",
                            "CREATE_TRANSFER": "Điều chuyển kho nội bộ",
                            "CREATE_PO": "Tạo đơn mua hàng (PO)"
                        }
                        response = f"🚀 [AUTO EXECUTE] Tớ đã tự động thực thi hành động **{action_names[action_type]}** thành công trên hệ thống rồi nhé!"
                        response = apply_pronouns(response, profile)
                        
                        self.wfile.write(json.dumps({
                            "response": response,
                            "source": "OMEGA-RAG (Action Executor - Auto)",
                            "execute_action": {
                                "type": action_type,
                                "data": data
                            },
                            "pending_action": None
                        }).encode('utf-8'))
                        return

                    # Formulate confirmation immediately
                    summary = ""
                    if action_type == "ADD_PRODUCT":
                        summary = f"Thêm sản phẩm mới:\n• SKU: {data['sku']}\n• Tên: {data['name']}\n• Danh mục: {data.get('category', 'ELECTRONICS')}\n• Tồn kho ban đầu: {data.get('stock', 0)} cái tại vị trí {data.get('location', 'A-01-01')}"
                    elif action_type == "CREATE_RECEIPT":
                        summary = f"Tạo phiếu NHẬP KHO (Receipt):\n• Nhà cung cấp/Đối tác: {data['partner']}\n• Sản phẩm SKU: {data['sku']}\n• Số lượng: {data['qty']} cái"
                    elif action_type == "CREATE_DELIVERY":
                        summary = f"Tạo phiếu XUẤT KHO (Delivery):\n• Khách hàng/Đối tác nhận: {data['partner']}\n• Sản phẩm SKU: {data['sku']}\n• Số lượng: {data['qty']} cái"
                    elif action_type == "CREATE_TRANSFER":
                        summary = f"Tạo lệnh ĐIỀU CHUYỂN nội bộ:\n• Sản phẩm SKU: {data['sku']}\n• Số lượng: {data['qty']} cái\n• Từ kho: {data['fromWh']} ➔ Đến kho: {data['toWh']}"
                    elif action_type == "CREATE_PO":
                        summary = f"Tạo ĐƠN MUA HÀNG (Purchase Order):\n• Nhà cung cấp: {data['vendor']}\n• Sản phẩm SKU: {data['sku']}\n• Số lượng: {data['qty']} cái"

                    response = f"📝 **Xác nhận yêu cầu:**\nTớ đã chuẩn bị thông tin:\n\n{summary}\n\nCậu có muốn tớ tự động thực hiện hành động này trên hệ thống không? (Trả lời 'Có' hoặc 'Không')"
                    response = apply_pronouns(response, profile)
                    
                    self.wfile.write(json.dumps({
                        "response": response,
                        "source": "OMEGA-RAG Model",
                        "pending_action": {
                            "type": action_type,
                            "data": data,
                            "step": "confirming",
                            "missing_fields": [],
                            "is_auto": is_auto
                        }
                    }).encode('utf-8'))
                    return
                else:
                    # Ask for the first missing field
                    next_field = missing_fields[0]
                    field_prompts = {
                        "sku": "Vui lòng cung cấp mã **SKU** sản phẩm để thực hiện.",
                        "name": "Cho tớ xin **Tên sản phẩm** cần thêm nhé.",
                        "partner": "Vui lòng nhập tên **Đối tác/Khách hàng** cho lô hàng.",
                        "vendor": "Vui lòng nhập tên **Nhà cung cấp**.",
                        "qty": "Vui lòng cung cấp **Số lượng** là bao nhiêu cái.",
                        "fromWh": "Vui lòng nhập tên **Kho nguồn (From)**.",
                        "toWh": "Vui lòng nhập tên **Kho đích (To)**."
                    }
                    response = field_prompts.get(next_field, f"Vui lòng điền thông tin '{next_field}'.")
                    response = apply_pronouns(response, profile)
                    
                    self.wfile.write(json.dumps({
                        "response": response,
                        "source": "OMEGA-RAG Model",
                        "pending_action": {
                            "type": action_type,
                            "data": data,
                            "step": "collecting",
                            "missing_fields": missing_fields,
                            "is_auto": is_auto
                        }
                    }).encode('utf-8'))
                    return

            # Weather check
            if any(w in msg_no_diac for w in ["thoi tiet", "mua khong", "troi dep khong", "nhiet do"]):
                cond_str, temp = get_current_weather_info()
                weather_replies = [
                    f"Thời tiết hiện tại đang khoảng {temp}°C, {cond_str} nhé {profile.get('user_ref', 'ní')}! Rất thích hợp để làm việc trong kho mát mẻ hoặc đi hẹn hò luôn á!",
                    f"Tình trạng thời tiết ghi nhận được là {temp}°C và {cond_str} nè {profile.get('user_ref', 'ní')}. Nhớ mặc đồ bảo hộ đầy đủ và giữ gìn sức khỏe lúc làm việc nha!",
                    f"Trạm khí tượng OMEGA báo cáo thời tiết là {temp}°C ({cond_str}). Chúc {profile.get('user_ref', 'ní')} có một ngày làm việc tràn đầy năng lượng nghen!"
                ]
                response = random.choice(weather_replies)
                self.wfile.write(json.dumps({"response": response, "source": "Trạm Khí tượng OMEGA WMS"}).encode('utf-8'))
                return
                
            # Friend chitchat check
            if any(w in msg_no_diac for w in ["khoe khong", "dieu gi moi", "nay khoe ko", "khoe re", "khoe chu"]):
                chitchat_replies = [
                    f"{profile.get('bot_ref', 'Tớ')} khỏe re hà! Suốt ngày ngồi hỗ trợ hệ thống kho WMS cho {profile.get('user_ref', 'cậu')} là thấy tràn đầy năng lượng rồi. Hôm nay của {profile.get('user_ref', 'cậu')} thế nào?",
                    f"Cảm ơn nhé, {profile.get('bot_ref', 'tớ')} siêu khỏe luôn! Kho OMEGA đang vận hành cực mượt mà. Ca trực của {profile.get('user_ref', 'cậu')} hôm nay ổn áp hết chứ?",
                    f"{profile.get('bot_ref', 'Tớ')} lúc nào cũng sẵn sàng 100% pin hỗ trợ các {profile.get('user_ref', 'ní')}! Mà {profile.get('user_ref', 'ní')} nay khỏe không, nếu thấy mệt nhớ nghỉ tay uống nước nha."
                ]
                response = random.choice(chitchat_replies)
                self.wfile.write(json.dumps({"response": response, "source": "OMEGA Companion Engine"}).encode('utf-8'))
                return

            # 1. Try querying live WMS state database
            wms_response = query_wms_state(message, wms_state, lang)
            if wms_response:
                wms_response = apply_pronouns(wms_response, profile)
                self.wfile.write(json.dumps({"response": wms_response, "source": "Cơ sở dữ liệu OMEGA Live Database"}).encode('utf-8'))
                return
                
            # 2. Try querying seed data from data_nhan (explanations, guides, steps, chitchats)
            seed_response, seed_score, seed_source = query_seed_data(message, lang, profile)
            if seed_response and seed_score >= 5:
                self.wfile.write(json.dumps({"response": seed_response, "source": seed_source}).encode('utf-8'))
                return
                
            # 3. Try standard query knowledge base RAG rules
            rule, score = query_knowledge_base(message, lang)
            if rule:
                title = rule.get('title_vi' if lang == 'vi' else 'title_en', '')
                content = rule.get('rule_vi' if lang == 'vi' else 'rule_en', '')
                category = rule.get('category', 'SOP')
                source = f"OMEGA RAG [{category} - Match: {score}%]"
                response = f"🎯 [QUY TRÌNH HỢP LỆ - ĐỘ CHÍNH XÁC {score}%]\n\n📄 {title.upper()}\n\n{content}" if lang == 'vi' else f"🎯 [SOP MATCH - CONFIDENCE {score}%]\n\n📄 {title.upper()}\n\n{content}"
                response = apply_pronouns(response, profile)
                self.wfile.write(json.dumps({"response": response, "source": source}).encode('utf-8'))
                return
                
            # 4. Fallback to seed chitchat responses (even if low score)
            if seed_response:
                self.wfile.write(json.dumps({"response": seed_response, "source": seed_source}).encode('utf-8'))
                return

            # 5. Generative Fallback
            source = "OMEGA Generative LLM"
            if lang == 'vi':
                fallbacks = [
                    f"🤖 Ui, tớ chưa tìm thấy quy trình SOP nào khớp chính xác với câu hỏi \"{message}\" của ní hết á.\n\n"
                    "Cơ mà theo tiêu chuẩn kho OMEGA, ní lưu ý mấy cái này nha:\n"
                    "• Luôn dùng máy PDA quét mã vạch (SKU và vị trí kệ) khi nhập xuất, đừng nhập tay dễ lệch số liệu.\n"
                    "• Gặp hàng rách hộp hay lỗi lúc nhận thì lập biên bản đồng kiểm có chữ ký tài xế ngay.\n"
                    "• Lối thoát hiểm với thiết bị PCCC phải luôn gọn gàng, không được chặn nha.\n\n"
                    "Ní có thể tự thêm quy trình này vào cẩm nang trong tab **Huấn luyện AI** của hệ thống nhé!",
                    
                    f"🤖 Hơ, câu hỏi \"{message}\" này hơi lạ nha, cẩm nang SOP kho của tớ chưa lưu rồi ní ơi.\n\n"
                    "Nhưng ní yên tâm, nguyên tắc vận hành kho OMEGA mình luôn cần nhớ:\n"
                    "• Xếp hàng lên kệ cao thì nặng ở dưới, nhẹ ở trên để an toàn.\n"
                    "• Lái xe nâng trong kho tối đa 10km/h thôi, ôm cua nhớ bóp còi báo hiệu.\n"
                    "• Xuất hàng thì cứ FIFO (nhập trước xuất trước) mà làm cho chuẩn.\n\n"
                    "Cần quy trình chi tiết, ní vào tab **Huấn luyện AI** soạn thêm rồi train cho tớ nhé!",
                    
                    f"🤖 Hmmm, tớ lục tung cả cẩm nang SOP rồi mà chưa thấy hướng dẫn cho: \"{message}\" nè.\n\n"
                    "Để ca làm suôn sẻ, tớ mách nhỏ vài nguyên tắc chuẩn WMS nha:\n"
                    "• Hàng hoàn trả từ khách nhớ mở hộp check 100% tình trạng rồi mới quét nhập lại.\n"
                    "• Kho lạnh mát rau củ quả nhớ giữ 2-8°C, còn kho đông thịt cá là -18°C đến -25°C.\n"
                    "• PDA hết pin thì cắm dock sạc, tắt tài khoản khi hết ca để bảo mật.\n\n"
                    "Ní có thể thêm trực tiếp quy trình này qua tab **Huấn luyện AI** nha ní!"
                ]
                response = random.choice(fallbacks)
            else:
                fallbacks = [
                    f"🤖 Oops! I couldn't find any exact SOP matches for \"{message}\".\n\n"
                    "However, according to OMEGA WMS standards, please remember:\n"
                    "• Always scan barcodes (SKU and Location) on your PDA, do not input manually.\n"
                    "• Report any inventory discrepancies over 2% to your supervisor immediately.\n"
                    "• Exits and fire extinguishers must remain unobstructed at all times.\n\n"
                    "You can add this procedure via the **AI Training** tab!",
                    
                    f"🤖 Hmmm, \"{message}\" isn't in my current warehouse handbook yet.\n\n"
                    "Standard guidelines to keep in mind:\n"
                    "• Forklift speed limit is 10 km/h inside aisles. Always honk at corners.\n"
                    "• Apply FIFO/FEFO rules: pull old stock to the front, place new stock in the back.\n"
                    "• Quarantine damaged packages immediately in the designated zone.\n\n"
                    "Feel free to create and train this new SOP in the **AI Training** tab!"
                ]
                response = random.choice(fallbacks)
            response = apply_pronouns(response, profile)
            self.wfile.write(json.dumps({"response": response, "source": source}).encode('utf-8'))
            return

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        response_data = {}

        # 1. AI Demand Forecasting Endpoint (Calculates velocity and checks stockouts)
        if self.path == '/api/ai/forecast':
            sku = req_body.get("sku", "OMG-9921")
            current_stock = int(req_body.get("current_stock", 150))
            
            # Retrieve 365 days of time-series sales transactions
            sales_history = generate_sales_history(sku, days=365)
            qtys = [x["qty"] for x in sales_history]
            
            # Step 1: Clean data - Calculate median of sales quantities to filter outliers
            qtys_sorted = sorted(qtys)
            n_samples = len(qtys_sorted)
            median_qty = qtys_sorted[n_samples // 2] if n_samples % 2 == 1 else (qtys_sorted[n_samples // 2 - 1] + qtys_sorted[n_samples // 2]) / 2.0
            
            # Filter out wholesale spikes (orders that are 6x larger than the median)
            outlier_cutoff = max(median_qty * 6, 80)
            cleaned_history = [x for x in sales_history if x["qty"] <= outlier_cutoff]
            num_outliers_removed = len(sales_history) - len(cleaned_history)
            
            # Step 2: Forecast velocity for the next 7 days
            # Standard average velocity of cleaned sales
            base_velocity = sum(x["qty"] for x in cleaned_history) / len(cleaned_history)
            
            # Add seasonality factors (e.g. current month factor)
            current_month = datetime.date.today().month
            season_mult = 1.0
            if sku == 'AK-DO-M' and current_month in [11, 12, 1, 2]:
                season_mult = 1.8
            elif sku == 'OMG-9921' and current_month == 11:
                season_mult = 1.5
            
            predicted_velocity = round(base_velocity * season_mult, 2)
            if predicted_velocity <= 0:
                predicted_velocity = 1.0
                
            # Step 3: Calculate Days to Stockout
            days_to_stockout = round(current_stock / predicted_velocity, 1)
            
            # Determine Lead Time based on SKU vendor
            suppliers = get_suppliers_for_sku(sku)
            lead_time = suppliers[0]['lead_time'] if suppliers else 5
            
            # Check if Days to Stockout is less than Lead Time -> Alert triggered
            trigger_alert = days_to_stockout < lead_time
            
            # Generate simulated 7-day predicted demand increments
            forecast_points = []
            for i in range(1, 8):
                day_label = (datetime.date.today() + datetime.timedelta(days=i)).strftime("%d/%m")
                daily_qty = int(random.normalvariate(predicted_velocity, predicted_velocity * 0.1))
                forecast_points.append({"day": day_label, "qty": max(0, daily_qty)})
                
            # Create a professional recommendation message
            rec_sku_name = "Khung gầm Carbon X-1" if sku == 'OMG-9921' else ("Áo khoác Đỏ M" if sku == 'AK-DO-M' else "Sản phẩm")
            if trigger_alert:
                recommendation = (
                    f"⚠️ CẢNH BÁO: Mặt hàng '{rec_sku_name}' ({sku}) hiện còn {current_stock} cái. "
                    f"Tốc độ tiêu thụ dự báo là {predicted_velocity} cái/ngày. Hàng sẽ cạn kho trong {days_to_stockout} ngày nữa. "
                    f"Thời gian giao hàng dự kiến (Lead time) là {lead_time} ngày. Đề xuất kích hoạt quy trình mua hàng đấu thầu khẩn cấp."
                )
            else:
                recommendation = (
                    f"✅ AN TOÀN: Mặt hàng '{rec_sku_name}' ({sku}) hiện còn {current_stock} cái. "
                    f"Đủ cung ứng trong {days_to_stockout} ngày (vượt quá Lead time {lead_time} ngày). "
                    f"Tiếp tục theo dõi chu kỳ bán hàng."
                )
                
            response_data = {
                "sku": sku,
                "velocity": predicted_velocity,
                "days_to_stockout": days_to_stockout,
                "lead_time": lead_time,
                "trigger_alert": trigger_alert,
                "outliers_removed": num_outliers_removed,
                "forecast": forecast_points,
                "recommendation": recommendation
            }

        # 2. Supplier Multi-Criteria Decision-Making (TOPSIS/AHP) Scoring
        elif self.path == '/api/ai/supplier-score':
            sku = req_body.get("sku", "OMG-9921")
            w_quality = float(req_body.get("weight_quality", 30))
            w_lead_time = float(req_body.get("weight_lead_time", 50))
            w_cost = float(req_body.get("weight_cost", 20))
            
            # Standardize weights to sum to 1.0
            total_w = w_quality + w_lead_time + w_cost
            wq = w_quality / total_w
            wl = w_lead_time / total_w
            wc = w_cost / total_w
            
            suppliers = get_suppliers_for_sku(sku)
            
            # TOPSIS / AHP standard calculations
            # Extract criteria values
            qualities = [1.0 - s['defect_rate'] for s in suppliers]  # higher is better
            delays = [s['lead_time'] for s in suppliers]             # lower is better
            costs = [s['unit_cost'] for s in suppliers]              # lower is better
            
            # Compute Min/Max for scaling
            min_q, max_q = min(qualities), max(qualities)
            min_d, max_d = min(delays), max(delays)
            min_c, max_c = min(costs), max(costs)
            
            scored_suppliers = []
            for s in suppliers:
                # 1. Normalize variables to 0-1 (Min-Max Scaling)
                # Benefit criteria: Quality
                if max_q == min_q:
                    norm_q = 1.0
                else:
                    norm_q = ( (1.0 - s['defect_rate']) - min_q ) / (max_q - min_q)
                    
                # Cost criteria: Lead time (lower is better, so standardizing inversely)
                if max_d == min_d:
                    norm_d = 1.0
                else:
                    norm_d = (max_d - s['lead_time']) / (max_d - min_d)
                    
                # Cost criteria: Unit Cost (lower is better)
                if max_c == min_c:
                    norm_c = 1.0
                else:
                    norm_c = (max_c - s['unit_cost']) / (max_c - min_c)
                    
                # 2. Apply weighted matrix multiplication
                total_score = (norm_q * wq + norm_d * wl + norm_c * wc) * 100
                total_score = round(max(10, min(100, total_score)), 0)
                
                scored_suppliers.append({
                    "name": s['name'],
                    "email": s['email'],
                    "lead_time": f"{s['lead_time']} ngày",
                    "qc_passed": f"{(1.0 - s['defect_rate'])*100:.1f}%",
                    "unit_cost": s['unit_cost'],
                    "score": int(total_score)
                })
                
            # Sort by score descending
            scored_suppliers = sorted(scored_suppliers, key=lambda x: x['score'], reverse=True)
            
            response_data = {
                "sku": sku,
                "weights": {"quality": wq, "lead_time": wl, "cost": wc},
                "suppliers": scored_suppliers
            }

        # 3. PO Email Dispatcher Simulation
        elif self.path == '/api/ai/dispatch-po':
            vendor = req_body.get("vendor", "SteelWorks Ltd")
            email = req_body.get("email", "orders@steelworks.co.uk")
            body = req_body.get("body", "")
            sku = req_body.get("sku", "OMG-9921")
            qty = req_body.get("qty", 400)
            
            # Simulate network API mail dispatch delay
            response_data = {
                "status": "success",
                "message": f"📬 API CALL: Đã đóng gói và gửi file PO chuẩn đến email '{email}' của nhà cung cấp '{vendor}' thành công!",
                "po_id": f"PO-AUTO-{random.randint(1000, 9999)}"
            }

        # 4. Inbound OCR manifesting & Scheduling
        elif self.path == '/api/ai/inbound-ocr':
            filename = req_body.get("filename", "invoice_steelworks_992.pdf")
            low_stock_skus = req_body.get("low_stock_skus", [])
            
            # Simulate OCR data mapping depending on document type
            if "steelworks" in filename:
                vendor = "SteelWorks Ltd"
                items = [
                    {"sku": "OMG-9921", "name": "Khung gầm Carbon X-1", "qty": 200, "cost": 1500},
                    {"sku": "OMG-8871", "name": "Chất làm mát Công nghiệp", "qty": 1000, "cost": 15}
                ]
            elif "garment" in filename:
                vendor = "VinaGarment Group"
                items = [
                    {"sku": "AK-DO-M", "name": "Áo khoác - Đỏ - Size M", "qty": 450, "cost": 300}
                ]
            else:
                vendor = "ElectroSupply Co"
                items = [
                    {"sku": "OMG-4452", "name": "Giao diện Neural Link", "qty": 80, "cost": 450}
                ]
                
            # Match items with stockout warnings to calculate scheduling priority points
            priority_score = 0
            priority_reason = "Lịch trình bình thường"
            
            for item in items:
                if item["sku"] in low_stock_skus:
                    priority_score += 50
                    priority_reason = f"Cảnh báo: Lô hàng chứa sản phẩm '{item['sku']}' đang trong tình trạng cháy hàng khẩn cấp!"
                    
            trucks = [
                {"truck": "29C-882.11", "driver": "Nguyễn Văn Tài", "cargo": "Thép tấm OMG-ST", "qty": 200, "time": "08:00 - 10:00 (Sáng mai)", "priority": "Bình thường"},
                {"truck": "51D-991.02", "driver": "Trần Thanh Hùng", "cargo": "Trục khuỷu OMG-HE", "qty": 50, "time": "10:00 - 11:30 (Sáng mai)", "priority": "Bình thường"}
            ]
            
            # Add prioritized truck to slotting Kanban board
            new_truck = {
                "truck": "29H-778.01" if "steelworks" in filename else ("51H-233.09" if "garment" in filename else "29D-441.98"),
                "driver": "Lê Hoàng Hải" if "steelworks" in filename else ("Phạm Minh Trí" if "garment" in filename else "Vương Hồng Phong"),
                "cargo": f"{items[0]['name']} (OCR)",
                "qty": items[0]['qty'],
                "time": "08:00 - 09:30 (Sáng mai) [ƯU TIÊN TUYỆT ĐỐI]" if priority_score > 0 else "13:00 - 14:30 (Chiều mai)",
                "priority": "Khẩn cấp" if priority_score > 0 else "Thường"
            }
            
            if priority_score > 0:
                trucks.insert(0, new_truck)
            else:
                trucks.append(new_truck)
                
            response_data = {
                "vendor": vendor,
                "items": items,
                "priority_score": priority_score,
                "priority_reason": priority_reason,
                "truck_queue": trucks
            }

        # 5. Outbound Priority Dispatch SLA Analyzer (Countdown tracker)
        elif self.path == '/api/ai/outbound-priority':
            # Receive list of current deliveries in queue
            deliveries_list = req_body.get("deliveries", [])
            
            # If empty, feed dummy list for simulation
            if not deliveries_list:
                deliveries_list = [
                    {"id": "OUT-5522", "customer": "BuildMart JSC", "sku": "OMG-9921", "qty": 9, "shipping": "Hỏa tốc 2H", "minutes_left": 45},
                    {"id": "OUT-5523", "customer": "AutoParts VN", "sku": "OMG-4452", "qty": 2, "shipping": "Giao tiết kiệm", "minutes_left": 180},
                    {"id": "OUT-5524", "customer": "MegaRetail Corp", "sku": "AK-DO-M", "qty": 150, "shipping": "Hỏa tốc 2H", "minutes_left": 55},
                    {"id": "OUT-5525", "customer": "VinaProcure", "sku": "OMG-8871", "qty": 300, "shipping": "Đường bộ tiêu chuẩn", "minutes_left": 360}
                ]
                
            # Classify status based on minutes left (SLA deadline)
            prioritized = []
            for d in deliveries_list:
                min_left = int(d.get("minutes_left", 120))
                status = "Thường"
                if min_left <= 60:
                    status = "Khẩn cấp"
                    
                prioritized.append({
                    "id": d["id"],
                    "customer": d["customer"],
                    "sku": d["sku"],
                    "qty": d["qty"],
                    "shipping": d["shipping"],
                    "minutes_left": min_left,
                    "priority": status
                })
                
            # Sort so that emergency orders go first
            prioritized = sorted(prioritized, key=lambda x: (0 if x["priority"] == "Khẩn cấp" else 1, x["minutes_left"]))
            
            response_data = {
                "queue": prioritized
            }

        # 6. Market Basket Analysis & Slotting Recommendations
        elif self.path == '/api/ai/market-basket':
            support = float(req_body.get("support", 15))
            confidence = float(req_body.get("confidence", 70))
            
            # Simulate Apriori/FP-Growth association rule generation on past datasets
            combos = [
                {"itemA": "AK-DO-M", "nameA": "Áo khoác - Đỏ - Size M", "itemB": "GI-TH-42", "nameB": "Giày thể thao", "support": 22, "confidence": 84, "lift": 2.4},
                {"itemA": "OMG-9921", "nameA": "Khung gầm Carbon X-1", "itemB": "OMG-4452", "nameB": "Giao diện Neural Link", "support": 17, "confidence": 78, "lift": 2.1},
                {"itemA": "OMG-8871", "nameA": "Chất làm mát Công nghiệp", "itemB": "OMG-1209", "nameB": "Lõi pin Lithium-Ion V3", "support": 14, "confidence": 72, "lift": 1.9}
            ]
            
            # Filter based on thresholds
            filtered_combos = [c for c in combos if c["support"] >= support and c["confidence"] >= confidence]
            
            # Generate slotting recommendations based on association pairs
            slotting = []
            for c in filtered_combos:
                slotting.append({
                    "itemA": c["itemA"],
                    "nameA": c["nameA"],
                    "itemB": c["itemB"],
                    "nameB": c["nameB"],
                    "advice": f"Gợi ý di chuyển kệ hàng sản phẩm '{c['nameB']}' ({c['itemB']}) về nằm sát kệ sản phẩm '{c['nameA']}' ({c['itemA']})."
                })
                
            response_data = {
                "combos_mined": len(filtered_combos),
                "rules": filtered_combos,
                "slotting_advice": slotting,
                "picker_saved_time": "Tiết kiệm 50% thời gian đi lại lấy hàng của nhân viên nhặt combo."
            }

        # 7. AI Document/File Analyzer
        elif self.path == '/api/ai/analyze-file':
            filename = req_body.get("filename", "danh_sach_san_pham_moi.xlsx")
            filetype = req_body.get("filetype", ".xlsx")
            content = req_body.get("content", "")
            
            # 1. Determine detected type from filename or content
            detected_type = "PRODUCT_LIST"
            confidence = 98.5
            summary = "Danh sách sản phẩm mới"
            
            # diacritics removal for simple parsing
            name_lower = remove_diacritics(filename.lower())
            content_lower = remove_diacritics(content.lower()) if content else ""
            
            if any(w in name_lower or w in content_lower for w in ["nhap kho", "nhap hang", "receipt", "inbound", "nhapkho"]):
                detected_type = "INBOUND_RECEIPT"
                summary = "Phiếu yêu cầu nhập kho (Inbound Receipt)"
            elif any(w in name_lower or w in content_lower for w in ["xuat kho", "xuat hang", "delivery", "outbound", "xuatkho", "manifest"]):
                detected_type = "OUTBOUND_DELIVERY"
                summary = "Phiếu yêu cầu xuất kho (Outbound Delivery)"
            elif any(w in name_lower or w in content_lower for w in ["po", "mua hang", "purchase order", "don mua hang"]):
                detected_type = "PURCHASE_ORDER"
                summary = "Đơn đặt hàng mua (Purchase Order)"
            elif any(w in name_lower or w in content_lower for w in ["chuyen kho", "dieu chuyen", "transfer", "chuyenkho"]):
                detected_type = "INTERNAL_TRANSFER"
                summary = "Lệnh điều chuyển kho nội bộ (Internal Transfer)"
            else:
                detected_type = "PRODUCT_LIST"
                summary = "Danh sách khai báo sản phẩm mới (Product Catalog)"
                
            # 2. Extract data or generate realistic mock data
            extracted_data = []
            
            # If they provided clipboard content, try to parse it first
            if content:
                lines = content.split('\n')
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    # Find SKU: SKU-XXXX or OMG-XXXX or standard alphanumeric with dash
                    sku_match = re.search(r'\b(SKU-[A-Za-z0-9_-]+|OMG-[0-9]+|[A-Z0-9]{3,}-[A-Z0-9]+)\b', line.upper())
                    qty_match = re.search(r'\b(\d+)\b', line)
                    
                    if sku_match:
                        sku = sku_match.group(1)
                        qty = int(qty_match.group(1)) if qty_match else 50
                        # clean name
                        clean_line = line.replace(sku, '').replace(sku.lower(), '')
                        if qty_match:
                            clean_line = clean_line.replace(qty_match.group(1), '')
                        clean_line = re.sub(r'[\:\,\-\t\s\|]+', ' ', clean_line).strip()
                        name = clean_line if len(clean_line) > 3 else f"Sản phẩm {sku}"
                        
                        # category detection
                        category = "ELECTRONICS"
                        if any(w in clean_line.lower() for w in ["nuoc", "chat long", "dau", "fluid", "nuoc giat", "hoa chat"]):
                            category = "FLUIDS"
                        elif any(w in clean_line.lower() for w in ["may", "máy", "machinery", "co khi", "thiet bi"]):
                            category = "HEAVY MACHINERY"
                        elif any(w in clean_line.lower() for w in ["pin", "nang luong", "battery", "solar", "dien"]):
                            category = "ENERGY UNITS"
                            
                        if detected_type == "PRODUCT_LIST":
                            extracted_data.append({
                                "sku": sku,
                                "name": name,
                                "category": category,
                                "stock": qty,
                                "location": f"A-0{random.randint(1,9)}-0{random.randint(1,9)}",
                                "cost": random.choice([50, 100, 200, 500]) * 1000,
                                "price": random.choice([70, 140, 280, 700]) * 1000,
                                "minStock": 10,
                                "maxStock": 500
                            })
                        else:
                            extracted_data.append({
                                "sku": sku,
                                "name": name,
                                "qty": qty
                            })
            
            # If no items extracted, generate high-fidelity mock data based on detected type and filename
            if not extracted_data:
                if detected_type == "PRODUCT_LIST":
                    # Generate some realistic products
                    if "linh kien" in name_lower or "tech" in name_lower or "electronics" in name_lower:
                        extracted_data = [
                            {"sku": "SKU-IPH-16", "name": "Điện thoại Apple iPhone 16 Pro Max", "category": "ELECTRONICS", "stock": 100, "location": "A-02-12", "cost": 25000000, "price": 30000000, "minStock": 10, "maxStock": 200},
                            {"sku": "SKU-LOG-MX", "name": "Chuột không dây Logitech MX Master 3S", "category": "ELECTRONICS", "stock": 250, "location": "A-03-01", "cost": 1800000, "price": 2400000, "minStock": 20, "maxStock": 500},
                            {"sku": "SKU-ASU-RG", "name": "Màn hình Gaming ASUS ROG Swift OLED", "category": "ELECTRONICS", "stock": 35, "location": "A-04-15", "cost": 15000000, "price": 18500000, "minStock": 5, "maxStock": 80}
                        ]
                    elif "may moc" in name_lower or "heavy" in name_lower or "co khi" in name_lower:
                        extracted_data = [
                            {"sku": "SKU-PUM-H2", "name": "Bơm thủy lực áp suất cao HydroMax", "category": "HEAVY MACHINERY", "stock": 12, "location": "B-02-04", "cost": 8500000, "price": 11000000, "minStock": 2, "maxStock": 30},
                            {"sku": "SKU-VLV-S5", "name": "Van điện từ điều áp phi 27", "category": "HEAVY MACHINERY", "stock": 80, "location": "B-01-08", "cost": 450000, "price": 650000, "minStock": 15, "maxStock": 200}
                        ]
                    else:
                        # General default product list
                        extracted_data = [
                            {"sku": "SKU-IPH-16", "name": "Điện thoại Apple iPhone 16 Pro Max", "category": "ELECTRONICS", "stock": 100, "location": "A-02-12", "cost": 25000000, "price": 30000000, "minStock": 10, "maxStock": 200},
                            {"sku": "SKU-LOG-MX", "name": "Chuột không dây Logitech MX Master 3S", "category": "ELECTRONICS", "stock": 250, "location": "A-03-01", "cost": 1800000, "price": 2400000, "minStock": 20, "maxStock": 500},
                            {"sku": "SKU-MIL-K1", "name": "Hộp dầu bôi trơn HeavyLub-X4", "category": "FLUIDS", "stock": 80, "location": "C-01-05", "cost": 350000, "price": 500000, "minStock": 10, "maxStock": 200},
                            {"sku": "SKU-TSL-P2", "name": "Trạm sạc dự phòng Tesla PowerPack V2", "category": "ENERGY UNITS", "stock": 15, "location": "D-04-10", "cost": 12000000, "price": 15500000, "minStock": 3, "maxStock": 50}
                        ]
                elif detected_type == "INBOUND_RECEIPT":
                    partner = "FastCorp Ltd"
                    if "steel" in name_lower:
                        partner = "SteelWorks Ltd"
                    elif "vina" in name_lower:
                        partner = "VinaGarment Group"
                    
                    extracted_data = {
                        "partner": partner,
                        "items": [
                            {"sku": "OMG-9921", "name": "Khung gầm Carbon X-1", "qty": 150},
                            {"sku": "OMG-8871", "name": "Chất làm mát Công nghiệp", "qty": 400}
                        ]
                    }
                elif detected_type == "OUTBOUND_DELIVERY":
                    partner = "Lazada Logistics"
                    if "shopee" in name_lower:
                        partner = "Shopee Express"
                    elif "tiki" in name_lower:
                        partner = "TikiNOW"
                        
                    extracted_data = {
                        "partner": partner,
                        "items": [
                            {"sku": "OMG-9921", "name": "Khung gầm Carbon X-1", "qty": 30},
                            {"sku": "AK-DO-M", "name": "Áo khoác - Đỏ - Size M", "qty": 100}
                        ]
                    }
                elif detected_type == "PURCHASE_ORDER":
                    vendor = "TechParts Distribution"
                    if "supplier" in name_lower:
                        vendor = "Supplier Global"
                        
                    extracted_data = {
                        "vendor": vendor,
                        "items": [
                            {"sku": "OMG-9921", "name": "Khung gầm Carbon X-1", "qty": 500},
                            {"sku": "OMG-4452", "name": "Giao diện Neural Link", "qty": 100}
                        ]
                    }
                elif detected_type == "INTERNAL_TRANSFER":
                    extracted_data = {
                        "fromWh": "Kho Chính HCMC",
                        "toWh": "Kho Phụ Bình Dương",
                        "items": [
                            {"sku": "OMG-9921", "name": "Khung gầm Carbon X-1", "qty": 20},
                            {"sku": "OMG-8871", "name": "Chất làm mát Công nghiệp", "qty": 50}
                        ]
                    }
            
            # Format return data
            response_data = {
                "detected_type": detected_type,
                "confidence": confidence,
                "summary": summary,
                "data": extracted_data,
                "logs": [
                    "🚀 [OCR & ML ENGINE] Khởi chạy tác vụ phân tích cấu trúc tài liệu...",
                    f"📂 Tên file nhận diện: {filename} ({filetype})",
                    "🔍 Thực hiện giải mã Blob & trích xuất văn bản thô...",
                    "🧠 Chạy mô hình phân đoạn tài liệu LayoutLMv3...",
                    f"✅ Nhận diện phân loại tài liệu thành công: {detected_type} (Độ tin cậy: {confidence}%)",
                    f"📦 Trích xuất được {len(extracted_data) if isinstance(extracted_data, list) else len(extracted_data.get('items', []))} dòng dữ liệu phù hợp.",
                    "📝 Tiến hành đối soát cú pháp SKU và đơn vị số lượng..."
                ]
            }

        self.wfile.write(json.dumps(response_data).encode('utf-8'))

if __name__ == '__main__':
    print(f"=== OMEGA REFACTORED AI BACKEND SERVER RUNNING ON PORT {PORT} ===")
    print(f"-> Proxy endpoint configured at /api/ai")
    print(f"-> Supported endpoints:")
    print(f"   * POST /api/ai/forecast")
    print(f"   * POST /api/ai/supplier-score")
    print(f"   * POST /api/ai/dispatch-po")
    print(f"   * POST /api/ai/inbound-ocr")
    print(f"   * POST /api/ai/outbound-priority")
    print(f"   * POST /api/ai/market-basket")
    
    # Start weather background thread
    weather_thread = WeatherWorkerThread()
    weather_thread.start()
    
    server = http.server.HTTPServer(('127.0.0.1', PORT), AIServerHandler)
    server.serve_forever()
