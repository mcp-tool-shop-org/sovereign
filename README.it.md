<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**Il gioco da tavolo Hamilton System · adattamento per giocatore singolo / digitale**

*Finanziamento iniziale · Copri il debito. Costruisci la banca. Industrializza la Repubblica.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

> **Stato — v1.5.0 (beta).** La versione "che si fa sentire", basata sulla versione strategica v1.4. Cinque livelli sono presenti: **presenza degli avversari** (classifiche di influenza visibili + linee di postura per ogni avversario che eliminano i momenti di stallo nel gioco in solitario), **la spirale del credito** (la pressione per il successo si fa sentire, si accumula ed è *recuperabile* — una tassa per il servizio del debito, un'accelerazione segnalata verso il default, una previsione e una via d'uscita attraverso la riforma — e porta con sé la tesi civica: si percepisce *perché* il credito pubblico è importante), **effetti visivi e sonori** (numeri in transizione con asimmetria di guadagno/perdita, audio procedurale ZzFX in 13 tracce, coreografia delle azioni, impostazione di velocità cinematografica/normale/istantanea, piena accessibilità), **livello Chronicler B** (15 pop-up "Scopri di più", l'enciclopedia Chronicler's Ledger — 27 citazioni verificate più atti/eventi/livelli/visioni — e 10 suggerimenti), e **introduzione** (un tutorial Swift-Start con l'apertura "Dibattito sul finanziamento del 1790" + un'interfaccia che mostra tutto senza nascondere nulla). Due elementi di gioco impegnativi presenti nella v1.4.0 sono stati corretti (aste attivate da carte; acquisto con denaro insufficiente) e la fedeltà del salvataggio/caricamento/ripetizione è stata ripristinata (`SAVE_VERSION = v0.26-replay-fidelity-candidate`). La durata media del gioco è di **~22 turni (~66 mosse)**; la condizione finale attivata dal circuito rimane invariata. L'equilibrio misurato (CANONICO × 100): Tesoreria **48 %** / Mercante **34 %** / Produttore **18 %** — tutti e tre i profili vincono in modo significativo. **La v1.5.0 è una versione beta in attesa di un test completo con un giocatore reale** (la fase di giocabilità). Il gioco da tavolo stampabile rimane stabile alla v0.2. Consultare `CHANGELOG.md` per i dettagli completi e le avvertenze della versione beta.

---

## Cos'è

Sovereign è un **gioco da tavolo in stile Hamilton System Monopoly** sulla fondazione del credito pubblico statunitense, più un **adattamento per giocatore singolo / digitale** che esegue le stesse regole localmente in un browser contro due avversari deterministici programmati.

- **Gioco da tavolo** — edizione stampabile di 34 fogli. Tabellone con 40 caselle, 22 proprietà + 4 percorsi + 2 istituzioni, 8 sistemi di colori, 7 atti del Congresso in ordine storico fisso, 4 ruoli di giocatore, 3 tracce condivise (Credito pubblico · Resistenza pubblica · Capacità industriale), 12 + 12 carte evento. Due percorsi economici validi oltre alla Tesoreria: Mercante e Produttore. Equilibrio della v0.2, bloccato.
- **Modalità digitale** — singolo file HTML autonomo. Condizione finale basata su un circuito: il gioco termina quando un giocatore completa la sua quarta traversata della casella Tesoreria. Durata media del gioco **~22 turni (~66 mosse)**. Alla fine del gioco, il giocatore con la maggiore influenza vince, *non necessariamente quello che ha fatto il giro del tabellone per primo*. Livello di presenza degli avversari: classifiche di influenza visibili + linee di postura per ogni avversario. Livello di profondità strategica: tre azioni speciali bloccate per profilo, sei carte HAND con finestre temporali, azione di recupero della riforma, la spirale del credito a più fasi (Dubbio pubblico → Crisi → Panico → Default) con una tassa per il servizio del debito, un'accelerazione segnalata, una previsione e una via d'uscita attraverso la riforma. Livello di arco strategico: otto eventi dell'era federale che si attivano ogni turno a partire dal turno 8, tre Visioni di profilo con bonus di fine gioco. Livello di narrazione di Chronicler: 14 banner storici legati agli eventi più il livello informativo B (pop-up "Scopri di più", l'enciclopedia Chronicler's Ledger, suggerimenti), citazioni reali dai Federalist Papers e Founders Online, messaggio persistente con × per chiuderlo. Effetti visivi e sonori: numeri in transizione, audio procedurale ZzFX (13 tracce), impostazione di velocità cinematografica/normale/istantanea. RNG deterministico mulberry32, avversari AI programmati, salvataggio/caricamento con integrità hash, riproduzione con scrubber, strumento di simulazione batch controllato dal progettista.
- **Valori di riferimento per l'equilibrio** — circuito + profondità strategica + arco strategico + Chronicler + spirale del credito (v1.5.0 beta): Tesoreria **48 %** · Mercante **34 %** · Produttore **18 %** (CANONICO × 100, misurato rispetto al motore attivo tramite `test/measure-stats.mjs`). Tutti e tre i profili vincono in modo significativo, con la Tesoreria come profilo più forte, in linea con la tesi storica. Tutte e tre le Visioni di profilo (Architetto del credito federale / Sovrano del commercio / Fondatore industriale) sono raggiungibili e approssimativamente equilibrate — ciascuna si attiva in circa il 41-43 % delle partite. La meccanica sottostante della v0.18 (Crisi del credito, punteggio IP in contanti, Carta industriale, bonus per il completamento di set) è preservata byte per byte dall'arco di progettazione v0.3 → v0.10 → v0.18 guidato da oltre 1.000 partite di simulazione deterministiche.

---

## Avvio rapido

### Gioca nel tuo browser (nessuna installazione)

```bash
npx @mcptoolshop/sovereign
```

Il comando CLI apre il gioco nel tuo browser predefinito. Nessun programma di installazione, nessun server, nessuna connessione Internet richiesta.

Altre modalità:

```bash
npx @mcptoolshop/sovereign --print    # Open the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # Open the audience-routed landing page
npx @mcptoolshop/sovereign --path     # Print the playable HTML file path
npx @mcptoolshop/sovereign --help     # All flags
```

### Gioca online

Apri la pagina di destinazione ospitata all'indirizzo **<https://mcp-tool-shop-org.github.io/sovereign/>** e fai clic per accedere al gioco digitale.

### Stampa e gioca

Il gioco da tavolo stampabile è un documento HTML autonomo di 34 fogli. Apri `release/board-game/sovereign-board-game.html` dal pacchetto (o da un download), quindi `Cmd/Ctrl-P → Salva come PDF → US Letter → Scala 100 %`. Ritaglia e gioca.

### Pacchetto di rilascio offline

Ogni versione pubblicata associa un pacchetto `sovereign-vX.Y.Z-release.zip` alla relativa pagina di rilascio su GitHub. Scaricalo, estrailo e apri `00-START-HERE.html` per accedere al punto di ingresso specifico per il tipo di utente. Tutto funziona offline.

---

## Motivazione

La tesi di Sovereign è che il **credito pubblico + le finanze federali** fossero la principale leva economica di Alexander Hamilton, ma un sistema di gioco alla Hamilton deve consentire anche al **commercio** e all'**industria** di essere percorsi validi per la vittoria. L'arco di bilanciamento (v0.2 → v0.10) è stato un processo di nove versioni, basato su dati concreti, per mantenere il Tesoro come profilo più forte (in linea con la storia) senza ridurre il gioco a una singola strategia.

Consulta [`CHANGELOG.md`](./CHANGELOG.md) per la cronologia completa delle modifiche apportate a ogni versione.

---

## Determinismo

Lo stesso seme + le stesse decisioni umane = registro di dati identico tra le diverse esecuzioni, browser e sistemi operativi.

- Unico generatore di numeri casuali: `mulberry32(state.rngSeed)`.
- Decisioni dell'avversario: funzioni pure dello stato visibile, con ogni decisione registrata nel registro dei dati insieme alla regola che l'ha innescata.
- Il salvataggio/caricamento preserva un hash dello stato.
- La riproduzione ricostruisce a partire da `initialState(seed) + decisionLog`.
- Testato su oltre 1.000 partite deterministiche durante l'arco di bilanciamento v0.2 → v0.10.

---

## Modello di minaccia e gestione dei dati

Sovereign è un gioco da tavolo autonomo basato su browser. La CLI apre un file HTML locale nel browser predefinito. Non ci sono server, chiamate di rete, account o sincronizzazione cloud.

- **Dati utilizzati:** i file HTML inclusi in `release/` (solo in lettura) e `localStorage` sotto la chiave `sovereign.autosave` (solo lo stato di salvataggio del gioco).
- **Dati NON utilizzati:** nessun accesso al file system al di fuori della directory del pacchetto, nessuna richiesta di rete di alcun tipo, nessun telemetria, nessuna analisi, nessuna credenziale.
- **Autorizzazioni richieste:** possibilità di avviare il browser predefinito del sistema operativo, possibilità di leggere i propri file del pacchetto, `localStorage` del browser (opzionale).
- **Nessuna telemetria, mai.** La funzione "telemetria" del simulatore si riferisce a report di analisi del gioco locali derivati dal registro dei dati nel browser; questi non vengono mai inviati al di fuori del dispositivo.

Consulta [`SECURITY.md`](./SECURITY.md) per la segnalazione di vulnerabilità e l'informativa completa sulla sicurezza.

---

## Funzionalità

- **Partita con vittoria basata esclusivamente sul circuito** contro due avversari con comportamenti predefiniti (Tesoro/Finanze e Commercio/Infrastrutture, di default; Manifattura/Industria disponibile per partite multiple). La partita termina quando un giocatore completa la sua quarta "attraversata" del Tesoro. Durata media: circa 22 turni / circa 66 azioni. Vince chi ha la maggiore influenza al momento del calcolo finale.
- **Presenza dell'avversario (livello v1.5)**: visualizzazione della classifica dell'influenza e delle linee che indicano l'atteggiamento di ciascun avversario rispetto alla *tua* posizione nella competizione ("Hamilton ha 3 punti di influenza in più e prende la Banca; il blocco del Tesoro si rafforza"). Elimina la sensazione di una partita solitaria; gli avversari si comportano come tali. Solo a scopo illustrativo: i dati non vengono mai scritti nel registro.
- **La spirale del credito (livello v1.5)**: il fallimento del credito pubblico ora ha un impatto, si aggrava e può essere recuperato. Un prelievo in contanti per il servizio del debito in caso di basso credito, un'accelerazione che preannuncia il default, una previsione della direzione che prenderà la situazione e l'azione di riforma come una vera e propria ancora di salvezza. Trasmette direttamente la tesi civica: si percepisce *perché* il credito pubblico federale fosse importante. Integra la gerarchia della versione 0.18 (Dubbio pubblico → Crisi → Panico → Default) senza modificarne le soglie; applicata all'interno di `reduce()` per garantire la possibilità di rigiocare.
- **Effetti visivi e sonori (livello v1.5)**: animazioni fluide con asimmetria tra guadagno e perdita, audio procedurale ZzFX con 13 effetti sonori, coreografia delle azioni e impostazione della velocità (Cinematografica / Normale / Veloce-istantanea: Veloce-istantanea salta tutte le animazioni per una riproduzione rapida e per facilitare l'accessibilità). Supporto completo per la tastiera / animazioni ridotte / lettore di schermo.
- **Profondità strategica (livello v1.2)**: tre azioni speciali con profili predefiniti (Emissione di obbligazioni federali / Negoziazione di contratti di percorso / Creazione di un laboratorio), 6 carte HAND con finestre temporali (limite di 2 carte in mano), azione di recupero tramite la riforma.
- **Arco strategico (livello v1.3)**: 8 eventi dell'era federale che si attivano a ogni turno a partire dal turno 8 (5 eventi a scelta + 3 eventi automatici), 3 Visioni di profilo (Architetto del credito federale / Sovrano del commercio / Fondatore industriale) con un bonus di +3 punti di influenza alla fine della partita. Tutte e tre le Visioni sono raggiungibili (circa il 41-43% delle partite ciascuna, valore CANONICO × 100).
- **Il Cronista (livello v1.4)**: voce storica narrante in terza persona. 14 banner legati agli eventi (Atti × 7 / Apertura dell'era federale / Dubbio / Crisi / Panico / Default / Ribellione / Riforma / Visione / Calcolo finale). Tutte le citazioni sono state verificate rispetto alle fonti founders.archives.gov, Wikisource e Library of Congress. Gli Atti falliti vengono narrati come controfattuali rispetto alla storia reale ("Nella nostra storia, l'Atto di finanziamento di Hamilton è stato approvato con 32 voti contro 29 nel luglio del 1790; nella tua Repubblica, la discriminazione contro i soldati ha ottenuto abbastanza voti per bloccare la proposta"). Un testo persistente con bordo colorato che può essere chiuso con ×; rispetta l'impostazione della narrazione (Attiva / Minima / Disattivata).
- **Cronista Livello B: il livello informativo (v1.5)**: 15 finestre pop-up "Scopri di più" sui meccanismi chiave, l'enciclopedia "Il registro del Cronista" (27 citazioni storiche verificate più Atti, eventi dell'era federale, livelli di credito e Visioni in un unico riferimento), e 10 suggerimenti nel glossario. Trasforma l'atmosfera del periodo in un vero e proprio livello storico consultabile.
- **Introduzione (livello v1.5)**: una guida "Dibattito sul finanziamento del 1790" che introduce un nuovo giocatore al ciclo di gioco principale, oltre a un sistema di suggerimenti che mostra il costo e le conseguenze di ogni azione prima che il giocatore la intraprenda.
- **IA deterministica**: ogni decisione dell'avversario è una funzione pura dello stato visibile con una motivazione registrata. Nessun LLM, nessuna magia opaca.
- **8 interfacce di gioco**: Tabellone, Pannello del Tesoro, Ispezione delle risorse, Visualizzazione degli eventi, Atti del Congresso, Tracce condivise, Registro dei turni / Registro, Rapporto finale.
- **Aste**: le risorse rifiutate vengono messe all'asta tra più giocatori con offerte predefinite in base al profilo.
- **Salvataggio / caricamento**: salvataggio automatico in `localStorage` a ogni turno, esportazione / importazione manuale in formato JSON, verifica dell'integrità dell'hash al caricamento, controllo della versione.
- **Rigiochabilità**: possibilità di ripercorrere completamente qualsiasi partita completata. Solo in lettura. Ricostruisce la partita a partire dal seme + registro delle decisioni con un indicatore di integrità verde.
- **Simulazione multipla**: esegui 10 / 50 / 100 partite deterministiche contro qualsiasi tripla di profili, esporta report in formato JSON + HTML per l'analisi dell'equilibrio.
- **Narrazione storica**: libreria con 25 voci derivate dal registro (40-60 parole di default, 150-200 parole di espansione, circa 300-500 parole di riepilogo finale della Repubblica). Non modifica mai lo stato del gioco.
- **Accessibilità**: navigazione completa tramite tastiera, indicatori di focus, etichette significative per i lettori di schermo, valori delle tracce leggibili come testo e non solo come indicatori, dimensione minima del corpo del testo di 14 pixel, rispetto delle impostazioni per ridurre le animazioni.

---

## Combinazione di profili (baseline di equilibrio v0.10)

| Profilo | Priorità delle risorse | Punto di forza | Punto debole |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Debito statale > Debito commerciale > Banca > Zecca | Aumento del credito pubblico | Nessun reddito derivante dalle infrastrutture |
| **Merchant / Infrastructure**  | Percorsi (tutti e 4) > Commercio > Miglioramenti > Entrate | Scala dei percorsi | Nessun punteggio per la capacità industriale |
| **Manufacturer / Industry**    | Manifattura > Industria strategica > Miglioramenti > Banca | Moltiplicatori di capacità | Inizio lento; riceve una Carta di fondazione iniziale |

Il quarto profilo del documento concettuale (Opportunista / Liquidità) è rimandato. Il set competitivo bloccato della versione 0.10 è composto da tre profili.

---

## Avvertenze note

- **La versione 1.5.0 è una versione beta in attesa di un test completo da parte di un giocatore umano.** Ogni livello è stato sottoposto a un controllo strutturale e riconvalidato rispetto al motore attivo tramite `test/measure-stats.mjs` e gli strumenti di determinismo e giocabilità; l'intero sistema è stato testato a livello di singoli elementi, ma non è ancora stato giocato completamente da un giocatore umano. Questo test completo è il requisito per la pubblicazione della versione definitiva. I dati riportati di seguito sono valori CANONICI × 100 rispetto al motore attivo; il gioco reale con giocatori umani potrà differire. Considerare questa versione come facoltativa fino a quando (o fino a quando una persona di fiducia) non l'avrà testata.
- **La pressione dovuta agli eventi negativi è percepibile e superabile, non più solo un elemento decorativo.** L'evento "Credit Crisis" si verifica ora in circa il **29%** delle partite ed è effettivamente superabile: delle partite in cui si verifica la crisi (Credit ≤ 4), circa il **41%** riesce a risalire a un livello di Credit stabile (≥ 7), e nessuna termina con il "Default". Il panico è raro (~1 / 100). Il "Default" e la "Ribellione" rimangono eventi rari con l'IA programmata della versione 0.18, che si riprende prima di crollare, ma entrambi sono pienamente raggiungibili da un giocatore umano che trascura il "Public Credit". La "Credit Spiral" rende la tendenza verso il "Default" visibile e percepibile, piuttosto che un cambiamento improvviso.
- **Gli avversari utilizzano i sistemi delle versioni 1.2–1.4; solo la matematica delle azioni principali è quella della versione 0.18.** Gli avversari controllati dal computer *utilizzano* le azioni speciali, la possibilità di "Reform", le scelte dell'era federale/della fase finale, i voti sulle azioni e la tempistica delle carte "HAND" – la precedente nota secondo cui "l'IA non si adatta" era troppo generica. Ciò che rimane della versione 0.18 è la valutazione del **nucleo delle azioni di acquisto/asta/potenziamento/voto**: scelgono in modo ottimale in base al loro profilo, ma non cercano ancora esplicitamente di "gareggiare per la Vision" come farebbe un giocatore umano. Le misurazioni CANONICHE × 100 riflettono questo comportamento programmato; il gioco umano divergerà.
- **L'innesco di un evento non equivale alla vittoria.** Il giocatore che completa il quarto circuito vince solo in termini di influenza in circa un terzo delle partite. Questo è intenzionale: la fase finale premia la profondità economica, non la velocità nel completare il percorso. La descrizione della fase finale rende esplicita questa distinzione.
- **La fase dell'era federale presenta una leggera pressione dovuta alle azioni.** Le azioni iniziali si verificano nei turni 1–7; il gioco medio dura circa 22 turni, quindi l'era federale si svolge con i propri eventi (che si verificano a ogni turno a partire dal turno 8) più la "Credit Spiral" e la "Vision race". Nella versione 1.3, la riduzione degli eventi dell'era federale a ogni turno ha ridotto i periodi vuoti di 4 turni a circa 2 / 100. Se questa fase continua a sembrare troppo breve durante il test, il prossimo passo sarà una riorganizzazione delle azioni, non un ritorno alle regole precedenti.
- **Il "Treasury/Finance" rimane intenzionalmente l'aspetto più forte** (48% delle vittorie), rientrando nell'intervallo previsto. Questo riflette la tesi storica: il credito pubblico e le finanze federali erano la leva economica dominante di Hamilton, senza ridurre il gioco a una singola strategia (Mercante 34%, Manifatturiero 18%).

---

## Sviluppo e contributo

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

Le versioni vengono pubblicate su npm tramite GitHub Actions (`release.yml`) al momento del push del tag `v*`, con attestazione di provenienza Sigstore. La fonte di verità è il ramo `main`.

---

## Licenza

MIT © mcp-tool-shop. Vedere [`LICENSE`](./LICENSE).

---

<div align="center">

Realizzato da <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
