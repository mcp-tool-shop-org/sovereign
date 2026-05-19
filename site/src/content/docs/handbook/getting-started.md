---
title: Getting Started
description: Install Sovereign and open the game in your browser.
sidebar:
  order: 1
---

## Three ways to play

### 1. Browser, zero install (recommended)

```bash
npx @mcptoolshop/sovereign
```

This downloads the package, opens the digital simulator in your default browser, and exits. No global install required. The CLI accepts a few flags:

```bash
npx @mcptoolshop/sovereign --print    # the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # audience-routed landing page (player / designer / auditor)
npx @mcptoolshop/sovereign --path     # print the playable HTML path and exit
npx @mcptoolshop/sovereign --help     # all flags
```

### 2. Hosted (no install at all)

Open <https://mcp-tool-shop-org.github.io/sovereign/> in any modern browser. Click **Play now**.

### 3. Offline release bundle

Each tagged release attaches `sovereign-vX.Y.Z-release.zip` to its GitHub Release page. Download it, unzip, and double-click `00-START-HERE.html`. Everything runs offline.

## What you need

- A modern browser (Chrome / Firefox / Safari / Edge — anything from the last 3 years).
- For `npx`: Node 18 or newer.
- Nothing else. No account, no key, no network connection during gameplay.

## First game

The default game seats you (slot 0) against:

- **Hamilton** (Treasury / Finance) — slot 1.
- **Morris** (Merchant / Infrastructure) — slot 2.

7 laps, 21 turns total. The header shows `seed: 2026` — that's the default deterministic seed.

Click **Roll dice**, **Buy / Decline / Bid / Vote** as the surfaces present them. Every decision lands in the Ledger (bottom panel) with a human-readable reason.

When the game ends, the Endgame Report appears automatically with your Influence breakdown vs. the opponents'. The post-game Balance Report sits below it.

## File map

After `npm install @mcptoolshop/sovereign` (or unzipping the release):

```
release/
├── 00-START-HERE.html              ← hyperlinked entry point
├── README.txt                       ← plain-text version
├── CHANGELOG.md                     ← v0.2 → v0.10 evolution
├── board-game/
│   ├── sovereign-prototype.html    ← printable 34-sheet board game
│   ├── sovereign-economy-audit.html
│   └── sovereign-print-audit.html
├── digital-mode/
│   ├── sovereign-solo.html         ← the playable digital game
│   └── sovereign-v0.10-freeze-audit.html
├── balance-evidence/               ← all v0.10 batch reports + raw JSON
└── design-history/                 ← Phase 1 concept + Phase 2–5 audits
```

## Next

- [How to play](../how-to-play/) — the actual game loop, board, Acts, and scoring.
- [Profiles](../profiles/) — what your scripted opponents do, and why.
