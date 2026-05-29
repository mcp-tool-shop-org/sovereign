/* =====================================================================
 * Sovereign · Pacing Diagnostic Pass 1 · Runner
 * ---------------------------------------------------------------------
 * Tests whether the current 7-round game is structurally too short and
 * whether a 12-round (or 15-round) model produces a better board-game
 * arc. Acts in rounds 1-7 in all variants; rounds 8+ are Late Republic
 * rounds with no new Acts. No reducer mechanics change.
 *
 * NOTE: This pass intentionally tests a different pacing model. The
 * canonical-100 hash IS expected to diverge for variants B and C. The
 * 7-round baseline must still byte-match v0.18 evidence (parity check).
 * ===================================================================== */
import {
  runDiagnosisBatch,
  runBatchGame,
  setTotalRounds,
  getTotalRounds,
} from './sim-pacing-diag.mjs';
import { runBatchGame as runBatchV018 } from './sim-v0.18.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'E:/AI/sovereign/experiments/pacing-diag/raw-data';
mkdirSync(OUT_DIR, { recursive: true });

function write(name, payload) {
  const path = OUT_DIR + '/' + name;
  writeFileSync(path, JSON.stringify(payload));
  const size = (JSON.stringify(payload).length / 1024 / 1024).toFixed(2);
  console.log(`  wrote ${path}  (${size} MB, ${payload.gameCount} games)`);
}
function seedRange(start, count) {
  const s = [];
  for (let i = 0; i < count; i++) s.push(start + i);
  return s;
}

const TM_TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const PROFILE_KEYS = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const PROFILE_SHORT = {
  'treasury-finance': 'Treasury',
  'merchant-infrastructure': 'Merchant',
  'manufacturer-industry': 'Manufacturer',
};

/* ============================================================
 * PARITY CHECK — sim-pacing-diag with TOTAL_ROUNDS=7 must produce
 * a ledger byte-identical to sim-v0.18 on the same seed.
 * ============================================================ */
console.log('PARITY CHECK — sim-pacing-diag(7) vs sim-v0.18 on seed 2026');
setTotalRounds(7);
const parityDiag = runBatchGame(2026, TM_TRIPLET, true);
const parityV018 = runBatchV018(2026, TM_TRIPLET, true);
const ledgerDiag = JSON.stringify(parityDiag.state.ledger);
const ledgerV018 = JSON.stringify(parityV018.state.ledger);
const parityPass = ledgerDiag === ledgerV018;
console.log(`  ledger bytes diag:  ${ledgerDiag.length}`);
console.log(`  ledger bytes v0.18: ${ledgerV018.length}`);
console.log(`  PARITY: ${parityPass ? 'PASS (byte-identical)' : 'FAIL (ledger drift)'}`);
if (!parityPass) {
  console.error('  ABORT: 7-round baseline drifted from v0.18. The diagnostic harness is broken.');
  process.exit(1);
}

/* ============================================================
 * METRIC EXTRACTION — derives the kickoff prompt's 25 metrics
 * from a diagnosis batch + per-seed ledger walks.
 * ============================================================ */
function analyzeBatch(batch, variantLabel, walkLedgersWith) {
  const games = batch.games;
  const N = games.length;
  const wins = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
  const margins = [];
  const cashByProfile = { 'treasury-finance': [], 'merchant-infrastructure': [], 'manufacturer-industry': [] };
  const scoreByProfile = { 'treasury-finance': [], 'merchant-infrastructure': [], 'manufacturer-industry': [] };
  const cashIPByProfile = { 'treasury-finance': [], 'merchant-infrastructure': [], 'manufacturer-industry': [] };
  const propsByProfile = { 'treasury-finance': [], 'merchant-infrastructure': [], 'manufacturer-industry': [] };
  const propsScoreByProfile = { 'treasury-finance': [], 'merchant-infrastructure': [], 'manufacturer-industry': [] };
  const upgradesByProfile = { 'treasury-finance': [], 'merchant-infrastructure': [], 'manufacturer-industry': [] };
  const totalTurnsList = [];
  const lapsReachedList = [];
  const creditFinal = {};
  const resistanceFinal = {};
  const capacityFinal = {};
  let defaultFired = 0;
  let rebellionFired = 0;
  let bankruptcyEvents = 0;
  let route4Plus = 0;
  let runawayCash5k = 0;
  let runawayCash10k = 0;
  let completionCount = 0;
  let deadEarlyCount = 0;

  for (const g of games) {
    wins[g.winner.profile] = (wins[g.winner.profile] || 0) + 1;
    const sortedScores = [...g.scores].sort((a, b) => b - a);
    margins.push(sortedScores[0] - sortedScores[1]);
    if (g.defaultFired) defaultFired += 1;
    if (g.rebellionFired) rebellionFired += 1;
    bankruptcyEvents += g.bankruptcyEvents;
    totalTurnsList.push(g.totalTurns);
    lapsReachedList.push(g.lapsReached);
    if (g.finalCapacity >= 4) route4Plus += 1;

    for (let i = 0; i < 3; i++) {
      const p = g.players[i];
      const profile = p.profile;
      cashByProfile[profile].push(p.finalCash);
      scoreByProfile[profile].push(p.finalInfluence);
      propsByProfile[profile].push(p.ownedAssetCount);
      upgradesByProfile[profile].push(p.upgradedAssetCount);

      const cashLine = p.scoreBreakdown.find(b => b.label === 'Cash held');
      cashIPByProfile[profile].push(cashLine ? cashLine.pts : 0);
      const propLine = p.scoreBreakdown.find(b => b.label === 'Properties owned');
      propsScoreByProfile[profile].push(propLine ? propLine.pts : 0);

      if (p.finalCash >= 5000) runawayCash5k += 1;
      if (p.finalCash >= 10000) runawayCash10k += 1;
      if (p.bankruptLaps >= Math.floor(g.lapsReached / 2)) deadEarlyCount += 1;
    }

    /* Final tracks come from each player's record (all three see same tracks) */
    const tracks = g.players[0].finalTracks;
    creditFinal[tracks.credit] = (creditFinal[tracks.credit] || 0) + 1;
    resistanceFinal[tracks.resistance] = (resistanceFinal[tracks.resistance] || 0) + 1;
    capacityFinal[tracks.capacity] = (capacityFinal[tracks.capacity] || 0) + 1;

    if (g.lapsReached > batch.pacingDiagRoundCount) completionCount += 1;
  }

  margins.sort((a, b) => a - b);
  const medMargin = margins[Math.floor(N / 2)];

  /* Walk ledgers for event-count metrics */
  let creditCrisisFires = 0;
  const creditCrisisLapDist = {};
  let upgradeEvents = 0;
  let rentEvents = 0;
  let cardEvents = 0;
  let auctionEvents = 0;
  let actsPassed = 0;
  let actsFailed = 0;
  let lateRepublicActivity = 0; /* events in rounds > 7 */
  let lateRepublicBuys = 0;
  let lateRepublicUpgrades = 0;
  let lateRepublicRents = 0;
  let totalRollSpaces = 0;
  let totalRolls = 0;

  for (let i = 0; i < games.length; i++) {
    const seed = games[i].seed;
    const b = walkLedgersWith(seed);
    const led = b.state.ledger;

    for (const r of led) {
      if (r.event === 'CREDIT_CRISIS') {
        creditCrisisFires += 1;
        creditCrisisLapDist[`L${r.lap}`] = (creditCrisisLapDist[`L${r.lap}`] || 0) + 1;
      }
      if (r.event === 'UPGRADE') {
        upgradeEvents += 1;
        if (r.lap > 7) lateRepublicUpgrades += 1;
      }
      /* Rent fires twice per rent event (one for payer, one for owner). Count only owner-side. */
      if (r.event === 'CASH' && r.detail.startsWith('Rent from ')) {
        rentEvents += 1;
        if (r.lap > 7) lateRepublicRents += 1;
      }
      if (r.actor === 'Card' && (r.event === 'EFFECT' || r.event === 'KEEP' || r.event === 'MOVE' || r.event === 'CRISIS' || r.event === 'NO EFFECT')) {
        cardEvents += 1;
      }
      if (r.event === 'AUCTION WIN' || r.event === 'UNSOLD') {
        auctionEvents += 1;
      }
      if (r.actor === 'Acts' && r.event === 'PASS') actsPassed += 1;
      if (r.actor === 'Acts' && r.event === 'FAIL') actsFailed += 1;
      if (r.lap > 7) lateRepublicActivity += 1;
      if (r.event === 'OWN' && r.detail.startsWith('Now owns') && r.lap > 7) lateRepublicBuys += 1;
      if (r.event === 'ROLL') {
        const m = r.detail.match(/2d6 = (\d+)/);
        if (m) { totalRollSpaces += Number(m[1]); totalRolls += 1; }
      }
    }
  }

  const avgRoll = totalRolls > 0 ? totalRollSpaces / totalRolls : 0;
  const avgTurnsPerPlayer = totalTurnsList.reduce((a, b) => a + b, 0) / N / 3;
  const avgCircuitsPerPlayer = (avgRoll * avgTurnsPerPlayer) / 40;

  return {
    variantLabel,
    roundCount: batch.pacingDiagRoundCount,
    gameCount: N,
    wins,
    winPercent: {
      'treasury-finance': (wins['treasury-finance'] / N * 100).toFixed(1),
      'merchant-infrastructure': (wins['merchant-infrastructure'] / N * 100).toFixed(1),
      'manufacturer-industry': (wins['manufacturer-industry'] / N * 100).toFixed(1),
    },
    medianMargin: medMargin,
    avgTotalTurns: (totalTurnsList.reduce((a, b) => a + b, 0) / N).toFixed(1),
    avgTurnsPerPlayer: avgTurnsPerPlayer.toFixed(2),
    avgRoll: avgRoll.toFixed(2),
    avgCircuitsPerPlayer: avgCircuitsPerPlayer.toFixed(2),
    completionRate: `${completionCount}/${N}`,

    avgPropertiesByProfile: Object.fromEntries(PROFILE_KEYS.map(k => [k,
      (propsByProfile[k].reduce((a, b) => a + b, 0) / propsByProfile[k].length).toFixed(2)])),
    avgUpgradesByProfile: Object.fromEntries(PROFILE_KEYS.map(k => [k,
      (upgradesByProfile[k].reduce((a, b) => a + b, 0) / upgradesByProfile[k].length).toFixed(2)])),
    avgFinalCashByProfile: Object.fromEntries(PROFILE_KEYS.map(k => [k,
      Math.round(cashByProfile[k].reduce((a, b) => a + b, 0) / cashByProfile[k].length)])),
    avgCashIPByProfile: Object.fromEntries(PROFILE_KEYS.map(k => [k,
      (cashIPByProfile[k].reduce((a, b) => a + b, 0) / cashIPByProfile[k].length).toFixed(2)])),
    avgPropsScoreByProfile: Object.fromEntries(PROFILE_KEYS.map(k => [k,
      (propsScoreByProfile[k].reduce((a, b) => a + b, 0) / propsScoreByProfile[k].length).toFixed(2)])),
    avgScoreByProfile: Object.fromEntries(PROFILE_KEYS.map(k => [k,
      (scoreByProfile[k].reduce((a, b) => a + b, 0) / scoreByProfile[k].length).toFixed(2)])),

    upgradeEvents,
    rentEvents,
    cardEvents,
    auctionEvents,
    actsPassed,
    actsFailed,
    creditCrisisFires,
    creditCrisisLapDist,
    defaultFired,
    rebellionFired,
    bankruptcyEvents,
    route4Plus,
    runawayCash5k,
    runawayCash10k,
    deadEarlyCount,

    lateRepublicActivity,
    lateRepublicBuys,
    lateRepublicUpgrades,
    lateRepublicRents,

    creditFinal,
    resistanceFinal,
    capacityFinal,
  };
}

/* ============================================================
 * RUN VARIANTS
 * ============================================================ */
const VARIANT_CONFIGS = [
  { rounds: 7,  label: 'A_7round_baseline' },
  { rounds: 12, label: 'B_12round_late_republic' },
  { rounds: 15, label: 'C_15round_late_republic' },
];

const analyses = [];

for (const cfg of VARIANT_CONFIGS) {
  console.log(`\n=== VARIANT ${cfg.label} — TOTAL_ROUNDS=${cfg.rounds} ===`);
  setTotalRounds(cfg.rounds);
  const t0 = Date.now();
  const batch = runDiagnosisBatch(seedRange(2026, 100), TM_TRIPLET, true, `CANONICAL-100-${cfg.label}`);
  batch.rulesetVersion = 'v0.18-pacing-diag';
  console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  write(`canonical-100-${cfg.label}.json`, batch);

  console.log(`  walking ledgers for event-count metrics...`);
  const t1 = Date.now();
  /* Re-walk ledgers using runBatchGame with TOTAL_ROUNDS set to this variant */
  setTotalRounds(cfg.rounds);
  const analysis = analyzeBatch(batch, cfg.label, (seed) => runBatchGame(seed, TM_TRIPLET, true));
  console.log(`  ledger walk in ${((Date.now() - t1) / 1000).toFixed(1)}s`);
  analyses.push(analysis);
}

/* ============================================================
 * REPORT
 * ============================================================ */
console.log('\n\n========================================');
console.log('PACING DIAGNOSTIC PASS 1 — HEADLINE');
console.log('========================================\n');

for (const a of analyses) {
  console.log(`\n--- ${a.variantLabel} (${a.roundCount} rounds) ---`);
  console.log(`  Avg total turns:        ${a.avgTotalTurns}`);
  console.log(`  Avg turns / player:     ${a.avgTurnsPerPlayer}`);
  console.log(`  Avg roll (2d6):         ${a.avgRoll}`);
  console.log(`  Avg circuits / player:  ${a.avgCircuitsPerPlayer}`);
  console.log(`  Completion rate:        ${a.completionRate}`);
  console.log(`  Treasury wins:          ${a.wins['treasury-finance']}/100  (${a.winPercent['treasury-finance']}%)`);
  console.log(`  Merchant wins:          ${a.wins['merchant-infrastructure']}/100  (${a.winPercent['merchant-infrastructure']}%)`);
  console.log(`  Manufacturer wins:      ${a.wins['manufacturer-industry']}/100  (${a.winPercent['manufacturer-industry']}%)`);
  console.log(`  Median margin:          ${a.medianMargin}`);
  console.log(`  Avg score by profile:   T=${a.avgScoreByProfile['treasury-finance']}  M=${a.avgScoreByProfile['merchant-infrastructure']}  Mfg=${a.avgScoreByProfile['manufacturer-industry']}`);
  console.log(`  Avg final cash:         T=${a.avgFinalCashByProfile['treasury-finance']}  M=${a.avgFinalCashByProfile['merchant-infrastructure']}  Mfg=${a.avgFinalCashByProfile['manufacturer-industry']}`);
  console.log(`  Avg cashIP contrib:     T=${a.avgCashIPByProfile['treasury-finance']}  M=${a.avgCashIPByProfile['merchant-infrastructure']}  Mfg=${a.avgCashIPByProfile['manufacturer-industry']}`);
  console.log(`  Avg props score:        T=${a.avgPropsScoreByProfile['treasury-finance']}  M=${a.avgPropsScoreByProfile['merchant-infrastructure']}  Mfg=${a.avgPropsScoreByProfile['manufacturer-industry']}`);
  console.log(`  Avg properties owned:   T=${a.avgPropertiesByProfile['treasury-finance']}  M=${a.avgPropertiesByProfile['merchant-infrastructure']}  Mfg=${a.avgPropertiesByProfile['manufacturer-industry']}`);
  console.log(`  Avg upgrades owned:     T=${a.avgUpgradesByProfile['treasury-finance']}  M=${a.avgUpgradesByProfile['merchant-infrastructure']}  Mfg=${a.avgUpgradesByProfile['manufacturer-industry']}`);
  console.log(`  Upgrade events total:   ${a.upgradeEvents}  (${(a.upgradeEvents/100).toFixed(1)}/game)`);
  console.log(`  Rent events total:      ${a.rentEvents}  (${(a.rentEvents/100).toFixed(1)}/game)`);
  console.log(`  Card events total:      ${a.cardEvents}  (${(a.cardEvents/100).toFixed(1)}/game)`);
  console.log(`  Auction events total:   ${a.auctionEvents}  (${(a.auctionEvents/100).toFixed(1)}/game)`);
  console.log(`  Acts passed:            ${a.actsPassed}  (${(a.actsPassed/100).toFixed(1)}/game)`);
  console.log(`  Acts failed:            ${a.actsFailed}  (${(a.actsFailed/100).toFixed(1)}/game)`);
  console.log(`  Credit Crisis fires:    ${a.creditCrisisFires}/100`);
  console.log(`    by lap: ${JSON.stringify(a.creditCrisisLapDist)}`);
  console.log(`  Default fires:          ${a.defaultFired}/100`);
  console.log(`  Rebellion fires:        ${a.rebellionFired}/100`);
  console.log(`  Bankruptcy events:      ${a.bankruptcyEvents}`);
  console.log(`  Route 4+ frequency:     ${a.route4Plus}/100`);
  console.log(`  Runaway cash ≥5k:       ${a.runawayCash5k}  (player-instances)`);
  console.log(`  Runaway cash ≥10k:      ${a.runawayCash10k}  (player-instances)`);
  console.log(`  Dead-early player-inst: ${a.deadEarlyCount}`);
  if (a.roundCount > 7) {
    console.log(`  Late Republic activity (rounds > 7):`);
    console.log(`    Total ledger rows:   ${a.lateRepublicActivity}`);
    console.log(`    Buy events:          ${a.lateRepublicBuys}`);
    console.log(`    Upgrade events:      ${a.lateRepublicUpgrades}`);
    console.log(`    Rent events:         ${a.lateRepublicRents}`);
  }
  console.log(`  Final Credit dist:      ${JSON.stringify(a.creditFinal)}`);
  console.log(`  Final Resistance dist:  ${JSON.stringify(a.resistanceFinal)}`);
  console.log(`  Final Capacity dist:    ${JSON.stringify(a.capacityFinal)}`);
}

/* Write summary JSON */
writeFileSync(
  OUT_DIR + '/pacing-diagnostic-summary.json',
  JSON.stringify({ generated: new Date().toISOString(), parityPass, analyses }, null, 2)
);
console.log(`\n  wrote ${OUT_DIR}/pacing-diagnostic-summary.json`);

console.log('\n========================================');
console.log('Done. See pacing-diagnostic-summary.json for full data.');
console.log('========================================\n');
