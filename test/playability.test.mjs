/**
 * Sovereign · reproducible playability gates (LIVE dispatch path)
 * ===============================================================
 *
 * Loads the real shipping HTML in jsdom and drives the LIVE `dispatch` path
 * (not the batch simulator). Asserts the hard playability gates that two
 * separate same-day-withdrawal bugs proved cannot be left to batch sim:
 *
 *   GATE 1  No post-roll dead-end       — every human ROLL leaves a visible,
 *                                          enabled action affordance before the
 *                                          turn can end.
 *   GATE 2  No hang / always progresses  — a full game reaches a terminal state
 *                                          within a bounded number of dispatches;
 *                                          it never sits in a phase with no driver.
 *   GATE 3  Auction soft-lock regression — a card-triggered (Speculation Fever)
 *                                          auction on the human's turn is DRIVEN
 *                                          (opponent bids processed; pauses only
 *                                          for the human's bid; resolves) instead
 *                                          of hanging on a buttonless
 *                                          "considering their bid…" state.
 *   GATE 4  No designer chrome in player  — without ?designer=1 the Balance
 *           chrome                         Sweep / designer pills are hidden;
 *                                          with ?designer=1 they are interactable.
 *
 * See playability.harness.mjs for the technology rationale (jsdom + virtual
 * timer shim), the hardcoded determinism seeds, and an honest list of what this
 * harness does NOT cover (it is not a substitute for a human walkthrough).
 *
 * Run: `npm run test:playability`
 */

import {
  bootGame,
  driveGame,
  railSnapshot,
  recordCardAuction,
  humanBidPending,
  flushMicrotasks,
  FULL_GAME_SEED,
  AUCTION_SEED,
} from './playability.harness.mjs';

let failures = 0;
const t0 = Date.now();

async function check(label, fn) {
  try {
    await fn();
    console.log(`  PASS  ${label}`);
  } catch (e) {
    failures++;
    console.log(`  FAIL  ${label} — ${e.message}`);
  }
}

console.log('Sovereign · playability gates (live dispatch path, jsdom)');
console.log(`  seeds: full-game=${FULL_GAME_SEED}  auction=${AUCTION_SEED}\n`);

// ---------------------------------------------------------------------------
// Drive ONE full game once; Gates 1 and 2 both read from this single run.
// ---------------------------------------------------------------------------
const full = bootGame({ seed: FULL_GAME_SEED });
const fullReport = await driveGame(full, { keepRevStateDebtUnowned: true });

await check('jsdom loaded the real HTML with no script errors', () => {
  if (full.jsdomErrors.length) {
    throw new Error(`${full.jsdomErrors.length} jsdom error(s): ${full.jsdomErrors[0].slice(0, 200)}`);
  }
});

await check('boot exposes the live globals (dispatch / startNewGame / STATE)', () => {
  if (typeof full.w.dispatch !== 'function') throw new Error('window.dispatch missing');
  if (typeof full.w.startNewGame !== 'function') throw new Error('window.startNewGame missing');
  if (full.S('typeof STATE') !== 'object') throw new Error('STATE not reachable via window.eval');
});

// --- GATE 1: No post-roll dead-end ---------------------------------------
await check('GATE 1 · no post-roll dead-end (every human roll leaves an affordance)', () => {
  if (fullReport.rollsObserved < 5) {
    throw new Error(`only observed ${fullReport.rollsObserved} human rolls — driver did not progress`);
  }
  if (fullReport.deadEndAfterRoll) {
    const d = fullReport.deadEndAfterRoll;
    throw new Error(`dead-end after roll on turn ${d.turn}: phase '${d.phase}' had no enabled action affordance`);
  }
  // Defensive: confirm every recorded post-roll rail had SOME way forward.
  const bad = fullReport.railAfterEveryRoll.filter(
    (r) => r.active === 0 && r.phase !== 'game-over' && r.gameActionButtons === 0 && r.enabledInputs === 0
  );
  if (bad.length) {
    throw new Error(`${bad.length} post-roll state(s) had an empty action rail, e.g. phase '${bad[0].phase}' turn ${bad[0].turn}`);
  }
  console.log(`        (${fullReport.rollsObserved} rolls, all left ≥1 enabled affordance)`);
});

// --- GATE 2: No hang / always progresses ---------------------------------
await check('GATE 2 · no hang; game reaches a terminal state within bounds', () => {
  if (fullReport.hang) {
    throw new Error(`game hung in phase '${fullReport.hang.phase}' (active ${fullReport.hang.active}${fullReport.hang.reason ? ', ' + fullReport.hang.reason : ''})`);
  }
  if (!fullReport.reachedTerminal) {
    throw new Error(`game did not reach a terminal state in ${fullReport.dispatches} dispatches`);
  }
  if (fullReport.terminalPhase !== 'game-over') {
    throw new Error(`terminal phase was '${fullReport.terminalPhase}', expected 'game-over'`);
  }
  console.log(`        (terminal at lap ${fullReport.finalLap}, ${fullReport.dispatches} dispatches, human circuits ${fullReport.humanCircuits})`);
});

// --- GATE 3: Auction soft-lock regression (THE critical one) -------------
// Reproduce the EXACT bug: a Speculation Fever card opens an auction on the
// human's turn. Pre-fix, finishLanding() did not drive it and the live game
// soft-locked on a buttonless "considering their bid…" opponent state. We drive
// seed AUCTION_SEED until that card fires, then assert the auction was driven
// and paused FOR THE HUMAN (opponent bids already processed, next bidder = us).
await check('GATE 3 · card-triggered (Speculation Fever) auction is DRIVEN, not hung', async () => {
  const g = bootGame({ seed: AUCTION_SEED });
  const r = await driveGame(g, {
    keepRevStateDebtUnowned: true, // keep candidates unowned so the card has a target
    captureCardAuction: true,
    stopOnCardAuction: true,        // halt the instant the card auction opens
    bidPolicy: () => 0,
  });

  if (!r.cardAuction) {
    throw new Error(`Speculation Fever card-auction never occurred on seed ${AUCTION_SEED} (drove ${r.dispatches} dispatches) — re-pick the seed`);
  }
  const a = r.cardAuction;

  // The auction must have been DRIVEN: at least one opponent bid was processed
  // BEFORE it paused. Pre-fix, zero opponent bids would be recorded because
  // finishLanding never called processNextAuctionBid.
  if (!(a.opponentBidsBeforeHuman >= 1)) {
    throw new Error(`auction opened but engine drove ${a.opponentBidsBeforeHuman} opponent bids — this is the soft-lock (processNextAuctionBid was not called)`);
  }
  // It must have PAUSED for the human, not for a driverless opponent.
  if (!a.pausedForHuman || a.nextBidder !== 0) {
    throw new Error(`auction paused on bidder ${a.nextBidder} (a buttonless opponent state), not the human`);
  }
  // The human must actually see a bid affordance in the rendered controls.
  if (!humanBidPending(g.S)) {
    throw new Error('engine state says human bid pending but reconciliation failed');
  }
  const rail = railSnapshot(g.w, g.S);
  if (rail.enabledInputs < 1 && rail.gameActionButtons < 1) {
    throw new Error(`auction rail rendered no human bid affordance (inputs=${rail.enabledInputs}, buttons=${rail.gameActionButtons})`);
  }

  // And it must RESOLVE once the human acts: pass, then drive to completion.
  g.S("dispatch({type:'AUCTION_BID', playerIndex:0, amount:0, reason:'harness pass'})");
  await flushMicrotasks();
  const resumed = await driveGame(g, { keepRevStateDebtUnowned: true });
  if (resumed.hang) {
    throw new Error(`after human resolved the card-auction, game hung in '${resumed.hang.phase}'`);
  }
  if (!resumed.reachedTerminal) {
    throw new Error('after human resolved the card-auction, game did not reach a terminal state');
  }

  console.log(`        (Speculation Fever on space ${a.spaceNum}, via ${a.phase}: ${a.opponentBidsBeforeHuman} opponent bid(s) driven, paused for human, then resolved to game-over)`);
});

// --- GATE 4: No designer controls in player chrome -----------------------
await check('GATE 4 · designer chrome hidden without ?designer=1, shown with it', () => {
  const plain = bootGame({ seed: FULL_GAME_SEED, designer: false });
  const dsgn = bootGame({ seed: FULL_GAME_SEED, designer: true });

  const btnPlain = plain.w.document.getElementById('btnBatch');
  const btnDsgn = dsgn.w.document.getElementById('btnBatch');
  if (!btnPlain || !btnDsgn) throw new Error('#btnBatch (Balance Sweep) not found in DOM');

  // Body-class gate.
  if (plain.w.document.body.classList.contains('designer-mode')) {
    throw new Error('plain build has designer-mode body class (designer chrome leaked into player view)');
  }
  if (!dsgn.w.document.body.classList.contains('designer-mode')) {
    throw new Error('?designer=1 build is missing the designer-mode body class');
  }

  // Computed-style gate (the actual visibility the player sees).
  const displayPlain = plain.w.getComputedStyle(btnPlain).display;
  const displayDsgn = dsgn.w.getComputedStyle(btnDsgn).display;
  if (displayPlain !== 'none') {
    throw new Error(`Balance Sweep button is visible in player view (display:${displayPlain})`);
  }
  if (displayDsgn === 'none') {
    throw new Error('Balance Sweep button is hidden even with ?designer=1');
  }
  console.log(`        (btnBatch display: player='${displayPlain}', designer='${displayDsgn}')`);
});

// ---------------------------------------------------------------------------
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
console.log();
console.log(`Runtime: ${elapsed}s`);
if (failures > 0) {
  console.log(`${failures} playability gate(s) FAILED.`);
  process.exit(1);
}
console.log('All playability gates passed.');
