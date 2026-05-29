# Scorecard

> Actual shipcheck gate results for Sovereign, transcribed from the completed
> `SHIP_GATE.md` (hard gates A–D worked 2026-05-19) and verified against the
> v1.4.0 source. Hard gates A–D pass; E is the soft identity gate.

**Repo:** sovereign (`@mcptoolshop/sovereign`)
**Date:** 2026-05-28
**Version:** v1.4.0 (beta)
**Type tags:** `[npm]` `[cli]`

## Assessment

| Category | Score | Notes |
|----------|-------|-------|
| A. Security | 9/10 | `SECURITY.md` present (report email, supported versions, 48h/7d/30d response timeline, full threat model). README carries the threat-model paragraph (data touched / NOT touched / permissions). No secrets, tokens, or credentials in source. No telemetry — stated explicitly; the "telemetry" feature is local-only ledger analysis that never leaves the browser. Attack surface is minimal by design: the CLI only spawns the OS default browser on a local HTML file. |
| B. Error Handling | 9/10 | CLI uses the Structured Error Shape (`code` / `message` / `hint` / `cause?` / `retryable?`) via the `fail()` helper in `bin/sovereign.js`. Exit codes: 0 ok · 1 user error · 2 runtime · 3 partial. No raw stack traces without `--debug`. Logging levels defined (`--quiet` / normal / `--debug`); no secrets handled in any path. |
| C. Operator Docs | 9/10 | README current at v1.4.0 (what it does, install, usage, platforms, runtime). `CHANGELOG.md` in Keep a Changelog format, root == `release/` byte-identical. `LICENSE` present (MIT). `--help` accurate for all flags. Minor residual: README's "Profile lineup (v0.10)" heading uses the mechanics-baseline label, which can read as a version contradiction (tracked separately). |
| D. Shipping Hygiene | 7/10 | `verify.sh` + `npm run verify` (smoke + pack-dry-run + CLI flag check). Version-matches-tag enforced by the `release.yml` tag-vs-package guard before publish. OIDC trusted publishing + Sigstore provenance correctly wired. `engines.node >=18`; lockfile committed; Dependabot weekly. **Honest partials:** the `npm pack` shape recorded in SHIP_GATE.md is stale (claims 36 files / 282 KB; actual today 44 files / ~400 KB after the 8 translated READMEs landed); `ci.yml` violates the org GitHub Actions rules (no `paths` filter, no `workflow_dispatch`, no concurrency group, 9-job 3-OS matrix incl. macOS/Windows on every push); engine test coverage is thin (smoke-level only) — this dogfood swarm is addressing these. |
| E. Identity (soft) | 8/10 | Logo in README header (brand repo). Translations present — 8-language nav bar (ja/zh/es/fr/hi/it/pt-BR + en). Landing page live at `mcp-tool-shop-org.github.io/sovereign/`. GitHub repo metadata (description / homepage / topics): partial. |
| **Overall** | **42/50** | Hard gates A–D pass; product is shippable. D carries real, tracked partials (CI rules, stale pack numbers, thin engine tests) rather than aspirational full marks. |

## Key Gaps

1. **`ci.yml` violates the org GitHub Actions hard rules** — no `on.push.paths` filter, no `workflow_dispatch` fallback, no concurrency group, and a 9-job (3 OS × 3 Node, incl. macOS + Windows) matrix that fires on every push including docs-only commits. (D — finding A5-01/A5-02.)
2. **Engine test coverage is thin** — current tests are smoke-level (CLI flags + pack dry-run); the deterministic reducer/scoring math is not yet covered by a regression suite. This dogfood swarm is adding coverage. (D.)
3. **SHIP_GATE.md `npm pack` shape is stale** — records 36 files / 282 KB / 5.5 MB; actual is 44 files / ~400 KB after the 8 translated READMEs landed. The included-files claim (LICENSE + README.md + CHANGELOG.md + SECURITY.md) is still correct. (D — finding A5-08.)
4. **GitHub repo metadata incomplete** — description / homepage / topics not fully set. (E — soft gate, does not block ship.)

## Remediation Priority

| Priority | Item | Estimated effort |
|----------|------|-----------------|
| 1 | Right-size `ci.yml`: add `paths` filter + `workflow_dispatch` + concurrency block; reduce matrix to ubuntu-latest × 2 Node versions (≤6 jobs). | S |
| 2 | Add a deterministic engine regression suite (reducer + scoring + circuit-end + save/load roundtrip). | M |
| 3 | Refresh the SHIP_GATE.md pack-shape line to the current 44 files / ~400 KB (or generalize to avoid a drifting hard number). | XS |
| 4 | Fill in GitHub repo metadata (description, homepage, topics). | XS |

## Notes

- Gates A–D are the **hard** gates and all pass; E is the **soft** identity gate and does not block ship.
- Scores reflect actual state at v1.4.0, not aspiration. Where SHIP_GATE.md is checked but reality has since drifted (CI rules, pack shape, test depth), the lower score and the gap are recorded honestly.
- `SHIP_GATE.md` remains the canonical per-item record; this scorecard is the at-a-glance roll-up the shipcheck product standard requires.
