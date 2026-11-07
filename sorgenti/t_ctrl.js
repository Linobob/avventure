const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:2200}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.evaluate(()=>localStorage.clear());await p.reload();
await p.click('.scheda[data-tab=controlli]');await p.waitForTimeout(400);
console.log(await p.evaluate(()=>el('p-controlli').innerText));
await p.screenshot({path:'sh_ctrl1.png'});
// core con problemi
await p.evaluate(()=>{
  CORE.stanze.push({id:'isola',nome:'Isola',descrizione:'Descrivi qui la stanza ✓.',uscite:{}});
  CORE.oggetti.push({id:'sasso',nome:'chiave',sinonimi:['il'],aggettivi:['arrugginita','vecchia','ferro'],etichetta:'un sasso',descrizione:'',dove:'isola',prendibile:true});
  CORE.regole.push({quando:{verbo:'apri',oggetto:'porta'},se:[],allora:[{dire:'x'}]});
  CORE.regole.push({quando:{verbo:'usa',oggetto:'tavolo'},se:[{oggetto:'tavolo',stato:'acceso'}],allora:[{dire:'y'}]});
  CORE.variabili.push({id:'v2',nome:'Inutile',iniziale:0,massimo:5});
  CORE.vocabolario.verbi.mangia.push('prendi');
  CORE.vocabolario.verbi.spingi=['spingi'];
  modificato(); vai('controlli');});
await p.waitForTimeout(400);
console.log('----\n'+await p.evaluate(()=>el('p-controlli').innerText));
await p.screenshot({path:'sh_ctrl2.png'});
console.log('errs',errs);await b.close()})();
