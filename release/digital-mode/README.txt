Digital Mode (v0.10 balance baseline · FROZEN)
==============================================

The single self-contained HTML file that runs the full game locally in a browser.


Files
-----
  sovereign-solo.html               The game. Open in any modern browser.
  sovereign-v0.10-freeze-audit.html 38-check freeze audit (all PASS).


How to run
----------
Double-click sovereign-solo.html or drag it into a browser. No installer, no
dependencies, no internet required. The header shows "v0.10 balance candidate" -
that label is the frozen baseline.


What's inside
-------------
  Game loop
    - Full 7-lap solo game (1 human + 2 scripted opponents).
    - 17-action reducer / dispatch pattern.
    - All 40 board spaces, 22 properties, 4 routes, 2 institutions wired.
    - All 24 cards (12 Market Shock + 12 Republic Debate) resolve deterministically.
    - All 7 Acts of Congress fire in historical order with majority voting.

  Scripted opponents
    - Hamilton: Treasury / Finance profile.
    - Morris: Merchant / Infrastructure profile.
    - Plus Manufacturer / Industry profile available for batch play.
    - Every decision is a pure function of visible state and logs its reason.
    - All four MVP profile decision functions: decideBuy, decideAuctionBid,
      decideUpgrade, decideVote, decideEarlyVoteFee, decideCardChoice.

  Narration
    - 25-entry library covering first-purchases, Act passages, track thresholds,
      Default, Rebellion, endgame republic summary.
    - 40-60 word defaults, 150-200 word expansions, ~300-500 word endgame.
    - Triggered by reading the ledger; never mutates state.

  Save / load
    - Autosave to localStorage on every END_TURN.
    - Manual JSON export / import.
    - Hash integrity check on load.
    - Version-gated (v0.10).

  Replay
    - Full scrubber over any completed game.
    - Reconstructs from initialState(seed) + decisionLog.
    - Read-only; never mutates live state.
    - Green integrity pill confirms byte-identical reconstruction.

  Batch simulation
    - 10, 50, or 100 deterministic games per run.
    - Choose profile per slot.
    - Charter Enabled / Disabled toggle for diagnostic control.
    - Aggregate output: win rates, average Influence, route dominance, debt and
      industry contribution, failure event frequency, mirror slot edge.
    - JSON + HTML exports per batch.
    - Cross-config summary.

  Telemetry
    - Acquisition funnel (landings, buy outcomes, cash-at-opportunity, auction
      access, turn-order geometry, five-hypothesis classifier).
    - Scoring decomposition (per category, with counterfactual analysis for
      Treasury-specific dominance analysis).
    - All reporting-side; never mutates game state.


Determinism guarantee
---------------------
Same seed + same human decisions = byte-identical ledger across runs, browsers,
and time. Verified across 1,000+ deterministic games during the v0.2 -> v0.10
balance arc. Single RNG: mulberry32(state.rngSeed).


Freeze audit
------------
sovereign-v0.10-freeze-audit.html shows the 38 static checks that PASS:

  v0.10 scoring rule consistency               6 / 6 PASS
  Preserved balance state (v0.2 -> v0.8)       14 / 14 PASS
  Digital infrastructure regressions           14 / 14 PASS
  Determinism (CANONICAL x 100 byte-identical) PASS
  Balance targets (6 of 6)                     PASS

No source edits were required at the freeze gate.
