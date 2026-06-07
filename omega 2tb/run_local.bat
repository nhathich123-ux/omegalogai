@echo off
chcp 65001 >nul
TITLE OMEGA-AI WAREHOUSE (GEMMA 4 2B)
color 0B

echo.
echo ==========================================================
echo  KHOI DONG OMEGA-AI WAREHOUSE ASSISTANT (GEMMA 4 2B)
echo ==========================================================
echo.
echo Dang kiem tra model gemma4-warehouse trong Ollama...

ollama list | findstr "gemma4-warehouse" >nul
if %errorlevel% neq 0 (
    echo [!] Model chua duoc build. Dang tien hanh build tu Modelfile...
    ollama create gemma4-warehouse -f Modelfile
    echo [OK] Build hoan tat!
)

echo.
echo [OK] Dang chay model... (Go /bye de thoat)
echo ----------------------------------------------------------
ollama run gemma4-warehouse

pause
