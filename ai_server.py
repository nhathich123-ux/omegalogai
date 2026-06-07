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
    'ní': 'bạn', 'ni': 'bạn',
    'atld': 'an toàn lao động',
    'sp': 'sản phẩm',
    'ncc': 'nhà cung cấp',
}

def remove_diacritics(text):
    return "".join(DIACRITICS_MAP.get(c, c) for c in text)

def clean_text(text):
    import unicodedata
    text = unicodedata.normalize('NFC', text.lower())
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def normalize_vietnamese_query(query):
    query_cleaned = clean_text(query)
    words = query_cleaned.split()
    expanded_words = []
    for word in words:
        if word in ABBREVIATION_MAP:
            expanded_words.append(ABBREVIATION_MAP[word])
        else:
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
    
    best_rule = None
    best_score = 0
    
    for rule in rules:
        score = 0
        keywords = rule.get('keywords', [])
        
        # 1. So khớp các từ khóa
        for kw in keywords:
            kw_norm = normalize_vietnamese_query(kw)
            kw_no_diac = remove_diacritics(kw_norm)
            
            # Khớp trực tiếp hoặc chứa chuỗi con
            if kw_no_diac in query_no_diac or kw_no_diac in query_orig_no_diac:
                score += 5
            
            # Khớp cấp độ từ
            kw_words = kw_no_diac.split()
            query_words = query_no_diac.split()
            overlap = set(kw_words) & set(query_words)
            score += len(overlap) * 2

        # 2. So khớp tiêu đề
        title_vi = rule.get('title_vi', '')
        title_no_diac = remove_diacritics(clean_text(title_vi))
        title_words = title_no_diac.split()
        query_words = query_no_diac.split()
        title_overlap = set(title_words) & set(query_words)
        score += len(title_overlap) * 3
        
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
            cost_vnd = po.get('total', 0) * 23000
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

def query_seed_data(query, lang='vi'):
    if not SEED_DATA:
        return None, 0, ""

    query_norm = normalize_vietnamese_query(query)
    query_no_diac = remove_diacritics(query_norm)
    query_orig_no_diac = remove_diacritics(clean_text(query))
    
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
        
        for kw in topic.get('keywords', []):
            kw_norm = normalize_vietnamese_query(kw)
            kw_no_diac = remove_diacritics(kw_norm)
            if kw_no_diac in query_no_diac or kw_no_diac in query_orig_no_diac:
                score += 5
            kw_words = kw_no_diac.split()
            query_words = query_no_diac.split()
            overlap = set(kw_words) & set(query_words)
            score += len(overlap) * 2
            
        for sample in topic.get('training_samples', []):
            sample_norm = normalize_vietnamese_query(sample)
            sample_no_diac = remove_diacritics(sample_norm)
            if sample_no_diac in query_no_diac or query_no_diac in sample_no_diac:
                score += 4
            
        title = topic.get('title', '')
        title_no_diac = remove_diacritics(clean_text(title))
        if title_no_diac in query_no_diac:
            score += 6
            
        if score > best_score:
            best_score = score
            best_topic = topic
            
    if best_topic and best_score >= 2:
        topic_id = best_topic['id']
        title = best_topic.get('title', '')
        
        if is_deep_request and topic_id in SEED_DATA.DEEP_EXPLANATIONS:
            explanation = SEED_DATA.DEEP_EXPLANATIONS[topic_id]
            response = f"🎯 [GIẢI THÍCH SÂU - CHỦ ĐỀ: {title.upper()}]\n\n{explanation}"
            source = f"OMEGA RAG [Đào sâu Kiến thức - Match: {best_score}%]"
            return response, best_score, source
            
        if is_guide_request and topic_id in SEED_DATA.EXECUTION_GUIDES:
            guide = SEED_DATA.EXECUTION_GUIDES[topic_id]
            response = f"🛠️ [HƯỚNG DẪN THỰC HÀNH - CHỦ ĐỀ: {title.upper()}]\n\n{guide}"
            source = f"OMEGA RAG [Cẩm nang Vận hành - Match: {best_score}%]"
            return response, best_score, source
            
        if (is_steps_request or requested_step) and topic_id in SEED_DATA.STEP_EXPLANATIONS:
            steps_dict = SEED_DATA.STEP_EXPLANATIONS[topic_id]
            if requested_step and requested_step in steps_dict:
                response = f"📌 [BƯỚC {requested_step} - CHỦ ĐỀ: {title.upper()}]\n\n{steps_dict[requested_step]}"
            else:
                steps_text = "\n\n".join([f"🔸 {v}" for k, v in sorted(steps_dict.items())])
                response = f"📋 [CÁC BƯỚC QUY TRÌNH - CHỦ ĐỀ: {title.upper()}]\n\n{steps_text}"
            source = f"OMEGA RAG [Chi tiết Từng bước - Match: {best_score}%]"
            return response, best_score, source
            
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
            return response, best_score, source
            
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

WEATHER_CONFIG_PATH = 'weather_config.json'
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
                
                updated = {
                    "registeredAccounts": req_body.get("registeredAccounts", current.get("registeredAccounts")),
                    "faceIdAccounts": req_body.get("faceIdAccounts", current.get("faceIdAccounts", []))
                }
                
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
        elif self.path == '/api/ai/chatbot':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            message = req_body.get("message", "")
            lang = req_body.get("lang", "vi")
            wms_state = req_body.get("wms_state", None)
            
            # 1. Try querying live WMS state database
            wms_response = query_wms_state(message, wms_state, lang)
            if wms_response:
                self.wfile.write(json.dumps({"response": wms_response, "source": "Cơ sở dữ liệu OMEGA Live Database"}).encode('utf-8'))
                return
                
            # 2. Try querying seed data from data_nhan (explanations, guides, steps, chitchats)
            seed_response, seed_score, seed_source = query_seed_data(message, lang)
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
                self.wfile.write(json.dumps({"response": response, "source": source}).encode('utf-8'))
                return
                
            # 4. Fallback to seed chitchat responses (even if low score)
            if seed_response:
                self.wfile.write(json.dumps({"response": seed_response, "source": seed_source}).encode('utf-8'))
                return

            # 5. Generative Fallback
            source = "OMEGA Generative LLM"
            if lang == 'vi':
                response = (
                    f"🤖 Hệ thống không tìm thấy quy trình SOP trực tiếp khớp chính xác với câu hỏi của ní: \"{message}\".\n\n"
                    "Tuy nhiên, theo tiêu chuẩn quản lý kho OMEGA WMS, ní có thể tham khảo:\n"
                    "• Đảm bảo mọi giao dịch quét mã vạch (Putaway/Pick) đúng vị trí kệ.\n"
                    "• Ghi nhận biên bản bất kỳ sự cố chênh lệch tồn kho nào lớn hơn 2%.\n"
                    "• Đảm bảo lối đi và thiết bị cứu hỏa luôn thông thoáng.\n\n"
                    "Ní có thể thêm quy trình này vào cẩm nang SOP trong tab Huấn luyện AI của hệ thống nha!"
                )
            else:
                response = (
                    f"🤖 No direct SOP matches found for: \"{message}\".\n\n"
                    "General OMEGA WMS Warehouse standard guidelines:\n"
                    "• Ensure all barcode scans (Putaway/Pick) align with the WMS instructions.\n"
                    "• File a report for any inventory discrepancy exceeding 2%.\n"
                    "• Keep exits, panels, and fire fighting equipment unobstructed.\n\n"
                    "You can add this SOP to the database via the AI Training tab!"
                )
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
    
    server = http.server.HTTPServer(('0.0.0.0', PORT), AIServerHandler)
    server.serve_forever()
