const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const OUT_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

async function shot(page, filename, waitMs = 800) {
  await page.waitForTimeout(waitMs);
  await page.screenshot({ path: path.join(OUT_DIR, filename) });
  console.log(`  📸 ${filename}`);
}

async function main() {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE_URL}/youji/apps/todofuken/`, { waitUntil: 'domcontentloaded' });

  // 1. かたちクイズ
  await page.evaluate(() => openSetup('shape'));
  await page.evaluate(() => startGame());
  await shot(page, '03_game_shape.png');

  // 2. 回答 → フィードバック → つぎへ → やめる
  await page.evaluate(() => answer(0));
  await shot(page, '04_feedback.png');
  await page.evaluate(() => nextQuestion());
  await page.evaluate(() => confirmQuit());
  await page.evaluate(() => doQuit());
  await page.waitForTimeout(300);

  // 3. どこかなクイズ（前のフィードバックが残らないか確認）
  await page.evaluate(() => openSetup('location'));
  await page.evaluate(() => startGame());
  await shot(page, '05_game_location.png');

  const overlayHidden = await page.$eval('#feedback-overlay', el => el.classList.contains('hidden'));
  console.log(`  フィードバックオーバーレイ hidden: ${overlayHidden} ${overlayHidden ? '✅ 修正OK' : '❌ まだ残っている'}`);

  // 4. フラッシュカード
  await page.evaluate(() => openFlashcard());
  await shot(page, '06_flashcard.png');

  await browser.close();
  console.log('\n完了。');
}

main().catch(e => { console.error('エラー:', e.message); process.exit(1); });
