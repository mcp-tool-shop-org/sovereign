/* v0.18 evidence sweep — Credit Crisis intermediate failure event at Public Credit ≤ 4.
 * Layered on v0.17 base. +1 Resistance to all when fired. Once-only per game.
 * Default at Credit 0 unchanged. NO recovery gates.
 */
import { runDiagnosisBatch, runBatchGame } from './sim-v0.18.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'E:/AI/sovereign/experiments/v0.18-failure-pressure-candidate/raw-data';
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

console.log('v0.18 EVIDENCE SWEEP — Credit Crisis intermediate failure event (Credit ≤ 4)\n');

let t0 = Date.now();
console.log('CANONICAL-400 (seeds 2026-2425)');
const c400 = runDiagnosisBatch(seedRange(2026, 400), TM_TRIPLET, true, 'CANONICAL-400');
c400.rulesetVersion = 'v0.18-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.18-canonical-400.json', c400);

t0 = Date.now();
console.log('CANONICAL-100-A');
const c100A = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-A');
c100A.rulesetVersion = 'v0.18-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.18-canonical-100-A.json', c100A);

t0 = Date.now();
console.log('CANONICAL-100-B');
const c100B = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-B');
c100B.rulesetVersion = 'v0.18-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.18-canonical-100-B.json', c100B);

t0 = Date.now();
console.log('MFG-MIRROR-100');
const mfg = runDiagnosisBatch(seedRange(2026, 100), MFG_MIRROR, true, 'MFG-MIRROR-100');
mfg.rulesetVersion = 'v0.18-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.18-mfg-mirror-100.json', mfg);

const detPass = JSON.stringify(c100A.games) === JSON.stringify(c100B.games);
console.log(`\nDETERMINISM A vs B: ${detPass ? 'PASS' : 'FAIL'}`);
if (!detPass) process.exit(1);

/* Headline + Credit Crisis analysis + pressure overlap */
const N = c400.games.length;
const wins = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
const margins = [];
let defaultFired = 0, rebellionFired = 0, bankruptcyEvents = 0;
let antiFedGames = 0, specFeverGames = 0, bankRunGames = 0;
let antiFedFires = 0, specFeverFires = 0, bankRunFires = 0;
let sfMinus1Fires = 0, sfMinus2Fires = 0;
let twoOfThreeGames = 0, threeOfThreeGames = 0;
const postFundingMinDist = {};
const resistMaxDist = {};
let resistMaxAtLeast8 = 0;
const capDist = {};
let route4Plus = 0;

/* Credit Crisis metrics — need ledger access, so re-run with runBatchGame */
let crisisFires = 0;
const crisisSeeds = [];
const crisisSourceDist = {};
const crisisLapDist = {};
let totalCrisisResistanceLift = 0;

for (const g of c400.games) {
  wins[g.winner.profile] = (wins[g.winner.profile] || 0) + 1;
  const sortedScores = [...g.scores].sort((a, b) => b - a);
  margins.push(sortedScores[0] - sortedScores[1]);
  if (g.defaultFired) defaultFired += 1;
  if (g.rebellionFired) rebellionFired += 1;
  bankruptcyEvents += g.bankruptcyEvents;

  const creditEvs = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
  const antiFedHere = creditEvs.filter(e => e.reason === 'Anti-Federalist Pamphlet');
  const specHere = creditEvs.filter(e => e.reason === 'Speculation Fever');
  const bankHere = creditEvs.filter(e => e.reason === 'Bank Run');
  antiFedFires += antiFedHere.length;
  specFeverFires += specHere.length;
  bankRunFires += bankHere.length;
  for (const sf of specHere) {
    if (sf.appliedDelta === -1) sfMinus1Fires += 1;
    else if (sf.appliedDelta === -2) sfMinus2Fires += 1;
  }
  if (antiFedHere.length > 0) antiFedGames += 1;
  if (specHere.length > 0) specFeverGames += 1;
  if (bankHere.length > 0) bankRunGames += 1;
  const trio = (antiFedHere.length > 0 ? 1 : 0) + (specHere.length > 0 ? 1 : 0) + (bankHere.length > 0 ? 1 : 0);
  if (trio === 2) twoOfThreeGames += 1;
  if (trio === 3) threeOfThreeGames += 1;

  const pfm = (() => {
    const idx = creditEvs.findIndex(e => e.reason === 'Funding Act passed');
    if (idx < 0) return g.telemetry.tracks.credit.min;
    return Math.min(...creditEvs.slice(idx).map(e => e.after));
  })();
  postFundingMinDist[pfm] = (postFundingMinDist[pfm] || 0) + 1;

  const rMax = g.telemetry.tracks.resistance.max;
  resistMaxDist[rMax] = (resistMaxDist[rMax] || 0) + 1;
  if (rMax >= 8) resistMaxAtLeast8 += 1;
  capDist[g.finalCapacity] = (capDist[g.finalCapacity] || 0) + 1;
  if (g.finalCapacity >= 4) route4Plus += 1;
}

/* Walk ledgers for Credit Crisis details */
console.log('\nWalking ledgers for Credit Crisis details...');
for (let seed = 2026; seed < 2426; seed++) {
  const b = runBatchGame(seed, TM_TRIPLET, true);
  const crisisRow = b.state.ledger.find(r => r.event === 'CREDIT_CRISIS');
  if (!crisisRow) continue;
  crisisFires += 1;
  crisisSeeds.push(seed);
  crisisLapDist[`L${crisisRow.lap}T${crisisRow.turn}`] = (crisisLapDist[`L${crisisRow.lap}T${crisisRow.turn}`] || 0) + 1;
  /* Find the source card: walk backwards from crisis to find the most recent CREDIT row */
  const crisisIdx = b.state.ledger.indexOf(crisisRow);
  for (let j = crisisIdx - 1; j >= 0; j--) {
    const r = b.state.ledger[j];
    if (r.event === 'CREDIT' && (r.detail.includes('→ 4') || r.detail.includes('→ 3') || r.detail.includes('→ 2') || r.detail.includes('→ 1'))) {
      const m = r.detail.match(/^(\w[\w ]*?) ·/);
      const src = m ? m[1] : 'unknown';
      crisisSourceDist[src] = (crisisSourceDist[src] || 0) + 1;
      break;
    }
  }
  /* +1 Resistance per Crisis fire */
  totalCrisisResistanceLift += 1;
}

margins.sort((a, b) => a - b);
const medMargin = margins[Math.floor(N / 2)];

console.log('\n=== HEADLINE (v0.18 CANONICAL-400) ===');
console.log(`  Treasury wins:        ${wins['treasury-finance']} / ${N}  (${(wins['treasury-finance']/N*100).toFixed(1)} %)`);
console.log(`  Merchant wins:        ${wins['merchant-infrastructure']} / ${N}  (${(wins['merchant-infrastructure']/N*100).toFixed(1)} %)`);
console.log(`  Manufacturer wins:    ${wins['manufacturer-industry']} / ${N}  (${(wins['manufacturer-industry']/N*100).toFixed(1)} %)`);
console.log(`  Median margin:        ${medMargin}`);
console.log(`\n  defaultFired:    ${defaultFired} / ${N}`);
console.log(`  rebellionFired:  ${rebellionFired} / ${N}`);
console.log(`  bankruptcyEvents: ${bankruptcyEvents}`);

console.log('\n=== CREDIT CRISIS (NEW failure event at Credit ≤ 4) ===');
console.log(`  Credit Crisis fires: ${crisisFires} / ${N}  (CD advisory: 5; CANONICAL: 2 expected)`);
console.log(`  Seeds: ${crisisSeeds.join(', ')}`);
console.log(`  Source-card distribution:`);
Object.entries(crisisSourceDist).sort((a, b) => b[1] - a[1]).forEach(([src, c]) => console.log(`    ${c} × ${src}`));
console.log(`  Timing by lap/turn:`);
Object.entries(crisisLapDist).sort().forEach(([lt, c]) => console.log(`    ${lt}: ${c}`));
console.log(`  Total Resistance lift from Credit Crisis: +${totalCrisisResistanceLift} (mean +${(totalCrisisResistanceLift/N).toFixed(4)} per game)`);

console.log('\n=== THREE CREDIT-DOWN SOURCES ===');
console.log(`  Anti-Fed Pamphlet fires:  ${antiFedGames} / ${N}  (total: ${antiFedFires})`);
console.log(`  Speculation Fever fires:  ${specFeverGames} / ${N}  (total: ${specFeverFires})`);
console.log(`    SF -1 (Credit ≥ 7):     ${sfMinus1Fires}`);
console.log(`    SF -2 (Credit ≤ 6):     ${sfMinus2Fires}`);
console.log(`  Bank Run fires:           ${bankRunGames} / ${N}  (total: ${bankRunFires})`);
console.log(`  2 of 3 in same game:      ${twoOfThreeGames} / ${N}`);
console.log(`  3 of 3 in same game:      ${threeOfThreeGames} / ${N}`);

console.log('\nPost-Funding Credit min distribution:');
const pfmKeys = Object.keys(postFundingMinDist).map(Number).sort((a, b) => a - b);
for (const k of pfmKeys) console.log(`  ${k}: ${postFundingMinDist[k]} games`);
const pfmAt5 = postFundingMinDist[5] || 0;
const pfmBelow5 = pfmKeys.filter(k => k < 5).reduce((a, k) => a + postFundingMinDist[k], 0);
console.log(`  → Post-Funding ≤ 5 (reach 5): ${pfmAt5}`);
console.log(`  → Post-Funding < 5 (below 5): ${pfmBelow5}  (matches Credit Crisis fire count: ${crisisFires === pfmBelow5 ? 'YES' : 'MISMATCH'})`);

console.log(`\n=== RESISTANCE (runaway watch — does +1 Crisis lift cause spillover?) ===`);
console.log(`  Resistance max ≥ 8:  ${resistMaxAtLeast8} / ${N}  (target: stays rare)`);
console.log('  Resistance max distribution:');
const resKeys = Object.keys(resistMaxDist).map(Number).sort((a, b) => a - b);
for (const k of resKeys) console.log(`    ${k}: ${resistMaxDist[k]} games`);

console.log(`\n=== CAPACITY ===`);
const capKeys = Object.keys(capDist).map(Number).sort((a, b) => a - b);
for (const k of capKeys) console.log(`  cap ${k}: ${capDist[k]} games`);
console.log(`  Route 4+ frequency: ${route4Plus} / ${N}  (${(route4Plus/N*100).toFixed(1)} %)`);
