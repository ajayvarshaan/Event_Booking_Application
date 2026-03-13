@echo off
echo ========================================
echo Testing Backend Server
echo ========================================
echo.

echo Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo MongoDB is not running. Attempting to start...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo.
        echo [WARNING] Could not start MongoDB service.
        echo.
        echo Please either:
        echo 1. Start MongoDB manually
        echo 2. Use MongoDB Atlas (update MONGODB_URI in backend/.env)
        echo.
        pause
        exit /b 1
    )
) else (
    echo [OK] MongoDB is running
)
echo.

echo Starting Backend Server...
echo.
cd backend
npm run dev
