import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:3000';
const OUT  = '/home/user/kaisha01/scripts/screenshots';
const ARGS = ['--no-sandbox','--disable-setuid-sandbox'];

async function makePage(browser) {
  const p = await browser.newPage();
  await p.setViewportSize({ width: 390, height: 844 });
  return p;
}

async function gotoWithAuth(page, path) {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.evaluate(() => {
    localStorage.setItem('tanq-lab-auth', 'tester');
    localStorage.setItem('tanq-tester-name', 'リン');
  });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(800);
}

async function shot(page, name, opts = {}) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: opts.full ?? false });
  console.log(`  ✓ ${name}.png`);
}

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ARGS });

// Batch of apps: top screen only for quick review
const apps = [
  { path: '/apps/clock', name: 'clock' },
  { path: '/apps/juku', name: 'juku' },
  { path: '/apps/shapes', name: 'shapes' },
  { path: '/apps/thinking', name: 'thinking' },
  { path: '/apps/todofuken', name: 'todofuken' },
  { path: '/apps/word-math', name: 'word_math' },
  { path: '/apps/coding', name: 'coding' },
];

for (const app of apps) {
  console.log(`\n${app.name} review...`);
  const p = await makePage(b);
  await gotoWithAuth(p, app.path);
  await shot(p, `${app.name}_01_top`);
  // クリックしてクイズ/ゲーム画面へ
  await p.evaluate(() => { const btns = document.querySelectorAll('button'); if (btns[0]) btns[0].click(); });
  await p.waitForTimeout(800);
  const btnCnt = await p.locator('button').count();
  if (btnCnt < 15) { // おそらく別画面へ遷移した
    await shot(p, `${app.name}_02_game`);
  }
  await p.close();
  console.log(`${app.name} done`);
}

await b.close();
console.log('\nAll done.');
