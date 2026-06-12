// Phase C-1 画面レビュー: /lab 相棒ウィジェット + /buddy オンボーディング・育成画面
import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox','--disable-setuid-sandbox'] });
const p = await b.newPage();
await p.setViewportSize({ width: 390, height: 900 });
const out = (n) => `/home/user/kaisha01/scripts/screenshots/${n}.png`;

// テスター認証 + コイン直書き（テスターのデータキーは ::t::名前 付き）
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await p.evaluate(() => {
  localStorage.setItem('tanq-lab-auth', 'tester');
  localStorage.setItem('tanq-tester-name', 'リン');
  localStorage.setItem('tanq_coins_v1::t::リン', JSON.stringify({ balance: 120, lifetime: 120, log: [] }));
});

// 1) /lab 初回（相棒未作成 → 誘導カード）
await p.goto('http://localhost:3000/lab', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
await p.screenshot({ path: out('c1-lab-initial') });

// 2) /buddy キャラ選択
await p.goto('http://localhost:3000/buddy', { waitUntil: 'networkidle' });
await p.waitForTimeout(600);
await p.screenshot({ path: out('c1-buddy-select') });

// 3) ドラゴンを選ぶ → 名前入力画面
await p.locator('text=ドラゴン').first().click();
await p.waitForTimeout(400);
await p.screenshot({ path: out('c1-buddy-name') });

// 4) けってい（空欄 → デフォルト名リュウ）→ 育成画面
await p.locator('text=けってい！').click();
await p.waitForTimeout(500);
await p.screenshot({ path: out('c1-buddy-home') });

// 5) ごはん（ハート演出 + コイン 120→110）
await p.locator('text=ごはんを あげる').click();
await p.waitForTimeout(500);
await p.screenshot({ path: out('c1-buddy-feed') });

// 6) ごはんを上限まで（残り回数表示の確認）
await p.locator('text=ごはんを あげる').click();
await p.waitForTimeout(300);
await p.locator('text=ごはんを あげる').click();
await p.waitForTimeout(500);
await p.screenshot({ path: out('c1-buddy-feed-limit') });

// 7) きせかえ購入（ぼうし 30コイン）
await p.locator('text=🪙30 でかう').click();
await p.waitForTimeout(500);
await p.screenshot({ path: out('c1-buddy-buy') });

// 8) /lab に戻って相棒ウィジェット
await p.goto('http://localhost:3000/lab', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
await p.screenshot({ path: out('c1-lab-widget') });

// 検証: localStorage の最終状態を出力
const state = await p.evaluate(() => ({
  coins: localStorage.getItem('tanq_coins_v1::t::リン'),
  buddy: localStorage.getItem('tanq_buddy_v1::t::リン'),
}));
console.log('coins:', state.coins);
console.log('buddy:', state.buddy);
await b.close();
console.log('DONE');
