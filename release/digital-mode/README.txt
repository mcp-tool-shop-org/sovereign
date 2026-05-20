Digital Mode (v0.18 polished baseline · v1.1.0 release candidate)
==================================================================

The single self-contained HTML file that runs the full game locally in a browser.
v1.1.0 promotes the v0.18 failure-system foundation (Credit Crisis warning event +
the v0.11-v0.17 pressure-side chain) plus a whole-game visual polish pass to the
canonical release surface.


Files
-----
  sovereign-solo.html                The game. Open in any modern browser.
                                     v0.18 polished. SAVE_VERSION 'v0.18-candidate'.
  sovereign-solo-v0.10-baseline.html Archive of the v1.0.x canonical (v0.10 frozen
                                     baseline) for historical reference and save
                                     compatibility verification.
  sovereign-v0.10-freeze-audit.html  The original 38-check freeze audit for v0.10
                                     (all PASS). Provenance for the prior baseline.


How to run
----------
Double-click sovereign-solo.html or drag it into a browser. No installer, no
dependencies, no internet required. On first load an orientation overlay
introduces the three shared tracks, the three failure tiers, and the ledger as
the truth source - dismiss with "Got it - begin" or recall it any time via the
"How to play" button in the topbar.


What's new in the v0.18 polished baseline
-----------------------------------------
  Failure-pressure system (mechanics, frozen at v0.18)
    - Credit Crisis at Public Credit <= 4 - soft intermediate failure event. Fires
      once per game when Credit first collapses into the warning band. Logs a
      System event, ticks Public Resistance +1, does not reset Credit.
    - Default at Public Credit 0 - catastrophic endpoint, unchanged.
    - Rebellion at Public Resistance 12 - catastrophic endpoint, unchanged.
    - Three-tier hierarchy: Crisis (warning) < Rebellion / Default (catastrophe).

  Pressure sources (preserved through the v0.11-v0.17 arc)
    - Bank Run drops Public Credit -1 and Industrial Capacity -1.
    - Speculation Fever drops Public Credit -1 at Credit >= 7, -2 at Credit <= 6,
      and ticks Resistance +1 (v0.17 fragile-credit escalation).
    - Anti-Federalist Pamphlet drops Public Credit -1, ticks Resistance +1, and
      collects 30 TN per Revenue-System property from every owner (v0.16).
    - Funding Act remains the lap-1 +2 Credit floor.

  Visual polish (presentation only; mechanics byte-identical to v0.18 candidate)
    - Topbar wordmark + mode tag + version pill (Federalist Treasury palette).
    - First-run orientation overlay with the three-track + three-tier primer.
    - Ledger rows for CREDIT_CRISIS / DEFAULT / REBELLION get distinct severity
      treatments.
    - Tracks panel marks the Credit Crisis warning band (1-4) and the Default
      and Rebellion endpoints.
    - Endgame report shows posture chips (credit posture / Crisis state /
      Rebellion state) above the score columns, with narration that explicitly
      mentions Credit Crisis / Default / Rebellion outcomes.
    - Batch modal reframed as "Balance Evidence Run".
    - Responsive breakpoint at <= 768 px and a print stylesheet.

  Determinism
    - Same seed + same human decisions = byte-identical ledger. The v0.18
      polished build produces the same 100-seed canonical state hash
      (3189375454) as the v0.18 candidate Node simulation.

  Design-system reference
    - The visual-system sheet and screen-state audit live at
      release/design-system/sovereign-visual-system-v0.18.html and
      sovereign-screen-audit-v0.18.html.


Save / load
-----------
SAVE_VERSION = 'v0.18-candidate'. Saves from v0.10 - v0.17 are still readable
via loadFromPayload; a transient info pill explains the behavior difference
when loading older saves under the new failure system. Hash integrity check
on load is unchanged.


Determinism guarantee
---------------------
Single RNG: mulberry32(state.rngSeed). Same seed + same human decisions =
byte-identical ledger across runs, browsers, and operating systems. Verified
across 1,000+ deterministic games through the v0.2 -> v0.10 -> v0.11 - v0.18
arc.


Mechanics-frozen evidence
-------------------------
The v0.18 promotion audit (44 / 44 PASS) and the CANONICAL-400 evidence sweep
live alongside this release in the repo at:
  experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-promotion-audit.html
  experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-evidence-sweep.html
  experiments/v0.18-failure-pressure-candidate/raw-data/


Caveat
------
v0.18 mechanics are simulation-verified across the canonical T/M/Mfg triplet
(400 seeds) and the MFG-MIRROR variant (100 seeds). They are not yet
human-playtested.
