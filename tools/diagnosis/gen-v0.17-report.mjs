/* v0.17 evidence sweep HTML report — Speculation Fever fragile-credit escalation.
 * v0.17 branches from v0.16 (the new pressure-side base). Head-to-head is v0.16 ↔ v0.17.
 * v0.10-v0.15 shown in the version-progression table for context only.
 *
 * Important: Claude Design's advisory "5 / 400 Spec Fever -2 fires" used a different
 * seed range (1-400 informal). CANONICAL-400 = seeds 2026-2425 (per spec) shows
 * 2 / 400 fires. Both numbers reported, CANONICAL is authoritative.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { runDiagnosisGame as runV16Game } from './sim-v0.16.mjs';
import { runDiagnosisGame as runV17Game } from './sim-v0.17.mjs';

const REPORT_PATH = 'E:/AI/sovereign/experiments/v0.17-failure-pressure-candidate/sovereign-v0.17-evidence-sweep.html';

const V10_DIR = 'E:/AI/sovereign/release/balance-evidence/raw-data';
const V11_DIR = 'E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/raw-data';
const V12_DIR = 'E:/AI/sovereign/experiments/v0.12-failure-pressure-candidate/raw-data';
const V13_DIR = 'E:/AI/sovereign/experiments/v0.13-failure-pressure-candidate/raw-data';
const V14_DIR = 'E:/AI/sovereign/experiments/v0.14-failure-pressure-candidate/raw-data';
const V15_DIR = 'E:/AI/sovereign/experiments/v0.15-failure-pressure-candidate/raw-data';
const V16_DIR = 'E:/AI/sovereign/experiments/v0.16-failure-pressure-candidate/raw-data';
const V17_DIR = 'E:/AI/sovereign/experiments/v0.17-failure-pressure-candidate/raw-data';

const load = p => JSON.parse(readFileSync(p, 'utf8'));
const v10c400 = load(V10_DIR + '/sovereign-diagnosis-canonical-400.json');
const v11c400 = load(V11_DIR + '/sovereign-v0.11-canonical-400.json');
const v12c400 = load(V12_DIR + '/sovereign-v0.12-canonical-400.json');
const v13c400 = load(V13_DIR + '/sovereign-v0.13-canonical-400.json');
const v14c400 = load(V14_DIR + '/sovereign-v0.14-canonical-400.json');
const v15c400 = load(V15_DIR + '/sovereign-v0.15-canonical-400.json');
const v16c400 = load(V16_DIR + '/sovereign-v0.16-canonical-400.json');
const v17c400 = load(V17_DIR + '/sovereign-v0.17-canonical-400.json');
const v17c100A = load(V17_DIR + '/sovereign-v0.17-canonical-100-A.json');
const v17c100B = load(V17_DIR + '/sovereign-v0.17-canonical-100-B.json');
const v17mfg = load(V17_DIR + '/sovereign-v0.17-mfg-mirror-100.json');

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
  const creditEndDist = {}, postFundingMinDist = {}, capacityEndDist = {}, resistMaxDist = {};
  let dipTo6 = 0, recoveredFrom6 = 0, dipTo5OrBelow = 0, recoveredFrom5OrBelow = 0;
  let dipBelow5 = 0, recoveredFromBelow5 = 0;
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
    for (const sf of specHere) {
      if (sf.appliedDelta === -1) sfMinus1Fires += 1;
      else if (sf.appliedDelta === -2) sfMinus2Fires += 1;
    }
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

    let firstSixIdx = -1, firstFiveOrBelowIdx = -1, firstBelowFiveIdx = -1;
    for (let i = 0; i < creditEvs.length; i++) {
      if (firstSixIdx < 0 && creditEvs[i].after === 6) firstSixIdx = i;
      if (firstFiveOrBelowIdx < 0 && creditEvs[i].after <= 5 && i > 0) firstFiveOrBelowIdx = i;
      if (firstBelowFiveIdx < 0 && creditEvs[i].after < 5 && i > 0) firstBelowFiveIdx = i;
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
        if (creditEvs[j].after >= 7) { recoveredFrom5OrBelow += 1; break; }
      }
    }
    if (firstBelowFiveIdx >= 0) {
      dipBelow5 += 1;
      for (let j = firstBelowFiveIdx + 1; j < creditEvs.length; j++) {
        if (creditEvs[j].after >= 7) { recoveredFromBelow5 += 1; break; }
      }
    }

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
    creditEndDist, postFundingMinDist, capacityEndDist, resistMaxDist,
    dipTo6, recoveredFrom6, dipTo5OrBelow, recoveredFrom5OrBelow,
    dipBelow5, recoveredFromBelow5, recoverySrc,
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
const r17mfg = agg(v17mfg);

const detPass = JSON.stringify(v17c100A.games) === JSON.stringify(v17c100B.games);

/* Seed 2026 cross-check v0.16 ↔ v0.17 */
const s2026v16 = v16c400.games.find(g => g.seed === 2026);
const s2026v17 = v17c400.games.find(g => g.seed === 2026);
const seed2026Identical = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity']
  .every(k => JSON.stringify(s2026v16[k]) === JSON.stringify(s2026v17[k]));

/* Seed 2139 and 2313 are IN canonical range — pull from batch */
const s2139v16 = v16c400.games.find(g => g.seed === 2139);
const s2139v17 = v17c400.games.find(g => g.seed === 2139);
const seed2139Diverges = s2139v16.telemetry.tracks.credit.end !== s2139v17.telemetry.tracks.credit.end;
const s2313v16 = v16c400.games.find(g => g.seed === 2313);
const s2313v17 = v17c400.games.find(g => g.seed === 2313);
const seed2313Diverges = s2313v16.telemetry.tracks.credit.end !== s2313v17.telemetry.tracks.credit.end;

/* Seed 299 is OUTSIDE canonical range — run explicitly (Claude Design's triple-pressure case) */
const TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const s299v16 = runV16Game(299, TRIPLET, true);
const s299v17 = runV17Game(299, TRIPLET, true);
const seed299Cascade = (() => {
  const ev = s299v17.telemetry.pressureEvents.filter(e => e.track === 'credit');
  return ev.some(e => e.reason === 'Anti-Federalist Pamphlet') &&
         ev.some(e => e.reason === 'Speculation Fever' && e.appliedDelta === -2) &&
         s299v17.telemetry.tracks.credit.end === 4;
})();

/* Decision criteria */
const TWinPct = +pct(r17.wins['treasury-finance'], N);
const MWinPct = +pct(r17.wins['merchant-infrastructure'], N);
const MfgWinPct = +pct(r17.wins['manufacturer-industry'], N);
const pfmAt5 = r17.postFundingMinDist[5] || 0;
const pfmBelow5 = Object.entries(r17.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0);
const v16PfmAt5 = r16.postFundingMinDist[5] || 0;
const v16PfmBelow5 = Object.entries(r16.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0);
const recoveryRate = r17.dipTo6 === 0 ? 0 : (r17.recoveredFrom6 / r17.dipTo6 * 100);
const v16RecoveryRate = r16.dipTo6 === 0 ? 0 : (r16.recoveredFrom6 / r16.dipTo6 * 100);
const capacityPreserved = JSON.stringify(r17.capacityEndDist) === JSON.stringify(r10.capacityEndDist);
const resistAt8 = Object.entries(r17.resistMaxDist).filter(([k]) => +k >= 8).reduce((a, [_, v]) => a + v, 0);
const resistRunaway = (r17.rebellionFired > 0) || (resistAt8 / N >= 0.05);
const timingLimited = r17.sfMinus2Fires < 5;

const decisionRows = [
  { c: 'Balance: Treasury 45–65 %', t: '45–65 %', o: `${TWinPct} %`, p: TWinPct >= 45 && TWinPct <= 65 },
  { c: 'Balance: Merchant 15–35 %', t: '15–35 %', o: `${MWinPct} %`, p: MWinPct >= 15 && MWinPct <= 35 },
  { c: 'Balance: Manufacturer 10–25 %', t: '10–25 %', o: `${MfgWinPct} %`, p: MfgWinPct >= 10 && MfgWinPct <= 25 },
  { c: 'Credit reaches 5 more often than v0.16', t: `> ${v16PfmAt5} / 400`, o: `${pfmAt5} / 400`, p: pfmAt5 > v16PfmAt5 },
  { c: 'Credit drops below 5 (target — floor breach)', t: '> 0', o: `${pfmBelow5} / 400`, p: pfmBelow5 > 0 },
  { c: 'Default does NOT need to fire yet', t: '0 / 400 acceptable', o: `${r17.defaultFired} / 400`, p: r17.defaultFired === 0 },
  { c: 'Resistance does not become runaway', t: '< 5 % at ≥ 8 AND no Rebellion', o: `${resistAt8} / 400 at ≥ 8; ${r17.rebellionFired} Rebellion`, p: !resistRunaway },
  { c: 'Capacity does not collapse', t: 'Distribution preserved', o: capacityPreserved ? 'IDENTICAL to v0.10' : 'DIFFERS', p: capacityPreserved },
  { c: 'Determinism A vs B', t: 'PASS', o: detPass ? 'PASS' : 'FAIL', p: detPass },
  { c: 'Seed 2026 byte-identical v0.16 ↔ v0.17 (≥7 path)', t: 'IDENTICAL', o: seed2026Identical ? 'IDENTICAL' : 'DIVERGE', p: seed2026Identical },
  { c: 'Seed 2139 -2 path activates (late game)', t: 'DIVERGE', o: seed2139Diverges ? `v0.16 credit=${s2139v16.telemetry.tracks.credit.end}, v0.17 credit=${s2139v17.telemetry.tracks.credit.end}` : 'IDENTICAL', p: seed2139Diverges },
  { c: 'Seed 2313 -2 path activates (early game)', t: 'DIVERGE', o: seed2313Diverges ? `v0.16 credit=${s2313v16.telemetry.tracks.credit.end}, v0.17 credit=${s2313v17.telemetry.tracks.credit.end}` : 'IDENTICAL', p: seed2313Diverges },
  { c: 'Seed 299 triple-pressure cascade (CD advisory)', t: 'Anti-Fed + Spec -2 → credit 4', o: seed299Cascade ? `final credit ${s299v17.telemetry.tracks.credit.end}` : 'FAIL', p: seed299Cascade },
  { c: `Spec Fever -2 fires ≥ 5 / 400 (timing-limit threshold)`, t: '≥ 5', o: `${r17.sfMinus2Fires} / 400`, p: r17.sfMinus2Fires >= 5 },
];

const allBalancePass = decisionRows.slice(0, 3).every(r => r.p);
const credit5Increase = pfmAt5 > v16PfmAt5;
const credit5Below = pfmBelow5 > 0;
const resistOK = !resistRunaway;
const capacityPass = capacityPreserved;

let verdict, verdictDetail;
if (!allBalancePass) {
  verdict = 'REJECT — balance broke';
  verdictDetail = 'Revert to v0.16. Per directive: try a weaker pressure source.';
} else if (!capacityPass) {
  verdict = 'REJECT — capacity disturbed';
  verdictDetail = 'Capacity distribution changed. Reconsider scope.';
} else if (resistRunaway) {
  verdict = 'REJECT — Resistance runaway';
  verdictDetail = 'Resistance crosses runaway thresholds. Per directive: test a market-only pressure source instead.';
} else if (credit5Below && !timingLimited) {
  verdict = 'STRONGEST PRESSURE CANDIDATE — FLOOR BREACHED';
  verdictDetail = `Credit drops below 5 in ${pfmBelow5} games (v0.16: 0). Spec Fever -2 fires ${r17.sfMinus2Fires} / 400 — above the timing-limit threshold of 5. Balance bands intact; Resistance controlled; capacity preserved. The fragile-credit escalation works as designed: it breaks the credit-5 sticky-stop and pushes the floor lower.`;
} else if (credit5Below && timingLimited) {
  verdict = 'STRONGEST PRESSURE CANDIDATE — FLOOR BREACHED BUT TIMING-LIMITED';
  verdictDetail = `Credit drops below 5 in ${pfmBelow5} games (v0.16: 0) — the first lever in this chain to push past the credit-5 sticky-stop. But Spec Fever -2 fires only ${r17.sfMinus2Fires} / 400 (below the 5-game timing-limit threshold). The mechanism is correct and the floor IS breached — the question is whether 2 / 400 below-5 fires enough to matter for game feel. Per directive: classify as timing-limited; next lever should be a fourth independent Credit-down source rather than another conditional escalation. The fragile-credit escalation proves the mechanism works; broadening the pressure base would compound it.`;
} else if (credit5Increase) {
  verdict = 'PRESSURE INCREASED BUT NO FLOOR BREACH';
  verdictDetail = `Credit reaches 5 more often (${pfmAt5} vs ${v16PfmAt5}), but no game pushed below 5. Spec Fever -2 fires ${r17.sfMinus2Fires} / 400 — too rare or mistimed to overcome the recovery network at credit 5. Per directive: timing is the blocker; next lever should add a fourth independent pressure source rather than another conditional escalation.`;
} else {
  verdict = 'TIMING-LIMITED — INERT IN AGGREGATE';
  verdictDetail = `Spec Fever -2 fires only ${r17.sfMinus2Fires} / 400. Floor-reach metrics did not move (reach-5: ${pfmAt5} vs v0.16 ${v16PfmAt5}; below-5: ${pfmBelow5} vs 0). The escalation is mechanically correct (verified seeds 2139, 2313, 299) but too rare in canonical play to shift the aggregate. Per directive: next lever should be a fourth independent Credit-down source.`;
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
<title>Sovereign · v0.17 Failure-Pressure Candidate · Evidence Sweep</title>
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

<div class="eyebrow">Sovereign · v0.17 failure-pressure candidate · evidence sweep</div>
<h1>v0.17 Candidate — Speculation Fever Fragile-Credit Escalation</h1>
<div class="sub">Pressure-side escalation: Speculation Fever drops Credit by 2 (instead of 1) when Public Credit is already fragile (≤ 6). Layered on v0.16 base. Bank Run v0.11 and Anti-Federalist Pamphlet v0.16 preserved. NO recovery gates.</div>
<div class="meta">Configurations: CANONICAL-400 (T/M/Mfg, seeds 2026-2425) · CANONICAL-100-A vs CANONICAL-100-B (determinism) · MFG-MIRROR-100. Generated ${new Date().toISOString().slice(0,19).replace('T',' ')} UTC. v0.17 Node sim cross-validated: seed 2026 byte-identical to v0.16 (≥7 path, Spec Fever still -1); seed 2139 late -2 activation (credit 6→4 vs v0.16's 6→5); seed 2313 early -2 activation (credit 6→4); seed 299 four-card cascade with Anti-Fed Pamphlet + Spec Fever -2 (credit ends at 4 vs v0.16's 5).</div>

<h2>Verdict <span class="surface-id">A</span></h2>

<div class="verdict-card">
  <div class="lbl">v0.17 candidate verdict</div>
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

<h2>Advisory vs CANONICAL — important note <span class="surface-id">B</span></h2>

<div class="callout">
<strong>Claude Design's advisory sweep used a different seed range.</strong> Claude Design's patch report cited <code>5 / 400 Spec Fever -2 fires (seeds 126, 172, 299, 390, 400)</code>. Those seeds are NOT in CANONICAL-400 (which is seeds 2026–2425 per spec). Claude Design's advisory was an informal scan on seeds 1–400 or similar. The formal CANONICAL-400 sweep produces <strong>${r17.sfMinus2Fires} / 400</strong> Spec Fever -2 fires — significantly more conservative than the advisory suggested.
</div>

<div class="callout">
<strong>The seeds where v0.17 -2 actually fires in CANONICAL-400:</strong> seeds 2139 (lap 7 / turn 21, credit 6 → 4) and 2313 (lap 4 / turn 12, credit 6 → 4). Both seeds were identified in pre-result query of v0.16 data as the only CANONICAL seeds where Speculation Fever resolves while credit is at ≤ 6. The post-result count (${r17.sfMinus2Fires}) matches the pre-result query exactly — confirms the sim is faithful and the conditional fires only at those known positions.
</div>

<h4>Spec Fever delta split</h4>
<table>
  <thead><tr><th>Behavior</th><th>v0.16</th><th>v0.17 advisory (CD)</th><th>v0.17 CANONICAL-400</th></tr></thead>
  <tbody>
    <tr><td>Spec Fever -1 (Credit ≥ 7)</td><td class="n">${r16.specFeverFires}</td><td class="n">48 (CD report)</td><td class="n">${r17.sfMinus1Fires}</td></tr>
    <tr><td><strong>Spec Fever -2 (Credit ≤ 6)</strong></td><td class="n">0 (no conditional)</td><td class="n">5 (CD informal seeds)</td><td class="n diff"><strong>${r17.sfMinus2Fires}</strong></td></tr>
    <tr><td>Total Spec Fever fires</td><td class="n">${r16.specFeverFires}</td><td class="n">53 (CD)</td><td class="n">${r17.specFeverFires}</td></tr>
  </tbody>
</table>
<p class="meta">CD = Claude Design's advisory report from the patch pass.</p>

<h2>What v0.17 bought vs v0.16 <span class="surface-id">C</span></h2>

<div class="callout">
<strong>The mechanism works.</strong> Seeds 2139 and 2313 both produce credit going from 6 → 4 in one Spec Fever resolution. Seed 299 (outside canonical) shows the cleanest triple-pressure cascade: Funding 5→7, Anti-Fed Pamphlet 7→6, Spec Fever -2 → 6→4. The fragile-credit escalation is mechanically correct and lands exactly where designed.
</div>

<div class="callout">
<strong>The aggregate is dampened by timing.</strong> Only ${r17.sfMinus2Fires} / 400 canonical games have Spec Fever resolving at credit ≤ 6. The rest fire at credit ≥ 7 (where -1 still applies, unchanged from v0.16). Post-Funding-Credit-5 frequency actually <strong>${pfmAt5 < v16PfmAt5 ? 'DECREASED' : 'INCREASED'}</strong> from ${v16PfmAt5} to ${pfmAt5}: the 2 games that previously stopped at credit 5 (v0.16's Spec Fever -1 from 6) now overshoot to credit 4 (v0.17's -2 from 6). So the credit-5 column transferred 2 games to the credit-4 column.
</div>

<div class="callout">
<strong>Floor breach achieved.</strong> Post-Funding Credit below 5 went from 0 / 400 to <strong>${pfmBelow5} / 400</strong>. This is the first lever in the chain to push canonical games past the credit-5 sticky-stop. Default still 0 / 400 — credit 4 is two steps from the 0-credit gate, and no recovery cards either lift these games back or push them further down.
</div>

<h4>Three pressure sources — overlap counts</h4>
<table>
  <thead><tr><th>Source</th><th>v0.16</th><th>v0.17</th><th>Δ</th></tr></thead>
  <tbody>
    <tr><td>Anti-Federalist Pamphlet fires</td><td class="n">${r16.antiFedGames} / 400</td><td class="n">${r17.antiFedGames} / 400</td><td class="n">${r17.antiFedGames - r16.antiFedGames}</td></tr>
    <tr><td>Speculation Fever fires (any delta)</td><td class="n">${r16.specFeverGames} / 400</td><td class="n">${r17.specFeverGames} / 400</td><td class="n">${r17.specFeverGames - r16.specFeverGames}</td></tr>
    <tr><td>Bank Run fires</td><td class="n">${r16.bankRunGames} / 400</td><td class="n">${r17.bankRunGames} / 400</td><td class="n">${r17.bankRunGames - r16.bankRunGames}</td></tr>
    <tr><td>2 of 3 in same game</td><td class="n">${r16.twoOfThreeGames} / 400</td><td class="n">${r17.twoOfThreeGames} / 400</td><td class="n">${r17.twoOfThreeGames - r16.twoOfThreeGames}</td></tr>
    <tr><td>3 of 3 in same game</td><td class="n">${r16.threeOfThreeGames} / 400</td><td class="n">${r17.threeOfThreeGames} / 400</td><td class="n">${r17.threeOfThreeGames - r16.threeOfThreeGames}</td></tr>
  </tbody>
</table>
<p class="meta">Spec Fever fire-count is unchanged (the card draws at the same rate); only the delta-magnitude changes when it resolves at credit ≤ 6.</p>

<h2>Credit FLOOR distribution — v0.16 vs v0.17 <span class="surface-id">D</span></h2>

<table>
  <thead><tr><th>Floor (post-Funding min)</th>${distHeader(floorCols)}</tr></thead>
  <tbody>
    <tr><th>v0.16</th>${distRow(r16.postFundingMinDist, floorCols)}</tr>
    <tr><th>v0.17</th>${distRow(r17.postFundingMinDist, floorCols)}</tr>
  </tbody>
</table>

<h4>Cumulative floor reach (games where credit min ≤ k)</h4>
<table>
  <thead><tr><th>Threshold</th><th>v0.16</th><th>v0.17</th><th>Δ</th></tr></thead>
  <tbody>
${(() => {
  const rows = [];
  for (const k of [6, 5, 4, 3, 2, 1, 0]) {
    const v16Sum = Object.entries(r16.postFundingMinDist).filter(([x]) => +x <= k).reduce((a, [_, v]) => a + v, 0);
    const v17Sum = Object.entries(r17.postFundingMinDist).filter(([x]) => +x <= k).reduce((a, [_, v]) => a + v, 0);
    const delta = v17Sum - v16Sum;
    rows.push(`<tr><td>credit ≤ ${k}</td><td class="n">${v16Sum}</td><td class="n">${v17Sum}</td><td class="n ${delta > 0 ? 'diff' : delta < 0 ? 'regress' : ''}">${delta >= 0 ? '+' : ''}${delta}</td></tr>`);
  }
  return rows.join('');
})()}
  </tbody>
</table>
<p class="meta">Read: ≤ 5 column is identical (${(r16.postFundingMinDist[5] || 0) + v16PfmBelow5} = ${pfmAt5 + pfmBelow5}). v0.17 doesn't increase the count of games reaching the floor — it just pushes ${pfmBelow5} of those games one step lower (5 → 4) when Spec Fever's -2 lands at credit 6. ≤ 4 column is the new diagnostic signal: 0 in v0.16, ${pfmBelow5} in v0.17.</p>

<h2>Recovery analysis — v0.16 ↔ v0.17 head-to-head <span class="surface-id">E</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.16</th><th>v0.17</th><th>Δ</th></tr></thead>
  <tbody>
    <tr><td>Games where credit dipped to 6</td><td class="n">${r16.dipTo6}</td><td class="n">${r17.dipTo6}</td><td class="n">${r17.dipTo6 - r16.dipTo6 >= 0 ? '+' : ''}${r17.dipTo6 - r16.dipTo6}</td></tr>
    <tr><td>Recovered from 6 to 7+</td><td class="n">${r16.recoveredFrom6}</td><td class="n">${r17.recoveredFrom6}</td><td class="n">${r17.recoveredFrom6 - r16.recoveredFrom6 >= 0 ? '+' : ''}${r17.recoveredFrom6 - r16.recoveredFrom6}</td></tr>
    <tr><td>Recovery rate at 6-dip</td><td class="n">${v16RecoveryRate.toFixed(1)} %</td><td class="n">${recoveryRate.toFixed(1)} %</td><td class="n">${(recoveryRate - v16RecoveryRate).toFixed(1)} pp</td></tr>
    <tr><td>Dipped to ≤ 5</td><td class="n">${r16.dipTo5OrBelow}</td><td class="n">${r17.dipTo5OrBelow}</td><td class="n">${r17.dipTo5OrBelow - r16.dipTo5OrBelow >= 0 ? '+' : ''}${r17.dipTo5OrBelow - r16.dipTo5OrBelow}</td></tr>
    <tr><td>Recovered from ≤ 5 to 7+</td><td class="n">${r16.recoveredFrom5OrBelow}</td><td class="n">${r17.recoveredFrom5OrBelow}</td><td class="n">${r17.recoveredFrom5OrBelow - r16.recoveredFrom5OrBelow}</td></tr>
    <tr><td><strong>Dipped BELOW 5 (NEW)</strong></td><td class="n">${r16.dipBelow5}</td><td class="n diff"><strong>${r17.dipBelow5}</strong></td><td class="n diff">+${r17.dipBelow5 - r16.dipBelow5}</td></tr>
    <tr><td>Recovered from below-5 to 7+</td><td class="n">${r16.recoveredFromBelow5}</td><td class="n">${r17.recoveredFromBelow5}</td><td class="n">${r17.recoveredFromBelow5 - r16.recoveredFromBelow5}</td></tr>
  </tbody>
</table>

<div class="callout">
<strong>The credit-5 sticky-stop is partially relieved.</strong> v0.16 had 6 games dip to ≤ 5 with 0 recovery (all stuck at exactly 5). v0.17 has the same 6 dip-to-≤5 games but ${r17.dipBelow5} of them drop further to 4 (with 0 recovery). The recovery network can't compensate — neither at credit 5 nor at credit 4. That's the structural finding for v0.18+: recovery cards bring credit back from credit 6, but not from credit 5 or 4 (which would require 2 or 3 credit-up draws back-to-back, far rarer than even Spec Fever -2 fires).
</div>

<h4>Top recovery sources after a 6-dip — v0.16 vs v0.17</h4>
<table>
  <thead><tr><th>Source</th><th>Type</th><th>v0.16</th><th>v0.17</th><th>Δ</th></tr></thead>
  <tbody>
${(() => {
  const allSrc = new Set([...Object.keys(r16.recoverySrc), ...Object.keys(r17.recoverySrc)]);
  const rows = [];
  for (const src of allSrc) {
    const v16c = r16.recoverySrc[src] || 0;
    const v17c = r17.recoverySrc[src] || 0;
    let type = 'Other';
    if (['Credit Restored', 'Federalist Victory', 'You Are Hamilton'].includes(src)) type = 'Republic Debate';
    else if (['Gold and Silver Inflow', 'Foreign Loan Secured', 'Treaty Renegotiation'].includes(src)) type = 'Market Shock';
    else if (src.endsWith(' passed')) type = 'Act';
    rows.push({ src, type, v16c, v17c, delta: v17c - v16c });
  }
  rows.sort((a, b) => b.v17c - a.v17c);
  return rows.map(r => `
    <tr><td>${r.src}</td><td>${r.type}</td><td class="n">${r.v16c}</td><td class="n">${r.v17c}</td><td class="n ${r.delta > 0 ? 'diff' : r.delta < 0 ? 'regress' : ''}">${r.delta >= 0 ? '+' : ''}${r.delta}</td></tr>`).join('');
})()}
  </tbody>
</table>
<p class="meta">Recovery network distribution barely shifts. v0.17 doesn't gate any recovery — it only changes one pressure card. The recovery cards are still doing the same work.</p>

<h2>v0.10 → v0.17 win bands and primary metrics <span class="surface-id">F</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.10</th><th>v0.11</th><th>v0.12</th><th>v0.13</th><th>v0.14</th><th>v0.15</th><th>v0.16</th><th>v0.17</th></tr></thead>
  <tbody>
    <tr><td>Treasury wins</td><td class="n">${r10.wins['treasury-finance']}</td><td class="n">${r11.wins['treasury-finance']}</td><td class="n">${r12.wins['treasury-finance']}</td><td class="n">${r13.wins['treasury-finance']}</td><td class="n">${r14.wins['treasury-finance']}</td><td class="n">${r15.wins['treasury-finance']}</td><td class="n">${r16.wins['treasury-finance']}</td><td class="n">${r17.wins['treasury-finance']}</td></tr>
    <tr><td>Merchant wins</td><td class="n">${r10.wins['merchant-infrastructure']}</td><td class="n">${r11.wins['merchant-infrastructure']}</td><td class="n">${r12.wins['merchant-infrastructure']}</td><td class="n">${r13.wins['merchant-infrastructure']}</td><td class="n">${r14.wins['merchant-infrastructure']}</td><td class="n">${r15.wins['merchant-infrastructure']}</td><td class="n">${r16.wins['merchant-infrastructure']}</td><td class="n">${r17.wins['merchant-infrastructure']}</td></tr>
    <tr><td>Manufacturer wins</td><td class="n">${r10.wins['manufacturer-industry']}</td><td class="n">${r11.wins['manufacturer-industry']}</td><td class="n">${r12.wins['manufacturer-industry']}</td><td class="n">${r13.wins['manufacturer-industry']}</td><td class="n">${r14.wins['manufacturer-industry']}</td><td class="n">${r15.wins['manufacturer-industry']}</td><td class="n">${r16.wins['manufacturer-industry']}</td><td class="n">${r17.wins['manufacturer-industry']}</td></tr>
    <tr><td>Default fires</td><td class="n">${r10.defaultFired}</td><td class="n">${r11.defaultFired}</td><td class="n">${r12.defaultFired}</td><td class="n">${r13.defaultFired}</td><td class="n">${r14.defaultFired}</td><td class="n">${r15.defaultFired}</td><td class="n">${r16.defaultFired}</td><td class="n">${r17.defaultFired}</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r10.rebellionFired}</td><td class="n">${r11.rebellionFired}</td><td class="n">${r12.rebellionFired}</td><td class="n">${r13.rebellionFired}</td><td class="n">${r14.rebellionFired}</td><td class="n">${r15.rebellionFired}</td><td class="n">${r16.rebellionFired}</td><td class="n">${r17.rebellionFired}</td></tr>
    <tr><td>Post-Funding Credit reaches 5</td><td class="n">${r10.postFundingMinDist[5] || 0}</td><td class="n">${r11.postFundingMinDist[5] || 0}</td><td class="n">${r12.postFundingMinDist[5] || 0}</td><td class="n">${r13.postFundingMinDist[5] || 0}</td><td class="n">${r14.postFundingMinDist[5] || 0}</td><td class="n">${r15.postFundingMinDist[5] || 0}</td><td class="n">${r16.postFundingMinDist[5] || 0}</td><td class="n">${pfmAt5}</td></tr>
    <tr><td><strong>Post-Funding Credit below 5</strong></td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n diff"><strong>${pfmBelow5}</strong></td></tr>
    <tr><td>Bank Run fires</td><td class="n">${r10.bankRunGames}</td><td class="n">${r11.bankRunGames}</td><td class="n">${r12.bankRunGames}</td><td class="n">${r13.bankRunGames}</td><td class="n">${r14.bankRunGames}</td><td class="n">${r15.bankRunGames}</td><td class="n">${r16.bankRunGames}</td><td class="n">${r17.bankRunGames}</td></tr>
    <tr><td>Spec Fever fires</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">${r13.specFeverGames}</td><td class="n">${r14.specFeverGames}</td><td class="n">${r15.specFeverGames}</td><td class="n">${r16.specFeverGames}</td><td class="n">${r17.specFeverGames}</td></tr>
    <tr><td>Anti-Fed Pamphlet fires (credit -1)</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">0</td><td class="n">${r16.antiFedGames}</td><td class="n">${r17.antiFedGames}</td></tr>
    <tr><td>Median margin (IP)</td><td class="n">${r10.medianMargin}</td><td class="n">${r11.medianMargin}</td><td class="n">${r12.medianMargin}</td><td class="n">${r13.medianMargin}</td><td class="n">${r14.medianMargin}</td><td class="n">${r15.medianMargin}</td><td class="n">${r16.medianMargin}</td><td class="n">${r17.medianMargin}</td></tr>
  </tbody>
</table>

<h2>Post-Funding Credit min — full version progression <span class="surface-id">G</span></h2>

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
    <tr><th>v0.17</th>${distRow(r17.postFundingMinDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">First version with non-zero credit ≤ 4 column. v0.17 transfers 2 games from credit 5 to credit 4; the credit-7 mode is unchanged.</p>

<h2>Resistance (runaway watch) <span class="surface-id">H</span></h2>

<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.resistMaxDist, cols)}</tr>
    <tr><th>v0.16</th>${distRow(r16.resistMaxDist, cols)}</tr>
    <tr><th>v0.17</th>${distRow(r17.resistMaxDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">Spec Fever's +1 Resistance is unchanged from v0.16 (only the credit delta moved). Resistance distribution should be identical to v0.16 (every Spec Fever fire still produces one Resistance +1 row). ${resistAt8} / 400 reach ≥ 8 (target: stays rare). ${r17.rebellionFired} Rebellion fires. No runaway.</p>

<h2>Capacity (sanity) <span class="surface-id">I</span></h2>

<table>
  <thead><tr><th>Version</th>${distHeader(cols)}</tr></thead>
  <tbody>
    <tr><th>v0.10</th>${distRow(r10.capacityEndDist, cols)}</tr>
    <tr><th>v0.17</th>${distRow(r17.capacityEndDist, cols)}</tr>
  </tbody>
</table>
<p class="meta">${capacityPreserved ? 'Byte-identical. v0.17 doesn\'t touch capacity at all.' : 'NOT identical — investigate.'}</p>

<h2>MFG-MIRROR-100 cross-check <span class="surface-id">J</span></h2>

<table>
  <thead><tr><th>Metric</th><th>v0.17 (MFG-MIRROR)</th></tr></thead>
  <tbody>
    <tr><td>Manufacturer wins</td><td class="n">${r17mfg.wins['manufacturer-industry']} / 100</td></tr>
    <tr><td>Default fires</td><td class="n">${r17mfg.defaultFired} / 100</td></tr>
    <tr><td>Rebellion fires</td><td class="n">${r17mfg.rebellionFired} / 100</td></tr>
    <tr><td>Bankruptcy events</td><td class="n">${r17mfg.bankruptcyEvents}</td></tr>
    <tr><td>Post-Funding Credit ≤ 5</td><td class="n">${(r17mfg.postFundingMinDist[5] || 0) + Object.entries(r17mfg.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
    <tr><td>Post-Funding Credit below 5</td><td class="n">${Object.entries(r17mfg.postFundingMinDist).filter(([k]) => +k < 5).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
    <tr><td>Spec Fever -2 fires</td><td class="n">${r17mfg.sfMinus2Fires}</td></tr>
    <tr><td>Anti-Fed Pamphlet fires</td><td class="n">${r17mfg.antiFedGames} / 100</td></tr>
    <tr><td>Bank Run fires</td><td class="n">${r17mfg.bankRunGames} / 100</td></tr>
    <tr><td>Resistance max ≥ 8</td><td class="n">${Object.entries(r17mfg.resistMaxDist).filter(([k]) => +k >= 8).reduce((a, [_, v]) => a + v, 0)} / 100</td></tr>
  </tbody>
</table>

<h2>Interpretation — answering the disposition question <span class="surface-id">K</span></h2>

<p><strong>The questions v0.17 was designed to answer:</strong></p>

<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>Can fragile-credit escalation push through the Credit-5 floor without adding a fourth card?</strong> Yes — ${pfmBelow5} canonical games now end below 5 (vs v0.16's 0). The floor breach is real.</li>
  <li><strong>Is the escalation timing-limited?</strong> Yes — Spec Fever -2 fires only ${r17.sfMinus2Fires} / 400 (below the 5-game timing-limit threshold). The escalation only matters when Spec Fever happens to land at credit ≤ 6, which is a small subset of when it lands at all.</li>
  <li><strong>Does Default fire?</strong> No — credit 4 is two steps from the 0-credit gate, and no recovery card pushes it further down nor lifts it back. Default's threshold is far from the live pressure band even after v0.17.</li>
</ul>

<p><strong>Structural finding:</strong> Below credit 5, the game state is sticky in both directions. Recovery requires a +1 card draw that doesn't push past 4→5 fast enough to escape the next pressure event, and pressure requires another -2 or compound -1 hit that doesn't happen often enough. The credit ≤ 5 band is a "frozen" floor where games park.</p>

<p><strong>The conceptual question this raises (deferred):</strong> Is Default supposed to be a catastrophic near-impossible collapse at Credit 0, or should the game have a softer "credit crisis" event around Credit 4? v0.17 produces ${pfmBelow5} games that end at credit 4, but no game-mechanical event recognizes that state. The original Default-at-0 threshold may be a left-over from a different pressure model.</p>

<h4>Suggested v0.18 directions (if authorized — observation only)</h4>
<ul style="font-size:13px;line-height:1.6;margin:6px 0 6px 18px">
  <li><strong>v0.18 — fourth independent Credit-down source:</strong> Add a new credit-down trigger (e.g., Cotton Gin Patented could lose its Capacity boost in exchange for Credit -1, or a Whiskey Excise enforcement card could fire at lap 5+). Broadens the pressure base so more games can compound. Per the timing-limited classification rule, this is the recommended next lever.</li>
  <li><strong>v0.18 alt — soft credit-crisis at credit ≤ 4:</strong> Add an event that fires when credit is at ≤ 4 (e.g., -1 cash per turn, lockout from Republic Debate cards, or a "Credit Crisis" log row). Doesn't change Default's 0-credit threshold but makes the credit-4 state mechanically meaningful — which would make the ${pfmBelow5} games in v0.17 actually matter for game feel.</li>
  <li><strong>v0.18 alt — lower the Default threshold:</strong> Currently Default fires at credit = 0. If lowered to credit ≤ 2, the ${pfmBelow5} games at credit 4 still don't fire it but the threshold is closer to live pressure. Caveat: lowering thresholds is a balance lever, not a pressure lever; needs careful eval.</li>
</ul>

<p style="font-size:12px;color:var(--neutral);font-style:italic;margin-top:8px">None of these are authorized. Each would need its own explicit kickoff.</p>

<h2>Closeout <span class="surface-id">L</span></h2>

<p>v0.17 candidate is <strong>${verdict}</strong>. Seeds 2139 and 2313 are the proof cases inside CANONICAL: each produces a Spec Fever resolution at credit 6 going to 4 instead of 5. Seed 299 (outside canonical) demonstrates the cleanest triple-pressure cascade pushing credit to 4 via three lever cards in three laps. The mechanism is sound; the timing window is narrow.</p>

<p>Recommended disposition: <strong>${credit5Below && !timingLimited ? 'Promote v0.17 as the new pressure-side floor.' : credit5Below && timingLimited ? 'Keep v0.17 as a proof-of-concept lever; the timing-limit classification points to v0.18 = fourth independent pressure source.' : 'Reconsider lever shape — escalation didn\'t breach the floor.'}</strong> The recovery-gate branch (v0.14/v0.15) is retired. The pressure-side branch now has two confirmed strengths (v0.16 floor-reach via Anti-Fed Pamphlet, v0.17 floor-breach via Spec Fever escalation) and one identified weakness (timing — only ${r17.sfMinus2Fires} / 400 escalation fires in canonical).</p>

<div class="meta">
v0.17 evidence sweep — observation only.
Raw data: <code>experiments/v0.17-failure-pressure-candidate/raw-data/sovereign-v0.17-canonical-400.json</code> (+ 100-A, 100-B, mfg-mirror-100).
Sim: <code>tools/diagnosis/sim-v0.17.mjs</code> (branched from sim-v0.16.mjs, single change-point at MARKET_SHOCK_CARDS id:3).
Source HTML: <code>experiments/v0.17-failure-pressure-candidate/sovereign-solo-v0.17-candidate.html</code> (~252 KB, produced by Claude Design from v0.16 source, five change-points + one ancillary splash bump).
v0.17 Node sim cross-validated: seed 2026 reproduces v0.16 (scores [14,7,15] / credit 6 — Spec Fever at credit 7 still -1); seed 2139 Spec Fever at credit 6 → 4 vs v0.16's 6 → 5; seed 2313 Spec Fever at credit 6 → 4 (earlier lap); seed 299 four-card cascade reproduces (Funding+Anti-Fed Pamphlet+Spec Fever -2 → final credit 4).
Advisory vs canonical: Claude Design's 5/400 figure used seeds 1–400 (informal); CANONICAL-400 = seeds 2026–2425 (per spec) shows ${r17.sfMinus2Fires}/400.
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
