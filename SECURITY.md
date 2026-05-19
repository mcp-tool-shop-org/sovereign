# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability

Email: **64996768+mcp-tool-shop@users.noreply.github.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Version affected
- Potential impact

### Response timeline

| Action             | Target   |
|--------------------|----------|
| Acknowledge report | 48 hours |
| Assess severity    | 7 days   |
| Release fix        | 30 days  |

## Threat model

Sovereign is a self-contained browser-based board game. The CLI opens a local HTML file in the user's default browser. There is no server, no network call, no account, no cloud sync.

**Data touched:**
- The included HTML files in `release/` (read-only, served from package).
- `localStorage` under the `sovereign.autosave` key (game save state only — game ledger and decision log).

**Data NOT touched:**
- No filesystem access outside the package directory.
- No network requests of any kind.
- No telemetry, analytics, or remote logging.
- No credentials, tokens, or secrets handling — the package does not read, store, or transmit credentials.

**Permissions required:**
- Ability to spawn the OS default browser (`open` / `start` / `xdg-open`).
- Ability to read the package's own files.
- Browser `localStorage` access for save / load (optional — the game runs without it).

**Threats outside scope:**
- Compromise of the user's local browser, OS, or shell.
- Attacks on the GitHub-hosted source repository (covered by GitHub's own controls).
- npm registry compromise affecting package supply chain — mitigated by Sigstore provenance attestation on every published version (see `publishConfig.provenance: true` in `package.json`).

## Default safety posture

- The CLI takes no destructive actions. It opens an HTML file in a browser. That is the entire operation.
- No file write outside `localStorage` (which is browser-scoped, not filesystem-scoped).
- No background process — the CLI spawns the browser and exits.
- No flags exist for destructive operations. There are no `--allow-*` flags because there is nothing dangerous to allow.

## Telemetry

**None.** Sovereign collects no usage data, sends no events, and contacts no server. The simulator's "telemetry" feature (Phase 6) refers to local game-analysis reports derived from the in-browser ledger — these never leave the browser and never leave the user's machine.
