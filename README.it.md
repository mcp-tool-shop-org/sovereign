<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**Il gioco da tavolo Hamilton System · adattamento per giocatore singolo / digitale**

*Finanziamento iniziale · Finanzia il debito. Costruisci la banca. Industrializza la Repubblica.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

> **Beta pubblica** — gioco gratuito disponibile nel tuo browser, senza necessità di installazione. È ben rifinito, ma ancora in fase di sviluppo; consulta [`CHANGELOG.md`](./CHANGELOG.md) per scoprire le novità e i problemi noti.

---

## Cos'è

Sovereign è un **gioco da tavolo in stile Hamilton System Monopoly** incentrato sulla fondazione del credito pubblico statunitense, oltre a un **adattamento per giocatore singolo / digitale** che utilizza le stesse regole in locale, in un browser, contro due avversari controllati da script deterministici.

- **Gioco da tavolo** — edizione stampabile di 34 fogli. Tabellone con 40 caselle, 22 proprietà + 4 percorsi + 2 istituzioni, 8 sistemi di colori, 7 atti del Congresso in ordine storico fisso, 4 ruoli giocatore, 3 tracciati condivisi (Credito pubblico · Resistenza pubblica · Capacità industriale), 12 + 12 carte evento. Due percorsi economici validi oltre al Tesoro: Mercante e Produttore. Bilanciamento v0.2, definitivo.
- **Modalità digitale** — singolo file HTML autonomo. Condizione di fine basata su circuiti: il gioco termina quando un giocatore completa la sua quarta traversata del Tesoro. Durata media del gioco: **~22 turni (~66 mosse)**. Alla fase di rendicontazione finale, il giocatore con la maggiore influenza vince, *non necessariamente quello che ha fatto il giro del tabellone per primo*. Livello di presenza degli avversari: posizioni di influenza visibili + linee di atteggiamento per ogni avversario. Livello di profondità strategica: tre azioni speciali con profili bloccati, sei carte HAND con finestre temporali, azione di recupero della riforma, la spirale del credito a più fasi (Dubbio pubblico → Crisi → Panico → Default) con una tassa sul servizio del debito, accelerazione segnalata, previsione e una linea di salvataggio della riforma. Livello di arco strategico: otto eventi dell'era federale che si attivano a ogni turno a partire dal turno 8, tre visioni di profilo con bonus di fine gioco. Livello di narrazione del cronista: 14 banner storici legati agli eventi più le informative di livello B (finestre pop-up "Scopri di più", l'enciclopedia "Il registro del cronista", suggerimenti), citazioni reali dei "Federalist Papers" e dei "Founders Online", messaggio persistente con × per chiuderlo. Elementi visivi e sonori: animazione dei numeri, audio procedurale ZzFX (13 effetti sonori), impostazione di velocità cinematografica / normale / veloce. RNG deterministico mulberry32, avversari controllati da script, salvataggio / caricamento con integrità hash, riproduzione, strumento di simulazione batch controllato dal progettista.
- **Tre percorsi reali per la vittoria** — Tesoro, Mercante e Produttore, ognuno dei quali porta a una vittoria significativa, con il Tesoro come percorso più forte, in linea con la storia: il credito pubblico e la finanza federale erano la principale leva economica di Hamilton. Ogni profilo ha uno stile di gioco diverso, con la sua azione speciale e una visione di profilo da perseguire.

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

Il gioco da tavolo stampabile è un documento HTML autonomo di 34 fogli. Apri `release/board-game/sovereign-board-game.html` dal pacchetto (o da un download), quindi `Cmd/Ctrl-P → Salva come PDF → US Letter → Scala 100%`. Ritaglia e gioca.

### Pacchetto di rilascio offline

Ogni rilascio con tag include un pacchetto `sovereign-vX.Y.Z-release.zip` nella sua pagina di rilascio su GitHub. Scaricalo, estrailo e apri `00-START-HERE.html` per accedere al punto di ingresso specifico per il pubblico. Tutto funziona offline.

---

## Perché esiste

La tesi di Sovereign è che **il credito pubblico + la finanza federale** erano la principale leva economica di Alexander Hamilton, ma un gioco in stile Hamilton System deve consentire anche al **commercio** e all'**industria** di essere percorsi validi per la vittoria. L'arco di bilanciamento (v0.2 → v0.10) è stato un processo di nove versioni, basato su prove, per mantenere il Tesoro come il profilo più forte (in linea con la storia) senza ridurre il design a un gioco con una sola strategia.

Consulta [`CHANGELOG.md`](./CHANGELOG.md) per l'evoluzione completa versione per versione.

---

## Determinismo

Lo stesso seme + le stesse decisioni umane = registro identico tra le diverse esecuzioni, browser e sistemi operativi.

- Unico RNG: `mulberry32(state.rngSeed)`.
- Decisioni degli avversari: funzioni pure dello stato visibile, con ogni decisione registrata nel registro insieme alla regola che l'ha attivata.
- Il salvataggio / caricamento preserva un hash dello stato.
- La riproduzione ricostruisce da `initialState(seed) + decisionLog`.
- Verificato in oltre 1.000 giochi deterministici durante l'arco di bilanciamento v0.2 → v0.10.

---

## Modello di minaccia e gestione dei dati

Sovereign è un gioco da tavolo autonomo basato su browser. Il comando CLI apre un file HTML locale nel tuo browser predefinito. Non ci sono server, chiamate di rete, account o sincronizzazione cloud.

- **Dati interessati:** i file HTML inclusi in `release/` (in sola lettura) e `localStorage` sotto la chiave `sovereign.autosave` (solo lo stato di salvataggio del gioco).
- **Dati NON interessati:** nessun accesso al file system al di fuori della directory del pacchetto, nessuna richiesta di rete di alcun tipo, nessun telemetria, nessuna analisi, nessuna credenziale.
- **Autorizzazioni richieste:** possibilità di avviare il browser predefinito del sistema operativo, possibilità di leggere i file del pacchetto, `localStorage` del browser (opzionale).
- **Nessuna telemetria, mai.** La funzione "telemetria" del simulatore si riferisce a report locali di analisi del gioco derivati dal registro nel browser; questi non lasciano mai il tuo dispositivo.

Consulta [`SECURITY.md`](./SECURITY.md) per la segnalazione di vulnerabilità e la politica di sicurezza completa.

---

## Funzionalità

- **Gioco in solitario con vittoria nel circuito** contro due avversari controllati da script (Tesoro/Finanza e Commercio/Infrastrutture per impostazione predefinita; Produttore/Industria disponibile per il gioco in batch). Il gioco termina quando un giocatore completa la sua quarta traversata di Treasury Opens. Il punteggio più alto all'ultimo calcolo vince.
- **Presenza dell'avversario (livello v1.5)**: posizioni di influenza visibili e linee di postura per ogni avversario che inquadrano la sua mossa rispetto alla *tua* posizione nella gara ("Hamilton — 3 punti di influenza di vantaggio — prende la Banca; il blocco del Tesoro si rafforza"). Elimina la sensazione di gioco in solitario parallelo; gli avversari si comportano come tali. Solo presentazione: non viene mai scritto nel registro hash.
- **La spirale del credito (livello v1.5)**: il fallimento del credito pubblico ora si fa sentire, si aggrava ed è recuperabile. Una tassa in contanti per il servizio del debito in caso di basso credito, un'accelerazione segnalata verso il default, una previsione di dove porterà la curva e l'azione di riforma come una vera e propria ancora di salvezza. Trasmette direttamente la tesi civica: si percepisce *perché* il credito pubblico federale era importante. Integra la gerarchia di fallimento esistente (Dubbio pubblico → Crisi → Panico → Default) e il salvataggio/la ripetizione rimangono completamente deterministici.
- **Effetti visivi e sonori (livello v1.5)**: animazione numerica con asimmetria di guadagno/perdita, audio procedurale ZzFX in 13 cue, coreografia delle azioni e impostazione della VELOCITÀ (Cinematografica / Normale / Veloce-istantanea: Veloce-istantanea salta tutte le animazioni per un gioco rapido e per l'accessibilità). Supporto completo per tastiera / movimento ridotto / lettore di schermo.
- **Profondità strategica (livello v1.2)**: tre azioni speciali con profilo bloccato (Emissione di obbligazioni federali / Negoziazione di un contratto di percorso / Creazione di un laboratorio), 6 carte HAND con finestre temporali (limite di 2 carte in mano), azione di recupero della riforma.
- **Arco strategico (livello v1.3)**: 8 eventi dell'era federale che si attivano ogni turno a partire dal turno 8+ (5 scelte + 3 automatici), 3 Visioni di profilo (Architetto del credito federale / Sovrano del commercio / Fondatore industriale) con un bonus di fine gioco. Tutte e tre le Visioni sono raggiungibili.
- **Il Cronista (livello v1.4)**: voce storica in terza persona. 14 banner legati agli eventi (Atti × 7 / Apertura dell'era federale / Dubbio / Crisi / Panico / Default / Ribellione / Riforma / Visione / Calcolo finale). Tutte le citazioni attribuite sono state verificate rispetto a founders.archives.gov, Wikisource e fonti della Biblioteca del Congresso. Gli Atti falliti vengono narrati come controfattuali rispetto alla storia reale ("Nella nostra storia, l'Atto di finanziamento di Hamilton è stato approvato con 32 voti contro 29 nel luglio del 1790; nella tua Repubblica, la discriminazione contro i soldati ha trovato abbastanza voti per sbarrare la strada"). Toast persistente con bordo colorato con × per chiudere; rispetta l'impostazione Narrazione On/Minima/Off.
- **Cronista Livello B: il livello informativo (v1.5)**: 15 popover *Scopri di più* sui meccanismi chiave, l'enciclopedia **Registro del Cronista** (27 citazioni storiche verificate più Atti, eventi dell'era federale, livelli di credito e Visioni in un unico overlay di riferimento) e 10 suggerimenti per il glossario. Trasforma il sapore del periodo in un vero e proprio livello storico consultabile.
- **Onboarding (livello v1.5)**: un'introduzione guidata "Dibattito sul finanziamento del 1790" che guida un giocatore alla prima partita attraverso il ciclo principale, più un'indicazione che mostra il costo e le conseguenze di ogni azione prima che tu ti impegni.
- **IA deterministica**: ogni decisione dell'avversario è una funzione pura dello stato visibile con una motivazione registrata. Nessun LLM, nessuna magia opaca.
- **8 superfici di gioco**: Tabellone, Pannello del Tesoro, Ispezione delle risorse, Cassetto degli eventi, Atti del Congresso, Tracce condivise, Registro dei turni / Registro, Rapporto di fine gioco.
- **Aste**: le risorse rifiutate vanno all'asta tra più giocatori con offerte controllate dal profilo.
- **Salvataggio / caricamento**: salvataggio automatico in `localStorage` a ogni turno, esportazione / importazione manuale in formato JSON, controllo dell'integrità dell'hash al caricamento, con controllo della versione.
- **Riproduzione**: riproduzione completa di qualsiasi gioco completato. In sola lettura. Ricostruisce dai dati iniziali + registro delle decisioni con un indicatore di integrità verde.
- **Simulazione in batch**: esegui 10 / 50 / 100 giochi deterministici contro qualsiasi tripla di profili, esporta report JSON + HTML per l'analisi dell'equilibrio.
- **Narrazione storica**: libreria di 25 voci derivata dal registro (valori predefiniti di 40-60 parole, espansioni di 150-200 parole, riepilogo di fine gioco di circa 300-500 parole). Non modifica mai lo stato.
- **Livello di accessibilità**: navigazione completa tramite tastiera, indicatori di focus, etichette significative per il lettore di schermo, valori delle tracce leggibili come testo e non solo come indicatori, corpo minimo di 14 pixel, rispetto dell'impostazione di riduzione del movimento.

---

## Elenco dei profili (baseline di equilibrio v0.10)

| Profilo | Priorità delle risorse | Punto di forza | Debolezza |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Debito statale > Debito di riscossione > Banca > Zecca | Aumento del credito pubblico | Nessun reddito dalle infrastrutture |
| **Merchant / Infrastructure**  | Percorsi (tutti e 4) > Commercio > Miglioramenti > Entrate | Scala dei percorsi | Nessun punteggio per la capacità industriale |
| **Manufacturer / Industry**    | Mfg > Industria strategica > Miglioramenti > Banca | Moltiplicatori di capacità | Inizio lento; ottiene una concessione iniziale |

Il quarto profilo del documento concettuale (Opportunista / Contanti) è rinviato. Il set competitivo bloccato v0.10 è di tre.

---

## Note beta

- **Si tratta di una versione beta pubblica:** è stata migliorata e resa più divertente, ma è ancora in fase di sviluppo; potreste riscontrare qualche piccolo problema. Segnalazioni di bug e feedback sono ben accetti e possono essere inviati tramite il [sistema di gestione dei problemi](https://github.com/mcp-tool-shop-org/sovereign/issues).
- **Completare per primo il percorso non significa vincere.** Il gioco termina quando un giocatore completa il suo quarto giro del percorso, ma il vincitore è colui che ha più Influenza al momento del calcolo finale: la profondità economica prevale sulla velocità. La schermata finale lo rende chiaro.
- **La strategia del Tesoro è la più efficace, ed è stata progettata per esserlo.** Il credito pubblico e le finanze federali erano gli strumenti principali di Hamilton, quindi la strategia del Tesoro vince più spesso, ma le strategie del Mercante e del Produttore sono entrambe valide e offrono un'esperienza di gioco molto diversa.

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

Le versioni vengono pubblicate su npm tramite GitHub Actions (`release.yml`) quando viene effettuato il push del tag `v*`, con attestazione di provenienza Sigstore. La versione di riferimento è il ramo `main`.

---

## Licenza

MIT © mcp-tool-shop. Consultare il file [`LICENSE`](./LICENSE).

---

<div align="center">

Realizzato da <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
