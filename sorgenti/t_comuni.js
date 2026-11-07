const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const lingua=process.argv[2]||'it';
const c0=JSON.parse(JSON.stringify(CORE_ESEMPIO));
const c=lingua==='en'?localizza(c0,'en').core:c0;
console.log('err',validaCore(c));
const insIt=['ripeti','aspetta','z','ripeti','r','aiuto','prendi tutto','prendi tutto','lascia tutto','guarda','ripeti','prendi tutto','giu','prendi tutto','su','n','apri porta con chiave','e','apri cassetta','prendi lanterna','usa lanterna','o','s','giu','o','prendi tutto','lascia tutto','prendi tutto','r','e','su','lascia tutto','ripeti'];
const insEn=['again','wait','z','again','g','help','take all','take all','drop all','look','again','take all','down','take all','up','n','open door with key','e','open box','take lantern','use lantern','w','s','down','w','take all','drop all','take all','g','e','up','drop all','again'];
const ins=lingua==='en'?insEn:insIt;
const idx=indicizza(c);let a=apriPartita(c),st=a.st;
const norm2=t=>t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
const exp=ins.map(t=>{const r=esegui(c,idx,st,t);st=r.st;return norm2(r.out.map(x=>x.testo).join(' ')).slice(0,40)});
fs.writeFileSync('c64/pr.prg',compilaC64(c).prg);fs.writeFileSync('zx/pr.bin',compilaZX(c).immagine);
fs.writeFileSync('pr_in.json',JSON.stringify({ins,exp}));
`);
