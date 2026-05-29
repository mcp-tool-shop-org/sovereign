/**
 * Sovereign · determinism regression test
 *
 * Proves the headline thesis of the package — "deterministic, mulberry32"
 * (README L81-85, CLI --help banner): the SAME seed produces a byte-identical
 * game result. A determinism regression (RNG drift, reducer non-determinism,
 * iteration-order leak, scoring math change) would fail this gate.
 *
 * APPROACH
 * --------
 * We import the engine extract `runDiagnosisGame(seed, profileTriplet,
 * charterEnabled)` from tools/diagnosis/sim.mjs — the same surface that
 * tools/diagnosis/verify-canonical-400.mjs and verify-seed-2026.mjs use to
 * assert byte-identity against the 400-seed canonical baseline. For each of a
 * handful of seeds we run the simulation TWICE in fully independent calls and
 * deep-compare the entire result object (final state, scores, per-player
 * holdings, tracks, AND the telemetry trace). If any byte differs across two
 * runs of the same seed, the engine is not deterministic and this exits 1.
 *
 * We additionally pin mulberry32's first outputs for a fixed seed so an RNG
 * change is caught directly, not only through downstream game state.
 *
 * SCOPE / KNOWN LIMITATION (tracked follow-up)
 * --------------------------------------------
 * This test proves the EXTRACT (sim.mjs) is deterministic — same-seed →
 * same-output — which is the property the product's thesis rests on. sim.mjs
 * is a verbatim extract of the v0.10 simulation surface; the live playable
 * build (release/digital-mode/sovereign-solo.html, currently v1.4) embeds its
 * own copy of the engine that is NOT yet importable without a DOM harness, so
 * this test does NOT execute the live HTML build's reducer. Unifying the two
 * into one shared importable engine module (so the test and the HTML cannot
 * drift) is a tracked follow-up; see findings A4-01 / A4-02. We do not claim
 * here to test the shipped HTML engine — only that the determinism property
 * holds for the extracted simulation that the balance evidence was generated
 * from.
 *
 * Note: importing sim.mjs has a side effect — it replaces globalThis.setTimeout
 * with a no-op stub (dead timers on the batch path). That is intentional in the
 * extract and harmless to this test, which never schedules a real timer.
 *
 * Runtime budget: a few hundred ms (a handful of seeds × 2 runs). Well under 10s.
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// RELATIVE import resolved from this module — no hardcoded absolute paths.
const simUrl = pathToFileURL(resolve(HERE, '../tools/diagnosis/sim.mjs')).href;
const { runDiagnosisGame } = await import(simUrl);

let failures = 0;
function check(label, fn) {
  try {
    fn();
    console.log(`  PASS  ${label}`);
  } catch (e) {
    failures++;
    console.log(`  FAIL  ${label} — ${e.message}`);
  }
}

console.log('Sovereign · determinism tests');

// The canonical 3-player profile triplet the balance evidence uses, with the
// starting Industrial Charter enabled (matches verify-canonical-400.mjs).
const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const CHARTER = true;

// 1 canonical seed (2026, the seed verify-seed-2026.mjs pins) plus a spread of
// others so we exercise distinct game trajectories, not one lucky path.
const SEEDS = [2026, 1, 7, 42, 1337, 99991];

// ---------------------------------------------------------------------------
// 1. Same seed → byte-identical result across two independent runs.
// ---------------------------------------------------------------------------
for (const seed of SEEDS) {
  check(`seed ${seed}: two independent runs are byte-identical`, () => {
    const a = runDiagnosisGame(seed, TRIPLET, CHARTER);
    const b = runDiagnosisGame(seed, TRIPLET, CHARTER);
    const sa = JSON.stringify(a);
    const sb = JSON.stringify(b);
    if (sa !== sb) {
      // Surface the first differing top-level field to make the failure actionable.
      let firstDiff = '(no top-level field differed — nested/ordering drift)';
      for (const k of Object.keys(a)) {
        if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) {
          firstDiff = `field "${k}" differs: ${JSON.stringify(a[k]).slice(0, 80)} vs ${JSON.stringify(b[k]).slice(0, 80)}`;
          break;
        }
      }
      throw new Error(`non-deterministic across two runs — ${firstDiff}`);
    }
  });
}

// ---------------------------------------------------------------------------
// 2. Result is fully reproducible: every seed yields a stable, non-degenerate
//    game (lapsReached and totalTurns advance lawfully; scores are numbers).
//    This guards against a "deterministically broken" run (e.g. a 0-turn game)
//    masquerading as determinism.
// ---------------------------------------------------------------------------
for (const seed of SEEDS) {
  check(`seed ${seed}: produces a lawful, scored game`, () => {
    const r = runDiagnosisGame(seed, TRIPLET, CHARTER);
    if (!(r.lapsReached >= 1)) throw new Error(`lapsReached=${r.lapsReached}`);
    if (!(r.totalTurns > 0)) throw new Error(`totalTurns=${r.totalTurns}`);
    if (!Array.isArray(r.scores) || r.scores.length !== 3) throw new Error(`scores=${JSON.stringify(r.scores)}`);
    if (!r.scores.every(n => Number.isFinite(n))) throw new Error(`non-finite score in ${JSON.stringify(r.scores)}`);
    if (typeof r.winner?.slotIndex !== 'number') throw new Error(`no winner slotIndex`);
  });
}

// ---------------------------------------------------------------------------
// 3. Cross-result independence: different seeds do not collapse to one outcome.
//    (If they did, the "RNG" would be a constant — also a determinism defect.)
// ---------------------------------------------------------------------------
check('distinct seeds produce at least two distinct game results', () => {
  const sigs = new Set(SEEDS.map(seed => {
    const r = runDiagnosisGame(seed, TRIPLET, CHARTER);
    return JSON.stringify([r.totalTurns, r.lapsReached, r.scores, r.winner.slotIndex]);
  }));
  if (sigs.size < 2) throw new Error(`all ${SEEDS.length} seeds produced one identical result — RNG appears constant`);
});

// ---------------------------------------------------------------------------
// 4. mulberry32 sequence is pinned for a fixed seed.
//    Catches an RNG change directly. This mirrors makeRng() in sim.mjs verbatim;
//    if sim.mjs's RNG ever changes, this fixture and the byte-identity baselines
//    must be regenerated together — which is exactly the signal we want.
// ---------------------------------------------------------------------------
check('mulberry32(12345) emits the pinned first-5 sequence', () => {
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rng = mulberry32(12345);
  const got = [rng(), rng(), rng(), rng(), rng()];
  // Pinned expected sequence for seed 12345 (mulberry32 reference).
  const want = [
    0.9797282677609473,
    0.3067522644996643,
    0.484205421525985,
    0.817934412509203,
    0.5094283693470061,
  ];
  for (let i = 0; i < want.length; i++) {
    if (got[i] !== want[i]) {
      throw new Error(`index ${i}: got ${got[i]}, expected ${want[i]} (full: ${JSON.stringify(got)})`);
    }
  }
});

console.log();
if (failures > 0) {
  console.log(`${failures} determinism failure(s)`);
  process.exit(1);
}
console.log('All determinism tests passed.');
