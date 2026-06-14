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
await ctx.addInitScript(() => {
  try { localStorage.setItem('tanq-lab-auth', 'tester') } catch {}
})
const page = await ctx.newPage()

async function shot(name) {
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  console.log('shot', name)
}

// 1) レベルマップ（Lv12-16 + タイムライン + バッジ）
await page.goto(`${BASE}/apps/rekishi/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await shot('rk-01-map')

// 2) Lv13 江戸幕府の成立 を開く（テスターは全レベル解放）
const lv13 = page.locator('button:not([disabled])', { hasText: '江戸幕府の成立' }).first()
if (await lv13.count()) { await lv13.click(); await page.waitForTimeout(600) }
await shot('rk-02-lv13-question')

// 3) わざと間違える（1番目の選択肢以外を選んで誤答を誘発 → だめなら全部試す）
async function pickWrongAndConfirm() {
  // choice の場合: 選択肢ボタンを順に押し、こたえる
  const choices = page.locator('button.rk-choice')
  const n = await choices.count()
  if (n > 0) {
    // ランダムでなく2番目を選ぶ（正解はシャッフルされるので外れる可能性高い）
    await choices.nth(1).click()
    await page.waitForTimeout(300)
    const confirm = page.locator('button', { hasText: 'こたえる' }).first()
    if (await confirm.count()) await confirm.click()
    await page.waitForTimeout(600)
  }
}
await pickWrongAndConfirm()
await shot('rk-03-after-answer')

// ヒントが出ていれば（誤答時）別の選択肢で再挑戦して因果解説まで
const hintVisible = await page.getByText('考えるヒント').count()
if (hintVisible) {
  const choices = page.locator('button.rk-choice:not([disabled])')
  if (await choices.count() > 0) {
    await choices.nth(0).click()
    await page.waitForTimeout(300)
    const confirm = page.locator('button', { hasText: 'こたえる' }).first()
    if (await confirm.count()) await confirm.click()
    await page.waitForTimeout(700)
  }
}
await shot('rk-04-explain-or-fact')

// 4) /juken 社会セクション
await page.goto(`${BASE}/juken/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
const shakai = page.locator('#shakai')
if (await shakai.count()) { await shakai.scrollIntoViewIfNeeded() }
await page.waitForTimeout(500)
await shot('rk-05-juken-shakai')

await browser.close()
console.log('done')
