import socket
import sys

def check_port(host, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(2.0)
    try:
        s.connect((host, port))
        print(f"Successfully connected to {host}:{port}")
        s.close()
        return True
    except Exception as e:
        print(f"Failed to connect to {host}:{port} - {e}")
        return False

if __name__ == '__main__':
    check_port('127.0.0.1', 8000)
