# KẾ HOẠCH TÍCH HỢP GEMMA-WAREHOUSE VÀO BACKEND LOCAL

Theo yêu cầu của bạn, chúng ta sẽ xây dựng một **Backend Server độc lập** dành riêng cho model `gemma4-warehouse`. Toàn bộ code sẽ nằm gọn trong thư mục `gemma 4 2b`, tuyệt đối không can thiệp vào mã nguồn của `HE_THONG_NAO`.

## 1. Kiến trúc kỹ thuật (Tech Stack)

Để mô hình trả lời mượt mà, phản hồi ngay lập tức thay vì bắt hệ thống phải chờ đợi, phương pháp tối ưu nhất là sử dụng kiến trúc **Asynchronous Streaming (Luồng bất đồng bộ)**.

- **Web Framework**: `FastAPI` (Python) - Nhanh, hiện đại, hỗ trợ native `async`/`await`.
- **Giao tiếp AI**: Thư viện `ollama` (Python) - Giao tiếp trực tiếp với engine Ollama Local để gọi model `gemma4-warehouse`.
- **Cơ chế trả kết quả**: `Server-Sent Events (SSE)` thông qua `StreamingResponse`. Khi AI nghĩ ra chữ nào, Backend sẽ đẩy ngay chữ đó qua API (giống cơ chế gõ chữ của ChatGPT), giảm độ trễ xuống mức mili-giây.
- **Bảo toàn ngữ cảnh**: Dùng kỹ thuật **Sliding Window Memory** ở mức cơ bản để lưu lịch sử chat tạm thời, tránh bị tràn bộ nhớ 8192 token của model.

## 2. Cấu trúc thư mục (Chỉ trong `gemma 4 2b`)

```text
gemma 4 2b/
├── Modelfile              # Đã có
├── knowledge_base.txt     # Đã có
├── README.md              # Đã có
├── run_local.bat          # Đã có
├── requirements.txt       # [MỚI] Chứa các thư viện: fastapi, uvicorn, ollama
├── backend_api.py         # [MỚI] Chứa code FastAPI chạy ở cổng 8001
└── run_backend.bat        # [MỚI] Script tự động cài thư viện và khởi động API
```

## 3. Các bước thực hiện chi tiết

### Bước 1: Khởi tạo môi trường
- Tạo file `requirements.txt`.
- Viết file `run_backend.bat` để tự động kích hoạt môi trường Python (dùng Python 3.13 có sẵn trên máy bạn) và cài đặt các pip packages nếu chưa có.

### Bước 2: Xây dựng Backend Server (`backend_api.py`)
- Khởi tạo app FastAPI, cấu hình `CORSMiddleware` cho phép mọi nguồn truy cập.
- Định nghĩa Data Schema (Pydantic model) nhận một mảng `messages` (gồm user/assistant history).
- Xây dựng hàm `async def generate_chat_stream()` kết nối với `ollama.AsyncClient()`.
- Mở API Endpoint: `POST /api/chat`. API này sẽ trả về một `StreamingResponse(media_type="text/event-stream")`.

> [!TIP]
> **Cổng (Port) hoạt động**: Vì Backend cũ của bạn trong hệ thống đang chạy ở cổng `8000`, tôi sẽ thiết lập Backend mới này chạy ở cổng **`8001`** (`http://localhost:8001/api/chat`) để tránh bị xung đột.

## Xin ý kiến duyệt kế hoạch
Bạn xem qua kiến trúc **FastAPI Streaming Backend** này nhé. Nếu bạn đồng ý, tôi sẽ tiến hành viết 3 file (`requirements.txt`, `backend_api.py`, `run_backend.bat`) ngay bây giờ!
