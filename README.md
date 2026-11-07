# Avventure

Un'app per scrivere avventure testuali e trasformarle in giochi per il **Web**, il **Commodore 64** e lo **ZX Spectrum**. Funziona nel browser, anche dal telefono, ed è in italiano e in inglese.

**Apri l'app:** https://linobob.github.io/avventure/

## Che cosa c'è

| Cartella | Contenuto |
| --- | --- |
| `index.html` | L'app, un solo file (è la versione pubblicata) |
| `esempi/` | «La casa vuota» / «The Empty House», compilata per Web (.html), C64 (.prg) e Spectrum (.tap) |
| `documenti/` | La guida dell'app e il documento di progetto, in PDF |
| `sorgenti/` | Il codice: l'app in sviluppo, i compilatori, gli interpreti in assembly, i test |

La guida completa è anche dentro l'app, nella scheda **Guida** (o con il bottone **?**).

## Come si lavora sui sorgenti

Servono Python 3 e Node.js; alcuni test usano Playwright.

- `sorgenti/authoring.html` è l'app in sviluppo. `python3 pubblica.py` la copia in `index.html` e rifà i giochi d'esempio.
- `sorgenti/c64/interprete_c64.asm` e `sorgenti/zx/interprete_zx.asm` sono gli interpreti (6502 e Z80), assemblati con gli assembler in Python della stessa cartella. Dopo una modifica: `python3 sync_retro.py` li riassembla e aggiorna il compilatore dentro l'app.
- `python3 sync_engine.py` rigenera `engine_new.js`, il motore usato dai test con Node.
- La traduzione inglese dell'interfaccia sta nei file `ui_en_*.tsv`; `python3 ui_applica.py` la inserisce nell'app. La guida sta in `guida_it.md` e `guida_en.md`; `python3 mk_guida.py` la inserisce nell'app.
- I test `t_*.js` confrontano lo stesso gioco sul motore Web e sugli emulatori C64 e Spectrum inclusi (per esempio `node t_comuni.js it`, poi `python3 cmp_c64.py pr_in.json c64/pr.prg`).

## In English

A web app for writing text adventures and building them for the Web, the Commodore 64 and the ZX Spectrum. The interface is available in Italian and English (IT/EN button). Open the app at the link above; the built-in **Guide** tab explains everything. Source code is in `sorgenti/`.

## Licenza

MIT, vedi [LICENSE](LICENSE).
