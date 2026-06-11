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

// ホームページ（ゲスト）
await p.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(800);
await p.screenshot({ path: `${OUT}/home-full.png`, fullPage: true });

// ラボ（テスター認証）
await p.evaluate(() => {
  localStorage.setItem('tanq-lab-auth', 'tester');
  localStorage.setItem('tanq-tester-name', 'リン');
});
await p.goto(`${BASE}/lab`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(1000);
await p.screenshot({ path: `${OUT}/lab-full.png`, fullPage: true });

await b.close();
console.log('DONE3');
