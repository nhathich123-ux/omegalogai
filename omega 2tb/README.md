# OMEGA-AI Warehouse Assistant (Gemma 4 2B Local)

## Mô tả
Hệ thống **Gemma 4 2B** được cấu hình với tri thức từ file `Ý tưởng chính.docx` và `Chức năng omega.docx` để trở thành trợ lý AI chuyên gia về **quản lý kho hàng thông minh** (Smart Warehouse Management). 
Hệ thống hoạt động **100% Offline (Local)** không tốn chi phí API, độ bảo mật cao.

## 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG

### Bước 1: Build Model (Chỉ cần làm 1 lần)
Bạn cần nạp tri thức vào não AI thông qua file `Modelfile`. 
Mở Terminal tại thư mục này và gõ:
```bash
ollama create gemma4-warehouse -f Modelfile
```
*(Lưu ý: Bạn cũng có thể click đúp vào file `run_local.bat`, hệ thống sẽ tự động kiểm tra và build nếu chưa có).*

### Bước 2: Chạy Backend API (FastAPI)
Để có thể "ráp" AI vào giao diện Frontend, bạn cần mở một Backend làm cầu nối. 
Chỉ cần **click đúp vào file `run_backend.bat`**. 
- Script sẽ tự động cài thư viện cần thiết (FastAPI, Ollama).
- Tự động mở một Server chạy tại cổng: `http://localhost:5173`.

---

## 💻 HƯỚNG DẪN RÁP VÀO FRONTEND

Sau khi chạy Backend thành công (Bước 2), bạn có thể gọi AI từ bất kỳ Frontend nào (HTML/JS, React, Vue,...) bằng kỹ thuật **Server-Sent Events (SSE)** để hiệu ứng chữ chạy ra từng từ một (như ChatGPT).

Dưới đây là đoạn code JavaScript mẫu để ráp vào Frontend:

```javascript
// Cấu trúc mảng tin nhắn (lịch sử chat)
const messages = [
    { role: "user", content: "Xin chào, kho có những chức năng gì?" }
];

async function callOMEGAAI() {
    try {
        // Gọi API tới Backend bạn đang chạy ở cổng 5173
        const response = await fetch("http://localhost:5173/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: messages })
        });

        // Đọc dữ liệu luồng (Stream Reader)
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const data = JSON.parse(line.substring(6));
                    // IN RA TỪNG CHỮ LÊN MÀN HÌNH FRONTEND
                    console.log(data.content); 
                    // (Bạn thay console.log bằng hàm update DOM HTML, vd: div.innerHTML += data.content)
                }
            }
        }
    } catch (err) {
        console.error("Lỗi mất kết nối Backend:", err);
    }
}
```

> 💡 **Mẹo:** Bạn có thể mở trực tiếp file `test_client.html` (nhấp đúp bằng Chrome) để xem giao diện Chat mẫu tôi đã viết sẵn HTML/CSS và tự động ráp logic trên.

---

## Tri thức đã được nhúng
Hệ thống am hiểu sâu sắc về:
1. **AI Dự báo tồn kho** (Demand Forecasting)
2. **Định vị vị trí lưu kho** (Barcode Slotting)
3. **AI Nhận diện đơn hàng nhập** (Inbound Logistics AI)
4. **AI Phân tích giỏ hàng** (Market Basket Analysis)
5. **Chatbot cẩm nang nhân viên** (Internal Knowledge Base LLM)
6. **AI Chấm điểm nhà cung cấp** (Supplier Scoring)
7. **Cảnh báo bất thường & thất thoát** (Anomaly Detection)

## Cấu trúc thư mục
```
gemma 4 2b/
├── Modelfile              # File cấu hình nhúng Tri thức cho Ollama
├── backend_api.py         # Code Python chạy Backend Server kết nối Ollama
├── run_backend.bat        # Nhấp đúp để tự cài thư viện & bật Backend API
├── run_local.bat          # Nhấp đúp để chat trực tiếp trên Terminal (Terminal AI)
├── test_client.html       # File Web Frontend mẫu đã ráp sẵn API để test
├── requirements.txt       # Danh sách thư viện Python
└── README.md              # File hướng dẫn này
```

> ⚠️ **Chú ý:** Project này được cách ly độc lập 100%, KHÔNG can thiệp vào mã nguồn gốc của hệ thống `HE_THONG_NAO`.
