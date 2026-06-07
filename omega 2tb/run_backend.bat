@echo off
chcp 65001 >nul
TITLE OMEGA-AI LOCAL BACKEND (PORT 5173)
color 0E

echo.
echo ==========================================================
echo  KHOI DONG BACKEND API -- OMEGA-AI (LOCAL GEMMA 2B)
echo ==========================================================
echo.

set "PYTHON_CMD="
if exist "C:\Program Files\PostgreSQL\18\pgAdmin 4\python\python.exe" (
    set "PYTHON_CMD=C:\Program Files\PostgreSQL\18\pgAdmin 4\python\python.exe"
) else (
    set "PYTHON_CMD=python"
)

echo [1/2] Dang kiem tra va cai dat thu vien (FastAPI, Uvicorn, httpx)...
"%PYTHON_CMD%" -m pip install -r requirements.txt --quiet

echo [2/2] Khoi dong Server API o cong 5173...
echo ----------------------------------------------------------
"%PYTHON_CMD%" backend_api.py

pause
