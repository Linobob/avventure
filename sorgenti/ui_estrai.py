# Trova i testi dell'interfaccia (stringhe tra apici singoli in italiano) nelle parti dell'app che sono interfaccia.
# Uso: python3 ui_estrai.py  -> scrive ui_candidati.json (stringa -> prima riga dove compare)
import re, json
import os; B = os.path.dirname(os.path.abspath(__file__)) + '/'
L = open(B + 'authoring.html').read().split('\n')

def trova(pat, da=0):
    for i in range(da, len(L)):
        if re.search(pat, L[i]): return i
    raise SystemExit('non trovo ' + pat)

def fine_blocco(i):
    for j in range(i + 1, len(L)):
        if L[j].startswith('};') or L[j] == '}': return j
    raise SystemExit('fine?')

def regioni():
    a = trova(r'^// ==== MOTORE ====')
    es = trova(r'^const CORE_ESEMPIO'); es_f = fine_blocco(es)
    pc = trova(r'^const PAROLE_COMUNI'); pc_f = fine_blocco(pc)
    tp = trova(r'^const TUTTO_PAROLE'); cv_f = trova(r'^function apriProgetto')
    mw = trova(r'^const MODELLO_WEB'); mw_f = trova(r'^`;', mw)
    c64 = trova(r'^// ---- Compilatore Commodore 64 ----'); zx_f = trova(r'return \{ tap: Uint8Array', c64) + 1
    fine = len(L) - 1
    escludi = [(a, a + 1), (es, es_f), (pc, pc_f), (tp, cv_f - 1), (mw, mw_f), (c64, zx_f)]
    inizio = a
    for i in range(inizio, fine):
        if not any(x <= i <= y for x, y in escludi): yield i

LIT = re.compile(r"'((?:[^'\\\n]|\\.)*)'")
def prosa(t):
    if not re.search(r'[A-Za-zÀ-ÿ]', t): return False
    if re.match(r'^[a-z0-9_\-.#:\[\]=" >*,()]+$', t) and ' ' not in t.strip(): return False   # identificativi, chiavi, selettori
    if re.match(r'^(grid-|display:|#|\.|[a-z-]+:\s?[0-9a-z])', t): return False          # css e selettori
    if re.match(r'^[a-z]+(\[|\s*\.|\s*,\s*[a-z])', t) and '«' not in t: return False
    if re.match(r'^https?:', t): return False
    return bool(re.search(r'[A-Za-zÀ-ÿ]{2,}', t))

def span_tx(riga):
    """intervalli (inizio, fine) dentro le chiamate tx(...) della riga"""
    out = []
    for m in re.finditer(r'\btx\(', riga):
        d, k = 0, m.end() - 1
        for j in range(k, len(riga)):
            if riga[j] == '(': d += 1
            elif riga[j] == ')':
                d -= 1
                if d == 0: out.append((m.start(), j)); break
    return out

def candidati():
    for i in regioni():
        riga = L[i]
        if riga.lstrip().startswith('//'): continue
        sp = span_tx(riga)
        for m in LIT.finditer(riga):
            if any(a <= m.start() <= b for a, b in sp): continue
            prima = riga[:m.start()]
            # chiavi di oggetto, confronti e case: non sono testi
            if re.search(r'(===|!==|==|!=|case)\s*$', prima): continue
            if re.match(r'\s*:', riga[m.end():]) and re.search(r'[{,]\s*$', prima): continue
            if prima.count('`') % 2 == 1: continue
            t = m.group(1)
            if prosa(t): yield i, m.start(), m.end(), t

if __name__ == '__main__':
    d = {}
    for i, a, b, t in candidati():
        d.setdefault(t, i + 1)
    json.dump(d, open(B + 'ui_candidati.json', 'w'), ensure_ascii=False, indent=0)
    print(len(d), sum(len(k) for k in d))
