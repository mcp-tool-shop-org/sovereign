/**
 * Sovereign · smoke tests
 *
 * Verifies the package shape without launching a browser. Covers:
 *   - package.json fields
 *   - bin entry point exists and is executable shape
 *   - release artifacts exist
 *   - --version and --path return expected values
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;

function check(label, fn) {
  try {
    fn();
    console.log(`  PASS  ${label}`);
  } catch (e) {
    failures++;
    console.log(`  FAIL  ${label} — ${e.message}`);
  }
}

console.log('Sovereign · smoke tests');

// 1. package.json shape
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
check('package.json name is @mcptoolshop/sovereign', () => {
  if (pkg.name !== '@mcptoolshop/sovereign') throw new Error(`got ${pkg.name}`);
});
check('package.json version is 1.0.0+', () => {
  if (!/^\d+\.\d+\.\d+/.test(pkg.version)) throw new Error(`got ${pkg.version}`);
  const [maj] = pkg.version.split('.').map(Number);
  if (maj < 1) throw new Error(`pre-1.0 version: ${pkg.version}`);
});
check('package.json has bin entry', () => {
  if (!pkg.bin?.sovereign) throw new Error('missing bin.sovereign');
});
check('package.json license is MIT', () => {
  if (pkg.license !== 'MIT') throw new Error(`got ${pkg.license}`);
});
check('package.json has repository url', () => {
  if (!pkg.repository?.url?.includes('github.com')) throw new Error('missing repo url');
});

// 2. Bin entry point exists
const binPath = resolve(ROOT, 'bin/sovereign.js');
check('bin/sovereign.js exists', () => {
  if (!existsSync(binPath)) throw new Error('not found');
});
check('bin/sovereign.js has shebang', () => {
  const first = readFileSync(binPath, 'utf8').split('\n')[0];
  if (!first.startsWith('#!/usr/bin/env node')) throw new Error(`got: ${first}`);
});

// 3. Release artifacts exist
const releaseArtifacts = [
  'release/00-START-HERE.html',
  'release/digital-mode/sovereign-solo.html',
  'release/board-game/sovereign-prototype.html',
  'release/digital-mode/sovereign-v0.10-freeze-audit.html',
  'release/CHANGELOG.md',
];
for (const rel of releaseArtifacts) {
  check(`release artifact: ${rel}`, () => {
    if (!existsSync(resolve(ROOT, rel))) throw new Error('missing');
  });
}

// 4. CLI flags
check('CLI --version returns the package version', () => {
  const out = execFileSync('node', [binPath, '--version'], { encoding: 'utf8' }).trim();
  if (out !== pkg.version) throw new Error(`got "${out}", expected "${pkg.version}"`);
});
check('CLI --path returns the playable HTML path', () => {
  const out = execFileSync('node', [binPath, '--path'], { encoding: 'utf8' }).trim();
  if (!out.endsWith('sovereign-solo.html')) throw new Error(`got: ${out}`);
  if (!existsSync(out)) throw new Error(`path does not resolve to a file: ${out}`);
});
check('CLI --help exits 0', () => {
  execFileSync('node', [binPath, '--help'], { encoding: 'utf8' });
});
check('CLI short flag -v returns the version', () => {
  const out = execFileSync('node', [binPath, '-v'], { encoding: 'utf8' }).trim();
  if (out !== pkg.version) throw new Error(`got "${out}"`);
});
check('CLI short flag -h prints help', () => {
  execFileSync('node', [binPath, '-h'], { encoding: 'utf8' });
});
check('CLI unknown flag exits 1 with structured error', () => {
  let exitCode = 0;
  let stderr = '';
  try {
    execFileSync('node', [binPath, '--definitely-not-a-flag'], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (e) {
    exitCode = e.status;
    stderr = (e.stderr || '').toString();
  }
  if (exitCode !== 1) throw new Error(`expected exit 1, got ${exitCode}`);
  if (!stderr.includes('E_UNKNOWN_FLAG')) {
    throw new Error(`expected E_UNKNOWN_FLAG in stderr, got: ${stderr.slice(0, 100)}`);
  }
});
check('CLI --debug + --quiet flags parse without error', () => {
  // We can't safely invoke the default action (it spawns a browser).
  // But we can pair --debug / --quiet with --version, which exits early.
  execFileSync('node', [binPath, '--debug', '--version'], { encoding: 'utf8' });
  execFileSync('node', [binPath, '--quiet', '--version'], { encoding: 'utf8' });
});
check('CLI --print + --path returns the printable HTML path', () => {
  const out = execFileSync('node', [binPath, '--print', '--path'], { encoding: 'utf8' }).trim();
  if (!out.endsWith('sovereign-prototype.html')) throw new Error(`got: ${out}`);
});
check('CLI --start + --path returns the START-HERE path', () => {
  const out = execFileSync('node', [binPath, '--start', '--path'], { encoding: 'utf8' }).trim();
  if (!out.endsWith('00-START-HERE.html')) throw new Error(`got: ${out}`);
});

// 5. Required repo files
const repoFiles = ['README.md', 'LICENSE', 'CHANGELOG.md', 'SECURITY.md'];
for (const f of repoFiles) {
  check(`repo file: ${f}`, () => {
    if (!existsSync(resolve(ROOT, f))) throw new Error('missing');
  });
}

console.log();
if (failures > 0) {
  console.log(`${failures} failure(s)`);
  process.exit(1);
}
console.log('All smoke tests passed.');
