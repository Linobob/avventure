import asmz80, json, sys
src = open('interprete_zx.asm').read()
base, code, sym = asmz80.assemble(src)
assert base == 0x8000
assert base + len(code) <= 0x9200, 'il codice invade i dati'
open('interprete_zx.bin', 'wb').write(code)
json.dump(sym, open('simboli.json', 'w'))
print('base %04X lunghezza %d fine %04X' % (base, len(code), base + len(code)))
