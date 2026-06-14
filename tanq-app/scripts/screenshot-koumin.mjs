import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'screenshots')
const BASE = 'http://localhost:3000'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: true })
  console.log('saved', name)
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const ctx = await browser.newContext({
  viewport: { width: 420, height: 900 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()

// テスター認証
await page.goto(BASE + '/apps/koumin/', { waitUntil: 'domcontentloaded' })
await page.evaluate(() => localStorage.setItem('tanq-lab-auth', 'tester'))
await page.reload({ waitUntil: 'networkidle' })
await sleep(600)
await shot(page, '01-map.png')

// Lv1 憲法 を開く
await page.getByText('日本国憲法', { exact: false }).first().click()
await sleep(700)
await shot(page, '02-play-q1.png')

// わざと不正解にする: 正解(○がつくはず)以外のボタンを選ぶ
async function pickWrong() {
  // 選択肢ボタン群（①②③④で始まる）
  const choices = await page.locator('button:has-text("①"), button:has-text("②"), button:has-text("③"), button:has-text("④")').all()
  // まず2番目の選択肢を選ぶ（憲法Lv1は誤答が多いので適当な誤答を狙う）
  if (choices.length >= 2) {
    await choices[1].click()
  }
}
// choice問題なら誤答→足場ヒント、order問題ならスキップして次のchoiceを探す
let foundHint = false
for (let attempt = 0; attempt < 6 && !foundHint; attempt++) {
  const orderBanner = await page.getByText('ならべかえ', { exact: false }).count()
  if (orderBanner > 0) {
    // order問題: とりあえずカードを順にタップして答えて次へ
    const cards = await page.locator('button').filter({ hasText: /./ }).all()
    // ならべかえはスキップしたいので「こたえる」ためにカードを順に押す
    break
  }
  await pickWrong()
  await sleep(300)
  // こたえる
  await page.getByRole('button', { name: 'こたえる' }).click().catch(()=>{})
  await sleep(600)
  const hint = await page.getByText('考えるヒント', { exact: false }).count()
  if (hint > 0) { foundHint = true }
}
await shot(page, '03-scaffold-hint.png')

// 再挑戦: 正解(○表示はまだないので、firstWrong以外で正解を狙う→answerはわからないので
// もう一度別の選択肢を選び「もういちど こたえる」)
const choices2 = await page.locator('button:has-text("①"), button:has-text("②"), button:has-text("③"), button:has-text("④")').all()
// firstWrong(②=index1)は無効化されているので、別の選択肢を順に試す
for (const c of choices2) {
  const disabled = await c.isDisabled().catch(()=>true)
  if (!disabled) { await c.click(); break }
}
await sleep(300)
await page.getByRole('button', { name: 'もういちど こたえる' }).click().catch(()=>{})
await sleep(700)
await shot(page, '04-after-retry-explain.png')

// /juken 社会セクション
await page.goto(BASE + '/juken/', { waitUntil: 'networkidle' })
await sleep(500)
await page.evaluate(() => { const el = document.getElementById('shakai'); if (el) el.scrollIntoView() })
await sleep(400)
await shot(page, '05-juken-shakai.png')

await browser.close()
console.log('DONE')
