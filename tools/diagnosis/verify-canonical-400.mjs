/* Run all 400 canonical seeds through the Node sim and verify byte-identity
 * against canonical-400.json on every field present in the canonical record.
 */
import { runDiagnosisGame } from './sim.mjs';
import { readFileSync } from 'node:fs';

const canonical = JSON.parse(readFileSync('E:/AI/sovereign/release/balance-evidence/raw-data/sovereign-batch-v0.10-canonical-400.json', 'utf8'));
const triplet = canonical.profileTriplet;
const charterEnabled = canonical.charterEnabled;
const fieldsToCheck = [
  'seed', 'lapsReached', 'totalTurns', 'finalCapacity',
  'defaultFired', 'rebellionFired', 'bankruptcyEvents',
];
const winnerFields = ['profile', 'slotIndex', 'influence'];
const playerFields = ['slot', 'profile', 'finalCash', 'finalInfluence', 'routesOwned'];

let pass = 0, fail = 0;
const failures = [];

const t0 = Date.now();
for (const expected of canonical.games) {
  const got = runDiagnosisGame(expected.seed, triplet, charterEnabled);
  let ok = true;
  for (const f of fieldsToCheck) {
    if (JSON.stringify(got[f]) !== JSON.stringify(expected[f])) {
      failures.push({ seed: expected.seed, field: f, want: expected[f], have: got[f] });
      ok = false;
    }
  }
  for (const f of winnerFields) {
    if (JSON.stringify(got.winner[f]) !== JSON.stringify(expected.winner[f])) {
      failures.push({ seed: expected.seed, field: 'winner.'+f, want: expected.winner[f], have: got.winner[f] });
      ok = false;
    }
  }
  for (let i = 0; i < 3; i++) {
    for (const f of playerFields) {
      if (JSON.stringify(got.players[i][f]) !== JSON.stringify(expected.players[i][f])) {
        failures.push({ seed: expected.seed, field: 'players['+i+'].'+f, want: expected.players[i][f], have: got.players[i][f] });
        ok = false;
      }
    }
  }
  for (let i = 0; i < 3; i++) {
    if (JSON.stringify(got.scores[i]) !== JSON.stringify(expected.scores[i])) {
      failures.push({ seed: expected.seed, field: 'scores['+i+']', want: expected.scores[i], have: got.scores[i] });
      ok = false;
    }
  }
  if (ok) pass++; else fail++;
}
const t1 = Date.now();

console.log(`CANONICAL-400 DETERMINISM CHECK  pass=${pass}  fail=${fail}  / ${canonical.games.length}`);
console.log(`Elapsed: ${((t1 - t0) / 1000).toFixed(1)}s`);
if (failures.length > 0) {
  console.error('\nFirst 10 failures:');
  failures.slice(0, 10).forEach(f => console.error(`  seed=${f.seed}  ${f.field}  want=${JSON.stringify(f.want)}  got=${JSON.stringify(f.have)}`));
  process.exit(1);
}
console.log('All 400 games byte-identical to v0.10 canonical-400 baseline. Sim is verified.');
