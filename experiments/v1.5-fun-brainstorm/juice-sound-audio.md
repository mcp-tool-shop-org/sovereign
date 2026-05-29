# Sound & Audio for Sovereign (single-file, offline, deterministic)

**Verdict: (A) Procedural Web Audio via a vendored ZzFX-micro core.** It is the only approach that satisfies *all* hard constraints simultaneously, and it is the de-facto standard for size-constrained offline HTML games (js13k).

## Why procedural / ZzFX wins (evidence)

- **ZzFX is <1KB compressed, MIT, zero deps, self-contained.** "Less than 1 kilobyte when compressed... no external libraries... 20 controllable parameters" — KilledByAPixel/ZzFX README, Frank Force, 2019+ ([repo](https://github.com/KilledByAPixel/ZzFX), [README](https://github.com/KilledByAPixel/ZzFX/blob/master/README.md)). `ZzFXMicro.min.js` is **1.19 KB raw** ([source](https://github.com/KilledByAPixel/ZzFX/blob/master/ZzFXMicro.min.js)). Each cue is a single array of numbers — sounds *are* code, so they inline trivially with **no external requests** (file:// safe). Built precisely for the js13k size limit.
- **Base64 samples (B) blow the budget.** Base64 inflates binary by a fixed **33%** (3 bytes→4 chars; Wikipedia/[Lemire 2019](https://lemire.me/blog/2019/01/30/what-is-the-space-overhead-of-base64-encoding/)). A *short* recorded SFX is ~15–40 KB as MP3/OGG → ~20–55 KB inlined. Eight cues ≈ **160–440 KB added to a 558 KB file** — a 30–80% bloat. Embedded data URIs also hit "corrupt source" flakiness on larger blobs ([Mozilla bug 1436678](https://bugzilla.mozilla.org/show_bug.cgi?id=1436678)). Rejected on size + reliability.
- **External files (C) break the contract.** Any `release/*.wav` is an HTTP/file request the single-file, offline, `file://` mandate forbids, and complicates the npm tarball. Rejected (only viable if Sovereign ever abandons single-file — it won't).
- ZzFX synthesizes the *texture* Sovereign wants: gavel (filtered noise burst), coin (bright detuned blip), drone (slow saw + vibrato) — all via OscillatorNode + GainNode ADSR + BiquadFilter, the exact primitives MDN documents ([Advanced techniques](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques), [OscillatorNode](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode)).

Total added weight: **~1.5 KB** (micro core + cue table + glue). Negligible against 558 KB.

## Determinism

Audio is **pure presentation**. Cues fire from a `playCue(name)` shim called *only* in the view layer (where toasts/`#ariaLive` already render), never inside `reduce()`/RNG. ZzFX's internal randomness param `k` is set to **0** per cue so output is stable — but even non-zero would be irrelevant: it touches no game state. Save/load hash is unaffected.

## Autoplay unlock (one-time, on first gesture)

Browsers create an AudioContext **suspended** until a user gesture; call `resume()` after the first click/tap ([Chrome autoplay](https://developer.chrome.com/blog/autoplay/), [MDN best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)). ZzFX lazily creates `zzfxX=new AudioContext` but does **not** unlock it, so wire it ourselves:

```js
let _ac;
function unlockAudio(){ _ac = zzfxX ||= new (AudioContext||webkitAudioContext)();
  if(_ac.state==='suspended') _ac.resume(); }
['pointerdown','keydown'].forEach(e=>addEventListener(e,unlockAudio,{once:true}));
```

The game's own Start/Begin button is the natural gesture (context comes up `running`).

## Mute + persistence + settings integration

- **Mute toggle** in the toolbar next to the narration verbosity control, persisted to `localStorage['sovereign.sound']` (mirror the existing `sovereign.narrationLevel` pattern at line 4085/7969). Default **on** but quiet. WCAG 1.4.2 is satisfied by an explicit user control ([Silktide](https://silktide.com/accessibility-guide/the-wcag-standard/1-4/distinguishable/1-4-2-audio-control/)) — Sovereign has no >3s autoplay loop, so we're already compliant; mute is courtesy + correctness.
- **Bind sound to the existing narration level**, not a separate axis: `off` → silent; `minimal` → essential/escalation cues only; `on` → full cue list. This reuses the shipped `NARRATION_LEVEL` gate (line 7099) and respects users who already chose quiet.
- **Reduced-motion**: the file already suppresses dice flicker/toast slide under `@media (prefers-reduced-motion: reduce)` (line 526). Read the same query in JS (`matchMedia('(prefers-reduced-motion: reduce)').matches`) and **drop the escalation drone/sting** (the only sustained/attention-grabbing cues) while keeping short confirmations. Sound is *never* the sole channel — every cue already has a visible toast + an `#ariaLive` line, so deaf/HoH players lose nothing ([blind-accessibility guide, Moldován](https://www.asoundeffect.com/game-audio-blind-accessibility/)).

## CUE LIST (procedural; ZzFX 21-param arrays `[volume,randomness,freq,attack,sustain,release,shape,…]`; tune in the [ZzFX designer](https://killedbyapixel.github.io/ZzFX/))

| # | Game event | Character | Recipe (shape / pitch / envelope) | Starter ZzFX array | Level |
|---|-----------|-----------|-----------------------------------|--------------------|-------|
| 1 | Dice roll/resolve | wooden clatter | noise (q=4) short bursts, fast decay | `[1.1,0,90,,.02,.12,4,1.5,,,,,,8]` | min |
| 2 | Buy property | coin clink | square+tri, bright ~900Hz, +slide, tiny | `[1.2,0,940,.01,.03,.12,1,1.8,,,200,.05]` | on |
| 3 | Pay rent (you pay) | dull coin drop | sine ~400Hz, downward slide, soft | `[.9,0,420,,.04,.18,,1.2,-90]` | on |
| 4 | Upgrade/build | ascending chime | tri, two-step up, light reverb | `[1,0,520,.02,.08,.22,3,,,9,,,.1]` | on |
| 5 | Act PASS | gavel knock + bright tail | filtered noise thud → short major blip | `[1.4,0,150,,.03,.2,4,2,,,,,,6,,.1]` | min |
| 6 | Act FAIL | gavel + flat low buzz | same thud, saw ~120Hz, no resolve | `[1.3,0,130,,.04,.25,2,,,,,,,4]` | min |
| 7 | IP / Influence gain | rising glassy ping | sine ~700Hz slide-up, sparkle | `[.8,0,680,.01,.05,.15,,,40,,,,,,,.05]` | on |
| 8 | Debt levy / interest | coin scrape + low knock | noise rasp + sine ~200Hz | `[1,0,210,,.05,.22,4,.8,,,,,,3]` | min |
| 9 | Doubt (tier 1) | single low woodblock | tri ~180Hz, dry, single | `[.9,0,180,,.03,.16,3]` | min |
| 10 | Crisis (tier 2) | drone swell | saw ~110Hz, slow attack, vibrato | `[.8,0,110,.25,.4,.5,2,,,,,4,.3]` | min‡ |
| 11 | Panic (tier 3) | tense detuned sting | two saws ~95/98Hz, dissonant, longer | `[1,0,96,.05,.3,.45,2,,-3,,,6,.4]` | min‡ |
| 12 | Default (terminal) | low gavel + decaying toll | noise thud → sine ~70Hz long release | `[1.5,0,72,,.05,.9,,1.5,,,,,,5,,.2]` | min |
| 13 | Victory | triumphant arpeggio (3–4 notes) | sequence 3–4 `zzfx()` calls, tri, reverb | chain of #4-style arrays at rising pitch | always (unless mute) |

‡ tiers 10–11 are the sustained/attention cues → **suppressed under reduced-motion**; short knock (#9) still plays.

Optional ambient: quill scratch (filtered noise, q=4, ~0.15s) on text reveal and paper rustle on panel/drawer open — `minimal`+, easy to overdo, gate behind `on`.

## Size budget

| Item | Added bytes |
|------|-------------|
| ZzFXMicro.min.js (vendored inline) | ~1,220 |
| Cue table (13 arrays) + `playCue`/unlock/mute glue | ~600–900 |
| **Total** | **~2 KB (<0.4% of the 558 KB file)** |

Base64 alternative for the same 13 cues: **~250–450 KB.** Procedural is the only fit.

## Sourcing note (if any sampled texture is ever wanted)

Use **CC0 only** (no attribution obligation, commercial-safe): Freesound CC0 tag, OpenGameArt CC0, ZapSplat CC0 ([Freesound CC0](https://freesound.org/browse/tags/cc0/), [OpenGameArt CC0](https://opengameart.org/content/cc0-sound-effects), [ZapSplat CC0](https://www.zapsplat.com/license-type/cc0-1-0-universal/)). CC0 needs no credit regardless of uploader text ([Freesound forum](https://freesound.org/forum/legal-help-and-attribution-questions/35069/)). But this stays a fallback — it reintroduces the 33% base64 tax and breaks the size budget.

## Sources
- ZzFX repo + README + micro source — Frank Force (KilledByAPixel), MIT: https://github.com/KilledByAPixel/ZzFX · https://github.com/KilledByAPixel/ZzFX/blob/master/README.md · https://github.com/KilledByAPixel/ZzFX/blob/master/ZzFXMicro.min.js
- MDN Web Audio — Advanced techniques (ADSR, filters, sequencing): https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques
- MDN OscillatorNode: https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
- MDN Web Audio best practices (resume after gesture): https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- Chrome autoplay policy (suspended context, resume on gesture) — 2018+: https://developer.chrome.com/blog/autoplay/
- Base64 33% overhead — Lemire 2019; Wikipedia: https://lemire.me/blog/2019/01/30/what-is-the-space-overhead-of-base64-encoding/ · https://en.wikipedia.org/wiki/Base64
- Data URI flakiness — Mozilla bug 1436678: https://bugzilla.mozilla.org/show_bug.cgi?id=1436678
- WCAG 1.4.2 Audio Control — Silktide: https://silktide.com/accessibility-guide/the-wcag-standard/1-4/distinguishable/1-4-2-audio-control/
- Game audio & blind accessibility (don't rely on sound alone) — Máté Moldován, A Sound Effect: https://www.asoundeffect.com/game-audio-blind-accessibility/
- CC0 sources — Freesound / OpenGameArt / ZapSplat: https://freesound.org/browse/tags/cc0/ · https://opengameart.org/content/cc0-sound-effects · https://www.zapsplat.com/license-type/cc0-1-0-universal/
