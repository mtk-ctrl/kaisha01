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
  await page.waitForTimeout(1000);
}

async function shot(page, name, opts = {}) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: opts.full ?? false });
  console.log(`  ✓ ${name}.png`);
}

async function wait(page, ms = 1000) { await page.waitForTimeout(ms); }

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ARGS });

// ── 国語クイズ（kokugo） ─────────────────────────────────
console.log('\n国語クイズ review...');
const k = await makePage(b);
await gotoWithAuth(k, '/apps/kokugo');
await shot(k, 'kokugo_01_top');

// Lv1カードクリック（JS evaluate経由）
await k.evaluate(() => { document.querySelectorAll('button')[0].click(); });
await wait(k, 800);
await shot(k, 'kokugo_02_quiz');

// 1番目の選択肢をクリック
await k.evaluate(() => { document.querySelectorAll('button')[1].click(); });
await wait(k, 500);
await shot(k, 'kokugo_03_selected');

// こたえる
const kotaeru = k.locator('button').filter({ hasText: 'こたえる' }).first();
await kotaeru.click().catch(() => {});
await wait(k, 600);
await shot(k, 'kokugo_04_answered');

await k.close();
console.log('国語クイズ done');

await b.close();
console.log('\nAll done.');
