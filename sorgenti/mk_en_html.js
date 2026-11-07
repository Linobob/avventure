const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+process.cwd()+'/authoring.html');
const html=await p.evaluate(()=>compilaWeb(localizza(CORE_ESEMPIO,'en').core));
require('fs').writeFileSync('the-empty-house-en.html',html);console.log('en html',html.length);await b.close()})();
