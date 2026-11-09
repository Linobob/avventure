// Prova immagini: convertitore (limiti di colore per blocco), caricamento, Prova, gioco Web, salvataggio su file e core vecchi.
const {chromium}=require('playwright');const fs=require('fs'),zl=require('zlib');
// PNG di prova: sfumatura colorata con un cerchio, senza librerie.
function crc(b){let c,r=-1;for(const x of b){c=(r^x)&255;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;r=(r>>>8)^c}return (r^-1)>>>0}
function ch(t,d){const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]);const c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c])}
function png(w,h){const r=Buffer.alloc((w*3+1)*h);let i=0;for(let y=0;y<h;y++){r[i++]=0;for(let x=0;x<w;x++){const d=Math.hypot(x-w/2,y-h/2)<h/3;r[i++]=d?240:x*255/w;r[i++]=d?200:y*255/h;r[i++]=d?40:120}}
const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=2;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),ch('IHDR',ih),ch('IDAT',zl.deflateSync(r)),ch('IEND',Buffer.alloc(0))])}
fs.writeFileSync('/tmp/t_img.png',png(640,400));fs.writeFileSync('/tmp/t_img_p.png',png(96,64));
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844}});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const u='file://'+process.cwd()+'/authoring.html';await p.goto(u);await p.waitForTimeout(400);
// limiti per blocco su dati casuali
console.log('limiti',await p.evaluate(()=>{const out=[];for(const [s,m,cw,lim] of [['c64','multi',4,4],['c64','hires',8,2],['zx',undefined,8,2]])for(const d of ['nessuno','ordinato','diffusione']){const col=9,ri=5,w=col*cw,h=ri*8,a=new Uint8ClampedArray(w*h*4);for(let i=0;i<a.length;i++)a[i]=(i*7919)%251;const t0=performance.now();const r=convertiPixel(a,col,ri,s,m,d);let max=0,fondi=new Set(),ok=true;for(let c=0;c<col*ri;c++){const S=new Set();for(let y=0;y<8;y++)for(let x=0;x<cw;x++)S.add(r.px[(Math.floor(c/col)*8+y)*w+(c%col)*cw+x]);max=Math.max(max,S.size);if(m==='multi'&&!S.has(r.fondo)&&S.size===4)ok=false;if(s==='zx'){const v=[...S].filter(x=>x!==0&&x!==8);if(v.some(x=>x<8)&&v.some(x=>x>=8))ok=false}}out.push([s,m||'',d,max<=lim&&ok])}return out}));
console.log('tempo pieno ms',await p.evaluate(()=>{const a=new Uint8ClampedArray(160*200*4);for(let i=0;i<a.length;i++)a[i]=(i*7919)%251;const t=performance.now();convertiPixel(a,40,25,'c64','multi','diffusione');return Math.round(performance.now()-t)}));
await p.evaluate(()=>schedeAperte(true));await p.click('.scheda[data-tab=stanze]');await p.evaluate(()=>{aperte.add(CORE.stanze[0].id);ridisegna()});await p.waitForTimeout(200);
await p.locator('#p-stanze details[open].card input[type=file]').first().setInputFiles('/tmp/t_img.png');await p.waitForTimeout(800);
const im1=await p.evaluate(()=>CORE.stanze[0].immagine);console.log('opz',JSON.stringify(im1));
await p.locator('.img-sistemi').first().scrollIntoViewIfNeeded();await p.screenshot({path:'sh_img_edit.png',fullPage:false});
console.log('info',await p.locator('.img-sistema .dato').allTextContents());
// immagine piccola nella seconda stanza
await p.evaluate(()=>{aperte.add(CORE.stanze[1].id);ridisegna()});await p.waitForTimeout(300);
await p.locator('#p-stanze details[open].card').nth(1).locator('input[type=file]').setInputFiles('/tmp/t_img_p.png');await p.waitForTimeout(800);
console.log('piccola',await p.evaluate(()=>JSON.stringify([CORE.stanze[1].immagine.c64,CORE.stanze[1].immagine.zx,CORE.stanze[1].immagine.web])));
// cambia dimensione con cursore e controlla che Annulla la ripristini
await p.evaluate(()=>{const r=document.querySelectorAll('#p-stanze details[open].card')[0].querySelectorAll('.img-sistema input[type=range]')[0];r.value=20;r.dispatchEvent(new Event('input',{bubbles:true}));r.dispatchEvent(new Event('change',{bubbles:true}))});await p.waitForTimeout(400);
await p.locator('.img-sistemi').first().scrollIntoViewIfNeeded();await p.screenshot({path:'sh_img_piccola.png'});
console.log('col',await p.evaluate(()=>CORE.stanze[0].immagine.c64.col),'nel localStorage niente base64',await p.evaluate(()=>!localStorage.getItem(P_PREFISSO+PROGETTI.attivo).includes('base64')));
// Prova
await p.evaluate(()=>schedeAperte(true));await p.click('.scheda[data-tab=prova]');await p.waitForTimeout(400);
console.log('prova',await p.evaluate(()=>{const i=document.querySelector('#registro img.fig'),c=document.getElementById('testo-comando').getBoundingClientRect();return [!!i,i&&i.naturalWidth,i&&i.style.width,i&&i.className,'comando in vista',c.bottom<=innerHeight,'immagine in vista',i.getBoundingClientRect().top>=document.getElementById('registro').getBoundingClientRect().top-1]}));await p.screenshot({path:'sh_img_prova.png'});
// Web compilato
const html=await p.evaluate(async()=>compilaWeb(coreDelGioco().core));fs.writeFileSync('/tmp/t_img.html',html);
const g=await b.newPage({viewport:{width:390,height:700}});g.on('pageerror',e=>errs.push('gioco: '+e.message));await g.goto('file:///tmp/t_img.html');await g.waitForTimeout(400);
const q=()=>g.evaluate(()=>{const l=document.querySelectorAll('#registro img.fig'),i=l[l.length-1];return i?[l.length,i.naturalWidth,i.style.width,i.style.imageRendering,i.className]:null});
console.log('web1',await q());await g.screenshot({path:'sh_img_web.png'});
const usc=await p.evaluate(()=>{const s=CORE.stanze[0];const d=Object.entries(s.uscite).find(([,u])=>(typeof u==='object'?u.a:u)===CORE.stanze[1].id);return d&&d[0]});
await g.fill('#cmd',usc);await g.press('#cmd','Enter');await g.waitForTimeout(200);console.log('web2 ('+usc+')',await q());
await p.evaluate(()=>{CORE.stanze[0].immagine.disp='sinistra';CORE.stanze[1].immagine.disp='destra';salva()});
fs.writeFileSync('/tmp/t_img2.html',await p.evaluate(async()=>compilaWeb(coreDelGioco().core)));
for(const [w,hh,nome] of [[390,700,'tel'],[1100,800,'desk']]){const g2=await b.newPage({viewport:{width:w,height:hh}});g2.on('pageerror',e=>errs.push('g2: '+e.message));await g2.goto('file:///tmp/t_img2.html');await g2.waitForTimeout(500);
console.log(nome,JSON.stringify(await g2.evaluate(()=>{const c=document.getElementById('cmd').getBoundingClientRect(),i=document.querySelector('#registro img.fig');const r=i.getBoundingClientRect();return {cmdBottom:Math.round(c.bottom),vh:innerHeight,img:[Math.round(r.width),Math.round(r.height)],cls:i.className,float:getComputedStyle(i).float}})));await g2.screenshot({path:'sh_img_'+nome+'.png'});await g2.close()}
// ricarica: l'immagine resta (IndexedDB); file salvato e riaperto
await p.reload();await p.waitForTimeout(700);console.log('dopo ricarica',await p.evaluate(()=>!!IMMAGINI[CORE.stanze[0].immagine.id]));
console.log('file',await p.evaluate(()=>{const j=JSON.parse(JSON.stringify(coreConImmagini(CORE)));const id=CORE.stanze[0].immagine.id,n=Object.keys(j.immagini).length;delete IMMAGINI[id];estraiImmagini(j);return [n,!!IMMAGINI[id],'immagini' in j]}));
console.log('senza immagini: core uguale',await p.evaluate(()=>{const c=copia(CORE_ESEMPIO);return coreConImmagini(c)===c&&validaCore(c).length===0}));
console.log('retro compila',await p.evaluate(()=>[compilaC64(coreDelGioco().core).prg.length,compilaZX(coreDelGioco().core).tap.length]));
await p.evaluate(()=>schedeAperte(true));await p.click('.scheda[data-tab=controlli]');await p.waitForTimeout(600);
await p.evaluate(()=>{document.querySelectorAll('.pannello:not([hidden]) details').forEach(d=>d.open=true)});
console.log('controlli',(await p.locator('#p-controlli').innerText()).split('\n').filter(x=>/immagini|Images/i.test(x)));
console.log('errs',errs);await b.close()})();
