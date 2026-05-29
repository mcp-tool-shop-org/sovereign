/* v0.13 evidence sweep — Speculation Fever now pushes Credit -1. */
import { runDiagnosisBatch } from './sim-v0.13.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'E:/AI/sovereign/experiments/v0.13-failure-pressure-candidate/raw-data';
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

console.log('v0.13 EVIDENCE SWEEP — Speculation Fever Credit -1\n');

let t0 = Date.now();
console.log('CANONICAL-400 (seeds 2026-2425)');
const c400 = runDiagnosisBatch(seedRange(2026, 400), TM_TRIPLET, true, 'CANONICAL-400');
c400.rulesetVersion = 'v0.13-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.13-canonical-400.json', c400);

t0 = Date.now();
console.log('CANONICAL-100-A');
const c100A = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-A');
c100A.rulesetVersion = 'v0.13-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.13-canonical-100-A.json', c100A);

t0 = Date.now();
console.log('CANONICAL-100-B');
const c100B = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-B');
c100B.rulesetVersion = 'v0.13-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.13-canonical-100-B.json', c100B);

t0 = Date.now();
console.log('MFG-MIRROR-100');
const mfg = runDiagnosisBatch(seedRange(2026, 100), MFG_MIRROR, true, 'MFG-MIRROR-100');
mfg.rulesetVersion = 'v0.13-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.13-mfg-mirror-100.json', mfg);

const detPass = JSON.stringify(c100A.games) === JSON.stringify(c100B.games);
console.log(`\nDETERMINISM A vs B: ${detPass ? 'PASS' : 'FAIL'}`);
if (!detPass) process.exit(1);

/* --- Headline + recovery analysis --- */
const N = c400.games.length;
const wins = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
let defaultFired = 0, rebellionFired = 0, bankruptcyEvents = 0;
let specFeverGames = 0, bankRunGames = 0, bothFiredGames = 0;
let specFirstThenBankRun = 0, bankRunFirstThenSpec = 0, onlyOneFired = 0;
let creditEverAt5 = 0, creditEverAt4 = 0, creditEverAt3 = 0, creditEverAt2 = 0;
let postFundingMinDist = {};
let recoveredFrom6 = 0, recoveredFrom5 = 0;
const recoverySourceHisto = {};
let resistMaxAtLeast8 = 0, resistMaxAtLeast10 = 0;

function postFundingCreditMin(g) {
  const ev = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
  const idx = ev.findIndex(e => e.reason === 'Funding Act passed');
  if (idx < 0) return g.telemetry.tracks.credit.min;
  return Math.min(...ev.slice(idx).map(e => e.after));
}

for (const g of c400.games) {
  wins[g.winner.profile] += 1;
  if (g.defaultFired) defaultFired += 1;
  if (g.rebellionFired) rebellionFired += 1;
  bankruptcyEvents += g.bankruptcyEvents;
  const creditEvs = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
  const specFires = creditEvs.filter(e => e.reason === 'Speculation Fever');
  const bankFires = creditEvs.filter(e => e.reason === 'Bank Run');
  if (specFires.length > 0) specFeverGames += 1;
  if (bankFires.length > 0) bankRunGames += 1;
  if (specFires.length > 0 && bankFires.length > 0) {
    bothFiredGames += 1;
    const firstSpec = specFires[0];
    const firstBank = bankFires[0];
    if (firstSpec.lap < firstBank.lap || (firstSpec.lap === firstBank.lap && firstSpec.turn < firstBank.turn)) specFirstThenBankRun += 1;
    else bankRunFirstThenSpec += 1;
  } else if (specFires.length > 0 || bankFires.length > 0) onlyOneFired += 1;
  const cmin = g.telemetry.tracks.credit.min;
  if (cmin <= 5) creditEverAt5 += 1;
  if (cmin <= 4) creditEverAt4 += 1;
  if (cmin <= 3) creditEverAt3 += 1;
  if (cmin <= 2) creditEverAt2 += 1;
  const pfm = postFundingCreditMin(g);
  postFundingMinDist[pfm] = (postFundingMinDist[pfm] || 0) + 1;
  /* Recovery: did credit hit 6 (or 5) and later recover to 7+? */
  let hitAt6 = false, hitAt5 = false;
  let recoverySourcesThisGame = new Set();
  for (let i = 0; i < creditEvs.length; i++) {
    const ev = creditEvs[i];
    if (ev.after === 6) hitAt6 = true;
    if (ev.after <= 5) hitAt5 = true;
    /* check if any later event raises to 7+ */
    if (hitAt6 && !hitAt5) {
      for (let j = i + 1; j < creditEvs.length; j++) {
        if (creditEvs[j].after >= 7 && creditEvs[j].appliedDelta > 0) {
          recoverySourcesThisGame.add(creditEvs[j].reason);
        }
      }
    }
  }
  let recovered6 = false, recovered5 = false;
  if (hitAt6) {
    for (let i = 0; i < creditEvs.length; i++) {
      if (creditEvs[i].after === 6) {
        for (let j = i + 1; j < creditEvs.length; j++) {
          if (creditEvs[j].after >= 7) { recovered6 = true; break; }
        }
        if (recovered6) break;
      }
    }
  }
  if (hitAt5) {
    for (let i = 0; i < creditEvs.length; i++) {
      if (creditEvs[i].after <= 5) {
        for (let j = i + 1; j < creditEvs.length; j++) {
          if (creditEvs[j].after >= 7) { recovered5 = true; break; }
        }
        if (recovered5) break;
      }
    }
  }
  if (recovered6) recoveredFrom6 += 1;
  if (recovered5) recoveredFrom5 += 1;
  for (const src of recoverySourcesThisGame) recoverySourceHisto[src] = (recoverySourceHisto[src] || 0) + 1;
  const rmax = g.telemetry.tracks.resistance.max;
  if (rmax >= 8) resistMaxAtLeast8 += 1;
  if (rmax >= 10) resistMaxAtLeast10 += 1;
}

console.log('\n=== HEADLINE (v0.13 CANONICAL-400) ===');
console.log(`  Treasury wins:        ${wins['treasury-finance']} / ${N}  (${(wins['treasury-finance']/N*100).toFixed(1)} %)`);
console.log(`  Merchant wins:        ${wins['merchant-infrastructure']} / ${N}  (${(wins['merchant-infrastructure']/N*100).toFixed(1)} %)`);
console.log(`  Manufacturer wins:    ${wins['manufacturer-industry']} / ${N}  (${(wins['manufacturer-industry']/N*100).toFixed(1)} %)`);
console.log(`\n  defaultFired:    ${defaultFired} / ${N}`);
console.log(`  rebellionFired:  ${rebellionFired} / ${N}`);
console.log(`  bankruptcyEvents: ${bankruptcyEvents}`);

console.log(`\n  Speculation Fever fires: ${specFeverGames} / ${N}  (${(specFeverGames/N*100).toFixed(1)} %)`);
console.log(`  Bank Run fires:         ${bankRunGames} / ${N}  (${(bankRunGames/N*100).toFixed(1)} %)`);
console.log(`  Both fired same game:   ${bothFiredGames} / ${N}  (${(bothFiredGames/N*100).toFixed(1)} %)`);
console.log(`    Spec Fever first:     ${specFirstThenBankRun}`);
console.log(`    Bank Run first:       ${bankRunFirstThenSpec}`);

console.log('\n=== CREDIT PRESSURE ===');
console.log(`  Credit min ≤ 5:    ${creditEverAt5} / ${N}  (${(creditEverAt5/N*100).toFixed(1)} %)`);
console.log(`  Credit min ≤ 4:    ${creditEverAt4} / ${N}`);
console.log(`  Credit min ≤ 3:    ${creditEverAt3} / ${N}`);
console.log(`  Credit min ≤ 2:    ${creditEverAt2} / ${N}`);

console.log('\nPost-Funding Credit min distribution:');
const pfmKeys = Object.keys(postFundingMinDist).map(Number).sort((a, b) => a - b);
for (const k of pfmKeys) console.log(`  ${k}: ${postFundingMinDist[k]} games`);
const pfmAt5 = postFundingMinDist[5] || 0;
const pfmBelow5 = pfmKeys.filter(k => k < 5).reduce((a, k) => a + postFundingMinDist[k], 0);
console.log(`  → Post-Funding reaches 5: ${pfmAt5} / ${N}  (PRIMARY success criterion)`);
console.log(`  → Post-Funding below 5:   ${pfmBelow5} / ${N}  (stretch)`);

console.log('\n=== RECOVERY ANALYSIS ===');
console.log(`  Games where Credit dipped to 6 then recovered to 7+: ${recoveredFrom6}`);
console.log(`  Games where Credit dipped to ≤5 then recovered to 7+: ${recoveredFrom5}`);
console.log('  Top recovery sources (count of games where this source brought credit to 7+ after a 6-dip):');
const recoveryTop = Object.entries(recoverySourceHisto).sort((a, b) => b[1] - a[1]);
for (const [src, count] of recoveryTop) console.log(`    ${count} × ${src}`);

console.log(`\n=== RESISTANCE (side-effect watch) ===`);
console.log(`  Resistance max ≥ 8:  ${resistMaxAtLeast8} / ${N}  (${(resistMaxAtLeast8/N*100).toFixed(1)} %)`);
console.log(`  Resistance max ≥ 10: ${resistMaxAtLeast10} / ${N}`);
