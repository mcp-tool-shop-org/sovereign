---
title: Profiles
description: The three scripted opponent strategies in detail. Pure functions of visible state.
sidebar:
  order: 4
---

Sovereign ships with three scripted opponent profiles. Each profile is a **pure function of visible state** — given the same board state, cash, tracks, and lap, a profile always produces the same decision. There is no LLM. There is no hidden state. Every decision logs the rule that fired to the ledger.

The MVP solo configuration is **1 human + 2 scripted opponents** (Hamilton + Morris). The third profile (Wright, the Manufacturer / Industry profile) is available in the batch simulation tool and serves as the third opponent in mirror or non-default configurations.

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

**Strength.** Treasury accumulates aligned holdings early, votes the financial Acts through, and rides the National Finance Credit ≥ 8 endgame bonus. Even after the v0.3 NF Credit nerf and v0.10 cashIP nerf, it wins 59% of canonical games.

**Weakness.** No infrastructure income — no routes, no Commerce. Vulnerable to the Bank Run card.

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

**Strength.** Builds the route economy fast. Tariff boost compounds Commerce income. Independent of Acts of Congress for most of the game.

**Weakness.** No industrial Capacity bonuses available. Vulnerable to Shipping Disruption card.

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

**Strength.** Capacity ramp through industrial purchases. Industrial set bonuses at endgame stack to +11 IP if both sets complete.

**Weakness.** Slow start; vulnerable to Shipping Disruption and Bank Run. Even with the v0.8 Industrial Charter, only wins 16% of canonical games — Capacity thresholds ≥ 8 and ≥ 10 remain hard to reach.

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
