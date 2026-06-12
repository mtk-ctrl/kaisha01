// 中学受験 歴史〈旧石器〜平安〉 画面レビュー用スクリーンショット
// フロー: マップ → 出題 → わざと不正解（ヒント）→ 答え表示 → ならべかえ → /juken 社会 → /lab 中学受験
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

// ── 1. レベルマップ ──
await p.goto(`${BASE}/apps/rekishi`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/rekishi-map-1.png` });
await p.mouse.wheel(0, 700); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/rekishi-map-2.png` });

// ── 2. Lv1 出題 → わざと不正解 → ヒント → 答え表示 ──
await p.mouse.wheel(0, -1400); await p.waitForTimeout(400);
await p.locator('button:has-text("旧石器・縄文時代")').first().click();
await p.waitForTimeout(600);

let gotHint = false;
for (let i = 0; i < 12 && !gotHint; i++) {
  const isOrder = await p.locator('text=ならべかえ（年代順）').count() > 0;
  if (isOrder) {
    // ならべかえはスキップ（後で Lv6 で撮る）: 表示順にタップ → こたえる → つぎへ
    const items = p.locator('.rk-order-item');
    for (let k = 0; k < 4; k++) await items.nth(k).click();
    await p.locator('button:has-text("こたえる")').click();
    await p.waitForTimeout(400);
    if (await p.locator('text=考えるヒント').count() > 0) {
      // 再挑戦して先へ
      for (let k = 0; k < 4; k++) await p.locator('.rk-order-item').nth(k).click();
      await p.locator('button:has-text("もういちど こたえる")').click();
      await p.waitForTimeout(400);
    }
    await p.locator('button:has-text("つぎへ")').click();
    await p.waitForTimeout(400);
    continue;
  }
  if (i === 0) await p.screenshot({ path: `${OUT}/rekishi-q-choice.png` });
  // 4択: まず①を選んで答える
  await p.locator('.rk-choice').nth(0).click();
  await p.locator('button:has-text("こたえる")').first().click();
  await p.waitForTimeout(500);
  if (await p.locator('text=考えるヒント').count() > 0) {
    gotHint = true;
    await p.screenshot({ path: `${OUT}/rekishi-hint.png` });
    // 再挑戦: 無効化されていない別の選択肢を選んで答え合わせ
    await p.locator('.rk-choice:not([disabled])').first().click();
    await p.locator('button:has-text("もういちど こたえる")').click();
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}/rekishi-explain.png` });
  } else {
    // 初回正解 → 豆知識を一度だけ撮る
    if (i === 0) await p.screenshot({ path: `${OUT}/rekishi-fact.png` });
    await p.locator('button:has-text("つぎへ"), button:has-text("結果を見る")').first().click();
    await p.waitForTimeout(400);
  }
}

// ── 3. Lv6 でならべかえを撮る ──
await p.goto(`${BASE}/apps/rekishi`, { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.locator('button:has-text("時代ごちゃまぜ")').first().click();
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
  await p.screenshot({ path: `${OUT}/rekishi-order-q.png` });
  const items = p.locator('.rk-order-item');
  for (let k = 0; k < 4; k++) { await items.nth(k).click(); await p.waitForTimeout(120); }
  await p.screenshot({ path: `${OUT}/rekishi-order-picked.png` });
  await p.locator('button:has-text("こたえる")').first().click();
  await p.waitForTimeout(500);
  if (await p.locator('text=考えるヒント').count() > 0) {
    await p.screenshot({ path: `${OUT}/rekishi-order-hint.png` });
    for (let k = 0; k < 4; k++) await p.locator('.rk-order-item').nth(k).click();
    await p.locator('button:has-text("もういちど こたえる")').click();
    await p.waitForTimeout(500);
  }
  await p.screenshot({ path: `${OUT}/rekishi-order-explain.png` });
}

// ── 4. /juken 社会セクション ──
await p.goto(`${BASE}/juken`, { waitUntil: 'networkidle', timeout: 20000 });
await p.locator('#shakai').scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/rekishi-juken-shakai.png` });

// ── 5. /lab 中学受験セクション ──
await p.goto(`${BASE}/lab`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(800);
const sec = p.locator('text=中学受験').first();
try { await sec.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); } catch {}
await p.mouse.wheel(0, 400); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/rekishi-lab-card.png` });

await b.close();
console.log('DONE rekishi screenshots');
