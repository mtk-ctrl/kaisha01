import { chromium } from 'playwright'

const BASE = 'http://localhost:3000'
const OUT = 'scripts/screenshots'

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox'],
})
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
})
// テスター認証（全単元解放）
await ctx.addInitScript(() => {
  localStorage.setItem('tanq-lab-auth', 'tester')
})
const page = await ctx.newPage()

async function snap(name) {
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  console.log('saved', name)
}

// 1) /juken 算数セクションで旅人算が公開表示されているか
await page.goto(`${BASE}/juken`, { waitUntil: 'networkidle' })
await snap('tr-juken')

// 2) 旅人算 単元トップ（introSlide）
await page.goto(`${BASE}/apps/juku/travelers`, { waitUntil: 'networkidle' })
await snap('tr-intro')

// 3) 「問題をとく」→ 一覧
const startBtn = page.getByText('問題をとく').first()
if (await startBtn.count()) { await startBtn.click(); await page.waitForTimeout(400) }
await snap('tr-list')

// 4) ★の最初の問題を開く
const firstProblem = page.locator('button', { hasText: '出会うまでの時間' }).first()
if (await firstProblem.count()) { await firstProblem.click(); await page.waitForTimeout(400) }
await snap('tr-q1')

// 5) わざと間違えてヒント＋図を出す
const input = page.locator('input[inputmode="decimal"]').first()
if (await input.count()) {
  await input.fill('99')
  await page.getByText('こたえあわせ').first().click()
  await page.waitForTimeout(500)
  await input.fill('1')
  await page.getByText('こたえあわせ').first().click()
  await page.waitForTimeout(500)
}
await snap('tr-q1-hints')

// 6) 正解して解説を出す
if (await input.count()) {
  await input.fill('15')
  await page.getByText('こたえあわせ').first().click()
  await page.waitForTimeout(500)
}
await snap('tr-q1-solved')

await browser.close()
console.log('done')
