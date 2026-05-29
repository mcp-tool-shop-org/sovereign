# Juice + Sound — Pillar ② build spec (v1.5)

**Status:** APPROVED by director (2026-05-29) — "Pillar ② Juice + sound, send a research swarm online to do this right."
**Research (read all four):** `juice-sound-techniques.md` (J1), `juice-sound-audio.md` (J2), `juice-sound-choreography.md` (J3), `juice-sound-restraint-a11y.md` (J4).
**Owner files:** `release/digital-mode/sovereign-solo.html` + `test/playability.harness.mjs` + `test/playability.test.mjs` (to keep gates green via instant mode).

## THE LOAD-BEARING ARCHITECTURE (non-negotiable — protects everything we built)

1. **Presentation-only.** Juice/sound NEVER touch `reduce()`, state, RNG, `decisionLog`, or `snapshotHash`. Logic resolves immediately in the reducer (as today); animation/sound play AFTER, reading already-final state. Verified by: determinism test (byte-identical) + GATE 5 replay (integrity verified).
2. **SPEED setting with an INSTANT mode** — `Cinematic ×1.4 / Normal ×1.0 / Fast (instant)`, persisted to localStorage. INSTANT bypasses ALL choreography/tweens (final state shown immediately, no rAF/setTimeout animation, no dwell).
   - **Replay / `loadFromPayload` MUST force INSTANT** (J3/J4: replay never re-plays tweens).
   - **The playability harness MUST boot in INSTANT** (e.g. `?speed=instant` URL param the harness sets) so all 6 checks stay fast + deterministic. Add `?speed=instant` handling to the game; set it in the harness boot.
   - Click / Space / tap skips the current choreography chain to its final state.
3. **Non-blocking.** Choreography never blocks input >1.5s without a skip (J4). The human can always act; opponent-turn dwell is skippable.

## Build priorities (synthesis of J1–J4)

### A. Number-tween system (J1) — the core of "less flat"
A single shared rAF tweener. EVERY player-visible numeric change animates instead of snapping: cash, Influence, the three tracks, scores, bids.
- Big jumps ~600–900ms, small ~300–400ms, `easeOutExpo`/`easeOutCubic`.
- **Gain/loss asymmetry:** gains = `easeOutBack` overshoot + upward float + ascending pitch; losses (debt levy, rent paid, Credit escalation, seized asset) = `easeInCubic` "drain" + downward drift + descending pitch + restrained red (NOT strobe). Losses land with *gravitas* (~2× weight), never punishing/cheap (J4).
- **Stagger** multi-source resolution 80–120ms apart, pop + sound each, roll the running total (J1 — Balatro's "sequencing beats magnitude").
- Canonical pop on buy/place/upgrade/gain: scale → 1.15–1.25× over 150ms `easeOutBack` + small punch-rotation.

### B. ZzFX audio (J2)
Vendor `ZzFXMicro.min.js` INLINE (MIT, ~1.2 KB; keep the license header). A view-layer `playCue(name)` shim (ZzFX `randomness=0` for determinism-of-feel; never in reduce). 13 cues mapped to events (dice, buy, rent in/out, upgrade, Act pass/fail, IP gain, debt levy, Doubt/Crisis/Panic/Default, victory) — use J2's synthesis recipes; period-flavored (gavel/coin/quill/drone). Autoplay-unlock: resume the AudioContext on the existing Start-game user gesture. **Bind sound to the existing narration level** (Off = silent, Minimal = key events only, On = all) — do NOT add a separate axis — PLUS a persisted master mute toggle. Default volume low (~0.35). Under `prefers-reduced-motion`, suppress only sustained drone/sting cues (keep short confirmations). Every cue keeps its visible toast + aria-live line (never sound-alone, WCAG 1.4.1).

### C. Choreography (J3) — anticipation + kill opponent dead-air
A `playBeats([])` rAF/CSS sequencer honoring the global SPEED multiplier.
- **Dice ~950ms:** lift/cue → tumble (faces cycle ~60–80ms) → settle (ease-out + small bounce + "clack") → read-dwell + pip pop. Faces visibly cycle then decelerate; never cut.
- **Card ~1500ms:** slide-in face-down → **400ms face-down dwell (the anticipation beat)** → flip 350ms (rotateY) → effect reveal → resolve (counters tween).
- **Opponent turn ~3s, REPLACES the flat `setTimeout(1500)`:** telegraph/intent 600ms (reuse/extend the rival posture system — "Hamilton eyes the Bank auction…") → hit-pause → move → transaction (counter tween; loss = red flash) → the existing closing posture line → parse-dwell → handoff. (Into-the-Breach: telegraph → resolve → meaning → dwell.) Under INSTANT, all of this collapses to immediate.

### D. Restraint + a11y guardrails (J4) — MUST follow
- **Feedback hierarchy / ration ceremony:** Tier 0 silent (hover/highlight) · Tier 1 subtle (normal income, routine bid) · Tier 2 notable (auction won, rival overtake, Act pass) · Tier 3 rare ceremony (Credit Crisis/Default, seized asset, victory/defeat). Don't juice everything.
- **Photosensitivity (WCAG 2.3.1):** no more than 3 flashes/sec; no large saturated-red strobe on Crisis/Default — use weight/fade, not flashing.
- **reduce-motion (WCAG 2.3.3):** resolve instantly or ≤200ms cross-fade while PRESERVING the information (extend the existing `prefers-reduced-motion` block).
- **Never sound/color alone (WCAG 1.4.1):** every audio cue → visible event; every gain/loss → +/− sign + text, not just green/red.
- **Performance:** single rAF loop; animate transform/opacity only; batch reads-then-writes (no layout thrash); skip scheduling entirely under INSTANT/reduce-motion.
- Add a small **Settings** surface for SPEED + mute (or fold into existing settings). Designer chrome stays gated.

## Verification gate
- `npm test` green: smoke + determinism (byte-identical) + ALL playability gates incl **GATE 5 replay** (proves presentation-only held). Harness boots INSTANT.
- `npm run verify` PASS. No new runtime deps shipped (ZzFX is inlined, not an npm dep).
- Honest limit: the harness verifies LOGIC/gates/replay, NOT feel or sound. **Whether the juice feels good and the sound lands is gate 6 (the human walkthrough) — Mike's eyes/ears.** Report this plainly.
