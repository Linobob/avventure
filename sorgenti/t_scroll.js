const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const c=JSON.parse(JSON.stringify(CORE_ESEMPIO));
fs.writeFileSync('c64/pr_blk.prg',compilaC64(c,{}).prg);
fs.writeFileSync('c64/pr_rig.prg',compilaC64(c,{righe:true}).prg);
fs.writeFileSync('c64/pr_noatt.prg',compilaC64(c,{attesa:false}).prg);
fs.writeFileSync('zx/pr_blk.bin',compilaZX(c,{}).immagine);
fs.writeFileSync('zx/pr_rig.bin',compilaZX(c,{righe:true}).immagine);
console.log('ok');`);
