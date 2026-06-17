import { chromium } from 'playwright'
import path from 'path'; import fs from 'fs'
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const OUT='/home/user/kaisha01/tanq-app/scripts/screenshots'
const b=await chromium.launch({executablePath:CHROME,headless:true})
const ctx=await b.newContext({viewport:{width:390,height:844}})
await ctx.addCookies([{name:'tanq-lab-auth',value:'tester',domain:'localhost',path:'/'}])
const p=await ctx.newPage()
await p.addInitScript(()=>{try{localStorage.setItem('tanq-lab-auth','tester')}catch{}})
await p.goto('http://localhost:3100/lab/',{waitUntil:'networkidle'})
await p.waitForTimeout(900)
// 中学受験の先頭（算数→国語…）へ
const juku=p.getByText('算数',{exact:true}).first()
if(await juku.isVisible().catch(()=>false)){ await juku.scrollIntoViewIfNeeded().catch(()=>{}); }
await p.waitForTimeout(300)
await p.screenshot({path:path.join(OUT,'lab-sec-juken.png')})
// 小学生セクション
const sho=p.getByText('漢字マスター',{exact:true}).first()
if(await sho.isVisible().catch(()=>false)){ await sho.scrollIntoViewIfNeeded().catch(()=>{}); }
await p.waitForTimeout(300)
await p.screenshot({path:path.join(OUT,'lab-sec-sho.png')})
console.log('done')
await b.close()
