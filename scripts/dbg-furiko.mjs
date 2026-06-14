import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--disable-setuid-sandbox'] });
const p = await b.newPage();
await p.setViewportSize({ width:390, height:1100 });
await p.goto('http://localhost:3000/', { waitUntil:'domcontentloaded' });
await p.evaluate(()=>localStorage.setItem('tanq-lab-auth','tester'));
const S='/home/user/kaisha01/scripts/screenshots/';
await p.goto('http://localhost:3000/apps/rika-furiko', { waitUntil:'networkidle' }); await p.waitForTimeout(1000);
await p.screenshot({ path:S+'furiko-manabu.png' });
async function clickByText(t){ return await p.evaluate((t)=>{ const els=[...document.querySelectorAll('button')]; const el=els.find(e=>e.textContent.includes(t)); if(el){el.click();return el.textContent.trim().slice(0,28);} return null; }, t); }
console.log('skip', await clickByText('スキップして問題へ')); await p.waitForTimeout(700);
await p.evaluate(()=>{ const btns=[...document.querySelectorAll('button')]; const row=btns.find(e=>/›/.test(e.textContent)); if(row) row.click(); });
await p.waitForTimeout(700);
await p.screenshot({ path:S+'furiko-q.png' });
const dump = await p.evaluate(()=>[...document.querySelectorAll('button')].map(e=>e.textContent.trim().slice(0,18)).filter(Boolean));
console.log('btns', JSON.stringify(dump));
await b.close(); console.log('DONE');
