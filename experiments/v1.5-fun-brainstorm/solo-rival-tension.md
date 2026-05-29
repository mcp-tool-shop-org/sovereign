# Solo-Rival Tension — Making Scripted Bots Feel Like Rivals (not turn-takers)

**Research question:** In a solo game vs two scripted, deterministic bots on a shared 40-space board, how do you make the opponents feel like genuine *rivals you are in tension with* — without true multiplayer negotiation? This is the solo-specific version of the parallel-solitaire problem.

**Sovereign context assumed:** 1 human vs 2 scripted profiles; shared board with auctions, shared tracks, Acts votes, and an Influence race.

---

## Findings (each with a Sovereign implication)

**1. Pedersen's core thesis: tension comes from making the bot face *the same scarce decisions you do*, not from scripting "aggression."** (Morten Monrad Pedersen / Automa Factory, 2014–present — automafactory.com, Going Analog interview.) Pedersen: "add artificial players who take the place of human players and mimic the *interactions* you'd have with a human player… find the simplest possible way to have the AI mimic those." Rivalry is an emergent property of *shared scarcity*, not a difficulty knob.
→ **Sovereign:** The bots must spend from and compete for the *same* board — bid in the *same* auctions, occupy the *same* spaces, draw from the *same* deck — not run a private side-track. If a bot's actions never remove an option from you, it is by definition parallel solitaire. **This is the root diagnosis.**

**2. A threatening Automa is defined by *blocking/denial of the thing you wanted*, evaluated against your state.** (Stidjen solo review of Scythe Automa, 2018, stidjenplayssolo.wordpress.com.) The Scythe Automa "will attack you if you fear it will… the question isn't *whether* it blocks or attacks, but *how* and *where* — because it will." Denial keyed to *your* plan is the felt-rivalry primitive.
→ **Sovereign:** At least one bot profile should evaluate the auction/space *you* most want and contest it when cheap. The bot doesn't need to "win" the bid — bidding you *up* (you overpay) or sniping a property in your color set is the tension. Cheap to script: "if human leads on Influence, bot bids the asset adjacent to human's set."

**3. Wingspan/Scythe lesson — when the bot *always takes the last turn*, its draw/reset removes your option right before you act.** (Stonemaier Wingspan rules + Stidjen review, 2019.) "The Automa drawing cards moves cards along from the market (annoying if there was something you wanted)… keeps the feeder moving." You go first; bot goes last → it consumes the board state you were eyeing. Even *emergent* denial reads as rivalry.
→ **Sovereign:** Make turn order matter. If the bot acts *after* you within a round and pulls from the shared auction pool / vote pool, its move retroactively reframes your turn ("the asset I was saving for is gone"). Free tension from sequencing alone — no new systems.

**4. The leader must pay a tax — "the leading player gets the biggest disadvantage."** (Friedemann Friese, *Power Grid* / Funkenschlag, 2004 — Wikipedia, riograndegames.) Friese explicitly designed turn order so the leader acts *last* in resource buying. This is rubber-banding done *honestly*: the leader's lead *causes* their disadvantage via a transparent rule, not a hidden dice-fudge.
→ **Sovereign:** Whoever leads on Influence takes the *worst turn order* next round (bids last, picks last). This makes the Influence race a live tug-of-war: every time you pull ahead you feel the squeeze, and watching a bot take the lead means *you* get the good slot. Cheap, deterministic, legible.

**5. Mario Kart's blue shell is the cautionary tale: hidden catch-up that ignores skill feels like punishment, not tension.** (Vice, "The Blue Shell and Its Discontents," 2017; ResetEra threads.) Rubber-band AI is "a pair of feedback loops that pull laggards forward, *indifferent to the pace of the lead racer*… the system maintains the position of the best players while simulating to the worst that they have a shot they probably don't." Catch-up that the player can't *see or counter* breeds resentment.
→ **Sovereign:** Catch-up must be **transparent and earned** (the Power Grid model in #4), never a secret stat boost on the trailing bot. Surface it: "Leader penalty: you bid last this round." Hidden rubber-banding would make the deterministic bots feel cheap — the opposite of the goal.

**6. Civ's threat works because aggression is keyed to *visible, comparative metrics* (army size, Warmonger score) tracked per-rival.** (Civ V/VI; CivFanatics "AI Attitude Study"; civilization.fandom Warmongering.) "AI aggression is strongly related to army size — if they have more military strength than you, they're likely to attack… Warmonger Score is tracked separately for each leader and forms your threat value." The player can *read* the threat and act on it.
→ **Sovereign:** Give each bot a visible "posture meter" driven by board state (e.g., bot's Influence vs yours, bot's cash vs yours). Show it: "Hamilton (aggressive) — 2 Influence behind, hoarding cash for the next Acts vote." A *readable* rival you can pre-empt is a rival; an opaque one is a turn-taker.

**7. Escalation creates "disaster dominoes" — predictable but mounting pressure forces continuous adaptation.** (Spirit Island Invader deck / Adversary system, R. Eric Reuss, 2017 — spiritislandwiki.com; Friday, Friedemann Friese, 2011 — three-pass escalating hazard deck.) Spirit Island: "leaving one explorer means a settlement next round, then a ravage… disaster dominoes." Friday escalates the *same* deck through green→yellow→red thresholds. The threat is deterministic yet relentless because *ignored threats compound.*
→ **Sovereign:** Bots shouldn't threaten uniformly all game — they should *compound*. A property a bot grabbed early should *grow* (rent, set bonus, vote weight) so neglecting it snowballs. Tie escalation to Acts: each Act raises the stakes of the Influence gap. Converts a flat race into a tightening vise.

**8. Indirect interaction (no negotiation) still produces tension when an opponent's choice changes *your* desired outcome — especially via a contested shared track.** (Nerdlab "Interaction in Board Games" #052; *Twilight Struggle* analysis, Ananda Gupta & Jason Matthews, 2005 — mechanicsbg.com Tug-of-War mechanic.) "Tension comes from uncertainty about a desired outcome; if an opponent's decision influences your desired outcome, that *is* interaction." Twilight Struggle: "every territory is a tug-of-war; every point worth fighting a small war over" — and reaching the track end is *sudden-death victory.*
→ **Sovereign:** Make Influence a **single shared tug-of-war track**, not three parallel scores. When a bot gains Influence, the marker moves *against you*; an Acts vote is a contested point on it. Reaching the end = win/loss trigger. One contested track makes every bot action register on *your* fate. **This is the highest-leverage structural change.**

---

## The cheapest high-impact lever vs the expensive ones

**CHEAPEST, HIGHEST IMPACT — reframe Influence as one shared, contested tug-of-war track with a visible win threshold (Finding #8 + #4).** No new systems, no negotiation, no AI rewrite. You re-skin the existing Influence numbers as positions on *one* track where bot gains push the marker toward *their* victory and away from yours, leader pays a turn-order tax, and Acts votes are explicit contested points. Every bot turn now moves a needle that decides *your* outcome — the single mechanical change that converts parallel-solitaire into rivalry. (Twilight Struggle / Power Grid proven.)

**Cheap supporting levers (low cost, high tension/credit):**
- **Sequencing tax (Finding #3/#4):** bot acts *after* you and the leader bids last — free denial + honest catch-up from turn order alone.
- **Readable posture line (Finding #6):** one sentence per bot turn surfacing threat *relative to you* ("2 Influence behind, saving for the next vote"), not a log dump. Kills dead-air opponent turns by framing what they did as a threat *to you*.
- **Targeted auction snipe (Finding #2):** one profile contests the asset *you* want / bids you up — scripted as a single conditional.

**Expensive levers (defer):**
- True negotiation / side deals / shared property (already deferred to v2.0 — correctly; high cost, needs real multiplayer logic).
- Adaptive/learning AI posture (Finding #6 done *honestly* needs only board-state reads, but full adaptation is costly and risks the opaque-rubber-band trap of Finding #5).
- Compounding escalation systems (Finding #7) — medium cost; worth it but second priority after the shared track.

**Guardrail (Finding #5):** every catch-up/threat mechanic must be *visible and rule-based*. Hidden trailing-bot boosts would make deterministic opponents feel cheap — the exact failure to avoid.

---

## Sources
- Morten Monrad Pedersen / Automa Factory — https://automafactory.com/about/ ; Going Analog interview — https://www.goinganalogshow.com/article/6/table-talk-building-solo-play-board-games (2014–present; "mimic the interactions, simplest possible way")
- Punchboard, "Solo Modes Part Two (Automa)" — https://punchboard.co.uk/blog-solo-modes-in-board-games-part-two-automa/ (resource competition, distinct AI "personalities," Turczi/Garphill examples)
- Stidjen, Scythe Automa solo review, 2018 — https://stidjenplayssolo.wordpress.com/2018/08/09/scythe-a-solo-automa-review/ ("not whether it blocks but how and where")
- Stonemaier Wingspan rules + Stidjen Wingspan review, 2019 — https://stonemaiergames.com/games/wingspan/rules/ ; https://stidjenplayssolo.wordpress.com/2019/10/29/wingspan-a-solo-review/ (Automa-takes-last-turn denial)
- Friedemann Friese, Power Grid / Funkenschlag, 2004 — https://en.wikipedia.org/wiki/Power_Grid ("leading player gets the biggest disadvantage")
- Vice, "The Blue Shell and Its Discontents," 2017 — https://www.vice.com/en/article/the-blue-shell-and-its-discontents-2/ (hidden rubber-banding cautionary tale)
- Civ V/VI — CivFanatics "AI Attitude Study" https://civfanatics.com/civ3/strategy/game-mechanics/ai-attitude-study/ ; Warmongering (Civ5) https://civilization.fandom.com/wiki/Warmongering_(Civ5) (visible per-rival threat metrics)
- R. Eric Reuss, Spirit Island, 2017 — https://spiritislandwiki.com/index.php?title=Invader (escalating "disaster dominoes" / Adversary panel)
- Friedemann Friese, Friday, 2011 — https://www.shutupandsitdown.com/review-friday/ (three-pass escalating hazard deck)
- Ananda Gupta & Jason Matthews, Twilight Struggle, 2005 — Tug-of-War mechanic, https://mechanicsbg.com/mechanics/tug-of-war/ ; BGG mechanic https://boardgamegeek.com/boardgamemechanic/2888/tug-of-war ("every territory a tug-of-war," shared track = sudden death)
- Nerdlab Games, "Interaction in Board Games" #052 — https://nerdlab-games.com/052-interaction-in-board-games-and-strategy-card-games/ (indirect interaction = opponent choice changes your desired outcome)
- GDC Board Game Design Day, "Why Indirect or Zero Player Interaction Can Be Great" — https://gdcvault.com/play/1025687/Board-Game-Design-Day-Why
