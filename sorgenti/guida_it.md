## inizio | Come è fatta l'app

L'app serve a scrivere un'avventura testuale e a trasformarla in un gioco per il Web, il Commodore 64 e lo ZX Spectrum. Tutto quello che scrivi finisce in un unico file di dati, il **core**: le stanze, gli oggetti, le parole che il gioco capisce e le regole. Il core è uno solo per tutte le lingue e tutte le piattaforme.

In alto ci sono i bottoni **↶** (annulla) e **↷** (rifai), **?** che apre questa guida alla sezione della scheda in cui ti trovi, **IT/EN** per la lingua dell'app e **◐** per il tema chiaro o scuro. Sotto ci sono le schede, nell'ordine in cui di solito si lavora:

| Scheda | A che cosa serve |
| --- | --- |
| Stanze | Luoghi, descrizioni, uscite, titolo e introduzione del gioco |
| Mappa | Disegno delle stanze e dei collegamenti |
| Oggetti | Cose, contenitori, personaggi, argomenti |
| Parole | Comandi, direzioni, parole di collegamento, testi delle risposte |
| Regole | Che cosa succede quando il giocatore fa qualcosa, modelli pronti, eventi, variabili |
| Soluzione | I passi per vincere e la verifica automatica |
| Lingue | Lingua base e traduzioni |
| Controlli | Errori, avvisi e memoria usata |
| Prova | Giocare subito, dentro l'app |
| Compila | Il gioco finito per Web, C64 e Spectrum |
| Core | Progetti, file .json, il core scritto per intero |
| Guida | Questa guida |

**Il primo giro consigliato:** apri Prova e gioca l'esempio «La casa vuota» per qualche minuto. Poi guarda le schede Stanze, Oggetti e Regole: ogni cosa che hai visto in gioco ha lì la sua scheda. Infine crea un progetto tuo (sezione seguente).

## core | Progetti, salvataggio e Annulla

Ogni avventura è un progetto a sé, salvato da solo in questo browser a ogni modifica. I progetti si gestiscono nella scheda **Core**, in alto, sotto «I tuoi progetti».

- **Nuovo progetto vuoto**: una stanza sola e il vocabolario di base in italiano.
- **Nuovo progetto vuoto in inglese**: lo stesso, con parole e risposte in inglese.
- **Nuovo dall'esempio**: una copia di «La casa vuota» da smontare e modificare.
- **Duplica quello aperto**: una copia per provare una variante senza rischi.
- Ogni progetto dell'elenco ha **Apri** ed **Elimina** (con conferma).

Il nome del progetto è il titolo del gioco. Lo cambi nella scheda **Stanze**, nel riquadro «Titolo e introduzione» in cima, dove scrivi anche il testo che compare una volta all'inizio della partita.

**Annulla e Rifai.** I bottoni ↶ e ↷ in alto annullano e rifanno le modifiche del progetto aperto, una alla volta. Ogni progetto ha la sua storia.

**Copie di sicurezza.** I dati stanno solo nel browser: se cancelli i dati del sito o cambi telefono, spariscono. Nella scheda Core usa ogni tanto **Salva in un file (.json)**. Con **Apri da un file…** riprendi una copia; l'app chiede conferma prima di sostituire il core aperto, e «Torna al core di prima» annulla la sostituzione.

## stanze | Stanze e mappa

Una stanza ha un nome, una descrizione e le uscite. Tocca **+ Nuova stanza** in fondo alla scheda Stanze, poi apri la sua scheda per scrivere.

**Uscite.** Con **+ Aggiungi uscita** scegli la direzione e la stanza di arrivo. Subito sotto compare **Crea uscita nella stanza collegata**: premilo quando direzione e stanza sono quelle giuste, e l'app crea anche l'uscita di ritorno (nord ↔ sud, su ↔ giù). Se il ritorno c'è già, vedi un segno ✓; se quella direzione nell'altra stanza porta altrove, l'app non la tocca. Il bottone ✕ toglie l'uscita.

**Uscite con condizioni.** Ogni uscita ha un riquadro «Uscita libera». Con **Rendi l'uscita condizionata** diventa un passaggio che si usa solo quando tutte le condizioni sono vere, per esempio «la porta è aperta» o «la lanterna è accesa». Puoi poi:

- scrivere la frase da mostrare se il giocatore prova a passare («Se è bloccata, dì»);
- tenerla **nascosta** finché le condizioni non sono vere, così non compare tra le uscite;
- aggiungere una frase alla descrizione quando l'uscita diventa disponibile, per esempio «Noti un passaggio dietro gli scaffali».

**Frammenti della descrizione.** Pezzi di testo che si aggiungono alla descrizione della stanza solo quando valgono le loro condizioni. Servono per i cambiamenti: «Sul tavolo spicca una chiave» finché la chiave è lì.

**Stanza buia.** Con la casella «Stanza buia» la stanza si vede solo se c'è una luce accesa nella stanza o in mano al giocatore. Senza luce il giocatore legge «È buio pesto», non vede gli oggetti e non può prenderli, ma può muoversi. La luce è un oggetto con «Fa luce quando è acceso» (sezione Oggetti).

**Immagine.** Con **+ Carica immagine** dai alla stanza un'immagine, anche piccola: il gioco Web la mostra dentro il testo, quando la stanza viene descritta: sopra il testo oppure a lato, con il testo che le scorre attorno; scegli anche la larghezza. Per C64 e Spectrum scegli quante colonne e righe occupa, il modo e il dithering, e vedi lo schermo come apparirà e quanta memoria serve. Su C64 e Spectrum l'immagine sta in alto e il testo scorre sotto (sul C64 separato da una riga nera); quando l'immagine cambia lo schermo si pulisce, e se c'è testo nuovo da leggere prima aspetta un tasto. Più alta è l'immagine, meno righe restano al testo. Salvando il progetto in un file le immagini vengono con lui.

**Stanza iniziale.** Una stanza ha il segno «inizio»: è quella da cui parte il gioco. Si cambia con **Fai partire il gioco da qui**, e la stanza iniziale non si può eliminare.

**Mappa.** La scheda Mappa disegna le stanze e i collegamenti. Una linea continua è un passaggio libero; una tratteggiata è un'uscita con condizioni, bloccata o nascosta; una freccia indica un passaggio in una sola direzione. Le stanze più in alto o più in basso (su e giù) sono in livelli a parte. Tocca una stanza per aprirla.

## oggetti | Oggetti

Un oggetto è qualunque cosa il giocatore possa nominare: una chiave, una porta, un tavolo, una persona, perfino un argomento di cui parlare. Si crea con **+ Nuovo oggetto** nella scheda Oggetti.

**I campi di base**

- **Nome**: la parola che scrive il giocatore, per esempio «chiave». **Altri nomi**: sinonimi separati da virgola.
- **Aggettivi**: servono a distinguere due oggetti con lo stesso nome, «chiave arrugginita» e «chiave dorata». Se il giocatore scrive solo «chiave» e ce ne sono due, il gioco chiede «Quale intendi?».
- **Come appare nell'elenco**: il testo in «Qui vedi: …», con l'articolo, per esempio «una chiave arrugginita».
- **Descrizione**: quello che il giocatore legge con «guarda chiave».
- **Dove si trova all'inizio**: una stanza, «con te», oppure dentro un contenitore.
- **Si può prendere**: senza questa casella l'oggetto resta dov'è (un tavolo, una porta).
- **Mostralo nell'elenco «Qui vedi»**: toglila quando l'oggetto è già nominato nella descrizione della stanza. Ricompare nell'elenco quando il giocatore lo sposta.

**Se cambia stato.** Un oggetto può essere aperto o chiuso, acceso o spento: lo cambiano le regole. Per ogni stato puoi dare un'etichetta e una descrizione diverse, per esempio «una porta aperta», «una lanterna accesa».

**Immagine.** Un oggetto o un personaggio può avere un'immagine, come le stanze. Nel gioco Web compare prima della risposta quando il giocatore usa sull'oggetto uno dei comandi che mostrano le immagini: di serie solo «guarda»; gli altri (per esempio «parla») si scelgono nella scheda Parole, sezione Comandi. Sul C64 l'immagine dell'oggetto prende il posto di quella della stanza in alto, finché la stanza non viene descritta di nuovo (per esempio con «guarda»); un oggetto senza immagine lascia lo schermo com'è. Per ora le immagini degli oggetti non ci sono sullo Spectrum.

**I tipi speciali**

| Tipo | Che cosa fa |
| --- | --- |
| Contenitore | Ci si mettono dentro altri oggetti («metti chiave nella scatola»). Se «si apre e si chiude», il contenuto si vede solo da aperto. |
| Personaggio | Compare a parte («Qui c'è un vecchio giardiniere») e non si può prendere. Gli si parla, gli si danno oggetti, si chiede di un argomento. |
| Argomento | Una cosa di cui si parla anche se non è lì («chiedi della casa»). Non sta in nessuna stanza e non si vede. |
| Fa luce | Con «Fa luce quando è acceso» l'oggetto illumina le stanze buie, se è acceso e a portata. |
| Tutto | La parola speciale di «prendi tutto» e «lascia tutto». C'è già nei progetti nuovi: lasciala com'è. |

Quando servono parole che mancano nel vocabolario («metti», «in», «al», «della»), la scheda dell'oggetto lo dice e offre **+ Aggiungile**.

## parole | Parole e testi delle risposte

La scheda Parole dice quali parole il gioco capisce e con quali frasi risponde. Ogni voce è un elenco di parole separate da virgola.

**Comandi.** I comandi segnati «di base» sono fissi nel motore: guarda, vai, prendi, lascia, inventario, metti, aspetta, ripeti, aiuto. Puoi aggiungere parole a ciascuno («prendi, raccogli, afferra»), ma non toglierli. I comandi nuovi («apri», «usa», «parla»…) si aggiungono in fondo all'elenco e funzionano solo se li colleghi a una regola. Senza regola rispondono «Non succede niente».

Se il progetto è vecchio e mancano «aspetta», «ripeti», «aiuto» o la parola «tutto», in cima ai comandi compare un riquadro con **+ Aggiungili**.

**Direzioni.** Per ogni direzione le parole del giocatore («nord, n») e come si scrive nell'elenco delle uscite («giù» con l'accento).

**Parole ignorate e di collegamento.**

- **Parole ignorate**: articoli e parole di riempimento («il, la, un, verso»). Il gioco le salta.
- **Parole che uniscono due oggetti**: «con, in, nella, a, al, di, della». Separano il primo oggetto dal secondo in «apri porta con chiave», «dai mela al giardiniere», «chiedi della casa».

**Testi delle risposte.** Le frasi che il gioco usa da solo: «Non capisco.», «Preso.», «Qui vedi: {0}.», «È buio pesto», il testo di «aiuto». Dove c'è **{0}**, il gioco lo sostituisce con un nome o un elenco: lascialo nella frase. Un testo che non tocchi segue la lingua base del progetto.

## regole | Regole e modelli

Una regola dice che cosa succede quando il giocatore scrive un certo comando. È il cuore del gioco: porte che si aprono, lanterne che si accendono, personaggi che rispondono, il finale.

**Le quattro parti di una regola**

1. **Quando il giocatore scrive**: il comando, l'oggetto e, se serve, un secondo oggetto («apri porta con chiave»). Lasciare l'oggetto su «(qualsiasi)» vale per tutti.
2. **Solo se**: le condizioni, che devono essere tutte vere. Per esempio «la chiave: ce l'hai con te», «sei nella stanza Cucina», «la variabile tentativi è almeno 2». Senza condizioni la regola vale sempre.
3. **Allora succede**: le azioni, in ordine. Dire un testo, spostare un oggetto (in una stanza, con il giocatore, o fuori dal gioco), aprire, chiudere, accendere, spegnere, descrivere di nuovo la stanza, cambiare una variabile, finire il gioco.
4. **Altrimenti**: una frase facoltativa per quando il comando combacia ma le condizioni non sono vere («Prima devi prendere la chiave»).

**L'ordine conta.** Il gioco prova le regole dall'alto in basso e usa la prima che combacia. Se le condizioni non sono vere e la regola non ha «Altrimenti», passa alla successiva. Quindi le regole più specifiche vanno sopra quelle generiche. Per spostare una regola usa il menu **Sposta in…**, che elenca tutte le posizioni («Prima della 5: parla giardiniere»); ↑ Su e ↓ Giù spostano di un posto. Il pannello Controlli avvisa quando una regola non può mai scattare.

**I modelli.** Il riquadro **Nuova regola da modello** crea in un colpo le regole per le situazioni comuni: scegli il modello, compila pochi campi, guarda l'anteprima e premi Crea. Il risultato sono regole normali, da ritoccare come le altre. Se ci sono già regole per la stessa frase, quelle nuove vanno subito prima, così scattano davvero.

| Modello | Esempio |
| --- | --- |
| Aprire o sbloccare con un altro oggetto | La porta e la chiave |
| Accendere e spegnere | La lanterna, con la stanza descritta di nuovo |
| Contenitore che si apre e si chiude | La cassetta degli attrezzi |
| Parlare con un personaggio | Risposte diverse la prima, la seconda e dalla terza volta |
| Dare un oggetto a un personaggio | La mela al giardiniere, che ti dà qualcosa in cambio |
| Chiedere a un personaggio di un argomento | «chiedi della casa» |
| Un personaggio che blocca un'uscita | La guardia che si sposta quando le parli o le dai qualcosa |
| Mangiare, bere o consumare | La mela che sparisce |
| Un oggetto che non si può prendere | «È troppo pesante» |
| Usare un oggetto | Con un altro oggetto, solo in una stanza, con un risultato a scelta |
| Combinare due oggetti | «combina corda con gancio»: i due spariscono e ne nasce uno nuovo (che parte «fuori dal gioco») |
| Il gioco finisce quando… | Lasciare la moneta in cucina |
| Una risposta particolare a un comando | Una frase tua per «ascolta» o «salta» |

## variabili | Variabili ed eventi d'ingresso

Stanno nella scheda Regole: le variabili nel riquadro in cima, gli eventi d'ingresso sotto l'elenco delle regole.

**Variabili.** Una variabile è un numero da 0 a 255 che il gioco ricorda: i tentativi fatti, i punti, quante volte hai parlato con qualcuno. Ha un nome, un valore iniziale e un valore massimo. Le regole la cambiano con le azioni «imposta», «aumenta» e «diminuisci», e la controllano con le condizioni «vale», «non vale», «è almeno», «è al massimo». Nell'esempio, la porta chiusa conta i tentativi e dopo due dà un suggerimento. Per eliminare una variabile togli prima le condizioni e le azioni che la usano.

**Eventi d'ingresso.** Un evento è una regola che scatta da sola quando il giocatore entra in una stanza, subito dopo la descrizione. Si sceglie la stanza (o «ogni stanza»), se vale **solo la prima volta**, le condizioni e le azioni. Servono per le scene: un brivido scendendo in cantina, un personaggio che ti saluta, una trappola. Anche gli eventi hanno «Sposta in…», perché scattano nell'ordine dell'elenco.

## soluzione | Soluzione e verifica

La scheda Soluzione contiene i passi per vincere, ad alto livello: non i comandi esatti, ma le cose da ottenere nell'ordine. La soluzione resta nel core e non finisce mai nel gioco compilato.

**I tipi di passo:** Prendi un oggetto · Raggiungi una stanza · Porta un oggetto in una stanza · Ottieni uno stato («la lanterna è accesa») · Una variabile arriva a un valore · Fine del gioco. Ogni passo può avere una nota («Nel capanno, dentro la cassetta»). I passi si aggiungono con **+ Aggiungi passo** e si riordinano con «Sposta in…».

**Verifica la soluzione.** L'app gioca tutte le partite possibili con lo stesso motore del gioco e risponde con:

- ✓ la soluzione funziona, con il percorso di comandi che la realizza («Mostra i comandi del percorso»); oppure ✗ quale passo non si raggiunge in nessun modo;
- il controllo dei **vicoli ciechi**: le situazioni da cui non si può più finire il gioco, per esempio un oggetto indispensabile consumato troppo presto;
- quante situazioni di gioco ha esplorato.

La verifica ha un limite di tempo e di situazioni (circa 60.000). Un gioco molto grande può superarlo: in quel caso l'app dice che il controllo non è completo. Ogni variabile che conta qualcosa moltiplica le situazioni possibili, quindi usale con misura.

## lingue | Lingue e traduzioni

Un solo core vale per tutte le lingue: stanze, oggetti, regole e soluzione restano gli stessi, e ogni lingua cambia solo testi e parole. Ogni gioco compilato ha una lingua sola, che scegli nelle schede Prova e Compila. Per ora le lingue del gioco sono italiano e inglese. (La lingua del gioco è indipendente da quella dell'app, che si cambia con IT/EN in alto.)

**Lingua base.** È la lingua in cui scrivi il core. Decide le risposte predefinite del gioco e la parola per ricominciare. Se la cambi, le risposte che non hai toccato passano alla nuova lingua e i tuoi testi restano come sono.

**Aggiungere una traduzione.** Con **+ Aggiungi la traduzione in…** compare l'elenco di tutti i testi del gioco, divisi per gruppo (titolo e introduzione, stanze, oggetti, regole, eventi, risposte), e del vocabolario. Puoi tradurre a mano campo per campo, oppure farti aiutare da un modello di linguaggio:

1. **Copia** la richiesta di traduzione (o salvala in un file) e incollala nella chat con il modello. Dentro ci sono già le istruzioni.
2. Il modello risponde con lo stesso testo, completato.
3. Incolla la risposta in **Risposta da importare**, controlla l'anteprima («Pronti da importare: …») e premi **Importa**. Annulla torna indietro.

**Tenere aggiornata la traduzione.** Se cambi un testo italiano dopo averlo tradotto, la sua traduzione diventa «da rivedere». Quando la traduzione va ancora bene, premi **La traduzione va ancora bene**. Con «Solo i testi da tradurre o da rivedere» vedi solo quello che manca. Il pannello Controlli dice la percentuale tradotta.

**Vocabolario tradotto.** Comandi, direzioni e parole degli oggetti hanno le loro parole in ogni lingua. **+ Completa con le parole suggerite** riempie quelle che l'app conosce già. Per i verbi con particella («pick up», «look at») scrivi solo il verbo: la particella è già una parola che il gioco salta o una direzione.

## controlli | Controlli

Raccoglie in un posto tutti i problemi del core, in tre livelli: **errori** che impediscono di giocare, **avvisi** su cose che probabilmente non volevi, **informazioni**. Esempi: stanze che non si raggiungono, oggetti che non si trovano mai, regole che non scattano mai, parole doppie, testi troppo lunghi per lo schermo dei computer d'epoca, traduzioni incomplete.

Ogni voce ha **Vai**, che apre il punto da correggere. Con «Solo errori e avvisi» nascondi le informazioni. In fondo c'è la **memoria** occupata sul C64 e sullo Spectrum, per ogni lingua.

## prova | Prova e Compila

**Prova.** Qui giochi subito con il core aperto, con lo stesso motore del gioco finale. Se c'è una traduzione, scegli la lingua in alto. Sotto il registro ci sono i comandi rapidi (le uscite, guarda, inventario), comodi sul telefono; se il gioco ha variabili, i loro valori sono mostrati sotto. Per ricominciare scrivi «ricomincia» a fine partita.

**Compila.** Trasforma il core in un gioco da distribuire, nella lingua scelta. La soluzione non viene mai inclusa.

| Piattaforma | Che cosa ottieni | Come si usa |
| --- | --- | --- |
| Web | Un solo file .html con motore e dati | Si apre in qualsiasi browser, anche senza connessione. C'è anche l'anteprima. Se il salvataggio non va, «Copia il codice» e incollalo in un file .html |
| Commodore 64 | Uno zip con il .prg | Si carica in un emulatore (VICE) o su MiSTer, poi RUN |
| ZX Spectrum | Uno zip con il .tap | Si carica in un emulatore o su MiSTer con LOAD "" |

Per ogni piattaforma l'app mostra la dimensione e quanta memoria resta libera.

**Opzioni per C64 e Spectrum.** Sopra le due piattaforme retro, il riquadro delle opzioni sceglie come scorre il testo: **a blocchi** (ogni risposta compare tutta insieme, con un solo scatto) oppure **una riga alla volta** (come il BASIC). In tutti e due i casi, se una risposta è più lunga dello schermo il gioco si ferma e aspetta un tasto. La spunta «Dopo l'introduzione aspetta un tasto» ferma il gioco dopo il titolo e l'introduzione, prima della prima stanza. La frase della pausa («[premi un tasto]») si cambia nella scheda Parole, tra i testi delle risposte. Le opzioni si salvano nel progetto.

**Core.** Oltre ai progetti, la scheda Core mostra il core completo in JSON. Le altre schede ne modificano ogni parte; qui lo puoi leggere, ritoccare a mano (per esempio per cambiare molte cose insieme) e premere **Applica**, che lo controlla. **Copia** lo copia negli appunti; **Ripristina l'esempio** rimette «La casa vuota» nel progetto aperto.

## giocatore | Che cosa può scrivere il giocatore

Il gioco capisce frasi brevi: un comando, un oggetto e, se serve, un secondo oggetto. Articoli e parole di riempimento vengono saltati, e maiuscole e accenti non contano.

| Il giocatore scrive | Che cosa succede |
| --- | --- |
| nord, n, vai a sud, su, giù | Si sposta nella direzione |
| guarda (l) | Descrive di nuovo la stanza |
| guarda chiave, esamina la chiave | Descrive l'oggetto |
| prendi chiave, lascia chiave | Prende o lascia un oggetto |
| prendi tutto, lascia tutto | Prende ogni oggetto della stanza, o lascia tutto quello che ha |
| inventario (i) | Elenca quello che ha con sé |
| metti chiave nella scatola | Mette un oggetto in un contenitore aperto |
| prendi chiave dorata, prendi la chiave di ferro | Gli aggettivi scelgono tra oggetti con lo stesso nome |
| apri porta con chiave | Comando con due oggetti (vale se c'è una regola) |
| dai mela al giardiniere, parla con il giardiniere | Personaggi (con le regole) |
| chiedi della casa, parla con anna della chiave | Argomenti di conversazione |
| aspetta (z) | «Il tempo passa.» |
| ripeti (r) | Rifà l'ultimo comando |
| aiuto | Mostra il testo di aiuto |
| ricomincia | A fine partita, ricomincia da capo |

Una parola che il gioco non conosce produce «Non conosco la parola «…»»: è il segnale per aggiungerla come sinonimo nella scheda Parole o Oggetti. In inglese valgono le stesse cose con le parole inglesi («take all», «again», «wait», «help»).

## consigli | Limiti e consigli

**Limiti di oggi**

- **Memoria:** circa 38 KB sul C64 e 28 KB sullo Spectrum per gioco, font e dati. Il pannello Controlli dice quanto ne usi. Le avventure grandi arriveranno con il caricamento da disco (.d64) e la compressione dei testi.
- **Riga di comando:** sullo Spectrum al massimo 28 caratteri; i comandi più lunghi vengono tagliati.
- **Variabili:** al massimo 64 sulle macchine retro, contando anche quelle che l'app usa per gli eventi «solo la prima volta».
- **Niente salvataggio della partita** per ora, ed eventi solo d'ingresso: non ci sono ancora eventi a tempo, personaggi che si muovono da soli o dialoghi a menu.
- **Lingue del gioco:** italiano e inglese; ogni gioco compilato ne ha una sola.

**Consigli**

1. Procedi a piccoli passi: una stanza, un oggetto, una regola, e subito una prova nella scheda Prova.
2. Dopo ogni enigma aggiorna la Soluzione e premi **Verifica**: trovi subito i vicoli ciechi.
3. Usa i **modelli** di regola invece di scrivere tutto a mano, poi ritocca i testi.
4. Dai a ogni oggetto qualche sinonimo e, quando due cose si chiamano uguale, un aggettivo.
5. Guarda il pannello **Controlli** prima di compilare.
6. Salva ogni tanto il core in un file .json dalla scheda Core: è la tua copia di sicurezza.
7. Prova il gioco compilato anche su C64 e Spectrum: gli a capo e le parole lunghe si vedono solo lì.
