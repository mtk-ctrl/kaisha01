import { chromium } from 'playwright'

const PORT = 3002
const BASE = `http://localhost:${PORT}`

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await browser.newPage()
await page.setViewportSize({ width: 390, height: 844 })

// Level button indices on level select (0-based):
// 0: ←もどる, 1-5: L1-L4+mix1, 6-10: L5-L8+mix2, 11-13: mulfrac divfrac mixfrac, 14-16: yak1 yak2 yak3

async function openLevel(idx, count = 5) {
  await page.goto(`${BASE}/apps/bunsuu/`, { waitUntil: 'networkidle' })
  await page.click('button:has-text("レベルをえらぶ")')
  await page.waitForTimeout(400)
  const btn = page.locator('button').nth(idx)
  await btn.scrollIntoViewIfNeeded()
  await btn.click()
  await page.waitForTimeout(300)
  await page.locator('button').filter({ hasText: `${count}もん` }).click()
  await page.waitForTimeout(400)
}

// 約分① × 3回（選択肢が真分数のみか確認）
for (let i = 1; i <= 3; i++) {
  await openLevel(14)
  await page.screenshot({ path: `scripts/screenshots/bunsuu-fix-yakubun-${i}.png`, fullPage: false })
}

// 読み取り問題 → 不正解フィードバック確認
await openLevel(1)
await page.screenshot({ path: 'scripts/screenshots/bunsuu-fix-read-quiz.png', fullPage: false })
// click first choice in grid
await page.locator('div[style*="grid-template-columns"] button').first().click()
await page.waitForTimeout(400)
await page.screenshot({ path: 'scripts/screenshots/bunsuu-fix-read-feedback.png', fullPage: false })

await browser.close()
console.log('Done')
