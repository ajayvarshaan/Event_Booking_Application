@echo off
echo ========================================
echo Event Booking System - Stopping Servers
echo ========================================
echo.

echo Stopping Backend Server (Port 5000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo Backend server stopped.
echo.

echo Stopping Frontend Application (Port 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo Frontend application stopped.
echo.

echo ========================================
echo All servers stopped successfully!
echo ========================================
echo.
pause
