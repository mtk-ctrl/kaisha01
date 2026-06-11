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

// ホーム APPS セクション（カード8枚）を要素単位で撮影
await p.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 20000 });
const apps = p.locator('h2:has-text("まなびアプリ")');
await apps.scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/home-apps-1.png` });
await p.mouse.wheel(0, 800); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/home-apps-2.png` });
await p.mouse.wheel(0, 800); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/home-apps-3.png` });
// ヒーロー上部（STATSチップ）
await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await p.mouse.wheel(0, 500); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/home-hero-stats.png` });

// ラボ: テスター認証してセクションごとに撮影
await p.evaluate(() => {
  localStorage.setItem('tanq-lab-auth', 'tester');
  localStorage.setItem('tanq-tester-name', 'リン');
});
await p.goto(`${BASE}/lab`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(1000);
for (const [label, file] of [['就学前', 'lab-sec-youji'], ['小学生', 'lab-sec-shou'], ['中学受験', 'lab-sec-juken']]) {
  const sec = p.locator(`text=${label}`).first();
  try { await sec.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); } catch {}
  await p.screenshot({ path: `${OUT}/${file}-1.png` });
  await p.mouse.wheel(0, 800); await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/${file}-2.png` });
  await p.mouse.wheel(0, 800); await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/${file}-3.png` });
}

await b.close();
console.log('DONE4');
