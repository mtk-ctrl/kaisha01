// 理科〈てこのつり合い〉＋ /juken 理科単元マップ ＋ science 単元えらび 画面レビュー
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

// tester 認証
await p.goto(`${BASE}/lab`, { waitUntil: 'domcontentloaded' });
await p.evaluate(() => {
  localStorage.setItem('tanq-lab-auth', 'tester');
  localStorage.setItem('tanq-tester-name', 'リン');
});

// ── 1. てこ: まなぶ（図解導入スライド）──
await p.goto(`${BASE}/apps/rika-teko`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/teko-1-manabu-slide1.png` });
await p.locator('button:has-text("つぎへ →")').click(); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/teko-2-manabu-slide2-moment.png` });
await p.locator('button:has-text("つぎへ →")').click(); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/teko-3-manabu-slide3-tsuriai.png` });
await p.locator('button:has-text("つぎへ →")').click(); await p.waitForTimeout(300);
await p.locator('button:has-text("つぎへ →")').click(); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/teko-4-manabu-slide5-steps.png` });
await p.locator('button:has-text("問題をとく →")').click(); await p.waitForTimeout(500);

// ── 2. 問題一覧 → 第1問 ──
await p.screenshot({ path: `${OUT}/teko-5-list.png` });
await p.locator('button:has-text("はじめてのつり合い")').click();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/teko-6-solving.png` });

// ── 3. わざと不正解（1回目 → 足場ヒント）──
// teko-01 の正解は 5。正解以外の選択肢をクリック
const clickChoice = async (wantCorrect) => {
  const handles = await p.locator('button.font-black.text-base').elementHandles();
  for (const h of handles) {
    const t = (await h.textContent())?.trim() ?? '';
    const num = t.replace(/g$|cm$|kg$|こ$/, '').trim();
    const isCorrect = num === '5';
    if (isCorrect === wantCorrect && !(await h.isDisabled())) { await h.click(); return; }
  }
};
await clickChoice(false);
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/teko-7-wrong1-scaffold.png` });

// ── 4. 2回目も不正解 → 答え＋図解説明 ──
await clickChoice(false);
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/teko-8-wrong2-reveal.png` });
await p.mouse.wheel(0, 500); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/teko-9-wrong2-reveal-scroll.png` });

// ── 5. 次の問題で正解パターン（teko-02 正解は 30）──
await p.locator('button:has-text("つぎの問題 →")').click();
await p.waitForTimeout(500);
const clickByNum = async (num) => {
  const handles = await p.locator('button.font-black.text-base').elementHandles();
  for (const h of handles) {
    const t = (await h.textContent())?.trim() ?? '';
    if (t.replace(/g$|cm$|kg$|こ$/, '').trim() === num) { await h.click(); return; }
  }
};
await clickByNum('30');
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/teko-10-correct.png` });

// ── 6. /juken 理科の単元マップ ──
await p.goto(`${BASE}/juken#rika`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(800);
await p.locator('#rika').scrollIntoViewIfNeeded();
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/juken-rika-1.png` });
await p.mouse.wheel(0, 700); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/juken-rika-2.png` });
await p.mouse.wheel(0, 700); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/juken-rika-3.png` });
await p.mouse.wheel(0, 700); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/juken-rika-4.png` });

// ── 7. science 単元ディープリンク（/juken からの導線）──
await p.goto(`${BASE}/apps/science?unit=rika-bio-plants`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(800);
await p.screenshot({ path: `${OUT}/science-unit-quiz.png` });

// ── 8. science 領域画面の単元えらび ──
await p.goto(`${BASE}/apps/science`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(500);
await p.locator('button:has-text("物理")').first().click();
await p.waitForTimeout(500);
await p.mouse.wheel(0, 800); await p.waitForTimeout(300);
await p.screenshot({ path: `${OUT}/science-unit-select.png` });

await b.close();
console.log('done');
