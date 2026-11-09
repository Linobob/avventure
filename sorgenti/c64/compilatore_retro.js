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
  const aStanze = base + 38, aUscite = aStanze + 2 * n, aVocab = aUscite + 8 * n, aMsgTab = aVocab + vocab.length;
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
  // oggetti (opz.immagineOgg(i)): tabella di 2 byte per oggetto più l'elenco dei comandi che mostrano l'immagine [n][id...]
  let aImg = 0, aImgO = 0, aVerbiImg = 0;
  const scritte = new Map(), registra = b => { if (!b) return 0; const k = b.join(','); if (!scritte.has(k)) scritte.set(k, piazza(b)); return scritte.get(k); };
  const tabella = ptr => piazza(ptr.flatMap(p => [p & 255, p >> 8]));
  const figure = opz.immagine ? stanze.map((s, i) => opz.immagine(i)) : [];
  if (figure.some(Boolean)) aImg = tabella(figure.map(registra));
  const figureO = opz.immagineOgg ? ogg.map((o, i) => opz.immagineOgg(i)) : [];
  if (figureO.some(Boolean)) {
    aImgO = tabella(figureO.map(registra));
    const vi = verbiConImmagine(core).filter(k => k in idVerbo).map(k => idVerbo[k]);
    aVerbiImg = piazza([vi.length, ...vi]);
  }
  const nVar = (core.variabili || []).length + nVarNascoste;
  if (nVar > 64) throw new Error('Troppe variabili per i sistemi retro (' + nVar + ', compresi gli eventi «solo la prima volta»): il massimo è 64.');
  const aVar = nVar ? piazza([...(core.variabili || []).map(v => Math.min(v.iniziale || 0, v.massimo !== undefined ? v.massimo : 255)), ...Array(nVarNascoste).fill(0)]) : 0;

  // scrittura
  const dati = [];
  const w16 = v => { dati.push(v & 255, v >> 8 & 255); };
  dati.push(indice(core.inizio), n); w16(aStanze); w16(aUscite); w16(aVocab); w16(aMsgTab); dati.push(ogg.length, (opz.opzioni && opz.opzioni.righe ? 0 : 1) | (opz.opzioni && opz.opzioni.attesa === false ? 0 : 2)); w16(aOgg); w16(aRegole); w16(aCond); w16(aDir); dati.push(dirKeys.length, 0); w16(aFr); w16(aVar); dati.push(nVar, 0); w16(aParO); w16(aBuie); w16(aImg); w16(aImgO); w16(aVerbiImg);
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
  const { dati, avvisi, base } = compilaDatiRetro(core, { opzioni, immagine: immagini && (i => immagini[i] ? c64Immagine(immagini[i]) : null),
    immagineOgg: immagini && immagini.oggetti && (i => immagini.oggetti[i] ? c64Immagine(immagini.oggetti[i]) : null), base: C64_INDIRIZZO_DATI, fineRam: C64_FINE_RAM, testo: c64Testo, lettera: ch => /[a-z]/.test(ch) ? ch.charCodeAt(0) - 32 : ch.charCodeAt(0) });
  // programma: avvio BASIC "10 SYS 2061", interprete, riempimento, dati
  const codice = Uint8Array.from(atob(CODICE_C64_B64), ch => ch.charCodeAt(0));
  const stub = [0x0B, 0x08, 0x0A, 0x00, 0x9E, 0x32, 0x30, 0x36, 0x31, 0x00, 0x00, 0x00];
  // programma: avvio, interprete, font a $2000, dati a $2400 (tutto contiguo dal $0801)
  const prg = new Uint8Array(2 + (base - 0x0801) + dati.length);
  prg.set([0x01, 0x08], 0); prg.set(stub, 2); prg.set(codice, 2 + stub.length);
  prg.set(Uint8Array.from(atob(FONT_C64_B64), ch => ch.charCodeAt(0)), 2 + C64_INDIRIZZO_FONT - 0x0801);
  prg.set(dati, 2 + (base - 0x0801));
  return { prg, avvisi, memoria: base + dati.length - 0x0801 };
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
  const { dati, avvisi } = compilaDatiRetro(core, { opzioni, immagine: immagini && (i => immagini[i] ? zxImmagine(immagini[i]) : null),
    immagineOgg: immagini && immagini.oggetti && (i => immagini.oggetti[i] ? zxImmagine(immagini.oggetti[i]) : null), base: ZX_INDIRIZZO_DATI, fineRam: ZX_FINE_RAM, testo: zxTesto, lettera: ch => ch.charCodeAt(0) });
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
