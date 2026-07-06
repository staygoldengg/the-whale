@echo off
setlocal
cd /d "%~dp0"
echo Building The Whale Windows executable package...
where powershell >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo PowerShell is required.
  pause
  exit /b 1
)
powershell -ExecutionPolicy Bypass -File scripts\build-windows-exe.ps1
pause
