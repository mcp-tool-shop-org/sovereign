# Sovereign — Design System (v0.18 polished baseline)

> Design-system reference and visual state audit for the Sovereign Solo / Digital Mode build that ships in `release/digital-mode/sovereign-solo.html` at v1.1.0.

## Files

| File | Purpose |
|---|---|
| `sovereign-visual-system-v0.18.html` | Standalone design-system sheet. Eleven sections covering palette, typography, panels, controls, board tiles, tokens + tier markers, track states, card chrome, Acts states, the three failure tiers, and endgame components. |
| `sovereign-screen-audit-v0.18.html` | Fifteen-frame visual state audit showing rendered examples of every major game state — first load, normal turn, asset landing, card draw, auction, Act vote, Credit Crisis, Default (composed mock), Rebellion (composed mock), endgame, replay, batch modal, small viewport, print preview. |
| `README.md` | This file. |

## Why these exist

The v1.1.0 release promotes the v0.18 polished failure-pressure build to canonical. That promotion changed every player-facing surface (board, panels, ledger, endgame, modals, replay) without changing any mechanic. These two HTML files are the durable record of what the game looks like at v1.1.0, so future polish passes or design reviews can audit against a known baseline.

Open either file in any modern browser — no install, no network, no external assets.

## What was preserved (and where to verify)

- All v0.18 mechanics (Credit Crisis at Credit ≤ 4, Default at Credit 0, Rebellion at Resistance 12, v0.17 Speculation Fever conditional, v0.16 Anti-Federalist Pamphlet credit pressure, v0.11 Bank Run, no recovery gates).
- `SAVE_VERSION` stays at `'v0.18-candidate'` (no mechanic changed during the polish pass).
- Internal token strings (event identifiers, reason strings, profile keys, track keys, DOM IDs).
- 100-seed canonical hash (`3189375454`) matches the v0.18 Node sim byte-for-byte.

The full mechanics-preservation table and behavior-check evidence is captured in the v0.18 promotion audit at `experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-promotion-audit.html` (44 / 44 PASS).

## Provenance

The polished bundle was produced via Claude Design from the v0.18 candidate HTML, then promoted to the canonical release surface as part of v1.1.0 prep Stage A. The v0.10 baseline that previously occupied `release/digital-mode/sovereign-solo.html` is archived alongside the new canonical at `release/digital-mode/sovereign-solo-v0.10-baseline.html` for historical reference.
