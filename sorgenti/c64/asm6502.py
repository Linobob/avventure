"""Assemblatore 6502 minimale a due passate (licenza MIT).
Sintassi: etichette 'nome:', '.org', '.byte', '.word', 'NOME = valore', commenti con ';'.
Operandi: numeri decimali, $esadecimali, simboli, <simbolo, >simbolo, simbolo+n / simbolo-n.
"""
import re

IMP, ACC, IMM, ZP, ZPX, ZPY, ABS, ABX, ABY, IND, INX, INY, REL = range(13)
OPS = {}
def _def(m, modes):
    OPS[m] = modes
# (opcode per modo)
_def('ADC', {IMM:0x69, ZP:0x65, ZPX:0x75, ABS:0x6D, ABX:0x7D, ABY:0x79, INX:0x61, INY:0x71})
_def('AND', {IMM:0x29, ZP:0x25, ZPX:0x35, ABS:0x2D, ABX:0x3D, ABY:0x39, INX:0x21, INY:0x31})
_def('ASL', {ACC:0x0A, ZP:0x06, ZPX:0x16, ABS:0x0E, ABX:0x1E})
_def('BCC', {REL:0x90}); _def('BCS', {REL:0xB0}); _def('BEQ', {REL:0xF0})
_def('BIT', {ZP:0x24, ABS:0x2C})
_def('BMI', {REL:0x30}); _def('BNE', {REL:0xD0}); _def('BPL', {REL:0x10})
_def('BRK', {IMP:0x00}); _def('BVC', {REL:0x50}); _def('BVS', {REL:0x70})
_def('CLC', {IMP:0x18}); _def('CLD', {IMP:0xD8}); _def('CLI', {IMP:0x58}); _def('CLV', {IMP:0xB8})
_def('CMP', {IMM:0xC9, ZP:0xC5, ZPX:0xD5, ABS:0xCD, ABX:0xDD, ABY:0xD9, INX:0xC1, INY:0xD1})
_def('CPX', {IMM:0xE0, ZP:0xE4, ABS:0xEC}); _def('CPY', {IMM:0xC0, ZP:0xC4, ABS:0xCC})
_def('DEC', {ZP:0xC6, ZPX:0xD6, ABS:0xCE, ABX:0xDE})
_def('DEX', {IMP:0xCA}); _def('DEY', {IMP:0x88})
_def('EOR', {IMM:0x49, ZP:0x45, ZPX:0x55, ABS:0x4D, ABX:0x5D, ABY:0x59, INX:0x41, INY:0x51})
_def('INC', {ZP:0xE6, ZPX:0xF6, ABS:0xEE, ABX:0xFE})
_def('INX', {IMP:0xE8}); _def('INY', {IMP:0xC8})
_def('JMP', {ABS:0x4C, IND:0x6C}); _def('JSR', {ABS:0x20})
_def('LDA', {IMM:0xA9, ZP:0xA5, ZPX:0xB5, ABS:0xAD, ABX:0xBD, ABY:0xB9, INX:0xA1, INY:0xB1})
_def('LDX', {IMM:0xA2, ZP:0xA6, ZPY:0xB6, ABS:0xAE, ABY:0xBE})
_def('LDY', {IMM:0xA0, ZP:0xA4, ZPX:0xB4, ABS:0xAC, ABX:0xBC})
_def('LSR', {ACC:0x4A, ZP:0x46, ZPX:0x56, ABS:0x4E, ABX:0x5E})
_def('NOP', {IMP:0xEA})
_def('ORA', {IMM:0x09, ZP:0x05, ZPX:0x15, ABS:0x0D, ABX:0x1D, ABY:0x19, INX:0x01, INY:0x11})
_def('PHA', {IMP:0x48}); _def('PHP', {IMP:0x08}); _def('PLA', {IMP:0x68}); _def('PLP', {IMP:0x28})
_def('ROL', {ACC:0x2A, ZP:0x26, ZPX:0x36, ABS:0x2E, ABX:0x3E})
_def('ROR', {ACC:0x6A, ZP:0x66, ZPX:0x76, ABS:0x6E, ABX:0x7E})
_def('RTI', {IMP:0x40}); _def('RTS', {IMP:0x60})
_def('SBC', {IMM:0xE9, ZP:0xE5, ZPX:0xF5, ABS:0xED, ABX:0xFD, ABY:0xF9, INX:0xE1, INY:0xF1})
_def('SEC', {IMP:0x38}); _def('SED', {IMP:0xF8}); _def('SEI', {IMP:0x78})
_def('STA', {ZP:0x85, ZPX:0x95, ABS:0x8D, ABX:0x9D, ABY:0x99, INX:0x81, INY:0x91})
_def('STX', {ZP:0x86, ZPY:0x96, ABS:0x8E}); _def('STY', {ZP:0x84, ZPX:0x94, ABS:0x8C})
_def('TAX', {IMP:0xAA}); _def('TAY', {IMP:0xA8}); _def('TSX', {IMP:0xBA})
_def('TXA', {IMP:0x8A}); _def('TXS', {IMP:0x9A}); _def('TYA', {IMP:0x98})

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
    if tok.startswith("'") and tok.endswith("'") and len(tok) == 3: return ord(tok[1])
    if tok in sym: return sym[tok]
    raise KeyError(tok)

def parse_operand(m, arg):
    a = arg.strip()
    if m in ('BCC','BCS','BEQ','BMI','BNE','BPL','BVC','BVS'): return REL, a
    if a == '': return (ACC if ACC in OPS[m] else IMP), None
    if a.upper() == 'A': return ACC, None
    if a.startswith('#'): return IMM, a[1:]
    r = re.match(r'^\((.+)\),\s*[Yy]$', a)
    if r: return INY, r.group(1)
    r = re.match(r'^\((.+),\s*[Xx]\)$', a)
    if r: return INX, r.group(1)
    r = re.match(r'^\((.+)\)$', a)
    if r: return IND, r.group(1)
    r = re.match(r'^(.+),\s*([XxYy])$', a)
    if r: return (ABX if r.group(2).upper() == 'X' else ABY), r.group(1)   # zp,x risolto dopo
    return ABS, a   # zp o abs, deciso dopo

def assemble(src):
    lines = []
    for raw in src.splitlines():
        line = raw.split(';')[0].rstrip()
        if not line.strip(): continue
        lines.append(line)
    sym = {}
    items = []   # (kind, ...)
    def is_zp_val(expr):
        try: return 0 <= num(expr, sym) < 256 and expr.strip() in sym_zp or re.match(r'^(\$[0-9A-Fa-f]{1,2}|\d{1,3})$', expr.strip()) is not None and num(expr, sym) < 256
        except KeyError: return False
    sym_zp = set()
    pc = None; origin = None
    # pass 1
    prog = []
    for line in lines:
        s = line.strip()
        m = re.match(r'^([A-Za-z_][\w]*)\s*=\s*(.+)$', s)
        if m:
            v = num(m.group(2), sym); sym[m.group(1)] = v
            if v < 256: sym_zp.add(m.group(1))
            continue
        m = re.match(r'^([A-Za-z_][\w]*):\s*(.*)$', s)
        while m:
            sym[m.group(1)] = pc
            s = m.group(2).strip()
            m = re.match(r'^([A-Za-z_][\w]*):\s*(.*)$', s)
        if not s: continue
        parts = s.split(None, 1)
        op = parts[0]; arg = parts[1] if len(parts) > 1 else ''
        if op.lower() == '.org':
            pc = num(arg, sym)
            if origin is None: origin = pc
            prog.append(('org', pc)); continue
        if op.lower() == '.byte':
            vals = [x.strip() for x in re.split(r',(?=(?:[^"]*"[^"]*")*[^"]*$)', arg)]
            n = 0
            for v in vals:
                if v.startswith('"'): n += len(v.strip('"'))
                else: n += 1
            prog.append(('byte', vals, pc)); pc += n; continue
        if op.lower() == '.word':
            vals = [x.strip() for x in arg.split(',')]
            prog.append(('word', vals, pc)); pc += 2 * len(vals); continue
        if op.lower() == '.res':
            n = num(arg, sym); prog.append(('res', n, pc)); pc += n; continue
        mnem = op.upper()
        if mnem not in OPS: raise ValueError('istruzione sconosciuta: ' + op)
        mode, expr = parse_operand(mnem, arg)
        if mode in (ABS, ABX, ABY) and expr is not None:
            zpm = {ABS: ZP, ABX: ZPX, ABY: ZPY}[mode]
            try:
                v = num(expr, sym)
                simple = re.match(r'^(\$[0-9A-Fa-f]{1,2}|\d{1,3})$', expr.strip()) or expr.strip() in sym_zp
                if v < 256 and simple and zpm in OPS[mnem]: mode = zpm
            except KeyError: pass
            if mode in (ABX, ABY) and mode not in OPS[mnem]:
                raise ValueError('modo non valido per %s: %s' % (mnem, arg))
        if mode not in OPS[mnem]: raise ValueError('modo non valido per %s: %s' % (mnem, arg))
        size = {IMP:1, ACC:1, IMM:2, ZP:2, ZPX:2, ZPY:2, ABS:3, ABX:3, ABY:3, IND:3, INX:2, INY:2, REL:2}[mode]
        prog.append(('ins', mnem, mode, expr, pc)); pc += size
    # pass 2
    out = bytearray(); base = origin
    for it in prog:
        if it[0] == 'org':
            if len(out) == 0: base = it[1]
            else:
                pad = it[1] - (base + len(out))
                if pad < 0: raise ValueError('.org all\'indietro')
                out += bytes(pad)
            continue
        if it[0] == 'byte':
            for v in it[1]:
                if v.startswith('"'): out += v.strip('"').encode('latin-1')
                else: out.append(num(v, sym) & 0xFF)
        elif it[0] == 'word':
            for v in it[1]:
                x = num(v, sym); out += bytes([x & 0xFF, (x >> 8) & 0xFF])
        elif it[0] == 'res':
            out += bytes(it[1])
        else:
            _, mnem, mode, expr, pc = it
            opc = OPS[mnem][mode]
            if mode in (IMP, ACC): out.append(opc)
            elif mode == REL:
                off = num(expr, sym) - (pc + 2)
                if not -128 <= off <= 127: raise ValueError('salto troppo lontano: %s %s (offset %d)' % (mnem, expr, off))
                out += bytes([opc, off & 0xFF])
            elif mode in (IMM, ZP, ZPX, ZPY, INX, INY):
                out += bytes([opc, num(expr, sym) & 0xFF])
            else:
                v = num(expr, sym); out += bytes([opc, v & 0xFF, (v >> 8) & 0xFF])
    return base, bytes(out), sym
