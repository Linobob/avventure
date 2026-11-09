// Prova da una stanza scelta: «Parti da» nella scheda Prova (non cambia il core).
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(300);
await p.evaluate(()=>{CORE=copia(CORE_ESEMPIO);});
await p.click('.scheda[data-tab=prova]');await p.waitForTimeout(300);
const a=await p.evaluate(()=>({sel:[...document.querySelectorAll('#lingua-prova select:has(option[value=capanno]) option')].map(o=>o.value+'='+o.textContent),reg:el('registro').innerText.slice(0,90)}));console.log(JSON.stringify(a));
await p.selectOption('#lingua-prova select:has(option[value=capanno])','capanno');await p.waitForTimeout(200);
const c=await p.evaluate(()=>({reg:el('registro').innerText,stanza:G.st.stanza,inizio:CORE.inizio}));console.log(JSON.stringify(c));
await p.evaluate(()=>invia('ricomincia'));
await p.fill('#testo-comando','guarda');await p.keyboard.press('Enter');await p.waitForTimeout(100);
console.log('dopo guarda:',await p.evaluate(()=>G.st.stanza+' / core '+CORE.inizio));
await p.selectOption('#lingua-prova select:has(option[value=capanno])','');await p.waitForTimeout(200);
console.log('di nuovo:',await p.evaluate(()=>G.st.stanza+' | '+el('registro').innerText.slice(0,60).replace(/\n/g,' / ')));
await p.screenshot({path:'/tmp/partida.png'});
console.log('errs',errs);await b.close()})();
