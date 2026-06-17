import { chromium } from 'playwright'
import path from 'path'; import fs from 'fs'
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const OUT='/home/user/kaisha01/tanq-app/scripts/screenshots'
const b=await chromium.launch({executablePath:CHROME,headless:true})
const ctx=await b.newContext({viewport:{width:390,height:900}})
await ctx.addCookies([{name:'tanq-lab-auth',value:'tester',domain:'localhost',path:'/'}])
const p=await ctx.newPage()
await p.addInitScript(()=>{try{localStorage.setItem('tanq-lab-auth','tester')}catch{}})
await p.goto('http://localhost:3100/lab/',{waitUntil:'networkidle'})
await p.waitForTimeout(800)
// 中学受験の見出しへ
const h=p.getByText('中学受験',{exact:false}).first()
if(await h.isVisible().catch(()=>false)){ await h.scrollIntoViewIfNeeded().catch(()=>{}); }
await p.evaluate(()=>window.scrollBy(0,-20))
await p.waitForTimeout(300)
await p.screenshot({path:path.join(OUT,'lab-order-juken1.png')})
await p.evaluate(()=>window.scrollBy(0,820)); await p.waitForTimeout(300)
await p.screenshot({path:path.join(OUT,'lab-order-juken2.png')})
console.log('done')
await b.close()
