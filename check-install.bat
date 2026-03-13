@echo off
echo ========================================
echo Testing Installation
echo ========================================
echo.

echo Testing Backend...
cd backend
if exist node_modules\express (
    echo [OK] Backend dependencies installed
) else (
    echo [ERROR] Backend dependencies missing
)
cd ..
echo.

echo Testing Frontend...
cd frontend
if exist node_modules\vite (
    echo [OK] Frontend dependencies installed
) else (
    echo [ERROR] Frontend dependencies missing
)
cd ..
echo.

echo ========================================
echo Installation Check Complete
echo ========================================
echo.
echo You can now run: start-app.bat
echo.
pause
