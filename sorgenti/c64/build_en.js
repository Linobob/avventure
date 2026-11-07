const fs=require('fs');
eval(fs.readFileSync('../engine_new.js','utf8')+fs.readFileSync('compilatore_retro.js','utf8')+`
const en=localizza(CORE_ESEMPIO,'en').core;
const r=compilaC64(en);fs.writeFileSync('esempio_en.prg',r.prg);console.log('prg',r.prg.length,r.avvisi.join('; '));
const z=compilaZX(en);fs.writeFileSync('../zx/esempio_en.tap',z.tap);fs.writeFileSync('../zx/esempio_en_zx.bin',z.immagine);console.log('tap',z.tap.length);
`);
