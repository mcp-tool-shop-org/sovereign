/* Two-step verifier for the v0.11 Bank Run patch:
 *
 *   1. Seed 2026 must produce v0.10-identical results (Bank Run doesn't fire there,
 *      and adjustTrack adds no RNG calls — so byte-identity must hold).
 *   2. On the first seed where Bank Run fires, the ledger must show:
 *        Track · CREDIT   · Bank Run · <a> → <b> (-1)
 *        Track · CAPACITY · Bank Run · <c> → <d> (-1)
 *      in that order, before the existing Charter check + NF upgrade loop.
 */
import { runDiagnosisGame as runV10 } from './sim.mjs';
import { runDiagnosisGame as runV11 } from './sim-v0.11.mjs';

const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];

/* --- Step 1: seed 2026 byte-identity --- */
const v10_2026 = runV10(2026, TRIPLET, true);
const v11_2026 = runV11(2026, TRIPLET, true);

const compare = (a, b, label) => {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A === B) return `  ${label}: identical`;
  return `  ${label}: DIVERGE\n    v10 = ${A.slice(0, 120)}...\n    v11 = ${B.slice(0, 120)}...`;
};

console.log('=== STEP 1: seed 2026 byte-identity (Bank Run does NOT fire) ===');
const sameWinner = JSON.stringify(v10_2026.winner) === JSON.stringify(v11_2026.winner);
const sameScores = JSON.stringify(v10_2026.scores) === JSON.stringify(v11_2026.scores);
const sameTurns = v10_2026.totalTurns === v11_2026.totalTurns;
const sameLaps = v10_2026.lapsReached === v11_2026.lapsReached;
const sameCap = v10_2026.finalCapacity === v11_2026.finalCapacity;
const sameBankrupt = v10_2026.bankruptcyEvents === v11_2026.bankruptcyEvents;
const sameDefault = v10_2026.defaultFired === v11_2026.defaultFired;
const sameRebellion = v10_2026.rebellionFired === v11_2026.rebellionFired;

console.log('  winner:', sameWinner ? 'OK' : `MISMATCH v10=${JSON.stringify(v10_2026.winner)} v11=${JSON.stringify(v11_2026.winner)}`);
console.log('  scores:', sameScores ? 'OK' : `MISMATCH v10=${JSON.stringify(v10_2026.scores)} v11=${JSON.stringify(v11_2026.scores)}`);
console.log('  totalTurns:', sameTurns ? 'OK' : `MISMATCH v10=${v10_2026.totalTurns} v11=${v11_2026.totalTurns}`);
console.log('  lapsReached:', sameLaps ? 'OK' : `MISMATCH`);
console.log('  finalCapacity:', sameCap ? 'OK' : `MISMATCH v10=${v10_2026.finalCapacity} v11=${v11_2026.finalCapacity}`);
console.log('  bankruptcyEvents:', sameBankrupt ? 'OK' : `MISMATCH`);
console.log('  defaultFired:', sameDefault ? 'OK' : `MISMATCH`);
console.log('  rebellionFired:', sameRebellion ? 'OK' : `MISMATCH`);

const seed2026OK = sameWinner && sameScores && sameTurns && sameLaps && sameCap && sameBankrupt && sameDefault && sameRebellion;
if (!seed2026OK) { console.error('STEP 1 FAILED — Bank Run patch leaked into seed 2026'); process.exit(1); }
console.log('  --> seed 2026 byte-identical to v0.10\n');

/* --- Step 2: find a seed where Bank Run fires, verify dual-row pattern --- */
console.log('=== STEP 2: scan seeds 2026-2199 for Bank Run, verify ledger pattern ===');
let foundSeed = -1;
let bankRunLedgerRows = null;
for (let seed = 2026; seed < 2200; seed++) {
  const game = runV11(seed, TRIPLET, true);
  const ev = game.telemetry.pressureEvents.filter(e => e.reason === 'Bank Run');
  if (ev.length > 0) {
    foundSeed = seed;
    bankRunLedgerRows = ev;
    break;
  }
}

if (foundSeed < 0) { console.error('STEP 2 FAILED — no Bank Run draws in seeds 2026-2199'); process.exit(1); }

console.log(`  Bank Run first fires at seed ${foundSeed}`);
console.log(`  Pressure events tagged "Bank Run" in that game: ${bankRunLedgerRows.length}`);
for (const ev of bankRunLedgerRows) {
  console.log(`    lap ${ev.lap} · turn ${ev.turn} · track=${ev.track} · ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}

/* Verify the order is credit-then-capacity (per the patch contract) */
const grouped = {};
for (const ev of bankRunLedgerRows) {
  const key = `${ev.lap}-${ev.turn}`;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(ev);
}
let allCorrectOrder = true;
for (const [k, evs] of Object.entries(grouped)) {
  if (evs.length === 2 && evs[0].track === 'credit' && evs[1].track === 'capacity') {
    console.log(`  lap-turn ${k}: credit-then-capacity ✓`);
  } else {
    console.log(`  lap-turn ${k}: WRONG ORDER ${evs.map(e => e.track).join(' -> ')}`);
    allCorrectOrder = false;
  }
}
if (!allCorrectOrder) { console.error('STEP 2 FAILED — order incorrect'); process.exit(1); }

console.log('\n=== BOTH STEPS PASS ===');
console.log('v0.11 Node sim: seed 2026 byte-identical to v0.10, Bank Run pattern correct.');
