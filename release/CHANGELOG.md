# Sovereign — Changelog

> A Hamilton-system Monopoly-grammar board game and its solo / digital adaptation.
> Two artifact streams, one design thesis: **debt → credit → bank → industry**.

---

## v1.1.1 — Digital mode beta: human playability rebuild + 12-round pacing + mandate victory — 2026-05-20

**Beta release.** Second attempt at the digital mode after v1.1.0 was withdrawn the same day it shipped (2026-05-20). v1.1.0 simulation-verified but failed first cold human play; v1.1.1 fixes the structural human-playability gaps that audit could not catch. Not fully cold-validated end-to-end; shipping as beta so anyone who wants the digital mode can opt in while the player experience continues to settle.

**What's new vs v1.0.2:**

- **Human playability rebuild (Pass 1 + Pass 2).** Action rail moved above the board (visible without scrolling). Positions strip shows each player's location, cash, and Influence with active-player highlight. Portfolio strip near the action rail surfaces holdings without requiring the sidebar. Right sidebar collapsed by default with `▶ Panels` toggle so the board occupies more real estate. 26 px tokens with active-player halo and `YOU` pointer. Designer-only chrome (Balance Sweep, seed pill, version pill, phase pill, canonical/telemetry labels) hidden by default; visible only with `?designer=1`. Real dice-roll overlay (~3.3 s, deterministic outcome). Acts explain their effect before the YES / NO vote. First-round helping-hand footer fades after lap 1.
- **Rent surfacing (Pass 3).** New landing-outcome band synthesized from existing ledger rows. Opponent property: "You landed on Hamilton's Customs House. Paid 40 TN rent." Opponent route: "Paid 50 TN route toll." Opponent institution: "Paid 70 TN institution payment." Own property: "No rent due" (plus "Upgrade available" when applicable). Tax space: "Paid 200 TN in tax." Sent-to-Crisis surfaces too. No reducer change; the band reads rows the ledger already wrote.
- **12-round pacing.** Game length extended from 7 rounds (21 turns total) to 12 rounds (36 turns total). Acts still fire in rounds 1-7 as before; rounds 8-12 are Late Republic rounds with no new Acts. Diagnostic across CANONICAL × 100: average board circuits per player 1.24 → 2.12, average upgrades per game 3.3 → 11.0, average rent events 2.2 → 5.8. Treasury share drops 59 % → 52 % because cash gets spent on upgrades instead of hoarded for scoring. Merchant 25 % → 32 %. Manufacturer holds at 16 %. Player-facing language: "Lap" → "Round" throughout chrome.
- **Mandate victory model.** From end of round 8, a player with at least 15 Influence and a 5-point lead over second place triggers Final Accounting and ends the game early. If no mandate triggers by end of round 12, the existing hard-cap scoring decides. Diagnostic across 100 games: 62 / 100 end by mandate (median round 9), 38 / 100 by hard cap. Treasury mandate share 53 % — no runaway. All three profiles win mandates. Designer-overridable via `?designer=1&mandate_threshold=N&mandate_lead=N&mandate_min_round=N&mandate_hard_cap=N`.
- **Influence visibility.** Each player's current Influence shows in the positions strip from round 1. Starting round 8, a compact mandate-distance badge appears on the leader: "Hamilton · 14 IP · 1 from threshold, +2 lead needed."

**Mechanics preservation:**

| Item | Status |
|---|---|
| Card effects (Market Shock, Republic Debate) | Untouched from v0.18 |
| Act effects | Untouched |
| Reducer logic apart from round cap + mandate check | Untouched |
| Scoring math (cashIP 1 per 400 TN, sets, upgrades, institutions, NF Credit endgame, Capacity bonuses) | Untouched |
| Profile decision functions (Treasury, Merchant, Manufacturer) | Untouched |
| Track thresholds (Credit Crisis ≤ 4, Default = 0, Rebellion = 12) | Untouched |
| RNG (`mulberry32(state.rngSeed)`) and deck order | Untouched |
| v0.18 Credit Crisis intermediate failure event | Preserved (now fires ~2 / 100 instead of 0 / 100 because pressure has more time to compound) |
| Rent math | Untouched (the band surfaces existing reducer rent; doesn't change the math) |
| Designer gate (`?designer=1`) | Preserved + extended for mandate URL flags |

**Save format:**

`SAVE_VERSION = 'v0.20-mandate-candidate'`. Saves from v0.18 (v1.1.0) and v0.19 (interim pacing candidate) refuse to load with a clear non-crashing message. v1.0.0 / v1.0.1 / v1.0.2 do not run the digital mode, so no save compatibility concern there.

**Beta caveats:**

- Numbers held to the diagnostic on the in-HTML batch simulation (62 / 100 mandate vs predicted 67 / 100; 51 / 33 / 16 winner split exactly matching predicted), but the candidate has not been cold-walked end-to-end by a fresh human player. Beta tag is the safety net.
- Behavioral adaptation is unmeasured: the AI profiles do not yet "race for the mandate" — they play the same decision functions as v0.18, just with more rounds available. Real human players may behave differently; trigger rate may shift.
- Bankruptcy emerges as a new soft-pressure dynamic in longer games (7 / 100 events at 12 rounds with mandate, vs 18 / 100 without mandate, vs 0 / 100 at 7 rounds). The mandate model partially defuses it because games end before late-game cash stress accumulates. Worth observing.

**npm history note:**

v1.1.0 remains on npm as an unrecommended historical version. `npm install @mcptoolshop/sovereign` resolves to v1.1.1 (`latest`).

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
