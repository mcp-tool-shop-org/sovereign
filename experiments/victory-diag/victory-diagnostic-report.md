# Sovereign Victory Model Diagnostic — Report

**Generated:** 2026-05-20
**Harness:** `tools/diagnosis/sim-pacing-diag.mjs` (with per-round IP snapshot capture) + `tools/diagnosis/run-victory-diag.mjs`
**Method:** CANONICAL × 100 run once at TOTAL_ROUNDS = 18 with per-round IP snapshots captured. All 495 (min_round × threshold × lead × hard_cap) combinations evaluated post-hoc against the cached snapshots.

---

## TL;DR

> **Recommendation: ADD MANDATE THRESHOLD + HARD CAP.**
>
> Specifically: **min_round = 8, threshold = 15 IP, lead = 5 IP, hard_cap = 12 rounds.**
>
> This triggers a mandate-win in **67 % of CANONICAL × 100 games** at median round 9 (range 8-12), with the remaining 33 % decided at the hard cap. Treasury wins 54 % of mandates (healthy, in line with their 52 % share of the 12-round fixed-cap baseline). Merchant gets 30 % of mandates; Manufacturer 16 %. No profile is locked out. No Treasury runaway. No early-trigger pathology.
>
> Cap-15 variants (threshold 17-19) are also viable, give Manufacturer a slightly higher share (20 % vs 16 %), and shift median trigger to round 10-12. Pick cap=12 if you want a compact game, cap=15 if you want more room for late shifts.

---

## Caveat — behavioral adaptation

This sim measures **"would the mandate rule have triggered given current player behavior?"** It does **not** measure **"how would players adapt if they knew the rule existed and started racing for it?"**

If implemented in the playable HTML, expect player behavior to shift:
- Treasury may spend cash on upgrades (instead of hoarding) to hit threshold faster
- Merchant may push routes harder
- Manufacturer may race through Industrial sets

The actual mandate-trigger rate in human play could be higher (everyone races) or lower (everyone plays defensively against the leader). The recommended starting point from this sim is **a calibrated starting line, not a final answer.** Validate empirically in a candidate HTML.

---

## Sweep results

**Parameter space:**

| Variable | Values | Count |
|---|---|---:|
| min_round | 8, 9, 10 | 3 |
| threshold | 14-24 | 11 |
| lead | 2-6 | 5 |
| hard_cap | 12, 15, 18 | 3 |
| **Total combos** | | **495** |

**Category summary across 495 combos:**

| Category | Combos |
|---|---:|
| Healthy (mandate 30-70 %) | **238** |
| Mostly hard-cap (mandate 5-20 %) | 36 |
| Always triggers (> 90 %) | 54 |
| Never triggers (< 5 %) | 0 |
| Triggers too early (median round < 8) | 0 |
| **Treasury runaway (> 75 % of mandates)** | **0** |
| Manufacturer locked out | 0 |

**Key finding:** 238 of 495 combos hit the 30-70 % mandate-trigger target. No combo produced Treasury runaway. The viable parameter space is wide.

---

## Top 10 candidates (all tied at fit score 100)

| # | min_rd | thresh | lead | cap | mandate % | median rd | T-mandate | M-mandate | Mfg-mandate | avg win IP | avg lead |
|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| 1 | 8 | 15 | 5 | 12 | **67 %** | 9 | 36 | 20 | 11 | 17.0 | 6.0 |
| 2 | 8 | 15 | 6 | 12 | 64 % | 9 | 36 | 18 | 10 | 17.1 | 6.1 |
| 3 | 8 | 16 | 4 | 12 | 68 % | 9 | 34 | 23 | 11 | 17.0 | 6.0 |
| 4 | 8 | 16 | 5 | 12 | 63 % | 9 | 32 | 20 | 11 | 17.1 | 6.0 |
| 5 | 8 | 16 | 6 | 12 | 59 % | 9 | 32 | 18 | 9 | 17.2 | 6.0 |
| 6 | 8 | 17 | 6 | 15 | 67 % | 10 | 37 | 20 | 10 | 19.1 | 6.7 |
| 7 | 8 | 18 | 4 | 15 | 68 % | 11 | 37 | 22 | 9 | 19.3 | 6.4 |
| 8 | 8 | 18 | 5 | 15 | 61 % | 11 | 34 | 19 | 8 | 19.6 | 6.5 |
| 9 | 8 | 19 | 3 | 15 | 69 % | 12 | 40 | 20 | 9 | 19.3 | 6.0 |
| 10 | 8 | 19 | 4 | 15 | 66 % | 12 | 36 | 20 | 10 | 19.7 | 6.4 |

**Patterns:**

- **min_round = 8 dominates the top.** Earlier mandate-check window means more games trigger.
- **Threshold scales with hard_cap.** cap=12 wants threshold 15-16, cap=15 wants 17-19. Threshold is calibrated to the natural distribution of top scores at that length.
- **Lead 4-6 is sweet spot.** Lead=2 or 3 triggers too aggressively; lead > 6 starves the mandate.
- **Treasury mandate share 50-58 %.** Adding mandate threshold does NOT amplify Treasury — it's in line with the underlying fixed-cap Treasury share.

---

## Fixed-cap baselines (for comparison)

What would happen with **no mandate threshold, just a hard cap?**

| Cap | Treasury | Merchant | Manufacturer | Avg winner IP | Avg lead |
|---|---:|---:|---:|---:|---:|
| 12 rounds | 52 % | 32 % | 16 % | 18.5 | 5.3 |
| 15 rounds | 44 % | 34 % | 22 % | 21.8 | 6.4 |
| **18 rounds** | **57 %** | **25 %** | **18 %** | **25.1** | **7.6** |

**Important finding:** Treasury share **goes back UP at 18 rounds** (57 %). The pacing diagnostic showed Treasury dropping 59 % → 52 % → 44 % from 7 → 12 → 15 rounds. But at 18 rounds Treasury catches back up because late-game cash accumulation eventually dominates regardless of upgrade spending. This caps the "longer game = less Treasury dominance" pattern around round 15. Going to 18+ re-introduces the runaway dynamic.

This is a reason to favor **cap=12 or cap=15, not cap=18** in the recommended victory model.

---

## Recommended model — detailed

### Primary recommendation: cap=12 + threshold=15 + lead=5 + min_round=8

**Aggregate behavior:**
- 67 / 100 games end by mandate, 33 / 100 by hard cap
- Median mandate round: 9 (game has run 9 of 12 rounds before someone takes it)
- Earliest mandate round: 8 (first eligible round)
- Latest mandate round: 12 (mandate can fire at the hard cap)
- Average winning IP: 17.0
- Average lead margin at win: 6.0 (vs threshold lead requirement 5)
- Winner profile: T=51 / M=33 / Mfg=16 (essentially the 12-round fixed-cap distribution, just earlier)
- Of mandate wins: T=36 / M=20 / Mfg=11 (54 % Treasury, healthy)
- Of hard-cap wins: T=15 / M=13 / Mfg=5 (Treasury still leads at hard-cap but margin tighter)

**Why this combo:**

1. min_round=8 aligns with the "Late Republic begins after Founding Acts" framing already designed for the 12-round HTML.
2. threshold=15 is just below the 12-round natural top-score average (15.96 from earlier pacing diagnostic). Players who lead the game have a real shot at the mandate; players in 3rd rarely do.
3. lead=5 IP creates a "decisive lead" requirement that prevents lucky single-turn wins.
4. hard_cap=12 keeps the game compact and aligned with the pacing-candidate work already done. No new round-count decision needed.

### Secondary recommendation: cap=15 + threshold=18 + lead=5 + min_round=8

If you want more room for late-game shifts and a slightly higher Manufacturer share:
- 61 / 100 by mandate, 39 / 100 by hard cap
- Median mandate round: 11
- Winner profile: T=45 / M=35 / Mfg=20

Trade-off: longer game (15 rounds), more bankruptcy stress (sim showed 63 events / 100 at 15 rounds vs 18 at 12), needs more UX for the longer arc (different round counter, more Late Republic chrome).

### Models to reject

- **cap=18 anything.** Treasury rebounds to 57 % share even without a mandate. The diminishing-returns pattern of pacing suggests 18 rounds is past the sweet spot.
- **lead=2.** Triggers too easily; one favorable card swing decides games.
- **threshold ≥ 22 at cap=12.** Almost never fires (mandate_pct < 10 %); game just hits hard cap.
- **min_round=10 at cap=12.** Only 2-3 rounds of mandate window left; mandate share drops to ~30 % even at low thresholds.

---

## Mandate model — UX implications (not covered by sim)

If the recommended model lands in the playable HTML, the player needs to see:

1. **Each player's current IP** — visible without opening the sidebar. The positions strip already shows cash; it should also show IP after round 8.
2. **Distance to mandate** — "Hamilton: 14 IP (1 from mandate, lead 3 IP)". Subtle, not a billboard.
3. **Mandate-trigger event** — a clear narrative moment when someone takes the mandate. Not a blocking modal; a dramatic action-rail message: "Hamilton has built a 5-IP lead with 15 Influence. The Federalist project takes the Republic. Final Accounting begins."
4. **Final Accounting** — the existing endgame screen, but framed as "Hamilton triggered the mandate at round 9" rather than "round 12 is up."
5. **Hard cap fallback** — if no one triggers mandate by round 12, the existing round-12 endgame fires with "The Republic finds no clear founder. Final Accounting decides by accumulated Influence." Soft loss of dramatic moment, but still satisfying as a "the system decided."

The IP visibility surface is the bigger UX cost. Worth a sketch before authoring the HTML candidate.

---

## Recommended verdict

**ADD MANDATE THRESHOLD + HARD CAP.**

Specifically:
- min_round = 8
- threshold = 15 IP
- lead = 5 IP
- hard_cap = 12 rounds

This builds on the 12-round pacing decision. Trigger rate of 67 % means most games end via mandate ("someone won"), with the 33 % that don't decided cleanly at the cap. No profile locked out. No Treasury runaway. Median trigger at round 9 gives the game a "race for the mandate in Late Republic" feel.

Secondary candidate: cap = 15 + threshold = 18 + lead = 5. Same shape, longer arc, higher Manufacturer share.

---

## Open questions for the candidate HTML

1. **Behavioral adaptation.** Will player profiles (Treasury, Merchant, Manufacturer) need decision-function changes to play optimally with mandate awareness? Probably yes (e.g., Treasury currently hoards cash; with mandate awareness it would spend on upgrades to hit threshold). Don't tune profiles now — let the candidate HTML run, then measure.
2. **Tie-break.** What if two players hit threshold + lead on the same round? Current rule: highest IP wins (top of sorted list). Document explicitly.
3. **IP visibility cost.** Showing per-player IP after round 8 is a chrome change. May need to be designer-mode at first, then promoted to player-mode after testing.
4. **Hard-cap framing.** If the mandate doesn't fire, the round-12 game-over screen should not feel like "the game ran out." It should feel like "Final Accounting: with no founder dominant, the Republic decides by ledger." Different copy than current "12 rounds complete."

---

## What's in `experiments/victory-diag/`

- `victory-diagnostic-summary.json` — full sweep results, top 20 ranked, all 495 combos with key metrics
- `pacing-diagnostic-report.md` (sibling, from previous diagnostic) — pairs naturally with this one

No raw game JSON for this diagnostic — the data lives in the in-memory snapshot phase, evaluated post-hoc.
