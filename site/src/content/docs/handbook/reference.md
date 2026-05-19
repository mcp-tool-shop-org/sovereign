---
title: Reference
description: CLI flags, save / load format, batch simulation, exact rules tables.
sidebar:
  order: 4
---

## CLI

```bash
sovereign            # Open the digital board game (default)
sovereign --print    # Open the printable 34-sheet board game
sovereign --start    # Open the audience-routed landing page
sovereign --path     # Print the playable HTML file path and exit
sovereign --quiet    # Silent on success (only errors print)
sovereign --debug    # Verbose diagnostic output, include stack traces
sovereign --version  # Print version and exit
sovereign --help     # Print help and exit
```

### Exit codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | User error (unknown flag, missing target) |
| 2 | Runtime error (browser spawn failed, file not found) |
| 3 | Partial success (reserved) |

### Error shape

CLI errors follow the structured shape `{ code, message, hint, cause?, retryable? }`. Example output:

```
ERROR [E_FILE_NOT_FOUND] Sovereign HTML file not found in package.
  hint: Reinstall with `npm install -g @mcptoolshop/sovereign`
  path: /path/to/missing/file
  retryable: false
```

## In-game header controls

The header of the digital simulator exposes these controls:

| Control | Effect |
|---|---|
| **Seed pill** | The current RNG seed. Click to enter a different number; reseeds the game. |
| **New seed** | Reseed with a fresh random value (uses the existing RNG, not Math.random). |
| **Save** | Download the current game state as JSON. Autosave also writes to `localStorage`. |
| **Load** | Import a JSON save. Hash integrity checked; pre-v0.10 saves rejected. |
| **Replay** | Open the replay overlay for the most recent completed game. |
| **Batch** | Open the batch simulation tool. |

## Save / load format

```json
{
  "version": "v0.10",
  "seed": 2026,
  "decisionLog": [
    { "playerIdx": 0, "action": "BUY_ASSET",   "params": { "spaceNum": 5 },  "turn": 3, "lap": 1 },
    { "playerIdx": 0, "action": "CAST_VOTE",   "params": { "vote": "YES" }, "turn": 4, "lap": 1 },
    ...
  ],
  "finalState": { "hash": "...", "winnerSlot": 0, "turnCount": 21 }
}
```

- `version` is gated. Older saves (v0.3 through v0.8, plus pre-versioning "phase5") are refused with a visible message.
- `decisionLog` is the input log. The full ledger is derived by replaying decisions through the reducer from `initialState(seed)`.
- `finalState.hash` is verified on load. Mismatch → "Replay integrity error".

## Batch simulation

Open the **Batch** panel and configure:

| Field | Options |
|---|---|
| Game count | 10 / 50 / 100 |
| Seed source | Auto-increment from a start seed, or paste a custom seed list |
| Profile slot 0 | Treasury / Merchant / Manufacturer |
| Profile slot 1 | Treasury / Merchant / Manufacturer |
| Profile slot 2 | Treasury / Merchant / Manufacturer |
| Starting Industrial Charter | Enabled (default) / Disabled |

Outputs:

- Per-game JSON breakdown (with full scoring decomposition).
- Per-batch HTML summary (win rates, average Influence, route dominance, debt + industry contribution, failure frequency, mirror slot edge).
- After multiple batches, a cross-config summary can compare profile matchups.

## Rules tables

### Rent — properties

`rent = base × multiplier`, where multiplier depends on ownership state:

| State | Multiplier |
|---|---|
| Base | 1× |
| Full set | 2× |
| Tier I | 5× |
| Tier II | 15× |
| Tier III | 30× |

Plus permanent Act multipliers (Funding ×1.5 on Rev Debt, Assumption ×2 on State Debt, Tariff ×1.5 on Revenue) applied after.

Plus Capacity bonus: at Capacity ≥ 6, Manufactures and Strategic Industry payments +25%. At Capacity ≥ 8, +50% instead.

### Rent — routes

```
1 route owned: 25 TN per landing
2 routes:      50 TN
3 routes:     100 TN
4 routes:     150 TN
```

If Public Credit ≤ 2, route rents are halved.

### Rent — institutions

| Bank state | Bank payout |
|---|---|
| Owned, pre-Bank Charter | 4 × dice |
| Owned, post-Bank Charter | 10 × dice |

| Mint state | Mint payout |
|---|---|
| Mint alone (no Bank) | 0 |
| Both Institutions owned | 10 × dice |
| Both + Bank Charter passed | 20 × dice |

### Endgame Influence — full breakdown

| Category | IP |
|---|---|
| Cash | 1 IP per 400 TN (floor) |
| Property owned | 1 IP each |
| Upgraded property (any tier) | 2 IP each |
| Complete color set | 3 IP each |
| Route owned | 1 IP each |
| Institution owned | 2 IP each |
| Public Credit ≥ 8 | +1 IP per qualifying National Finance owner |
| Public Credit = 12 | +2 IP per qualifying National Finance owner (replaces +1) |
| Industrial Capacity ≥ 8 | +2 IP per qualifying industrial system owner (max +4 per player) |
| Industrial Capacity ≥ 10 | additional +2 IP per qualifying industrial system (stacks with ≥ 8, max +8 per player total) |
| Full Manufactures set | +3 IP |
| Full Strategic Industry set | +2 IP |
| "You Are Hamilton" card kept | +1 IP |
| Each lap spent bankrupt | −1 IP per |

## Determinism

The game uses a single PRNG: `mulberry32(state.rngSeed)`. All dice rolls, card draws, and shuffles draw from it. There are no calls to `Math.random()`, `Date.now()` (during game logic), or any non-deterministic API.

Verification: same seed + same human decisions → byte-identical ledger across runs, browsers, and operating systems.

## Next

- [Design history](../design-history/) — how the rules above were balanced.
- [Security](../security/) — threat model.
