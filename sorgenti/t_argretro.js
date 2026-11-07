const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const lingua=process.argv[2]||'it';
const c0=JSON.parse(JSON.stringify(CORE_ESEMPIO));
const c=lingua==='en'?localizza(c0,'en').core:c0;
console.log('err',validaCore(c));
const insIt=['chiedi della casa','guarda casa','n','chiedi della casa','chiedi della casa al giardiniere','parla con giardiniere del passaggio','chiedi ad giardiniere della casa','chiedi giardiniere','chiedi','prendi casa','prendi giardiniere','s','prendi chiave di ferro','prendi chiave','guarda chiave di ferro','i','guarda chiave arrugginita di ferro','lascia chiave','guarda dorata','prendi mela','n','parla'];
const insEn=['ask about house','n','ask about house','ask gardener about house','ask about passage','talk to gardener about the tunnel','look at house','take house','take gardener','s','take rusty','take key','look key','l','take key','n','talk'];
const ins=lingua==='en'?insEn:insIt;
const idx=indicizza(c);let a=apriPartita(c),st=a.st;
const norm2=t=>t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
const exp=ins.map(t=>{const r=esegui(c,idx,st,t);st=r.st;return norm2(r.out.map(x=>x.testo).join(' ')).slice(0,14)});
fs.writeFileSync('c64/pr.prg',compilaC64(c).prg);fs.writeFileSync('zx/pr.bin',compilaZX(c).immagine);
fs.writeFileSync('pr_in.json',JSON.stringify({ins,exp}));
`);
