/* Cross-check the v0.15 Node sim against Claude Design's reported traces:
 *   1. Seed 2026 — byte-identical to v0.14 (GSI doesn't fire in this seed
 *      according to Claude Design's premise-drift note).
 *   2. Seed 16 — GSI fires at credit ≥ 6 (ungated, lap 5 turn 15, 7 → 8).
 *      Verifies the ungated branch still works and Mint payments fire.
 *   3. Seed 1368 — full four-lever cascade:
 *      Lap 1: Funding Act: credit 5 → 7
 *      Lap 6 turn 16: Speculation Fever: credit 7 → 6
 *      Lap 6 turn 18: Bank Run: credit 6 → 5
 *      Lap 7 turn 20: Gold and Silver Inflow: GATED, no Credit gain,
 *        Mint payments still resolve
 *      → final credit ends at 5 (under v0.14 it would have been 6)
 */
import { runDiagnosisGame as runV14 } from './sim-v0.14.mjs';
import { runDiagnosisGame as runV15 } from './sim-v0.15.mjs';

const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];

console.log('=== STEP 1: seed 2026 byte-identical v0.14 ↔ v0.15 ===');
const v14_2026 = runV14(2026, TRIPLET, true);
const v15_2026 = runV15(2026, TRIPLET, true);
const fields = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity', 'defaultFired', 'rebellionFired', 'bankruptcyEvents'];
let s1 = true;
for (const f of fields) {
  const ok = JSON.stringify(v14_2026[f]) === JSON.stringify(v15_2026[f]);
  if (!ok) { s1 = false; console.log(`  ${f}: MISMATCH v14=${JSON.stringify(v14_2026[f])} v15=${JSON.stringify(v15_2026[f])}`); }
}
const v14Credit = v14_2026.telemetry.tracks.credit.end;
const v15Credit = v15_2026.telemetry.tracks.credit.end;
console.log(`  Final credit: v14=${v14Credit}  v15=${v15Credit}  (both should be 6)`);
const gsiEvents2026 = v15_2026.telemetry.pressureEvents.filter(e => e.reason === 'Gold and Silver Inflow');
console.log(`  Gold and Silver Inflow credit events in seed 2026: ${gsiEvents2026.length}  (Claude Design note: 0 expected)`);
console.log(`  ${s1 ? 'PASS — seed 2026 byte-identical' : 'FAIL'}\n`);
if (!s1) process.exit(1);

console.log('=== STEP 2: seed 16 — GSI fires ungated at credit ≥ 6 ===');
const v14_16 = runV14(16, TRIPLET, true);
const v15_16 = runV15(16, TRIPLET, true);
const gsiEvents14 = v14_16.telemetry.pressureEvents.filter(e => e.reason === 'Gold and Silver Inflow');
const gsiEvents15 = v15_16.telemetry.pressureEvents.filter(e => e.reason === 'Gold and Silver Inflow');
console.log(`  v14 GSI events: ${gsiEvents14.length}`);
for (const ev of gsiEvents14) {
  console.log(`    v14: lap ${ev.lap} turn ${ev.turn}: credit ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  v15 GSI events: ${gsiEvents15.length}`);
for (const ev of gsiEvents15) {
  console.log(`    v15: lap ${ev.lap} turn ${ev.turn}: credit ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
const ungatedEvents = gsiEvents15.filter(e => e.before >= 6 && e.appliedDelta === 1);
console.log(`  v15 ungated fires (credit≥6 at resolve, +1 applied): ${ungatedEvents.length}`);
const same16Scores = JSON.stringify(v14_16.scores) === JSON.stringify(v15_16.scores);
console.log(`  v14 ↔ v15 final scores match: ${same16Scores ? 'PASS' : 'FAIL'}\n`);

console.log('=== STEP 3: seed 1368 — full four-lever cascade ===');
const v14_1368 = runV14(1368, TRIPLET, true);
const v15_1368 = runV15(1368, TRIPLET, true);
const creditEvs14 = v14_1368.telemetry.pressureEvents.filter(e => e.track === 'credit');
const creditEvs15 = v15_1368.telemetry.pressureEvents.filter(e => e.track === 'credit');
console.log(`  v14 credit events in seed 1368:`);
for (const ev of creditEvs14) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: ${ev.reason} · ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  v15 credit events in seed 1368:`);
for (const ev of creditEvs15) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: ${ev.reason} · ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  v14 final credit: ${v14_1368.telemetry.tracks.credit.end}  v15 final credit: ${v15_1368.telemetry.tracks.credit.end}`);
console.log(`  Claude Design reported cascade for v0.15:`);
console.log(`    Lap 1     Funding Act:           5 → 7`);
console.log(`    Lap 6/T16 Speculation Fever:    7 → 6`);
console.log(`    Lap 6/T18 Bank Run:             6 → 5`);
console.log(`    Lap 7/T20 Gold/Silver Inflow:   GATED (no row, panic persists)`);
console.log(`    Final credit: 5 (v14 would have been 6)\n`);

console.log('=== ALL VERIFICATION COMPLETE ===');
