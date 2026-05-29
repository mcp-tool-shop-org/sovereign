---
title: How to Play
description: The board, the turn loop, the Acts of Congress, and how to win.
sidebar:
  order: 2
---

Sovereign is an economic strategy game for 3 players (1 human + 2 scripted opponents). The goal is to hold the most **Influence Points** when the game ends — and the game ends on **circuit victory**, not a fixed number of rounds.

## The board

40 spaces, arranged as a square loop. Spaces fall into eight color systems plus a few special types.

| Color system | Properties | Cost range | Identity |
|---|---|---|---|
| Revolutionary Debt | 2 | 60 TN | Cheap, early; under the Funding Act |
| State Debt | 3 | 100–120 TN | Boosted by the Assumption Act |
| Revenue System | 3 | 140–160 TN | Boosted by the Tariff Schedule |
| Commercial Infrastructure | 3 | 180–200 TN | Ports and exchanges |
| National Finance | 3 | 220–240 TN | Treasury Securities, Bank Subscription, Federal Deposits |
| Internal Improvements | 3 | 260–280 TN | Turnpikes, canals, post roads |
| Manufactures | 3 | 300–320 TN | Textiles, iron, glass |
| Strategic Industry | 2 | 350–400 TN | Armory, Shipbuilding |

Plus **4 Routes** (with a 25 / 50 / 100 / 150 payment ladder), **2 Institutions** (Bank of the United States, US Mint), 4 corners, and 2 tax spaces.

## The turn

1. **Roll** 2d6.
2. **Move** that many spaces around the loop.
3. **Resolve landing** — buy / decline / pay rent / draw a card / trigger an Act / etc.
4. **Optionally act** — once per round you may use your profile's **Special Action**, play a **HAND card** in its timing window, or take the **Reform** recovery action (see below).
5. **End turn**, next player acts.

Every option is **telegraphed** before you commit: hover or tab to an action and a preview shows its exact effect (the cash it costs, the rent it earns, the track it moves). The game hides nothing.

A **round** completes when all three players have taken a turn. Movement is tracked as **circuits** — each time a player crosses Treasury Opens, they complete one more circuit of the Republic.

## How the game ends — circuit victory

The game ends when **one player completes their fourth crossing of Treasury Opens** (their fourth circuit). At that moment **Final Accounting** fires and the **highest-Influence player wins**.

**The player who triggers the ending is not necessarily the winner.** Reaching the fourth circuit first only wins by Influence in roughly a third of games — the other two-thirds, someone else holds the heavier ledger when the books close. This is intentional: Final Accounting rewards economic depth, not speed around the board. The endgame copy makes the distinction explicit.

Median play runs **~22–23 rounds (~67 turns)**. A hard cap at round 30 exists purely as a safety net for pathological games; across CANONICAL × 100 it never fires — every game ends on the fourth circuit by round 28.

## Acts of Congress

7 Acts pass in fixed historical order, one per round across **rounds 1–7**. They require a majority vote of the 3 players. From **round 8** the game enters the **Federal Era** (see below), where events — not new Acts — drive the late game.

| Round | Act | Effect |
|---|---|---|
| 1 | **Funding Act** | Revolutionary Debt rents ×1.5 permanently. Public Credit +2. |
| 2 | **Assumption Act** | State Debt rents ×2 permanently. Public Credit +2. Public Resistance +1. |
| 3 | **Bank Charter** | Bank pays 10× dice (was 4×). Mint enables 20× dice combo. |
| 4 | **Tariff Schedule** | Revenue System rents ×1.5 permanently. Public Resistance +1. |
| 5 | **Coinage Act** | Mint owner collects 50 TN from each other player. Public Credit +1. Industrial Capacity +1. |
| 6 | **Report on Manufactures** | Mfg + Strategic upgrade costs halved one round. Each Mfg/Strategic owner collects 50 TN per such property owned. Capacity +2. |
| 7 | **Excise Enforcement** | Whiskey Excise pays 2×. Public Resistance +2. |

Each Act is narrated by the **Chronicler** when it passes — and when it *fails*, narrated as a counterfactual to real history ("In our history Hamilton's Funding Act carried 32 to 29 in July of 1790; in your Republic, the soldier's discrimination found enough votes to bar the door"). Every attributed quote is sourced; nothing is invented.

Force-fee: a profile may pay 100 TN to *force* an Act vote when conditions favor it (Treasury / Finance does this for Bank Charter; Manufacturer does it for Report on Manufactures if Capacity is low; Merchant does it for Tariff if Resistance is low).

## Shared tracks

Three tracks visible at the table center, each running 0–12.

- **Public Credit** (starts 5). High Credit makes National Finance scoring kick in. Falling out of the Stable band triggers the **Credit Spiral** (see below). At Credit ≤ 2 route rents halve; hitting 0 triggers a **Default** event (cash halved, one upgrade destroyed per player).
- **Public Resistance** (starts 2). Rises with Acts that anger the public. Hits 12 → **Rebellion** (Excise owners hit hardest).
- **Industrial Capacity** (starts 1). Climbs +1 per industrial property purchased (v0.5+). At ≥ 6: Mfg/Strategic payments +25%. At ≥ 8: payments +50%, plus +2 Influence bonus per qualifying industrial system at game end. At ≥ 10: another +2 per qualifying industrial system.

## The Credit Spiral — failure that bites, and can be climbed back from

Public Credit is the Republic borrowing against its own faith, and every season of doubt raises the price of the next. The moment Credit drops out of the **Stable** band (Credit ≤ 6), the Treasury must start servicing the public debt — a **cash levy** paid from each player's own pile at the start of every round:

| Tier | Credit | What it means |
|---|---|---|
| **Stable** | 7–12 | No servicing levy. |
| **Public Doubt** | 5–6 | Servicing levy begins; warning chrome. |
| **Credit Crisis** | 3–4 | Heavier levy; Resistance +1 to all (the preserved v0.18 Crisis effect). |
| **Panic** | 1–2 | Steepest levy. |
| **Default** | 0 | One-shot: 50% cash loss + a random upgrade destroyed per player. |

The levy **compounds** the longer a slide continues, and after a telegraphed grace period a deep slide begins to **self-accelerate** toward Default. But the spiral is fair and recoverable: an **always-visible forecast gauge** warns you every round how close Default is, so a loss is always *chosen or neglected*, never an ambush. Active defence — using **Reform** or a credit-up action — pauses the descent the round after it raises Credit, so diligent stewardship climbs back to Stable rather than treading water. Across CANONICAL × 100, Public Doubt fires in ~77 games, Credit Crisis in ~29, and of the games that enter Crisis ~41% recover to a stable book. The point is civic, not punitive: it teaches *why* public credit was worth fighting for.

## Acting on your turn — Special Actions, HAND cards, Reform

Beyond rolling and buying, you have three levers:

- **Special Action** (one per round, profile-locked):
  - **Treasury — Issue Federal Bond.** Pay cash to raise Public Credit (gated to Credit ≤ 6) or place a Bond marker that pays recurring income.
  - **Merchant — Broker Route Contract.** Mark a route or commerce asset; the next auction or rent involving it pays you a broker fee.
  - **Manufacturer — Charter Workshop.** Discount or accelerate an upgrade on a Manufactures / Strategic Industry asset (may grant Capacity +1).
- **HAND cards.** Six cards (Foreign Loan Secured, Bond Auction, Treaty Renegotiation, Credit Restored, Cabinet Bargain, Federalist Victory) are *held* rather than resolved immediately, so you choose the timing window to play them. Hand cap is 2; your hand is visible as a strip.
- **Reform.** When Credit ≤ 4 or Resistance ≥ 8, spend **2 Influence** to gain Credit +1 *or* Resistance −2. The cost is real — Influence is the win condition — so Reform is a genuine trade-off, not a free brake. It is also the spiral's recovery valve.

## The Federal Era and Profile Visions

From **round 8** the game enters the **Federal Era** — the historically accurate name for the period after the founding Acts (it replaces the misleading "Late Republic" framing). Each round a **Federal Era event** fires: eight in total — five choice events (Creditors Demand Payment, Public Works Petition, Route Monopoly Inquiry, Workshop Shortage, Speculation Inquiry) and three auto-resolve events (Bondholder Demand, Local Resistance Organizes, Final Republic Reckoning). Each carries a sourced real-history caption.

Each profile also pursues a **Profile Vision** — a historically modelled endgame goal worth **+3 Influence** if achieved:

- **Federal Credit Architect** (Treasury): Public Credit ≥ 8 + Bank chartered or BUS owned + finance diversity (Rev-Debt, State-Debt, and National Finance holdings).
- **Commerce Sovereign** (Merchant): 2+ routes + 1+ Commercial Infrastructure + 5+ broker/route income.
- **Industrial Founder** (Manufacturer): Industrial Capacity ≥ 7 + 3+ Manufactures/Strategic assets + 1+ such upgrade.

A Vision-progress strip below the board shows how close each player is.

## Reading the history — the Chronicler, the Ledger, and Learn More

Sovereign teaches the real founding of US public credit as you play. The **Chronicler** is a named third-person historical narrator who surfaces an event-bound banner on key moments (each Act's pass or fail, the Federal Era opening, each Credit tier, Rebellion, Reform, a Vision, and Final Accounting). The banner is a foil-bordered persistent toast with an × to dismiss, so you have time to read it.

For depth on demand, the game adds an **informative layer** that never blocks play:

- **Learn More** popovers dock as a non-blocking side panel on terms and mechanics.
- The **Chronicler's Ledger** is a searchable encyclopedia — categorised tabs over history, quotes, sources, mechanics, and glossary — reachable from the corner book icon or the **Game ▾** menu.
- **Glossary tooltips** define economic vocabulary inline.

Every attributed quote is verified against founders.archives.gov, Wikisource, or the Library of Congress. There are **zero fabricated attributions**; when no real quote fits a moment, the Chronicler narrates in unattributed period prose.

## Scoring

When the game ends (the fourth circuit triggers Final Accounting), compute Influence Points per player:

| Source | IP |
|---|---|
| Cash held | 1 IP per 400 TN (floor) |
| Property owned | 1 IP each |
| Upgraded property | +2 IP each (any tier) |
| Complete color set | +3 IP each |
| Route owned | 1 IP each |
| Institution owned | 2 IP each |
| **NF Credit bonus** | +1 IP per qualifying NF owner if Credit ≥ 8; +2 if Credit = 12 |
| **Industrial Capacity ≥ 8** | +2 IP per qualifying industrial system held |
| **Industrial Capacity ≥ 10** | additional +2 IP per qualifying industrial system (stacks with ≥ 8) |
| **Full Manufactures set** | +3 IP (in addition to color-set bonus) |
| **Full Strategic Industry set** | +2 IP (in addition to color-set bonus) |
| **Profile Vision achieved** | +3 IP |
| "You Are Hamilton" card kept | +1 IP |
| Bankrupt round | −1 IP per round spent at cash < 0 |

Highest total wins — which, again, is not always the player who completed the fourth circuit.

## Strategy hints

- **Treasury / Finance** is the strongest profile (48% of canonical wins) — but no longer a runaway. To beat it as a human, you must either out-Treasury it (hard from slot 0 against a scripted Hamilton in slot 1) or pursue a different specialty hard enough to outscore, and chase your Profile Vision for the +3.
- **Don't ignore the Credit Spiral.** Letting Credit slide bleeds cash every round and compounds; the forecast gauge tells you exactly how long you have. A timely Reform or Issue Federal Bond is often worth more than another property.
- **Routes** are strong but capped — the v0.2 ladder means 4-route monopolies pay 150 TN per landing, not 200. With Broker Route Contract and the Commerce Sovereign Vision, the Merchant path now wins 34% of canonical games.
- **Industry** is the late bloomer. Buy Manufactures + Strategic Industry to push Capacity; reaching ≥ 8 unlocks large endgame bonuses, and Capacity ≥ 7 + an upgrade lands the Industrial Founder Vision.

## Next

- [Profiles](../profiles/) — what your two scripted opponents are actually doing.
- [Reference](../reference/) — exact rules tables, CLI flags, save / load format.
