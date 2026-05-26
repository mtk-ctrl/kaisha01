import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';

const BASE = 'https://tanq-app.vercel.app';
const OUT  = '/home/user/kaisha01/scripts/screenshots';
const ARGS = ['--no-sandbox','--disable-setuid-sandbox','--ignore-certificate-errors'];

async function makePage(browser) {
  const p = await browser.newPage();
  await p.setViewportSize({ width: 390, height: 844 });
  // テスターとしてlocalStorageをセット
  await p.addInitScript(() => {
    localStorage.setItem('tanq-lab-auth', 'tester');
    localStorage.setItem('tanq-tester-name', 'リン');
  });
  return p;
}

async function shot(page, name, opts = {}) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: opts.full ?? false });
  console.log(`  ✓ ${name}.png`);
}

async function wait(page, ms = 1200) { await page.waitForTimeout(ms); }

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ARGS });

// ── kanji ─────────────────────────────────────────────────
console.log('\n漢字マスター review...');
const k = await makePage(b);
await k.goto(`${BASE}/apps/kanji`, { waitUntil: 'networkidle', timeout: 15000 });
await wait(k);
await shot(k, 'kanji_01_top');
// 学年を選ぶ
const gradeBtn = k.locator('button, [role=button]').filter({ hasText: /小[1-6]/ }).first();
await gradeBtn.click().catch(() => {});
await wait(k, 800);
await shot(k, 'kanji_02_grade_selected');
// 問題スタート
const startBtn = k.locator('button').filter({ hasText: /はじめ|スタート|れんしゅう|練習/ }).first();
await startBtn.click().catch(() => {});
await wait(k, 1000);
await shot(k, 'kanji_03_quiz_screen');

await k.close();
console.log('漢字マスター done');

await b.close();
console.log('\nAll done.');
