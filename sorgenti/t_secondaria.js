// Evento «guardando un oggetto» nell'editor e quest secondaria nella scheda Soluzione.
const {chromium}=require('playwright');
const SP=process.env.SP||'/tmp';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(300);
await p.evaluate(()=>{CORE=copia(CORE_ESEMPIO);});
await p.evaluate(()=>schedeAperte(true));await p.click('.scheda[data-tab=regole]');await p.waitForTimeout(300);
// nuovo evento, poi «guarda un oggetto»
await p.click('text=+ Nuovo evento');await p.waitForTimeout(200);
const n=await p.evaluate(()=>CORE.eventi.length-1);
await p.evaluate(n=>{const s=[...document.querySelectorAll('select')].find(s=>[...s.options].some(o=>o.value==='guarda')&&s.closest('details')&&s.closest('details').open);s.value='guarda';s.dispatchEvent(new Event('change'));},n);await p.waitForTimeout(200);
console.log('evento',JSON.stringify(await p.evaluate(n=>CORE.eventi[n],n)));
await p.evaluate(n=>{CORE.eventi[n].guarda='chiave';CORE.eventi[n].allora=[{dire:'Noti delle iniziali incise.'},{imposta:{variabile:'tentativi',valore:2}}];ridisegna();},n);
await p.screenshot({path:SP+'/evento.png',fullPage:false});
console.log('titolo',await p.evaluate(()=>[...document.querySelectorAll('summary')].map(s=>s.textContent).filter(t=>/Guardando/.test(t)).join(' | ')));
// prova
const r=await p.evaluate(()=>{const c=CORE,idx=indicizza(c);let st=apriPartita(c).st;const o=[];['guarda chiave','guarda chiave'].forEach(t=>{const r=esegui(c,idx,st,t);st=r.st;o.push(r.out.map(x=>x.testo).join(' / '))});return o;});
console.log(r);
// quest secondaria
await p.click('.scheda[data-tab=soluzione]');await p.waitForTimeout(200);
await p.click('text=+ Aggiungi una quest secondaria');await p.waitForTimeout(200);
await p.evaluate(()=>{CORE.secondaria.titolo='Le iniziali';CORE.secondaria.passi=[{tipo:'prendi',oggetto:'chiave'},{tipo:'variabile',variabile:'tentativi',op:'>=',valore:2}];ridisegna();});
await p.click('text=Verifica la quest secondaria');
await p.waitForFunction(()=>/funziona/.test((el('esito2')||{}).textContent||''),null,{timeout:120000});
console.log('esito2:',await p.evaluate(()=>el('esito2').innerText.split('\n').slice(0,5).join(' | ')));
await p.evaluate(()=>{const e=el('esito2');e.scrollIntoView();});await p.screenshot({path:SP+'/secondaria.png'});
const err=await p.evaluate(()=>validaCore(CORE));console.log('validaCore',err);
const web=await p.evaluate(()=>{try{return JSON.stringify(Object.keys(CORE))}catch(e){return e.message}});console.log(web);
console.log('errs',errs);await b.close()})();
