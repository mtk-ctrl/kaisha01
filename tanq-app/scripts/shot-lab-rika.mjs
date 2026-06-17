import { chromium } from 'playwright'
import path from 'path'; import fs from 'fs'
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const OUT='/home/user/kaisha01/tanq-app/scripts/screenshots'; fs.mkdirSync(OUT,{recursive:true})
const b=await chromium.launch({executablePath:CHROME,headless:true})
const ctx=await b.newContext({viewport:{width:390,height:844}})
await ctx.addCookies([{name:'tanq-lab-auth',value:'tester',domain:'localhost',path:'/'}])
const p=await ctx.newPage()
await p.addInitScript(()=>{try{localStorage.setItem('tanq-lab-auth','tester')}catch{}})

// 1) lab の中学受験セクション（理科4枚）
await p.goto('http://localhost:3100/lab/',{waitUntil:'networkidle'})
await p.waitForTimeout(800)
const rika=p.getByText('理科〈生物〉',{exact:true}).first()
if(await rika.isVisible().catch(()=>false)){ await rika.scrollIntoViewIfNeeded().catch(()=>{}) }
await p.waitForTimeout(400)
await p.screenshot({path:path.join(OUT,'lab-rika4.png')})
console.log('saved lab-rika4.png')

// 2) 領域ディープリンク（化学）が化学のDomainViewに着地するか
await p.goto('http://localhost:3100/apps/science/?domain=化学',{waitUntil:'networkidle'})
await p.waitForTimeout(900)
await p.screenshot({path:path.join(OUT,'science-deeplink-kagaku.png'),fullPage:true})
console.log('saved science-deeplink-kagaku.png')
await b.close()
