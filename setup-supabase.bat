@echo off
echo === Supabase CLI Setup ===
echo.

powershell -ExecutionPolicy Bypass -Command ^
  "$env:PATH = [Environment]::GetEnvironmentVariable('PATH','Machine') + ';' + [Environment]::GetEnvironmentVariable('PATH','User');" ^
  "scoop bucket add supabase https://github.com/supabase/scoop-bucket.git 2>$null;" ^
  "scoop install supabase;" ^
  "$env:PATH = [Environment]::GetEnvironmentVariable('PATH','Machine') + ';' + [Environment]::GetEnvironmentVariable('PATH','User');" ^
  "supabase login"

echo.
echo === Done! ===
pause
