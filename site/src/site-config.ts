import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: 'Sovereign · The Hamilton System Board Game',
  description:
    'A Hamilton-system economic board game and its solo / digital adaptation. ' +
    'Play in your browser against deterministic scripted opponents. No install, no account, no network.',
  logoBadge: 'S',
  brandName: 'Sovereign',
  repoUrl: 'https://github.com/mcp-tool-shop-org/sovereign',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/sovereign',
  footerText:
    'MIT Licensed — built by <a href="https://mcp-tool-shop.github.io/" style="color:var(--color-muted);text-decoration:underline">MCP Tool Shop</a>',

  hero: {
    badge: 'v1.0 · Free · Open Source',
    headline: 'Sovereign',
    headlineAccent: 'Founding Credit.',
    description:
      'A Hamiltonian economic strategy game about the founding of US public credit. ' +
      'Fund the debt, build the bank, industrialize the republic — solo against two scripted opponents, ' +
      'in your browser, with no install. Same seed plays out the same way every time.',
    primaryCta: { href: 'release/digital-mode/sovereign-solo.html', label: 'Play now' },
    secondaryCta: { href: 'handbook/', label: 'Read the Handbook' },
    previews: [
      { label: 'npx', code: 'npx @mcptoolshop/sovereign' },
      { label: 'Print', code: 'npx @mcptoolshop/sovereign --print' },
      { label: 'Web', code: 'https://mcp-tool-shop-org.github.io/sovereign/' },
    ],
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
            'The historically dominant path — 59% canonical win rate at v0.10.',
        },
        {
          title: 'Merchant / Infrastructure',
          desc:
            'Routes, ports, internal improvements, the commerce of the republic. ' +
            'Strong economy without depending on Acts of Congress. 25% canonical wins.',
        },
        {
          title: 'Manufacturer / Industry',
          desc:
            'Manufactures, Strategic Industry, Industrial Capacity scoring. ' +
            'Requires deliberate sponsorship — but viable. 16% canonical wins.',
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
            'Same rules as a 34-sheet printable prototype. Cut and play at a real table.',
        },
      ],
    },

    {
      kind: 'code-cards',
      id: 'play',
      title: 'Play it',
      cards: [
        {
          title: 'Browser (zero install)',
          code: 'npx @mcptoolshop/sovereign',
        },
        {
          title: 'Hosted',
          code: '# Open in any browser:\nhttps://mcp-tool-shop-org.github.io/sovereign/',
        },
        {
          title: 'Print and play',
          code: 'npx @mcptoolshop/sovereign --print\n# Then Ctrl-P → Save as PDF → US Letter → 100% scale',
        },
        {
          title: 'Offline bundle',
          code: '# Download sovereign-vX.Y.Z-release.zip\n# from the GitHub Release page,\n# unzip, open 00-START-HERE.html',
        },
      ],
    },
  ],
};
