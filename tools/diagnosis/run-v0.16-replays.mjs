/* v0.16 evidence sweep — Anti-Federalist Pamphlet adds Public Credit -1.
 * Third independent Credit-down source layered on v0.13 base.
 * Bank Run v0.11 + Speculation Fever v0.13 pressure preserved.
 * NO recovery gates (Credit Restored and Gold/Silver Inflow unchanged from v0.13).
 */
import { runDiagnosisBatch } from './sim-v0.16.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'E:/AI/sovereign/experiments/v0.16-failure-pressure-candidate/raw-data';
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

console.log('v0.16 EVIDENCE SWEEP — Anti-Federalist Pamphlet adds Public Credit -1\n');

let t0 = Date.now();
console.log('CANONICAL-400 (seeds 2026-2425)');
const c400 = runDiagnosisBatch(seedRange(2026, 400), TM_TRIPLET, true, 'CANONICAL-400');
c400.rulesetVersion = 'v0.16-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.16-canonical-400.json', c400);

t0 = Date.now();
console.log('CANONICAL-100-A');
const c100A = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-A');
c100A.rulesetVersion = 'v0.16-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.16-canonical-100-A.json', c100A);

t0 = Date.now();
console.log('CANONICAL-100-B');
const c100B = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-B');
c100B.rulesetVersion = 'v0.16-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.16-canonical-100-B.json', c100B);

t0 = Date.now();
console.log('MFG-MIRROR-100');
const mfg = runDiagnosisBatch(seedRange(2026, 100), MFG_MIRROR, true, 'MFG-MIRROR-100');
mfg.rulesetVersion = 'v0.16-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.16-mfg-mirror-100.json', mfg);

const detPass = JSON.stringify(c100A.games) === JSON.stringify(c100B.games);
console.log(`\nDETERMINISM A vs B: ${detPass ? 'PASS' : 'FAIL'}`);
if (!detPass) process.exit(1);

/* Headline + pressure-overlap + recovery analysis */
const N = c400.games.length;
const wins = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
const margins = [];
let defaultFired = 0, rebellionFired = 0, bankruptcyEvents = 0;
let antiFedGames = 0, specFeverGames = 0, bankRunGames = 0;
let twoOfThreeGames = 0, threeOfThreeGames = 0;
let antiFedFires = 0, specFeverFires = 0, bankRunFires = 0;
let creditEverAt5 = 0, creditEverAt4 = 0, creditEverAt3 = 0, creditEverAt2 = 0;
const postFundingMinDist = {};
let dipTo6 = 0, recoveredFrom6 = 0;
let dipTo5OrBelow = 0, recoveredFrom5 = 0;
const recoverySrc = {};
const resistMaxDist = {};
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
  const sortedScores = [...g.scores].sort((a, b) => b - a);
  margins.push(sortedScores[0] - sortedScores[1]);

  if (g.defaultFired) defaultFired += 1;
  if (g.rebellionFired) rebellionFired += 1;
  bankruptcyEvents += g.bankruptcyEvents;

  const creditEvs = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
  const antiFedFiresHere = creditEvs.filter(e => e.reason === 'Anti-Federalist Pamphlet');
  const specFiresHere = creditEvs.filter(e => e.reason === 'Speculation Fever');
  const bankFiresHere = creditEvs.filter(e => e.reason === 'Bank Run');
  antiFedFires += antiFedFiresHere.length;
  specFeverFires += specFiresHere.length;
  bankRunFires += bankFiresHere.length;
  const hasAF = antiFedFiresHere.length > 0;
  const hasSF = specFiresHere.length > 0;
  const hasBR = bankFiresHere.length > 0;
  if (hasAF) antiFedGames += 1;
  if (hasSF) specFeverGames += 1;
  if (hasBR) bankRunGames += 1;
  const trio = (hasAF ? 1 : 0) + (hasSF ? 1 : 0) + (hasBR ? 1 : 0);
  if (trio === 2) twoOfThreeGames += 1;
  if (trio === 3) threeOfThreeGames += 1;

  const cmin = g.telemetry.tracks.credit.min;
  if (cmin <= 5) creditEverAt5 += 1;
  if (cmin <= 4) creditEverAt4 += 1;
  if (cmin <= 3) creditEverAt3 += 1;
  if (cmin <= 2) creditEverAt2 += 1;
  const pfm = postFundingCreditMin(g);
  postFundingMinDist[pfm] = (postFundingMinDist[pfm] || 0) + 1;

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

  const rMax = g.telemetry.tracks.resistance.max;
  resistMaxDist[rMax] = (resistMaxDist[rMax] || 0) + 1;
  if (rMax >= 8) resistMaxAtLeast8 += 1;
  capDist[g.finalCapacity] = (capDist[g.finalCapacity] || 0) + 1;
  if (g.finalCapacity >= 4) route4Plus += 1;
}

margins.sort((a, b) => a - b);
const medMargin = margins[Math.floor(N / 2)];

console.log('\n=== HEADLINE (v0.16 CANONICAL-400) ===');
console.log(`  Treasury wins:        ${wins['treasury-finance']} / ${N}  (${(wins['treasury-finance']/N*100).toFixed(1)} %)`);
console.log(`  Merchant wins:        ${wins['merchant-infrastructure']} / ${N}  (${(wins['merchant-infrastructure']/N*100).toFixed(1)} %)`);
console.log(`  Manufacturer wins:    ${wins['manufacturer-industry']} / ${N}  (${(wins['manufacturer-industry']/N*100).toFixed(1)} %)`);
console.log(`  Median margin:        ${medMargin}`);
console.log(`\n  defaultFired:    ${defaultFired} / ${N}`);
console.log(`  rebellionFired:  ${rebellionFired} / ${N}`);
console.log(`  bankruptcyEvents: ${bankruptcyEvents}`);

console.log('\n=== THREE CREDIT-DOWN SOURCES ===');
console.log(`  Anti-Fed Pamphlet fires:  ${antiFedGames} / ${N}  (total fires: ${antiFedFires})`);
console.log(`  Speculation Fever fires:  ${specFeverGames} / ${N}  (total fires: ${specFeverFires})`);
console.log(`  Bank Run fires:           ${bankRunGames} / ${N}  (total fires: ${bankRunFires})`);
console.log(`  2 of 3 in same game:      ${twoOfThreeGames} / ${N}`);
console.log(`  3 of 3 in same game:      ${threeOfThreeGames} / ${N}`);

console.log('\nPost-Funding Credit min distribution:');
const pfmKeys = Object.keys(postFundingMinDist).map(Number).sort((a, b) => a - b);
for (const k of pfmKeys) console.log(`  ${k}: ${postFundingMinDist[k]} games`);
const pfmAt5 = postFundingMinDist[5] || 0;
const pfmBelow5 = pfmKeys.filter(k => k < 5).reduce((a, k) => a + postFundingMinDist[k], 0);
console.log(`  → Post-Funding ≤ 5 (reach 5): ${pfmAt5}  (v0.13: 3; target > 3)`);
console.log(`  → Post-Funding < 5 (below 5): ${pfmBelow5}  (v0.13: 0; stretch > 0)`);

console.log('\n=== RECOVERY ANALYSIS ===');
console.log(`  Games where Credit dipped to 6: ${dipTo6}`);
console.log(`    Recovered to 7+: ${recoveredFrom6}`);
console.log(`    Did NOT recover: ${dipTo6 - recoveredFrom6}`);
console.log(`    Recovery rate: ${(recoveredFrom6/dipTo6*100).toFixed(1)} %  (v0.13: 34 %)`);
console.log(`  Games where Credit dipped to ≤ 5: ${dipTo5OrBelow}`);
console.log(`    Recovered to 7+: ${recoveredFrom5}`);
console.log(`    Did NOT recover: ${dipTo5OrBelow - recoveredFrom5}`);

console.log(`\nTop recovery sources after 6-dip:`);
Object.entries(recoverySrc).sort((a, b) => b[1] - a[1]).forEach(([src, c]) => console.log(`  ${c} × ${src}`));

console.log(`\n=== RESISTANCE (runaway watch) ===`);
console.log(`  Resistance max ≥ 8:  ${resistMaxAtLeast8} / ${N}  (target: stays rare)`);
console.log('  Resistance max distribution:');
const resKeys = Object.keys(resistMaxDist).map(Number).sort((a, b) => a - b);
for (const k of resKeys) console.log(`    ${k}: ${resistMaxDist[k]} games`);

console.log(`\n=== CAPACITY ===`);
const capKeys = Object.keys(capDist).map(Number).sort((a, b) => a - b);
for (const k of capKeys) console.log(`  cap ${k}: ${capDist[k]} games`);
console.log(`  Route 4+ frequency: ${route4Plus} / ${N}  (${(route4Plus/N*100).toFixed(1)} %)`);
