/* Aggregate the per-game telemetry from the four diagnosis JSONs into the
 * numbers the report needs. Pure read-side aggregation; no game logic here.
 *
 * Used by gen-report.mjs. Also runnable standalone to print a text summary.
 */
import { readFileSync } from 'node:fs';

const RAW_DIR = 'E:/AI/sovereign/release/balance-evidence/raw-data';
const PATHS = {
  canonical400:   RAW_DIR + '/sovereign-diagnosis-canonical-400.json',
  canonical100A:  RAW_DIR + '/sovereign-diagnosis-canonical-100-A.json',
  canonical100B:  RAW_DIR + '/sovereign-diagnosis-canonical-100-B.json',
  mfgMirror100:   RAW_DIR + '/sovereign-diagnosis-mfg-mirror-100.json',
};

function loadAll() {
  const out = {};
  for (const [k, p] of Object.entries(PATHS)) out[k] = JSON.parse(readFileSync(p, 'utf8'));
  return out;
}

function pct(num, denom) { return denom === 0 ? '0.0' : ((num / denom) * 100).toFixed(1); }

function distribution(values) {
  const out = {};
  for (const v of values) out[v] = (out[v] || 0) + 1;
  return out;
}

function quantile(values, q) {
  const sorted = values.slice().sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const idx = q * (sorted.length - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function summarize(values) {
  if (values.length === 0) return null;
  return {
    n: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    median: quantile(values, 0.5),
    p25: quantile(values, 0.25),
    p75: quantile(values, 0.75),
  };
}

function analyzeBatch(batch, label) {
  const games = batch.games;
  const n = games.length;

  /* Failure event totals */
  const defaultFiredCount = games.filter(g => g.defaultFired).length;
  const rebellionFiredCount = games.filter(g => g.rebellionFired).length;
  const bankruptcyEventsTotal = games.reduce((a, g) => a + g.bankruptcyEvents, 0);
  const bankruptcyGames = games.filter(g => g.bankruptcyEvents > 0).length;

  /* Track distributions */
  const creditMin = games.map(g => g.telemetry.tracks.credit.min);
  const creditMax = games.map(g => g.telemetry.tracks.credit.max);
  const creditEnd = games.map(g => g.telemetry.tracks.credit.end);
  const resistMin = games.map(g => g.telemetry.tracks.resistance.min);
  const resistMax = games.map(g => g.telemetry.tracks.resistance.max);
  const resistEnd = games.map(g => g.telemetry.tracks.resistance.end);
  const capacityMin = games.map(g => g.telemetry.tracks.capacity.min);
  const capacityMax = games.map(g => g.telemetry.tracks.capacity.max);
  const capacityEnd = games.map(g => g.telemetry.tracks.capacity.end);

  /* Near-miss counters */
  const creditEverAtOrBelow2 = games.filter(g => g.telemetry.tracks.credit.min <= 2).length;
  const creditEverAtOrBelow1 = games.filter(g => g.telemetry.tracks.credit.min <= 1).length;
  const creditEverAtOrBelow0 = games.filter(g => g.telemetry.tracks.credit.min <= 0).length;
  const resistEverAtOrAbove10 = games.filter(g => g.telemetry.tracks.resistance.max >= 10).length;
  const resistEverAtOrAbove11 = games.filter(g => g.telemetry.tracks.resistance.max >= 11).length;
  const resistEverAtOrAbove12 = games.filter(g => g.telemetry.tracks.resistance.max >= 12).length;

  /* Earliest-lap arrival distributions for both tracks */
  /* For each value 0-12, count games where the track ever reached that value, and the median lap of first arrival */
  const creditFirstReach = {};
  const resistFirstReach = {};
  for (let v = 0; v <= 12; v++) {
    const cl = games.map(g => g.telemetry.tracks.credit.firstLapReached[v]).filter(x => x !== null);
    const rl = games.map(g => g.telemetry.tracks.resistance.firstLapReached[v]).filter(x => x !== null);
    creditFirstReach[v] = {
      count: cl.length, pct: pct(cl.length, n),
      medianLap: cl.length > 0 ? quantile(cl, 0.5) : null,
      meanLap: cl.length > 0 ? (cl.reduce((a, b) => a + b, 0) / cl.length) : null,
    };
    resistFirstReach[v] = {
      count: rl.length, pct: pct(rl.length, n),
      medianLap: rl.length > 0 ? quantile(rl, 0.5) : null,
      meanLap: rl.length > 0 ? (rl.reduce((a, b) => a + b, 0) / rl.length) : null,
    };
  }

  /* Pressure-source catalog — group every pressure event across all games */
  const sourceBuckets = {};  // key: track+'/'+sourceType+'/'+sourceName  -> {direction, count, totalDelta, meanLap, examples}
  let creditDownTotal = 0, creditUpTotal = 0;
  let resistUpTotal = 0, resistDownTotal = 0;
  let capacityUpTotal = 0, capacityDownTotal = 0;
  const creditDeltaPerGame = new Array(n).fill(0);
  const resistDeltaPerGame = new Array(n).fill(0);

  games.forEach((g, gi) => {
    for (const ev of g.telemetry.pressureEvents) {
      const key = ev.track + ' / ' + ev.sourceType + ' / ' + ev.sourceName;
      const direction = ev.appliedDelta >= 0 ? 'up' : 'down';
      if (!sourceBuckets[key]) sourceBuckets[key] = {
        track: ev.track, sourceType: ev.sourceType, sourceName: ev.sourceName,
        count: 0, upCount: 0, downCount: 0,
        totalAppliedDelta: 0, totalRequestedDelta: 0,
        lapsSum: 0, lapsCount: 0,
        gameIndicesWithIt: new Set(),
      };
      const b = sourceBuckets[key];
      b.count += 1;
      b.totalAppliedDelta += ev.appliedDelta;
      b.totalRequestedDelta += ev.requestedDelta;
      b.lapsSum += ev.lap;
      b.lapsCount += 1;
      b.gameIndicesWithIt.add(gi);
      if (direction === 'up') b.upCount += 1; else b.downCount += 1;

      if (ev.track === 'credit') {
        if (ev.appliedDelta < 0) creditDownTotal += -ev.appliedDelta;
        else creditUpTotal += ev.appliedDelta;
        creditDeltaPerGame[gi] += ev.appliedDelta;
      }
      if (ev.track === 'resistance') {
        if (ev.appliedDelta < 0) resistDownTotal += -ev.appliedDelta;
        else resistUpTotal += ev.appliedDelta;
        resistDeltaPerGame[gi] += ev.appliedDelta;
      }
      if (ev.track === 'capacity') {
        if (ev.appliedDelta < 0) capacityDownTotal += -ev.appliedDelta;
        else capacityUpTotal += ev.appliedDelta;
      }
    }
  });

  /* Convert sets to counts and produce a sorted list */
  const sources = Object.values(sourceBuckets).map(b => ({
    track: b.track,
    sourceType: b.sourceType,
    sourceName: b.sourceName,
    count: b.count,
    upCount: b.upCount,
    downCount: b.downCount,
    totalAppliedDelta: b.totalAppliedDelta,
    totalRequestedDelta: b.totalRequestedDelta,
    avgLap: b.lapsCount > 0 ? (b.lapsSum / b.lapsCount) : null,
    gamesWithIt: b.gameIndicesWithIt.size,
    pctGamesWithIt: pct(b.gameIndicesWithIt.size, n),
  }));

  /* Per-track ranked source views */
  function rank(track, predicateOnDelta) {
    return sources
      .filter(s => s.track === track && predicateOnDelta(s.totalAppliedDelta))
      .sort((a, b) => Math.abs(b.totalAppliedDelta) - Math.abs(a.totalAppliedDelta));
  }
  const creditDownSources = rank('credit', d => d < 0);
  const creditUpSources = rank('credit', d => d > 0);
  const resistUpSources = rank('resistance', d => d > 0);
  const resistDownSources = rank('resistance', d => d < 0);
  const capacityUpSources = rank('capacity', d => d > 0);
  const capacityDownSources = rank('capacity', d => d < 0);

  /* Bankruptcy pressure */
  const allCashEverBelow0 = games.filter(g => g.telemetry.cashByPlayer.some(p => p.everBelow0Lap !== null)).length;
  const allCashEverBelow100 = games.filter(g => g.telemetry.cashByPlayer.some(p => p.everBelow100Lap !== null)).length;
  const allCashEverBelow200 = games.filter(g => g.telemetry.cashByPlayer.some(p => p.everBelow200Lap !== null)).length;

  const lowestCashAnyPlayer = games.map(g => Math.min(...g.telemetry.cashByPlayer.map(p => p.min)));
  const lowestCashByProfile = {};
  /* For each slot, find profile, accumulate min cash */
  games.forEach(g => {
    g.telemetry.cashByPlayer.forEach((p, i) => {
      const prof = g.players[i].profile;
      if (!lowestCashByProfile[prof]) lowestCashByProfile[prof] = [];
      lowestCashByProfile[prof].push(p.min);
    });
  });
  const lowestCashByProfileStats = {};
  for (const [prof, values] of Object.entries(lowestCashByProfile)) lowestCashByProfileStats[prof] = summarize(values);

  /* Largest single losses across all games */
  const largestLossEvents = [];
  games.forEach((g, gi) => {
    g.telemetry.cashByPlayer.forEach((p, i) => {
      if (p.largestSingleLoss > 0) {
        largestLossEvents.push({
          gameSeed: g.seed, slot: i, profile: g.players[i].profile,
          loss: p.largestSingleLoss, reason: p.largestSingleLossReason, lap: p.largestSingleLossLap,
        });
      }
    });
  });
  largestLossEvents.sort((a, b) => b.loss - a.loss);

  /* Bankruptcy trigger-reason histogram (from cash crossings below 0) */
  const bankruptcyReasonHisto = {};
  games.forEach(g => {
    g.telemetry.cashByPlayer.forEach(p => {
      for (const ev of p.bankruptcyTriggerReasons) {
        bankruptcyReasonHisto[ev.reason] = (bankruptcyReasonHisto[ev.reason] || 0) + 1;
      }
    });
  });

  return {
    label,
    n,
    failureEvents: {
      defaultFired: { games: defaultFiredCount, pct: pct(defaultFiredCount, n) },
      rebellionFired: { games: rebellionFiredCount, pct: pct(rebellionFiredCount, n) },
      bankruptcyEvents: { total: bankruptcyEventsTotal, games: bankruptcyGames, pct: pct(bankruptcyGames, n) },
    },
    tracks: {
      credit: {
        min: summarize(creditMin),
        max: summarize(creditMax),
        end: summarize(creditEnd),
        minDistribution: distribution(creditMin),
        endDistribution: distribution(creditEnd),
        maxDistribution: distribution(creditMax),
        firstReach: creditFirstReach,
        nearMiss: {
          everAtOrBelow2: { games: creditEverAtOrBelow2, pct: pct(creditEverAtOrBelow2, n) },
          everAtOrBelow1: { games: creditEverAtOrBelow1, pct: pct(creditEverAtOrBelow1, n) },
          everAtOrBelow0: { games: creditEverAtOrBelow0, pct: pct(creditEverAtOrBelow0, n) },
        },
      },
      resistance: {
        min: summarize(resistMin),
        max: summarize(resistMax),
        end: summarize(resistEnd),
        minDistribution: distribution(resistMin),
        maxDistribution: distribution(resistMax),
        endDistribution: distribution(resistEnd),
        firstReach: resistFirstReach,
        nearMiss: {
          everAtOrAbove10: { games: resistEverAtOrAbove10, pct: pct(resistEverAtOrAbove10, n) },
          everAtOrAbove11: { games: resistEverAtOrAbove11, pct: pct(resistEverAtOrAbove11, n) },
          everAtOrAbove12: { games: resistEverAtOrAbove12, pct: pct(resistEverAtOrAbove12, n) },
        },
      },
      capacity: {
        min: summarize(capacityMin),
        max: summarize(capacityMax),
        end: summarize(capacityEnd),
        endDistribution: distribution(capacityEnd),
      },
    },
    pressure: {
      creditDownTotal, creditUpTotal,
      resistUpTotal, resistDownTotal,
      capacityUpTotal, capacityDownTotal,
      avgCreditDeltaPerGame: creditDeltaPerGame.reduce((a, b) => a + b, 0) / n,
      avgResistDeltaPerGame: resistDeltaPerGame.reduce((a, b) => a + b, 0) / n,
      creditDownSources,
      creditUpSources,
      resistUpSources,
      resistDownSources,
      capacityUpSources,
      capacityDownSources,
    },
    bankruptcy: {
      anyPlayerBelow0: { games: allCashEverBelow0, pct: pct(allCashEverBelow0, n) },
      anyPlayerBelow100: { games: allCashEverBelow100, pct: pct(allCashEverBelow100, n) },
      anyPlayerBelow200: { games: allCashEverBelow200, pct: pct(allCashEverBelow200, n) },
      lowestCashAnyPlayer: summarize(lowestCashAnyPlayer),
      lowestCashAnyPlayerDistribution: distribution(lowestCashAnyPlayer.map(v => Math.round(v / 100) * 100)),
      lowestCashByProfile: lowestCashByProfileStats,
      largestLossesTop10: largestLossEvents.slice(0, 10),
      bankruptcyReasonHisto,
    },
  };
}

function analyzeAll() {
  const all = loadAll();
  return {
    canonical400: analyzeBatch(all.canonical400, 'CANONICAL-400'),
    canonical100A: analyzeBatch(all.canonical100A, 'CANONICAL-100-A'),
    canonical100B: analyzeBatch(all.canonical100B, 'CANONICAL-100-B'),
    mfgMirror100: analyzeBatch(all.mfgMirror100, 'MFG-MIRROR-100'),
    determinism: {
      AvsB_byteIdentical: JSON.stringify(all.canonical100A.games) === JSON.stringify(all.canonical100B.games),
    },
    /* Echo the load-bearing seed-2026 anchor */
    seed2026: all.canonical400.games.find(g => g.seed === 2026),
  };
}

export { analyzeAll, analyzeBatch, loadAll };

/* Standalone text output — fires when script is run directly */
const __argv1 = process.argv[1] ? process.argv[1].replace(/\\/g, '/') : '';
const __urlPath = import.meta.url.replace(/^file:\/\/\/?/, '');
if (__urlPath === __argv1) {
  const result = analyzeAll();
  const c = result.canonical400;
  console.log('CANONICAL-400 — failure events:');
  console.log('  defaultFired:    ' + c.failureEvents.defaultFired.games + ' / ' + c.n + '  (' + c.failureEvents.defaultFired.pct + ' %)');
  console.log('  rebellionFired:  ' + c.failureEvents.rebellionFired.games + ' / ' + c.n + '  (' + c.failureEvents.rebellionFired.pct + ' %)');
  console.log('  bankruptcyEvents: ' + c.failureEvents.bankruptcyEvents.total + ' total in ' + c.failureEvents.bankruptcyEvents.games + ' games (' + c.failureEvents.bankruptcyEvents.pct + ' %)');
  console.log('');
  console.log('CANONICAL-400 — track ranges:');
  console.log('  credit min:     mean=' + c.tracks.credit.min.mean.toFixed(2) + ' median=' + c.tracks.credit.min.median + ' min=' + c.tracks.credit.min.min + ' max=' + c.tracks.credit.min.max);
  console.log('  credit max:     mean=' + c.tracks.credit.max.mean.toFixed(2) + ' median=' + c.tracks.credit.max.median + ' min=' + c.tracks.credit.max.min + ' max=' + c.tracks.credit.max.max);
  console.log('  credit end:     mean=' + c.tracks.credit.end.mean.toFixed(2) + ' median=' + c.tracks.credit.end.median + ' min=' + c.tracks.credit.end.min + ' max=' + c.tracks.credit.end.max);
  console.log('  resistance min: mean=' + c.tracks.resistance.min.mean.toFixed(2) + ' median=' + c.tracks.resistance.min.median + ' min=' + c.tracks.resistance.min.min + ' max=' + c.tracks.resistance.min.max);
  console.log('  resistance max: mean=' + c.tracks.resistance.max.mean.toFixed(2) + ' median=' + c.tracks.resistance.max.median + ' min=' + c.tracks.resistance.max.min + ' max=' + c.tracks.resistance.max.max);
  console.log('  resistance end: mean=' + c.tracks.resistance.end.mean.toFixed(2) + ' median=' + c.tracks.resistance.end.median + ' min=' + c.tracks.resistance.end.min + ' max=' + c.tracks.resistance.end.max);
  console.log('  capacity end:   mean=' + c.tracks.capacity.end.mean.toFixed(2) + ' median=' + c.tracks.capacity.end.median);
  console.log('');
  console.log('Near-miss counts (CANONICAL-400):');
  console.log('  credit ever ≤ 2: ' + c.tracks.credit.nearMiss.everAtOrBelow2.games + '  (' + c.tracks.credit.nearMiss.everAtOrBelow2.pct + ' %)');
  console.log('  credit ever ≤ 1: ' + c.tracks.credit.nearMiss.everAtOrBelow1.games + '  (' + c.tracks.credit.nearMiss.everAtOrBelow1.pct + ' %)');
  console.log('  credit ever  = 0: ' + c.tracks.credit.nearMiss.everAtOrBelow0.games + '  (' + c.tracks.credit.nearMiss.everAtOrBelow0.pct + ' %)');
  console.log('  resistance ever ≥ 10: ' + c.tracks.resistance.nearMiss.everAtOrAbove10.games + '  (' + c.tracks.resistance.nearMiss.everAtOrAbove10.pct + ' %)');
  console.log('  resistance ever ≥ 11: ' + c.tracks.resistance.nearMiss.everAtOrAbove11.games + '  (' + c.tracks.resistance.nearMiss.everAtOrAbove11.pct + ' %)');
  console.log('  resistance ever  = 12: ' + c.tracks.resistance.nearMiss.everAtOrAbove12.games + '  (' + c.tracks.resistance.nearMiss.everAtOrAbove12.pct + ' %)');
  console.log('');
  console.log('Pressure totals (CANONICAL-400, summed across all 400 games):');
  console.log('  credit down (total drops): -' + c.pressure.creditDownTotal);
  console.log('  credit up   (total gains): +' + c.pressure.creditUpTotal);
  console.log('  net credit per game:        ' + c.pressure.avgCreditDeltaPerGame.toFixed(2));
  console.log('  resistance up (total):     +' + c.pressure.resistUpTotal);
  console.log('  resistance down (total):   -' + c.pressure.resistDownTotal);
  console.log('  net resist per game:        ' + c.pressure.avgResistDeltaPerGame.toFixed(2));
  console.log('  capacity up (total):       +' + c.pressure.capacityUpTotal);
  console.log('  capacity down (total):     -' + c.pressure.capacityDownTotal);
  console.log('');
  console.log('Top 10 CREDIT-down sources:');
  c.pressure.creditDownSources.slice(0, 10).forEach(s => console.log('  ' + s.sourceType + ' · ' + s.sourceName + ' — ' + s.count + ' fires, total delta=' + s.totalAppliedDelta + ', avg lap ' + (s.avgLap?.toFixed(2) || 'n/a') + ', in ' + s.gamesWithIt + ' games (' + s.pctGamesWithIt + ' %)'));
  console.log('');
  console.log('Top 10 RESISTANCE-up sources:');
  c.pressure.resistUpSources.slice(0, 10).forEach(s => console.log('  ' + s.sourceType + ' · ' + s.sourceName + ' — ' + s.count + ' fires, total delta=+' + s.totalAppliedDelta + ', avg lap ' + (s.avgLap?.toFixed(2) || 'n/a') + ', in ' + s.gamesWithIt + ' games (' + s.pctGamesWithIt + ' %)'));
  console.log('');
  console.log('Top 10 RESISTANCE-down sources:');
  c.pressure.resistDownSources.slice(0, 10).forEach(s => console.log('  ' + s.sourceType + ' · ' + s.sourceName + ' — ' + s.count + ' fires, total delta=' + s.totalAppliedDelta + ', avg lap ' + (s.avgLap?.toFixed(2) || 'n/a') + ', in ' + s.gamesWithIt + ' games (' + s.pctGamesWithIt + ' %)'));
  console.log('');
  console.log('Top 10 CREDIT-up sources:');
  c.pressure.creditUpSources.slice(0, 10).forEach(s => console.log('  ' + s.sourceType + ' · ' + s.sourceName + ' — ' + s.count + ' fires, total delta=+' + s.totalAppliedDelta + ', avg lap ' + (s.avgLap?.toFixed(2) || 'n/a') + ', in ' + s.gamesWithIt + ' games (' + s.pctGamesWithIt + ' %)'));
  console.log('');
  console.log('Bankruptcy pressure (CANONICAL-400):');
  console.log('  any player ever <0:   ' + c.bankruptcy.anyPlayerBelow0.games + ' games (' + c.bankruptcy.anyPlayerBelow0.pct + ' %)');
  console.log('  any player ever <100: ' + c.bankruptcy.anyPlayerBelow100.games + ' games (' + c.bankruptcy.anyPlayerBelow100.pct + ' %)');
  console.log('  any player ever <200: ' + c.bankruptcy.anyPlayerBelow200.games + ' games (' + c.bankruptcy.anyPlayerBelow200.pct + ' %)');
  console.log('  lowest cash any player: mean=' + c.bankruptcy.lowestCashAnyPlayer.mean.toFixed(0) + ' median=' + c.bankruptcy.lowestCashAnyPlayer.median + ' min=' + c.bankruptcy.lowestCashAnyPlayer.min + ' max=' + c.bankruptcy.lowestCashAnyPlayer.max);
  console.log('  lowest cash by profile:');
  for (const [prof, stats] of Object.entries(c.bankruptcy.lowestCashByProfile)) {
    console.log('    ' + prof + ': mean=' + stats.mean.toFixed(0) + ' median=' + stats.median + ' min=' + stats.min + ' max=' + stats.max);
  }
  console.log('  top 10 largest single cash losses:');
  c.bankruptcy.largestLossesTop10.forEach(e => console.log('    seed ' + e.gameSeed + ' slot ' + e.slot + ' (' + e.profile + ') lost ' + e.loss + ' TN at L' + e.lap + ' · ' + e.reason));
  if (Object.keys(c.bankruptcy.bankruptcyReasonHisto).length > 0) {
    console.log('  bankruptcy trigger reasons (cash crossings <0):');
    Object.entries(c.bankruptcy.bankruptcyReasonHisto).sort((a, b) => b[1] - a[1]).forEach(([r, n]) => console.log('    ' + n + 'x  ' + r));
  } else {
    console.log('  bankruptcy trigger reasons: (none — no player ever crossed below 0)');
  }
  console.log('');
  console.log('MFG-MIRROR-100 (3x Manufacturer, capacity pressure config):');
  const m = result.mfgMirror100;
  console.log('  defaultFired:    ' + m.failureEvents.defaultFired.games + ' / ' + m.n);
  console.log('  rebellionFired:  ' + m.failureEvents.rebellionFired.games + ' / ' + m.n);
  console.log('  bankruptcy events: ' + m.failureEvents.bankruptcyEvents.total + ' total in ' + m.failureEvents.bankruptcyEvents.games + ' games');
  console.log('  credit min mean=' + m.tracks.credit.min.mean.toFixed(2) + '  resistance max mean=' + m.tracks.resistance.max.mean.toFixed(2));
  console.log('  capacity end mean=' + m.tracks.capacity.end.mean.toFixed(2));
}
