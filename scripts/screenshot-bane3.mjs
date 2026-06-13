import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox','--disable-setuid-sandbox'] });
const p = await b.newPage();
await p.setViewportSize({ width: 390, height: 1000 });
await p.goto('http://localhost:3000/', { waitUntil:'domcontentloaded' });
await p.evaluate(() => { localStorage.setItem('tanq-lab-auth','tester'); });
const S='/home/user/kaisha01/scripts/screenshots/';
await p.goto('http://localhost:3000/apps/rika-bane', { waitUntil:'networkidle' }); await p.waitForTimeout(1200);
async function clickByText(t){ return await p.evaluate((t)=>{ const els=[...document.querySelectorAll('button')]; const el=els.find(e=>e.textContent.includes(t)); if(el){el.click();return el.textContent.trim();} return null; }, t); }
console.log('skip ->', await clickByText('スキップして問題へ')); await p.waitForTimeout(800);
await p.screenshot({ path:S+'bane-list.png' });
console.log('open ->', await clickByText('のびは おもさに比例')); await p.waitForTimeout(800);
await p.screenshot({ path:S+'bane-q.png' });
console.log('w1 ->', await clickByText('5')); await p.waitForTimeout(700);   // wrong (ans=10)
await p.screenshot({ path:S+'bane-hint.png' });
console.log('w2 ->', await clickByText('15')); await p.waitForTimeout(700);  // wrong again → reveal
await p.screenshot({ path:S+'bane-reveal.png' });
await b.close(); console.log('DONE3');
