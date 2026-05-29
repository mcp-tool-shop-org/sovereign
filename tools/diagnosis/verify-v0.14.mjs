/* Cross-check the v0.14 Node sim against Claude Design's reported traces:
 *   1. Seed 2026 — byte-identical to v0.13 (Credit Restored doesn't fire).
 *   2. Seed 11 — Credit Restored fires at credit ≥ 6 (ungated). Ledger
 *      matches v0.13 byte-identically.
 *   3. Seed 1294 — full three-lever cascade:
 *      Spec Fever lap 6 turn 17: credit 7 → 6
 *      Bank Run lap 7 turn 19: credit 6 → 5
 *      Credit Restored lap 7 turn 21: GATED, no Credit gain, bond payments still resolve
 */
import { runDiagnosisGame as runV13 } from './sim-v0.13.mjs';
import { runDiagnosisGame as runV14 } from './sim-v0.14.mjs';

const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];

console.log('=== STEP 1: seed 2026 byte-identical v0.13 ↔ v0.14 ===');
const v13_2026 = runV13(2026, TRIPLET, true);
const v14_2026 = runV14(2026, TRIPLET, true);
const fields = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity', 'defaultFired', 'rebellionFired', 'bankruptcyEvents'];
let s1 = true;
for (const f of fields) {
  const ok = JSON.stringify(v13_2026[f]) === JSON.stringify(v14_2026[f]);
  if (!ok) { s1 = false; console.log(`  ${f}: MISMATCH v13=${JSON.stringify(v13_2026[f])} v14=${JSON.stringify(v14_2026[f])}`); }
}
const v13Credit = v13_2026.telemetry.tracks.credit.end;
const v14Credit = v14_2026.telemetry.tracks.credit.end;
console.log(`  Final credit: v13=${v13Credit}  v14=${v14Credit}  (both should be 6)`);
console.log(`  ${s1 ? 'PASS — seed 2026 byte-identical' : 'FAIL'}\n`);
if (!s1) process.exit(1);

console.log('=== STEP 2: seed 11 — Credit Restored fires at credit ≥ 6 (ungated) ===');
const v13_11 = runV13(11, TRIPLET, true);
const v14_11 = runV14(11, TRIPLET, true);
const same11 = ['winner', 'scores', 'lapsReached', 'totalTurns'].every(k => JSON.stringify(v13_11[k]) === JSON.stringify(v14_11[k]));
console.log(`  v13 ↔ v14 byte-identical (Credit Restored fires at high credit): ${same11 ? 'PASS' : 'FAIL'}`);
const crEvents14 = v14_11.telemetry.pressureEvents.filter(e => e.reason === 'Credit Restored');
console.log(`  Credit Restored credit events in seed 11 (v0.14): ${crEvents14.length}`);
for (const ev of crEvents14) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: credit ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log('');

console.log('=== STEP 3: seed 1294 — full three-lever cascade ===');
const v14_1294 = runV14(1294, TRIPLET, true);
const creditEvs = v14_1294.telemetry.pressureEvents.filter(e => e.track === 'credit');
console.log(`  Credit events in seed 1294:`);
for (const ev of creditEvs) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: ${ev.reason} · ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  Final credit: ${v14_1294.telemetry.tracks.credit.end}`);
console.log(`  Claude Design reported cascade:`);
console.log(`    Lap 6/T17 Spec Fever: 7 → 6`);
console.log(`    Lap 7/T19 Bank Run: 6 → 5`);
console.log(`    Lap 7/T21 Credit Restored: GATED (no row, panic persists)`);

const v13_1294 = runV13(1294, TRIPLET, true);
const v13_creditEnd = v13_1294.telemetry.tracks.credit.end;
const v14_creditEnd = v14_1294.telemetry.tracks.credit.end;
console.log(`  v13 final credit: ${v13_creditEnd}  v14 final credit: ${v14_creditEnd}  (v14 should be LOWER if gating fires)`);
console.log('');

console.log('=== ALL VERIFICATION COMPLETE ===');
