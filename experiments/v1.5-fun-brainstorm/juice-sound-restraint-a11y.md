# Juice / Sound Layer — Restraint, Feedback Hierarchy & Accessibility Ruleset

Guardrail spec for Sovereign's v1.5 juice + sound layer. This is a MUST-follow ruleset, not a suggestion list. Sovereign is deterministic, turn-based, single offline HTML, and already ships `aria-live`, a `prefers-reduced-motion` query, and narration Off/Minimal/On — the juice layer must extend that discipline, not undermine it.

## 1. Restraint principle (why a hierarchy exists)

Juice is non-functional sensory feedback (shake, particles, sound) layered on actions. Overused, it becomes a crutch that "masks fundamental flaws" and tricks players into mistaking surface excitement for depth, producing a "chaotic and overwhelming experience that quickly becomes fatiguing" (Wayline 2025). Restraint is the technique: Hollow Knight is cited as making impacts feel great *because* most feedback is subtle and reserved. **Rule: most events get subtle feedback; ceremony is rationed to the few moments that carry game-state weight.**

## 2. Feedback-hierarchy table (which event gets how much)

Tier the budget. Visual hierarchy: important = big/contrast/motion; unimportant = shrink/remove (GameAnalytics). Apply loss-aversion *asymmetry* (§3) so losses read heavier within their tier — but never cheap/punishing.

| Tier | Events | Allowed feedback | Forbidden |
|------|--------|------------------|-----------|
| **0 — Silent** | hover, valid-move highlight, log scroll | CSS state change only; optional <=80ms tick | particles, shake, sustained sound |
| **1 — Subtle** | routine income, normal bid, pass turn, phase advance | short tween (120–200ms), 1 soft sound, value count-up | screen shake, full-screen flash |
| **2 — Notable** | auction won, asset acquired, milestone, rival overtakes you | accent color + icon + brief particle burst, single stinger | sustained loops, repeated shake |
| **3 — Ceremony (rare)** | Credit-Crisis / Default, debt-servicing levy, seized asset, game-win/loss | the ONE big moment: held tone, controlled tint pulse, distinct sound — gated by §4 flash limits | flashing >3/s, strobe, anything that blocks input >1.5s without skip |

Tier 3 must be uncommon by construction; if it fires every turn it is no longer ceremony and causes fatigue.

## 3. Loss-aversion, applied FAIRLY

Kahneman & Tversky (1979, *Prospect Theory*; λ≈2.25 in Tversky & Kahneman 1992) — losses loom ~2x as large as equal gains. Design implication: a debt-servicing levy or seized asset (Tier 3) should land **heavier than a same-size gain** — heavier *weight/lower pitch/more deliberate timing*, NOT louder, NOT flashier, NOT mocking. The asymmetry is in gravitas, not punishment. A small gain stays Tier 1 even if a small loss nudges toward Tier 2's bottom. Never use jump-scare volume spikes or red strobes to "sell" a loss — that reads as cheap and trips photosensitivity limits.

## 4. Photosensitivity — hard flash limits (WCAG 2.3.1, Level A)

The Credit-Crisis/Default ceremony is the only real flash risk. It MUST obey, all of:
- **No more than 3 general flashes AND no more than 3 red flashes in any 1-second window.**
- A *general flash* = opposing relative-luminance change ≥10% of max where the darker state is below 0.80 luminance. Keep Sovereign's transitions below this (gentle tint/fade), or under 3/s.
- *Red flash* (any saturated-red opposing transition, R/(R+G+B) ≥ 0.8) is treated more strictly — **avoid saturated-red flashing entirely** for Crisis/Default.
- Safe-area exception exists (flashing area ≤ .006 steradians / 25% of a 10° field) but DO NOT rely on it — design under the 3/s frequency rule instead.

## 5. prefers-reduced-motion — the RIGHT behavior (WCAG 2.3.3 AAA; GAG)

Reduced motion ≠ silently dropping feedback. Per W3C/Pope Tech: remove decorative motion, but **preserve the information** the motion carried via a static/instant alternative.
- Tier 0–2: **instant state resolution** — value changes apply immediately; replace tweens/particles with the final state (e.g. number snaps to new total, accent color appears, no shake).
- Tier 3: replace choreography with a **single short cross-fade (≤200ms) or instant tint swap**, never a strobe/pulse. The Crisis/Default *information* must still be unmistakable (text + icon, §6).
- Game Accessibility Guidelines: let players turn off screen shake / motion blur / FOV shifts independently. Honor BOTH the OS `prefers-reduced-motion` query AND an in-game toggle (don't force users into OS settings).

## 6. Don't rely on sound OR color alone (WCAG 1.4.1, Level A)

~1 in 12 men have color-vision deficiency; many play muted. Every cue needs a redundant channel:
- **Every color change → also a text label, icon, or shape.** Crisis = red tint AND a "CREDIT CRISIS" text banner AND a warning glyph.
- **Every audio cue → also a visible event** (log line via `aria-live`, badge, or icon). Audio is enhancement, never the sole carrier.
- Gain/loss must be distinguishable without color: use +/− sign, up/down arrow, or shape — not just green/red.

## 7. Mute, volume & autoplay etiquette (GAG / Xbox AG)

- **Audio defaults to OFF or a low default (~30–40%) on first load; never autoplay loud.** Browsers may block autoplay anyway — first sound after user gesture only.
- Persistent, reachable **master mute** + separate sliders for **SFX vs music/ambience** (independent mute/volume per GAG).
- Persist the setting (localStorage) so it survives reloads.

## 8. Fast mode / skippability / REPLAY (load-bearing)

Experienced players and the replay scrubber must escape choreography (per RPG Maker fast-forward/skip plugins, Speed0):
- **Animation Speed setting: Full / Fast / Instant.** Instant = behaves like reduced-motion (state snaps, no waits).
- **Hold-to-fast-forward and tap-to-skip** the current animation; a sticky "auto-fast" toggle so it isn't held every turn.
- **REPLAY MUST default to Instant choreography.** The scrubber resolves each step to final state immediately; never re-play Tier-1/2 tweens slowly during scrub. Ceremony in replay = a brief marker, not the full Tier-3 sequence. Stepping/seeking is instant; only explicit "play at normal speed" re-enables choreography.
- No animation may block input/advance for >1.5s without an active skip affordance.

## 9. Performance — no jank (rAF discipline)

Target a smooth 60fps on a mid-range laptop (web.dev, Chrome DevDocs):
- All animation runs through a **single `requestAnimationFrame` loop**; never `setTimeout`/`setInterval` for visual motion.
- **Batch DOM reads then writes.** Read all layout (`getBoundingClientRect`, `offsetWidth`) first, then write all mutations — never interleave read→write→read in a loop (causes forced synchronous reflow / layout thrashing).
- Animate **`transform` and `opacity` only** (compositor-friendly); avoid animating width/height/top/left/box-shadow.
- Cap concurrent particles; pool/reuse nodes; tear down finished effects so they don't accumulate.
- Respect reduced-motion/Instant by **not scheduling** the rAF work at all (cheaper than running then hiding).
- Keep each frame's JS well under ~16ms; long tasks = dropped frames = jank.

---

## Sources
- Wayline, "The 'Juice' Problem / Juice Overload / Perils of Over-Juicing" (2025) — https://www.wayline.io/blog/the-juice-problem-how-exaggerated-feedback-is-harming-game-design ; https://www.wayline.io/blog/juice-overload-sensory-feedback-hurts-gameplay
- GameAnalytics, "Squeezing more juice out of your game design" — https://www.gameanalytics.com/blog/squeezing-more-juice-out-of-your-game-design (visual hierarchy; animation-frequency stats)
- Kahneman & Tversky, "Prospect Theory: An Analysis of Decision under Risk" (1979); Tversky & Kahneman (1992, λ≈2.25) — summary: NN/g, https://www.nngroup.com/articles/prospect-theory/ ; meta-analysis https://www.sciencedirect.com/science/article/pii/S0167487024000485
- W3C WCAG 2.3.1 "Three Flashes or Below Threshold" (Level A) — https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html
- W3C WCAG 2.3.3 "Animation from Interactions" (AAA) — https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
- W3C WCAG 1.4.1 "Use of Color" (Level A) — https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-without-color.html
- Pope Tech, "Design accessible animation and movement" (2025) — https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/ (reduced-motion: preserve info, static alternative)
- Game Accessibility Guidelines, Full list — https://gameaccessibilityguidelines.com/full-list/ ; Xbox Accessibility Guideline 105 — https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/105 (motion off, independent SFX/music mute, lower audio for AT)
- RPG Maker "Action Sequence Fast Forward/Skip" (Yanfly/Irina) — https://www.yanfly.moe/wiki/Action_Sequence_Fast_Forward/Skip_(Irina) ; Speed0 — https://store.steampowered.com/app/1251530/Speed0/ (hold-to-FF, tap-to-skip, auto-FF toggle)
- web.dev, "Avoid large, complex layouts and layout thrashing" — https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing ; Chrome, "Forced reflow" — https://developer.chrome.com/docs/performance/insights/forced-reflow
