import { chromium } from '/home/user/kaisha01/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox','--disable-setuid-sandbox'] });
const p = await b.newPage();
await p.setViewportSize({ width: 390, height: 1000 });
await p.goto('http://localhost:3000/', { waitUntil:'domcontentloaded' });
await p.evaluate(() => { localStorage.setItem('tanq-lab-auth','tester'); localStorage.setItem('tanq-tester-name','リン'); });
const S='/home/user/kaisha01/scripts/screenshots/';
await p.goto('http://localhost:3000/apps/rika-bane', { waitUntil:'networkidle' }); await p.waitForTimeout(800);
// click skip by exact text
await p.getByText('スキップして問題へ', { exact:false }).click(); await p.waitForTimeout(700);
await p.screenshot({ path:S+'bane-list.png' });
// open first problem row (first button in the list area with a title) — click row containing のびは
await p.getByText('のびは おもさに比例').click(); await p.waitForTimeout(700);
await p.screenshot({ path:S+'bane-q.png' });
// wrong answer: answer is 10, click 5
await p.getByRole('button', { name:/^5\b/ }).first().click().catch(async()=>{ await p.locator('button').filter({hasText:/^5/}).first().click().catch(()=>{});});
await p.waitForTimeout(600);
await p.screenshot({ path:S+'bane-hint.png' });
// second wrong → reveal: click 15
await p.locator('button').filter({hasText:/^15/}).first().click().catch(()=>{});
await p.waitForTimeout(600);
await p.screenshot({ path:S+'bane-reveal.png' });
await b.close(); console.log('DONE2');
