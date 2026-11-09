const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({acceptDownloads:true,viewport:{width:390,height:1200}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(400);
await p.evaluate(()=>schedeAperte(true));await p.click('.scheda[data-tab=compila]');await p.waitForTimeout(1500);
const out=[];
for(const lab of ['Salva il gioco (.html)','Salva per C64 (.prg)','Salva per Spectrum (.tap)']){
  const [d]=await Promise.all([p.waitForEvent('download',{timeout:8000}),p.click('button:has-text("'+lab+'")')]);
  const f='dl_'+d.suggestedFilename();await d.saveAs(f);out.push(f+' '+require('fs').statSync(f).size);
}
await p.evaluate(()=>schedeAperte(true));await p.click('.scheda[data-tab=core]');await p.waitForTimeout(300);
const [d]=await Promise.all([p.waitForEvent('download',{timeout:8000}),p.click('#esporta')]);out.push(d.suggestedFilename());
console.log(out,errs);await b.close()})();
