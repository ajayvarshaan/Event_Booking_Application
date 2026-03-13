@echo off
echo ========================================
echo Event Booking System - Starting Servers
echo ========================================
echo.

echo Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo Warning: Could not start MongoDB service.
        echo Please start MongoDB manually or use MongoDB Atlas.
        echo.
    )
) else (
    echo MongoDB is already running.
)
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && echo Backend Starting... && npm run dev"
echo Backend server starting on http://localhost:5000
echo.

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul
echo.

echo Starting Frontend Application (Vite)...
start "Frontend App" cmd /k "cd frontend && echo Frontend Starting... && npm run dev"
echo Frontend app starting on http://localhost:3000
echo.

echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
echo (The servers will continue running in separate windows)
pause >nul
