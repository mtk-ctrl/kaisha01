@echo off
echo.
echo === TANQ Jobs Setup ===
echo.

echo [1/4] Installing Supabase CLI...
call npm install -g supabase
if %errorlevel% neq 0 (
  echo ERROR: npm install failed
  pause
  exit /b 1
)
echo Done.
echo.

echo [2/4] Supabase login (browser will open)...
call supabase login
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

echo === Setup complete! Jobs can now manage everything. ===
echo.
pause
