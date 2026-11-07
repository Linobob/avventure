"""Assemblatore Z80 minimale a due passate (licenza MIT), senza IX/IY.
Sintassi: etichette 'nome:', '.org', '.byte', '.word', '.res n', 'NOME = valore', commenti con ';'.
Operandi: numeri decimali, $esadecimali, 'c', simboli, <simbolo, >simbolo, simbolo+n / simbolo-n."""
import re
R8 = {'b': 0, 'c': 1, 'd': 2, 'e': 3, 'h': 4, 'l': 5, '(hl)': 6, 'a': 7}
RP = {'bc': 0, 'de': 1, 'hl': 2, 'sp': 3}
RP2 = {'bc': 0, 'de': 1, 'hl': 2, 'af': 3}
CC = {'nz': 0, 'z': 1, 'nc': 2, 'c': 3, 'po': 4, 'pe': 5, 'p': 6, 'm': 7}
ALU = {'add': 0, 'adc': 1, 'sub': 2, 'sbc': 3, 'and': 4, 'xor': 5, 'or': 6, 'cp': 7}
ROT = {'rlc': 0, 'rrc': 1, 'rl': 2, 'rr': 3, 'sla': 4, 'sra': 5, 'srl': 7}
SIMPLE = {'nop': [0], 'exx': [0xD9], 'di': [0xF3], 'ei': [0xFB], 'halt': [0x76], 'cpl': [0x2F], 'scf': [0x37], 'ccf': [0x3F],
          'rlca': [7], 'rrca': [0xF], 'rla': [0x17], 'rra': [0x1F], 'neg': [0xED, 0x44], 'ldir': [0xED, 0xB0], 'lddr': [0xED, 0xB8],
          'ldi': [0xED, 0xA0], 'ldd': [0xED, 0xA8]}

def num(tok, sym):
    tok = tok.strip()
    if tok.startswith('<'): return num(tok[1:], sym) & 0xFF
    if tok.startswith('>'): return (num(tok[1:], sym) >> 8) & 0xFF
    m = re.match(r'^(.+?)([+-])(\$?[0-9A-Fa-f]+|\d+)$', tok)
    if m and not re.match(r'^\$[0-9A-Fa-f]+$', tok) and not re.match(r'^\d+$', tok):
        a = num(m.group(1), sym); b = num(m.group(3), sym)
        return a + b if m.group(2) == '+' else a - b
    if tok.startswith('$'): return int(tok[1:], 16)
    if re.match(r'^\d+$', tok): return int(tok)
    if len(tok) == 3 and tok[0] == "'" and tok[2] == "'": return ord(tok[1])
    if tok in sym: return sym[tok]
    raise KeyError(tok)

def split_ops(s):
    out, cur, depth, q = [], '', 0, False
    for ch in s:
        if ch == "'" : q = not q
        if ch == '(' and not q: depth += 1
        if ch == ')' and not q: depth -= 1
        if ch == ',' and depth == 0 and not q: out.append(cur.strip()); cur = ''
        else: cur += ch
    if cur.strip(): out.append(cur.strip())
    return out

def assemble(src):
    sym = {}
    for pas in (1, 2):
        out = []; pc = 0; base = None
        def ev(t):
            try: return num(t, sym)
            except KeyError:
                if pas == 1: return 0
                raise
        for ln, raw in enumerate(src.split('\n'), 1):
            line = ''; q = False
            for ch in raw:
                if ch == "'": q = not q
                if ch == ';' and not q: break
                line += ch
            line = line.strip()
            if not line: continue
            m = re.match(r'^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$', line)
            if m: sym[m.group(1)] = ev(m.group(2)); continue
            m = re.match(r'^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$', line)
            if m:
                sym[m.group(1)] = pc; line = m.group(2).strip()
                if not line: continue
            parts = line.split(None, 1); mn = parts[0].lower(); ops = split_ops(parts[1]) if len(parts) > 1 else []
            lo = [o.lower() for o in ops]
            def emit(*bs):
                nonlocal pc
                for b in bs: out.append(b & 255); pc += 1
            try:
                if mn == '.org':
                    pc = ev(ops[0])
                    if base is None: base = pc
                    elif len(out) + base < pc: out.extend([0] * (pc - base - len(out)))
                    continue
                if mn == '.byte':
                    for o in ops: emit(ev(o))
                    continue
                if mn == '.word':
                    for o in ops: v = ev(o); emit(v, v >> 8)
                    continue
                if mn == '.res':
                    emit(*([0] * ev(ops[0]))); continue
                encode(mn, ops, lo, ev, emit, lambda: pc, pas)
            except (KeyError, ValueError, IndexError) as e:
                raise ValueError('riga %d: %s (%s)' % (ln, raw.strip(), e))
    return base, bytes(out), sym

def memop(o):
    return o.startswith('(') and o.endswith(')') and o[1:-1].strip().lower() not in ('hl', 'bc', 'de', 'sp')

def encode(mn, ops, lo, ev, emit, getpc, pas):
    if mn in SIMPLE and not ops: emit(*SIMPLE[mn]); return
    if mn == 'ld':
        d, s = lo; do, so = ops
        if d in R8 and s in R8: emit(0x40 | R8[d] << 3 | R8[s]); return
        if d in R8 and not memop(so) and s not in RP and s not in ('(bc)', '(de)', 'af'): emit(0x06 | R8[d] << 3, ev(so)); return
        if d == 'a' and s in ('(bc)', '(de)'): emit(0x0A | (0 if s == '(bc)' else 0x10)); return
        if s == 'a' and d in ('(bc)', '(de)'): emit(0x02 | (0 if d == '(bc)' else 0x10)); return
        if d == 'a' and memop(so): v = ev(so[1:-1]); emit(0x3A, v, v >> 8); return
        if s == 'a' and memop(do): v = ev(do[1:-1]); emit(0x32, v, v >> 8); return
        if d == 'hl' and memop(so): v = ev(so[1:-1]); emit(0x2A, v, v >> 8); return
        if s == 'hl' and memop(do): v = ev(do[1:-1]); emit(0x22, v, v >> 8); return
        if d == 'sp' and s == 'hl': emit(0xF9); return
        if d in RP and memop(so): v = ev(so[1:-1]); emit(0xED, 0x4B | RP[d] << 4, v, v >> 8); return
        if s in RP and memop(do): v = ev(do[1:-1]); emit(0xED, 0x43 | RP[s] << 4, v, v >> 8); return
        if d in RP: v = ev(so); emit(0x01 | RP[d] << 4, v, v >> 8); return
    elif mn in ('push', 'pop'):
        emit((0xC5 if mn == 'push' else 0xC1) | RP2[lo[0]] << 4); return
    elif mn == 'ex':
        if lo == ['de', 'hl']: emit(0xEB); return
        if lo == ['af', "af'"]: emit(0x08); return
        if lo == ['(sp)', 'hl']: emit(0xE3); return
    elif mn in ALU:
        if len(lo) == 2:
            if lo[0] == 'hl' and mn in ('add', 'adc', 'sbc'):
                if mn == 'add': emit(0x09 | RP[lo[1]] << 4)
                elif mn == 'adc': emit(0xED, 0x4A | RP[lo[1]] << 4)
                else: emit(0xED, 0x42 | RP[lo[1]] << 4)
                return
            assert lo[0] == 'a'; lo = lo[1:]; ops = ops[1:]
        if lo[0] in R8: emit(0x80 | ALU[mn] << 3 | R8[lo[0]])
        else: emit(0xC6 | ALU[mn] << 3, ev(ops[0]))
        return
    elif mn in ('inc', 'dec'):
        if lo[0] in R8: emit((0x04 if mn == 'inc' else 0x05) | R8[lo[0]] << 3)
        else: emit((0x03 if mn == 'inc' else 0x0B) | RP[lo[0]] << 4)
        return
    elif mn == 'jp':
        if lo == ['(hl)']: emit(0xE9); return
        if len(lo) == 2: v = ev(ops[1]); emit(0xC2 | CC[lo[0]] << 3, v, v >> 8)
        else: v = ev(ops[0]); emit(0xC3, v, v >> 8)
        return
    elif mn == 'call':
        if len(lo) == 2: v = ev(ops[1]); emit(0xC4 | CC[lo[0]] << 3, v, v >> 8)
        else: v = ev(ops[0]); emit(0xCD, v, v >> 8)
        return
    elif mn == 'ret':
        emit(0xC0 | CC[lo[0]] << 3 if lo else 0xC9); return
    elif mn in ('jr', 'djnz'):
        if mn == 'djnz': code = 0x10; t = ops[0]
        elif len(lo) == 2: code = 0x20 | CC[lo[0]] << 3; t = ops[1]
        else: code = 0x18; t = ops[0]
        off = ev(t) - (getpc() + 2)
        if pas == 2 and not -128 <= off <= 127: raise ValueError('salto relativo troppo lontano (%d)' % off)
        emit(code, off); return
    elif mn == 'rst': emit(0xC7 | ev(ops[0])); return
    elif mn in ROT: emit(0xCB, ROT[mn] << 3 | R8[lo[0]]); return
    elif mn in ('bit', 'set', 'res'):
        emit(0xCB, {'bit': 0x40, 'res': 0x80, 'set': 0xC0}[mn] | ev(ops[0]) << 3 | R8[lo[1]]); return
    elif mn == 'in':
        if lo[0] == 'a' and lo[1] != '(c)': emit(0xDB, ev(ops[1][1:-1])); return
        emit(0xED, 0x40 | R8[lo[0]] << 3); return
    elif mn == 'out':
        if lo[1] == 'a' and lo[0] != '(c)': emit(0xD3, ev(ops[0][1:-1])); return
        emit(0xED, 0x41 | R8[lo[1]] << 3); return
    raise ValueError('istruzione non supportata: %s %s' % (mn, ops))
