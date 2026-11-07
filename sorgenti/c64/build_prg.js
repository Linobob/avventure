const fs=require('fs');
eval(fs.readFileSync('../engine_new.js','utf8')+fs.readFileSync('compilatore_retro.js','utf8')+`
const r=compilaC64(CORE_ESEMPIO);fs.writeFileSync('esempio.prg',r.prg);
console.log('prg',r.prg.length,'bytes, memoria',r.memoria);console.log(r.avvisi.join('\\n'));
fs.writeFileSync('esempio.zip', c64Zip('la-casa-vuota.prg', r.prg));
`);
