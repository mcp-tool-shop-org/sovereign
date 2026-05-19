#!/usr/bin/env node
/**
 * Sovereign — Hamilton-system board game · CLI entry point
 *
 * Opens the digital board game in the user's default browser.
 * All gameplay is local. No network. The simulator is the included
 * release/digital-mode/sovereign-solo.html file.
 *
 * Flags:
 *   --print     Open the printable 34-sheet board game prototype instead.
 *   --start     Open the START-HERE landing page (audience-routed entry).
 *   --path      Print the file path of the playable HTML and exit.
 *   --quiet     Silent on success (only errors print).
 *   --debug     Include stack traces and verbose diagnostic output.
 *   --version   Print version and exit.
 *   --help      Print this help.
 *
 * Exit codes:
 *   0  Success
 *   1  User error (e.g. unknown flag, missing target)
 *   2  Runtime error (e.g. browser spawn failed)
 *   3  Partial success (reserved)
 */

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, '..');

const TARGETS = {
  game:  resolve(PKG_ROOT, 'release', 'digital-mode',  'sovereign-solo.html'),
  print: resolve(PKG_ROOT, 'release', 'board-game',    'sovereign-prototype.html'),
  start: resolve(PKG_ROOT, 'release', '00-START-HERE.html'),
};

// --- Logging levels: silent / normal / verbose / debug -------------------
const LOG = { quiet: false, debug: false };
const info = (...args) => { if (!LOG.quiet) console.log(...args); };
const dbg  = (...args) => { if (LOG.debug) console.error('[debug]', ...args); };

// --- Structured error printer: { code, message, hint, cause?, retryable? }
function fail(err, exitCode = 2) {
  // Always: ERROR [code] message
  console.error(`ERROR [${err.code}] ${err.message}`);
  if (err.hint)      console.error(`  hint: ${err.hint}`);
  if (err.path)      console.error(`  path: ${err.path}`);
  if (err.retryable) console.error(`  retryable: ${err.retryable}`);
  if (LOG.debug && err.cause) {
    console.error('  cause:', err.cause);
    if (err.cause.stack) console.error(err.cause.stack);
  }
  process.exit(exitCode);
}

function readVersion() {
  try {
    const pkg = JSON.parse(readFileSync(resolve(PKG_ROOT, 'package.json'), 'utf8'));
    return pkg.version;
  } catch (e) {
    dbg('readVersion failed:', e);
    return 'unknown';
  }
}

function help() {
  console.log(`Sovereign · The Hamilton System Board Game · v${readVersion()}

Usage:
  sovereign            Open the digital board game in your browser.
  sovereign --print    Open the printable 34-sheet board game prototype.
  sovereign --start    Open the START-HERE landing page.
  sovereign --path     Print the playable HTML file path and exit.
  sovereign --quiet    Silent on success.
  sovereign --debug    Verbose diagnostic output.
  sovereign --version  Print version and exit.
  sovereign --help     Print this help.

Local-only. No network calls. No accounts. Deterministic (mulberry32).
Source: https://github.com/mcp-tool-shop-org/sovereign
`);
}

function openInBrowser(absPath) {
  if (!existsSync(absPath)) {
    fail({
      code: 'E_FILE_NOT_FOUND',
      message: 'Sovereign HTML file not found in package.',
      hint: 'Reinstall with `npm install -g @mcptoolshop/sovereign`',
      path: absPath,
      retryable: false,
    }, 2);
  }
  const url = `file://${absPath.replace(/\\/g, '/')}`;
  info(`Sovereign · opening ${absPath}`);
  dbg('url:', url);

  const platform = process.platform;
  let cmd, args;
  if (platform === 'darwin') {
    cmd = 'open';     args = [url];
  } else if (platform === 'win32') {
    cmd = 'cmd';      args = ['/c', 'start', '""', url];
  } else {
    cmd = 'xdg-open'; args = [url];
  }
  dbg('spawn:', cmd, args);

  try {
    const child = spawn(cmd, args, { detached: true, stdio: 'ignore' });
    child.unref();
  } catch (err) {
    fail({
      code: 'E_BROWSER_SPAWN_FAILED',
      message: `Could not open the OS default browser (${platform}).`,
      hint: `Open this file manually: ${absPath}`,
      cause: err,
      retryable: true,
    }, 2);
  }
}

// --- CLI dispatch --------------------------------------------------------
const args = process.argv.slice(2);

// Flag parsing
LOG.quiet = args.includes('--quiet') || args.includes('-q');
LOG.debug = args.includes('--debug');

if (args.includes('--help') || args.includes('-h')) {
  help();
  process.exit(0);
}
if (args.includes('--version') || args.includes('-v')) {
  console.log(readVersion());
  process.exit(0);
}

// Validate unknown flags (user-error vs. runtime-error distinction)
const KNOWN = new Set([
  '--print', '--start', '--path',
  '--quiet', '-q', '--debug',
  '--version', '-v', '--help', '-h',
]);
for (const a of args) {
  if (a.startsWith('-') && !KNOWN.has(a)) {
    fail({
      code: 'E_UNKNOWN_FLAG',
      message: `Unknown flag: ${a}`,
      hint: 'Run `sovereign --help` for the flag list.',
      retryable: false,
    }, 1);
  }
}

let target = TARGETS.game;
if (args.includes('--print')) target = TARGETS.print;
else if (args.includes('--start')) target = TARGETS.start;

if (args.includes('--path')) {
  console.log(target);
  process.exit(0);
}

openInBrowser(target);
