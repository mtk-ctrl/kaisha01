import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const OUT = '/home/user/kaisha01/tanq-app/scripts/screenshots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await ctx.newPage()

async function startUnit(unitId) {
  await page.goto(`http://localhost:3000/apps/juku/${unitId}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  // click through any intro / start buttons
  for (let i = 0; i < 4; i++) {
    const btn = page.getByRole('button', { name: /はじめる|スタート|問題|やさしい|つぎへ|始め/i }).first()
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {})
      await page.waitForTimeout(400)
    }
  }
}

async function wrongTimes(prefix, n) {
  for (let k = 1; k <= n; k++) {
    const input = page.locator('input[type="text"], input[type="number"]').first()
    if (await input.isVisible().catch(() => false)) {
      await input.fill(String(900 + k))
      const submit = page.getByRole('button', { name: /答え|こたえ|確認/i }).first()
      if (await submit.isVisible().catch(() => false)) await submit.click().catch(() => {})
      await page.waitForTimeout(450)
    }
    await page.screenshot({ path: path.join(OUT, `${prefix}-wc${k}.png`), fullPage: true })
    console.log(`${prefix} wrong#${k}`)
  }
}

async function openProblem(name) {
  const row = page.getByText(name).first()
  if (await row.isVisible().catch(() => false)) {
    await row.click().catch(() => {})
    await page.waitForTimeout(500)
  }
}

// 1) travelers (the screenshotted unit) -> open tr-03 "相手の速さを求める"
await startUnit('travelers')
await openProblem('相手の速さを求める')
await page.screenshot({ path: path.join(OUT, 'rev-travelers-start.png'), fullPage: true })
await wrongTimes('rev-travelers', 3)
// click "わからない、答えを見る" -> should reveal full worked diagram with the answer
const seeAns = page.getByRole('button', { name: /わからない|答えを見る/i }).first()
if (await seeAns.isVisible().catch(() => false)) {
  await seeAns.click().catch(() => {})
  await page.waitForTimeout(500)
}
await page.screenshot({ path: path.join(OUT, 'rev-travelers-reveal.png'), fullPage: true })
console.log('travelers reveal')

// 2) equivalent (相当算) -> verify no answerValue at wc=2
await startUnit('equivalent')
await openProblem('')
await wrongTimes('rev-equiv', 2)

await browser.close()
console.log('Done', OUT)
