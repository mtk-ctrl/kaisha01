import { chromium } from 'playwright'
import path from 'path'; import fs from 'fs'
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const OUT='/home/user/kaisha01/tanq-app/scripts/screenshots'; fs.mkdirSync(OUT,{recursive:true})
const b=await chromium.launch({executablePath:CHROME,headless:true})
const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage()
await p.goto('http://localhost:3000/apps/science/',{waitUntil:'networkidle'})
await p.waitForTimeout(500)
// まず生物ドメインを選ぶ
const dom=p.getByText('生物',{exact:true}).first()
if(await dom.isVisible().catch(()=>false)){ await dom.click(); await p.waitForTimeout(600) }
// 生物・小4レベルで出題開始
const lv=p.getByText('小4レベル').first()
if(await lv.isVisible().catch(()=>false)){ await lv.click(); await p.waitForTimeout(700) }
let done=false
for(let i=0;i<10 && !done;i++){
  const choices=p.locator('div.space-y-2 > button')
  if(!(await choices.first().isVisible().catch(()=>false))){ await p.waitForTimeout(400); continue }
  await choices.first().click().catch(()=>{})
  const ans=p.getByRole('button',{name:/こたえる/}).first()
  if(await ans.isVisible().catch(()=>false)){ await ans.click().catch(()=>{}); await p.waitForTimeout(600) }
  if(await p.getByText('それはちがうみたい').isVisible().catch(()=>false)){
    await p.screenshot({path:path.join(OUT,'science-hint.png'),fullPage:true})
    console.log('HINT shown at question',i); done=true; break
  }
  // 正解だった→つぎへ
  const next=p.getByRole('button',{name:/つぎへ|結果/}).first()
  if(await next.isVisible().catch(()=>false)){ await next.click().catch(()=>{}); await p.waitForTimeout(600) }
}
if(!done){ await p.screenshot({path:path.join(OUT,'science-fallback.png'),fullPage:true}); console.log('hint not detected; saved fallback') }
await b.close()
