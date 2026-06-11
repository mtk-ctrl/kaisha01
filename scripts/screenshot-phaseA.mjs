// Phase A 構造改革の画面レビュー用: /juken 4教科 + /lab 上段
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

// テスター認証（lab はPW制）
await p.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 20000 });
await p.evaluate(() => {
  localStorage.setItem('tanq-lab-auth', 'tester');
  localStorage.setItem('tanq-tester-name', 'リン');
});

// ── /juken: ヘッダー + 4教科セクション ──
await p.goto(`${BASE}/juken`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(800);
await p.screenshot({ path: `${OUT}/juken-top.png` });
for (const [id, file] of [['sansuu', 'juken-sansuu'], ['kokugo', 'juken-kokugo'], ['rika', 'juken-rika'], ['shakai', 'juken-shakai']]) {
  await p.evaluate((sec) => document.getElementById(sec)?.scrollIntoView(), id);
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/${file}-1.png` });
  await p.mouse.wheel(0, 700); await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/${file}-2.png` });
}
// 算数の続き（近日公開の並び）
await p.evaluate(() => document.getElementById('sansuu')?.scrollIntoView());
await p.mouse.wheel(0, 1400); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/juken-sansuu-3.png` });

// ── /lab 上段（🎓中学受験 → 🌱ジュニア帯）──
await p.goto(`${BASE}/lab`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(1000);
await p.screenshot({ path: `${OUT}/lab-top-1.png` });
await p.mouse.wheel(0, 700); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/lab-top-2.png` });
await p.mouse.wheel(0, 700); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/lab-top-3.png` });
await p.mouse.wheel(0, 700); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/lab-top-4.png` });

// 設定タブ（並び順UIの互換確認）
const settingsTab = p.locator('text=せってい').first();
try {
  await settingsTab.click(); await p.waitForTimeout(800);
  await p.mouse.wheel(0, 900); await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/lab-settings.png` });
} catch (e) { console.log('settings tab not found:', e.message); }

await b.close();
console.log('DONE-phaseA');
