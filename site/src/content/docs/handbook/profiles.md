---
title: Profiles
description: The three scripted opponent strategies in detail. Pure functions of visible state.
sidebar:
  order: 3
---

Sovereign ships with three scripted opponent profiles. Each profile is a **pure function of visible state** — given the same board state, cash, tracks, and lap, a profile always produces the same decision. There is no LLM. There is no hidden state. Every decision logs the rule that fired to the ledger.

The default solo configuration is **1 human + 2 scripted opponents** — by default Hamilton (Treasury) and Morris (Merchant). All three profiles play as opponents in the batch simulation tool and in non-default configurations.

**Balance (measured live, CANONICAL × 100):** Treasury / Finance **48%** · Merchant / Infrastructure **34%** · Manufacturer / Industry **18%**. Treasury is the strongest path — in line with the historical thesis that public credit was Hamilton's dominant lever — but all three win meaningfully, and none runs away. These numbers come from the in-engine batch path, not an estimate.

> **Note on the AI.** The scripted profiles still run their proven v0.18-era decision functions. They play their economic strategy optimally, but they do not yet *race for the Vision* or *spend HAND cards strategically* the way a human will. Real human play will diverge from these numbers — usually in the human's favour once you exploit the layers the AI ignores.

## Treasury / Finance (Hamilton, slot 1)

| Aspect | Behavior |
|---|---|
| Asset priority | National Finance > State Debt > Revolutionary Debt > Bank of US > Mint |
| Upgrade priority | Highest-base owned property first; Tier I before Tier II |
| Auction cap | 0.9 × list cost on aligned (NF / debt / Bank) assets; declines off-profile |
| Vote: Funding | YES (Rev Debt strengthens own holdings) |
| Vote: Assumption | YES (State Debt strengthens own holdings) |
| Vote: Bank Charter | YES — and pays 100 TN force-fee if owns Bank and Charter hasn't passed |
| Vote: Tariff | Conditional (yes if owns Revenue System) |
| Vote: Coinage | YES (Mint windfall) |
| Vote: Manufactures | Conditional |
| Vote: Excise Enforcement | NO if owns no Revenue System assets |
| Cash reserve | ≥ 200 TN floor before discretionary buys |

**Special Action.** *Issue Federal Bond* — pay cash to raise Public Credit (gated to Credit ≤ 6) or place a Bond marker that pays recurring income.

**Vision.** *Federal Credit Architect* (+3 IP) — Public Credit ≥ 8 + Bank chartered or BUS owned + finance diversity across Rev-Debt, State-Debt, and National Finance.

**Strength.** Treasury accumulates aligned holdings early, votes the financial Acts through, and rides the National Finance Credit ≥ 8 endgame bonus. Even after the v0.3 NF Credit nerf and the v0.10 cashIP nerf, it remains the strongest profile — winning 48% of canonical games at v1.5.0.

**Weakness.** No infrastructure income — no routes, no Commerce. Vulnerable to the Bank Run card, and most exposed to the Credit Spiral if its credit-up plays don't keep pace.

## Merchant / Infrastructure (Morris, slot 2)

| Aspect | Behavior |
|---|---|
| Asset priority | Routes (all 4) > Commercial Infrastructure > Internal Improvements > Revenue System |
| Upgrade priority | Commerce Tier I → Improvements Tier I; routes have no upgrades |
| Auction cap | 1.0 × list cost on routes (pays full); 0.85 × on Commerce / Improvements |
| Vote: Funding | Neutral |
| Vote: Assumption | Neutral |
| Vote: Bank Charter | NO (Treasury benefits, not commerce) |
| Vote: Tariff | YES — and pays 100 TN force-fee if Resistance ≤ 4 |
| Vote: Coinage | NO |
| Vote: Manufactures | Conditional |
| Vote: Excise Enforcement | Neutral |
| Cash reserve | Lower (aggressive route accumulation) |

**Special Action.** *Broker Route Contract* — mark a route or commerce asset; the next auction or rent involving it pays Merchant a broker fee.

**Vision.** *Commerce Sovereign* (+3 IP) — 2+ routes + 1+ Commercial Infrastructure + 5+ broker/route income.

**Strength.** Builds the route economy fast. Tariff boost compounds Commerce income. Independent of the Acts for most of the game, and the broker fee turns opponents' movement into income. The strongest of the two non-Treasury paths — 34% of canonical games at v1.5.0.

**Weakness.** No industrial Capacity bonuses available. Vulnerable to the Shipping Disruption card.

## Manufacturer / Industry (Wright)

| Aspect | Behavior |
|---|---|
| Asset priority | Manufactures > Strategic Industry > Internal Improvements > Bank |
| Upgrade priority | Complete Mfg set → complete Strategic set → highest-base industrial Tier I |
| Auction cap | 0.95 × list cost on Mfg / Strategic; 0.70 × on Improvements; decline elsewhere |
| Vote: Manufactures | YES — and pays 100 TN force-fee if Capacity < 4 |
| Vote: Funding | YES if owns any debt |
| Vote: Assumption | YES if owns any debt |
| Vote: Tariff | NO (raises Revenue rents that aren't its income) |
| Vote: Bank Charter | Conditional (yes if owns Bank) |
| Vote: Coinage | NO |
| Vote: Excise Enforcement | NO |
| Setup | Receives **Textile Works** as a starting Industrial Charter (0 TN, Capacity +1 at setup) |

**Special Action.** *Charter Workshop* — discount or accelerate an upgrade on a Manufactures / Strategic Industry asset (may grant Capacity +1).

**Vision.** *Industrial Founder* (+3 IP) — Industrial Capacity ≥ 7 + 3+ Manufactures/Strategic assets + 1+ such upgrade.

**Strength.** Capacity ramp through industrial purchases. Industrial set bonuses at endgame stack to +11 IP if both sets complete, and Charter Workshop accelerates the upgrades that feed both the Capacity track and the Vision.

**Weakness.** Slow start; vulnerable to Shipping Disruption and Bank Run. Even with the v0.8 Industrial Charter, it is the narrowest path — 18% of canonical games at v1.5.0, because Capacity thresholds ≥ 8 and ≥ 10 remain hard to reach.

## Why deterministic profiles, not LLM

A profile that depends on a language model:

1. Can't be reproduced — different runs may decide differently for the same state.
2. Can't be inspected — there's no "rule that fired" for a black-box prediction.
3. Costs money or compute or network — none of those fit a self-contained board game.
4. Drifts as the model changes — last year's game doesn't play the same way this year.

Pure-function profiles avoid all of that. Every decision is a small `decideX(state, playerIndex, ...) → { result, reason }` function. The reason string lands in the ledger. You can read why Hamilton bought Treasury Securities on turn 14 of seed 2026 by scrolling the ledger.

## Next

- [Reference](../reference/) — full CLI + rules tables + save / load format.
- [Design history](../design-history/) — how these profiles were balanced over the v0.2 → v0.10 arc.
