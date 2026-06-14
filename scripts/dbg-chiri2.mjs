import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--disable-setuid-sandbox'] });
const p = await b.newPage();
await p.setViewportSize({ width:390, height:1500 });
await p.goto('http://localhost:3000/', { waitUntil:'domcontentloaded' });
await p.evaluate(()=>localStorage.setItem('tanq-lab-auth','tester'));
const S='/home/user/kaisha01/scripts/screenshots/';
await p.goto('http://localhost:3000/apps/chiri', { waitUntil:'networkidle' }); await p.waitForTimeout(900);
await p.screenshot({ path:S+'chiri2-map.png', fullPage:true });
// open 稲作 level (Lv8)
const opened = await p.evaluate(()=>{ const b=[...document.querySelectorAll('button')].find(e=>e.textContent.includes('稲作')); if(b){b.click();return b.textContent.trim().slice(0,20);} return null;});
console.log('open', opened); await p.waitForTimeout(800);
await p.screenshot({ path:S+'chiri2-q.png' });
await b.close(); console.log('DONE');
