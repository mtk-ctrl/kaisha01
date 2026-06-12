// 国語〈読解〉ためしてみる版 画面レビュー用スクリーンショット
// フロー: ホーム → 出題 → わざと不正解（足場ヒント）→ 再挑戦（根拠ハイライト）→ 結果（感想3択）→ /juken 国語 → /lab
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

// ── 1. ホーム（ステップ選択） ──
await p.goto(`${BASE}/apps/dokkai`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/dokkai-home.png`, fullPage: true });

// ── 2. ステップ1: 出題 → わざと不正解 → 足場ヒント → 再挑戦 → 根拠ハイライト ──
await p.locator('.dk-step').first().click();
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/dokkai-q1.png`, fullPage: true });

// 1問目: 不正解になるまで選択肢を順に試す（正解を引いたら次の問題で再試行）
let gotHint = false;
for (let i = 0; i < 10 && !gotHint; i++) {
  // まだヒントを撮れていなければ、わざと不正解をねらって順に選ぶ
  for (let c = 0; c < 4 && !gotHint; c++) {
    const btn = p.locator('.dk-choice:not([disabled])').nth(0);
    // c 番目を選ぶ（無効化されていないもの）
    await p.locator('.dk-choice:not([disabled])').nth(Math.min(c, await p.locator('.dk-choice:not([disabled])').count() - 1)).click();
    await p.locator('button:has-text("こたえる")').first().click();
    await p.waitForTimeout(500);
    if (await p.locator('text=本文にもどってみよう').count() > 0) {
      gotHint = true;
      await p.screenshot({ path: `${OUT}/dokkai-hint.png`, fullPage: true });
      // 再挑戦: 無効化されていない選択肢を選んで答え合わせ → 根拠ハイライト
      await p.locator('.dk-choice:not([disabled])').first().click();
      await p.locator('button:has-text("もういちど こたえる")').click();
      await p.waitForTimeout(500);
      await p.screenshot({ path: `${OUT}/dokkai-evidence.png`, fullPage: true });
      break;
    }
    // 初回正解だった → 根拠ハイライト（正解時）を一度だけ撮って次へ
    if (i === 0) await p.screenshot({ path: `${OUT}/dokkai-correct.png`, fullPage: true });
    break;
  }
  if (!gotHint) {
    await p.locator('button:has-text("つぎへ"), button:has-text("結果を見る")').first().click();
    await p.waitForTimeout(400);
  }
}

// ── 3. 残りを全部解いて結果画面（感想3択）へ ──
for (let i = 0; i < 30; i++) {
  if (await p.locator('text=おもしろかった？').count() > 0) break;
  if (await p.locator('button:has-text("もういちど こたえる")').count() > 0) {
    await p.locator('.dk-choice:not([disabled])').first().click();
    await p.locator('button:has-text("もういちど こたえる")').click();
    await p.waitForTimeout(350);
    continue;
  }
  if (await p.locator('button:has-text("つぎへ"), button:has-text("結果を見る")').count() > 0
      && await p.locator('.dk-choice[disabled]').count() === 4) {
    await p.locator('button:has-text("つぎへ"), button:has-text("結果を見る")').first().click();
    await p.waitForTimeout(350);
    continue;
  }
  if (await p.locator('.dk-choice:not([disabled])').count() > 0) {
    await p.locator('.dk-choice:not([disabled])').first().click();
    await p.locator('button:has-text("こたえる")').first().click();
    await p.waitForTimeout(350);
    continue;
  }
  break;
}
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/dokkai-result.png`, fullPage: true });
// 感想3択をタップ → ありがとう表示
if (await p.locator('.dk-mood').count() > 0) {
  await p.locator('.dk-mood').first().click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}/dokkai-result-mood.png`, fullPage: true });
}

// ── 4. ステップ2の出題画面（だんらく＝本文が長い）──
await p.goto(`${BASE}/apps/dokkai`, { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.locator('.dk-step').nth(1).click();
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/dokkai-step2-q.png`, fullPage: true });

// ── 5. /juken 国語セクション ──
await p.goto(`${BASE}/juken`, { waitUntil: 'networkidle', timeout: 20000 });
await p.locator('#kokugo').scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
await p.screenshot({ path: `${OUT}/dokkai-juken-kokugo.png` });

// ── 6. /lab 中学受験セクション ──
await p.goto(`${BASE}/lab`, { waitUntil: 'networkidle', timeout: 20000 });
await p.waitForTimeout(800);
await p.mouse.wheel(0, 500); await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/dokkai-lab-card.png` });

await b.close();
console.log('DONE dokkai screenshots');
