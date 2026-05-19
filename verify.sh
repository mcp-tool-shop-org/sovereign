#!/usr/bin/env bash
# Sovereign · verify
# One-shot: test + pack-dry-run + smoke. Exits 0 on success.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "=== Sovereign verify ==="
echo

echo "[1/3] smoke tests"
node test/smoke.test.mjs

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
