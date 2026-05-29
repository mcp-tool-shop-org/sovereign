/* =====================================================================
 * Sovereign · Victory Model Diagnostic
 * ---------------------------------------------------------------------
 * Sweeps mandate-victory parameter space to find a supported endgame
 * model. Runs CANONICAL × 100 once at TOTAL_ROUNDS=18 to capture
 * per-round IP snapshots, then evaluates all 495 (min_round, threshold,
 * lead, hard_cap) combinations post-hoc on cached snapshots.
 *
 * CAVEAT: This measures "would the rule have triggered given current
 * player behavior?" — not "how would players adapt if they knew the
 * rule existed and started racing for it?" The behavioral-adaptation
 * question is a candidate-HTML question, not a sim question.
 * ===================================================================== */
import {
  runBatchGame,
  setTotalRounds,
} from './sim-pacing-diag.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT_DIR = 'E:/AI/sovereign/experiments/victory-diag';
mkdirSync(OUT_DIR, { recursive: true });

const TM_TRIPLET = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];
const PROFILE_SHORT = {
  'treasury-finance': 'T',
  'merchant-infrastructure': 'M',
  'manufacturer-industry': 'Mfg',
};
const PROFILE_KEYS = ['treasury-finance', 'merchant-infrastructure', 'manufacturer-industry'];

const MIN_ROUND_VALUES = [8, 9, 10];
const THRESHOLD_VALUES = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const LEAD_VALUES = [2, 3, 4, 5, 6];
const HARD_CAP_VALUES = [12, 15, 18];

console.log('='.repeat(60));
console.log('SOVEREIGN VICTORY MODEL DIAGNOSTIC');
console.log('='.repeat(60));
console.log(`Parameter sweep:`);
console.log(`  min_round:    [${MIN_ROUND_VALUES.join(', ')}]   (${MIN_ROUND_VALUES.length} values)`);
console.log(`  threshold:    [${THRESHOLD_VALUES.join(', ')}]   (${THRESHOLD_VALUES.length} values)`);
console.log(`  lead:         [${LEAD_VALUES.join(', ')}]   (${LEAD_VALUES.length} values)`);
console.log(`  hard_cap:     [${HARD_CAP_VALUES.join(', ')}]   (${HARD_CAP_VALUES.length} values)`);
console.log(`  total combos: ${MIN_ROUND_VALUES.length * THRESHOLD_VALUES.length * LEAD_VALUES.length * HARD_CAP_VALUES.length}`);

/* ============================================================
 * Step 1: Run CANONICAL × 100 at TOTAL_ROUNDS=18, capture snapshots
 * ============================================================ */
console.log('\nStep 1: Running CANONICAL × 100 at TOTAL_ROUNDS=18 ...');
setTotalRounds(18);
const t0 = Date.now();
const games = [];
for (let seed = 2026; seed < 2126; seed++) {
  const b = runBatchGame(seed, TM_TRIPLET, true);
  games.push({
    seed,
    profileTriplet: b.state.players.map(p => p.profile),
    roundSnapshots: b.state.roundSnapshots,
    finalRound: b.state.lap > 18 ? 18 : b.state.lap - 1,
  });
}
console.log(`  ran in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log(`  captured ${games.length} games, snapshots per game: ${games[0].roundSnapshots.length}`);

/* ============================================================
 * Step 2: For each (min_round, threshold, lead, hard_cap),
 * evaluate mandate outcome per game.
 * ============================================================ */
function evaluateGame(game, minRound, threshold, lead, hardCap) {
  /* Walk snapshots from minRound through hardCap */
  for (let r = minRound; r <= hardCap; r++) {
    const snap = game.roundSnapshots[r - 1]; /* roundCompleted = r */
    if (!snap) break;
    const ips = snap.ips;
    /* Sort indices by IP descending */
    const sorted = ips.map((ip, i) => ({ ip, i })).sort((a, b) => b.ip - a.ip);
    const top = sorted[0];
    const second = sorted[1];
    if (top.ip >= threshold && (top.ip - second.ip) >= lead) {
      return {
        triggered: true,
        round: r,
        winnerSlot: top.i,
        winnerIP: top.ip,
        leadMargin: top.ip - second.ip,
        winnerProfile: game.profileTriplet[top.i],
      };
    }
  }
  /* No mandate triggered — hard cap winner */
  const snap = game.roundSnapshots[Math.min(hardCap, game.roundSnapshots.length) - 1];
  if (!snap) return null;
  const sorted = snap.ips.map((ip, i) => ({ ip, i })).sort((a, b) => b.ip - a.ip);
  return {
    triggered: false,
    round: hardCap,
    winnerSlot: sorted[0].i,
    winnerIP: sorted[0].ip,
    leadMargin: sorted[0].ip - sorted[1].ip,
    winnerProfile: game.profileTriplet[sorted[0].i],
  };
}

function evaluateCombo(minRound, threshold, lead, hardCap) {
  if (minRound > hardCap) return null;
  const outcomes = games.map(g => evaluateGame(g, minRound, threshold, lead, hardCap));
  const valid = outcomes.filter(o => o !== null);
  if (valid.length === 0) return null;
  const mandateOutcomes = valid.filter(o => o.triggered);
  const hardCapOutcomes = valid.filter(o => !o.triggered);

  const mandateRounds = mandateOutcomes.map(o => o.round).sort((a, b) => a - b);
  const winnerIPs = valid.map(o => o.winnerIP);
  const leadMargins = valid.map(o => o.leadMargin);

  const profileCounts = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
  const mandateProfileCounts = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
  const hardCapProfileCounts = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
  for (const o of valid) {
    profileCounts[o.winnerProfile] += 1;
    if (o.triggered) mandateProfileCounts[o.winnerProfile] += 1;
    else hardCapProfileCounts[o.winnerProfile] += 1;
  }

  return {
    minRound, threshold, lead, hardCap,
    n: valid.length,
    mandateCount: mandateOutcomes.length,
    hardCapCount: hardCapOutcomes.length,
    mandatePct: mandateOutcomes.length / valid.length * 100,
    medianMandateRound: mandateRounds.length > 0 ? mandateRounds[Math.floor(mandateRounds.length / 2)] : null,
    earliestMandateRound: mandateRounds.length > 0 ? mandateRounds[0] : null,
    latestMandateRound: mandateRounds.length > 0 ? mandateRounds[mandateRounds.length - 1] : null,
    avgWinnerIP: winnerIPs.reduce((a, b) => a + b, 0) / winnerIPs.length,
    avgLeadMargin: leadMargins.reduce((a, b) => a + b, 0) / leadMargins.length,
    profileCounts,
    mandateProfileCounts,
    hardCapProfileCounts,
    treasuryMandateDominance: mandateOutcomes.length > 0 ?
      mandateProfileCounts['treasury-finance'] / mandateOutcomes.length * 100 : null,
    manufacturerWinPct: profileCounts['manufacturer-industry'] / valid.length * 100,
  };
}

console.log('\nStep 2: Sweeping 495 combos ...');
const t1 = Date.now();
const combos = [];
for (const minRound of MIN_ROUND_VALUES) {
  for (const threshold of THRESHOLD_VALUES) {
    for (const lead of LEAD_VALUES) {
      for (const hardCap of HARD_CAP_VALUES) {
        const result = evaluateCombo(minRound, threshold, lead, hardCap);
        if (result) combos.push(result);
      }
    }
  }
}
console.log(`  evaluated ${combos.length} combos in ${((Date.now() - t1) / 1000).toFixed(1)}s`);

/* ============================================================
 * Step 3: Score each combo against decision targets
 * ============================================================ */
function scoreCombo(c) {
  let score = 0;
  const reasons = [];

  /* Decision target 1: mandate pct in [30, 70] */
  if (c.mandatePct >= 30 && c.mandatePct <= 70) {
    score += 30;
    reasons.push(`mandate_pct=${c.mandatePct.toFixed(0)}% (in 30-70 target)`);
  } else if (c.mandatePct >= 20 && c.mandatePct <= 80) {
    score += 15;
    reasons.push(`mandate_pct=${c.mandatePct.toFixed(0)}% (in 20-80, soft target)`);
  } else {
    reasons.push(`mandate_pct=${c.mandatePct.toFixed(0)}% (OUT of range — ${c.mandatePct < 30 ? 'too rare' : 'too always'})`);
  }

  /* Decision target 2: median mandate round >= 9 */
  if (c.medianMandateRound !== null) {
    if (c.medianMandateRound >= 9) {
      score += 20;
      reasons.push(`median_round=${c.medianMandateRound} (>= 9)`);
    } else if (c.medianMandateRound >= 8) {
      score += 10;
      reasons.push(`median_round=${c.medianMandateRound} (just below target)`);
    } else {
      reasons.push(`median_round=${c.medianMandateRound} (TOO EARLY)`);
    }
  } else {
    reasons.push(`no_mandate_fires`);
  }

  /* Decision target 3: treasury mandate dominance <= 65% */
  if (c.treasuryMandateDominance !== null) {
    if (c.treasuryMandateDominance <= 60) {
      score += 25;
      reasons.push(`treasury_mandate=${c.treasuryMandateDominance.toFixed(0)}% (<= 60%, healthy)`);
    } else if (c.treasuryMandateDominance <= 75) {
      score += 10;
      reasons.push(`treasury_mandate=${c.treasuryMandateDominance.toFixed(0)}% (60-75%, marginal)`);
    } else {
      reasons.push(`treasury_mandate=${c.treasuryMandateDominance.toFixed(0)}% (> 75%, RUNAWAY)`);
    }
  }

  /* Decision target 4: manufacturer mandate count >= 5 */
  const mfgMandate = c.mandateProfileCounts['manufacturer-industry'];
  if (mfgMandate >= 8) {
    score += 15;
    reasons.push(`mfg_mandate=${mfgMandate} (>= 8, viable)`);
  } else if (mfgMandate >= 3) {
    score += 7;
    reasons.push(`mfg_mandate=${mfgMandate} (3-7, marginal)`);
  } else {
    reasons.push(`mfg_mandate=${mfgMandate} (< 3, LOCKED OUT)`);
  }

  /* Decision target 5: merchant share of mandate path (proxy for "merchant has a path") */
  const merchMandate = c.mandateProfileCounts['merchant-infrastructure'];
  if (merchMandate >= 5) {
    score += 10;
    reasons.push(`merch_mandate=${merchMandate} (>= 5, healthy)`);
  } else {
    reasons.push(`merch_mandate=${merchMandate} (< 5)`);
  }

  return { score, reasons };
}

const scored = combos.map(c => ({ ...c, ...scoreCombo(c) }));
scored.sort((a, b) => b.score - a.score);

/* ============================================================
 * Step 4: Categorize and report
 * ============================================================ */
const categories = {
  neverTriggers: combos.filter(c => c.mandatePct < 5).length,
  alwaysTriggers: combos.filter(c => c.mandatePct > 90).length,
  triggersTooEarly: combos.filter(c => c.medianMandateRound !== null && c.medianMandateRound < 8).length,
  treasuryRunaway: combos.filter(c => c.treasuryMandateDominance !== null && c.treasuryMandateDominance > 75).length,
  manufacturerLockedOut: combos.filter(c => c.mandateProfileCounts['manufacturer-industry'] < 3 && c.mandatePct > 10).length,
  mostlyHardCap: combos.filter(c => c.mandatePct >= 5 && c.mandatePct < 20).length,
  healthy30to70: combos.filter(c => c.mandatePct >= 30 && c.mandatePct <= 70).length,
};

console.log('\n='.repeat(60));
console.log('CATEGORY SUMMARY');
console.log('='.repeat(60));
console.log(`Combos with mandate_pct in [30, 70]:           ${categories.healthy30to70}`);
console.log(`Combos that never trigger (< 5%):              ${categories.neverTriggers}`);
console.log(`Combos that always trigger (> 90%):            ${categories.alwaysTriggers}`);
console.log(`Combos triggering too early (median < 8):      ${categories.triggersTooEarly}`);
console.log(`Combos with Treasury runaway (> 75% mandate):  ${categories.treasuryRunaway}`);
console.log(`Combos with Manufacturer locked out:           ${categories.manufacturerLockedOut}`);
console.log(`Combos mostly hard-cap (5-20% mandate):        ${categories.mostlyHardCap}`);

console.log('\n='.repeat(60));
console.log('TOP 10 CANDIDATES (by fit score)');
console.log('='.repeat(60));
for (let i = 0; i < Math.min(10, scored.length); i++) {
  const c = scored[i];
  console.log(`\n#${i + 1}  score=${c.score}  min_round=${c.minRound}  threshold=${c.threshold}  lead=${c.lead}  hard_cap=${c.hardCap}`);
  console.log(`   mandate ${c.mandateCount}/${c.n}  (${c.mandatePct.toFixed(0)}%)  hard-cap ${c.hardCapCount}/${c.n}`);
  console.log(`   mandate round: median=${c.medianMandateRound}  earliest=${c.earliestMandateRound}  latest=${c.latestMandateRound}`);
  console.log(`   avg winner IP: ${c.avgWinnerIP.toFixed(1)}  avg lead margin: ${c.avgLeadMargin.toFixed(1)}`);
  console.log(`   winner profile (overall): T=${c.profileCounts['treasury-finance']}  M=${c.profileCounts['merchant-infrastructure']}  Mfg=${c.profileCounts['manufacturer-industry']}`);
  console.log(`   winner profile (mandate): T=${c.mandateProfileCounts['treasury-finance']}  M=${c.mandateProfileCounts['merchant-infrastructure']}  Mfg=${c.mandateProfileCounts['manufacturer-industry']}`);
  console.log(`   winner profile (hardcap): T=${c.hardCapProfileCounts['treasury-finance']}  M=${c.hardCapProfileCounts['merchant-infrastructure']}  Mfg=${c.hardCapProfileCounts['manufacturer-industry']}`);
  console.log(`   reasons: ${c.reasons.join('; ')}`);
}

/* Spotlight: fixed-cap baseline for comparison */
console.log('\n='.repeat(60));
console.log('FIXED-CAP BASELINES (for comparison)');
console.log('='.repeat(60));
for (const hc of HARD_CAP_VALUES) {
  /* "fixed cap only" = mandate effectively never fires; use threshold=999 */
  const ipsAtCap = games.map(g => {
    const snap = g.roundSnapshots[hc - 1];
    return snap ? snap.ips : null;
  }).filter(x => x !== null);
  const winners = ipsAtCap.map(ips => {
    const sorted = ips.map((ip, i) => ({ ip, i })).sort((a, b) => b.ip - a.ip);
    return { slot: sorted[0].i, ip: sorted[0].ip, lead: sorted[0].ip - sorted[1].ip };
  });
  const profileCounts = { 'treasury-finance': 0, 'merchant-infrastructure': 0, 'manufacturer-industry': 0 };
  for (let i = 0; i < winners.length; i++) {
    profileCounts[TM_TRIPLET[winners[i].slot]] += 1;
  }
  const avgIP = winners.reduce((a, b) => a + b.ip, 0) / winners.length;
  const avgLead = winners.reduce((a, b) => a + b.lead, 0) / winners.length;
  console.log(`\nFixed cap = ${hc} rounds:`);
  console.log(`  Winner profile: T=${profileCounts['treasury-finance']}  M=${profileCounts['merchant-infrastructure']}  Mfg=${profileCounts['manufacturer-industry']}`);
  console.log(`  Avg winner IP: ${avgIP.toFixed(1)}  Avg lead margin: ${avgLead.toFixed(1)}`);
}

/* Write JSON output */
writeFileSync(
  OUT_DIR + '/victory-diagnostic-summary.json',
  JSON.stringify({
    generated: new Date().toISOString(),
    caveat: 'Measures "would the rule have triggered given current player behavior" — not behavioral adaptation. The latter is a candidate-HTML question.',
    parameterSweep: { MIN_ROUND_VALUES, THRESHOLD_VALUES, LEAD_VALUES, HARD_CAP_VALUES },
    totalCombos: combos.length,
    categories,
    top20: scored.slice(0, 20).map(c => ({
      score: c.score, minRound: c.minRound, threshold: c.threshold, lead: c.lead, hardCap: c.hardCap,
      mandatePct: Number(c.mandatePct.toFixed(1)),
      medianMandateRound: c.medianMandateRound,
      avgWinnerIP: Number(c.avgWinnerIP.toFixed(2)),
      avgLeadMargin: Number(c.avgLeadMargin.toFixed(2)),
      profileCounts: c.profileCounts,
      mandateProfileCounts: c.mandateProfileCounts,
      hardCapProfileCounts: c.hardCapProfileCounts,
      reasons: c.reasons,
    })),
    allCombos: scored.map(c => ({
      score: c.score, minRound: c.minRound, threshold: c.threshold, lead: c.lead, hardCap: c.hardCap,
      mandatePct: Number(c.mandatePct.toFixed(1)),
      medianMandateRound: c.medianMandateRound,
      mfgMandate: c.mandateProfileCounts['manufacturer-industry'],
      merchMandate: c.mandateProfileCounts['merchant-infrastructure'],
      treasuryMandate: c.mandateProfileCounts['treasury-finance'],
    })),
  }, null, 2)
);
console.log(`\n  wrote ${OUT_DIR}/victory-diagnostic-summary.json`);
console.log('\nDone.');
