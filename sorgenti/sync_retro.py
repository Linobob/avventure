# Assembla i due interpreti, incorpora il codice in compilatore_retro.js e riversa il compilatore dentro authoring.html
import subprocess, base64, re, os
b=os.path.dirname(os.path.abspath(__file__))+'/'
os.chdir(b+'c64'); print(subprocess.run(['python3','run_tests_tools.py'],capture_output=True,text=True))
os.chdir(b+'zx'); print(subprocess.run(['python3','build_zx.py'],capture_output=True,text=True))
js=open(b+'c64/compilatore_retro.js').read()
c=base64.b64encode(open(b+'c64/interprete_c64.bin','rb').read()).decode()
js,n=re.subn(r"const CODICE_C64_B64 = '[^']*';","const CODICE_C64_B64 = '"+c+"';",js); assert n==1
z=base64.b64encode(open(b+'zx/interprete_zx.bin','rb').read()).decode()
js,n=re.subn(r"const CODICE_ZX_B64 = '[^']*';","const CODICE_ZX_B64 = '"+z+"';",js); assert n==1
open(b+'c64/compilatore_retro.js','w').write(js)
s=open(b+'authoring.html').read()
i=s.index('// ---- Compilatore Commodore 64 ----'); j=s.index('return { tap: Uint8Array.from(tap)'); j=s.index('\n}\n',j)+3
s=s[:i]+js.rstrip('\n')+'\n'+s[j:]
open(b+'authoring.html','w').write(s)
print('ok',len(js))
