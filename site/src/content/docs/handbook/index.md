---
title: Sovereign Handbook
description: Complete guide to Sovereign — the Hamilton-system board game and its solo / digital adaptation.
sidebar:
  order: 0
---

Sovereign is a Hamilton-system board game about the founding of US public credit, plus a solo / digital adaptation that plays the same rules locally in a browser. This handbook covers what the game is, how to play, what the three opponent profiles do, and how the design got to its current v1.5.0 beta.

## At a glance

- **Two artifacts, one design.** A printable 34-sheet board game (stable at v0.2) *and* a self-contained browser game (v1.5.0 beta) — same underlying rules.
- **Solo play with deterministic AI.** Two scripted opponents. Same seed plus same human decisions = byte-identical ledger every time.
- **Circuit victory.** The game ends when one player carries their faction four times around the Republic. At Final Accounting the **highest-Influence** player wins — *not necessarily the one who finished the circuit first*. Median game ~22–23 rounds.
- **Three viable economic paths.** Measured live across CANONICAL × 100: Treasury / Finance is strongest at **48%**, Merchant / Infrastructure is the route economy at **34%**, Manufacturer / Industry is the capacity build at **18%**. All three win meaningfully.
- **Strategy you act on, history you can read.** Profile-locked Special Actions, timed HAND cards, the Reform recovery action, a compounding-then-recoverable Credit Spiral, Federal Era events, Profile Visions, and a named historical Chronicler whose searchable Ledger sources every quote to founders.archives.gov, Wikisource, and the Library of Congress.
- **No network, no account, no cloud, no LLM.** The full game lives in one HTML file.

## Pages

- [Getting started](./getting-started/) — install, first run, the Swift-Start opening, file map.
- [How to play](./how-to-play/) — the game loop, the board, the Acts, circuit victory, the Credit Spiral, and the new strategy layers.
- [Profiles](./profiles/) — the three scripted opponent strategies, their Special Actions and Visions, and the balance.
- [Reference](./reference/) — CLI flags, rules tables, save / load format, batch simulation, the SPEED setting.
- [Design history](./design-history/) — the v0.2 → v0.10 balance arc and the v1.1 → v1.5 feature arc, with evidence.
- [Security](./security/) — threat model, data handling.

## Why it exists

The thesis of Sovereign is that **public credit + federal finance** were Alexander Hamilton's dominant economic lever — but a Hamilton-system game must also let **commerce** and **industry** be viable paths to victory. The balance work (v0.2 → v0.10) was a nine-version, evidence-driven push to keep Treasury as the strongest profile (in line with history) without collapsing the design into a single-strategy game. The feature arc since (v1.1 → v1.5) kept that band intact while making the game deeper to play, more honest about failure, and richer in the real history it teaches.

The full game source, balance evidence, and audit trail live in [the mcp-tool-shop-org/sovereign repository](https://github.com/mcp-tool-shop-org/sovereign).
