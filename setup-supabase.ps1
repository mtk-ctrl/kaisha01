Write-Host "=== Supabase CLI Setup ===" -ForegroundColor Cyan
Write-Host ""

# 1. Scoop をインストール（Windows 用パッケージマネージャ）
if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Write-Host "[1/3] Installing Scoop..." -ForegroundColor Yellow
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-RestMethod get.scoop.sh | Invoke-Expression
} else {
    Write-Host "[1/3] Scoop already installed. Skipping." -ForegroundColor Green
}

# PATH を現在のセッションに反映
$env:PATH = [Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [Environment]::GetEnvironmentVariable("PATH","User")

# 2. Supabase CLI をインストール
Write-Host ""
Write-Host "[2/3] Installing Supabase CLI..." -ForegroundColor Yellow
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git 2>$null
scoop install supabase

# PATH を再反映
$env:PATH = [Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [Environment]::GetEnvironmentVariable("PATH","User")

# 3. ログイン
Write-Host ""
Write-Host "[3/3] Supabase login (browser will open)..." -ForegroundColor Yellow
supabase login

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Green
Write-Host "Press Enter to close."
Read-Host
