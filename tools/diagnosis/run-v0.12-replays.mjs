/* v0.12 evidence sweep — Bank Run scales by Bank Charter. */
import { runDiagnosisBatch } from './sim-v0.12.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'E:/AI/sovereign/experiments/v0.12-failure-pressure-candidate/raw-data';
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

console.log('v0.12 EVIDENCE SWEEP — Bank Run scales by Bank Charter');
console.log('');

let t0 = Date.now();
console.log('CANONICAL-400 (seeds 2026-2425, T/M/Mfg, charterEnabled)');
const c400 = runDiagnosisBatch(seedRange(2026, 400), TM_TRIPLET, true, 'CANONICAL-400');
c400.rulesetVersion = 'v0.12-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.12-canonical-400.json', c400);

t0 = Date.now();
console.log('CANONICAL-100-A (seeds 2026-2125)');
const c100A = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-A');
c100A.rulesetVersion = 'v0.12-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.12-canonical-100-A.json', c100A);

t0 = Date.now();
console.log('CANONICAL-100-B (seeds 2026-2125)');
const c100B = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, 'CANONICAL-100-B');
c100B.rulesetVersion = 'v0.12-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.12-canonical-100-B.json', c100B);

t0 = Date.now();
console.log('MFG-MIRROR-100 (seeds 2026-2125, Mfg×3)');
const mfg = runDiagnosisBatch(seedRange(2026, 100), MFG_MIRROR, true, 'MFG-MIRROR-100');
mfg.rulesetVersion = 'v0.12-candidate';
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
write('sovereign-v0.12-mfg-mirror-100.json', mfg);

const detPass = JSON.stringify(c100A.games) === JSON.stringify(c100B.games);
console.log('');
console.log(`DETERMINISM A vs B: ${detPass ? 'PASS (byte-identical)' : 'FAIL'}`);
if (!detPass) process.exit(1);

/* Headline */
const wins = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
let defaultFired = 0, rebellionFired = 0, bankruptcyEvents = 0;
let bankRunGames = 0, bankRunPostCharter = 0, bankRunPreCharter = 0;
let creditMinAtMost5 = 0, creditMinAtMost4 = 0, creditMinAtMost3 = 0, creditMinAtMost2 = 0, creditMinAtMost1 = 0, creditMinAtMost0 = 0;
let postFundingMinAtMost5 = 0, postFundingMinAtMost4 = 0, postFundingMinAtMost3 = 0, postFundingMinAtMost2 = 0;

function postFundingCreditMin(g) {
  const ev = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
  const idx = ev.findIndex(e => e.reason === 'Funding Act passed');
  if (idx < 0) return g.telemetry.tracks.credit.min;
  /* From the Funding Act event onward, find the minimum 'after' value */
  return Math.min(...ev.slice(idx).map(e => e.after));
}

for (const g of c400.games) {
  wins[g.winner.profile] += 1;
  if (g.defaultFired) defaultFired += 1;
  if (g.rebellionFired) rebellionFired += 1;
  bankruptcyEvents += g.bankruptcyEvents;
  let firedThisGame = false;
  for (const ev of g.telemetry.pressureEvents) {
    if (ev.reason === 'Bank Run' && ev.track === 'credit') {
      firedThisGame = true;
      if (ev.appliedDelta === -2) bankRunPostCharter += 1;
      if (ev.appliedDelta === -1) bankRunPreCharter += 1;
    }
  }
  if (firedThisGame) bankRunGames += 1;
  const cm = g.telemetry.tracks.credit.min;
  if (cm <= 5) creditMinAtMost5 += 1;
  if (cm <= 4) creditMinAtMost4 += 1;
  if (cm <= 3) creditMinAtMost3 += 1;
  if (cm <= 2) creditMinAtMost2 += 1;
  if (cm <= 1) creditMinAtMost1 += 1;
  if (cm <= 0) creditMinAtMost0 += 1;
  const pfm = postFundingCreditMin(g);
  if (pfm <= 5) postFundingMinAtMost5 += 1;
  if (pfm <= 4) postFundingMinAtMost4 += 1;
  if (pfm <= 3) postFundingMinAtMost3 += 1;
  if (pfm <= 2) postFundingMinAtMost2 += 1;
}

const N = c400.games.length;
console.log('');
console.log('=== HEADLINE (v0.12 CANONICAL-400) ===');
console.log(`  Treasury wins:        ${wins['treasury-finance']} / ${N}  (${(wins['treasury-finance']/N*100).toFixed(1)} %)`);
console.log(`  Merchant wins:        ${wins['merchant-infrastructure']} / ${N}  (${(wins['merchant-infrastructure']/N*100).toFixed(1)} %)`);
console.log(`  Manufacturer wins:    ${wins['manufacturer-industry']} / ${N}  (${(wins['manufacturer-industry']/N*100).toFixed(1)} %)`);
console.log('');
console.log(`  Bank Run games:       ${bankRunGames} / ${N}  (${(bankRunGames/N*100).toFixed(1)} %)`);
console.log(`    pre-Charter (-1):   ${bankRunPreCharter}`);
console.log(`    post-Charter (-2):  ${bankRunPostCharter}`);
console.log('');
console.log(`  defaultFired:         ${defaultFired} / ${N}`);
console.log(`  rebellionFired:       ${rebellionFired} / ${N}`);
console.log(`  bankruptcyEvents:     ${bankruptcyEvents}`);
console.log('');
console.log('Raw Credit min distribution:');
console.log(`  Credit min ≤ 5:       ${creditMinAtMost5} / ${N}  (${(creditMinAtMost5/N*100).toFixed(1)} %)`);
console.log(`  Credit min ≤ 4:       ${creditMinAtMost4} / ${N}  (${(creditMinAtMost4/N*100).toFixed(1)} %)`);
console.log(`  Credit min ≤ 3:       ${creditMinAtMost3} / ${N}  (${(creditMinAtMost3/N*100).toFixed(1)} %)`);
console.log(`  Credit min ≤ 2:       ${creditMinAtMost2} / ${N}  (${(creditMinAtMost2/N*100).toFixed(1)} %)`);
console.log(`  Credit min ≤ 1:       ${creditMinAtMost1} / ${N}  (${(creditMinAtMost1/N*100).toFixed(1)} %)`);
console.log(`  Credit min  = 0:      ${creditMinAtMost0} / ${N}  (${(creditMinAtMost0/N*100).toFixed(1)} %)`);
console.log('');
console.log('Post-Funding Credit min distribution (primary metric):');
console.log(`  Post-Funding min ≤ 5: ${postFundingMinAtMost5} / ${N}  (${(postFundingMinAtMost5/N*100).toFixed(1)} %) ← primary success threshold`);
console.log(`  Post-Funding min ≤ 4: ${postFundingMinAtMost4} / ${N}  (${(postFundingMinAtMost4/N*100).toFixed(1)} %) ← stretch threshold`);
console.log(`  Post-Funding min ≤ 3: ${postFundingMinAtMost3} / ${N}  (${(postFundingMinAtMost3/N*100).toFixed(1)} %)`);
console.log(`  Post-Funding min ≤ 2: ${postFundingMinAtMost2} / ${N}  (${(postFundingMinAtMost2/N*100).toFixed(1)} %)`);
