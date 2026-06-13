import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox','--disable-setuid-sandbox'] });
const p = await b.newPage();
await p.setViewportSize({ width: 390, height: 1000 });
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await p.evaluate(() => { localStorage.setItem('tanq-lab-auth','tester'); localStorage.setItem('tanq-tester-name','リン'); });
const S='/home/user/kaisha01/scripts/screenshots/';
// bane manabu
await p.goto('http://localhost:3000/apps/rika-bane', { waitUntil:'networkidle' }); await p.waitForTimeout(700);
await p.screenshot({ path:S+'bane-manabu.png' });
// skip to problems
await p.locator('button:has-text("スキップして問題へ")').first().click().catch(()=>{}); await p.waitForTimeout(500);
// open first problem
await p.locator('button:has-text("のびは おもさに比例"), button:has-text("のび")').first().click().catch(()=>{}); await p.waitForTimeout(600);
await p.screenshot({ path:S+'bane-q.png' });
// answer wrong: pick a choice that's not the answer. The answer for bane-01 is 10. Pick "5".
async function clickChoice(txt){ const btns=p.locator('button'); const n=await btns.count(); for(let i=0;i<n;i++){ const t=(await btns.nth(i).innerText().catch(()=>'')).trim(); if(t.startsWith(txt)){ await btns.nth(i).click().catch(()=>{}); await p.waitForTimeout(500); return true;} } return false; }
await clickChoice('5');
await p.screenshot({ path:S+'bane-hint.png' });
await clickChoice('15');
await p.screenshot({ path:S+'bane-reveal.png' });
// juken rika
await p.goto('http://localhost:3000/juken#rika', { waitUntil:'networkidle' }); await p.waitForTimeout(700);
const r=p.locator('#rika'); await r.scrollIntoViewIfNeeded().catch(()=>{}); await p.waitForTimeout(400);
await p.screenshot({ path:S+'bane-juken-rika.png' });
await b.close(); console.log('DONE');
