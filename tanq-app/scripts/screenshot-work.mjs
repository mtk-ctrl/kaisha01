import { chromium } from 'playwright'

const BASE = 'http://localhost:3000'
const OUT = 'scripts/screenshots'
const exec = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const browser = await chromium.launch({ executablePath: exec })
const ctx = await browser.newContext({
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 2,
})
await ctx.addCookies([{ name: 'tanq-lab-auth', value: 'tester', domain: 'localhost', path: '/' }])
const page = await ctx.newPage()

async function shot(name) {
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  console.log('shot', name)
}

// 1) /juken 算数セクション — 流水算・仕事算が公開表示か
await page.goto(`${BASE}/juken/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await shot('work-01-juken')

// 2) 仕事算 まなぶ（introSlide）
await page.goto(`${BASE}/apps/juku/work-newton/`, { waitUntil: 'networkidle' })
await shot('work-02-newton-intro')

// 問題をとく
const tokuBtn = page.getByText('問題をとく').first()
if (await tokuBtn.count()) { await tokuBtn.click(); await page.waitForTimeout(500) }
await shot('work-03-newton-list')

// ★★★ タブを開く（ニュートン算が入っている）
const hardTab = page.locator('button', { hasText: '★★★' }).first()
if (await hardTab.count()) { await hardTab.click(); await page.waitForTimeout(400) }
await shot('work-04-newton-hard-list')

// 最初の問題を開く
const firstProblem = page.locator('button', { hasText: 'ニュートン' }).first()
if (await firstProblem.count()) { await firstProblem.click(); await page.waitForTimeout(400) }
await shot('work-05-newton-problem')

// わざと間違えてヒントを出す（テキスト入力 or 選択）
const input = page.locator('input[type="text"], input[inputmode]').first()
if (await input.count()) {
  await input.fill('999')
  const submit = page.locator('button', { hasText: 'こたえあわせ' }).first()
  if (await submit.count()) await submit.click()
  else { const b = page.locator('button', { hasText: 'こたえ' }).first(); if (await b.count()) await b.click() }
  await page.waitForTimeout(600)
}
await shot('work-06-newton-hint1')

// もう一度間違える
if (await input.count()) {
  await input.fill('888')
  const submit = page.locator('button', { hasText: 'こたえあわせ' }).first()
  if (await submit.count()) await submit.click()
  await page.waitForTimeout(600)
}
await shot('work-07-newton-hint2')

// 「わからない、答えを見る」で解説確認
const reveal = page.locator('button', { hasText: '答えを見る' }).first()
if (await reveal.count()) { await reveal.click(); await page.waitForTimeout(500) }
await shot('work-08-newton-reveal')

// 3) 流水算 (stream) も公開確認 — ★基本問題を解く
await page.goto(`${BASE}/apps/juku/stream/`, { waitUntil: 'networkidle' })
await shot('work-09-stream-detail')
const tokuS = page.getByText('問題をとく').first()
if (await tokuS.count()) { await tokuS.click(); await page.waitForTimeout(500) }
await shot('work-10-stream-list')
const firstS = page.locator('button', { hasText: '下りの速さ' }).first()
if (await firstS.count()) { await firstS.click(); await page.waitForTimeout(400) }
await shot('work-11-stream-problem')

await browser.close()
console.log('done')
