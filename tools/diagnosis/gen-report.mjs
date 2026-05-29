/* Generate the Failure Event Pressure Diagnosis HTML report. */
import { analyzeAll } from './analyze.mjs';
import { writeFileSync } from 'node:fs';

const REPORT_PATH = 'E:/AI/sovereign/release/balance-evidence/sovereign-failure-pressure-diagnosis.html';

const fmt = (n, d = 2) => (typeof n === 'number' ? n.toFixed(d) : n);
const intf = (n) => (typeof n === 'number' ? Math.round(n).toLocaleString('en-US') : n);

function distRow(distMap, valuesAscending) {
  /* render a small bar chart from a value->count map, scaled to max */
  const max = Math.max(0, ...Object.values(distMap));
  const cells = valuesAscending.map(v => {
    const c = distMap[v] || 0;
    const w = max === 0 ? 0 : (c / max) * 100;
    return `<td class="bar-cell"><div class="bar" style="width:${w.toFixed(1)}%"></div><span class="bar-num">${c}</span></td>`;
  }).join('');
  const hdr = valuesAscending.map(v => `<th class="bar-h">${v}</th>`).join('');
  return { hdr, cells };
}

function sourceTable(sources, opts = {}) {
  if (sources.length === 0) return '<p class="empty">None observed across 400 games.</p>';
  const rows = sources.map(s => {
    const dir = s.totalAppliedDelta >= 0 ? 'pos' : 'neg';
    const sign = s.totalAppliedDelta >= 0 ? '+' : '';
    return `<tr>
      <td><span class="src-type">${s.sourceType}</span></td>
      <td>${s.sourceName}</td>
      <td class="n">${s.count}</td>
      <td class="n ${dir}">${sign}${s.totalAppliedDelta}</td>
      <td class="n">${s.avgLap == null ? '—' : 'L' + fmt(s.avgLap, 2)}</td>
      <td class="n">${s.gamesWithIt} <span class="muted">(${s.pctGamesWithIt} %)</span></td>
    </tr>`;
  }).join('');
  return `<table class="full">
    <thead><tr><th>Source type</th><th>Source name</th><th>Fires</th><th>Total Δ</th><th>Avg lap</th><th>Games (% of 400)</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

const r = analyzeAll();
const c = r.canonical400;
const m = r.mfgMirror100;

/* ----------  Executive verdict classification ---------- */
const verdicts = {
  default: {
    classification: 'source events absent',
    detail: 'Credit min is 5 in every one of 400 games — the track never decreases. There are zero credit-down sources in the v0.10 system (no card, no Act, no space pushes the credit track downward via adjustTrack). The Default threshold (credit = 0) is unreachable not because the threshold is too far, but because the down-pressure channel does not exist. Lowering the threshold alone cannot fix this. A pressure source must be added.',
  },
  rebellion: {
    classification: 'pressure sources present but too weak / too rare',
    detail: 'Resistance max ceiling observed is 6 across 400 games (target 12). Mean max is 2.70, median max is 3. Three Acts that would raise Resistance (Assumption +1, Tariff +1, Excise Enforcement +2) never pass under canonical profile play because their majority votes fail in the T/M/Mfg triplet. The remaining sources (Speculation Scandal tax space, Anti-Federalist Pamphlet, Speculation Fever, Jeffersonian Opposition) net only +0.63 resistance per game on average — and Cabinet Bargain (-1) cancels a substantial fraction. The threshold is roughly 6 points beyond where the track actually lives. Even halving the threshold to 8 would fire in 0 % of canonical games per this data.',
  },
  bankruptcy: {
    classification: 'pressure sources insufficient — economy is liquidity-positive',
    detail: 'Only 1 of 400 games has any player ever drop below 0 cash. Only 14 of 400 (3.5 %) ever drop below 200. The Treasury Opens landed-on bonus of 400 TN, the Industrial Charter free property, and the absence of escalating fixed costs (no upkeep) keep cash floors well above zero. The Manufacturer profile gets closest because the Shipbuilding Yard purchase (400 TN at L5–L6) is the largest single cash event of the canonical game — but at that lap the Manufacturer typically holds 800–1200 TN, so the buy lands at a high cash floor, not a crisis floor.',
  },
};

/* ----------  Candidate levers — ranked by safety to v0.10 balance ---------- */
const levers = [
  {
    rank: 1,
    target: 'Bankruptcy',
    side: 'pressure-source',
    name: 'Reduce Treasury Opens landed-on bonus from 400 TN → 300 TN (or 200 TN)',
    expected: 'Bankruptcy: ↑ 2–6 %. Default: no direct effect. Rebellion: none.',
    rationale: 'The 400 TN landed-on bonus is the largest cash injection in the game. Halving the multiplier (4× → 2×) would compound across 400 games with no rule-shape change and no card-deck change. Affects every profile equally. Pass-through bonus (200 TN) stays.',
    risk: 'Mild. Likely 1–3 IP shift in win margins. Manufacturer profile most exposed (industrial purchases late lap = thin cash). Test before commit.',
  },
  {
    rank: 2,
    target: 'Default',
    side: 'pressure-source',
    name: 'Convert "Bank Run" card from -1 capacity to -1 credit (or -1 credit AND -1 capacity)',
    expected: 'Default: introduces the only credit-down channel in the game. With Bank Run firing ~3–4 % per game and currently no other credit-down source, this single change converts credit from a one-way ratchet into a directional track. Still wouldn\'t reliably reach 0 — but would establish the channel for future tuning.',
    rationale: 'Bank Run is conditionally lethal (requires Charter passed, which happens ~100 % of canonical) and historically aligned with credit collapse. The capacity-only effect is mechanically thin. Re-wiring it to credit puts a natural credit-down pressure on the same draw frequency without inventing a new card.',
    risk: 'Low–medium. Bank Run currently does -1 capacity ~3–4 % of games; the swap removes that capacity nudge from the system. Would need a follow-up to check whether the Capacity ≥ 6 / ≥ 8 thresholds still hit at the same rate.',
  },
  {
    rank: 3,
    target: 'Rebellion',
    side: 'pressure-source',
    name: 'When Assumption / Tariff / Excise Enforcement Acts FAIL the vote, still apply +1 resistance as "lobby pressure"',
    expected: 'Rebellion: ↑ from 0 % to roughly 10–30 % depending on which acts fail. Mean resistance max likely rises from 2.7 to 5–7. Acts already always pass for Funding (lap 1), so resistance baseline still rises by 2 (Funding doesn\'t change). The three resistance-pushing Acts are the ones that fail, which is exactly the lever target.',
    rationale: 'The Acts already model historical resistance (Assumption, Tariff, Excise). Currently failure = nothing happens. A failed-vote +1 resistance simulates "the proposal alone inflamed opposition, even though it didn\'t pass" — historically faithful for Anti-Federalist tensions. Mechanically targeted at the exact dead-air zone.',
    risk: 'Medium. Adds resistance pressure systematically. Could push the Whiskey Rebellion live narration (resistance ≥ 8) into common occurrence, which then activates the Whiskey Rebellion conditional card. Net 0 effect on cash, win rates likely shift 2–5 IP toward the Treasury-style profile that already votes against these Acts.',
  },
  {
    rank: 4,
    target: 'Rebellion',
    side: 'threshold',
    name: 'Lower Rebellion threshold from 12 → 10 (or 9, or 8)',
    expected: 'Rebellion: still 0 % of canonical-400. Max observed is 6. Even at threshold 7 it would still fire 0 %.',
    rationale: 'Threshold lever alone is structurally inert because the track distribution does not approach the new threshold either. Listed for completeness — explicitly NOT recommended.',
    risk: 'No effect at v0.10 pressure levels. Would only become live in combination with a pressure-source lever above. Could matter if e.g. lever 3 raises max to 7+.',
  },
  {
    rank: 5,
    target: 'Default',
    side: 'threshold',
    name: 'Lower Default threshold from credit=0 to credit=1 or credit=2',
    expected: 'Default: still 0 % of canonical-400. Credit min observed is 5. Adjusting where 0 lives is irrelevant when credit floor is 5.',
    rationale: 'Threshold lever alone is structurally inert because the credit track has no down-channel at all. Listed for completeness — explicitly NOT recommended without a pressure-source lever first.',
    risk: 'No effect at v0.10 pressure levels.',
  },
  {
    rank: 6,
    target: 'All three',
    side: 'meta',
    name: 'Keep failure events decorative — document as catastrophic edge cases for human play',
    expected: 'No change. Failure events remain decorative in deterministic batch play, retain their role as drama in live human play where novice mistakes could conceivably push tracks to threshold.',
    rationale: 'The deterministic profiles intentionally minimize risk; human players make worse decisions and could plausibly reach failure thresholds. v0.10 is balanced for scripted-profile play (Treasury 59 / Merchant 25 / Manufacturer 16), and failure events are not part of that target. Documenting them as edge-case ceilings rather than tuning them in is a legitimate choice.',
    risk: 'None — accepts the current state. Cost is design honesty: the game ships with three rule mechanics (Default reset, Rebellion reset, Bankruptcy −1 IP) that almost never fire and so cannot be load-bearing for game shape.',
  },
];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Sovereign · Failure Event Pressure Diagnosis</title>
<style>
  :root{--display:"Baskerville","Big Caslon","Hoefler Text","Garamond","Times New Roman",serif;
        --body:"Iowan Old Style","Georgia","Cambria","Times New Roman",serif;
        --ui:-apple-system,"Segoe UI","Helvetica Neue","Arial",system-ui,sans-serif;
        --mono:"SF Mono","Menlo","Consolas","Courier New",monospace;
        --parchment:#F0E6CD;--parchment-2:#E6DABC;--ink:#1A1612;--highlight:#C8392E;
        --rule-soft:rgba(26,22,18,0.22);--national-finance:#1F2D52;
        --commercial-infrastructure:#2E7A6B;--manufactures:#8C8A2E;
        --p0:#4A6B8A;--p1:#6E1F1E;--p2:#2E7A6B;}
  *{box-sizing:border-box}
  body{margin:0;padding:30px;font-family:var(--body);background:#2A2622;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .doc{max-width:1100px;margin:0 auto;background:var(--parchment);border:1.5px solid var(--ink);padding:30px 40px;position:relative}
  .doc::before{content:"";position:absolute;inset:8px;border:0.5px solid var(--rule-soft);pointer-events:none}
  h1{font-family:var(--display);font-weight:400;font-size:36px;line-height:1;margin:0 0 6px;letter-spacing:0.01em}
  .eyebrow{font-family:var(--ui);font-size:10px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:var(--national-finance);margin-bottom:8px}
  .sub{font-family:var(--display);font-style:italic;font-size:14px;margin-bottom:6px}
  .meta{font-family:var(--mono);font-size:9.5px;opacity:.7;margin-top:4px;border-top:0.5px dashed var(--rule-soft);padding-top:6px}
  h2{font-family:var(--ui);font-size:11px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;margin:22px 0 8px;border-bottom:1px solid var(--ink);padding-bottom:4px;display:flex;justify-content:space-between;align-items:baseline}
  h2 .surface-id{font-family:var(--mono);font-size:9px;letter-spacing:.06em;opacity:.6;text-transform:none}
  h3{font-family:var(--display);font-weight:400;font-size:18px;margin:14px 0 6px}
  h4{font-family:var(--ui);font-size:9.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin:14px 0 4px}
  p{margin:6px 0;line-height:1.5;font-size:13px}
  p.tight{margin:3px 0;font-size:12.5px}
  table{width:100%;border-collapse:collapse;margin-top:6px}
  table.full{margin-top:8px}
  th{background:var(--ink);color:var(--parchment);font-family:var(--ui);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;padding:5px 8px;text-align:left}
  td{font-family:var(--ui);font-size:11px;padding:4px 8px;border-bottom:0.5px solid var(--rule-soft);vertical-align:top}
  td.n{font-family:var(--mono);text-align:right;font-variant-numeric:tabular-nums}
  td.muted, .muted{color:rgba(26,22,18,0.55);font-size:10px}
  .pos{color:var(--commercial-infrastructure)}
  .neg{color:var(--highlight)}
  .verdict-card{background:var(--parchment-2);border:1px solid var(--ink);padding:14px 18px;margin:10px 0}
  .verdict-card .lbl{font-family:var(--ui);font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--national-finance)}
  .verdict-card .nm{font-family:var(--display);font-size:22px;line-height:1;margin:4px 0 6px}
  .verdict-card .cls{font-family:var(--display);font-style:italic;font-size:13px;color:var(--highlight);margin-bottom:6px}
  .verdict-card .det{font-size:12.5px;line-height:1.55}
  .bar-cell{font-family:var(--mono);font-size:9.5px;padding:3px 4px;border-bottom:0.5px solid var(--rule-soft);position:relative;text-align:right;min-width:36px}
  .bar-cell .bar{position:absolute;left:2px;top:50%;transform:translateY(-50%);height:8px;background:var(--manufactures);opacity:.45;border-radius:1px}
  .bar-cell .bar-num{position:relative;font-variant-numeric:tabular-nums}
  th.bar-h{font-family:var(--mono);font-size:9px;text-align:center;padding:3px 4px}
  .src-type{font-family:var(--ui);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--national-finance);font-weight:700;padding:1.5px 5px;border:0.5px solid var(--rule-soft);background:var(--parchment-2);border-radius:1px;display:inline-block}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}
  .grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;align-items:start}
  .card{background:var(--parchment-2);border:1px solid var(--ink);padding:10px 12px}
  .card .who{font-family:var(--display);font-size:14px;margin-bottom:2px}
  .card .v{font-family:var(--mono);font-size:11px;letter-spacing:.05em}
  .empty{font-family:var(--display);font-style:italic;font-size:12px;color:rgba(26,22,18,0.55);margin:6px 0}
  .legend{font-family:var(--mono);font-size:9.5px;opacity:.7;margin-top:4px}
  .interp p{font-size:13px;line-height:1.6}
  .lever{background:var(--parchment-2);border:1px solid var(--ink);padding:12px 14px;margin:8px 0}
  .lever .head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}
  .lever .rank{font-family:var(--ui);font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--national-finance);font-weight:700}
  .lever .target{font-family:var(--ui);font-size:9px;letter-spacing:.14em;text-transform:uppercase;padding:2px 6px;border:0.5px solid var(--rule-soft);background:var(--parchment)}
  .lever .nm{font-family:var(--display);font-size:16px;line-height:1.2;margin:4px 0 6px}
  .lever .row{display:grid;grid-template-columns:1fr 3fr;gap:8px;font-size:11.5px;margin-top:3px;line-height:1.5}
  .lever .row .k{font-family:var(--ui);font-size:9px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:var(--national-finance)}
  .side-pressure{color:var(--commercial-infrastructure)}
  .side-threshold{color:var(--highlight)}
  .side-meta{color:rgba(26,22,18,0.55)}
  .callout{background:var(--parchment-2);border:1px solid var(--ink);padding:10px 14px;margin:8px 0;font-size:12.5px;line-height:1.55}
  .callout strong{color:var(--highlight)}
</style>
</head>
<body>
<div class="doc">

<div class="eyebrow">Sovereign · v0.10 balance · v1.0.2</div>
<h1>Failure Event Pressure Diagnosis</h1>
<div class="sub">Why Default, Rebellion, and Bankruptcy almost never fire — deterministic batch play, 700 games observed.</div>
<div class="meta">Configurations: CANONICAL-400 (T/M/Mfg, seeds 2026-2425) · CANONICAL-100-A vs CANONICAL-100-B (determinism check, byte-identical) · MFG-MIRROR-100 (3× Manufacturer). Generated ${new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC. Reducer byte-identical to release/digital-mode/sovereign-solo.html for all 400 canonical seeds (verified). No rule, threshold, card, Act, profile, scoring, or reducer change.</div>

<h2>1. Executive verdict <span class="surface-id">A</span></h2>

<div class="verdict-card">
  <div class="lbl">Default</div>
  <div class="nm">${c.failureEvents.defaultFired.games} / ${c.n} games fired (${c.failureEvents.defaultFired.pct} %)</div>
  <div class="cls">Verdict: ${verdicts.default.classification}</div>
  <div class="det">${verdicts.default.detail}</div>
</div>

<div class="verdict-card">
  <div class="lbl">Rebellion</div>
  <div class="nm">${c.failureEvents.rebellionFired.games} / ${c.n} games fired (${c.failureEvents.rebellionFired.pct} %)</div>
  <div class="cls">Verdict: ${verdicts.rebellion.classification}</div>
  <div class="det">${verdicts.rebellion.detail}</div>
</div>

<div class="verdict-card">
  <div class="lbl">Bankruptcy</div>
  <div class="nm">${c.failureEvents.bankruptcyEvents.total} bankrupt-lap events across ${c.failureEvents.bankruptcyEvents.games} games (${c.failureEvents.bankruptcyEvents.pct} %)</div>
  <div class="cls">Verdict: ${verdicts.bankruptcy.classification}</div>
  <div class="det">${verdicts.bankruptcy.detail}</div>
</div>

<h2>2. Track trajectory distribution <span class="surface-id">B</span></h2>

<p>For each of the three shared tracks, the distribution of per-game minimum, maximum, and end-of-game values across the 400 canonical games. The Default and Rebellion thresholds (credit = 0; resistance = 12) are shown as the leftmost and rightmost columns respectively.</p>

<h4>Public Credit — starts at 5, threshold at 0</h4>
${(() => {
  const cols = [0,1,2,3,4,5,6,7,8,9,10,11,12];
  const minR = distRow(c.tracks.credit.minDistribution, cols);
  const maxR = distRow(c.tracks.credit.maxDistribution, cols);
  const endR = distRow(c.tracks.credit.endDistribution, cols);
  return `<table class="full">
    <thead><tr><th>Series</th>${minR.hdr}</tr></thead>
    <tbody>
      <tr><th>game min</th>${minR.cells}</tr>
      <tr><th>game max</th>${maxR.cells}</tr>
      <tr><th>game end</th>${endR.cells}</tr>
    </tbody></table>
  <p class="legend">Mean min ${fmt(c.tracks.credit.min.mean)} · mean max ${fmt(c.tracks.credit.max.mean)} · mean end ${fmt(c.tracks.credit.end.mean)} · min observed ${c.tracks.credit.min.min} · max observed ${c.tracks.credit.max.max}.</p>`;
})()}

<div class="callout">
<strong>The credit track is a one-way ratchet upward.</strong> Min value observed across 400 games is 5 — the starting value. Credit never moves below its starting position in any game. The Default threshold could be raised to credit = 4 and it would still fire zero times.
</div>

<h4>Public Resistance — starts at 2, threshold at 12</h4>
${(() => {
  const cols = [0,1,2,3,4,5,6,7,8,9,10,11,12];
  const minR = distRow(c.tracks.resistance.minDistribution, cols);
  const maxR = distRow(c.tracks.resistance.maxDistribution, cols);
  const endR = distRow(c.tracks.resistance.endDistribution, cols);
  return `<table class="full">
    <thead><tr><th>Series</th>${minR.hdr}</tr></thead>
    <tbody>
      <tr><th>game min</th>${minR.cells}</tr>
      <tr><th>game max</th>${maxR.cells}</tr>
      <tr><th>game end</th>${endR.cells}</tr>
    </tbody></table>
  <p class="legend">Mean min ${fmt(c.tracks.resistance.min.mean)} · mean max ${fmt(c.tracks.resistance.max.mean)} · mean end ${fmt(c.tracks.resistance.end.mean)} · max observed ${c.tracks.resistance.max.max} · games reaching the "Whiskey Rebellion live" mark (≥ 8) ${c.tracks.resistance.nearMiss.everAtOrAbove10.games > 0 ? 'at least once' : 'never'}.</p>`;
})()}

<div class="callout">
<strong>Resistance lives between 1 and 6, with the threshold at 12.</strong> Even the Whiskey Rebellion live narration threshold (resistance ≥ 8) fires in 0 of 400 games. The track has roughly 6 points of unused headroom between where it lives and where the failure event sits.
</div>

<h4>Industrial Capacity — starts at 1 (+1 from Industrial Charter), no failure threshold</h4>
${(() => {
  const cols = [0,1,2,3,4,5,6,7,8,9,10,11,12];
  const endR = distRow(c.tracks.capacity.endDistribution, cols);
  return `<table class="full">
    <thead><tr><th>Series</th>${endR.hdr}</tr></thead>
    <tbody>
      <tr><th>game end</th>${endR.cells}</tr>
    </tbody></table>
  <p class="legend">Capacity has no failure-event threshold and is included here for context. The scoring bonuses at ≥ 6 and ≥ 8 are reachable; ≥ 10 milestone is rare.</p>`;
})()}

<h4>Near-miss counts (CANONICAL-400)</h4>
<table class="full">
  <thead><tr><th>Track condition</th><th>Games</th><th>%</th></tr></thead>
  <tbody>
    <tr><td>Public Credit ever ≤ 2 (routes-pay-half threshold)</td><td class="n">${c.tracks.credit.nearMiss.everAtOrBelow2.games}</td><td class="n">${c.tracks.credit.nearMiss.everAtOrBelow2.pct} %</td></tr>
    <tr><td>Public Credit ever ≤ 1</td><td class="n">${c.tracks.credit.nearMiss.everAtOrBelow1.games}</td><td class="n">${c.tracks.credit.nearMiss.everAtOrBelow1.pct} %</td></tr>
    <tr><td>Public Credit ever = 0 (Default)</td><td class="n">${c.tracks.credit.nearMiss.everAtOrBelow0.games}</td><td class="n">${c.tracks.credit.nearMiss.everAtOrBelow0.pct} %</td></tr>
    <tr><td>Public Resistance ever ≥ 10</td><td class="n">${c.tracks.resistance.nearMiss.everAtOrAbove10.games}</td><td class="n">${c.tracks.resistance.nearMiss.everAtOrAbove10.pct} %</td></tr>
    <tr><td>Public Resistance ever ≥ 11</td><td class="n">${c.tracks.resistance.nearMiss.everAtOrAbove11.games}</td><td class="n">${c.tracks.resistance.nearMiss.everAtOrAbove11.pct} %</td></tr>
    <tr><td>Public Resistance ever = 12 (Rebellion)</td><td class="n">${c.tracks.resistance.nearMiss.everAtOrAbove12.games}</td><td class="n">${c.tracks.resistance.nearMiss.everAtOrAbove12.pct} %</td></tr>
  </tbody>
</table>

<h2>3. Pressure source table <span class="surface-id">C</span></h2>

<h4>Aggregate pressure totals across all 400 canonical games</h4>
<table class="full">
  <thead><tr><th>Track / direction</th><th>Total Δ summed across games</th><th>Mean Δ per game</th></tr></thead>
  <tbody>
    <tr><td>Public Credit · upward pressure</td><td class="n pos">+${c.pressure.creditUpTotal}</td><td class="n">+${fmt(c.pressure.creditUpTotal / c.n)}</td></tr>
    <tr><td>Public Credit · downward pressure</td><td class="n neg">${c.pressure.creditDownTotal === 0 ? '0' : '−' + c.pressure.creditDownTotal}</td><td class="n">${c.pressure.creditDownTotal === 0 ? '0' : '−' + fmt(c.pressure.creditDownTotal / c.n)}</td></tr>
    <tr><td>Public Credit · net</td><td class="n"><strong>${c.pressure.avgCreditDeltaPerGame >= 0 ? '+' : ''}${(c.pressure.creditUpTotal - c.pressure.creditDownTotal)}</strong></td><td class="n"><strong>${c.pressure.avgCreditDeltaPerGame >= 0 ? '+' : ''}${fmt(c.pressure.avgCreditDeltaPerGame)}</strong></td></tr>
    <tr><td>Public Resistance · upward pressure</td><td class="n pos">+${c.pressure.resistUpTotal}</td><td class="n">+${fmt(c.pressure.resistUpTotal / c.n)}</td></tr>
    <tr><td>Public Resistance · downward pressure</td><td class="n neg">−${c.pressure.resistDownTotal}</td><td class="n">−${fmt(c.pressure.resistDownTotal / c.n)}</td></tr>
    <tr><td>Public Resistance · net</td><td class="n"><strong>${c.pressure.avgResistDeltaPerGame >= 0 ? '+' : ''}${(c.pressure.resistUpTotal - c.pressure.resistDownTotal)}</strong></td><td class="n"><strong>${c.pressure.avgResistDeltaPerGame >= 0 ? '+' : ''}${fmt(c.pressure.avgResistDeltaPerGame)}</strong></td></tr>
    <tr><td>Industrial Capacity · upward pressure</td><td class="n pos">+${c.pressure.capacityUpTotal}</td><td class="n">+${fmt(c.pressure.capacityUpTotal / c.n)}</td></tr>
    <tr><td>Industrial Capacity · downward pressure</td><td class="n neg">−${c.pressure.capacityDownTotal}</td><td class="n">−${fmt(c.pressure.capacityDownTotal / c.n)}</td></tr>
  </tbody>
</table>

<h4>Credit — sources that DECREASE the track</h4>
${sourceTable(c.pressure.creditDownSources)}
<p class="legend"><strong>No sources observed.</strong> The v0.10 system has no card, no Act, no tax space, and no game event that decreases Public Credit through the adjustTrack helper. The TRIGGER_DEFAULT reducer hard-resets credit to 3 (not a pressure event, a reset), but that triggers only when credit reaches 0, which never happens.</p>

<h4>Credit — sources that INCREASE the track</h4>
${sourceTable(c.pressure.creditUpSources)}

<h4>Resistance — sources that INCREASE the track</h4>
${sourceTable(c.pressure.resistUpSources)}

<h4>Resistance — sources that DECREASE the track</h4>
${sourceTable(c.pressure.resistDownSources)}
<p class="legend">Cabinet Bargain is the only resistance-down channel. It fires in ~11 % of games, offsetting roughly 15 % of the +295 upward pressure across the dataset.</p>

<h4>Capacity — sources that INCREASE the track</h4>
${sourceTable(c.pressure.capacityUpSources)}

<h4>Capacity — sources that DECREASE the track</h4>
${sourceTable(c.pressure.capacityDownSources)}

<h2>4. Bankruptcy pressure <span class="surface-id">D</span></h2>

<p>How close do players get to insolvency in canonical play? Cash starts at 1500 TN. Cash below 0 triggers BANKRUPT (1 lap counted). Cash below 100 is the danger zone for an unexpected rent.</p>

<table class="full">
  <thead><tr><th>Condition</th><th>Games</th><th>%</th></tr></thead>
  <tbody>
    <tr><td>Any player ever &lt; 200 TN</td><td class="n">${c.bankruptcy.anyPlayerBelow200.games}</td><td class="n">${c.bankruptcy.anyPlayerBelow200.pct} %</td></tr>
    <tr><td>Any player ever &lt; 100 TN</td><td class="n">${c.bankruptcy.anyPlayerBelow100.games}</td><td class="n">${c.bankruptcy.anyPlayerBelow100.pct} %</td></tr>
    <tr><td>Any player ever &lt; 0 TN (BANKRUPT)</td><td class="n">${c.bankruptcy.anyPlayerBelow0.games}</td><td class="n">${c.bankruptcy.anyPlayerBelow0.pct} %</td></tr>
  </tbody>
</table>

<h4>Lowest cash any player reached (per game)</h4>
<p class="tight">Distribution of <code>min(min_cash)</code> across the three players in each game, bucketed to 100-TN bins.</p>
${(() => {
  const dist = c.bankruptcy.lowestCashAnyPlayerDistribution;
  const keys = Object.keys(dist).map(Number).sort((a, b) => a - b);
  const max = Math.max(0, ...Object.values(dist));
  const rows = keys.map(k => {
    const cnt = dist[k] || 0;
    const w = max === 0 ? 0 : (cnt / max) * 100;
    return `<tr><td class="n">${k}</td><td class="bar-cell" style="width:auto"><div class="bar" style="width:${w.toFixed(1)}%"></div><span class="bar-num">${cnt}</span></td></tr>`;
  }).join('');
  return `<table class="full" style="max-width:520px"><thead><tr><th>Bucket (TN)</th><th>Games</th></tr></thead><tbody>${rows}</tbody></table>
  <p class="legend">Mean ${intf(c.bankruptcy.lowestCashAnyPlayer.mean)} TN · median ${intf(c.bankruptcy.lowestCashAnyPlayer.median)} TN · range [${intf(c.bankruptcy.lowestCashAnyPlayer.min)}, ${intf(c.bankruptcy.lowestCashAnyPlayer.max)}] TN.</p>`;
})()}

<h4>Lowest cash by profile</h4>
<table class="full">
  <thead><tr><th>Profile</th><th>Mean lowest</th><th>Median</th><th>Min observed</th><th>Max observed</th></tr></thead>
  <tbody>
    ${Object.entries(c.bankruptcy.lowestCashByProfile).map(([prof, s]) => `<tr><td>${prof}</td><td class="n">${intf(s.mean)}</td><td class="n">${intf(s.median)}</td><td class="n">${intf(s.min)}</td><td class="n">${intf(s.max)}</td></tr>`).join('')}
  </tbody>
</table>

<h4>Top 10 largest single cash losses across all 400 games</h4>
<table class="full">
  <thead><tr><th>Seed</th><th>Slot</th><th>Profile</th><th>Loss (TN)</th><th>Lap</th><th>Source</th></tr></thead>
  <tbody>
    ${c.bankruptcy.largestLossesTop10.map(e => `<tr><td>${e.gameSeed}</td><td class="n">${e.slot}</td><td>${e.profile}</td><td class="n neg">−${e.loss}</td><td class="n">L${e.lap}</td><td>${e.reason}</td></tr>`).join('')}
  </tbody>
</table>
<p class="legend">9 of the top 10 cash losses are the Manufacturer profile buying the Shipbuilding Yard (400 TN) at lap 5–6. Even these never come close to bankruptcy — they land at cash floors of 800–1100, well above the 0 threshold. The single bankruptcy event (seed 2247 in the 400 set) is a Manufacturer slot 2 paying a Tier-III rent on Philadelphia Exchange and dropping below 0.</p>

<h4>Bankruptcy trigger histogram</h4>
${(() => {
  const histo = c.bankruptcy.bankruptcyReasonHisto;
  const keys = Object.entries(histo).sort((a, b) => b[1] - a[1]);
  if (keys.length === 0) return '<p class="empty">No cash crossings below 0 observed in canonical-400.</p>';
  return `<table class="full"><thead><tr><th>Reason that pushed cash &lt; 0</th><th>Fires</th></tr></thead><tbody>${keys.map(([r, n]) => `<tr><td>${r}</td><td class="n">${n}</td></tr>`).join('')}</tbody></table>`;
})()}

<h2>5. MFG-MIRROR-100 cross-check <span class="surface-id">E</span></h2>

<p>Does industrial-only pressure on Capacity indirectly affect the failure tracks? Configuration: Manufacturer × 3 slots, seeds 2026-2125, charterEnabled.</p>

<table class="full">
  <thead><tr><th>Metric</th><th>CANONICAL-400</th><th>MFG-MIRROR-100</th></tr></thead>
  <tbody>
    <tr><td>defaultFired games</td><td class="n">${c.failureEvents.defaultFired.games} / ${c.n}  (${c.failureEvents.defaultFired.pct} %)</td><td class="n">${m.failureEvents.defaultFired.games} / ${m.n}  (${m.failureEvents.defaultFired.pct} %)</td></tr>
    <tr><td>rebellionFired games</td><td class="n">${c.failureEvents.rebellionFired.games} / ${c.n}  (${c.failureEvents.rebellionFired.pct} %)</td><td class="n">${m.failureEvents.rebellionFired.games} / ${m.n}  (${m.failureEvents.rebellionFired.pct} %)</td></tr>
    <tr><td>bankruptcyEvents total</td><td class="n">${c.failureEvents.bankruptcyEvents.total}</td><td class="n">${m.failureEvents.bankruptcyEvents.total}</td></tr>
    <tr><td>credit min mean</td><td class="n">${fmt(c.tracks.credit.min.mean)}</td><td class="n">${fmt(m.tracks.credit.min.mean)}</td></tr>
    <tr><td>resistance max mean</td><td class="n">${fmt(c.tracks.resistance.max.mean)}</td><td class="n">${fmt(m.tracks.resistance.max.mean)}</td></tr>
    <tr><td>capacity end mean</td><td class="n">${fmt(c.tracks.capacity.end.mean)}</td><td class="n">${fmt(m.tracks.capacity.end.mean)}</td></tr>
  </tbody>
</table>
<p class="legend">Industrial concentration does not unlock any failure event. The MFG-MIRROR config actually has slightly less resistance pressure than the canonical T/M/Mfg config, because no slot in MFG-MIRROR is built to bid up the resistance-pushing tax spaces or vote for the resistance-raising Acts (Manufacturer profile votes NO on Tariff and Excise Enforcement). Capacity end-of-game is comparable.</p>

<h2>6. Interpretation <span class="surface-id">F</span></h2>

<div class="interp">

<p><strong>Are the thresholds wrong?</strong> No. The thresholds are perfectly placed — they are simply unreachable from where the tracks actually live. Lowering them in isolation produces no behavior change at v0.10 pressure levels.</p>

<p><strong>Are the pressure sources too rare?</strong> Yes for Resistance, and absolutely yes for Credit. The credit-down channel does not exist as a mechanic. The resistance-up channel exists but is dominated by:</p>
<ul>
<li>The three Acts that would raise resistance (Assumption +1, Tariff +1, Excise Enforcement +2) <strong>never pass</strong> under canonical profile play. Their majority votes fail. The 7-lap-cycle is effectively running on Funding Act (+2 credit, no resistance) and Coinage Act (+1 credit + 1 capacity) as the only Acts that fire reliably.</li>
<li>The card-based resistance pressure (Speculation Fever, Anti-Federalist Pamphlet, Jeffersonian Opposition) requires landing on Market Shock or Republic Debate spaces — which happens in ~3 of every 5 turns by board layout. But the spread of these particular cards is 10–13 % of games each.</li>
<li>The Speculation Scandal tax space (+1 resistance) is the single largest resistance-up source (152 fires, 33.5 % of games), but it caps at +1 per landing.</li>
</ul>

<p><strong>Are positive/recovery sources overpowering negative sources?</strong> For Credit, the recovery side is the <em>only</em> side — Funding Act alone supplies +800 credit-up across the 400 games (+2 per game in 100 % of games), with Treaty Renegotiation, Foreign Loan Secured, You Are Hamilton, Federalist Victory, Credit Restored, and Gold and Silver Inflow stacking another +370 on top. There is no counter-pressure. For Resistance, Cabinet Bargain (-1) offsets ~15 % of the +295 upward pressure — meaningful but not the bottleneck.</p>

<p><strong>Are games too short for failure events?</strong> Possibly contributory, but not the main constraint. Games are 7 laps × 3 players × ~7 actions = ~21 turns. Median game length is 21 turns; min 19, max 24. The Resistance track would need to gain +10 from start in 21 turns, or roughly +0.5 per turn. The actual rate is +0.03 per turn. Extending the game length would help arithmetically but the slope is wrong by an order of magnitude.</p>

<p><strong>Are failure events intentionally rare but currently decorative?</strong> This is the honest read. The Default reset, Rebellion reset, and Bankruptcy −1 IP mechanics ship in v0.10 as rules text, but in deterministic batch play they are decorative — they don't shape the win distribution because they almost never fire. The v0.10 balance targets (Treasury 59 / Merchant 25 / Manufacturer 16) were achieved without these events being load-bearing. That is a legitimate position to ship from, but it should be documented as such rather than left as an open mystery.</p>

</div>

<h2>7. Candidate levers <span class="surface-id">G</span></h2>

<p>Listed in ascending order of damage to the v0.10 balance baseline. No implementation in this pass. Each lever names the side it touches (pressure-source vs threshold vs meta), the expected effect, the rationale, and the risk.</p>

${levers.map(L => `
<div class="lever">
  <div class="head">
    <span class="rank">Lever ${L.rank}</span>
    <span class="target">target: ${L.target} · <span class="side-${L.side.split('-')[0]}">${L.side}</span></span>
  </div>
  <div class="nm">${L.name}</div>
  <div class="row"><div class="k">Expected effect</div><div>${L.expected}</div></div>
  <div class="row"><div class="k">Rationale</div><div>${L.rationale}</div></div>
  <div class="row"><div class="k">Risk to v0.10</div><div>${L.risk}</div></div>
</div>`).join('')}

<h2>Closeout <span class="surface-id">H</span></h2>

<p><strong>The most economical reading:</strong> Default is dead because the credit-down channel does not exist as a mechanic. Rebellion is dead because the resistance-up channel exists but the Acts that should drive it never pass under deterministic profile play, leaving only card-and-tax-space pressure that nets +0.6 per game against a +10 gap. Bankruptcy is dead because the economy is liquidity-positive at every lap by design — the Treasury Opens 400-TN landed bonus and the absence of upkeep keep cash floors well above zero.</p>

<p>Threshold-side levers (Default at 1 or 2 instead of 0; Rebellion at 9 or 10 instead of 12) are <strong>structurally inert</strong> at current pressure levels. They become useful only after a pressure-source lever introduces enough movement to reach the new threshold. <strong>If failure events should fire, the pressure side must change first.</strong></p>

<p>The cleanest single intervention that opens a credit-down channel without touching the v0.10 balance shape is re-wiring the existing Bank Run card to push credit instead of (or in addition to) capacity. The cleanest single intervention that compounds resistance pressure without rewriting Act semantics is applying a +1 resistance "lobby pressure" effect when Assumption / Tariff / Excise Enforcement fail their floor votes. Both are listed above as Levers 2 and 3.</p>

<div class="meta">
Diagnosis pass — observation only. Raw data: <code>release/balance-evidence/raw-data/sovereign-diagnosis-canonical-400.json</code> (and -100-A, -100-B, -mfg-mirror-100). Sim: <code>tools/diagnosis/sim.mjs</code>. Reducer byte-identical to v0.10/v1.0.2 for all 400 canonical seeds (verified). No balance change. No threshold change. No rule change. No release.
</div>

</div>
</body>
</html>`;

writeFileSync(REPORT_PATH, html);
console.log('Wrote ' + REPORT_PATH + '  (' + (html.length / 1024).toFixed(1) + ' KB)');
