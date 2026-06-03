# 画面レビュー手順（オーナーが「画面レビューして」と言ったらこの通りにやる）

> 目的: 仕様データから描いた“モック”ではなく、**実際にアプリが描画した画面**を見て
> ユーザー体験を確認する。CLAUDE.md ルールF「画面レビュー必須」を満たすための実手順。

## 大前提（この環境の事実）

| 手段 | 使えるか | メモ |
|------|---------|------|
| 本番URL `tanq-app.vercel.app` | ❌ そのままでは不可 | アクセス保護で **HTTP 403**、HTMLの中身が読めない |
| ローカル起動 + Playwright | ✅ これを使う | 下記手順。これが標準 |
| ブラウザ本体 | ✅ 同梱済み | `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` |
| Playwright(npm) | ⚠ 毎回入れる | コンテナは使い捨て。セッション毎に install が要る |

> ⚠ **SVGモックは画面レビューではない**。「しました」と言う前に下記で実画面を撮ること。

## 手順（コピペで実行）

### 1. Playwright を入れる（ブラウザ本体DLはスキップ）

```bash
cd /home/user/kaisha01
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install playwright --no-save
```

### 2. アプリをローカルで起動（本番相当のビルドで）

```bash
cd /home/user/kaisha01/tanq-app
npm run build          # ビルドが通らない限り画面レビューしない（ルールFのコードレビューも兼ねる）
(npm run start -- -p 3000 >/tmp/next.log 2>&1 &)
# 起動待ち（sleep を foreground で使わず、200 を待つ）
for i in $(seq 1 25); do c=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:3000/); [ "$c" = 200 ] && { echo READY; break; }; sleep 1; done
```

ポート3000が塞がっていたら、PID を特定して落としてから起動する:

```bash
for pid in $(ss -ltnp 2>/dev/null | grep ':3000' | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u); do kill -9 "$pid"; done
```

### 3. スクリーンショットを撮る

塾アプリ（juku）はフロー込みの例を用意済み:

```bash
cd /home/user/kaisha01
node scripts/screenshot-juku.mjs       # → scripts/screenshots/*.png
```

他の画面を撮るときは `scripts/screenshot-juku.mjs` を雛形にコピーして URL・操作を差し替える。
要点だけ抜くと:

```js
import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs'
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const p = await b.newPage()
await p.setViewportSize({ width: 390, height: 844 })   // スマホ縦
await p.goto('http://localhost:3000/<path>', { waitUntil: 'networkidle' })
await p.screenshot({ path: '/home/user/kaisha01/scripts/screenshots/x.png', fullPage: true })
await b.close()
```

### 4. 撮った PNG を Read して目視する → 必要なら SendUserFile でオーナーに見せる

- `Read scripts/screenshots/xx.png` で自分が中身を確認（ここがレビュー本体）
- バグ・違和感があれば直して 2〜4 を回し直す（直ったことも実画面で確認）
- オーナーに見せるべき差分は `SendUserFile` で送る

## 注意

- `scripts/screenshots/` は成果物なので **.gitignore 済み**（コミットしない）。
- `pkill -f next` は**自分のシェルごと巻き込んで落ちる**ことがある。ポート指定の kill（手順2）を使う。
- 静的な幼児アプリ（`tanq-app/public` 配信のもの）なら `python3 -m http.server` でも可だが、
  Next.js 本体（juku 等）は `npm run start` が必要。

---
*この手順で動作確認したコミット: 2026-06-03（濃度算の図・ヒント改修時に整備）*
