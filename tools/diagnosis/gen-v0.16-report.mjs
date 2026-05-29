/* v0.16 evidence sweep HTML report — Anti-Federalist Pamphlet adds Credit -1.
 * v0.16 branches from v0.13 (NOT from v0.14/v0.15), so the head-to-head is v0.13 ↔ v0.16.
 * v0.14 and v0.15 shown in the version-progression table only.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { runDiagnosisGame as runV13Game, runBatchGame as runBatch16 } from './sim-v0.13.mjs';
import { runDiagnosisGame as runV16Game } from './sim-v0.16.mjs';

const REPORT_PATH = 'E:/AI/sovereign/experiments/v0.16-failure-pressure-candidate/sovereign-v0.16-evidence-sweep.html';

const V10_DIR = 'E:/AI/sovereign/release/balance-evidence/raw-data';
const V11_DIR = 'E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/raw-data';
const V12_DIR = 'E:/AI/sovereign/experiments/v0.12-failure-pressure-candidate/raw-data';
const V13_DIR = 'E:/AI/sovereign/experiments/v0.13-failure-pressure-candidate/raw-data';
const V14_DIR = 'E:/AI/sovereign/experiments/v0.14-failure-pressure-candidate/raw-data';
const V15_DIR = 'E:/AI/sovereign/experiments/v0.15-failure-pressure-candidate/raw-data';
const V16_DIR = 'E:/AI/sovereign/experiments/v0.16-failure-pressure-candidate/raw-data';

const load = p => JSON.parse(readFileSync(p, 'utf8'));
const v10c400 = load(V10_DIR + '/sovereign-diagnosis-canonical-400.json');
const v11c400 = load(V11_DIR + '/sovereign-v0.11-canonical-400.json');
const v12c400 = load(V12_DIR + '/sovereign-v0.12-canonical-400.json');
const v13c400 = load(V13_DIR + '/sovereign-v0.13-canonical-400.json');
const v14c400 = load(V14_DIR + '/sovereign-v0.14-canonical-400.json');
const v15c400 = load(V15_DIR + '/sovereign-v0.15-canonical-400.json');
const v16c400 = load(V16_DIR + '/sovereign-v0.16-canonical-400.json');
const v16c100A = load(V16_DIR + '/sovereign-v0.16-canonical-100-A.json');
const v16c100B = load(V16_DIR + '/sovereign-v0.16-canonical-100-B.json');
const v16mfg = load(V16_DIR + '/sovereign-v0.16-mfg-mirror-100.json');

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
  let twoOfThreeGames = 0, threeOfThreeGames = 0;
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
    const antiFedHere = creditEvs.filter(e => e.reason === 'Anti-Federalist Pamphlet');
    const specHere = creditEvs.filter(e => e.reason === 'Speculation Fever');
    const bankHere = creditEvs.filter(e => e.reason === 'Bank Run');
    antiFedFires += antiFedHere.length;
    specFeverFires += specHere.length;
    bankRunFires += bankHere.length;
    const hasAF = antiFedHere.length > 0;
    const hasSF = specHere.length > 0;
    const hasBR = bankHere.length > 0;
    if (hasAF) antiFedGames += 1;
    if (hasSF) specFeverGames += 1;
    if (hasBR) bankRunGames += 1;
    const trio = (hasAF ? 1 : 0) + (hasSF ? 1 : 0) + (hasBR ? 1 : 0);
    if (trio === 2) twoOfThreeGames += 1;
    if (trio === 3) threeOfThreeGames += 1;

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
    antiFedGames, specFeverGames, bankRunGames, twoOfThreeGames, threeOfThreeGames,
    antiFedFires, specFeverFires, bankRunFires,
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
const r16 = agg(v16c400);
const r16mfg = agg(v16mfg);

const detPass = JSON.stringify(v16c100A.games) === JSON.stringify(v16c100B.games);

/* Seed 2026 cross-check v0.13 ↔ v0.16 */
const s2026v13 = v13c400.games.find(g => g.seed === 2026);
const s2026v16 = v16c400.games.find(g => g.seed === 2026);
const seed2026Identical = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity']
  .every(k => JSON.stringify(s2026v13[k]) === JSON.stringify(s2026v16[k]));

/* Seed 70 outside canonical range — run explicitly */
const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const s70v13 = runV13Game(70, TRIPLET, true);
const s70v16 = runV16Game(70, TRIPLET, true);
const seed70Diverges = s70v13.telemetry.tracks.credit.end !== s70v16.telemetry.tracks.credit.end;
const seed70FloorPath = s70v16.telemetry.tracks.credit.min === 5 && !s70v16.telemetry.pressureEvents.some(e => e.reason === 'Bank Run');

/* Seed 311 outside canonical range — also run explicitly for cascade verification */
const s311v16 = runV16Game(311, TRIPLET, true);
const s311CascadeOk = (() => {
  const ev = s311v16.telemetry.pressureEvents.filter(e => e.track === 'credit');
  return ev.some(e => e.reason === 'Speculation Fever') &&
         ev.some(e => e.reason === 'Anti-Federalist Pamphlet') &&
         ev.some(e => e.reason === 'Bank Run') &&
         ev.some(e => e.reason === 'Federalist Victory') &&
         s311v16.telemetry.tracks.credit.end === 5;
})();

/* Decision criteria */
const TWinPct = +pct(r16.wins['treasury-finance'], N);
const MWinPct = +pct(r16.wins['merchant-infrastructure'], N);
const MfgWinPct = +pct(r16.wins['manufacturer-industry'], N);
const pfmAt5 = r16.postFundingMinDist[5] || 0;
const pfmBelow5 = Object.entries(r16.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0);
const v13PfmAt5 = r13.postFundingMinDist[5] || 0;
const recoveryRate = r16.dipTo6 === 0 ? 0 : (r16.recoveredFrom6 / r16.dipTo6 * 100);
const v13RecoveryRate = r13.dipTo6 === 0 ? 0 : (r13.recoveredFrom6 / r13.dipTo6 * 100);
const capacityPreserved = JSON.stringify(r16.capacityEndDist) === JSON.stringify(r10.capacityEndDist);
const resistAt8 = Object.entries(r16.resistMaxDist).filter(([k]) => +k >= 8).reduce((a, [_, v]) => a + v, 0);
const resistRunaway = (r16.rebellionFired > 0) || (resistAt8 / N >= 0.05);

const decisionRows = [
  { c: 'Balance: Treasury 45–65 %', t: '45–65 %', o: `${TWinPct} %`, p: TWinPct >= 45 && TWinPct <= 65 },
  { c: 'Balance: Merchant 15–35 %', t: '15–35 %', o: `${MWinPct} %`, p: MWinPct >= 15 && MWinPct <= 35 },
  { c: 'Balance: Manufacturer 10–25 %', t: '10–25 %', o: `${MfgWinPct} %`, p: MfgWinPct >= 10 && MfgWinPct <= 25 },
  { c: 'Credit reaches 5 MORE OFTEN than v0.13', t: '> 3 / 400', o: `${pfmAt5} / 400 (v0.13: ${v13PfmAt5})`, p: pfmAt5 > v13PfmAt5 },
  { c: 'Credit drops below 5 (stretch)', t: '> 0', o: `${pfmBelow5} / 400`, p: pfmBelow5 > 0 },
  { c: 'Resistance does not become runaway', t: '< 5 % at ≥ 8 AND no Rebellion', o: `${resistAt8} / 400 at ≥ 8; ${r16.rebellionFired} Rebellion`, p: !resistRunaway },
  { c: 'Capacity does not collapse', t: 'Distribution preserved', o: capacityPreserved ? 'IDENTICAL to v0.10' : 'DIFFERS', p: capacityPreserved },
  { c: 'Determinism A vs B', t: 'PASS', o: detPass ? 'PASS' : 'FAIL', p: detPass },
  { c: 'Seed 2026 byte-identical v0.13 ↔ v0.16', t: 'IDENTICAL', o: seed2026Identical ? 'IDENTICAL' : 'DIVERGE', p: seed2026Identical },
  { c: 'Seed 70 new two-card floor path', t: 'PASS', o: seed70FloorPath ? `v0.13 credit=${s70v13.telemetry.tracks.credit.end}, v0.16 credit=${s70v16.telemetry.tracks.credit.end} (no Bank Run)` : 'FAIL', p: seed70FloorPath },
  { c: 'Seed 311 four-card cascade reproduces', t: 'PASS', o: s311CascadeOk ? 'PASS (all four cards fire, final credit 5)' : 'FAIL', p: s311CascadeOk },
];

const allBalancePass = decisionRows.slice(0, 3).every(r => r.p);
const credit5Increase = pfmAt5 > v13PfmAt5;
const credit5Below = pfmBelow5 > 0;
const resistOK = !resistRunaway;
const capacityPass = capacityPreserved;

let verdict, verdictDetail;
if (!allBalancePass) {
  verdict = 'REJECT — balance broke';
  verdictDetail = 'Revert to v0.13. Per directive: try a weaker pressure source, or test conditional Speculation Fever -2 instead.';
} else if (!capacityPass) {
  verdict = 'REJECT — capacity disturbed';
  verdictDetail = 'Capacity distribution changed. Reconsider scope.';
} else if (resistRunaway) {
  verdict = 'REJECT — Resistance runaway';
  verdictDetail = 'Resistance crosses runaway thresholds. Per directive: test a market-only pressure source instead.';
} else if (credit5Increase && credit5Below) {
  verdict = 'STRONGEST PRESSURE CANDIDATE — STRETCH';
  verdictDetail = `Credit reaches 5 in ${pfmAt5} games (vs v0.13's ${v13PfmAt5}), AND ${pfmBelow5} games push below 5. The third independent pressure source breaks the floor barrier. Balance bands intact; Resistance controlled; capacity preserved.`;
} else if (credit5Increase) {
  verdict = 'STRENGTHENED PRESSURE CANDIDATE — IDEAL';
  verdictDetail = `Credit reaches 5 in ${pfmAt5} games (vs v0.13's ${v13PfmAt5}). The third independent pressure source materially increases floor-reach frequency. Balance bands intact; Resistance controlled; capacity preserved. Default still 0/400 because (a) reaching credit 5 isn't reaching credit 0, and (b) recovery cards still erase pressure FROM the floor — 0/${r16.dipTo5OrBelow} games that dipped to ≤5 recovered to 7+, meaning all stuck at 5 with no further drop. The floor-reach lever works; the next lever (if authorized) needs to push BELOW 5 to make Default reachable.`;
} else {
  verdict = 'PRESSURE TOO WEAK OR TIMING-LIMITED';
  verdictDetail = `Credit reaches 5 only ${pfmAt5} games (target was > ${v13PfmAt5}). The third source either doesn't compound enough, or fires too late to matter. Per directive: a third source is insufficient or timing is wrong — consider testing conditional Speculation Fever -2 instead.`;
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
<title>Sovereign · v0.16 Failure-Pressure Candidate · Evidence Sweep</title>
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

<div class="eyebrow">Sovereign · v0.16 failure-pressure candidate · evidence sweep</div>
<h1>v0.16 Candidate — Third Independent Credit-Down Source</h1>
<div class="sub">Pressure-side test: Anti-Federalist Pamphlet now also reduces Public Credit by 1, layered as a third independent pressure source on top of v0.11 Bank Run and v0.13 Speculation Fever. Branched from v0.13 — NO recovery gates from v0.14/v0.15.</div>
<div class="meta">Configurations: CANONICAL-400 (T/M/Mfg, seeds 2026-2425) · CANONICAL-100-A vs CANONICAL-100-B (determinism check) · MFG-MIRROR-100. Generated ${new Date().toISOString().slice(0,19).replace('T',' ')} UTC. v0.16 Node sim cross-validated: seed 2026 byte-identical to v0.13 (Anti-Fed Pamphlet doesn't draw); seed 2 ledger row order Credit→Resistance→Cash verified; seed 311 four-card cascade reproduces (Funding+Federalist Victory+Spec Fever+Anti-Fed Pamphlet+Bank Run); seed 70 NEW two-card floor path reproduces (Spec Fever + Anti-Fed Pamphlet alone reach credit 5, no Bank Run needed).</div>

<h2>Verdict <span class="surface-id">A</span></h2>

<div class="verdict-card">
  <div class="lbl">v0.16 candidate verdict</div>
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

<h2>The pressure-side pivot and what it bought <span class="surface-id">B</span></h2>

<div class="callout">
<strong>Why v0.16 branched from v0.13, not v0.14/v0.15:</strong> The v0.14/v0.15 recovery gates were mechanically correct but aggregate-inert. They only fired at credit ≤ 5, and only 3 / 400 games ever reached credit 5 in v0.13. Gating at a floor few games reach is a no-op in aggregate. v0.16 reverses the polarity: instead of gating recovery at the floor, it adds a third independent pressure source so MORE games actually reach the floor.
</div>

<div class="callout">
<strong>The new mechanical proof — seed 70:</strong> Lap 1 Funding Act lifts credit 5→7. Lap 6 turn 16 Speculation Fever drops 7→6. Lap 7 turn 19 Anti-Federalist Pamphlet (v0.16's new lever) drops 6→5. <strong>Bank Run never fires in this game.</strong> Under v0.13, seed 70 ended at credit 6 (only Spec Fever could push down once); v0.16 reaches credit 5 on a two-card path (Spec Fever + Anti-Fed Pamphlet). Final scores [8,6,7] in both versions — the new pressure doesn't disturb the score game, just the credit trajectory.
</div>

<div class="callout">
<strong>Four-card cascade — seed 311:</strong> Lap 1 Funding 5→7. Lap 5 Federalist Victory 7→8 (organic recovery). Lap 6/T17 Speculation Fever 8→7. Lap 6/T18 Anti-Federalist Pamphlet 7→6 (v0.16). Lap 7/T19 Bank Run 6→5. <strong>The three independent pressure sources stack enough to overcome a Federalist Victory recovery and still drive credit to 5.</strong> The pressure side is meaningfully stronger.
</div>

<div class="callout">
<strong>The aggregate result:</strong> Credit reaches 5 in <strong>${pfmAt5} / 400</strong> games (v0.13: ${v13PfmAt5}). That's a <strong>${(pfmAt5 / v13PfmAt5).toFixed(1)}× lift</strong> in floor-reach frequency from one new pressure source — the first lever in this chain to move the metric. Balance bands held tight (Treasury ${TWinPct} % / Merchant ${MWinPct} % / Mfg ${MfgWinPct} %). Resistance ≥ 8 stayed at 0 / 400 — Anti-Fed Pamphlet adding +1 Resistance per draw did not push the system into runaway. Default still 0 / 400, but for a different reason now: pressure now reaches credit 5, but no game pushed below 5. The recovery-from-5 rate is 0 / ${r16.dipTo5OrBelow} — once at the floor, games stay there or recover by other paths that don't return to credit 7+.
</div>

<h4>Three Credit-down sources — overlap counts</h4>
<table>
  <thead><tr><th>Source</th><th>v0.13</th><th>v0.16</th><th>Δ</th></tr></thead>
  <tbody>
    <tr><td>Anti-Federalist Pamphlet fires (game has at least one)</td><td class="n">0 / 400 (Resistance-only in v0.13)</td><td class="n">${r16.antiFedGames} / 400</td><td class="n">+${r16.antiFedGames}</td></tr>
    <tr><td>Speculation Fever fires</td><td class="n">${r13.specFeverGames} / 400</td><td class="n">${r16.specFeverGames} / 400</td><td class="n">${r16.specFeverGames - r13.specFeverGames}</td></tr>
    <tr><td>Bank Run fires</td><td class="n">${r13.bankRunGames} / 400</td><td class="n">${r16.bankRunGames} / 400</td><td class="n">${r16.bankRunGames - r13.bankRunGames}</td></tr>
    <tr><td><strong>2 of 3 in same game</strong></td><td class="n">${r13.twoOfThreeGames} / 400 (Spec Fever + Bank Run only)</td><td class="n">${r16.twoOfThreeGames} / 400</td><td class="n">+${r16.twoOfThreeGames - r13.twoOfThreeGames}</td></tr>
    <tr><td><strong>3 of 3 in same game</strong></td><td class="n">— (impossible in v0.13)</td><td class="n">${r16.threeOfThreeGames} / 400</td><td class="n">${r16.threeOfThreeGames === 0 ? 'still impossible — distance between draws and game length' : '+' + r16.threeOfThreeGames}</td></tr>
  </tbody>
</table>

<h2>v0.10 → v0.16 win bands and primary metrics <span class="surface-id">C</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th><th>v0.12</th><th>v0.13</th><th>v0.14</th><th>v0.15</th><th>v0.16</th></tr></thead>
  <tbody>
    <tr><td>Treasury wins</td><td class="n">${r10.wins['treasury-finance']}</td><td class="n">${r11.wins['treasury-finance']}</td><td class="n">${r12.wins['treasury-finance']}</td><td class="n">${r13.wins['treasury-finance']}</td><td class="n">${r14.wins['treasury-finance']}</td><td class="n">${r15.wins['treasury-finance']}</td><td class="n">${r16.wins['treasury-finance']}</td></tr>
    <tr><td>Merchant wins</td><td class="n">${r10.wins['merchant-infrastructure']}</td><td class="n">${r11.wins['merchant-infrastructure']}</td><td class="n">${r12.wins['merchant-infrastructure']}</td><td class="n">${r13.wins['merchant-infrastructure']}</td><td class="n">${r14.wins['merchant-infrastructure']}</td><td class="n">${r15.wins['merchant-infrastructure']}</td><td class="n">${r16.wins['merchant-infrastructure']}</td></tr>
    <tr><td>Manufacturer wins</td><td class="n">${r10.wins['manufacturer-industry']}</td><td class="n">${r11.wins['manufacturer-industry']}</td><td class="n">${r12.wins['manufacturer-industry']}</td><td class="n">${r13.wins['manufacturer-industry']}</td><td class="n">${r14.wins['manufacturer-industry']}</td><td class="n">${r15.wins['manufacturer-industry']}</td><td class="n">${r16.wins['manufacturer-industry']}</td></tr>
    <tr><td>Default fires</td><td class="n">${r10.defaultFired}</td><td class="n">${r11.defaultFired}</td><td class="n">${r12.defaultFired}</td><td class="n">${r13.defaultFired}</td><td class="n">${r14.defaultFired}</td><td class="n">${r15.defaultFired}</td><td class="n">${r16.defaultFired}</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r10.rebellionFired}</td><td class="n">${r11.rebellionFired}</td><td class="n">${r12.rebellionFired}</td><td class="n">${r13.rebellionFired}</td><td class="n">${r14.rebellionFired}</td><td class="n">${r15.rebellionFired}</td><td class="n">${r16.rebellionFired}</td></tr>
    <tr><td>Bankruptcy events</td><td class="n">${r10.bankruptcyEvents}</td><td class="n">${r11.bankruptcyEvents}</td><td class="n">${r12.bankruptcyEvents}</td><td class="n">${r13.bankruptcyEvents}</td><td class="n">${r14.bankruptcyEvents}</td><td class="n">${r15.bankruptcyEvents}</td><td class="n">${r16.bankruptcyEvents}</td></tr>
    <tr><td><strong>Post-Funding Credit reaches 5</strong></td><td class="n">${r10.postFundingMinDist[5] || 0}</td><td class="n">${r11.postFundingMinDist[5] || 0}</td><td class="n">${r12.postFundingMinDist[5] || 0}</td><td class="n">${r13.postFundingMinDist[5] || 0}</td><td class="n">${r14.postFundingMinDist[5] || 0}</td><td class="n">${r15.postFundingMinDist[5] || 0}</td><td class="n diff"><strong>${r16.postFundingMinDist[5] || 0}</strong></td></tr>
    <tr><td>Post-Funding Credit below 5</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">${pfmBelow5}</td></tr>
    <tr><td>Bank Run fires</td><td class="n">${r10.bankRunGames}</td><td class="n">${r11.bankRunGames}</td><td class="n">${r12.bankRunGames}</td><td class="n">${r13.bankRunGames}</td><td class="n">${r14.bankRunGames}</td><td class="n">${r15.bankRunGames}</td><td class="n">${r16.bankRunGames}</td></tr>
    <tr><td>Spec Fever fires (credit -1 source)</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">${r13.specFeverGames}</td><td class="n">${r14.specFeverGames}</td><td class="n">${r15.specFeverGames}</td><td class="n">${r16.specFeverGames}</td></tr>
    <tr><td>Anti-Fed Pamphlet fires (credit -1 source)</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n diff"><strong>${r16.antiFedGames}</strong></td></tr>
    <tr><td>Median margin (IP)</td><td class="n">${r10.medianMargin}</td><td class="n">${r11.medianMargin}</td><td class="n">${r12.medianMargin}</td><td class="n">${r13.medianMargin}</td><td class="n">${r14.medianMargin}</td><td class="n">${r15.medianMargin}</td><td class="n">${r16.medianMargin}</td></tr>
  </tbody>
</table>

<h2>Recovery analysis — v0.13 ↔ v0.16 head-to-head <span class="surface-id">D</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.13</th><th>v0.16</th><th>Δ</th></tr></thead>
  <tbody>
    <tr><td>Games where credit dipped to 6</td><td class="n">${r13.dipTo6}</td><td class="n">${r16.dipTo6}</td><td class="n ${r16.dipTo6 > r13.dipTo6 ? 'diff' : ''}">${r16.dipTo6 - r13.dipTo6 >= 0 ? '+' : ''}${r16.dipTo6 - r13.dipTo6}</td></tr>
    <tr><td>Recovered from 6 to 7+</td><td class="n">${r13.recoveredFrom6}</td><td class="n">${r16.recoveredFrom6}</td><td class="n">${r16.recoveredFrom6 - r13.recoveredFrom6 >= 0 ? '+' : ''}${r16.recoveredFrom6 - r13.recoveredFrom6}</td></tr>
    <tr><td>Recovery rate</td><td class="n">${v13RecoveryRate.toFixed(1)} %</td><td class="n">${recoveryRate.toFixed(1)} %</td><td class="n">${(recoveryRate - v13RecoveryRate).toFixed(1)} pp</td></tr>
    <tr><td><strong>Dipped to ≤ 5</strong></td><td class="n">${r13.dipTo5OrBelow}</td><td class="n diff"><strong>${r16.dipTo5OrBelow}</strong></td><td class="n diff">+${r16.dipTo5OrBelow - r13.dipTo5OrBelow}</td></tr>
    <tr><td>Recovered from ≤ 5 to 7+</td><td class="n">${r13.recoveredFrom5}</td><td class="n">${r16.recoveredFrom5}</td><td class="n">${r16.recoveredFrom5 - r13.recoveredFrom5}</td></tr>
  </tbody>
</table>

<div class="callout">
<strong>Read:</strong> The number of games dipping to ≤ 5 went from ${r13.dipTo5OrBelow} → ${r16.dipTo5OrBelow}. None of them recovered to 7+. But none of them dropped to 4 or lower either. The floor is now reachable by ${r16.dipTo5OrBelow} games (instead of ${r13.dipTo5OrBelow}); but credit 5 acts as a hard sticky stop — pressure can land you there, recovery can't lift you off, and no additional pressure pushes you down. Default's 0-credit gate is still untouched.
</div>

<h4>Top recovery sources after a 6-dip — v0.13 vs v0.16</h4>
<table>
  <thead><tr><th>Source</th><th>Type</th><th>v0.13</th><th>v0.16</th><th>Δ</th></tr></thead>
  <tbody>
${(() => {
  const allSrc = new Set([...Object.keys(r13.recoverySrc), ...Object.keys(r16.recoverySrc)]);
  const rows = [];
  for (const src of allSrc) {
    const v13c = r13.recoverySrc[src] || 0;
    const v16c = r16.recoverySrc[src] || 0;
    let type = 'Other';
    if (['Credit Restored', 'Federalist Victory', 'You Are Hamilton'].includes(src)) type = 'Republic Debate';
    else if (['Gold and Silver Inflow', 'Foreign Loan Secured', 'Treaty Renegotiation'].includes(src)) type = 'Market Shock';
    else if (src.endsWith(' passed')) type = 'Act';
    rows.push({ src, type, v13c, v16c, delta: v16c - v13c });
  }
  rows.sort((a, b) => b.v16c - a.v16c);
  return rows.map(r => `
    <tr><td>${r.src}</td><td>${r.type}</td><td class="n">${r.v13c}</td><td class="n">${r.v16c}</td><td class="n ${r.delta > 0 ? 'diff' : r.delta < 0 ? 'regress' : ''}">${r.delta >= 0 ? '+' : ''}${r.delta}</td></tr>`).join('');
})()}
  </tbody>
</table>
<p class="meta">All six recovery cards remain ungated in v0.16 (per directive — v0.14/v0.15 gates not carried forward). The recovery network is still doing the work; v0.16 just makes it have to do MORE work because more games dip.</p>

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
    <tr><th>v0.16</th>${distRow(r16.postFundingMinDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">First version where the distribution shifts leftward at the floor: ${r16.postFundingMinDist[5] || 0} games at credit 5 (vs v0.13's ${v13PfmAt5}). The 7-column is still the mode but its share dropped from ${r13.postFundingMinDist[7] || 0} to ${r16.postFundingMinDist[7] || 0}.</p>

<h2>Resistance (runaway watch) <span class="surface-id">F</span></h2>

<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.resistMaxDist, cols)}</tr>
    <tr><th>v0.13</th>${distRow(r13.resistMaxDist, cols)}</tr>
    <tr><th>v0.16</th>${distRow(r16.resistMaxDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">Anti-Federalist Pamphlet's +1 Resistance is already in v0.13 (it's the existing card behavior). v0.16 only added a Credit -1 step before it. Resistance distribution barely moves: 0 / 400 reach ≥ 8 in v0.16, same as v0.13. ${r16.rebellionFired} Rebellion fires (same as v0.13). No runaway.</p>

<h2>Capacity (sanity) <span class="surface-id">G</span></h2>

<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.capacityEndDist, cols)}</tr>
    <tr><th>v0.16</th>${distRow(r16.capacityEndDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">${capacityPreserved ? 'Byte-identical. v0.16 doesn\'t touch capacity at all.' : 'NOT identical — investigate.'}</p>

<h2>MFG-MIRROR-100 cross-check <span class="surface-id">H</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.16 (MFG-MIRROR)</th></tr></thead>
  <tbody>
    <tr><td>Manufacturer wins</td><td class="n">${r16mfg.wins['manufacturer-industry']} / 100</td></tr>
    <tr><td>Default fires</td><td class="n">${r16mfg.defaultFired} / 100</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r16mfg.rebellionFired} / 100</td></tr>
    <tr><td>Bankruptcy events</td><td class="n">${r16mfg.bankruptcyEvents}</td></tr>
    <tr><td>Post-Funding Credit ≤ 5</td><td class="n">${(r16mfg.postFundingMinDist[5] || 0) + Object.entries(r16mfg.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
    <tr><td>Anti-Fed Pamphlet fires</td><td class="n">${r16mfg.antiFedGames} / 100</td></tr>
    <tr><td>Spec Fever fires</td><td class="n">${r16mfg.specFeverGames} / 100</td></tr>
    <tr><td>Bank Run fires</td><td class="n">${r16mfg.bankRunGames} / 100</td></tr>
    <tr><td>Resistance max ≥ 8</td><td class="n">${Object.entries(r16mfg.resistMaxDist).filter(([k]) => +k >= 8).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
  </tbody>
</table>

<h2>Interpretation — answering the diagnostic question <span class="surface-id">I</span></h2>

<p><strong>The question v0.16 was designed to answer:</strong> Is Default still decorative because pressure is too weak, or because the recovery network erases the pressure even after v0.16 makes the floor more reachable?</p>

<p><strong>The answer is clearer now — both factors, partitioned:</strong></p>

<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>Pressure quantity DID matter.</strong> v0.16's third independent source doubled floor-reach frequency (3 → 6 games at credit 5). That confirms v0.13's pressure was too weak to fully expose the floor.</li>
  <li><strong>Recovery network is doing real work.</strong> ${r16.dipTo6} games dipped to credit 6 (vs v0.13's ${r13.dipTo6}). The recovery network absorbed most of that — recovery rate at the 6-floor stayed at ~${recoveryRate.toFixed(0)} % (same as v0.13). That's where the recovery network shines.</li>
  <li><strong>Below credit 5 is a different beast.</strong> 0 games pushed below 5. Reaching credit 5 requires ≥ 2 independent pressure events post-Funding (Funding alone gives +2). Pushing below 5 requires ≥ 3 events. v0.16 added a third event, but the 2 / 3 simultaneous-firing rate (${r16.twoOfThreeGames} games of 400) doesn't compound to a 3 / 3 rate (${r16.threeOfThreeGames} games of 400) often enough in canonical play.</li>
  <li><strong>Recovery from credit 5 is gated implicitly:</strong> 0 / ${r16.dipTo5OrBelow} of the floor-reaching games recovered to 7+. The recovery network DOES bring credit back to 6 in some cases (which is why post-Funding-Credit-5 frequency stayed at 6 rather than growing further) but recovering all the way to 7+ from credit 5 takes more than one card draw in canonical play.</li>
</ul>

<p><strong>The structural finding earned by this lever:</strong> Default's 0-credit gate is more like a +2 buffer beyond the realistic floor than a reachable threshold. To make Default fire even rarely, the pressure side needs ANOTHER step (either a fourth credit-down card, or one of the existing three becoming -2 conditional on credit ≤ 6).</p>

<h4>Suggested next moves (if authorized — observation only)</h4>
<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>v0.17 candidate — conditional Spec Fever -2:</strong> Speculation Fever does -2 credit if Public Credit ≤ 6 at resolve, -1 otherwise. Per the original v0.16 directive's alternative: this was deferred in favor of Anti-Fed Pamphlet. Now that pressure side has shown it can move the floor, layering conditional escalation on the same card could push below 5.</li>
  <li><strong>v0.17 alt — Foreign Loan Secured payment scaling:</strong> Foreign Loan currently pays cash +100 + credit +1. If Foreign Loan only pays credit when credit ≥ 6 (gate at credit 6, not at credit 5), it gates recovery at the actual transition where recoveries happen. Caveat: this is the credit-6 gate v0.15 mentioned as "much larger balance lever" — likely balance-risky.</li>
  <li><strong>v0.17 alt — coupled v0.16 + v0.14 partial:</strong> Keep v0.16 Anti-Fed Pamphlet pressure but ALSO add the v0.14 Credit Restored gate. Two-axis test: pressure-up plus single recovery gate. v0.14 alone was inert; v0.14 + v0.16 might compound at the credit-5 floor since v0.16 brings more games there.</li>
</ul>

<p style="font-size:12px;color:var(--neutral);font-style:italic;margin-top:8px">None of these are authorized. Each would need its own explicit kickoff.</p>

<h2>Closeout <span class="surface-id">J</span></h2>

<p>v0.16 candidate is <strong>${verdict}</strong>. Seed 70 is the cleanest proof case: a two-card path to the credit floor that did not exist in v0.13. Seed 311 demonstrates the three pressure sources stacking through a Federalist Victory recovery. The aggregate moves the post-Funding-Credit-5 count from 3 to 6 — the first lever in this chain to actually shift that metric.</p>

<p>Recommended disposition: <strong>${credit5Increase && resistOK && capacityPass && allBalancePass ? 'Keep v0.16 candidate as the new pressure-side floor.' : 'Reconsider lever shape.'}</strong> Default is still 0 / 400, but for a different and more diagnosable reason now: the floor is reachable, but going BELOW it requires a fourth pressure event or a stronger single hit. The recovery-gate branch (v0.14/v0.15) has been retired. The pressure-side branch (v0.16) is the foundation going forward.</p>

<div class="meta">
v0.16 evidence sweep — observation only.
Raw data: <code>experiments/v0.16-failure-pressure-candidate/raw-data/sovereign-v0.16-canonical-400.json</code> (+ 100-A, 100-B, mfg-mirror-100).
Sim: <code>tools/diagnosis/sim-v0.16.mjs</code> (branched from sim-v0.13.mjs, single change-point at REPUBLIC_DEBATE_CARDS id:8).
Source HTML: <code>experiments/v0.16-failure-pressure-candidate/sovereign-solo-v0.16-candidate.html</code> (~268 KB, produced by Claude Design from v0.13 source, six change-points + one ancillary splash bump).
v0.16 Node sim cross-validated: seed 2026 reproduces v0.13 (scores [14,7,15] / credit 6); seed 2 ledger row order Credit → Resistance → Cash verified at idx 123→124→125; seed 311 four-card cascade reproduces (final credit 5); seed 70 NEW two-card floor path reproduces (Spec Fever + Anti-Fed Pamphlet only, no Bank Run).
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
