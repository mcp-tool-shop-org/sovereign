/* Cross-check the v0.16 Node sim against Claude Design's reported traces:
 *   1. Seed 2026 — byte-identical to v0.13 (Anti-Federalist Pamphlet doesn't
 *      draw in this seed). Final scores [14,7,15], credit ends at 6.
 *   2. Seed 2 — Anti-Federalist Pamphlet draws at lap 6 / turn 16. Verify
 *      ledger row order (Credit -1, then Resistance +1, then Cash payments).
 *      Claude Design reported indices 123→124→125: CREDIT 8→7, RESISTANCE 2→3,
 *      Cash -60 TN for player with 2 Revenue-system properties.
 *   3. Seed 311 — Triple-pressure with Federalist Victory recovery:
 *      L1/T0  Funding Act:           5 → 7
 *      L5/T13 Federalist Victory:    7 → 8
 *      L6/T17 Speculation Fever:     8 → 7
 *      L6/T18 Anti-Federalist Pamphlet: 7 → 6  (v0.16 lever)
 *      L7/T19 Bank Run:              6 → 5
 *      Final credit 5.
 *   4. Seed 70 — NEW two-card floor path (Spec Fever + Anti-Fed Pamphlet, NO Bank Run):
 *      L1/T0  Funding Act:           5 → 7
 *      L6/T16 Speculation Fever:     7 → 6
 *      L7/T19 Anti-Federalist Pamphlet: 6 → 5
 *      Final scores [8, 6, 7] credit 5. v0.13 couldn't reach 5 without Bank Run.
 */
import { runDiagnosisGame as runV13, runBatchGame as runBatch13 } from './sim-v0.13.mjs';
import { runDiagnosisGame as runV16, runBatchGame as runBatch16 } from './sim-v0.16.mjs';

const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];

console.log('=== STEP 1: seed 2026 byte-identical v0.13 ↔ v0.16 ===');
const v13_2026 = runV13(2026, TRIPLET, true);
const v16_2026 = runV16(2026, TRIPLET, true);
const fields = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity', 'defaultFired', 'rebellionFired', 'bankruptcyEvents'];
let s1 = true;
for (const f of fields) {
  const ok = JSON.stringify(v13_2026[f]) === JSON.stringify(v16_2026[f]);
  if (!ok) { s1 = false; console.log(`  ${f}: MISMATCH v13=${JSON.stringify(v13_2026[f])} v16=${JSON.stringify(v16_2026[f])}`); }
}
const v13Credit = v13_2026.telemetry.tracks.credit.end;
const v16Credit = v16_2026.telemetry.tracks.credit.end;
console.log(`  Final credit: v13=${v13Credit}  v16=${v16Credit}  (both should be 6)`);
const apEvents2026 = v16_2026.telemetry.pressureEvents.filter(e => e.reason === 'Anti-Federalist Pamphlet');
console.log(`  Anti-Federalist Pamphlet credit events in seed 2026: ${apEvents2026.length}  (Claude Design note: 0 expected)`);
console.log(`  ${s1 ? 'PASS — seed 2026 byte-identical' : 'FAIL'}\n`);
if (!s1) process.exit(1);

console.log('=== STEP 2: seed 2 — Anti-Federalist Pamphlet ledger order ===');
const v16_2_batch = runBatch16(2, TRIPLET, true);
const ledger = v16_2_batch.state.ledger;
/* Find consecutive Anti-Federalist Pamphlet rows */
const apIndices = [];
for (let i = 0; i < ledger.length; i++) {
  const r = ledger[i];
  if (r.detail && r.detail.includes('Anti-Federalist Pamphlet') || (r.detail && r.detail.includes('Anti-Fed Pamphlet'))) {
    apIndices.push(i);
  }
}
console.log(`  Found ${apIndices.length} Anti-Federalist Pamphlet ledger rows`);
if (apIndices.length === 0) {
  console.log(`  Anti-Fed Pamphlet didn't draw in seed 2 — checking neighborhood for any drawn card...`);
} else {
  /* Inspect the first cluster */
  const firstIdx = apIndices[0];
  console.log(`  First cluster starts at ledger idx ${firstIdx}, lap ${ledger[firstIdx].lap}, turn ${ledger[firstIdx].turn}`);
  /* Print 5 rows from first cluster start */
  for (let i = firstIdx; i < Math.min(firstIdx + 6, ledger.length); i++) {
    const r = ledger[i];
    console.log(`    idx ${i} · ${r.actor.padEnd(8)} · ${r.event.padEnd(10)} · ${r.detail}`);
  }
  /* Validate the order: row 0 is Credit, row 1 is Resistance, then any cash */
  const r0 = ledger[firstIdx];
  const r1 = ledger[firstIdx + 1];
  const credOk = r0.event === 'CREDIT' && r0.detail.includes('Anti-Federalist Pamphlet');
  const resOk = r1.event === 'RESISTANCE' && r1.detail.includes('Anti-Federalist Pamphlet');
  console.log(`  Ledger order: Credit-first ${credOk ? 'PASS' : 'FAIL'}, Resistance-second ${resOk ? 'PASS' : 'FAIL'}`);
}
console.log('');

console.log('=== STEP 3: seed 311 — triple-pressure with Federalist Victory recovery ===');
const v16_311 = runV16(311, TRIPLET, true);
const creditEvs311 = v16_311.telemetry.pressureEvents.filter(e => e.track === 'credit');
console.log(`  Credit events in seed 311 (v0.16):`);
for (const ev of creditEvs311) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: ${ev.reason} · ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  Final credit: ${v16_311.telemetry.tracks.credit.end}`);
console.log(`  Claude Design reported cascade:`);
console.log(`    Lap 1/T0  Funding Act:                5 → 7`);
console.log(`    Lap 5/T13 Federalist Victory:         7 → 8`);
console.log(`    Lap 6/T17 Speculation Fever:          8 → 7`);
console.log(`    Lap 6/T18 Anti-Federalist Pamphlet:   7 → 6`);
console.log(`    Lap 7/T19 Bank Run:                   6 → 5`);
console.log(`    Final credit: 5\n`);

console.log('=== STEP 4: seed 70 — NEW two-card floor (Spec Fever + Anti-Fed, no Bank Run) ===');
const v16_70 = runV16(70, TRIPLET, true);
const v13_70 = runV13(70, TRIPLET, true);
const creditEvs70 = v16_70.telemetry.pressureEvents.filter(e => e.track === 'credit');
console.log(`  Credit events in seed 70 (v0.16):`);
for (const ev of creditEvs70) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: ${ev.reason} · ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
const v16_70_bankRunFired = creditEvs70.some(e => e.reason === 'Bank Run');
console.log(`  Bank Run fired? ${v16_70_bankRunFired}  (Claude Design: NO)`);
console.log(`  v16 final scores: ${JSON.stringify(v16_70.scores)}, final credit: ${v16_70.telemetry.tracks.credit.end}`);
console.log(`  v13 final scores: ${JSON.stringify(v13_70.scores)}, final credit: ${v13_70.telemetry.tracks.credit.end}`);
console.log(`  Claude Design reported v0.16 cascade for seed 70:`);
console.log(`    Lap 1/T0  Funding Act:                5 → 7`);
console.log(`    Lap 6/T16 Speculation Fever:          7 → 6`);
console.log(`    Lap 7/T19 Anti-Federalist Pamphlet:   6 → 5`);
console.log(`    Final scores [8, 6, 7], credit 5\n`);

console.log('=== ALL VERIFICATION COMPLETE ===');
