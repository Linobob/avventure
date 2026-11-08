const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const c=JSON.parse(JSON.stringify(CORE_ESEMPIO));
const o=c.oggetti.find(o=>o.id==='tavolo');
o.descrizione=Array.from({length:40},(_,i)=>'Riga numero '+(i+1)+' della descrizione lunga del tavolo.').join(' ');
fs.writeFileSync('c64/pl_blk.prg',compilaC64(c,{}).prg);
fs.writeFileSync('c64/pl_rig.prg',compilaC64(c,{righe:true}).prg);
fs.writeFileSync('zx/pl_blk.bin',compilaZX(c,{}).immagine);
fs.writeFileSync('zx/pl_rig.bin',compilaZX(c,{righe:true}).immagine);
fs.writeFileSync('core_lungo.json',JSON.stringify(c));
console.log('ok');`);
