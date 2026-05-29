# The Anticipation Gap & Opponent-Turn Choreography — Choreography Spec for Sovereign

Study-swarm finding. Question: how do the best turn-based games engineer the *anticipation gap* (build-up before a reveal) and present *opponent turns as storytelling, not dead air* — with concrete timings — and how do we choreograph Sovereign's dice, cards, and AI turns in vanilla JS?

**The load-bearing translation:** Sovereign is deterministic, but the *player* doesn't know the outcome until the reveal. That gap is the product. The current `setTimeout(1500)` is a flat dead-air block; it should be replaced by a **structured sequence of beats** (telegraph → action → dwell), each tuned to human perception thresholds, with a fast-mode escape hatch.

---

### 1. Dopamine fires on the *anticipation*, not the payoff — so the reveal must be staged, never instant.
Schultz's dopamine work shows the reward-prediction signal ramps during the *delay between cue and outcome*, and Fiorillo/Tobler/Schultz found dopamine neurons show **sustained, increasing activity through the delay period specifically when the outcome is uncertain** (Fiorillo, Tobler & Schultz 2003, *Science*; Schultz 1998, https://www.jneurosci.org/content/28/31/7837). The felt pleasure lives in the gap. CGMagazine's anticipation piece reinforces the craft pattern: **staggered revelation** ("a sequence of doors unlocking one after another") and **sensory escalation** beat instant resolution (Williams 2024, https://www.cgmagonline.com/articles/how-games-to-build-player-tension/).
→ **Sovereign:** every uncertain surface (2d6, event card) gets a **cue → build → settle** structure, not a snap to value. Stage the reveal in beats; let the number/face *arrive*, don't *appear*.

### 2. Human perception thresholds set the timing budget: <100ms = instant, ~200ms = sweet spot, 200–400ms = core changes, >1s = "delay."
Material Design and NN/g converge: transitions under **100ms read as instantaneous** (invisible), **200ms is the responsiveness sweet spot**, **200–400ms** is right for core UI state changes, and anything **over ~1s feels like lag** (Material Motion, https://m1.material.io/motion/duration-easing.html; NN/g, https://www.nngroup.com/articles/animation-duration/). Use `ease-out` (`cubic-bezier(0,0,0.2,1)`) for things entering/arriving; `ease-in-out` (`cubic-bezier(0.4,0,0.2,1)`) for general motion.
→ **Sovereign:** anticipation beats live in the **400–900ms** band (long enough to *feel* the gap, short enough not to read as lag); micro-feedback (token pops, counter ticks) stays **150–250ms**; a full opponent beat-chain should total **~2.5–3.5s**, not a flat 1.5s wall.

### 3. Telegraph intent BEFORE the action — the single biggest "not dead air" lever.
Slay the Spire shows enemy **intent icons + exact numbers before your turn**; playtesting found this *more engaging* and that it "unlocks tremendous tactical depth" (Mega Crit / Cloudfall 2018, https://slaythespire.wiki.gg/wiki/Intent). Into the Breach goes further to **perfect information** — "at the top of a turn, enemies set up to attack, their intentions and turn order entirely spelled out," turning combat into a "choreographed dance" of wind-ups and counters (Subset Games; Vice 2018, https://www.vice.com/en/article/into-the-breach-turns-mech-combat-into-a-tactical-dance/). The telegraph is what converts an opponent turn from a log dump into a readable mini-drama.
→ **Sovereign:** before an AI opponent acts, surface a **one-beat intent line** ("Hamilton eyes the Bank auction…") *first*. The player reads the wind-up, then watches it resolve — exactly the dance structure. This is the frame the existing posture line should slot into as the *closing* beat (see spec below).

### 4. Hit-pause / dwell: a deliberate freeze makes a change land — and the parse needs time.
The impact-feel literature finds **hit-stop (a brief freeze on impact) is among the strongest contributors to "impact feel,"** alongside sound coherence and camera control (Zhao et al. 2022, "What Features Influence Impact Feedback…", https://arxiv.org/abs/2208.06155). Equally, a transaction the player can't *parse* in time is wasted: digital-board-game pacing fails when "turns are rushed through so quickly players lose their footing" (Workinman, https://workinman.com/digital-board-games/).
→ **Sovereign:** insert a **200–400ms hit-pause** before a contested result resolves (the beat of dread), and a **400–700ms dwell** *after* an AI transaction so the human reads what changed before the turn advances.

### 5. Pacing is a design *layer*, not a toggle — but a fast-forward is non-negotiable for experienced + replay use.
Terraforming Mars Digital's animations felt "slow and repetitive," yet a bare skip-animation patch "sacrificed pacing for speed" and felt unpolished — the lesson: "pacing should be a design layer, not a toggle… give control to slow down to think or speed up when replaying" (Workinman, link above). Hearthstone players have long demanded 2x/3x/4x battle speed and skip (Blizzard forums, https://us.forums.blizzard.com/en/hearthstone/t/feature-request-animation-turning-off-and-battle-skip/145908); XCOM's forced ~30s enemy-turn camera with no speed-up is a recurring complaint (Steam, https://steamcommunity.com/app/200510/discussions/0/2425614539585431881/).
→ **Sovereign:** ship a **3-tier speed control** (Cinematic / Normal / Fast) AND a **click-to-skip** that instantly settles the *current* beat to its end state. First-timers get full choreography; veterans and replay-scrubbing get instant resolution **without ever losing the final state** (skipping fast-forwards, never deletes, the result).

---

## CHOREOGRAPHY SPEC (vanilla JS — rAF/CSS transitions + a small beat-runner)

Implement a `playBeats([...])` sequencer over `requestAnimationFrame`/`setTimeout` where each beat has `{label, ms, onStart}`. A global `SPEED` multiplier scales every `ms` (Cinematic 1.4×, Normal 1.0×, Fast 0.0× → instant). A `skip()` flag fast-forwards the running chain to final state.

### (a) Dice roll — 2d6, total ≈ 950ms (Normal)
| Beat | ms | Motion / feel |
|---|---|---|
| Cue | 150 | Dice "pick up": scale 1→1.1, small lift; click/shake SFX begins |
| Tumble | 500 | Faces cycle random values every ~60–80ms (CSS class swap or `transform: rotate` jitter); rattle SFX loops |
| Settle | 250 | Decelerate (ease-out), faces lock to the real values with a squash-and-stretch bounce; "clack" SFX |
| Read dwell | 50 | Total pips flash/scale-pop once; brief hold before consequence |
*Why:* 500ms tumble sits in the anticipation band (§2) — long enough to build, short of the "10-second table wait" anti-pattern players hate. The faces must *visibly cycle* (uncertainty cue, §1) then *decelerate* (not cut) to settle.

### (b) Card draw / resolve — total ≈ 1500ms (Normal)
| Beat | ms | Motion / feel |
|---|---|---|
| Slide-in (face-down) | 300 | Card slides from deck to center, ease-out; paper SFX |
| Dwell (face-down) | 400 | Hold face-down — the anticipation gap (§1). Faint glow pulse |
| Flip | 350 | `rotateY 180deg`, ease-in-out; "whoosh"/flip SFX; back→front swap at 50% |
| Effect reveal | 200 | Title + effect text scale-pop in; thematic sting |
| Resolve | 250 | Effect applies; affected counters tween (§ shared rule below); confirm SFX |
*Why:* the **400ms face-down dwell is the load-bearing beat** — instant flip kills the gap. Flip 350ms ease-in-out reads as a deliberate reveal, not a glitch.

### (c) Full opponent turn — total ≈ 2.8–3.4s (Normal) — **replaces `setTimeout(1500)`**
| Beat | ms | What the human reads |
|---|---|---|
| **Telegraph / intent** | 600 | Intent line + soft camera/highlight to the actor: *"Hamilton eyes the Bank auction…"* (§3 — the wind-up) |
| Hit-pause | 250 | Brief freeze before commitment (§4 — beat of dread on contested moves) |
| **Move / action** | 500 | Token/marker animates to its target; asset card highlights; action SFX |
| **Transaction** | 500 | Cash/IP counters tween up/down with coin/gavel SFX; seized asset recoils + red flash (loss > gain ceremony) |
| **Posture line (existing)** | 600 | The per-opponent posture line we already show animates in as the **closing narrative beat** — the move's *meaning* |
| Parse dwell | 400 | Hold final state so the human absorbs the delta before turn passes (§4) |
| Handoff | 150 | Subtle "turn passes" wipe/chime to next actor |
*Why:* this is the Into-the-Breach dance — **telegraph → resolve → meaning → dwell**. The current flat 1500ms gives no telegraph and no dwell; it's exactly the "dead air" anti-pattern. ~3s total, scaled by SPEED.

### Shared counter rule
Numbers **never snap**. Any IP/cash change tweens over **400–500ms** (count up/down) with a scale-pop on the final value; losses get a heavier/lower SFX and a brief red flash (loss aversion — see sibling `juice-and-feedback.md` §6).

### FAST-MODE / SKIPPABILITY RULE (non-negotiable)
1. **Three speeds:** Cinematic (×1.4) / Normal (×1.0) / Fast (×0.0 = instant). Persist choice in `localStorage`.
2. **Click-to-skip:** a click/Space during any chain sets `skip=true`; the runner jumps every remaining beat to its **final state instantly** — never drops the result, never blocks input (Slay the Spire's non-blocking rule, `juice-and-feedback.md` §8).
3. **Replay scrub = Fast by default:** the loadFromPayload/replay path runs at ×0.0 so save/load roundtrips and the playability harness never wait on animation.
4. **Never block game logic on animation:** state mutates immediately in `reduce()`; choreography is a *presentation layer* over already-final state. If the player acts ahead, fast-forward and continue.

---

## Sources
- Fiorillo, Tobler & Schultz (2003), *Discrete Coding of Reward Probability and Uncertainty by Dopamine Neurons*, Science — delay-period dopamine peaks under uncertainty: https://www.jneurosci.org/content/28/31/7837 (Schultz reward-delay work)
- CGMagazine, Williams (2024), *How Games Use Anticipation to Build Player Tension* — staggered revelation, sensory escalation, "short delay heightens focus": https://www.cgmagonline.com/articles/how-games-to-build-player-tension/
- Material Design, *Motion — Duration & Easing* — 100–500ms perceivable, 200ms sweet spot, easing curves: https://m1.material.io/motion/duration-easing.html
- Nielsen Norman Group, *Executing UX Animations: Duration and Motion* — 200–400ms core changes, >1s reads as delay: https://www.nngroup.com/articles/animation-duration/
- Slay the Spire Wiki, *Intent* (Mega Crit, 2018) — telegraph enemy actions + numbers before the turn: https://slaythespire.wiki.gg/wiki/Intent
- Vice, *Into the Breach Turns Mech Combat Into a Tactical Dance* (2018) — perfect-information telegraph, wind-ups/counters choreography: https://www.vice.com/en/article/into-the-breach-turns-mech-combat-into-a-tactical-dance/
- Zhao et al. (2022), *What Features Influence Impact Feedback in Action Games?* arXiv:2208.06155 — hit-stop, sound coherence, camera among strongest impact-feel features: https://arxiv.org/abs/2208.06155
- Workinman, *Making Digital Board Games Feel Real: 8 Tips* — "pacing is a design layer, not a toggle"; rushed turns lose footing; feedback > numbers: https://workinman.com/digital-board-games/
- Blizzard Forums, *Feature Request: Animation Turning Off and Battle Skip* — sustained player demand for speed control/skip: https://us.forums.blizzard.com/en/hearthstone/t/feature-request-animation-turning-off-and-battle-skip/145908
- Steam, *Speed-up enemy turn (XCOM: Enemy Unknown)* — ~30s forced enemy-turn camera, no speed-up = recurring complaint: https://steamcommunity.com/app/200510/discussions/0/2425614539585431881/
