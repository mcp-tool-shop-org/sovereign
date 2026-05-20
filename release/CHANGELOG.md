# Sovereign — Changelog

> A Hamilton-system Monopoly-grammar board game and its solo / digital adaptation.
> Two artifact streams, one design thesis: **debt → credit → bank → industry**.

---

## v1.1.0 (release candidate) — Failure-system foundation + whole-game visual polish — 2026-05-20

Promotes the v0.18 failure-pressure foundation and the whole-game visual polish pass to the canonical Sovereign Solo / Digital Mode release surface. The digital artifact ships at `release/digital-mode/sovereign-solo.html`; the prior v0.10 canonical is archived alongside it as `sovereign-solo-v0.10-baseline.html`. The in-HTML `SAVE_VERSION` remains `'v0.18-candidate'` — no mechanic changed across the polish pass.

**Three-tier failure system (new in v1.1.0):**

| Tier | Trigger | Severity | Effect | Reset |
|---|---|---|---|---|
| Credit Crisis | Public Credit ≤ 4 (first time per game) | warning | Resistance +1, System log | none |
| Rebellion | Public Resistance 12 | catastrophe | Revenue upgrades destroyed; Whiskey owner → Crisis | resistance → 6 |
| Default | Public Credit 0 | catastrophe | 50% cash + 1 upgrade per player | credit → 3 |

**Failure-pressure arc (v0.11 → v0.18) — what shipped:**

- Bank Run drops Public Credit -1 + Industrial Capacity -1 (v0.11).
- Speculation Fever drops Public Credit -1 + Resistance +1 + auctions an unowned Rev/State Debt property (v0.13).
- Anti-Federalist Pamphlet adds Public Credit -1 to its existing Resistance +1 + 30 TN per Revenue-System property hit (v0.16).
- Speculation Fever fragile-credit escalation: Credit -1 at Credit ≥ 7, Credit -2 at Credit ≤ 6 (v0.17).
- Credit Crisis intermediate failure event at Credit ≤ 4 (v0.18).

**Why v0.14 / v0.15 recovery gates were rejected:** mechanically correct but aggregate-inert. The v0.16 → v0.18 chain pivoted to pressure-side changes rather than recovery-side gates.

**Whole-game visual polish (presentation only, mechanics byte-identical):**

All 16 player-facing surfaces art-directed as one Federalist Treasury system: topbar wordmark; first-load orientation overlay; board tile crests with corner glyphs and system color bands; ledger row severity treatments for `CREDIT_CRISIS` / `DEFAULT` / `REBELLION`; tracks panel warning bands; distinct Market Shock vs Republic Debate card chrome; endgame posture chips + drop-cap narration; "Balance Evidence Run" batch modal; responsive ≤ 768 px breakpoint; print stylesheet. Design-system reference under `release/design-system/`.

**Mechanics-preservation evidence:** v0.18 promotion audit 44 / 44 PASS. CANONICAL-400 balance bands held: Treasury 60.0 % / Merchant 23.5 % / Manufacturer 16.5 %. 100-seed canonical state hash 3189375454 byte-identical between Node sim and polished HTML.

**Caveat:** v0.18 mechanics are simulation-verified, not yet human-playtested.

**This release candidate covers Stage A only.** No npm publish, no tag, no GitHub release until the release train is authorized as a separate step.

---

## v1.0.2 — Branding correction: it's a board game, not a "prototype" — 2026-05-19

The product is shipped, signed, versioned, and on npm. "Prototype" language was design-time scaffolding that should have been retired at v1.0.0. This release removes that language across all user-facing surfaces.

**Changes:**

- Renamed `release/board-game/sovereign-prototype.html` → `release/board-game/sovereign-board-game.html`. Updated `bin/sovereign.js` `--print` resolution and the smoke tests to match.
- Swept "prototype" out of README.md, CHANGELOG.md, release/README.txt, release/00-START-HERE.html, release/board-game/README.txt, release/board-game/V0.10-RULES-ALIGNMENT.md, site/src/site-config.ts, site/src/content/docs/handbook/getting-started.md, site/src/content/docs/handbook/reference.md, site/src/content/docs/handbook/design-history.md, bin/sovereign.js, and test/smoke.test.mjs.
- Replacement language: "printable edition" or "printable board game" depending on context. The board game stays at v0.2 balance per the existing freeze; nothing in the rules changes.
- Historical phase names that contained "prototype" (e.g. "Phase 2 — Static clickable prototype") and audit document titles that contained "Prototype" remain unchanged — those are accurate archival references to the named build phases and the original audit document title. They live in `design-history/` and the print-audit's own title.

No game-logic, balance, or behavior changes. CLI flags unchanged. Existing v1.0.0 / v1.0.1 saves still load.

Translation re-run required (README.md changed). User runs polyglot locally before tag push.

---

## v1.0.1 — Printable v0.10 Rules Alignment Delta — 2026-05-19

Adds `release/board-game/V0.10-RULES-ALIGNMENT.md`: a delta sheet that lists the eight rule changes a physical table would apply on top of the v0.2 printable edition to play at v0.10 balance. The printable board-game HTML itself remains frozen at v0.2 (no human-table playtest has been run); this delta is opt-in for groups reprinting at v0.10 rules.

The eight deltas: Industrial Charter setup grant · Capacity +1 on first industrial purchase · Capacity ≥ 8 payment bonus +25% → +50% · Capacity ≥ 10 industrial milestone (new) · Full Mfg / Strategic set completion bonuses (new) · Cash IP scoring 1 per 200 TN → 1 per 400 TN · NF Credit endgame bonus 5-IP-split → +1/+2 per qualifying owner · Report on Manufactures capital event (now includes 50 TN per Mfg/Strategic owned + Strategic upgrade halving).

No game-logic changes. No CLI changes. No digital-mode changes. No npm package shape changes. Pure documentation / table-tool addition. v1.0.x patch shape verified clean.

---

## v1.0.0 — Initial Release — 2026-05-19

Full-treatment Phases 0–7 executed. npm package `@mcptoolshop/sovereign@1.0.0` published with Sigstore provenance. GitHub Release with offline-play zip. Landing page and Starlight handbook deployed. README translated to 7 languages (ja, zh, es, fr, hi, it, pt-BR) before tag.

---

## Board Game

### v0.2 balance candidate — FROZEN 2026-05-18

The printable board-game artifact. 34 US Letter sheets, 40-space board, 22 properties + 4 routes + 2 institutions, 8 color systems, 7 Acts of Congress in fixed historical order, 4 player roles, 3 shared tracks (Public Credit · Public Resistance · Industrial Capacity), 12+12 event cards, 5 distinct card backs.

**Balance levers (v0.2 changes from v0.1):**

| Change | Effect |
|---|---|
| Route ladder | 25 / 50 / 100 / 200 → **25 / 50 / 100 / 150** (4-route reduced) |
| Coinage Act | 25 TN per player → **50 TN from each other player + Credit +1 + Capacity +1** |
| Industrial Capacity thresholds | ≥ 8 and ≥ 10 → **≥ 6 and ≥ 8** (lowered) |
| Revolutionary Debt bases | Continental 2 / Soldier Pay 4 → **Continental 4 / Soldier Pay 6** |

Supported by:
- **FC-EM-002 economy audit** — corrected expected-value math after the original audit was rejected for double-counting and total-rent attribution errors.
- **Print / Digital audit** — usability and accessibility verification for the printable artifact.

---

## Solo / Digital Mode

Layered, fully additive build over the v0.2 balance candidate. Every phase preserves all prior phases byte-identical. Determinism is enforced by `mulberry32(state.rngSeed)` as the sole RNG; opponent decisions are pure functions of visible state.

### Phase 1 — Concept · FROZEN
Design contract: state model, 8 surfaces, 3 solo modes, 4 opponent profiles spec, acceptance criteria.

### Phase 2 — Static clickable prototype · FROZEN
8 surfaces rendered with placeholder state, 11-step walkthrough, accessibility floor.

### Phase 3 — Local state machine · FROZEN
Real reducer / dispatch pattern, seeded determinism, full 7-lap game loop, all 40 spaces, all 24 cards, all 7 Acts, scoring from rules.

### Phase 4 — Scripted opponents · FROZEN
Migration to `players[]`, two MVP profiles (Treasury / Finance, Merchant / Infrastructure), auction mechanic, multiplayer rent. Plus the Act-vote orchestration maintenance patch.

### Phase 5 — Narration · Replay · Save / Load · FROZEN
25-entry narration library derived from ledger (does not mutate state). Save / load with hash integrity. Replay scrubber reconstructs from `initialState(seed) + decisionLog`.

### Phase 6 — Local balance telemetry · FROZEN
Post-game balance report, batch simulation (10 / 50 / 100 games per config), exportable JSON + HTML, Manufacturer / Industry profile (3rd of the 4-profile concept doc roster).

### Phase 6.1 — Telemetry hygiene · FROZEN
Fixed name-keyed attribution → slot-indexed, split rentNet from netCashFlow, broke out routes / institutions buckets, mirror-batch slot identity preserved.

---

## Balance Evolution (post Phase 6.1)

All driven by deterministic 400-game evidence passes (4 configs × 100 seeds 2026–2125, sometimes also CANONICAL × 400).

### v0.3 — Diagnostic balance attempt
- NF Credit endgame bonus: `5 IP split among NF owners if Credit ≥ 8` → **`+1 per qualifying NF owner at Credit ≥ 8; +2 at Credit = 12`**.
- Report on Manufactures: added **`50 TN per Mfg / Strategic owned`** capital event.
- Capacity ≥ 8 payment boost: +25% → **+50%**.

**Result:** Treasury 76% / Merchant 22% / Manufacturer 2%. Manufacturer cash-starved.

### v0.4 — Industrial scoring layer
- Industrial Capacity ≥ 10 milestone: **+2 IP per qualifying industrial system, stacking with the ≥ 8 bonus (max +8)**.
- Industrial set completion bonuses: **full Mfg +3 IP, full Strategic +2 IP**.

**Result:** Treasury 73% / Merchant 21% / Manufacturer 6%. Scoring buffs firing but Capacity track stays cold.

### v0.5 — Capacity dynamics
- **Industrial Capacity +1** on first acquisition of any Manufactures or Strategic Industry property from unowned state.

**Result:** Treasury 73% / Merchant 21% / Manufacturer 6%. Track moves in MFG-MIRROR but not in CANONICAL.

### v0.6 — Manufacturer policy relax
- Removed the set-completion gate from Manufacturer / Industry profile decisions. Set completion becomes a tie-break preference, not a buy gate.

**Result:** Treasury 73% / Merchant 22% / Manufacturer 5%. Profile change didn't move the needle.

### v0.7 — Acquisition funnel telemetry (no game change)
Diagnostic instrumentation: landing opportunities, buy outcomes, cash-at-opportunity, auction access, turn-order geometry, five-hypothesis classifier.

**Finding:** H1 confirmed — slot 2 (where Manufacturer was seated) gets fewer industrial landings (0.45) than slot 0 (0.68) or slot 1 (0.64) due to dice geometry, regardless of profile.

### v0.8 — Manufacturer Industrial Charter
- At game setup, the first Manufacturer / Industry slot receives **Textile Works** as a starting Industrial Charter (0 TN, Capacity +1). Property counts normally for rent, set completion, Report on Manufactures payouts, and scoring.
- Diagnostic CANONICAL-SLOT-SWAP control batch (Manufacturer in slot 0, charter disabled) confirms slot and charter effects are approximately interchangeable.

**Result:** Treasury 68% / Merchant 21% / Manufacturer 11%. **Manufacturer enters the 10–25% target band for the first time.**

### v0.9 — Treasury scoring decomposition (no game change)
Counterfactual analysis per Treasury win: zero out each scoring category, re-rank, count Treasury-still-wins. Thesis-damage ranking selects the cleanest nerf candidate.

**Finding:** `cashIP` is the load-bearing source. Treasury wins drop from 269 / 400 to 71 / 400 when `cashIP` is removed. `cashIP` appears in 93.7% of Treasury wins. NF Credit bonus is decorative; cash hoarding is the load.

### v0.10 — Cash scoring nerf · FROZEN
- Cash Influence: **1 IP per 200 TN → 1 IP per 400 TN** (floor).

**Result (CANONICAL × 100):** Treasury 59% / Merchant 25% / Manufacturer 16%. **All six balance targets PASS.** CANONICAL × 400 reinforcement: Treasury 61.0%.

---

## Determinism guarantee

Same seed + same human decisions = byte-identical ledger across runs, browsers, and time.
- Single RNG: `mulberry32(state.rngSeed)`.
- Opponent decisions: pure functions of visible state.
- Save / load roundtrip preserves state hash.
- Replay reconstructs from `initialState(seed) + decisionLog`.
- Verified across 1,000+ deterministic games during the v0.2 → v0.10 balance arc.

## Operating model

Local-only. No network calls. No accounts. No cloud sync. No LLM opponents.
The full game, all profiles, all telemetry, and all batch infrastructure live in one self-contained HTML file.

## Known caveats

- Capacity thresholds (≥ 6, ≥ 8, ≥ 10) remain rare in canonical play (≥ 6 reached in only 4 / 100 games). The endgame industrial scoring exists as a ceiling, not a regular path.
- Treasury remains intentionally the strongest profile, in line with the historical thesis.
- Failure events (Default / Rebellion / Bankruptcy) fired 0 / 400 times in the v0.10 evidence pass. Their threat is currently decorative.
- Balance is simulation-tested only. Not yet human-playtested.
- The Opportunist / Cash profile (4th profile in the concept document) is deferred. The locked v0.10 competitive set is Treasury / Merchant / Manufacturer.
