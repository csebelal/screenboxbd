@echo off
title ScreenBoxbd Backend & Admin Server
cd /d "%~dp0backend"
set PATH=D:\XAMPP\php;%PATH%
set PHP_CLI_SERVER_WORKERS=8

echo ========================================================
echo   ScreenBoxbd - Laravel 11 + Filament v3 Admin Server
echo ========================================================
echo.
echo   Admin Panel URL: http://127.0.0.1:8000/admin
echo   Backend API:     http://127.0.0.1:8000/api/v1
echo   Default Admin:   admin@streamtv.test
echo   Default Pass:    Password123#
echo.
echo Starting development server on port 8000...
echo Press CTRL+C to stop.
echo.
"D:\XAMPP\php\php.exe" artisan serve --port=8000
pause
