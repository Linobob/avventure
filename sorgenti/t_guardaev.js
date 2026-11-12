// Eventi «guardando un oggetto» (e.guarda): Web, C64 e Spectrum devono dare le stesse risposte.
const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const c=JSON.parse(JSON.stringify(CORE_ESEMPIO));
c.eventi=(c.eventi||[]).concat([
 {guarda:'chiave',una_volta:true,se:[],allora:[{dire:'EVG-CHIAVE-PRIMA'}]},
 {guarda:'chiave',se:[{oggetto:'chiave',stato:'con_te'}],allora:[{dire:'EVG-CHIAVE-CONTE'}]},
]);
console.log('err',validaCore(c));
const ins=['guarda chiave','guarda chiave','prendi chiave','guarda chiave','n','guarda','s','guarda chiave'];
const idx=indicizza(c);let a=apriPartita(c),st=a.st;
const norm2=t=>t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
const exp=ins.map(t=>{const r=esegui(c,idx,st,t);st=r.st;return norm2(r.out.map(x=>x.testo).join(' '))});
exp.forEach((e,i)=>console.log(ins[i],'=>',e));
fs.writeFileSync('c64/pr.prg',compilaC64(c).prg);fs.writeFileSync('zx/pr.bin',compilaZX(c).immagine);
fs.writeFileSync('pr_in.json',JSON.stringify({ins,exp}));
// verifica: i comandi candidati comprendono «guarda chiave»
console.log('candidato', comandiCandidati(c).includes('guarda chiave'));`);
