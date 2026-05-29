/* Phase B — run telemetry-augmented replays.
 *
 *   CANONICAL-400      seeds 2026-2425, T/M/Mfg triplet, charterEnabled
 *   CANONICAL-100-A    seeds 2026-2125, same triplet (determinism check)
 *   CANONICAL-100-B    seeds 2026-2125, same triplet (determinism check)
 *   MFG-MIRROR-100     seeds 2026-2125, Mfg/Mfg/Mfg triplet
 *
 * Each output is written under release/balance-evidence/raw-data/
 * with the prefix `sovereign-diagnosis-` so the v0.10 baseline files
 * stay frozen and obviously distinct.
 */
import { runDiagnosisBatch } from './sim.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const OUT_DIR = 'E:/AI/sovereign/release/balance-evidence/raw-data';
mkdirSync(OUT_DIR, { recursive: true });

function write(name, payload) {
  const path = OUT_DIR + '/' + name;
  writeFileSync(path, JSON.stringify(payload));
  const size = (JSON.stringify(payload).length / 1024 / 1024).toFixed(2);
  console.log('  wrote ' + path + '  (' + size + ' MB, ' + payload.gameCount + ' games)');
}

function seedRange(start, count) {
  const s = [];
  for (let i = 0; i < count; i++) s.push(start + i);
  return s;
}

const TM_TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const MFG_MIRROR = ['manufacturer-industry', 'manufacturer-industry', 'manufacturer-industry'];

console.log('CANONICAL-400 (seeds 2026-2425, T/M/Mfg, charterEnabled)');
let t0 = Date.now();
const canonical400 = runDiagnosisBatch(seedRange(2026, 400), TM_TRIPLET, true, 'CANONICAL-400');
console.log('  ran in ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');
write('sovereign-diagnosis-canonical-400.json', canonical400);

console.log('CANONICAL-100-A (seeds 2026-2125, T/M/Mfg, charterEnabled)');
t0 = Date.now();
const canonicalA = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-A');
console.log('  ran in ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');
write('sovereign-diagnosis-canonical-100-A.json', canonicalA);

console.log('CANONICAL-100-B (seeds 2026-2125, T/M/Mfg, charterEnabled)');
t0 = Date.now();
const canonicalB = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-B');
console.log('  ran in ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');
write('sovereign-diagnosis-canonical-100-B.json', canonicalB);

console.log('MFG-MIRROR-100 (seeds 2026-2125, Mfg/Mfg/Mfg, charterEnabled)');
t0 = Date.now();
const mfgMirror = runDiagnosisBatch(seedRange(2026, 100), MFG_MIRROR, true, 'MFG-MIRROR-100');
console.log('  ran in ' + ((Date.now() - t0) / 1000).toFixed(1) + 's');
write('sovereign-diagnosis-mfg-mirror-100.json', mfgMirror);

/* Determinism check: A vs B must be byte-identical */
const sA = JSON.stringify(canonicalA.games);
const sB = JSON.stringify(canonicalB.games);
console.log('');
console.log('DETERMINISM A vs B: ' + (sA === sB ? 'PASS (byte-identical)' : 'FAIL'));
if (sA !== sB) {
  console.error('  A.length=' + sA.length + '  B.length=' + sB.length);
  process.exit(1);
}
console.log('');
console.log('Headline (CANONICAL-400):');
const defaultFiredCount = canonical400.games.filter(g => g.defaultFired).length;
const rebellionFiredCount = canonical400.games.filter(g => g.rebellionFired).length;
const bankruptcyAny = canonical400.games.filter(g => g.bankruptcyEvents > 0).length;
const bankruptcyTotal = canonical400.games.reduce((a, g) => a + g.bankruptcyEvents, 0);
console.log('  defaultFired games:   ' + defaultFiredCount + ' / 400');
console.log('  rebellionFired games: ' + rebellionFiredCount + ' / 400');
console.log('  bankruptcy events:    ' + bankruptcyTotal + ' total in ' + bankruptcyAny + ' games');
