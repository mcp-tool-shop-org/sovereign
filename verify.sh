#!/usr/bin/env bash
# Sovereign · verify
# One-shot: tests (smoke + determinism) + pack-dry-run + CLI flags. Exits 0 on success.
#
# REQUIRES BASH. `npm run verify` invokes `bash verify.sh`, so on Windows run it
# from Git Bash / WSL (bash must be on PATH). The underlying checks are pure Node
# and cross-platform — on plain PowerShell/cmd you can run them directly without
# bash via the npm scripts:
#     npm test                 # smoke + determinism
#     npm pack --dry-run        # package shape + included files
#     node bin/sovereign.js --version   (and --path / --help)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "=== Sovereign verify ==="
echo

echo "[1/3] tests (smoke + determinism)"
node test/smoke.test.mjs
node test/determinism.test.mjs

echo
echo "[2/3] npm pack --dry-run (verify package shape + files included)"
npm pack --dry-run 2>&1 | tail -30

echo
echo "[3/3] CLI flag check"
node bin/sovereign.js --version
node bin/sovereign.js --path > /dev/null
node bin/sovereign.js --help > /dev/null
echo "  CLI flags OK"

echo
echo "verify: PASS"
