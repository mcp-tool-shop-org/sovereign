SOVEREIGN — v0.18 POLISHED BUNDLE
==================================
Whole-game visual polish for Sovereign Solo / Digital Mode.
Mechanics frozen at v0.18 failure-pressure candidate.

────────────────────────────────────────────────────────────
BUNDLE CONTENTS
────────────────────────────────────────────────────────────

Sovereign v0.18 Polished _standalone_.html
    The full game. Single-file HTML, no external assets, no
    network calls at runtime. Open in any modern browser. All
    16 player-facing surfaces art-directed: topbar, board,
    treasury, opponents, acts, narration, tracks, inspector,
    card drawer, auction, ledger, endgame, batch modal,
    orientation overlay, resume pill, replay overlay.

Sovereign v0.18 Visual System.html
    Design system reference sheet. Eleven sections covering
    palette (parchment / ink / foil / severity tier / system
    accents), typography ramp, panel components, controls,
    every board tile family, tokens + tier markers, all six
    track states (Credit safe / warning / Default; Resistance
    safe / warning / Rebellion; Capacity), card chrome for
    Market Shock vs Republic Debate, Acts of Congress states
    (in vote / passed / failed), the three failure tiers
    (Crisis / Default / Rebellion), and endgame components.

Sovereign v0.18 Screen Audit.html
    Fifteen-frame visual state audit. Mix of live captures
    (real game state), synth captures (forced state for
    rarely-rendered panels), and composed mocks (inline
    component samples built from the design tokens). Each
    frame is captioned with what visual treatment is being
    demonstrated.

README.txt
    This file.

────────────────────────────────────────────────────────────
TEST NOTES
────────────────────────────────────────────────────────────

Open the polished HTML in a current browser. Three seeds to
confirm mechanics did not drift:

  Seed 2026 — final scores [14, 7, 15], Credit closes at 6,
              no CREDIT_CRISIS row. Byte-identical to all
              prior v0.18-candidate runs.

  Seed 2139 — CREDIT_CRISIS row fires once at lap 7 / turn
              21 ("Public Credit collapses to 4 · financial
              panic spreads · Public Resistance rises by 1").
              Final scores [6, 8, 5]. Credit 4. Resist 4.

  Seed 2313 — CREDIT_CRISIS row fires once at lap 4 / turn
              12 (earlier in the game). Final scores [6, 7,
              7]. Credit 4. Resist 5.

To reproduce: open the polished HTML, click "Balance Sweep"
in the topbar, set Game count = 10, Seed source = Custom
list, paste "2026,2139,2313" and click Run batch. The
report should list those three seeds with the per-seed
outcomes above.

Determinism: a 100-seed canonical sweep (slots = Hamilton /
Morris / Slater, the v0.17-candidate canonical-400
configuration) hashes to 3189375454 against both the
v0.18-candidate Node sim and the v0.18-polished HTML — game
state is byte-identical across the polish pass.

────────────────────────────────────────────────────────────
PRESERVATION NOTES
────────────────────────────────────────────────────────────

Mechanics: not touched.
  - v0.18 Credit Crisis trigger condition (`next <= 4 && next
    > 0 && !creditCrisisFired`) — byte-for-byte
  - v0.18 TRIGGER_CREDIT_CRISIS reducer body — only the
    human-readable `detail` string was rewritten (per spec)
  - Main loop priority Default → Rebellion → Credit Crisis
  - DEFAULT / REBELLION trigger guards + reducer bodies
  - v0.17 Speculation Fever conditional, v0.16
    Anti-Federalist Pamphlet, v0.11 Bank Run
  - All Acts, ASSETS, SPACES, both card decks
  - scorePlayer, computeFinalInfluence, computeRent
  - All three profiles
  - RNG (mulberry32), deck order, seed behavior
  - runBatchGame + batch isolation guard
  - Save / load / replay + Phase 6.1 telemetry hygiene
  - SAVE_VERSION literal stays 'v0.18-candidate' (no
    mechanic changed)

Internal tokens: all preserved byte-identical.
  - Event identifiers: CREDIT_CRISIS, DEFAULT, REBELLION,
    CREDIT, RESISTANCE, CAPACITY, AUCTION, EFFECT,
    NO EFFECT, SCORE, INIT, DRAW, OWN, BUY, MOVE, ROLL,
    TURN, LAP, CASH, RENT
  - Reason strings to adjustTrack: 'Speculation Fever',
    'Bank Run', 'Anti-Federalist Pamphlet', 'Credit Crisis',
    'Funding Act passed', 'Default reset', 'Rebellion reset',
    'Treaty Renegotiation', 'You Are Hamilton', etc.
  - Track keys: 'credit', 'resistance', 'capacity'
  - Profile keys: 'treasury-finance',
    'merchant-infrastructure', 'manufacturer-industry'
  - DOM IDs: every id="..." attribute kept (event listeners
    hang off these)
  - Existing CSS classes: no removals; only additions
  - Recovery gates from v0.14 / v0.15 NOT reintroduced

What was changed (display-only).
  - Topbar: wordmark + italic mode tag + descriptive sub.
    Version moved to a discreet pill at the right of the
    controls row. Added "How to play" button.
  - <title>: "Sovereign — Solo / Digital Mode"
  - SVG seal in the bundler thumbnail still reads v0.18
  - Orientation overlay: first-load auto-show + recall via
    "How to play"
  - Ledger row classes: row-credit-crisis, row-default,
    row-rebellion (CSS only; event identifiers untouched)
  - Tracks panel: warning-band shading, crisis tags,
    .in-warning / .in-default row classes
  - Card drawer: data-deck="market" / data-deck="debate"
    attribute for differentiated card backs
  - Endgame: posture chip row above results, gilt rule +
    § watermark on winner card, drop-caps in narration
  - Batch modal: "Balance Evidence Run" copy, refined
    progress + ctrl block styling
  - Print stylesheet: hides overlays, flattens severity
    plates to ink-on-white, keeps ledger paginated
  - Responsive ≤ 768 px: topbar collapses to single column,
    panel column stacks below the board, ledger grid
    tightens, wordmark scales down

────────────────────────────────────────────────────────────
KNOWN LIMITATIONS
────────────────────────────────────────────────────────────

- DEFAULT and REBELLION do not fire in canonical-400
  scripted play. The styling for those rows is wired and
  preserved, and is documented in the Screen Audit (frame
  9 is a synthesised capture; frames 11 / 12 are composed
  mocks rendering the exact same CSS classes).

- The Node-side canonical-400 sweep result is the
  authoritative balance evidence. The in-HTML batch is
  configured for ≤100 games and is intended for local
  spot-checks and demonstration, not for the full canonical
  evidence run.

- Visual changes are intentionally CSS-only (plus a single
  HTML `data-deck` attribute on the card drawer). No web
  fonts, no external icons, no network at runtime — the
  bundle works fully offline.

────────────────────────────────────────────────────────────
HOW TO OPEN
────────────────────────────────────────────────────────────

1. Unzip the bundle.
2. Double-click "Sovereign v0.18 Polished _standalone_.html"
   (any modern desktop browser — Safari, Chrome, Firefox,
   Edge). No install. No network. No accounts.
3. The orientation overlay will appear on first load. Click
   "Got it — begin" to dismiss; it remembers via
   localStorage.
4. The other two HTML files (Visual System, Screen Audit)
   are reference docs and open the same way.
