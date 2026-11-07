const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const c=JSON.parse(fs.readFileSync('blk_core.json','utf8'));
console.log('err',validaCore(c));
const ins=['n','guarda','s','prendi mela','dai mela alla guardia','s','dai mela alla guardia','guarda','s','guarda guardia','s','n','prendi guardia'];
const idx=indicizza(c);let a=apriPartita(c),st=a.st;
const norm2=t=>t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
const exp=ins.map(t=>{const r=esegui(c,idx,st,t);st=r.st;console.log('> '+t+'\\n   '+r.out.map(x=>x.testo).join(' | ').slice(0,120));return norm2(r.out.map(x=>x.testo).join(' ')).slice(0,14)});
fs.writeFileSync('c64/pr.prg',compilaC64(c).prg);fs.writeFileSync('zx/pr.bin',compilaZX(c).immagine);
fs.writeFileSync('pr_in.json',JSON.stringify({ins,exp}));
`);
