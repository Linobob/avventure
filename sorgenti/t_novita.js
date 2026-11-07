const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const l of ['it','en']){const c=await b.newContext({...devices['iPhone 13']});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/avventure/index.html#ui='+l);await p.waitForTimeout(600);
if(l==='en'){await p.evaluate(()=>{try{localStorage.setItem('motore-ui-lingua','en')}catch(e){}});await p.reload();await p.waitForTimeout(600);}
await p.click('#apri-novita');await p.waitForTimeout(200);
console.log(l,(await p.innerText('#novita-sfondo')).slice(0,260).replace(/\n+/g,' | '));
await p.screenshot({path:'/tmp/claude-0/-home-claude/161a621d-f498-5c00-a5b5-29a275f9689e/scratchpad/nov_'+l+'.png'});
await p.keyboard.press('Escape');console.log('chiuso',await p.$('#novita-sfondo')===null);await c.close()}
console.log('errs',errs);await b.close()})();
