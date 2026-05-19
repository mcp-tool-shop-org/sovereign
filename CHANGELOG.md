# Sovereign — Changelog

> A Hamilton-system Monopoly-grammar board game and its solo / digital adaptation.
> Two artifact streams, one design thesis: **debt → credit → bank → industry**.

---

## v1.0.1 — Printable v0.10 Rules Alignment Delta — 2026-05-19

Adds `release/board-game/V0.10-RULES-ALIGNMENT.md`: a delta sheet that lists the eight rule changes a physical table would apply on top of the v0.2 printable prototype to play at v0.10 balance. The board-game prototype HTML itself remains frozen at v0.2 (no human-table playtest has been run); this delta is opt-in for groups reprinting at v0.10 rules.

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
