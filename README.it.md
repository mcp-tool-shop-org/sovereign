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

**Stato — v1.1.2 (beta).** La versione v1.1.0 è stata ritirata lo stesso giorno in cui è stata rilasciata (2026-05-20). La versione v1.1.1 ha ricostruito la modalità digitale con correzioni per migliorare la giocabilità, un ritmo di 12 turni e una soglia di vittoria obbligatoria, ma risultava comunque troppo breve. La versione v1.1.2 sostituisce la condizione di fine basata sul numero di turni con una condizione di fine basata su un "circuito": il gioco termina quando un giocatore ha fatto percorrere alla sua fazione l'intero territorio della Repubblica per quattro volte. La durata media di una partita è di circa 23 turni / 67 mosse (1,9 volte la v1.1.1). Il giocatore che fa scattare la fine non vince automaticamente; vince chi ha la maggiore influenza al conteggio finale. La versione stampabile del gioco da tavolo rimane stabile alla versione v0.2. Consultare il file `CHANGELOG.md` per i dettagli completi delle modifiche e le avvertenze relative alla versione beta.

---

## Cos'è

Sovereign è un **gioco da tavolo "Hamilton System" ispirato a Monopoly**, incentrato sulla nascita del credito pubblico statunitense, e include un **adattamento completo per giocatore singolo / digitale** che esegue le stesse regole localmente in un browser, contro due avversari simulati e deterministici.

- **Gioco da tavolo** — edizione stampabile composta da 34 fogli. Tabellone con 40 caselle, 22 proprietà + 4 percorsi + 2 istituzioni, 8 sistemi di colori, 7 atti del Congresso in ordine storico fisso, 4 ruoli per giocatore, 3 tracciati condivisi (Credito Pubblico · Resistenza Pubblica · Capacità Industriale), 12+12 carte evento. Due percorsi economici validi oltre al Tesoro: Mercante e Produttore. Bilanciamento della versione v0.2, bloccato.
- **Modalità digitale** — singolo file HTML autonomo. Condizione di fine basata su circuito: il gioco termina quando un giocatore completa il suo quarto passaggio attraverso il Tesoro. La durata media di una partita è di circa 23 turni (67 mosse). Al conteggio finale, vince il giocatore con la maggiore influenza, *non necessariamente quello che ha percorso il tabellone per primo*. Il limite massimo di turni rimane fissato a 30 per sicurezza (non viene mai raggiunto nella modalità CANONICAL × 100). Generatore di numeri casuali deterministico mulberry32, avversari controllati dall'IA (Tesoro / Finanza, Mercante / Infrastrutture, Produttore / Industria), salvataggio / caricamento con verifica dell'integrità, strumento di simulazione batch per il designer.
- **Bilanciamento di base** — modello a circuito (v1.1.2 beta): Tesoro 56 % · Mercante 19 % · Produttore 25 % (CANONICAL × 100). Tutti e tre i profili hanno buone possibilità di vittoria; il Produttore aumenta di importanza nelle partite più lunghe, poiché i set industriali hanno il tempo di svilupparsi; la quota del Mercante diminuisce poiché i percorsi sono meno dominanti quando si spendono soldi per miglioramenti in un arco di tempo più lungo. Le meccaniche di base della versione v0.18 (Crisi del Credito, punteggio dei crediti, Carta Industriale, bonus per il completamento dei set) sono state preservate byte-per-byte dalla sequenza di sviluppo v0.3 → v0.10 → v0.18, basata su oltre 1000 simulazioni deterministiche.

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

- **La versione v1.1.2 è una beta.** I dati provengono da una simulazione batch eseguita all'interno del file HTML (100 / 100 partite terminano con il circuito, durata media di 23 turni, distribuzione dei vincitori 56 / 19 / 25). **Non** è stata testata completamente da un giocatore umano. Consideratela una versione "opt-in" fino a quando non l'avrete provata voi stessi.
- **I profili dell'IA non competono ancora per i circuiti.** Utilizzano le funzioni decisionali della versione v0.18, che mirano ad accumulare influenza piuttosto che a correre verso il quarto circuito. I giocatori umani reali potrebbero comportarsi in modo molto diverso una volta compresa la condizione di fine partita.
- **Attivare il circuito non significa vincere.** Il giocatore che completa il quarto circuito vince solo per influenza in circa un terzo dei casi. Questo è intenzionale: il conteggio finale premia la profondità economica, non la velocità nel percorrere il tabellone. La schermata finale chiarisce questa distinzione.
- **La parte finale della Repubblica è lunga e senza atti.** Gli atti continuano a essere attivati nei turni 1-7. La durata media di una partita è di circa 23 turni, lasciando circa 16 turni nella parte finale della Repubblica senza nuovi eventi politici. Se questo vi sembra vuoto durante il gioco, la prossima modifica sarà una redistribuzione degli atti, non un ritorno al sistema di obiettivi.
- **Il Tesoro / Finanza rimane intenzionalmente il più forte**, all'interno della fascia prevista. Questo riflette la tesi storica: il credito pubblico e la finanza federale erano i principali strumenti economici di Hamilton.
- **Gli eventi di fallimento (Default / Ribellione) rimangono principalmente decorativi.** La Crisi del Credito si verifica occasionalmente; il Default e la Ribellione quasi mai. Il sistema di escalation ha più tempo per svilupparsi, ma raramente raggiunge i livelli più alti. Le versioni future potrebbero rivedere la pressione sugli stati di fallimento.

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
