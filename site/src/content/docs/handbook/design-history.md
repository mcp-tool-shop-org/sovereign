---
title: Design History
description: How Sovereign was balanced from v0.2 to v0.10, with evidence.
sidebar:
  order: 5
---

The balance arc was a nine-version push from "Treasury crushes everything" to "three viable economic paths." Every change was driven by deterministic simulation evidence — 100-game or 400-game batches against fixed seed sequences — not by guesswork.

## The two artifact streams

Sovereign exists as two artifacts:

1. **The board game (v0.2 baseline)** — a printable 34-sheet edition with the original Hamilton-system mechanics.
2. **The solo / digital adaptation** — a self-contained HTML simulator that runs the same rules locally with deterministic AI opponents.

The board game stays at v0.2 until human-table playtest evidence exists. The digital mode is at v0.10. **The digital mode runs ahead because simulation is cheaper than reprinting.**

## Phase-by-phase build (Solo / Digital)

| Phase | What it added | Audit |
|---|---|---|
| **Phase 1** | Concept doc: state model, 8 surfaces, 3 solo modes, 4 opponent profiles spec | — |
| **Phase 2** | Static clickable prototype proving the 8 surfaces and the 11-step turn loop | — |
| **Phase 3** | Local state machine: real reducer, full 7-lap game, all 40 spaces, all 24 cards, all 7 Acts, scoring from rules | 3 bugs found + fixed |
| **Phase 4** | Scripted opponents: `players[]` array, two MVP profiles, auction mechanic, multiplayer rent, vote tallying | 6 bugs found + fixed; Act-vote orchestration maintenance patch |
| **Phase 5** | Narration library, save / load with hash integrity, replay scrubber | PASS, no fixes |
| **Phase 6** | Local balance telemetry, batch simulation, Manufacturer profile | 1 bug found + fixed (card-choice phase leak) |
| **Phase 6.1** | Telemetry hygiene: slot-indexed attribution, rentNet split, asset bucket cleanup | byte-identical to Phase 6 |

Every phase is fully additive: the reducer body, action set, scoring formula, opponent decision functions, and v0.2 anchors all remain byte-identical from one phase to the next. Phase 7 is "no new code, just data" — the architecture supports new telemetry without touching gameplay.

## Balance arc

| Version | Change | CANONICAL split (T / Mc / Mfg) |
|---|---|---|
| v0.2 | Board-game baseline | 81 / 18 / 1 — Treasury runaway |
| **v0.3** | NF Credit nerf · Manufactures capital event · Capacity ≥ 8 payment +50% | 76 / 22 / 2 — Mfg cash-starved |
| **v0.4** | Capacity ≥ 10 milestone · industrial set bonuses | 73 / 21 / 6 — Mfg gets scoring potential but Capacity track stays cold |
| **v0.5** | Capacity +1 on first industrial purchase | 73 / 21 / 6 — Capacity moves in MFG-MIRROR, not CANONICAL |
| **v0.6** | Manufacturer set-completion gate relaxed | 73 / 22 / 5 — profile fix didn't move the needle |
| **v0.7** | *Telemetry only.* Acquisition funnel diagnostic | Same — but reveals slot 2 lands on industrial spaces less due to dice geometry |
| **v0.8** | Manufacturer Industrial Charter (starting Textile Works at setup) | 68 / 21 / **11** — Mfg enters the 10–25% target band for the first time |
| **v0.9** | *Telemetry only.* Scoring decomposition + counterfactual | Same — but reveals cashIP is what's keeping Treasury at 68% |
| **v0.10** | Cash scoring 1 IP per 200 TN → 1 IP per 400 TN | **59 / 25 / 16** — all three profiles in target band · FROZEN |

## What the evidence taught

1. **Don't trust the obvious cause.** v0.6's hypothesis — that Manufacturer's set-completion gate was suppressing buys — didn't survive evidence. The gate was real, but not load-bearing. Real cause was slot-geometry (v0.7 diagnostic).

2. **Telemetry hygiene matters.** Phase 6's first batch reported `industrial buys per player: Treasury 0.65 / Merchant 0.59 / Manufacturer 0.40`. That was a measurement artifact — name-keyed attribution failed in mirror batches. Phase 6.1 fixed it. Slot-indexed attribution revealed Mfg captures **all** the industrial assets it lands on; the limit is reaching them.

3. **The right lever is sometimes a level lower.** v0.4 added scoring rules for Capacity ≥ 8 and ≥ 10 thinking that would tip Mfg over. It didn't — because the Capacity track wasn't reaching those thresholds. The actual fix was v0.5 (Capacity +1 on purchase), v0.8 (Industrial Charter), and a track that climbs as industry is bought.

4. **Treasury was never about NF Credit.** The v0.3 NF Credit nerf was philosophically clean but mechanically minor. The v0.9 counterfactual showed cashIP (the generic "cash held" Influence source) was the load-bearing line for Treasury, not the Hamilton-thesis scoring. v0.10 nerfed cashIP and Treasury fell into band.

5. **Don't chase 33 / 33 / 33.** Treasury is *supposed* to be the strongest profile. That matches the historical thesis: public credit + federal finance were Hamilton's dominant lever. The target was Treasury 45–65, not Treasury 33. Treasury at 59% with two other viable paths *is* the win condition for the design.

## Hard invariants preserved across all 9 versions

- 17-action reducer shape (Phase 3's 16 + Phase 4's AUCTION_BID).
- `mulberry32(state.rngSeed)` as sole RNG.
- Same seed + same human decisions = byte-identical ledger.
- No `fetch`, no `XMLHttpRequest`, no `WebSocket`, no `sendBeacon`, no `postMessage` to external origins.
- `route ladder 25 / 50 / 100 / 150`, Coinage Act effect, Revolutionary Debt bases (Continental 4 / Soldier Pay 6), Capacity ≥ 6 payment threshold (+25%) — all locked.

## What's deferred

- **Failure events** (Default, Rebellion, Bankruptcy). Fired 0 / 400 times in the v0.10 evidence pass. Currently decorative. May be revisited if the design ever pushes into a v0.5 fail-state pressure arc.
- **Opportunist / Cash profile** (the 4th concept-doc profile). Locked v0.10 set is 3 profiles.
- **Human playtest.** Balance is simulation-tested only. Strategic deviation by a human against scripted opponents may shift these rates.

## Next

- [Security](../security/) — threat model and data handling.
