/**
 * Sovereign · reproducible playability harness
 * ============================================
 *
 * WHY THIS EXISTS
 * ---------------
 * Sovereign was published as v1.1.0 and withdrawn the same day because of a
 * human-play bug (a post-roll dead-end) that NO batch simulation caught. A
 * later bug — a card-triggered auction that HARD-HUNG the live build while the
 * batch simulator sailed past it — proved the same point a second time: the
 * LIVE dispatch path needs its own reproducible tests. This harness is that
 * gate. It loads the REAL shipping HTML and drives the LIVE dispatch path
 * (NOT the batch `runBatchGame` path, which has its own self-contained auction
 * loop and therefore cannot see the bugs we care about).
 *
 * TECHNOLOGY: jsdom (single dev-only dependency)
 * ----------------------------------------------
 * The game is one self-contained HTML file whose logic lives in a <script>
 * block. jsdom loads it with `runScripts:'dangerously'` and `pretendToBeVisual`
 * and gives us:
 *   - `window.dispatch(action)` / `window.startNewGame(seed)` — reachable as
 *     window properties (they are top-level `function` declarations).
 *   - `window.eval('STATE…')` — reads the module-level `let STATE` lexical
 *     binding (which is NOT a window property) from inside the page's own
 *     script scope, so it reflects every reducer mutation.
 *   - Real CSS cascade — `getComputedStyle` resolves the `?designer=1`
 *     stylesheet gate, so the designer-chrome check is fully assertable.
 * jsdom was chosen over Playwright because it is CI-friendly (no browser
 * download, no headful runner) and the game needs no real layout/paint to be
 * driven — only the reducer, the rendered controls DOM, and computed styles.
 *
 * DETERMINISM
 * -----------
 * Two seeds are hardcoded so every run is byte-reproducible:
 *   - FULL_GAME_SEED = 1   — drives a complete game to a terminal state.
 *   - AUCTION_SEED   = 1   — on this seed the HUMAN draws "Speculation Fever"
 *                            (market deck card id 3), which opens an auction on
 *                            an unowned Rev/State-Debt property. This is the
 *                            exact regression for the card-triggered-auction
 *                            soft-lock (engine fix ENG-A-001, sovereign-solo.html
 *                            ~line 5047: finishLanding now drives the auction via
 *                            processNextAuctionBid). Both happen to be seed 1.
 *
 * THE OPPONENT TIMER
 * ------------------
 * Opponents auto-run on `setTimeout(…, 1500)` inside `dispatch`. Driving a full
 * game on the real clock would take minutes. Instead we inject a dependency-free
 * virtual-clock timer shim before the page script parses, then advance virtual
 * time instantly. `queueMicrotask` (used for Default/Rebellion/Crisis cascades)
 * stays native and is drained with `process.nextTick`.
 *
 * THE LOAD-BEARING SUBTLETY
 * -------------------------
 * The human can be asked to BID during an OPPONENT'S turn: when an opponent
 * declines an asset, `processNextAuctionBid` drives opponent bids and then
 * PAUSES with `pendingAuction.bidsRemaining[0] === 0` while activePlayerIndex
 * is still the opponent. A driver that gates human actions only on
 * `activePlayerIndex === 0` deadlocks here. The driver below detects a pending
 * human bid by `bidsRemaining[0] === 0` regardless of whose turn it is.
 *
 * WHAT THIS DOES NOT COVER (be honest)
 * ------------------------------------
 * This is a headless reducer/DOM gate, not a human walkthrough. It does NOT
 * verify visual layout, paint, animation timing, focus order, pointer
 * ergonomics, copy quality, or "does it FEEL playable." Gate 6 of the
 * playability doctrine still requires a real person clicking through a real
 * browser. This harness guarantees the game is mechanically *drivable and
 * never dead-ends* on the live path; it does not guarantee it is *good*.
 */

import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HTML_PATH = resolve(ROOT, 'release/digital-mode/sovereign-solo.html');
const HTML = readFileSync(HTML_PATH, 'utf8');

const FULL_GAME_SEED = 1;
const AUCTION_SEED = 1; // human draws Speculation Fever -> card-triggered auction

// Speculation Fever auctions an unowned Rev/State-Debt property among these.
const REV_STATE_DEBT_SPACES = new Set([1, 3, 6, 8, 9]);

// Bound on driver iterations — a healthy game terminates well under this.
const MAX_DISPATCH = 6000;

// ---------------------------------------------------------------------------
// Virtual-clock timer shim (dependency-free fake timers)
// ---------------------------------------------------------------------------
function makeTimerShim() {
  let now = 0;
  let seq = 0;
  const timers = new Map(); // id -> { time, fn, args, interval? }
  return {
    setTimeout(fn, delay, ...args) {
      const id = ++seq;
      timers.set(id, { time: now + (delay || 0), fn, args });
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
    setInterval(fn, delay, ...args) {
      const id = ++seq;
      timers.set(id, { time: now + (delay || 0), fn, args, interval: delay || 0 });
      return id;
    },
    clearInterval(id) { timers.delete(id); },
    /** Advance virtual time by `ms`, running due timers in chronological order.
     *  Timers scheduled during a callback are honored (chained opponent turns). */
    advance(ms) {
      const target = now + ms;
      let guard = 0;
      while (guard++ < 200000) {
        let nextId = -1;
        let nextTime = Infinity;
        for (const [id, t] of timers) {
          if (t.time <= target && t.time < nextTime) { nextTime = t.time; nextId = id; }
        }
        if (nextId === -1) break;
        const t = timers.get(nextId);
        now = t.time;
        if (t.interval != null) t.time = now + t.interval; else timers.delete(nextId);
        try { t.fn(...t.args); } catch (e) { /* browsers swallow timer errors */ }
      }
      now = target;
    },
    pending() { return timers.size; },
  };
}

const flushMicrotasks = () => new Promise((r) => process.nextTick(r));

// ---------------------------------------------------------------------------
// Boot a fresh game instance
// ---------------------------------------------------------------------------
function bootGame({ seed = FULL_GAME_SEED, designer = false } = {}) {
  const shim = makeTimerShim();
  const jsdomErrors = [];
  const url = 'http://localhost/sovereign-solo.html' + (designer ? '?designer=1' : '');
  const dom = new JSDOM(HTML, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    url,
    beforeParse(window) {
      // Neutralize browser-only side effects the harness must not depend on.
      window.alert = () => {};
      window.confirm = () => true;
      window.scrollTo = () => {};
      if (window.HTMLElement && window.HTMLElement.prototype) {
        window.HTMLElement.prototype.scrollIntoView = () => {};
      }
      // Swap in the virtual clock BEFORE the page script schedules anything.
      window.setTimeout = shim.setTimeout;
      window.clearTimeout = shim.clearTimeout;
      window.setInterval = shim.setInterval;
      window.clearInterval = shim.clearInterval;
    },
  });
  dom.virtualConsole.on('jsdomError', (e) => jsdomErrors.push(String(e && (e.stack || e.message) || e)));

  const w = dom.window;
  const S = (expr) => w.eval(expr);

  // Re-seed deterministically (boot defaults to seed 2026).
  S(`startNewGame(${seed})`);

  return { dom, w, S, shim, jsdomErrors };
}

// ---------------------------------------------------------------------------
// Rendered-controls inspection
// ---------------------------------------------------------------------------
/** Snapshot the rendered action rail the human actually sees. */
function railSnapshot(w, S) {
  const doc = w.document;
  const containers = ['controlsBar', 'boardActionSlot']
    .map((id) => doc.getElementById(id))
    .filter(Boolean);
  const buttons = [];
  const inputs = [];
  for (const c of containers) {
    buttons.push(...c.querySelectorAll('button'));
    inputs.push(...c.querySelectorAll('input'));
  }
  const enabled = buttons.filter((b) => !b.disabled);
  // "Open panels"/"Open portfolio" is always-present sidebar chrome, not a game
  // action — exclude it when judging whether a real turn affordance exists.
  const CHROME = /^(Open panels|Open portfolio|Ledger|How to play|Hide panels|Show panels)$/i;
  const gameEnabled = enabled.filter((b) => !CHROME.test(b.textContent.trim()));
  return {
    phase: S('STATE.phase'),
    active: S('STATE.activePlayerIndex'),
    totalButtons: buttons.length,
    enabledButtons: enabled.length,
    gameActionButtons: gameEnabled.length,
    enabledInputs: inputs.length,
    labels: gameEnabled.map((b) => b.textContent.trim()).slice(0, 10),
  };
}

const HUMAN_DECISION_PHASES = new Set([
  'act-vote', 'asset-decision', 'card-resolve', 'card-choice',
  'crisis-choice', 'auction', 'late-event-choice', 'hand-full-choice',
]);

/** True when the human owes a bid in ANY open auction (even on an opponent turn). */
function humanBidPending(S) {
  return S(
    "STATE.phase==='auction' && STATE.pendingAuction && " +
    "STATE.pendingAuction.bidsRemaining.length>0 && STATE.pendingAuction.bidsRemaining[0]===0"
  );
}

// ---------------------------------------------------------------------------
// The deterministic driver
// ---------------------------------------------------------------------------
/**
 * Drive the live game from its current state toward a terminal state.
 *
 * Strategy for the human seat:
 *   - awaiting-roll      -> ROLL_DICE
 *   - act-vote (ours)    -> CAST_VOTE yes
 *   - asset-decision     -> per `assetPolicy` (default: decline Rev/State-Debt
 *                           to keep Speculation Fever candidates unowned, else
 *                           buy if affordable)
 *   - card-resolve       -> RESOLVE_CARD (records card-opened auction provenance)
 *   - card-choice        -> first choice
 *   - crisis-choice      -> pay 50
 *   - auction (our bid)  -> per `bidPolicy` (default: pass)
 *   - late-event-choice  -> refuse
 *   - hand-full-choice   -> discard new
 * Opponents are advanced by ticking the virtual clock.
 *
 * Instrumentation collected:
 *   - rollsObserved / deadEndAfterRoll  (Gate 1)
 *   - reachedTerminal / dispatches      (Gate 2)
 *   - cardAuction { driven, pausedForHuman, opponentBidsBeforeHuman, … } (Gate 3)
 */
async function driveGame(ctx, opts = {}) {
  const { S, shim } = ctx;
  const {
    keepRevStateDebtUnowned = true,
    bidPolicy = () => 0,          // default: pass on human bids
    captureCardAuction = false,   // record card-triggered-auction provenance
    stopOnCardAuction = false,    // halt as soon as a card auction opens (for inspection)
  } = opts;

  const report = {
    dispatches: 0,
    rollsObserved: 0,
    deadEndAfterRoll: null,       // {turn, phase} if a roll left no affordance
    reachedTerminal: false,
    terminalPhase: null,
    finalLap: null,
    humanCircuits: null,
    hang: null,                   // {phase, active} if the game stops with no driver
    cardAuction: null,            // provenance of a card-triggered auction
    railAfterEveryRoll: [],       // rail snapshots immediately after each human roll
  };

  let prevPhase = S('STATE.phase');

  for (report.dispatches = 0; report.dispatches < MAX_DISPATCH; report.dispatches++) {
    // (0) Terminal?
    if (S("STATE.status === 'gameOver'")) {
      report.reachedTerminal = true;
      report.terminalPhase = S('STATE.phase');
      report.finalLap = S('STATE.lap');
      report.humanCircuits = S('STATE.players[0].circuitsCompleted');
      break;
    }

    // (1) Human bid owed in any auction — highest priority (can happen on an
    //     opponent's turn). This is the load-bearing case the regression hides.
    if (humanBidPending(S)) {
      if (captureCardAuction) {
        const reason = S('STATE.pendingAuction.reason') || '';
        if (/Speculation Fever/.test(reason) && !report.cardAuction) {
          report.cardAuction = recordCardAuction(S, { phase: 'human-bid-turn' });
          if (stopOnCardAuction) break;
        }
      }
      const amt = Number(bidPolicy(S)) || 0;
      S(`dispatch({type:'AUCTION_BID', playerIndex:0, amount:${amt}, reason:'harness bid'})`);
      await flushMicrotasks();
      continue;
    }

    const active = S('STATE.activePlayerIndex');
    const phase = S('STATE.phase');

    // (2) Opponent turn — advance the virtual clock so their setTimeout fires.
    if (active !== 0) {
      shim.advance(3000);
      await flushMicrotasks();
      // Detect a true hang: nobody to move, no timer queued, not our bid, not over.
      if (
        shim.pending() === 0 &&
        S('STATE.activePlayerIndex') !== 0 &&
        !humanBidPending(S) &&
        !S("STATE.status === 'gameOver'")
      ) {
        report.hang = { phase: S('STATE.phase'), active: S('STATE.activePlayerIndex') };
        break;
      }
      continue;
    }

    // (3) Human turn — act by phase.
    if (phase === 'awaiting-roll') {
      const turn = S('STATE.turnIndex');
      S("dispatch({type:'ROLL_DICE'})");
      await flushMicrotasks();
      report.rollsObserved++;
      // GATE 1 evidence — capture the rail the instant the roll resolves, after
      // the engine has driven any auto sub-phase but before the turn can end.
      const rail = railSnapshot(ctx.w, S);
      report.railAfterEveryRoll.push({ turn, ...rail });
      // A dead-end = the human's own turn is still live (active 0, a decision
      // phase OR awaiting-roll) yet there is no enabled game-action affordance.
      const stillHumanTurn = rail.active === 0;
      const decisionLive = HUMAN_DECISION_PHASES.has(rail.phase) || rail.phase === 'awaiting-roll';
      const noAffordance = rail.gameActionButtons === 0 && rail.enabledInputs === 0;
      if (stillHumanTurn && decisionLive && noAffordance && rail.phase !== 'game-over') {
        report.deadEndAfterRoll = { turn, phase: rail.phase };
      }
    } else if (phase === 'act-vote' && S('STATE.acts.current && STATE.acts.current.votes[0] == null')) {
      S("dispatch({type:'CAST_VOTE', playerIndex:0, vote:'yes', reason:'harness'})");
      await flushMicrotasks();
    } else if (phase === 'asset-decision') {
      const num = S('STATE.pendingLanding && STATE.pendingLanding.spaceNum');
      const cost = S('ASSETS[STATE.pendingLanding.spaceNum] ? ASSETS[STATE.pendingLanding.spaceNum].cost : 1e9');
      const canBuy = S('STATE.players[0].cash') >= cost;
      const keep = keepRevStateDebtUnowned && REV_STATE_DEBT_SPACES.has(num);
      if (!keep && canBuy) S("dispatch({type:'BUY_ASSET'})");
      else S("dispatch({type:'DECLINE_ASSET'})");
      await flushMicrotasks();
    } else if (phase === 'card-resolve') {
      const cardId = S('STATE.pendingCard && STATE.pendingCard.cardId');
      const deck = S('STATE.pendingCard && STATE.pendingCard.deck');
      S("dispatch({type:'RESOLVE_CARD'})");
      await flushMicrotasks();
      if (captureCardAuction && deck === 'market' && cardId === 3 && S("STATE.phase === 'auction'") && !report.cardAuction) {
        report.cardAuction = recordCardAuction(S, { phase: 'card-resolve' });
        if (stopOnCardAuction) break;
      }
    } else if (phase === 'card-choice') {
      S("dispatch({type:'RESOLVE_CARD_CHOICE', choiceIndex:0})");
      await flushMicrotasks();
    } else if (phase === 'crisis-choice') {
      S("dispatch({type:'ROLL_DICE', crisisChoice:'pay'})");
      await flushMicrotasks();
    } else if (phase === 'late-event-choice') {
      S("dispatch({type:'LATE_EVENT_DECIDE', choice:'refuse', playerIndex:0})");
      await flushMicrotasks();
    } else if (phase === 'hand-full-choice') {
      S("dispatch({type:'HAND_FULL_CHOICE', mode:'discard-new'})");
      await flushMicrotasks();
    } else {
      // Unknown human-turn phase: tick the clock; if nothing happens, it's a hang.
      shim.advance(3000);
      await flushMicrotasks();
      if (S('STATE.phase') === phase && shim.pending() === 0 && !S("STATE.status === 'gameOver'")) {
        report.hang = { phase, active };
        break;
      }
    }

    prevPhase = phase;
  }

  if (!report.reachedTerminal && !report.hang && report.dispatches >= MAX_DISPATCH) {
    report.hang = { phase: S('STATE.phase'), active: S('STATE.activePlayerIndex'), reason: 'MAX_DISPATCH' };
  }
  return report;
}

/**
 * Save / load / replay roundtrip on the LIVE-driven game (GATE 5).
 *
 * Drives a full game on the live dispatch path, asks the page to build the exact
 * save payload it would export (`buildSavePayload()`), then calls the REAL
 * `loadFromPayload(payload)` and reports what the player would see.
 *
 * WHY THIS GATE EXISTS (REPLAY-001)
 * ---------------------------------
 * A LIVE-driven decisionLog could not be reloaded: `loadFromPayload` replays the
 * log through `reduce()`, and three live-only effects were never captured in the
 * log, so replay diverged and eventually threw "reducer error at action N" on a
 * BUY_ASSET with a null pendingLanding:
 *   1. opponent PROFILES are chosen from the delegate role (applyPlayerCustom,
 *      localStorage), not from initialState() — replay ran the wrong opponents;
 *   2. an opponent's force-vote fee was applied OUT OF BAND (adjustCash + logRow
 *      in the opponent driver), so it vanished on replay;
 *   3. the Chronicler appends narration-only ledger rows out of band on live
 *      render timing, inflating ledger.length the deterministic replay can't match.
 * The fix persists a `roster`, records the fee on CAST_VOTE, and excludes
 * CHRONICLER rows from the integrity hash. This gate locks all three in.
 *
 * Returns: { reachedTerminal, hadFinalState, loaded, integrityVerified, pill,
 *            decisionLogLen, threwReducerError }.
 */
async function saveLoadRoundtrip(ctx) {
  const { S } = ctx;
  // Build the payload the game would export, then call the real loader.
  S('window.__rtPayload = buildSavePayload()');
  const decisionLogLen = S('window.__rtPayload.decisionLog.length');
  const hadFinalState = S('!!window.__rtPayload.finalState');
  const loaded = S('loadFromPayload(window.__rtPayload)');
  const pill = S("(document.querySelector('.io-pill') || {}).textContent || ''");
  return {
    reachedTerminal: S("STATE.status === 'gameOver'"),
    hadFinalState,
    decisionLogLen,
    loaded,
    // The fixed loader claims "integrity verified" only when a finalState hash
    // was present AND matched; a mid-game save says "no integrity record".
    integrityVerified: /integrity verified/i.test(pill),
    threwReducerError: /reducer error at action/i.test(pill),
    pill,
  };
}

/** Capture provenance of a card-triggered auction at the moment it opens. */
function recordCardAuction(S, meta) {
  return {
    ...meta,
    reason: S('STATE.pendingAuction && STATE.pendingAuction.reason'),
    spaceNum: S('STATE.pendingAuction && STATE.pendingAuction.spaceNum'),
    // Bids already recorded = opponent bids the engine drove BEFORE pausing.
    opponentBidsBeforeHuman: S('STATE.pendingAuction ? STATE.pendingAuction.bids.length : 0'),
    nextBidder: S('STATE.pendingAuction && STATE.pendingAuction.bidsRemaining.length ? STATE.pendingAuction.bidsRemaining[0] : -1'),
    pausedForHuman: S(
      'STATE.pendingAuction && STATE.pendingAuction.bidsRemaining.length>0 && STATE.pendingAuction.bidsRemaining[0]===0'
    ),
    activePlayerIndex: S('STATE.activePlayerIndex'),
  };
}

export {
  bootGame,
  driveGame,
  railSnapshot,
  recordCardAuction,
  saveLoadRoundtrip,
  humanBidPending,
  flushMicrotasks,
  FULL_GAME_SEED,
  AUCTION_SEED,
  REV_STATE_DEBT_SPACES,
  HTML_PATH,
  MAX_DISPATCH,
};
