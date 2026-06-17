import { chromium } from 'playwright'
import path from 'path'; import fs from 'fs'
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const OUT='/home/user/kaisha01/tanq-app/scripts/screenshots'; fs.mkdirSync(OUT,{recursive:true})
const b=await chromium.launch({executablePath:CHROME,headless:true})
const ctx=await b.newContext({viewport:{width:390,height:844}})
await ctx.addCookies([{name:'tanq-lab-auth',value:'tester',domain:'localhost',path:'/'}])
const p=await ctx.newPage()
await p.addInitScript(()=>{try{localStorage.setItem('tanq-lab-auth','tester')}catch{}})
await p.goto('http://localhost:3100/lab/',{waitUntil:'networkidle'})
await p.waitForTimeout(900)
await p.screenshot({path:path.join(OUT,'lab-colors-full.png'),fullPage:true})
console.log('saved lab-colors-full.png')
await b.close()
