const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const c=JSON.parse(JSON.stringify(CORE_ESEMPIO));
console.log('err',validaCore(c));
const ins=['prendi chiave','n','apri porta con chiave','e','prendi lanterna','guarda cassetta','metti chiave in cassetta','apri cassetta','apri cassetta','guarda nella cassetta','prendi lanterna da cassetta','guarda cassetta','metti chiave nella cassetta','i','guarda cassetta','metti lanterna in chiave','prendi cassetta','metti cassetta in cassetta','metti lanterna','metti','prendi chiave','metti chiave in lanterna','i','o','s','g'];
const idx=indicizza(c);let a=apriPartita(c),st=a.st;
const norm2=t=>t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
const exp=ins.map(t=>{const r=esegui(c,idx,st,t);st=r.st;return norm2(r.out.map(x=>x.testo).join(' ')).slice(0,14)});
fs.writeFileSync('c64/ct.prg',compilaC64(c).prg);fs.writeFileSync('zx/ct.bin',compilaZX(c).immagine);
fs.writeFileSync('ct_in.json',JSON.stringify({ins,exp}));
`);
