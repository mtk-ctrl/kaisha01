import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox','--disable-setuid-sandbox'] });
const p = await b.newPage();
await p.setViewportSize({ width:390, height:1600 });
await p.goto('http://localhost:3000/', { waitUntil:'domcontentloaded' });
await p.evaluate(()=>localStorage.setItem('tanq-lab-auth','tester'));
await p.goto('http://localhost:3000/juken', { waitUntil:'networkidle' }); await p.waitForTimeout(900);
const info = await p.evaluate(()=>{
  const t=document.body.innerText;
  return { header:(t.match(/単元マップ[^\n]*/)||['(none)'])[0], hasFuriko:t.includes('ふりこ'), hasSoonHeader:t.includes('これから公開（計算') };
});
console.log(JSON.stringify(info));
await p.evaluate(()=>{ const el=document.getElementById('rika'); if(el) el.scrollIntoView(); });
await p.evaluate(()=>window.scrollBy(0,700)); await p.waitForTimeout(400);
await p.screenshot({ path:'/home/user/kaisha01/scripts/screenshots/furiko-juken.png' });
await b.close(); console.log('DONE');
