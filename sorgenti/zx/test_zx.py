import sys
from cpuz80 import Z80
ROWS = [[1,'z','x','c','v'],['a','s','d','f','g'],['q','w','e','r','t'],['1','2','3','4','5'],['0','9','8','7','6'],['p','o','i','u','y'],[13,'l','k','j','h'],[' ',2,'m','n','b']]
def keypos(ch):
    for r,row in enumerate(ROWS):
        for b,k in enumerate(row):
            if k == (ord(ch) if isinstance(ch,str) and len(ch)==1 and ch not in 'zxcvasdfgqwertyuiopl khjmnb0123456789 ' else ch) or k == ch: return r,b
    raise KeyError(ch)
class Fine(Exception): pass
TR=[]; PAUSE=[]
def rowadr(r): return 0x4000 | ((r & 0x18) << 8) | ((r & 7) << 5)
def schermo(m):
    out=[]
    for r in range(22):
        a=rowadr(r); t=''.join(chr(m[a+x]) if 32<=m[a+x]<127 else ' ' if m[a+x]==0 else '?' for x in range(32))
        out.append(t.rstrip())
    while out and not out[-1]: out.pop()
    return '\n'.join(out)
ROMSCROLL=[0]
def run(img_path, testo, veloce=(6000,12000,40000), base=0x8000, maxsteps=200000000):
    img = open(img_path,'rb').read()
    cpu = Z80(); cpu.m[base:base+len(img)] = img; cpu.pc = base; cpu.sp = 0x7FF0
    grid = [[' ']*32 for _ in range(24)]; cur=[0,0]; snap=[]
    m=cpu.m
    def posn():
        m[23688]=33-cur[0]; m[23689]=24-cur[1]
    def nl():
        cur[0]=0; cur[1]+=1
        if cur[1]>=22:
            ROMSCROLL[0]+=1
            grid.pop(0); grid.append([' ']*32); cur[1]=21
            for r in range(21):
                for p in range(8):
                    d=rowadr(r)+256*p; o=rowadr(r+1)+256*p; m[d:d+32]=m[o:o+32]
            for p in range(8): d=rowadr(21)+256*p; m[d:d+32]=bytes(32)
    def put(ch):
        a=rowadr(cur[1])+cur[0]; m[a]=ch
    st={'p':None,'ink':None,'br':None,'last':None,'at':None}
    NOMI={(6,1):'GIALLO',(7,0):'BIANCO',(4,1):'VERDE',(5,1):'CIANO',(2,1):'ROSSO',(7,1):'BIANCO+'}
    def pr(c):
        a=c.r[7]
        if st['at'] is not None:
            st['at'].append(a)
            if len(st['at'])==2: cur[1],cur[0]=st['at']; st['at']=None; posn()
            c.pc=c.pop(); return
        if a==22: st['at']=[]; c.pc=c.pop(); return
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
            grid[cur[1]][cur[0]]=chr(a); put(a if a<127 else 63); cur[0]+=1
            if cur[0]>=32: nl()
        else: raise Fine('codice %d'%a)
        posn(); c.pc=c.pop()
    def cls(c):
        for r in grid: r[:]=[' ']*32
        m[0x4000:0x5800]=bytes(0x1800); m[0x5800:0x5B00]=bytes([m[23693]])*0x300
        posn()
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
    kc=[0]
    def inport(port):
        if port&0xFF!=0xFE: return 0xFF
        if m[0xF423]==1:
            kc[0]+=1
            if kc[0]==2: PAUSE.append(schermo(m)); return 0xFE
            if kc[0]>=3: kc[0]=0
            return 0xFF
        kc[0]=0
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
    return schermo(m), why
if __name__=='__main__':
    v=tuple(int(x) for x in sys.argv[3].split(',')) if len(sys.argv)>3 else (6000,12000,40000)
    o,w=run(sys.argv[1], sys.argv[2].replace('\\n','\n'), v)
    if len(sys.argv)>4: print(''.join(TR))
    else:
        for i,x in enumerate(PAUSE): print('--- pausa',i+1); print(x)
        print('--- fine (scorrimenti della ROM:',ROMSCROLL[0],')'); print(o)
    print('--',w)
