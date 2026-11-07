const fs=require('fs');eval(fs.readFileSync('engine_new.js','utf8')+';globalThis.C=CORE_ESEMPIO;globalThis.X=esplora;globalThis.VP=verificaPassi');
(async()=>{const t=Date.now();const g=await X(C,()=>{},{stati:400000,ms:120000});console.log('stati',g.stati.length,g.completa,(Date.now()-t)+'ms');})();
