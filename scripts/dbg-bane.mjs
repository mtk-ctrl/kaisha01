import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--disable-setuid-sandbox'] });
const p = await b.newPage();
await p.goto('http://localhost:3000/', { waitUntil:'domcontentloaded' });
await p.evaluate(()=>localStorage.setItem('tanq-lab-auth','tester'));
const r = await p.goto('http://localhost:3000/apps/rika-bane', { waitUntil:'networkidle' });
await p.waitForTimeout(1500);
console.log('status', r.status());
const info = await p.evaluate(()=>({
  btns:[...document.querySelectorAll('button')].map(e=>e.textContent.trim().slice(0,24)),
  bodyHead: document.body.innerText.slice(0,200)
}));
console.log('BTN COUNT', info.btns.length);
console.log(JSON.stringify(info.btns));
console.log('BODY:', info.bodyHead);
await b.close();
