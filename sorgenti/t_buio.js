const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const lingua=process.argv[2]||'it';
const c0=JSON.parse(JSON.stringify(CORE_ESEMPIO));
const c=lingua==='en'?localizza(c0,'en').core:c0;
console.log('err',validaCore(c));
const insIt=['prendi chiave','n','apri porta con chiave','e','apri cassetta','prendi lanterna','usa lanterna','o','s','giu','o','guarda','usa lanterna','guarda','prendi moneta','prendi tutto','e','w','o','usa lanterna','prendi moneta','prendi tutto','guarda moneta','lascia lanterna','i','usa lanterna','e','su'];
const insEn=['take key','n','open door with key','e','open box','take lantern','use lantern','w','s','down','w','look','use lantern','look','take coin','take all','e','w','w','use lantern','take coin','take all','look at coin','drop lantern','i','use lantern','e','up'];
const ins=lingua==='en'?insEn:insIt;
const idx=indicizza(c);let a=apriPartita(c),st=a.st;
const norm2=t=>t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
const exp=ins.map(t=>{const r=esegui(c,idx,st,t);st=r.st;return norm2(r.out.map(x=>x.testo).join(' ')).slice(0,40)});
exp.forEach((e,i)=>console.log(ins[i],'=>',e));
fs.writeFileSync('c64/pr.prg',compilaC64(c).prg);fs.writeFileSync('zx/pr.bin',compilaZX(c).immagine);
fs.writeFileSync('pr_in.json',JSON.stringify({ins,exp}));`);
