# Crea il PDF della guida dalle stesse sezioni che stanno nell'app (blocco guida-dati di authoring.html).
# Uso: python3 mk_guida_pdf.py [it|en] [uscita.pdf]
import json, re, subprocess, sys, os, tempfile
S = os.path.dirname(os.path.abspath(__file__))
lingua = sys.argv[1] if len(sys.argv) > 1 else 'it'
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(S, '..', 'documenti', 'guida-app-avventure.pdf')
s = open(os.path.join(S, 'authoring.html'), encoding='utf-8').read()
g = json.loads(re.search(r'<script type="application/json" id="guida-dati">(.*?)</script>', s, re.S).group(1).replace('<\\/', '</'))[lingua]
titolo = "Guida all'app per avventure testuali" if lingua == 'it' else 'Guide to the text adventure app'
css = '''body{font:21px/1.5 "DejaVu Sans",sans-serif;color:#1d1a3a;margin:0}h1{font-size:34px;margin:0 0 4px}h2{font-size:26px;margin:26px 0 8px;border-top:2px solid #4b3ab0;padding-top:10px;color:#2b2370;page-break-after:avoid}
h3{font-size:21px;margin:16px 0 4px}p{margin:6px 0}table{border-collapse:collapse;width:100%;margin:8px 0;page-break-inside:avoid}td,th{border:1px solid #cfcbe6;padding:5px 7px;vertical-align:top;text-align:left;font-size:19px}
th{background:#eceafa}code{font-family:"DejaVu Sans Mono",monospace;font-size:18px;background:#f1effa;padding:0 3px}ul,ol{margin:6px 0;padding-left:22px}li{margin:3px 0}.d{color:#625d8a;font-size:18px;margin-bottom:10px}'''
corpo = ''.join('<h2>%s</h2>%s' % (x['titolo'], x['html']) for x in g)
html = '<!doctype html><html><head><meta charset="utf-8"><style>%s</style></head><body><h1>%s</h1><p class="d">%s</p>%s</body></html>' % (
    css, titolo, '7 novembre 2026' if lingua == 'it' else 'November 7, 2026', corpo)
f = tempfile.NamedTemporaryFile('w', suffix='.html', delete=False, encoding='utf-8'); f.write(html); f.close()
subprocess.run(['wkhtmltopdf', '-q', '--zoom', '1.3', '--page-size', 'A4', '--margin-top', '16mm', '--margin-bottom', '16mm', '--margin-left', '16mm', '--margin-right', '16mm',
                '--footer-center', '[page]', '--footer-font-size', '8', '--title', titolo, f.name, out], check=True)
os.unlink(f.name); print('ok', out)
