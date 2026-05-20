import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: 'Sovereign · The Hamilton System Board Game',
  description:
    'A Hamilton-system economic board game and its solo / digital adaptation. ' +
    'Digital mode is v1.1.2 beta: ends when a player carries their faction around the Republic four times.',
  logoBadge: 'S',
  brandName: 'Sovereign',
  repoUrl: 'https://github.com/mcp-tool-shop-org/sovereign',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/sovereign',
  footerText:
    'MIT Licensed — built by <a href="https://mcp-tool-shop.github.io/" style="color:var(--color-muted);text-decoration:underline">MCP Tool Shop</a>',

  hero: {
    badge: 'v1.1.2 · Digital mode beta',
    headline: 'Sovereign',
    headlineAccent: 'Founding Credit.',
    description:
      'A Hamilton-system Monopoly-grammar board game and its solo / digital adaptation. ' +
      'The game ends when one player carries their faction around the Republic four times. ' +
      'Whoever holds the strongest ledger at that moment wins — not necessarily the one who got there first. ' +
      'Opt-in beta — meaningfully better than v1.1.0, but not yet cold-walked end-to-end.',
    primaryCta: { href: 'release/digital-mode/sovereign-solo.html', label: 'Play the digital mode (beta)' },
    secondaryCta: { href: 'handbook/', label: 'Read the Handbook' },
    previews: [],
  },

  sections: [
    {
      kind: 'features',
      id: 'features',
      title: 'Three viable paths',
      subtitle:
        'Treasury, commerce, and industry should each be able to win. ' +
        'Balance verified across 1,000+ deterministic simulation games.',
      features: [
        {
          title: 'Treasury / Finance',
          desc:
            'Public Credit ramp, federal debt, the Bank of the United States. ' +
            'The historically dominant path — 56% wins at v1.1.2 (circuit-victory model).',
        },
        {
          title: 'Merchant / Infrastructure',
          desc:
            'Routes, ports, internal improvements, the commerce of the republic. ' +
            'Strong mid-game economy. 19% wins at v1.1.2 — Merchant peaks faster than the longer arc rewards.',
        },
        {
          title: 'Manufacturer / Industry',
          desc:
            'Manufactures, Strategic Industry, Industrial Capacity scoring. ' +
            'Longer games let industrial sets mature — 25% wins at v1.1.2, the strongest Manufacturer share yet.',
        },
      ],
    },

    {
      kind: 'features',
      id: 'design',
      title: 'Designed to be inspectable',
      subtitle: 'Every decision is a rule, visible in the ledger.',
      features: [
        {
          title: 'Deterministic',
          desc:
            'Single RNG — mulberry32(state.rngSeed). Same seed plus same human ' +
            'decisions produces byte-identical ledger every time.',
        },
        {
          title: 'No LLM, no magic',
          desc:
            'Opponents are pure decision functions of visible state. Every buy, ' +
            'vote, and bid logs the rule that fired into the ledger.',
        },
        {
          title: 'Local-only',
          desc:
            'No network call, no account, no cloud sync, no telemetry. ' +
            'The full game lives in one self-contained HTML file.',
        },
        {
          title: 'Save · Load · Replay',
          desc:
            'Autosave to browser storage. Export / import as JSON. Replay any ' +
            'completed game turn-by-turn with hash integrity check.',
        },
        {
          title: 'Batch simulation',
          desc:
            'Run 10 / 50 / 100 deterministic games against any profile triplet. ' +
            'Export JSON + HTML balance reports for analysis.',
        },
        {
          title: 'Printable board game',
          desc:
            'Same rules as a 34-sheet printable board game. Cut and play at a real table.',
        },
      ],
    },

    {
      kind: 'code-cards',
      id: 'printable',
      title: 'Printable edition',
      cards: [
        {
          title: 'Print and play (v0.2 board game)',
          code: 'npx @mcptoolshop/sovereign --print\n# Then Ctrl-P → Save as PDF → US Letter → 100% scale',
        },
      ],
    },
  ],
};
