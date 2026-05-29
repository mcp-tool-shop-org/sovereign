/* v0.15 evidence sweep — Gold and Silver Inflow gated on Credit ≥ 6
 * (layered on top of v0.14 Credit Restored gate; Bank Run v0.11 +
 *  Speculation Fever v0.13 pressure layers preserved).
 */
import { runDiagnosisBatch } from './sim-v0.15.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'E:/AI/sovereign/experiments/v0.15-failure-pressure-candidate/raw-data';
mkdirSync(OUT_DIR, { recursive: true });

function write(name, payload) {
  const path = OUT_DIR + '/' + name;
  writeFileSync(path, JSON.stringify(payload));
  const size = (JSON.stringify(payload).length / 1024 / 1024).toFixed(2);
  console.log(`  wrote ${path}  (${size} MB, ${payload.gameCount} games)`);
}
function seedRange(start, count) { const s = []; for (let i = 0; i < count; i++) s.push(start + i); return s; }

const TM_TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const MFG_MIRROR = ['manufacturer-industry', 'manufacturer-industry', 'manufacturer-industry'];

console.log('v0.15 EVIDENCE SWEEP — Gold and Silver Inflow gated on Credit ≥ 6 (layered)\n');

let t0 = Date.now();
console.log('CANONICAL-400 (seeds 2026-2425)');
const c400 = runDiagnosisBatch(seedRange(2026, 400), TM_TRIPLET, true, 'CANONICAL-400');
c400.rulesetVersion = 'v0.15-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.15-canonical-400.json', c400);

t0 = Date.now();
console.log('CANONICAL-100-A');
const c100A = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-A');
c100A.rulesetVersion = 'v0.15-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.15-canonical-100-A.json', c100A);

t0 = Date.now();
console.log('CANONICAL-100-B');
const c100B = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-B');
c100B.rulesetVersion = 'v0.15-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.15-canonical-100-B.json', c100B);

t0 = Date.now();
console.log('MFG-MIRROR-100');
const mfg = runDiagnosisBatch(seedRange(2026, 100), MFG_MIRROR, true, 'MFG-MIRROR-100');
mfg.rulesetVersion = 'v0.15-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.15-mfg-mirror-100.json', mfg);

const detPass = JSON.stringify(c100A.games) === JSON.stringify(c100B.games);
console.log(`\nDETERMINISM A vs B: ${detPass ? 'PASS' : 'FAIL'}`);
if (!detPass) process.exit(1);

/* Headline + recovery + GSI-gate analysis */
const N = c400.games.length;
const wins = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
const margins = [];
let defaultFired = 0, rebellionFired = 0, bankruptcyEvents = 0;
let specFeverGames = 0, bankRunGames = 0, bothGames = 0;
let gsiUngatedFires = 0;  /* +1 fires landed in pressureEvents */
let crUngatedFires = 0;
let creditEverAt5 = 0, creditEverAt4 = 0, creditEverAt3 = 0, creditEverAt2 = 0;
const postFundingMinDist = {};
let dipTo6 = 0, recoveredFrom6 = 0;
let dipTo5OrBelow = 0, recoveredFrom5 = 0;
const recoverySrc = {};
let resistMaxAtLeast8 = 0;
const capDist = {};
let route4Plus = 0;

function postFundingCreditMin(g) {
  const ev = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
  const idx = ev.findIndex(e => e.reason === 'Funding Act passed');
  if (idx < 0) return g.telemetry.tracks.credit.min;
  return Math.min(...ev.slice(idx).map(e => e.after));
}

for (const g of c400.games) {
  wins[g.winner.profile] = (wins[g.winner.profile] || 0) + 1;
  /* Winning margin = winner score - second-highest score */
  const sortedScores = [...g.scores].sort((a, b) => b - a);
  margins.push(sortedScores[0] - sortedScores[1]);

  if (g.defaultFired) defaultFired += 1;
  if (g.rebellionFired) rebellionFired += 1;
  bankruptcyEvents += g.bankruptcyEvents;

  const creditEvs = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
  const specFires = creditEvs.filter(e => e.reason === 'Speculation Fever');
  const bankFires = creditEvs.filter(e => e.reason === 'Bank Run');
  const gsiFires = creditEvs.filter(e => e.reason === 'Gold and Silver Inflow');
  const crFires = creditEvs.filter(e => e.reason === 'Credit Restored');
  if (specFires.length > 0) specFeverGames += 1;
  if (bankFires.length > 0) bankRunGames += 1;
  if (specFires.length > 0 && bankFires.length > 0) bothGames += 1;
  gsiUngatedFires += gsiFires.length;
  crUngatedFires += crFires.length;

  const cmin = g.telemetry.tracks.credit.min;
  if (cmin <= 5) creditEverAt5 += 1;
  if (cmin <= 4) creditEverAt4 += 1;
  if (cmin <= 3) creditEverAt3 += 1;
  if (cmin <= 2) creditEverAt2 += 1;
  const pfm = postFundingCreditMin(g);
  postFundingMinDist[pfm] = (postFundingMinDist[pfm] || 0) + 1;

  /* Recovery analysis */
  let firstSixIdx = -1, firstFiveOrBelowIdx = -1;
  for (let i = 0; i < creditEvs.length; i++) {
    if (firstSixIdx < 0 && creditEvs[i].after === 6) firstSixIdx = i;
    if (firstFiveOrBelowIdx < 0 && creditEvs[i].after <= 5 && i > 0) firstFiveOrBelowIdx = i;
  }
  if (firstSixIdx >= 0) {
    dipTo6 += 1;
    let recovered = false;
    for (let j = firstSixIdx + 1; j < creditEvs.length; j++) {
      if (creditEvs[j].after >= 7) {
        recovered = true;
        if (creditEvs[j].appliedDelta > 0) recoverySrc[creditEvs[j].reason] = (recoverySrc[creditEvs[j].reason] || 0) + 1;
        break;
      }
    }
    if (recovered) recoveredFrom6 += 1;
  }
  if (firstFiveOrBelowIdx >= 0) {
    dipTo5OrBelow += 1;
    let recovered = false;
    for (let j = firstFiveOrBelowIdx + 1; j < creditEvs.length; j++) {
      if (creditEvs[j].after >= 7) { recovered = true; break; }
    }
    if (recovered) recoveredFrom5 += 1;
  }

  if (g.telemetry.tracks.resistance.max >= 8) resistMaxAtLeast8 += 1;
  capDist[g.finalCapacity] = (capDist[g.finalCapacity] || 0) + 1;
  if (g.finalCapacity >= 4) route4Plus += 1;
}

margins.sort((a, b) => a - b);
const medMargin = margins[Math.floor(N / 2)];

console.log('\n=== HEADLINE (v0.15 CANONICAL-400) ===');
console.log(`  Treasury wins:        ${wins['treasury-finance']} / ${N}  (${(wins['treasury-finance']/N*100).toFixed(1)} %)`);
console.log(`  Merchant wins:        ${wins['merchant-infrastructure']} / ${N}  (${(wins['merchant-infrastructure']/N*100).toFixed(1)} %)`);
console.log(`  Manufacturer wins:    ${wins['manufacturer-industry']} / ${N}  (${(wins['manufacturer-industry']/N*100).toFixed(1)} %)`);
console.log(`  Median margin:        ${medMargin}`);
console.log(`\n  defaultFired:    ${defaultFired} / ${N}`);
console.log(`  rebellionFired:  ${rebellionFired} / ${N}`);
console.log(`  bankruptcyEvents: ${bankruptcyEvents}`);

console.log(`\n  Speculation Fever fires:  ${specFeverGames} / ${N}`);
console.log(`  Bank Run fires:           ${bankRunGames} / ${N}`);
console.log(`  Both fired same game:     ${bothGames} / ${N}`);
console.log(`  Gold/Silver ungated (+1): ${gsiUngatedFires}`);
console.log(`  Credit Restored ungated:  ${crUngatedFires}`);

console.log('\nPost-Funding Credit min distribution:');
const pfmKeys = Object.keys(postFundingMinDist).map(Number).sort((a, b) => a - b);
for (const k of pfmKeys) console.log(`  ${k}: ${postFundingMinDist[k]} games`);
const pfmAt5 = postFundingMinDist[5] || 0;
const pfmBelow5 = pfmKeys.filter(k => k < 5).reduce((a, k) => a + postFundingMinDist[k], 0);
console.log(`  → Post-Funding ≤ 5 (reach 5): ${pfmAt5}  (v0.13: 3, v0.14: 3)`);
console.log(`  → Post-Funding < 5 (below 5): ${pfmBelow5}  (v0.13: 0, v0.14: 0)`);

console.log('\n=== RECOVERY ANALYSIS ===');
console.log(`  Games where Credit dipped to 6: ${dipTo6}`);
console.log(`    Recovered to 7+: ${recoveredFrom6}`);
console.log(`    Did NOT recover: ${dipTo6 - recoveredFrom6}`);
console.log(`    Recovery rate: ${(recoveredFrom6/dipTo6*100).toFixed(1)} %  (v0.13: 34 %; v0.14: 32.5 %; ideal target < 25 %; stretch < 20 %)`);
console.log(`  Games where Credit dipped to ≤ 5: ${dipTo5OrBelow}`);
console.log(`    Recovered to 7+: ${recoveredFrom5}`);
console.log(`    Did NOT recover: ${dipTo5OrBelow - recoveredFrom5}`);

console.log(`\nTop recovery sources after 6-dip:`);
Object.entries(recoverySrc).sort((a, b) => b[1] - a[1]).forEach(([src, c]) => console.log(`  ${c} × ${src}`));

console.log(`\n=== RESISTANCE ===`);
console.log(`  Resistance max ≥ 8:  ${resistMaxAtLeast8} / ${N}`);

console.log(`\n=== CAPACITY ===`);
const capKeys = Object.keys(capDist).map(Number).sort((a, b) => a - b);
for (const k of capKeys) console.log(`  cap ${k}: ${capDist[k]} games`);
console.log(`  Route 4+ frequency: ${route4Plus} / ${N}  (${(route4Plus/N*100).toFixed(1)} %)`);
