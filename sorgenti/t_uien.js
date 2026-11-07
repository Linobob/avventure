const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html#ui=en');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(400);
await p.evaluate(()=>{CORE=localizza(copia(CORE_ESEMPIO),'en').core;delete CORE.traduzioni;ridisegna()});
const tabs=['stanze','mappa','oggetti','parole','regole','soluzione','lingue','controlli','prova','compila','core','guida'];
const it=/\b(il|la|di|che|non|una|per|della|delle|nella|sono|anche|questo|quando|stanza|oggetto|regola|scheda|gioco|Aggiungi|Togli|Elimina|Nuov[oa]|Crea|Prima|dopo|ogni|parole|uscita)\b/;
const out={};
for(const t of tabs){
  await p.click('.scheda[data-tab='+t+']');await p.waitForTimeout(300);
  await p.evaluate(()=>{document.querySelectorAll('.pannello:not([hidden]) details').forEach(d=>d.open=true)});await p.waitForTimeout(150);
  if(t==='regole'){await p.evaluate(()=>{aperte.add('p-modelli');ridisegna()});await p.locator('#p-regole details.p-modelli select').first().selectOption('blocca');await p.waitForTimeout(200);}
  if(t==='soluzione'){await p.locator('#p-soluzione button.primario').click();await p.waitForTimeout(15000);}
  if(t==='lingue'){await p.evaluate(()=>{aggiungiTraduzione&&aggiungiTraduzione('it')});await p.waitForTimeout(300);await p.evaluate(()=>{document.querySelectorAll('.pannello:not([hidden]) details').forEach(d=>d.open=true)});}
  const txt=await p.evaluate(()=>{const P=document.querySelector('.pannello:not([hidden])');const r=[];const w=document.createTreeWalker(P,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(n.parentElement.closest('textarea,#registro,option'))continue;const v=n.nodeValue.trim();if(v)r.push(v)}P.querySelectorAll('option').forEach(o=>r.push('[opt] '+o.textContent));P.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(o=>r.push('[ph] '+o.placeholder));return [...new Set(r)]});
  out[t]=txt;
  await p.screenshot({path:'sh_en_'+t+'.png',fullPage:false});
}
const head=await p.evaluate(()=>document.querySelector('header').innerText);
console.log('HEAD',head.replace(/\n/g,' | '));
for(const t in out) console.log('==',t,out[t].length,'\n'+out[t].join('\n'));
console.log('errs',errs);await b.close()})();
