const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const sch of ['light','dark']){const c=await b.newContext({viewport:{width:400,height:800},colorScheme:sch});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/avventure/index.html#ui=it');await p.waitForTimeout(600);
await p.evaluate(()=>{const d=document.querySelector('details.card');if(d)d.open=true;});await p.waitForTimeout(200);
await p.screenshot({path:'/tmp/contrasto_'+sch+'.png'});await c.close();}
console.log('errs',errs);await b.close()})();
