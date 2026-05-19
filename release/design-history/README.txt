Design History
==============

Archival snapshots of the design and audit artifacts produced during the
Sovereign Solo / Digital Mode build. These are NOT the running game - the
running game is in ../digital-mode/sovereign-solo.html.

These exist so that the design path is inspectable: how the digital
adaptation was specified before any code was written, and how each layer
was audited before being frozen.


Files
-----
  01-phase1-concept.html
    Sovereign Solo / Digital Mode Concept v0.1 (post wording-fix).
    The design contract for the digital adaptation. Defines the eight
    surfaces, three solo modes, four opponent profiles, state model, the
    five-hypothesis bottleneck matrix, and the acceptance criteria.

  02-phase2-prototype.html
    Phase 2 static clickable prototype.
    8 surfaces rendered with placeholder state, 11-step turn walkthrough,
    accessibility floor (keyboard / focus / readable track values).
    Proved the digital loop and the surface set before any real state
    machine code was written.

  03-phase3-audit.html
    Phase 3 local state machine freeze audit.
    Verified the reducer / dispatch architecture, 17 actions, mulberry32
    determinism, full 7-lap game loop, all 40 spaces, all 24 cards, all
    7 Acts, scoring-from-rules. Three bug fixes patched then re-audited.

  04-phase4-audit.html
    Phase 4 scripted opponents freeze audit.
    Verified the players[] migration, deterministic decision functions
    for Treasury / Finance and Merchant / Infrastructure, auction
    mechanic, multiplayer rent, vote tallying. Six bug fixes patched.

  05-phase5-audit.html
    Phase 5 narration / replay / save freeze audit.
    Verified the narration library reads from ledger and does not mutate
    state, save / load with hash integrity, replay reconstructs from
    initialState(seed) + decisionLog. Verdict PASS, no fixes required.


Phases 6, 6.1, and the balance evolution
----------------------------------------
Phase 6 (local balance telemetry + batch + Manufacturer profile) is in
production: open ../digital-mode/sovereign-solo.html. It is the live
substrate of the v0.10 baseline.

Phase 6.1 (telemetry hygiene) is also in production.

The v0.3 -> v0.10 balance arc was driven by deterministic 400-game evidence
passes. See ../CHANGELOG.md for what each version changed and what the
evidence showed.


Why these artifacts are archival rather than removed
----------------------------------------------------
Audit trails are the freeze guarantee. Every layer of Sovereign Solo /
Digital Mode was frozen against a written audit. Keeping the audits in
the bundle means future maintainers can verify that a given fix (e.g.
BUG-01 Yellow Fever landing resolution, BUG-04 opponent reasons) was
intentional, not an artifact of a regression.
