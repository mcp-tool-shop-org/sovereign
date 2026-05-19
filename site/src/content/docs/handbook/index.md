---
title: Sovereign Handbook
description: Complete guide to Sovereign — the Hamilton-system board game and its solo / digital adaptation.
sidebar:
  order: 0
---

Sovereign is a Hamilton-system board game about the founding of US public credit, plus a solo / digital adaptation that plays the same rules locally in a browser. This handbook covers what the game is, how to play, what the three opponent profiles do, and how the design got to v0.10.

## At a glance

- **Two artifacts, one design.** A printable 34-sheet board game *and* a self-contained browser simulator — same rules.
- **Solo play with deterministic AI.** Two scripted opponents. Same seed plus same human decisions = byte-identical ledger every time.
- **Three viable economic paths.** Treasury / Finance dominates historically (59% of canonical wins at v0.10), Merchant / Infrastructure is the route economy (25%), Manufacturer / Industry is the late-game capacity build (16%).
- **No network, no account, no cloud, no LLM.** The full game lives in one HTML file.

## Pages

- [Getting started](./getting-started/) — install, first run, file map.
- [How to play](./how-to-play/) — the game loop, the board, the Acts of Congress, scoring.
- [Profiles](./profiles/) — the three scripted opponent strategies in detail.
- [Reference](./reference/) — CLI flags, rules tables, save / load format, batch simulation.
- [Design history](./design-history/) — the v0.2 → v0.10 balance arc, with evidence.
- [Security](./security/) — threat model, data handling.

## Why it exists

The thesis of Sovereign is that **public credit + federal finance** were Alexander Hamilton's dominant economic lever — but a Hamilton-system game must also let **commerce** and **industry** be viable paths to victory. The balance work (v0.2 → v0.10) was a nine-version, evidence-driven push to keep Treasury as the strongest profile (in line with history) without collapsing the design into a single-strategy game.

The full game source, balance evidence, and audit trail live in [the mcp-tool-shop-org/sovereign repository](https://github.com/mcp-tool-shop-org/sovereign).
