// Gioco Spectrum con immagini: cucina (grande), giardino (piccola), il resto senza. Scrive zx/img_blk.bin e zx/img_rig.bin.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.waitForTimeout(400);
const png=fs.readFileSync('/tmp/t_img.png').toString('base64'),pp=fs.readFileSync('/tmp/t_img_p.png').toString('base64');
const r=await p.evaluate(async([a,b2])=>{
  const c=copia(CORE_ESEMPIO);const put=(i,u,w,h)=>{const url='data:image/png;base64,'+u,id=idImmagine(url);salvaImmagine(id,url);c.stanze[i].immagine=opzioniIniziali(id,w,h);};
  put(0,a,640,400);put(1,b2,96,64);c.stanze[0].immagine.zx.col=32;
  for(const s of c.stanze)if(s.immagine)await convertiImmagine(s.immagine,'zx');
  const f=immaginiRetro(c,'zx');const blk=compilaZX(c,{},f),rig=compilaZX(c,{righe:true},f),senza=compilaZX(c,{});
  return {blk:[...blk.immagine],rig:[...rig.immagine],n:f.map(x=>x&&[x.w,x.h]),diff:blk.immagine.length-senza.immagine.length,stanze:c.stanze.map(s=>[s.id,!!s.buia,Object.keys(s.uscite||{}).join('/')])};
},[png,pp]);
fs.writeFileSync('zx/img_blk.bin',Buffer.from(r.blk));fs.writeFileSync('zx/img_rig.bin',Buffer.from(r.rig));
console.log(JSON.stringify(r.n),'byte immagini',r.diff,JSON.stringify(r.stanze));console.log('errs',errs);await b.close()})();
