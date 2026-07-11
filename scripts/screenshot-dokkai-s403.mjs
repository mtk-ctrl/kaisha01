// 国語〈読解〉ステップ4 3本目「補欠のバトン」（s4-03・★★★）画面レビュー
// 文章えらび（3文章）→ 補欠のバトン選択（1/6開始・長文段落）→ わざと不正解（足場ヒント）→ 再挑戦（根拠引用）
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

// 1. 文章えらび（3文章・★★★が並ぶか）
await p.goto(`${BASE}/apps/dokkai`, { waitUntil: 'networkidle', timeout: 20000 });
await p.locator('.dk-step').nth(3).click();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/s403-list.png`, fullPage: true });

// 2. 補欠のバトン（3つめ）→ 本文＋Q1（1/6）
await p.locator('.dk-passage').nth(2).click();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/s403-text.png`, fullPage: true });

// 3. Q1 わざと不正解（「はずかしかった」= 本文にない型）→ 足場ヒント
const btns = p.locator('.dk-choice:not([disabled])');
const n = await btns.count();
for (let i = 0; i < n; i++) {
  if ((await btns.nth(i).innerText()).includes('はずかしかった')) { await btns.nth(i).click(); break; }
}
await p.locator('button:has-text("こたえる")').first().click();
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/s403-hint.png`, fullPage: true });

// 4. 再挑戦で正解（「うらやむ」）→ 根拠ハイライト＋引用ボックス
const btns2 = p.locator('.dk-choice:not([disabled])');
const n2 = await btns2.count();
for (let i = 0; i < n2; i++) {
  if ((await btns2.nth(i).innerText()).includes('うらやむ')) { await btns2.nth(i).click(); break; }
}
await p.locator('button:has-text("もういちど こたえる")').first().click();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/s403-evidence.png`, fullPage: true });

await b.close();
console.log('done');
