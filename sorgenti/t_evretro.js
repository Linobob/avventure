const fs=require('fs');
eval(fs.readFileSync('engine_new.js','utf8')+fs.readFileSync('c64/compilatore_retro.js','utf8')+`
const c=JSON.parse(JSON.stringify(CORE_ESEMPIO));
c.eventi=[
 {stanza:'cucina',una_volta:true,se:[],allora:[{dire:'EV-INIZIO'}]},
 {se:[],allora:[{dire:'EV-OVUNQUE'},{aumenta:{variabile:'tentativi',di:1}}]},
 {stanza:'giardino',una_volta:true,se:[],allora:[{dire:'EV-GIARDINO-1'}]},
 {stanza:'giardino',se:[{variabile:'tentativi',op:'>=',valore:2}],allora:[{dire:'EV-GIARDINO-SE2'}]},
 {stanza:'cantina',una_volta:true,se:[{oggetto:'chiave',stato:'con_te'}],allora:[{dire:'EV-CANTINA-CHIAVE'}]},
];
console.log('err',validaCore(c));
const ins=['prendi chiave','n','s','n','s','giu','su','giu'];
let a=apriPartita(c),st=a.st,idx=indicizza(c);const exp=[['(inizio)',a.out.map(x=>x.testo).filter(t=>/^EV/.test(t)).join('|')]];
ins.forEach(t=>{const r=esegui(c,idx,st,t);st=r.st;exp.push([t,r.out.map(x=>x.testo).filter(t=>/^EV/.test(t)).join('|')]);});
console.log(exp.map(x=>x.join(' => ')).join('\\n'));
fs.writeFileSync('c64/ev.prg',compilaC64(c).prg);fs.writeFileSync('zx/ev.bin',compilaZX(c).immagine);
`);
