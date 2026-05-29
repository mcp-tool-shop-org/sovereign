# Scorecard

> Actual shipcheck gate results for Sovereign, transcribed from the completed
> `SHIP_GATE.md` (hard gates A–D worked 2026-05-19) and re-verified against the
> v1.5.0 source after the dogfood swarm. Hard gates A–D pass; E is the soft
> identity gate. Grades reflect actual state — where the swarm closed a gap, the
> grade moves up; where reality still lags, the gap is recorded honestly.

**Repo:** sovereign (`@mcptoolshop/sovereign`)
**Date:** 2026-05-29
**Version:** v1.5.0 (beta)
**Type tags:** `[npm]` `[cli]`

## Assessment

| Category | Score | Notes |
|----------|-------|-------|
| A. Security | 9/10 | `SECURITY.md` present (report email, supported versions, 48h/7d/30d response timeline, full threat model). README carries the threat-model paragraph (data touched / NOT touched / permissions). No secrets, tokens, or credentials in source. No telemetry — stated explicitly; the "telemetry" feature is local-only ledger analysis that never leaves the browser. ZzFX audio is procedural (no asset fetch); the new juice layer adds no network surface. Attack surface stays minimal by design: the CLI only spawns the OS default browser on a local HTML file. |
| B. Error Handling | 9/10 | CLI uses the Structured Error Shape (`code` / `message` / `hint` / `cause?` / `retryable?`) via the `fail()` helper in `bin/sovereign.js`. Exit codes: 0 ok · 1 user error · 2 runtime · 3 partial. No raw stack traces without `--debug`. Logging levels defined (`--quiet` / normal / `--debug`). In-engine, the v1.5.0 swarm fixed two live hard-hangs (card-triggered auction; insufficient-cash buy) that are now covered by playability GATE 2/3. |
| C. Operator Docs | 9/10 | README current at v1.5.0 (what it does, install, usage, platforms, runtime, the five new layers). Balance + game-length figures are now **measured against the live engine** (`test/measure-stats.mjs`, CANONICAL × 100) rather than copied forward, and the "Known caveats" section is rewritten to match reality (felt+recoverable failure pressure; corrected opponent-behavior note). `CHANGELOG.md` in Keep a Changelog format with a grouped v1.5.0 entry; root == `release/` byte-identical. `LICENSE` present (MIT). `--help` accurate for all flags. The "Profile lineup (v0.10 balance baseline)" heading is relabeled to remove the earlier version-contradiction read. |
| D. Shipping Hygiene | 9/10 | `verify.sh` + `npm run verify` (smoke + pack-dry-run + CLI flag check). Version-matches-tag enforced by the `release.yml` tag-vs-package guard before publish. OIDC trusted publishing + Sigstore provenance correctly wired. `engines.node >=18`; lockfile committed. **Now resolved by the swarm:** (1) `ci.yml` is **org-compliant** — `on.push.paths` filter, `workflow_dispatch` fallback, concurrency group with `cancel-in-progress`, and a right-sized single-OS (ubuntu-latest) × Node 18/20 matrix (≤6 jobs), replacing the prior 9-job 3-OS matrix; (2) **engine test coverage is no longer smoke-only** — a determinism suite (14 checks incl. byte-identical reruns + a pinned mulberry32 sequence + lawful-scored-game assertions) and a 5-gate live-DOM playability harness (post-roll dead-ends, hang/terminal bounds, card-triggered auction drive, designer-gate, save/load/replay roundtrip) run under `npm test`; (3) the npm pack shape is now accurate and trimmed — **20 files / ~292 kB packed / ~1.1 MB unpacked** (down ~5 MB; the stale "36/44 files" SHIP_GATE figure is superseded). Residual: coverage instrumentation still targets `bin/**` (the CLI), not the in-HTML engine, which is exercised by behavioral harnesses rather than line coverage. |
| E. Identity (soft) | 8/10 | Logo in README header (brand repo). Translations present — 7-language nav bar + English source (ja/zh/es/fr/hi/it/pt-BR); these regenerate at release time and will be refreshed against the v1.5.0 README before the public tag. Landing page live at `mcp-tool-shop-org.github.io/sovereign/`. GitHub repo metadata (description / homepage / topics): partial. |
| **Overall** | **44/50** | Hard gates A–D pass; product is shippable as a beta. D rises from 7→9 after the swarm made CI org-compliant, added real behavioral test coverage (determinism + playability), and corrected the pack shape. Remaining work is soft-gate polish (E metadata) and the beta's fresh-human end-to-end walkthrough. |

## Key Gaps

1. **GitHub repo metadata incomplete** — description / homepage / topics not fully set. (E — soft gate, does not block ship.)
2. **Translations are pre-v1.5.0** — the 7 `README.*.md` files reflect the v1.4.0 source and regenerate at release time on local TranslateGemma; they must be refreshed against the rewritten v1.5.0 README **before** the public tag/publish (per the release-ordering rule), so the GitHub release tag carries in-sync translations. (E.)
3. **Beta playability gate outstanding** — v1.5.0 has been re-validated against the live engine (determinism + playability harnesses + `measure-stats.mjs`) and cold-walked at slice level, but the fresh-human end-to-end walkthrough that promotes it off beta is still pending. (Process gate, not a code gap.)
4. **Engine line-coverage** — `npm run coverage` instruments `bin/**` only; the in-HTML reducer/scoring is covered behaviorally (determinism + playability harnesses) rather than by line coverage. Acceptable for a single-file HTML engine, noted for completeness. (D.)

## Remediation Priority

| Priority | Item | Estimated effort |
|----------|------|-----------------|
| 1 | Fresh-human end-to-end walkthrough → promote v1.5.0 off beta. | M (human) |
| 2 | Refresh `README.*.md` translations against the v1.5.0 README, before the public tag. | S (local TranslateGemma) |
| 3 | Fill in GitHub repo metadata (description, homepage, topics). | XS |

## Notes

- Gates A–D are the **hard** gates and all pass; E is the **soft** identity gate and does not block ship.
- Scores reflect actual state at v1.5.0 after the dogfood swarm, not aspiration. The D rise (7→9) is earned: CI is now org-compliant, behavioral test coverage exists, and the pack shape is accurate. Where reality still lags (E metadata, the outstanding beta walkthrough), the gap is recorded honestly.
- Balance and game-length figures throughout the README/CHANGELOG are sourced from `test/measure-stats.mjs` against the live shipping engine over CANONICAL × 100, not estimated.
- `SHIP_GATE.md` remains the canonical per-item record; this scorecard is the at-a-glance roll-up the shipcheck product standard requires.
