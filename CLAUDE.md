# Note di lavoro per Claude

Progetto: motore per avventure testuali. App di authoring in una sola pagina HTML che produce un «core» JSON e lo compila per Web, Commodore 64 (.prg) e ZX Spectrum (.tap). Licenza MIT. Pubblicata con GitHub Pages su https://linobob.github.io/avventure/ (il sito personale linobob.github.io, repository separato, ha un link a questa pagina).

## Come lavorare con l'utente
- Scrive in italiano, legge dal telefono. Rispondi in italiano, breve.
- Procede a piccoli passi: una funzione per volta, niente funzioni nuove non richieste.
- Per risparmiare uso: niente PDF, niente test lunghi (Spectrum) e niente riepiloghi lunghi se non servono. I PDF dei documenti si rigenerano solo quando li chiede o quando cambia molto; quando li produci, mandali come PDF (non legge i .md).
- Pubblica (commit e push su `main`) quando una modifica è finita e provata. L'elenco «Novità» dell'app contiene solo nuove caratteristiche del motore/app utili agli autori, non modifiche tecniche o del sito.
- L'artefatto su claude.ai è una versione vecchia: la versione vera è quella del sito.

## Struttura
- `index.html`: l'app pubblicata. NON modificarla a mano: si genera da `sorgenti/authoring.html` con `pubblica.py`.
- `esempi/`: giochi d'esempio compilati (rigenerati da `pubblica.py`). `documenti/`: PDF di guida e documento di design. `NOVITA.md`: generato.
- `sorgenti/authoring.html`: l'app (sorgente vero). Contiene motore (`// ==== MOTORE ====`), interfaccia, blocchi JSON `ui-en` (dizionario inglese dell'interfaccia), `guida-dati` (guida it/en), `novita` (elenco novità).
- `sorgenti/c64/compilatore_retro.js`: compilatore comune C64/Spectrum (dati retro). NON modificare la copia dentro authoring.html: modifica questo file e lancia `sync_retro.py`.
- `sorgenti/c64/interprete_c64.asm`, `sorgenti/zx/interprete_zx.asm`: interpreti in assembly (assemblatori `asm6502.py`, `asmz80.py`; emulatori `cpu6502.py`, `cpuz80.py`).
- `sorgenti/guida_it.md`, `guida_en.md`: testo della guida (→ app con `mk_guida.py`).
- `sorgenti/make_pdf.py`: documento di design (testo dentro lo script).

## Comandi (da `sorgenti/`)
- `python3 sync_retro.py`: assembla gli interpreti, li incorpora nel compilatore e copia il compilatore in authoring.html.
- `python3 sync_engine.py`: estrae il motore in `engine_new.js` (per i test con node).
- `python3 mk_guida.py`: guida_it/en.md → blocco guida-dati dell'app.
- `python3 pubblica.py`: rigenera motore, `../index.html` (documento completo con viewport e link «← Linobob»), esempi e `../NOVITA.md`.
- `python3 make_pdf.py ../documenti/motore-avventure-testuali-design.pdf` e `python3 mk_guida_pdf.py it`: PDF.
- Ordine tipico dopo una modifica: sync_retro (se toccati compilatore/asm) → sync_engine → test → pubblica → commit e push.

## Test
- Interfaccia (Playwright, Chromium già installato): `node t_ctrl.js`, `t_uien.js`, `t_novita.js`, `t_combina.js`, `t_dl.js`… (stampano `errs []` se va bene).
- Motore: `node t_expl.js` deve dare `stati 30024 true` (esplorazione completa dell'esempio).
- Parità Web/retro: un test `t_*.js` scrive `pr_in.json`, `c64/pr.prg`, `zx/pr.bin`; poi `python3 cmp_c64.py pr_in.json c64/pr.prg` e `cd zx && python3 cmp_zx.py ../pr_in.json pr.bin` (lo Spectrum è lento: minuti). Differenze già note e normali: accenti («noncè», «dilà») e l'ultimo comando dopo la fine partita.
- Schermo: `c64/test_scr.py file.prg 'comando\n…'` e `zx/test_zx.py file.bin 'comando\n…'` simulano lo schermo e mostrano le pause.
- Interfaccia in inglese: testi avvolti in `T('…')` con la traduzione nel blocco `ui-en`; i testi fissi dell'HTML usano come chiave il testo intero.

## Memoria dei sistemi retro
- C64: codice da $080D, deve finire sotto $2000 (font nel .prg, copiato a $D000 con l'I/O tolto, negativo a $D400); dati da $2400; variabili $C000-$C2F3; buffer testo a blocchi $C300-$C7FF; schermo testo $C800. Margine codice: circa 360 byte. Immagini degli oggetti: `picobj` (prima delle regole) con l'oggetto `fobj`; prova `node t_imgogg64.js` (scrive `c64/og_blk.prg` e `zx/og_blk.bin`; sullo Spectrum `picobj` è uguale). Immagine: bitmap $E000, colori $CC00 + RAM colore; interrupt di raster (`irq`) con il timer del CIA spento finché c'è un'immagine (la tastiera del KERNAL gira da `ir_t`).
- Spectrum: codice da $8000, sotto $9500; dati da $9500; variabili $F000-$F430; buffer $F500-$F9FF. Riga di input max 28 caratteri.
- Immagini: `s.immagine` = riferimento e opzioni (dimensioni in blocchi per sistema); i dati stanno in IndexedDB, non nel core, e tornano nel core solo nel file salvato (`immagini`) e nel gioco Web, dove l'`<img>` entra nel registro prima della riga «stanza» (`figuraStanza`; `immagine.disp` = sopra/sinistra/destra, con testo attorno). Anche gli oggetti hanno `o.immagine` (Web, C64 e Spectrum): il motore mette una riga `{tipo:'figura', oggetto}` prima della risposta se il verbo è in `verbiConImmagine(c)` (= `c.verbi_immagine`, di serie ['guarda']); test `node t_imgogg.js`. Convertitore in `// ==== IMMAGINI ====`, test `node t_immagini.js`. Retro: il compilatore riceve le immagini già convertite (`immaginiRetro(core, sis)` nell'app; tabella a HDR+32, 2 byte per stanza). Spectrum: record [colonne][righe][pixel per riga di caratteri][attributi], `pic` nell'interprete disegna in alto, `itop`/`nrig` limitano scorrimento e pause sotto l'immagine; prova `node t_imgzx.js` + `zx/test_zx.py zx/img_blk.bin …`. C64: record [colonne][righe][multi][fondo][bitmap][colori][RAM colore se multi], `pic` disegna, riga nera di separazione (lì cambia il modo), testo da `itop`; prova `node t_imgzx.js` (scrive anche `c64/img_*.prg`) + `c64/test_scr.py`. Lo split del raster non è verificabile con gli emulatori di prova: va provato in VICE.
- Intestazione dati 38 byte (+32 tabella immagini delle stanze, +34 tabella immagini degli oggetti, +36 elenco [n][id] dei verbi che mostrano l'immagine); HDR+11 = opzioni (bit 0 testo a blocchi, bit 1 attesa dopo l'introduzione).

## Da fare (decide l'utente)
Esempio più ricco; .d64 e testi su disco/compressi per avventure grandi; compressione delle immagini; musica; opzioni cambiabili dentro il gioco; scorrimento morbido C64 e zona fissa in alto; personaggi che si muovono, dialoghi a menu; salvataggio partita.
