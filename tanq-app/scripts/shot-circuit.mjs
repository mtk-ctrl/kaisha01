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
await ctx.addInitScript(() => { localStorage.setItem('tanq-lab-auth', 'tester') })
await ctx.addCookies([{ name: 'tanq-lab-auth', value: 'tester', domain: 'localhost', path: '/' }])
const page = await ctx.newPage()

async function snap(name) {
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  console.log('saved', name)
}

// 1) まなぶ 1枚目（電池直列の図解）
await page.goto(`${BASE}/apps/rika-circuit/`, { waitUntil: 'networkidle' })
await snap('cir-manabu1')

// 2) まなぶ 3枚目あたり（電球直列）まで進める
for (let i = 0; i < 2; i++) {
  const nx = page.getByText('つぎへ').first()
  if (await nx.count()) { await nx.click(); await page.waitForTimeout(350) }
}
await snap('cir-manabu3')

// 「問題をとく」へ
for (let i = 0; i < 3; i++) {
  const nx = page.getByText('つぎへ').first()
  if (await nx.count()) { await nx.click(); await page.waitForTimeout(250) }
}
const solve = page.getByText('問題をとく').first()
if (await solve.count()) { await solve.click(); await page.waitForTimeout(400) }
await snap('cir-list')

// ★ 1問目を開く（電池を直列にすると）
const q1 = page.locator('button', { hasText: '電池を直列にすると' }).first()
if (await q1.count()) { await q1.click(); await page.waitForTimeout(400) }
await snap('cir-q1')   // 出題（図に明るさが出ていない＝中立であること）

// わざと間違える（正解は B。A をクリック）→ 足場ヒント
const wrong1 = page.locator('button').filter({ hasText: /^A$/ }).first()
if (await wrong1.count()) { await wrong1.click(); await page.waitForTimeout(500) }
await snap('cir-q1-hint')   // 足場ヒント

// 2回目も間違える（おなじ をクリック）→ 答え＋図解説明（光る図）
const wrong2 = page.locator('button').filter({ hasText: 'おなじ' }).first()
if (await wrong2.count()) { await wrong2.click(); await page.waitForTimeout(600) }
await snap('cir-q1-reveal')  // 答え開示＋光る図解

// 別の問題で「正解」フローも撮る（電流の比 ★★）
await page.goto(`${BASE}/apps/rika-circuit/`, { waitUntil: 'networkidle' })
const solve2 = page.getByText('スキップして問題へ').first()
if (await solve2.count()) { await solve2.click(); await page.waitForTimeout(400) }
// ★★ タブ
const tab2 = page.getByText('れんしゅう').first()
if (await tab2.count()) { await tab2.click(); await page.waitForTimeout(300) }
const q6 = page.locator('button', { hasText: '電池直列の電流の比' }).first()
if (await q6.count()) { await q6.click(); await page.waitForTimeout(400) }
// 正解 = 2倍
const correct = page.locator('button').filter({ hasText: /^2/ }).first()
if (await correct.count()) { await correct.click(); await page.waitForTimeout(600) }
await snap('cir-q6-correct')

// /juken 理科で電気回路が公開表示されているか
await page.goto(`${BASE}/juken`, { waitUntil: 'networkidle' })
await page.evaluate(() => { const el = document.getElementById('rika'); if (el) el.scrollIntoView() })
await snap('cir-juken-rika')

await browser.close()
console.log('done')
