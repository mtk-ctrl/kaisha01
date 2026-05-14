@echo off
echo === Supabase CLI Setup ===
echo.

echo [1/3] Installing Scoop...
powershell -ExecutionPolicy Bypass -Command "if (-not (Get-Command scoop -EA SilentlyContinue)) { Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; iwr -useb get.scoop.sh | iex }"
echo.

echo [2/3] Installing Supabase CLI...
powershell -ExecutionPolicy Bypass -Command "scoop bucket add supabase https://github.com/supabase/scoop-bucket.git 2>$null; scoop install supabase"
echo.

echo [3/3] Supabase login (browser will open)...
powershell -ExecutionPolicy Bypass -Command "$env:PATH = [Environment]::GetEnvironmentVariable('PATH','Machine') + ';' + [Environment]::GetEnvironmentVariable('PATH','User'); supabase login"
echo.

echo === Done! ===
pause
