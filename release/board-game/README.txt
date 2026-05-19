Board Game (v0.2 balance candidate)
====================================

The printable 34-sheet board game artifact. This is the underlying physical-table
design that the solo / digital adaptation is built around.


Files
-----
  sovereign-prototype.html       The board game. 34 US Letter sheets.
                                 Open in browser, then print to PDF.
                                 Or play in screen-review mode without printing.

  sovereign-economy-audit.html   FC-EM-002. Corrected expected-value economy audit
                                 that produced the v0.2 balance values. Replaced
                                 an earlier audit (FC-EM-001) that was rejected
                                 for total-tier-revenue and double-counting errors.

  sovereign-print-audit.html     Sovereign · Prototype Print / Digital Audit.
                                 Usability + accessibility verification for the
                                 printable artifact.

  V0.10-RULES-ALIGNMENT.md       Delta sheet for playing the v0.10 balance at
                                 a physical table using this v0.2 printable.
                                 Eight specific rule changes (Industrial Charter
                                 setup, Capacity dynamics, Capacity >= 8 bonus,
                                 Capacity >= 10 milestone, Mfg/Strategic set
                                 bonuses, Cash IP scoring 1/400, NF Credit
                                 softening, Report on Manufactures capital event).
                                 Read this if you are reprinting at v0.10 rules.
                                 Added in v1.0.1.


What v0.2 changed (from v0.1)
-----------------------------
  Route ladder              25 / 50 / 100 / 200 -> 25 / 50 / 100 / 150
  Coinage Act               25 TN/player -> 50 TN from each other player
                            + Public Credit +1 + Industrial Capacity +1
  Capacity thresholds       >=8 and >=10 -> >=6 and >=8
  Revolutionary Debt bases  Continental 2 / Soldier Pay 4 -> Continental 4 / 6


What v0.2 preserved (v0.1 anchors)
----------------------------------
  40-space board, 22 properties, 4 routes, 2 institutions, 7 Acts of Congress
  in fixed historical order, 4 player roles, 3 shared tracks, 12 + 12 event
  cards, 5 distinct card backs, Federalist Treasury visual identity.


How the board game relates to the digital mode
----------------------------------------------
The digital mode at digital-mode/sovereign-solo.html implements this exact rule
set, plus the seven balance changes (v0.3 -> v0.10) applied after deterministic
batch evidence. See ../CHANGELOG.md for the full evolution.

The printable board game stays at v0.2 because human-playtest evidence is
needed before reissuing physical sheets. Digital balance ran ahead because
simulation was cheaper than reprinting.
