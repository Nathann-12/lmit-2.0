# LMIT - one-command deploy (requires Docker Desktop)
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
Set-Location $Root

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Install Docker Desktop first: https://www.docker.com/products/docker-desktop/" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example - edit ADMIN_PASSWORD and JWT_SECRET before production." -ForegroundColor Yellow
}

Write-Host "Building and starting containers..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host "Waiting for API..." -ForegroundColor Cyan
for ($i = 0; $i -lt 30; $i++) {
    $logs = docker compose logs api 2>&1 | Out-String
    if ($logs -match "Uvicorn running|Application startup complete") {
        break
    }
    Start-Sleep -Seconds 2
}

Write-Host "Seeding database (safe to run again)..." -ForegroundColor Cyan
docker compose exec -T api python seed_data.py

$port = "8080"
if (Test-Path ".env") {
    $line = Get-Content ".env" | Where-Object { $_ -match '^\s*HTTP_PORT=' }
    if ($line -match 'HTTP_PORT=(\d+)') { $port = $Matches[1] }
}

Write-Host ""
Write-Host ('Done. Open: http://localhost:' + $port) -ForegroundColor Green
Write-Host 'Admin login: /admin/login - see ADMIN_EMAIL and ADMIN_PASSWORD in .env' -ForegroundColor Green
