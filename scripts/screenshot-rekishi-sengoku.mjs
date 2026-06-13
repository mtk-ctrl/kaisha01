// 中学受験 歴史〈旧石器〜戦国〉 鎌倉〜戦国 拡張の画面レビュー
// フロー: レベルマップ（新Lv7-11が見える）→ Lv7鎌倉 出題→わざと不正解→ヒント→答え/解説 → /juken 社会
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

// tester 認証（全レベル解放）
await p.goto(`${BASE}/lab`, { waitUntil: 'domcontentloaded' });
await p.evaluate(() => {
  localStorage.setItem('tanq-lab-auth', 'tester');
  localStorage.setItem('tanq-tester-name', 'リン');
});

// ── 1. レベルマップ（新レベルが見えるか・タイムライン） ──
await p.goto(`${BASE}/apps/rekishi`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/sengoku-map-top.png` });
await p.mouse.wheel(0, 900); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/sengoku-map-mid.png` });
await p.mouse.wheel(0, 700); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/sengoku-map-badges.png` });

// ── 2. Lv7 鎌倉時代 出題 → わざと不正解 → ヒント → 答え/解説 ──
await p.mouse.wheel(0, -1600); await p.waitForTimeout(400);
await p.locator('button:has-text("鎌倉時代")').first().click();
await p.waitForTimeout(600);

let gotHint = false;
for (let i = 0; i < 14 && !gotHint; i++) {
  const isOrder = await p.locator('text=ならべかえ（年代順）').count() > 0;
  if (isOrder) {
    const items = p.locator('.rk-order-item');
    for (let k = 0; k < 4; k++) await items.nth(k).click();
    await p.locator('button:has-text("こたえる")').click();
    await p.waitForTimeout(400);
    if (await p.locator('text=考えるヒント').count() > 0) {
      for (let k = 0; k < 4; k++) await p.locator('.rk-order-item').nth(k).click();
      await p.locator('button:has-text("もういちど こたえる")').click();
      await p.waitForTimeout(400);
    }
    await p.locator('button:has-text("つぎへ"), button:has-text("結果を見る")').first().click();
    await p.waitForTimeout(400);
    continue;
  }
  if (i === 0) await p.screenshot({ path: `${OUT}/sengoku-kamakura-q.png` });
  await p.locator('.rk-choice').nth(0).click();
  await p.locator('button:has-text("こたえる")').first().click();
  await p.waitForTimeout(500);
  if (await p.locator('text=考えるヒント').count() > 0) {
    gotHint = true;
    await p.screenshot({ path: `${OUT}/sengoku-kamakura-hint.png` });
    await p.locator('.rk-choice:not([disabled])').first().click();
    await p.locator('button:has-text("もういちど こたえる")').click();
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}/sengoku-kamakura-explain.png` });
  } else {
    await p.locator('button:has-text("つぎへ"), button:has-text("結果を見る")').first().click();
    await p.waitForTimeout(400);
  }
}

// ── 3. Lv10 戦国 ならべかえ（年代頻出）を撮る ──
await p.goto(`${BASE}/apps/rekishi`, { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.locator('button:has-text("応仁の乱〜戦国")').first().click();
await p.waitForTimeout(600);
let gotOrder = false;
for (let i = 0; i < 14 && !gotOrder; i++) {
  const isOrder = await p.locator('text=ならべかえ（年代順）').count() > 0;
  if (!isOrder) {
    await p.locator('.rk-choice').nth(0).click();
    await p.locator('button:has-text("こたえる")').first().click();
    await p.waitForTimeout(400);
    if (await p.locator('text=考えるヒント').count() > 0) {
      await p.locator('.rk-choice:not([disabled])').first().click();
      await p.locator('button:has-text("もういちど こたえる")').click();
      await p.waitForTimeout(400);
    }
    await p.locator('button:has-text("つぎへ"), button:has-text("結果を見る")').first().click();
    await p.waitForTimeout(400);
    continue;
  }
  gotOrder = true;
  await p.screenshot({ path: `${OUT}/sengoku-order-q.png` });
  const items = p.locator('.rk-order-item');
  for (let k = 0; k < 4; k++) { await items.nth(k).click(); await p.waitForTimeout(120); }
  await p.locator('button:has-text("こたえる")').first().click();
  await p.waitForTimeout(500);
  if (await p.locator('text=考えるヒント').count() > 0) {
    for (let k = 0; k < 4; k++) await p.locator('.rk-order-item').nth(k).click();
    await p.locator('button:has-text("もういちど こたえる")').click();
    await p.waitForTimeout(500);
  }
  await p.screenshot({ path: `${OUT}/sengoku-order-explain.png` });
}

// ── 4. /juken 社会セクション ──
await p.goto(`${BASE}/juken`, { waitUntil: 'networkidle', timeout: 20000 });
await p.locator('#shakai').scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/sengoku-juken-shakai.png` });

await b.close();
console.log('DONE sengoku screenshots');
