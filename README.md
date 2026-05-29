<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**The Hamilton System Board Game · solo / digital adaptation**

*Founding Credit · Fund the debt. Build the bank. Industrialize the Republic.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

> **Public beta** — free to play in your browser, no install. It's polished but still maturing; see [`CHANGELOG.md`](./CHANGELOG.md) for what's new and the known rough edges.

---

## What it is

Sovereign is a **Hamilton-system Monopoly-grammar board game** about the founding of US public credit, plus a **solo / digital adaptation** that runs the same rules locally in a browser against two deterministic scripted opponents.

- **Board game** — printable 34-sheet edition. 40-space board, 22 properties + 4 routes + 2 institutions, 8 color systems, 7 Acts of Congress in fixed historical order, 4 player roles, 3 shared tracks (Public Credit · Public Resistance · Industrial Capacity), 12+12 event cards. Two viable economic paths beyond Treasury: Merchant and Manufacturer. v0.2 balance, frozen.
- **Digital mode** — single self-contained HTML file. Circuit-based end condition: the game ends when one player completes their fourth crossing of Treasury Opens. Median game length **~22 rounds (~66 turns)**. At Final Accounting the highest-Influence player wins, *not necessarily the one who got around the board first*. Rival-presence layer: visible Influence standings + per-opponent posture lines. Strategic depth layer: three profile-locked Special Actions, six HAND cards with timing windows, Reform recovery action, the multi-stage Credit Spiral (Public Doubt → Crisis → Panic → Default) with a debt-servicing levy, telegraphed acceleration, forecast, and a Reform lifeline. Strategic arc layer: eight Federal Era Events firing each round from round 8, three Profile Visions with endgame bonuses. Chronicler narration layer: 14 event-bound historical banners plus the informative Tier B (Learn More popovers, the Chronicler's Ledger encyclopedia, glossary tooltips), real quotes from the Federalist Papers and Founders Online, persistent toast with × dismiss. Juice + sound: number tweening, ZzFX procedural audio (13 cues), a Cinematic / Normal / Fast-instant SPEED setting. Deterministic mulberry32 RNG, scripted AI opponents, save / load with hash integrity, replay scrubber, designer-gated batch simulation tool.
- **Three real paths to victory** — Treasury, Merchant, and Manufacturer each win meaningfully, with Treasury the strongest, in line with the history: public credit and federal finance were Hamilton's dominant economic lever. Each profile plays differently, with its own Special Action and a Profile Vision to chase.

---

## Quick start

### Play in your browser (zero install)

```bash
npx @mcptoolshop/sovereign
```

The CLI opens the game in your default browser. No installer, no server, no internet required.

Other modes:

```bash
npx @mcptoolshop/sovereign --print    # Open the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # Open the audience-routed landing page
npx @mcptoolshop/sovereign --path     # Print the playable HTML file path
npx @mcptoolshop/sovereign --help     # All flags
```

### Play online

Open the hosted landing page at **<https://mcp-tool-shop-org.github.io/sovereign/>** and click into the digital game.

### Print and play

The printable board game is a self-contained 34-sheet HTML document. Open `release/board-game/sovereign-board-game.html` from the package (or from a download), then `Cmd/Ctrl-P → Save as PDF → US Letter → 100% scale`. Cut and play.

### Offline release bundle

Each tagged release attaches a `sovereign-vX.Y.Z-release.zip` bundle to its GitHub Release page. Download it, unzip, and open `00-START-HERE.html` for the audience-routed entry point. Everything runs offline.

---

## Why it exists

The thesis of Sovereign is that **public credit + federal finance** were Alexander Hamilton's dominant economic lever — but a Hamilton-system game must let **commerce** and **industry** also be viable paths to victory. The balance arc (v0.2 → v0.10) was a nine-version, evidence-driven push to keep Treasury as the strongest profile (in line with history) without collapsing the design into a single-strategy game.

See [`CHANGELOG.md`](./CHANGELOG.md) for the full version-by-version evolution.

---

## Determinism

Same seed + same human decisions = byte-identical ledger across runs, browsers, and operating systems.

- Single RNG: `mulberry32(state.rngSeed)`.
- Opponent decisions: pure functions of visible state, with every decision logged to the ledger with its triggering rule.
- Save / load roundtrip preserves a state hash.
- Replay reconstructs from `initialState(seed) + decisionLog`.
- Verified across 1,000+ deterministic games during the v0.2 → v0.10 balance arc.

---

## Threat model & data handling

Sovereign is a self-contained browser-based board game. The CLI opens a local HTML file in your default browser. There is no server, no network call, no account, no cloud sync.

- **Data touched:** the included HTML files in `release/` (read-only) and `localStorage` under the `sovereign.autosave` key (game save state only).
- **Data NOT touched:** no filesystem access outside the package directory, no network requests of any kind, no telemetry, no analytics, no credentials.
- **Permissions required:** ability to spawn the OS default browser, ability to read the package's own files, browser `localStorage` (optional).
- **No telemetry, ever.** The simulator's "telemetry" feature refers to local game-analysis reports derived from the in-browser ledger; these never leave your machine.

See [`SECURITY.md`](./SECURITY.md) for vulnerability reporting and the full security policy.

---

## Features

- **Solo circuit-victory game** vs. two scripted opponents (Treasury / Finance and Merchant / Infrastructure by default; Manufacturer / Industry available for batch play). The game ends when one player completes their fourth crossing of Treasury Opens. Median ~22 rounds / ~66 turns. Highest Influence at Final Accounting wins.
- **Rival presence (v1.5 layer)** — visible Influence standings and per-opponent posture lines that frame each rival's move relative to *your* standing in the race ("Hamilton — 3 Influence ahead — takes the Bank; the Treasury bloc tightens."). Ends the parallel-solitaire feel; the opponents read as opponents. Presentation-only — never written to the hashed ledger.
- **The Credit Spiral (v1.5 layer)** — Public Credit failure is now felt, compounding, and recoverable. A debt-servicing CASH levy at low Credit, telegraphed acceleration toward Default, a forecast of where the slope leads, and the Reform action as a real lifeline. It carries the civic thesis directly: you feel *why* federal public credit mattered. Wraps the existing failure hierarchy (Public Doubt → Crisis → Panic → Default), and save / replay stay fully deterministic.
- **Juice + sound (v1.5 layer)** — number tweening with gain/loss asymmetry, ZzFX procedural audio across 13 cues, action choreography, and a SPEED setting (Cinematic / Normal / Fast-instant — Fast-instant skips all animation for fast play and accessibility). Full keyboard / reduced-motion / screen-reader support throughout.
- **Strategic depth (v1.2 layer)** — three profile-locked Special Actions (Issue Federal Bond / Broker Route Contract / Charter Workshop), 6 HAND cards with timing windows (hand cap 2), Reform recovery action.
- **Strategic arc (v1.3 layer)** — 8 Federal Era Events firing each round from round 8+ (5 choice + 3 auto), 3 Profile Visions (Federal Credit Architect / Commerce Sovereign / Industrial Founder) with an endgame bonus. All three Visions are achievable.
- **The Chronicler (v1.4 layer)** — named third-person historical voice. 14 event-bound banners (Acts × 7 / Federal Era opening / Doubt / Crisis / Panic / Default / Rebellion / Reform / Vision / Final Accounting). All attributed quotes verified against founders.archives.gov, Wikisource, and Library of Congress sources. Failed Acts narrated as counterfactuals to real history ("In our history Hamilton's Funding Act carried 32 to 29 in July of 1790; in your Republic, the soldier's discrimination found enough votes to bar the door."). Persistent foil-bordered toast with × dismiss; respects narration On/Minimal/Off setting.
- **Chronicler Tier B — the informative layer (v1.5)** — 15 *Learn More* popovers on key mechanics, **the Chronicler's Ledger** encyclopedia (27 verified historical quotes plus Acts, Federal Era events, Credit tiers, and Visions in one reference overlay), and 10 glossary tooltips. Turns the period flavor into an actual, browsable history layer.
- **Onboarding (v1.5 layer)** — a Swift-Start guided "1790 Funding Debate" opening that walks a first-time player into the core loop, plus a hide-nothing hover/focus telegraph that shows the cost and consequence of every action affordance before you commit.
- **Deterministic AI** — every opponent decision is a pure function of visible state with a ledgered reason. No LLM, no opaque magic.
- **8 game surfaces** — Board, Treasury Panel, Asset Inspector, Event Drawer, Acts of Congress, Shared Tracks, Turn Log / Ledger, Endgame Report.
- **Auctions** — declined assets go to multi-player auction with profile-driven scripted bidding.
- **Save / load** — autosave to `localStorage` on every turn, manual JSON export / import, hash integrity check on load, version-gated.
- **Replay** — full scrubber over any completed game. Read-only. Reconstructs from seed + decisionLog with a green integrity pill.
- **Batch simulation** — run 10 / 50 / 100 deterministic games against any profile triplet, export JSON + HTML reports for balance analysis.
- **Historical narration** — 25-entry library derived from the ledger (40–60 word defaults, 150–200 word expansions, ~300–500 word endgame republic summary). Never mutates state.
- **Accessibility floor** — full keyboard navigation, focus indicators, screen-reader-meaningful labels, track values readable as text not only as markers, 14px minimum body, reduce-motion respect.

---

## Profile lineup (v0.10 balance baseline)

| Profile                        | Asset priority                                                | Strength             | Weakness                            |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > State Debt > Rev Debt > Bank > Mint                      | Public Credit ramp   | No Infrastructure income            |
| **Merchant / Infrastructure**  | Routes (all 4) > Commerce > Improvements > Revenue            | Route ladder         | No industrial Capacity scoring      |
| **Manufacturer / Industry**    | Mfg > Strategic Industry > Improvements > Bank                | Capacity multipliers | Slow start; gets a starting Charter |

The fourth concept-doc profile (Opportunist / Cash) is deferred. The locked v0.10 competitive set is three.

---

## Beta notes

- **It's a public beta** — polished and fun, but still maturing; you may hit the occasional rough edge. Bug reports and feedback are welcome on the [issue tracker](https://github.com/mcp-tool-shop-org/sovereign/issues).
- **Completing the board first doesn't mean you win.** The game ends when a player makes their fourth circuit of the board, but the winner is whoever holds the most Influence at Final Accounting — economic depth beats speed. The endgame screen makes this clear.
- **Treasury is the strongest path, by design.** Public credit and federal finance were Hamilton's dominant lever, so Treasury wins most often — but Merchant and Manufacturer are both genuinely viable, and play very differently.

---

## Building and contributing

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

Releases are published to npm via GitHub Actions (`release.yml`) on `v*` tag push, with Sigstore provenance attestation. Source-of-truth is the `main` branch.

---

## License

MIT © mcp-tool-shop. See [`LICENSE`](./LICENSE).

---

<div align="center">

Built by <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
