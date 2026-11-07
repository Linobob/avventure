"""Emulatore 6502 (istruzioni ufficiali, senza modo decimale) con stub KERNAL per i test (licenza MIT)."""
class CPU:
    def __init__(self):
        self.m = bytearray(65536)
        self.a = self.x = self.y = 0; self.sp = 0xFD; self.pc = 0
        self.c = self.z = self.i = self.d = self.b = self.v = self.n = 0
        self.hooks = {}; self.cycles = 0
    # memoria
    def r(self, a): return self.m[a & 0xFFFF]
    def w(self, a, v): self.m[a & 0xFFFF] = v & 0xFF
    def r16(self, a): return self.r(a) | (self.r(a + 1) << 8)
    def push(self, v): self.w(0x100 + self.sp, v); self.sp = (self.sp - 1) & 0xFF
    def pull(self): self.sp = (self.sp + 1) & 0xFF; return self.r(0x100 + self.sp)
    def sz(self, v): v &= 0xFF; self.z = int(v == 0); self.n = v >> 7; return v
    def getp(self): return self.c | self.z << 1 | self.i << 2 | self.d << 3 | 0x30 | self.v << 6 | self.n << 7
    def setp(self, p): self.c = p & 1; self.z = p >> 1 & 1; self.i = p >> 2 & 1; self.d = p >> 3 & 1; self.v = p >> 6 & 1; self.n = p >> 7 & 1
    def fetch(self): v = self.r(self.pc); self.pc = (self.pc + 1) & 0xFFFF; return v
    def fetch16(self): lo = self.fetch(); return lo | self.fetch() << 8
    def addr(self, mode):
        if mode == 'imm': a = self.pc; self.pc += 1; return a
        if mode == 'zp': return self.fetch()
        if mode == 'zpx': return (self.fetch() + self.x) & 0xFF
        if mode == 'zpy': return (self.fetch() + self.y) & 0xFF
        if mode == 'abs': return self.fetch16()
        if mode == 'abx': return (self.fetch16() + self.x) & 0xFFFF
        if mode == 'aby': return (self.fetch16() + self.y) & 0xFFFF
        if mode == 'inx':
            z = (self.fetch() + self.x) & 0xFF; return self.r(z) | self.r((z + 1) & 0xFF) << 8
        if mode == 'iny':
            z = self.fetch(); return ((self.r(z) | self.r((z + 1) & 0xFF) << 8) + self.y) & 0xFFFF
        raise ValueError(mode)
    def adc(self, v):
        t = self.a + v + self.c
        self.v = int((~(self.a ^ v) & (self.a ^ t) & 0x80) != 0); self.c = int(t > 255); self.a = self.sz(t)
    def cmp(self, reg, v):
        t = reg - v; self.c = int(reg >= v); self.sz(t)
    def branch(self, cond):
        off = self.fetch()
        if cond: self.pc = (self.pc + (off - 256 if off > 127 else off)) & 0xFFFF
    def step(self):
        if self.pc in self.hooks:
            self.hooks[self.pc](self); return
        op = self.fetch(); self.cycles += 1
        grp = {  # tabella compatta: opcode -> (mnemonico, modo)
        }
        T = OPTABLE.get(op)
        if T is None: raise RuntimeError('opcode non supportato %02X a %04X' % (op, self.pc - 1))
        mn, mode = T
        f = getattr(self, 'op_' + mn)
        f(mode)
    # istruzioni
    def rd(self, mode): return self.r(self.addr(mode))
    def op_LDA(s, m): s.a = s.sz(s.rd(m))
    def op_LDX(s, m): s.x = s.sz(s.rd(m))
    def op_LDY(s, m): s.y = s.sz(s.rd(m))
    def op_STA(s, m): s.w(s.addr(m), s.a)
    def op_STX(s, m): s.w(s.addr(m), s.x)
    def op_STY(s, m): s.w(s.addr(m), s.y)
    def op_ADC(s, m): s.adc(s.rd(m))
    def op_SBC(s, m): s.adc(s.rd(m) ^ 0xFF)
    def op_AND(s, m): s.a = s.sz(s.a & s.rd(m))
    def op_ORA(s, m): s.a = s.sz(s.a | s.rd(m))
    def op_EOR(s, m): s.a = s.sz(s.a ^ s.rd(m))
    def op_CMP(s, m): s.cmp(s.a, s.rd(m))
    def op_CPX(s, m): s.cmp(s.x, s.rd(m))
    def op_CPY(s, m): s.cmp(s.y, s.rd(m))
    def op_BIT(s, m):
        v = s.rd(m); s.z = int((s.a & v) == 0); s.n = v >> 7; s.v = v >> 6 & 1
    def _rmw(s, m, fn):
        if m == 'acc': s.a = fn(s.a)
        else:
            a = s.addr(m); s.w(a, fn(s.r(a)))
    def op_ASL(s, m):
        def f(v): s.c = v >> 7; return s.sz(v << 1)
        s._rmw(m, f)
    def op_LSR(s, m):
        def f(v): s.c = v & 1; return s.sz(v >> 1)
        s._rmw(m, f)
    def op_ROL(s, m):
        def f(v): c = s.c; s.c = v >> 7; return s.sz(v << 1 | c)
        s._rmw(m, f)
    def op_ROR(s, m):
        def f(v): c = s.c; s.c = v & 1; return s.sz(v >> 1 | c << 7)
        s._rmw(m, f)
    def op_INC(s, m): s._rmw(m, lambda v: s.sz(v + 1))
    def op_DEC(s, m): s._rmw(m, lambda v: s.sz(v - 1))
    def op_INX(s, m): s.x = s.sz(s.x + 1)
    def op_INY(s, m): s.y = s.sz(s.y + 1)
    def op_DEX(s, m): s.x = s.sz(s.x - 1)
    def op_DEY(s, m): s.y = s.sz(s.y - 1)
    def op_TAX(s, m): s.x = s.sz(s.a)
    def op_TAY(s, m): s.y = s.sz(s.a)
    def op_TXA(s, m): s.a = s.sz(s.x)
    def op_TYA(s, m): s.a = s.sz(s.y)
    def op_TSX(s, m): s.x = s.sz(s.sp)
    def op_TXS(s, m): s.sp = s.x
    def op_PHA(s, m): s.push(s.a)
    def op_PLA(s, m): s.a = s.sz(s.pull())
    def op_PHP(s, m): s.push(s.getp())
    def op_PLP(s, m): s.setp(s.pull())
    def op_CLC(s, m): s.c = 0
    def op_SEC(s, m): s.c = 1
    def op_CLI(s, m): s.i = 0
    def op_SEI(s, m): s.i = 1
    def op_CLD(s, m): s.d = 0
    def op_SED(s, m): s.d = 1
    def op_CLV(s, m): s.v = 0
    def op_NOP(s, m): pass
    def op_BCC(s, m): s.branch(not s.c)
    def op_BCS(s, m): s.branch(s.c)
    def op_BEQ(s, m): s.branch(s.z)
    def op_BNE(s, m): s.branch(not s.z)
    def op_BMI(s, m): s.branch(s.n)
    def op_BPL(s, m): s.branch(not s.n)
    def op_BVS(s, m): s.branch(s.v)
    def op_BVC(s, m): s.branch(not s.v)
    def op_JMP(s, m):
        if m == 'abs': s.pc = s.fetch16()
        else:
            a = s.fetch16(); s.pc = s.r(a) | s.r((a & 0xFF00) | ((a + 1) & 0xFF)) << 8
    def op_JSR(s, m):
        a = s.fetch16(); s.push((s.pc - 1) >> 8); s.push((s.pc - 1) & 0xFF); s.pc = a
    def op_RTS(s, m): lo = s.pull(); s.pc = ((lo | s.pull() << 8) + 1) & 0xFFFF
    def op_RTI(s, m): s.setp(s.pull()); lo = s.pull(); s.pc = lo | s.pull() << 8
    def op_BRK(s, m): raise RuntimeError('BRK a %04X' % (s.pc - 1))

OPTABLE = {}
def _t(mn, table):
    for opc, mode in table.items(): OPTABLE[opc] = (mn, mode)
import asm6502 as A
_names = {A.IMP:'imp', A.ACC:'acc', A.IMM:'imm', A.ZP:'zp', A.ZPX:'zpx', A.ZPY:'zpy', A.ABS:'abs', A.ABX:'abx', A.ABY:'aby', A.IND:'ind', A.INX:'inx', A.INY:'iny', A.REL:'rel'}
for _m, _modes in A.OPS.items():
    for _mode, _opc in _modes.items(): OPTABLE[_opc] = (_m, _names[_mode])
