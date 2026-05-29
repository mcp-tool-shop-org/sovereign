import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: 'Sovereign · The Hamilton System Board Game',
  description:
    'A Hamilton-system economic board game and its solo / digital adaptation. ' +
    'Digital mode is v1.5.0 beta: circuit-victory + strategic depth + Federal Era + the Credit Spiral + Chronicler narration with real Federalist-era quotes.',
  logoBadge: 'S',
  brandName: 'Sovereign',
  repoUrl: 'https://github.com/mcp-tool-shop-org/sovereign',
  npmUrl: 'https://www.npmjs.com/package/@mcptoolshop/sovereign',
  footerText:
    'MIT Licensed — built by <a href="https://mcp-tool-shop.github.io/" style="color:var(--color-muted);text-decoration:underline">MCP Tool Shop</a>',

  hero: {
    badge: 'v1.5.0 · Digital mode beta',
    headline: 'Sovereign',
    headlineAccent: 'Founding Credit.',
    description:
      'A Hamilton-system Monopoly-grammar board game and its solo / digital adaptation. ' +
      'Circuit-victory ends the game when one player carries their faction around the Republic four times — but the heaviest ledger wins, not the first to finish. ' +
      'Strategic depth: profile-locked Special Actions, HAND cards, Reform recovery. ' +
      'The Credit Spiral makes failure felt, compounding, and recoverable. ' +
      'Federal Era: eight events per game, three Profile Visions. ' +
      'The Chronicler narrates with real Federalist-era quotes sourced from founders.archives.gov and the Federalist Papers, with a searchable Ledger for the history behind every term. ' +
      'A Swift-Start opening guides your first game. Opt-in beta.',
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
        'Balance verified live across CANONICAL × 100 — Treasury 48% / Merchant 34% / Manufacturer 18%.',
      features: [
        {
          title: 'Treasury / Finance',
          desc:
            'Public Credit ramp, federal debt, the Bank of the United States. ' +
            'Issue Federal Bond as a profile-locked Special Action. ' +
            'Federal Credit Architect Vision: Credit ≥ 8 + Bank chartered + finance diversity. ' +
            'The historically dominant path — 48% wins at v1.5.0.',
        },
        {
          title: 'Merchant / Infrastructure',
          desc:
            'Routes, ports, internal improvements, the commerce of the republic. ' +
            'Broker Route Contract for fee income on opponent landings. ' +
            'Commerce Sovereign Vision: 2+ routes + Commercial Infrastructure + 5+ broker income. ' +
            'The strongest non-Treasury path — 34% wins at v1.5.0.',
        },
        {
          title: 'Manufacturer / Industry',
          desc:
            'Manufactures, Strategic Industry, Industrial Capacity scoring. ' +
            'Charter Workshop for discounted upgrades. ' +
            'Industrial Founder Vision: Capacity ≥ 7 + 3 industrial assets + 1 upgrade. ' +
            '18% wins at v1.5.0.',
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
