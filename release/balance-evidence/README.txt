Balance Evidence (v0.10 evidence pass)
=======================================

Five deterministic batch runs plus a cross-config summary. All seeds are
fixed (2026 + 1 increment per game) so the entire pass is reproducible.


HTML reports (open these in a browser)
--------------------------------------
  sovereign-batch-v0.10-summary.html             Cross-config aggregate.
  sovereign-batch-v0.10-canonical.html           Treasury x Merchant x Mfg, 100 games.
  sovereign-batch-v0.10-canonical-400.html       Same lineup, 400-game reinforcement.
  sovereign-batch-v0.10-tf-mirror.html           3 x Treasury / Finance mirror, 100 games.
  sovereign-batch-v0.10-mc-mirror.html           3 x Merchant / Infrastructure mirror, 100.
  sovereign-batch-v0.10-mfg-mirror.html          3 x Manufacturer / Industry mirror, 100.
  sovereign-batch-v0.10-canonical-slot-swap.html Diagnostic control: Mfg in slot 0,
                                                 Charter disabled. Isolates slot effect
                                                 from charter effect.


Raw data
--------
  raw-data/sovereign-batch-v0.10-canonical.json            Per-game JSON breakdown.
  raw-data/sovereign-batch-v0.10-canonical-400.json        ditto, 400 games.
  raw-data/sovereign-batch-v0.10-tf-mirror.json            etc.
  raw-data/sovereign-batch-v0.10-mc-mirror.json
  raw-data/sovereign-batch-v0.10-mfg-mirror.json
  raw-data/sovereign-batch-v0.10-canonical-slot-swap.json

Each JSON contains per-game: seed, profile triplet, winner, all-three-influences,
final cash, total rent, route count, asset breakdown by system, lap reached,
Default / Rebellion / Bankruptcy occurrence, and the full Phase 6.1-corrected
scoring decomposition.


How to read the canonical numbers
---------------------------------
CANONICAL is the load-bearing batch: 1 Treasury + 1 Merchant + 1 Manufacturer,
100 games on seeds 2026-2125. Reinforced by a 400-game pass (seeds 2026-2425).

  Treasury / Finance wins         59 / 100   (61.0% over 400)   target 45-65 PASS
  Merchant / Infrastructure wins  25 / 100                      target 15-35 PASS
  Manufacturer / Industry wins    16 / 100                      target 10-25 PASS
  Median winning margin           3 IP                          target >= 2 PASS
  Route 4+ frequency              8 / 100                       target low  PASS

Treasury is intentionally strongest within the target band. The Hamilton thesis
is that public credit + federal finance are the dominant economic lever; the
balance work was about preventing collapse-to-Treasury, not parity.


Mirrors as control
------------------
The three mirror runs (TF, MC, MFG) measure how each profile fares against
itself. Useful as a sanity check and to surface turn-order edge:

  TF-MIRROR slot wins: 47 / 33 / 20 (slot 0 advantage real but bounded).
  MC-MIRROR slot wins: 51 / 32 / 17.
  MFG-MIRROR slot wins: 45 / 34 / 21 (charter goes to slot 0 in mirror).


Slot-swap diagnostic
--------------------
CANONICAL-SLOT-SWAP reseats Manufacturer in slot 0 and disables the Industrial
Charter. It isolates whether the v0.8 charter or the slot position was the
load-bearing fix. Result: roughly interchangeable; both bring Manufacturer
into the target band. The charter is kept as the cleaner product mechanic.


How to regenerate these
-----------------------
Open ../digital-mode/sovereign-solo.html in a browser, click the Batch button,
and set:

  Game count:       100
  Seed source:      auto-increment from 2026
  Profile slots:    per config (see report titles)
  Charter:          Enabled (default), or Disabled for slot-swap diagnostic

The HTML and JSON exports will be byte-identical to the ones in this folder
because the simulator is deterministic on seed + profile triplet.
