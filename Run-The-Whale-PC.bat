@echo off
setlocal
cd /d "%~dp0"
echo Starting The Whale desktop development launcher...
echo.
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is required before this launcher can run.
  echo Install Node.js 20+ from https://nodejs.org then reopen this file.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies. This only happens the first time...
  call npm install
  if %ERRORLEVEL% NEQ 0 pause & exit /b 1
)
echo Opening The Whale desktop app...
call npm run desktop:dev
pause
