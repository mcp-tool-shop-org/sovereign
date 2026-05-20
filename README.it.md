<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**Il gioco da tavolo Hamilton System · versione per giocatore singolo / adattamento digitale**

*Finanziamento iniziale · Gestisci il debito. Costruisci la banca. Industrializza la repubblica.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div

---

**Stato — v1.1.1 (beta).** La versione v1.1.0 è stata ritirata lo stesso giorno del suo rilascio (2026-05-20) dopo che una sessione di gioco con utenti reali ha evidenziato due problemi strutturali che i test di simulazione non erano riusciti a rilevare. La versione v1.1.1 è una revisione: miglioramenti per la giocabilità con utenti reali, ritmo di 12 turni, modello di vittoria basato sui mandati e introduzione del concetto di "affitto". Si tratta di una **beta a cui ci si può iscrivere**: la versione digitale è stata rilasciata perché è significativamente migliore della v1.1.0, ma non è stata testata completamente da un utente umano. La versione fisica del gioco da tavolo rimane stabile alla versione v0.2. Consultare il file `CHANGELOG.md` per i dettagli delle modifiche e le limitazioni della beta.

---

## Cos'è

Sovereign è un **gioco da tavolo "Hamilton System" ispirato a Monopoly**, incentrato sulla nascita del credito pubblico statunitense, e include un **adattamento completo per giocatore singolo / digitale** che esegue le stesse regole localmente in un browser, contro due avversari simulati e deterministici.

- **Gioco da tavolo** — edizione stampabile in 34 fogli. Tabellone con 40 caselle, 22 proprietà + 4 percorsi + 2 istituzioni, 8 sistemi di colori, 7 atti del Congresso in ordine storico fisso, 4 ruoli per i giocatori, 3 tracciati condivisi (Credito Pubblico · Resistenza Pubblica · Capacità Industriale), 12+12 carte evento. Due percorsi economici possibili oltre al Tesoro: Mercante e Produttore. Bilanciamento della versione v0.2, bloccato.
- **Modalità digitale** — singolo file HTML autonomo. Partita di 12 turni con modello di vittoria basato sui mandati: a partire dall'ottavo turno, un giocatore con 15 Punti Influenza e un vantaggio di 5 punti attiva il "Calcolo Finale" e termina la partita. In assenza di un mandato, la partita termina al turno 12. Generatore di numeri casuali deterministico mulberry32, avversari controllati (IA) (Tesoro / Finanza, Mercante / Infrastrutture, Produttore / Industria), salvataggio / caricamento con verifica dell'integrità, strumento di analisi delle partite, strumento di simulazione batch accessibile solo agli sviluppatori.
- **Bilanciamento di base** — modello di 12 turni con mandato (v1.1.1 beta): Tesoro 51% · Mercante 33% · Produttore 16% (VALORE DI RIFERIMENTO × 100). Tutti e tre i profili possono ottenere il mandato; nessun profilo è escluso. Le meccaniche di base della versione v0.18 (Crisi del Credito, sistema di punteggio basato sulla proprietà intellettuale, Carta Industriale, bonus per il completamento di set) sono state mantenute identiche dal ciclo di sviluppo v0.3 → v0.10 → v0.18, basato su oltre 1000 simulazioni deterministiche.

---

## Come iniziare

### Gioca nel tuo browser (nessuna installazione richiesta)

```bash
npx @mcptoolshop/sovereign
```

L'interfaccia a riga di comando (CLI) apre il gioco nel tuo browser predefinito. Nessun installatore, nessun server, nessuna connessione internet richiesta.

Altre modalità:

```bash
npx @mcptoolshop/sovereign --print    # Open the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # Open the audience-routed landing page
npx @mcptoolshop/sovereign --path     # Print the playable HTML file path
npx @mcptoolshop/sovereign --help     # All flags
```

### Gioca online

Apri la pagina di destinazione ospitata all'indirizzo **<https://mcp-tool-shop-org.github.io/sovereign/>** e avvia il gioco digitale.

### Stampa e gioca

Il prototipo del gioco da tavolo è un documento HTML autonomo in 34 pagine. Apri `release/board-game/sovereign-prototype.html` dal pacchetto (o da un download), quindi `Cmd/Ctrl-P → Salva come PDF → Formato US Letter → 100% di scala`. Ritaglia e gioca.

### Pacchetto di rilascio offline

Ogni rilascio con tag include un pacchetto `sovereign-vX.Y.Z-release.zip` nella sua pagina di rilascio di GitHub. Scaricalo, decomprimilo e apri `00-START-HERE.html` per il punto di accesso specifico per l'utente. Tutto funziona offline.

---

## Perché esiste

La tesi di Sovereign è che **il credito pubblico + la finanza federale** erano la leva economica dominante di Alexander Hamilton, ma un gioco "Hamilton System" deve consentire anche al **commercio** e all'**industria** di essere percorsi validi per la vittoria. Il ciclo di bilanciamento (v0.2 → v0.10) è stata una serie di nove versioni, guidata da dati, per mantenere il Tesoro come il profilo più forte (in linea con la storia) senza far collassare il design in un gioco con una sola strategia.

Consulta [`CHANGELOG.md`](./CHANGELOG.md) per l'evoluzione completa versione per versione.

---

## Determinismo

Lo stesso seme + le stesse decisioni umane = registro identico a livello di byte tra le esecuzioni, i browser e i sistemi operativi.

- Singolo generatore di numeri casuali: `mulberry32(state.rngSeed)`.
- Decisioni dell'avversario: funzioni pure dello stato visibile, con ogni decisione registrata nel registro insieme alla regola che l'ha attivata.
- Il salvataggio / caricamento preserva un hash dello stato.
- La riproduzione ricostruisce dallo `initialState(seed) + decisionLog`.
- Verificato su oltre 1000 giochi deterministici durante il ciclo di bilanciamento da v0.2 a v0.10.

---

## Modello di minaccia e gestione dei dati

Sovereign è un gioco da tavolo basato su browser, completamente autonomo. L'interfaccia a riga di comando (CLI) apre un file HTML locale nel browser predefinito. Non c'è alcun server, nessuna chiamata di rete, nessun account, nessuna sincronizzazione con il cloud.

- **Dati accessibili:** i file HTML inclusi nella directory `release/` (solo lettura) e lo `localStorage` con la chiave `sovereign.autosave` (solo per salvare lo stato del gioco).
- **Dati NON accessibili:** nessun accesso al file system al di fuori della directory del pacchetto, nessuna richiesta di rete di alcun tipo, nessuna telemetria, nessuna analisi, nessuna credenziale.
- **Permessi richiesti:** capacità di avviare il browser predefinito del sistema operativo, capacità di leggere i file del pacchetto stesso, `localStorage` del browser (opzionale).
- **Nessuna telemetria, mai.** La funzione di "telemetria" del simulatore si riferisce a report di analisi del gioco generati localmente a partire dal registro interno; questi non lasciano mai la tua macchina.

Consultare il file [`SECURITY.md`](./SECURITY.md) per la segnalazione di vulnerabilità e la politica di sicurezza completa.

---

## Funzionalità

- **Gioco in singolo di 7 turni** contro due avversari controllati da script (Treasury / Finance e Merchant / Infrastructure per impostazione predefinita; Manufacturer / Industry disponibile per il gioco in batch).
- **Intelligenza artificiale deterministica** — ogni decisione dell'avversario è una funzione pura dello stato visibile, con una motivazione registrata. Nessun modello linguistico avanzato (LLM), nessuna logica opaca.
- **8 superfici di gioco** — Tabellone, Pannello del Tesoro, Ispettore degli Asset, Casella degli Eventi, Atti del Congresso, Tracce Condivise, Registro dei Turni, Report Finale.
- **Aste** — gli asset rifiutati vengono messi all'asta in un'asta multiplayer con offerte programmate in base al profilo.
- **Salvataggio / caricamento** — autosalvataggio in `localStorage` ad ogni turno, esportazione / importazione manuale in formato JSON, controllo dell'integrità tramite hash al caricamento, versione specifica.
- **Riproduzione** — riproduzione completa di qualsiasi partita completata. Solo lettura. Ricostruisce a partire dal seme e dal registro delle decisioni, con un'indicazione di integrità.
- **Simulazione in batch** — esecuzione di 10 / 50 / 100 partite deterministiche contro qualsiasi combinazione di profili, esportazione di report in formato JSON e HTML per l'analisi dell'equilibrio.
- **Narrazione storica** — libreria di 25 voci derivate dal registro (descrizioni predefinite di 40-60 parole, espansioni di 150-200 parole, riassunto finale della repubblica di circa 300-500 parole). Non modifica mai lo stato.
- **Accessibilità** — navigazione completa tramite tastiera, indicatori di focus, etichette significative per i lettori di schermo, valori delle tracce leggibili come testo e non solo come indicatori, dimensione minima del corpo in 14px, rispetto delle impostazioni di riduzione del movimento.

---

## Configurazione dei profili (v0.10)

| Profilo | Priorità degli asset | Punti di forza | Punti deboli |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Debito statale > Debito delle entrate > Banca > Zecca | Aumento del credito pubblico | Nessun reddito dalle infrastrutture |
| **Merchant / Infrastructure**  | Rotte (tutte e 4) > Commercio > Miglioramenti > Entrate | Scala delle rotte | Nessun punteggio della capacità industriale |
| **Manufacturer / Industry**    | Produzione > Industria strategica > Miglioramenti > Banca | Moltiplicatori di capacità | Inizio lento; ottiene una Carta iniziale |

Il quarto profilo concettuale (Opportunista / Cash) è stato posticipato. Il set competitivo bloccato della v0.10 è composto da tre profili.

---

## Avvertenze note

- **La versione v1.1.1 è una beta.** La modalità digitale è stata testata tramite diagnostica di simulazione, e il test batch "VALORE DI RIFERIMENTO × 100" ha restituito 62/100 attivazioni del mandato (rispetto alle 67 previste), con una distribuzione dei vincitori di 51/33/16, esattamente come previsto. **Non** è stata testata completamente da un utente umano; l'adattamento comportamentale (come i giocatori si comportano effettivamente una volta che conoscono il sistema dei mandati) non è stato misurato. Consideratela una beta a cui ci si può iscrivere finché non l'avete provata di persona.
- **I profili dell'IA non competono ancora per il mandato.** Utilizzano le stesse funzioni decisionali della versione v0.18, il che significa che mirano ad accumulare Punti Influenza durante l'intera partita, piuttosto che raggiungere rapidamente la soglia di 15 Punti Influenza. Una versione futura modificherà le decisioni dei profili per tenere conto della consapevolezza del mandato. I giocatori umani potrebbero comportarsi in modo diverso.
- **Il fallimento è una pressione dinamica a 12 turni.** Circa 7 eventi su 100 nel test "VALORE DI RIFERIMENTO × 100" con mandato (rispetto a circa 18 su 100 senza mandato, perché le partite terminano prima). Vale la pena osservarlo durante il gioco.
- **Il Tesoro / Finanza rimane intenzionalmente il più forte**, all'interno della fascia prevista. Questo riflette la tesi storica: il credito pubblico e la finanza federale erano i principali strumenti economici di Hamilton.
- **Gli eventi di fallimento (Default / Ribellione) rimangono principalmente decorativi.** La Crisi del Credito si verifica in circa 2 eventi su 100 a 12 turni. Il sistema di escalation ha più tempo per svilupparsi, ma raramente porta al Default o alla Ribellione. Versioni future potrebbero rivedere la pressione legata agli stati di fallimento.

---

## Costruzione e contributo

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

Le versioni vengono pubblicate su npm tramite GitHub Actions (`release.yml`) quando viene eseguito un push con il tag `v*`, e sono accompagnate da una attestazione di provenienza Sigstore. La fonte ufficiale è il ramo `main`.

---

## Licenza

MIT © mcp-tool-shop. Consultare il file [`LICENSE`](./LICENSE).

---

<div align="center">

Creato da <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div
