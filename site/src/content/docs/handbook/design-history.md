---
title: Design History
description: How Sovereign was balanced from v0.2 to v0.10, then built out from v1.1 to the v1.5.0 beta — with evidence.
sidebar:
  order: 5
---

Sovereign's history has two arcs. First a **balance arc** (v0.2 → v0.10): a nine-version push from "Treasury crushes everything" to "three viable economic paths," every change driven by deterministic simulation evidence — 100-game or 400-game batches against fixed seed sequences, never guesswork. Then a **feature arc** (v1.1 → v1.5): the structural and experiential build-out that turned a balanced simulator into a deep, honest, history-teaching game, while keeping the proven mechanics byte-identical.

## The two artifact streams

Sovereign exists as two artifacts:

1. **The printable board game** — a 34-sheet edition with the original Hamilton-system mechanics, stable at **v0.2** until human-table playtest evidence exists.
2. **The solo / digital game** — a self-contained HTML game that runs the same rules locally with deterministic AI opponents, now at **v1.5.0 beta**.

**The digital mode runs ahead because simulation is cheaper than reprinting.** Its balance was frozen at v0.10; everything after v1.0.0 is the feature arc layered on top of those frozen mechanics.

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

5. **Don't chase 33 / 33 / 33.** Treasury is *supposed* to be the strongest profile. That matches the historical thesis: public credit + federal finance were Hamilton's dominant lever. The target was Treasury 45–65, not Treasury 33. Treasury at 59% at v0.10 with two other viable paths met that target — and the feature arc below kept the band intact (Treasury 48% at v1.5.0) while making the other paths richer.

## Hard invariants preserved across all 9 versions

- 17-action reducer shape (Phase 3's 16 + Phase 4's AUCTION_BID).
- `mulberry32(state.rngSeed)` as sole RNG.
- Same seed + same human decisions = byte-identical ledger.
- No `fetch`, no `XMLHttpRequest`, no `WebSocket`, no `sendBeacon`, no `postMessage` to external origins.
- `route ladder 25 / 50 / 100 / 150`, Coinage Act effect, Revolutionary Debt bases (Continental 4 / Soldier Pay 6), Capacity ≥ 6 payment threshold (+25%) — all locked.

## The feature arc (v1.1 → v1.5)

With balance frozen at v0.10 and v1.0.0 shipped (full-treatment: npm, Sigstore provenance, landing page, this handbook, seven translations), the work turned to depth and experience. The discipline held throughout: **no reducer mechanic or scoring formula changed.** Every layer below wraps the frozen v0.18 engine.

| Version | What it added | Why |
|---|---|---|
| **v1.1.0 → v1.1.1** | Human-playability rebuild after v1.1.0 failed first cold play: action rail above the board, positions / portfolio strips, real dice overlay, Acts explain before the vote. A 12-round + mandate-victory model. | Simulation-passing ≠ human-playable. The first cold walk found gaps audit couldn't. |
| **v1.1.2** | **Circuit victory** replaces the round-cap-with-mandate ending. The game now ends when a player completes their fourth circuit; median jumps to ~23 rounds. Human-voice copy throughout. **Trigger ≠ winner** (only ~33% of games). | The mandate ending felt arbitrary — it ended by clock, not by winning the Republic. Carrying your faction across the line is a better story; rewarding the heaviest ledger keeps it about economic depth. |
| **v1.2 (internal)** | **Strategic depth**: profile-locked Special Actions, six timed HAND cards (hand cap 2), the Reform recovery action, multi-stage Public Credit pressure (Doubt / Crisis / Panic / Default) wrapping the v0.18 hierarchy. | Give the human levers the AI doesn't fully exploit — decisions to *make*, not just rolls to take. |
| **v1.3 (internal)** | **Strategic arc**: eight Federal Era events from round 8, three Profile Visions (+3 IP). "Late Republic" → "Federal Era" (the accurate, non-Roman-decline period name). Late-game empty windows cut from 8/100 to 2/100. | The late game was empty once the Acts stopped. Events and Visions give rounds 8+ stakes. |
| **v1.4.0 (beta)** | **The Chronicler**: a named third-person historical narrator, 14 event-bound banners, sourced from a verified pack of 27 real quotes (Hamilton / Madison / Jefferson / Adams / Gallatin / Maclay / Freneau) traceable to founders.archives.gov, Wikisource, and the Library of Congress. Failed Acts narrated as counterfactuals to real history. **Zero fabricated attributions.** | The game teaches the founding of US public credit; the history should be present, accurate, and honest about where your Republic diverged from the real one. |
| **v1.5.0 (beta)** | The "make it fun" arc, driven by a dogfood swarm (see below). | Turn a correct, deep simulator into a game people *enjoy* playing — without breaking determinism or the balance band. |

### v1.5.0 — the dogfood swarm

v1.5.0 was produced by a multi-agent dogfood swarm: a health pass (the auction soft-lock and seven other findings fixed), a study-swarm of ~40 sourced findings on game-feel, then parallel feature work, each layer gated by a live-DOM playability harness and a balance re-validation. What shipped:

- **The Credit Spiral** — the keystone. Failure was decorative (Default / Rebellion fired 0/400 at v0.10); now falling out of the Stable band charges a compounding debt-servicing cash levy, telegraphed every round by an always-visible forecast gauge, that self-accelerates toward Default if neglected but pauses the round after any Reform or credit-up. It is *felt, compounding, visible, and recoverable*, and it carries the civic thesis: this is why public credit was worth fighting for. Re-validated CANONICAL × 100 — Public Doubt 77/100, Credit Crisis 29/100, ~41% of crisis games recover.
- **Rival presence** — Influence standings and opponent posture, to kill the "parallel solitaire" dead air.
- **Juice + sound** — presentation-only choreography and audio, with a SPEED setting (Cinematic / Normal / Instant) and an INSTANT mode that bypasses all of it. Strictly render-layer; the harness asserts INSTANT-safety.
- **The Chronicler's informative layer (Tier B)** — Learn More popovers, the searchable **Chronicler's Ledger** encyclopedia, and glossary tooltips. Just-in-time depth that never blocks play.
- **Swift-Start onboarding** — a non-blocking guided opening (the 1790 Funding Debate) that tracks real play, plus a "hide nothing" action telegraph on every affordance.

The balance band held: live CANONICAL × 100 measures **Treasury 48% / Merchant 34% / Manufacturer 18%**, median 22 rounds, 100/100 circuit-end, and the tolerance gate passes.

## What's deferred / honest caveats

- **v1.5.0 is a beta.** Each layer was structurally audited and gated by the playability harness and balance re-validation, but the full stack has not been cold-walked end-to-end by a fresh human player.
- **The AI does not yet adapt to the v1.2–v1.5 layers.** Opponents run the proven v0.18-era decision functions — they don't race for the Vision, time HAND cards, or steward against the Credit Spiral the way a human will. Real human play will diverge from the CANONICAL × 100 numbers.
- **Panic / Default / Rebellion remain rare.** The Credit Spiral made Public Doubt and Credit Crisis common and felt, but the deepest tiers still seldom fire (Panic ~1/100, Default ~0/100). That is by design — the spiral is meant to bite and be climbed back from, not to routinely end the Republic.
- **Opportunist / Cash profile** (the 4th concept-doc profile) is still deferred. The competitive set is three.
- **Human playtest.** Balance and feel are simulation- and harness-tested; sustained human play against the scripted opponents may shift these rates.

## Next

- [Security](../security/) — threat model and data handling.
