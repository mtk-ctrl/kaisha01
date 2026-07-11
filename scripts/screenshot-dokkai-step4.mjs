// 国語〈読解〉ステップ4 長文読解（1本目）画面レビュー
// フロー: ホーム → ステップ4選択 → 長文表示（段落）→ わざと不正解（足場ヒント・答え非開示）→ 再挑戦 → 根拠ハイライト → /juken 国語
import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
import fs from 'fs';

const BASE = 'http://localhost:3000';
const OUT  = '/home/user/kaisha01/scripts/screenshots';
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const p = await b.newPage();
await p.setViewportSize({ width: 390, height: 844 });

await p.goto(`${BASE}/lab`, { waitUntil: 'domcontentloaded' });
await p.evaluate(() => {
  localStorage.setItem('tanq-lab-auth', 'tester');
  localStorage.setItem('tanq-tester-name', 'リン');
});

// 1. ホーム（ステップ4が公開されているか）
await p.goto(`${BASE}/apps/dokkai`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/s4-home.png`, fullPage: true });

// 2. ステップ4を選ぶ（4つめの .dk-step）→ 長文＋段落の表示
await p.locator('.dk-step').nth(3).click();
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/s4-q1-text.png`, fullPage: true });

// 3. わざと不正解 → 足場ヒント（答え非開示の確認）
let gotHint = false;
for (let c = 0; c < 4 && !gotHint; c++) {
  // 正解（choices[0]）以外を選ぶため、表示文言で「ぬらしてしまった」を避けて選択
  const btns = p.locator('.dk-choice:not([disabled])');
  const n = await btns.count();
  let picked = false;
  for (let i = 0; i < n; i++) {
    const t = await btns.nth(i).innerText();
    if (!t.includes('雨の日に ぬらしてしまったこと')) { await btns.nth(i).click(); picked = true; break; }
  }
  if (!picked) await btns.nth(0).click();
  await p.locator('button:has-text("こたえる")').first().click();
  await p.waitForTimeout(400);
  if (await p.locator('text=本文にもどってみよう').count() > 0) { gotHint = true; break; }
  const nextBtn = p.locator('button:has-text("つぎへ"), button:has-text("結果を見る")');
  if (await nextBtn.count() > 0) { await nextBtn.first().click(); await p.waitForTimeout(400); }
}
await p.screenshot({ path: `${OUT}/s4-hint.png`, fullPage: true });

// 4. 再挑戦 → 答え合わせ（根拠ハイライト）
if (gotHint) {
  const btn = p.locator('.dk-choice:not([disabled])').nth(0);
  await btn.click();
  await p.locator('button:has-text("もういちど こたえる"), button:has-text("こたえる")').first().click();
  await p.waitForTimeout(500);
}
await p.screenshot({ path: `${OUT}/s4-evidence.png`, fullPage: true });

// 5. /juken 国語セクション（読解行が ステップ1〜4・50問 になっているか）
await p.goto(`${BASE}/juken`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(500);
await p.locator('#kokugo').scrollIntoViewIfNeeded();
await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/s4-juken-kokugo.png`, fullPage: true });

await b.close();
console.log('done');
