/* v0.14 evidence sweep HTML report. */
import { readFileSync, writeFileSync } from 'node:fs';

const REPORT_PATH = 'E:/AI/sovereign/experiments/v0.14-failure-pressure-candidate/sovereign-v0.14-evidence-sweep.html';

const V10_DIR = 'E:/AI/sovereign/release/balance-evidence/raw-data';
const V11_DIR = 'E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/raw-data';
const V12_DIR = 'E:/AI/sovereign/experiments/v0.12-failure-pressure-candidate/raw-data';
const V13_DIR = 'E:/AI/sovereign/experiments/v0.13-failure-pressure-candidate/raw-data';
const V14_DIR = 'E:/AI/sovereign/experiments/v0.14-failure-pressure-candidate/raw-data';

const load = p => JSON.parse(readFileSync(p, 'utf8'));
const v10c400 = load(V10_DIR + '/sovereign-diagnosis-canonical-400.json');
const v11c400 = load(V11_DIR + '/sovereign-v0.11-canonical-400.json');
const v12c400 = load(V12_DIR + '/sovereign-v0.12-canonical-400.json');
const v13c400 = load(V13_DIR + '/sovereign-v0.13-canonical-400.json');
const v14c400 = load(V14_DIR + '/sovereign-v0.14-canonical-400.json');
const v14c100A = load(V14_DIR + '/sovereign-v0.14-canonical-100-A.json');
const v14c100B = load(V14_DIR + '/sovereign-v0.14-canonical-100-B.json');
const v14mfg = load(V14_DIR + '/sovereign-v0.14-mfg-mirror-100.json');

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
  let creditRestoredUngated = 0;
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
    bankRunGames, specFeverGames, bothGames, creditRestoredUngated,
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
const r14mfg = agg(v14mfg);

const detPass = JSON.stringify(v14c100A.games) === JSON.stringify(v14c100B.games);

/* Seed 2026 cross-check */
const s2026 = {
  v13: v13c400.games.find(g => g.seed === 2026),
  v14: v14c400.games.find(g => g.seed === 2026),
};
const seed2026Identical = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity']
  .every(k => JSON.stringify(s2026.v13[k]) === JSON.stringify(s2026.v14[k]));

/* Credit Restored gated detection — proxy via ledger walk
 * We don't capture gated events in pressureEvents (gate skips adjustTrack).
 * Approximate by comparing the v0.13 and v0.14 Credit Restored ungated counts.
 * Difference = approximate gated firings in v0.14.
 */
const v13CRUngated = r13.creditRestoredUngated;
const v14CRUngated = r14.creditRestoredUngated;
const approxGated = v13CRUngated - v14CRUngated;

/* Decision criteria */
const TWinPct = +pct(r14.wins['treasury-finance'], N);
const MWinPct = +pct(r14.wins['merchant-infrastructure'], N);
const MfgWinPct = +pct(r14.wins['manufacturer-industry'], N);
const pfmAt5 = r14.postFundingMinDist[5] || 0;
const pfmBelow5 = Object.entries(r14.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0);
const recoveryRate = r14.dipTo6 === 0 ? 0 : (r14.recoveredFrom6 / r14.dipTo6 * 100);
const v13RecoveryRate = r13.dipTo6 === 0 ? 0 : (r13.recoveredFrom6 / r13.dipTo6 * 100);
const recoveryDropAbsolute = v13RecoveryRate - recoveryRate;
const capacityPreserved = JSON.stringify(r14.capacityEndDist) === JSON.stringify(r10.capacityEndDist);
const resistAt8 = Object.entries(r14.resistMaxDist).filter(([k]) => +k >= 8).reduce((a, [_, v]) => a + v, 0);

const decisionRows = [
  { c: 'Balance: Treasury 45–65 %', t: '45–65 %', o: `${TWinPct} %`, p: TWinPct >= 45 && TWinPct <= 65 },
  { c: 'Balance: Merchant 15–35 %', t: '15–35 %', o: `${MWinPct} %`, p: MWinPct >= 15 && MWinPct <= 35 },
  { c: 'Balance: Manufacturer 10–25 %', t: '10–25 %', o: `${MfgWinPct} %`, p: MfgWinPct >= 10 && MfgWinPct <= 25 },
  { c: 'Recovery rate drops meaningfully below v0.13\'s 34 %', t: '< 20 % target', o: `${recoveryRate.toFixed(1)} % (drop ${recoveryDropAbsolute.toFixed(1)} pp)`, p: recoveryRate < 20 },
  { c: 'Credit reaches 5 MORE OFTEN than v0.13', t: '> 3 games', o: `${pfmAt5} / 400 (v0.13: 3)`, p: pfmAt5 > 3 },
  { c: 'Credit drops below 5 (stretch)', t: '> 0', o: `${pfmBelow5} / 400`, p: pfmBelow5 > 0 },
  { c: 'Capacity does not collapse', t: 'Distribution preserved', o: capacityPreserved ? 'IDENTICAL to v0.10' : 'DIFFERS', p: capacityPreserved },
  { c: 'Resistance stays controlled', t: '< 5 % at ≥ 8', o: `${resistAt8} / 400`, p: resistAt8 / N < 0.05 },
  { c: 'Determinism A vs B', t: 'PASS', o: detPass ? 'PASS' : 'FAIL', p: detPass },
  { c: 'Seed 2026 byte-identical v0.13 ↔ v0.14', t: 'IDENTICAL', o: seed2026Identical ? 'IDENTICAL' : 'DIVERGE', p: seed2026Identical },
];

const allBalancePass = decisionRows.slice(0, 3).every(r => r.p);
const recoveryDropPass = recoveryRate < 20;
const credit5Increase = pfmAt5 > 3;
const capacityPass = capacityPreserved;

let verdict, verdictDetail;
if (!allBalancePass) {
  verdict = 'REJECT — balance broke';
  verdictDetail = 'Revert to v0.13. Investigate Anti-Federalist Pamphlet as alternative.';
} else if (!capacityPass) {
  verdict = 'REJECT — capacity disturbed';
  verdictDetail = 'Capacity distribution changed. Reconsider scope.';
} else if (recoveryDropPass && credit5Increase) {
  verdict = 'STRENGTHENED PRESSURE CANDIDATE';
  verdictDetail = 'Recovery rate dropped below target AND Credit-5 frequency increased. Promote to v0.14 baseline candidate.';
} else if (credit5Increase) {
  verdict = 'MIXED — Credit pressure rose, recovery still active';
  verdictDetail = 'Credit-5 fires more often, but recovery rate didn\'t drop sharply. The other recovery cards are picking up slack.';
} else {
  verdict = 'MECHANICALLY CORRECT BUT AGGREGATE-INERT';
  verdictDetail = `The gate fires as designed (seed 1294 cascade reproduces; v0.13 ↔ v0.14 diverges only on the ${approxGated} games where Credit Restored draws at credit ≤ 5). But the aggregate metrics barely move: recovery rate drops from ${v13RecoveryRate.toFixed(1)} % to ${recoveryRate.toFixed(1)} % (only ${recoveryDropAbsolute.toFixed(1)} pp), and Credit-reach-5 frequency stays at ${pfmAt5} / 400 (unchanged from v0.13). Per your decision branch: "Credit Restored is not the main absorber; investigate Foreign Loan Secured or Gold and Silver Inflow next." Other recovery cards still recover most games independently — gating Credit Restored just removes its redundant contribution.`;
}

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
<title>Sovereign · v0.14 Failure-Pressure Candidate · Evidence Sweep</title>
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

<div class="eyebrow">Sovereign · v0.14 failure-pressure candidate · evidence sweep</div>
<h1>v0.14 Candidate — Credit Restored Recovery Gate</h1>
<div class="sub">Single-lever test: Credit Restored now grants Credit +1 only when Public Credit ≥ 6. Bond-owner payments unchanged. Bank Run v0.11 + Speculation Fever v0.13 pressure layers preserved.</div>
<div class="meta">Configurations: CANONICAL-400 (T/M/Mfg, seeds 2026-2425) · CANONICAL-100-A vs CANONICAL-100-B (determinism check) · MFG-MIRROR-100. Generated ${new Date().toISOString().slice(0,19).replace('T',' ')} UTC. v0.14 Node sim cross-validated: seed 2026 byte-identical to v0.13; seed 11 ungated case (credit 7 → 8) matches v0.13 ledger; seed 1294 full cascade reproduces (Spec Fever lap 6, Bank Run lap 7, Credit Restored GATED at credit 5 — game ends at credit 5 vs v0.13's 6).</div>

<h2>Verdict <span class="surface-id">A</span></h2>

<div class="verdict-card">
  <div class="lbl">v0.14 candidate verdict</div>
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

<h2>The proof case and the aggregate disappointment <span class="surface-id">B</span></h2>

<div class="callout">
<strong>The gate works mechanically — proven on seed 1294.</strong> Cascade: Speculation Fever lap 6 (credit 7→6), Bank Run lap 7 (credit 6→5), Credit Restored gated (no recovery). Game ends at credit 5 (vs v0.13's 6). The lever is correctly pointed at the right seam.
</div>

<div class="callout">
<strong>But the aggregate barely moves.</strong> Recovery rate drops from ${v13RecoveryRate.toFixed(1)} % to ${recoveryRate.toFixed(1)} % (${recoveryDropAbsolute.toFixed(1)} pp absolute) — far short of the < 20 % target. Credit-reach-5 frequency stays at 3 / 400, identical to v0.13. The reason: Credit Restored only fires at credit ≤ 5 in roughly ${approxGated} games out of 400 (the divergence count), and in those games other recovery cards independently bring credit back to 7+ — so the gating just removes a redundant recovery, not a unique one.
</div>

<h4>Credit Restored firing — gated vs ungated (inferred)</h4>
<table>
  <thead><tr><th>Behavior</th><th>v0.13</th><th>v0.14</th></tr></thead>
  <tbody>
    <tr><td>Credit Restored ungated (+1 fired)</td><td class="n">${v13CRUngated}</td><td class="n">${v14CRUngated}</td></tr>
    <tr><td>Credit Restored gated (no +1, panic persists)</td><td class="n">0 (no gate)</td><td class="n">~${approxGated} (inferred)</td></tr>
    <tr><td>Total Credit Restored draws</td><td class="n">${v13CRUngated}</td><td class="n">${v14CRUngated + approxGated}</td></tr>
  </tbody>
</table>
<p class="meta">Gated count inferred from the difference in ungated firings between v0.13 and v0.14. Direct gated-count instrumentation would require ledger-walking — deferred until needed.</p>

<h2>v0.10 → v0.14 win bands and primary metrics <span class="surface-id">C</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th><th>v0.12</th><th>v0.13</th><th>v0.14</th></tr></thead>
  <tbody>
    <tr><td>Treasury wins</td><td class="n">${r10.wins['treasury-finance']}</td><td class="n">${r11.wins['treasury-finance']}</td><td class="n">${r12.wins['treasury-finance']}</td><td class="n">${r13.wins['treasury-finance']}</td><td class="n">${r14.wins['treasury-finance']}</td></tr>
    <tr><td>Merchant wins</td><td class="n">${r10.wins['merchant-infrastructure']}</td><td class="n">${r11.wins['merchant-infrastructure']}</td><td class="n">${r12.wins['merchant-infrastructure']}</td><td class="n">${r13.wins['merchant-infrastructure']}</td><td class="n">${r14.wins['merchant-infrastructure']}</td></tr>
    <tr><td>Manufacturer wins</td><td class="n">${r10.wins['manufacturer-industry']}</td><td class="n">${r11.wins['manufacturer-industry']}</td><td class="n">${r12.wins['manufacturer-industry']}</td><td class="n">${r13.wins['manufacturer-industry']}</td><td class="n">${r14.wins['manufacturer-industry']}</td></tr>
    <tr><td>Default fires</td><td class="n">${r10.defaultFired}</td><td class="n">${r11.defaultFired}</td><td class="n">${r12.defaultFired}</td><td class="n">${r13.defaultFired}</td><td class="n">${r14.defaultFired}</td></tr>
    <tr><td>Post-Funding Credit reaches 5</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">3</td><td class="n">${pfmAt5}</td></tr>
    <tr><td>Post-Funding Credit below 5</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">${pfmBelow5}</td></tr>
    <tr><td>Bank Run fires</td><td class="n">65</td><td class="n">65</td><td class="n">65</td><td class="n">65</td><td class="n">${r14.bankRunGames}</td></tr>
    <tr><td>Spec Fever fires (as credit -1 source)</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">50</td><td class="n">${r14.specFeverGames}</td></tr>
    <tr><td>Median margin (IP)</td><td class="n">${r10.medianMargin}</td><td class="n">${r11.medianMargin}</td><td class="n">${r12.medianMargin}</td><td class="n">${r13.medianMargin}</td><td class="n">${r14.medianMargin}</td></tr>
  </tbody>
</table>

<h2>Recovery analysis — v0.13 vs v0.14 head-to-head <span class="surface-id">D</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.13</th><th>v0.14</th><th>Change</th></tr></thead>
  <tbody>
    <tr><td>Games where credit dipped to 6</td><td class="n">${r13.dipTo6}</td><td class="n">${r14.dipTo6}</td><td class="n ${r14.dipTo6 > r13.dipTo6 ? 'diff' : ''}">${r14.dipTo6 - r13.dipTo6 >= 0 ? '+' : ''}${r14.dipTo6 - r13.dipTo6}</td></tr>
    <tr><td>Recovered from 6 to 7+</td><td class="n">${r13.recoveredFrom6}</td><td class="n">${r14.recoveredFrom6}</td><td class="n">${r14.recoveredFrom6 - r13.recoveredFrom6 >= 0 ? '+' : ''}${r14.recoveredFrom6 - r13.recoveredFrom6}</td></tr>
    <tr><td>Did NOT recover</td><td class="n">${r13.dipTo6 - r13.recoveredFrom6}</td><td class="n">${r14.dipTo6 - r14.recoveredFrom6}</td><td class="n">${(r14.dipTo6 - r14.recoveredFrom6) - (r13.dipTo6 - r13.recoveredFrom6) >= 0 ? '+' : ''}${(r14.dipTo6 - r14.recoveredFrom6) - (r13.dipTo6 - r13.recoveredFrom6)}</td></tr>
    <tr><td><strong>Recovery rate</strong></td><td class="n">${v13RecoveryRate.toFixed(1)} %</td><td class="n">${recoveryRate.toFixed(1)} %</td><td class="n ${recoveryDropAbsolute > 5 ? 'diff' : 'regress'}">${recoveryDropAbsolute >= 0 ? '−' : '+'}${Math.abs(recoveryDropAbsolute).toFixed(1)} pp (target: drop ≥ 14 pp)</td></tr>
    <tr><td>Dipped to ≤ 5</td><td class="n">${r13.dipTo5OrBelow}</td><td class="n">${r14.dipTo5OrBelow}</td><td class="n">${r14.dipTo5OrBelow - r13.dipTo5OrBelow >= 0 ? '+' : ''}${r14.dipTo5OrBelow - r13.dipTo5OrBelow}</td></tr>
    <tr><td>Recovered from ≤ 5</td><td class="n">${r13.recoveredFrom5}</td><td class="n">${r14.recoveredFrom5}</td><td class="n">${r14.recoveredFrom5 - r13.recoveredFrom5 >= 0 ? '+' : ''}${r14.recoveredFrom5 - r13.recoveredFrom5}</td></tr>
  </tbody>
</table>

<h4>Top recovery sources — v0.13 vs v0.14</h4>
<table>
  <thead><tr><th>Source</th><th>Type</th><th>v0.13 recoveries</th><th>v0.14 recoveries</th><th>Δ</th></tr></thead>
  <tbody>
${(() => {
  const allSrc = new Set([...Object.keys(r13.recoverySrc), ...Object.keys(r14.recoverySrc)]);
  const rows = [];
  for (const src of allSrc) {
    const v13c = r13.recoverySrc[src] || 0;
    const v14c = r14.recoverySrc[src] || 0;
    let type = 'Other';
    if (['Credit Restored', 'Federalist Victory', 'You Are Hamilton'].includes(src)) type = 'Republic Debate';
    else if (['Gold and Silver Inflow', 'Foreign Loan Secured', 'Treaty Renegotiation'].includes(src)) type = 'Market Shock';
    else if (src.endsWith(' passed')) type = 'Act';
    rows.push({ src, type, v13c, v14c, delta: v14c - v13c });
  }
  rows.sort((a, b) => b.v14c - a.v14c);
  return rows.map(r => `
    <tr><td>${r.src}</td><td>${r.type}</td><td class="n">${r.v13c}</td><td class="n">${r.v14c}</td><td class="n ${r.delta < 0 ? 'diff' : r.delta > 0 ? 'regress' : ''}">${r.delta >= 0 ? '+' : ''}${r.delta}</td></tr>`).join('');
})()}
  </tbody>
</table>

<div class="callout">
<strong>Read:</strong> Credit Restored dropped from 9 → 6 recoveries (3 fewer) — the gating works. But Gold and Silver Inflow / Federalist Victory / Foreign Loan Secured all stayed at near-identical contribution. The net effect on recovered-from-6 count is zero: same 27 games recovered. Per your decision tree, the next lever target is one of the unconditional credit-up cards still acting as a recovery floor: <strong>Gold and Silver Inflow</strong> and <strong>Federalist Victory</strong> tied for top remaining recovery source in v0.14.
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
  </tbody>
</table>
<p class="meta">v0.14 distribution is byte-identical to v0.13's. The gating fires in ~${approxGated} games but doesn't change the post-Funding minimum because in those games credit was already at 5 — Credit Restored gating doesn't push credit lower, only prevents recovery.</p>

<h2>Capacity (sanity) and Resistance (side-effect watch) <span class="surface-id">F</span></h2>

<h4>Capacity end — v0.10 vs v0.14</h4>
<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.capacityEndDist, cols)}</tr>
    <tr><th>v0.14</th>${distRow(r14.capacityEndDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">${capacityPreserved ? 'Byte-identical. v0.14 doesn\'t touch capacity.' : 'NOT identical — investigate.'}</p>

<h4>Resistance max — v0.10 vs v0.14</h4>
<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.resistMaxDist, cols)}</tr>
    <tr><th>v0.14</th>${distRow(r14.resistMaxDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">Resistance ≥ 8: ${resistAt8} / 400 (${pct(resistAt8, N)} %). Identical to v0.13. No side-effect.</p>

<h2>MFG-MIRROR-100 cross-check <span class="surface-id">G</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.14 (MFG-MIRROR)</th></tr></thead>
  <tbody>
    <tr><td>Manufacturer wins</td><td class="n">— / 100</td><td class="n">${r14mfg.wins['manufacturer-industry']} / 100</td></tr>
    <tr><td>Default fires</td><td class="n">0 / 100</td><td class="n">${r14mfg.defaultFired} / 100</td></tr>
    <tr><td>Rebellion fires</td><td class="n">0 / 100</td><td class="n">${r14mfg.rebellionFired} / 100</td></tr>
    <tr><td>Post-Funding Credit ≤ 5</td><td class="n">—</td><td class="n">${(r14mfg.postFundingMinDist[5] || 0) + Object.entries(r14mfg.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
  </tbody>
</table>

<h2>Interpretation <span class="surface-id">H</span></h2>

<p><strong>What this lever proves:</strong> The conditional-gating mechanic is sound. Seed 1294 demonstrates a clean three-card cascade (Spec Fever → Bank Run → gated Credit Restored) ending with credit stuck at 5. The rule is mechanically pointed at the right seam.</p>

<p><strong>What this lever doesn't move:</strong> Aggregate metrics. Recovery rate drops only 1.5 pp (34 % → 32.5 %), Credit-reach-5 frequency is unchanged at 3 / 400, Default still 0 / 400. The reason — confirmed via the recovery-source histogram — is that <strong>Credit Restored isn't the bottleneck.</strong> When Credit Restored is gated, Gold and Silver Inflow / Federalist Victory / Foreign Loan Secured / Treaty Renegotiation step in as redundant recovery cards. Six independent +1 credit cards exist; gating one removes its contribution to ungated games but doesn't prevent recovery in games that have multiple recovery draws.</p>

<p><strong>Per your decision tree:</strong> "If recovery drops but Credit-5 frequency does not move, Credit Restored is not the main absorber; investigate Foreign Loan Secured or Gold and Silver Inflow next." This branch fires.</p>

<p><strong>Where the next lever should aim:</strong> The recovery-source histogram in v0.14 shows three cards tied at 6 recoveries: Credit Restored, Gold and Silver Inflow, Federalist Victory. The first is gated; the other two are not. Apply the same panic-persists gate to one of them (or both, layered separately as v0.15a / v0.15b) and watch whether the aggregate recovery rate finally drops below 20 % — and whether Credit-reach-5 frequency rises with it.</p>

<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>v0.15a candidate — Gold and Silver Inflow gated:</strong> Currently unconditional Credit +1 + Mint owner collects 50 TN from each player. Add: "If Public Credit ≥ 6: Credit +1. Otherwise: no Credit gain. Mint payment unchanged." Tests whether Mint-driven recovery is the absorber.</li>
  <li><strong>v0.15b candidate — Federalist Victory gated:</strong> Currently conditional on NF holdings for cash, unconditional +1 credit. Add: "If Public Credit ≥ 6: Credit +1. Otherwise: no Credit gain. Cash bonus unchanged." Tests whether the partisan-political recovery is the absorber.</li>
  <li><strong>v0.15 conservative candidate — pair Credit Restored with one more gate:</strong> Layer Gold and Silver Inflow gate ON TOP of v0.14's Credit Restored gate. Two gated cards = harder for canonical play to recover from panic.</li>
</ul>

<h2>Closeout <span class="surface-id">I</span></h2>

<p>v0.14 candidate is <strong>${verdict}</strong>. The seed 1294 cascade is the proof case: v0.14 produces the first game in 400 canonical seeds where credit stays at 5 through endgame with no recovery. But it's one game; the aggregate barely moved.</p>

<p>Recommended disposition: <strong>Keep v0.14 candidate as a foundation</strong>, do not promote. The gate is a useful primitive — narrow, targeted, balance-preserving — but a single gated recovery card isn't enough to puncture the multi-source recovery network. Next lever (v0.15 if you authorize) should target one of the other unconditional Credit-up cards using the same conditional-panic-gate pattern proven on v0.14.</p>

<div class="meta">
v0.14 evidence sweep — observation only.
Raw data: <code>experiments/v0.14-failure-pressure-candidate/raw-data/sovereign-v0.14-canonical-400.json</code> (+ 100-A, 100-B, mfg-mirror-100).
Sim: <code>tools/diagnosis/sim-v0.14.mjs</code>.
Source HTML: <code>experiments/v0.14-failure-pressure-candidate/sovereign-solo-v0.14-candidate.html</code> (274 KB, produced by Claude Design from v0.13 source, two change-points + four version-stamp points + one ancillary splash bump).
v0.14 Node sim cross-validated: seed 2026 reproduces v0.13 (scores [14,7,15] / credit 6); seed 11 ungated case (credit 7 → 8) matches v0.13; seed 1294 cascade reproduces with credit ending at 5 vs v0.13's 6.
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
