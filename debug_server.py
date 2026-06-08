import http.server
import json
import urllib.request
import threading
import time
import sys
import os

# Import the server handler from ai_server
sys.path.append(os.path.dirname(__file__))
from ai_server import AIServerHandler, PORT

def run_server():
    server = http.server.HTTPServer(('127.0.0.1', 8002), AIServerHandler)
    print("Debug server listening on 8002...")
    server.serve_forever()

if __name__ == "__main__":
    t = threading.Thread(target=run_server)
    t.daemon = True
    t.start()
    
    time.sleep(2)
    
    # Try status check
    print("Testing GET /api/ai/status...")
    try:
        with urllib.request.urlopen("http://127.0.0.1:8002/api/ai/status", timeout=2) as r:
            print("Status response:", r.read().decode())
    except Exception as e:
        print("GET failed:", e)
        
    # Try chatbot query
    print("Testing POST /api/ai/chatbot...")
    try:
        data = json.dumps({"message": "hello", "lang": "vi"}).encode("utf-8")
        req = urllib.request.Request(
            "http://127.0.0.1:8002/api/ai/chatbot",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=5) as r:
            print("Chatbot response:", r.read().decode())
    except Exception as e:
        print("POST failed:", e)
