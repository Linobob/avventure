# Prepara la versione pubblicata: copia l'app in ../index.html e rifà i giochi d'esempio in ../esempi.
# Uso (dalla cartella sorgenti): python3 pubblica.py
import os, shutil, subprocess
S = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(S)
def esegui(cmd, cwd=S):
    print('>', ' '.join(cmd)); subprocess.run(cmd, cwd=cwd, check=True, stdout=subprocess.DEVNULL)
esegui(['python3', 'sync_engine.py'])
shutil.copy(os.path.join(S, 'authoring.html'), os.path.join(R, 'index.html'))
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
