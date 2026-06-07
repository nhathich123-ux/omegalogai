# -*- coding: utf-8 -*-
import os
import json
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "knowledge_base.db")

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

def create_pdf_from_text(file_path, title, text):
    from fpdf import FPDF
    import os
    
    pdf = FPDF()
    pdf.add_page()
    
    # Windows Arial font path for Vietnamese Unicode characters
    font_path = r"C:\Windows\Fonts\arial.ttf"
    font_bold_path = r"C:\Windows\Fonts\arialbd.ttf"
    
    has_font = os.path.exists(font_path)
    if has_font:
        pdf.add_font("ArialUnicode", "", font_path)
        if os.path.exists(font_bold_path):
            pdf.add_font("ArialUnicode", "B", font_bold_path)
        pdf.set_font("ArialUnicode", "B", size=16)
    else:
        pdf.set_font("Helvetica", "B", size=16)
        
    # Title
    pdf.cell(0, 10, title, align="C")
    pdf.ln(15)
    
    if has_font:
        pdf.set_font("ArialUnicode", "", size=11)
    else:
        pdf.set_font("Helvetica", "", size=11)
        
    paragraphs = text.split('\n')
    for p in paragraphs:
        p_clean = p.strip()
        if not p_clean:
            pdf.ln(5)
            continue
            
        if p_clean.startswith("###"):
            if has_font:
                pdf.set_font("ArialUnicode", "B", size=12)
            else:
                pdf.set_font("Helvetica", "B", size=12)
            pdf.multi_cell(0, 7, p_clean.replace("###", "").strip())
            if has_font:
                pdf.set_font("ArialUnicode", "", size=11)
            else:
                pdf.set_font("Helvetica", "", size=11)
            pdf.ln(2)
        elif p_clean.startswith("##"):
            if has_font:
                pdf.set_font("ArialUnicode", "B", size=13)
            else:
                pdf.set_font("Helvetica", "B", size=13)
            pdf.multi_cell(0, 8, p_clean.replace("##", "").strip())
            if has_font:
                pdf.set_font("ArialUnicode", "", size=11)
            else:
                pdf.set_font("Helvetica", "", size=11)
            pdf.ln(2)
        elif p_clean.startswith("#"):
            if has_font:
                pdf.set_font("ArialUnicode", "B", size=14)
            else:
                pdf.set_font("Helvetica", "B", size=14)
            pdf.multi_cell(0, 9, p_clean.replace("#", "").strip())
            if has_font:
                pdf.set_font("ArialUnicode", "", size=11)
            else:
                pdf.set_font("Helvetica", "", size=11)
            pdf.ln(2)
        else:
            pdf.multi_cell(0, 6, p_clean)
            pdf.ln(2)
            
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    pdf.output(file_path)

def init_db(force=False):
    print("=" * 60)
    print("INITIALIZING SQLITE DATABASE")
    print("=" * 60)
    
    if os.path.exists(DB_PATH) and not force:
        print(f"[INFO] Database already exists at: {DB_PATH}")
        print("[INFO] Use force=True to re-create it. Skipping initialization.")
        print("=" * 60)
        return
        
    if os.path.exists(DB_PATH) and force:
        try:
            os.remove(DB_PATH)
            print("[INFO] Deleted existing database to perform clean initialization.")
        except Exception as e:
            print(f"[WARNING] Could not delete existing database: {e}")

    # Import seed data from seed_data.py
    try:
        from .seed_data import KNOWLEDGE_BASE, DEEP_EXPLANATIONS, EXECUTION_GUIDES, STEP_EXPLANATIONS
    except ImportError:
        import seed_data
        from seed_data import KNOWLEDGE_BASE, DEEP_EXPLANATIONS, EXECUTION_GUIDES, STEP_EXPLANATIONS

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS config (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS abbreviations (
            abbr TEXT PRIMARY KEY,
            expansion TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS topics (
            id TEXT PRIMARY KEY,
            category TEXT,
            title TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS training_samples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id TEXT,
            phrase TEXT,
            FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id TEXT,
            content TEXT,
            FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS keywords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id TEXT,
            word TEXT,
            FOREIGN KEY (topic_id) REFERENCES topics (id) ON DELETE CASCADE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS model_states (
            model_name TEXT PRIMARY KEY,
            state_data TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS deep_explanations (
            topic_id TEXT PRIMARY KEY,
            content TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS execution_steps (
            topic_id TEXT PRIMARY KEY,
            content TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS step_explanations (
            topic_id TEXT,
            step_num INTEGER,
            content TEXT,
            PRIMARY KEY (topic_id, step_num)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS uploaded_documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doc_name TEXT UNIQUE,
            upload_date TEXT,
            char_count INTEGER,
            status TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS vector_chunks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doc_name TEXT,
            chunk_content TEXT,
            section_ref TEXT,
            embedding TEXT
        )
    """)

    # Populate config
    config_keys = ["bot_name", "bot_personality", "initial_greeting"]
    for key in config_keys:
        if key in KNOWLEDGE_BASE:
            cursor.execute("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)", (key, str(KNOWLEDGE_BASE[key])))
            
    # Handle initial_suggestions and fallback_responses as JSON arrays
    if "initial_suggestions" in KNOWLEDGE_BASE:
        cursor.execute("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)", 
                       ("initial_suggestions", json.dumps(KNOWLEDGE_BASE["initial_suggestions"], ensure_ascii=False)))
                       
    if "fallback_responses" in KNOWLEDGE_BASE:
        cursor.execute("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)", 
                       ("fallback_responses", json.dumps(KNOWLEDGE_BASE["fallback_responses"], ensure_ascii=False)))

    # Populate abbreviations
    if "abbreviation_map" in KNOWLEDGE_BASE:
        for abbr, val in KNOWLEDGE_BASE["abbreviation_map"].items():
            cursor.execute("INSERT OR REPLACE INTO abbreviations (abbr, expansion) VALUES (?, ?)", (abbr, val))

    # Populate topics and details
    if "topics" in KNOWLEDGE_BASE:
        for topic in KNOWLEDGE_BASE["topics"]:
            tid = topic["id"]
            cat = topic.get("category", "procedure")
            title = topic.get("title", "")
            
            # Insert topic
            cursor.execute("INSERT OR REPLACE INTO topics (id, category, title) VALUES (?, ?, ?)", (tid, cat, title))
            
            # Insert training samples
            for phrase in topic.get("training_samples", []):
                cursor.execute("INSERT INTO training_samples (topic_id, phrase) VALUES (?, ?)", (tid, phrase))
                
            # Insert responses
            for resp in topic.get("responses", []):
                cursor.execute("INSERT INTO responses (topic_id, content) VALUES (?, ?)", (tid, resp))
                
            # Insert keywords
            for kw in topic.get("keywords", []):
                cursor.execute("INSERT INTO keywords (topic_id, word) VALUES (?, ?)", (tid, kw))

    # Populate deep_explanations
    for tid, content in DEEP_EXPLANATIONS.items():
        cursor.execute("INSERT OR REPLACE INTO deep_explanations (topic_id, content) VALUES (?, ?)", (tid, content))

    # Populate execution_steps
    for tid, content in EXECUTION_GUIDES.items():
        cursor.execute("INSERT OR REPLACE INTO execution_steps (topic_id, content) VALUES (?, ?)", (tid, content))

    # Populate step_explanations
    for tid, steps in STEP_EXPLANATIONS.items():
        for step_num, content in steps.items():
            cursor.execute("INSERT OR REPLACE INTO step_explanations (topic_id, step_num, content) VALUES (?, ?, ?)", (tid, step_num, content))

    # Pre-seed uploaded_documents and vector_chunks with default warehouse manuals
    default_docs = {
        "Quy-trinh-nhap-kho.pdf": ("receiving-goods", "Quy trình nhập hàng vào kho"),
        "Quy-trinh-xuat-kho.pdf": ("shipping-goods", "Quy trình xuất hàng khỏi kho"),
        "Quy-trinh-xu-ly-hang-rach-hong.pdf": ("damaged-goods", "Xử lý hàng rách hộp / hàng hỏng khi nhập"),
        "Huong-dan-dong-goi-hang-de-vo.pdf": ("fragile-packaging", "Quy trình đóng gói hàng dễ vỡ"),
        "Huong-dan-van-hanh-may-in-ma-vach.pdf": ("barcode-printer", "Hướng dẫn vận hành máy in mã vạch"),
        "Quy-tac-an-toan-lao-dong.pdf": ("safety-rules", "Quy tắc an toàn lao động trong kho"),
    }

    import datetime
    now_str = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")

    # Mapping of topic_id to actual topics loaded from KNOWLEDGE_BASE
    topic_map = {}
    if "topics" in KNOWLEDGE_BASE:
        for t in KNOWLEDGE_BASE["topics"]:
            topic_map[t["id"]] = t

    for doc_name, (tid, title) in default_docs.items():
        # Build text content dynamically from seed data
        text_parts = [f"# {title}\n"]
        
        # 1. Topic responses
        if tid in topic_map:
            for resp in topic_map[tid].get("responses", []):
                text_parts.append(resp)
                
        # 2. Deep explanation
        if tid in DEEP_EXPLANATIONS:
            text_parts.append(DEEP_EXPLANATIONS[tid].replace("{topic_title}", title))
            
        # 3. Execution steps
        if tid in EXECUTION_GUIDES:
            text_parts.append(EXECUTION_GUIDES[tid])
            
        # 4. Step explanations
        if tid in STEP_EXPLANATIONS:
            for step_num, content in STEP_EXPLANATIONS[tid].items():
                text_parts.append(f"## Bước {step_num}\n{content}")
                
        full_text = "\n\n".join(text_parts)
        char_count = len(full_text)
        
        # Insert document
        cursor.execute("INSERT OR REPLACE INTO uploaded_documents (doc_name, upload_date, char_count, status) VALUES (?, ?, ?, ?)",
                       (doc_name, now_str, char_count, "Đã số hóa"))
                       
        chunks = chunk_text(full_text, chunk_size=600, overlap=150)
        for idx, chunk_content in enumerate(chunks):
            section_ref = f"Mục {idx+1}"
            cursor.execute("INSERT INTO vector_chunks (doc_name, chunk_content, section_ref, embedding) VALUES (?, ?, ?, ?)",
                           (doc_name, chunk_content, section_ref, ""))
                           
        # Generate physical PDF file in backend/uploads
        uploads_dir = os.path.join(BASE_DIR, "uploads")
        os.makedirs(uploads_dir, exist_ok=True)
        pdf_file_path = os.path.join(uploads_dir, doc_name)
        try:
            create_pdf_from_text(pdf_file_path, title, full_text)
            print(f"[INFO] Generated physical PDF: {pdf_file_path}")
        except Exception as e:
            print(f"[WARNING] Could not generate physical PDF {doc_name}: {e}")

    conn.commit()
    conn.close()
    
    print("[SUCCESS] Seeded all data to knowledge_base.db successfully!")
    print(f"Database location: {DB_PATH}")
    print("=" * 60)

if __name__ == "__main__":
    init_db(force=True)
