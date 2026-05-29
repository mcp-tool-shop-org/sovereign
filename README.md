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

> **Status — v1.5.0 (beta).** The "make it felt" release, on top of the v1.4 strategic stack. Five layers land here: **rival presence** (visible Influence standings + per-opponent posture lines that kill the parallel-solitaire dead air), **the Credit Spiral** (failure pressure is now felt, compounding, and *recoverable* — a debt-servicing levy, telegraphed acceleration toward Default, a forecast, and a Reform lifeline — and it carries the civic thesis: you feel *why* public credit matters), **juice + sound** (number tweening with gain/loss asymmetry, ZzFX procedural audio across 13 cues, action choreography, a Cinematic / Normal / Fast-instant SPEED setting, full a11y), **Chronicler Tier B** (15 *Learn More* popovers, the Chronicler's Ledger encyclopedia — 27 verified quotes plus Acts / events / tiers / Visions — and 10 glossary tooltips), and **onboarding** (a Swift-Start guided "1790 Funding Debate" opening + a hide-nothing hover/focus telegraph). Two live-game hard-hangs shipped in v1.4.0 are fixed (card-triggered auctions; insufficient-cash buy), and save/load/replay fidelity is restored (`SAVE_VERSION = v0.26-replay-fidelity-candidate`). Median game length is **~22 rounds (~66 turns)**; circuit-triggered Final Accounting unchanged. Measured balance (CANONICAL × 100): Treasury **48 %** / Merchant **34 %** / Manufacturer **18 %** — all three profiles win meaningfully. **v1.5.0 is a beta pending a fresh-human end-to-end walkthrough** (the playability gate). The printable board game remains stable at v0.2. See `CHANGELOG.md` for the full delta and beta caveats.

---

## What it is

Sovereign is a **Hamilton-system Monopoly-grammar board game** about the founding of US public credit, plus a **solo / digital adaptation** that runs the same rules locally in a browser against two deterministic scripted opponents.

- **Board game** — printable 34-sheet edition. 40-space board, 22 properties + 4 routes + 2 institutions, 8 color systems, 7 Acts of Congress in fixed historical order, 4 player roles, 3 shared tracks (Public Credit · Public Resistance · Industrial Capacity), 12+12 event cards. Two viable economic paths beyond Treasury: Merchant and Manufacturer. v0.2 balance, frozen.
- **Digital mode** — single self-contained HTML file. Circuit-based end condition: the game ends when one player completes their fourth crossing of Treasury Opens. Median game length **~22 rounds (~66 turns)**. At Final Accounting the highest-Influence player wins, *not necessarily the one who got around the board first*. Rival-presence layer: visible Influence standings + per-opponent posture lines. Strategic depth layer: three profile-locked Special Actions, six HAND cards with timing windows, Reform recovery action, the multi-stage Credit Spiral (Public Doubt → Crisis → Panic → Default) with a debt-servicing levy, telegraphed acceleration, forecast, and a Reform lifeline. Strategic arc layer: eight Federal Era Events firing each round from round 8, three Profile Visions with endgame bonuses. Chronicler narration layer: 14 event-bound historical banners plus the informative Tier B (Learn More popovers, the Chronicler's Ledger encyclopedia, glossary tooltips), real quotes from the Federalist Papers and Founders Online, persistent toast with × dismiss. Juice + sound: number tweening, ZzFX procedural audio (13 cues), a Cinematic / Normal / Fast-instant SPEED setting. Deterministic mulberry32 RNG, scripted AI opponents, save / load with hash integrity, replay scrubber, designer-gated batch simulation tool.
- **Balance baseline** — circuit + strategic-depth + strategic-arc + Chronicler + Credit Spiral (v1.5.0 beta): Treasury **48 %** · Merchant **34 %** · Manufacturer **18 %** (CANONICAL × 100, measured against the live engine via `test/measure-stats.mjs`). All three profiles win meaningfully, with Treasury the strongest in line with the historical thesis. All three Profile Visions (Federal Credit Architect / Commerce Sovereign / Industrial Founder) are achievable and roughly balanced — each fires in ~41–43 % of games. The underlying v0.18 mechanics (Credit Crisis, cash IP scoring, Industrial Charter, set completion bonuses) are preserved byte-identical from the v0.3 → v0.10 → v0.18 design arc driven by 1,000+ deterministic simulation games.

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
- **The Credit Spiral (v1.5 layer)** — Public Credit failure is now felt, compounding, and recoverable. A debt-servicing CASH levy at low Credit, telegraphed acceleration toward Default, a forecast of where the slope leads, and the Reform action as a real lifeline. It carries the civic thesis directly: you feel *why* federal public credit mattered. Wraps the v0.18 hierarchy (Public Doubt → Crisis → Panic → Default) without changing its thresholds; applied inside `reduce()` so it stays replay-safe.
- **Juice + sound (v1.5 layer)** — number tweening with gain/loss asymmetry, ZzFX procedural audio across 13 cues, action choreography, and a SPEED setting (Cinematic / Normal / Fast-instant — Fast-instant skips all animation for fast play and accessibility). Full keyboard / reduced-motion / screen-reader support throughout.
- **Strategic depth (v1.2 layer)** — three profile-locked Special Actions (Issue Federal Bond / Broker Route Contract / Charter Workshop), 6 HAND cards with timing windows (hand cap 2), Reform recovery action.
- **Strategic arc (v1.3 layer)** — 8 Federal Era Events firing each round from round 8+ (5 choice + 3 auto), 3 Profile Visions (Federal Credit Architect / Commerce Sovereign / Industrial Founder) with +3 IP endgame bonus. All three Visions are achievable (~41–43 % of games each, CANONICAL × 100).
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

## Known caveats

- **v1.5.0 is a beta pending a fresh-human end-to-end walkthrough.** Each layer was structurally audited and re-validated against the live engine via `test/measure-stats.mjs` and the determinism + playability harnesses; the full stack has been cold-walked at slice level but not yet played end-to-end by a fresh human player. That walkthrough is the playability gate for the public tag. Numbers below are CANONICAL × 100 against the live engine; real human play will differ. Treat as opt-in until you (or a human you trust) have walked it.
- **Failure pressure is felt and recoverable — no longer decorative.** Credit Crisis now fires in **~29 / 100** games and is genuinely recoverable: of the games that enter Crisis (Credit ≤ 4), about **41 %** climb back to a stable Credit ≥ 7, none reach Default. Panic is rare (~1 / 100). Default and Rebellion stay rare under the scripted v0.18 AI — which Reforms itself off the floor before it falls — but both are fully reachable by a human player who neglects Public Credit. The Credit Spiral makes the slope toward Default visible and felt rather than a sudden cliff.
- **Opponents exercise the v1.2–v1.4 systems; only the core action math is v0.18.** Scripted opponents *do* use Special Actions, the Reform lifeline, Federal Era / Late-Event choices, Act votes, and HAND-card timing — the prior "AI doesn't adapt" note was overbroad. What remains v0.18 is the **core buy / auction / upgrade / vote** valuation: they pick optimally per their profile but don't yet explicitly "race for the Vision" the way a human optimizer might. CANONICAL × 100 measurements reflect that scripted behavior; human play will diverge.
- **Trigger ≠ winner.** The player who completes the fourth circuit only wins by Influence in about a third of games. This is intentional — Final Accounting rewards economic depth, not speed around the board. Endgame copy makes the distinction explicit.
- **Federal Era stretch has light Act pressure.** Founding Acts fire in rounds 1–7; median play is ~22 rounds, so the Federal Era runs on its own Events (firing every round from round 8) plus the Credit Spiral and Vision race. The v1.3 every-round Federal Era draw cut empty 4-round windows to ~2 / 100. If a stretch still feels thin in cold play, the next lever is an Acts redistribution pass, not a return to mandate.
- **Treasury / Finance remains intentionally strongest** (48 % of wins), within the target band. Matches the historical thesis: public credit + federal finance were Hamilton's dominant economic lever — without collapsing the design into a single strategy (Merchant 34 %, Manufacturer 18 %).

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
