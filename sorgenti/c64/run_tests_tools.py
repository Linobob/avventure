import asm6502, cpu6502
src = open('interprete_c64.asm').read()
base, code, sym = asm6502.assemble(src)
print('base %04X lunghezza %d fine %04X' % (base, len(code), base + len(code)))
assert base + len(code) <= 0x2000, 'il codice invade il font'
open('interprete_c64.bin', 'wb').write(code)
import json; json.dump({k: v for k, v in sym.items()}, open('simboli.json', 'w'))
