@echo off
echo ===========================================
echo   NEXORA AI RECOMMENDATION ENGINE SETUP
echo ===========================================
echo.

cd recommendation_engine

echo [1/3] Checking for Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH.
    echo Please install Python 3.9+ and try again.
    pause
    exit /b
)
echo Python found.

echo.
echo [2/3] Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b
)
echo Dependencies installed successfully.

echo.
echo [3/3] Starting AI Engine...
echo Service will run on http://localhost:8000
echo.
python -m uvicorn main:app --reload --port 8000 --host 0.0.0.0

pause
