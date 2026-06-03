// 塾アプリ（juku）の画面レビュー用スクリーンショット。
// 前提:
//   1) ローカルでアプリを起動: cd tanq-app && npm run start -- -p 3000
//   2) playwright が必要: PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install playwright --no-save
//      （ブラウザ本体は環境の /opt/pw-browsers に同梱）
// 使い方: node scripts/screenshot-juku.mjs
import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs'

const BASE = process.env.BASE || 'http://localhost:3000'
const OUT = '/home/user/kaisha01/scripts/screenshots'
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
const p = await b.newPage()
await p.setViewportSize({ width: 390, height: 844 })
const shot = async (n) => { await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: true }); console.log('  ✓', n + '.png') }

// 濃度算（concentration）の nd-10「混ぜて目標の濃度にする」を例に、
// 解答中（?の面積図）→「答えを見る」→ こたえパネル までを撮る
await p.goto(`${BASE}/apps/juku/concentration`, { waitUntil: 'networkidle', timeout: 20000 })
await p.waitForTimeout(500)
await shot('01_unit_intro')

await p.getByRole('button', { name: /問題をとく/ }).click()
await p.waitForTimeout(400)
const diff3 = p.locator('button').filter({ hasText: /むずかし|レベル3|★★★|チャレンジ|応用/ }).first()
if (await diff3.count()) { await diff3.click(); await p.waitForTimeout(300) }
await shot('02_problem_list')

await p.locator('button').filter({ hasText: /混ぜて目標の濃度/ }).first().click()
await p.waitForTimeout(500)
await shot('03_problem_initial')

// わざと間違えて「?の面積図」とヒントを出す
await p.getByPlaceholder('こたえを入力').fill('999')
await p.getByRole('button', { name: /こたえあわせ/ }).click()
await p.waitForTimeout(900)
await shot('04_solving_with_qmark_figure')

// 「答えを見る」→ こたえパネル
await p.getByRole('button', { name: /答えを見る/ }).click()
await p.waitForTimeout(700)
await shot('05_reveal_answer')

await b.close()
console.log('done ->', OUT)
