SOVEREIGN
The Hamilton System Board Game
v0.10 Release  ·  FROZEN 2026-05-19


WHAT THIS IS
============

Sovereign is a Hamilton-system board game and its solo / digital adaptation.

The board game is a 40-space Monopoly-grammar tabletop game about the founding of
US public credit. Three Hamiltonian profiles - Treasury / Finance, Merchant /
Infrastructure, and Manufacturer / Industry - compete on an Influence scoring
track across 7 laps. Acts of Congress pass in their historical order. Public
Credit, Public Resistance, and Industrial Capacity move as shared tracks.

The digital mode runs the full game locally in a browser. It plays solo
against two deterministic scripted opponents. There is no network, no account,
no cloud, no LLM. The only RNG is mulberry32(state.rngSeed); every game is
reproducible from its seed.


WHERE TO START
==============

  Open  00-START-HERE.html  in any modern browser.

That page hyperlinks every artifact in this release and routes you by audience:

  - Player        : open the digital simulator and play.
  - Designer      : read the printable board game and the concept document.
  - Balance       : open the v0.10 batch reports and the freeze audit.
  - Auditor       : open the freeze audit and the design-history audits.


BUNDLE LAYOUT
=============

  00-START-HERE.html              Hyperlinked entry. Open this first.
  README.txt                       This file.
  CHANGELOG.md                     Full v0.2 -> v0.10 evolution.

  /board-game/
    sovereign-board-game.html      The printable 34-sheet board game (v0.2).
    sovereign-economy-audit.html   FC-EM-002 corrected economy audit.
    sovereign-print-audit.html     Print / digital usability audit.

  /digital-mode/
    sovereign-solo.html            The v0.10 frozen solo simulator. The game.
    sovereign-v0.10-freeze-audit.html   38-check freeze audit report.

  /balance-evidence/
    sovereign-batch-v0.10-canonical.html       Treasury x Merchant x Mfg.
    sovereign-batch-v0.10-canonical-400.html   400-game reinforcement.
    sovereign-batch-v0.10-tf-mirror.html       3 x Treasury / Finance.
    sovereign-batch-v0.10-mc-mirror.html       3 x Merchant / Infrastructure.
    sovereign-batch-v0.10-mfg-mirror.html      3 x Manufacturer / Industry.
    sovereign-batch-v0.10-canonical-slot-swap.html  Charter-vs-slot control.
    sovereign-batch-v0.10-summary.html         Cross-config summary.
    /raw-data/                                 Per-game JSON exports.

  /design-history/
    01-phase1-concept.html         Solo / Digital Mode concept document.
    02-phase2-prototype.html       Clickable static prototype (8 surfaces).
    03-phase3-audit.html           State machine freeze audit.
    04-phase4-audit.html           Scripted opponents freeze audit.
    05-phase5-audit.html           Narration / replay / save freeze audit.


HEADLINE NUMBERS
================

CANONICAL configuration (1 human + 2 scripted opponents), 100 deterministic
games, seeds 2026-2125, reinforced by a CANONICAL x 400 pass:

  Treasury / Finance wins         59 / 100   target 45-65   PASS
  Merchant / Infrastructure wins  25 / 100   target 15-35   PASS
  Manufacturer / Industry wins    16 / 100   target 10-25   PASS
  Median winning margin           3 IP       target >= 2    PASS
  Route 4+ frequency              8 / 100    target low     PASS
  Determinism                     byte-identical run-to-run PASS

CANONICAL x 400 reinforcement: Treasury 244 / 400 = 61.0%.


HOW TO RUN THE GAME
===================

Double-click  digital-mode/sovereign-solo.html  or drag it into a browser.
No installer, no dependencies, no internet required.

The header shows "v0.10 balance candidate" - that label is now the frozen
baseline.

Inside the simulator:
  - Solo mode plays you against Hamilton (Treasury / Finance) and Morris
    (Merchant / Infrastructure) on seed 2026 by default.
  - "New seed" reseeds the game.
  - "Batch" runs a deterministic batch simulation (10, 50, or 100 games)
    against any profile triplet, producing JSON + HTML reports.
  - "Save" and "Load" autosave to localStorage and / or export to JSON.
  - "Replay" scrubs through any completed game with hash integrity.
  - All narration is derived from the ledger and never mutates state.


KNOWN CAVEATS
=============

  * Capacity thresholds (>=6, >=8, >=10) remain rare in canonical play.
    Avg final Capacity is 3.49; >=6 reached in only 4 / 100 games.
    The endgame industrial bonuses exist as a ceiling, not a regular path.

  * Treasury / Finance remains intentionally the strongest profile, within
    the target band. This matches the historical thesis: public credit and
    federal finance were Hamilton's dominant economic lever.

  * Failure events (Default / Rebellion / Bankruptcy) fired 0 / 400 times
    in the v0.10 evidence pass. Their threat is decorative in current play.
    A future version may revisit fail-state pressure.

  * Balance is simulation-tested only (>1,000 deterministic games across
    v0.3-v0.10). Human play with strategic deviation may shift these rates.

  * The Opportunist / Cash profile from the concept document is deferred.
    The locked v0.10 competitive set is Treasury / Merchant / Manufacturer.


OPERATING MODEL
===============

  Local-only. No network calls. No accounts. No cloud sync. No LLM opponents.
  Single RNG: mulberry32(state.rngSeed). Telemetry is reporting-only and
  never mutates game state. Saves are version-gated localStorage + downloadable
  JSON. The full game, all profiles, all telemetry, and all batch infrastructure
  live in one self-contained HTML file.


CREDITS
=======

Design, balance, and implementation: Mike (mcp-tool-shop).
Built across the v0.2 -> v0.10 arc on 2026-05-18 / 2026-05-19.

See CHANGELOG.md for the full version-by-version balance evolution.
