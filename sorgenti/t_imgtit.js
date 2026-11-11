// Immagine del titolo: A = solo titolo (nessuna stanza con immagine), B = titolo + immagine della prima stanza.
// Scrive c64/tit_a.prg, c64/tit_b.prg, zx/tit_a.bin, zx/tit_b.bin; controlla anche la prova Web e luminosità/contrasto.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/authoring.html');await p.waitForTimeout(400);
const png=fs.readFileSync('/tmp/t_img.png').toString('base64'),pp=fs.readFileSync('/tmp/t_img_p.png').toString('base64');
const r=await p.evaluate(async([a,b2])=>{
  const c=copia(CORE_ESEMPIO);const mk=(u,w,h)=>{const url='data:image/png;base64,'+u,id=idImmagine(url);salvaImmagine(id,url);return opzioniIniziali(id,w,h);};
  c.immagine_titolo=mk(a,640,400);c.opzioni_retro={senza_attesa:true};
  const out={};
  for(const [k,cc] of [['a',c],['b',{...copia(c),stanze:c.stanze.map((s,i)=>i===0?{...s,immagine:mk(b2,96,64)}:s)}]]){
    for(const sis of ['c64','zx']){immaginiRetro(cc,sis);if(IMG_IN_PREP)await IMG_IN_PREP;const f=immaginiRetro(cc,sis);
      out[k+sis]=sis==='c64'?[...compilaC64(cc,opzioniRetro(),f).prg]:[...compilaZX(cc,{},f).immagine];out[k+sis+'t']=!!f.titolo;}
  }
  // luminosità e contrasto cambiano la conversione
  const im=c.immagine_titolo,r0=await convertiImmagine(im,'zx');im.zx.luce=60;const r1=await convertiImmagine(im,'zx');im.zx.contrasto=-80;const r2=await convertiImmagine(im,'zx');
  const conta=r=>r.px.filter(x=>x===15||x===7).length;out.luce=[conta(r0),conta(r1),conta(r2)];
  // prova Web: l'immagine prima del titolo
  CORE=copia(c);const sv={};Object.assign(sv,immaginiDi(CORE));avvia();await new Promise(r=>setTimeout(r,200));
  const reg=document.getElementById('registro');out.web=[reg.firstChild&&reg.firstChild.tagName,reg.children[1]&&reg.children[1].textContent.slice(0,30)];
  TAB='stanze';aperte.add('p-gioco');ridisegna();await new Promise(r=>setTimeout(r,300));
  out.editor=[...document.querySelectorAll('[data-id="p-gioco"] canvas')].length;
  return out;
},[png,pp]);
fs.writeFileSync('c64/tit_a.prg',Buffer.from(r.ac64));fs.writeFileSync('c64/tit_b.prg',Buffer.from(r.bc64));fs.writeFileSync('zx/tit_a.bin',Buffer.from(r.azx));fs.writeFileSync('zx/tit_b.bin',Buffer.from(r.bzx));
console.log('titolo convertito',r.ac64t,r.azxt,'luce',r.luce,'web',r.web,'canvas editor',r.editor);console.log('errs',errs);await b.close()})();
