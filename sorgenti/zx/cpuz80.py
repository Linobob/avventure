"""Emulatore Z80 minimale (senza IX/IY e senza flag non documentati), per provare i giochi (licenza MIT)."""
S, Z, H, P, N, C = 0x80, 0x40, 0x10, 0x04, 0x02, 0x01
PAR = [bin(i).count('1') % 2 == 0 for i in range(256)]

class Z80:
    def __init__(s):
        s.m = bytearray(65536)
        s.r = [0] * 8          # B C D E H L - A
        s.f = 0; s.pc = 0; s.sp = 0xFFFF
        s.alt = [0] * 8; s.altf = 0; s.alt2 = [0] * 6
        s.hooks = {}; s.inport = lambda port: 0xFF; s.outport = lambda port, v: None
    # memoria
    def rb(s, a): return s.m[a & 0xFFFF]
    def wb(s, a, v): s.m[a & 0xFFFF] = v & 255
    def rw(s, a): return s.rb(a) | s.rb(a + 1) << 8
    def ww(s, a, v): s.wb(a, v); s.wb(a + 1, v >> 8)
    def fetch(s): v = s.m[s.pc]; s.pc = (s.pc + 1) & 0xFFFF; return v
    def fetchw(s): lo = s.fetch(); return lo | s.fetch() << 8
    def push(s, v): s.sp = (s.sp - 2) & 0xFFFF; s.ww(s.sp, v)
    def pop(s): v = s.rw(s.sp); s.sp = (s.sp + 2) & 0xFFFF; return v
    # registri
    @property
    def hl(s): return s.r[4] << 8 | s.r[5]
    @hl.setter
    def hl(s, v): s.r[4] = v >> 8 & 255; s.r[5] = v & 255
    def get16(s, p):
        if p == 3: return s.sp
        return s.r[2 * p] << 8 | s.r[2 * p + 1]
    def set16(s, p, v):
        v &= 0xFFFF
        if p == 3: s.sp = v
        else: s.r[2 * p] = v >> 8; s.r[2 * p + 1] = v & 255
    def get16af(s, p): return s.r[7] << 8 | s.f if p == 3 else s.get16(p)
    def set16af(s, p, v):
        if p == 3: s.r[7] = v >> 8 & 255; s.f = v & 255
        else: s.set16(p, v)
    def g(s, i): return s.rb(s.hl) if i == 6 else s.r[i]
    def st(s, i, v):
        if i == 6: s.wb(s.hl, v)
        else: s.r[i] = v & 255
    def cc(s, i):
        f = s.f
        return [not f & Z, bool(f & Z), not f & C, bool(f & C), not f & P, bool(f & P), not f & S, bool(f & S)][i]
    # alu
    def alu(s, op, v):
        a = s.r[7]; cin = s.f & C
        if op in (0, 1):
            c = cin if op == 1 else 0
            res = a + v + c; h = ((a & 15) + (v & 15) + c) > 15
            ov = bool((a ^ res) & (v ^ res) & 0x80); carry = res > 255; n = 0
        elif op in (2, 3, 7):
            c = cin if op == 3 else 0
            res = a - v - c; h = ((a & 15) - (v & 15) - c) < 0
            ov = bool((a ^ v) & (a ^ res) & 0x80); carry = res < 0; n = 1
        else:
            res = a & v if op == 4 else a ^ v if op == 5 else a | v
            s.r[7] = res
            s.f = (res & S) | (Z if res == 0 else 0) | (H if op == 4 else 0) | (P if PAR[res] else 0)
            return
        r8 = res & 255
        s.f = (r8 & S) | (Z if r8 == 0 else 0) | (H if h else 0) | (P if ov else 0) | (N if n else 0) | (C if carry else 0)
        if op != 7: s.r[7] = r8
    def inc8(s, v):
        r = (v + 1) & 255
        s.f = (s.f & C) | (r & S) | (Z if r == 0 else 0) | (H if (v & 15) == 15 else 0) | (P if v == 0x7F else 0)
        return r
    def dec8(s, v):
        r = (v - 1) & 255
        s.f = (s.f & C) | (r & S) | (Z if r == 0 else 0) | (H if (v & 15) == 0 else 0) | (P if v == 0x80 else 0) | N
        return r
    def add16(s, a, b, c=0):
        r = a + b + c
        s.f = (s.f & (S | Z | P)) | (C if r > 0xFFFF else 0) | (H if ((a & 0xFFF) + (b & 0xFFF) + c) > 0xFFF else 0)
        return r & 0xFFFF
    def rot(s, y, v):
        c = s.f & C
        if y == 0: r = (v << 1 | v >> 7) & 255; co = v >> 7
        elif y == 1: r = (v >> 1 | v << 7) & 255; co = v & 1
        elif y == 2: r = (v << 1 | c) & 255; co = v >> 7
        elif y == 3: r = (v >> 1 | c << 7) & 255; co = v & 1
        elif y == 4: r = (v << 1) & 255; co = v >> 7
        elif y == 5: r = (v >> 1) | (v & 0x80); co = v & 1
        elif y == 6: r = (v << 1 | 1) & 255; co = v >> 7
        else: r = v >> 1; co = v & 1
        s.f = (r & S) | (Z if r == 0 else 0) | (P if PAR[r] else 0) | (C if co else 0)
        return r
    def step(s):
        if s.pc in s.hooks: s.hooks[s.pc](s); return
        op = s.fetch(); x = op >> 6; y = op >> 3 & 7; z = op & 7; p = y >> 1; q = y & 1
        if x == 0:
            if z == 0:
                if y == 0: pass
                elif y == 1: s.r[7], s.alt[7] = s.alt[7], s.r[7]; s.f, s.altf = s.altf, s.f
                else:
                    d = s.fetch(); d = d - 256 if d > 127 else d
                    if y == 2:
                        s.r[0] = (s.r[0] - 1) & 255
                        if s.r[0]: s.pc = (s.pc + d) & 0xFFFF
                    elif y == 3 or s.cc(y - 4): s.pc = (s.pc + d) & 0xFFFF
            elif z == 1:
                if q == 0: s.set16(p, s.fetchw())
                else: s.hl = s.add16(s.hl, s.get16(p))
            elif z == 2:
                if q == 0:
                    if p == 0: s.wb(s.get16(0), s.r[7])
                    elif p == 1: s.wb(s.get16(1), s.r[7])
                    elif p == 2: s.ww(s.fetchw(), s.hl)
                    else: s.wb(s.fetchw(), s.r[7])
                else:
                    if p == 0: s.r[7] = s.rb(s.get16(0))
                    elif p == 1: s.r[7] = s.rb(s.get16(1))
                    elif p == 2: s.hl = s.rw(s.fetchw())
                    else: s.r[7] = s.rb(s.fetchw())
            elif z == 3: s.set16(p, s.get16(p) + (1 if q == 0 else -1))
            elif z == 4: s.st(y, s.inc8(s.g(y)))
            elif z == 5: s.st(y, s.dec8(s.g(y)))
            elif z == 6: s.st(y, s.fetch())
            else:
                a = s.r[7]; c = s.f & C
                if y == 0: s.r[7] = (a << 1 | a >> 7) & 255; co = a >> 7
                elif y == 1: s.r[7] = (a >> 1 | a << 7) & 255; co = a & 1
                elif y == 2: s.r[7] = (a << 1 | c) & 255; co = a >> 7
                elif y == 3: s.r[7] = (a >> 1 | c << 7) & 255; co = a & 1
                elif y == 5: s.r[7] = a ^ 255; s.f |= H | N; return
                elif y == 6: s.f = (s.f & (S | Z | P)) | C; return
                elif y == 7: s.f = (s.f & (S | Z | P)) | (0 if c else C) | (H if c else 0); return
                else: raise NotImplementedError('DAA')
                s.f = (s.f & (S | Z | P)) | (C if co else 0)
        elif x == 1:
            if op == 0x76: raise StopIteration('HALT')
            s.st(y, s.g(z))
        elif x == 2: s.alu(y, s.g(z))
        else:
            if z == 0:
                if s.cc(y): s.pc = s.pop()
            elif z == 1:
                if q == 0: s.set16af(p, s.pop())
                elif p == 0: s.pc = s.pop()
                elif p == 1:
                    for i in range(6): s.r[i], s.alt2[i] = s.alt2[i], s.r[i]
                elif p == 2: s.pc = s.hl
                else: s.sp = s.hl
            elif z == 2:
                n = s.fetchw()
                if s.cc(y): s.pc = n
            elif z == 3:
                if y == 0: s.pc = s.fetchw()
                elif y == 1: s.cb()
                elif y == 2: s.outport(s.r[7] << 8 | s.fetch(), s.r[7])
                elif y == 3: s.r[7] = s.inport(s.r[7] << 8 | s.fetch())
                elif y == 4:
                    v = s.rw(s.sp); s.ww(s.sp, s.hl); s.hl = v
                elif y == 5:
                    d = s.get16(1); s.set16(1, s.hl); s.hl = d
                elif y == 6: pass
                else: pass
            elif z == 4:
                n = s.fetchw()
                if s.cc(y): s.push(s.pc); s.pc = n
            elif z == 5:
                if q == 0: s.push(s.get16af(p))
                elif p == 0: n = s.fetchw(); s.push(s.pc); s.pc = n
                elif p == 2: s.ed()
                else: raise NotImplementedError('IX/IY')
            elif z == 6: s.alu(y, s.fetch())
            else: s.push(s.pc); s.pc = y * 8
    def cb(s):
        op = s.fetch(); x = op >> 6; y = op >> 3 & 7; z = op & 7
        v = s.g(z)
        if x == 0: s.st(z, s.rot(y, v))
        elif x == 1:
            zero = not (v >> y & 1)
            s.f = (s.f & C) | H | (Z | P if zero else 0)
        elif x == 2: s.st(z, v & ~(1 << y))
        else: s.st(z, v | (1 << y))
    def ed(s):
        op = s.fetch(); x = op >> 6; y = op >> 3 & 7; z = op & 7; p = y >> 1; q = y & 1
        if x == 1:
            if z == 0:
                v = s.inport(s.r[0] << 8 | s.r[1])
                s.f = (s.f & C) | (v & S) | (Z if v == 0 else 0) | (P if PAR[v] else 0)
                if y != 6: s.r[y] = v
            elif z == 2:
                a = s.hl; b = s.get16(p); c = s.f & C
                if q == 0:
                    r = a - b - c
                    ov = bool((a ^ b) & (a ^ r) & 0x8000); h = ((a & 0xFFF) - (b & 0xFFF) - c) < 0
                    s.f = N | (C if r < 0 else 0) | (H if h else 0) | (P if ov else 0)
                else:
                    r = a + b + c
                    ov = bool((a ^ r) & (b ^ r) & 0x8000); h = ((a & 0xFFF) + (b & 0xFFF) + c) > 0xFFF
                    s.f = (C if r > 0xFFFF else 0) | (H if h else 0) | (P if ov else 0)
                r &= 0xFFFF; s.f |= (S if r & 0x8000 else 0) | (Z if r == 0 else 0); s.hl = r
            elif z == 3:
                n = s.fetchw()
                if q == 0: s.ww(n, s.get16(p))
                else: s.set16(p, s.rw(n))
            elif z == 4:
                a = s.r[7]; s.r[7] = 0; s.alu(2, a)
            elif z == 5: s.pc = s.pop()
            else: pass
        elif x == 2 and z <= 3 and y >= 4:
            while True:
                if z == 0: s.wb(s.get16(1), s.rb(s.hl)); s.set16(1, s.get16(1) + (1 if y in (4, 6) else -1)); s.hl = s.hl + (1 if y in (4, 6) else -1)
                bc = (s.get16(0) - 1) & 0xFFFF; s.set16(0, bc)
                if y < 6 or bc == 0: break
            s.f &= ~(H | N | P)
        else: raise NotImplementedError('ED %02X' % op)
