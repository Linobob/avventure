// Immagini degli oggetti: scheda oggetto, scelta dei verbi in Parole, Prova e gioco Web compilato.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(400);
await p.evaluate(()=>schedeAperte(true));await p.click('.scheda[data-tab=oggetti]');await p.evaluate(()=>{aperte.add('giardiniere');ridisegna()});await p.waitForTimeout(200);
await p.locator('#p-oggetti details[open].card input[type=file]').first().setInputFiles('/tmp/t_img_p.png');await p.waitForTimeout(800);
console.log('oggetto',await p.evaluate(()=>!!CORE.oggetti.find(o=>o.id==='giardiniere').immagine));
await p.locator('#p-oggetti details[open].card .img-sistemi').scrollIntoViewIfNeeded();await p.screenshot({path:'sh_imgogg_ed.png'});
// scheda Parole: spunta «parla»
await p.evaluate(()=>schedeAperte(true));await p.click('.scheda[data-tab=parole]');await p.evaluate(()=>{aperte.add('p-verbi');ridisegna()});await p.waitForTimeout(200);
console.log('caselle',await p.locator('.verbi-img label').allInnerTexts());
await p.locator('.verbi-img label',{hasText:/^parla$/}).locator('input').check();await p.waitForTimeout(100);
console.log('verbi_immagine',await p.evaluate(()=>JSON.stringify(CORE.verbi_immagine)));
await p.locator('.verbi-img').scrollIntoViewIfNeeded();await p.screenshot({path:'sh_imgogg_parole.png'});
// Prova: nord, guarda giardiniere, parla con giardiniere, prendi giardiniere (niente immagine)
await p.evaluate(()=>schedeAperte(true));await p.click('.scheda[data-tab=prova]');await p.waitForTimeout(300);
const n=async()=>p.evaluate(()=>document.querySelectorAll('#registro img.fig').length);
const res=[];for(const c of ['nord','guarda giardiniere','parla con il giardiniere','prendi giardiniere','guarda pippo']){await p.fill('#testo-comando',c);await p.press('#testo-comando','Enter');await p.waitForTimeout(150);res.push(c+': '+await n());}
console.log('prova',res.join(' | '));await p.screenshot({path:'sh_imgogg_prova.png'});
const html=await p.evaluate(async()=>compilaWeb(coreDelGioco().core));fs.writeFileSync('/tmp/t_imgogg.html',html);
const g=await b.newPage({viewport:{width:390,height:700}});g.on('pageerror',e=>errs.push('gioco: '+e.message));await g.goto('file:///tmp/t_imgogg.html');await g.waitForTimeout(400);
for(const c of ['nord','parla con il giardiniere']){await g.fill('#cmd',c);await g.press('#cmd','Enter');await g.waitForTimeout(200);}
console.log('web',await g.evaluate(()=>[document.querySelectorAll('#registro img.fig').length,document.querySelector('#registro img.fig:last-of-type').nextElementSibling.textContent.slice(0,40)]));
await g.screenshot({path:'sh_imgogg_web.png'});
// file salvato: contiene l'immagine dell'oggetto
console.log('file',await p.evaluate(()=>Object.keys(coreConImmagini(CORE).immagini||{}).length));
console.log('errs',errs);await b.close()})();
