/**
 * Sovereign · README stat measurement (scratch / doc-prep tool)
 * ============================================================
 *
 * WHY THIS EXISTS
 * ---------------
 * Accuracy is the brand. Before the README asserts any number, it must be
 * measured against the LIVE shipping engine — not copied forward from a prior
 * version. This script boots release/digital-mode/sovereign-solo.html in jsdom
 * (the same boot approach as test/balance-revalidate.mjs and
 * test/playability.harness.mjs) and drives the in-engine batch path
 * `window.runBatchGame(seed, triplet)` over the CANONICAL × 100 sweep
 * (seeds 2026..2125, triplet treasury / merchant / manufacturer).
 *
 * It reports exactly the figures the README/CHANGELOG cite:
 *   - Win split by profile (the balance line).
 *   - Game length: median + mean, in BOTH turns (st.turnIndex) and rounds
 *     (st.lap). This reconciles the README's "~23 rounds / 67 turns" claim
 *     against the current engine.
 *   - Failure firing /100 (Public Doubt / Credit Crisis / Panic / Default /
 *     Rebellion) + Crisis recoverability.
 *   - Vision achievement per profile /100 (from st.visionAchievedRound, which
 *     reduce() stamps once per seat; also cross-checked against the VISION
 *     ledger rows logRow() writes).
 *
 * WHAT IS *NOT* MEASURED HERE (and why)
 * -------------------------------------
 * Chronicler banners/game and per-profile reactions/game are RENDER-TIME ONLY:
 * the Chronicler toast (`STATE.ledger.push({event:'CHRONICLER'})`) and
 * `fireReaction()` operate on the live UI `STATE` global via `pushToast`, are
 * dedup-gated (__CHRONICLER_FIRED_GAME / __REACTION_FIRED), and are never
 * invoked by `runBatchGame`, which drives a local headless `s`. Across 100
 * batch games the CHRONICLER ledger-row count is 0 by construction. These
 * counts therefore CANNOT be measured cleanly from the headless batch path, so
 * the docs describe them qualitatively rather than printing a stale figure.
 *
 * USAGE
 *   node test/measure-stats.mjs                 # full 100-seed sweep, prints report
 *   node test/measure-stats.mjs --seeds 2026,2027,...   # custom seed list
 *   node test/measure-stats.mjs --json          # emit a machine-readable JSON blob too
 */

import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HTML_PATH = resolve(ROOT, 'release/digital-mode/sovereign-solo.html');
const HTML = readFileSync(HTML_PATH, 'utf8');

const CANONICAL_TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const SEED_START = 2026;
const SEED_COUNT = 100; // CANONICAL × 100 → seeds 2026..2125

// ---------------------------------------------------------------------------
// Dependency-free timer shim (same shape the playability harness + revalidate
// gate use) so the page's module-level opponent setTimeout never schedules on
// the real clock during script init. The batch path is synchronous.
// ---------------------------------------------------------------------------
function makeTimerShim() {
  let seq = 0;
  const timers = new Map();
  return {
    setTimeout(fn, delay, ...args) { const id = ++seq; timers.set(id, { fn, args }); return id; },
    clearTimeout(id) { timers.delete(id); },
    setInterval() { return ++seq; },
    clearInterval(id) { timers.delete(id); },
  };
}

// ---------------------------------------------------------------------------
// Boot a fresh page (mirrors bootGame in playability.harness.mjs /
// bootPage in balance-revalidate.mjs).
// ---------------------------------------------------------------------------
function bootPage() {
  const shim = makeTimerShim();
  const jsdomErrors = [];
  const dom = new JSDOM(HTML, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url: 'http://localhost/sovereign-solo.html',
    beforeParse(window) {
      window.alert = () => {};
      window.confirm = () => true;
      window.scrollTo = () => {};
      if (window.HTMLElement && window.HTMLElement.prototype) {
        window.HTMLElement.prototype.scrollIntoView = () => {};
      }
      window.setTimeout = shim.setTimeout;
      window.clearTimeout = shim.clearTimeout;
      window.setInterval = shim.setInterval;
      window.clearInterval = shim.clearInterval;
    },
  });
  dom.virtualConsole.on('jsdomError', (e) => jsdomErrors.push(String(e && (e.stack || e.message) || e)));
  const w = dom.window;
  const S = (expr) => w.eval(expr);
  if (!S('typeof runBatchGame === "function"')) {
    throw new Error('runBatchGame is not reachable in the page scope — boot failed. jsdomErrors: ' + jsdomErrors.join(' | '));
  }
  return { dom, w, S, jsdomErrors };
}

// ---------------------------------------------------------------------------
// In-page aggregator. Defined as a string and eval'd into the page scope so it
// can call the page's own runBatchGame directly and only return compact JSON.
// It runs games and reads their resulting ledgers/scores/state — it never
// mutates engine internals.
// ---------------------------------------------------------------------------
const IN_PAGE_AGGREGATOR = `
window.__measureBatch = function(seeds, triplet) {
  // Reconstruct the Public Credit trajectory from the ledger (every adjustTrack
  // on 'credit' logs a CREDIT row "before → next").
  function creditTrajectory(ledger) {
    var pts = [5]; // initialState credit = 5
    for (var i = 0; i < ledger.length; i++) {
      var r = ledger[i];
      if (r.event === 'CREDIT' && typeof r.detail === 'string') {
        var m = r.detail.match(/(\\d+)\\s*→\\s*(\\d+)/);
        if (m) pts.push(parseInt(m[2], 10));
      }
    }
    return pts;
  }

  var winsByProfile = {}; triplet.forEach(function(p){ winsByProfile[p] = 0; });
  var visionByProfile = {}; triplet.forEach(function(p){ visionByProfile[p] = 0; });
  var visionLedgerRows = 0;       // cross-check: VISION rows logRow() wrote
  var chroniclerLedgerRows = 0;   // sanity: must be 0 (render-time-only)
  var fail = { doubt:0, crisis:0, panic:0, default:0, rebellion:0 };
  var turns = [], rounds = [];
  var completed = 0, circuitEnd = 0;
  var crisisGames = 0, crisisRecoveredStable = 0, crisisReachedDefault = 0, crisisOther = 0;

  for (var si = 0; si < seeds.length; si++) {
    var out = runBatchGame(seeds[si], triplet);
    var st = out.state;
    var ledger = st.ledger || [];

    // Winner = argmax finalScores[i].total (exactly batchAggregate's rule).
    if (st.finalScores) {
      var winIdx = 0, winInf = -Infinity;
      st.finalScores.forEach(function(sc, i){ if (sc.total > winInf) { winInf = sc.total; winIdx = i; } });
      winsByProfile[triplet[winIdx]] = (winsByProfile[triplet[winIdx]] || 0) + 1;
    }

    // Vision per profile: reduce() stamps st.visionAchievedRound[seat] once
    // (non-null) when a seat completes its Vision. Map seat -> profile.
    var var_ = st.visionAchievedRound || {};
    Object.keys(var_).forEach(function(k){
      if (var_[k] != null) { var prof = triplet[+k]; if (prof in visionByProfile) visionByProfile[prof]++; }
    });

    // Per-event scan: failures + Vision/Chronicler ledger-row cross-check.
    var sawDoubt=false, sawCrisis=false, sawPanic=false, sawDefault=false, sawReb=false;
    for (var i = 0; i < ledger.length; i++) {
      var e = ledger[i].event;
      if (e === 'PUBLIC_DOUBT') sawDoubt = true;
      else if (e === 'CREDIT_CRISIS') sawCrisis = true;
      else if (e === 'PANIC') sawPanic = true;
      else if (e === 'DEFAULT') sawDefault = true;
      else if (e === 'REBELLION') sawReb = true;
      else if (e === 'VISION') visionLedgerRows++;
      else if (e === 'CHRONICLER') chroniclerLedgerRows++;
    }
    if (sawDoubt) fail.doubt++;
    if (sawCrisis) fail.crisis++;
    if (sawPanic) fail.panic++;
    if (sawDefault) fail.default++;
    if (sawReb) fail.rebellion++;

    // Recoverability: "entered crisis" = min reconstructed Credit <= 4.
    var traj = creditTrajectory(ledger);
    var minCredit = Math.min.apply(null, traj);
    var finalCredit = st.tracks && st.tracks.credit ? st.tracks.credit.value : traj[traj.length - 1];
    if (minCredit <= 4) {
      crisisGames++;
      if (sawDefault || minCredit <= 0) crisisReachedDefault++;
      else if (finalCredit >= 7) crisisRecoveredStable++;
      else crisisOther++;
    }

    // Game length — BOTH units. st.turnIndex = turn counter; st.lap = round.
    turns.push(st.turnIndex);
    rounds.push(st.lap);
    if (st.status === 'gameOver') completed++;
    var hardCapped = ledger.some(function(r){ return r.event === 'GAME OVER' && typeof r.detail === 'string' && /books close anyway/.test(r.detail); });
    if (st.status === 'gameOver' && !hardCapped) circuitEnd++;
  }

  function stats(arr) {
    var a = arr.slice().sort(function(x,y){ return x - y; });
    var n = a.length;
    var median = n === 0 ? 0 : (n % 2 ? a[(n-1)/2] : (a[n/2-1] + a[n/2]) / 2);
    var mean = n === 0 ? 0 : a.reduce(function(x,y){ return x + y; }, 0) / n;
    return { median: median, mean: mean, min: a[0], max: a[n-1] };
  }

  return JSON.stringify({
    n: seeds.length,
    triplet: triplet,
    winsByProfile: winsByProfile,
    visionByProfile: visionByProfile,
    visionLedgerRows: visionLedgerRows,
    chroniclerLedgerRows: chroniclerLedgerRows,
    fail: fail,
    turns: stats(turns),
    rounds: stats(rounds),
    completion: { completed: completed, circuitEnd: circuitEnd, total: seeds.length },
    recover: {
      crisisGames: crisisGames,
      recoveredStable: crisisRecoveredStable,
      reachedDefault: crisisReachedDefault,
      other: crisisOther,
    },
  });
};
`;

function runSweep(S, seeds, triplet) {
  S(IN_PAGE_AGGREGATOR);
  return JSON.parse(S(`window.__measureBatch(${JSON.stringify(seeds)}, ${JSON.stringify(triplet)})`));
}

function pct(x, total) { return total === 0 ? '0.0' : (100 * x / total).toFixed(1); }

function printReport(r) {
  const N = r.n;
  console.log('');
  console.log('Sovereign · README stat measurement');
  console.log('===================================');
  console.log('Engine: LIVE HTML (release/digital-mode/sovereign-solo.html) via jsdom');
  console.log(`Sweep:  CANONICAL × ${N} · seeds ${SEED_START}..${SEED_START + N - 1}`);
  console.log(`Triplet: [${r.triplet.join(' / ')}]`);
  console.log('');
  console.log('WIN SPLIT');
  for (const prof of r.triplet) {
    const w = r.winsByProfile[prof] || 0;
    console.log(`  ${prof.padEnd(26)} ${String(w).padStart(3)} / ${N}   ${pct(w, N).padStart(5)} %`);
  }
  console.log('');
  console.log('GAME LENGTH (both units)');
  console.log(`  Rounds (st.lap)        median ${r.rounds.median}   mean ${r.rounds.mean.toFixed(2)}   range ${r.rounds.min}..${r.rounds.max}`);
  console.log(`  Turns  (st.turnIndex)  median ${r.turns.median}   mean ${r.turns.mean.toFixed(2)}   range ${r.turns.min}..${r.turns.max}`);
  console.log('');
  console.log(`FAILURE FIRING / ${N} (games with >=1 event)`);
  console.log(`  Public Doubt   ${String(r.fail.doubt).padStart(3)} / ${N}   ${pct(r.fail.doubt, N).padStart(5)} %`);
  console.log(`  Credit Crisis  ${String(r.fail.crisis).padStart(3)} / ${N}   ${pct(r.fail.crisis, N).padStart(5)} %`);
  console.log(`  Panic          ${String(r.fail.panic).padStart(3)} / ${N}   ${pct(r.fail.panic, N).padStart(5)} %`);
  console.log(`  Default        ${String(r.fail.default).padStart(3)} / ${N}   ${pct(r.fail.default, N).padStart(5)} %`);
  console.log(`  Rebellion      ${String(r.fail.rebellion).padStart(3)} / ${N}   ${pct(r.fail.rebellion, N).padStart(5)} %`);
  console.log('');
  console.log('RECOVERABILITY (of games that EVER entered Crisis, Credit <= 4)');
  const c = r.recover;
  console.log(`  Entered Crisis      ${c.crisisGames} / ${N}`);
  if (c.crisisGames > 0) {
    console.log(`  -> recovered stable (final Credit >= 7)  ${c.recoveredStable}   ${pct(c.recoveredStable, c.crisisGames)} %`);
    console.log(`  -> reached Default                        ${c.reachedDefault}   ${pct(c.reachedDefault, c.crisisGames)} %`);
    console.log(`  -> ended unstable but not Default         ${c.other}   ${pct(c.other, c.crisisGames)} %`);
  }
  console.log('');
  console.log('VISION ACHIEVEMENT / ' + N + ' (per seat, from st.visionAchievedRound)');
  for (const prof of r.triplet) {
    const v = r.visionByProfile[prof] || 0;
    console.log(`  ${prof.padEnd(26)} ${String(v).padStart(3)} / ${N}   ${pct(v, N).padStart(5)} %`);
  }
  console.log(`  (cross-check: ${r.visionLedgerRows} VISION ledger rows total)`);
  console.log('');
  console.log('COMPLETION');
  console.log(`  ${r.completion.completed} / ${r.completion.total} reached gameOver · ${r.completion.circuitEnd} / ${r.completion.total} via circuit-end`);
  console.log('');
  console.log('NOT MEASURED (render-time-only; describe qualitatively, do NOT print a figure)');
  console.log(`  Chronicler banners/game · per-profile reactions/game`);
  console.log(`  (CHRONICLER ledger rows across the sweep: ${r.chroniclerLedgerRows} — fireReaction/Chronicler toast run on the UI STATE, never in runBatchGame)`);
  console.log('');
}

function main() {
  const args = process.argv.slice(2);
  let seeds = Array.from({ length: SEED_COUNT }, (_, i) => SEED_START + i);
  let emitJson = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--json') emitJson = true;
    else if (args[i] === '--seeds' && args[i + 1]) {
      seeds = args[++i].split(',').map(s => parseInt(s.trim(), 10)).filter(Number.isFinite);
    }
  }

  const t0 = Date.now();
  const { S, jsdomErrors } = bootPage();
  const report = runSweep(S, seeds, CANONICAL_TRIPLET);
  printReport(report);

  if (emitJson) {
    console.log('JSON');
    console.log(JSON.stringify(report));
    console.log('');
  }
  if (jsdomErrors.length) {
    console.log('NOTE: jsdomErrors during boot (non-fatal if report rendered):');
    for (const e of jsdomErrors.slice(0, 5)) console.log('  ' + e.split('\n')[0]);
    console.log('');
  }
  console.log(`(${seeds.length} games in ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

main();
