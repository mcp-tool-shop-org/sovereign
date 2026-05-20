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

## Cos'è

Sovereign è un **gioco da tavolo "Hamilton System" ispirato a Monopoly**, incentrato sulla nascita del credito pubblico statunitense, e include un **adattamento completo per giocatore singolo / digitale** che esegue le stesse regole localmente in un browser, contro due avversari simulati e deterministici.

- **Gioco da tavolo** — edizione stampabile in 34 pagine. Tabellone con 40 caselle, 22 proprietà + 4 percorsi + 2 istituzioni, 8 sistemi di colori, 7 Atti del Congresso in ordine storico fisso, 4 ruoli per giocatore, 3 tracciati condivisi (Credito Pubblico · Resistenza Pubblica · Capacità Industriale), 12+12 carte evento. Due percorsi economici validi oltre al Tesoro: Mercante e Produttore.
- **Modalità digitale** — singolo file HTML autonomo. Macchina a stati completa, generatore di numeri casuali mulberry32 deterministico, avversari controllati dall'IA (Tesoro / Finanza, Mercante / Infrastrutture, Produttore / Industria), salvataggio / caricamento con controllo di integrità tramite hash, strumento di replay, strumento di simulazione batch, telemetria locale dell'equilibrio.
- **Equilibrio di base** — l'equilibrio principale della versione 0.10 è stato mantenuto fino alla versione 1.1.0. Tesoro 60,0% · Mercante 23,5% · Produttore 16,5% (valori CANONICAL × 400 nella versione 0.18, con obiettivi di equilibrio raggiunti per tutti e tre i profili).
- **Sistema di fallimento** — tre livelli: **Crisi del Credito** (Credito Pubblico ≤ 4, avviso), **Ribellione** (Resistenza Pubblica 12, catastrofe), **Default** (Credito Pubblico 0, catastrofe). Introdotto con la versione 1.1.0; i punti finali catastrofici sono invariati rispetto alla versione 0.10.

---

## Novità nella versione 1.1.0

### Fondamenta del sistema di fallimento

La versione 1.1.0 introduce una gerarchia di fallimento a tre livelli. Il "Default" a Credito Pubblico 0 rimane la condizione di collasso finanziario catastrofico (si perdono il 50% della liquidità e 1 aggiornamento per giocatore). La "Ribellione" a Resistenza Pubblica 12 rimane il collasso politico catastrofico (gli aggiornamenti delle entrate vengono distrutti). Tra questi, un nuovo evento intermedio — **Crisi del Credito** — si attiva la prima volta che il Credito Pubblico scende a 4 o meno, aumenta la Resistenza di +1 e registra una riga nel registro. Non reimposta il Credito, non distrugge le risorse e non termina il gioco.

Per rendere visibile il sistema di fallimento durante il gioco, quattro carte "pressione" ora riducono il Credito:

| Carta | Effetto |
|---|---|
| Corsa agli sportelli | Credito Pubblico -1, Capacità Industriale -1 |
| Febbre Speculativa (Credito ≥ 7) | Credito Pubblico -1, Resistenza +1, asta per entrate/debiti statali non posseduti |
| Febbre Speculativa (Credito ≤ 6) | Credito Pubblico -2, Resistenza +1, asta per entrate/debiti statali non posseduti |
| Pamphlet Anti-Federalista | Credito Pubblico -1, Resistenza +1, 30 TN per proprietà del sistema di entrate |

L'Atto di Finanziamento al primo turno aggiunge ancora +2 Credito. Il punto finale catastrofico del "Default" rimane un limite drammatico, non un obiettivo di equilibrio; la "Crisi del Credito" fornisce il segnale attivo.

Dati CANONICAL-400 (semi 2026 – 2425): Tesoro 60,0% · Mercante 23,5% · Produttore 16,5%. La "Crisi del Credito" si attiva 2 / 400 volte. Il "Default" si attiva 0 / 400 volte. La "Ribellione" si attiva 0 / 400 volte. La Resistenza ≥ 8 si mantiene a 0 / 400. Determinismo PASSATO. Dati completi in `experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-evidence-sweep.html`.

### Rifiniture visive generali

Ogni elemento visibile al giocatore è stato progettato per essere coerente con il prodotto "Federalist Treasury":

- Logo nella barra superiore + indicatore della modalità + una versione discreta (non più un'intestazione del dashboard di telemetria)
- Overlay di presentazione iniziale che introduce i tre tracciati e i tre livelli di fallimento
- Tessere del tabellone con fregi agli angoli, bande colorate del sistema, trattamenti distinti per istituzioni, percorsi, tasse e caselle evento
- Le righe del registro per `CREDIT_CRISIS` / `DEFAULT` / `REBELLION` hanno trattamenti di gravità distinti (colore + bordo + etichetta — accessibili)
- Il pannello dei tracciati indica la banda di avviso della "Crisi del Credito" (1–4) e i punti finali di "Default" e "Ribellione"
- Il rapporto finale mostra i "chip di postura" (postura del credito / stato di crisi / stato di ribellione) sopra le colonne dei punteggi, con una narrazione che menziona esplicitamente gli esiti di "Crisi" / "Default" / "Ribellione"
- La finestra di simulazione batch è stata rinominata "Esecuzione della prova dell'equilibrio"
- Punto di interruzione reattivo ≤ 768 px e un foglio di stile per la stampa

Il riferimento al sistema di progettazione e la verifica visiva dello stato dell'interfaccia, composta da quindici schermate, sono disponibili nella directory `release/design-system/`: questi elementi costituiscono la documentazione ufficiale di come appare l'interfaccia della versione 1.1.0.

### Funzionalità preservate

La verifica della promozione della versione 0.18 ha superato tutti i 44 controlli relativi all'origine, all'implementazione, alla regressione, alle prove di equilibrio/fallimento e alla preparazione della documentazione. L'hash dello stato di gioco canonico, generato con 100 "semi", è identico a livello di byte tra la simulazione Node della versione 0.18 e la versione HTML ottimizzata (`3189375454`). La variabile `SAVE_VERSION` rimane impostata su `'v0.18-candidate'` perché nessuna funzionalità è stata modificata durante il processo di ottimizzazione.

### Avvertenza

Le funzionalità della versione 1.1.0 sono state verificate tramite simulazione, utilizzando la tripla canonica T/M/Mfg (400 "semi") e la variante MFG-MIRROR (100 "semi"). Non sono ancora state testate da utenti umani.

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

- **Le soglie di capacità rimangono rare nel gioco canonico.** La capacità finale media è 3,49; ≥ 6 viene raggiunto solo in 4 / 100 partite. Il punteggio industriale finale esiste come limite massimo, non come percorso regolare.
- **Il profilo Treasury / Finance rimane intenzionalmente il più forte**, all'interno della fascia target. Questo corrisponde alla tesi storica: il credito pubblico + la finanza federale erano la leva economica dominante di Hamilton.
- **Gli eventi di fallimento si sono verificati 0 / 400 volte** nella versione di test della v0.10. Le minacce predefinite / ribellione / bancarotta sono attualmente decorative; una versione futura potrebbe rivedere la pressione sullo stato di fallimento.
- **Testato solo tramite simulazione.** L'equilibrio è validato rispetto a oltre 1.000 partite deterministiche nell'arco dalla v0.3 alla v0.10. Non è ancora stato testato con giocatori umani; la deviazione strategica potrebbe modificare questi valori.

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
