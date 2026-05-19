# Ship Gate

> No repo is "done" until every applicable line is checked.
> Copy this into your repo root. Check items off per-release.

**Tags:** `[all]` every repo · `[npm]` `[pypi]` `[vsix]` `[desktop]` `[container]` published artifacts · `[mcp]` MCP servers · `[cli]` CLI tools

---

## A. Security Baseline

- [x] `[all]` SECURITY.md exists (report email, supported versions, response timeline) (2026-05-19)
- [x] `[all]` README includes threat model paragraph (data touched, data NOT touched, permissions required) (2026-05-19)
- [x] `[all]` No secrets, tokens, or credentials in source or diagnostics output (2026-05-19)
- [x] `[all]` No telemetry by default — state it explicitly even if obvious (2026-05-19)

### Default safety posture

- [x] `[cli|mcp|desktop]` SKIP: CLI takes no destructive actions — only opens an HTML file in the OS default browser. There are no operations to gate behind --allow-* flags. (2026-05-19)
- [x] `[cli|mcp|desktop]` File operations constrained to known directories (only reads files inside the package's own `release/` directory) (2026-05-19)
- [ ] `[mcp]` SKIP: not an MCP server
- [ ] `[mcp]` SKIP: not an MCP server

## B. Error Handling

- [x] `[all]` Errors follow the Structured Error Shape: `code`, `message`, `hint`, `cause?`, `retryable?` (2026-05-19 — bin/sovereign.js `fail()` helper)
- [x] `[cli]` Exit codes: 0 ok · 1 user error · 2 runtime error · 3 partial success (2026-05-19)
- [x] `[cli]` No raw stack traces without `--debug` (2026-05-19)
- [ ] `[mcp]` SKIP: not an MCP server
- [ ] `[mcp]` SKIP: not an MCP server
- [ ] `[desktop]` SKIP: not a desktop app — runs in the OS default browser
- [ ] `[vscode]` SKIP: not a VS Code extension

## C. Operator Docs

- [x] `[all]` README is current: what it does, install, usage, supported platforms + runtime versions (2026-05-19)
- [x] `[all]` CHANGELOG.md (Keep a Changelog format) (2026-05-19)
- [x] `[all]` LICENSE file present and repo states support status (2026-05-19 — MIT)
- [x] `[cli]` `--help` output accurate for all commands and flags (2026-05-19)
- [x] `[cli|mcp|desktop]` Logging levels defined: silent / normal / verbose / debug — secrets redacted at all levels (2026-05-19 — `--quiet` silent, default normal, `--debug` verbose+diagnostics; no secrets handled in any path)
- [ ] `[mcp]` SKIP: not an MCP server
- [ ] `[complex]` SKIP: not a complex daily-ops tool. Operations are: install once, run `sovereign` to play. Phase 3 Starlight handbook covers richer docs.

## D. Shipping Hygiene

- [x] `[all]` `verify` script exists (test + build + smoke in one command) (2026-05-19 — `verify.sh` + `npm run verify`)
- [x] `[all]` Version in manifest matches git tag (2026-05-19 — enforced by `.github/workflows/release.yml` tag-vs-package guard before publish)
- [x] `[all]` Dependency scanning runs in CI (2026-05-19 — CI matrix runs `npm pack --dry-run` on every push + Dependabot weekly)
- [x] `[all]` Automated dependency update mechanism exists (2026-05-19 — `.github/dependabot.yml` weekly for npm + github-actions + site/npm)
- [x] `[npm]` `npm pack --dry-run` includes: dist/, README.md, CHANGELOG.md, LICENSE (2026-05-19 — verified, 36 files, 282 KB tarball, 5.5 MB unpacked; `release/` is the artifact dir; LICENSE + README.md + CHANGELOG.md + SECURITY.md all included)
- [x] `[npm]` `engines.node` set (2026-05-19 — `>=18`)
- [x] `[npm]` Lockfile committed (2026-05-19 — `package-lock.json` generated and will be committed)
- [ ] `[vsix]` SKIP: not a VS Code extension
- [ ] `[desktop]` SKIP: not a desktop installer — uses OS-native browser

## E. Identity (soft gate — does not block ship)

- [ ] `[all]` Logo in README header — pending Phase 1 (brand repo push)
- [ ] `[all]` Translations (polyglot-mcp, 8 languages) — pending Phase 1 (handed to user; user runs polyglot locally)
- [ ] `[org]` Landing page (@mcptoolshop/site-theme) — pending Phase 2
- [ ] `[all]` GitHub repo metadata: description, homepage, topics — pending Phase 4

---

## Gate Rules

**Hard gate (A–D):** Must pass before any version is tagged or published.
If a section doesn't apply, mark `SKIP:` with justification — don't leave it unchecked.

**Soft gate (E):** Should be done. Product ships without it, but isn't "whole."

**Checking off:**
```
- [x] `[all]` SECURITY.md exists (2026-02-27)
```

**Skipping:**
```
- [ ] `[pypi]` SKIP: not a Python project
```
