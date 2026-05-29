# The Credit Spiral — keystone design spec (v1.5)

**Status:** APPROVED by director (2026-05-29) — "proceed into the keystone now (rebalance + re-validate)."
**Grounding:** `failure-tension.md` (B2) + `civic-efficacy-onboarding.md` (B4) + code finding A2-03.
**Owner file:** `release/digital-mode/sovereign-solo.html` only.

## Problem (measured)
Failure is decorative: Crisis fires ~0–2/100, Default/Rebellion ~0/100. Root causes in code:
1. Tiers (Doubt ≤6 / Crisis ≤4 / Panic ≤2 / Default 0) are **one-shot flagged events** (`publicDoubtFired`/`panicFired`) — no compounding, and **Doubt has zero mechanical bite**.
2. The descent rarely starts: credit-UP sources (Acts + the Treasury federal-bond special action, which pumps +1 whenever Credit ≤6) out-recur the few credit-DOWN sources (A2-03).
3. Recovery is trivial (cross back up → flags clear → no lasting damage).

## Thesis
Make Public Credit a **felt, compounding, visible, recoverable** pressure the player can trigger and live through — which simultaneously **is** the civic argument (procedural rhetoric, B4): you learn why sound public credit matters by surviving its collapse, not by reading a banner.

## Design — five parts (ALL deterministic; ALL applied inside `reduce()`, replay-safe)

### 1. Slide tracking (new flag)
`s.flags.creditSlideRounds` — increments at `BEGIN_LAP` while `creditTier ≤ doubt` (Credit ≤6); resets to 0 when Credit returns to stable (≥7). Persisted in state (hashed → replay-safe). Add to `initialState`, include in `snapshotHash` (it's part of the strengthened hash already covering flags).

### 2. Debt-servicing levy (the felt, compounding, own-resource cost)
At `BEGIN_LAP`, if Credit ≤6, each player pays a CASH levy = `BASE[tier] × (1 + SLIDE_K × creditSlideRounds)`, capped at `LEVY_CAP`. Hits the player's OWN cash, logged visibly each round ("Debt servicing · Credit N · −X TN"). Loss aversion + endowment (B2). Tunable knobs:
- `BASE = { doubt: 10, crisis: 25, panic: 45 }` (starting values — TUNE)
- `SLIDE_K = 0.5` (compounding rate — TUNE)
- `LEVY_CAP = 120` (prevents instant bankruptcy — TUNE)
Applied via `adjustCash` inside reduce (already logged + replay-safe). Bankruptcy already costs −1 IP/lap (existing) — the levy can push toward it, which is the felt stake.

### 3. Telegraphed acceleration (point-of-no-return)
If `creditSlideRounds ≥ ACCEL_AFTER` AND tier ∈ {crisis, panic}, Credit −1 at `BEGIN_LAP` (the slide self-accelerates → can reach Default if ignored). Gives the player `ACCEL_AFTER` rounds of warning to act. `ACCEL_AFTER = 3` (TUNE). This is the snowball, but telegraphed — loss is earned, not robbed (B2).

### 4. Relief rebalance (let the slide START — minimal, surgical)
The Treasury federal-bond special action currently pumps Credit +1 whenever ≤6, which cancels slides before they bite (A2-03). Condition it: **federal-bond Credit relief does NOT apply while in panic (Credit ≤2)**, and is capped to once per slide episode at crisis (≤4). It can still help in doubt. (Minimal change — do NOT remove the action; just stop it from trivially erasing a deep slide.) Re-validate that this doesn't over-suppress Treasury.

### 5. Forecast gauge (always-visible, near-miss engineering — B2 lever 3)
The credit gauge shows: current tier label + a forecast line computed from the current slide rate: while sliding, "Public credit falling — Crisis in ~N rounds" or, when accelerating, "Default in ~N rounds — Reform to arrest the slide." Render-time only (read from state; NOT written to hashed ledger). Make Reform's affordance prominent when in danger (it already exists; surface it).

### 6. Civic framing (B4 — the lesson)
The existing Chronicler Doubt/Crisis/Panic/Default banners + the rival posture line should frame the slide as the Republic's credit being its lifeblood ("The Republic borrows against its own faith; each season of doubt raises the price of the next."). Toast-only, not hashed. Do not over-narrate (respect the per-round cap + narration setting).

## Hard constraints (do NOT violate)
- **Replay-safe:** levy + acceleration applied ONLY inside `reduce()` at `BEGIN_LAP` (a logged, replayable action). NO live-driver/out-of-band effects, NO render-layer writes to `STATE.ledger` (we just fixed that class of bug — GATE 5 will catch a regression).
- **Determinism:** no `Math.random`/`Date.now`; levy/acceleration are pure functions of state.
- **Recoverable, not punitive:** tune so a player who Reforms / pays attention recovers a meaningful fraction; Default is a real risk, not a guaranteed death (B2: avoid the unwinnable spiral).
- Preserve circuit victory, scoring, all other v1.2–v1.4 systems.

## Re-validate (the gate — via the LIVE engine, not the v0.10 extract)
Use the in-engine `runBatchGame(seed, triplet)` (boots through jsdom) over **CANONICAL × 100, seeds 2026–2125**, triplet `['treasury-finance','merchant-infrastructure','manufacturer-industry']`. Measure and report:
- **Win bands** (winner = max `scorePlayer().total` at gameOver). TOLERANCE: Treasury remains strongest; **no profile <12% or >65%**; drift from 59/20/21 documented.
- **Failure firing / 100:** Doubt, Crisis, Panic, Default, Rebellion (scan ledger events). TARGET: Crisis now fires **meaningfully** (aim ≥25/100), Panic/Default occur but are **not** the common case; the spiral is visible in the data.
- **Recoverability:** of games that enter Crisis, what fraction recover (end stable) vs reach Default. Want a healthy mix (not 100% death, not 100% trivial recovery).
- **Median game length** (laps): circuit-end ~23 preserved (no large drift).
- Run determinism (two batch runs of a seed byte-identical) + the playability harness (5 gates, esp. GATE 5 replay).

TUNE the knobs (BASE/SLIDE_K/LEVY_CAP/ACCEL_AFTER + relief gating) to hit the tolerance. Single-lever discipline: change one knob, re-measure. Document the final knobs + the before/after bands + failure rates.

Caveat (carry forward): AI profiles run v0.18 decision functions and do NOT adapt to the spiral (A2-01) — the batch is a **calibrated starting line, not the final answer**. Human play (doctrine gate 6) is the real test of whether the spiral is fun + recoverable.
