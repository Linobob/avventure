import sys
from cpu6502 import CPU
def run(prg_path, inputs, maxsteps=3000000):
    prg=open(prg_path,'rb').read()
    cpu=CPU(); base=prg[0]|prg[1]<<8
    for i,b in enumerate(prg[2:]): cpu.m[base+i]=b
    out=[]; keys=list(inputs)
    def rts(c): c.pc=(c.pull()|(c.pull()<<8))+1; c.pc&=0xFFFF
    def chrout(c):
        a=c.a
        if a==13: out.append('\n')
        elif a==147: out.append('[CLR]')
        elif a in(14,): pass
        elif 0x41<=a<=0x5A: out.append(chr(a+32))
        elif 0xC1<=a<=0xDA: out.append(chr(a-128))
        elif 32<=a<127: out.append(chr(a))
        else: out.append('<%d>'%a)
        rts(c)
    class Done(Exception): pass
    def getin(c):
        if c.m[0xC2D3] == 1:
            c.a = 32
        elif keys:
            k=ord(keys.pop(0)); c.a=k-32 if 97<=k<=122 else k
        else:
            raise Done()
        c.z=int(c.a==0); rts(c)
    def plot(c):
        if c.c: c.x = 0; c.y = 0
        rts(c)
    cpu.hooks[0xFFD2]=chrout; cpu.hooks[0xFFE4]=getin; cpu.hooks[0xFFF0]=plot
    cpu.pc=0x080D; cpu.sp=0xFF
    try:
        for _ in range(maxsteps): cpu.step()
    except Done: pass
    return ''.join(out)
if __name__=='__main__':
    ins=sys.argv[2].replace('\\n','\r')
    print(run(sys.argv[1],ins))
