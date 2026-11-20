@echo off
title ScreenBoxbd Master Launcher
cd /d "%~dp0"

echo ========================================================
echo   ScreenBoxbd - 1-Click Master Launcher
echo ========================================================
echo.
echo [1/3] Starting Backend & Admin Server (Port 8000)...
start "ScreenBoxbd Backend" cmd /c "run_backend.bat"

echo [2/3] Waiting for Backend to initialize...
timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend Server (Port 3000)...
start "ScreenBoxbd Frontend" cmd /c "run_frontend.bat"

echo.
echo ========================================================
echo   ScreenBoxbd is running!
echo ========================================================
echo   * Frontend Web App:  http://localhost:3000
echo   * Admin Dashboard:   http://127.0.0.1:8000/admin
echo   * Backend REST API:  http://127.0.0.1:8000/api/v1
echo.
echo Opening Frontend in default browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:3000
