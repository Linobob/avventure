const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:1600}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(300);
// core vecchio: senza i comandi comuni e senza «tutto»
await p.evaluate(()=>{['aspetta','ripeti','aiuto'].forEach(k=>delete CORE.vocabolario.verbi[k]);CORE.oggetti=CORE.oggetti.filter(o=>!o.tutto);modificato();ridisegna()});
await p.click('.scheda[data-tab=parole]');await p.evaluate(()=>{aperte.add('p-verbi');ridisegna()});await p.waitForTimeout(200);
console.log('nota:',await p.evaluate(()=>[...document.querySelectorAll('#p-parole .frammento .avanzato')].map(x=>x.innerText).filter(t=>/comandi comuni/.test(t))));
await p.locator('#p-parole button:has-text("Aggiungili")').click();await p.waitForTimeout(200);
console.log('dopo:',await p.evaluate(()=>[Object.keys(CORE.vocabolario.verbi).join(','),JSON.stringify(CORE.oggetti.find(o=>o.tutto)),comandiComuniMancanti().length,validaCore(CORE).length]));
// scheda oggetti: card di «tutto»
await p.click('.scheda[data-tab=oggetti]');await p.evaluate(()=>{aperte.add('tutto');ridisegna()});await p.waitForTimeout(200);
console.log('card:',await p.evaluate(()=>[...document.querySelectorAll('#p-oggetti details')].find(d=>d.querySelector('.tit').textContent==='tutto').innerText.slice(0,300)));
// nuovo progetto vuoto in italiano e in inglese
console.log('vuoto:',await p.evaluate(()=>{const a=coreVuoto(),e=coreVuotoIn('en');return [validaCore(a),validaCore(e),a.oggetti.map(o=>o.id),e.oggetti.map(o=>o.nome),Object.keys(e.vocabolario.verbi).join(',')]}));
// gioco: prendi tutto
await p.click('.scheda[data-tab=prova]').catch(()=>{});await p.waitForTimeout(300);
await p.fill('#testo-comando','prendi tutto');await p.press('#testo-comando','Enter');await p.waitForTimeout(200);
await p.fill('#testo-comando','ripeti');await p.press('#testo-comando','Enter');await p.waitForTimeout(200);
console.log('gioco:',await p.evaluate(()=>document.body.innerText.split('\n').filter(t=>/Preso|niente da prendere|Non succede/.test(t))));
console.log('errs',errs);
await b.close()})();
