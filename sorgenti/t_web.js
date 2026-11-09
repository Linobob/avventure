const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');
const html=await p.evaluate(()=>compilaWeb(CORE));
require('fs').writeFileSync('la-casa-vuota.html',html);
console.log('dimensione',html.length,'contiene "cucina"?',/cucina|arrugginit|moneta/i.test(html),'titolo?',html.includes('La casa vuota'));
const g=await b.newPage({viewport:{width:390,height:700}}); g.on('pageerror',e=>errs.push('gioco: '+e.message));
await g.goto('file://'+process.cwd()+'/la-casa-vuota.html'); await g.waitForTimeout(300);
for(const c of ['prendi chiave','n','apri porta con chiave','e','xyz']){await g.fill('#cmd',c);await g.press('#cmd','Enter');}
console.log((await g.textContent('#registro')).slice(-260));
// scheda Compila e anteprima
await p.evaluate(()=>schedeAperte(true));await p.click('.scheda[data-tab=compila]');await p.waitForTimeout(800);
console.log(await p.textContent('#p-compila .dato'));
await p.click('text=Anteprima');await p.waitForTimeout(800);
const fr=p.frameLocator('iframe.anteprima'); console.log('anteprima:',(await fr.locator('#registro').textContent()).slice(0,60));
await p.screenshot({path:'sh_web.png'});
console.log('errs',errs);await b.close()})();
