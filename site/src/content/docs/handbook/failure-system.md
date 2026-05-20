---
title: Failure System
description: Credit Crisis, Rebellion, and Default — the three-tier failure hierarchy introduced in v1.1.0.
sidebar:
  order: 3
---

Sovereign v1.1.0 introduces a working **three-tier failure system**. Default at Public Credit 0 stays as the catastrophic financial collapse condition. Rebellion at Public Resistance 12 stays as the catastrophic political collapse. Between them, a soft intermediate event — **Credit Crisis** — fires the first time Public Credit collapses to 4 or lower.

Default and Rebellion are unchanged from v0.10. Credit Crisis is new in v1.1.0.

## The three tiers

| Tier | Trigger | Severity | Effect | Reset |
|---|---|---|---|---|
| **Credit Crisis** | Public Credit ≤ 4 (first time per game) | warning | Resistance +1, System log | none |
| **Rebellion** | Public Resistance 12 | catastrophe | Revenue upgrades destroyed; Whiskey Excise owner → Crisis | resistance → 6 |
| **Default** | Public Credit 0 | catastrophe | 50% cash + 1 random upgrade per player | credit → 3 |

Default and Rebellion are catastrophic and rare. Credit Crisis is the live, visible warning state — the republic is in financial trouble but the game continues.

## Why Credit Crisis exists

Before v1.1.0, the failure system had two catastrophic tiers (Default at Credit 0, Rebellion at Resistance 12). Both were essentially unreachable in canonical scripted play — Default fired 0 / 400 games and Rebellion fired 0 / 400. The system was decorative.

The v0.11 – v0.18 design arc added pressure on the Credit track so that more games drift toward the warning band:

- **Bank Run** drops Public Credit −1 and Industrial Capacity −1 (v0.11).
- **Speculation Fever** drops Public Credit −1, Resistance +1, and auctions an unowned Rev/State Debt property (v0.13).
- **Anti-Federalist Pamphlet** adds Public Credit −1 to its existing Resistance +1 and 30 TN per Revenue-System property hit (v0.16).
- **Speculation Fever fragile-credit escalation** — Credit −1 at Credit ≥ 7, Credit −2 at Credit ≤ 6 (v0.17). The most efficient way to push Credit below 5.

Even with all four pressure sources, Credit reaching 0 in canonical scripted play stays unrealistic (still 0 / 400). That's a feature: Default is meant to be catastrophic, not a balance target. Credit Crisis at Credit ≤ 4 is the right tier for the live signal — reachable, dramatic, and non-terminal.

## What Credit Crisis does

When Public Credit collapses from above 4 to 4 or lower for the first time in a game:

1. A `CREDIT_CRISIS` System row appears in the ledger:
   > Public Credit collapses to N · financial panic spreads · Public Resistance rises by 1
2. Public Resistance ticks +1 immediately (a separate `RESISTANCE` row).
3. The `creditCrisisFired` flag is set in game state. The event will not fire again in the same game even if Credit recovers and dips back into the warning band.
4. Public Credit is **not** reset. No assets are destroyed. No cash is lost. The game continues.

The +1 Resistance is the meaningful penalty — it feeds the Rebellion timer (Resistance 12) and creates a cross-track link between financial and political crisis without ending the game. Historically appropriate: the Whiskey Rebellion was triggered by financial policy.

## What Credit Crisis does NOT do

- It does not reset Credit (Default does that).
- It does not destroy any assets (Default does that).
- It does not destroy Revenue upgrades (Rebellion does that).
- It does not modify cash, ownership, scoring, or any player property.
- It does not fire if Credit jumps directly to 0 (Default owns that transition cleanly).

## How often does it fire?

In CANONICAL-400 scripted play (seeds 2026 – 2425, Treasury / Merchant / Manufacturer triplet), Credit Crisis fires **2 / 400** games (seeds 2139 and 2313). Both fires come from Speculation Fever at Credit ≤ 6 escalating to −2 and crossing into the warning band.

It's a rare event by design — it should be a meaningful exception, not frequent background noise.

## Visual treatment

The polished v1.1.0 build marks Crisis state in three places at once:

- **Tracks panel** — the Credit 1 – 4 zone is shaded as a warning band, with a `⚠ Credit Crisis zone` tag when Credit is at risk and a sticky `Credit Crisis fired` tag once it has fired.
- **Ledger** — the `CREDIT_CRISIS` row has a distinct warning-red severity treatment, separable from regular track-change rows without relying on color alone (border, icon, text label all carry the signal).
- **Endgame report** — posture chips above the score columns show credit posture (Stable / Strained / Collapsed), Crisis state (avoided / fired / Default fired), and Rebellion state. The endgame narration explicitly mentions Crisis / Default / Rebellion outcomes.

## How v1.1.0 keeps Default dramatic

Default remains the catastrophic endpoint: at Credit 0, every player loses half their cash and one random upgrade, and Credit resets to 3. It is meant to be a dramatic limit, not a regular game event.

Credit Crisis is what makes Default's existence legible without trying to make Default itself reachable. The republic now has a visible warning band before collapse, exactly the shape good system design calls for.

## Caveat

The failure-system work is simulation-verified across the canonical T/M/Mfg triplet (400 seeds) and the MFG-MIRROR variant (100 seeds). It is not yet human-playtested. The Credit Crisis frequency, penalty severity, and visual treatments may shift based on live play.

## Further reading

- Full evidence: [`experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-evidence-sweep.html`](https://github.com/mcp-tool-shop-org/sovereign/blob/main/experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-evidence-sweep.html) — the CANONICAL-400 / 100-A/B / MFG-MIRROR-100 sweep.
- Promotion audit: [`experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-promotion-audit.html`](https://github.com/mcp-tool-shop-org/sovereign/blob/main/experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-promotion-audit.html) — 44 / 44 PASS across provenance, implementation, regression, balance, and documentation.
- Design-system reference: [`release/design-system/`](https://github.com/mcp-tool-shop-org/sovereign/tree/main/release/design-system) — visual system sheet and screen-state audit.
