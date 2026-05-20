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

> **Status — v1.1.2 (beta).** v1.1.0 was withdrawn the same day it shipped (2026-05-20). v1.1.1 rebuilt the digital mode with playability fixes + 12-round pacing + a mandate victory threshold but still felt too short. v1.1.2 swaps the round-cap end condition for a **circuit-based** end condition: the game ends when one player has carried their faction around the Republic four times. Median game length ~23 rounds / 67 turns (1.9× v1.1.1). The player who triggers the end doesn't automatically win — the highest Influence at Final Accounting does. The printable board game remains stable at v0.2. See `CHANGELOG.md` for the full delta and beta caveats.

---

## What it is

Sovereign is a **Hamilton-system Monopoly-grammar board game** about the founding of US public credit, plus a **solo / digital adaptation** that runs the same rules locally in a browser against two deterministic scripted opponents.

- **Board game** — printable 34-sheet edition. 40-space board, 22 properties + 4 routes + 2 institutions, 8 color systems, 7 Acts of Congress in fixed historical order, 4 player roles, 3 shared tracks (Public Credit · Public Resistance · Industrial Capacity), 12+12 event cards. Two viable economic paths beyond Treasury: Merchant and Manufacturer. v0.2 balance, frozen.
- **Digital mode** — single self-contained HTML file. Circuit-based end condition: the game ends when one player completes their fourth crossing of Treasury Opens. Median game length ~23 rounds (67 turns). At Final Accounting the highest-Influence player wins, *not necessarily the one who got around the board first*. Hard cap stays at round 30 as safety (never fires in CANONICAL × 100). Deterministic mulberry32 RNG, scripted AI opponents (Treasury / Finance, Merchant / Infrastructure, Manufacturer / Industry), save / load with hash integrity, replay scrubber, designer-gated batch simulation tool.
- **Balance baseline** — circuit model (v1.1.2 beta): Treasury 56 % · Merchant 19 % · Manufacturer 25 % (CANONICAL × 100). All three profiles win meaningfully; Manufacturer rises in longer games as industrial sets have time to mature; Merchant share drops as routes are less dominant when cash gets spent on upgrades over a longer arc. The underlying v0.18 mechanics (Credit Crisis, cash IP scoring, Industrial Charter, set completion bonuses) are preserved byte-identical from the v0.3 → v0.10 → v0.18 design arc driven by 1,000+ deterministic simulation games.

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

- **Solo circuit-victory game** vs. two scripted opponents (Treasury / Finance and Merchant / Infrastructure by default; Manufacturer / Industry available for batch play). The game ends when one player completes their fourth crossing of Treasury Opens. Median ~23 rounds / 67 turns. Highest Influence at Final Accounting wins.
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

- **v1.1.2 is a beta.** Numbers from the diagnostic held on the in-HTML batch sim (100 / 100 games trigger circuit-end, median 23 rounds, 56 / 19 / 25 winner split). It has **not** been cold-walked end-to-end by a fresh human player. Treat it as opt-in until you've walked it yourself.
- **AI profiles do not yet race for circuits.** They run v0.18 decision functions — playing to accumulate Influence rather than racing to the fourth circuit. Real human players may behave very differently once they understand the end condition.
- **Trigger ≠ winner.** The player who completes the fourth circuit only wins by Influence in about a third of games. This is intentional — Final Accounting rewards economic depth, not speed around the board. Endgame copy makes the distinction explicit.
- **Late Republic stretch is long with no Acts.** Acts still fire in rounds 1-7. Median play is ~23 rounds, leaving ~16 rounds of Late Republic with no new political shocks. If this feels empty in cold play, the next fix is an Acts redistribution pass, not a return to mandate.
- **Treasury / Finance remains intentionally strongest**, within the target band. Matches the historical thesis: public credit + federal finance were Hamilton's dominant economic lever.
- **Failure events (Default / Rebellion) remain mostly decorative.** Credit Crisis fires occasionally; Default and Rebellion almost never. The escalation system has more time to compound but still rarely reaches the top tiers. Future versions may revisit fail-state pressure.

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
