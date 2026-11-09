// C64: immagine nella cucina, immagine piccola al giardiniere, «parla» con immagine. Scrive c64/og_blk.prg e zx/og_blk.bin.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.waitForTimeout(400);
const r=await p.evaluate(async([a,b2])=>{
  const c=copia(CORE_ESEMPIO);const mk=(u,w,h)=>{const url='data:image/png;base64,'+u,id=idImmagine(url);salvaImmagine(id,url);return opzioniIniziali(id,w,h);};
  c.stanze[0].immagine=mk(a,640,400);c.oggetti.find(o=>o.id==='giardiniere').immagine=mk(b2,96,64);c.verbi_immagine=['guarda','parla'];
  for(const s of [...c.stanze,...c.oggetti])if(s.immagine){await convertiImmagine(s.immagine,'c64');await convertiImmagine(s.immagine,'zx');}
  const f=immaginiRetro(c,'c64');const z=immaginiRetro(c,'zx');
  return {prg:[...compilaC64(c,{},f).prg],m:f.mancano.length,o:f.oggetti.filter(Boolean).length,zxo:'oggetti' in z,zx:[...compilaZX(c,{},z).immagine],zo:z.oggetti.filter(Boolean).length};
},[fs.readFileSync('/tmp/t_img.png').toString('base64'),fs.readFileSync('/tmp/t_img_p.png').toString('base64')]);
fs.writeFileSync('c64/og_blk.prg',Buffer.from(r.prg));fs.writeFileSync('zx/og_blk.bin',Buffer.from(r.zx));console.log('oggetti con immagine',r.o,'zx',r.zo,'mancano',r.m);console.log('errs',errs);await b.close()})();
