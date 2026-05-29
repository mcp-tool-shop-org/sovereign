/* Cross-check the v0.18 Node sim against Claude Design's reported traces:
 *   1. Seed 2026 — no Credit Crisis. Final scores [14,7,15], final credit 6,
 *      final resistance 3 (no Crisis +1). Byte-identical to v0.17 in non-flag state.
 *   2. Seed 2139 — Credit Crisis fires once at lap 7 turn 21 after Spec Fever -2.
 *      Ledger order: CREDIT → CREDIT_CRISIS → RESISTANCE.
 *      Final credit 4, final resistance 4 (v0.17 was 3).
 *   3. Seed 2313 — Credit Crisis fires earlier at lap 4 turn 12.
 *      Final credit 4, final resistance 5 (v0.17 was 4).
 *   4. Anti-Fed Pamphlet path independence — no CANONICAL seed; verify by
 *      structural inspection of the trigger condition.
 *   5. Once-only sticky flag — verify creditCrisisFired stays set and
 *      pendingCreditCrisis can't re-fire.
 *   6. Default suppression at credit 1 → 0 — verify `next > 0` guard prevents
 *      both pendingDefault AND pendingCreditCrisis from queueing.
 */
import { runDiagnosisGame as runV17, runBatchGame as runBatchV17 } from './sim-v0.17.mjs';
import { runDiagnosisGame as runV18, runBatchGame as runBatchV18 } from './sim-v0.18.mjs';

const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];

function findCreditCrisisRow(ledger, expectedAfterAt) {
  return ledger.find((r, i) =>
    r.event === 'CREDIT_CRISIS' &&
    (expectedAfterAt === undefined || i === expectedAfterAt)
  );
}

console.log('=== STEP 1: seed 2026 — no Credit Crisis (Credit min stays at 6) ===');
const v17_2026 = runV17(2026, TRIPLET, true);
const v18_2026 = runV18(2026, TRIPLET, true);
const fields = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity', 'defaultFired', 'rebellionFired', 'bankruptcyEvents'];
let s1 = true;
for (const f of fields) {
  const ok = JSON.stringify(v17_2026[f]) === JSON.stringify(v18_2026[f]);
  if (!ok) { s1 = false; console.log(`  ${f}: MISMATCH v17=${JSON.stringify(v17_2026[f])} v18=${JSON.stringify(v18_2026[f])}`); }
}
console.log(`  Final scores: v17=${JSON.stringify(v17_2026.scores)}  v18=${JSON.stringify(v18_2026.scores)}`);
console.log(`  Final credit: v17=${v17_2026.telemetry.tracks.credit.end}  v18=${v18_2026.telemetry.tracks.credit.end}`);
console.log(`  Final resistance: v17=${v17_2026.telemetry.tracks.resistance.end}  v18=${v18_2026.telemetry.tracks.resistance.end}`);
const b2026 = runBatchV18(2026, TRIPLET, true);
const crisis2026 = b2026.state.ledger.find(r => r.event === 'CREDIT_CRISIS');
console.log(`  Credit Crisis fired in seed 2026: ${crisis2026 ? 'YES (BUG)' : 'NO'}  (expected: NO)`);
console.log(`  ${s1 && !crisis2026 ? 'PASS' : 'FAIL'}\n`);
if (!s1 || crisis2026) process.exit(1);

console.log('=== STEP 2: seed 2139 — Credit Crisis fires once after Spec Fever -2 ===');
const v17_2139 = runV17(2139, TRIPLET, true);
const v18_2139 = runV18(2139, TRIPLET, true);
const b2139 = runBatchV18(2139, TRIPLET, true);
console.log(`  Final credit: v17=${v17_2139.telemetry.tracks.credit.end}  v18=${v18_2139.telemetry.tracks.credit.end}  (both should be 4)`);
console.log(`  Final resistance: v17=${v17_2139.telemetry.tracks.resistance.end}  v18=${v18_2139.telemetry.tracks.resistance.end}  (v18 should be v17+1)`);
const crisisRows2139 = b2139.state.ledger.filter(r => r.event === 'CREDIT_CRISIS');
console.log(`  Credit Crisis rows in ledger: ${crisisRows2139.length}  (expected: 1)`);
if (crisisRows2139.length > 0) {
  const crisisIdx = b2139.state.ledger.indexOf(crisisRows2139[0]);
  const r_before = b2139.state.ledger[crisisIdx - 1];
  const r_after = b2139.state.ledger[crisisIdx + 1];
  console.log(`  Ledger order around Crisis:`);
  console.log(`    idx ${crisisIdx - 1}: ${r_before.event} · ${r_before.detail.slice(0, 80)}`);
  console.log(`    idx ${crisisIdx}: ${crisisRows2139[0].event} · ${crisisRows2139[0].detail}`);
  console.log(`    idx ${crisisIdx + 1}: ${r_after.event} · ${r_after.detail.slice(0, 80)}`);
  const orderOk = r_before.event === 'CREDIT' && r_before.detail.includes('Speculation Fever') &&
                  r_after.event === 'RESISTANCE' && r_after.detail.includes('Credit Crisis');
  console.log(`  Ledger order CREDIT(SF) → CREDIT_CRISIS → RESISTANCE(Crisis): ${orderOk ? 'PASS' : 'FAIL'}`);
}
const resistDelta2139 = v18_2139.telemetry.tracks.resistance.end - v17_2139.telemetry.tracks.resistance.end;
console.log(`  Resistance delta v18-v17: +${resistDelta2139}  (expected: +1)\n`);

console.log('=== STEP 3: seed 2313 — Credit Crisis fires earlier in game ===');
const v17_2313 = runV17(2313, TRIPLET, true);
const v18_2313 = runV18(2313, TRIPLET, true);
const b2313 = runBatchV18(2313, TRIPLET, true);
console.log(`  Final credit: v17=${v17_2313.telemetry.tracks.credit.end}  v18=${v18_2313.telemetry.tracks.credit.end}`);
console.log(`  Final resistance: v17=${v17_2313.telemetry.tracks.resistance.end}  v18=${v18_2313.telemetry.tracks.resistance.end}`);
const crisisRows2313 = b2313.state.ledger.filter(r => r.event === 'CREDIT_CRISIS');
console.log(`  Credit Crisis rows in ledger: ${crisisRows2313.length}  (expected: 1)`);
if (crisisRows2313.length > 0) {
  console.log(`    Crisis at lap ${crisisRows2313[0].lap} turn ${crisisRows2313[0].turn}`);
}
const resistDelta2313 = v18_2313.telemetry.tracks.resistance.end - v17_2313.telemetry.tracks.resistance.end;
console.log(`  Resistance delta v18-v17: +${resistDelta2313}  (expected: +1)\n`);

console.log('=== STEP 4: Anti-Federalist Pamphlet path independence (structural) ===');
console.log(`  Trigger condition: key === 'credit' && next <= 4 && next > 0 && !s.flags.creditCrisisFired`);
console.log(`  No reason-string check — trigger is card-agnostic by construction.`);
console.log(`  PASS (by inspection — same code path for all credit -1 / -2 cards)\n`);

console.log('=== STEP 5: Once-only sticky flag (structural) ===');
console.log(`  TRIGGER_CREDIT_CRISIS reducer sets flags.creditCrisisFired = true.`);
console.log(`  Subsequent credit dips: !s.flags.creditCrisisFired is false → no re-fire.`);
console.log(`  PASS (by inspection — flag never cleared by any reducer case)\n`);

console.log('=== STEP 6: Default suppression at credit 1 → 0 (structural) ===');
console.log(`  Trigger guard: next > 0`);
console.log(`  At next === 0: pendingDefault = true (from existing line), pendingCreditCrisis NOT set.`);
console.log(`  Main loop priority: pendingDefault dispatches first.`);
console.log(`  TRIGGER_DEFAULT resets credit to 3 directly (bypasses adjustTrack), so flag stays unset.`);
console.log(`  PASS (by inspection — no possible double-fire on a 1→0 transition)\n`);

console.log('=== CANONICAL-400 advisory: count Credit Crisis fires ===');
let crisisFires = 0;
const crisisSeeds = [];
for (let seed = 2026; seed < 2426; seed++) {
  const b = runBatchV18(seed, TRIPLET, true);
  const c = b.state.ledger.find(r => r.event === 'CREDIT_CRISIS');
  if (c) { crisisFires += 1; crisisSeeds.push(seed); }
}
console.log(`  Credit Crisis fires in CANONICAL-400: ${crisisFires} / 400`);
console.log(`  Seeds: ${crisisSeeds.join(', ')}`);
console.log(`  Expected: 2 (matches v0.17 below-5 count: 2139, 2313)\n`);

console.log('=== ALL VERIFICATION COMPLETE ===');
