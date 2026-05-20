---
title: Sovereign Handbook
description: Complete guide to Sovereign — the Hamilton-system board game and its solo / digital adaptation.
sidebar:
  order: 0
---

Sovereign is a Hamilton-system board game about the founding of US public credit, plus a solo / digital adaptation that plays the same rules locally in a browser. This handbook covers what the game is, how to play, what the three opponent profiles do, how the failure system works, and how the design got to v0.18.

## At a glance

- **Two artifacts, one design.** A printable 34-sheet board game *and* a self-contained browser simulator — same rules.
- **Solo play with deterministic AI.** Two scripted opponents. Same seed plus same human decisions = byte-identical ledger every time.
- **Three viable economic paths.** Treasury / Finance dominates historically (60.0% of canonical wins at the v1.1.0 baseline), Merchant / Infrastructure is the route economy (23.5%), Manufacturer / Industry is the late-game capacity build (16.5%).
- **Three-tier failure system.** Credit Crisis (Public Credit ≤ 4, warning), Rebellion (Public Resistance 12, catastrophe), Default (Public Credit 0, catastrophe). New in v1.1.0.
- **No network, no account, no cloud, no LLM.** The full game lives in one HTML file.

## Pages

- [Getting started](./getting-started/) — install, first run, file map.
- [How to play](./how-to-play/) — the game loop, the board, the Acts of Congress, scoring.
- [Failure system](./failure-system/) — Credit Crisis, Rebellion, and Default. The three-tier hierarchy introduced in v1.1.0.
- [Profiles](./profiles/) — the three scripted opponent strategies in detail.
- [Reference](./reference/) — CLI flags, rules tables, save / load format, batch simulation.
- [Design history](./design-history/) — the v0.2 → v0.18 design arc, with evidence.
- [Security](./security/) — threat model, data handling.

## Why it exists

The thesis of Sovereign is that **public credit + federal finance** were Alexander Hamilton's dominant economic lever — but a Hamilton-system game must also let **commerce** and **industry** be viable paths to victory. The balance work (v0.2 → v0.10) was a nine-version, evidence-driven push to keep Treasury as the strongest profile (in line with history) without collapsing the design into a single-strategy game. The v0.11 → v0.18 arc then built a visible three-tier failure system on top of that frozen balance, without disturbing it.

The full game source, balance evidence, and audit trail live in [the mcp-tool-shop-org/sovereign repository](https://github.com/mcp-tool-shop-org/sovereign).
