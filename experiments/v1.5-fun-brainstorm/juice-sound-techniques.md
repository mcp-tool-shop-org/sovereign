# Juice & Sound Techniques — Timed Spec for a Turn-Based Economic Board Game

Scope: discrete-event juice for a deterministic, turn-based, single-HTML game. Screenshake/action-game tricks excluded. All techniques implementable in vanilla JS/CSS: CSS transitions/transforms + a small `requestAnimationFrame` tween loop. No framework, no build.

## Foundational principles (what actually transfers)

- **Tween every value change; never snap.** Jonasson & Purho's core lesson is that the *transition* between two states is where the feel lives — interpolate position, scale, color, and numbers (Jonasson & Purho, GDC Europe 2012). Swink frames this as the polish layer above core mechanics (Swink, *Game Feel*, 2008).
- **Ease-out is the default for responsive feedback.** Quick start + decelerating settle reads as "responsive." Reserve bounce/elastic (overshoot) for celebratory, lighter moments (web.dev "Choosing the right easing").
- **Duration windows (NN/g):** ~100ms = feels instant (toggles/flags); 200–300ms = substantial change reads as deliberate; 500ms+ = sluggish/"a drag." Exits 200–250ms (slightly faster than entrances).
- **Count-up numbers decelerate.** CountUp.js defaults to easeOutExpo: fast roll grabs attention, slow tail lets the final figure register. Use `easeOutCubic`/`easeOutExpo`, ~600–900ms for big jumps, ~300–400ms for small ones.
- **A sound on every discrete action**, pitched/stacked when chaining — the single highest-leverage juice add for economic games (see Balatro below).

## The "number-go-up" loop (Balatro, 2024 — the exemplar)

What makes it satisfying, decomposed: (1) the score counter **rolls up** rather than snapping; (2) contributions are **sequenced/staggered**, not summed at once — each chip/mult ticks in turn so you *watch* the total build; (3) **audio pitch rises** with each step in the chain — compounding "ding"s that climb; (4) the source element **judders/pops** the instant it fires, sync'd to its sound; (5) when chains get long the engine **accelerates** the stagger so big plays feel like an avalanche (KokuTech Balatro breakdown; Skybox "Balatro: the numbers game", 2025). The takeaway for us: when multiple income/rent/Influence sources resolve in one step, **stagger them ~80–120ms apart, pop+sound each, roll the running total**. Sequencing beats magnitude — a 500-point hand staggered feels bigger than a 5000-point hand summed instantly.

Concrete reference values from the mix-and-jam *Balatro-Feel* recreation (DOTween): scale-pop to **1.15–1.25× over 0.15s, Ease.OutBack** (overshoot); a **punch-rotation of 2.5–5°, vibrato 20** on the same 0.15s for a "judder"; larger swap/play gestures use **30° punch over 0.15s**. These are the canonical pop/judder numbers — short (150ms) and back-eased.

Slay the Spire adds: streaks on draw/discard to telegraph flow, and crucially **non-blocking animations** — the player can act faster than the juice plays out, so feedback never gates input (Cloudfall Studios "Flash Thoughts: Slay the Spire's UI").

## Easing cheat-set (vanilla)

- `easeOutCubic` → `t => 1-Math.pow(1-t,3)` — default for moves/count-ups.
- `easeOutExpo` → `t => t===1?1:1-Math.pow(2,-10*t)` — dramatic count-up tail.
- `easeOutBack` → overshoot pop; CSS `cubic-bezier(.34,1.56,.64,1)`. Use for gains/celebrations only.
- Material 3 "emphasized": `cubic-bezier(.2,0,0,1)` ~300–500ms for larger transitions; "standard" ~200–300ms for utility.

## Per-event spec (Sovereign turn loop)

| Event | What animates | Duration | Easing | Sound-sync |
|---|---|---|---|---|
| **Dice roll** | Faces cycle 4–6 frames (~60ms each), settle with a small scale-pop on final value | 400–500ms tumble + 150ms pop | linear cycle → `easeOutBack` settle | tick per face; thunk on settle |
| **Token move** | Step token cell-by-cell, ~120–160ms/cell, slight arc/lift | 120–160ms × cells | `easeInOutQuad` per hop | soft step per cell |
| **Buy asset** | Cash counts DOWN; asset card scale-pops onto board 1.0→1.12→1.0 | count 400ms; pop 150ms | count `easeOutCubic`; pop `easeOutBack` | "ka-chunk" on placement (sync to pop apex) |
| **Rent received** | Cash counts UP + green color-flash + +N float rising/fading | 600ms count; 700ms float | `easeOutExpo` | rising "cha-ching"; stagger if multi-source (~100ms apart) |
| **Rent paid** | Cash counts DOWN + brief amber/red flash + −N float | 450ms count; 600ms float | `easeOutCubic` | softer, lower-pitch tick (loss reads quieter) |
| **Upgrade** | Asset scale-pop 1.0→1.18→1.0 + tier badge swap with 360° flip | 300ms | `easeOutBack` | bright ascending two-note |
| **Influence gain** | Influence value rolls up + token pulse + standings bar animates to new position | 600ms count; 400ms bar | `easeOutCubic` | distinct chime, pitch ↑ with amount |
| **Act pass (vote)** | Tally ticks up vote-by-vote (~150ms each) to threshold, then banner scale-in + green sweep | tally 150ms × votes; banner 350ms | tally linear; banner `easeOutBack` | gavel/seal stamp on pass |
| **Act fail** | Tally ticks then stalls short of line; bar shakes horizontally ±4px (NOT screenshake — element only) + desaturate | 300ms shake | `easeOutQuad` decay | low buzzer/dud, single |
| **Debt levy (cash loss)** | Cash counts DOWN hard + red flash + heavier −N float drifting *downward* | 500ms count; 700ms float | `easeInCubic` (accel = "draining") | descending, ominous coin-drain |
| **Credit-tier escalation** | Tier indicator ratchets up one notch with red pulse + brief vignette on the indicator panel only | 400ms ratchet + 250ms pulse | `easeOutBack` notch | rising tension sting (one-shot) |

### Loss vs gain asymmetry (design note)
Gains get overshoot (`easeOutBack`), brighter/ascending sound, upward float. Losses get accelerating (`easeInCubic`), lower/descending sound, downward drift, red flash. This asymmetry is the cheapest way to make money *mean* something — escalation/levy should feel heavier than equivalent gains.

## Vanilla feasibility notes

- **Count-up:** one shared rAF tween: `n = from + (to-from)*ease(elapsed/dur)`, write `el.textContent = Math.round(n)`. Trivial, no deps.
- **Pops/flashes:** toggle a CSS class with `transition: transform .15s cubic-bezier(.34,1.56,.64,1)` and `@keyframes flash`. Force reflow (`void el.offsetWidth`) to replay.
- **Floats (+N/−N):** absolutely-positioned span, CSS keyframe translateY+opacity, removed on `animationend`.
- **Stagger:** `setTimeout` ladder or per-item `animation-delay`. Keep base step 80–120ms.
- **Sound:** small WebAudio oscillator/sample bank; pitch-shift by `playbackRate` for chain escalation. All inlinable as base64 in the single HTML.
- **Determinism:** juice is presentation-only — drive it off resolved state, never let it feed back into the reducer. Keep input non-blocking (Slay the Spire rule).

## Sources

- Jonasson & Purho, "Juice it or lose it," GDC Europe 2012 — https://www.youtube.com/watch?v=Fy0aCDmgnxg — tween/ease every state change; layer feedback compositionally.
- Swink, *Game Feel*, 2008 (referenced) — https://www.gdcvault.com/play/1016487/Juice-It-or-Lose — juice as the polish layer over core mechanics.
- NN/g, "Executing UX Animations: Duration and Motion" — https://www.nngroup.com/articles/animation-duration/ — 100ms instant / 200–300ms deliberate / 500ms+ sluggish; exits faster than entrances.
- web.dev, "Choosing the right easing" — https://web.dev/articles/choosing-the-right-easing — ease-out default; bounce/elastic 800–1200ms, use sparingly.
- CountUp.js (inorganik) — https://github.com/inorganik/countUp.js — default easeOutExpo; decelerating roll lets final value register.
- mix-and-jam, *Balatro-Feel* (DOTween recreation) — https://github.com/mixandjam/balatro-feel — pop 1.15–1.25× / 0.15s / OutBack; punch-rotation 2.5–5°, vibrato 20.
- KokuTech, "Learning How Balatro Rewards Players" — https://www.kokutech.com/blog/gamedev/design-patterns/power-fantasy/balatro — staggered contributions, accelerating chains, compounding feedback.
- Skybox, "Balatro: the numbers game," 2025 — https://skyboxcritics.com/2025/05/01/balatro-the-numbers-game/ — rolling counter + layered/pitched sound turns a number into a moment.
- Cloudfall Studios, "Flash Thoughts: Slay the Spire's UI," 2018 — https://www.cloudfallstudios.com/blog/2018/2/20/flash-thoughts-slay-the-spires-ui — exaggerated weighty feedback; non-blocking animations.
- Material Design 3, Easing & duration — https://m3.material.io/styles/motion/easing-and-duration — emphasized `cubic-bezier(.2,0,0,1)` for larger, standard for utility transitions.
