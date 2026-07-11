// 国語〈読解〉ステップ4 文章えらび画面レビュー
// ホーム（2文章表示）→ 文章えらび → 里山を直接選択（1/4になるか）→ 4問解いて結果画面のボタン確認
import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
import fs from 'fs';

const BASE = 'http://localhost:3000';
const OUT  = '/home/user/kaisha01/scripts/screenshots';
fs.mkdirSync(OUT, { recursive: true });

// s4-02「里山」の各問の正解（かなのみ断片・rubyの読み混入対策）
const P2_ANSWERS = ['しかし', 'されなくなること', 'がかぎられるから', 'ちょうどよいかかわり'];

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

// 1. ホーム（ステップ4カードが「2文章」表示か）
await p.goto(`${BASE}/apps/dokkai`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/s4p-home.png`, fullPage: true });

// 2. ステップ4 → 文章えらび画面
await p.locator('.dk-step').nth(3).click();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/s4p-list.png`, fullPage: true });

// 3. 里山（2つめ）を直接選択 → 1/4 で始まるか
await p.locator('.dk-passage').nth(1).click();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/s4p-play.png` });

// 4. 4問解ききって結果画面（もう一度この文章／文章えらび のボタン）
for (const ansText of P2_ANSWERS) {
  const btns = p.locator('.dk-choice:not([disabled])');
  const n = await btns.count();
  for (let i = 0; i < n; i++) {
    if ((await btns.nth(i).innerText()).includes(ansText)) { await btns.nth(i).click(); break; }
  }
  await p.locator('button:has-text("こたえる")').first().click();
  await p.waitForTimeout(300);
  await p.locator('button:has-text("つぎへ"), button:has-text("結果を見る")').first().click();
  await p.waitForTimeout(400);
}
await p.screenshot({ path: `${OUT}/s4p-result.png`, fullPage: true });

await b.close();
console.log('done');
