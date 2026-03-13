@echo off
echo ========================================
echo Event Booking System Setup
echo ========================================
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Backend installation failed!
    pause
    exit /b %errorlevel%
)
echo Backend dependencies installed successfully!
echo.

echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend installation failed!
    pause
    exit /b %errorlevel%
)
echo Frontend dependencies installed successfully!
echo.

cd ..
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo 1. Start MongoDB service
echo 2. Open terminal in 'backend' folder and run: npm run dev
echo 3. Open another terminal in 'frontend' folder and run: npm start
echo.
pause
