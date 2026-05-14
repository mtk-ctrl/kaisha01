@echo off
chcp 65001 > nul
echo.
echo ╔══════════════════════════════════════╗
echo ║   TANQ Jobs セットアップ             ║
echo ║   これを1回実行すればOKです          ║
echo ╚══════════════════════════════════════╝
echo.

echo [1/4] Supabase CLI をインストール中...
call npm install -g supabase
if %errorlevel% neq 0 (
  echo エラー: インストールに失敗しました
  pause
  exit /b 1
)
echo      完了!
echo.

echo [2/4] Supabase にログイン（ブラウザが開きます）...
echo      ブラウザで「Confirm」ボタンを押してください
call supabase login
echo      完了!
echo.

echo [3/4] Vercel CLI をインストール中...
call npm install -g vercel
echo      完了!
echo.

echo [4/4] Vercel にログイン（ブラウザが開きます）...
echo      ブラウザで「Continue with GitHub」を押してください
call vercel login
echo      完了!
echo.

echo ╔══════════════════════════════════════╗
echo ║   ✅ セットアップ完了！              ║
echo ║   これ以降はジョブズが全部やります   ║
echo ╚══════════════════════════════════════╝
echo.
pause
