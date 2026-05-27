import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:3000';
const OUT  = '/home/user/kaisha01/scripts/screenshots';
const ARGS = ['--no-sandbox','--disable-setuid-sandbox'];

async function makePage(browser) {
  const p = await browser.newPage();
  await p.setViewportSize({ width: 390, height: 844 });
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
await wait(k, 800);
await shot(k, 'kanji_01_top');

// 学年を選ぶ（小4）
const gradeBtn = k.locator('button').filter({ hasText: '小4' }).first();
await gradeBtn.click().catch(() => {});
await wait(k, 600);
await shot(k, 'kanji_02_grade_selected');

// 問題スタート
const startBtn = k.locator('button').filter({ hasText: /スタート/ }).first();
await startBtn.click().catch(() => {});
await wait(k, 1000);
await shot(k, 'kanji_03_quiz');

// 1問目の選択肢を選ぶ（最初の選択肢ボタン）
const choices = k.locator('.grid.grid-cols-2 button');
await choices.first().click().catch(() => {});
await wait(k, 800);
await shot(k, 'kanji_04_answered');

// 次の問題へ
const nextBtn = k.locator('button').filter({ hasText: /次の問題|結果/ }).first();
await nextBtn.click().catch(() => {});
await wait(k, 600);
await shot(k, 'kanji_05_next_q');

await k.close();
console.log('漢字マスター done');

await b.close();
console.log('\nAll done.');
