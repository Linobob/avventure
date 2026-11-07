const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const lingua=process.argv[2]||'it';
const c0=JSON.parse(JSON.stringify(CORE_ESEMPIO));
const c=lingua==='en'?localizza(c0,'en').core:c0;
console.log('err',validaCore(c));
const insIt=['prendi chiave','n','guarda','prendi giardiniere','guarda giardiniere','parla giardiniere','parla con giardiniere','dai mela al giardiniere','s','giu','prendi mela','su','n','dai mela al giardiniere','dai mela a giardiniere','parla','e','apri porta con chiave','parla al vecchio','s','g','n','vai a sud','n','prendi vecchio'];
const insEn=['take key','n','look','take gardener','look at gardener','talk gardener','talk to gardener','give apple to gardener','s','down','take apple','up','n','give apple to gardener','give apple to gardener','talk','e','open door with key','talk to old man','s','l','n','go south','n','take old man'];
const ins=lingua==='en'?insEn:insIt;
const idx=indicizza(c);let a=apriPartita(c),st=a.st;
const norm2=t=>t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
const exp=ins.map(t=>{const r=esegui(c,idx,st,t);st=r.st;return norm2(r.out.map(x=>x.testo).join(' ')).slice(0,14)});
fs.writeFileSync('c64/pr.prg',compilaC64(c).prg);fs.writeFileSync('zx/pr.bin',compilaZX(c).immagine);
fs.writeFileSync('pr_in.json',JSON.stringify({ins,exp}));
`);
