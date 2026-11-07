// ---- Compilatore Commodore 64 ----
// Il compilatore unisce: un programma BASIC di avvio (SYS 2061), l'interprete già assemblato in 6502 e i dati del gioco.
// Passo 4: tutto il core; l'interprete va a capo da solo tra le parole.
const CODICE_C64_B64 = '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';
// Font 8x8 del gioco (disegno originale, sorgente in font_c64.py): 128 caratteri, codici schermo 0-127 (96-107: lettere accentate).
const FONT_C64_B64 = 'ADxOUk5APAAAADwCPkI+AABAXGJCYlwAAAA8QEBAPAAAAjpGQkY6AAAAPEJ+QDwAAAwQPBAQEAAAAD5CQj4CPABAXGJCQkIAABAAMBAQOAAABAAMBAREOABAREhwSEQAADAQEBAQOAAAAGxSUlJSAAAAXGJCQkIAAAA8QkJCPAAAAFxiQmJcQAAAOkZCRjoCAABcYkBAQAAAAD5APAJ8AAAQPBAQEgwAAABCQkJGOgAAAEJCJCQYAAAAQkJaWiQAAABCJBgkQgAAAEJCQj4CPAAAfgQYIH4AADggICAgOAAAQCAQCAQCAAA4CAgICDgAABAoRAAAAAAAAAAAAAAAfgAAAAAAAAAAABAQEBAAEAAAKCgAAAAAAAAkfiQkfiQAEDxQOBR4EAAAYmQIECZGAAAwSDBKRDoAAAgQAAAAAAAACBAQEBAIAAAgEBAQECAAAAAQVDhUEAAAABAQfBAQAAAAAAAAMDAgAAAAADwAAAAAAAAAADAwAAACBAgQIEAAADxGSlJiPAAAEDAQEBA4AAA8QgI8QH4AADxCDAJCPAAACBgoSH4IAAB+QHwCQjwAADxAfEJCPAAAfgIECBAQAAA8QjxCQjwAADxCQj4CPAAAADAwADAwAAAAMDAAMDAgAAAIECAQCAAAAAB8AHwAAAAAIBAIECAAADxCBAgACAAAAAAAAAAAAAAYJEJ+QkIAAHxCfEJCfAAAPEJAQEI8AAB4REJCRHgAAH5AfEBAfgAAfkB8QEBAAAA8QEBOQjwAAEJCfkJCQgAAOBAQEBA4AAACAgICQjwAAERIcEhEQgAAQEBAQEB+AABCZlpCQkIAAEJiUkpGQgAAPEJCQkI8AAB8QkJ8QEAAADxCQlJKPAAAfEJCfERCAAA+QDwCAnwAAHwQEBAQEAAAQkJCQkI8AABCQkIkJBgAAEJCQlpmQgAAQiQYGCRCAABEKBAQEBAAAH4ECBAgfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBA8Aj5CPgAgEDxCfkA8AAgQPEJ+QDwAIBAAMBAQOAAgEDxCQkI8ACAQQkJCRjoAIBgkQn5CQgAgfkB8QEB+AAh+QHxAQH4AIDgQEBAQOAAgPEJCQkI8ACBCQkJCQjwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
const C64_INDIRIZZO_DATI = 0x2000, C64_INDIRIZZO_FONT = 0x1C00, C64_FINE_RAM = 0xA000, C64_LARGHEZZA = 39;
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
// Costruisce i dati del gioco (uguali per tutte le piattaforme retro). opz: base, fineRam, testo(s, maiuscolo), lettera(ch).
function compilaDatiRetro(core, opz) {
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
    msg(T.buio, 'È buio pesto.', RT_TESTO)];

  // disposizione dei dati
  const n = stanze.length, base = opz.base;
  const aStanze = base + 32, aUscite = aStanze + 2 * n, aVocab = aUscite + 8 * n, aMsgTab = aVocab + vocab.length;
  const aOgg = aMsgTab + 2 * messaggi.length, aCond = aOgg + 16 * ogg.length, aDir = aCond + 2 * condUscite.length;
  const aFr = aDir + 2 * dirKeys.length;
  let pool = aFr + 2 * n;
  const corpo = [];
  const piazza = bytes => { const a = pool + corpo.length; corpo.push(...bytes, 0); return a; };
  const piazzaTesto = bytes => { const a = pool + corpo.length; let k = TESTO_CHIAVE; [...bytes, 0].forEach(b => { corpo.push(b ^ k); k = (k + TESTO_PASSO) & 255; }); return a; };
  const testoPtr = t => t ? piazzaTesto([RT_TESTO, ...tt(c64Avvolgi(t) + '\n')]) : 0;
  const indA = testiA.map(piazzaTesto), indMsg = messaggi.map(piazzaTesto);
  const indDir = dirKeys.map(d => piazzaTesto(tt(nomeDir(core, d))));

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
    const b = [0xFE, e.stanza ? indice(e.stanza) : 0xFF, 0xFF, (e.se || []).length + (e.una_volta ? 1 : 0)];
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
  const nVar = (core.variabili || []).length + nVarNascoste;
  if (nVar > 64) throw new Error('Troppe variabili per i sistemi retro (' + nVar + ', compresi gli eventi «solo la prima volta»): il massimo è 64.');
  const aVar = nVar ? piazza([...(core.variabili || []).map(v => Math.min(v.iniziale || 0, v.massimo !== undefined ? v.massimo : 255)), ...Array(nVarNascoste).fill(0)]) : 0;

  // scrittura
  const dati = [];
  const w16 = v => { dati.push(v & 255, v >> 8 & 255); };
  dati.push(indice(core.inizio), n); w16(aStanze); w16(aUscite); w16(aVocab); w16(aMsgTab); dati.push(ogg.length, 0); w16(aOgg); w16(aRegole); w16(aCond); w16(aDir); dati.push(dirKeys.length, 0); w16(aFr); w16(aVar); dati.push(nVar, 0); w16(aParO); w16(aBuie);
  indA.forEach(w16);
  uscite.forEach(r => dati.push(...r));
  dati.push(...vocab);
  indMsg.forEach(w16);
  recOgg.forEach(r => { dati.push(r[0], r[1]); r.slice(2).forEach(w16); dati.push(0, 0); });
  recUsc.forEach(w16);
  indDir.forEach(w16);
  indFr.forEach(w16);
  dati.push(...corpo);
  if (base + dati.length > opz.fineRam) throw new Error('Il gioco è troppo grande per la memoria del C64.');

  return { dati, avvisi, base };
}

function compilaC64(core) {
  const { dati, avvisi, base } = compilaDatiRetro(core, { base: C64_INDIRIZZO_DATI, fineRam: C64_FINE_RAM, testo: c64Testo, lettera: ch => /[a-z]/.test(ch) ? ch.charCodeAt(0) - 32 : ch.charCodeAt(0) });
  // programma: avvio BASIC "10 SYS 2061", interprete, riempimento, dati
  const codice = Uint8Array.from(atob(CODICE_C64_B64), ch => ch.charCodeAt(0));
  const stub = [0x0B, 0x08, 0x0A, 0x00, 0x9E, 0x32, 0x30, 0x36, 0x31, 0x00, 0x00, 0x00];
  // programma: avvio, interprete, font a $1800, dati a $1C00 (tutto contiguo dal $0801)
  const prg = new Uint8Array(2 + (base - 0x0801) + dati.length);
  prg.set([0x01, 0x08], 0); prg.set(stub, 2); prg.set(codice, 2 + stub.length);
  prg.set(Uint8Array.from(atob(FONT_C64_B64), ch => ch.charCodeAt(0)), 2 + C64_INDIRIZZO_FONT - 0x0801);
  prg.set(dati, 2 + (base - 0x0801));
  return { prg, avvisi, memoria: base + dati.length - 0x0801 };
}

// ---- Compilatore ZX Spectrum ----
// File .tap: programma BASIC di avvio (CLEAR 32767: LOAD "" CODE: RANDOMIZE USR 32768) e blocco di codice con interprete e dati.
const CODICE_ZX_B64 = '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';
const ZX_INDIRIZZO_CODICE = 0x8000, ZX_INDIRIZZO_DATI = 0x9200, ZX_FINE_RAM = 0xF000;
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
function compilaZX(core) {
  const { dati, avvisi } = compilaDatiRetro(core, { base: ZX_INDIRIZZO_DATI, fineRam: ZX_FINE_RAM, testo: zxTesto, lettera: ch => ch.charCodeAt(0) });
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
  return { tap: Uint8Array.from(tap), immagine, avvisi, memoria: immagine.length };
}
