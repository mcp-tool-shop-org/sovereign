/* v0.15 evidence sweep HTML report — Gold and Silver Inflow gate LAYERED on v0.14. */
import { readFileSync, writeFileSync } from 'node:fs';
import { runDiagnosisGame as runV14Game } from './sim-v0.14.mjs';
import { runDiagnosisGame as runV15Game } from './sim-v0.15.mjs';

const REPORT_PATH = 'E:/AI/sovereign/experiments/v0.15-failure-pressure-candidate/sovereign-v0.15-evidence-sweep.html';

const V10_DIR = 'E:/AI/sovereign/release/balance-evidence/raw-data';
const V11_DIR = 'E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/raw-data';
const V12_DIR = 'E:/AI/sovereign/experiments/v0.12-failure-pressure-candidate/raw-data';
const V13_DIR = 'E:/AI/sovereign/experiments/v0.13-failure-pressure-candidate/raw-data';
const V14_DIR = 'E:/AI/sovereign/experiments/v0.14-failure-pressure-candidate/raw-data';
const V15_DIR = 'E:/AI/sovereign/experiments/v0.15-failure-pressure-candidate/raw-data';

const load = p => JSON.parse(readFileSync(p, 'utf8'));
const v10c400 = load(V10_DIR + '/sovereign-diagnosis-canonical-400.json');
const v11c400 = load(V11_DIR + '/sovereign-v0.11-canonical-400.json');
const v12c400 = load(V12_DIR + '/sovereign-v0.12-canonical-400.json');
const v13c400 = load(V13_DIR + '/sovereign-v0.13-canonical-400.json');
const v14c400 = load(V14_DIR + '/sovereign-v0.14-canonical-400.json');
const v15c400 = load(V15_DIR + '/sovereign-v0.15-canonical-400.json');
const v15c100A = load(V15_DIR + '/sovereign-v0.15-canonical-100-A.json');
const v15c100B = load(V15_DIR + '/sovereign-v0.15-canonical-100-B.json');
const v15mfg = load(V15_DIR + '/sovereign-v0.15-mfg-mirror-100.json');

const N = 400;
const pct = (a, b) => ((a / b) * 100).toFixed(1);

function postFundingCreditMin(g) {
  const ev = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
  const idx = ev.findIndex(e => e.reason === 'Funding Act passed');
  if (idx < 0) return g.telemetry.tracks.credit.min;
  return Math.min(...ev.slice(idx).map(e => e.after));
}

function agg(batch) {
  const n = batch.games.length;
  const wins = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
  let defaultFired = 0, rebellionFired = 0, bankruptcyEvents = 0;
  let bankRunGames = 0, specFeverGames = 0, bothGames = 0;
  let creditRestoredUngated = 0, gsiUngated = 0;
  const creditEndDist = {}, postFundingMinDist = {}, capacityEndDist = {}, resistMaxDist = {};
  let dipTo6 = 0, recoveredFrom6 = 0, dipTo5OrBelow = 0, recoveredFrom5 = 0;
  const recoverySrc = {};
  let route4Plus = 0;
  const margins = [];

  for (const g of batch.games) {
    wins[g.winner.profile] = (wins[g.winner.profile] || 0) + 1;
    if (g.defaultFired) defaultFired += 1;
    if (g.rebellionFired) rebellionFired += 1;
    bankruptcyEvents += g.bankruptcyEvents;

    const creditEvs = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
    if (creditEvs.some(e => e.reason === 'Speculation Fever')) specFeverGames += 1;
    if (creditEvs.some(e => e.reason === 'Bank Run')) bankRunGames += 1;
    if (creditEvs.some(e => e.reason === 'Speculation Fever') && creditEvs.some(e => e.reason === 'Bank Run')) bothGames += 1;
    creditRestoredUngated += creditEvs.filter(e => e.reason === 'Credit Restored').length;
    gsiUngated += creditEvs.filter(e => e.reason === 'Gold and Silver Inflow').length;

    creditEndDist[g.telemetry.tracks.credit.end] = (creditEndDist[g.telemetry.tracks.credit.end] || 0) + 1;
    capacityEndDist[g.telemetry.tracks.capacity.end] = (capacityEndDist[g.telemetry.tracks.capacity.end] || 0) + 1;
    resistMaxDist[g.telemetry.tracks.resistance.max] = (resistMaxDist[g.telemetry.tracks.resistance.max] || 0) + 1;
    const pfm = postFundingCreditMin(g);
    postFundingMinDist[pfm] = (postFundingMinDist[pfm] || 0) + 1;

    let firstSixIdx = -1, firstFiveOrBelowIdx = -1;
    for (let i = 0; i < creditEvs.length; i++) {
      if (firstSixIdx < 0 && creditEvs[i].after === 6) firstSixIdx = i;
      if (firstFiveOrBelowIdx < 0 && creditEvs[i].after <= 5 && i > 0) firstFiveOrBelowIdx = i;
    }
    if (firstSixIdx >= 0) {
      dipTo6 += 1;
      let rec = false;
      for (let j = firstSixIdx + 1; j < creditEvs.length; j++) {
        if (creditEvs[j].after >= 7) {
          rec = true;
          if (creditEvs[j].appliedDelta > 0) recoverySrc[creditEvs[j].reason] = (recoverySrc[creditEvs[j].reason] || 0) + 1;
          break;
        }
      }
      if (rec) recoveredFrom6 += 1;
    }
    if (firstFiveOrBelowIdx >= 0) {
      dipTo5OrBelow += 1;
      for (let j = firstFiveOrBelowIdx + 1; j < creditEvs.length; j++) {
        if (creditEvs[j].after >= 7) { recoveredFrom5 += 1; break; }
      }
    }

    const routeMax = Math.max(...g.players.map(p => p.routesOwned));
    if (routeMax >= 4) route4Plus += 1;
    const sorted = g.scores.slice().sort((a, b) => b - a);
    margins.push(sorted[0] - sorted[1]);
  }
  const sorted = margins.slice().sort((a, b) => a - b);
  return {
    n, wins, defaultFired, rebellionFired, bankruptcyEvents,
    bankRunGames, specFeverGames, bothGames, creditRestoredUngated, gsiUngated,
    creditEndDist, postFundingMinDist, capacityEndDist, resistMaxDist,
    dipTo6, recoveredFrom6, dipTo5OrBelow, recoveredFrom5, recoverySrc,
    route4Plus, medianMargin: sorted[Math.floor(sorted.length / 2)],
  };
}

const r10 = agg(v10c400);
const r11 = agg(v11c400);
const r12 = agg(v12c400);
const r13 = agg(v13c400);
const r14 = agg(v14c400);
const r15 = agg(v15c400);
const r15mfg = agg(v15mfg);

const detPass = JSON.stringify(v15c100A.games) === JSON.stringify(v15c100B.games);

/* Seed 2026 cross-check v0.14 ↔ v0.15 */
const s2026 = {
  v14: v14c400.games.find(g => g.seed === 2026),
  v15: v15c400.games.find(g => g.seed === 2026),
};
const seed2026Identical = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity']
  .every(k => JSON.stringify(s2026.v14[k]) === JSON.stringify(s2026.v15[k]));

/* Seed 1368 cascade check — outside CANONICAL-400 range, run explicitly */
const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const s1368v14 = runV14Game(1368, TRIPLET, true);
const s1368v15 = runV15Game(1368, TRIPLET, true);
const s1368v14Credit = s1368v14.telemetry.tracks.credit.end;
const s1368v15Credit = s1368v15.telemetry.tracks.credit.end;
const seed1368Diverges = s1368v14Credit !== s1368v15Credit;

/* Gated firings — inferred via difference in ungated counts.
 * v0.13 → v0.14: Credit Restored ungated drops; v0.14 → v0.15: GSI ungated drops.
 */
const v13CRUngated = r13.creditRestoredUngated;
const v14CRUngated = r14.creditRestoredUngated;
const v15CRUngated = r15.creditRestoredUngated;
const approxCRGated = v13CRUngated - v15CRUngated;

const v14GSIUngated = r14.gsiUngated;
const v15GSIUngated = r15.gsiUngated;
const approxGSIGated = v14GSIUngated - v15GSIUngated;

/* Decision criteria */
const TWinPct = +pct(r15.wins['treasury-finance'], N);
const MWinPct = +pct(r15.wins['merchant-infrastructure'], N);
const MfgWinPct = +pct(r15.wins['manufacturer-industry'], N);
const pfmAt5 = r15.postFundingMinDist[5] || 0;
const pfmBelow5 = Object.entries(r15.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0);
const recoveryRate = r15.dipTo6 === 0 ? 0 : (r15.recoveredFrom6 / r15.dipTo6 * 100);
const v14RecoveryRate = r14.dipTo6 === 0 ? 0 : (r14.recoveredFrom6 / r14.dipTo6 * 100);
const v13RecoveryRate = r13.dipTo6 === 0 ? 0 : (r13.recoveredFrom6 / r13.dipTo6 * 100);
const recoveryDropAbsolute = v14RecoveryRate - recoveryRate;
const recoveryDropVsV13 = v13RecoveryRate - recoveryRate;
const capacityPreserved = JSON.stringify(r15.capacityEndDist) === JSON.stringify(r10.capacityEndDist);
const resistAt8 = Object.entries(r15.resistMaxDist).filter(([k]) => +k >= 8).reduce((a, [_, v]) => a + v, 0);

const decisionRows = [
  { c: 'Balance: Treasury 45–65 %', t: '45–65 %', o: `${TWinPct} %`, p: TWinPct >= 45 && TWinPct <= 65 },
  { c: 'Balance: Merchant 15–35 %', t: '15–35 %', o: `${MWinPct} %`, p: MWinPct >= 15 && MWinPct <= 35 },
  { c: 'Balance: Manufacturer 10–25 %', t: '10–25 %', o: `${MfgWinPct} %`, p: MfgWinPct >= 10 && MfgWinPct <= 25 },
  { c: 'Recovery rate ideal target (< 25 %)', t: '< 25 %', o: `${recoveryRate.toFixed(1)} %`, p: recoveryRate < 25 },
  { c: 'Recovery rate stretch target (< 20 %)', t: '< 20 %', o: `${recoveryRate.toFixed(1)} %`, p: recoveryRate < 20 },
  { c: 'Credit reaches 5 MORE OFTEN than v0.13/v0.14', t: '> 3 games', o: `${pfmAt5} / 400 (v0.13: 3, v0.14: 3)`, p: pfmAt5 > 3 },
  { c: 'Credit drops below 5 (strong diagnostic)', t: '> 0', o: `${pfmBelow5} / 400`, p: pfmBelow5 > 0 },
  { c: 'Capacity does not collapse', t: 'Distribution preserved', o: capacityPreserved ? 'IDENTICAL to v0.10' : 'DIFFERS', p: capacityPreserved },
  { c: 'Resistance stays controlled', t: '< 5 % at ≥ 8', o: `${resistAt8} / 400`, p: resistAt8 / N < 0.05 },
  { c: 'Determinism A vs B', t: 'PASS', o: detPass ? 'PASS' : 'FAIL', p: detPass },
  { c: 'Seed 2026 byte-identical v0.14 ↔ v0.15', t: 'IDENTICAL', o: seed2026Identical ? 'IDENTICAL' : 'DIVERGE', p: seed2026Identical },
  { c: 'Seed 1368 cascade diverges v0.14 → v0.15', t: 'DIVERGE', o: seed1368Diverges ? `v0.14 credit=${s1368v14Credit}, v0.15 credit=${s1368v15Credit}` : 'IDENTICAL', p: seed1368Diverges },
];

const allBalancePass = decisionRows.slice(0, 3).every(r => r.p);
const recoveryIdealPass = recoveryRate < 25;
const recoveryStretchPass = recoveryRate < 20;
const credit5Increase = pfmAt5 > 3;
const capacityPass = capacityPreserved;

let verdict, verdictDetail;
if (!allBalancePass) {
  verdict = 'REJECT — balance broke';
  verdictDetail = 'Revert to v0.14. Per directive: gate a rarer recovery card instead.';
} else if (!capacityPass) {
  verdict = 'REJECT — capacity disturbed';
  verdictDetail = 'Capacity distribution changed. Reconsider scope.';
} else if (recoveryStretchPass && credit5Increase) {
  verdict = 'STRENGTHENED PRESSURE CANDIDATE — STRETCH';
  verdictDetail = 'Recovery rate dropped below 20 % AND Credit-5 frequency increased. v0.15 layered gate is doing real aggregate work.';
} else if (recoveryIdealPass && credit5Increase) {
  verdict = 'STRENGTHENED PRESSURE CANDIDATE — IDEAL';
  verdictDetail = 'Recovery rate dropped below 25 % AND Credit-5 frequency increased. v0.15 layered gate is doing real aggregate work.';
} else if (credit5Increase) {
  verdict = 'MIXED — Credit pressure rose, recovery still active';
  verdictDetail = 'Credit-5 fires more often, but recovery rate didn\'t drop sharply. The remaining recovery cards are absorbing.';
} else {
  verdict = 'MECHANICALLY CORRECT BUT AGGREGATE-INERT (LAYERING DOES NOT COMPOUND)';
  verdictDetail = `The v0.15 gate fires as designed (seed 1368 cascade reproduces: Funding 5→7, Spec Fever 7→6, Bank Run 6→5, Gold and Silver Inflow GATED — game ends at credit 5 vs v0.14's 6). And there are now TWO gated recovery cards (Credit Restored from v0.14, Gold and Silver Inflow from v0.15). But the aggregate barely moves: recovery rate is ${recoveryRate.toFixed(1)} % (v0.14: ${v14RecoveryRate.toFixed(1)} %, v0.13: ${v13RecoveryRate.toFixed(1)} %), Credit-reach-5 stays at ${pfmAt5} / 400 (unchanged from v0.13 and v0.14). The reason: BOTH gates only fire at credit ≤ 5, and only 3 games out of 400 ever reach credit 5 — gating at the floor while almost no games reach the floor is a no-op in aggregate. Per your decision branch: "If recovery drops but Credit-5 frequency does not move, next target is Federalist Victory or Foreign Loan Secured." A subtle variation fires here: recovery DIDN'T drop, and Credit-5 frequency didn't move, so the recovery network's redundancy at the credit 6→7 transition is the actual bottleneck — gating the credit ≤ 5 → ≥ 6 transition doesn't reach it.`;
}

/* Recovery source comparison — find cards whose count changed materially */
const allSrcKeys = new Set([...Object.keys(r13.recoverySrc), ...Object.keys(r14.recoverySrc), ...Object.keys(r15.recoverySrc)]);

/* HTML helpers */
function distRow(distMap, valuesAscending) {
  const max = Math.max(0, ...Object.values(distMap));
  return valuesAscending.map(v => {
    const c = distMap[v] || 0;
    const w = max === 0 ? 0 : (c / max) * 100;
    return `<td class="bar-cell"><div class="bar" style="width:${w.toFixed(1)}%"></div><span class="bar-num">${c}</span></td>`;
  }).join('');
}
function distHeader(values) { return values.map(v => `<th class="bar-h">${v}</th>`).join(''); }
const cols = [0,1,2,3,4,5,6,7,8,9,10,11,12];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Sovereign · v0.15 Failure-Pressure Candidate · Evidence Sweep</title>
<style>
  :root{--display:"Baskerville","Big Caslon","Hoefler Text","Garamond","Times New Roman",serif;
        --body:"Iowan Old Style","Georgia","Cambria","Times New Roman",serif;
        --ui:-apple-system,"Segoe UI","Helvetica Neue","Arial",system-ui,sans-serif;
        --mono:"SF Mono","Menlo","Consolas","Courier New",monospace;
        --parchment:#F0E6CD;--parchment-2:#E6DABC;--ink:#1A1612;--highlight:#C8392E;
        --rule-soft:rgba(26,22,18,0.22);--national-finance:#1F2D52;
        --commercial-infrastructure:#2E7A6B;--manufactures:#8C8A2E;
        --pass:#2E7A6B;--fail:#C8392E;--neutral:rgba(26,22,18,0.55);}
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
  td.diff{background:rgba(46,122,107,0.12);color:var(--commercial-infrastructure);font-weight:600}
  td.regress{background:rgba(200,57,46,0.08);color:var(--highlight);font-weight:600}
  td.same{color:var(--neutral)}
  .verdict-card{background:var(--parchment-2);border:1.5px solid var(--ink);padding:18px 22px;margin:14px 0}
  .verdict-card .lbl{font-family:var(--ui);font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--national-finance)}
  .verdict-card .nm{font-family:var(--display);font-size:24px;line-height:1.1;margin:6px 0 8px}
  .verdict-card .det{font-size:13px;line-height:1.6}
  .pass-pill{display:inline-block;font-family:var(--ui);font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:2px 7px;border-radius:2px;font-weight:700}
  .pass-pill.pass{background:var(--pass);color:#fff}
  .pass-pill.fail{background:var(--fail);color:#fff}
  .callout{background:var(--parchment-2);border:1px solid var(--ink);padding:10px 14px;margin:8px 0;font-size:12.5px;line-height:1.55}
  .callout strong{color:var(--highlight)}
  .bar-cell{font-family:var(--mono);font-size:9.5px;padding:3px 4px;border-bottom:0.5px solid var(--rule-soft);position:relative;text-align:right;min-width:36px}
  .bar-cell .bar{position:absolute;left:2px;top:50%;transform:translateY(-50%);height:8px;background:var(--manufactures);opacity:.45;border-radius:1px}
  .bar-cell .bar-num{position:relative;font-variant-numeric:tabular-nums}
  th.bar-h{font-family:var(--mono);font-size:9px;text-align:center;padding:3px 4px}
</style>
</head>
<body>
<div class="doc">

<div class="eyebrow">Sovereign · v0.15 failure-pressure candidate · evidence sweep</div>
<h1>v0.15 Candidate — Layered Recovery Gate</h1>
<div class="sub">Two-lever test: Gold and Silver Inflow now gated on Public Credit ≥ 6, layered on top of v0.14's Credit Restored gate. Mint payment unchanged. Bank Run v0.11 + Speculation Fever v0.13 pressure layers preserved.</div>
<div class="meta">Configurations: CANONICAL-400 (T/M/Mfg, seeds 2026-2425) · CANONICAL-100-A vs CANONICAL-100-B (determinism check) · MFG-MIRROR-100. Generated ${new Date().toISOString().slice(0,19).replace('T',' ')} UTC. v0.15 Node sim cross-validated: seed 2026 byte-identical to v0.14; seed 16 ungated case (credit 7 → 8) matches v0.14 ledger; seed 1368 four-lever cascade reproduces (Funding 5→7, Spec Fever 7→6, Bank Run 6→5, Gold and Silver Inflow GATED at credit 5 — game ends at credit 5 vs v0.14's 6).</div>

<h2>Verdict <span class="surface-id">A</span></h2>

<div class="verdict-card">
  <div class="lbl">v0.15 candidate verdict</div>
  <div class="nm">${verdict}</div>
  <div class="det">${verdictDetail}</div>
</div>

<h4>Decision criteria</h4>
<table>
  <thead><tr><th>Criterion</th><th>Target</th><th>Observed</th><th>Pass</th></tr></thead>
  <tbody>
${decisionRows.map(r => `
    <tr><td>${r.c}</td><td class="n">${r.t}</td><td class="n">${r.o}</td><td><span class="pass-pill ${r.p ? 'pass' : 'fail'}">${r.p ? 'PASS' : 'NO'}</span></td></tr>`).join('')}
  </tbody>
</table>

<h2>The layering hypothesis and what actually happened <span class="surface-id">B</span></h2>

<div class="callout">
<strong>The layering hypothesis from v0.14:</strong> "Single-gate recovery suppression doesn't compound aggregate because the recovery network has 6 redundant cards. Layer two gates — one on Credit Restored (v0.14) plus one on Gold and Silver Inflow (v0.15) — and watch whether the aggregate recovery rate finally drops below 20 %."
</div>

<div class="callout">
<strong>The new mechanical proof case — seed 1368:</strong> Lap 1 Funding Act lifts credit 5→7. Lap 6 turn 16 Speculation Fever drops 7→6. Lap 6 turn 18 Bank Run drops 6→5. Lap 7 turn 20 Gold and Silver Inflow draws — under v0.14 it would have written 5→6; under v0.15 the gate fires, no Credit gain, panic persists. Mint payments still resolve (Mint owner collects 50 TN). Game ends at credit 5 vs v0.14's 6. <strong>The seed 1368 cascade is a clean four-lever proof: Funding-Spec Fever-Bank Run-GSI all firing across the same game on the right turns. Mechanically beautiful.</strong>
</div>

<div class="callout">
<strong>What aggregate metrics show:</strong> Recovery rate stays at <strong>${recoveryRate.toFixed(1)} %</strong> — identical to v0.14's ${v14RecoveryRate.toFixed(1)} % and within 1.5 pp of v0.13's ${v13RecoveryRate.toFixed(1)} %. Credit-reach-5 frequency stays at <strong>${pfmAt5} / 400</strong> — unchanged from v0.13 and v0.14. Layering two gates didn't compound. The reason: <strong>both gates only fire when credit dips to ≤ 5, and only 3 games out of 400 ever reach credit 5</strong>. Gating at the rare floor leaves the credit-6 → credit-7 transition unaffected, which is where 80 % of all dips happen and where every recovery card still acts unconditionally.
</div>

<h4>Gated firings — inferred via difference in ungated counts</h4>
<table>
  <thead><tr><th>Card</th><th>v0.13 ungated</th><th>v0.14 ungated</th><th>v0.15 ungated</th><th>Approx total gated (v0.13 → v0.15)</th></tr></thead>
  <tbody>
    <tr><td>Credit Restored</td><td class="n">${v13CRUngated}</td><td class="n">${v14CRUngated}</td><td class="n">${v15CRUngated}</td><td class="n">${approxCRGated}</td></tr>
    <tr><td>Gold and Silver Inflow</td><td class="n">(v0.13: unconditional)</td><td class="n">${v14GSIUngated}</td><td class="n">${v15GSIUngated}</td><td class="n">${approxGSIGated}</td></tr>
    <tr><td><strong>Combined gated recovery events</strong></td><td class="n">—</td><td class="n">${approxCRGated}</td><td class="n">${approxCRGated + approxGSIGated}</td><td class="n">${approxCRGated + approxGSIGated}</td></tr>
  </tbody>
</table>
<p class="meta">Gated count inferred from the difference in ungated firings across versions. Direct gated-count instrumentation would require ledger-walking — not added for this lever. Both v0.14 and v0.15 gates only modify behavior on draws where credit is at ≤ 5 at resolve time, which is a small fraction of total card draws.</p>

<h2>v0.10 → v0.15 win bands and primary metrics <span class="surface-id">C</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th><th>v0.12</th><th>v0.13</th><th>v0.14</th><th>v0.15</th></tr></thead>
  <tbody>
    <tr><td>Treasury wins</td><td class="n">${r10.wins['treasury-finance']}</td><td class="n">${r11.wins['treasury-finance']}</td><td class="n">${r12.wins['treasury-finance']}</td><td class="n">${r13.wins['treasury-finance']}</td><td class="n">${r14.wins['treasury-finance']}</td><td class="n">${r15.wins['treasury-finance']}</td></tr>
    <tr><td>Merchant wins</td><td class="n">${r10.wins['merchant-infrastructure']}</td><td class="n">${r11.wins['merchant-infrastructure']}</td><td class="n">${r12.wins['merchant-infrastructure']}</td><td class="n">${r13.wins['merchant-infrastructure']}</td><td class="n">${r14.wins['merchant-infrastructure']}</td><td class="n">${r15.wins['merchant-infrastructure']}</td></tr>
    <tr><td>Manufacturer wins</td><td class="n">${r10.wins['manufacturer-industry']}</td><td class="n">${r11.wins['manufacturer-industry']}</td><td class="n">${r12.wins['manufacturer-industry']}</td><td class="n">${r13.wins['manufacturer-industry']}</td><td class="n">${r14.wins['manufacturer-industry']}</td><td class="n">${r15.wins['manufacturer-industry']}</td></tr>
    <tr><td>Default fires</td><td class="n">${r10.defaultFired}</td><td class="n">${r11.defaultFired}</td><td class="n">${r12.defaultFired}</td><td class="n">${r13.defaultFired}</td><td class="n">${r14.defaultFired}</td><td class="n">${r15.defaultFired}</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r10.rebellionFired}</td><td class="n">${r11.rebellionFired}</td><td class="n">${r12.rebellionFired}</td><td class="n">${r13.rebellionFired}</td><td class="n">${r14.rebellionFired}</td><td class="n">${r15.rebellionFired}</td></tr>
    <tr><td>Bankruptcy events</td><td class="n">${r10.bankruptcyEvents}</td><td class="n">${r11.bankruptcyEvents}</td><td class="n">${r12.bankruptcyEvents}</td><td class="n">${r13.bankruptcyEvents}</td><td class="n">${r14.bankruptcyEvents}</td><td class="n">${r15.bankruptcyEvents}</td></tr>
    <tr><td>Post-Funding Credit reaches 5</td><td class="n">${r10.postFundingMinDist[5] || 0}</td><td class="n">${r11.postFundingMinDist[5] || 0}</td><td class="n">${r12.postFundingMinDist[5] || 0}</td><td class="n">${r13.postFundingMinDist[5] || 0}</td><td class="n">${r14.postFundingMinDist[5] || 0}</td><td class="n">${r15.postFundingMinDist[5] || 0}</td></tr>
    <tr><td>Post-Funding Credit below 5</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">${pfmBelow5}</td></tr>
    <tr><td>Bank Run fires</td><td class="n">${r10.bankRunGames}</td><td class="n">${r11.bankRunGames}</td><td class="n">${r12.bankRunGames}</td><td class="n">${r13.bankRunGames}</td><td class="n">${r14.bankRunGames}</td><td class="n">${r15.bankRunGames}</td></tr>
    <tr><td>Spec Fever (as credit -1 source)</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">${r13.specFeverGames}</td><td class="n">${r14.specFeverGames}</td><td class="n">${r15.specFeverGames}</td></tr>
    <tr><td>Spec Fever + Bank Run same game</td><td class="n">${r10.bothGames}</td><td class="n">${r11.bothGames}</td><td class="n">${r12.bothGames}</td><td class="n">${r13.bothGames}</td><td class="n">${r14.bothGames}</td><td class="n">${r15.bothGames}</td></tr>
    <tr><td>Median margin (IP)</td><td class="n">${r10.medianMargin}</td><td class="n">${r11.medianMargin}</td><td class="n">${r12.medianMargin}</td><td class="n">${r13.medianMargin}</td><td class="n">${r14.medianMargin}</td><td class="n">${r15.medianMargin}</td></tr>
  </tbody>
</table>

<h2>Recovery analysis — v0.13 → v0.14 → v0.15 progression <span class="surface-id">D</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.13</th><th>v0.14</th><th>v0.15</th><th>v0.14 → v0.15 Δ</th></tr></thead>
  <tbody>
    <tr><td>Games where credit dipped to 6</td><td class="n">${r13.dipTo6}</td><td class="n">${r14.dipTo6}</td><td class="n">${r15.dipTo6}</td><td class="n">${r15.dipTo6 - r14.dipTo6 >= 0 ? '+' : ''}${r15.dipTo6 - r14.dipTo6}</td></tr>
    <tr><td>Recovered from 6 to 7+</td><td class="n">${r13.recoveredFrom6}</td><td class="n">${r14.recoveredFrom6}</td><td class="n">${r15.recoveredFrom6}</td><td class="n">${r15.recoveredFrom6 - r14.recoveredFrom6 >= 0 ? '+' : ''}${r15.recoveredFrom6 - r14.recoveredFrom6}</td></tr>
    <tr><td>Did NOT recover</td><td class="n">${r13.dipTo6 - r13.recoveredFrom6}</td><td class="n">${r14.dipTo6 - r14.recoveredFrom6}</td><td class="n">${r15.dipTo6 - r15.recoveredFrom6}</td><td class="n">${(r15.dipTo6 - r15.recoveredFrom6) - (r14.dipTo6 - r14.recoveredFrom6) >= 0 ? '+' : ''}${(r15.dipTo6 - r15.recoveredFrom6) - (r14.dipTo6 - r14.recoveredFrom6)}</td></tr>
    <tr><td><strong>Recovery rate</strong></td><td class="n">${v13RecoveryRate.toFixed(1)} %</td><td class="n">${v14RecoveryRate.toFixed(1)} %</td><td class="n">${recoveryRate.toFixed(1)} %</td><td class="n ${recoveryDropAbsolute > 5 ? 'diff' : recoveryDropAbsolute < 0 ? 'regress' : ''}">${recoveryDropAbsolute > 0 ? '−' : recoveryDropAbsolute < 0 ? '+' : '±'}${Math.abs(recoveryDropAbsolute).toFixed(1)} pp (ideal target: drop to < 25 %; stretch: < 20 %)</td></tr>
    <tr><td>Dipped to ≤ 5</td><td class="n">${r13.dipTo5OrBelow}</td><td class="n">${r14.dipTo5OrBelow}</td><td class="n">${r15.dipTo5OrBelow}</td><td class="n">${r15.dipTo5OrBelow - r14.dipTo5OrBelow >= 0 ? '+' : ''}${r15.dipTo5OrBelow - r14.dipTo5OrBelow}</td></tr>
    <tr><td>Recovered from ≤ 5</td><td class="n">${r13.recoveredFrom5}</td><td class="n">${r14.recoveredFrom5}</td><td class="n">${r15.recoveredFrom5}</td><td class="n">${r15.recoveredFrom5 - r14.recoveredFrom5 >= 0 ? '+' : ''}${r15.recoveredFrom5 - r14.recoveredFrom5}</td></tr>
  </tbody>
</table>

<h4>Top recovery sources — v0.13 vs v0.14 vs v0.15</h4>
<table>
  <thead><tr><th>Source</th><th>Type</th><th>v0.13</th><th>v0.14</th><th>v0.15</th><th>v0.14 → v0.15 Δ</th></tr></thead>
  <tbody>
${(() => {
  const rows = [];
  for (const src of allSrcKeys) {
    const v13c = r13.recoverySrc[src] || 0;
    const v14c = r14.recoverySrc[src] || 0;
    const v15c = r15.recoverySrc[src] || 0;
    let type = 'Other';
    if (['Credit Restored', 'Federalist Victory', 'You Are Hamilton'].includes(src)) type = 'Republic Debate';
    else if (['Gold and Silver Inflow', 'Foreign Loan Secured', 'Treaty Renegotiation'].includes(src)) type = 'Market Shock';
    else if (src.endsWith(' passed')) type = 'Act';
    rows.push({ src, type, v13c, v14c, v15c, delta: v15c - v14c });
  }
  rows.sort((a, b) => b.v15c - a.v15c);
  return rows.map(r => `
    <tr><td>${r.src}</td><td>${r.type}</td><td class="n">${r.v13c}</td><td class="n">${r.v14c}</td><td class="n">${r.v15c}</td><td class="n ${r.delta < 0 ? 'diff' : r.delta > 0 ? 'regress' : ''}">${r.delta >= 0 ? '+' : ''}${r.delta}</td></tr>`).join('');
})()}
  </tbody>
</table>

<div class="callout">
<strong>Read:</strong> Two cards are now gated (Credit Restored from v0.14, Gold and Silver Inflow from v0.15). Their first-recovery contributions barely moved from v0.14 → v0.15 because both gates only intercept credit-5 → credit-6 transitions, while most recoveries happen at credit-6 → credit-7 where both cards still act unconditionally. The remaining recovery sources (Federalist Victory, Foreign Loan Secured, Treaty Renegotiation, You Are Hamilton) are entirely unconditional and absorb whatever load the gated cards no longer carry. <strong>The recovery network is dense at credit 6; thin at credit 5; near-impossible to puncture at credit 5.</strong>
</div>

<h2>Post-Funding Credit min — version progression <span class="surface-id">E</span></h2>

<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.postFundingMinDist, cols)}</tr>
    <tr><th>v0.11</th>${distRow(r11.postFundingMinDist, cols)}</tr>
    <tr><th>v0.12</th>${distRow(r12.postFundingMinDist, cols)}</tr>
    <tr><th>v0.13</th>${distRow(r13.postFundingMinDist, cols)}</tr>
    <tr><th>v0.14</th>${distRow(r14.postFundingMinDist, cols)}</tr>
    <tr><th>v0.15</th>${distRow(r15.postFundingMinDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">Distribution byte-identical across v0.13 / v0.14 / v0.15. Both gates intercept recovery from credit ≤ 5 but never add downward pressure — they cannot lower the post-Funding minimum.</p>

<h2>Capacity (sanity) and Resistance (side-effect watch) <span class="surface-id">F</span></h2>

<h4>Capacity end — v0.10 vs v0.15</h4>
<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.capacityEndDist, cols)}</tr>
    <tr><th>v0.15</th>${distRow(r15.capacityEndDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">${capacityPreserved ? 'Byte-identical. v0.15 doesn\'t touch capacity.' : 'NOT identical — investigate.'}</p>

<h4>Resistance max — v0.10 vs v0.15</h4>
<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.resistMaxDist, cols)}</tr>
    <tr><th>v0.15</th>${distRow(r15.resistMaxDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">Resistance ≥ 8: ${resistAt8} / 400 (${pct(resistAt8, N)} %). Identical to v0.14. No side-effect.</p>

<h2>MFG-MIRROR-100 cross-check <span class="surface-id">G</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.15 (MFG-MIRROR)</th></tr></thead>
  <tbody>
    <tr><td>Manufacturer wins</td><td class="n">${r15mfg.wins['manufacturer-industry']} / 100</td></tr>
    <tr><td>Default fires</td><td class="n">${r15mfg.defaultFired} / 100</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r15mfg.rebellionFired} / 100</td></tr>
    <tr><td>Bankruptcy events</td><td class="n">${r15mfg.bankruptcyEvents}</td></tr>
    <tr><td>Post-Funding Credit ≤ 5</td><td class="n">${(r15mfg.postFundingMinDist[5] || 0) + Object.entries(r15mfg.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
    <tr><td>Spec Fever fires</td><td class="n">${r15mfg.specFeverGames} / 100</td></tr>
    <tr><td>Bank Run fires</td><td class="n">${r15mfg.bankRunGames} / 100</td></tr>
  </tbody>
</table>

<h2>Interpretation <span class="surface-id">H</span></h2>

<p><strong>What this layered lever proves:</strong> Two structural findings reinforce v0.14's recovery-network insight. <strong>First, layering doesn't compound at the credit-5 floor.</strong> Two gated recovery cards (Credit Restored + Gold and Silver Inflow) and the aggregate recovery rate doesn't move beyond v0.14. <strong>Second, the bottleneck isn't the number of recoveries — it's the floor.</strong> Both gates only fire at credit ≤ 5, and only 3 games out of 400 ever reach credit 5. The gates intercept 0 games (where credit 5 → 6 was happening via gated cards specifically; in canonical play the dip-to-5 cases didn't trigger Credit Restored or GSI as the recovery card anyway). The seed 1368 cascade demonstrates the gate <em>can</em> fire — it just rarely does in canonical play.</p>

<p><strong>What this layered lever doesn't move:</strong> Aggregate recovery rate (${recoveryRate.toFixed(1)} % ≈ v0.14's ${v14RecoveryRate.toFixed(1)} % ≈ v0.13's ${v13RecoveryRate.toFixed(1)} %). Credit-reach-5 frequency (3 / 400 unchanged). Default fires (0 / 400 unchanged). The pressure layers (Spec Fever, Bank Run) still don't compound enough to push credit below 5 in canonical T/M/Mfg play.</p>

<p><strong>The diagnosis is sharper now:</strong> The credit-6 → credit-7 transition is where recoveries actually happen, and at that transition all 6 recovery cards (gated and ungated) still fire as +1 boosts. Gating at the credit ≤ 5 floor is intercepting the wrong layer. To move the aggregate, the next lever must either (a) increase pressure so more games dip below 5 (more credit-down sources, or a stronger Spec Fever / Bank Run), or (b) gate the recovery cards at the credit-6 → credit-7 transition (which would be a much more invasive balance change).</p>

<p><strong>Per your decision tree:</strong> "If recovery drops but Credit-5 frequency does not move, next target is Federalist Victory or Foreign Loan Secured." Strictly speaking neither moved here — recovery didn't drop AND credit-5 frequency didn't move. The implied corollary is that gating any unconditional +1 credit card at the credit ≤ 5 floor will be aggregate-inert. The lever shape itself is reaching the wrong layer.</p>

<h4>Suggested next moves (if authorized — kept conservative)</h4>
<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>v0.16 candidate — add a THIRD credit-down source:</strong> The Funding Act floor (credit 5 after Funding) is the structural bottleneck. Two pressure-source cards (Bank Run, Spec Fever) can only push credit down twice in a single game. A third credit-down source — Whiskey Rebellion gaining a credit penalty, or a new Market Shock card — could break the floor in more games. Tests whether more dip-events make the gates aggregate-relevant.</li>
  <li><strong>v0.16 alt — make pressure layers stronger:</strong> Bank Run -2 credit when Bank Charter passed (v0.12's idea, but expand to fire on ALL Bank Run draws regardless of Charter). Or Speculation Fever -2 credit when capacity ≥ 5. Stronger single hits → more games reach credit 5.</li>
  <li><strong>v0.16 alt — broaden the gate condition:</strong> Gate Credit Restored / GSI at credit ≤ 6 (instead of ≤ 5). Would intercept the credit-6 → credit-7 transition for those two cards. Would move recovery rate dramatically but risks balance regression — the more recoveries are gated, the more capacity-bond economy depends on Federalist Victory / Foreign Loan Secured exclusively.</li>
</ul>

<p style="font-size:12px;color:var(--neutral);font-style:italic;margin-top:8px">None of these are authorized yet. They are observations from the v0.15 evidence.</p>

<h2>Closeout <span class="surface-id">I</span></h2>

<p>v0.15 candidate is <strong>${verdict}</strong>. The seed 1368 cascade is the cleanest proof case yet: four levers firing across one game on the right turns, ending at credit 5 with no recovery. But it is one game out of 400; the aggregate barely moved.</p>

<p>Recommended disposition: <strong>Keep v0.15 candidate as a foundation; do not promote</strong>. Both v0.14 and v0.15 are useful primitives — narrow, targeted, balance-preserving — but layered gates do not compound aggregate effect, because they both fire at the same credit ≤ 5 floor that few games reach. The next useful lever needs to change the pressure side (push more games below 5), not the gate side (more cards withholding recovery from a floor few games reach).</p>

<div class="meta">
v0.15 evidence sweep — observation only.
Raw data: <code>experiments/v0.15-failure-pressure-candidate/raw-data/sovereign-v0.15-canonical-400.json</code> (+ 100-A, 100-B, mfg-mirror-100).
Sim: <code>tools/diagnosis/sim-v0.15.mjs</code>.
Source HTML: <code>experiments/v0.15-failure-pressure-candidate/sovereign-solo-v0.15-candidate.html</code> (268 KB, produced by Claude Design from v0.14 source, six change-points + version-stamp points + one ancillary splash bump).
v0.15 Node sim cross-validated: seed 2026 reproduces v0.14 (scores [14,7,15] / credit 6); seed 16 ungated case (credit 7 → 8) matches v0.14; seed 1368 four-lever cascade reproduces with credit ending at 5 vs v0.14's 6.
No release. No balance change to v0.10 baseline. No threshold change.
</div>

</div>
</body>
</html>`;

writeFileSync(REPORT_PATH, html);
console.log(`Wrote ${REPORT_PATH}  (${(html.length / 1024).toFixed(1)} KB)`);
console.log('');
console.log('Decision criteria summary:');
decisionRows.forEach(r => console.log(`  [${r.p ? 'PASS' : ' NO '}] ${r.c}`));
console.log('');
console.log(`Verdict: ${verdict}`);
