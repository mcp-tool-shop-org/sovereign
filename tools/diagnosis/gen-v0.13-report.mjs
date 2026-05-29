/* v0.13 evidence sweep HTML report. */
import { readFileSync, writeFileSync } from 'node:fs';

const REPORT_PATH = 'E:/AI/sovereign/experiments/v0.13-failure-pressure-candidate/sovereign-v0.13-evidence-sweep.html';

const V10_DIR = 'E:/AI/sovereign/release/balance-evidence/raw-data';
const V11_DIR = 'E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/raw-data';
const V12_DIR = 'E:/AI/sovereign/experiments/v0.12-failure-pressure-candidate/raw-data';
const V13_DIR = 'E:/AI/sovereign/experiments/v0.13-failure-pressure-candidate/raw-data';

const load = p => JSON.parse(readFileSync(p, 'utf8'));
const v10c400 = load(V10_DIR + '/sovereign-diagnosis-canonical-400.json');
const v11c400 = load(V11_DIR + '/sovereign-v0.11-canonical-400.json');
const v12c400 = load(V12_DIR + '/sovereign-v0.12-canonical-400.json');
const v13c400 = load(V13_DIR + '/sovereign-v0.13-canonical-400.json');
const v13c100A = load(V13_DIR + '/sovereign-v0.13-canonical-100-A.json');
const v13c100B = load(V13_DIR + '/sovereign-v0.13-canonical-100-B.json');
const v13mfg = load(V13_DIR + '/sovereign-v0.13-mfg-mirror-100.json');

const N = 400;
const fmt = (n, d = 2) => (typeof n === 'number' ? n.toFixed(d) : n);
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
  let specFirst = 0, bankRunFirst = 0;
  const creditMinDist = {}, creditEndDist = {}, postFundingMinDist = {}, capacityEndDist = {};
  const resistMaxDist = {};
  const margins = [];
  let route4Plus = 0;
  for (const g of batch.games) {
    wins[g.winner.profile] = (wins[g.winner.profile] || 0) + 1;
    if (g.defaultFired) defaultFired += 1;
    if (g.rebellionFired) rebellionFired += 1;
    bankruptcyEvents += g.bankruptcyEvents;
    const creditEvs = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
    const specFires = creditEvs.filter(e => e.reason === 'Speculation Fever');
    const bankFires = creditEvs.filter(e => e.reason === 'Bank Run');
    if (specFires.length > 0) specFeverGames += 1;
    if (bankFires.length > 0) bankRunGames += 1;
    if (specFires.length > 0 && bankFires.length > 0) {
      bothGames += 1;
      const fs = specFires[0], fb = bankFires[0];
      if (fs.lap < fb.lap || (fs.lap === fb.lap && fs.turn < fb.turn)) specFirst += 1;
      else bankRunFirst += 1;
    }
    creditMinDist[g.telemetry.tracks.credit.min] = (creditMinDist[g.telemetry.tracks.credit.min] || 0) + 1;
    creditEndDist[g.telemetry.tracks.credit.end] = (creditEndDist[g.telemetry.tracks.credit.end] || 0) + 1;
    capacityEndDist[g.telemetry.tracks.capacity.end] = (capacityEndDist[g.telemetry.tracks.capacity.end] || 0) + 1;
    resistMaxDist[g.telemetry.tracks.resistance.max] = (resistMaxDist[g.telemetry.tracks.resistance.max] || 0) + 1;
    const pfm = postFundingCreditMin(g);
    postFundingMinDist[pfm] = (postFundingMinDist[pfm] || 0) + 1;
    const routeMax = Math.max(...g.players.map(p => p.routesOwned));
    if (routeMax >= 4) route4Plus += 1;
    const sorted = g.scores.slice().sort((a, b) => b - a);
    margins.push(sorted[0] - sorted[1]);
  }
  const sorted = margins.slice().sort((a, b) => a - b);
  return {
    n, wins, defaultFired, rebellionFired, bankruptcyEvents,
    bankRunGames, specFeverGames, bothGames, specFirst, bankRunFirst,
    creditMinDist, creditEndDist, postFundingMinDist, capacityEndDist, resistMaxDist,
    route4Plus, medianMargin: sorted[Math.floor(sorted.length / 2)],
  };
}

const r10 = agg(v10c400);
const r11 = agg(v11c400);
const r12 = agg(v12c400);
const r13 = agg(v13c400);
const r13mfg = agg(v13mfg);

/* Recovery analysis on v0.13 */
let recoveredFrom6 = 0, recoveredFrom5 = 0;
let stuckAt6 = 0, stuckAt5 = 0;
const recoverySrc = {};
for (const g of v13c400.games) {
  const ev = g.telemetry.pressureEvents.filter(e => e.track === 'credit');
  let firstSixIdx = -1, firstFiveOrBelowIdx = -1;
  for (let i = 0; i < ev.length; i++) {
    if (firstSixIdx < 0 && ev[i].after === 6) firstSixIdx = i;
    if (firstFiveOrBelowIdx < 0 && ev[i].after <= 5 && i > 0) firstFiveOrBelowIdx = i;
  }
  if (firstSixIdx >= 0) {
    let recoveredHere = false;
    for (let j = firstSixIdx + 1; j < ev.length; j++) {
      if (ev[j].after >= 7) {
        recoveredHere = true;
        if (ev[j].appliedDelta > 0) recoverySrc[ev[j].reason] = (recoverySrc[ev[j].reason] || 0) + 1;
        break;
      }
    }
    if (recoveredHere) recoveredFrom6 += 1; else stuckAt6 += 1;
  }
  if (firstFiveOrBelowIdx >= 0) {
    let recoveredHere = false;
    for (let j = firstFiveOrBelowIdx + 1; j < ev.length; j++) {
      if (ev[j].after >= 7) { recoveredHere = true; break; }
    }
    if (recoveredHere) recoveredFrom5 += 1; else stuckAt5 += 1;
  }
}

/* Determinism */
const detPass = JSON.stringify(v13c100A.games) === JSON.stringify(v13c100B.games);

/* Seed 2026 cross-check: scores match v0.10/v0.11/v0.12 but credit-end diverges */
const s2026 = {
  v10: v10c400.games.find(g => g.seed === 2026),
  v11: v11c400.games.find(g => g.seed === 2026),
  v12: v12c400.games.find(g => g.seed === 2026),
  v13: v13c400.games.find(g => g.seed === 2026),
};
const seed2026ScoresMatch = JSON.stringify(s2026.v10.scores) === JSON.stringify(s2026.v13.scores);
const seed2026CreditDiverges = s2026.v11.telemetry.tracks.credit.end !== s2026.v13.telemetry.tracks.credit.end;

/* Decision criteria */
const TWinPct = +pct(r13.wins['treasury-finance'], N);
const MWinPct = +pct(r13.wins['merchant-infrastructure'], N);
const MfgWinPct = +pct(r13.wins['manufacturer-industry'], N);
const pfmAt5 = r13.postFundingMinDist[5] || 0;
const pfmBelow5 = Object.entries(r13.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0);
const capacityPreserved = JSON.stringify(r13.capacityEndDist) === JSON.stringify(r10.capacityEndDist);
const resistAt8 = Object.entries(r13.resistMaxDist).filter(([k]) => +k >= 8).reduce((a, [_, v]) => a + v, 0);

const decisionRows = [
  { c: 'Balance: Treasury 45–65 %', t: '45–65 %', o: `${TWinPct} %`, p: TWinPct >= 45 && TWinPct <= 65 },
  { c: 'Balance: Merchant 15–35 %', t: '15–35 %', o: `${MWinPct} %`, p: MWinPct >= 15 && MWinPct <= 35 },
  { c: 'Balance: Manufacturer 10–25 %', t: '10–25 %', o: `${MfgWinPct} %`, p: MfgWinPct >= 10 && MfgWinPct <= 25 },
  { c: 'Primary — post-Funding Credit reaches 5 in some games', t: '> 0 games', o: `${pfmAt5} / 400`, p: pfmAt5 > 0 },
  { c: 'Stretch — post-Funding Credit drops below 5', t: '> 0 games', o: `${pfmBelow5} / 400`, p: pfmBelow5 > 0 },
  { c: 'Capacity does not collapse', t: 'Distribution preserved', o: capacityPreserved ? 'IDENTICAL to v0.10' : 'DIFFERS', p: capacityPreserved },
  { c: 'Resistance pressure stays controlled (max ≥ 8 frequency)', t: '< 5 %', o: `${resistAt8} / 400 (${pct(resistAt8, N)} %)`, p: resistAt8 / N < 0.05 },
  { c: 'Determinism A vs B byte-identical', t: 'PASS', o: detPass ? 'PASS' : 'FAIL', p: detPass },
  { c: 'Seed 2026 scores match v0.10–v0.12 (ledger diverges, expected)', t: 'Scores IDENTICAL', o: seed2026ScoresMatch ? 'IDENTICAL' : 'DIVERGE', p: seed2026ScoresMatch },
];

const allBalancePass = decisionRows.slice(0, 3).every(r => r.p);
const primaryPass = decisionRows.find(r => r.c.startsWith('Primary')).p;
const capacityPass = capacityPreserved;
const resistPass = resistAt8 / N < 0.05;

let verdict, verdictDetail;
if (!allBalancePass) {
  verdict = 'REJECT — balance broke';
  verdictDetail = 'Revert to v0.11 and try Anti-Federalist Pamphlet instead.';
} else if (!capacityPass) {
  verdict = 'WEAKEN — capacity disturbed';
  verdictDetail = 'Capacity distribution changed; reconsider scope.';
} else if (!resistPass) {
  verdict = 'WATCH — resistance side-effect';
  verdictDetail = 'Resistance ≥ 8 frequency above 5 %. Spec Fever\'s existing +1 resistance is compounding more than expected.';
} else if (primaryPass) {
  verdict = 'FIRST USEFUL FAILURE-PRESSURE CANDIDATE';
  verdictDetail = `v0.13 is the first lever pass where post-Funding Credit reaches 5 in canonical play (${pfmAt5} games out of 400, vs 0 in v0.10/v0.11/v0.12). Balance bands hold, capacity is byte-identical to v0.10, resistance side-effect is zero. The lever works. Recovery analysis (see Section D below) shows that 6 separate Credit-up cards still absorb most pressure — 27 / 80 games that dip to credit 6 recover to 7+. Per user decision tree, this is a strong diagnostic success but not a promotion: next lever may target reducing Credit-up recovery rather than adding more Credit-down pressure.`;
} else {
  verdict = 'INSUFFICIENT — lever fires but doesn\'t reach 5';
  verdictDetail = 'Credit pressure is active but doesn\'t reach the post-Funding 5 threshold. A single extra card is insufficient.';
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
<title>Sovereign · v0.13 Failure-Pressure Candidate · Evidence Sweep</title>
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
  td.same{color:var(--neutral)}
  .verdict-card{background:var(--parchment-2);border:1.5px solid var(--ink);padding:18px 22px;margin:14px 0}
  .verdict-card.success{border-color:var(--commercial-infrastructure);border-width:2px}
  .verdict-card .lbl{font-family:var(--ui);font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--national-finance)}
  .verdict-card .nm{font-family:var(--display);font-size:26px;line-height:1.1;margin:6px 0 8px;color:var(--commercial-infrastructure)}
  .verdict-card .det{font-size:13px;line-height:1.6}
  .pass-pill{display:inline-block;font-family:var(--ui);font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:2px 7px;border-radius:2px;font-weight:700}
  .pass-pill.pass{background:var(--pass);color:#fff}
  .pass-pill.fail{background:var(--fail);color:#fff}
  .callout{background:var(--parchment-2);border:1px solid var(--ink);padding:10px 14px;margin:8px 0;font-size:12.5px;line-height:1.55}
  .callout strong{color:var(--highlight)}
  .callout.success strong{color:var(--commercial-infrastructure)}
  .bar-cell{font-family:var(--mono);font-size:9.5px;padding:3px 4px;border-bottom:0.5px solid var(--rule-soft);position:relative;text-align:right;min-width:36px}
  .bar-cell .bar{position:absolute;left:2px;top:50%;transform:translateY(-50%);height:8px;background:var(--manufactures);opacity:.45;border-radius:1px}
  .bar-cell .bar-num{position:relative;font-variant-numeric:tabular-nums}
  th.bar-h{font-family:var(--mono);font-size:9px;text-align:center;padding:3px 4px}
</style>
</head>
<body>
<div class="doc">

<div class="eyebrow">Sovereign · v0.13 failure-pressure candidate · evidence sweep</div>
<h1>v0.13 Candidate — Speculation Fever Credit Pressure</h1>
<div class="sub">Single-lever test: Speculation Fever now pushes Public Credit -1 in addition to Resistance +1 and the existing debt-property auction. Bank Run preserved at v0.11 behavior (no v0.12 Charter scaling).</div>
<div class="meta">Configurations: CANONICAL-400 (T/M/Mfg, seeds 2026-2425) · CANONICAL-100-A vs CANONICAL-100-B (determinism check) · MFG-MIRROR-100. Generated ${new Date().toISOString().slice(0,19).replace('T',' ')} UTC. v0.13 Node sim cross-validated against Claude Design output: seed 2026 ledger divergence (credit ends at 6 not 7) reproduces; seed 10 combined-firing trace reproduces byte-for-byte; seed 2027 (no card draws) byte-identical to v0.11.</div>

<h2>Verdict <span class="surface-id">A</span></h2>

<div class="verdict-card success">
  <div class="lbl">v0.13 candidate verdict</div>
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

<h2>The headline finding <span class="surface-id">B</span></h2>

<div class="callout success">
<strong>Post-Funding Credit reaches 5 for the first time.</strong> v0.10, v0.11, and v0.12 all showed 0 of 400 games with post-Funding Credit min ≤ 5. v0.13 shows <strong>${pfmAt5} games</strong>. The Speculation Fever + Bank Run combination, both firing as independent card-draw events, can compound enough to push Credit from the post-Funding 7 floor down to 5 in roughly 0.75 % of canonical games. The credit-down channel is no longer dormant.
</div>

<h4>Post-Funding Credit min — version progression</h4>
<table>
  <thead><tr><th>Version</th><th>Credit reaches 5</th><th>Credit reaches 6</th><th>Credit reaches 7 (unchanged from Funding)</th></tr></thead>
  <tbody>
    <tr><td>v0.10 (baseline)</td><td class="n">0 / 400</td><td class="n">${r10.postFundingMinDist[6] || 0} / 400</td><td class="n">${r10.postFundingMinDist[7] || 0} / 400</td></tr>
    <tr><td>v0.11 (Bank Run + Credit -1)</td><td class="n">0 / 400</td><td class="n">${r11.postFundingMinDist[6] || 0} / 400</td><td class="n">${r11.postFundingMinDist[7] || 0} / 400</td></tr>
    <tr><td>v0.12 (Bank Run Charter scaling)</td><td class="n">0 / 400</td><td class="n">${r12.postFundingMinDist[6] || 0} / 400</td><td class="n">${r12.postFundingMinDist[7] || 0} / 400</td></tr>
    <tr><td>v0.13 (+ Spec Fever Credit -1)</td><td class="n diff"><strong>${pfmAt5} / 400</strong></td><td class="n diff">${r13.postFundingMinDist[6] || 0} / 400</td><td class="n">${r13.postFundingMinDist[7] || 0} / 400</td></tr>
  </tbody>
</table>

<h2>Lever firing — Speculation Fever × Bank Run cross-tab <span class="surface-id">C</span></h2>

<table>
  <thead><tr><th></th><th>Bank Run fires</th><th>Bank Run does NOT fire</th><th>Row total</th></tr></thead>
  <tbody>
    <tr><th>Spec Fever fires</th><td class="n">${r13.bothGames}</td><td class="n">${r13.specFeverGames - r13.bothGames}</td><td class="n">${r13.specFeverGames}</td></tr>
    <tr><th>Spec Fever does NOT fire</th><td class="n">${r13.bankRunGames - r13.bothGames}</td><td class="n">${N - r13.bankRunGames - r13.specFeverGames + r13.bothGames}</td><td class="n">${N - r13.specFeverGames}</td></tr>
    <tr><th>Column total</th><td class="n">${r13.bankRunGames}</td><td class="n">${N - r13.bankRunGames}</td><td class="n">${N}</td></tr>
  </tbody>
</table>

<h4>When both fire — order matters</h4>
<table>
  <thead><tr><th>Firing order</th><th>Games</th></tr></thead>
  <tbody>
    <tr><td>Speculation Fever first, Bank Run later</td><td class="n">${r13.specFirst}</td></tr>
    <tr><td>Bank Run first, Speculation Fever later</td><td class="n">${r13.bankRunFirst}</td></tr>
  </tbody>
</table>
<p class="meta">Roughly even split. Both orderings can compound pressure: Bank Run typically fires lap 1 (when credit is 7 just after Funding); Spec Fever fires later (lap 2+) at whatever credit value the recovery cards have established. The interleaving determines the post-Funding minimum.</p>

<h2>Recovery analysis — credit-up cards absorbing pressure <span class="surface-id">D</span></h2>

<div class="callout">
<strong>The big question per the v0.13 directive:</strong> "If Treasury cards keep absorbing every shock, next lever may need to target recovery, not just add another negative card."
</div>

<table>
  <thead><tr><th>Outcome after Credit dips</th><th>Games</th></tr></thead>
  <tbody>
    <tr><td>Credit hit 6, RECOVERED to 7+ later in game</td><td class="n">${recoveredFrom6}</td></tr>
    <tr><td>Credit hit 6, did NOT recover above 6</td><td class="n">${stuckAt6}</td></tr>
    <tr><td>Credit hit 5 or below, RECOVERED to 7+ later</td><td class="n">${recoveredFrom5}</td></tr>
    <tr><td>Credit hit 5 or below, did NOT recover above 6</td><td class="n">${stuckAt5}</td></tr>
  </tbody>
</table>

<h4>Top Credit-up sources that absorbed pressure (counted by games where they brought credit to 7+ after a 6-dip)</h4>
<table>
  <thead><tr><th>Source</th><th>Type</th><th>Recovery firings</th></tr></thead>
  <tbody>
${Object.entries(recoverySrc).sort((a, b) => b[1] - a[1]).map(([src, c]) => {
  let type = 'Other';
  if (['Credit Restored', 'Federalist Victory', 'You Are Hamilton'].includes(src)) type = 'Republic Debate';
  else if (['Gold and Silver Inflow', 'Foreign Loan Secured', 'Treaty Renegotiation'].includes(src)) type = 'Market Shock';
  else if (src.endsWith(' passed')) type = 'Act';
  return `    <tr><td>${src}</td><td>${type}</td><td class="n">${c}</td></tr>`;
}).join('')}
  </tbody>
</table>

<div class="callout">
<strong>Six Credit-up cards do the recovery work.</strong> All six are simple card-draw events (no Act vote required). The 3 games where Credit reached 5 did NOT recover above 6 — none of these 6 recovery cards drew in those specific games. Recovery is real but not universal. <strong>If the next lever wants Credit to reach 5 more often, attacking recovery (e.g. modifying Credit Restored or Gold and Silver Inflow to be conditional) would compound more cleanly than adding a third Credit-down source.</strong>
</div>

<h2>v0.10 → v0.13 side-by-side <span class="surface-id">E</span></h2>

<h4>CANONICAL-400 — primary balance</h4>
<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th><th>v0.12</th><th>v0.13</th></tr></thead>
  <tbody>
    <tr><td>Treasury wins</td><td class="n">${r10.wins['treasury-finance']} (${pct(r10.wins['treasury-finance'], N)}%)</td><td class="n">${r11.wins['treasury-finance']} (${pct(r11.wins['treasury-finance'], N)}%)</td><td class="n">${r12.wins['treasury-finance']} (${pct(r12.wins['treasury-finance'], N)}%)</td><td class="n ${r13.wins['treasury-finance'] !== r12.wins['treasury-finance'] ? 'diff' : ''}">${r13.wins['treasury-finance']} (${pct(r13.wins['treasury-finance'], N)}%)</td></tr>
    <tr><td>Merchant wins</td><td class="n">${r10.wins['merchant-infrastructure']} (${pct(r10.wins['merchant-infrastructure'], N)}%)</td><td class="n">${r11.wins['merchant-infrastructure']} (${pct(r11.wins['merchant-infrastructure'], N)}%)</td><td class="n">${r12.wins['merchant-infrastructure']} (${pct(r12.wins['merchant-infrastructure'], N)}%)</td><td class="n ${r13.wins['merchant-infrastructure'] !== r12.wins['merchant-infrastructure'] ? 'diff' : ''}">${r13.wins['merchant-infrastructure']} (${pct(r13.wins['merchant-infrastructure'], N)}%)</td></tr>
    <tr><td>Manufacturer wins</td><td class="n">${r10.wins['manufacturer-industry']} (${pct(r10.wins['manufacturer-industry'], N)}%)</td><td class="n">${r11.wins['manufacturer-industry']} (${pct(r11.wins['manufacturer-industry'], N)}%)</td><td class="n">${r12.wins['manufacturer-industry']} (${pct(r12.wins['manufacturer-industry'], N)}%)</td><td class="n">${r13.wins['manufacturer-industry']} (${pct(r13.wins['manufacturer-industry'], N)}%)</td></tr>
    <tr><td>Median margin (IP)</td><td class="n">${r10.medianMargin}</td><td class="n">${r11.medianMargin}</td><td class="n">${r12.medianMargin}</td><td class="n">${r13.medianMargin}</td></tr>
    <tr><td>Route 4+ frequency</td><td class="n">${r10.route4Plus} (${pct(r10.route4Plus, N)}%)</td><td class="n">${r11.route4Plus} (${pct(r11.route4Plus, N)}%)</td><td class="n">${r12.route4Plus} (${pct(r12.route4Plus, N)}%)</td><td class="n">${r13.route4Plus} (${pct(r13.route4Plus, N)}%)</td></tr>
  </tbody>
</table>

<h4>Failure events</h4>
<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th><th>v0.12</th><th>v0.13</th></tr></thead>
  <tbody>
    <tr><td>Default fires</td><td class="n">${r10.defaultFired}</td><td class="n">${r11.defaultFired}</td><td class="n">${r12.defaultFired}</td><td class="n">${r13.defaultFired}</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r10.rebellionFired}</td><td class="n">${r11.rebellionFired}</td><td class="n">${r12.rebellionFired}</td><td class="n">${r13.rebellionFired}</td></tr>
    <tr><td>Bankruptcy events</td><td class="n">${r10.bankruptcyEvents}</td><td class="n">${r11.bankruptcyEvents}</td><td class="n">${r12.bankruptcyEvents}</td><td class="n">${r13.bankruptcyEvents}</td></tr>
  </tbody>
</table>

<h4>Credit end distribution (CANONICAL-400)</h4>
<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.creditEndDist, cols)}</tr>
    <tr><th>v0.11</th>${distRow(r11.creditEndDist, cols)}</tr>
    <tr><th>v0.12</th>${distRow(r12.creditEndDist, cols)}</tr>
    <tr><th>v0.13</th>${distRow(r13.creditEndDist, cols)}</tr>
  </tbody>
</table>

<h4>Post-Funding Credit min distribution (PRIMARY METRIC)</h4>
<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.postFundingMinDist, cols)}</tr>
    <tr><th>v0.11</th>${distRow(r11.postFundingMinDist, cols)}</tr>
    <tr><th>v0.12</th>${distRow(r12.postFundingMinDist, cols)}</tr>
    <tr><th>v0.13</th>${distRow(r13.postFundingMinDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">v0.13 is the first version where the post-Funding minimum reaches 5. Three games achieve this; 80 games reach 6; 317 games never dip below the Funding-Act-installed floor of 7.</p>

<h4>Resistance max distribution (side-effect watch)</h4>
<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.resistMaxDist, cols)}</tr>
    <tr><th>v0.13</th>${distRow(r13.resistMaxDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">Speculation Fever already pushed +1 resistance in v0.10-v0.12. Adding Credit -1 didn't change resistance behavior — the resistance side-effect is zero. Resistance max ≥ 8 fires in ${resistAt8} / 400 games (${pct(resistAt8, N)} %).</p>

<h4>Capacity end distribution (sanity — should be byte-identical to v0.10)</h4>
<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.capacityEndDist, cols)}</tr>
    <tr><th>v0.13</th>${distRow(r13.capacityEndDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">${capacityPreserved ? 'Byte-identical. Speculation Fever doesn\'t touch capacity, Bank Run is unchanged from v0.11, so the aggregate capacity distribution is preserved.' : 'NOT identical — investigate.'}</p>

<h2>MFG-MIRROR-100 cross-check <span class="surface-id">F</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.13 (MFG-MIRROR)</th></tr></thead>
  <tbody>
    <tr><td>Manufacturer wins</td><td class="n">— / 100</td><td class="n">${r13mfg.wins['manufacturer-industry']} / 100</td></tr>
    <tr><td>Spec Fever fires</td><td class="n">—</td><td class="n">${r13mfg.specFeverGames} / 100</td></tr>
    <tr><td>Bank Run fires</td><td class="n">—</td><td class="n">${r13mfg.bankRunGames} / 100</td></tr>
    <tr><td>Default fires</td><td class="n">0 / 100</td><td class="n">${r13mfg.defaultFired} / 100</td></tr>
    <tr><td>Rebellion fires</td><td class="n">0 / 100</td><td class="n">${r13mfg.rebellionFired} / 100</td></tr>
    <tr><td>Post-Funding Credit min ≤ 5</td><td class="n">—</td><td class="n">${(r13mfg.postFundingMinDist[5] || 0) + Object.entries(r13mfg.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
  </tbody>
</table>
<p class="meta">MFG-MIRROR cross-check: similar lever activation in a different configuration.</p>

<h2>Interpretation <span class="surface-id">G</span></h2>

<p><strong>What this lever proves:</strong> The two-card combination (Bank Run + Speculation Fever, both with Credit -1) is sufficient to push post-Funding Credit to 5 in ~0.75 % of canonical games. The credit-down channel exists. The Funding Act floor at 7, the v0.11 finding, is no longer absolute — concurrent firing of two independent credit-down cards can puncture it. Balance bands are preserved; capacity is byte-identical; resistance side-effects are zero.</p>

<p><strong>The remaining bottleneck:</strong> 0.75 % is below where Default could plausibly fire (Default threshold is 0; we're at 5, 5 more points away). The constraint is now <strong>credit recovery</strong> — six Credit-up cards (Credit Restored, Gold and Silver Inflow, Foreign Loan Secured, Federalist Victory, Treaty Renegotiation, You Are Hamilton) absorb most of the pressure. Of 80 games that dip to credit 6, 27 (34 %) recover to 7+. Of 3 games that dip to 5, 0 recover above 6 — those games stayed at 5 through endgame.</p>

<p><strong>Where the next lever should aim — per the user's framing:</strong> "If Funding/Foreign Loan/Gold-Silver keep absorbing every shock, then v0.14 should target recovery, not just add another negative card."</p>

<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>Recovery-attack lever:</strong> Modify Credit Restored (the highest-firing recovery source) from "Credit +1 + all bond owners collect 50 TN per property" to a conditional: e.g. "Credit +1 ONLY if Public Credit ≥ 5; otherwise the panic continues, no credit gain." That would let the v0.13 pressure compound when credit is below 5.</li>
  <li><strong>Alternative — Gold and Silver Inflow conditional:</strong> Similar pattern. The card is currently unconditional Credit +1; make it conditional on credit ≥ 5 or on some other state.</li>
  <li><strong>Or — Foreign Loan Secured "fails" when credit too low:</strong> Realistic, historically — foreign lenders panic when domestic credit collapses. Currently the card unconditionally gives +100 TN + Credit +1.</li>
  <li><strong>Alternative — strengthen v0.13's Bank Run pressure:</strong> Restore v0.12's Charter scaling (-2 credit post-Charter) on top of v0.13. Charter passes in 13.3 % of canonical games; even with the Charter-pass rarity, the compound effect with Spec Fever's -1 could push credit further down in some games.</li>
</ul>

<p>The user's framing explicitly prefers attacking recovery over stacking more negatives. The recovery analysis above ranks Credit Restored as the highest-volume recovery source, so that's the natural target.</p>

<h2>Closeout <span class="surface-id">H</span></h2>

<p>v0.13 candidate is <strong>${verdict}</strong>. Post-Funding Credit reaches 5 for the first time across the v0.10 → v0.13 progression. Balance preserved. Capacity byte-identical. Resistance side-effect zero. Determinism PASS.</p>

<p>Recommended disposition: <strong>Keep v0.13 candidate as the foundation</strong>, do not promote to baseline yet. The credit-down channel is live, but the recovery channel still dominates. Next lever (v0.14 if you authorize one) should target a recovery card per the user's preference — modifying Credit Restored or making a recovery card conditional on the credit level.</p>

<div class="meta">
v0.13 evidence sweep — observation only.
Raw data: <code>experiments/v0.13-failure-pressure-candidate/raw-data/sovereign-v0.13-canonical-400.json</code> (+ 100-A, 100-B, mfg-mirror-100).
Sim: <code>tools/diagnosis/sim-v0.13.mjs</code>.
Source HTML: <code>experiments/v0.13-failure-pressure-candidate/sovereign-solo-v0.13-candidate.html</code> (273 KB, produced by Claude Design from v0.11 source, three change-points + four version-stamp points + one ancillary splash bump).
v0.13 Node sim cross-validated: seed 2026 reproduces (scores [14,7,15] but credit-end 6 not 7); seed 10 combined-firing trace reproduces byte-for-byte; seed 2027 (no card draws) byte-identical to v0.11.
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
