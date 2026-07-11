// TANQ アプリアイコン生成（ホーム画面ショートカット用）
// SVG（フォント非依存・図形のみ）を Chromium で各サイズにレンダリングして PNG 化する。
// 出力: tanq-app/public/icons/icon-{512,192}.png, apple-touch-icon.png(180), favicon-32.png
import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
import fs from 'fs';

const OUT = '/home/user/kaisha01/tanq-app/public/icons';
fs.mkdirSync(OUT, { recursive: true });

// 丸ゴシック風の「T」をパスで描く（角丸バー＋角丸ステム）＋きらめき。maskable 対応で全面グラデ背景
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8B6CF0"/>
      <stop offset="1" stop-color="#5B3FB8"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <circle cx="96" cy="428" r="150" fill="#FFFFFF" opacity="0.06"/>
  <circle cx="430" cy="60" r="120" fill="#FFFFFF" opacity="0.07"/>
  <rect width="512" height="256" fill="url(#shine)"/>
  <!-- T: 横バー -->
  <rect x="112" y="126" width="288" height="78" rx="39" fill="#FFFFFF"/>
  <!-- T: 縦ステム -->
  <rect x="217" y="126" width="78" height="262" rx="39" fill="#FFFFFF"/>
  <!-- きらめき（探究のスパーク） -->
  <path d="M400 88 L412 118 L442 130 L412 142 L400 172 L388 142 L358 130 L388 118 Z" fill="#FFD34D"/>
  <circle cx="352" cy="180" r="10" fill="#FFD34D" opacity="0.9"/>
</svg>`;

const html = `<!doctype html><html><head><style>
  * { margin:0; padding:0 }
  html,body { width:100%; height:100%; overflow:hidden }
  svg { display:block; width:100vw; height:100vh }
</style></head><body>${svg}</body></html>`;

const tmp = '/tmp/tanq-icon.html';
fs.writeFileSync(tmp, html);

const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

for (const [name, size] of [
  ['icon-512.png', 512],
  ['icon-192.png', 192],
  ['apple-touch-icon.png', 180],
  ['favicon-32.png', 32],
]) {
  const p = await b.newPage({ viewport: { width: size, height: size } });
  await p.goto('file://' + tmp);
  await p.screenshot({ path: `${OUT}/${name}` });
  await p.close();
  console.log('wrote', name);
}
await b.close();
console.log('done');
