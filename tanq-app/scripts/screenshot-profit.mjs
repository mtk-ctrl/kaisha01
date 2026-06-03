import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const OUT = '/home/user/kaisha01/tanq-app/scripts/screenshots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await ctx.newPage()

// Navigate to profit-loss unit
await page.goto('http://localhost:3000/apps/juku/profit-loss', { waitUntil: 'networkidle' })
await page.screenshot({ path: path.join(OUT, 'profit-unit-intro.png'), fullPage: false })
console.log('1) Unit intro')

// Click start button to go to problem list
const startBtn = page.getByRole('button', { name: /はじめる|スタート|問題を解く/i }).first()
if (await startBtn.isVisible()) {
  await startBtn.click()
  await page.waitForTimeout(500)
}
await page.screenshot({ path: path.join(OUT, 'profit-problem-list.png'), fullPage: false })
console.log('2) Problem list')

// Click sp-01
const sp01 = page.getByText('定価を求めよう').first()
if (await sp01.isVisible()) {
  await sp01.click()
  await page.waitForTimeout(500)
}
await page.screenshot({ path: path.join(OUT, 'profit-sp01-start.png'), fullPage: false })
console.log('3) sp-01 start (wc=0)')

// Wrong answer 1
const input = page.locator('input[type="text"], input[type="number"]').first()
if (await input.isVisible()) {
  await input.fill('999')
  const submitBtn = page.getByRole('button', { name: /答える|こたえ|確認/i }).first()
  if (await submitBtn.isVisible()) await submitBtn.click()
  await page.waitForTimeout(500)
}
await page.screenshot({ path: path.join(OUT, 'profit-sp01-wc1.png'), fullPage: false })
console.log('4) sp-01 after 1st wrong (wc=1, should show step1)')

// Wrong answer 2
if (await input.isVisible()) {
  await input.fill('888')
  const submitBtn = page.getByRole('button', { name: /答える|こたえ|確認/i }).first()
  if (await submitBtn.isVisible()) await submitBtn.click()
  await page.waitForTimeout(500)
}
await page.screenshot({ path: path.join(OUT, 'profit-sp01-wc2.png'), fullPage: false })
console.log('5) sp-01 after 2nd wrong (wc=2, should show step1+step2)')

// Wrong answer 3
if (await input.isVisible()) {
  await input.fill('777')
  const submitBtn = page.getByRole('button', { name: /答える|こたえ|確認/i }).first()
  if (await submitBtn.isVisible()) await submitBtn.click()
  await page.waitForTimeout(500)
}
await page.screenshot({ path: path.join(OUT, 'profit-sp01-wc3.png'), fullPage: false })
console.log('6) sp-01 after 3rd wrong (wc=3, should show all steps + reveal values)')

await browser.close()
console.log('Done. Screenshots in', OUT)
