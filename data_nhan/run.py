# -*- coding: utf-8 -*-
import os
import sys

# Ensure stdout handles Vietnamese Unicode characters on Windows console
if sys.platform.startswith("win"):
    import codecs
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Add backend directory to Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
sys.path.insert(0, BACKEND_DIR)

# pyrefly: ignore [missing-import]
from server import app, initialize_engine

if __name__ == "__main__":
    print("=" * 60)
    print("  LAUNCHING CHATBOT BACKEND SERVER")
    print("  Entrypoint: run.py")
    print("=" * 60)
    
    # 1. Initialize Engine (which will auto-generate & seed database if missing)
    if not initialize_engine():
        print("[CRITICAL] Could not initialize engine. Exiting.")
        sys.exit(1)
        
    print("\n[OK] Server is ready!")
    print("[OK] Open browser at: http://localhost:5000\n")
    
    # 2. Run Flask App
    app.run(host='0.0.0.0', port=5000, debug=False)
