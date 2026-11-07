# Avvolge in T(...) i testi dell'interfaccia che hanno una traduzione e inserisce il dizionario inglese (blocco «ui-en»).
# Si può rilanciare: i testi già avvolti vengono saltati.
import json, re, sys
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui_estrai as E
B = E.B

lista = json.load(open(B + 'ui_lista.json'))
diz = {}
for f in ('ui_en_1.tsv', 'ui_en_2.tsv', 'ui_en_3.tsv'):
    for riga in open(B + f, encoding='utf-8').read().split('\n'):
        if not riga.strip(): continue
        n, t = riga.split('\t', 1)
        if t == '-': continue
        diz[lista[int(n)]] = t
# testi fissi dell'HTML e parole di plurale()
for f in ('ui_en_html.tsv',):
    for riga in open(B + f, encoding='utf-8').read().split('\n'):
        if riga.strip():
            k, t = riga.split('\t', 1); diz['@' + k] = t

def chiave(lit): return lit.replace("\\'", "'").replace('\\\\', '\\')

# avvolge (da destra a sinistra in ogni riga, per non spostare le posizioni)
per_riga = {}
for i, a, b, t in E.candidati():
    if t in diz or ('@' + chiave(t)) in diz: per_riga.setdefault(i, []).append((a, b))
n = 0
for i, posti in per_riga.items():
    r = E.L[i]
    for a, b in sorted(posti, reverse=True):
        if r[max(0, a - 2):a] == 'T(': continue
        r = r[:a] + 'T(' + r[a:b] + ')' + r[b:]; n += 1
    E.L[i] = r
s = '\n'.join(E.L)

finale = {}
for k, v in diz.items():
    k2 = k[1:] if k.startswith('@') else chiave(k)
    # gli spazi ai bordi della chiave valgono anche per la traduzione (l'editor li può perdere)
    pre = re.match(r'^\s*', k2).group(0); post = re.search(r'\s*$', k2).group(0)
    finale[k2] = pre + v.strip() + post
js = json.dumps(finale, ensure_ascii=False).replace('</', '<\\/')
blocco = '<script type="application/json" id="ui-en">' + js + '</script>'
if 'id="ui-en"' in s:
    s = re.sub(r'<script type="application/json" id="ui-en">.*?</script>', lambda m: blocco, s, count=1, flags=re.S)
else:
    j = s.index('<script type="application/json" id="guida-dati">')
    s = s[:j] + blocco + '\n' + s[j:]
open(B + 'authoring.html', 'w').write(s)
print('avvolti', n, 'voci', len(finale))
