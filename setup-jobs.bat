@echo off
echo.
echo === TANQ Jobs Setup ===
echo.

echo [1/4] Installing Supabase CLI (via winget)...
winget install Supabase.CLI
echo Done.
echo.

echo [2/4] Supabase login (browser will open)...
supabase login
echo Done.
echo.

echo [3/4] Installing Vercel CLI...
call npm install -g vercel
echo Done.
echo.

echo [4/4] Vercel login (browser will open)...
call vercel login
echo Done.
echo.

echo === Setup complete! ===
pause
