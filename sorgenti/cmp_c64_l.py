import json,sys,re,subprocess
sys.path.insert(0,'c64')
from test_emu import run
d=json.load(open(sys.argv[1])); prg=sys.argv[2]
ins=d['ins'];exp=d['exp']
out=run(prg,'\r'.join(ins)+'\r',9000000)
out=re.sub(r'<\d+>','',out)
segs=out.split('> ')[1:]
import unicodedata
def n2(t):
    t=unicodedata.normalize('NFD',t.lower()); return re.sub(r'[^a-z0-9]','',t)
ok=True
# il primo segmento e' l'introduzione fino al primo prompt; ogni segmento successivo e' la risposta al comando precedente
for i,(cmd,e) in enumerate(zip(ins,exp)):
    body=segs[i] if i<len(segs) else ''
    body=body.split('\n',1)[1] if '\n' in body else ''
    got=n2(body)[:40]
    if got[:30]!=e[:30]: ok=False; print('DIFF',cmd,'| web:',e,'| c64:',got)
print('C64 uguale al web' if ok else 'differenze')
