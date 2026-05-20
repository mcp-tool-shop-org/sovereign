---
title: Security
description: Threat model, data handling, vulnerability reporting.
sidebar:
  order: 7
---

Sovereign is a self-contained browser-based board game. The CLI opens a local HTML file in the user's default browser. There is **no server, no network call, no account, no cloud sync**.

## What touches your machine

| Surface | Behavior |
|---|---|
| Filesystem read | Reads only HTML / JSON files inside the installed package's own `release/` directory. |
| Filesystem write | None. |
| `localStorage` | Reads / writes one key: `sovereign.autosave`. This is browser-scoped, not filesystem-scoped. |
| Network | None. No `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, or external `postMessage`. |
| Subprocess | The CLI spawns one OS-default-browser process (`open` / `start` / `xdg-open`) and exits. |

## What does NOT touch your machine

- No telemetry, analytics, or remote logging — ever.
- No credentials, tokens, or secrets handling. The package does not read, store, or transmit credentials.
- No access to your shell history, environment variables, or other applications' data.
- No background processes — the CLI launches the browser and exits.

## Why the simulator has a "telemetry" feature anyway

The simulator's local balance-telemetry panel (Phase 6) refers to **local game-analysis reports derived from the in-browser ledger**. These never leave your browser. The HTML / JSON reports the batch tool generates are downloads to your local Downloads folder. There is no upload path anywhere in the codebase. Search for `fetch\(`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `postMessage` in the source — zero hits inside the game logic.

## Default safety posture

- The CLI takes no destructive actions. Opening an HTML file in a browser is the entire operation.
- No file write outside `localStorage`.
- No background process — CLI spawns browser and exits.
- No `--allow-*` flags exist because there is nothing dangerous to allow.

## Supported versions

| Version | Supported |
|---|---|
| 1.x | Yes |
| < 1.0 | No |

## Reporting a vulnerability

Email: **64996768+mcp-tool-shop@users.noreply.github.com**

Include:

- Description of the vulnerability.
- Steps to reproduce.
- Version affected.
- Potential impact.

### Response timeline

| Action | Target |
|---|---|
| Acknowledge report | 48 hours |
| Assess severity | 7 days |
| Release fix | 30 days |

## Supply chain

Sovereign publishes to npm with **Sigstore provenance attestation** (`publishConfig.provenance: true`). This means every published version on npm has a verifiable claim of which GitHub Actions workflow built it and from which commit. If you install `@mcptoolshop/sovereign@1.0.0`, you can verify via:

```bash
npm audit signatures @mcptoolshop/sovereign
```

Source-of-truth is the `main` branch of [`mcp-tool-shop-org/sovereign`](https://github.com/mcp-tool-shop-org/sovereign). Releases are tagged `v1.0.0`, `v1.0.1`, etc.

## Out of scope

- Compromise of the user's local browser, OS, or shell — Sovereign cannot defend against those.
- Attacks on the GitHub-hosted source repository — covered by GitHub's controls.
- Phishing or social-engineering attacks unrelated to the package itself.

## Next

- Back to the [handbook home](../).
- [How to play](../how-to-play/).
- [Reference](../reference/).
