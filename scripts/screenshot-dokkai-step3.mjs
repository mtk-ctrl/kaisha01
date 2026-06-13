// 国語〈読解〉ステップ3 短文読解 画面レビュー
// フロー: ホーム → ステップ3選択 → 出題 → わざと不正解（足場ヒント）→ 再挑戦 → 根拠ハイライト → /juken 国語
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

// 1. ホーム（ステップ選択・ステップ3が公開されているか）
await p.goto(`${BASE}/apps/dokkai`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/s3-home.png`, fullPage: true });

// 2. ステップ3を選ぶ（3つめの .dk-step）
await p.locator('.dk-step').nth(2).click();
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/s3-q1.png`, fullPage: true });

// 3. わざと不正解 → 足場ヒント
let gotHint = false;
for (let c = 0; c < 4 && !gotHint; c++) {
  const btn = p.locator('.dk-choice:not([disabled])').nth(0);
  await btn.click();
  await p.locator('button:has-text("こたえる")').first().click();
  await p.waitForTimeout(400);
  const hint = await p.locator('text=本文にもどってみよう').count();
  if (hint > 0) { gotHint = true; break; }
  // 正解してしまったら次の問題へ
  const nextBtn = p.locator('button:has-text("つぎへ"), button:has-text("結果を見る")');
  if (await nextBtn.count() > 0) { await nextBtn.first().click(); await p.waitForTimeout(400); }
}
await p.screenshot({ path: `${OUT}/s3-hint.png`, fullPage: true });

// 4. 再挑戦して残りの選択肢を選び、答え合わせ（根拠ハイライト）
if (gotHint) {
  // 無効化されていない選択肢を順に選んで答える（正解/不正解どちらでも reveal される）
  const btn = p.locator('.dk-choice:not([disabled])').nth(0);
  await btn.click();
  await p.locator('button:has-text("もういちど こたえる"), button:has-text("こたえる")').first().click();
  await p.waitForTimeout(500);
}
await p.screenshot({ path: `${OUT}/s3-evidence.png`, fullPage: true });

// 5. /juken 国語セクション
await p.goto(`${BASE}/juken`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(500);
await p.locator('#kokugo').scrollIntoViewIfNeeded();
await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/s3-juken-kokugo.png`, fullPage: true });

await b.close();
console.log('done');
