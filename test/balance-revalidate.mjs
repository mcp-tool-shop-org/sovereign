/**
 * Sovereign · Credit Spiral balance re-validation (the GATE)
 * ==========================================================
 *
 * WHY THIS EXISTS
 * ---------------
 * The v1.5 "Credit Spiral" keystone (release/digital-mode/sovereign-solo.html)
 * converts Public Credit failure from a decorative cliff into a felt, compounding,
 * recoverable slope: a debt-servicing CASH levy + telegraphed acceleration toward
 * Default, applied INSIDE reduce() at BEGIN_LAP (replay-safe). This script is the
 * re-validation gate the design spec demands
 * (experiments/v1.5-fun-brainstorm/credit-spiral-design.md, "Re-validate").
 *
 * It boots the REAL shipping HTML in jsdom (the same boot approach as
 * test/playability.harness.mjs) and drives the IN-ENGINE batch path
 * `window.runBatchGame(seed, triplet)` over the CANONICAL × 100 sweep,
 * seeds 2026..2125, triplet ['treasury-finance','merchant-infrastructure',
 * 'manufacturer-industry']. It deliberately uses the LIVE HTML engine, NOT the
 * v0.10 tools/diagnosis/sim.mjs extract — the spiral lives only in the HTML.
 *
 * WINNER DETERMINATION (matches the game exactly)
 * -----------------------------------------------
 * runBatchGame returns { state, decisionLog }. At Final Accounting the engine
 * calls computeFinalInfluence(s) -> s.finalScores = players.map(scorePlayer).
 * batchAggregate() in the HTML picks the winner as argmax(finalScores[i].total)
 * (sovereign-solo.html ~L8584). This script reproduces that exact rule.
 *
 * FAILURE FIRING
 * --------------
 * Scans finalState.ledger for the System/Track events the failure system emits:
 *   PUBLIC_DOUBT, CREDIT_CRISIS, PANIC, DEFAULT, REBELLION.
 * "Crisis fired" counts a game whose ledger contains >=1 CREDIT_CRISIS row.
 *
 * RECOVERABILITY
 * --------------
 * A game "entered Crisis" if Public Credit ever reached <=4 (we reconstruct the
 * Credit trajectory from CREDIT track rows in the ledger — every adjustTrack on
 * 'credit' logs "before -> next"). Of those, we report how many ENDED stable
 * (final Credit >= 7) vs reached Default (Credit hit 0 / a DEFAULT row fired).
 *
 * PERFORMANCE
 * -----------
 * Aggregation runs INSIDE the page's script scope (one injected function,
 * window.__revalidateBatch) so we never serialize 100 full game states across
 * the jsdom boundary — only a compact JSON summary crosses back.
 *
 * USAGE
 *   node test/balance-revalidate.mjs            # full 100-seed sweep, prints report
 *   node test/balance-revalidate.mjs --determinism   # also assert byte-identical re-run
 *   node test/balance-revalidate.mjs --seeds 2026,2027,...  # custom seed list
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
// Dependency-free timer shim (same shape the playability harness uses) so the
// page's module-level opponent setTimeout never schedules on the real clock
// during script init. The batch path is synchronous and does not need it, but
// installing it keeps the boot identical to the harness and side-effect-free.
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
// Boot a fresh page (mirrors bootGame in playability.harness.mjs).
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
  // Sanity: the live batch surface must be reachable in the script scope.
  const haveBatch = S('typeof runBatchGame === "function"');
  if (!haveBatch) {
    throw new Error('runBatchGame is not reachable in the page scope — boot failed. jsdomErrors: ' + jsdomErrors.join(' | '));
  }
  return { dom, w, S, jsdomErrors };
}

// ---------------------------------------------------------------------------
// The in-page aggregator. Defined as a string and eval'd into the page scope so
// it can call the page's own runBatchGame / scorePlayer / creditTier directly
// and only return a compact JSON summary. PURE w.r.t. the engine — it merely
// runs games and reads their resulting ledgers/scores.
// ---------------------------------------------------------------------------
const IN_PAGE_AGGREGATOR = `
window.__revalidateBatch = function(seeds, triplet) {
  // Reconstruct the Public Credit trajectory from the ledger. Every adjustTrack
  // on 'credit' logs a CREDIT row whose detail ends with "before → next (±d)".
  // Track rows also carry the System CREDIT_CRISIS/PANIC/DEFAULT etc. events.
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
  var winsByProfile = {};
  triplet.forEach(function(p){ winsByProfile[p] = 0; });
  var fail = { doubt:0, crisis:0, panic:0, default:0, rebellion:0 };
  var laps = [];
  var completed = 0;       // games that reached gameOver
  var circuitEnd = 0;      // games that ended via circuit victory (not hard cap)
  // Recoverability buckets (among games that EVER entered Crisis, Credit <= 4):
  var crisisGames = 0, crisisRecoveredStable = 0, crisisReachedDefault = 0, crisisOther = 0;

  for (var si = 0; si < seeds.length; si++) {
    var out = runBatchGame(seeds[si], triplet);
    var st = out.state;
    var ledger = st.ledger || [];

    // Winner = argmax finalScores[i].total (exactly batchAggregate's rule).
    if (st.finalScores) {
      var winIdx = 0, winInf = -Infinity;
      st.finalScores.forEach(function(sc, i){ if (sc.total > winInf) { winInf = sc.total; winIdx = i; } });
      var prof = triplet[winIdx];
      winsByProfile[prof] = (winsByProfile[prof] || 0) + 1;
    }

    // Failure firing — count games whose ledger contains >=1 of each event.
    var sawDoubt=false, sawCrisis=false, sawPanic=false, sawDefault=false, sawReb=false;
    for (var i = 0; i < ledger.length; i++) {
      var e = ledger[i].event;
      if (e === 'PUBLIC_DOUBT') sawDoubt = true;
      else if (e === 'CREDIT_CRISIS') sawCrisis = true;
      else if (e === 'PANIC') sawPanic = true;
      else if (e === 'DEFAULT') sawDefault = true;
      else if (e === 'REBELLION') sawReb = true;
    }
    if (sawDoubt) fail.doubt++;
    if (sawCrisis) fail.crisis++;
    if (sawPanic) fail.panic++;
    if (sawDefault) fail.default++;
    if (sawReb) fail.rebellion++;

    // Recoverability: reconstruct trajectory; "entered crisis" = min credit <= 4.
    var traj = creditTrajectory(ledger);
    var minCredit = Math.min.apply(null, traj);
    var finalCredit = st.tracks && st.tracks.credit ? st.tracks.credit.value : traj[traj.length - 1];
    if (minCredit <= 4) {
      crisisGames++;
      if (sawDefault || minCredit <= 0) crisisReachedDefault++;
      else if (finalCredit >= 7) crisisRecoveredStable++;
      else crisisOther++;
    }

    // Game length + completion. lap is the round counter; completion = gameOver.
    laps.push(st.lap);
    if (st.status === 'gameOver') completed++;
    // Circuit victory leaves a GAME OVER row that is NOT the hard-cap message.
    var hardCapped = ledger.some(function(r){ return r.event === 'GAME OVER' && typeof r.detail === 'string' && /books close anyway/.test(r.detail); });
    if (st.status === 'gameOver' && !hardCapped) circuitEnd++;
  }

  laps.sort(function(a,b){ return a-b; });
  var n = laps.length;
  var median = n === 0 ? 0 : (n % 2 ? laps[(n-1)/2] : (laps[n/2-1] + laps[n/2]) / 2);
  var mean = n === 0 ? 0 : laps.reduce(function(a,b){return a+b;},0) / n;

  return JSON.stringify({
    n: seeds.length,
    triplet: triplet,
    winsByProfile: winsByProfile,
    fail: fail,
    laps: { median: median, mean: mean, min: laps[0], max: laps[n-1] },
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
  const json = S(`window.__revalidateBatch(${JSON.stringify(seeds)}, ${JSON.stringify(triplet)})`);
  return JSON.parse(json);
}

function pct(x, total) { return total === 0 ? '0.0' : (100 * x / total).toFixed(1); }

function printReport(r) {
  const N = r.n;
  console.log('');
  console.log('Sovereign · Credit Spiral re-validation');
  console.log('=======================================');
  console.log(`Engine: LIVE HTML (release/digital-mode/sovereign-solo.html) via jsdom`);
  console.log(`Sweep:  CANONICAL × ${N} · seeds ${SEED_START}..${SEED_START + N - 1}`);
  console.log(`Triplet: [${r.triplet.join(' / ')}]`);
  console.log('');
  console.log('WIN BANDS');
  for (const prof of r.triplet) {
    const w = r.winsByProfile[prof] || 0;
    console.log(`  ${prof.padEnd(26)} ${String(w).padStart(3)} / ${N}   ${pct(w, N).padStart(5)} %`);
  }
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
  console.log('GAME LENGTH + COMPLETION');
  console.log(`  Median laps   ${r.laps.median}`);
  console.log(`  Mean laps     ${r.laps.mean.toFixed(2)}`);
  console.log(`  Range         ${r.laps.min}..${r.laps.max}`);
  console.log(`  Completion    ${r.completion.completed} / ${r.completion.total} reached gameOver`);
  console.log(`  Circuit-end   ${r.completion.circuitEnd} / ${r.completion.total} (rest hit hard cap)`);
  console.log('');
}

// ---------------------------------------------------------------------------
// Tolerance gate (the design spec's pass criteria). Returns {pass, lines}.
// ---------------------------------------------------------------------------
function evaluateGate(r) {
  const N = r.n;
  const lines = [];
  let pass = true;
  const ok = (cond, label) => { lines.push((cond ? 'PASS' : 'FAIL') + '  ' + label); if (!cond) pass = false; };

  // Win bands: Treasury strongest; no profile <12% or >65%.
  const rate = (prof) => 100 * (r.winsByProfile[prof] || 0) / N;
  const tre = rate('treasury-finance');
  const mer = rate('merchant-infrastructure');
  const man = rate('manufacturer-industry');
  ok(tre >= mer && tre >= man, `Treasury strongest profile (T ${tre.toFixed(1)}% vs M ${mer.toFixed(1)}% / Mf ${man.toFixed(1)}%)`);
  ok([tre, mer, man].every(x => x >= 12 && x <= 65), `No profile <12% or >65% (T ${tre.toFixed(1)} / M ${mer.toFixed(1)} / Mf ${man.toFixed(1)})`);

  // Crisis fires meaningfully (>=25/100); Panic/Default occur but not the common outcome.
  const crisisPer100 = 100 * r.fail.crisis / N;
  ok(crisisPer100 >= 25, `Crisis fires meaningfully (>=25/100): ${crisisPer100.toFixed(1)}/100`);
  ok(r.fail.panic <= N * 0.5, `Panic not the common outcome (<=50/100): ${(100 * r.fail.panic / N).toFixed(1)}/100`);
  ok(r.fail.default <= N * 0.5, `Default not the common outcome (<=50/100): ${(100 * r.fail.default / N).toFixed(1)}/100`);

  // Recoverability 40-80% of crisis games recover (healthy mix).
  if (r.recover.crisisGames > 0) {
    const recPct = 100 * r.recover.recoveredStable / r.recover.crisisGames;
    ok(recPct >= 40 && recPct <= 80, `Recoverability 40-80% of crisis games recover: ${recPct.toFixed(1)}%`);
  } else {
    ok(false, 'Recoverability: no crisis games to measure (Crisis must fire)');
  }

  // Completion 100/100; median near ~23 laps (document drift; gate at a band).
  ok(r.completion.completed === N, `Completion ${r.completion.completed}/${N} reached gameOver`);
  ok(r.laps.median >= 18 && r.laps.median <= 28, `Median laps near ~23 (18..28): ${r.laps.median}`);

  return { pass, lines };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  let seeds = Array.from({ length: SEED_COUNT }, (_, i) => SEED_START + i);
  let determinism = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--determinism') determinism = true;
    else if (args[i] === '--seeds' && args[i + 1]) {
      seeds = args[++i].split(',').map(s => parseInt(s.trim(), 10)).filter(Number.isFinite);
    }
  }
  return { seeds, determinism };
}

function main() {
  const { seeds, determinism } = parseArgs();
  const t0 = Date.now();
  const { S, jsdomErrors } = bootPage();

  const report = runSweep(S, seeds, CANONICAL_TRIPLET);
  printReport(report);

  const { pass, lines } = evaluateGate(report);
  console.log('TOLERANCE GATE');
  for (const l of lines) console.log('  ' + l);
  console.log('  ' + (pass ? '==> GATE MET' : '==> GATE NOT MET'));
  console.log('');

  if (determinism) {
    // Re-run the whole sweep in a FRESH page; the compact summary must be byte-identical.
    const { S: S2 } = bootPage();
    const report2 = runSweep(S2, seeds, CANONICAL_TRIPLET);
    const a = JSON.stringify(report), b = JSON.stringify(report2);
    if (a === b) console.log('DETERMINISM  PASS  two full sweeps are byte-identical');
    else { console.log('DETERMINISM  FAIL  sweeps diverged'); process.exitCode = 1; }
    console.log('');
  }

  if (jsdomErrors.length) {
    console.log('NOTE: jsdomErrors during boot (non-fatal if report rendered):');
    for (const e of jsdomErrors.slice(0, 5)) console.log('  ' + e.split('\n')[0]);
    console.log('');
  }

  console.log(`(${seeds.length} games in ${((Date.now() - t0) / 1000).toFixed(1)}s)`);

  // Exit non-zero only when explicitly gating in CI-ish use. By default we print
  // and return 0 so the script is a measurement tool during tuning. Set
  // SOVEREIGN_GATE=1 to make the tolerance gate enforce the exit code.
  if (process.env.SOVEREIGN_GATE === '1' && !pass) process.exitCode = 1;
}

main();
