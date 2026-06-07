import json
import ollama
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Local Gemma 2B Warehouse AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tên model đã được build sẵn qua Modelfile (chứa trọn bộ Tri thức)
MODEL_NAME = "gemma4-warehouse"

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # Giữ lại 10 tin nhắn gần nhất làm context tránh quá tải RAM
    messages = request.messages[-10:]
    
    async def stream_generator():
        try:
            client = ollama.AsyncClient()
            # Gọi model gemma4-warehouse chạy 100% Offline trên máy bạn
            async for chunk in await client.chat(
                model=MODEL_NAME,
                messages=messages,
                stream=True
            ):
                content = chunk.get("message", {}).get("content", "")
                if content:
                    # Gửi text xuống Frontend
                    yield f"data: {json.dumps({'content': content})}\n\n"
                    
        except Exception as e:
            yield f"data: {json.dumps({'content': f'<br>*(Lỗi Ollama: {str(e)}. Hãy đảm bảo phần mềm Ollama đang mở!)*'})}\n\n"

    return StreamingResponse(stream_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5173)
