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

await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
await p.evaluate(() => {
  localStorage.setItem('tanq-lab-auth', 'tester');
  localStorage.setItem('tanq-tester-name', 'リン');
});

const go = async (path) => { await p.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 20000 }); await p.waitForTimeout(700); };
const shot = (name) => p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });

// テキストでボタン/リンクを押す（最初に見つかったもの）
async function tap(...labels) {
  for (const t of labels) {
    const loc = p.locator(`button:has-text("${t}"), a:has-text("${t}")`).first();
    try {
      if (await loc.count()) { await loc.click({ timeout: 2500 }); await p.waitForTimeout(900); return t; }
    } catch {}
  }
  return null;
}
// 画面下半分にある選択肢らしきボタンの n 番目を押す
async function tapChoice(n) {
  const btns = p.locator('button');
  const c = await btns.count();
  const cands = [];
  for (let i = 0; i < c; i++) {
    const bb = await btns.nth(i).boundingBox().catch(() => null);
    const txt = (await btns.nth(i).innerText().catch(() => '')).trim();
    if (bb && bb.y > 180 && txt && !/もどる|やめる|ホーム|せってい/.test(txt)) cands.push(i);
  }
  if (cands.length > n) { await btns.nth(cands[n]).click({ timeout: 2500 }).catch(() => {}); await p.waitForTimeout(900); return true; }
  return false;
}

// 1) 計算チャレンジ: メニュー → 開始 → わざと不正解×2（0 はほぼ誤答）
await go('/apps/math/');
await shot('math-1-menu');
await tap('れんしゅう', 'かんたん', 'はじめる', 'スタート');
await tap('かんたん', 'はじめる', 'スタート');
await shot('math-2-question');
for (let r = 1; r <= 2; r++) {
  await tap('0');
  await tap('こたえる', 'OK', 'けってい', '✓');
  await p.waitForTimeout(900);
  await shot(`math-3-wrong${r}`);
}

// 2) 漢字: 開始 → 2番目の選択肢
await go('/apps/kanji/');
await shot('kanji-1-menu');
await tap('1ねんせい', '小1', 'はじめる', 'スタート');
await tap('よみクイズ', 'はじめる', 'スタート', 'クイズ');
await shot('kanji-2-question');
await tapChoice(1);
await shot('kanji-3-after-tap');
await tapChoice(2);
await shot('kanji-4-after-tap2');

// 3) 慣用句: 出題画面（ルビ確認）→ タップ
await go('/apps/kanyo/');
await shot('kanyo-1-menu');
await tap('レベル1', 'Lv1', 'はじめる', 'スタート');
await tap('はじめる', 'スタート');
await shot('kanyo-2-question');
await tapChoice(1);
await shot('kanyo-3-after-tap');

// 4) 思考力ジム: レベル1 → 出題（シャッフル確認）
await go('/apps/thinking/');
await shot('thinking-1-menu');
await tap('レベル1', 'Lv1', 'はじめる');
await shot('thinking-2-question');
await tapChoice(1);
await shot('thinking-3-after-tap');

// 5) いろとかたち: 出題（しろ図形の輪郭確認）
await go('/apps/youji-iro/');
await shot('youjiiro-1-menu');
await tap('いろ', 'はじめる', 'スタート');
await shot('youjiiro-2-question');
await tapChoice(0);
await shot('youjiiro-3-after-tap');

// 6) なんじかな: 出題
await go('/apps/youji-clock/');
await shot('youjiclock-1-menu');
await tap('はじめる', 'スタート');
await shot('youjiclock-2-question');
await tapChoice(1);
await shot('youjiclock-3-after-tap');

// 7) 都道府県: かたちクイズ → 選択肢タップ×2（ヒント→答え）
await go('/apps/todofuken/');
await shot('todofuken-1-menu');
await tap('かたち');
await tap('かんたん', 'はじめる', 'スタート');
await shot('todofuken-2-question');
await tapChoice(1);
await shot('todofuken-3-after-tap');
await tapChoice(2);
await shot('todofuken-4-after-tap2');

await b.close();
console.log('DONE');
