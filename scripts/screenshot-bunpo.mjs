// 国語〈文法・敬語〉/apps/bunpo の画面レビュー
import { chromium } from '/home/user/kaisha01/tanq-app/node_modules/playwright/index.mjs'

const BASE = process.env.BASE || 'http://localhost:3000'
const OUT = '/home/user/kaisha01/scripts/screenshots'
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
const p = await b.newPage()
await p.setViewportSize({ width: 390, height: 844 })
const shot = async (n) => { await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: true }); console.log('  ✓', n + '.png') }

// テスター認証
await p.goto(`${BASE}/juken`, { waitUntil: 'domcontentloaded', timeout: 20000 })
await p.evaluate(() => localStorage.setItem('tanq-lab-auth', 'tester'))

// /juken 国語セクション（文法・敬語が公開・近日公開ゼロ）
await p.goto(`${BASE}/juken`, { waitUntil: 'networkidle', timeout: 20000 })
await p.waitForTimeout(500)
await p.locator('a[href="#kokugo"]').first().click().catch(() => {})
await p.waitForTimeout(400)
await shot('bp_01_juken_kokugo')

// bunpo home（レベル選択）
await p.goto(`${BASE}/apps/bunpo`, { waitUntil: 'networkidle', timeout: 20000 })
await p.waitForTimeout(500)
await shot('bp_02_home')

// Lv1 敬語の種類：確実に「不正解→足場ヒント→解説」を撮る
async function openLv1Q1() {
  await p.goto(`${BASE}/apps/bunpo`, { waitUntil: 'networkidle', timeout: 20000 })
  await p.waitForTimeout(300)
  await p.getByRole('button', { name: /敬語の種類/ }).first().click()
  await p.waitForTimeout(400)
}
await openLv1Q1()
await shot('bp_03_q1')

// 初手が当たると再挑戦に入らないので、ヒントが出るまで選択肢を変えてやり直す
let gotHint = false
for (let tryIdx = 0; tryIdx < 4 && !gotHint; tryIdx++) {
  if (tryIdx > 0) await openLv1Q1()
  await p.locator('button.bp-choice').nth(tryIdx).click()
  await p.getByRole('button', { name: /^こたえる$/ }).click()
  await p.waitForTimeout(600)
  gotHint = await p.getByRole('button', { name: /もういちど こたえる/ }).isVisible().catch(() => false)
}
await shot('bp_04_hint')   // 足場ヒント（答え非開示）

// 再挑戦でまた不正解 → 答え合わせ（正解＋理由）。最初に選んだ選択肢は無効化されているので別を選ぶ
const retry = p.locator('button.bp-choice:not([disabled])').first()
await retry.click()
await p.getByRole('button', { name: /もういちど こたえる/ }).click()
await p.waitForTimeout(700)
await shot('bp_05_reveal')

// Lv2 敬語の言いかえ：1問目を初手正解で撮る（正解の選択肢をさがす）
async function openLv2Q1() {
  await p.goto(`${BASE}/apps/bunpo`, { waitUntil: 'networkidle', timeout: 20000 })
  await p.waitForTimeout(300)
  await p.getByRole('button', { name: /敬語の言いかえ/ }).first().click()
  await p.waitForTimeout(400)
}
let gotCorrect = false
for (let tryIdx = 0; tryIdx < 4 && !gotCorrect; tryIdx++) {
  await openLv2Q1()
  await p.locator('button.bp-choice').nth(tryIdx).click()
  await p.getByRole('button', { name: /^こたえる$/ }).click()
  await p.waitForTimeout(600)
  gotCorrect = await p.getByText('⭕ 正解！', { exact: false }).isVisible().catch(() => false)
}
await shot('bp_06_correct')

await b.close()
console.log('done ->', OUT)
