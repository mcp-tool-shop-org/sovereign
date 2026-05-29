# Sovereign Pacing Diagnostic Pass 1 — Report

**Generated:** 2026-05-20
**Harness:** `tools/diagnosis/sim-pacing-diag.mjs` (v0.18 mechanics + configurable `TOTAL_ROUNDS` lever)
**Runner:** `tools/diagnosis/run-pacing-diag.mjs`
**Raw data:** `experiments/pacing-diag/raw-data/`

---

## TL;DR

> **Recommendation: MOVE TO 12 ROUNDS WITH SAME ACT CADENCE.**
>
> 12 rounds (Acts in rounds 1-7, Late Republic rounds 8-12) more than doubles meaningful gameplay events per game without breaking the 60 / 23 / 16 win distribution. Treasury share **drops** from 59 % to 52 %, not up. Merchant gains the most (25 % → 32 %). Manufacturer holds at 16 %, but rises to 22 % at 15 rounds.
>
> Late Republic rounds are **not dead**: at 12 rounds, rounds 8-12 produce more upgrade events (774) than the first 7 rounds combined (327), plus 168 buys and 358 rent payments.
>
> Failure pressure is still mostly decorative (Credit Crisis 0 → 2 → 2; Default / Rebellion never fire). Bankruptcy emerges as a new dynamic (0 → 18 → 63 events) — worth a closer look before any balance pass.

---

## Parity check

The diagnostic harness is a copy of `sim-v0.18.mjs` with a configurable `TOTAL_ROUNDS` constant (default 7) and three minimal edits (lap cap, GAME OVER log, `lapsReached` clamp). With `TOTAL_ROUNDS = 7`, the harness must produce byte-identical output to `sim-v0.18`.

**Seed 2026 ledger comparison:**
- `sim-pacing-diag(7)`: 26 334 bytes
- `sim-v0.18`: 26 334 bytes
- **PARITY: PASS** (byte-identical)

The 7-round baseline is a faithful proxy for v0.18 mechanics. Variant B (12 rounds) and Variant C (15 rounds) extend the lap cap without any other reducer change.

---

## Variant comparison (CANONICAL × 100, seeds 2026-2125)

| Metric | A (7 rounds) | B (12 rounds) | C (15 rounds) |
|---|---:|---:|---:|
| **Game length** | | | |
| Total turns / game | 21.0 | 36.0 | 45.0 |
| Turns / player | 7.00 | 12.00 | 14.99 |
| Average dice roll (2d6) | 7.07 | 7.06 | 7.06 |
| **Board circuits / player** | **1.24** | **2.12** | **2.65** |
| Completion rate | 100/100 | 100/100 | 100/100 |
| **Win distribution** | | | |
| Treasury / Finance | 59 % | **52 %** | **44 %** |
| Merchant / Infrastructure | 25 % | **32 %** | **34 %** |
| Manufacturer / Industry | 16 % | 16 % | **22 %** |
| Median margin (IP) | 3 | 4 | 5 |
| **Average final score** | | | |
| Treasury | 10.47 | 15.96 | 18.27 |
| Merchant | 8.44 | 12.60 | 15.05 |
| Manufacturer | 7.71 | 11.53 | 13.62 |
| **Scoring source decomposition** | | | |
| cashIP (Treasury) | 2.74 | 2.18 | 1.96 |
| cashIP (Merchant) | 2.06 | 1.39 | 1.13 |
| cashIP (Manufacturer) | 2.20 | 1.53 | 1.07 |
| Props score (Treasury) | 3.64 | 5.17 | 5.65 |
| Props score (Merchant) | 3.37 | 4.64 | 5.14 |
| Props score (Manufacturer) | 3.17 | 4.47 | 4.98 |
| **Property + upgrade activity** | | | |
| Average properties owned (Treasury) | 4.34 | 6.10 | 6.74 |
| Average properties owned (Merchant) | 5.14 | 7.03 | 7.89 |
| Average properties owned (Manufacturer) | 3.44 | 4.78 | 5.33 |
| Average upgrades owned (Treasury) | 0.54 | 1.74 | 2.29 |
| Average upgrades owned (Merchant) | 0.33 | 1.31 | 1.99 |
| Average upgrades owned (Manufacturer) | 0.36 | 0.98 | 1.34 |
| Total upgrade events / game | 3.27 | **11.0** | **15.5** |
| Total rent events / game | 2.21 | **5.79** | **8.43** |
| Total card events / game | 1.45 | 2.28 | 2.80 |
| Total auction events / game | 7.39 | 10.81 | 12.44 |
| **Acts** | | | |
| Acts passed / game | 1.09 | 1.09 | 1.09 |
| Acts failed / game | 5.91 | 5.91 | 5.91 |
| **Failure systems** | | | |
| Credit Crisis fires (per 100 games) | 0 | **2** (lap 10) | **2** (lap 10) |
| Default fires | 0 | 0 | 0 |
| Rebellion fires | 0 | 0 | 0 |
| Bankruptcy events (player-lap-instances) | **0** | **18** | **63** |
| **Late Republic activity (rounds 8+)** | | | |
| Total ledger rows | — | 9 956 | 15 489 |
| Buy events | — | 168 | 224 |
| Upgrade events | — | 774 | 1 222 |
| Rent events | — | 358 | 622 |
| **Final tracks** | | | |
| Route 4+ frequency | 49 % | 79 % | 91 % |
| Final Credit (median) | 7 | 8 | 8 |
| Final Resistance max | 5 | 7 | 8 |
| Final Capacity max | 7 | 7 | 8 |

---

## Answers to the six specific questions

### 1. Does 12 rounds make the board feel structurally viable?

**Yes.** Every viability indicator improves substantially:

- Board circuits per player: 1.24 → 2.12 (gets just past the "one circuit" floor and into "you're going around the board" territory)
- Average properties owned: 4.3 → 6.1 (across all profiles)
- Average upgrades owned: 0.41 → 1.34 (3× more)
- Upgrade events per game: 3.3 → 11.0 (3.4× more)
- Rent events per game: 2.2 → 5.8 (2.6× more — *the core economic loop fires 2.6× as often*)
- Route 4+ frequency: 49 % → 79 % (the "complete the route" goal becomes achievable)

At 15 rounds the same indicators extend further (circuits 2.65, upgrades 1.87 average, rent events 8.4/game) but at the cost of larger Treasury dominance shift and more bankruptcy events.

### 2. Does Treasury run away?

**No — Treasury share decreases.** Treasury wins drop 59 % → 52 % → 44 %.

The reason is mechanical: the cashIP scoring source (1 IP per 400 TN held) is a function of *cash sitting at game end*, not cash earned. In longer games, players spend that cash on upgrades and auction bids. Treasury's cashIP contribution drops from 2.74 → 2.18 → 1.96. Meanwhile properties / sets / upgrades score linearly with ownership, which everyone accumulates. Treasury still wins outright (it's still the strongest single profile) but the margin narrows.

This is the **opposite** of the hypothesis going in. The 7-round game was not hiding a cash-runaway dynamic — it was suppressing the property / set / upgrade scoring that the other profiles depend on.

### 3. Does Manufacturer improve or collapse?

**Holds flat at 12 rounds (16 %), improves at 15 rounds (22 %).**

Mechanically: Manufacturer / Industry properties are on the far side of the board (spaces 31-39), with the highest costs (300-350 TN) and the heaviest dependence on Industrial Capacity track + set completion bonuses. With more rounds:

- Manufacturer landings rise (because more total turns)
- Capacity track has more time to climb (≥6 reached more often)
- Set completion becomes achievable (Mfg full set: 3 properties, Strategic: 2 properties)

At 12 rounds, Manufacturer is still 16 % — the Industrial Charter setup grant (Textile Works at 0 TN, Capacity +1) is fully load-bearing, and 12 rounds doesn't add enough additional landings to push it above. At 15 rounds Manufacturer hits 22 % — the slow-burn industrial scoring layer finally gets the time it needs.

If the target distribution is still ~60 / 23 / 16, 12 rounds is closer. If the target is more like 50 / 30 / 20, 15 rounds is closer.

### 4. Do failure systems become live?

**Slightly, not meaningfully.**

| Failure | 7 rds | 12 rds | 15 rds |
|---|---:|---:|---:|
| Credit Crisis | 0 / 100 | 2 / 100 (lap 10) | 2 / 100 (lap 10) |
| Default | 0 / 100 | 0 / 100 | 0 / 100 |
| Rebellion | 0 / 100 | 0 / 100 | 0 / 100 |
| Bankruptcy | 0 events | 18 events | 63 events |

The Credit Crisis threshold (Public Credit ≤ 4) almost never reaches in CANONICAL play even at 12-15 rounds — the v0.18 design assumed pressure would compound but the simulation evidence shows it doesn't. **The doctrine line from the v0.18 CHANGELOG — "Failure events fired 0 / 400 times. Their threat is currently decorative." — remains true at longer game lengths.**

The new dynamic is **bankruptcy** (cash below zero). At 12 rounds this is rare (~0.18 events per game across 3 players). At 15 rounds it's noticeable (~0.63 events per game). Bankruptcy in the existing rules costs -1 Influence per lap-bankrupt, so it's a real but soft penalty.

**Implication:** longer games do not by themselves make the failure system live. If the goal is failure pressure as a regular threat, that's a separate design lever (threshold rebalance, profile decision changes, or new pressure sources).

### 5. Do Acts feel too front-loaded?

**No, based on simulation evidence.**

In variants B and C, Acts fire in rounds 1-7 exactly as in baseline (109 passed, 591 failed across both variants — identical to baseline, confirming the Act sequence is unchanged). Rounds 8+ are Late Republic rounds with no scheduled Acts.

The Late Republic rounds are **highly active**:

- **12 rounds (rounds 8-12, 5 Late Republic rounds):** 168 buys, 774 upgrades, 358 rent events. Upgrade events in Late Republic alone (774) **exceed** total upgrade events in the entire 7-round baseline (327).
- **15 rounds (rounds 8-15, 8 Late Republic rounds):** 224 buys, 1 222 upgrades, 622 rent events.

Players are not idle in Late Republic. They're spending their accumulated cash on upgrades, picking up remaining properties at auction, and collecting rents from a more-populated board. This is a "consolidation phase" in the historical Hamiltonian arc, which fits the design thesis.

What this diagnostic cannot say: whether Late Republic rounds *feel* like a meaningful phase to a human player, or whether they feel like "playing out the clock." That's a human-play question.

### 6. Does the game need Act cadence redesign before balance tuning?

**No — based on this evidence, Act cadence (1 Act in rounds 1-7) can stay.** Late Republic rounds are productive without Acts. The Hamiltonian one-Act-per-round-in-historical-order thesis is preserved.

Spaced Acts (model B) and triggered Acts (model C) become later levers if 12-round play feels uneven in human testing — but they should not be the first lever pulled.

---

## Decision criteria evaluation

| Criterion | Evidence | Action |
|---|---|---|
| If 12 rounds improves ownership / rent / upgrades without breaking win bands badly | ✓ All three improve substantially; bands shift 59/25/16 → 52/32/16, not broken | **Continue with 12-round candidate** |
| If 12 rounds makes Treasury dominate | ✗ Treasury share DROPS (59 → 52), opposite direction | No rebalance needed for Treasury runaway |
| If 12 rounds creates dead late rounds | ✗ Late Republic produces more upgrade events than first 7 rounds | No Act cadence redesign needed |
| If 12 rounds still feels too short by movement / property metrics | Marginal — 2.12 circuits is "enough" but not generous | **Consider 15 rounds as fallback if 12 feels tight in cold play** |
| If 12 rounds breaks everything | ✗ All metrics stable or improved | n/a |

---

## Recommended verdict

**MOVE TO 12 ROUNDS WITH SAME ACT CADENCE.**

The 12-round model is the smallest mechanics change that delivers a meaningfully fuller board-game arc. Acts remain in their historical order across rounds 1-7. Rounds 8-12 are economic consolidation. Win distribution shifts mildly (Merchant gains, Treasury loses some, Manufacturer holds) — well within the 60 / 23 / 16 band the v0.10 design targeted.

15 rounds is a viable second candidate if 12-round human play feels tight. It moves more Manufacturer share (16 % → 22 %) but introduces more bankruptcy stress (18 → 63 events) and shifts Treasury share further (52 % → 44 %).

---

## Follow-up questions raised by this diagnostic

1. **Bankruptcy as a new failure dynamic** — at 12 rounds, ~18 player-lap-bankruptcy events per 100 games. Is this intended pressure (good — finally something fires) or a cash-management edge case (bad — players accidentally over-extend)? Worth a per-game ledger walk on one or two bankrupt games to see what's happening.
2. **Credit Crisis still rare** — only 2 / 100 fires even at 15 rounds. If failure pressure is meant to be a regular threat, the threshold or the upstream Credit-drain sources need recalibration. Not a blocker for the pacing decision.
3. **Manufacturer at 16 % in 12 rounds** — same share as baseline. The Industrial Charter is doing its job but the extra rounds don't move Mfg further without an additional lever. If the target is closer to 20 %, 15 rounds gets there; otherwise 12 rounds with Mfg-specific tuning would.
4. **Late Republic identity** — what should rounds 8-12 feel like, narratively? "Consolidation of the Republic"? "Late Federalist period"? Naming and chrome will matter for cold-player onboarding.

---

## What this diagnostic intentionally did not measure

- **Whether 12 rounds feels right to a human player.** That requires a cold walkthrough of the playable build with the 12-round model. This pass measures mechanics, not feel.
- **Whether the Late Republic phase needs new narrative or chrome.** Diagnostic is mechanics-only.
- **Whether Treasury's slight drop is desirable or undesirable.** That's a design call, not a sim finding.
- **Whether bankruptcy emerging as a new dynamic is good pressure or bad UX.**
- **Per-Act effect amplification.** Some Acts (Funding, Bank Charter) compound over more rounds; others (Excise Enforcement = "this lap only" doubling) don't. Worth a follow-up.

---

## Closeout

The 7-round pacing model was tuned for simulation throughput, not for a satisfying human board-game arc. The simulation evidence backs the human-play complaint: at 7 rounds the player goes around the board once (1.24 circuits), buys ~4 properties total, upgrades ~0.4 of them, sees ~2 rent payments, and the game ends before failure pressure fires.

At 12 rounds the same player goes around the board twice (2.12 circuits), buys ~6 properties, upgrades ~1.3 of them, sees ~5.8 rent payments, and the failure system starts to flicker (Credit Crisis fires 2 % of the time, bankruptcy emerges as a real soft penalty).

The Hamiltonian thesis (7 Acts in 7 rounds, historical order) is preserved. The cost is one additional balance question (bankruptcy dynamic) and one additional design question (Late Republic naming and chrome). Neither is blocking.

**Next step:** authorize the 12-round HTML candidate for Claude Design rebuild, with explicit hard invariant that Acts still fire in rounds 1-7 only and the game length lever is the single mechanics change. Then cold walkthrough on the human side to confirm "feel" matches the metric improvement.
