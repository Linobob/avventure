# Rigenera engine_new.js (usato dai test e dai build dei compilatori) dal motore dentro authoring.html
import re
s = open('authoring.html').read()
a = re.search(r'<script id="motore">\n(.*?)</script>', s, re.S).group(1)
i = s.index('// ==== MOTORE ====')
j = s.index('// ==== AUTHORING ====')
# fuori dalla pagina l'interfaccia è in italiano: T restituisce il testo così com'è
open('engine_new.js', 'w').write(a + '\nconst UI_LINGUA = "it"; const T = s => s;\n' + s[i:j])
print('engine_new.js', len(a) + len(s[i:j]))
