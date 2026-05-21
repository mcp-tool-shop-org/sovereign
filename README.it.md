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

**Stato — v1.4.0 (beta).** Prima versione con nuove funzionalità significative dopo la v1.1.2 (circuit-victory). Aggiunge tre livelli alla base del circuito: **profondità strategica** (azioni speciali legate al profilo, carte HAND con finestre temporali, recupero delle riforme, pressione pubblica a più fasi), **arco strategico** (eventi dell'era federale che si attivano ogni round a partire dal round 8, tre "Visioni" del profilo con bonus per la fine del gioco) e **il Cronista** (una voce storica in terza persona che introduce 14 eventi con banner, basati su citazioni storiche verificate – 27 citazioni reali di Hamilton, Madison, Jefferson, Adams, Gallatin, Maclay e Freneau, con collegamenti tracciabili ai siti founders.archives.gov, Wikisource e Library of Congress; nessuna attribuzione inventata). La durata media di una partita rimane di circa 23 round / 67 turni; il "Final Accounting" attivato dal circuito rimane invariato. Tre percorsi di gioco validi: Tesoro 59 % / Mercante 20 % / Produttore 21 % (CANONICAL × 100). Il gioco da tavolo stampabile rimane stabile alla versione v0.2. Consultare il file `CHANGELOG.md` per i dettagli completi delle modifiche e le avvertenze relative alla versione beta.

---

## Cos'è

Sovereign è un **gioco da tavolo "Hamilton System" ispirato a Monopoly**, incentrato sulla nascita del credito pubblico statunitense, e include un **adattamento completo per giocatore singolo / digitale** che esegue le stesse regole localmente in un browser, contro due avversari simulati e deterministici.

- **Gioco da tavolo** — edizione stampabile in 34 fogli. Tabellone con 40 caselle, 22 proprietà + 4 percorsi + 2 istituzioni, 8 sistemi di colori, 7 Atti del Congresso in ordine storico fisso, 4 ruoli per giocatore, 3 tracciati condivisi (Credito Pubblico · Resistenza Pubblica · Capacità Industriale), 12+12 carte evento. Due percorsi economici validi oltre al Tesoro: Mercante e Produttore. Bilanciamento alla versione v0.2, bloccato.
- **Modalità digitale** — singolo file HTML autonomo. Condizione di fine partita basata sul circuito: il gioco termina quando un giocatore completa la sua quarta "apertura" del Tesoro. La durata media di una partita è di circa 23 round (67 turni). Durante il "Final Accounting", vince il giocatore con la maggiore influenza, *non necessariamente quello che ha percorso il tabellone per primo*. Livello di profondità strategica: tre azioni speciali legate al profilo, sei carte HAND con finestre temporali, azione di recupero delle riforme, pressione sul credito a più fasi (Dubbio Pubblico / Crisi / Panico / Default). Livello dell'arco strategico: otto eventi dell'era federale che si attivano ogni round a partire dal round 8, tre "Visioni" del profilo con bonus per la fine del gioco. Livello di narrazione del Cronista: 14 banner storici legati agli eventi, citazioni reali dai Federalist Papers e Founders Online, notifiche persistenti con pulsante di chiusura. Generatore di numeri casuali deterministico mulberry32, avversari controllati da intelligenza artificiale, salvataggio / caricamento con verifica dell'integrità, strumento di rimozione delle ripetizioni, strumento di simulazione batch riservato agli sviluppatori.
- **Bilanciamento di base** — circuito + profondità strategica + arco strategico + Cronista (v1.4.0 beta): Tesoro 59 % · Mercante 20 % · Produttore 21 % (CANONICAL × 100). Tutti e tre i profili hanno buone possibilità di vittoria. Tassi di raggiungimento degli obiettivi: Architetto del Credito Federale 54 %, Sovrano del Commercio 39 %, Fondatore Industriale 29 %. Le meccaniche di base della versione v0.18 (Crisi del Credito, punteggio dei brevetti in denaro, Carta Industriale, bonus per il completamento di set) sono state preservate byte-per-byte dalla versione v0.3 alla v0.10 alla v0.18, attraverso un processo di sviluppo basato su oltre 1000 simulazioni deterministiche.

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

- **Gioco a circuito singolo** contro due avversari controllati dal computer (Tesoro/Finanza e Commercio/Infrastrutture di default; Produttore/Industria disponibile per la modalità a turni). Il gioco termina quando un giocatore completa la sua quarta fase di "Apertura del Tesoro". Media: circa 23 turni / 67 mosse. Vince chi ha la maggiore influenza al conteggio finale.
- **Profondità strategica (livello v1.2)**: tre azioni speciali specifiche per ogni profilo (Emissione di obbligazioni federali / Contratto di brokeraggio / Costituzione di officine), 6 carte in mano con finestre temporali (limite di 2 carte in mano), azione di recupero delle riforme, pressione creditizia a più fasi (Dubbio pubblico / Crisi / Panico / Default).
- **Arco strategico (livello v1.3)**: 8 eventi dell'era federale che si attivano ogni turno a partire dal turno 8 (5 scelte + 3 automatici), 3 "Visioni" del profilo (Architetto del credito federale / Sovrano del commercio / Fondatore industriale) con un bonus di +3 punti influenza alla fine del gioco.
- **Il Cronista (livello v1.4)**: voce storica in terza persona con nome. 14 banner legati agli eventi (Leggi × 7 / Apertura dell'era federale / Dubbio / Crisi / Panico / Default / Ribellione / Riforma / Visione / Conteggio finale). Tutte le citazioni sono state verificate rispetto alle fonti founders.archives.gov, Wikisource e Library of Congress. Le leggi fallite sono narrate come scenari alternativi alla storia reale ("Nella nostra storia, la Funding Act di Hamilton ottenne 32 voti contro 29 nel luglio 1790; nella vostra Repubblica, la discriminazione nei confronti dei militari trovò abbastanza voti per sbarrare la porta."). Un banner con bordo effetto "foil" rimane visibile finché non viene rimosso; rispetta l'impostazione di narrazione "On/Minimal/Off".
- **Intelligenza artificiale deterministica**: ogni decisione dell'avversario è una funzione diretta dello stato visibile, con una motivazione registrata. Nessun modello linguistico, nessuna "magia" opaca.
- **8 superfici di gioco**: Tabellone, Pannello del Tesoro, Ispettore degli Asset, Cassetto degli Eventi, Leggi del Congresso, Tracce condivise, Registro dei turni / Libro mastro, Rapporto finale.
- **Aste**: gli asset rifiutati vengono messi all'asta tra più giocatori, con offerte programmate specifiche per ogni profilo.
- **Salvataggio / Caricamento**: salvataggio automatico in `localStorage` ad ogni turno, esportazione / importazione manuale in formato JSON, controllo dell'integrità tramite hash al caricamento, versione specifica.
- **Riproduzione**: riproduzione completa di qualsiasi partita completata. Solo lettura. Ricostruisce la partita a partire dal seme e dal registro delle decisioni, con un indicatore di integrità verde.
- **Simulazione in batch**: esecuzione di 10 / 50 / 100 partite deterministiche contro qualsiasi combinazione di profili, esportazione di report in formato JSON + HTML per l'analisi dell'equilibrio.
- **Narrazione storica**: libreria di 25 voci derivate dal libro mastro (descrizioni predefinite di 40-60 parole, espansioni di 150-200 parole, riassunto della repubblica alla fine del gioco di circa 300-500 parole). Non modifica mai lo stato del gioco.
- **Accessibilità**: navigazione completa tramite tastiera, indicatori di focus, etichette significative per i lettori di schermo, valori delle tracce leggibili come testo e non solo come indicatori, dimensione minima del testo di 14px, rispetto delle impostazioni di riduzione del movimento.

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

- **La versione 1.4.0 è una beta.** Ogni componente (profondità strategica, arco strategico, Chronicler) è stato analizzato e validato strutturalmente rispetto ai risultati delle simulazioni. L'intera architettura a quattro livelli è stata testata a livello di componente, ma non completamente da un giocatore umano. I dati ottenuti sono basati su un test di riferimento (CANONICAL × 100): 100 partite completate, durata media di 23 turni, distribuzione dei vincitori di circa 59/20/21, circa 6-8 bandiere Chronicler per partita, circa 33 azioni per partita. Considerate questa versione come un'anteprima e provatela voi stessi.
- **I profili dell'intelligenza artificiale non si adattano ancora alle meccaniche delle versioni 1.2-1.4.** Utilizzano le funzioni decisionali della versione 0.18: non "corrono per ottenere la Visione" né "usano strategicamente le carte HAND" come farebbe un giocatore umano. Il gioco reale si discosterà dai risultati ottenuti nel test di riferimento.
- **Attivazione ≠ vincita.** Il giocatore che completa il quarto circuito vince solo per influenza in circa un terzo delle partite. Questo è intenzionale: Final Accounting premia la profondità economica, non la velocità nel muoversi sulla mappa. La copia finale rende questa distinzione esplicita.
- **La fase della Repubblica Tarda è lunga e priva di eventi.** Gli eventi continuano a verificarsi nei turni 1-7. La durata media di una partita è di circa 23 turni, lasciando circa 16 turni della Repubblica Tarda senza nuovi eventi politici. Se questa fase vi sembra vuota durante il test, la prossima modifica sarà una redistribuzione degli eventi, non un ritorno al sistema dei mandati.
- **Il Tesoro/Finanza rimane intenzionalmente il più forte**, all'interno dell'intervallo previsto. Questo riflette la tesi storica: il credito pubblico e la finanza federale erano i principali strumenti economici di Hamilton.
- **Gli eventi di fallimento (Default/Ribellione) rimangono principalmente decorativi.** La Crisi del Credito si verifica occasionalmente; il Default e la Ribellione sono quasi inesistenti. Il sistema di escalation ha più tempo per svilupparsi, ma raramente raggiunge i livelli più alti. Le versioni future potrebbero rivedere la pressione degli stati di fallimento.

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
