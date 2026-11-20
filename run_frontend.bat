@echo off
title ScreenBoxbd Next.js Frontend Server
cd /d "%~dp0frontend"
echo ========================================================
echo   ScreenBoxbd - Next.js 15 Live TV & Player Frontend
echo ========================================================
echo.
echo   Frontend URL: http://localhost:3000
echo   Backend API:  http://127.0.0.1:8000/api/v1
echo.

:: Clean build cache if requested
if "%1"=="clean" (
  echo Resetting .next build cache...
  if exist .next rd /s /q .next
)

if "%1"=="prod" (
  echo ========================================================
  echo   Running in High-Speed Production Mode (Instant Response)
  echo ========================================================
  if not exist .next\BUILD_ID (
    echo Building optimized production bundle...
    call npm run build
  )
  npm run start -- -p 3000
  goto end
)

:: If previous run was a production build, clear it so dev server doesn't conflict
if exist .next\BUILD_ID (
  echo Switching from production to development mode, refreshing cache...
  rd /s /q .next
)

echo Starting Next.js development server...
echo Press CTRL+C to stop.
echo.
npm run dev -- -p 3000

:end
pause
