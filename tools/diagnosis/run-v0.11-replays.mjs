/* v0.11 evidence sweep:
 *   CANONICAL-400        seeds 2026-2425, T/M/Mfg, charterEnabled
 *   CANONICAL-100-A      seeds 2026-2125, same triplet (determinism check)
 *   CANONICAL-100-B      seeds 2026-2125, same triplet (determinism check)
 *   MFG-MIRROR-100       seeds 2026-2125, Mfg/Mfg/Mfg triplet
 *
 * Output JSONs written under experiments/v0.11-failure-pressure-candidate/raw-data/.
 */
import { runDiagnosisBatch } from './sim-v0.11.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/raw-data';
mkdirSync(OUT_DIR, { recursive: true });

function write(name, payload) {
  const path = OUT_DIR + '/' + name;
  writeFileSync(path, JSON.stringify(payload));
  const size = (JSON.stringify(payload).length / 1024 / 1024).toFixed(2);
  console.log(`  wrote ${path}  (${size} MB, ${payload.gameCount} games)`);
}

function seedRange(start, count) {
  const s = [];
  for (let i = 0; i < count; i++) s.push(start + i);
  return s;
}

const TM_TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const MFG_MIRROR = ['manufacturer-industry', 'manufacturer-industry', 'manufacturer-industry'];

console.log('v0.11 EVIDENCE SWEEP — Bank Run patch (Credit -1 + Capacity -1)');
console.log('');

console.log('CANONICAL-400 (seeds 2026-2425, T/M/Mfg, charterEnabled)');
let t0 = Date.now();
const c400 = runDiagnosisBatch(seedRange(2026, 400), TM_TRIPLET, true, 'CANONICAL-400');
c400.rulesetVersion = 'v0.11-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.11-canonical-400.json', c400);

console.log('CANONICAL-100-A (seeds 2026-2125, T/M/Mfg)');
t0 = Date.now();
const c100A = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-A');
c100A.rulesetVersion = 'v0.11-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.11-canonical-100-A.json', c100A);

console.log('CANONICAL-100-B (seeds 2026-2125, T/M/Mfg)');
t0 = Date.now();
const c100B = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-B');
c100B.rulesetVersion = 'v0.11-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.11-canonical-100-B.json', c100B);

console.log('MFG-MIRROR-100 (seeds 2026-2125, Mfg×3)');
t0 = Date.now();
const mfg = runDiagnosisBatch(seedRange(2026, 100), MFG_MIRROR, true, 'MFG-MIRROR-100');
mfg.rulesetVersion = 'v0.11-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.11-mfg-mirror-100.json', mfg);

/* Determinism check */
const sA = JSON.stringify(c100A.games);
const sB = JSON.stringify(c100B.games);
console.log('');
console.log(`DETERMINISM A vs B: ${sA === sB ? 'PASS (byte-identical)' : 'FAIL'}`);
if (sA !== sB) {
  console.error(`  A.length=${sA.length}  B.length=${sB.length}`);
  process.exit(1);
}

/* Headline summary */
console.log('');
console.log('=== HEADLINE (CANONICAL-400) ===');
const wins = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
const bankRunFires = [];
const bankRunGames = new Set();
let defaultFired = 0, rebellionFired = 0, bankruptcyEvents = 0;
let creditMinAtMost5 = 0, creditMinAtMost4 = 0, creditMinAtMost3 = 0, creditMinAtMost2 = 0, creditMinAtMost1 = 0, creditMinAtMost0 = 0;
let creditEndDist = {};
for (let v = 0; v <= 12; v++) creditEndDist[v] = 0;

for (const g of c400.games) {
  wins[g.winner.profile] += 1;
  if (g.defaultFired) defaultFired += 1;
  if (g.rebellionFired) rebellionFired += 1;
  bankruptcyEvents += g.bankruptcyEvents;
  for (const ev of g.telemetry.pressureEvents) {
    if (ev.reason === 'Bank Run') {
      bankRunFires.push({ seed: g.seed, lap: ev.lap, track: ev.track });
      bankRunGames.add(g.seed);
    }
  }
  const cm = g.telemetry.tracks.credit.min;
  const ce = g.telemetry.tracks.credit.end;
  if (cm <= 5) creditMinAtMost5 += 1;
  if (cm <= 4) creditMinAtMost4 += 1;
  if (cm <= 3) creditMinAtMost3 += 1;
  if (cm <= 2) creditMinAtMost2 += 1;
  if (cm <= 1) creditMinAtMost1 += 1;
  if (cm <= 0) creditMinAtMost0 += 1;
  creditEndDist[ce] = (creditEndDist[ce] || 0) + 1;
}
const N = c400.games.length;
console.log(`  Treasury wins:        ${wins['treasury-finance']} / ${N}  (${(wins['treasury-finance']/N*100).toFixed(1)} %)`);
console.log(`  Merchant wins:        ${wins['merchant-infrastructure']} / ${N}  (${(wins['merchant-infrastructure']/N*100).toFixed(1)} %)`);
console.log(`  Manufacturer wins:    ${wins['manufacturer-industry']} / ${N}  (${(wins['manufacturer-industry']/N*100).toFixed(1)} %)`);
console.log('');
console.log(`  Bank Run fires:       ${bankRunFires.length} total (each Bank Run = 2 events; ${bankRunFires.length/2} card resolutions)`);
console.log(`  Bank Run games:       ${bankRunGames.size} / ${N}  (${(bankRunGames.size/N*100).toFixed(1)} %)`);
console.log('');
console.log(`  defaultFired:         ${defaultFired} / ${N}  (${(defaultFired/N*100).toFixed(1)} %)`);
console.log(`  rebellionFired:       ${rebellionFired} / ${N}`);
console.log(`  bankruptcyEvents:     ${bankruptcyEvents}`);
console.log('');
console.log(`  Credit min ≤ 5:       ${creditMinAtMost5} / ${N}  (${(creditMinAtMost5/N*100).toFixed(1)} %)`);
console.log(`  Credit min ≤ 4:       ${creditMinAtMost4} / ${N}  (${(creditMinAtMost4/N*100).toFixed(1)} %)`);
console.log(`  Credit min ≤ 3:       ${creditMinAtMost3} / ${N}  (${(creditMinAtMost3/N*100).toFixed(1)} %)`);
console.log(`  Credit min ≤ 2:       ${creditMinAtMost2} / ${N}  (${(creditMinAtMost2/N*100).toFixed(1)} %)`);
console.log(`  Credit min ≤ 1:       ${creditMinAtMost1} / ${N}  (${(creditMinAtMost1/N*100).toFixed(1)} %)`);
console.log(`  Credit min  = 0:      ${creditMinAtMost0} / ${N}  (${(creditMinAtMost0/N*100).toFixed(1)} %)`);
console.log('');
console.log(`  Credit end distribution (game count by end value):`);
for (let v = 0; v <= 12; v++) if (creditEndDist[v] > 0) console.log(`    ${v}: ${creditEndDist[v]}`);
