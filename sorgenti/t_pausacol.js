// Descrizione lunga (pausa «premi un tasto» a metà testo) per C64 e Spectrum: scrive c64/pc.prg e zx/pc.bin.
// Dopo la pausa il testo deve riprendere nel suo colore (non in quello del messaggio).
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const c=copia(CORE_ESEMPIO);const t='Una frase abbastanza lunga che riempie diverse righe dello schermo. ';c.stanze[0].descrizione=t.repeat(16);
  return {prg:[...compilaC64(c,{},[]).prg],zx:[...compilaZX(c,{},[]).immagine]};});
fs.writeFileSync('c64/pc.prg',Buffer.from(r.prg));fs.writeFileSync('zx/pc.bin',Buffer.from(r.zx));console.log('errs',errs);await b.close()})();
