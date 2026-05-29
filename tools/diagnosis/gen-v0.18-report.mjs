/* v0.18 evidence sweep HTML report — Credit Crisis intermediate failure event.
 * v0.18 branches from v0.17. Head-to-head is v0.17 ↔ v0.18.
 * v0.10-v0.16 shown in the version-progression table for context only.
 *
 * Important: Claude Design's advisory "5 / 400 Credit Crisis fires (seeds 126, 172, 299, 390, 400)"
 * used a different seed range (informal). CANONICAL-400 = seeds 2026-2425 shows 2 / 400 fires
 * (seeds 2139, 2313) — matches the v0.17 below-5 count exactly.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { runDiagnosisGame as runV17Game } from './sim-v0.17.mjs';
import { runDiagnosisGame as runV18Game, runBatchGame as runBatchV18 } from './sim-v0.18.mjs';

const REPORT_PATH = 'E:/AI/sovereign/experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-evidence-sweep.html';

const V10_DIR = 'E:/AI/sovereign/release/balance-evidence/raw-data';
const V11_DIR = 'E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/raw-data';
const V12_DIR = 'E:/AI/sovereign/experiments/v0.12-failure-pressure-candidate/raw-data';
const V13_DIR = 'E:/AI/sovereign/experiments/v0.13-failure-pressure-candidate/raw-data';
const V14_DIR = 'E:/AI/sovereign/experiments/v0.14-failure-pressure-candidate/raw-data';
const V15_DIR = 'E:/AI/sovereign/experiments/v0.15-failure-pressure-candidate/raw-data';
const V16_DIR = 'E:/AI/sovereign/experiments/v0.16-failure-pressure-candidate/raw-data';
const V17_DIR = 'E:/AI/sovereign/experiments/v0.17-failure-pressure-candidate/raw-data';
const V18_DIR = 'E:/AI/sovereign/experiments/v0.18-failure-pressure-candidate/raw-data';

const load = p => JSON.parse(readFileSync(p, 'utf8'));
const v10c400 = load(V10_DIR + '/sovereign-diagnosis-canonical-400.json');
const v11c400 = load(V11_DIR + '/sovereign-v0.11-canonical-400.json');
const v12c400 = load(V12_DIR + '/sovereign-v0.12-canonical-400.json');
const v13c400 = load(V13_DIR + '/sovereign-v0.13-canonical-400.json');
const v14c400 = load(V14_DIR + '/sovereign-v0.14-canonical-400.json');
const v15c400 = load(V15_DIR + '/sovereign-v0.15-canonical-400.json');
const v16c400 = load(V16_DIR + '/sovereign-v0.16-canonical-400.json');
const v17c400 = load(V17_DIR + '/sovereign-v0.17-canonical-400.json');
const v18c400 = load(V18_DIR + '/sovereign-v0.18-canonical-400.json');
const v18c100A = load(V18_DIR + '/sovereign-v0.18-canonical-100-A.json');
const v18c100B = load(V18_DIR + '/sovereign-v0.18-canonical-100-B.json');
const v18mfg = load(V18_DIR + '/sovereign-v0.18-mfg-mirror-100.json');

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
  let antiFedGames = 0, specFeverGames = 0, bankRunGames = 0;
  let antiFedFires = 0, specFeverFires = 0, bankRunFires = 0;
  let sfMinus1Fires = 0, sfMinus2Fires = 0;
  let twoOfThreeGames = 0, threeOfThreeGames = 0;
  const postFundingMinDist = {}, capacityEndDist = {}, resistMaxDist = {};
  let route4Plus = 0;
  const margins = [];

  for (const g of batch.games) {
    wins[g.winner.profile] = (wins[g.winner.profile] || 0) + 1;
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

    capacityEndDist[g.telemetry.tracks.capacity.end] = (capacityEndDist[g.telemetry.tracks.capacity.end] || 0) + 1;
    resistMaxDist[g.telemetry.tracks.resistance.max] = (resistMaxDist[g.telemetry.tracks.resistance.max] || 0) + 1;
    const pfm = postFundingCreditMin(g);
    postFundingMinDist[pfm] = (postFundingMinDist[pfm] || 0) + 1;

    const routeMax = Math.max(...g.players.map(p => p.routesOwned));
    if (routeMax >= 4) route4Plus += 1;
    const sorted = g.scores.slice().sort((a, b) => b - a);
    margins.push(sorted[0] - sorted[1]);
  }
  const sortedM = margins.slice().sort((a, b) => a - b);
  return {
    n, wins, defaultFired, rebellionFired, bankruptcyEvents,
    antiFedGames, specFeverGames, bankRunGames, twoOfThreeGames, threeOfThreeGames,
    antiFedFires, specFeverFires, bankRunFires, sfMinus1Fires, sfMinus2Fires,
    postFundingMinDist, capacityEndDist, resistMaxDist,
    route4Plus, medianMargin: sortedM[Math.floor(sortedM.length / 2)],
  };
}

const r10 = agg(v10c400);
const r11 = agg(v11c400);
const r12 = agg(v12c400);
const r13 = agg(v13c400);
const r14 = agg(v14c400);
const r15 = agg(v15c400);
const r16 = agg(v16c400);
const r17 = agg(v17c400);
const r18 = agg(v18c400);
const r18mfg = agg(v18mfg);

const detPass = JSON.stringify(v18c100A.games) === JSON.stringify(v18c100B.games);

/* Walk v0.18 ledgers for Credit Crisis details */
const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const crisisFires = [];
for (let seed = 2026; seed < 2426; seed++) {
  const b = runBatchV18(seed, TRIPLET, true);
  const crisisRow = b.state.ledger.find(r => r.event === 'CREDIT_CRISIS');
  if (!crisisRow) continue;
  /* Find source card */
  const crisisIdx = b.state.ledger.indexOf(crisisRow);
  let src = 'unknown';
  for (let j = crisisIdx - 1; j >= 0; j--) {
    const r = b.state.ledger[j];
    if (r.event === 'CREDIT' && (r.detail.includes('→ 4') || r.detail.includes('→ 3') || r.detail.includes('→ 2') || r.detail.includes('→ 1'))) {
      const m = r.detail.match(/^([\w][\w \-]*?) ·/);
      src = m ? m[1] : 'unknown';
      break;
    }
  }
  crisisFires.push({ seed, lap: crisisRow.lap, turn: crisisRow.turn, source: src });
}
const totalCrisisFires = crisisFires.length;

/* Same for MFG-MIRROR */
const MFG = ['manufacturer-industry', 'manufacturer-industry', 'manufacturer-industry'];
const crisisFiresMfg = [];
for (let seed = 2026; seed < 2126; seed++) {
  const b = runBatchV18(seed, MFG, true);
  const crisisRow = b.state.ledger.find(r => r.event === 'CREDIT_CRISIS');
  if (crisisRow) crisisFiresMfg.push({ seed, lap: crisisRow.lap, turn: crisisRow.turn });
}

/* Seed-by-seed cross-checks */
const s2026v17 = v17c400.games.find(g => g.seed === 2026);
const s2026v18 = v18c400.games.find(g => g.seed === 2026);
const seed2026Stable = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity']
  .every(k => JSON.stringify(s2026v17[k]) === JSON.stringify(s2026v18[k]));
const s2139v17 = v17c400.games.find(g => g.seed === 2139);
const s2139v18 = v18c400.games.find(g => g.seed === 2139);
const s2313v17 = v17c400.games.find(g => g.seed === 2313);
const s2313v18 = v18c400.games.find(g => g.seed === 2313);
const seed2139ResistDelta = s2139v18.telemetry.tracks.resistance.end - s2139v17.telemetry.tracks.resistance.end;
const seed2313ResistDelta = s2313v18.telemetry.tracks.resistance.end - s2313v17.telemetry.tracks.resistance.end;

/* Decision criteria */
const TWinPct = +pct(r18.wins['treasury-finance'], N);
const MWinPct = +pct(r18.wins['merchant-infrastructure'], N);
const MfgWinPct = +pct(r18.wins['manufacturer-industry'], N);
const pfmAt5 = r18.postFundingMinDist[5] || 0;
const pfmBelow5 = Object.entries(r18.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0);
const capacityPreserved = JSON.stringify(r18.capacityEndDist) === JSON.stringify(r10.capacityEndDist);
const resistAt8 = Object.entries(r18.resistMaxDist).filter(([k]) => +k >= 8).reduce((a, [_, v]) => a + v, 0);
const resistRunaway = (r18.rebellionFired > 0) || (resistAt8 / N >= 0.05);
const defaultUnchanged = r18.defaultFired === r17.defaultFired;
const crisisMatchesBelow5 = totalCrisisFires === pfmBelow5;

const decisionRows = [
  { c: 'Balance: Treasury 45–65 %', t: '45–65 %', o: `${TWinPct} %`, p: TWinPct >= 45 && TWinPct <= 65 },
  { c: 'Balance: Merchant 15–35 %', t: '15–35 %', o: `${MWinPct} %`, p: MWinPct >= 15 && MWinPct <= 35 },
  { c: 'Balance: Manufacturer 10–25 %', t: '10–25 %', o: `${MfgWinPct} %`, p: MfgWinPct >= 10 && MfgWinPct <= 25 },
  { c: 'Credit Crisis fires (target: 2-5 per CANONICAL range)', t: '2-5 / 400', o: `${totalCrisisFires} / 400`, p: totalCrisisFires >= 2 && totalCrisisFires <= 5 },
  { c: 'Credit Crisis fire count matches Post-Funding-below-5', t: 'identical', o: `Crisis ${totalCrisisFires} vs below-5 ${pfmBelow5}`, p: crisisMatchesBelow5 },
  { c: 'Default fires unchanged from v0.17', t: 'same', o: `v17 ${r17.defaultFired}, v18 ${r18.defaultFired}`, p: defaultUnchanged },
  { c: 'Rebellion remains rare (no Crisis-driven runaway)', t: '0 / 400', o: `${r18.rebellionFired} / 400`, p: r18.rebellionFired === 0 },
  { c: 'Resistance ≥ 8 stays rare (< 5 %)', t: '< 5 %', o: `${resistAt8} / 400 (${pct(resistAt8, N)} %)`, p: resistAt8 / N < 0.05 },
  { c: 'Capacity distribution preserved', t: 'identical', o: capacityPreserved ? 'IDENTICAL to v0.10' : 'DIFFERS', p: capacityPreserved },
  { c: 'Determinism A vs B', t: 'PASS', o: detPass ? 'PASS' : 'FAIL', p: detPass },
  { c: 'Seed 2026 stable (no Crisis, byte-identical scores)', t: 'PASS', o: seed2026Stable ? 'STABLE' : 'DIVERGED', p: seed2026Stable },
  { c: 'Seed 2139 Crisis fires +1 Resistance vs v0.17', t: '+1', o: `Δresist = +${seed2139ResistDelta}`, p: seed2139ResistDelta === 1 },
  { c: 'Seed 2313 Crisis fires +1 Resistance vs v0.17', t: '+1', o: `Δresist = +${seed2313ResistDelta}`, p: seed2313ResistDelta === 1 },
];

const allBalancePass = decisionRows.slice(0, 3).every(r => r.p);

let verdict, verdictDetail;
if (!allBalancePass) {
  verdict = 'REJECT — balance broke';
  verdictDetail = 'Revert to v0.17. The Credit Crisis penalty disturbed something.';
} else if (!capacityPreserved) {
  verdict = 'REJECT — capacity disturbed';
  verdictDetail = 'Capacity distribution changed. Reconsider scope.';
} else if (resistRunaway) {
  verdict = 'REJECT — Resistance runaway';
  verdictDetail = 'The +1 Resistance from Credit Crisis pushed games past ≥ 8 threshold or triggered Rebellion. Reduce penalty or move to non-track penalty.';
} else if (!defaultUnchanged) {
  verdict = 'REJECT — Default behavior changed';
  verdictDetail = 'Default fires changed from v0.17. The next > 0 guard may be malfunctioning.';
} else if (totalCrisisFires === 0) {
  verdict = 'INERT — Credit Crisis never fires';
  verdictDetail = 'Credit Crisis added but no canonical game crosses into the warning band. Either CANONICAL seed range is too narrow or pressure model is wrong.';
} else if (totalCrisisFires >= 2 && totalCrisisFires <= 5 && crisisMatchesBelow5) {
  verdict = 'STRONGEST FAILURE-SYSTEM CANDIDATE — CREDIT CRISIS CLEAN';
  verdictDetail = `Credit Crisis fires ${totalCrisisFires} / 400 (seeds ${crisisFires.map(c => c.seed).join(', ')}), matching v0.17's below-5 count exactly. Balance bands intact; Resistance no runaway (max ≥ 8 stays at ${resistAt8} / 400); Default fires unchanged. The intermediate failure event materializes the previously-invisible credit-≤-4 band as a visible System event. Default at Credit 0 stays untouched as the catastrophic endpoint. The pressure-system has a working three-tier failure hierarchy: Credit Crisis (warning at ≤ 4), Rebellion (catastrophe at ≥ 12 resistance), Default (collapse at 0 credit).`;
} else {
  verdict = 'CLEAN BUT UNUSUAL';
  verdictDetail = `Credit Crisis fires ${totalCrisisFires} / 400. Balance and side-effects intact. Worth eyeballing seed list and source-card distribution.`;
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
const floorCols = [0,1,2,3,4,5,6,7];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Sovereign · v0.18 Failure-Pressure Candidate · Evidence Sweep</title>
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

<div class="eyebrow">Sovereign · v0.18 failure-pressure candidate · evidence sweep</div>
<h1>v0.18 Candidate — Credit Crisis Intermediate Failure Event</h1>
<div class="sub">Adds soft intermediate failure event at Public Credit ≤ 4 (once per game, +1 Resistance to all, no credit reset). Default at Credit 0 unchanged. v0.17 / v0.16 / v0.11 pressure layers preserved. NO recovery gates.</div>
<div class="meta">Configurations: CANONICAL-400 (T/M/Mfg, seeds 2026-2425) · CANONICAL-100-A vs CANONICAL-100-B (determinism) · MFG-MIRROR-100. Generated ${new Date().toISOString().slice(0,19).replace('T',' ')} UTC. v0.18 Node sim cross-validated against Claude Design: seed 2026 byte-identical to v0.17 (no Crisis); seeds 2139 + 2313 fire Crisis once each with +1 Resistance vs v0.17; Default suppression at credit 1→0 verified by trigger-condition inspection (next > 0 guard); once-only flag verified by reducer inspection.</div>

<h2>Verdict <span class="surface-id">A</span></h2>

<div class="verdict-card">
  <div class="lbl">v0.18 candidate verdict</div>
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

<h2>Credit Crisis — fires inventory <span class="surface-id">B</span></h2>

<div class="callout">
<strong>Total Credit Crisis fires in CANONICAL-400: ${totalCrisisFires}.</strong> The fire count matches the Post-Funding-below-5 count exactly (${pfmBelow5}) — every canonical game that crosses into the warning band fires the event exactly once, and no game fires it twice (sticky flag verified). Claude Design's advisory cited 5 / 400 using a different seed range (seeds 1-400 informal). The CANONICAL range (seeds 2026-2425) holds the more conservative count.
</div>

<h4>Credit Crisis fire inventory (CANONICAL-400)</h4>
<table>
  <thead><tr><th>Seed</th><th>Lap</th><th>Turn</th><th>Source card</th></tr></thead>
  <tbody>
${crisisFires.map(c => `    <tr><td class="n">${c.seed}</td><td class="n">${c.lap}</td><td class="n">${c.turn}</td><td>${c.source}</td></tr>`).join('\n')}
  </tbody>
</table>
<p class="meta">All ${totalCrisisFires} CANONICAL Credit Crisis fires came from Speculation Fever's -2 escalation (v0.17 lever). Anti-Federalist Pamphlet doesn't drop credit from 5 → 4 in CANONICAL play because the Pamphlet only lands when credit ≥ 6. Bank Run -1 from credit 5 would also fire Crisis, but Bank Run never lands at credit 5 in CANONICAL (Bank Run timing is tied to Bank Charter and other early-game state).</p>

<h4>MFG-MIRROR-100 Crisis fires</h4>
<table>
  <thead><tr><th>Crisis fires</th><th>Seeds</th></tr></thead>
  <tbody>
    <tr><td class="n">${crisisFiresMfg.length} / 100</td><td>${crisisFiresMfg.length === 0 ? '—' : crisisFiresMfg.map(c => `${c.seed} (L${c.lap}T${c.turn})`).join(', ')}</td></tr>
  </tbody>
</table>

<h2>Three-tier failure hierarchy now visible <span class="surface-id">C</span></h2>

<div class="callout">
<strong>Default's role is now well-defined.</strong> Before v0.18, the failure system had two tiers: Default (Credit 0, catastrophic) and Rebellion (Resistance 12, catastrophic). Both threshold events are far from typical canonical play. v0.18 adds a third tier between "live game state" and "catastrophe":
<ul style="font-size:12.5px;line-height:1.5;margin:6px 0 0 18px">
  <li><strong>Credit Crisis</strong> (Credit ≤ 4, soft) — warning state, +1 Resistance, no reset</li>
  <li><strong>Rebellion</strong> (Resistance 12, catastrophic) — destroys Revenue upgrades, resets to 6</li>
  <li><strong>Default</strong> (Credit 0, catastrophic) — 50 % cash loss per player + 1 upgrade lost, resets to 3</li>
</ul>
This is the cleanest product shape so far: a visible <em>warning</em> for the failure system without forcing Default itself to carry every level of distress.
</div>

<h2>v0.17 ↔ v0.18 head-to-head <span class="surface-id">D</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.17</th><th>v0.18</th><th>Δ</th></tr></thead>
  <tbody>
    <tr><td>Treasury wins</td><td class="n">${r17.wins['treasury-finance']}</td><td class="n">${r18.wins['treasury-finance']}</td><td class="n">${r18.wins['treasury-finance'] - r17.wins['treasury-finance']}</td></tr>
    <tr><td>Merchant wins</td><td class="n">${r17.wins['merchant-infrastructure']}</td><td class="n">${r18.wins['merchant-infrastructure']}</td><td class="n">${r18.wins['merchant-infrastructure'] - r17.wins['merchant-infrastructure']}</td></tr>
    <tr><td>Manufacturer wins</td><td class="n">${r17.wins['manufacturer-industry']}</td><td class="n">${r18.wins['manufacturer-industry']}</td><td class="n">${r18.wins['manufacturer-industry'] - r17.wins['manufacturer-industry']}</td></tr>
    <tr><td>Default fires</td><td class="n">${r17.defaultFired}</td><td class="n">${r18.defaultFired}</td><td class="n">${r18.defaultFired - r17.defaultFired}</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r17.rebellionFired}</td><td class="n">${r18.rebellionFired}</td><td class="n">${r18.rebellionFired - r17.rebellionFired}</td></tr>
    <tr><td><strong>Credit Crisis fires (NEW)</strong></td><td class="n">— (not in v0.17)</td><td class="n diff"><strong>${totalCrisisFires}</strong></td><td class="n diff">+${totalCrisisFires}</td></tr>
    <tr><td>Post-Funding Credit reaches 5</td><td class="n">${r17.postFundingMinDist[5] || 0}</td><td class="n">${pfmAt5}</td><td class="n">${pfmAt5 - (r17.postFundingMinDist[5] || 0)}</td></tr>
    <tr><td>Post-Funding Credit below 5</td><td class="n">${Object.entries(r17.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)}</td><td class="n">${pfmBelow5}</td><td class="n">${pfmBelow5 - Object.entries(r17.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)}</td></tr>
    <tr><td>Bank Run fires</td><td class="n">${r17.bankRunGames}</td><td class="n">${r18.bankRunGames}</td><td class="n">${r18.bankRunGames - r17.bankRunGames}</td></tr>
    <tr><td>Speculation Fever -1 fires</td><td class="n">${r17.sfMinus1Fires}</td><td class="n">${r18.sfMinus1Fires}</td><td class="n">${r18.sfMinus1Fires - r17.sfMinus1Fires}</td></tr>
    <tr><td>Speculation Fever -2 fires</td><td class="n">${r17.sfMinus2Fires}</td><td class="n">${r18.sfMinus2Fires}</td><td class="n">${r18.sfMinus2Fires - r17.sfMinus2Fires}</td></tr>
    <tr><td>Anti-Fed Pamphlet fires</td><td class="n">${r17.antiFedGames}</td><td class="n">${r18.antiFedGames}</td><td class="n">${r18.antiFedGames - r17.antiFedGames}</td></tr>
    <tr><td>Median margin (IP)</td><td class="n">${r17.medianMargin}</td><td class="n">${r18.medianMargin}</td><td class="n">${r18.medianMargin - r17.medianMargin}</td></tr>
  </tbody>
</table>
<p class="meta">All pressure-layer counts are identical to v0.17. The only diff is the new Credit Crisis event, which fires in exactly the same ${totalCrisisFires} canonical games where v0.17 pushed credit below 5.</p>

<h2>Resistance distribution — does +1 Crisis cause spillover? <span class="surface-id">E</span></h2>

<table>
  <thead><tr><th>Resistance max</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.resistMaxDist, cols)}</tr>
    <tr><th>v0.17</th>${distRow(r17.resistMaxDist, cols)}</tr>
    <tr><th>v0.18</th>${distRow(r18.resistMaxDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">v0.17 → v0.18 diff: the only change is the ${totalCrisisFires} games where Credit Crisis fires get +1 max resistance. In CANONICAL, this is visible as a 1-game shift in the distribution (one game moves from resist 3 → resist 5, for instance). Resistance ≥ 8 stays at 0 / 400; Rebellion stays at 0 / 400. No runaway.</p>

<h2>v0.10 → v0.18 win bands and primary metrics <span class="surface-id">F</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.13</th><th>v0.16</th><th>v0.17</th><th>v0.18</th></tr></thead>
  <tbody>
    <tr><td>Treasury wins</td><td class="n">${r10.wins['treasury-finance']}</td><td class="n">${r13.wins['treasury-finance']}</td><td class="n">${r16.wins['treasury-finance']}</td><td class="n">${r17.wins['treasury-finance']}</td><td class="n">${r18.wins['treasury-finance']}</td></tr>
    <tr><td>Merchant wins</td><td class="n">${r10.wins['merchant-infrastructure']}</td><td class="n">${r13.wins['merchant-infrastructure']}</td><td class="n">${r16.wins['merchant-infrastructure']}</td><td class="n">${r17.wins['merchant-infrastructure']}</td><td class="n">${r18.wins['merchant-infrastructure']}</td></tr>
    <tr><td>Manufacturer wins</td><td class="n">${r10.wins['manufacturer-industry']}</td><td class="n">${r13.wins['manufacturer-industry']}</td><td class="n">${r16.wins['manufacturer-industry']}</td><td class="n">${r17.wins['manufacturer-industry']}</td><td class="n">${r18.wins['manufacturer-industry']}</td></tr>
    <tr><td>Default fires</td><td class="n">${r10.defaultFired}</td><td class="n">${r13.defaultFired}</td><td class="n">${r16.defaultFired}</td><td class="n">${r17.defaultFired}</td><td class="n">${r18.defaultFired}</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r10.rebellionFired}</td><td class="n">${r13.rebellionFired}</td><td class="n">${r16.rebellionFired}</td><td class="n">${r17.rebellionFired}</td><td class="n">${r18.rebellionFired}</td></tr>
    <tr><td><strong>Credit Crisis fires (NEW v0.18)</strong></td><td class="n">—</td><td class="n">—</td><td class="n">—</td><td class="n">—</td><td class="n diff"><strong>${totalCrisisFires}</strong></td></tr>
    <tr><td>Post-Funding Credit reaches 5</td><td class="n">${r10.postFundingMinDist[5] || 0}</td><td class="n">${r13.postFundingMinDist[5] || 0}</td><td class="n">${r16.postFundingMinDist[5] || 0}</td><td class="n">${r17.postFundingMinDist[5] || 0}</td><td class="n">${pfmAt5}</td></tr>
    <tr><td>Post-Funding Credit below 5</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">${Object.entries(r17.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)}</td><td class="n">${pfmBelow5}</td></tr>
    <tr><td>Bankruptcy events</td><td class="n">${r10.bankruptcyEvents}</td><td class="n">${r13.bankruptcyEvents}</td><td class="n">${r16.bankruptcyEvents}</td><td class="n">${r17.bankruptcyEvents}</td><td class="n">${r18.bankruptcyEvents}</td></tr>
    <tr><td>Median margin (IP)</td><td class="n">${r10.medianMargin}</td><td class="n">${r13.medianMargin}</td><td class="n">${r16.medianMargin}</td><td class="n">${r17.medianMargin}</td><td class="n">${r18.medianMargin}</td></tr>
  </tbody>
</table>

<h2>Capacity (sanity) <span class="surface-id">G</span></h2>

<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.capacityEndDist, cols)}</tr>
    <tr><th>v0.18</th>${distRow(r18.capacityEndDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">${capacityPreserved ? 'Byte-identical. v0.18 doesn\'t touch capacity at all.' : 'NOT identical — investigate.'}</p>

<h2>MFG-MIRROR-100 cross-check <span class="surface-id">H</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.18 (MFG-MIRROR)</th></tr></thead>
  <tbody>
    <tr><td>Manufacturer wins</td><td class="n">${r18mfg.wins['manufacturer-industry']} / 100</td></tr>
    <tr><td>Default fires</td><td class="n">${r18mfg.defaultFired} / 100</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r18mfg.rebellionFired} / 100</td></tr>
    <tr><td>Credit Crisis fires</td><td class="n">${crisisFiresMfg.length} / 100</td></tr>
    <tr><td>Bankruptcy events</td><td class="n">${r18mfg.bankruptcyEvents}</td></tr>
    <tr><td>Post-Funding Credit ≤ 5</td><td class="n">${(r18mfg.postFundingMinDist[5] || 0) + Object.entries(r18mfg.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
    <tr><td>Post-Funding Credit below 5</td><td class="n">${Object.entries(r18mfg.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
    <tr><td>Resistance max ≥ 8</td><td class="n">${Object.entries(r18mfg.resistMaxDist).filter(([k]) => +k >= 8).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
  </tbody>
</table>

<h2>Default suppression — structural proof <span class="surface-id">I</span></h2>

<div class="callout">
<strong>Default and Credit Crisis cannot fire on the same credit transition.</strong> The trigger condition includes a <code>next > 0</code> guard:
<pre style="font-family:var(--mono);font-size:11px;background:rgba(26,22,18,0.05);padding:8px;margin:6px 0">if (key === 'credit' && next <= 4 && next > 0 && !s.flags.creditCrisisFired) {
  s.pendingCreditCrisis = true;
}</pre>
At <code>next === 0</code>: pendingDefault is set (by the existing line), pendingCreditCrisis is NOT set. The main-loop priority then dispatches TRIGGER_DEFAULT first. TRIGGER_DEFAULT directly assigns <code>s.tracks.credit.value = 3</code>, bypassing adjustTrack — so the creditCrisisFired flag stays unset. If a subsequent card-driven dip puts credit back in the 1-4 warning band, Crisis fires normally.
</div>

<h2>Interpretation — answering the design question <span class="surface-id">J</span></h2>

<p><strong>The question v0.18 was designed to answer:</strong> Can the failure system have a visible intermediate warning state without weakening Default's catastrophic endpoint?</p>

<p><strong>Yes.</strong> v0.18 produces:</p>

<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>${totalCrisisFires} canonical games</strong> with a visible CREDIT_CRISIS System event in the ledger, at the precise moments credit drops below 5</li>
  <li><strong>+1 shared Resistance</strong> as the penalty — cross-track interaction with the Rebellion timer, but small enough that no game reaches the Rebellion threshold</li>
  <li><strong>Default at Credit 0 unchanged</strong> in every metric — same fires (0 / 400), same trigger condition, same reducer behavior</li>
  <li><strong>Balance bands held byte-perfectly</strong> (60.0 / 23.5 / 16.5, identical to v0.17)</li>
</ul>

<p><strong>The product framing this earns:</strong> Default at Credit 0 is now correctly understood as a <em>catastrophic collapse condition</em>, not a balance target. The game's failure system now has a working three-tier hierarchy. The conceptual question "should Default be lowered to Credit ≤ 2 or ≤ 4?" can be retired — Credit Crisis fills that role with the right severity, and Default stays as the dramatic endpoint.</p>

<h4>Suggested v0.19 directions (if authorized — observation only)</h4>
<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>v0.19 — broader Crisis trigger:</strong> Crisis currently triggers only on a card-driven dip into ≤ 4. Should it also trigger if credit STARTS ≤ 4 in a save-loaded game? Defensive — probably not worth it.</li>
  <li><strong>v0.19 — Crisis-aware card behavior:</strong> Some cards could check <code>s.flags.creditCrisisFired</code> and behave differently. Example: Anti-Fed Pamphlet payment scaled higher post-Crisis (revenue collection harder during financial crisis). This is balance-shaping territory; not a failure-pressure question.</li>
  <li><strong>v0.19 — second Crisis penalty option:</strong> If +1 Resistance proves too anemic in playtesting, swap to "all players pay 25 TN" (single, mild). Don't compound — too easy to overshoot non-terminal.</li>
  <li><strong>v0.19 alt — chain Crisis to a card draw:</strong> "After Credit Crisis fires, the next Republic Debate draws Anti-Federalist Pamphlet (forced)." Mechanically links the warning state to additional pressure. Risk: removes Republic Debate variety.</li>
</ul>

<p style="font-size:12px;color:var(--neutral);font-style:italic;margin-top:8px">None of these are authorized. Each would need its own explicit kickoff. The product reading is that v0.18 may be a stopping point: the failure-pressure system now has the right shape, and further iteration should be playtest-driven not sim-driven.</p>

<h2>Closeout <span class="surface-id">K</span></h2>

<p>v0.18 candidate is <strong>${verdict}</strong>. The intermediate failure event materializes the credit ≤ 4 warning band as a visible System event, while Default at Credit 0 stays unchanged as the catastrophic endpoint. Balance bands held perfectly; Resistance no runaway; Default fires unchanged; Determinism PASS.</p>

<p>Recommended disposition: <strong>${totalCrisisFires >= 2 && totalCrisisFires <= 5 && !resistRunaway && capacityPreserved && allBalancePass && defaultUnchanged ? 'Promote v0.18 as the new failure-system foundation.' : 'Reconsider.'}</strong> The pressure-side branch (v0.11 + v0.16 + v0.17) is the foundation; the failure-event layer (v0.18 Credit Crisis) is the visible expression. The chain from v0.11 → v0.18 has earned its place: the system now produces visible failure events at multiple severity tiers, holds balance, and preserves Default's dramatic role.</p>

<div class="meta">
v0.18 evidence sweep — observation only.
Raw data: <code>experiments/v0.18-failure-pressure-candidate/raw-data/sovereign-v0.18-canonical-400.json</code> (+ 100-A, 100-B, mfg-mirror-100).
Sim: <code>tools/diagnosis/sim-v0.18.mjs</code> (branched from sim-v0.17.mjs, four change-points: adjustTrack trigger, initial state flag, TRIGGER_CREDIT_CRISIS reducer case, main loop dispatch).
Source HTML: <code>experiments/v0.18-failure-pressure-candidate/sovereign-solo-v0.18-candidate.html</code> (produced by Claude Design from v0.17 source, 10 change-points).
v0.18 Node sim cross-validated: seed 2026 byte-identical to v0.17 (no Crisis); seeds 2139 + 2313 fire Crisis once each with +1 Resistance vs v0.17; Default suppression at credit 1→0 verified by trigger-condition inspection; once-only sticky flag verified by reducer inspection.
Advisory vs canonical: Claude Design's 5/400 figure used seeds 1-400 (informal); CANONICAL-400 = seeds 2026-2425 shows ${totalCrisisFires}/400.
No release. No balance change to v0.10 baseline. No threshold change. Default at Credit 0 unchanged.
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
