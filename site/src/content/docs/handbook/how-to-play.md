---
title: How to Play
description: The board, the turn loop, the Acts of Congress, and how to win.
sidebar:
  order: 2
---

Sovereign is a 7-lap economic strategy game for 3 players (1 human + 2 scripted opponents). The goal is to score the most **Influence Points** when the game ends.

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
4. **End turn**, next player acts.

When the active player's turn loops back around through the start (Treasury Opens), the **lap counter** advances. A new Act of Congress comes up for vote at the start of each lap.

## Acts of Congress

7 Acts pass in fixed historical order, one per lap. They require a majority vote of the 3 players.

| Lap | Act | Effect |
|---|---|---|
| 1 | **Funding Act** | Revolutionary Debt rents ×1.5 permanently. Public Credit +2. |
| 2 | **Assumption Act** | State Debt rents ×2 permanently. Public Credit +2. Public Resistance +1. |
| 3 | **Bank Charter** | Bank pays 10× dice (was 4×). Mint enables 20× dice combo. |
| 4 | **Tariff Schedule** | Revenue System rents ×1.5 permanently. Public Resistance +1. |
| 5 | **Coinage Act** | Mint owner collects 50 TN from each other player. Public Credit +1. Industrial Capacity +1. |
| 6 | **Report on Manufactures** | Mfg + Strategic upgrade costs halved one lap. Each Mfg/Strategic owner collects 50 TN per such property owned. Capacity +2. |
| 7 | **Excise Enforcement** | Whiskey Excise pays 2×. Public Resistance +2. |

Force-fee: a profile may pay 100 TN to *force* an Act vote when conditions favor it (Treasury / Finance does this for Bank Charter; Manufacturer does it for Report on Manufactures if Capacity is low; Merchant does it for Tariff if Resistance is low).

## Shared tracks

Three tracks visible at the table center, each running 0–12.

- **Public Credit** (starts 5). High Credit makes National Finance scoring kick in. Drops below 2 hurt routes; hitting 0 triggers a **Default** event (cash halved, one upgrade destroyed per player).
- **Public Resistance** (starts 2). Rises with Acts that anger the public. Hits 12 → **Rebellion** (Excise owners hit hardest).
- **Industrial Capacity** (starts 1). Climbs +1 per industrial property purchased (v0.5+). At ≥ 6: Mfg/Strategic payments +25%. At ≥ 8: payments +50%, plus +2 Influence bonus per qualifying industrial system at game end. At ≥ 10: another +2 per qualifying industrial system.

## Scoring

When the game ends (lap 7 wraps), compute Influence Points per player:

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
| "You Are Hamilton" card kept | +1 IP |
| Bankrupt lap | −1 IP per lap spent at cash < 0 |

Highest total wins.

## Strategy hints

- **Treasury / Finance** is the strongest profile. To beat it as a human, you must either out-Treasury it (which is hard from slot 0 against a scripted Hamilton in slot 1) or pursue a different specialty hard enough to outscore.
- **Routes** are strong but capped — the v0.2 ladder change means 4-route monopolies pay 150 TN per landing, not 200. Worth pursuing but won't autowin.
- **Industry** is the late bloomer. Buy Manufactures + Strategic Industry properties to push Industrial Capacity up. If Capacity reaches ≥ 8, the industrial Influence bonuses are large enough to threaten Treasury.

## Next

- [Profiles](../profiles/) — what your two scripted opponents are actually doing.
- [Reference](../reference/) — exact rules tables, CLI flags, save / load format.
