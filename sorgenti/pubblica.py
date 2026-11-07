# Prepara la versione pubblicata: copia l'app in ../index.html e rifà i giochi d'esempio in ../esempi.
# Uso (dalla cartella sorgenti): python3 pubblica.py
import os, shutil, subprocess
S = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(S)
def esegui(cmd, cwd=S):
    print('>', ' '.join(cmd)); subprocess.run(cmd, cwd=cwd, check=True, stdout=subprocess.DEVNULL)
esegui(['python3', 'sync_engine.py'])
# La pagina vale come frammento dentro Claude; fuori serve un documento completo (doctype e viewport per i telefoni).
corpo = open(os.path.join(S, 'authoring.html'), encoding='utf-8').read()
intest = '<!doctype html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n'
# Elenco delle novità (stesso blocco che mostra il pulsante ✦ dell'app), leggibile anche su GitHub.
import json, re
_n = json.loads(re.search(r'<script type="application/json" id="novita">(.*?)</script>', open(os.path.join(S, 'authoring.html'), encoding='utf-8').read(), re.S).group(1).replace('<\\/', '</'))
righe = ['# Novità / What\'s new', '', 'Le novità del motore e dell\'app, dalla più recente. / What\'s new in the engine and the app, most recent first.', '']
for x in _n:
    righe += ['## ' + x['it'][0] + ' (' + x['d'] + ')', '', x['it'][1], '', '*' + x['en'][0] + ':* ' + x['en'][1], '']
open(os.path.join(R, 'NOVITA.md'), 'w', encoding='utf-8').write('\n'.join(righe))
# Link per tornare al sito personale (come nelle altre pagine): solo nella versione pubblicata, non dentro Claude.
punto = '<div class="app">\n  <header>'
assert corpo.count(punto) == 1
torna = ('<div class="app">\n  <style>.torna{display:inline-block;margin-bottom:.4rem;padding:.3rem 0;color:var(--muted);font:500 .9rem var(--ui);text-decoration:none}'
         '.torna:hover,.torna:focus-visible{color:var(--accent);text-decoration:underline}</style>\n'
         '  <a class="torna" href="../">\u2190 Linobob</a>\n  <header>')
corpo = corpo.replace(punto, torna)
open(os.path.join(R, 'index.html'), 'w', encoding='utf-8').write(intest + corpo + '\n</body>\n</html>\n')
esegui(['node', 'build_prg.js'], os.path.join(S, 'c64'))
esegui(['node', 'build_en.js'], os.path.join(S, 'c64'))
esegui(['node', 'build_tap.js'], os.path.join(S, 'zx'))
esegui(['node', 't_web.js'])
esegui(['node', 'mk_en_html.js'])
E=os.path.join(R, 'esempi')
for a, b in [('c64/esempio.prg', 'la-casa-vuota.prg'), ('zx/esempio.tap', 'la-casa-vuota.tap'), ('la-casa-vuota.html', 'la-casa-vuota.html'),
             ('c64/esempio_en.prg', 'the-empty-house-en.prg'), ('zx/esempio_en.tap', 'the-empty-house-en.tap'), ('the-empty-house-en.html', 'the-empty-house-en.html')]:
    shutil.copy(os.path.join(S, a), os.path.join(E, b))
print('pronto: index.html ed esempi aggiornati')
