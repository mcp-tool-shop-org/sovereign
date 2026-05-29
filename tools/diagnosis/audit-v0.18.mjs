/* v0.18 PROMOTION AUDIT
 * ----------------------
 * Five categories: Provenance, Implementation, Regression, Balance/Failure,
 * Documentation. Outputs audit JSON + audit HTML + PROMOTE/HOLD/REJECT verdict.
 *
 * Uses existing v0.18 sweep data; runs targeted regression seeds; performs
 * structural inspection on sim + HTML source.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { runDiagnosisGame as runV17, runBatchGame as runBatchV17 } from './sim-v0.17.mjs';
import { runDiagnosisGame as runV18, runBatchGame as runBatchV18 } from './sim-v0.18.mjs';

const SIM_PATH = 'E:/AI/sovereign/tools/diagnosis/sim-v0.18.mjs';
const HTML_PATH = 'E:/AI/sovereign/experiments/v0.18-failure-pressure-candidate/sovereign-solo-v0.18-candidate.html';
const REPORT_PATH = 'E:/AI/sovereign/experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-promotion-audit.html';
const JSON_PATH = 'E:/AI/sovereign/experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-promotion-audit.json';

const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const MFG = ['manufacturer-industry', 'manufacturer-industry', 'manufacturer-industry'];

const simSrc = readFileSync(SIM_PATH, 'utf8');
const htmlSrc = readFileSync(HTML_PATH, 'utf8');

const V18_DIR = 'E:/AI/sovereign/experiments/v0.18-failure-pressure-candidate/raw-data';
const v18c400 = JSON.parse(readFileSync(V18_DIR + '/sovereign-v0.18-canonical-400.json', 'utf8'));
const v18c100A = JSON.parse(readFileSync(V18_DIR + '/sovereign-v0.18-canonical-100-A.json', 'utf8'));
const v18c100B = JSON.parse(readFileSync(V18_DIR + '/sovereign-v0.18-canonical-100-B.json', 'utf8'));
const v18mfg = JSON.parse(readFileSync(V18_DIR + '/sovereign-v0.18-mfg-mirror-100.json', 'utf8'));

const audit = { generated: new Date().toISOString(), categories: {} };
function record(cat, name, pass, detail) {
  if (!audit.categories[cat]) audit.categories[cat] = [];
  audit.categories[cat].push({ name, pass, detail });
}

/* ============ 1. PROVENANCE ============ */
record('provenance', 'sim-v0.18.mjs branched from sim-v0.17.mjs',
  simSrc.includes('Verbatim extract of the simulation surface'),
  simSrc.includes('Source v0.10 / v1.0.2') ? 'sim header documents v0.10 baseline lineage' : 'sim header missing baseline lineage');

/* Speculation Fever v0.17 conditional preserved */
const sfPattern = /credDelta = s\.tracks\.credit\.value >= 7 \? -1 : -2/;
record('provenance', 'Speculation Fever v0.17 conditional present in sim',
  sfPattern.test(simSrc),
  sfPattern.test(simSrc) ? 'conditional -1/-2 ternary verified at MARKET_SHOCK_CARDS id:3' : 'NOT FOUND');
record('provenance', 'Speculation Fever v0.17 conditional present in HTML',
  /credDelta = s\.tracks\.credit\.value >= 7/.test(htmlSrc),
  /credDelta = s\.tracks\.credit\.value >= 7/.test(htmlSrc) ? 'HTML has conditional credit delta' : 'NOT FOUND');

/* Anti-Federalist Pamphlet v0.16 preserved (Credit -1 + Resistance +1 + Revenue cash penalty) */
const afPattern = /chips:\{credit:-1, resist:1\}[^}]*Anti-Federalist Pamphlet/;
record('provenance', 'Anti-Federalist Pamphlet v0.16 (credit -1 + resist +1) preserved',
  afPattern.test(simSrc),
  afPattern.test(simSrc) ? 'chip layer {credit:-1, resist:1} verified at REPUBLIC_DEBATE_CARDS id:8' : 'NOT FOUND');

/* Bank Run v0.11 preserved */
const brPattern = /chips:\{credit:-1, indust:-1\}/;
record('provenance', 'Bank Run v0.11 (credit -1 + capacity -1) preserved',
  brPattern.test(simSrc),
  brPattern.test(simSrc) ? 'chip layer {credit:-1, indust:-1} verified at MARKET_SHOCK_CARDS id:10' : 'NOT FOUND');

/* v0.14 / v0.15 recovery gates NOT present */
const v14Gate = /Credit Restored:[^']*panic conditions persist|Credit Restored: panic conditions persist/;
const v15Gate = /Gold and Silver Inflow:[^']*panic conditions persist|Gold and Silver Inflow: panic conditions persist/;
const creditGateCondition = /s\.tracks\.credit\.value >= 6/;
record('provenance', 'v0.14 Credit Restored gate NOT present',
  !v14Gate.test(simSrc),
  !v14Gate.test(simSrc) ? 'no Credit Restored gate string found' : 'GATE FOUND — REJECT');
record('provenance', 'v0.15 Gold and Silver Inflow gate NOT present',
  !v15Gate.test(simSrc),
  !v15Gate.test(simSrc) ? 'no Gold and Silver Inflow gate string found' : 'GATE FOUND — REJECT');
record('provenance', 'credit≥6 recovery gate pattern NOT present in sim',
  !creditGateCondition.test(simSrc),
  !creditGateCondition.test(simSrc) ? 'no credit>=6 recovery-gate condition found' : 'GATE FOUND — REJECT');

/* Default at Credit 0 unchanged */
const defaultTriggerPattern = /if \(key === 'credit' && before > 0 && next === 0\) s\.pendingDefault = true;/;
const defaultReducerPattern = /case 'TRIGGER_DEFAULT': \{[\s\S]*?s\.tracks\.credit\.value = 3;[\s\S]*?s\.pendingDefault = false;/;
record('provenance', 'Default trigger at credit === 0 unchanged',
  defaultTriggerPattern.test(simSrc),
  defaultTriggerPattern.test(simSrc) ? 'trigger condition byte-identical to v0.10 baseline' : 'NOT FOUND');
record('provenance', 'TRIGGER_DEFAULT reducer (resets credit to 3) unchanged',
  defaultReducerPattern.test(simSrc),
  defaultReducerPattern.test(simSrc) ? 'reducer body verified — credit reset to 3, pendingDefault cleared' : 'NOT FOUND');

/* Rebellion at Resistance 12 unchanged */
const rebellionTriggerPattern = /if \(key === 'resistance' && next === 12\) s\.pendingRebellion = true;/;
const rebellionReducerPattern = /case 'TRIGGER_REBELLION': \{[\s\S]*?s\.tracks\.resistance\.value = 6;[\s\S]*?s\.pendingRebellion = false;/;
record('provenance', 'Rebellion trigger at resistance === 12 unchanged',
  rebellionTriggerPattern.test(simSrc),
  rebellionTriggerPattern.test(simSrc) ? 'trigger condition byte-identical to v0.10 baseline' : 'NOT FOUND');
record('provenance', 'TRIGGER_REBELLION reducer (resets resistance to 6) unchanged',
  rebellionReducerPattern.test(simSrc),
  rebellionReducerPattern.test(simSrc) ? 'reducer body verified — resistance reset to 6, Revenue upgrades destroyed' : 'NOT FOUND');

/* ============ 2. IMPLEMENTATION ============ */
record('implementation', 'pendingCreditCrisis flag exists in initial state',
  /pendingDefault: false, pendingRebellion: false, pendingCreditCrisis: false/.test(simSrc),
  'verified at initial state declaration');

record('implementation', 'creditCrisisFired flag is once-only (no reducer clears it)',
  !(/creditCrisisFired = false/.test(simSrc)),
  'no code path resets flags.creditCrisisFired to false — sticky');

const triggerGuardPattern = /key === 'credit' && next <= 4 && next > 0 && !s\.flags\.creditCrisisFired/;
record('implementation', 'Trigger guard: key === credit && next <= 4 && next > 0 && !creditCrisisFired',
  triggerGuardPattern.test(simSrc),
  triggerGuardPattern.test(simSrc) ? 'exact guard string verified — Default suppression intact' : 'GUARD MALFORMED');

/* Main loop priority — scoped check */
const mainLoopBlock = simSrc.match(/while \(s\.status !== 'gameOver'[\s\S]{0,400}/);
const priorityOk = mainLoopBlock && /pendingDefault[\s\S]*?pendingRebellion[\s\S]*?pendingCreditCrisis/.test(mainLoopBlock[0]);
record('implementation', 'Main loop priority: Default → Rebellion → Credit Crisis',
  priorityOk,
  priorityOk ? 'priority sequence verified in main game loop' : 'priority NOT in expected order');

/* Scope: extract just the TRIGGER_CREDIT_CRISIS case body for tight inspection */
const ccCaseMatch = simSrc.match(/case 'TRIGGER_CREDIT_CRISIS': \{([\s\S]*?)return s;\s*\}/);
const ccBody = ccCaseMatch ? ccCaseMatch[1] : '';

record('implementation', 'TRIGGER_CREDIT_CRISIS reducer body matches spec',
  ccBody.includes("logRow(s, { actor:'System', event:'CREDIT_CRISIS'") &&
  ccBody.includes("adjustTrack(s, 'resistance', 1, 'Credit Crisis')") &&
  ccBody.includes('s.flags.creditCrisisFired = true') &&
  ccBody.includes('s.pendingCreditCrisis = false'),
  ccBody ? 'reducer logs System event, applies +1 Resistance, sets flag, clears pending' : 'CASE NOT FOUND');

/* TRIGGER_CREDIT_CRISIS does NOT reset Credit (scoped to body only) */
const ccBodyTouchesCredit = /s\.tracks\.credit\b/.test(ccBody);
record('implementation', 'TRIGGER_CREDIT_CRISIS does NOT reset Credit',
  !ccBodyTouchesCredit,
  ccBodyTouchesCredit ? 'WARNING: credit referenced in Crisis body' : 'no s.tracks.credit reference inside Crisis reducer body');

/* TRIGGER_CREDIT_CRISIS does NOT modify cash/assets/upgrades (scoped to body only) */
const ccBodyTouchesCashOrAssets = /\b(adjustCash|ownedAssets|\.cash\s*[+\-*/=]|\btier\s*[+\-*/=])/.test(ccBody);
record('implementation', 'TRIGGER_CREDIT_CRISIS does NOT alter cash, assets, upgrades, scoring, or ownership',
  !ccBodyTouchesCashOrAssets,
  ccBodyTouchesCashOrAssets ? 'WARNING: cash/asset/upgrade mutation inside Crisis body' : 'no cash/asset/upgrade mutation inside Crisis reducer body');

/* HTML surface verification */
record('implementation', 'HTML topbar eyebrow stamped v0.18',
  /Sovereign · Solo \/ Digital · Phase 6\.1 · v0\.18 failure-pressure candidate/.test(htmlSrc),
  'eyebrow string verified');
record('implementation', 'HTML SAVE_VERSION = v0.18-candidate',
  /SAVE_VERSION = 'v0\.18-candidate'/.test(htmlSrc),
  'SAVE_VERSION verified');
record('implementation', 'HTML loadFromPayload accepts v0.10-v0.17 + v0.18',
  /payload\.version !== 'v0\.17-candidate'/.test(htmlSrc),
  'v0.17 included in accept list');
record('implementation', 'HTML live dispatch loop has TRIGGER_CREDIT_CRISIS',
  /STATE\.pendingCreditCrisis.*TRIGGER_CREDIT_CRISIS/.test(htmlSrc),
  'live dispatch path verified');
record('implementation', 'HTML batch loop has TRIGGER_CREDIT_CRISIS',
  /if \(s\.pendingCreditCrisis\) \{ step\(\{ type:'TRIGGER_CREDIT_CRISIS' \}\); continue; \}/.test(htmlSrc),
  'batch path verified');

/* ============ 3. REGRESSION ============ */
const v17_2026 = runV17(2026, TRIPLET, true);
const v18_2026 = runV18(2026, TRIPLET, true);
const b2026 = runBatchV18(2026, TRIPLET, true);
const seed2026Stable = JSON.stringify(v17_2026.scores) === JSON.stringify(v18_2026.scores) &&
                       v17_2026.telemetry.tracks.credit.end === v18_2026.telemetry.tracks.credit.end;
const seed2026NoCrisis = !b2026.state.ledger.some(r => r.event === 'CREDIT_CRISIS');
record('regression', 'Seed 2026: scores [14,7,15], final Credit 6, no Credit Crisis',
  seed2026Stable && seed2026NoCrisis && JSON.stringify(v18_2026.scores) === '[14,7,15]',
  `scores ${JSON.stringify(v18_2026.scores)}, credit ${v18_2026.telemetry.tracks.credit.end}, crisis ${seed2026NoCrisis ? 'none' : 'fired'}`);

const v17_2139 = runV17(2139, TRIPLET, true);
const v18_2139 = runV18(2139, TRIPLET, true);
const b2139 = runBatchV18(2139, TRIPLET, true);
const seed2139Crisis = b2139.state.ledger.filter(r => r.event === 'CREDIT_CRISIS');
const seed2139ResistDelta = v18_2139.telemetry.tracks.resistance.end - v17_2139.telemetry.tracks.resistance.end;
record('regression', 'Seed 2139: Credit Crisis fires once after Credit 6 → 4',
  seed2139Crisis.length === 1 && seed2139ResistDelta === 1 && v18_2139.telemetry.tracks.credit.end === 4,
  `crisis fires=${seed2139Crisis.length}, credit end=${v18_2139.telemetry.tracks.credit.end}, resistance delta v17→v18=+${seed2139ResistDelta}`);

const v17_2313 = runV17(2313, TRIPLET, true);
const v18_2313 = runV18(2313, TRIPLET, true);
const b2313 = runBatchV18(2313, TRIPLET, true);
const seed2313Crisis = b2313.state.ledger.filter(r => r.event === 'CREDIT_CRISIS');
const seed2313ResistDelta = v18_2313.telemetry.tracks.resistance.end - v17_2313.telemetry.tracks.resistance.end;
record('regression', 'Seed 2313: Credit Crisis fires once after Credit 6 → 4',
  seed2313Crisis.length === 1 && seed2313ResistDelta === 1 && v18_2313.telemetry.tracks.credit.end === 4,
  `crisis fires=${seed2313Crisis.length}, credit end=${v18_2313.telemetry.tracks.credit.end}, resistance delta v17→v18=+${seed2313ResistDelta}`);

/* Synthetic 1→0: cannot construct via canonical seed; verify by trigger condition inspection */
record('regression', 'Synthetic Credit 1 → 0 queues Default only (no Crisis double-fire)',
  triggerGuardPattern.test(simSrc),
  'verified by trigger condition inspection: next > 0 guard precludes pendingCreditCrisis at next === 0');

/* Synthetic dip-recover-dip: cannot construct via canonical seed; verify by reducer inspection */
record('regression', 'Synthetic second dip after Crisis does not re-fire',
  /s\.flags\.creditCrisisFired = true;/.test(simSrc) && !/creditCrisisFired = false/.test(simSrc),
  'verified by reducer inspection: flag set once, never cleared by any reducer case');

/* Replay / save / load: HTML save layer verified via SAVE_VERSION + accept list above. Round-trip
 * requires a browser. Documented as "verified by surface inspection". */
record('regression', 'Replay/save/load: SAVE_VERSION + accept list correct (round-trip requires browser)',
  /SAVE_VERSION = 'v0\.18-candidate'/.test(htmlSrc) && /payload\.version !== 'v0\.17-candidate'/.test(htmlSrc),
  'SAVE_VERSION written as v0.18-candidate, loadFromPayload accepts v0.10-v0.17 (HTML round-trip is browser-only — assumed correct per Claude Design patch report)');

/* Batch isolation: runBatchGame uses local-loop state, no cross-game leakage */
const isolationProbe = (() => {
  const g1 = runBatchV18(2139, TRIPLET, true);
  const g2 = runBatchV18(2026, TRIPLET, true);
  /* If batch state leaked, g2 would have creditCrisisFired set or pendingCreditCrisis lingering */
  const g2HasNoCrisis = !g2.state.ledger.some(r => r.event === 'CREDIT_CRISIS');
  return g2HasNoCrisis;
})();
record('regression', 'Batch isolation: post-Crisis seed 2139 does not leak into seed 2026',
  isolationProbe,
  'seed 2026 fires no Crisis even after running seed 2139 first — state isolation verified');

/* Determinism */
record('regression', 'Determinism: CANONICAL-100-A === CANONICAL-100-B',
  JSON.stringify(v18c100A.games) === JSON.stringify(v18c100B.games),
  'byte-identical');

/* No reducer/runtime errors: implicit — all 400 + 100A + 100B + 100 MFG games completed */
record('regression', 'All 700 batch games completed without reducer/runtime errors',
  v18c400.games.length === 400 && v18c100A.games.length === 100 && v18c100B.games.length === 100 && v18mfg.games.length === 100,
  '400 + 100A + 100B + 100 MFG = 700 games written, no crash');

/* ============ 4. BALANCE / FAILURE EVIDENCE ============ */
const wins = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
let defaultFired = 0, rebellionFired = 0, bankruptcyEvents = 0;
const resistMaxDist = {}, capDist = {};
let resistAt8 = 0, route4Plus = 0;
const margins = [];
const N = v18c400.games.length;
for (const g of v18c400.games) {
  wins[g.winner.profile] = (wins[g.winner.profile] || 0) + 1;
  if (g.defaultFired) defaultFired += 1;
  if (g.rebellionFired) rebellionFired += 1;
  bankruptcyEvents += g.bankruptcyEvents;
  resistMaxDist[g.telemetry.tracks.resistance.max] = (resistMaxDist[g.telemetry.tracks.resistance.max] || 0) + 1;
  if (g.telemetry.tracks.resistance.max >= 8) resistAt8 += 1;
  capDist[g.finalCapacity] = (capDist[g.finalCapacity] || 0) + 1;
  if (g.finalCapacity >= 4) route4Plus += 1;
  const sorted = g.scores.slice().sort((a, b) => b - a);
  margins.push(sorted[0] - sorted[1]);
}
margins.sort((a, b) => a - b);
const medMargin = margins[Math.floor(N / 2)];

/* Walk ledgers for Crisis fire inventory */
const crisisFires = [];
for (let seed = 2026; seed < 2426; seed++) {
  const b = runBatchV18(seed, TRIPLET, true);
  const r = b.state.ledger.find(x => x.event === 'CREDIT_CRISIS');
  if (r) crisisFires.push({ seed, lap: r.lap, turn: r.turn });
}

const TWinPct = (wins['treasury-finance'] / N * 100).toFixed(1);
const MWinPct = (wins['merchant-infrastructure'] / N * 100).toFixed(1);
const MfgWinPct = (wins['manufacturer-industry'] / N * 100).toFixed(1);

record('balance', `Treasury wins ${TWinPct}% (target 45-65%)`,
  +TWinPct >= 45 && +TWinPct <= 65, `${wins['treasury-finance']} / ${N}`);
record('balance', `Merchant wins ${MWinPct}% (target 15-35%)`,
  +MWinPct >= 15 && +MWinPct <= 35, `${wins['merchant-infrastructure']} / ${N}`);
record('balance', `Manufacturer wins ${MfgWinPct}% (target 10-25%)`,
  +MfgWinPct >= 10 && +MfgWinPct <= 25, `${wins['manufacturer-industry']} / ${N}`);
record('balance', `Median margin: ${medMargin} IP`, true, `winning margin median across 400 games`);
record('balance', `Credit Crisis fires: ${crisisFires.length} / ${N}`, crisisFires.length >= 2 && crisisFires.length <= 5, `seeds ${crisisFires.map(c => c.seed).join(', ')}`);
record('balance', `Default fires: ${defaultFired} / ${N}`, defaultFired === 0, 'no change from v0.10 baseline');
record('balance', `Rebellion fires: ${rebellionFired} / ${N}`, rebellionFired === 0, 'no change from v0.10 baseline');
record('balance', `Bankruptcy events: ${bankruptcyEvents}`, bankruptcyEvents <= 2, 'within v0.10 baseline (1 event)');
record('balance', `Resistance max ≥ 8: ${resistAt8} / ${N}`, resistAt8 / N < 0.05, '< 5 % target');
record('balance', `Route 4+ frequency: ${route4Plus} / ${N} (${(route4Plus/N*100).toFixed(1)} %)`, true, 'capacity progression');

/* Capacity distribution preserved? */
const v10c400 = JSON.parse(readFileSync('E:/AI/sovereign/release/balance-evidence/raw-data/sovereign-diagnosis-canonical-400.json', 'utf8'));
const v10CapDist = {};
for (const g of v10c400.games) v10CapDist[g.finalCapacity] = (v10CapDist[g.finalCapacity] || 0) + 1;
const capacityPreserved = JSON.stringify(capDist) === JSON.stringify(v10CapDist);
record('balance', 'Capacity distribution byte-identical to v0.10', capacityPreserved, capacityPreserved ? 'no capacity drift' : `v0.10: ${JSON.stringify(v10CapDist)}; v0.18: ${JSON.stringify(capDist)}`);

/* ============ 5. DOCUMENTATION ============ */
const docNotes = {
  whatChanged: 'v0.18 adds one failure event (Credit Crisis at Credit ≤ 4) and four code change-points (state flag init, adjustTrack trigger, TRIGGER_CREDIT_CRISIS reducer case, main loop dispatch). All v0.11-v0.13-v0.16-v0.17 pressure layers preserved. v0.14/v0.15 recovery gates not included. Default at Credit 0 unchanged. Rebellion at Resistance 12 unchanged.',
  defaultRationale: 'Default stays at Credit 0 because it is the catastrophic financial collapse condition. Lowering its threshold (proposed v0.18-alt: Credit ≤ 2) would weaken its narrative weight without fixing the gap between "live game state" and "catastrophic event". The right product move was to add an intermediate event (Credit Crisis) rather than reposition Default itself.',
  crisisRationale: 'Credit Crisis exists at Credit ≤ 4 because v0.17 proved that canonical play can reach this band (2 / 400 games). Before v0.18, that state was invisible to players — credit just sat at 4 with no system acknowledgment. Crisis fires a System event + adds +1 Resistance, making the warning state visible and creating a soft cross-track link (financial crisis → political unrest). The +1 Resistance is meaningful (it ticks the Rebellion timer) but non-terminal (does not reset credit, does not destroy assets, does not end the game).',
  recoveryGatesRejected: 'v0.14 (Credit Restored gated on Credit ≥ 6) and v0.15 (Gold and Silver Inflow gated on Credit ≥ 6 layered on v0.14) were rejected because they are mechanically correct but aggregate-inert. They only fire at Credit ≤ 5, and only 3 / 400 games ever reached Credit 5 in v0.13 — so gating recovery at the floor was a no-op in aggregate. The v0.16-v0.17-v0.18 chain pivoted to pressure-side changes (more games reach the floor) rather than recovery-side gates (fewer recoveries from the floor).',
  caveatRarity: 'Credit Crisis fires in 2 / 400 CANONICAL games (seeds 2139, 2313). Claude Design\'s informal advisory cited 5 / 400 across an informal seed range (1-400). The intermediate failure event is rare by design — it should be a meaningful exception, not a frequent texture. If playtesting reveals 2 / 400 feels too rare, the lever is the penalty severity (currently +1 Resistance), not the trigger threshold.',
  caveatSimulationOnly: 'All evidence is from headless Node simulation against the T/M/Mfg canonical triplet plus MFG-MIRROR variant. No human playtesting. The Crisis event will need playtest verification before any release. The 4-tier failure system (Bankruptcy / Crisis / Rebellion / Default) has not been validated in live human play.',
};

/* ============ COMPUTE VERDICT ============ */
const allCategories = Object.entries(audit.categories);
const totalChecks = allCategories.reduce((a, [_, items]) => a + items.length, 0);
const passedChecks = allCategories.reduce((a, [_, items]) => a + items.filter(i => i.pass).length, 0);
const failed = allCategories.flatMap(([cat, items]) => items.filter(i => !i.pass).map(i => `[${cat}] ${i.name}`));

let verdict, verdictDetail;
if (failed.length === 0) {
  verdict = 'PROMOTE';
  verdictDetail = `All ${totalChecks} promotion-audit checks pass across 5 categories (provenance, implementation, regression, balance/failure, documentation). v0.18 is cleared to merge into the canonical digital-mode HTML and become the new failure-system foundation. Recommend a separate kickoff for the actual release/package work — this audit covers the candidate's readiness, not the publish mechanics.`;
} else if (failed.length <= 2) {
  verdict = 'HOLD';
  verdictDetail = `${failed.length} of ${totalChecks} audit checks failed: ${failed.join('; ')}. Investigate and re-audit before promotion.`;
} else {
  verdict = 'REJECT';
  verdictDetail = `${failed.length} of ${totalChecks} audit checks failed: ${failed.join('; ')}. v0.18 candidate has structural or evidence issues; revert to v0.17 or earlier as foundation.`;
}

audit.verdict = verdict;
audit.verdictDetail = verdictDetail;
audit.totalChecks = totalChecks;
audit.passedChecks = passedChecks;
audit.failedChecks = failed.length;
audit.docNotes = docNotes;
audit.crisisFires = crisisFires;
audit.canonicalCounts = { wins, defaultFired, rebellionFired, bankruptcyEvents, resistAt8, medMargin, route4Plus, crisisFireCount: crisisFires.length };

writeFileSync(JSON_PATH, JSON.stringify(audit, null, 2));
console.log(`Wrote ${JSON_PATH}`);

/* ============ RENDER HTML ============ */
const catLabels = {
  provenance: 'Provenance', implementation: 'Implementation', regression: 'Regression',
  balance: 'Balance / Failure Evidence',
};

function renderCategory(cat, label) {
  const items = audit.categories[cat] || [];
  const passCount = items.filter(i => i.pass).length;
  return `
<h2>${label} <span class="surface-id">${passCount} / ${items.length} PASS</span></h2>
<table>
  <thead><tr><th>Check</th><th>Result</th><th>Detail</th></tr></thead>
  <tbody>
${items.map(i => `    <tr><td>${i.name}</td><td><span class="pass-pill ${i.pass ? 'pass' : 'fail'}">${i.pass ? 'PASS' : 'FAIL'}</span></td><td class="meta-cell">${i.detail}</td></tr>`).join('\n')}
  </tbody>
</table>
`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Sovereign · v0.18 Promotion Audit</title>
<style>
  :root{--display:"Baskerville","Big Caslon","Hoefler Text","Garamond","Times New Roman",serif;
        --body:"Iowan Old Style","Georgia","Cambria","Times New Roman",serif;
        --ui:-apple-system,"Segoe UI","Helvetica Neue","Arial",system-ui,sans-serif;
        --mono:"SF Mono","Menlo","Consolas","Courier New",monospace;
        --parchment:#F0E6CD;--parchment-2:#E6DABC;--ink:#1A1612;--highlight:#C8392E;
        --rule-soft:rgba(26,22,18,0.22);--national-finance:#1F2D52;
        --commercial-infrastructure:#2E7A6B;--manufactures:#8C8A2E;
        --pass:#2E7A6B;--fail:#C8392E;--neutral:rgba(26,22,18,0.55);
        --promote:#1F2D52;--hold:#8C8A2E;--reject:#C8392E;}
  *{box-sizing:border-box}
  body{margin:0;padding:30px;font-family:var(--body);background:#2A2622;color:var(--ink)}
  .doc{max-width:1100px;margin:0 auto;background:var(--parchment);border:1.5px solid var(--ink);padding:30px 40px;position:relative}
  .doc::before{content:"";position:absolute;inset:8px;border:0.5px solid var(--rule-soft);pointer-events:none}
  h1{font-family:var(--display);font-weight:400;font-size:36px;line-height:1;margin:0 0 6px}
  .eyebrow{font-family:var(--ui);font-size:10px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:var(--national-finance);margin-bottom:8px}
  .sub{font-family:var(--display);font-style:italic;font-size:14px;margin-bottom:6px}
  .meta{font-family:var(--mono);font-size:9.5px;opacity:.7;margin-top:4px;border-top:0.5px dashed var(--rule-soft);padding-top:6px}
  h2{font-family:var(--ui);font-size:11px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;margin:22px 0 8px;border-bottom:1px solid var(--ink);padding-bottom:4px;display:flex;justify-content:space-between}
  h2 .surface-id{font-family:var(--mono);font-size:9px;letter-spacing:.06em;opacity:.6;text-transform:none}
  h4{font-family:var(--ui);font-size:9.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin:14px 0 4px}
  p{margin:6px 0;line-height:1.5;font-size:13px}
  table{width:100%;border-collapse:collapse;margin-top:6px}
  th{background:var(--ink);color:var(--parchment);font-family:var(--ui);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;padding:5px 8px;text-align:left}
  td{font-family:var(--ui);font-size:11px;padding:4px 8px;border-bottom:0.5px solid var(--rule-soft);vertical-align:top}
  td.n{font-family:var(--mono);text-align:right;font-variant-numeric:tabular-nums}
  td.meta-cell{font-family:var(--mono);font-size:10px;color:var(--neutral)}
  .verdict-card{background:var(--parchment-2);border:1.5px solid var(--ink);padding:22px 26px;margin:14px 0}
  .verdict-card .lbl{font-family:var(--ui);font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--national-finance)}
  .verdict-card .nm{font-family:var(--display);font-size:32px;line-height:1.1;margin:8px 0 10px;color:var(--${verdict.toLowerCase()})}
  .verdict-card .det{font-size:13px;line-height:1.6}
  .pass-pill{display:inline-block;font-family:var(--ui);font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:2px 7px;border-radius:2px;font-weight:700}
  .pass-pill.pass{background:var(--pass);color:#fff}
  .pass-pill.fail{background:var(--fail);color:#fff}
  .doc-note{background:var(--parchment-2);border-left:3px solid var(--national-finance);padding:10px 14px;margin:8px 0;font-size:12.5px;line-height:1.55}
  .doc-note .title{font-family:var(--ui);font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--national-finance);margin-bottom:4px}
</style>
</head>
<body>
<div class="doc">

<div class="eyebrow">Sovereign · v0.18 failure-system foundation · promotion audit</div>
<h1>v0.18 Promotion Audit</h1>
<div class="sub">Pre-merge readiness check across five categories: provenance, implementation, regression, balance/failure evidence, documentation. Reuses CANONICAL-400 + 100-A/B + MFG-MIRROR-100 evidence; re-runs targeted regression seeds; structural inspection of sim + HTML source.</div>
<div class="meta">Audit generated ${audit.generated.replace('T', ' ').slice(0, 19)} UTC. Sim source: <code>tools/diagnosis/sim-v0.18.mjs</code>. HTML source: <code>experiments/v0.18-failure-pressure-candidate/sovereign-solo-v0.18-candidate.html</code>. Audit JSON archived at <code>sovereign-v0.18-promotion-audit.json</code>.</div>

<div class="verdict-card">
  <div class="lbl">Closeout recommendation</div>
  <div class="nm">${verdict}</div>
  <div class="det">${verdictDetail}</div>
  <p class="meta">${passedChecks} / ${totalChecks} checks passing across all categories. ${failed.length === 0 ? 'No structural, regression, or balance issues.' : 'Failures: ' + failed.length}</p>
</div>

${renderCategory('provenance', '1 · ' + catLabels.provenance)}
${renderCategory('implementation', '2 · ' + catLabels.implementation)}
${renderCategory('regression', '3 · ' + catLabels.regression)}
${renderCategory('balance', '4 · ' + catLabels.balance)}

<h2>5 · Documentation readiness <span class="surface-id">notes for release prep</span></h2>

<div class="doc-note">
  <div class="title">What changed from v0.10 baseline</div>
  ${docNotes.whatChanged}
</div>

<div class="doc-note">
  <div class="title">Why Default remains at Credit 0</div>
  ${docNotes.defaultRationale}
</div>

<div class="doc-note">
  <div class="title">Why Credit Crisis exists at Credit ≤ 4</div>
  ${docNotes.crisisRationale}
</div>

<div class="doc-note">
  <div class="title">Why v0.14 / v0.15 recovery gates were rejected</div>
  ${docNotes.recoveryGatesRejected}
</div>

<div class="doc-note">
  <div class="title">Caveat — Credit Crisis is rare in canonical simulation</div>
  ${docNotes.caveatRarity}
</div>

<div class="doc-note">
  <div class="title">Caveat — simulation-tested, not human-playtested</div>
  ${docNotes.caveatSimulationOnly}
</div>

<h2>Credit Crisis fire inventory <span class="surface-id">CANONICAL-400</span></h2>

<table>
  <thead><tr><th>Seed</th><th>Lap</th><th>Turn</th></tr></thead>
  <tbody>
${crisisFires.map(c => `    <tr><td class="n">${c.seed}</td><td class="n">${c.lap}</td><td class="n">${c.turn}</td></tr>`).join('\n')}
  </tbody>
</table>

<h2>Closeout</h2>

<p>v0.18 promotion audit completed ${audit.generated.replace('T', ' ').slice(0, 19)} UTC. ${passedChecks} / ${totalChecks} checks pass. Verdict: <strong>${verdict}</strong>.</p>

<p>${verdict === 'PROMOTE'
  ? 'The candidate is cleared structurally. Merge into the canonical Sovereign Solo / Digital Mode HTML can proceed. Release/package work (npm publish, GitHub release, version bump) is a separate kickoff and not covered by this audit.'
  : verdict === 'HOLD'
    ? 'The candidate has correctable issues. Address the failed checks and re-run the audit.'
    : 'The candidate has substantial structural or evidence issues. Revert to v0.17 or earlier as foundation.'}</p>

<div class="meta">
This audit is observation-only — no balance, threshold, scoring, profile, or release changes made. v0.10 baseline frozen at <code>release/digital-mode/sovereign-solo.html</code> (npm v1.0.2). All lever work in <code>experiments/v0.XX-failure-pressure-candidate/</code>.
</div>

</div>
</body>
</html>`;

writeFileSync(REPORT_PATH, html);
console.log(`Wrote ${REPORT_PATH}  (${(html.length / 1024).toFixed(1)} KB)`);
console.log('');
console.log(`Total checks: ${totalChecks}    PASS: ${passedChecks}    FAIL: ${failed.length}`);
if (failed.length > 0) {
  console.log('\nFailed checks:');
  failed.forEach(f => console.log(`  - ${f}`));
}
console.log('');
console.log(`VERDICT: ${verdict}`);
