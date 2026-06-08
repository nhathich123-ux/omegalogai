import urllib.request
import json
import sys

# Set stdout to handle Vietnamese characters safely
sys.stdout.reconfigure(encoding='utf-8')

url = "http://127.0.0.1:8000/api/ai/chatbot"
headers = {"Content-Type": "application/json"}

queries = [
    "nhap hnag lam s",     # typo + abbreviations (nhap hang lam sao)
    "mêt wa ni oi",        # tiredness complaint + telex + slang (mệt quá ní ơi)
    "atld co bat buoc k",  # abbreviation (an toan lao dong co bat buoc khong)
    "may gioi qua di",     # praise (mày giỏi quá đi)
    "fefo la gi vay",      # slang/jargon query
    "do vui logistics",    # riddle request
    "nghi ti uong cafe"    # break time
]

print("=== STARTING CHATBOT BACKEND TESTS ===")
for q in queries:
    print(f"\nUser query: \"{q}\"")
    data = json.dumps({"message": q, "lang": "vi"}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            print(f"Bot response: {res_data.get('response')}")
            print(f"Source: {res_data.get('source')}")
    except Exception as e:
        print(f"Request failed: {e}")
print("\n=== BACKEND TESTS COMPLETED ===")
