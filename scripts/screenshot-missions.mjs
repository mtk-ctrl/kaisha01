// きょうのミッション（Phase C-2）の画面レビュー用スクリーンショット。
// 前提: tanq-app をローカル起動（npm run start -- -p 3000）+ playwright install 済み
// 使い方: node scripts/screenshot-missions.mjs
import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs'

const BASE = process.env.BASE || 'http://localhost:3000'
const OUT = '/home/user/kaisha01/scripts/screenshots'
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
const p = await b.newPage()
await p.setViewportSize({ width: 390, height: 844 })
const shot = async (n) => { await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: false }); console.log('  ✓', n + '.png') }

// 端末ローカル日付（offset 日前）を YYYY-MM-DD で
const dayStr = (offset) => {
  const d = new Date(); d.setDate(d.getDate() - offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const loginTester = async (name) => {
  await p.goto(`${BASE}/lab`, { waitUntil: 'networkidle', timeout: 20000 })
  await p.evaluate((n) => {
    localStorage.clear()
    localStorage.setItem('tanq-lab-auth', 'tester')
    localStorage.setItem('tanq-tester-name', n)
  }, name)
  await p.reload({ waitUntil: 'networkidle' })
  await waitMissions()
}

const waitMissions = async () => {
  await p.getByText('きょうのミッション').waitFor({ timeout: 15000 })
  await p.waitForTimeout(400)
}

const getBalance = async (name) =>
  p.evaluate((n) => JSON.parse(localStorage.getItem(`tanq_coins_v1::t::${n}`) || '{"balance":0}').balance, name)

// ── ① 初回（ログなし）→ 固定おすすめ3つ ──────────────────
await loginTester('みっしょん1')
await shot('c2_01_first_time')

// ── ② コインログ直書きで2つ達成 → ✓表示 + ミッション報酬付与 ──────
await p.evaluate(([today]) => {
  localStorage.setItem('tanq_coins_v1::t::みっしょん1', JSON.stringify({
    balance: 20, lifetime: 20,
    log: [
      { d: today, app: 'math', earned: 12 },
      { d: today, app: 'kanji', earned: 8 },
    ],
  }))
}, [dayStr(0)])
await p.reload({ waitUntil: 'networkidle' })
await waitMissions()
await shot('c2_02_two_done')
let bal = await getBalance('みっしょん1')
console.log('  balance after 2 done (expect 30 = 20 + 5 + 5):', bal)

// 重複付与ガード: もう一度リロードしても増えない
await p.reload({ waitUntil: 'networkidle' })
await waitMissions()
bal = await getBalance('みっしょん1')
console.log('  balance after extra reload (expect still 30):', bal)

// ── ③ 3つ目も達成 → 全達成演出 + ボーナス15 ──────────────
await p.evaluate(([today]) => {
  const key = 'tanq_coins_v1::t::みっしょん1'
  const c = JSON.parse(localStorage.getItem(key))
  c.log.push({ d: today, app: 'thinking', earned: 7 })
  c.balance += 7; c.lifetime += 7
  localStorage.setItem(key, JSON.stringify(c))
}, [dayStr(0)])
await p.reload({ waitUntil: 'networkidle' })
await waitMissions()
await p.waitForTimeout(500)
await shot('c2_03_all_clear')
bal = await getBalance('みっしょん1')
console.log('  balance after all clear (expect 57 = 37 + 5 + 15):', bal)
await p.reload({ waitUntil: 'networkidle' })
await waitMissions()
bal = await getBalance('みっしょん1')
console.log('  balance after extra reload (expect still 57):', bal)

// ── ④ 日替わりスロット: つづき（直近7日）/ ふくしゅう（古い記録）/ たんけん（未プレイ・中受優先）──
await loginTester('みっしょん2')
await p.evaluate(([yesterday, old]) => {
  localStorage.setItem('tanq_coins_v1::t::みっしょん2', JSON.stringify({
    balance: 40, lifetime: 40,
    log: [
      { d: yesterday, app: 'math', earned: 15 },
      { d: old, app: 'kuku', earned: 25 },
    ],
  }))
}, [dayStr(1), dayStr(10)])
// ログイン時に当日分が生成済みなので、ミッションを消して「履歴がある状態での当日初回生成」を再現
await p.evaluate(() => localStorage.removeItem('tanq_missions_v1::t::みっしょん2'))
await p.reload({ waitUntil: 'networkidle' })
await waitMissions()
await shot('c2_04_slots')

await b.close()
console.log('done ->', OUT)
