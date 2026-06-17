import { chromium } from 'playwright'
import path from 'path'; import fs from 'fs'
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const OUT='/home/user/kaisha01/tanq-app/scripts/screenshots'; fs.mkdirSync(OUT,{recursive:true})
const b=await chromium.launch({executablePath:CHROME,headless:true})
const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage()
await p.goto('http://localhost:3100/apps/science/',{waitUntil:'networkidle'})
await p.waitForTimeout(500)
const dom=p.getByText('地学',{exact:true}).first()
if(await dom.isVisible().catch(()=>false)){ await dom.click(); await p.waitForTimeout(700) }
await p.screenshot({path:path.join(OUT,'science-domain-chigaku.png'),fullPage:true})
console.log('saved science-domain-chigaku.png')
await b.close()
