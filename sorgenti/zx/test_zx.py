import sys
from cpuz80 import Z80
ROWS = [[1,'z','x','c','v'],['a','s','d','f','g'],['q','w','e','r','t'],['1','2','3','4','5'],['0','9','8','7','6'],['p','o','i','u','y'],[13,'l','k','j','h'],[' ',2,'m','n','b']]
def keypos(ch):
    for r,row in enumerate(ROWS):
        for b,k in enumerate(row):
            if k == (ord(ch) if isinstance(ch,str) and len(ch)==1 and ch not in 'zxcvasdfgqwertyuiopl khjmnb0123456789 ' else ch) or k == ch: return r,b
    raise KeyError(ch)
class Fine(Exception): pass
TR=[]
def run(img_path, testo, veloce=(6000,12000,40000), base=0x8000, maxsteps=200000000):
    img = open(img_path,'rb').read()
    cpu = Z80(); cpu.m[base:base+len(img)] = img; cpu.pc = base; cpu.sp = 0x7FF0
    grid = [[' ']*32 for _ in range(24)]; cur=[0,0]; snap=[]
    def nl():
        cur[0]=0; cur[1]+=1
        if cur[1]>=24:
            grid.pop(0); grid.append([' ']*32); cur[1]=23
    st={'p':None,'ink':None,'br':None,'last':None}
    NOMI={(6,1):'GIALLO',(7,0):'BIANCO',(4,1):'VERDE',(5,1):'CIANO',(2,1):'ROSSO',(7,1):'BIANCO+'}
    def pr(c):
        a=c.r[7]
        if st['p'] is not None:
            if st['p']==16: st['ink']=a
            else:
                st['br']=a
                if (st['ink'],st['br'])!=st['last']:
                    st['last']=(st['ink'],st['br']); TR.append('{'+NOMI.get(st['last'],str(st['last']))+'}')
            st['p']=None; c.pc=c.pop(); return
        if a in (16,19): st['p']=a; c.pc=c.pop(); return
        if 144<=a<=155: a=ord('àèéìòùÀÈÉÌÒÙ'[a-144])
        TR.append('\n' if a==13 else chr(a) if 32<=a<127 or a>=192 else '')
        if a==13: nl()
        elif a==8:
            if cur[0]>0: cur[0]-=1
        elif 32<=a<127 or a>=192:
            grid[cur[1]][cur[0]]=chr(a); cur[0]+=1
            if cur[0]>=32: nl()
        else: raise Fine('codice %d'%a)
        c.pc=c.pop()
    def cls(c):
        for r in grid: r[:]=[' ']*32
        cur[0]=cur[1]=0; c.pc=c.pop()
    def ret(c): c.pc=c.pop()
    cpu.hooks[0x0010]=pr; cpu.hooks[0x1601]=ret; cpu.hooks[0x0D6B]=cls
    # tastiera: ogni tasto ha un intervallo di pressione (in istruzioni); i tasti si sovrappongono se veloci
    posiz=[]
    for ch in testo:
        if ch=='\n': posiz.append((6,0,False,ch))
        elif ch in '<>': posiz.append((4,0,True,ch))
        else: posiz.append(keypos(ch)+(False,ch))
    PASSO, DURATA, GAP = veloce
    iv=[]; t=400000; prev=None; fine_k={}
    for p in posiz:
        if p[3] in fine_k: t=max(t, fine_k[p[3]]+GAP)
        d=1200000 if p[3]=='>' else DURATA
        iv.append((t,t+d)); fine_k[p[3]]=t+d; prev=p; t+=PASSO+(d if p[3]=='>' else 0)
        if p[3]=='\n': t+=500000
    passi=[0]
    def inport(port):
        if port&0xFF!=0xFE: return 0xFF
        now=passi[0]
        if now>iv[-1][1]+60000: raise Fine('fine input')
        v=0xFF; sel=port>>8
        for (a,b),(r,bit,cs,_) in zip(iv,posiz):
            if a<=now<b:
                for row in range(8):
                    if not sel>>row&1:
                        if row==r: v&=~(1<<bit)
                        if cs and row==0: v&=~1
        return v
    cpu.inport=inport
    try:
        for k in range(maxsteps):
            cpu.step(); passi[0]=k
            if k%17500==0: cpu.m[23672]=(cpu.m[23672]+1)&255
    except Fine as e: why=str(e)
    out=[''.join(r).rstrip() for r in grid]
    while out and not out[-1]: out.pop()
    return '\n'.join(out), why
if __name__=='__main__':
    v=tuple(int(x) for x in sys.argv[3].split(',')) if len(sys.argv)>3 else (6000,12000,40000)
    o,w=run(sys.argv[1], sys.argv[2].replace('\\n','\n'), v)
    print(''.join(TR) if len(sys.argv)>4 else o); print('--',w)
