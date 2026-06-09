import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('scripts/screenshots', { recursive: true })

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await browser.newPage()
await page.setViewportSize({ width: 390, height: 844 }) // iPhone 14 Pro

// TOP page
await page.goto('http://localhost:3000/apps/bunsuu/', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'scripts/screenshots/bunsuu-01-top.png', fullPage: true })

// Level select
await page.click('button:has-text("レベルをえらぶ")')
await page.waitForTimeout(500)
await page.screenshot({ path: 'scripts/screenshots/bunsuu-02-levels.png', fullPage: true })

// Level 1 quiz - count select
await page.click('button:has-text("レベル1")')
await page.waitForTimeout(300)
await page.screenshot({ path: 'scripts/screenshots/bunsuu-03-count.png', fullPage: true })

// Start quiz
await page.click('button:has-text("5もん")')
await page.waitForTimeout(400)
await page.screenshot({ path: 'scripts/screenshots/bunsuu-04-quiz-read.png', fullPage: true })

// Answer first question (click first choice)
const choices = page.locator('button').filter({ hasText: /^\d/ })
await choices.first().click()
await page.waitForTimeout(400)
await page.screenshot({ path: 'scripts/screenshots/bunsuu-05-quiz-feedback.png', fullPage: true })

// Go back and try yakubun
await page.goto('http://localhost:3000/apps/bunsuu/', { waitUntil: 'networkidle' })
await page.click('button:has-text("レベルをえらぶ")')
await page.waitForTimeout(300)

// Scroll down to see yakubun section
await page.evaluate(() => window.scrollTo(0, 999))
await page.waitForTimeout(300)
await page.screenshot({ path: 'scripts/screenshots/bunsuu-06-levels-bottom.png', fullPage: true })

// Click 約分①
await page.click('button:has-text("約分①")')
await page.waitForTimeout(300)
await page.click('button:has-text("5もん")')
await page.waitForTimeout(400)
await page.screenshot({ path: 'scripts/screenshots/bunsuu-07-yakubun-quiz.png', fullPage: true })

// Try fraction×fraction
await page.goto('http://localhost:3000/apps/bunsuu/', { waitUntil: 'networkidle' })
await page.click('button:has-text("レベルをえらぶ")')
await page.waitForTimeout(300)
await page.click('button:has-text("かけ算（分数×分数）")')
await page.waitForTimeout(300)
await page.click('button:has-text("5もん")')
await page.waitForTimeout(400)
await page.screenshot({ path: 'scripts/screenshots/bunsuu-08-mulfrac-quiz.png', fullPage: true })

await browser.close()
console.log('Done')
