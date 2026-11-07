const fs=require('fs');
eval(fs.readFileSync('../engine_new.js','utf8')+fs.readFileSync('../c64/compilatore_retro.js','utf8')+`
const r=compilaZX(CORE_ESEMPIO);fs.writeFileSync('esempio.tap',r.tap);fs.writeFileSync('esempio_zx.bin',r.immagine);
console.log('tap',r.tap.length,'immagine',r.immagine.length);console.log(r.avvisi.join('\\n'));`);
