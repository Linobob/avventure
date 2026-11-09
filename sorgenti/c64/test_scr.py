# Emulatore di prova con lo schermo: imita la parte del KERNAL che serve al gioco (CHROUT sullo schermo a $C800,
# righe e colonne in $D6/$D3, scorrimento di una riga, PLOT, GETIN). Alla fine restituisce le schermate.
import sys
from cpu6502 import CPU
SCR, COL = 0xC800, 0xD800
# codici PETSCII dei colori -> numero di colore; COLORI = colori di tutto lo schermo alla fine (per le prove)
PETCOL = {144: 0, 5: 1, 28: 2, 159: 3, 156: 4, 30: 5, 31: 6, 158: 7, 129: 8, 149: 9, 150: 10, 151: 11, 152: 12, 153: 13, 154: 14, 155: 15}
COLORI = []
def run(prg_path, inputs, maxsteps=20000000, kwait=0xC2D3, foto=None):
    prg = open(prg_path, 'rb').read()
    cpu = CPU(); base = prg[0] | prg[1] << 8
    for i, b in enumerate(prg[2:]): cpu.m[base + i] = b
    keys = list(inputs); scatti = []; scorrimenti = [0]
    m = cpu.m
    def rts(c): c.pc = ((c.pull() | (c.pull() << 8)) + 1) & 0xFFFF
    def punt():
        a = SCR + 40 * m[0xD6]; m[0xD1] = a & 255; m[0xD2] = a >> 8
        b = COL + 40 * m[0xD6]; m[0xF3] = b & 255; m[0xF4] = b >> 8
    def scroll1():
        scorrimenti[0] += 1
        m[SCR:SCR + 960] = m[SCR + 40:SCR + 1000]; m[SCR + 960:SCR + 1000] = bytes([32]) * 40
        m[COL:COL + 960] = m[COL + 40:COL + 1000]
    def a_capo():
        m[0xD3] = 0
        if m[0xD6] >= 24: scroll1()
        else: m[0xD6] += 1
    def chrout(c):
        a = c.a
        if a == 13: a_capo()
        elif a == 147:
            m[SCR:SCR + 1000] = bytes([32]) * 1000; m[0xD6] = m[0xD3] = 0
        elif a == 20:
            if m[0xD3] > 0: m[0xD3] -= 1; m[SCR + 40 * m[0xD6] + m[0xD3]] = 32
        elif a in PETCOL:
            m[0x0286] = PETCOL[a]
        elif a < 32 or 128 <= a < 160:
            pass  # altri controlli
        else:
            if 64 <= a < 96: sc = a - 64
            elif 96 <= a < 128: sc = a - 32
            elif 192 <= a < 224: sc = a - 128
            elif 160 <= a < 192: sc = a - 64
            else: sc = a
            p = 40 * m[0xD6] + m[0xD3]
            m[SCR + p] = sc; m[COL + p] = m[0x0286]
            m[0xD3] += 1
            if m[0xD3] >= 40: a_capo()
        punt(); rts(c)
    class Done(Exception): pass
    def getin(c):
        if m[kwait] == 1:
            scatti.append(schermo()); c.a = 32
        elif keys:
            k = ord(keys.pop(0)); c.a = k - 32 if 97 <= k <= 122 else k
        else:
            raise Done()
        c.z = int(c.a == 0); rts(c)
    def plot(c):
        if c.c: c.x = m[0xD6]; c.y = m[0xD3]
        else: m[0xD6] = c.x; m[0xD3] = c.y; punt()
        rts(c)
    def schermo():
        righe = []
        for r in range(25):
            t = ''
            for x in range(40):
                v = m[SCR + 40 * r + x] & 0x7F
                t += chr(v + 96) if 1 <= v <= 26 else chr(v) if 32 <= v < 64 or 65 <= v <= 90 else '@' if v == 0 else '?'
            righe.append(t.rstrip())
        return '\n'.join(righe)
    cpu.hooks[0xFFD2] = chrout; cpu.hooks[0xFFE4] = getin; cpu.hooks[0xFFF0] = plot
    m[SCR:SCR + 1000] = bytes([32]) * 1000; punt()
    cpu.pc = 0x080D; cpu.sp = 0xFF
    try:
        for _ in range(maxsteps): cpu.step()
    except Done: pass
    COLORI[:] = [m[COL + i] & 15 for i in range(1000)]
    return schermo(), scatti, scorrimenti[0]
if __name__ == '__main__':
    s, sc, n = run(sys.argv[1], sys.argv[2].replace('\\n', '\r'))
    for i, x in enumerate(sc): print('--- pausa', i + 1); print(x)
    print('--- fine (scorrimenti della ROM:', n, ')'); print(s)
