# Sovereign — Changelog

> A Hamilton-system Monopoly-grammar board game and its solo / digital adaptation.
> Two artifact streams, one design thesis: **debt → credit → bank → industry**.

---

## v1.5.1 — Packaging hotfix: restore the full offline bundle to the npm tarball — 2026-05-29

**Patch.** v1.5.0's `package.json` `files` field was over-trimmed: it correctly dropped the ~5 MB of regenerable `balance-evidence/raw-data/` JSON, but also excluded the design-history, balance-evidence HTML, board-game audits, and the digital-mode freeze-audit that `00-START-HERE.html` (the `--start` / offline-bundle router) links to — so those links 404'd in the npm package. The GitHub Release zip and the Pages site were always complete. v1.5.1 restores the full audience-routed bundle to the tarball, keeping only the regenerable raw-data JSON excluded. No gameplay, engine, or doc changes — `sovereign-solo.html` is byte-identical to v1.5.0.

---

## v1.5.0 — Make it felt: rival presence · the Credit Spiral · juice + sound · Chronicler Tier B · onboarding — 2026-05-29

**Beta.** A "make it felt" pass on top of the v1.4 strategic stack, plus two live-game hang fixes and a save/load/replay fidelity restoration. Five player-facing layers land here; no scoring math changed. The Credit Spiral wraps — does not replace — the v0.18 failure hierarchy and applies inside `reduce()` so determinism and replay hold. Stat figures below are measured against the **live shipping engine** via the new `test/measure-stats.mjs` over CANONICAL × 100 (seeds 2026–2125, triplet treasury / merchant / manufacturer); they supersede the prior v1.4.0 figures, which were copied forward and had drifted.

### Fixed

- **Card-triggered auctions hard-hung the live game.** A *Speculation Fever* card that triggered an auction — and an insufficient-cash buy — could lock the running game (this was live in shipped v1.4.0). Both paths fixed; verified against the live-DOM playability harness.
- **Save / load / replay fidelity restored.** A pre-existing break leaked roster / fee / Chronicler state out-of-band, so a reload or replay could diverge from the original game. Save state now round-trips faithfully; `SAVE_VERSION` is now `v0.26-replay-fidelity-candidate`. A determinism test suite and a 5-gate live-DOM playability harness lock this in.

### Added

- **Rival presence.** Visible Influence standings plus per-opponent posture lines that frame each rival's move relative to *your* standing ("Hamilton — 3 Influence ahead — takes the Bank; the Treasury bloc tightens."). A distinct fourth voice from the Chronicler (history), profile flavor (the action), and reactions (the rival's emotion). Presentation-only — computed at render time, never written to the hashed ledger/state.
- **The Credit Spiral** (the v1.5 keystone). Public Credit failure becomes felt, compounding, and recoverable: a debt-servicing CASH levy at low Credit, telegraphed acceleration toward Default, a forecast of where the slope leads, and the Reform action surfaced as a real lifeline. It carries the civic thesis directly — you feel *why* federal public credit mattered. Wraps the v0.18 Public Doubt → Crisis → Panic → Default hierarchy without changing any threshold; applied inside `reduce()` at `BEGIN_LAP`, so it is replay-safe. Re-validated live: Credit Crisis now fires ~29 / 100 games and is genuinely recoverable (~41 % of crisis games climb back to stable Credit ≥ 7; 0 reach Default under the scripted AI).
- **Juice + sound.** Number tweening with gain/loss asymmetry, ZzFX procedural audio across 13 cues, action choreography, and a **SPEED** setting (Cinematic / Normal / Fast-instant). Fast-instant skips all animation for fast play and accessibility. Full keyboard / reduced-motion / screen-reader support throughout (informed by a 4-agent, ~40-source research pass).
- **Chronicler Tier B — the informative layer.** 15 *Learn More* popovers on key mechanics; **the Chronicler's Ledger** encyclopedia (27 verified historical quotes plus Acts, Federal Era events, Credit tiers, and Visions, in one browsable reference overlay); 10 glossary tooltips. Turns the period flavor into an actual history layer the player can explore.
- **Onboarding.** A Swift-Start guided "1790 Funding Debate" opening that walks a first-time player into the core loop, plus a hide-nothing hover/focus telegraph that shows the cost and consequence of every action affordance before commit.
- **`test/measure-stats.mjs`** — a live-engine stat measurement tool (jsdom boot → `runBatchGame` → CANONICAL × 100) that reports the win split, game length in both turns and rounds, failure firing, and Vision achievement per profile. Used to source the README/CHANGELOG figures so they track the engine rather than drift.

### Changed

- **Stage A health hardening.** Honest save-integrity reporting; a stronger `snapshotHash`; institution rent now uses the landing roll; an `aria-live` turn-loop; `prefers-reduced-motion` respected across the new juice; a more robust `?designer` gate. CI is now **org-compliant** (`on.push.paths` filter + `workflow_dispatch` + concurrency group; single-OS ubuntu-latest × Node 18/20 matrix, replacing the prior 9-job 3-OS matrix). A determinism test suite and a live-DOM playability harness (5 gates) join the smoke tests. Packaging trimmed (~5 MB; the npm tarball is now 20 files / ~292 kB packed).
- **Measured balance refreshed to the live engine.** CANONICAL × 100: Treasury **48 %** / Merchant **34 %** / Manufacturer **18 %** (was reported 59 / 20 / 21 at v1.4.0). All three profiles win meaningfully; Treasury remains strongest in line with the historical thesis without running away. Median game length is **~22 rounds / ~66 turns** (median 22 laps; median 65.5, mean 66.34 turns) — the v1.4.0 "~23 rounds / 67 turns" line is corrected: turns hold near ~66, rounds are ~22.
- **Vision achievement is balanced and all three are reachable** — Federal Credit Architect ~43 %, Commerce Sovereign ~42 %, Industrial Founder ~41 % (CANONICAL × 100), revising the prior 54 / 39 / 29 figures.
- **Failure firing (measured): Public Doubt 77 / 100, Credit Crisis 29 / 100, Panic 1 / 100, Default 0, Rebellion 0.** Default and Rebellion stay rare under the scripted v0.18 AI — which Reforms itself off the floor — but both are fully reachable by a human who neglects Public Credit. The earlier "failure events remain mostly decorative" framing no longer holds: Crisis is felt and recoverable.
- **Opponent-behavior caveat corrected.** Scripted opponents *do* use Special Actions, the Reform lifeline, Federal Era / Late-Event choices, Act votes, and HAND-card timing (verified in both the live loop and the batch path). Only the **core buy / auction / upgrade / vote** valuation remains v0.18 — they don't yet explicitly race for the Vision. The prior "AI doesn't adapt to v1.2–v1.4" note was overbroad.

### Hard invariants (preserved)

- Scoring math, card/Act effects, rent math, mulberry32 RNG, deck order, and the v0.18 failure thresholds (Crisis ≤ 4 once-only, Default = 0, Rebellion = 12) are unchanged. The Credit Spiral adds a debt-servicing levy and telegraphy *around* that hierarchy; it does not move the thresholds.
- Circuit-triggered Final Accounting unchanged; trigger ≠ winner (~⅓ of games the trigger player wins on Influence).
- The printable board game is untouched, stable at v0.2.

### Beta caveat

- **v1.5.0 ships as a beta pending a fresh-human end-to-end walkthrough** — the playability gate for the public tag. Every layer was structurally audited and re-validated against the live engine (determinism + playability harnesses + `measure-stats.mjs`), and cold-walked at slice level, but a full end-to-end play by a fresh human is the remaining gate. Render-time figures (Chronicler banners/game, per-profile reactions/game) are intentionally not asserted numerically here: they are produced by the UI layer (`pushToast` / `fireReaction`) and are not measurable from the headless batch path, so they are described qualitatively rather than printed as a possibly-stale count.

---

## v1.4.0 — Strategic Depth + Federal Era + Chronicler — 2026-05-21

**Beta.** First substantive feature release since v1.1.2 (circuit-victory). Adds three vertical slices on top of the circuit-victory base — strategic depth, strategic arc, and the Chronicler historical voice — without changing any reducer mechanics or scoring math. The v1.2, v1.2.1, and v1.3 internal candidates that drove this work were never published to npm; v1.4.0 consolidates all of them plus the Chronicler.

### What's new vs v1.1.2

**Strategic Depth** (internal codename v1.2 + v1.2.1 tuning)

- Three **profile-locked Special Actions** (1/round per player):
  - **Treasury**: *Issue Federal Bond* — pay TN to gain Credit +1 (gated to Credit ≤ 6) OR place a Bond marker that pays recurring income.
  - **Merchant**: *Broker Route Contract* — mark a route or commerce asset; next auction/rent involving it pays Merchant a broker fee.
  - **Manufacturer**: *Charter Workshop* — discount or accelerate upgrade on a Mfg / Strategic Industry asset (75 TN cost; may grant Capacity +1).
- **6 HAND cards** with timing windows (hand cap 2, visible hand strip): Foreign Loan Secured, Bond Auction, Treaty Renegotiation, Credit Restored, Cabinet Bargain, Federalist Victory.
- **Reform recovery action**: at Credit ≤ 4 OR Resistance ≥ 8, spend 2 IP (Influence debit) for Credit +1 OR Resistance −2. Real cost — IP is the win condition.
- **Multi-stage Public Credit pressure**, *wrapping* v0.18's hierarchy (does not replace):
  - Credit ≤ 6: **Public Doubt** (warning chrome + action-cost pressure)
  - Credit ≤ 4: **Credit Crisis** (preserved v0.18 effect — Resistance +1 to all)
  - Credit ≤ 2: **Panic** (30 TN levy + Resistance +1)
  - Credit = 0: **Default** (preserved v0.18 effect — 50% cash loss + random upgrade loss)
- **Per-profile reaction library** — deterministic, state-keyed snippets (~33 reactions per game) that give Hamilton, Morris, and Slater character voice on their own action moments.

**Strategic Arc** (internal codename v1.3 — Federal Era + Profile Visions)

- **8 Federal Era Events** firing every round from round 8 onward:
  - 5 choice events: *Creditors Demand Payment*, *Public Works Petition*, *Route Monopoly Inquiry*, *Workshop Shortage*, *Speculation Inquiry*
  - 3 auto-resolve events: *Bondholder Demand*, *Local Resistance Organizes*, *Final Republic Reckoning*
- **3 Profile Visions** with +3 IP endgame bonus:
  - **Federal Credit Architect** (Treasury): Public Credit ≥ 8 + Bank chartered or BUS owned + finance diversity (1+ Rev-Debt, 1+ State-Debt, 1+ National Finance)
  - **Commerce Sovereign** (Merchant): 2+ routes + 1+ Commercial Infrastructure + 5+ broker/route income
  - **Industrial Founder** (Manufacturer): Capacity ≥ 7 + 3+ Mfg/Strategic + 1+ Mfg/Strategic upgrade
- **Vision progress strip** below the depth strip. **Late Republic emptiness** reduced from 8/100 → 2/100 (4-round empty windows in median play).
- **Player-facing terminology corrected**: "Late Republic" → "Federal Era" (the historically accurate period name; "Late Republic" carries Roman-decline connotations that mis-frame the constructive Federalist project).

**The Chronicler** (v1.4 — historical voice)

- **Named third-person Chronicler** as the game's historical narrator. Period-flavored but readable register: Federalist-era diction (consequence, calibration, the Republic, manufactories) + semicolon-balanced parallels + present-tense historical framing. No faux-archaic Renaissance gibberish.
- **14 event-bound Chronicler banners** firing on priority triggers (max 1 per round, ~6-8 per typical game):
  - Founding Acts (7): Funding / Assumption / Bank Charter / Tariff Schedule / Coinage / Manufactures / Excise — both pass and fail outcomes
  - Federal Era opening (round 8)
  - Credit tier escalation: Public Doubt / Credit Crisis / Panic / Default
  - Rebellion
  - Reform first use
  - Vision achievement
  - Final Accounting trigger
- **7 failed-Act Chronicler entries** with explicit **counterfactual framing**: "In our history Hamilton's Funding Act carried 32 to 29 in July of 1790; in your Republic, the soldier's discrimination found enough votes to bar the door." Cites real history (real vote tallies, real opposition figures) while acknowledging the game went differently.
- **8 event-specific Federal Era Event captions** as always-visible italic lines on each Event banner — sourced from documented real-history anchors (Bank of the United States subscription July 4, 1791; Panic of 1792 / William Duer collapse March 9, 1792; Whiskey Rebellion Mingo Creek 1794; Robert Morris in Prune Street prison February 1798; etc.).
- **Profile-reaction suppression** on shared events — when the Chronicler fires on a Crisis, the per-profile reactions for that Crisis are silenced. Chronicler is the table-voice; profile reactions are individual voices and don't duplicate the table-voice.
- **Foil-bordered persistent Chronicler toast** with × dismiss button (other toasts auto-dismiss at ~3.8s). Allows players time to read the historical content. Respects the existing narration On / Minimal / Off setting (Off silences Chronicler too).
- **Verified Historical Source Pack** governing all attributed quotes — 27 real quotes from Hamilton, Madison, Jefferson, Adams, Gallatin, Maclay, Freneau. Every quote traceable to founders.archives.gov, Wikisource, or Library of Congress URLs. **Zero fabricated attributions.** When an attributed quote is unavailable for a moment, the Chronicler narrates in unattributed period prose.

### What's preserved from v1.1.2

- **Circuit-triggered Final Accounting** — game ends when one player completes their 4th board circuit (crossing Treasury Opens). Median ~23 rounds / 67 turns. Hard cap at round 30 (safety; essentially never fires).
- **Trigger ≠ winner** — the player who completes the 4th circuit wins by Influence only ~33% of games. Endgame copy has four branches (trigger wins / trigger achieved Vision but lost on IP / trigger wins but no Vision / hard cap).
- **Pass 3 rent surfacing band**, Pass 1/2 chrome (action rail above board, positions strip, portfolio strip, sidebar collapsed by default, 26px tokens, designer gate, dice overlay, board tooltips).
- **Per-circuit human-voice ledger narration** ("Hamilton finishes their first lap around the Republic" / "is two circuits in" / "is three deep. One more pass and the books close." / "has been around four times. The books close.").
- **Round language** throughout (no player-facing "Lap").

### Hard invariants (mechanics preserved byte-identical from v0.18)

- All card effects (Market Shock + Republic Debate), all Act effects
- Scoring math: cash IP 1 per 400 TN, NF Credit endgame bonus, Capacity bonuses, set completion, route counts, institution payments
- Rent math (Pass 3 surfaces the existing values; does not change them)
- Profile decision functions (Treasury / Merchant / Manufacturer / Industry) — opponents still pick optimally per their profile, not yet adapted for v1.4 mechanics
- mulberry32 RNG, deck order, save/load/replay
- Credit Crisis (Credit ≤ 4 once-only), Default (Credit = 0), Rebellion (Resistance = 12) trigger thresholds and effects — all preserved
- No v0.14/v0.15 recovery gates ("panic conditions persist" string confirmed absent)

### CANONICAL × 100 (v1.4 vs v1.1.2 baseline)

| Metric | v1.1.2 | v1.4.0 | Tolerance |
|---|---:|---:|---|
| Triggered | 100/100 | 100/100 | ✓ |
| Median turns | 67 | ~67 | ✓ |
| Median rounds | 23 | ~23 | ✓ |
| Treasury wins | 56% | 59% | within ±5 |
| Merchant wins | 19% | 20% | within ±5 |
| Manufacturer wins | 25% | 21% | within ±5 |
| Bankruptcy events | 72 | 70 | within tolerance |
| Empty 4-round windows | — | 2/100 | new metric (target <5) |
| Chronicler banners / game | — | 6-8 | new |
| Federal Era events / game | — | 15.7 | new |
| Public Doubt fires | — | 132 | new |
| Reform uses | — | 51 | new |
| Vision achievement (Treasury) | — | 54% | target 25-50% (+4 over) |
| Vision achievement (Merchant) | — | 39% | within band |
| Vision achievement (Manufacturer) | — | 29% | within band |
| Trigger-player win rate | 33% | 38% | within tolerance |
| Reactions / game | — | ~33 | new |

### Save format

`SAVE_VERSION = 'v0.23-strategic-arc'` (the internal codename for the v1.3 work that v1.4 builds on; chrome-only Chronicler additions do not bump the save format). Saves from v0.18 / v0.19 / v0.20 (mandate-candidate) / v0.21 (circuit-candidate) / v0.22 refuse to load with friendly non-crash messages.

### Beta caveats

- **Cold-walked at slice level, not end-to-end across all four layers.** Each vertical slice was structurally audited and validated against simulation diagnostics; the v1.4 Chronicler was cold-walked specifically for the failed-Funding-Act counterfactual case after the trigger-coverage bug was found and fixed during the v1.4 patch cycle. Full end-to-end cold play remains a beta-tag responsibility, not a release-blocking gate.
- **AI profile decisions do not yet adapt to v1.2-v1.4 mechanics.** Opponents run v0.18-style decision functions — they don't yet "race for the Vision" or "spend HAND cards strategically" in the way a human player would. Real human behavior in cold play will diverge from CANONICAL × 100 measurements.
- **Treasury Vision achievement at 54%** is slightly above the 25-50% target band but acceptable (the band was advisory). Treasury still doesn't run away — Treasury wins 59% which is within +5 of the v1.1.2 baseline.
- **Trigger-player win rate at 38%** (vs v1.1.2 baseline 33%) is within tolerance but worth watching in cold play. The trigger ≠ winner narrative remains intact.

### npm history note

- v1.1.0 remains on npm as the historical withdrawn version
- v1.1.1 remains as the historical mandate-model beta
- v1.1.2 remains as the historical circuit-only beta (no strategic depth, no Federal Era, no Chronicler)
- **v1.4.0 becomes `latest`** — the recommended digital-mode beta
- No npm publish exists for v1.2.x or v1.3.x — those were internal candidate codenames; v1.4.0 consolidates all of that work plus the Chronicler

---

## v1.1.2 — Circuit victory + human voice — 2026-05-20

**Beta.** Same day as v1.1.1, but a meaningfully different shape. After the v1.1.1 cold playthrough the game still felt too short and the ending too arbitrary — it ended because the clock ran out, not because someone won the Republic. v1.1.2 replaces the round-cap-with-mandate end condition with a **circuit-based** end condition tied to physical movement around the board.

**The new end condition:**

The game ends when one player has carried their faction around the Republic four times — i.e., completed their fourth crossing of Treasury Opens. At that moment, Final Accounting fires and the highest-Influence player wins, *not necessarily the player who got around first*. Hard cap stays at round 30 (a safety; essentially never fires — diagnostic showed 100 / 100 CANONICAL × 100 games complete by round 28).

**Why this is structurally different from v1.1.1:**

- v1.1.1: 12-round cap with mandate (15 IP + 5 lead) as early-trigger. Median 9 rounds, 36 turns. Ended by clock.
- v1.1.2: no round cap that anyone hits in practice. Median **23 rounds / 67 turns** — about 1.9× the previous game length. Ends when somebody physically rounds the board for the fourth time.

**CANONICAL × 100 (in-HTML batch sim):**

| Metric | v1.1.1 (mandate) | v1.1.2 (circuit) |
|---|---:|---:|
| Triggered | 62 / 100 | 100 / 100 |
| Median rounds | 9 | 23 |
| Median turns | ~27 | 67 |
| Treasury wins | 52 % | 56 % |
| Merchant wins | 32 % | 19 % |
| Manufacturer wins | 16 % | 25 % |
| Avg winning IP | ~16 | 28.7 |
| Avg lead margin | 5 | 7.9 |
| Bankruptcy events | 7 | observed |
| Safety-cap fires | n/a | 0 / 100 |

Trade-off worth naming: Merchant share drops (32 → 19) while Manufacturer rises (16 → 25). Longer games give Treasury and Manufacturer time to compound industrial / financial scoring, where Merchant's route-rent advantage matures faster in shorter games. Treasury still doesn't run away — share stays in the band.

**Trigger ≠ winner.** The player who completes the fourth circuit wins by Influence only 33 / 100 games. The other 67, somebody else holds the heavier ledger at termination. This is intentional — it preserves the "carry it across the line" feel while still rewarding economic depth. Endgame copy makes this explicit in both branches.

**Human voice copy pass.** All circuit / endgame narration rewritten away from gameplay-jargon ("Circuit Victory", "trigger player", "claimed the Republic") toward narrative-voice ("Hamilton has been around four times. The books close.", "Hamilton rounded the Republic four times — but the heaviest ledger belonged to Morris."). Per-circuit ledger entries vary by circuit number — first lap, two circuits in, three deep, books close.

**What's preserved from v1.1.1:**

- All Pass 1 / Pass 2 chrome (action rail above board, positions strip, portfolio strip, collapsed sidebar, 26 px tokens, designer gate, dice overlay)
- Pass 3 rent surfacing band
- All v0.18 mechanics: card effects, Acts (still firing rounds 1-7), scoring math, rent math, profile decision functions, RNG, deck order, Credit Crisis / Default / Rebellion triggers
- Designer URL flag: `?designer=1&circuit_target=N` for tuning the circuit threshold

**What changed:**

- `SAVE_VERSION = 'v0.21-circuit-candidate'`. v0.20 (v1.1.1) saves refuse to load with a friendly non-crash message.
- Mandate threshold removed. No more 15-IP + 5-lead trigger; the game ends on the fourth circuit only.
- Round counter on the chrome no longer reads "Round N of 12" — just "Round N" (and "· Late Republic" after round 7).
- Acts still fire in rounds 1-7; rounds 8-onward are Late Republic with no new political shocks. **Open risk**: median play has ~16 rounds of Late Republic with no Acts firing. If cold play finds this stretch feels empty, the v1.1.3 fix is an Acts redistribution pass, not a return to mandate.

**Beta caveats:**

- Not yet cold-walked end-to-end by a fresh human player. Beta tag is the safety net.
- Behavioral adaptation unmeasured: AI profiles still play current decision functions, not circuit-aware ones (e.g., Treasury doesn't yet race to hit the fourth circuit).
- The Late Republic stretch (~16 rounds in median play with no Acts firing) is a known open risk. Worth flagging in any playtest notes.

**npm history note:**

v1.1.0 remains on npm as the historical withdrawn version. v1.1.1 (mandate beta) and v1.1.2 (circuit beta) are both published. `npm install @mcptoolshop/sovereign` resolves to v1.1.2 (`latest`).

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
