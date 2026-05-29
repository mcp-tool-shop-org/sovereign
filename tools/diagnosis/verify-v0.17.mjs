/* Cross-check the v0.17 Node sim against Claude Design's reported traces:
 *   1. Seed 2026 — control. Spec Fever fires lap 6/turn 16 at credit 7,
 *      so v0.17 still applies -1 (byte-identical to v0.16).
 *      Final scores [14,7,15], final credit 6.
 *   2. Seed 2139 — late -2 activation. Spec Fever fires lap 7/turn 21 at credit 6,
 *      so v0.17 applies -2 (credit 6 → 4 vs v0.16's 6 → 5).
 *   3. Seed 2313 — early -2 activation. Spec Fever fires lap 4/turn 12 at credit 6,
 *      so v0.17 applies -2. Full trajectory:
 *      lap 1: Funding 5→7
 *      lap 1 turn 1: Bank Run 7→6
 *      lap 4 turn 12: Spec Fever 6→4
 *   4. Seed 299 — triple-pressure cascade.
 *      lap 1: Funding 5→7
 *      lap 2 turn 6: Anti-Fed Pamphlet 7→6 (+ Resistance 2→3)
 *      lap 3 turn 9: Spec Fever 6→4 (+ Resistance 3→4)
 *      Final credit 4, resistance 4, scores [14,7,4].
 */
import { runDiagnosisGame as runV16 } from './sim-v0.16.mjs';
import { runDiagnosisGame as runV17 } from './sim-v0.17.mjs';

const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];

console.log('=== STEP 1: seed 2026 byte-identical v0.16 ↔ v0.17 (Credit ≥ 7 path) ===');
const v16_2026 = runV16(2026, TRIPLET, true);
const v17_2026 = runV17(2026, TRIPLET, true);
const fields = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity', 'defaultFired', 'rebellionFired', 'bankruptcyEvents'];
let s1 = true;
for (const f of fields) {
  const ok = JSON.stringify(v16_2026[f]) === JSON.stringify(v17_2026[f]);
  if (!ok) { s1 = false; console.log(`  ${f}: MISMATCH v16=${JSON.stringify(v16_2026[f])} v17=${JSON.stringify(v17_2026[f])}`); }
}
const v16Credit = v16_2026.telemetry.tracks.credit.end;
const v17Credit = v17_2026.telemetry.tracks.credit.end;
console.log(`  Final scores v16=${JSON.stringify(v16_2026.scores)}  v17=${JSON.stringify(v17_2026.scores)}`);
console.log(`  Final credit: v16=${v16Credit}  v17=${v17Credit}  (both should be 6)`);
const sfEvs2026 = v17_2026.telemetry.pressureEvents.filter(e => e.reason === 'Speculation Fever');
console.log(`  Spec Fever credit events in seed 2026 (v0.17):`);
for (const ev of sfEvs2026) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: credit ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  ${s1 ? 'PASS — seed 2026 byte-identical' : 'FAIL'}\n`);
if (!s1) process.exit(1);

console.log('=== STEP 2: seed 2139 — late -2 activation (credit 6 → 4) ===');
const v16_2139 = runV16(2139, TRIPLET, true);
const v17_2139 = runV17(2139, TRIPLET, true);
const sfEvs16_2139 = v16_2139.telemetry.pressureEvents.filter(e => e.reason === 'Speculation Fever');
const sfEvs17_2139 = v17_2139.telemetry.pressureEvents.filter(e => e.reason === 'Speculation Fever');
console.log(`  v0.16 Spec Fever events:`);
for (const ev of sfEvs16_2139) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: credit ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  v0.17 Spec Fever events:`);
for (const ev of sfEvs17_2139) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: credit ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  v0.16 final credit: ${v16_2139.telemetry.tracks.credit.end}  v0.17 final credit: ${v17_2139.telemetry.tracks.credit.end}`);
console.log(`  v0.17 final scores: ${JSON.stringify(v17_2139.scores)}\n`);

console.log('=== STEP 3: seed 2313 — early -2 activation (credit 6 → 4) ===');
const v17_2313 = runV17(2313, TRIPLET, true);
const creditEvs17_2313 = v17_2313.telemetry.pressureEvents.filter(e => e.track === 'credit');
console.log(`  v0.17 credit trajectory in seed 2313:`);
for (const ev of creditEvs17_2313) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: ${ev.reason} · ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  Final credit: ${v17_2313.telemetry.tracks.credit.end}  scores: ${JSON.stringify(v17_2313.scores)}\n`);

console.log('=== STEP 4: seed 299 — triple-pressure cascade ===');
const v17_299 = runV17(299, TRIPLET, true);
const creditEvs17_299 = v17_299.telemetry.pressureEvents.filter(e => e.track === 'credit');
const resistEvs17_299 = v17_299.telemetry.pressureEvents.filter(e => e.track === 'resistance');
console.log(`  v0.17 credit trajectory in seed 299:`);
for (const ev of creditEvs17_299) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: ${ev.reason} · credit ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  v0.17 resistance trajectory in seed 299:`);
for (const ev of resistEvs17_299) {
  console.log(`    lap ${ev.lap} turn ${ev.turn}: ${ev.reason} · resist ${ev.before} → ${ev.after} (${ev.appliedDelta >= 0 ? '+' : ''}${ev.appliedDelta})`);
}
console.log(`  Final credit: ${v17_299.telemetry.tracks.credit.end}  resistance: ${v17_299.telemetry.tracks.resistance.end}  scores: ${JSON.stringify(v17_299.scores)}`);
console.log(`  Claude Design reported: credit 4, resistance 4, scores [14,7,4]\n`);

console.log('=== ALL VERIFICATION COMPLETE ===');
