import json,subprocess,re,sys
d=json.load(open('ag_in.json')) if len(sys.argv)<2 else json.load(open(sys.argv[1]))
ins=d['ins'];exp=d['exp']
out=subprocess.run(['python3','test_zx.py',sys.argv[2] if len(sys.argv)>2 else 'ag.bin','\\n'.join(ins)+'\\n','6000,12000,40000','t'],capture_output=True,text=True).stdout
def n2(t): return re.sub(r'[^a-z0-9]','',re.sub(r'\{[^}]*\}','',t).lower())
segs=out.split('{BIANCO+}> ')[1:]
ok=True
for i,(cmd,e) in enumerate(zip(ins,exp)):
    body=segs[i].split('\n',1)[1] if i<len(segs) and '\n' in segs[i] else ''
    got=n2(body)[:14]
    if got[:8]!=e[:8]: ok=False; print('DIFF',cmd,'| web:',e,'| zx:',got)
print('ZX uguale al web' if ok else 'differenze')
