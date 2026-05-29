/* v0.11 evidence sweep analyzer.
 * Reads v0.10 baseline + v0.11 raw data, produces side-by-side metrics.
 */
import { readFileSync } from 'node:fs';

const V10_DIR = 'E:/AI/sovereign/release/balance-evidence/raw-data';
const V11_DIR = 'E:/AI/sovereign/experiments/v0.11-failure-pressure-candidate/raw-data';

function load(path) { return JSON.parse(readFileSync(path, 'utf8')); }

const v10 = {
  c400:  load(V10_DIR + '/sovereign-diagnosis-canonical-400.json'),
  c100A: load(V10_DIR + '/sovereign-diagnosis-canonical-100-A.json'),
  c100B: load(V10_DIR + '/sovereign-diagnosis-canonical-100-B.json'),
  mfg:   load(V10_DIR + '/sovereign-diagnosis-mfg-mirror-100.json'),
};
const v11 = {
  c400:  load(V11_DIR + '/sovereign-v0.11-canonical-400.json'),
  c100A: load(V11_DIR + '/sovereign-v0.11-canonical-100-A.json'),
  c100B: load(V11_DIR + '/sovereign-v0.11-canonical-100-B.json'),
  mfg:   load(V11_DIR + '/sovereign-v0.11-mfg-mirror-100.json'),
};

function pct(num, denom) { return denom === 0 ? '0.0' : ((num / denom) * 100).toFixed(1); }
function quantile(values, q) {
  const s = values.slice().sort((a, b) => a - b);
  if (s.length === 0) return null;
  const idx = q * (s.length - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return s[lo];
  return s[lo] + (s[hi] - s[lo]) * (idx - lo);
}
function dist(values) {
  const out = {};
  for (const v of values) out[v] = (out[v] || 0) + 1;
  return out;
}
function mean(values) { return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length; }

function analyzeBatch(batch, label) {
  const games = batch.games;
  const n = games.length;

  /* Profile slots */
  const profilesInBatch = batch.profileTriplet;
  const allProfiles = [...new Set(profilesInBatch)];

  /* Wins per profile (by winner profile) */
  const winsByProfile = {};
  allProfiles.forEach(p => winsByProfile[p] = 0);
  games.forEach(g => { if (winsByProfile[g.winner.profile] != null) winsByProfile[g.winner.profile] += 1; });

  /* Win margins: top - second */
  const margins = games.map(g => {
    const sorted = g.scores.slice().sort((a, b) => b - a);
    return sorted[0] - sorted[1];
  });

  /* Credit track trajectories */
  const creditMins = games.map(g => g.telemetry.tracks.credit.min);
  const creditMaxs = games.map(g => g.telemetry.tracks.credit.max);
  const creditEnds = games.map(g => g.telemetry.tracks.credit.end);
  const resistMaxs = games.map(g => g.telemetry.tracks.resistance.max);
  const resistEnds = games.map(g => g.telemetry.tracks.resistance.end);
  const capacityEnds = games.map(g => g.telemetry.tracks.capacity.end);
  const capacityMaxs = games.map(g => g.telemetry.tracks.capacity.max);

  /* Bank Run firing */
  const bankRunGames = new Set();
  let bankRunCardResolutions = 0;
  let bankRunCreditEvents = 0;
  let bankRunCapacityEvents = 0;
  const bankRunByLap = {};
  for (const g of games) {
    let firedThisGame = 0;
    for (const ev of g.telemetry.pressureEvents) {
      if (ev.reason === 'Bank Run') {
        if (ev.track === 'credit') { bankRunCreditEvents += 1; firedThisGame += 1; }
        if (ev.track === 'capacity') bankRunCapacityEvents += 1;
        bankRunByLap[ev.lap] = (bankRunByLap[ev.lap] || 0) + 1;
      }
    }
    if (firedThisGame > 0) {
      bankRunGames.add(g.seed);
      bankRunCardResolutions += firedThisGame;
    }
  }

  /* Failure events */
  const defaultFired = games.filter(g => g.defaultFired).length;
  const rebellionFired = games.filter(g => g.rebellionFired).length;
  const bankruptcyEventsTotal = games.reduce((acc, g) => acc + g.bankruptcyEvents, 0);
  const bankruptcyGames = games.filter(g => g.bankruptcyEvents > 0).length;

  /* Credit near-miss */
  const creditEverAtOrBelow = (n) => games.filter(g => g.telemetry.tracks.credit.min <= n).length;
  /* Capacity thresholds */
  const capacityEverAtOrAbove = (n) => games.filter(g => g.telemetry.tracks.capacity.max >= n).length;

  /* Route dominance */
  const routeMaxByGame = games.map(g => Math.max(...g.players.map(p => p.routesOwned)));
  const routeDominance4Plus = routeMaxByGame.filter(n => n >= 4).length;
  const routeDominance3Plus = routeMaxByGame.filter(n => n >= 3).length;

  return {
    label, n,
    profileTriplet: profilesInBatch,
    winsByProfile,
    winRates: Object.fromEntries(Object.entries(winsByProfile).map(([p, w]) => [p, +(w/n*100).toFixed(1)])),
    medianMargin: quantile(margins, 0.5),
    meanMargin: +mean(margins).toFixed(2),
    credit: {
      min:    { mean: +mean(creditMins).toFixed(2), median: quantile(creditMins, 0.5), distMap: dist(creditMins) },
      max:    { mean: +mean(creditMaxs).toFixed(2), median: quantile(creditMaxs, 0.5), distMap: dist(creditMaxs) },
      end:    { mean: +mean(creditEnds).toFixed(2), median: quantile(creditEnds, 0.5), distMap: dist(creditEnds) },
      atOrBelow5: creditEverAtOrBelow(5),
      atOrBelow4: creditEverAtOrBelow(4),
      atOrBelow3: creditEverAtOrBelow(3),
      atOrBelow2: creditEverAtOrBelow(2),
      atOrBelow1: creditEverAtOrBelow(1),
      atOrBelow0: creditEverAtOrBelow(0),
    },
    resistance: {
      max:    { mean: +mean(resistMaxs).toFixed(2), median: quantile(resistMaxs, 0.5), distMap: dist(resistMaxs) },
      end:    { mean: +mean(resistEnds).toFixed(2), median: quantile(resistEnds, 0.5) },
    },
    capacity: {
      end:    { mean: +mean(capacityEnds).toFixed(2), median: quantile(capacityEnds, 0.5), distMap: dist(capacityEnds) },
      max:    { mean: +mean(capacityMaxs).toFixed(2), median: quantile(capacityMaxs, 0.5) },
      atOrAbove6: capacityEverAtOrAbove(6),
      atOrAbove8: capacityEverAtOrAbove(8),
      atOrAbove10: capacityEverAtOrAbove(10),
    },
    bankRun: {
      games: bankRunGames.size,
      cardResolutions: bankRunCardResolutions,
      creditEvents: bankRunCreditEvents,
      capacityEvents: bankRunCapacityEvents,
      byLap: bankRunByLap,
    },
    failures: {
      defaultFired,  defaultRate:  +pct(defaultFired, n),
      rebellionFired, rebellionRate: +pct(rebellionFired, n),
      bankruptcyEventsTotal,
      bankruptcyGames, bankruptcyRate: +pct(bankruptcyGames, n),
    },
    routes: {
      avgRouteMax: +mean(routeMaxByGame).toFixed(2),
      dominance3Plus: routeDominance3Plus, dominance3PlusPct: +pct(routeDominance3Plus, n),
      dominance4Plus: routeDominance4Plus, dominance4PlusPct: +pct(routeDominance4Plus, n),
    },
  };
}

const r10 = {
  c400: analyzeBatch(v10.c400, 'v0.10 CANONICAL-400'),
  c100A: analyzeBatch(v10.c100A, 'v0.10 CANONICAL-100-A'),
  c100B: analyzeBatch(v10.c100B, 'v0.10 CANONICAL-100-B'),
  mfg:  analyzeBatch(v10.mfg, 'v0.10 MFG-MIRROR-100'),
};
const r11 = {
  c400: analyzeBatch(v11.c400, 'v0.11 CANONICAL-400'),
  c100A: analyzeBatch(v11.c100A, 'v0.11 CANONICAL-100-A'),
  c100B: analyzeBatch(v11.c100B, 'v0.11 CANONICAL-100-B'),
  mfg:  analyzeBatch(v11.mfg, 'v0.11 MFG-MIRROR-100'),
};

/* Determinism: A vs B byte-identical? */
const determinism = {
  v10AvsB: JSON.stringify(v10.c100A.games) === JSON.stringify(v10.c100B.games),
  v11AvsB: JSON.stringify(v11.c100A.games) === JSON.stringify(v11.c100B.games),
};

/* Seed 2026 cross-check */
const seed2026 = {
  v10: v10.c400.games.find(g => g.seed === 2026),
  v11: v11.c400.games.find(g => g.seed === 2026),
};
const seed2026Same = ['winner', 'scores', 'lapsReached', 'totalTurns', 'finalCapacity', 'defaultFired', 'rebellionFired', 'bankruptcyEvents']
  .every(k => JSON.stringify(seed2026.v10[k]) === JSON.stringify(seed2026.v11[k]));

export { r10, r11, determinism, seed2026, seed2026Same };

if (process.argv[1] && import.meta.url.replace(/^file:\/\/\/?/, '') === process.argv[1].replace(/\\/g, '/')) {
  console.log('Determinism:');
  console.log('  v10 A vs B:', determinism.v10AvsB ? 'PASS' : 'FAIL');
  console.log('  v11 A vs B:', determinism.v11AvsB ? 'PASS' : 'FAIL');
  console.log('Seed 2026 v10 vs v11 (Bank Run does not fire in 2026):', seed2026Same ? 'IDENTICAL' : 'DIVERGE');
  console.log('');
  console.log('CANONICAL-400 side-by-side:');
  console.log('                                v0.10        v0.11');
  console.log(`  Treasury wins:              ${r10.c400.winsByProfile['treasury-finance']} (${r10.c400.winRates['treasury-finance']}%)   ${r11.c400.winsByProfile['treasury-finance']} (${r11.c400.winRates['treasury-finance']}%)`);
  console.log(`  Merchant wins:              ${r10.c400.winsByProfile['merchant-infrastructure']} (${r10.c400.winRates['merchant-infrastructure']}%)    ${r11.c400.winsByProfile['merchant-infrastructure']} (${r11.c400.winRates['merchant-infrastructure']}%)`);
  console.log(`  Manufacturer wins:          ${r10.c400.winsByProfile['manufacturer-industry']} (${r10.c400.winRates['manufacturer-industry']}%)    ${r11.c400.winsByProfile['manufacturer-industry']} (${r11.c400.winRates['manufacturer-industry']}%)`);
  console.log(`  Median margin:              ${r10.c400.medianMargin}            ${r11.c400.medianMargin}`);
  console.log(`  Credit min mean:            ${r10.c400.credit.min.mean}         ${r11.c400.credit.min.mean}`);
  console.log(`  Credit end mean:            ${r10.c400.credit.end.mean}         ${r11.c400.credit.end.mean}`);
  console.log(`  Credit min ≤ 4:             ${r10.c400.credit.atOrBelow4}            ${r11.c400.credit.atOrBelow4}`);
  console.log(`  Capacity end mean:          ${r10.c400.capacity.end.mean}         ${r11.c400.capacity.end.mean}`);
  console.log(`  Capacity ≥ 6:               ${r10.c400.capacity.atOrAbove6} (${(r10.c400.capacity.atOrAbove6/400*100).toFixed(1)}%)  ${r11.c400.capacity.atOrAbove6} (${(r11.c400.capacity.atOrAbove6/400*100).toFixed(1)}%)`);
  console.log(`  Capacity ≥ 8:               ${r10.c400.capacity.atOrAbove8} (${(r10.c400.capacity.atOrAbove8/400*100).toFixed(1)}%)   ${r11.c400.capacity.atOrAbove8} (${(r11.c400.capacity.atOrAbove8/400*100).toFixed(1)}%)`);
  console.log(`  Capacity ≥ 10:              ${r10.c400.capacity.atOrAbove10} (${(r10.c400.capacity.atOrAbove10/400*100).toFixed(1)}%)    ${r11.c400.capacity.atOrAbove10} (${(r11.c400.capacity.atOrAbove10/400*100).toFixed(1)}%)`);
  console.log(`  Resistance max mean:        ${r10.c400.resistance.max.mean}         ${r11.c400.resistance.max.mean}`);
  console.log(`  Route 4+ frequency:         ${r10.c400.routes.dominance4Plus} (${r10.c400.routes.dominance4PlusPct}%)    ${r11.c400.routes.dominance4Plus} (${r11.c400.routes.dominance4PlusPct}%)`);
  console.log(`  Default fires:              ${r10.c400.failures.defaultFired}           ${r11.c400.failures.defaultFired}`);
  console.log(`  Rebellion fires:            ${r10.c400.failures.rebellionFired}           ${r11.c400.failures.rebellionFired}`);
  console.log(`  Bankruptcy events:          ${r10.c400.failures.bankruptcyEventsTotal}            ${r11.c400.failures.bankruptcyEventsTotal}`);
  console.log('');
  console.log('Bank Run firing (v0.11 CANONICAL-400):');
  console.log(`  Bank Run games: ${r11.c400.bankRun.games} / 400 (${(r11.c400.bankRun.games/400*100).toFixed(1)}%)`);
  console.log(`  Bank Run card resolutions: ${r11.c400.bankRun.cardResolutions}`);
  console.log(`  Bank Run credit events: ${r11.c400.bankRun.creditEvents}`);
  console.log(`  Bank Run capacity events: ${r11.c400.bankRun.capacityEvents}`);
  console.log(`  By lap:`, r11.c400.bankRun.byLap);
  console.log('');
  console.log('Credit min distribution comparison (v0.10 → v0.11):');
  const mins = new Set([...Object.keys(r10.c400.credit.min.distMap), ...Object.keys(r11.c400.credit.min.distMap)]);
  for (const m of [...mins].sort((a,b)=>+a-+b)) {
    console.log(`  ${m}: ${r10.c400.credit.min.distMap[m] || 0} → ${r11.c400.credit.min.distMap[m] || 0}`);
  }
  console.log('');
  console.log('Credit end distribution comparison (v0.10 → v0.11):');
  const ends = new Set([...Object.keys(r10.c400.credit.end.distMap), ...Object.keys(r11.c400.credit.end.distMap)]);
  for (const e of [...ends].sort((a,b)=>+a-+b)) {
    console.log(`  ${e}: ${r10.c400.credit.end.distMap[e] || 0} → ${r11.c400.credit.end.distMap[e] || 0}`);
  }
  console.log('');
  console.log('MFG-MIRROR-100 (v0.10 → v0.11):');
  console.log(`  Manufacturer wins:    ${r10.mfg.winsByProfile['manufacturer-industry']} / 100 → ${r11.mfg.winsByProfile['manufacturer-industry']} / 100`);
  console.log(`  Bank Run games:       — / 100 → ${r11.mfg.bankRun.games} / 100`);
  console.log(`  Credit end mean:      ${r10.mfg.credit.end.mean} → ${r11.mfg.credit.end.mean}`);
  console.log(`  Capacity end mean:    ${r10.mfg.capacity.end.mean} → ${r11.mfg.capacity.end.mean}`);
  console.log(`  Capacity ≥ 6:         ${r10.mfg.capacity.atOrAbove6}% → ${r11.mfg.capacity.atOrAbove6}%`);
}
