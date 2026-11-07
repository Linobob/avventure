const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const c=JSON.parse(fs.readFileSync('core_combina.json','utf8'));
console.log('err',validaCore(c));
const ins=['combina chiave con moneta','prendi chiave','combina chiave con moneta','n','apri porta con chiave','e','apri cassetta','prendi lanterna','usa lanterna','o','s','giu','o','prendi moneta','combina chiave con moneta','combina moneta con chiave','inventario','guarda amuleto','combina chiave con moneta','lascia amuleto','guarda','prendi amuleto','i','combina amuleto con moneta','combina chiave'];
const idx=indicizza(c);let a=apriPartita(c),st=a.st;
const norm2=t=>t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
const exp=ins.map(t=>{const r=esegui(c,idx,st,t);st=r.st;console.log(t,'=>',r.out.map(x=>x.testo).join(' ').slice(0,90));return norm2(r.out.map(x=>x.testo).join(' ')).slice(0,40)});
fs.writeFileSync('c64/pr.prg',compilaC64(c).prg);fs.writeFileSync('zx/pr.bin',compilaZX(c).immagine);
fs.writeFileSync('pr_in.json',JSON.stringify({ins,exp}));`);
