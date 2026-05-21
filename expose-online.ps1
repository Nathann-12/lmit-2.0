# Show site online in 1 minute (no VPS, no domain). PC must stay on.
# Needs: Docker running + cloudflared (winget install Cloudflare.cloudflared)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Install Docker Desktop first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".env")) { Copy-Item ".env.example" ".env" }

$port = "8080"
$line = Get-Content ".env" -ErrorAction SilentlyContinue | Where-Object { $_ -match '^\s*HTTP_PORT=' }
if ($line -match 'HTTP_PORT=(\d+)') { $port = $Matches[1] }

Write-Host "Starting site..." -ForegroundColor Cyan
docker compose up -d

if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "Install cloudflared (one time):" -ForegroundColor Yellow
    Write-Host "  winget install Cloudflare.cloudflared"
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Write-Host ("Local site: http://localhost:" + $port) -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "Public link (copy from output below, starts with https://):" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray
cloudflared tunnel --url ("http://localhost:" + $port)
