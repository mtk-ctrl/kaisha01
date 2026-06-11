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
await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await p.evaluate(() => {
  localStorage.setItem('tanq-lab-auth', 'tester');
  localStorage.setItem('tanq-tester-name', 'リン');
});
const go = async (path) => { await p.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 20000 }); await p.waitForTimeout(700); };
const shot = (name) => p.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
const tap = async (sel) => { try { await p.locator(sel).first().click({ timeout: 3000 }); await p.waitForTimeout(900); } catch (e) { console.log('tap fail', sel); } };

// 慣用句 Lv1 → 出題（ルビ確認）→ 誤答想定タップ
await go('/apps/kanyo/');
await tap('a:has-text("体の慣用句 基本①"), button:has-text("体の慣用句 基本①"), :is(a,button):has-text("Lv 1")');
await p.waitForTimeout(800);
await shot('kanyo-q1');
// 下半分の選択肢ボタン 2番目をタップ
const btns = p.locator('button');
const c = await btns.count();
const cands = [];
for (let i = 0; i < c; i++) {
  const bb = await btns.nth(i).boundingBox().catch(() => null);
  const txt = (await btns.nth(i).innerText().catch(() => '')).trim();
  if (bb && bb.y > 180 && txt && !/もどる|やめる/.test(txt)) cands.push(i);
}
if (cands.length > 1) { await btns.nth(cands[1]).click().catch(() => {}); await p.waitForTimeout(900); }
await shot('kanyo-q2-after-tap');

// いろとかたち → スタート → 出題3問ぶん（しろ輪郭の確認チャンスを増やす）
await go('/apps/youji-iro/');
await tap('button:has-text("スタート")');
await shot('youjiiro-q1');
for (let r = 2; r <= 4; r++) {
  const bs = p.locator('button');
  const n = await bs.count();
  const cs = [];
  for (let i = 0; i < n; i++) {
    const bb = await bs.nth(i).boundingBox().catch(() => null);
    const txt = (await bs.nth(i).innerText().catch(() => '')).trim();
    if (bb && bb.y > 180 && txt && !/もどる|やめる/.test(txt)) cs.push(i);
  }
  if (cs.length) { await bs.nth(cs[0]).click().catch(() => {}); await p.waitForTimeout(700); }
  // つぎへ があれば押す
  try { await p.locator('button:has-text("つぎへ")').first().click({ timeout: 1500 }); await p.waitForTimeout(700); } catch {}
  await shot(`youjiiro-q${r}`);
}

await b.close();
console.log('DONE2');
