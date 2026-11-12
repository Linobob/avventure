// ---- Compilatore Commodore 64 ----
// Il compilatore unisce: un programma BASIC di avvio (SYS 2061), l'interprete già assemblato in 6502 e i dati del gioco.
// Passo 4: tutto il core; l'interprete va a capo da solo tra le parole.
const CODICE_C64_B64 = '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';
// Font 8x8 del gioco (disegno originale, sorgente in font_c64.py): 128 caratteri, codici schermo 0-127 (96-107: lettere accentate).
const FONT_C64_B64 = 'ADxOUk5APAAAADwCPkI+AABAXGJCYlwAAAA8QEBAPAAAAjpGQkY6AAAAPEJ+QDwAAAwQPBAQEAAAAD5CQj4CPABAXGJCQkIAABAAMBAQOAAABAAMBAREOABAREhwSEQAADAQEBAQOAAAAGxSUlJSAAAAXGJCQkIAAAA8QkJCPAAAAFxiQmJcQAAAOkZCRjoCAABcYkBAQAAAAD5APAJ8AAAQPBAQEgwAAABCQkJGOgAAAEJCJCQYAAAAQkJaWiQAAABCJBgkQgAAAEJCQj4CPAAAfgQYIH4AADggICAgOAAAQCAQCAQCAAA4CAgICDgAABAoRAAAAAAAAAAAAAAAfgAAAAAAAAAAABAQEBAAEAAAKCgAAAAAAAAkfiQkfiQAEDxQOBR4EAAAYmQIECZGAAAwSDBKRDoAAAgQAAAAAAAACBAQEBAIAAAgEBAQECAAAAAQVDhUEAAAABAQfBAQAAAAAAAAMDAgAAAAADwAAAAAAAAAADAwAAACBAgQIEAAADxGSlJiPAAAEDAQEBA4AAA8QgI8QH4AADxCDAJCPAAACBgoSH4IAAB+QHwCQjwAADxAfEJCPAAAfgIECBAQAAA8QjxCQjwAADxCQj4CPAAAADAwADAwAAAAMDAAMDAgAAAIECAQCAAAAAB8AHwAAAAAIBAIECAAADxCBAgACAAAAAAAAAAAAAAYJEJ+QkIAAHxCfEJCfAAAPEJAQEI8AAB4REJCRHgAAH5AfEBAfgAAfkB8QEBAAAA8QEBOQjwAAEJCfkJCQgAAOBAQEBA4AAACAgICQjwAAERIcEhEQgAAQEBAQEB+AABCZlpCQkIAAEJiUkpGQgAAPEJCQkI8AAB8QkJ8QEAAADxCQlJKPAAAfEJCfERCAAA+QDwCAnwAAHwQEBAQEAAAQkJCQkI8AABCQkIkJBgAAEJCQlpmQgAAQiQYGCRCAABEKBAQEBAAAH4ECBAgfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBA8Aj5CPgAgEDxCfkA8AAgQPEJ+QDwAIBAAMBAQOAAgEDxCQkI8ACAQQkJCRjoAIBgkQn5CQgAgfkB8QEB+AAh+QHxAQH4AIDgQEBAQOAAgPEJCQkI8ACBCQkJCQjwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
const C64_INDIRIZZO_DATI = 0x2400, C64_INDIRIZZO_FONT = 0x2000, C64_FINE_RAM = 0xA000, C64_LARGHEZZA = 39;
const C64_ACCENTI = { 'à': 160, 'è': 161, 'é': 162, 'ì': 163, 'ò': 164, 'ù': 165, 'À': 166, 'È': 167, 'É': 168, 'Ì': 169, 'Ò': 170, 'Ù': 171,
  'á': 160, 'í': 163, 'ó': 164, 'ú': 165 };
function c64Ascii(s) {
  return String(s).replace(/[’‘`´]/g, "'").replace(/[«»“”]/g, '"').replace(/[–—]/g, '-').replace(/…/g, '...')
    .replace(/[^\x20-\x7E\nàáèéìíòóùúÀÈÉÌÒÙ]/g, '?');
}
// L'a capo tra le parole lo fa l'interprete mentre il gioco gira.
function c64Avvolgi(s) { return String(s); }
// Testo ASCII -> byte PETSCII (modo maiuscole/minuscole): a capo = 13, minuscole = $41.., maiuscole = $C1..
function c64Petscii(s) {
  const out = [];
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    if (ch === '\n') out.push(13);
    else if (C64_ACCENTI[ch]) out.push(C64_ACCENTI[ch]);
    else if (c >= 97 && c <= 122) out.push(c - 32);
    else if (c >= 65 && c <= 90) out.push(c + 128);
    else out.push(c);
  }
  return out;
}
const c64Testo = (s, maiuscolo) => c64Petscii(c64Ascii(maiuscolo ? String(s).toUpperCase() : s));
function c64Zip(nome, dati) {
  const tab = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; tab.push(c >>> 0); }
  let crc = 0xFFFFFFFF; for (const b of dati) crc = tab[(crc ^ b) & 255] ^ (crc >>> 8); crc = (crc ^ 0xFFFFFFFF) >>> 0;
  const nm = Array.from(nome, ch => ch.charCodeAt(0) & 0x7F);
  const w16 = v => [v & 255, v >> 8 & 255], w32 = v => [v & 255, v >> 8 & 255, v >> 16 & 255, v >>> 24 & 255];
  // data e ora dell'esportazione (ora locale) nel formato DOS dei file zip
  const ora = new Date(), oraDos = (ora.getHours() << 11) | (ora.getMinutes() << 5) | (ora.getSeconds() >> 1), dataDos = (Math.max(0, ora.getFullYear() - 1980) << 9) | ((ora.getMonth() + 1) << 5) | ora.getDate();
  const comune = [...w16(20), ...w16(0), ...w16(0), ...w16(oraDos), ...w16(dataDos), ...w32(crc), ...w32(dati.length), ...w32(dati.length), ...w16(nm.length), ...w16(0)];
  const locale = [...w32(0x04034b50), ...comune, ...nm];
  const centrale = [...w32(0x02014b50), ...w16(20), ...comune, ...w16(0), ...w16(0), ...w16(0), ...w32(0), ...w32(0), ...nm];
  const fine = [...w32(0x06054b50), ...w16(0), ...w16(0), ...w16(1), ...w16(1), ...w32(centrale.length), ...w32(locale.length + dati.length), ...w16(0)];
  const out = new Uint8Array(locale.length + dati.length + centrale.length + fine.length);
  out.set(locale, 0); out.set(dati, locale.length); out.set(centrale, locale.length + dati.length); out.set(fine, locale.length + dati.length + centrale.length);
  return out;
}
const C64_STATI = ['aperto', 'chiuso', 'acceso', 'spento', 'qui', 'con_te', 'a_portata'];
// comandi del motore: id 1-5 sempre, id 6 «metti» se è nel vocabolario; gli altri comandi partono da 7
const C64_BASE_VERBI = ['guarda', 'vai', 'prendi', 'lascia', 'inventario', 'metti', 'aspetta', 'ripeti', 'aiuto'];
// Tipi di testo: un byte da 1 a 7 nel testo cambia colore; ogni interprete sceglie i colori del tipo.
// I testi nei dati sono rimescolati (XOR con una chiave che cresce a ogni carattere), le lettere del vocabolario XOR una costante:
// così non si leggono con un editor esadecimale. Gli interpreti usano le stesse costanti.
const TESTO_CHIAVE = 0xA7, TESTO_PASSO = 0x3B, VOCAB_CHIAVE = 0x55;
const RT_NOME = 1, RT_TESTO = 2, RT_OGGETTI = 3, RT_USCITE = 4, RT_ERRORE = 5, RT_COMANDO = 6;
// Testi compressi: dizionario di coppie (byte pair encoding). Ogni codice libero da $80 a $FF sta per una coppia di byte,
// che a sua volta può contenere codici; il dizionario (256 byte, a HDR+40) si scrive solo se fa risparmiare memoria.
// La profondità è limitata, perché gli interpreti espandono i codici chiamandosi da soli (pila del 6502 piccola).
const DIZ_PROFONDITA = 8;
function dizionarioTesti(testi) {
  const usati = new Set(); testi.forEach(t => t.forEach(b => usati.add(b)));
  const liberi = []; for (let v = 128; v < 256; v++) if (!usati.has(v)) liberi.push(v);
  const seq = testi.map(t => t.slice()), coppie = [], prof = new Uint8Array(256), conta = new Int32Array(65536);
  for (const cod of liberi) {
    conta.fill(0);
    seq.forEach(t => { for (let i = 0; i + 1 < t.length; i++) { const k = t[i] << 8 | t[i + 1]; conta[k]++; if (t[i] === t[i + 1] && t[i + 2] === t[i] && i + 2 < t.length) i++; } });
    let best = -1, bn = 2;
    for (let k = 0; k < 65536; k++) if (conta[k] > bn && Math.max(prof[k >> 8], prof[k & 255]) < DIZ_PROFONDITA) { bn = conta[k]; best = k; }
    if (best < 0) break;
    const a = best >> 8, b = best & 255;
    seq.forEach((t, j) => { const o = []; for (let i = 0; i < t.length; i++) { if (i + 1 < t.length && t[i] === a && t[i + 1] === b) { o.push(cod); i++; } else o.push(t[i]); } seq[j] = o; });
    prof[cod] = Math.max(prof[a], prof[b]) + 1;
    coppie.push([cod, a, b]);
  }
  const tab = new Array(256).fill(0); coppie.forEach(([c, a, b]) => { tab[(c - 128) * 2] = a; tab[(c - 128) * 2 + 1] = b; });
  return { coppie, tab };
}
function comprimiTesto(diz, t) {
  diz.coppie.forEach(([c, a, b]) => { const o = []; for (let i = 0; i < t.length; i++) { if (i + 1 < t.length && t[i] === a && t[i + 1] === b) { o.push(c); i++; } else o.push(t[i]); } t = o; });
  return t;
}
// Costruisce i dati del gioco (uguali per tutte le piattaforme retro). opz: base, fineRam, testo(s, maiuscolo), lettera(ch).
// Prima prova senza compressione raccogliendo i testi; se il dizionario fa risparmiare, ricompila con i testi compressi.
function compilaDatiRetro(core, opz) {
  const r1 = costruisciDatiRetro(core, opz, null);
  if (opz.comprimi === false) return r1;
  const diz = dizionarioTesti(r1.testi);
  if (!diz.coppie.length) return r1;
  const r2 = costruisciDatiRetro(core, opz, diz);
  return r2.dati.length < r1.dati.length ? r2 : r1;
}
function costruisciDatiRetro(core, opz, diz) {
  const tt = opz.testo;
  const err = validaCore(core);
  if (err.length) throw new Error('Il core ha problemi: ' + err[0]);
  const avvisi = [];
  const stanze = core.stanze, voc = core.vocabolario, ogg = core.oggetti || [], regole = core.regole || [];
  if (stanze.length > 126) throw new Error('Troppe stanze per il C64 (massimo 126).');
  if (ogg.length > 100) throw new Error('Troppi oggetti per il C64 (massimo 100).');
  const dirKeys = Object.keys(voc.direzioni);
  if (dirKeys.length > 8) throw new Error('Troppe direzioni per il C64 (massimo 8).');
  const indice = id => stanze.findIndex(s => s.id === id);
  const indOgg = id => ogg.findIndex(o => o.id === id);
  // posizione: stanza (0..125), $80+k = dentro l'oggetto k (contenitore), $FE = con te, $FF = da nessuna parte
  const posto = id => id === 'inventario' ? 0xFE : id === 'nessuno' ? 0xFF : indice(id) >= 0 ? indice(id) : indOgg(id) >= 0 ? 0x80 | indOgg(id) : 0xFF;
  const varIdx = id => { const i = (core.variabili || []).findIndex(v => v.id === id); if (i < 0) throw new Error('Variabile sconosciuta: ' + id); return i; };
  const varMax = id => { const v = (core.variabili || []).find(x => x.id === id); return v && v.massimo !== undefined ? v.massimo : 255; };
  const condByte = se => se.variabile ? [2 + ['=', '!=', '>=', '<='].indexOf(se.op), varIdx(se.variabile), se.valore] : se.stanza ? [0, indice(se.stanza), 0] : [1, indOgg(se.oggetto), C64_STATI.indexOf(se.stato)];

  // uscite: semplici nella tabella, con condizioni in una tabella a parte
  const uscite = [], condUscite = [], testiA = [];
  stanze.forEach(s => {
    const riga = new Array(8).fill(0);
    dirKeys.forEach((d, k) => {
      const u = (s.uscite || {})[d];
      if (!u) return;
      const complessa = typeof u === 'object' && ((u.se && u.se.length) || u.nascosta || u.bloccata || u.rivelazione);
      if (!complessa) { riga[k] = indice(verso(u)) + 1; return; }
      if (condUscite.length >= 127) throw new Error('Troppe uscite con condizioni (massimo 127).');
      riga[k] = 0x80 | condUscite.length; condUscite.push(u);
    });
    uscite.push(riga);
    testiA.push([13, RT_NOME, ...tt(s.nome, true), 13, RT_TESTO, ...tt(s.descrizione)]);
  });

  // vocabolario: comandi (tutti), direzioni, parole ignorate e congiunzioni, nomi degli oggetti
  const idVerbo = {};
  let prossimo = C64_BASE_VERBI.length + 1;
  Object.keys(voc.verbi).forEach(k => { const b = C64_BASE_VERBI.indexOf(k); idVerbo[k] = b >= 0 ? b + 1 : prossimo++; });
  const parole = new Map(), cp = chiaviParole(core);
  const aggiungi = (w, tipo, id) => {
    const n = norm(w);
    if (!/^[a-z0-9]{1,15}$/.test(n)) { avvisi.push('Parola «' + w + '» saltata: sul C64 serve una sola parola di al massimo 15 lettere.'); return; }
    if (!parole.has(n)) parole.set(n, [tipo, id]);
  };
  C64_BASE_VERBI.concat(Object.keys(voc.verbi).filter(k => !C64_BASE_VERBI.includes(k))).forEach(k => { if (voc.verbi[k]) (cp ? [k, ...voc.verbi[k]] : voc.verbi[k]).forEach(w => aggiungi(w, 1, idVerbo[k])); });
  dirKeys.forEach((k, i) => (cp ? [k, ...voc.direzioni[k]] : voc.direzioni[k]).forEach(w => aggiungi(w, 2, i)));
  // tipo 3: id 1 = preposizione (separa l'oggetto dal secondo oggetto), id 0 = parola ignorata
  (voc.preposizioni || []).forEach(w => aggiungi(w, 3, 1));
  (voc.ignora || []).forEach(w => aggiungi(w, 3, 0));
  // tipo 4: nome di oggetto (id = numero del nome, uguale per tutti gli oggetti che lo usano); tipo 5: aggettivo
  const idNome = new Map(), idAgg = new Map();
  ogg.forEach(o => [o.nome, ...(o.sinonimi || [])].forEach(w => { const n = norm(w); if (n && !idNome.has(n)) idNome.set(n, idNome.size); }));
  ogg.forEach(o => (o.aggettivi || []).forEach(w => { const n = norm(w); if (n && !idNome.has(n) && !idAgg.has(n)) idAgg.set(n, idAgg.size); }));
  if (idNome.size > 254 || idAgg.size > 254) throw new Error('Troppi nomi o aggettivi diversi per i sistemi retro (massimo 254 di ciascuno).');
  idNome.forEach((id, n) => aggiungi(n, 4, id));
  idAgg.forEach((id, n) => aggiungi(n, 5, id));
  // parole di ogni oggetto, nell'ordine degli oggetti: [n nomi][id...][n aggettivi][id...]
  const paroleOgg = [];
  ogg.forEach(o => {
    const nomi = [...new Set([o.nome, ...(o.sinonimi || [])].map(norm))].filter(n => n && parole.has(n) && parole.get(n)[0] === 4).map(n => parole.get(n)[1]);
    const aggs = [...new Set((o.aggettivi || []).map(norm))].filter(n => n && parole.has(n) && parole.get(n)[0] === 5).map(n => parole.get(n)[1]);
    paroleOgg.push(nomi.length, ...nomi, aggs.length, ...aggs);
  });
  const vocab = [];
  parole.forEach(([tipo, id], n) => { vocab.push(n.length); n.split('').forEach(ch => vocab.push(opz.lettera(ch) ^ VOCAB_CHIAVE)); vocab.push(tipo, id); });
  vocab.push(0);

  // messaggi (ordine fisso, vedi l'interprete)
  const T = Object.assign({}, TESTI_LINGUA.it, TESTI_LINGUA[linguaDi(core)], core.testi), parti = String(T.parola_sconosciuta || 'Parola sconosciuta: {0}').split('{0}');
  const msg = (t, d, r) => [r || RT_ERRORE, ...tt(c64Avvolgi(t || d) + '\n')];
  const tpl = (t, d, r) => { const p = String(t || d).split('{0}'); return [[r, ...tt(p[0])], tt(p[1] || '').concat([13])]; };
  const qui = tpl(T.qui_vedi, 'Qui vedi: {0}.', RT_OGGETTI), inv = tpl(T.inventario, 'Hai con te: {0}.', RT_OGGETTI), usc = tpl(T.uscite, 'Uscite: {0}.', RT_USCITE), dentro = tpl(T.dentro, 'Dentro: {0}.', RT_OGGETTI), pers1 = tpl(T.qui_personaggio, 'Qui c\'e\': {0}.', RT_OGGETTI), persN = tpl(T.qui_personaggi, 'Qui ci sono: {0}.', RT_OGGETTI);
  const messaggi = [msg(T.non_capisco, 'Non capisco.'), [RT_ERRORE, ...tt(parti[0])], tt(parti[1] || '').concat([13]), msg(T.dove_andare, 'Dove vuoi andare?'), msg(T.nessuna_uscita, 'Di là non si passa.'), [RT_COMANDO, ...tt('> ')], msg(T.niente_succede, 'Non succede niente.', RT_TESTO),
    [13, RT_NOME, ...tt(core.titolo || '', true), 13, RT_TESTO, ...tt(core.introduzione ? c64Avvolgi(core.introduzione) + '\n' : '')],
    qui[0], qui[1], inv[0], inv[1], msg(T.inventario_vuoto, 'Non hai niente con te.', RT_TESTO), msg(T.cosa_prendere, 'Cosa vuoi prendere?'), msg(T.cosa_lasciare, 'Cosa vuoi lasciare?'),
    msg(T.non_presente, 'Qui non vedi niente del genere.'), msg(T.non_hai, 'Non hai niente del genere con te.'), msg(T.gia_in_mano, "Ce l'hai già con te."), msg(T.non_prendibile, 'Non puoi prendere questo oggetto.'),
    msg(T.preso, 'Preso.', RT_TESTO), msg(T.lasciato, 'Lasciato.', RT_TESTO), tt(', '), tt(' ' + T.congiunzione + ' '), usc[0], usc[1], msg(T.uscita_bloccata, 'Di là non puoi passare.'), msg(T.ricomincia, 'Premi Invio per ricominciare.', RT_COMANDO), msg(T.quale_intendi, 'Quale intendi? Sii piu preciso, per esempio con un aggettivo.'),
    // 28-34: contenitori
    dentro[0], dentro[1], msg(T.vuoto, '', RT_TESTO), msg(T.cosa_mettere, ''), msg(T.non_contenitore, ''), msg(T.contenitore_chiuso, ''), msg(T.messo, '', RT_TESTO),
    // 35-39: personaggi (35/36 uno solo, 37/38 piu' di uno, 39 rifiuto su «prendi»)
    pers1[0], pers1[1], persN[0], persN[1], msg(T.no_personaggio, "Non sembra d'accordo."),
    // 40-45: comandi comuni (tempo che passa, aiuto, niente da prendere/lasciare, colore del testo, due punti dopo l'etichetta)
    msg(T.tempo_passa, 'Il tempo passa.', RT_TESTO), msg(T.aiuto, 'Scrivi i comandi in italiano.', RT_TESTO), msg(T.niente_da_prendere, 'Non c\'è niente da prendere.'), msg(T.niente_da_lasciare, 'Non hai niente da lasciare.'), [RT_TESTO], tt(': '),
    // 46: stanza buia
    msg(T.buio, 'È buio pesto.', RT_TESTO),
    // 47: pausa («premi un tasto»), senza a capo: sta su una riga sola
    [RT_COMANDO, ...tt(String(T.premi_tasto || '[premi un tasto]').slice(0, 30))]];

  // disposizione dei dati
  const n = stanze.length, base = opz.base;
  const aDiz = base + 40, aStanze = aDiz + (diz ? 256 : 0), aUscite = aStanze + 2 * n, aVocab = aUscite + 8 * n, aMsgTab = aVocab + vocab.length;
  const aOgg = aMsgTab + 2 * messaggi.length, aCond = aOgg + 16 * ogg.length, aDir = aCond + 2 * condUscite.length;
  const aFr = aDir + 2 * dirKeys.length;
  let pool = aFr + 2 * n;
  const corpo = [];
  const piazza = bytes => { const a = pool + corpo.length; corpo.push(...bytes, 0); return a; };
  const testi = [], mis = { testiOrig: 0, testi: 0, immagini: 0, record: 0 };
  const piazzaTesto = (bytes, crudo) => {
    testi.push(bytes); mis.testiOrig += bytes.length + 1;
    const t = diz && !crudo ? comprimiTesto(diz, bytes) : bytes; mis.testi += t.length + 1;
    const a = pool + corpo.length; let k = TESTO_CHIAVE; [...t, 0].forEach(b => { corpo.push(b ^ k); k = (k + TESTO_PASSO) & 255; }); return a;
  };
  const testoPtr = t => t ? piazzaTesto([RT_TESTO, ...tt(c64Avvolgi(t) + '\n')]) : 0;
  const indA = testiA.map(b => piazzaTesto(b)), indMsg = messaggi.map((b, i) => piazzaTesto(b, i === 47));
  const indDir = dirKeys.map(d => piazzaTesto(tt(nomeDir(core, d))));
  if (messaggi.length !== 48) throw new Error('Messaggi: ' + messaggi.length);

  // frammenti di descrizione: per stanza [n][{[n cond][cond...][testo]}...]
  const indFr = stanze.map(s => {
    const fr = s.frammenti || [];
    if (!fr.length) return 0;
    const b = [fr.length];
    fr.forEach(f => { b.push((f.se || []).length); (f.se || []).forEach(c => b.push(...condByte(c))); const p = piazzaTesto(tt(f.testo)); b.push(p & 255, p >> 8); });
    return piazza(b);
  });

  // oggetti
  const recOgg = ogg.map(o => {
    const dove = posto(o.dove);
    const et = t => t ? piazzaTesto(tt(t)) : 0;
    const ds = t => t ? piazzaTesto([RT_TESTO, ...tt(c64Avvolgi(t) + '\n')]) : 0;
    return [dove, (o.prendibile ? 1 : 0) | (o.in_elenco === false ? 4 : 0) | (o.contenitore ? 8 : 0) | (o.contenitore && o.chiudibile ? 16 : 0) | (o.personaggio ? 32 : 0) | (o.argomento ? 64 : 0) | (o.tutto ? 128 : 0) | (o.luce ? 2 : 0), et(o.etichetta || o.nome), ds(o.descrizione || T.descrizione_vuota), et(o.etichetta_aperta), ds(o.descrizione_aperta), et(o.etichetta_attiva), ds(o.descrizione_attiva)];
  });

  // uscite con condizioni: [stanza][nascosta][n cond][cond...][bloccata][rivelazione]
  const recUsc = condUscite.map(u => {
    const o = typeof u === 'object' ? u : { a: u };
    const b = [indice(o.a), o.nascosta ? 1 : 0, (o.se || []).length];
    (o.se || []).forEach(c => b.push(...condByte(c)));
    const bl = testoPtr(o.bloccata), rv = testoPtr(o.rivelazione);
    b.push(bl & 255, bl >> 8, rv & 255, rv >> 8);
    return piazza(b);
  });

  let nVarNascoste = 0;
  const azioneByte = (b, a) => {
    const t = tipoAzione(a);
    if (t === 'dire') { const p = testoPtr(a.dire); b.push(1, p & 255, p >> 8); }
    else if (t === 'sposta') b.push(2, indOgg(a.sposta.oggetto), posto(a.sposta.a));
    else if (t === 'apri') b.push(3, indOgg(a.apri));
    else if (t === 'chiudi') b.push(4, indOgg(a.chiudi));
    else if (t === 'accendi') b.push(5, indOgg(a.accendi));
    else if (t === 'spegni') b.push(6, indOgg(a.spegni));
    else if (t === 'descrivi') b.push(7);
    else if (t === 'imposta') b.push(9, varIdx(a.imposta.variabile), Math.min(a.imposta.valore, varMax(a.imposta.variabile)));
    else if (t === 'aumenta') b.push(10, varIdx(a.aumenta.variabile), Math.min(a.aumenta.di, 255), varMax(a.aumenta.variabile));
    else if (t === 'diminuisci') b.push(11, varIdx(a.diminuisci.variabile), Math.min(a.diminuisci.di, 255));
    else if (t === 'fine') { const p = testoPtr('\n' + a.fine); b.push(8, p & 255, p >> 8); }
  };
  // regole: [lunghezza][comando][oggetto][con][n cond][cond...][altrimenti (2)][azioni...][0]
  const flusso = [];
  regole.forEach(r => {
    const q = r.quando || {};
    if (!(q.verbo in idVerbo)) { avvisi.push('Una regola usa il comando «' + q.verbo + '», che non è nel vocabolario: saltata.'); return; }
    const b = [idVerbo[q.verbo], q.oggetto ? indOgg(q.oggetto) : 0xFF, q.con ? indOgg(q.con) : 0xFF, (r.se || []).length];
    (r.se || []).forEach(c => b.push(...condByte(c)));
    const alt = testoPtr(r.altrimenti);
    b.push(alt & 255, alt >> 8);
    (r.allora || []).forEach(a => azioneByte(b, a));
    b.push(0);
    if (b.length > 255) throw new Error('Una regola è troppo lunga per il C64.');
    flusso.push(b.length, ...b);
  });
  // eventi d'ingresso: regole con comando $FE e stanza al posto dell'oggetto; «solo la prima volta» usa una variabile nascosta
  const utenti = (core.variabili || []).length; let nascoste = 0;
  (core.eventi || []).forEach(e => {
    const hid = e.una_volta ? utenti + nascoste++ : -1;
    // evento «guardando un oggetto»: comando $FD con l'oggetto
    const b = e.guarda ? [0xFD, indOgg(e.guarda), 0xFF, (e.se || []).length + (e.una_volta ? 1 : 0)] : [0xFE, e.stanza ? indice(e.stanza) : 0xFF, 0xFF, (e.se || []).length + (e.una_volta ? 1 : 0)];
    if (e.una_volta) b.push(2, hid, 0);
    (e.se || []).forEach(c => b.push(...condByte(c)));
    b.push(0, 0);
    if (e.una_volta) b.push(9, hid, 1);
    (e.allora || []).forEach(a => azioneByte(b, a));
    b.push(0);
    if (b.length > 255) throw new Error('Un evento è troppo lungo per il C64.');
    flusso.push(b.length, ...b);
  });
  nVarNascoste = nascoste;
  flusso.push(0);
  const aRegole = piazza(flusso.slice(0, -1)); // il terminatore è aggiunto da piazza
  const aParO = piazza(paroleOgg);
  const aBuie = (core.stanze || []).some(s => s.buia) ? piazza(stanze.map(s => s.buia ? 1 : 0)) : 0;
  // immagini (opz.immagine(i) = byte dell'immagine della stanza i, o null): tabella di 2 byte per stanza; la stessa immagine si scrive una volta sola
  // oggetti (opz.immagineOgg(i)): tabella di 2 byte per oggetto più l'elenco dei comandi che mostrano l'immagine [n][id...]
  let aImg = 0, aImgO = 0, aVerbiImg = 0;
  const scritte = new Map(), registra = b => { if (!b) return 0; const k = b.join(','); if (!scritte.has(k)) { scritte.set(k, piazza(b)); mis.immagini += b.length + 1; } return scritte.get(k); };
  const tabella = ptr => piazza(ptr.flatMap(p => [p & 255, p >> 8]));
  const figure = opz.immagine ? stanze.map((s, i) => opz.immagine(i)) : [];
  if (figure.some(Boolean)) aImg = tabella(figure.map(registra));
  const figureO = opz.immagineOgg ? ogg.map((o, i) => opz.immagineOgg(i)) : [];
  if (figureO.some(Boolean)) {
    aImgO = tabella(figureO.map(registra));
    const vi = verbiConImmagine(core).filter(k => k in idVerbo).map(k => idVerbo[k]);
    aVerbiImg = piazza([vi.length, ...vi]);
  }
  // immagine del titolo (HDR+38): si mostra prima dell'introduzione, e allora dopo l'introduzione si aspetta sempre un tasto
  const aImgT = opz.immagineTitolo ? registra(opz.immagineTitolo) : 0;
  const nVar = (core.variabili || []).length + nVarNascoste;
  if (nVar > 64) throw new Error('Troppe variabili per i sistemi retro (' + nVar + ', compresi gli eventi «solo la prima volta»): il massimo è 64.');
  const aVar = nVar ? piazza([...(core.variabili || []).map(v => Math.min(v.iniziale || 0, v.massimo !== undefined ? v.massimo : 255)), ...Array(nVarNascoste).fill(0)]) : 0;

  // scrittura
  const dati = [];
  const w16 = v => { dati.push(v & 255, v >> 8 & 255); };
  dati.push(indice(core.inizio), n); w16(aStanze); w16(aUscite); w16(aVocab); w16(aMsgTab); dati.push(ogg.length, (opz.opzioni && opz.opzioni.righe ? 0 : 1) | (opz.opzioni && opz.opzioni.attesa === false && !aImgT ? 0 : 2) | (diz ? 4 : 0)); w16(aOgg); w16(aRegole); w16(aCond); w16(aDir); dati.push(dirKeys.length, 0); w16(aFr); w16(aVar); dati.push(nVar, 0); w16(aParO); w16(aBuie); w16(aImg); w16(aImgO); w16(aVerbiImg); w16(aImgT);
  if (diz) dati.push(...diz.tab);
  const aTab = dati.length;
  indA.forEach(w16);
  uscite.forEach(r => dati.push(...r));
  dati.push(...vocab);
  indMsg.forEach(w16);
  recOgg.forEach(r => { dati.push(r[0], r[1]); r.slice(2).forEach(w16); dati.push(0, 0); });
  recUsc.forEach(w16);
  indDir.forEach(w16);
  indFr.forEach(w16);
  const tabelle = dati.length - aTab - vocab.length;
  dati.push(...corpo);
  if (base + dati.length > opz.fineRam) throw new Error('Il gioco è troppo grande per la memoria ' + (opz.nome || 'del C64') + '.');
  // quanta memoria usa ogni parte dei dati (per il resoconto nella scheda Compila)
  const memoria = { intestazione: 40, dizionario: diz ? 256 : 0, tabelle, vocabolario: vocab.length, testi: mis.testi, testiOrig: mis.testiOrig, immagini: mis.immagini, regole: flusso.length };
  memoria.altro = corpo.length - mis.testi - mis.immagini - flusso.length;
  return { dati, avvisi, base, testi, memoria, compressi: !!diz };
}

// Immagine per il C64 da indici di tavolozza: [colonne][righe][1 = multicolore][fondo][bitmap][colori schermo][RAM colore se multicolore].
// Alta risoluzione: in ogni blocco il colore più usato è lo 0 (nibble basso), l'altro l'1 (nibble alto).
// Multicolore: 00 = fondo comune, 01 = nibble alto, 10 = nibble basso, 11 = RAM colore.
function c64Immagine(conv) {
  const multi = conv.scalaX === 2, cw = multi ? 4 : 8, col = conv.w / cw, righe = conv.h >> 3, bit = [], scr = [], cram = [];
  for (let cr = 0; cr < righe; cr++) for (let cx = 0; cx < col; cx++) {
    const n = new Map(), p = (x, y) => conv.px[(cr * 8 + y) * conv.w + cx * cw + x];
    for (let y = 0; y < 8; y++) for (let x = 0; x < cw; x++) { const c = p(x, y); n.set(c, (n.get(c) || 0) + 1); }
    let cod;
    if (multi) {
      const altri = [...n.keys()].filter(c => c !== conv.fondo).sort((a, b) => n.get(b) - n.get(a));
      cod = new Map([[conv.fondo, 0]]); altri.forEach((c, i) => cod.set(c, i + 1));
      scr.push(((altri[0] || 0) << 4) | (altri[1] || 0)); cram.push(altri[2] || 0);
    } else {
      const cc = [...n.keys()].sort((a, b) => n.get(b) - n.get(a));
      cod = new Map([[cc[0], 0]]); if (cc.length > 1) cod.set(cc[1], 1);
      scr.push(((cc[1] === undefined ? 0 : cc[1]) << 4) | cc[0]);
    }
    for (let y = 0; y < 8; y++) {
      let b = 0;
      for (let x = 0; x < cw; x++) b |= (cod.get(p(x, y)) || 0) << (multi ? 6 - 2 * x : 7 - x);
      bit.push(b);
    }
  }
  return [col, righe, multi ? 1 : 0, multi ? conv.fondo : 0, ...bit, ...scr, ...cram];
}
function compilaC64(core, opzioni, immagini) {
  const { dati, avvisi, base, memoria: md, compressi } = compilaDatiRetro(core, { opzioni, immagine: immagini && (i => immagini[i] ? c64Immagine(immagini[i]) : null),
    immagineOgg: immagini && immagini.oggetti && (i => immagini.oggetti[i] ? c64Immagine(immagini.oggetti[i]) : null), immagineTitolo: immagini && immagini.titolo ? c64Immagine(immagini.titolo) : null, base: C64_INDIRIZZO_DATI, fineRam: C64_FINE_RAM, testo: c64Testo, lettera: ch => /[a-z]/.test(ch) ? ch.charCodeAt(0) - 32 : ch.charCodeAt(0) });
  // programma: avvio BASIC "10 SYS 2061", interprete, riempimento, dati
  const codice = Uint8Array.from(atob(CODICE_C64_B64), ch => ch.charCodeAt(0));
  const stub = [0x0B, 0x08, 0x0A, 0x00, 0x9E, 0x32, 0x30, 0x36, 0x31, 0x00, 0x00, 0x00];
  // programma: avvio, interprete, font a $2000, dati a $2400 (tutto contiguo dal $0801)
  const prg = new Uint8Array(2 + (base - 0x0801) + dati.length);
  prg.set([0x01, 0x08], 0); prg.set(stub, 2); prg.set(codice, 2 + stub.length);
  prg.set(Uint8Array.from(atob(FONT_C64_B64), ch => ch.charCodeAt(0)), 2 + C64_INDIRIZZO_FONT - 0x0801);
  prg.set(dati, 2 + (base - 0x0801));
  // resoconto: interprete (con l'avvio BASIC), font, dati del gioco e memoria libera fino a C64_FINE_RAM
  const dettaglio = { codice: stub.length + codice.length, codiceMax: C64_INDIRIZZO_FONT - 0x0801, font: 0x400, dati: md, totaleDati: dati.length, liberoDati: C64_FINE_RAM - base - dati.length, compressi };
  return { prg, avvisi, memoria: base + dati.length - 0x0801, dettaglio };
}

// ---- Compilatore ZX Spectrum ----
// File .tap: programma BASIC di avvio (CLEAR 32767: LOAD "" CODE: RANDOMIZE USR 32768) e blocco di codice con interprete e dati.
const CODICE_ZX_B64 = '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';
const ZX_INDIRIZZO_CODICE = 0x8000, ZX_INDIRIZZO_DATI = 0x9500, ZX_FINE_RAM = 0xF000;
const ZX_ACCENTI = { 'à': 144, 'è': 145, 'é': 146, 'ì': 147, 'ò': 148, 'ù': 149, 'À': 150, 'È': 151, 'É': 152, 'Ì': 153, 'Ò': 154, 'Ù': 155, 'á': 144, 'í': 147, 'ó': 148, 'ú': 149 };
const zxTesto = (s, maiuscolo) => Array.from(c64Ascii(maiuscolo ? String(s).toUpperCase() : s), ch => ch === '\n' ? 13 : ZX_ACCENTI[ch] || ch.charCodeAt(0));
function zxBlocco(flag, dati) {
  const b = [flag, ...dati]; let x = 0; b.forEach(v => x ^= v); b.push(x);
  return [b.length & 255, b.length >> 8, ...b];
}
function zxIntestazione(tipo, nome, lunghezza, p1, p2) {
  const n = Array.from(nome.padEnd(10, ' ').slice(0, 10), ch => ch.charCodeAt(0) & 0x7F);
  return zxBlocco(0, [tipo, ...n, lunghezza & 255, lunghezza >> 8, p1 & 255, p1 >> 8, p2 & 255, p2 >> 8]);
}
// Immagine per lo Spectrum da indici di tavolozza (0-15, 8-15 luminosi): [colonne][righe][pixel, 8 righe per riga di caratteri][attributi].
// In ogni blocco 8x8 il colore più usato è il fondo (PAPER), l'altro l'inchiostro (INK).
function zxImmagine(conv) {
  const col = conv.w >> 3, righe = conv.h >> 3, pix = [], att = [];
  for (let cr = 0; cr < righe; cr++) {
    const ink = [];
    for (let cx = 0; cx < col; cx++) {
      const n = new Map();
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const c = conv.px[(cr * 8 + y) * conv.w + cx * 8 + x], k = c === 8 ? 0 : c; n.set(k, (n.get(k) || 0) + 1); }
      const cc = [...n.keys()].sort((a, b) => n.get(b) - n.get(a)), paper = cc[0], i = cc.length > 1 ? cc[1] : cc[0];
      ink.push(i === paper ? -1 : i);
      att.push((cc.some(c => c >= 8) ? 64 : 0) | (paper & 7) << 3 | (i & 7));
    }
    for (let y = 0; y < 8; y++) for (let cx = 0; cx < col; cx++) {
      let b = 0;
      for (let x = 0; x < 8; x++) { const c = conv.px[(cr * 8 + y) * conv.w + cx * 8 + x]; if ((c === 8 ? 0 : c) === ink[cx]) b |= 128 >> x; }
      pix.push(b);
    }
  }
  return [col, righe, ...pix, ...att];
}
function compilaZX(core, opzioni, immagini) {
  const { dati, avvisi, memoria: md, compressi } = compilaDatiRetro(core, { opzioni, immagine: immagini && (i => immagini[i] ? zxImmagine(immagini[i]) : null),
    immagineOgg: immagini && immagini.oggetti && (i => immagini.oggetti[i] ? zxImmagine(immagini.oggetti[i]) : null), immagineTitolo: immagini && immagini.titolo ? zxImmagine(immagini.titolo) : null, base: ZX_INDIRIZZO_DATI, fineRam: ZX_FINE_RAM, nome: 'dello Spectrum', testo: zxTesto, lettera: ch => ch.charCodeAt(0) });
  const codice = Uint8Array.from(atob(CODICE_ZX_B64), ch => ch.charCodeAt(0));
  if (ZX_INDIRIZZO_CODICE + codice.length > ZX_INDIRIZZO_DATI) throw new Error('Codice troppo grande.');
  const immagine = new Uint8Array(ZX_INDIRIZZO_DATI - ZX_INDIRIZZO_CODICE + dati.length);
  immagine.set(codice, 0); immagine.set(dati, ZX_INDIRIZZO_DATI - ZX_INDIRIZZO_CODICE);
  const num = (s, v) => [...Array.from(s, ch => ch.charCodeAt(0)), 0x0E, 0, 0, v & 255, v >> 8, 0];
  const riga = [0xFD, ...num('32767', 32767), 0x3A, 0xEF, 0x22, 0x22, 0xAF, 0x3A, 0xF9, 0xC0, ...num('32768', 32768), 0x0D];
  const programma = [0, 10, riga.length & 255, riga.length >> 8, ...riga];
  const nome = (norm(core.titolo || '').replace(/[^a-z0-9]/g, '') || 'avventura').slice(0, 10);
  const tap = [...zxIntestazione(0, nome, programma.length, 10, programma.length), ...zxBlocco(0xFF, programma),
    ...zxIntestazione(3, nome, immagine.length, ZX_INDIRIZZO_CODICE, 32768), ...zxBlocco(0xFF, immagine)];
  const dettaglio = { codice: codice.length, codiceMax: ZX_INDIRIZZO_DATI - ZX_INDIRIZZO_CODICE, font: 0, dati: md, totaleDati: dati.length, liberoDati: ZX_FINE_RAM - ZX_INDIRIZZO_DATI - dati.length, compressi };
  return { tap: Uint8Array.from(tap), immagine, avvisi, memoria: immagine.length, dettaglio };
}
