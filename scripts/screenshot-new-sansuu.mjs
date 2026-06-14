// 算数 新4単元（数の性質・規則性・平面図形・場合の数）の画面レビュー
import { chromium } from '/home/user/kaisha01/tanq-app/node_modules/playwright/index.mjs'

const BASE = process.env.BASE || 'http://localhost:3000'
const OUT = '/home/user/kaisha01/scripts/screenshots'
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
const p = await b.newPage()
await p.setViewportSize({ width: 390, height: 844 })
const shot = async (n) => { await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: true }); console.log('  ✓', n + '.png') }

// テスター認証を localStorage に入れる
await p.goto(`${BASE}/juken`, { waitUntil: 'domcontentloaded', timeout: 20000 })
await p.evaluate(() => localStorage.setItem('tanq-lab-auth', 'tester'))
await p.goto(`${BASE}/juken`, { waitUntil: 'networkidle', timeout: 20000 })
await p.waitForTimeout(600)
await shot('ns_01_juken_sansuu')

// 単元マップ（第5層が出るか）
await p.goto(`${BASE}/apps/juku`, { waitUntil: 'networkidle', timeout: 20000 })
await p.waitForTimeout(600)
await shot('ns_02_juku_map')

// 平面図形：イントロ → 問題 → わざと不正解 → ヒント（答えバレ確認）→ 答えを見る
await p.goto(`${BASE}/apps/juku/plane-figure`, { waitUntil: 'networkidle', timeout: 20000 })
await p.waitForTimeout(500)
await shot('ns_03_pf_intro')

await p.getByRole('button', { name: /問題をとく/ }).click()
await p.waitForTimeout(400)
await shot('ns_04_pf_list')

// ★★★ タブに切替えてから「正方形から円をのぞく」を選ぶ
await p.locator('button').filter({ hasText: '★★★' }).first().click()
await p.waitForTimeout(300)
await p.locator('button').filter({ hasText: /正方形から円をのぞく/ }).first().click()
await p.waitForTimeout(500)
await shot('ns_05_pf_problem')

// わざと間違える（ヒント表示・答えバレ確認）
await p.getByPlaceholder('こたえを入力').fill('999')
await p.getByRole('button', { name: /こたえあわせ/ }).click()
await p.waitForTimeout(800)
// もう一度間違えてヒントを増やす
await p.getByPlaceholder('こたえを入力').fill('888')
await p.getByRole('button', { name: /こたえあわせ/ }).click()
await p.waitForTimeout(800)
await shot('ns_06_pf_hints')

// 答えを見る
await p.getByRole('button', { name: /わからない、答えを見る/ }).click()
await p.waitForTimeout(700)
await shot('ns_07_pf_reveal')

// 規則性：群数列を正解してみる
await p.goto(`${BASE}/apps/juku/sequences`, { waitUntil: 'networkidle', timeout: 20000 })
await p.waitForTimeout(400)
await p.getByRole('button', { name: /問題をとく/ }).click()
await p.waitForTimeout(400)
await p.locator('button').filter({ hasText: '★★★' }).first().click()
await p.waitForTimeout(300)
await p.locator('button').filter({ hasText: /群数列/ }).first().click()
await p.waitForTimeout(500)
await p.getByPlaceholder('こたえを入力').fill('6')
await p.getByRole('button', { name: /こたえあわせ/ }).click()
await p.waitForTimeout(800)
await shot('ns_08_sq_correct')

// 場合の数：イントロ
await p.goto(`${BASE}/apps/juku/counting`, { waitUntil: 'networkidle', timeout: 20000 })
await p.waitForTimeout(500)
await shot('ns_09_cn_intro')

// 数の性質：問題リスト
await p.goto(`${BASE}/apps/juku/number-properties`, { waitUntil: 'networkidle', timeout: 20000 })
await p.waitForTimeout(400)
await p.getByRole('button', { name: /問題をとく/ }).click()
await p.waitForTimeout(400)
await shot('ns_10_nb_list')

await b.close()
console.log('done ->', OUT)
