$ErrorActionPreference = "Stop"
Write-Host "Building The Whale Windows desktop executable..." -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "Node.js 20+ is required. Install it from nodejs.org." }
if (-not (Test-Path ".env.local")) { Write-Warning "No .env.local found. Copy .env.example to .env.local and add Supabase/OpenAI keys before real use." }
npm install
npm run typecheck
npm run desktop:build:win
Write-Host "Done. Check the release/ folder for The Whale Setup .exe and portable .exe." -ForegroundColor Green
