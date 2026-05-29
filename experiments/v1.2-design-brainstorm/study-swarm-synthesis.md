# Sovereign v1.2 Strategic Depth — Study-Swarm Synthesis

**Date:** 2026-05-21
**Status:** APPROVED for v1.2 candidate (Tier A vertical slice)
**Base build:** v1.1.2 circuit-victory candidate
**Protocol fired:** research-grounded-advisor (study-swarm) per `C:/Users/mikey/.claude/projects/F--AI/memory/research-grounded-advisor-protocol.md`

---

## TL;DR

After the v1.1.2 circuit-victory release felt *playable but flat*, the user asked for a study-swarm to find a way to make the game special. Five parallel research agents returned ~36 board-game design citations across five load-bearing questions. The synthesis points to one product call:

**Depth ≠ more rules. Depth = new verbs, personality, timing decisions, and visible pressure.**

v1.2 ships a **Strategic Depth Vertical Slice** — all five recommended layers present, each in the smallest form that proves a new kind of fun:

1. **Personality** — per-profile reaction library (Hamilton + Morris get voice)
2. **Card agency** — 6 of 24 cards become HAND cards with timing windows
3. **Profile asymmetry** — one profile-locked Special Action per profile
4. **Visible failure pressure** — multi-stage Public Confidence gauge that *wraps* (not replaces) existing Credit Crisis
5. **Recovery choice** — Reform action costs IP to ease the Republic

Tier B (v1.3) and Tier C (v2.0 territory) deferred. Explicitly forbidden in v1.2: side deals, shared property, Acts auction.

The single sentence v1.2 must prove in cold play:
> **"Treasury, Merchant, and Manufacturer now feel like three different ways to build the Republic."**

---

## Why this study-swarm fired

By end of 2026-05-20 the Sovereign digital mode had completed an unprecedented one-day arc:
- v1.1.0 published 05:28Z, withdrawn same day after cold play surfaced two structural playability failures
- Pass 1 + Pass 2 chrome rebuild
- v1.1.1 shipped with 12-round pacing + mandate victory
- v1.1.2 shipped with circuit-based end condition (median 67-turn game)

The user cold-walked v1.1.2 and reported: "The game is far from being done. It's amazingly flat and boring."

The diagnosis: structural playability fixes (chrome, pacing, victory model) had landed cleanly but the game was still mechanically thin — players mostly performed the same actions, cards happened *to* players, opponents felt like turn-takers, and failure events remained decorative.

The user explicitly invoked **study-swarm**:
> "Let's launch a study-swarm to find a way to give this game more depth, and make it more of a strategic game. We can search similar games. I'd imagine a new card deck, ways to interact with the other players, etc. Let's brainstorm and make this game special"

Per the standing protocol, this triggers parallel research-agent dispatch with citation discipline.

---

## The five load-bearing questions

| # | Question | Why load-bearing |
|---|---|---|
| 1 | What direct player-to-player interaction patterns work in 3-player economic games with scripted opponents? | Sovereign has zero inter-player interaction; players are parallel solitaires. User explicitly asked for this. |
| 2 | What card design patterns create agency in long-arc economic games? | Sovereign's 24 cards all auto-resolve on draw — zero player choice. User explicitly asked for this. |
| 3 | How do asymmetric profiles feel like different *games* not different *spreadsheets*? | Treasury / Merchant / Manufacturer differ arithmetically but feel similar in play. |
| 4 | How do successful games make failure events feel real without being punitive? | Default / Rebellion fire 0/100 in CANONICAL even at 23-round play. |
| 5 | How do scripted AI opponents feel like *characters* not bots? | Hamilton and Morris have names but no personality, voice, or reactions. |

---

## Research findings (5 agents, ~36 sources)

### Thread 1 — Inter-player interaction

**Sources cited:**
1. Catan (Klaus Teuber, 1995, BGG 13) — robber attack moment + trade-on-roll continuous negotiation pressure
2. Acquire (Sid Sackson, 1964, BGG 5) — shared corporations + staggered stock distribution, mergers pay all shareholders
3. Power Grid (Friedemann Friese, 2004, BGG 2651) — leader gets worst turn order; auction + finite resources
4. Imperial (Mac Gerdts, 2006, BGG 24181) — majority shareholder controls nation's rondel
5. Brass: Birmingham (Martin Wallace, 2018, BGG 224517) — your network extends along any player's links; flipping opponent tiles scores them VP
6. Automa Factory / Viticulture solo (Morten Monrad Pedersen, 2015) — bot must mimic *points of player interaction* and stay partially predictable
7. "Alpha Player Problem" essays (Erik Twice 2021, Mechanics & Meeples 2018) — public information lets optimal move dominate; hidden info / divergent goals / time pressure are standard fixes

**Implications (cost-ordered):**
- **Compact action** (small cost, deferred to Tier C): side-deal negotiation before Act votes with profile reservation pricing
- **Acts as turn-order auction** (medium cost, deferred to Tier C): Power Grid leader-penalty bidding
- **Acquire-style shared property** (large cost, deferred to Tier C): 60/20/20 rent split, dormant minority shares

### Thread 2 — Card agency

**Sources cited:**
1. Dominion (Donald X. Vaccarino, 2008, BGG 36218) — only 10 kingdom cards vary; variety in *which subset shows up*
2. Race for the Galaxy (Tom Lehmann, 2007, BGG 28143) — cards as multipurpose currency/action; opportunity-cost density
3. Concordia (Mac Gerdts, 2013, BGG 124361) — each card is action + endgame scoring multiplier (dual-axis commit)
4. Innovation (Carl Chudyk, 2010, BGG 63888) — dogma symbols force shared resolution if opponents match
5. Glory to Rome / Mottainai (Chudyk, 2005/2015) — every card is role + resource + building + client; one use forecloses three
6. Through the Ages (Vlaada Chvátil, 2006/2015, BGG 182028) — aggressions resolve immediately with defense window; wars next turn with no defense (two-clock pattern)
7. 7 Wonders Duel (Bauza/Cathala, 2015, BGG 173346) — uncovering a card for your opponent is the decision

**Implications (cost-ordered):**
- **HAND cards (~6 of 24)** with `[Hold]` timing tag — adopted in Tier A
- **3 Political Capital persistent passives** — Tier B
- **2 Innovation-style dogma cards** — Tier C

### Thread 3 — Asymmetric profile differentiation

**Sources cited:**
1. Root (Cole Wehrle, 2018, BGG 237182) — faction rules override general rules; profile-locked verbs
2. Vast: The Crystal Caverns (Patrick Leder & David Somerville, 2016, BGG 170416) — 5 roles, completely separate rulesets, shared board only
3. John Company 2e (Cole Wehrle, 2017/2022, BGG 332394) — office-locked verbs per role per turn
4. Spirit Island (R. Eric Reuss, 2017, BGG 162886) — unique innate-power grammar + presence-track per Spirit
5. Inis (Christian Martinez, 2016, BGG 155821) — three orthogonal victory conditions over symmetric action draft
6. Dune (Eberle/Kittredge/Olotka, 1979, BGG 121) — faction powers concentrated in information rights + rule exceptions
7. Pax Pamir 2e (Cole Wehrle, 2019, BGG 256960) — symmetric grammar, asymmetric scoring eligibility via loyalty dial

**Implications (cost-ordered):**
- **Profile-locked Special Action** (one per profile) — adopted in Tier A
- **Asymmetric Vision Achieved bonus** (Inis-style win triggers per profile) — Tier B
- **One rule-exception per profile** (Dune-style info/sequencing rights) — Tier C

### Thread 4 — Failure pressure that bites

**Sources cited:**
1. Spirit Island (R. Eric Reuss, 2017) — Blight cascades; visible card flip changes scoring globally before terminal failure
2. Pandemic (Matt Leacock, 2008, BGG 30549) — chain-outbreak topology; players see geography of risk before metastasis
3. Eldritch Horror (Corey Konieczka, 2013, BGG 146021) — Doom Track advances via compound triggers; Reckoning makes procrastination worse
4. This War of Mine: The Board Game (Awaken Realms, 2017, BGG 188920) — attrition spiral; wealth becomes pressure surface
5. Brass: Birmingham (Wallace/Schnoebelen, 2018) — tile-flip obsolescence; held tiles become liabilities
6. TVTropes / BGG comeback-mechanic literature — losing players need non-trivial paths back; cost must be something leader cannot easily counter

**Implications (cost-ordered):**
- **Multi-stage Credit pressure with visible Public Confidence gauge** — adopted in Tier A (with user correction: WRAPS around existing Credit Crisis, doesn't replace)
- **Reform recovery action** (any player can spend IP to ease pressure) — adopted in Tier A
- **Compound Resistance triggers** (3 new advance hooks) — Tier B

### Thread 5 — AI opponents as characters

**Sources cited:**
1. Scythe Automa (Stegmaier + Pedersen, 2017, BGG 169786) — flowchart bot with faction-keyed priorities + mid-game phase shift; character is presentation skin over deterministic flowchart
2. Spirit Island Adversaries (Reuss 2017) — historical fiction header ties rule deltas to nation's colonial logic
3. Gloomhaven (Isaac Childres, 2017, BGG 174430) — monster Ability Decks; archetype-specific verbs
4. Friday (Friedemann Friese, 2011, BGG 105032) — zero behavioral cleverness; character via narrator framing and age-state stages
5. Robinson Crusoe (Ignacy Trzewiczek, 2012, BGG 121921) — event cards carry 1-2 lines of in-world prose triggered by state
6. Combat Commander (Chad Jensen, 2006, BGG 21050) — Random Event chits framed as "what just happened in the fiction"
7. Onirim (Shadi Torbey, 2010, BGG 80954) — personality via art tone + named card categories
8. Wingspan Automa (Hargrave + Automa Factory, 2019, BGG 266192) — "Automubon" — naming bot after famous bird-watcher does the character work

**Implications (cost-ordered):**
- **Per-profile reaction library** (deterministic state-keyed snippets) — adopted in Tier A
- **Two-phase priority shift as character beat** (one-time toast at midgame) — Tier B
- **Named decision-deck strings** ("Hamilton consults the Treasury ledger…") — Tier B

---

## Recommendation menu (15 implementations across 3 tiers)

| Tier | # | Implementation | Source thread | Status |
|---|---|---|---|---|
| **A** | 1 | Per-profile reaction library | AI characters | **v1.2 vertical slice** |
| **A** | 2 | Multi-stage Credit pressure (wrapping) | Failure pressure | **v1.2 vertical slice** |
| **A** | 3 | HAND cards (6 of 24) | Card agency | **v1.2 vertical slice** |
| **A** | 4 | Profile-locked Special Action | Asymmetry | **v1.2 vertical slice** |
| **A** | 5 | Reform recovery action | Failure pressure | **v1.2 vertical slice** |
| B | 6 | Compound Resistance triggers | Failure pressure | v1.3 |
| B | 7 | Political Capital persistent passives | Card agency | v1.3 |
| B | 8 | Asymmetric Vision Achieved bonuses | Asymmetry | v1.3 |
| B | 9 | Phase-shift character beat | AI characters | v1.3 |
| B | 10 | Named decision-deck strings | AI characters | v1.3 |
| C | 11 | Compact action (side deals) | Inter-player | v2.0 — **forbidden in v1.2** |
| C | 12 | Acts as turn-order auctions | Inter-player | v2.0 — **forbidden in v1.2** |
| C | 13 | Acquire-style shared property | Inter-player | v2.0 — **forbidden in v1.2** |
| C | 14 | Innovation-style dogma cards | Card agency | v2.0 |
| C | 15 | Asymmetric information rights | Asymmetry | v2.0 |

---

## v1.2 Vertical Slice Specification (post user amendments)

### Base
v1.1.2 circuit-victory candidate (NOT v1.1.1 mandate build, NOT withdrawn v1.1.0).

### Layer 1 — Personality (cheap)

Per-profile reaction library: deterministic, state-triggered prose snippets that fire as toasts when game-state predicates match.

Trigger events:
- first major purchase
- first rent received
- first rent paid
- Act vote
- Credit drops
- Credit Crisis
- fourth circuit / Final Accounting trigger
- profile special action

Voice register: Federalist-era formal. Hamilton speaks like Hamilton ("A sound currency demands a national bank"); Morris speaks merchant-pragmatic ("The roads are the arteries; the manufactories, the heart"). Snippets short — one sentence, characterful, not spammy. Deterministic selection (seed-derived index, no `Math.random`).

### Layer 2 — Card agency (medium)

Convert exactly 6 cards into HAND cards with `[Hold]` timing tag.

Rules:
- Players may hold up to 2 cards
- Held cards have timing windows (state-conditional play opportunities)
- Visible hand strip
- If hand is full, drawing another held card forces play/discard choice
- Opponents use deterministic profile logic to play/hold/discard

The remaining 18 cards stay `[Immediate]` (preserves Chvátil's two-clock pattern).

**User-flagged candidates** (but Claude Design may swap if conflicts arise):
- Hamiltonian Compromise (new)
- Foreign Loan Secured (new)
- Bank Run (existing — note: this is a v0.18 Credit-down source; conversion to HAND may shift Credit Crisis trigger frequency)
- Treaty Renegotiation (existing Republic Debate)
- Federalist Victory (existing Republic Debate)
- Anti-Federalist Pamphlet (existing — also a v0.18 Credit-down source; same caveat)

### Layer 3 — Profile asymmetry (medium-high)

One profile-locked Special Action per profile. **This is the most important mechanical layer** — without different verbs, the game stays flat.

| Profile | Special Action | Effect proposal |
|---|---|---|
| Treasury / Finance | **Issue Federal Bond** | Once per round on Treasury's turn. Pay TN OR replace upgrade/buy opportunity. Raises Credit +1 OR creates a Bond marker that pays modest recurring TN. Must not be free Influence. |
| Merchant / Infrastructure | **Broker Route Contract** | Mark one route or commerce asset for the round. Next auction/rent involving it pays Merchant a broker fee. Should make Merchant care about other players' movement. |
| Manufacturer / Industry | **Charter Workshop** | Target one owned Manufactures or Strategic Industry asset. Discount or accelerate upgrade. May add +1 Capacity if bounded. Must not create runaway Capacity. |

Important goal: **different verbs**, not raw power.

### Layer 4 — Visible failure pressure (medium) — USER CORRECTION

**WRAPS around existing Credit Crisis. Does NOT replace it. Preserves v0.18's earned failure hierarchy.**

| Threshold | State | Effect |
|---|---|---|
| Credit ≤ 6 | **Public Doubt** | Warning chrome; light action-cost or narration pressure only; no catastrophic effect |
| Credit ≤ 4 | **Credit Crisis** | Preserve current v0.18 Credit Crisis behavior exactly |
| Credit ≤ 2 | **Panic** | Stronger warning state; conservative mechanical effect (if any); do not make the game unwinnable |
| Credit = 0 | **Default** | Preserve existing v0.18 Default behavior |

Goal: make Credit feel alive before it collapses. Visible gauge in chrome.

### Layer 5 — Recovery choice (cheap)

Reform recovery action: any player at Credit ≤ 4 OR Resistance ≥ 8 may spend 2 IP + 1 turn/action to:
- Raise Credit +1, OR
- Lower Resistance by 2

Real cost (IP is the win condition). Comeback path exists. Leader's "do nothing" remains a meaningful political choice. Opponents use deterministic profile rules to decide when to Reform.

This creates the tension: "Do I spend victory progress to save the Republic?"

### Hard constraints (preserve from v1.1.2)
- Circuit-triggered Final Accounting
- Rent math
- Existing Acts (cadence, effects)
- Existing card effects (except 6 converted to HAND)
- Profile decision functions (except the new Special Action branch)
- RNG determinism
- Save/load/replay (or explicit version gate for old saves)
- Designer tools behind `?designer=1`
- No v0.14/v0.15 recovery-gate strings
- No player-facing "lap" language

### Explicitly forbidden in v1.2
- Side-deal negotiation (Compact action) — Tier C
- Shared property ownership — Tier C
- Acts cadence redesign — Tier C
- Acts as auctions — Tier C
- Innovation-style dogma cards — Tier C

### Validation
- **Mechanics**: CANONICAL × 100 — game length, circuit trigger rate, winner split, Credit tier frequencies, Reform uses, held-card plays, special-action uses, bankruptcy/Crisis/Default/Rebellion
- **Agency audit**: meaningful decisions per game before vs after; held-card decisions/game; special-action uses/game; Reform uses/game; check for unused or dominant profile actions
- **Character audit**: reaction count per game; examples per profile; spam check (≤1 reaction per major event cluster)
- **Playability**: cold-walkthrough first 3 rounds — player understands special action, held cards, Credit tiers; not overwhelmed
- **Preservation**: no side deals; no Acts redesign; designer gate intact; no "lap"; no recovery-gate strings

### Verdict options
- READY FOR STRATEGIC DEPTH HUMAN PLAYTEST
- READY WITH MINOR TUNING
- HOLD — TOO MUCH COMPLEXITY
- HOLD — PROFILE ACTIONS NOT DIFFERENT ENOUGH
- HOLD — MECHANICS DRIFT

### Closeout rule
Best acceptable verdict is READY FOR STRATEGIC DEPTH HUMAN PLAYTEST. Not release-ready until human cold play confirms the central sentence:

> **"Treasury, Merchant, and Manufacturer now feel like three different ways to build the Republic."**

---

## Open questions deferred to playtest

1. **Late Republic gap** (~16 rounds with no Acts firing) — v1.1.2 known risk. Tier A does not directly address it; Tier B Item 6 (Compound Resistance triggers) is the natural fix if cold play surfaces "Late Republic feels empty" feedback.
2. **Behavioral adaptation** — none of the diagnostic simulations capture how AI opponents would behave if they were profile-tuned for the new mandate / circuit / Reform / Special Action mechanics. Real human playtest is the gate.
3. **Reform as new transaction type** — paying IP for non-IP is a new lever in Sovereign. Worth observing whether players use it strategically or ignore it as a tax.
4. **Held-card conflict with v0.18 Credit-down sources** — if Bank Run and Anti-Federalist Pamphlet are converted to HAND cards, the v0.18 Credit Crisis trigger frequency could shift (those cards may no longer fire reliably when drawn). Claude Design should report on this interaction.

---

## Process notes

- **Protocol fired**: research-grounded-advisor (study-swarm) per CLAUDE.md global standing rule
- **Trigger**: user typed "study-swarm" explicitly + asked for depth research
- **Agent count**: 5 parallel general-purpose agents (single message, parallel execution)
- **Agent return time**: ~85-145 seconds each
- **Source count**: ~36 across all 5 agents (games, designers, designer interviews, BGG threads, design analyses)
- **Source quality**: every implication traces to at least one named designer + year + canonical reference + URL
- **User amendments folded in**: (a) WRAPS not replaces Credit Crisis, (b) Special Action wording tightened, (c) Tier C explicitly forbidden, (d) vertical slice framing
- **Final design call**: user

---

## Source list (canonical references)

### Games
- Catan — Klaus Teuber, 1995 — BGG 13
- Acquire — Sid Sackson, 1964 — BGG 5
- Dune — Eberle/Kittredge/Olotka, 1979 — BGG 121
- Combat Commander: Europe — Chad Jensen, 2006 — BGG 21050
- Power Grid — Friedemann Friese, 2004 — BGG 2651
- Imperial — Mac Gerdts, 2006 — BGG 24181
- Pandemic — Matt Leacock, 2008 — BGG 30549
- Dominion — Donald X. Vaccarino, 2008 — BGG 36218
- Onirim — Shadi Torbey, 2010 — BGG 80954
- Race for the Galaxy — Tom Lehmann, 2007 — BGG 28143
- Innovation — Carl Chudyk, 2010 — BGG 63888
- Friday — Friedemann Friese, 2011 — BGG 105032
- Concordia — Mac Gerdts, 2013 — BGG 124361
- Robinson Crusoe — Ignacy Trzewiczek, 2012 — BGG 121921
- Eldritch Horror — Corey Konieczka, 2013 — BGG 146021
- Inis — Christian Martinez, 2016 — BGG 155821
- Spirit Island — R. Eric Reuss, 2017 — BGG 162886
- Scythe — Jamey Stegmaier, 2016 — BGG 169786
- Vast: The Crystal Caverns — Patrick Leder & David Somerville, 2016 — BGG 170416
- 7 Wonders Duel — Antoine Bauza & Bruno Cathala, 2015 — BGG 173346
- Gloomhaven — Isaac Childres, 2017 — BGG 174430
- Through the Ages: A New Story of Civilization — Vlaada Chvátil, 2015 — BGG 182028
- This War of Mine: The Board Game — Awaken Realms, 2017 — BGG 188920
- Brass: Birmingham — Martin Wallace, 2018 — BGG 224517
- Root — Cole Wehrle, 2018 — BGG 237182
- Pax Pamir 2e — Cole Wehrle, 2019 — BGG 256960
- Wingspan — Elizabeth Hargrave, 2019 — BGG 266192
- John Company 2e — Cole Wehrle, 2017/2022 — BGG 332394
- Glory to Rome / Mottainai — Carl Chudyk, 2005/2015 — BGG 19237

### Designer talks / interviews / dev diaries
- Donald X. Vaccarino — Cardboard Edison interview on Dominion meaningful decisions
- Tom Lehmann — GDC 2018 Board Game Design Day talk
- Mac Gerdts — Origin Stories interview on Concordia (BGG)
- Cole Wehrle — Elevation Games interview
- R. Eric Reuss — Nerdlab Episode 33 on Spirit Island asymmetric design
- Vlaada Chvátil — Through the Ages designer's notes
- Matt Leacock — leacock.com/pandemic
- Jamey Stegmaier & Morten Monrad Pedersen — Cardboard Herald Ep. 45
- Carl Chudyk — Shut Up & Sit Down profile
- Isaac Childres — Fusionhaa design diary on Gloomhaven AI
- Shadi Torbey — Solo Saturday post on Onirim
- Friedemann Friese — Shut Up & Sit Down review of Friday

### Design analyses
- Erik Twice — "Alpha Player Problem" (2021)
- Mechanics & Meeples — "Alpha Player Problem" (2018)
- Decision Space — Innovation strategy guide
- Carla Kopp / Weird Giraffe Games — 7 Wonders Duel in-depth design analysis
- TVTropes — Comeback Mechanic
- BGG — "Importance of Comeback Mechanics" thread
- BGG — Spirit Island Cascading Blight thread
- BGG — Brass: Birmingham network rules thread
- BGG — Through the Ages Political Phase thread
- The Solo Meeple — Robinson Crusoe solo guide
- Spirit Island Wiki — Blight mechanics
- Eldritch Horror Fandom — Doom Track
- Meeple Mountain — This War of Mine review
- BGG — Combat Commander narrative thread
