import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
import fs from 'fs';
const OUT = '/home/user/kaisha01/scripts/screenshots';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox','--disable-setuid-sandbox'] });
const p = await b.newPage();
await p.setViewportSize({ width: 390, height: 900 });
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await p.evaluate(() => { localStorage.setItem('tanq-lab-auth','tester'); localStorage.setItem('tanq-tester-name','リン'); });

// chiri map
await p.goto('http://localhost:3000/apps/chiri', { waitUntil: 'networkidle' });
await p.waitForTimeout(700);
await p.screenshot({ path: `${OUT}/chiri-map.png`, fullPage: true });

// start level 1 → answer wrong then reveal
await p.locator('button:has-text("国土のすがた")').first().click();
await p.waitForTimeout(700);
await p.screenshot({ path: `${OUT}/chiri-q.png` });
// pick a choice that is likely wrong (2nd), confirm
async function answerOnce() {
  const btns = p.locator('main button, button');
  const n = await btns.count();
  const cands = [];
  for (let i=0;i<n;i++){ const bb=await btns.nth(i).boundingBox().catch(()=>null); const t=(await btns.nth(i).innerText().catch(()=>'')).trim(); if(bb&&bb.y>180&&t&&!/もどる|こたえる|つぎへ|ならべ/.test(t)) cands.push(i);}
  if(cands.length>1){ await btns.nth(cands[1]).click().catch(()=>{}); await p.waitForTimeout(300);}
  await p.locator('button:has-text("こたえる")').first().click().catch(()=>{});
  await p.waitForTimeout(600);
}
await answerOnce();
await p.screenshot({ path: `${OUT}/chiri-hint-or-reveal.png` });
// if hint shown (もういちど こたえる), pick again wrong then reveal
const retry = await p.locator('button:has-text("もういちど こたえる")').count();
if (retry) {
  await answerOnce();
  await p.screenshot({ path: `${OUT}/chiri-reveal.png` });
}

// juken shakai section
await p.goto('http://localhost:3000/juken', { waitUntil: 'networkidle' });
await p.waitForTimeout(700);
const sh = p.locator('#shakai');
await sh.scrollIntoViewIfNeeded().catch(()=>{});
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/chiri-juken-shakai.png` });
await b.close(); console.log('DONE');
