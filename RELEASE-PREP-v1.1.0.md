# Sovereign — v1.1.0 Release-Prep Memo

> **Status:** v1.1.0 release candidate. Stage A (promote + document + verify) complete in this commit. The release train (translations, shipcheck, version bump in `package.json`, tag, npm publish, GitHub Release, Pages verification) is **NOT** done yet and waits on explicit authorization as a separate kickoff.

**Date:** 2026-05-20
**Prior canonical:** v1.0.2 (board game = v0.2 printable, digital = v0.10 baseline)
**This release candidate:** v1.1.0 (digital = v0.18 polished foundation; board game still v0.2)

---

## What this release is

v1.1.0 promotes the v0.18 failure-pressure foundation and the whole-game visual polish pass to the canonical Sovereign Solo / Digital Mode release surface. The board game printable edition stays at v0.2 per its existing freeze; nothing in the printable rules changes.

The digital artifact at `release/digital-mode/sovereign-solo.html` is now the v0.18 polished build. The prior v0.10 canonical is archived alongside it as `sovereign-solo-v0.10-baseline.html`.

The in-HTML `SAVE_VERSION` stays `'v0.18-candidate'` because no mechanic changed across the polish pass — the polished HTML is byte-identical to the v0.18 candidate in game state. The npm package version bump from `1.0.2` → `1.1.0` will happen during the release train, not in this prep stage.

---

## The v0.11 → v0.18 failure-pressure arc

| Version | Change | Verdict |
|---|---|---|
| v0.10 | baseline (frozen 2026-05-19, shipped in v1.0.x) | shipped |
| v0.11 | Bank Run: capacity-1 → credit-1 + capacity-1 | diagnostic success |
| v0.12 | Bank Run: -2 credit when Bank Charter passed | inert (Charter rarely passes) |
| v0.13 | Speculation Fever: add credit-1 | first useful candidate (Credit reaches 5 in 3/400) |
| v0.14 | Credit Restored gated on Credit ≥ 6 | mechanically correct, aggregate-inert |
| v0.15 | Gold and Silver Inflow gated, layered on v0.14 | mechanically correct, aggregate-inert |
| v0.16 | Anti-Federalist Pamphlet: add credit-1 (branched from v0.13, NOT v0.14/v0.15) | strengthened pressure (Credit reaches 5 in 6/400) |
| v0.17 | Speculation Fever fragile-credit escalation (-2 at Credit ≤ 6) | floor breached (2/400 below 5) |
| v0.18 | Credit Crisis intermediate failure event at Credit ≤ 4 | **shipped as v1.1.0 foundation** |

The v0.14 and v0.15 recovery gates were rejected because gating recovery at a floor few games reach is a no-op in aggregate. The v0.16 → v0.18 chain pivoted to pressure-side changes (more games reach the floor) rather than recovery-side gates.

---

## Three-tier failure hierarchy

| Tier | Trigger | Severity | Effect | Reset |
|---|---|---|---|---|
| Credit Crisis | Public Credit ≤ 4 (first time per game) | warning | Resistance +1, System log | none |
| Rebellion | Public Resistance 12 | catastrophe | Revenue upgrades destroyed; Whiskey owner → Crisis | resistance → 6 |
| Default | Public Credit 0 | catastrophe | 50 % cash + 1 random upgrade per player | credit → 3 |

Default and Rebellion are unchanged from v0.10. Credit Crisis is new in v1.1.0.

---

## Evidence locations

| Artifact | Location |
|---|---|
| v0.18 candidate HTML | `experiments/v0.18-failure-pressure-candidate/sovereign-solo-v0.18-candidate.html` |
| v0.18 polished bundle (game + visual system + screen audit + README) | `experiments/v0.18-polished-bundle/Sovereign-v0.18-Polished-Bundle/` |
| v0.18 promotion audit (44 / 44 PASS) | `experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-promotion-audit.html` |
| v0.18 CANONICAL-400 evidence sweep | `experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-evidence-sweep.html` |
| v0.18 raw batch JSONs | `experiments/v0.18-failure-pressure-candidate/raw-data/` |
| Node sim (extracted from HTML, byte-identical) | `tools/diagnosis/sim-v0.18.mjs` |
| Per-version Node sims (v0.10 – v0.18) | `tools/diagnosis/sim-v0.XX.mjs` |
| Per-version cross-validation scripts | `tools/diagnosis/verify-v0.XX.mjs` |
| Per-version batch sweep drivers | `tools/diagnosis/run-v0.XX-replays.mjs` |
| Per-version HTML report generators | `tools/diagnosis/gen-v0.XX-report.mjs` |

The 100-seed canonical game-state hash is **3189375454**, byte-identical between the Node v0.18 simulation and the polished HTML. CANONICAL-400 balance bands held: Treasury 60.0 % / Merchant 23.5 % / Manufacturer 16.5 %.

---

## What Stage A of v1.1.0 prep included

1. **Artifact promotion**
   - `release/digital-mode/sovereign-solo.html` ← `Sovereign v0.18 Polished (standalone).html`
   - `release/digital-mode/sovereign-solo-v0.10-baseline.html` ← previous v0.10 canonical (archived)
   - `release/digital-mode/README.txt` ← updated to describe the v0.18 polished baseline
   - `release/design-system/sovereign-visual-system-v0.18.html` (new — durable design system reference)
   - `release/design-system/sovereign-screen-audit-v0.18.html` (new — 15-frame visual state audit)
   - `release/design-system/README.md` (new — bundle purpose + provenance)

2. **Documentation updates**
   - `CHANGELOG.md` — v1.1.0 (release candidate) entry at top
   - `release/CHANGELOG.md` — matching v1.1.0 (release candidate) entry
   - `README.md` — status block updated; "What's new in v1.1.0" section added; three-tier failure system documented
   - `site/src/content/docs/handbook/failure-system.md` (new) — dedicated handbook page
   - `site/src/content/docs/handbook/index.md` — handbook landing updated; failure-system page linked; balance numbers refreshed
   - `site/src/content/docs/handbook/profiles.md` — sidebar order 3 → 4
   - `site/src/content/docs/handbook/reference.md` — sidebar order 4 → 5
   - `site/src/content/docs/handbook/design-history.md` — sidebar order 5 → 6; description refreshed to v0.2 → v0.18
   - `site/src/content/docs/handbook/security.md` — sidebar order 6 → 7

3. **Status docs**
   - `SHIP_GATE.md` — existing v1.0.x check marks remain valid for v1.1.0 RC (no gate item is failure-system or polish dependent)
   - `SCORECARD.md` — left untouched (empty template, scored per-remediation rather than per-release)

4. **This memo**
   - `RELEASE-PREP-v1.1.0.md` (new)

---

## What is intentionally NOT in Stage A

- **`package.json` version bump** — stays at `1.0.2` until the release train.
- **Translations** — `README.md` changed; 7-language regeneration will run during the release train via `node E:/AI/polyglot-mcp/scripts/translate-all.mjs` before tag push.
- **Shipcheck** — full pre-publish gate is part of the release train.
- **npm publish** — not done.
- **Git tag** — not pushed.
- **GitHub Release** — not created.
- **Pages deploy** — not triggered.

---

## Promotion decision

The v0.18 polished build is **PROMOTED** to the canonical Sovereign Solo / Digital Mode release surface. The promotion is justified by:

- 44 / 44 promotion audit checks PASS (provenance, implementation, regression, balance/failure evidence, documentation readiness).
- 100-seed canonical game-state hash byte-identical between Node sim and polished HTML.
- CANONICAL-400 balance bands held: Treasury 60.0 % / Merchant 23.5 % / Manufacturer 16.5 % (within v0.10 target ranges).
- No mechanic drift. No reducer change. No DOM-ID change. No event-identifier change. No removal of existing CSS classes.
- The polished HTML is the same machine; the wrapper is what changed.

---

## Caveat

v0.18 mechanics are simulation-verified across the canonical T/M/Mfg triplet (400 seeds) and the MFG-MIRROR variant (100 seeds). They are not yet human-playtested. The Credit Crisis frequency, penalty severity (+1 Resistance), and visual treatments may shift based on live play feedback.

---

## Next kickoff

Release train: translations → shipcheck → `package.json` 1.0.2 → 1.1.0 → commit → tag v1.1.0 → npm publish → GitHub Release → Pages deploy verification.

That kickoff is separate from this prep stage and waits on explicit authorization.
