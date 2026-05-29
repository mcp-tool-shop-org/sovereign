/* Verify the extracted Node sim produces identical results to the v0.10
 * canonical-400 batch run for seed 2026. If this matches, all 400 seeds
 * are also expected to match (the reducer is deterministic, the only
 * randomness is the per-seed RNG).
 */
import { runDiagnosisGame } from './sim.mjs';
import { readFileSync } from 'node:fs';

const canonical = JSON.parse(readFileSync('E:/AI/sovereign/release/balance-evidence/raw-data/sovereign-batch-v0.10-canonical-400.json', 'utf8'));
const expected = canonical.games.find(g => g.seed === 2026);
if (!expected) { console.error('FAIL: seed 2026 not found in canonical-400'); process.exit(1); }

const triplet = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const got = runDiagnosisGame(2026, triplet, true);

const checks = [
  ['lapsReached', expected.lapsReached, got.lapsReached],
  ['totalTurns', expected.totalTurns, got.totalTurns],
  ['finalCapacity', expected.finalCapacity, got.finalCapacity],
  ['defaultFired', expected.defaultFired, got.defaultFired],
  ['rebellionFired', expected.rebellionFired, got.rebellionFired],
  ['bankruptcyEvents', expected.bankruptcyEvents, got.bankruptcyEvents],
  ['winner.profile', expected.winner.profile, got.winner.profile],
  ['winner.slotIndex', expected.winner.slotIndex, got.winner.slotIndex],
  ['winner.influence', expected.winner.influence, got.winner.influence],
  ['scores[0]', expected.scores[0], got.scores[0]],
  ['scores[1]', expected.scores[1], got.scores[1]],
  ['scores[2]', expected.scores[2], got.scores[2]],
  ['startingCharter.granted', expected.startingCharter.granted, got.startingCharter.granted],
  ['startingCharter.recipientSlot', expected.startingCharter.recipientSlot, got.startingCharter.recipientSlot],
];

/* Per-player checks (subset that's present in both shapes) */
for (let i = 0; i < 3; i++) {
  checks.push(['players['+i+'].finalCash', expected.players[i].finalCash, got.players[i].finalCash]);
  checks.push(['players['+i+'].finalInfluence', expected.players[i].finalInfluence, got.players[i].finalInfluence]);
  checks.push(['players['+i+'].bankruptLaps', expected.players[i].bankruptLaps, got.players[i].bankruptLaps]);
  checks.push(['players['+i+'].routesOwned', expected.players[i].routesOwned, got.players[i].routesOwned]);
}

let pass = 0, fail = 0;
for (const [k, want, have] of checks) {
  const ok = JSON.stringify(want) === JSON.stringify(have);
  if (ok) { pass++; }
  else { fail++; console.error(`FAIL  ${k}  want=${JSON.stringify(want)}  got=${JSON.stringify(have)}`); }
}
console.log(`SEED 2026 BYTE-IDENTITY CHECK  pass=${pass}  fail=${fail}  (of ${checks.length})`);
if (fail > 0) process.exit(1);

console.log('\nTelemetry sample (seed 2026):');
console.log('  tracks.credit:     ', got.telemetry.tracks.credit);
console.log('  tracks.resistance: ', got.telemetry.tracks.resistance);
console.log('  tracks.capacity:   ', got.telemetry.tracks.capacity);
console.log('  pressureEvents count:', got.telemetry.pressureEvents.length);
console.log('  near-miss creditMin=' + got.telemetry.nearMiss.creditMin + ' resistanceMax=' + got.telemetry.nearMiss.resistanceMax);
console.log('  cashByPlayer min cash by slot:', got.telemetry.cashByPlayer.map(c => c.min));
