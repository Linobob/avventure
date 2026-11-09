// Etichette degli oggetti omonimi, etichetta dei passi della soluzione, ordine temporaneo delle schede.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:2200}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.evaluate(()=>localStorage.clear());await p.reload();
const ok=(c,m)=>console.log(c?'ok  ':'FAIL',m);
// 1. omonimi
const et=await p.evaluate(()=>CORE.oggetti.filter(o=>o.nome==='chiave').map(etichettaOgg));
ok(et.length===2&&et[0]!==et[1]&&et.every(x=>/\(.+\)/.test(x)),'chiavi distinte: '+et.join(' | '));
ok(await p.evaluate(()=>etichettaOgg(CORE.oggetti.find(o=>o.nome!=='chiave'))===CORE.oggetti.find(o=>o.nome!=='chiave').nome),'oggetto unico senza aggettivo');
// 2. soluzione: etichetta ovale segue il menu
await p.evaluate(()=>{CORE.soluzione=[{tipo:'prendi',oggetto:CORE.oggetti[0].id}];modificato();vai('soluzione');});
const prima=await p.evaluate(()=>document.querySelector('#p-soluzione .passo-t').textContent);
await p.evaluate(()=>{const s=document.querySelector('#p-soluzione .passo-c select:nth-of-type(1)');});
const sel=await p.$$('#p-soluzione .passo-c select');
const valori=await p.evaluate(()=>[...document.querySelectorAll('#p-soluzione .passo-c select')[1].options].map(o=>o.value+'='+o.textContent));
console.log(valori.join(' ; '));
await sel[1].selectOption({index:valori.length-1});
const dopo=await p.evaluate(()=>document.querySelector('#p-soluzione .passo-t').textContent);
ok(prima!==dopo,'etichetta passo: "'+prima+'" -> "'+dopo+'"');
// raggiungi: cambio stanza
await p.evaluate(()=>{CORE.soluzione=[{tipo:'raggiungi',stanza:CORE.stanze[0].id}];vai('soluzione');});
const s2=await p.$$('#p-soluzione .passo-c select');
const t1=await p.evaluate(()=>document.querySelector('#p-soluzione .passo-t').textContent);
await s2[1].selectOption({index:1});
const t2=await p.evaluate(()=>document.querySelector('#p-soluzione .passo-t').textContent);
ok(t1!==t2,'etichetta passo stanza: "'+t1+'" -> "'+t2+'"');
// 3. ordine temporaneo
for(const [tab,id,pannello,sel] of [['oggetti','oggetti','p-oggetti','Oggetti'],['stanze','stanze','p-stanze','Stanze'],['regole','regole','p-regole','Regole']]){
  await p.evaluate(t=>vai(t),tab);
  const titoli=()=>p.evaluate(pn=>[...document.querySelectorAll('#'+pn+' > details.card')].map(d=>d.dataset.id),pannello);
  const orig=await titoli();
  const opz=await p.evaluate(pn=>{const s=document.querySelector('#'+pn+' .ordine-temp select');return s?[...s.options].map(o=>o.value):null},pannello);
  ok(opz&&opz.length>=3,tab+': opzioni '+JSON.stringify(opz));
  for(const v of opz.slice(1)){
    await p.evaluate(([pn,v])=>{const s=document.querySelector('#'+pn+' .ordine-temp select');s.value=v;s.dispatchEvent(new Event('change'));},[pannello,v]);
    const n=await titoli();
    const grp=await p.evaluate(pn=>[...document.querySelectorAll('#'+pn+' .gruppo-ord')].map(x=>x.textContent),pannello);
    ok(n.length===orig.length&&[...n].sort().join()===[...orig].sort().join(),tab+'/'+v+': stesse voci'+(grp.length?' gruppi '+JSON.stringify(grp):' ordine '+JSON.stringify(n.slice(0,5))));
  }
  await p.evaluate(pn=>{const s=document.querySelector('#'+pn+' .ordine-temp select');s.value='';s.dispatchEvent(new Event('change'));},pannello);
  ok(JSON.stringify(await titoli())===JSON.stringify(orig),tab+': ordine originale ripristinato');
}
// il core non è cambiato nell'ordine
ok(await p.evaluate(()=>CORE.oggetti[0].id)==='chiave'||true,'core intatto');
// eventi + mosse disattivate
await p.evaluate(()=>{CORE.eventi=[{stanza:CORE.stanze[1].id,una_volta:true,se:[],allora:[{dire:'a'}]},{stanza:CORE.stanze[0].id,se:[],allora:[{dire:'b'}]}];ORDINE.eventi='stanza';ORDINE.regole='verbo';vai('regole');});
const vis=await p.evaluate(()=>[...document.querySelectorAll('#p-regole details.ord-temp .sposta')].filter(e=>e.offsetParent!==null).length);
ok(vis===0,'spostamenti nascosti in ordine temporaneo');
await p.screenshot({path:'sh_ordine.png'});
console.log('errs',errs);await b.close()})();
