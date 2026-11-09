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
    msg(T.buio, 'È buio pesto.', RT_TESTO),
    // 47: pausa («premi un tasto»), senza a capo: sta su una riga sola
    [RT_COMANDO, ...tt(String(T.premi_tasto || '[premi un tasto]').slice(0, 30))]];

  // disposizione dei dati
  const n = stanze.length, base = opz.base;
  const aStanze = base + 34, aUscite = aStanze + 2 * n, aVocab = aUscite + 8 * n, aMsgTab = aVocab + vocab.length;
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
  // immagini (opz.immagine(i) = byte dell'immagine della stanza i, o null): tabella di 2 byte per stanza; la stessa immagine si scrive una volta sola
  let aImg = 0;
  const figure = opz.immagine ? stanze.map((s, i) => opz.immagine(i)) : [];
  if (figure.some(Boolean)) {
    const scritte = new Map(), chiave = b => b.join(',');
    const ptr = figure.map(b => { if (!b) return 0; const k = chiave(b); if (!scritte.has(k)) scritte.set(k, piazza(b)); return scritte.get(k); });
    aImg = piazza(ptr.flatMap(p => [p & 255, p >> 8]));
  }
  const nVar = (core.variabili || []).length + nVarNascoste;
  if (nVar > 64) throw new Error('Troppe variabili per i sistemi retro (' + nVar + ', compresi gli eventi «solo la prima volta»): il massimo è 64.');
  const aVar = nVar ? piazza([...(core.variabili || []).map(v => Math.min(v.iniziale || 0, v.massimo !== undefined ? v.massimo : 255)), ...Array(nVarNascoste).fill(0)]) : 0;

  // scrittura
  const dati = [];
  const w16 = v => { dati.push(v & 255, v >> 8 & 255); };
  dati.push(indice(core.inizio), n); w16(aStanze); w16(aUscite); w16(aVocab); w16(aMsgTab); dati.push(ogg.length, (opz.opzioni && opz.opzioni.righe ? 0 : 1) | (opz.opzioni && opz.opzioni.attesa === false ? 0 : 2)); w16(aOgg); w16(aRegole); w16(aCond); w16(aDir); dati.push(dirKeys.length, 0); w16(aFr); w16(aVar); dati.push(nVar, 0); w16(aParO); w16(aBuie); w16(aImg);
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

function compilaC64(core, opzioni) {
  const { dati, avvisi, base } = compilaDatiRetro(core, { opzioni, base: C64_INDIRIZZO_DATI, fineRam: C64_FINE_RAM, testo: c64Testo, lettera: ch => /[a-z]/.test(ch) ? ch.charCodeAt(0) - 32 : ch.charCodeAt(0) });
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
const CODICE_ZX_B64 = 'IYCTIntcPgcyjVwySFyv0/7Naw0+As0BFq8yMPAyMfAyM/A6AJQyAPCvMkLwMlDwMlLwMlPwMgD0MgzwMiH0MiL0MiP0IQD1Iib0Mij0Miz0Z28iKvQ+FTIp9DoKlEc6DPC4MBzNGohOI0Y6DPBfFgAhAPIZcSGA8xlwIQzwNBjaIYDyEYHyAX8ANgDtsCEA8xEB8wE/ADYA7bA6GpS3KAtPBgAqGJQRAPPtsD4Hzd2Bze+AzTyOOguU5gLEGpDNd4LNO5M+Bc3dgc3vgM08jq8yIfTNlZCvMjDwMiz0Pv8yjFw6QvC3wgCAzTSRGNY6MfC3yDoz8CEw8Ib+IDgJPg3NnI2vMjDwrzIy8Doy8F8WACFA8Rl+zZyNOjLwPDIy8CEx8L4g5Toz8CEw8IYyMPCvMjHwMjPwyQcABgEHAAQBBQECAQcBBwAyPvA+ENfNXoF+1z4T181egSN+18k6PvCHXxYAITmBGcnF1eVP/g0oP/4gKCY6MfD+HzgIxc3vgME6MfBfFgAhQPEZcTwyMfB5/gg4JyEz8DQYIc3vgDow8P4fMBc8MjDwPiDNnI0YDM3vgD4NzZyNrzIw8OHRwcnFBqd+qCgKzWqBeMY7RyMY8sHJfrfIzWqBIxj3h18WACoIlBl+I2ZvGNY6APBvJgApKSntSwSUCToZ8F8WABl+ya8yGfA6FJRHOhnwuDAazbqDOkbw/gEgCipL8Hy1KAPNwYEhGfA0GNyvMhnwMg/wOhSURzoZ8LgwMs26gzpG8LcoIzoP8Lc+FSACPhfN3YE6GfCHXxYAKhKUGX4jZm/NwYEhD/A0IRnwNBjEOg/wt8g+GMPdgc1Mj83EiTAFPi7D3YE6APBvJgAp7VsClBl+I2ZvzcGBzS6EPg3NaoE6APAyDfA+CDIO8M1viD4gMlLwPgEyU/A6APAyDfA+IzIO8M1viK8yUvAyU/DDAoLl1SpO8DpF8F8WABl+IUXwNNHht8nNz4IgD83PgkfNz4I6APC4KGMYX8Nbg83Pgl/Nz4IyBvD+BDAmFgAhgPIZTv4CMAV55gEYA3nmAk86BvDmAXkoBbcoMRgttyAsGCh7zcOHTzoG8P4FKAowDzoA8LkoFhgSef7+KA8YCzoA8LkoB3n+/igCt8k3yf4COJzWAk/Nz4Jfzc+CRxYAIQDzGXm3fiAFuCgZGBkNIAW4IBEYEQ0gBbgwCRgJuCgEOAIYAjfJt8nNz4IyQ/A+ATJE8DpD8LcoD83kgjgErzJE8CFD8DUY6zpE8LfJrzJG8DJJ8DJK8DJL8DJM8M3rgbfIy38gCj0yR/A+ATJG8Mnmf4dfFgAqEJQZfiNmbyJO8K8yRfDNz4IyR/DNz4IySPDNlYP1zc+CMknwzc+CMkrwzc+CMkvwzc+CMkzw8SgGPgEyRvDJOkjwt8A+AjJG8Mk6APCHXxYAKhaUGX4jZm+0yCJO8K8yRfDNz4IyTfA6TfC3yM2Vg/XNz4Jvzc+CZ/EoCuU+IM1qgeHNwYEhTfA1GNxfFgAhQPMZfiMjpv7/yTpE8/7/wCFG882NhCFH837+/8hHOkLz/v8gBngyQvMYCzpD8/7/IAR4MkPzNv/JOkDw/v/IOkHw/v/IIYDzOkDwXxYAGX7mIMghgPM6QfBfFgAZfuZAyDpA8Ec6QfAyQPB4MkHwyc3xhEc6SvO3eMg+/8kyUvOvMkrzMkzzMk3zMk7zPv8yS/M6UvPNcIQgAz7/yc3EiT4AFzJb8zpS818WACFA8xkiVvMqHJSvMk/zOgqURzpP87jSL4avMlDzMlHzMlPzMlTzfiO3KB5HfiNP5SpW8365IAU+ATJQ8yN+uSAFPgEyUfPhEON+I7coIEd+I0/lKlbzIyN+uSAFPgEyU/MjfrkgBT4BMlTz4RDhIljzKlbzIyN+/v8oBzpT87fKJYYjfv7/KAY6VPO3KHcqVvN+I6b+/ygKOlDzRzpR87AoYzpP818WACGA8xl+5kAoCTpJ8+YEKE0YJjpP883DhyEA8L4gDzpJ8+YBKDg6W/O3IDIYC/7+ICw6SfPmAiglOkvz/v8gBjpP8zJL8yFO8zQ6UPO3KAQhTPM0OlHztygEIU3zNCFP8zQqWPPDLoUqVvN+I6b+/ygQOkzz/gIwEDpN8/4CMAkYDDpO8/4COAU+ATJK8zpL88nNz4JfFgAhgPIZySoOlCJO8CpO8H63yCM6AfC+ID4jfv7/KAdHOkDwuCAxI37+/ygHRzpB8LggJD7/MlrzPgQyRfDNlYP1zc+Cb83PgmfxIBl8tSgHzcGBPgG3ySpO8H5fFgAZIyJO8Binzc+CyqqH/gEgDs3Pgm/Nz4JnzcGBw8OG/gIgEs3Pgl/Nz4JPFgAhAPIZccPDhv4DIAzNWYbLxnsyWvPDw4b+BCAIzVmGy4bDw4b+BSAIzVmGy87Dw4b+BiAIzVmGy47Dw4b+ByAWKk7w5TpF8PXNd4LxMkXw4SJO8MPDhv4IIBjNz4Jvzc+CZ83BgT4azd2BPgEyQvDDw4b+CSASzc+CX83Pgk8WACEA8xlxw8OG/gogHs3Pgl/Nz4JPzc+CRxYAIQDzGX6BOAO4OAF4d8PDhs3Pgl/Nz4JPFgAhAPMZfpEwAa93w8OGOlrz/v/E8Ic6UPC3KAc6QvC3yrWGPgG3yQYIXxYAIQDyGX7+gNj+/tDmf18hgPMZy2YoCCGA8hnLRigHIQDyGX4Q4D7/yV8WACGA8xnLXsjLZigHIYDyGctGyHv2gDIN8D4cMg7wzW+It8A+HsPdgToM8G8mACkpKSntWwyUGck6DPBfFgAhAPIZOg3wviAzzRqI5SN+MlTw4ToN8P6AMAw6VPDmIEc6UvC4IBY6DfD+/jANOlTw5gQoBjoN8L4oAjfJt8mvMgvwMgzwOgqURzoM8LgwD80qiDAEIQvwNCEM8DQY5zoL8LfIOlPwtygPOgvw/gI4CDoO8MYCMg7wOg7wzd2BrzIM8DIP8DoKlEc6DPC4MCzNKogwIToP8LcoD0c6C/A9uD4WKAI+Fc3dgT4CzQSJzcGBIQ/wNCEM8DQYyjoO8DzN3YE6C/DJKhPwXxYAGX4jZm+0yTIG8M0aiCIT8DoM8F8WACGA8hlOy0EoCToG8MYEzfeIwMtJKAk6BvDGCM33iMA6BvAYwDpV881whMp3gj4DMknzOlXzzfGERzpK87fCbol4/v8gBT4Pw92BMgzwPgTNBInNwYE6DPDD8Ic+G8PdgToA9LcgBT4Gw92BIQD0EQDxAR0A7bDDNJE+BzJJ8zpV883xhEc6SvO3IBJ4/v8oDV8WACGA8xnLfigCN8m3yT4szd2BPgLNBInNwYE+LcPdgSoelHy1KEQ6APBfFgAZfrcoOa8yV/A6CpRHOlfwuDApXxYAIYDzGctOKBghgPIZy04oEDpX8M3DhyEA8L4oDP7+KAghV/A0GM03ybfJzcSJMAU+KsPdga8yVfAyVvA6CpRHOlXwuDBYMgzwrzJS8DoA8DIN8M0qiDBAOlXwXxYAIYDzGctGKDIhVvA0zbKJOlXwMkDwPv8yQfA+AzIB8M1khiAROlXwXxYAIQDyGTb+PhPN3YE6QvC3wCFV8DQYnjpW8LfAPirD3YGvMlXwMlbwOgqURzpV8LgwSzIM8K8yUvA+/jIN8M0qiDA0IVbwNM2yiTpV8DJA8D7/MkHwPgQyAfDNZIYgEzpV8F8WACEA8hk6APB3PhTN3YE6QvC3wCFV8DQYqzpW8LfAPivD3YE6VfPNcIQgBT4Nw92BzYyJ2hGKPgEySfM6VfPN8YRHOkrzt8JuiXj+/yAvPgIySfM6VfPN8YRHOkrzt8JuiXj+/ygSXxYAIQDyGX7+/nsgCj4Rw92BPg/D3YEyCvAyDPDNGogjfuYgKAU+J8PdgX7mASAFPhLD3YE6CvBfFgAhAPIZNv4+E8PdgTpV881whCAFPg7D3YHNjInajoo+AjJJ8zpV883xhEc6SvO3wm6JeP7/IAU+EMPdgV8WACEA8hk6APB3PhTD3YGvzXCEKCI+BM1whCgbPgIySfOvzfGERzpK87fCbol4/v8gCj4Qw92BPh/D3YEyCvA+AzJJ8z4EzfGERzpK87fCbol4/v8gBT4Pw92BMhLwXxYAIYDzGcteKEg6CvBPOhLwuSg+XyEA8hl+/oA4CP7+MATmfxjrOhLwXyGA8xnLZigNIYDyGctGIAU+IcPdgToK8F8hAPIZOhLw9oB3PiLD3YE+IMPdgT7+Mg3wPgoyDvDNb4i3wD4Mw92BIWDwBv4WCA7+7Xgv5h93I8sAFSDyyTo68LfIIWDwOjnwXxYAGTo68KbIOnhcMjvw9gHJzXiMOmDw5gEyNPA6YPDmHjJg8Dpn8OYdMmfwIWDwEWjwBggaphIjExD5IWDwEWjwBggOABovpiAyIxMMEPbNjozKq4w6PPD+DcqrjDp4XCE98Jb+gNoGjcOrjDp4XMYDMj3wOjzwMjfwGGtf7USjMjjwBgDLPygDBBj5eYeHgYBfFgAhWJMZfjI38CFo8FkWABk6OPC2dzo58LkgHjo68F86OPC7IBQ6eFwhO/CW/gEwCTp4XDI78MOrjHkyOfA6OPAyOvA6eFwyO/DGGTI98Do38DI88Do38P4wIAs6NPC3OjfwKAI+CMnXPl/XPgjXyTIg9MXV5f4gOAU+ATIs9Doi9LcgBjoLlB84WTog9P4IMAXNSYEYRv4NICA6KPS3KBo6iVz+AyATPgEyJfTNwY4+FTIk9K/Nto4YBDog9Nc6IPT+DSAXPv8yjFw6IvS3IAwhIfQ0fiEp9L7UGpDh0cE6IPTJKib0OiD0dyMiJvT+DSATISH0NH4hKfS+OAjNPI7NGpAY1zon9P751DyOGM0qJvQRAPW37VLIOolcRz4YkDIk9CEh9IbWFTgxKC9HPhYhKPSWuDgBeDIl9M3Bjjol9Ec6JPQhKPSQOAO+MAF+MiT0OohcRz4hkM22jj7/MoxcIQD17Vsm9LftUhkoEH7l/ggwBc1JgRgB1+EjGOYhAPUiJvSvMiH0yfU+Ftc6JPTX8dfJOij0Tzol9IH+FjAzR8XNMY/lec0xj+vhBgjF5dUBIADtsNHhJBTBEPHBxXjNP4/lec0/j+vhASAA7bDBDBjFef4W0MXNMY8GCMXlVF0TNgABHwDtsOEkwRDvwcV5zT+POo1cd1RdEwEfAO2wwQwYz2/mGPZAZ33mBw8PD2/JbyYAKSkpKSl8xlhnySEAAM3EiTgTKiCUfLUoDDoA8F8WABkZfiNmb+1bKvS37VIZyCIq9Hy1IAkyKPQ+FTIp9Mnlze+AzTyOOiz0t8QakM1rDT4CzQEW4X4yL/RHPiCQyz8yLvQjfjIo9Ec+FZAyKfQjrzIt9OU6LfTNMY/N9Y8GCMXVzf+P0RTBEPbNCJAg5eU6LfTNP4/N9Y/N/4/NCJAg7joo9DIk9K8yMPAyIfQyLPTDto46LvSFX1TB4cXJOi/0TwYA7bDJOi30PDIt9Ec6KPS4wK8yLfTJPgEyIvQ+L81vkM1PkK8yLPQ6iVxHPhiQMiT0r822jgYfPiDF18EQ+a/Nto6vMiL0PDIh9Mk+ATIj9M1okCD7zWiQKPvNaJAg+68yI/TJr9v+L+YfyYdfFgAqCJQZfiNmbwanfqjI5cX+CDAFzUmBGAHXweF4xjtHIxjorzIJ8M2Vjc2rjP4NKD7+CCgi/iA48f57MO1POgnw/hww5V8WACEA8RlxPDIJ8HnNlI0Y0zoJ8LcozT0yCfA+INc+CNc+CNfNlY0YuzoJ8F8WACEA8Rk2AD4g1z4NzZyNya8yBPAqBpR+t8hHOgPwuCAd5SMRIPF+7lVPGrkgDyMTEPTBfjIE8CN+MgXwyeF+XxYAGSMjIxjPISDxw9SBrzIB8DIH8DII8D7/MgLwIUDzBgh3IxD8rzJI8zoH8F8WACEA8Rl+t8pKkv4gIAYhB/A0GOcRIPEGANU6B/BfFgAhAPEZ0X63KBT+ICgQT3j+DzAEeRITBCEH8DQY3HgyA/CvEiEI8DTN9pA6BPC3IA0+Ac3dgc0ukT4Cw92B/gEgEDoB8LfCUJE6BfAyAfDDUJH+AiAROgLw/v/CUJE6BfAyAvDDUJH+AyAaOgXwt8pQkTpA8yFC86Y8ylCRPgQySPPDUJH+BCAkOkjzXxYAIUDzGX7+/yAHOgXwd8NQkSN+/v/CUJE6BfB3w1CR/gXCUJE6SPNfFgAhQvMZfv7/IAc6BfB3w1CRI37+/8JQkToF8HfDUJE6CPC3yDoB8LcgDToC8P7/yv2SPgIyAfA6AfD+CMpziSEA8REA9AEdAO2wzX6EPgcySfOvzeSEMkDwPgTN5IQyQfDNrYSvzXCEPgAgAj4EMlXzzWSGwDoB8P4ByjeJ/gLKApP+A8r0iv4Eyn2L/gXKZIz+Bsq9i/4HIAU+KMPdgf4JIAU+KcPdgTpV881whCgdPgcySfM6VfPN8YRHOkrzt8JuiXj+/yAFPg/D3YE+BsPdgT4Aw92BOgLw/v8gBT4Dw92BMhnwzbqDOkbwtyAFPgTD3YH+ASgPKknwfLUgBT4Zw92Bw8GBOkfwMgDwzXeCPv4yAfA6APAyQPA+/zJB8D4BMlDwzWSGrzJQ8MkBenhjdmFzZGZncXdlcnQxMjM0NTA5ODc2cG9pdXkNbGtqaCACbW5iIBA4BDxEPAAgEDhEeEA8AAgQOER4QDwAIBAAMBAQOAAgEDhEREQ4ACAQRERERDwAIDxCQn5CQgAgfkB8QEB+AAh+QHxAQH4AIDgQEBAQOAAgPEJCQkI8ACBCQkJCQjwA';
const ZX_INDIRIZZO_CODICE = 0x8000, ZX_INDIRIZZO_DATI = 0x9400, ZX_FINE_RAM = 0xF000;
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
  const { dati, avvisi } = compilaDatiRetro(core, { opzioni, immagine: immagini && (i => immagini[i] ? zxImmagine(immagini[i]) : null), base: ZX_INDIRIZZO_DATI, fineRam: ZX_FINE_RAM, testo: zxTesto, lettera: ch => ch.charCodeAt(0) });
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
