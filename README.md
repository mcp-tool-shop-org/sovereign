<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**The Hamilton System Board Game · solo / digital adaptation**

*Founding Credit · Fund the debt. Build the bank. Industrialize the republic.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

## What it is

Sovereign is a **Hamilton-system Monopoly-grammar board game** about the founding of US public credit, plus a **complete solo / digital adaptation** that runs the same rules locally in a browser against two deterministic scripted opponents.

- **Board game** — printable 34-sheet prototype. 40-space board, 22 properties + 4 routes + 2 institutions, 8 color systems, 7 Acts of Congress in fixed historical order, 4 player roles, 3 shared tracks (Public Credit · Public Resistance · Industrial Capacity), 12+12 event cards. Two viable economic paths beyond Treasury: Merchant and Manufacturer.
- **Digital mode** — single self-contained HTML file. Full state machine, deterministic mulberry32 RNG, scripted AI opponents (Treasury / Finance, Merchant / Infrastructure, Manufacturer / Industry), save / load with hash integrity, replay scrubber, batch simulation tool, local balance telemetry.
- **Balance baseline** — v0.10, frozen after a nine-version arc driven by 1,000+ deterministic simulation games. Treasury 59% · Merchant 25% · Manufacturer 16% (CANONICAL × 100, target band met for all three profiles).

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

The board-game prototype is a self-contained 34-sheet HTML document. Open `release/board-game/sovereign-prototype.html` from the package (or from a download), then `Cmd/Ctrl-P → Save as PDF → US Letter → 100% scale`. Cut and play.

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

- **Solo 7-lap game** vs. two scripted opponents (Treasury / Finance and Merchant / Infrastructure by default; Manufacturer / Industry available for batch play).
- **Deterministic AI** — every opponent decision is a pure function of visible state with a ledgered reason. No LLM, no opaque magic.
- **8 game surfaces** — Board, Treasury Panel, Asset Inspector, Event Drawer, Acts of Congress, Shared Tracks, Turn Log / Ledger, Endgame Report.
- **Auctions** — declined assets go to multi-player auction with profile-driven scripted bidding.
- **Save / load** — autosave to `localStorage` on every turn, manual JSON export / import, hash integrity check on load, version-gated.
- **Replay** — full scrubber over any completed game. Read-only. Reconstructs from seed + decisionLog with a green integrity pill.
- **Batch simulation** — run 10 / 50 / 100 deterministic games against any profile triplet, export JSON + HTML reports for balance analysis.
- **Historical narration** — 25-entry library derived from the ledger (40–60 word defaults, 150–200 word expansions, ~300–500 word endgame republic summary). Never mutates state.
- **Accessibility floor** — full keyboard navigation, focus indicators, screen-reader-meaningful labels, track values readable as text not only as markers, 14px minimum body, reduce-motion respect.

---

## Profile lineup (v0.10)

| Profile                        | Asset priority                                                | Strength             | Weakness                            |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > State Debt > Rev Debt > Bank > Mint                      | Public Credit ramp   | No Infrastructure income            |
| **Merchant / Infrastructure**  | Routes (all 4) > Commerce > Improvements > Revenue            | Route ladder         | No industrial Capacity scoring      |
| **Manufacturer / Industry**    | Mfg > Strategic Industry > Improvements > Bank                | Capacity multipliers | Slow start; gets a starting Charter |

The fourth concept-doc profile (Opportunist / Cash) is deferred. The locked v0.10 competitive set is three.

---

## Known caveats

- **Capacity thresholds remain rare in canonical play.** Avg final Capacity is 3.49; ≥ 6 reached in only 4 / 100 games. The endgame industrial scoring exists as a ceiling, not a regular path.
- **Treasury / Finance remains intentionally strongest**, within the target band. This matches the historical thesis: public credit + federal finance were Hamilton's dominant economic lever.
- **Failure events fired 0 / 400 times** in the v0.10 evidence pass. Default / Rebellion / Bankruptcy threats are currently decorative; a future version may revisit fail-state pressure.
- **Simulation-tested only.** Balance is validated against 1,000+ deterministic games across the v0.3 → v0.10 arc. Not yet human-playtested; strategic deviation may shift these rates.

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
