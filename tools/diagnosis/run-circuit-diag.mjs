/* =====================================================================
 * Sovereign · Circuit-Based End Condition Diagnostic
 * ---------------------------------------------------------------------
 * Tests state-based end conditions (circuits around the board) instead
 * of turn-counter cap. Goal: produce a longer, more board-game-natural
 * arc than the current 12-round ceiling.
 *
 * Sweeps:
 *   - Race:     first-to-N circuits triggers end, N ∈ {4, 5, 6}
 *   - Marathon: all-players-complete-N circuits, N ∈ {3, 4}
 *
 * Method: run CANONICAL × 100 at TOTAL_ROUNDS=30 (high cap to ensure
 * data exists for late-ending variants). Walk ledgers for CIRCUIT
 * events. Post-hoc evaluate each end condition.
 *
 * Reports per variant: median game length in turns, profile distribution
 * of who triggers end, win-at-termination profile distribution, turn
 * variance, games that hit the safety cap.
 * ===================================================================== */
import {
  runBatchGame,
  setTotalRounds,
} from './sim-pacing-diag.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'E:/AI/sovereign/experiments/circuit-diag';
mkdirSync(OUT_DIR, { recursive: true });

const TM_TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const SAFETY_CAP_ROUNDS = 30;

console.log('='.repeat(60));
console.log('SOVEREIGN CIRCUIT-BASED END CONDITION DIAGNOSTIC');
console.log('='.repeat(60));
console.log(`Cap (safety): ${SAFETY_CAP_ROUNDS} rounds. Variants run on the same 100 games.`);

setTotalRounds(SAFETY_CAP_ROUNDS);
const t0 = Date.now();
const games = [];
for (let seed = 2026; seed < 2126; seed++) {
  const b = runBatchGame(seed, TM_TRIPLET, true);
  /* Extract CIRCUIT events with parsed circuit number + turn from ledger */
  const circuits = [];
  for (const row of b.state.ledger) {
    if (row.event !== 'CIRCUIT') continue;
    /* detail: "Hamilton completes circuit 3 · turn 17" */
    const m = row.detail.match(/^(.+?) completes circuit (\d+) · turn (\d+)$/);
    if (!m) continue;
    const playerName = m[1];
    const slot = b.state.players.findIndex(p => p.name === playerName);
    if (slot < 0) continue;
    circuits.push({ slot, circuit: parseInt(m[2], 10), turn: parseInt(m[3], 10), lap: row.lap });
  }
  /* Per-player per-round IP from snapshots */
  games.push({
    seed,
    profiles: b.state.players.map(p => p.profile),
    circuits, /* sorted chronologically by turn */
    snapshots: b.state.roundSnapshots,
    finalIPs: b.state.finalScores.map(s => s.total),
    finalLap: b.state.lap,
  });
}
console.log(`Ran ${games.length} games at cap=${SAFETY_CAP_ROUNDS} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

/* Quick reality check: distribution of circuits-per-player at cap */
const finalCircuitsPerPlayer = [[], [], []];
for (const g of games) {
  for (let slot = 0; slot < 3; slot++) {
    /* count circuits completed by this slot */
    const c = g.circuits.filter(c => c.slot === slot).length;
    finalCircuitsPerPlayer[slot].push(c);
  }
}
console.log('\nFinal-circuit distribution at cap=30 (per slot):');
for (let slot = 0; slot < 3; slot++) {
  const arr = finalCircuitsPerPlayer[slot].slice().sort((a, b) => a - b);
  const min = arr[0];
  const max = arr[arr.length - 1];
  const med = arr[Math.floor(arr.length / 2)];
  const profile = games[0].profiles[slot];
  console.log(`  slot ${slot} (${profile.replace('-', ' / ')}): min=${min}  median=${med}  max=${max}`);
}

/* ============================================================
 * Evaluate end condition: race (first-to-N)
 * Returns { triggered, triggerTurn, triggerSlot, triggerCircuit } or null
 * ============================================================ */
function evaluateRace(game, N) {
  for (const c of game.circuits) {
    if (c.circuit >= N) {
      return {
        triggered: true,
        triggerTurn: c.turn,
        triggerLap: c.lap,
        triggerSlot: c.slot,
        winnerProfile: game.profiles[c.slot],
      };
    }
  }
  return { triggered: false, triggerTurn: null, triggerSlot: null };
}

/* ============================================================
 * Evaluate end condition: marathon (all-players-complete-N)
 * Game ends when the LAST player completes their Nth circuit.
 * ============================================================ */
function evaluateMarathon(game, N) {
  const nthByPlayer = [null, null, null];
  for (const c of game.circuits) {
    if (c.circuit === N && nthByPlayer[c.slot] === null) {
      nthByPlayer[c.slot] = c.turn;
    }
  }
  if (nthByPlayer.some(t => t === null)) {
    return { triggered: false, triggerTurn: null, triggerSlot: null };
  }
  const triggerTurn = Math.max(...nthByPlayer);
  const triggerSlot = nthByPlayer.indexOf(triggerTurn);
  return {
    triggered: true,
    triggerTurn,
    triggerSlot,
    completionTurns: nthByPlayer.slice(),
  };
}

/* ============================================================
 * Compute winner-at-termination using the round snapshots
 * Find the snapshot at or before the trigger turn; identify IP leader.
 * ============================================================ */
function winnerAtTrigger(game, triggerTurn) {
  /* roundSnapshots[i] = state at end of round (i+1).
     Each round = 3 turns. Round R completes at turn 3*R. */
  if (triggerTurn === null) return null;
  /* Find smallest round R where turn >= 3*R. */
  const round = Math.max(1, Math.floor((triggerTurn + 2) / 3));
  const snap = game.snapshots[Math.min(round, game.snapshots.length) - 1];
  if (!snap) return null;
  const sorted = snap.ips.map((ip, i) => ({ ip, i })).sort((a, b) => b.ip - a.ip);
  return {
    slot: sorted[0].i,
    profile: game.profiles[sorted[0].i],
    ip: sorted[0].ip,
    lead: sorted[0].ip - sorted[1].ip,
    allIPs: snap.ips,
  };
}

/* ============================================================
 * Evaluate a variant
 * ============================================================ */
function evaluateVariant(name, condFn) {
  const outcomes = games.map(g => {
    const cond = condFn(g);
    const winner = cond.triggered ? winnerAtTrigger(g, cond.triggerTurn) : null;
    return { game: g, cond, winner };
  });

  const triggered = outcomes.filter(o => o.cond.triggered);
  const safetyCapped = outcomes.filter(o => !o.cond.triggered);

  const turns = triggered.map(o => o.cond.triggerTurn).sort((a, b) => a - b);
  const rounds = triggered.map(o => Math.ceil((o.cond.triggerTurn + 1) / 3)).sort((a, b) => a - b);

  const winsByProfile = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
  const triggersByProfile = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
  let totalIP = 0, totalLead = 0;
  for (const o of triggered) {
    if (o.winner) {
      winsByProfile[o.winner.profile] += 1;
      totalIP += o.winner.ip;
      totalLead += o.winner.lead;
    }
    if (o.cond.winnerProfile) {
      triggersByProfile[o.cond.winnerProfile] += 1;
    } else if (o.cond.triggerSlot !== null) {
      const profile = o.game.profiles[o.cond.triggerSlot];
      triggersByProfile[profile] += 1;
    }
  }

  return {
    name,
    triggered: triggered.length,
    safetyCapped: safetyCapped.length,
    medianTurn: turns.length > 0 ? turns[Math.floor(turns.length / 2)] : null,
    minTurn: turns[0] || null,
    maxTurn: turns[turns.length - 1] || null,
    medianRound: rounds.length > 0 ? rounds[Math.floor(rounds.length / 2)] : null,
    minRound: rounds[0] || null,
    maxRound: rounds[rounds.length - 1] || null,
    avgWinnerIP: triggered.length > 0 ? (totalIP / triggered.length).toFixed(1) : 'n/a',
    avgLead: triggered.length > 0 ? (totalLead / triggered.length).toFixed(1) : 'n/a',
    triggersByProfile,
    winsByProfile,
  };
}

/* ============================================================
 * Run sweep
 * ============================================================ */
const variants = [
  { name: 'Race N=4',     fn: g => evaluateRace(g, 4) },
  { name: 'Race N=5',     fn: g => evaluateRace(g, 5) },
  { name: 'Race N=6',     fn: g => evaluateRace(g, 6) },
  { name: 'Marathon N=3', fn: g => evaluateMarathon(g, 3) },
  { name: 'Marathon N=4', fn: g => evaluateMarathon(g, 4) },
];

const results = variants.map(v => evaluateVariant(v.name, v.fn));

/* ============================================================
 * Report
 * ============================================================ */
console.log('\n' + '='.repeat(60));
console.log('CIRCUIT END-CONDITION SWEEP — CANONICAL × 100');
console.log('='.repeat(60));
console.log('\nReference: current model = 12 rounds = 36 turns (3 turns/round).\n');

for (const r of results) {
  console.log(`--- ${r.name} ---`);
  console.log(`  triggered: ${r.triggered}/100   safety-capped at ${SAFETY_CAP_ROUNDS} rounds: ${r.safetyCapped}/100`);
  if (r.triggered > 0) {
    console.log(`  game length (turns):  median=${r.medianTurn}  min=${r.minTurn}  max=${r.maxTurn}`);
    console.log(`  game length (rounds): median=${r.medianRound}  min=${r.minRound}  max=${r.maxRound}`);
    console.log(`  winner-at-trigger IP:   avg=${r.avgWinnerIP}    avg lead=${r.avgLead}`);
    console.log(`  trigger-player profile: T=${r.triggersByProfile['treasury-finance']}  M=${r.triggersByProfile['merchant-infrastructure']}  Mfg=${r.triggersByProfile['manufacturer-industry']}`);
    console.log(`  winner profile:         T=${r.winsByProfile['treasury-finance']}  M=${r.winsByProfile['merchant-infrastructure']}  Mfg=${r.winsByProfile['manufacturer-industry']}`);
  }
  console.log('');
}

writeFileSync(
  OUT_DIR + '/circuit-diagnostic-summary.json',
  JSON.stringify({
    generated: new Date().toISOString(),
    caveat: 'Behavioral adaptation unmeasured: AI profiles play current decision functions, not circuit-aware ones.',
    safetyCapRounds: SAFETY_CAP_ROUNDS,
    finalCircuitDistribution: [0, 1, 2].map(slot => ({
      slot,
      profile: games[0].profiles[slot],
      values: finalCircuitsPerPlayer[slot],
    })),
    results,
  }, null, 2)
);
console.log(`Wrote ${OUT_DIR}/circuit-diagnostic-summary.json`);
console.log('\nDone.');
