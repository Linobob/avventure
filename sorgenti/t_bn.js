// Conversione in bianco e nero: solo i colori ammessi, per ogni sistema e modo; a colori restano altre tinte.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.waitForTimeout(400);
console.log(await p.evaluate(()=>{const g=(w,h)=>{const a=new Uint8ClampedArray(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;a[i]=x*255/w;a[i+1]=y*255/h;a[i+2]=255-a[i];a[i+3]=255}return a};
const out={};for(const [n,s,m,cw] of [['c64m','c64','multi',4],['c64h','c64','hires',8],['zx','zx',undefined,8]])for(const d of ['ordinato','diffusione','nessuno'])for(const bn of [true,false]){const r=convertiPixel(g(12*cw,8*8),12,8,s,m,d,bn);out[n+' '+d+' '+bn]=[...new Set(r.px)].sort((a,b)=>a-b).join(',')+(r.fondo>=0?' f'+r.fondo:'')}return JSON.stringify(out,null,0).replace(/","/g,'\n')}));
console.log('errs',errs);await b.close()})();
