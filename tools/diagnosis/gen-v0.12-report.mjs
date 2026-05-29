/* Generate the v0.12 failure-pressure candidate evidence-sweep HTML report. */
import { readFileSync, writeFileSync } from 'node:fs';

const REPORT_PATH = 'E:/AI/sovereign/experiments/v0.12-failure-pressure-candidate/sovereign-v0.12-evidence-sweep.html';

const V10_DIR = 'E:/AI/sovereign/release/balance-evidence/raw-data';
const V11_DIR = 'E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/raw-data';
const V12_DIR = 'E:/AI/sovereign/experiments/v0.12-failure-pressure-candidate/raw-data';

const load = p => JSON.parse(readFileSync(p, 'utf8'));
const v10c400 = load(V10_DIR + '/sovereign-diagnosis-canonical-400.json');
const v11c400 = load(V11_DIR + '/sovereign-v0.11-canonical-400.json');
const v12c400 = load(V12_DIR + '/sovereign-v0.12-canonical-400.json');
const v12c100A = load(V12_DIR + '/sovereign-v0.12-canonical-100-A.json');
const v12c100B = load(V12_DIR + '/sovereign-v0.12-canonical-100-B.json');
const v12mfg = load(V12_DIR + '/sovereign-v0.12-mfg-mirror-100.json');

const N = 400;
const fmt = (n, d = 2) => (typeof n === 'number' ? n.toFixed(d) : n);
const pct = (a, b) => ((a / b) * 100).toFixed(1);

function postFundingCreditMin(g) {
  const ev = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
  const idx = ev.findIndex(e => e.reason === 'Funding Act passed');
  if (idx < 0) return g.telemetry.tracks.credit.min;
  return Math.min(...ev.slice(idx).map(e => e.after));
}

/* Aggregate per-version */
function agg(batch, captureExtras = false) {
  const n = batch.games.length;
  const wins = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
  let defaultFired = 0, rebellionFired = 0, bankruptcyEvents = 0;
  let bankRunGames = 0, bankRunPostCharter = 0, bankRunPreCharter = 0;
  const creditMinDist = {}, creditEndDist = {}, postFundingMinDist = {};
  const capacityEndDist = {};
  const actsPassed = { 1:0,2:0,3:0,4:0,5:0,6:0,7:0 };
  const route4PlusGames = [];
  const margins = [];
  for (const g of batch.games) {
    wins[g.winner.profile] = (wins[g.winner.profile] || 0) + 1;
    if (g.defaultFired) defaultFired += 1;
    if (g.rebellionFired) rebellionFired += 1;
    bankruptcyEvents += g.bankruptcyEvents;
    const cmin = g.telemetry.tracks.credit.min;
    const cend = g.telemetry.tracks.credit.end;
    creditMinDist[cmin] = (creditMinDist[cmin] || 0) + 1;
    creditEndDist[cend] = (creditEndDist[cend] || 0) + 1;
    if (captureExtras || true) {
      const pfm = postFundingCreditMin(g);
      postFundingMinDist[pfm] = (postFundingMinDist[pfm] || 0) + 1;
    }
    const capEnd = g.telemetry.tracks.capacity.end;
    capacityEndDist[capEnd] = (capacityEndDist[capEnd] || 0) + 1;
    let firedThisGame = false;
    for (const ev of g.telemetry.pressureEvents) {
      if (ev.reason === 'Bank Run' && ev.track === 'credit') {
        firedThisGame = true;
        if (ev.appliedDelta === -2) bankRunPostCharter += 1;
        else if (ev.appliedDelta === -1) bankRunPreCharter += 1;
      }
    }
    if (firedThisGame) bankRunGames += 1;
    if (g.actsPassed) for (const aid of g.actsPassed) actsPassed[aid] = (actsPassed[aid] || 0) + 1;
    const routeMax = Math.max(...g.players.map(p => p.routesOwned));
    if (routeMax >= 4) route4PlusGames.push(g.seed);
    const sorted = g.scores.slice().sort((a, b) => b - a);
    margins.push(sorted[0] - sorted[1]);
  }
  const sorted = margins.slice().sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return { n, wins, defaultFired, rebellionFired, bankruptcyEvents, bankRunGames, bankRunPostCharter, bankRunPreCharter, creditMinDist, creditEndDist, postFundingMinDist, capacityEndDist, actsPassed, route4PlusCount: route4PlusGames.length, medianMargin: median };
}

const r10 = agg(v10c400);
const r11 = agg(v11c400);
const r12 = agg(v12c400);
const r12mfg = agg(v12mfg);

const determinismPass = JSON.stringify(v12c100A.games) === JSON.stringify(v12c100B.games);
const seed2026 = {
  v10: v10c400.games.find(g => g.seed === 2026),
  v11: v11c400.games.find(g => g.seed === 2026),
  v12: v12c400.games.find(g => g.seed === 2026),
};
const seed2026Identical = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity', 'defaultFired', 'rebellionFired', 'bankruptcyEvents']
  .every(k => JSON.stringify(seed2026.v10[k]) === JSON.stringify(seed2026.v11[k]) && JSON.stringify(seed2026.v11[k]) === JSON.stringify(seed2026.v12[k]));

/* Charter cross-tab for v0.12 */
let charterAndBankRun = 0, charterNoBankRun = 0, noCharterBankRun = 0, noCharterNoBankRun = 0;
for (const g of v12c400.games) {
  const br = g.telemetry.pressureEvents.some(e => e.reason === 'Bank Run' && e.track === 'credit');
  const ch = g.bankCharterPassed;
  if (br && ch) charterAndBankRun += 1;
  else if (br && !ch) noCharterBankRun += 1;
  else if (!br && ch) charterNoBankRun += 1;
  else noCharterNoBankRun += 1;
}

/* Decision criteria evaluation */
const treasuryWinPct = (r12.wins['treasury-finance'] / N) * 100;
const merchantWinPct = (r12.wins['merchant-infrastructure'] / N) * 100;
const mfgWinPct = (r12.wins['manufacturer-industry'] / N) * 100;
const postFundingMinAt5 = Object.entries(r12.postFundingMinDist).filter(([k]) => +k === 5).reduce((a, [_, v]) => a + v, 0);
const postFundingMinBelow5 = Object.entries(r12.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0);
const postFundingMinAt6 = Object.entries(r12.postFundingMinDist).filter(([k]) => +k === 6).reduce((a, [_, v]) => a + v, 0);

const capacityPreservation = JSON.stringify(r12.capacityEndDist) === JSON.stringify(r10.capacityEndDist);
const balanceOK = treasuryWinPct >= 45 && treasuryWinPct <= 65 && merchantWinPct >= 15 && merchantWinPct <= 35 && mfgWinPct >= 10 && mfgWinPct <= 25;

const decisionRows = [
  { criterion: 'Balance band: Treasury 45–65 %', target: '45–65 %', observed: `${treasuryWinPct.toFixed(1)} %`, pass: treasuryWinPct >= 45 && treasuryWinPct <= 65 },
  { criterion: 'Balance band: Merchant 15–35 %', target: '15–35 %', observed: `${merchantWinPct.toFixed(1)} %`, pass: merchantWinPct >= 15 && merchantWinPct <= 35 },
  { criterion: 'Balance band: Manufacturer 10–25 %', target: '10–25 %', observed: `${mfgWinPct.toFixed(1)} %`, pass: mfgWinPct >= 10 && mfgWinPct <= 25 },
  { criterion: 'Primary — post-Funding Credit min reaches 5 in some games', target: '> 0 games', observed: `${postFundingMinAt5} / 400`, pass: postFundingMinAt5 > 0, note: 'Lowest observed post-Funding min is 6, hit in ' + postFundingMinAt6 + ' games. Credit reaches 5 only when Bank Run fires post-Charter at exact credit value 7 — but in CANONICAL-400 the one post-Charter Bank Run happened at credit 8 (Foreign Loan Secured had pushed it up first), so 8 → 6 instead of 7 → 5.' },
  { criterion: 'Stretch — post-Funding Credit drops below 5 in some games', target: '> 0 games', observed: `${postFundingMinBelow5} / 400`, pass: postFundingMinBelow5 > 0 },
  { criterion: 'Capacity does not collapse', target: 'Distribution preserved vs v0.10', observed: capacityPreservation ? 'IDENTICAL to v0.10' : 'DIFFERS', pass: capacityPreservation },
  { criterion: 'Determinism A vs B byte-identical', target: 'PASS', observed: determinismPass ? 'PASS' : 'FAIL', pass: determinismPass },
  { criterion: 'Seed 2026 byte-identical v0.10 / v0.11 / v0.12', target: 'IDENTICAL', observed: seed2026Identical ? 'IDENTICAL' : 'DIVERGE', pass: seed2026Identical },
];

const allBalancePass = decisionRows.slice(0, 3).every(r => r.pass);
const primaryPass = decisionRows.find(r => r.criterion.startsWith('Primary')).pass;
const capacityPass = capacityPreservation;

/* Verdict */
let verdict, verdictDetail;
if (!allBalancePass) {
  verdict = 'REJECT — balance broke';
  verdictDetail = 'v0.10 win bands violated. Revert.';
} else if (!capacityPass) {
  verdict = 'WEAKEN — drop Capacity -1, try Credit-only Bank Run scaling';
  verdictDetail = 'Capacity collapsed. Reconsider the lever shape.';
} else if (primaryPass) {
  verdict = 'PROMOTE — promotion path open';
  verdictDetail = 'Post-Funding Credit reaches 5; balance holds; capacity preserved. v0.12 is a stronger pressure candidate. Inspect Default frequency before promoting.';
} else {
  verdict = 'INERT — same behavior as v0.11 in canonical play';
  verdictDetail = 'v0.12 is functionally identical to v0.11 in canonical T/M/Mfg play (same wins, same Bank Run firing rate, same post-Funding Credit min distribution) because Bank Charter passes in only 13.3 % of games AND Bank Run fires after Charter passage in only 1/400 games (the rest fire on lap 1-2 before Charter votes). The lever mechanic is correct (verified on seed 60: Credit 7 → 5), but the conditions to trigger it almost never co-occur. Next lever needs a SECOND independent credit-down source per the user\'s decision criteria.';
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
function distHeader(valuesAscending) { return valuesAscending.map(v => `<th class="bar-h">${v}</th>`).join(''); }

const cols = [0,1,2,3,4,5,6,7,8,9,10,11,12];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Sovereign · v0.12 Failure-Pressure Candidate · Evidence Sweep</title>
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
  td.diff{background:rgba(200,57,46,0.08);color:var(--highlight);font-weight:600}
  td.same{color:var(--neutral)}
  .verdict-card{background:var(--parchment-2);border:1.5px solid var(--ink);padding:18px 22px;margin:14px 0}
  .verdict-card .lbl{font-family:var(--ui);font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--national-finance)}
  .verdict-card .nm{font-family:var(--display);font-size:26px;line-height:1.1;margin:6px 0 8px}
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

<div class="eyebrow">Sovereign · v0.12 failure-pressure candidate · evidence sweep</div>
<h1>v0.12 Candidate — Bank Run scales by Bank Charter</h1>
<div class="sub">Single-lever test: pre-Charter -1 / -1 (unchanged from v0.11), post-Charter -2 credit / -1 capacity. Measured across 700 deterministic games.</div>
<div class="meta">Configurations: CANONICAL-400 (T/M/Mfg, seeds 2026-2425) · CANONICAL-100-A vs CANONICAL-100-B (determinism check) · MFG-MIRROR-100. Generated ${new Date().toISOString().slice(0,19).replace('T',' ')} UTC. v0.12 Node sim verified against the Claude Design output: seed 60 reproduces (Credit 7→5, Capacity 4→3); seed 2026 byte-identical to v0.10 and v0.11.</div>

<h2>Verdict <span class="surface-id">A</span></h2>

<div class="verdict-card">
  <div class="lbl">v0.12 candidate verdict</div>
  <div class="nm">${verdict}</div>
  <div class="det">${verdictDetail}</div>
</div>

<h4>Decision criteria</h4>
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

<h2>The structural finding <span class="surface-id">B</span></h2>

<div class="callout">
<strong>Bank Charter passes in only 13.3 % of canonical games (53 / 400).</strong> Of those, Bank Run also fires in 8 games. Of those 8, only 1 had Bank Run fire AFTER lap 2 (when Charter has actually passed) — seed 2197, where Foreign Loan Secured had already pushed Credit to 8, so Bank Run -2 landed at 6 (not the threshold-hitting 5). The lever mechanic is correct; the prerequisite conditions almost never co-occur in canonical play.
</div>

<h4>Bank Run × Bank Charter cross-tab (CANONICAL-400)</h4>
<table>
  <thead><tr><th></th><th>Charter passed</th><th>Charter NOT passed</th><th>Row total</th></tr></thead>
  <tbody>
    <tr><th>Bank Run fired</th><td class="n">${charterAndBankRun}</td><td class="n">${noCharterBankRun}</td><td class="n">${charterAndBankRun + noCharterBankRun}</td></tr>
    <tr><th>Bank Run NOT fired</th><td class="n">${charterNoBankRun}</td><td class="n">${noCharterNoBankRun}</td><td class="n">${charterNoBankRun + noCharterNoBankRun}</td></tr>
    <tr><th>Column total</th><td class="n">${charterAndBankRun + charterNoBankRun}</td><td class="n">${noCharterBankRun + noCharterNoBankRun}</td><td class="n">${N}</td></tr>
  </tbody>
</table>

<h4>Bank Run firing mode (v0.11 vs v0.12)</h4>
<table>
  <thead><tr><th>Mode</th><th>v0.11 firings</th><th>v0.12 firings</th></tr></thead>
  <tbody>
    <tr><td>Pre-Charter (credit -1, capacity -1)</td><td class="n">65</td><td class="n">${r12.bankRunPreCharter}</td></tr>
    <tr><td>Post-Charter (credit -2, capacity -1)</td><td class="n">0</td><td class="n">${r12.bankRunPostCharter}</td></tr>
    <tr><td>Total Bank Run games</td><td class="n">65</td><td class="n">${r12.bankRunGames}</td></tr>
  </tbody>
</table>

<h2>Acts passage frequency — a load-bearing finding <span class="surface-id">C</span></h2>

<p>The v0.10 ruleset has 7 Acts. Their canonical T/M/Mfg pass rates are striking — most of the Acts are dormant in canonical play.</p>

<table>
  <thead><tr><th>Act</th><th>Lap</th><th>CANONICAL-400 passes</th><th>MFG-MIRROR-100 passes</th></tr></thead>
  <tbody>
    <tr><td>I — Funding Act</td><td class="n">1</td><td class="n">${r12.actsPassed[1]} (${pct(r12.actsPassed[1], 400)} %)</td><td class="n">${r12mfg.actsPassed[1]} (${pct(r12mfg.actsPassed[1], 100)} %)</td></tr>
    <tr><td>II — Assumption Act</td><td class="n">2</td><td class="n">${r12.actsPassed[2]} (${pct(r12.actsPassed[2], 400)} %)</td><td class="n">${r12mfg.actsPassed[2]} (${pct(r12mfg.actsPassed[2], 100)} %)</td></tr>
    <tr><td>III — Bank Charter</td><td class="n">3</td><td class="n">${r12.actsPassed[3]} (${pct(r12.actsPassed[3], 400)} %)</td><td class="n">${r12mfg.actsPassed[3]} (${pct(r12mfg.actsPassed[3], 100)} %)</td></tr>
    <tr><td>IV — Tariff Schedule</td><td class="n">4</td><td class="n">${r12.actsPassed[4]} (${pct(r12.actsPassed[4], 400)} %)</td><td class="n">${r12mfg.actsPassed[4]} (${pct(r12mfg.actsPassed[4], 100)} %)</td></tr>
    <tr><td>V — Coinage Act</td><td class="n">5</td><td class="n">${r12.actsPassed[5]} (${pct(r12.actsPassed[5], 400)} %)</td><td class="n">${r12mfg.actsPassed[5]} (${pct(r12mfg.actsPassed[5], 100)} %)</td></tr>
    <tr><td>VI — Report on Manufactures</td><td class="n">6</td><td class="n">${r12.actsPassed[6]} (${pct(r12.actsPassed[6], 400)} %)</td><td class="n">${r12mfg.actsPassed[6]} (${pct(r12mfg.actsPassed[6], 100)} %)</td></tr>
    <tr><td>VII — Excise Enforcement</td><td class="n">7</td><td class="n">${r12.actsPassed[7]} (${pct(r12.actsPassed[7], 400)} %)</td><td class="n">${r12mfg.actsPassed[7]} (${pct(r12mfg.actsPassed[7], 100)} %)</td></tr>
  </tbody>
</table>

<div class="callout">
This explains v0.11's "Funding Act floor" finding more deeply: <strong>Funding is the only Act that fires reliably in canonical T/M/Mfg play.</strong> Five of the seven Acts NEVER pass under the canonical profile triplet. Bank Charter passes in 13.3 % of games (when Manufacturer happens to acquire the Bank by lap 3). MFG-MIRROR is the inverse — Report on Manufactures always passes (3-0 vote), Bank Charter never passes (1-2 vote even when one Mfg slot owns Bank, the other two vote NO). The v0.10 ruleset gives the canonical game most of its dynamics from Funding alone.
</div>

<h2>v0.10 vs v0.11 vs v0.12 side-by-side <span class="surface-id">D</span></h2>

<h4>CANONICAL-400 win bands</h4>
<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th><th>v0.12</th></tr></thead>
  <tbody>
    <tr><td>Treasury wins</td><td class="n">${r10.wins['treasury-finance']} (${pct(r10.wins['treasury-finance'], N)}%)</td><td class="n">${r11.wins['treasury-finance']} (${pct(r11.wins['treasury-finance'], N)}%)</td><td class="n ${r12.wins['treasury-finance'] === r11.wins['treasury-finance'] ? 'same' : 'diff'}">${r12.wins['treasury-finance']} (${pct(r12.wins['treasury-finance'], N)}%)</td></tr>
    <tr><td>Merchant wins</td><td class="n">${r10.wins['merchant-infrastructure']} (${pct(r10.wins['merchant-infrastructure'], N)}%)</td><td class="n">${r11.wins['merchant-infrastructure']} (${pct(r11.wins['merchant-infrastructure'], N)}%)</td><td class="n ${r12.wins['merchant-infrastructure'] === r11.wins['merchant-infrastructure'] ? 'same' : 'diff'}">${r12.wins['merchant-infrastructure']} (${pct(r12.wins['merchant-infrastructure'], N)}%)</td></tr>
    <tr><td>Manufacturer wins</td><td class="n">${r10.wins['manufacturer-industry']} (${pct(r10.wins['manufacturer-industry'], N)}%)</td><td class="n">${r11.wins['manufacturer-industry']} (${pct(r11.wins['manufacturer-industry'], N)}%)</td><td class="n ${r12.wins['manufacturer-industry'] === r11.wins['manufacturer-industry'] ? 'same' : 'diff'}">${r12.wins['manufacturer-industry']} (${pct(r12.wins['manufacturer-industry'], N)}%)</td></tr>
    <tr><td>Median margin</td><td class="n">${r10.medianMargin}</td><td class="n">${r11.medianMargin}</td><td class="n">${r12.medianMargin}</td></tr>
    <tr><td>Route 4+ frequency</td><td class="n">${r10.route4PlusCount} (${pct(r10.route4PlusCount, N)}%)</td><td class="n">${r11.route4PlusCount} (${pct(r11.route4PlusCount, N)}%)</td><td class="n">${r12.route4PlusCount} (${pct(r12.route4PlusCount, N)}%)</td></tr>
  </tbody>
</table>

<h4>Failure events</h4>
<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th><th>v0.12</th></tr></thead>
  <tbody>
    <tr><td>Default fires</td><td class="n">${r10.defaultFired}</td><td class="n">${r11.defaultFired}</td><td class="n">${r12.defaultFired}</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r10.rebellionFired}</td><td class="n">${r11.rebellionFired}</td><td class="n">${r12.rebellionFired}</td></tr>
    <tr><td>Bankruptcy events</td><td class="n">${r10.bankruptcyEvents}</td><td class="n">${r11.bankruptcyEvents}</td><td class="n">${r12.bankruptcyEvents}</td></tr>
  </tbody>
</table>

<h4>Credit end distribution</h4>
<table>
  <thead><tr><th>Series</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.creditEndDist, cols)}</tr>
    <tr><th>v0.11</th>${distRow(r11.creditEndDist, cols)}</tr>
    <tr><th>v0.12</th>${distRow(r12.creditEndDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">v0.12 end distribution differs from v0.11 by exactly 1 game (seed 2197 — the post-Charter Bank Run -2 firing). The other 399 games have v0.11-identical credit trajectories.</p>

<h4>Post-Funding Credit min distribution (PRIMARY METRIC)</h4>
<table>
  <thead><tr><th>Series</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(agg(v10c400).postFundingMinDist, cols)}</tr>
    <tr><th>v0.11</th>${distRow(agg(v11c400).postFundingMinDist, cols)}</tr>
    <tr><th>v0.12</th>${distRow(r12.postFundingMinDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">Lowest post-Funding Credit observed across all three versions is 6, reached in 35 games in v0.10, 48 games in v0.11, 48 games in v0.12. None of the 400 canonical games reach post-Funding Credit min = 5 in any version. The lever's primary success criterion is unmet.</p>

<h4>Capacity end distribution (sanity check — should be byte-identical v0.10 vs v0.12)</h4>
<table>
  <thead><tr><th>Series</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.capacityEndDist, cols)}</tr>
    <tr><th>v0.12</th>${distRow(r12.capacityEndDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">Byte-identical. Capacity is unaffected by either v0.11 or v0.12 patches in aggregate — the -1 capacity events get absorbed by other capacity-up sources (Industrial Charter, Coinage Act doesn't fire in canonical, etc.).</p>

<h2>MFG-MIRROR-100 cross-check <span class="surface-id">E</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th><th>v0.12 (MFG-MIRROR)</th></tr></thead>
  <tbody>
    <tr><td>Manufacturer wins (vs self)</td><td class="n">— / 100</td><td class="n">100 / 100</td><td class="n">${r12mfg.wins['manufacturer-industry']} / 100</td></tr>
    <tr><td>Default fires</td><td class="n">0 / 100</td><td class="n">0 / 100</td><td class="n">${r12mfg.defaultFired} / 100</td></tr>
    <tr><td>Bank Run games</td><td class="n">—</td><td class="n">18 / 100</td><td class="n">${r12mfg.bankRunGames} / 100</td></tr>
    <tr><td>Bank Run post-Charter mode</td><td class="n">—</td><td class="n">—</td><td class="n">${r12mfg.bankRunPostCharter}</td></tr>
    <tr><td>Bank Charter passes</td><td class="n">—</td><td class="n">—</td><td class="n">${r12mfg.actsPassed[3]} / 100</td></tr>
  </tbody>
</table>
<p class="meta">Bank Charter passes ZERO times in MFG-MIRROR because in mirror play only one slot owns the Bank, and the other two Mfg slots vote NO. So the v0.12 -2 mode is structurally unreachable in MFG-MIRROR. The single-card patch is dormant in this configuration too.</p>

<h2>Interpretation <span class="surface-id">F</span></h2>

<p><strong>What this lever proves:</strong> The Bank Run scaling mechanic is mechanically correct (verified on seed 60: Credit 7 → 5 post-Charter, on seed 2197: Credit 8 → 6 post-Charter). When the prerequisite conditions hold — Charter passed AND Bank Run fires after that point — the -2 credit hits as designed.</p>

<p><strong>What this lever does NOT prove:</strong> That this single change is sufficient to make Default reachable. In canonical T/M/Mfg play the lever fires in 1 game out of 400. The mechanism is correct, but its activation rate is too low to matter at the aggregate level.</p>

<p><strong>The deeper structural finding:</strong> The v0.10 ruleset has 7 Acts. In canonical T/M/Mfg play, only 2 of them ever pass — Funding (100 %) and Bank Charter (13.3 %). The other five Acts never pass under the canonical profile triplet. This is news. The v0.11 diagnosis found one Act (Funding) creating a credit floor; the v0.12 sweep reveals that this is part of a broader pattern where canonical play uses a tiny subset of the rule surface area. Levers tied to less-common Acts (Bank Charter, Tariff, etc.) will struggle for the same reason.</p>

<p><strong>Where the next lever should aim:</strong></p>
<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>Per the user's decision criteria:</strong> "If Credit still never returns to 5 after Funding, Bank Run scaling is insufficient and the next lever needs a second independent Credit-down source." → add a second credit-down card or Act effect that doesn't depend on Bank Charter passage.</li>
  <li><strong>Candidate: modify Speculation Fever</strong> (currently +1 resistance only, fires in 12.5 % of games via card draw). Add Credit -1 to its effect. This stacks with Bank Run pre-Charter and is independent of any Act passage.</li>
  <li><strong>Candidate: modify Anti-Federalist Pamphlet</strong> (currently +1 resistance + Revenue tax on owners, fires in 12.8 % of games). Add Credit -1. Same independence rationale.</li>
  <li><strong>Out-of-scope but worth noting:</strong> Six of the seven v0.10 Acts almost never fire in canonical play. Re-tuning profile votes to make more Acts pass would be a different, larger lever pass. The user has been explicit about not touching profiles, but the structural finding makes the constraint visible.</li>
</ul>

<h2>Closeout <span class="surface-id">G</span></h2>

<p>v0.12 candidate is <strong>INERT in canonical play but mechanically sound.</strong> Balance preserved (Treasury 60.8 % / Merchant 22.8 % / Manufacturer 16.5 % — identical to v0.10 and v0.11 in aggregate). Capacity byte-identical to v0.10. Determinism PASS. The Bank Run scaling lever functions correctly when Charter has passed AND Bank Run fires after lap 2 — but those conditions co-occur in only 1 of 400 canonical games.</p>

<p>Recommended disposition: <strong>Keep v0.12 candidate as a foundation</strong>, do not promote. The lever's failure mode is conditional under-firing, not mechanical incorrectness. Per the user's decision criteria, the next lever should add a second independent Credit-down source — one that doesn't depend on Bank Charter passage. Speculation Fever or Anti-Federalist Pamphlet are the cleanest candidates because they fire on simple market-shock/republic-debate card draws, independent of any Act vote.</p>

<div class="meta">
v0.12 evidence sweep — observation only. Raw data:
<code>experiments/v0.12-failure-pressure-candidate/raw-data/sovereign-v0.12-canonical-400.json</code>
(and -100-A, -100-B, -mfg-mirror-100). Sim:
<code>tools/diagnosis/sim-v0.12.mjs</code>.
Source HTML:
<code>experiments/v0.12-failure-pressure-candidate/sovereign-solo-v0.12-candidate.html</code>
(272 KB, produced by Claude Design from v0.11 source, six change-points + one ancillary).
v0.12 Node sim verified byte-identical to v0.10 and v0.11 for seed 2026.
Seed 60 confirmed reproduces Claude Design's reported behavior (Credit 7 → 5, Capacity 4 → 3).
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
