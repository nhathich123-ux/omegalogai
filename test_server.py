import http.server
import socketserver
import urllib.request
import threading
import time

PORT = 8001

class TestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

def run_server():
    with socketserver.TCPServer(("127.0.0.1", PORT), TestHandler) as httpd:
        print(f"Test server running on port {PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    t = threading.Thread(target=run_server)
    t.daemon = True
    t.start()
    
    time.sleep(1)
    
    # Try connecting
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/", timeout=2) as response:
            print("Response:", response.read().decode())
    except Exception as e:
        print("Failed to connect:", e)
