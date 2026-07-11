// 国語〈読解〉ステップ4 2本目「里山」（s4-02）画面レビュー
// s4-01 の4問を正解で通過 → s4-02 の本文表示 → わざと不正解（足場ヒント）→ 再挑戦（根拠引用ボックス）
import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
import fs from 'fs';

const BASE = 'http://localhost:3000';
const OUT  = '/home/user/kaisha01/scripts/screenshots';
fs.mkdirSync(OUT, { recursive: true });

// s4-01 の各問の正解を一意に特定できる「かなのみ」の断片（ruby の読みが innerText に混ざるため漢字は使えない）
const P1_ANSWERS = ['ぬらしてしまったこと', 'ぷいと', 'おうとしたが', 'ちゃんと'];

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

await p.goto(`${BASE}/apps/dokkai`, { waitUntil: 'networkidle', timeout: 20000 });
await p.locator('.dk-step').nth(3).click();
await p.waitForTimeout(500);

// 1本目（s4-01）4問を正解で通過
for (const ansText of P1_ANSWERS) {
  const btns = p.locator('.dk-choice:not([disabled])');
  const n = await btns.count();
  for (let i = 0; i < n; i++) {
    if ((await btns.nth(i).innerText()).includes(ansText)) { await btns.nth(i).click(); break; }
  }
  await p.locator('button:has-text("こたえる")').first().click();
  await p.waitForTimeout(300);
  await p.locator('button:has-text("つぎへ")').first().click();
  await p.waitForTimeout(300);
}

// 2本目（s4-02「里山」）本文＋問1
await p.screenshot({ path: `${OUT}/s4b-text.png`, fullPage: true });

// わざと不正解（正解「しかし」以外＝「つまり」を選ぶ）→ 足場ヒント
const btns = p.locator('.dk-choice:not([disabled])');
const n = await btns.count();
for (let i = 0; i < n; i++) {
  if ((await btns.nth(i).innerText()).includes('つまり')) { await btns.nth(i).click(); break; }
}
await p.locator('button:has-text("こたえる")').first().click();
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/s4b-hint.png`, fullPage: true });

// 再挑戦で正解（しかし）→ 根拠ハイライト＋引用ボックス
const btns2 = p.locator('.dk-choice:not([disabled])');
const n2 = await btns2.count();
for (let i = 0; i < n2; i++) {
  if ((await btns2.nth(i).innerText()).includes('しかし')) { await btns2.nth(i).click(); break; }
}
await p.locator('button:has-text("もういちど こたえる")').first().click();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/s4b-evidence.png`, fullPage: true });

await b.close();
console.log('done');
