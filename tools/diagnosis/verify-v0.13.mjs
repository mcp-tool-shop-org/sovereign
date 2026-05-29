/* Cross-check the v0.13 Node sim against Claude Design's reported traces:
 *   1. Seed 2026: final scores [14, 7, 15] but credit ends at 6 (not 7 like v0.11).
 *      Speculation Fever fires lap 6 / turn 16 in this seed (Hamilton draws it).
 *   2. Seed 10: both Bank Run AND Speculation Fever fire. Credit trajectory matches
 *      Claude Design's reported sequence: Funding 5→7, Bank Run 7→6 (lap 1),
 *      Foreign Loan 6→7, Spec Fever 7→6 (lap 2), Gold/Silver 6→7. Ends at 7.
 *   3. Spec Fever ledger order: CREDIT row before RESISTANCE row.
 *   4. Pre-Spec-Fever seeds remain v0.11-identical.
 */
import { runDiagnosisGame as runV10 } from './sim.mjs';
import { runDiagnosisGame as runV11 } from './sim-v0.11.mjs';
import { runDiagnosisGame as runV13 } from './sim-v0.13.mjs';

const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];

/* --- Step 1: seed 2026 — scores match, credit-end diverges --- */
console.log('=== STEP 1: seed 2026 — Claude Design reports scores match v0.11, ledger diverges ===');
const v11_2026 = runV11(2026, TRIPLET, true);
const v13_2026 = runV13(2026, TRIPLET, true);
const sameScores = JSON.stringify(v11_2026.scores) === JSON.stringify(v13_2026.scores);
console.log(`  Scores match: ${sameScores ? 'YES' : 'NO'} (v11=${JSON.stringify(v11_2026.scores)} v13=${JSON.stringify(v13_2026.scores)})`);
const v11Credit = v11_2026.telemetry.tracks.credit.end;
const v13Credit = v13_2026.telemetry.tracks.credit.end;
console.log(`  Credit end: v11=${v11Credit}  v13=${v13Credit}  (Claude Design reported v0.13 ends at 6)`);

const specFever_v13 = v13_2026.telemetry.pressureEvents.filter(e => e.reason === 'Speculation Fever');
console.log(`  Speculation Fever fires in seed 2026: ${specFever_v13.length > 0 ? 'YES' : 'NO'}  (Claude Design reported YES, lap 6 / turn 16)`);
if (specFever_v13.length > 0) {
  for (const ev of specFever_v13) {
    console.log(`    lap ${ev.lap} · turn ${ev.turn} · track=${ev.track} · ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
  }
  /* Verify CREDIT row before RESISTANCE row */
  const grouped = specFever_v13.reduce((acc, ev) => {
    const k = `${ev.lap}-${ev.turn}`;
    if (!acc[k]) acc[k] = [];
    acc[k].push(ev);
    return acc;
  }, {});
  for (const [k, evs] of Object.entries(grouped)) {
    if (evs.length === 2 && evs[0].track === 'credit' && evs[1].track === 'resistance') {
      console.log(`  Order check lap-turn ${k}: credit-then-resistance ✓`);
    } else {
      console.log(`  Order check lap-turn ${k}: WRONG — ${evs.map(e => e.track).join(' → ')}`);
    }
  }
}
console.log('');

/* --- Step 2: seed 10 — combined firing trace --- */
console.log('=== STEP 2: seed 10 — both Bank Run AND Speculation Fever fire ===');
const seed10 = runV13(10, TRIPLET, true);
const creditEvents10 = seed10.telemetry.pressureEvents.filter(e => e.track === 'credit');
console.log(`  Credit events in seed 10 (v0.13):`);
for (const ev of creditEvents10) {
  console.log(`    lap ${ev.lap} · turn ${ev.turn} · ${ev.reason} · ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  Final scores: ${JSON.stringify(seed10.scores)}`);
console.log(`  Final credit: ${seed10.telemetry.tracks.credit.end}`);
console.log(`  Claude Design reported: scores [15, 5, 6], credit ends 7`);
console.log('');

/* --- Step 3: pre-Spec-Fever / pre-Bank-Run seeds match v0.11 --- */
console.log('=== STEP 3: a seed where neither Spec Fever nor Bank Run fires must match v0.11 ===');
let preFireSeed = -1;
for (let seed = 2026; seed < 2200; seed++) {
  const g = runV13(seed, TRIPLET, true);
  const fires = g.telemetry.pressureEvents.filter(e => e.reason === 'Speculation Fever' || e.reason === 'Bank Run');
  if (fires.length === 0) { preFireSeed = seed; break; }
}
if (preFireSeed < 0) console.log('  No seed in 2026-2199 lacks both cards — almost every game draws at least one');
else {
  const v11 = runV11(preFireSeed, TRIPLET, true);
  const v13 = runV13(preFireSeed, TRIPLET, true);
  const allMatch = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity', 'defaultFired'].every(k => JSON.stringify(v11[k]) === JSON.stringify(v13[k]));
  console.log(`  Seed ${preFireSeed} (neither card fires): v11 ↔ v13 byte-identical: ${allMatch ? 'YES' : 'NO'}`);
}
console.log('');
console.log('=== Verification complete ===');
