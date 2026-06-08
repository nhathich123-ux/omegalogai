import urllib.request
import json
import sys
import threading
import http.server
import time

sys.stdout.reconfigure(encoding='utf-8')

# Import the server handler from ai_server
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ai_server import AIServerHandler, PORT

PORT = 8003

def run_server():
    server = http.server.HTTPServer(('127.0.0.1', PORT), AIServerHandler)
    server.serve_forever()

if __name__ == "__main__":
    t = threading.Thread(target=run_server)
    t.daemon = True
    t.start()
    
    time.sleep(1.5)
    
    url = f"http://127.0.0.1:{PORT}/api/ai/chatbot"
    headers = {"Content-Type": "application/json"}
    
    # Test cases: (message, user_info)
    test_cases = [
        # Case 1: Greeting with 'ní'
        ("yo ní, chào ní", {"email": "test1@omega.io", "name": "Admin"}),
        # Case 2: Subsequent message to check if it remembers 'ní' and 'tui'
        ("quy trình nhập kho là gì vậy", {"email": "test1@omega.io", "name": "Admin"}),
        # Case 3: Name introduction
        ("tui tên là Hoàng, rất vui được gặp", {"email": "test1@omega.io", "name": "Admin"}),
        # Case 4: Subsequent message to check name personalization
        ("nhắc lại tên tui xem nào", {"email": "test1@omega.io", "name": "Admin"}),
        # Case 5: Talking with 'mày' / 'tao'
        ("mày có biết lái xe nâng không", {"email": "test2@omega.io", "name": "Admin"}),
        # Case 6: Addressing bot as 'sếp'
        ("chào sếp nhé", {"email": "test3@omega.io", "name": "Admin"}),
        # Case 7: Typo + Telex handling
        ("atld co bat buoc k", {"email": "test4@omega.io", "name": "Admin"})
    ]
    
    print("=== STARTING ADVANCED CHATBOT PERSONALIZATION TESTS ===")
    for i, (msg, user) in enumerate(test_cases, 1):
        print(f"\n[Test {i}] User says: \"{msg}\" (User: {user.get('email')})")
        payload = {
            "message": msg,
            "lang": "vi",
            "user": user
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=3) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                print(f"Bot replies: {res_data.get('response')}")
        except Exception as e:
            print(f"Request failed: {e}")
            
    print("\n=== ADVANCED TESTS COMPLETED ===")
