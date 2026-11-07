# Converte guida_it.md e guida_en.md in sezioni HTML e le inserisce in authoring.html (blocco <script id="guida-dati">).
import json, re, html
import os; B = os.path.dirname(os.path.abspath(__file__)) + '/'

def inline(t):
    t = html.escape(t, quote=False)
    return re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)

def sezioni(md):
    out, cur, buf = [], None, []
    def chiudi():
        if cur: cur['html'] = blocchi(buf); out.append(cur)
    for riga in md.split('\n'):
        m = re.match(r'^## (\w+) \| (.+)$', riga)
        if m:
            chiudi(); cur = {'id': m.group(1), 'titolo': m.group(2)}; buf = []
        else:
            buf.append(riga)
    chiudi()
    return out

def blocchi(righe):
    h, i = [], 0
    while i < len(righe):
        r = righe[i]
        if not r.strip(): i += 1; continue
        if r.startswith('| '):
            t = []
            while i < len(righe) and righe[i].startswith('|'): t.append(righe[i]); i += 1
            celle = [[c.strip() for c in x.strip('|').split('|')] for x in t if not re.match(r'^\|\s*-', x)]
            s = '<div class="g-tab"><table><thead><tr>' + ''.join('<th>' + inline(c) + '</th>' for c in celle[0]) + '</tr></thead><tbody>'
            s += ''.join('<tr>' + ''.join('<td>' + inline(c) + '</td>' for c in rr) + '</tr>' for rr in celle[1:]) + '</tbody></table></div>'
            h.append(s); continue
        if r.startswith('- '):
            it = []
            while i < len(righe) and righe[i].startswith('- '): it.append(righe[i][2:]); i += 1
            h.append('<ul>' + ''.join('<li>' + inline(x) + '</li>' for x in it) + '</ul>'); continue
        if re.match(r'^\d+\. ', r):
            it = []
            while i < len(righe) and re.match(r'^\d+\. ', righe[i]): it.append(re.sub(r'^\d+\. ', '', righe[i])); i += 1
            h.append('<ol>' + ''.join('<li>' + inline(x) + '</li>' for x in it) + '</ol>'); continue
        h.append('<p>' + inline(r) + '</p>'); i += 1
    return ''.join(h)

dati = {l: sezioni(open(B + 'guida_' + l + '.md').read()) for l in ('it', 'en')}
assert [s['id'] for s in dati['it']] == [s['id'] for s in dati['en']], 'le sezioni non corrispondono'
js = json.dumps(dati, ensure_ascii=False).replace('</', '<\\/')
s = open(B + 'authoring.html').read()
blocco = '<script type="application/json" id="guida-dati">' + js + '</script>'
if 'id="guida-dati"' in s:
    s = re.sub(r'<script type="application/json" id="guida-dati">.*?</script>', lambda m: blocco, s, count=1, flags=re.S)
else:
    i = s.index('<script id="motore">')
    s = s[:i] + blocco + '\n' + s[i:]
open(B + 'authoring.html', 'w').write(s)
print('guida', len(js), [s['id'] for s in dati['it']])
