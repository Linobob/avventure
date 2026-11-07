const fs=require('fs'),cp=require('child_process');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const c=JSON.parse(JSON.stringify(CORE_ESEMPIO));
// secondo oggetto con lo stesso nome nella stessa stanza, per provare ambiguita' e aggettivi
c.oggetti.push({id:'chiave_blu',nome:'chiave',sinonimi:[],aggettivi:['blu','piccola'],etichetta:'una chiave blu',descrizione:'Una piccola chiave blu.',dove:'cucina',prendibile:true});
c.oggetti.push({id:'sasso',nome:'sasso',sinonimi:['pietra'],aggettivi:['grigio','piccola'],etichetta:'un sasso grigio',descrizione:'Un sasso grigio.',dove:'cucina',prendibile:true});
console.log('err',validaCore(c));
const ins=['guarda chiave','guarda blu','guarda arrugginita','guarda blu chiave','guarda chiave blu','guarda piccola','guarda piccola chiave','prendi chiave','prendi chiave blu','prendi chiave','prendi arrugginita','inventario','lascia chiave','lascia blu','guarda sasso pietra','prendi tavolo','guarda grigio','prendi piccola','giu','guarda chiave','guarda chiave dorata','prendi chiave dorata','usa chiave su porta','n','apri porta con chiave','apri porta con chiave blu','apri porta con chiave arrugginita','guarda in chiave','guarda con'];
const idx=indicizza(c);let a=apriPartita(c),st=a.st;
const norm2=t=>t.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
const exp=ins.map(t=>{const r=esegui(c,idx,st,t);st=r.st;return norm2(r.out.map(x=>x.testo).join(' ')).slice(0,14)});
fs.writeFileSync('c64/ag.prg',compilaC64(c).prg);fs.writeFileSync('zx/ag.bin',compilaZX(c).immagine);
fs.writeFileSync('ag_in.json',JSON.stringify({ins,exp}));
`);
