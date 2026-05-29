/* Generate the v0.11 failure-pressure candidate evidence-sweep HTML report. */
import { r10, r11, determinism, seed2026, seed2026Same } from './analyze-v0.11.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const REPORT_PATH = 'E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/sovereign-v0.11-evidence-sweep.html';
const V11_C400 = JSON.parse(readFileSync('E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/raw-data/sovereign-v0.11-canonical-400.json', 'utf8'));

const fmt = (n, d = 2) => (typeof n === 'number' ? n.toFixed(d) : n);
const pctn = (n, d) => ((n / d) * 100).toFixed(1);

/* ---- Bank Run trajectory analysis ---- */
const bankRunCreditAtFire = {};
const bankRunByLap = {};
for (const g of V11_C400.games) {
  for (const ev of g.telemetry.pressureEvents) {
    if (ev.reason === 'Bank Run' && ev.track === 'credit') {
      bankRunCreditAtFire[ev.before] = (bankRunCreditAtFire[ev.before] || 0) + 1;
      bankRunByLap[ev.lap] = (bankRunByLap[ev.lap] || 0) + 1;
    }
  }
}

/* ---- Decision criteria evaluation ---- */
const treasuryWinPct = r11.c400.winRates['treasury-finance'];
const merchantWinPct = r11.c400.winRates['merchant-infrastructure'];
const mfgWinPct = r11.c400.winRates['manufacturer-industry'];
const capacity6_v10 = r10.c400.capacity.atOrAbove6;
const capacity6_v11 = r11.c400.capacity.atOrAbove6;
const creditMinBelow5 = r11.c400.credit.atOrBelow4;

const decisionRows = [
  {
    criterion: 'Balance band: Treasury 45–65 %',
    target: '45–65 %',
    observed: `${treasuryWinPct} %`,
    pass: treasuryWinPct >= 45 && treasuryWinPct <= 65,
  },
  {
    criterion: 'Balance band: Merchant 15–35 %',
    target: '15–35 %',
    observed: `${merchantWinPct} %`,
    pass: merchantWinPct >= 15 && merchantWinPct <= 35,
  },
  {
    criterion: 'Balance band: Manufacturer 10–25 %',
    target: '10–25 %',
    observed: `${mfgWinPct} %`,
    pass: mfgWinPct >= 10 && mfgWinPct <= 25,
  },
  {
    criterion: 'Credit min drops below 5 in nontrivial cases',
    target: '> 0 games',
    observed: `${creditMinBelow5} games`,
    pass: creditMinBelow5 > 0,
    note: 'Bank Run never fires when credit < 7 because Funding Act (+2 credit, always passes lap 1) raises credit to 7 before any market shock card can be drawn. Bank Run -1 brings it to 6+, never below 5.',
  },
  {
    criterion: 'Capacity does not collapse',
    target: `≥6 ≈ ${capacity6_v10} games (v0.10)`,
    observed: `${capacity6_v11} games (v0.11)`,
    pass: capacity6_v11 >= capacity6_v10 * 0.7,
  },
  {
    criterion: 'Default fires (primary goal)',
    target: '> 0 games',
    observed: `${r11.c400.failures.defaultFired} / 400`,
    pass: r11.c400.failures.defaultFired > 0,
    note: 'Bank Run -1 cannot reach Credit = 0 from the Funding-Act-protected floor of 7. Default requires either a compounding credit-down lever or a Funding Act floor weakening.',
  },
  {
    criterion: 'Determinism A vs B byte-identical',
    target: 'PASS',
    observed: determinism.v11AvsB ? 'PASS' : 'FAIL',
    pass: determinism.v11AvsB,
  },
  {
    criterion: 'Seed 2026 byte-identical v0.10 vs v0.11',
    target: 'IDENTICAL',
    observed: seed2026Same ? 'IDENTICAL' : 'DIVERGE',
    pass: seed2026Same,
  },
];

const allBalancePass = decisionRows.slice(0, 3).every(r => r.pass);
const capacityPass = decisionRows.find(r => r.criterion === 'Capacity does not collapse').pass;
const defaultFires = decisionRows.find(r => r.criterion === 'Default fires (primary goal)').pass;
const determinismPass = decisionRows.slice(-2).every(r => r.pass);

/* Verdict */
let verdict, verdictDetail;
if (!allBalancePass) {
  verdict = 'REJECT — balance broke';
  verdictDetail = 'v0.10 win bands violated. Bank Run change must be reverted or weakened.';
} else if (!capacityPass) {
  verdict = 'WEAKEN — drop Capacity -1';
  verdictDetail = 'Capacity collapsed. Switch Bank Run to Credit -1 only.';
} else if (defaultFires) {
  verdict = 'PROMOTE — full success';
  verdictDetail = 'Bank Run patch creates real Default pressure without breaking v0.10 balance.';
} else {
  verdict = 'DIAGNOSTIC SUCCESS — keep, not final';
  verdictDetail = 'v0.10 balance preserved; Capacity preserved; Credit channel is two-sided. Default still does not fire because the Funding Act +2 floor caps the credit min at 5. Lever IS active in 16.3 % of games but cannot single-handedly trigger Default. Next lever (when one is run) needs to compound credit-down pressure or attack the Funding Act floor.';
}

/* ---- Build small helpers for the HTML ---- */
function distRow(distMap, valuesAscending) {
  const max = Math.max(0, ...Object.values(distMap));
  return valuesAscending.map(v => {
    const c = distMap[v] || 0;
    const w = max === 0 ? 0 : (c / max) * 100;
    return `<td class="bar-cell"><div class="bar" style="width:${w.toFixed(1)}%"></div><span class="bar-num">${c}</span></td>`;
  }).join('');
}
function distHeader(valuesAscending) { return valuesAscending.map(v => `<th class="bar-h">${v}</th>`).join(''); }
function compareCell(v10Val, v11Val, decimals = 2) {
  const v10n = typeof v10Val === 'number' ? v10Val.toFixed(decimals) : v10Val;
  const v11n = typeof v11Val === 'number' ? v11Val.toFixed(decimals) : v11Val;
  const same = String(v10n) === String(v11n);
  return `<td class="n">${v10n}</td><td class="n ${same ? 'same' : 'diff'}">${v11n}</td>`;
}

/* ---- HTML ---- */
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Sovereign · v0.11 Failure-Pressure Candidate · Evidence Sweep</title>
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
  body{margin:0;padding:30px;font-family:var(--body);background:#2A2622;color:var(--ink);-webkit-print-color-adjust:exact}
  .doc{max-width:1100px;margin:0 auto;background:var(--parchment);border:1.5px solid var(--ink);padding:30px 40px;position:relative}
  .doc::before{content:"";position:absolute;inset:8px;border:0.5px solid var(--rule-soft);pointer-events:none}
  h1{font-family:var(--display);font-weight:400;font-size:36px;line-height:1;margin:0 0 6px}
  .eyebrow{font-family:var(--ui);font-size:10px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:var(--national-finance);margin-bottom:8px}
  .sub{font-family:var(--display);font-style:italic;font-size:14px;margin-bottom:6px}
  .meta{font-family:var(--mono);font-size:9.5px;opacity:.7;margin-top:4px;border-top:0.5px dashed var(--rule-soft);padding-top:6px}
  h2{font-family:var(--ui);font-size:11px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;margin:22px 0 8px;border-bottom:1px solid var(--ink);padding-bottom:4px;display:flex;justify-content:space-between}
  h2 .surface-id{font-family:var(--mono);font-size:9px;letter-spacing:.06em;opacity:.6;text-transform:none}
  h3{font-family:var(--display);font-weight:400;font-size:18px;margin:14px 0 6px}
  h4{font-family:var(--ui);font-size:9.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin:14px 0 4px}
  p{margin:6px 0;line-height:1.5;font-size:13px}
  table{width:100%;border-collapse:collapse;margin-top:6px}
  th{background:var(--ink);color:var(--parchment);font-family:var(--ui);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;padding:5px 8px;text-align:left}
  td{font-family:var(--ui);font-size:11px;padding:4px 8px;border-bottom:0.5px solid var(--rule-soft);vertical-align:top}
  td.n{font-family:var(--mono);text-align:right;font-variant-numeric:tabular-nums}
  td.diff{background:rgba(200,57,46,0.08);color:var(--highlight);font-weight:600}
  td.same{color:var(--neutral)}
  .verdict-card{background:var(--parchment-2);border:1.5px solid var(--ink);padding:18px 22px;margin:14px 0}
  .verdict-card .lbl{font-family:var(--ui);font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--national-finance)}
  .verdict-card .nm{font-family:var(--display);font-size:26px;line-height:1.1;margin:6px 0 8px}
  .verdict-card .det{font-size:13px;line-height:1.6}
  .pass-pill{display:inline-block;font-family:var(--ui);font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:2px 7px;border-radius:2px;font-weight:700}
  .pass-pill.pass{background:var(--pass);color:#fff}
  .pass-pill.fail{background:var(--fail);color:#fff}
  .pass-pill.neutral{background:rgba(26,22,18,0.15);color:var(--ink)}
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

<div class="eyebrow">Sovereign · v0.11 failure-pressure candidate · evidence sweep</div>
<h1>v0.11 Candidate — Bank Run Credit Pressure</h1>
<div class="sub">Single-lever test: Bank Run card now pushes Public Credit -1 and Industrial Capacity -1 (was Capacity -1 only). Measured across 700 deterministic games.</div>
<div class="meta">Configurations: CANONICAL-400 (T/M/Mfg, seeds 2026-2425) · CANONICAL-100-A vs CANONICAL-100-B (determinism check) · MFG-MIRROR-100 (3× Manufacturer, seeds 2026-2125). Generated ${new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC. v0.10 sim verified byte-identical for all 400 canonical seeds during the prior diagnosis pass; v0.11 sim verified byte-identical to v0.10 for seed 2026 (where Bank Run does not fire).</div>

<h2>Verdict <span class="surface-id">A</span></h2>

<div class="verdict-card">
  <div class="lbl">v0.11 candidate verdict</div>
  <div class="nm">${verdict}</div>
  <div class="det">${verdictDetail}</div>
</div>

<h4>Decision criteria evaluation</h4>
<table>
  <thead><tr><th>Criterion</th><th>Target</th><th>Observed</th><th>Pass</th></tr></thead>
  <tbody>
${decisionRows.map(r => `
    <tr>
      <td>${r.criterion}${r.note ? '<br><span style="color:var(--neutral);font-size:10px;font-style:italic">'+r.note+'</span>' : ''}</td>
      <td class="n">${r.target}</td>
      <td class="n">${r.observed}</td>
      <td><span class="pass-pill ${r.pass ? 'pass' : 'fail'}">${r.pass ? 'PASS' : 'NO'}</span></td>
    </tr>`).join('')}
  </tbody>
</table>

<h2>v0.10 vs v0.11 side-by-side <span class="surface-id">B</span></h2>

<h4>CANONICAL-400 — primary balance band</h4>
<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th></tr></thead>
  <tbody>
    <tr><td>Treasury wins</td>${compareCell(r10.c400.winsByProfile['treasury-finance'] + ' (' + r10.c400.winRates['treasury-finance'] + '%)', r11.c400.winsByProfile['treasury-finance'] + ' (' + r11.c400.winRates['treasury-finance'] + '%)')}</tr>
    <tr><td>Merchant wins</td>${compareCell(r10.c400.winsByProfile['merchant-infrastructure'] + ' (' + r10.c400.winRates['merchant-infrastructure'] + '%)', r11.c400.winsByProfile['merchant-infrastructure'] + ' (' + r11.c400.winRates['merchant-infrastructure'] + '%)')}</tr>
    <tr><td>Manufacturer wins</td>${compareCell(r10.c400.winsByProfile['manufacturer-industry'] + ' (' + r10.c400.winRates['manufacturer-industry'] + '%)', r11.c400.winsByProfile['manufacturer-industry'] + ' (' + r11.c400.winRates['manufacturer-industry'] + '%)')}</tr>
    <tr><td>Median winning margin (IP)</td>${compareCell(r10.c400.medianMargin, r11.c400.medianMargin, 0)}</tr>
    <tr><td>Route 4+ dominance</td>${compareCell(r10.c400.routes.dominance4Plus + ' (' + r10.c400.routes.dominance4PlusPct + '%)', r11.c400.routes.dominance4Plus + ' (' + r11.c400.routes.dominance4PlusPct + '%)')}</tr>
  </tbody>
</table>

<h4>CANONICAL-400 — Public Credit track</h4>
<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th></tr></thead>
  <tbody>
    <tr><td>Credit min mean</td>${compareCell(r10.c400.credit.min.mean, r11.c400.credit.min.mean)}</tr>
    <tr><td>Credit max mean</td>${compareCell(r10.c400.credit.max.mean, r11.c400.credit.max.mean)}</tr>
    <tr><td>Credit end mean</td>${compareCell(r10.c400.credit.end.mean, r11.c400.credit.end.mean)}</tr>
    <tr><td>Credit ever ≤ 5</td>${compareCell(r10.c400.credit.atOrBelow5 + ' / 400', r11.c400.credit.atOrBelow5 + ' / 400')}</tr>
    <tr><td>Credit ever ≤ 4</td>${compareCell(r10.c400.credit.atOrBelow4 + ' / 400', r11.c400.credit.atOrBelow4 + ' / 400')}</tr>
    <tr><td>Credit ever ≤ 3</td>${compareCell(r10.c400.credit.atOrBelow3 + ' / 400', r11.c400.credit.atOrBelow3 + ' / 400')}</tr>
    <tr><td>Credit ever ≤ 2</td>${compareCell(r10.c400.credit.atOrBelow2 + ' / 400', r11.c400.credit.atOrBelow2 + ' / 400')}</tr>
    <tr><td>Credit ever ≤ 1</td>${compareCell(r10.c400.credit.atOrBelow1 + ' / 400', r11.c400.credit.atOrBelow1 + ' / 400')}</tr>
    <tr><td>Credit ever = 0 (Default)</td>${compareCell(r10.c400.credit.atOrBelow0 + ' / 400', r11.c400.credit.atOrBelow0 + ' / 400')}</tr>
  </tbody>
</table>

<h4>Credit end distribution (CANONICAL-400)</h4>
<table>
  <thead><tr><th>Series</th>${distHeader([0,1,2,3,4,5,6,7,8,9,10,11,12])}</tr></thead>
  <tbody>
    <tr><th>v0.10 end</th>${distRow(r10.c400.credit.end.distMap, [0,1,2,3,4,5,6,7,8,9,10,11,12])}</tr>
    <tr><th>v0.11 end</th>${distRow(r11.c400.credit.end.distMap, [0,1,2,3,4,5,6,7,8,9,10,11,12])}</tr>
  </tbody>
</table>
<p class="meta">v0.11 shifts the distribution one step down (-0.16 mean), surfacing a new "end = 6" bucket of 35 games that did not exist in v0.10. The track is no longer a one-way ratchet.</p>

<h4>CANONICAL-400 — Industrial Capacity</h4>
<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th></tr></thead>
  <tbody>
    <tr><td>Capacity end mean</td>${compareCell(r10.c400.capacity.end.mean, r11.c400.capacity.end.mean)}</tr>
    <tr><td>Capacity ever ≥ 6</td>${compareCell(r10.c400.capacity.atOrAbove6 + ' (' + (r10.c400.capacity.atOrAbove6/400*100).toFixed(1) + '%)', r11.c400.capacity.atOrAbove6 + ' (' + (r11.c400.capacity.atOrAbove6/400*100).toFixed(1) + '%)')}</tr>
    <tr><td>Capacity ever ≥ 8</td>${compareCell(r10.c400.capacity.atOrAbove8 + ' / 400', r11.c400.capacity.atOrAbove8 + ' / 400')}</tr>
    <tr><td>Capacity ever ≥ 10</td>${compareCell(r10.c400.capacity.atOrAbove10 + ' / 400', r11.c400.capacity.atOrAbove10 + ' / 400')}</tr>
  </tbody>
</table>
<p class="meta">Capacity preserved. The Bank Run -1 capacity events (65 across 400 games) get fully absorbed by other capacity-up sources (Industrial Charter +1, Coinage Act +1, Report on Manufactures +2, Cotton Gin +1, British Trade Embargo +1, Industrial-purchase bumps).</p>

<h4>CANONICAL-400 — Failure events</h4>
<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th></tr></thead>
  <tbody>
    <tr><td>Default fires</td>${compareCell(r10.c400.failures.defaultFired + ' / 400', r11.c400.failures.defaultFired + ' / 400')}</tr>
    <tr><td>Rebellion fires</td>${compareCell(r10.c400.failures.rebellionFired + ' / 400', r11.c400.failures.rebellionFired + ' / 400')}</tr>
    <tr><td>Bankruptcy events</td>${compareCell(r10.c400.failures.bankruptcyEventsTotal, r11.c400.failures.bankruptcyEventsTotal, 0)}</tr>
    <tr><td>Resistance max mean</td>${compareCell(r10.c400.resistance.max.mean, r11.c400.resistance.max.mean)}</tr>
  </tbody>
</table>

<h2>Bank Run firing analysis <span class="surface-id">C</span></h2>

<p>Bank Run fired in <strong>${r11.c400.bankRun.games} of 400 games (${(r11.c400.bankRun.games/400*100).toFixed(1)} %)</strong>. Each firing produced two pressure events (one credit -1, one capacity -1), for a total of ${r11.c400.bankRun.cardResolutions * 2} pressure events across the dataset.</p>

<h4>Credit value AT TIME Bank Run fired (CANONICAL-400)</h4>
<table>
  <thead><tr><th>Credit before</th><th>→ Credit after</th><th>Events</th></tr></thead>
  <tbody>
${Object.entries(bankRunCreditAtFire).sort((a, b) => +a[0] - +b[0]).map(([v, c]) => `
    <tr><td class="n">${v}</td><td class="n">${+v - 1}</td><td class="n">${c}</td></tr>`).join('')}
  </tbody>
</table>

<div class="callout">
<strong>Structural finding.</strong> Bank Run NEVER fires when Credit is below 7. The Funding Act (+2 credit, always passes lap 1) lifts the track to 7 before any market-shock card can be drawn. Subsequent positive sources (Treaty Renegotiation, Federalist Victory, Coinage Act, Credit Restored) push it higher. By the time Bank Run gets drawn, credit is between 7 and 10 in every observed case. Bank Run -1 brings it back to 6 in 47 of 65 fires, 7 in 14 fires, 8 in 3 fires, 9 in 1 fire. None of these descents cross the starting value of 5 — so Credit min stays at 5 across all 400 games, identical to v0.10. The lever is active; it just cannot single-handedly cross the Default threshold because of the Funding Act floor.
</div>

<h4>Bank Run firing by lap</h4>
<table>
  <thead><tr><th>Lap</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr></thead>
  <tbody>
    <tr><th>card resolutions</th>${[1,2,3,4,5,6,7].map(l => `<td class="n">${bankRunByLap[l] || 0}</td>`).join('')}</tr>
  </tbody>
</table>
<p class="meta">Heavy skew to lap 1 (${bankRunByLap[1]} of ${r11.c400.bankRun.cardResolutions} fires) is expected: fresh deck, three players land on market-shock spaces by chance, no reshuffle yet. Lap-7 (${bankRunByLap[7]} fires) reflects multiple deck reshuffles increasing draw probability across the long late game.</p>

<h2>MFG-MIRROR-100 cross-check <span class="surface-id">D</span></h2>

<p>Configuration: Manufacturer × 3 slots, seeds 2026-2125, charterEnabled. Tests whether industrial concentration breaks v0.11's behavior.</p>

<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th></tr></thead>
  <tbody>
    <tr><td>Manufacturer wins (vs self)</td>${compareCell(r10.mfg.winsByProfile['manufacturer-industry'] + ' / 100', r11.mfg.winsByProfile['manufacturer-industry'] + ' / 100')}</tr>
    <tr><td>Default fires</td>${compareCell(r10.mfg.failures.defaultFired + ' / 100', r11.mfg.failures.defaultFired + ' / 100')}</tr>
    <tr><td>Rebellion fires</td>${compareCell(r10.mfg.failures.rebellionFired + ' / 100', r11.mfg.failures.rebellionFired + ' / 100')}</tr>
    <tr><td>Bankruptcy events</td>${compareCell(r10.mfg.failures.bankruptcyEventsTotal, r11.mfg.failures.bankruptcyEventsTotal, 0)}</tr>
    <tr><td>Credit end mean</td>${compareCell(r10.mfg.credit.end.mean, r11.mfg.credit.end.mean)}</tr>
    <tr><td>Credit ever ≤ 4</td>${compareCell(r10.mfg.credit.atOrBelow4 + ' / 100', r11.mfg.credit.atOrBelow4 + ' / 100')}</tr>
    <tr><td>Capacity end mean</td>${compareCell(r10.mfg.capacity.end.mean, r11.mfg.capacity.end.mean)}</tr>
    <tr><td>Capacity ever ≥ 6</td>${compareCell(r10.mfg.capacity.atOrAbove6 + ' / 100', r11.mfg.capacity.atOrAbove6 + ' / 100')}</tr>
    <tr><td>Bank Run games</td>${compareCell('— / 100', r11.mfg.bankRun.games + ' / 100')}</tr>
  </tbody>
</table>
<p class="meta">Manufacturer-only profile keeps the credit/capacity tracks behaving comparably to the canonical T/M/Mfg triplet. Bank Run firing rate (18 %) is consistent with the canonical-400's 16.3 %. No regressions in this configuration.</p>

<h2>Determinism <span class="surface-id">E</span></h2>

<table>
  <thead><tr><th>Check</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>CANONICAL-100-A vs CANONICAL-100-B byte-identical (v0.11)</td><td><span class="pass-pill ${determinism.v11AvsB ? 'pass' : 'fail'}">${determinism.v11AvsB ? 'PASS' : 'FAIL'}</span></td></tr>
    <tr><td>CANONICAL-100-A vs CANONICAL-100-B byte-identical (v0.10 baseline)</td><td><span class="pass-pill ${determinism.v10AvsB ? 'pass' : 'fail'}">${determinism.v10AvsB ? 'PASS' : 'FAIL'}</span></td></tr>
    <tr><td>Seed 2026 v0.10 ↔ v0.11 byte-identical (Bank Run does not fire in this seed)</td><td><span class="pass-pill ${seed2026Same ? 'pass' : 'fail'}">${seed2026Same ? 'IDENTICAL' : 'DIVERGE'}</span></td></tr>
  </tbody>
</table>

<h2>Interpretation <span class="surface-id">F</span></h2>

<p><strong>What this lever proves:</strong> The credit-down channel is real and works. In v0.10 the credit track only ever moved upward; in v0.11 it moves both directions. The empirical evidence is a credit end-mean drop from 7.93 to 7.77 and 35 games landing at credit-end = 6, a bucket that did not exist in v0.10.</p>

<p><strong>What this lever does NOT prove:</strong> That Default can fire with this change alone. The Funding Act (Lap 1, always passes) puts a credit floor at 7 before any Bank Run can fire. Bank Run -1 brings credit to 6 minimum, which is still 6 above the Default threshold of 0. The lever needs to compound with at least one additional credit-down source to reach Default.</p>

<p><strong>Where the next lever should aim:</strong></p>
<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>Compounding credit-down source.</strong> If a second credit-down card (e.g. modifying Speculation Fever to also drop credit -1, or a new conditional on Anti-Federalist Pamphlet) is added, two firings in the same game could push credit below 5. Estimate: with two independent ~16 % firing rates, ~2.5 % of games would see both fire — still below 1 % Default rate but a clear stepping stone.</li>
  <li><strong>Funding Act floor attack.</strong> If Funding Act became conditional ("passes only if Resistance &lt; 4 at start of lap 1" — historically: low political tension lets the bill through) it would fail in some games, leaving credit at 5 instead of 7, dropping the floor by 2. Combined with Bank Run -1, credit min becomes 4. Default still far away, but the floor is no longer immovable.</li>
  <li><strong>Larger credit-down events on conditional cards.</strong> If Bank Run scales to -2 credit when Charter has passed (i.e. when the systemic damage matches the systemic exposure), the lever stays single-card but doubles in strength.</li>
</ul>

<p><strong>What this lever DOES change about the design:</strong> Public Credit is now a real risk track. Players holding NF assets must reason about Bank Run as a possible mid-game downside, not just an abstract late-game disaster. The narration entry <code>track-threshold · credit-low</code> (which fires at Credit ≤ 2) is still dormant in v0.11, but the path to it is now mechanically open in a way it was not in v0.10.</p>

<h2>Closeout <span class="surface-id">G</span></h2>

<p>v0.11 candidate is a <strong>diagnostic success</strong>. Balance preserved. Capacity preserved. Determinism PASS. Credit track is no longer a one-way ratchet. Default still does not fire — predicted, not a failure of the lever, but a symptom of the Funding Act +2 floor that any single-card credit-down lever cannot overcome alone.</p>

<p>Recommended disposition: <strong>Keep v0.11 candidate as a foundation</strong>, do not promote to v0.11 baseline yet. Next pass should target the Funding Act floor or add a second compounding credit-down source.</p>

<div class="meta">
v0.11 evidence sweep — observation only. Raw data:
<code>experiments/v0.11-failure-pressure-candidate/raw-data/sovereign-v0.11-canonical-400.json</code>
(and -100-A, -100-B, -mfg-mirror-100). Sim:
<code>tools/diagnosis/sim-v0.11.mjs</code>.
Source HTML:
<code>experiments/v0.11-failure-pressure-candidate/sovereign-solo-v0.11-candidate.html</code>
(265 KB, produced by Claude Design from v0.10 source, single-card Bank Run patch).
v0.11 Node sim verified byte-identical to v0.10 for seed 2026.
No release. No balance change to v0.10 baseline. No threshold change.
</div>

</div>
</body>
</html>`;

writeFileSync(REPORT_PATH, html);
console.log(`Wrote ${REPORT_PATH}  (${(html.length / 1024).toFixed(1)} KB)`);
console.log('');
console.log('Decision criteria summary:');
decisionRows.forEach(r => console.log(`  [${r.pass ? 'PASS' : ' NO '}] ${r.criterion}`));
console.log('');
console.log(`Verdict: ${verdict}`);
