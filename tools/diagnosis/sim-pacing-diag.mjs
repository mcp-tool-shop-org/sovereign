/* =====================================================================
 * Sovereign · Failure Event Pressure Diagnosis · Node sim
 * ---------------------------------------------------------------------
 * Verbatim extract of the simulation surface from
 *   release/digital-mode/sovereign-solo.html
 * with observation-only telemetry hooks bolted on at the bottom.
 *
 * No rule, balance, threshold, card, Act, profile, scoring, or reducer
 * change. Source v0.10 / v1.0.2. Pasted byte-for-byte except for:
 *   - module-level `let` declarations made explicit
 *   - DOM/render/save/replay/narration code removed (not on the
 *     batch sim path; never reached by runBatchGame)
 *   - `dispatch` stubbed as a no-op (the only path reached from
 *     the reducer's setTimeout calls inside DRAW_CARD, which fire
 *     after the synchronous game loop returns and are already
 *     guarded by BATCH_GUARD in the live HTML)
 *
 * Determinism is verified at the per-seed level against the live
 * v0.10 batch output (canonical-400.json seed 2026) before any
 * diagnosis runs.
 * ===================================================================== */

/* =====================================================================
 * PACING DIAGNOSTIC SHIM — added on top of byte-identical v0.18 extract.
 * Default TOTAL_ROUNDS = 7 preserves v0.18 baseline byte-identically.
 * Set to 12 (or 15) for Late-Republic variants. Acts still fire only in
 * rounds 1-7 because ACTS.find(a => a.lap === s.lap) returns undefined
 * for lap > 7, and BEGIN_LAP already routes to 'awaiting-roll' in that
 * case. No reducer mechanics change for variant B / variant C.
 * ===================================================================== */
let TOTAL_ROUNDS = 7;
function setTotalRounds(n) {
  if (!Number.isInteger(n) || n < 1 || n > 50) throw new Error('TOTAL_ROUNDS must be integer in [1,50]; got ' + n);
  TOTAL_ROUNDS = n;
}
function getTotalRounds() { return TOTAL_ROUNDS; }

/* PRNG — Mulberry32 (deterministic) — verbatim */
function makeRng(seed) {
  let a = seed >>> 0;
  return function() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* STATIC DATA — verbatim from sovereign-solo.html lines 612-687 */
const SPACES = [
  { num:0, name:'Treasury Opens', kind:'corner-start' },
  { num:1, name:'Continental Certificates', kind:'sys-revolutionary-debt' },
  { num:2, name:'Republic Debate', kind:'card-debate' },
  { num:3, name:'Soldier Pay Notes', kind:'sys-revolutionary-debt' },
  { num:4, name:'Federal Excise', kind:'tax', amount:200 },
  { num:5, name:'Northern Post Road', kind:'route' },
  { num:6, name:'Massachusetts Debt', kind:'sys-state-debt' },
  { num:7, name:'Market Shock', kind:'card-shock' },
  { num:8, name:'South Carolina Debt', kind:'sys-state-debt' },
  { num:9, name:'Virginia Debt', kind:'sys-state-debt' },
  { num:10, name:'Constitutional Crisis', kind:'corner-crisis' },
  { num:11, name:'Customs House', kind:'sys-revenue-system' },
  { num:12, name:'Bank of the United States', kind:'institution', instKind:'bank' },
  { num:13, name:'Import Duties', kind:'sys-revenue-system' },
  { num:14, name:'Whiskey Excise', kind:'sys-revenue-system' },
  { num:15, name:'Western Turnpike', kind:'route' },
  { num:16, name:'New York Harbor', kind:'sys-commercial-infrastructure' },
  { num:17, name:'Republic Debate', kind:'card-debate' },
  { num:18, name:'Philadelphia Exchange', kind:'sys-commercial-infrastructure' },
  { num:19, name:'Coastal Shipping', kind:'sys-commercial-infrastructure' },
  { num:20, name:'National Dividend', kind:'corner-safe' },
  { num:21, name:'Treasury Securities', kind:'sys-national-finance' },
  { num:22, name:'Market Shock', kind:'card-shock' },
  { num:23, name:'Bank Subscription', kind:'sys-national-finance' },
  { num:24, name:'Federal Deposits', kind:'sys-national-finance' },
  { num:25, name:'Potomac Canal', kind:'route' },
  { num:26, name:'Turnpike Charter', kind:'sys-internal-improvements' },
  { num:27, name:'Canal Company', kind:'sys-internal-improvements' },
  { num:28, name:'United States Mint', kind:'institution', instKind:'mint' },
  { num:29, name:'Postal Road Network', kind:'sys-internal-improvements' },
  { num:30, name:'Go to Crisis', kind:'corner-send' },
  { num:31, name:'Textile Works', kind:'sys-manufactures' },
  { num:32, name:'Iron Foundry', kind:'sys-manufactures' },
  { num:33, name:'Republic Debate', kind:'card-debate' },
  { num:34, name:'Glassworks', kind:'sys-manufactures' },
  { num:35, name:'Atlantic Port Chain', kind:'route' },
  { num:36, name:'Market Shock', kind:'card-shock' },
  { num:37, name:'Armory Works', kind:'sys-strategic-industry' },
  { num:38, name:'Speculation Scandal', kind:'tax', amount:100, resistBump:1 },
  { num:39, name:'Shipbuilding Yard', kind:'sys-strategic-industry' },
];

const ASSETS = {
  1:{cost:60,base:4,up:30,mort:30,sys:'revolutionary-debt',subkind:'Federal Bond · Continental'},
  3:{cost:60,base:6,up:30,mort:30,sys:'revolutionary-debt',subkind:'Federal Bond · Veterans'},
  6:{cost:100,base:6,up:50,mort:50,sys:'state-debt',subkind:'State Bond · Bay State'},
  8:{cost:100,base:6,up:50,mort:50,sys:'state-debt',subkind:'State Bond · Carolinas'},
  9:{cost:120,base:8,up:50,mort:60,sys:'state-debt',subkind:'State Bond · Old Dominion'},
  11:{cost:140,base:10,up:75,mort:70,sys:'revenue-system',subkind:'Federal Tariff · Customs'},
  13:{cost:140,base:10,up:75,mort:70,sys:'revenue-system',subkind:'Federal Tariff · Imports'},
  14:{cost:160,base:12,up:75,mort:80,sys:'revenue-system',subkind:'Federal Excise · Whiskey'},
  16:{cost:180,base:14,up:100,mort:90,sys:'commercial-infrastructure',subkind:'Commercial · Port'},
  18:{cost:180,base:14,up:100,mort:90,sys:'commercial-infrastructure',subkind:'Commercial · Exchange'},
  19:{cost:200,base:16,up:100,mort:100,sys:'commercial-infrastructure',subkind:'Commercial · Cabotage'},
  21:{cost:220,base:18,up:125,mort:110,sys:'national-finance',subkind:'Federal · Bonds'},
  23:{cost:220,base:18,up:125,mort:110,sys:'national-finance',subkind:'Federal · Bank'},
  24:{cost:240,base:20,up:125,mort:120,sys:'national-finance',subkind:'Federal · Deposits'},
  26:{cost:260,base:22,up:150,mort:130,sys:'internal-improvements',subkind:'Infrastructure · Turnpike'},
  27:{cost:260,base:22,up:150,mort:130,sys:'internal-improvements',subkind:'Infrastructure · Canal'},
  29:{cost:280,base:24,up:150,mort:140,sys:'internal-improvements',subkind:'Infrastructure · Post Road'},
  31:{cost:300,base:26,up:200,mort:150,sys:'manufactures',subkind:'Manufacturing · Textiles'},
  32:{cost:300,base:26,up:200,mort:150,sys:'manufactures',subkind:'Manufacturing · Iron'},
  34:{cost:320,base:28,up:200,mort:160,sys:'manufactures',subkind:'Manufacturing · Glass'},
  37:{cost:350,base:35,up:200,mort:175,sys:'strategic-industry',subkind:'Strategic · Arms'},
  39:{cost:400,base:50,up:200,mort:200,sys:'strategic-industry',subkind:'Strategic · Naval'},
  5:{cost:200,kind:'route'}, 15:{cost:200,kind:'route'}, 25:{cost:200,kind:'route'}, 35:{cost:200,kind:'route'},
  12:{cost:150,kind:'institution',instKind:'bank'}, 28:{cost:150,kind:'institution',instKind:'mint'},
};

const ROUTE_LADDER = [0, 25, 50, 100, 150];
const SYS_LABEL = {
  'revolutionary-debt':'Revolutionary Debt','state-debt':'State Debt','revenue-system':'Revenue System',
  'commercial-infrastructure':'Commercial Infrastructure','national-finance':'National Finance',
  'internal-improvements':'Internal Improvements','manufactures':'Manufactures','strategic-industry':'Strategic Industry',
};

/* ACTS — verbatim 689-730 */
const ACTS = [
  { id:1, lap:1, roman:'I',   name:'Funding Act',
    summary:'All <strong>Revolutionary Debt</strong> payments +50 % permanently. Public Credit +2.',
    apply(s){ s.flags.fundingPassed = true; return adjustTrack(s,'credit',2,'Funding Act passed'); } },
  { id:2, lap:2, roman:'II',  name:'Assumption Act',
    summary:'<strong>State Debt</strong> payments +100 % permanently. Public Credit +2. Public Resistance +1.',
    apply(s){ s.flags.assumptionPassed = true; s = adjustTrack(s,'credit',2,'Assumption Act passed'); return adjustTrack(s,'resistance',1,'Assumption Act passed'); } },
  { id:3, lap:3, roman:'III', name:'Bank Charter',
    summary:'<strong>Bank</strong> now 10 × dice (was 4×). Mint state enables 20× combo.',
    apply(s){ s.flags.bankCharterPassed = true; return s; } },
  { id:4, lap:4, roman:'IV',  name:'Tariff Schedule',
    summary:'<strong>Revenue System</strong> payments +50 % permanently. Public Resistance +1.',
    apply(s){ s.flags.tariffPassed = true; return adjustTrack(s,'resistance',1,'Tariff Schedule passed'); } },
  { id:5, lap:5, roman:'V',   name:'Coinage Act',
    summary:'<strong>Mint</strong> owner collects 50 TN from each other player. Public Credit +1. Industrial Capacity +1.',
    apply(s){
      const mintOwnerIdx = findOwnerIndex(s, 28);
      if (mintOwnerIdx >= 0) {
        for (let i = 0; i < s.players.length; i++) {
          if (i !== mintOwnerIdx) {
            s = adjustCash(s, -50, 'Coinage Act: ' + s.players[i].name + ' pays Mint owner', i);
            s = adjustCash(s, 50, 'Coinage Act: receives from ' + s.players[i].name, mintOwnerIdx);
          }
        }
      }
      s = adjustTrack(s,'credit',1,'Coinage Act passed');
      return adjustTrack(s,'capacity',1,'Coinage Act passed');
    } },
  { id:6, lap:6, roman:'VI',  name:'Report on Manufactures',
    summary:'<strong>Manufactures</strong> &amp; <strong>Strategic Industry</strong> upgrade costs halved one lap. Each Mfg/Strategic owner collects 50 TN per such property. Industrial Capacity +2.',
    apply(s){
      s.flags.manufacturesLap = s.lap;
      for (let i = 0; i < s.players.length; i++) {
        const n = countOwnedSys(s, i, 'manufactures') + countOwnedSys(s, i, 'strategic-industry');
        if (n > 0) s = adjustCash(s, 50 * n, 'Report on Manufactures · capital event · ' + n + ' Mfg/Strategic', i);
      }
      return adjustTrack(s,'capacity',2,'Report on Manufactures passed');
    } },
  { id:7, lap:7, roman:'VII', name:'Excise Enforcement',
    summary:'<strong>Whiskey Excise</strong> pays 2× this round. Public Resistance +2.',
    apply(s){ s.flags.exciseDoubleLap = s.lap; return adjustTrack(s,'resistance',2,'Excise Enforcement passed'); } },
];

/* MARKET SHOCK + REPUBLIC DEBATE — verbatim 733-812 */
const MARKET_SHOCK_CARDS = [
  { id:1, name:'Panic in the Market', tags:['Conditional'],
    effectText:'If <strong>Credit &lt; 5</strong>, pay 50 TN. If <strong>Credit ≥ 8</strong>, collect 50 TN.',
    resolve(s, idx){ const c=s.tracks.credit.value; if(c<5) return adjustCash(s,-50,'Panic in the Market: Credit < 5',idx); if(c>=8) return adjustCash(s,50,'Panic in the Market: Credit ≥ 8',idx); return logRow(s,{actor:'Card',event:'NO EFFECT',detail:'Panic in the Market: Credit 5–7, no effect',cls:'card'}); } },
  { id:2, name:'Foreign Demand Rises', tags:['System'],
    effectText:'All <strong>Manufactures</strong> owners collect 40 TN.',
    resolve(s){ for(let i=0;i<s.players.length;i++){ if(countOwnedSys(s,i,'manufactures')>0) s = adjustCash(s,40,'Foreign Demand Rises: owns Manufactures',i); } return s; } },
  { id:3, name:'Speculation Fever', tags:['Track'], chips:{credit:-1, resist:1},
    effectText:'Public Credit -1 if Credit ≥ 7, or Public Credit -2 if Credit ≤ 6. Public Resistance +1. Choose an unowned Rev/State Debt property; auction it.',
    resolve(s, idx){ const credDelta = s.tracks.credit.value >= 7 ? -1 : -2; s = adjustTrack(s,'credit',credDelta,'Speculation Fever'); s = adjustTrack(s,'resistance',1,'Speculation Fever'); const candidates = [1,3,6,8,9].filter(n => findOwnerIndex(s,n) < 0); if(candidates.length === 0) return logRow(s,{actor:'Card',event:'NO EFFECT',detail:'Speculation Fever: no unowned Rev/State Debt properties',cls:'card'}); const target = candidates[0]; s.pendingAuction = startAuction(s, target, idx, 'Speculation Fever card'); s.phase = 'auction'; return logRow(s,{actor:'Card',event:'AUCTION',detail:'Speculation Fever: auctioning ' + SPACES[target].name,cls:'card'}); } },
  { id:4, name:'Shipping Disruption', tags:['Suspension'],
    effectText:'Commerce / Route payments suspended until your next turn.',
    resolve(s, idx){ s.flags.shippingDisruptedUntilTurn = s.turnIndex + 3; return logRow(s,{actor:'Card',event:'EFFECT',detail:'Shipping Disruption: Commerce/Route payments suspended',cls:'card'}); } },
  { id:5, name:'Gold and Silver Inflow', tags:['Owner','Track'], chips:{credit:1},
    effectText:'Mint owner collects 50 TN from each player. Public Credit +1.',
    resolve(s, idx){ s = adjustTrack(s,'credit',1,'Gold and Silver Inflow'); const mintIdx = findOwnerIndex(s, 28); if(mintIdx >= 0){ for(let i=0;i<s.players.length;i++){ if(i!==mintIdx){ s = adjustCash(s,-50,'Gold/Silver: pays Mint',i); s = adjustCash(s,50,'Gold/Silver: receives',mintIdx);} } } return s; } },
  { id:6, name:'Foreign Loan Secured', tags:['Payment','Track'], chips:{credit:1},
    effectText:'You receive 100 TN. Public Credit +1.',
    resolve(s, idx){ s = adjustCash(s,100,'Foreign Loan Secured',idx); return adjustTrack(s,'credit',1,'Foreign Loan Secured'); } },
  { id:7, name:'British Trade Embargo', tags:['System','Track'], chips:{indust:1},
    effectText:'Revenue payments halved. Industrial Capacity +1.',
    resolve(s){ s.flags.revenueHalvedLap = s.lap; return adjustTrack(s,'capacity',1,'British Trade Embargo'); } },
  { id:8, name:'Yellow Fever Outbreak', tags:['Movement'],
    effectText:'Move to the nearest Commerce property.',
    resolve(s, idx){ const targets=[16,18,19]; const cur=s.players[idx].position; let best=99,n=targets[0]; for(const t of targets){ let d=(t-cur+40)%40; if(d<best){best=d;n=t;} } s = logRow(s,{actor:'Card',event:'MOVE',detail:s.players[idx].name+': Yellow Fever moves '+cur+' → '+n,cls:'move'}); s.players[idx].position = n; s.pendingResolveLanding = true; return s; } },
  { id:9, name:'Successful Bond Auction', tags:['Multi-system'],
    effectText:'Rev Debt and Nat\'l Finance owners collect 30 TN per property.',
    resolve(s){ for(let i=0;i<s.players.length;i++){ const n = countOwnedSys(s,i,'revolutionary-debt') + countOwnedSys(s,i,'national-finance'); if(n>0) s = adjustCash(s, 30*n, 'Bond Auction: ' + n + ' × 30 TN', i); } return s; } },
  { id:10, name:'Bank Run', tags:['Conditional','Track'], chips:{credit:-1, indust:-1},
    effectText:'If Charter passed, Nat\'l Finance owners lose 1 upgrade. Public Credit -1. Industrial Capacity -1.',
    resolve(s){ s = adjustTrack(s,'credit',-1,'Bank Run'); s = adjustTrack(s,'capacity',-1,'Bank Run'); if(!s.flags.bankCharterPassed) return logRow(s,{actor:'Card',event:'NO EFFECT',detail:'Bank Run: Charter not passed, skipped',cls:'card'}); for(let i=0;i<s.players.length;i++){ const nfs = s.players[i].ownedAssets.filter(a => ASSETS[a.spaceNum]?.sys === 'national-finance' && a.tier > 0); if(nfs.length > 0){ const target = nfs.reduce((m,a)=> a.tier > m.tier ? a : m); target.tier -= 1; s = logRow(s,{actor:'Card',event:'EFFECT',detail:'Bank Run: '+s.players[i].name+' loses 1 upgrade on '+SPACES[target.spaceNum].name,cls:'card'}); } } return s; } },
  { id:11, name:'Cotton Gin Patented', tags:['System','Track'], chips:{indust:1},
    effectText:'Textile Works payment doubled. Capacity +1.',
    resolve(s){ s.flags.textileDoubleLap = s.lap; return adjustTrack(s,'capacity',1,'Cotton Gin Patented'); } },
  { id:12, name:'Treaty Renegotiation', tags:['Multi-system','Track'], chips:{credit:2},
    effectText:'Rev Debt and State Debt payments doubled. Public Credit +2.',
    resolve(s){ s.flags.debtDoubleLap = s.lap; return adjustTrack(s,'credit',2,'Treaty Renegotiation'); } },
];

const REPUBLIC_DEBATE_CARDS = [
  { id:1, name:'Strict Construction Objection', tags:['Choice'],
    effectText:'Move to Crisis OR pay 50 TN.',
    choices:[
      { label:'Move to Crisis', resolve(s, idx){ s.players[idx].position = 10; s.players[idx].inCrisis = true; return logRow(s,{actor:'Card',event:'CRISIS',detail:s.players[idx].name+': Strict Construction → Crisis',cls:'event'}); } },
      { label:'Pay 50 TN', resolve(s, idx){ return adjustCash(s,-50,'Strict Construction: lobby',idx); } },
    ] },
  { id:2, name:'Jeffersonian Opposition', tags:['Owner','Track'], chips:{resist:1},
    effectText:'Bank owner pays 100 TN. Resistance +1.',
    resolve(s){ s = adjustTrack(s,'resistance',1,'Jeffersonian Opposition'); const bIdx = findOwnerIndex(s, 12); if(bIdx >= 0) return adjustCash(s,-100,'Jeffersonian Opposition: Bank owner pays',bIdx); return logRow(s,{actor:'Card',event:'NO EFFECT',detail:'Jeffersonian Opposition: Bank unowned',cls:'card'}); } },
  { id:3, name:'Credit Restored', tags:['Multi-system','Track'], chips:{credit:1},
    effectText:'Bond owners (Rev/State/Nat\'l Finance) collect 50 TN per property.',
    resolve(s){ s = adjustTrack(s,'credit',1,'Credit Restored'); for(let i=0;i<s.players.length;i++){ const n = countOwnedSys(s,i,'revolutionary-debt') + countOwnedSys(s,i,'state-debt') + countOwnedSys(s,i,'national-finance'); if(n>0) s = adjustCash(s, 50*n, 'Credit Restored: ' + n + ' bonds × 50 TN', i); } return s; } },
  { id:4, name:'Whiskey Rebellion', tags:['Conditional','Crisis'],
    effectText:'If Resistance ≥ 8, Whiskey Excise owner loses 1 upgrade and → Crisis.',
    resolve(s){ if(s.tracks.resistance.value < 8) return logRow(s,{actor:'Card',event:'NO EFFECT',detail:'Whiskey Rebellion: Resistance < 8',cls:'card'}); const wIdx = findOwnerIndex(s, 14); if(wIdx < 0) return logRow(s,{actor:'Card',event:'NO EFFECT',detail:'Whiskey Rebellion: Whiskey unowned',cls:'card'}); const w = s.players[wIdx].ownedAssets.find(a => a.spaceNum === 14); if(w.tier > 0) w.tier -= 1; s.players[wIdx].position = 10; s.players[wIdx].inCrisis = true; return logRow(s,{actor:'Card',event:'CRISIS',detail:'Whiskey Rebellion: '+s.players[wIdx].name+' loses upgrade + → Crisis',cls:'event'}); } },
  { id:5, name:'Cabinet Bargain', tags:['Trade','Track'], chips:{resist:-1},
    effectText:'Trade — active player gains 1 Influence. Resistance -1.',
    resolve(s, idx){ s = adjustTrack(s,'resistance',-1,'Cabinet Bargain'); s.players[idx].influencePoints += 1; return logRow(s,{actor:'Card',event:'EFFECT',detail:'Cabinet Bargain: '+s.players[idx].name+' gains 1 Influence (trade unimplemented)',cls:'card'}); } },
  { id:6, name:'Newspaper Smear', tags:['Influence','Payment'],
    effectText:'Pay 25 TN per Influence Point held.',
    resolve(s, idx){ const cost = 25 * s.players[idx].influencePoints; if(cost === 0) return logRow(s,{actor:'Card',event:'NO EFFECT',detail:'Newspaper Smear: 0 Influence held',cls:'card'}); return adjustCash(s,-cost,'Newspaper Smear: 25 × '+s.players[idx].influencePoints+' Inf',idx); } },
  { id:7, name:'Federalist Victory', tags:['Conditional','Track'], chips:{credit:1},
    effectText:'If you own Nat\'l Finance, collect 100 TN. Credit +1.',
    resolve(s, idx){ s = adjustTrack(s,'credit',1,'Federalist Victory'); return countOwnedSys(s,idx,'national-finance') > 0 ? adjustCash(s,100,'Federalist Victory',idx) : logRow(s,{actor:'Card',event:'NO EFFECT',detail:'Federalist Victory: no NF held',cls:'card'}); } },
  { id:8, name:'Anti-Federalist Pamphlet', tags:['System','Track'], chips:{credit:-1, resist:1},
    effectText:'Public Credit -1. All Revenue owners pay 30 TN per property. Resistance +1.',
    resolve(s){ s = adjustTrack(s,'credit',-1,'Anti-Federalist Pamphlet'); s = adjustTrack(s,'resistance',1,'Anti-Federalist Pamphlet'); for(let i=0;i<s.players.length;i++){ const n = countOwnedSys(s,i,'revenue-system'); if(n>0) s = adjustCash(s, -30*n, 'Anti-Fed Pamphlet: '+n+' × 30 TN', i); } return s; } },
  { id:9, name:'Funding Plan Advances', tags:['Vote'],
    effectText:'Force next Act vote immediately. (Phase 4: noted only.)',
    resolve(s){ return logRow(s,{actor:'Card',event:'NOTE',detail:'Funding Plan Advances: force-vote mechanic deferred',cls:'card'}); } },
  { id:10, name:'State Convention Calls', tags:['Option'],
    effectText:'State Debt owners may sell one back at full price.',
    resolve(s){ s.flags.stateConventionAvailable = true; return logRow(s,{actor:'Card',event:'EFFECT',detail:'State Convention Calls: option opened (UI deferred)',cls:'card'}); } },
  { id:11, name:'National Lottery', tags:['Payout'],
    effectText:'All players collect 10 TN per property owned.',
    resolve(s){ for(let i=0;i<s.players.length;i++){ const n = s.players[i].ownedAssets.length; if(n>0) s = adjustCash(s, 10*n, 'National Lottery: '+n+' × 10 TN', i); } return s; } },
  { id:12, name:'You Are Hamilton', tags:['Keepable','Influence'], chips:{credit:1},
    effectText:'Collect 200 TN. +1 Influence. Keep card.',
    resolve(s, idx){ s = adjustCash(s,200,'You Are Hamilton',idx); s = adjustTrack(s,'credit',1,'You Are Hamilton'); s.players[idx].influencePoints += 1; s.players[idx].keptHamilton = true; return logRow(s,{actor:'Card',event:'KEEP',detail:s.players[idx].name+' keeps You Are Hamilton',cls:'card'}); } },
];

/* PROFILES — verbatim 962-1216 */
const PROFILES = {
  'treasury-finance': {
    label: 'Treasury / Finance',
      strategy: 'Stacks federal credit. National Finance > State Debt > Rev Debt > Bank > Mint.',
      decideCardChoice(s, pIdx, card) {
        const p = s.players[pIdx];
        if (card.id === 1 && p.cash >= 100) return { idx: 1, reason: 'cash ' + p.cash + ' ≥ 100, pay 50 TN over Crisis' };
        return { idx: 0, reason: 'cash ' + p.cash + ' < 100, accept Crisis' };
      },
    assetPriority(sys, kind) {
      const order = ['national-finance','state-debt','revolutionary-debt'];
      const idx = order.indexOf(sys);
      if (kind === 'institution') return 4;
      if (idx >= 0) return idx;
      return 99;
    },
    decideBuy(s, pIdx, spaceNum) {
      const asset = ASSETS[spaceNum];
      const sp = SPACES[spaceNum];
      const p = s.players[pIdx];
      const reserve = 200;
      const aligned = (sp.kind === 'institution') || (asset.sys && ['national-finance','state-debt','revolutionary-debt'].includes(asset.sys));
      if (!aligned) return { buy: false, reason: 'off-profile ('+(asset.sys||sp.kind)+')' };
      if (p.cash - asset.cost < reserve) return { buy: false, reason: 'cash '+p.cash+' − cost '+asset.cost+' below reserve '+reserve };
      return { buy: true, reason: 'aligned with profile ('+(asset.sys||sp.kind)+'); cash '+p.cash+' ≥ cost+reserve '+(asset.cost+reserve) };
    },
    decideAuctionBid(s, pIdx, spaceNum, highBid) {
      const asset = ASSETS[spaceNum];
      const sp = SPACES[spaceNum];
      const p = s.players[pIdx];
      const aligned = (sp.kind === 'institution') || (asset.sys && ['national-finance','state-debt','revolutionary-debt'].includes(asset.sys));
      if (!aligned) return { bid: 0, reason: 'off-profile, no bid' };
      const cap = Math.floor(asset.cost * 0.9);
      const reserve = 200;
      const myMax = Math.min(cap, p.cash - reserve);
      const desired = Math.min(myMax, highBid + 10);
      if (desired <= highBid || desired < 10) return { bid: 0, reason: 'cap '+cap+' / cash '+p.cash+' below current high '+highBid };
      return { bid: desired, reason: 'aligned · bidding '+desired+' (cap '+cap+', high '+highBid+')' };
    },
    decideUpgrade(s, pIdx) {
      const p = s.players[pIdx];
      const reserve = 250;
      const candidates = p.ownedAssets.filter(a => {
        const asset = ASSETS[a.spaceNum]; if (!asset || !asset.up || a.tier >= 3) return false;
        return ownsFullSet(s, pIdx, asset.sys);
      }).sort((a, b) => ASSETS[b.spaceNum].base - ASSETS[a.spaceNum].base);
      for (const c of candidates) {
        let cost = ASSETS[c.spaceNum].up;
        if (ASSETS[c.spaceNum].sys === 'manufactures' && s.flags.manufacturesLap === s.lap) cost = Math.floor(cost / 2);
        if (p.cash - cost >= reserve) {
          return { spaceNum: c.spaceNum, cost, reason: 'highest-base set holding · '+SPACES[c.spaceNum].name+' Tier '+'I'.repeat(c.tier+1)+' · cost '+cost };
        }
      }
      return null;
    },
    decideVote(s, pIdx, actId) {
      const p = s.players[pIdx];
      if (actId === 1) return { vote: 'YES', reason: 'Funding Act lifts Rev Debt — profile aligned' };
      if (actId === 2) return { vote: 'YES', reason: 'Assumption Act lifts State Debt — profile aligned' };
      if (actId === 3) return { vote: 'YES', reason: 'Bank Charter — core Treasury/Finance trigger' };
      if (actId === 5) return { vote: 'YES', reason: 'Coinage Act — Credit + Capacity, profile aligned' };
      if (actId === 7) {
        const ownsRevenue = countOwnedSys(s, pIdx, 'revenue-system') > 0;
        return { vote: ownsRevenue ? 'NO' : 'YES', reason: ownsRevenue ? 'Excise Enforcement penalises owned Revenue assets' : 'no Revenue holdings — Excise harmless' };
      }
      if (actId === 4) {
        const ownsRevenue = countOwnedSys(s, pIdx, 'revenue-system') > 0;
        return { vote: ownsRevenue ? 'YES' : 'NO', reason: ownsRevenue ? 'Tariff lifts owned Revenue' : 'no Revenue holdings — Tariff offers nothing' };
      }
      if (actId === 6) {
        const ownsMfg = countOwnedSys(s, pIdx, 'manufactures') > 0;
        return { vote: ownsMfg ? 'YES' : 'NO', reason: ownsMfg ? 'Report on Mfg lifts owned Mfg' : 'no Mfg holdings' };
      }
      return { vote: 'NO', reason: 'unknown act · default no' };
    },
    decideEarlyVoteFee(s, pIdx) {
      const p = s.players[pIdx];
      if (s.acts.current && s.acts.current.actId === 3 && !s.flags.bankCharterPassed && ownsSpaceByIdx(s, pIdx, 12) && p.cash >= 300) {
        return { pay: true, reason: 'owns Bank · paying 100 TN to force Charter vote' };
      }
      return { pay: false, reason: 'no force-vote trigger' };
    },
  },
  'merchant-infrastructure': {
    label: 'Merchant / Infrastructure',
      strategy: 'Routes first — all four. Then Commerce, Improvements, Revenue.',
      decideCardChoice(s, pIdx, card) {
        const p = s.players[pIdx];
        if (card.id === 1 && p.cash >= 250) return { idx: 1, reason: 'cash ' + p.cash + ' ≥ 250, pay 50 TN' };
        return { idx: 0, reason: 'cash ' + p.cash + ' < 250, preserve route cash via Crisis' };
      },
    decideBuy(s, pIdx, spaceNum) {
      const asset = ASSETS[spaceNum];
      const sp = SPACES[spaceNum];
      const p = s.players[pIdx];
      const reserve = 150;
      if (sp.kind === 'route') {
        if (p.cash - asset.cost >= reserve) return { buy: true, reason: 'route grab — currently '+countOwnedRoutesByIdx(s,pIdx)+' routes · cash '+p.cash };
        return { buy: false, reason: 'route wanted but cash '+p.cash+' below cost+reserve' };
      }
      const aligned = asset.sys && ['commercial-infrastructure','internal-improvements','revenue-system'].includes(asset.sys);
      if (!aligned) return { buy: false, reason: 'off-profile ('+(asset.sys||sp.kind)+')' };
      if (p.cash - asset.cost < reserve) return { buy: false, reason: 'cash '+p.cash+' − cost '+asset.cost+' below reserve' };
      return { buy: true, reason: 'aligned ('+asset.sys+') · cash '+p.cash+' ≥ cost+reserve' };
    },
    decideAuctionBid(s, pIdx, spaceNum, highBid) {
      const asset = ASSETS[spaceNum];
      const sp = SPACES[spaceNum];
      const p = s.players[pIdx];
      const reserve = 150;
      let cap = 0;
      if (sp.kind === 'route') cap = asset.cost;
      else if (asset.sys && ['commercial-infrastructure','internal-improvements'].includes(asset.sys)) cap = Math.floor(asset.cost * 0.85);
      else if (asset.sys === 'revenue-system') cap = Math.floor(asset.cost * 0.7);
      else return { bid: 0, reason: 'off-profile, no bid' };
      const myMax = Math.min(cap, p.cash - reserve);
      const desired = Math.min(myMax, highBid + 10);
      if (desired <= highBid || desired < 10) return { bid: 0, reason: 'cap '+cap+' / cash '+p.cash+' below high '+highBid };
      return { bid: desired, reason: (sp.kind === 'route' ? 'route auction · willing to pay full' : 'aligned · capped at '+cap)+' · bid '+desired };
    },
    decideUpgrade(s, pIdx) {
      const p = s.players[pIdx];
      const reserve = 200;
      const order = ['commercial-infrastructure','internal-improvements','revenue-system'];
      for (const sys of order) {
        if (!ownsFullSet(s, pIdx, sys)) continue;
        const candidates = p.ownedAssets.filter(a => ASSETS[a.spaceNum]?.sys === sys && a.tier < 3 && ASSETS[a.spaceNum].up)
                                        .sort((a, b) => a.tier - b.tier);
        for (const c of candidates) {
          const cost = ASSETS[c.spaceNum].up;
          if (p.cash - cost >= reserve) {
            return { spaceNum: c.spaceNum, cost, reason: sys+' set held · Tier '+'I'.repeat(c.tier+1)+' on '+SPACES[c.spaceNum].name+' · cost '+cost };
          }
        }
      }
      return null;
    },
    decideVote(s, pIdx, actId) {
      const p = s.players[pIdx];
      if (actId === 4) return { vote: 'YES', reason: 'Tariff lifts Commerce-adjacent income' };
      if (actId === 3) return { vote: 'NO', reason: 'Bank Charter benefits Treasury/Finance, not Merchant' };
      if (actId === 2) return { vote: 'NO', reason: 'Assumption raises Resistance · profile averse' };
      if (actId === 7) return { vote: 'NO', reason: 'Excise Enforcement raises Resistance' };
      if (actId === 1) return { vote: 'NO', reason: 'Funding lifts Rev Debt — not held' };
      if (actId === 5) return { vote: 'NO', reason: 'Coinage rewards Mint owner — not held' };
      if (actId === 6) {
        const ownsMfg = countOwnedSys(s, pIdx, 'manufactures') > 0;
        return { vote: ownsMfg ? 'YES' : 'NO', reason: ownsMfg ? 'Report on Mfg lifts owned Mfg' : 'no Mfg holdings' };
      }
      return { vote: 'NO', reason: 'unknown act · default no' };
    },
    decideEarlyVoteFee(s, pIdx) {
      const p = s.players[pIdx];
      if (s.acts.current && s.acts.current.actId === 4 && !s.flags.tariffPassed && s.tracks.resistance.value <= 4 && p.cash >= 300) {
        return { pay: true, reason: 'forcing Tariff while Resistance ≤ 4' };
      }
      return { pay: false, reason: 'no force-vote trigger' };
    },
  },
  'manufacturer-industry': {
    label: 'Manufacturer / Industry',
    strategy: 'Mfg and Strategic Industry first. Pushes Capacity. Slow start, big late game.',
    decideCardChoice(s, pIdx, card) {
      const p = s.players[pIdx];
      if (card.id === 1 && p.cash >= 150) return { idx: 1, reason: 'cash ' + p.cash + ' ≥ 150, pay 50 TN over Crisis' };
      return { idx: 0, reason: 'cash ' + p.cash + ' < 150, accept Crisis to preserve industrial cash' };
    },
    decideBuy(s, pIdx, spaceNum) {
      const asset = ASSETS[spaceNum];
      const sp = SPACES[spaceNum];
      const p = s.players[pIdx];
      const reserve = 200;
      const isBank = sp.kind === 'institution' && sp.instKind === 'bank';
      const isMint = sp.kind === 'institution' && sp.instKind === 'mint';
      const isIndustrial = asset.sys === 'manufactures' || asset.sys === 'strategic-industry';
      const isImprovement = asset.sys === 'internal-improvements';
      const aligned = isIndustrial || isImprovement || isBank || isMint;
      if (!aligned) {
        return { buy: false, reason: 'off-profile after industrial priorities · ' + (asset.sys || sp.kind) };
      }
      if (p.cash - asset.cost < reserve) {
        return { buy: false, reason: 'cash reserve blocks buy · ' + p.cash + ' < ' + (asset.cost + reserve) };
      }
      if (isIndustrial) {
        if (asset.sys === 'manufactures' && countOwnedSys(s, pIdx, 'manufactures') === 2) {
          return { buy: true, reason: 'set-completion tie-break · Mfg' };
        }
        if (asset.sys === 'strategic-industry' && countOwnedSys(s, pIdx, 'strategic-industry') === 1) {
          return { buy: true, reason: 'set-completion tie-break · Strategic' };
        }
        return { buy: true, reason: 'industrial asset · Capacity path' };
      }
      return { buy: true, reason: 'no industrial pending · taking secondary ' + (isImprovement ? 'Improvements' : isBank ? 'Bank' : 'Mint') };
    },
    decideAuctionBid(s, pIdx, spaceNum, highBid) {
      const asset = ASSETS[spaceNum];
      const sp = SPACES[spaceNum];
      const p = s.players[pIdx];
      const reserve = 150;
      let cap = 0;
      if (asset.sys && ['manufactures','strategic-industry'].includes(asset.sys)) cap = Math.floor(asset.cost * 0.95);
      else if (asset.sys === 'internal-improvements') cap = Math.floor(asset.cost * 0.7);
      else return { bid: 0, reason: 'off-profile after industrial priorities · ' + (asset.sys || sp.kind) };
      const myMax = Math.min(cap, p.cash - reserve);
      const desired = Math.min(myMax, highBid + 10);
      if (desired <= highBid || desired < 10) return { bid: 0, reason: 'auction cap reached · ' + cap };
      return { bid: desired, reason: 'industrial asset · Capacity path · bid ' + desired + ' · cap ' + cap };
    },
    decideUpgrade(s, pIdx) {
      const p = s.players[pIdx];
      const reserve = 200;
      const order = ['manufactures','strategic-industry','internal-improvements'];
      for (const sys of order) {
        if (!ownsFullSet(s, pIdx, sys)) continue;
        const candidates = p.ownedAssets.filter(a => ASSETS[a.spaceNum]?.sys === sys && a.tier < 3 && ASSETS[a.spaceNum].up)
                                        .sort((a, b) => ASSETS[b.spaceNum].base - ASSETS[a.spaceNum].base);
        for (const c of candidates) {
          let cost = ASSETS[c.spaceNum].up;
          if (ASSETS[c.spaceNum].sys === 'manufactures' && s.flags.manufacturesLap === s.lap) cost = Math.floor(cost / 2);
          if (p.cash - cost >= reserve) {
            return { spaceNum: c.spaceNum, cost, reason: sys + ' set held · highest-base · ' + SPACES[c.spaceNum].name + ' Tier ' + 'I'.repeat(c.tier + 1) + ' · cost ' + cost };
          }
        }
      }
      return null;
    },
    decideVote(s, pIdx, actId) {
      if (actId === 6) return { vote: 'YES', reason: 'Report on Manufactures — core Manufacturer/Industry trigger' };
      if (actId === 1) return { vote: 'YES', reason: 'Funding Act — lifts owned Rev Debt; profile votes pro-credit' };
      if (actId === 2) {
        const ownsDebt = countOwnedSys(s, pIdx, 'revolutionary-debt') + countOwnedSys(s, pIdx, 'state-debt') > 0;
        return { vote: ownsDebt ? 'YES' : 'NO', reason: ownsDebt ? 'Assumption lifts owned debt' : 'no debt held — Assumption brings Resistance with no upside' };
      }
      if (actId === 4) return { vote: 'NO', reason: 'Tariff lifts Revenue — not held by Manufacturer profile' };
      if (actId === 3) {
        const ownsBank = ownsSpaceByIdx(s, pIdx, 12);
        return { vote: ownsBank ? 'YES' : 'NO', reason: ownsBank ? 'Bank Charter lifts owned Bank' : 'Bank not held — Charter favors Treasury/Finance' };
      }
      if (actId === 5) return { vote: 'NO', reason: 'Coinage rewards Mint owner — not aligned' };
      if (actId === 7) return { vote: 'NO', reason: 'Excise Enforcement raises Resistance — profile averse' };
      return { vote: 'NO', reason: 'unknown act · default no' };
    },
    decideEarlyVoteFee(s, pIdx) {
      const p = s.players[pIdx];
      const mfgPassed = s.acts.passed.some(a => a.actId === 6);
      if (s.acts.current && s.acts.current.actId === 6 && !mfgPassed && s.tracks.capacity.value < 4 && p.cash >= 300) {
        return { pay: true, reason: 'forcing Report on Manufactures while Capacity < 4' };
      }
      return { pay: false, reason: 'no force-vote trigger' };
    },
  },
};

const PROFILE_DEFAULT_NAMES = {
  'human': 'You',
  'treasury-finance': 'Hamilton',
  'merchant-infrastructure': 'Morris',
  'manufacturer-industry': 'Slater',
};

/* HELPERS — verbatim 1221-1288 */
let adjustCash = function(s, delta, reason, playerIdx) {
  if (playerIdx == null) playerIdx = s.activePlayerIndex;
  const p = s.players[playerIdx];
  p.cash += delta;
  s = logRow(s, { actor: p.name, event:'CASH', detail: reason + ' · ' + (delta>=0?'+':'') + delta + ' TN · cash ' + p.cash, cls:'cash' });
  if (p.cash < 0 && !p.bankruptThisLap) {
    p.bankruptThisLap = true;
    p.bankruptLaps += 1;
    s = logRow(s, { actor:'System', event:'BANKRUPT', detail: p.name + ': cash below zero · lap ' + s.lap + ' counted as bankrupt (−1 Influence at scoring)', cls:'event' });
  }
  return s;
};
let adjustTrack = function(s, key, delta, reason) {
  const before = s.tracks[key].value;
  const next = Math.max(0, Math.min(12, before + delta));
  s.tracks[key].value = next;
  s.tracks[key].lastReason = reason;
  s = logRow(s, { actor:'Track', event:key.toUpperCase(), detail: reason + ' · ' + before + ' → ' + next + ' (' + (delta>=0?'+':'') + delta + ')', cls:'track' });
  if (key === 'credit' && before > 0 && next === 0) s.pendingDefault = true;
  if (key === 'resistance' && next === 12) s.pendingRebellion = true;
  if (key === 'credit' && next <= 4 && next > 0 && !s.flags.creditCrisisFired) s.pendingCreditCrisis = true;
  return s;
};
let logRow = function(s, row) {
  s.ledger.push({ ...row, lap: s.lap, turn: s.turnIndex });
  return s;
};
function findOwnerIndex(s, spaceNum) {
  for (let i = 0; i < s.players.length; i++) if (s.players[i].ownedAssets.some(a => a.spaceNum === spaceNum)) return i;
  return -1;
}
function ownsSpaceByIdx(s, pIdx, num) { return s.players[pIdx].ownedAssets.some(a => a.spaceNum === num); }

const INDUSTRIAL_FIRST_PURCHASE_SPACES = new Set([31, 32, 34, 37, 39]);
function bumpIndustrialCapacityOnFirstPurchase(s, spaceNum) {
  if (!INDUSTRIAL_FIRST_PURCHASE_SPACES.has(spaceNum)) return s;
  const spaceName = SPACES[spaceNum].name;
  if (s.tracks.capacity.value >= 12) {
    return logRow(s, { actor:'System', event:'CAPACITY', detail:'Industrial Capacity capped at 12 · ' + spaceName + ' enters production', cls:'event' });
  }
  return adjustTrack(s, 'capacity', 1, spaceName + ' enters production');
}
function countOwnedSys(s, pIdx, sys) { return s.players[pIdx].ownedAssets.filter(a => ASSETS[a.spaceNum]?.sys === sys).length; }
function countOwnedRoutesByIdx(s, pIdx) { return s.players[pIdx].ownedAssets.filter(a => SPACES[a.spaceNum].kind === 'route').length; }
function ownsFullSet(s, pIdx, sys) {
  const total = Object.entries(ASSETS).filter(([n,a]) => a.sys === sys).length;
  return countOwnedSys(s, pIdx, sys) === total;
}
function ownsInstitution(s, pIdx, instKind) {
  return s.players[pIdx].ownedAssets.some(a => SPACES[a.spaceNum].kind === 'institution' && SPACES[a.spaceNum].instKind === instKind);
}
function shuffleDeck(rng, deck) {
  const a = deck.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function startAuction(s, spaceNum, declinerIdx, reason) {
  const N = s.players.length;
  const order = [];
  for (let i = 1; i <= N; i++) order.push((declinerIdx + i) % N);
  return { spaceNum, declinerIdx, bidsRemaining: order, bids: [], highBid: 0, highBidder: -1, reason };
}

/* INITIAL STATE — verbatim 1293-1323 */
function initialState(seed) {
  const rng = makeRng(seed);
  const players = [
    { idx:0, name:'You',      profile:'human',                  role:'Treasury Architect',
      cash:1500, position:0, ownedAssets:[], influencePoints:0, bankruptLaps:0, bankruptThisLap:false, keptHamilton:false, inCrisis:false, circuitsCompleted:0 },
    { idx:1, name:'Hamilton', profile:'treasury-finance',       role:'Treasury / Finance',
      cash:1500, position:0, ownedAssets:[], influencePoints:0, bankruptLaps:0, bankruptThisLap:false, keptHamilton:false, inCrisis:false, circuitsCompleted:0 },
    { idx:2, name:'Morris',   profile:'merchant-infrastructure', role:'Merchant / Infrastructure',
      cash:1500, position:0, ownedAssets:[], influencePoints:0, bankruptLaps:0, bankruptThisLap:false, keptHamilton:false, inCrisis:false, circuitsCompleted:0 },
  ];
  return {
    rngSeed: seed, rng, lap: 1, turnIndex: 0, activePlayerIndex: 0,
    phase: 'lap-start', status: 'active',
    roundSnapshots: [], /* victory-diag per-round IP capture; cheap, ~12 scorePlayer calls per 7-round game */
    players,
    decks: {
      market: shuffleDeck(rng, MARKET_SHOCK_CARDS.map(c => c.id)),
      debate: shuffleDeck(rng, REPUBLIC_DEBATE_CARDS.map(c => c.id)),
      marketDiscard: [], debateDiscard: [],
    },
    acts: { passed: [], current: null },
    tracks: {
      credit:     { value: 5, lastReason: 'Game start' },
      resistance: { value: 2, lastReason: 'Game start' },
      capacity:   { value: 1, lastReason: 'Game start' },
    },
    flags: {},
    pendingCard: null, pendingLanding: null, pendingAuction: null, pendingResolveLanding: false,
    pendingDefault: false, pendingRebellion: false, pendingCreditCrisis: false,
    ledger: [{ actor:'System', event:'INIT', detail:'3-player game · seed ' + seed + ' · You + Hamilton + Morris', cls:'event', lap:1, turn:0 }],
  };
}

/* STARTING INDUSTRIAL CHARTER — verbatim 1328-1351 */
let __CHARTER_ENABLED = true;
function applyStartingCharter(s) {
  if (!__CHARTER_ENABLED) {
    s.flags.startingCharter = { granted:false, recipientSlot:null, asset:null };
    return s;
  }
  let recipient = -1;
  for (let i = 0; i < s.players.length; i++) {
    if (s.players[i].profile === 'manufacturer-industry') { recipient = i; break; }
  }
  if (recipient < 0) {
    s.flags.startingCharter = { granted:false, recipientSlot:null, asset:null };
    return s;
  }
  const TEXTILE_SPACE = 31;
  s.players[recipient].ownedAssets.push({ spaceNum: TEXTILE_SPACE, tier: 0 });
  s.tracks.capacity.value = Math.min(12, s.tracks.capacity.value + 1);
  s.tracks.capacity.lastReason = 'Industrial Charter at setup';
  const recipientName = s.players[recipient].name;
  s.ledger.push({ actor:'System', event:'OWN', detail:'Setup · ' + recipientName + ' receives Industrial Charter: Textile Works (0 TN)', cls:'event', lap:1, turn:0, actorIdx: recipient });
  s.ledger.push({ actor:'System', event:'CAPACITY', detail:'Industrial Capacity → ' + s.tracks.capacity.value + ' · Industrial Charter at setup', cls:'event', lap:1, turn:0, actorIdx: recipient });
  s.flags.startingCharter = { granted:true, recipientSlot:recipient, asset:'textile-works' };
  return s;
}

/* Stubs for live-game globals (never read by batch path) */
let dispatch = () => {};
const __origSetTimeout = globalThis.setTimeout;
globalThis.setTimeout = function() {
  /* In batch mode the reducer fires setTimeouts inside DRAW_CARD for non-human
     opponents. The batch sim handles card resolution synchronously in its own
     loop, so these are dead. Return a sentinel timer; never run a callback. */
  return 0;
};

/* REDUCER — verbatim 1447-1781 */
let reduce = function(s, action) {
  switch (action.type) {

    case 'BEGIN_LAP': {
      s.players.forEach(p => p.bankruptThisLap = false);
      const act = ACTS.find(a => a.lap === s.lap);
      if (act) {
        s.acts.current = { actId: act.id, voting: true, votes: { 0:null, 1:null, 2:null } };
        s.phase = 'act-vote';
        s = logRow(s, { actor:'Acts', event:'REVEAL', detail:'Lap ' + s.lap + ' begins · ' + act.name + ' revealed for vote', cls:'act' });
      } else {
        s.phase = 'awaiting-roll';
      }
      return s;
    }

    case 'CAST_VOTE': {
      const pIdx = action.playerIndex;
      const yes = action.vote === 'yes';
      const p = s.players[pIdx];
      s.acts.current.votes[pIdx] = yes ? 'yes' : 'no';
      const reason = action.reason || (pIdx === 0 ? 'human vote' : 'opponent decision');
      s = logRow(s, { actor: p.name, event:'VOTE', detail: 'Vote ' + (yes ? 'YES' : 'NO') + ' · ' + reason, cls:'vote' });
      const v = s.acts.current.votes;
      if (v[0] != null && v[1] != null && v[2] != null) {
        const yesCount = [v[0], v[1], v[2]].filter(x => x === 'yes').length;
        const act = ACTS.find(a => a.id === s.acts.current.actId);
        if (yesCount >= 2) {
          s.acts.passed.push({ actId: act.id, lap: s.lap });
          s = logRow(s, { actor:'Acts', event:'PASS', detail: act.name + ' passes ' + yesCount + '-' + (3 - yesCount), cls:'act' });
          s = act.apply(s);
        } else {
          s = logRow(s, { actor:'Acts', event:'FAIL', detail: act.name + ' fails ' + yesCount + '-' + (3 - yesCount) + ' · skipped for this game in Phase 4; re-queue behavior deferred', cls:'act' });
          s.flags.lastFailedActId = act.id;
        }
        s.acts.current = null;
        s.phase = 'awaiting-roll';
      }
      return s;
    }

    case 'ROLL_DICE': {
      const pIdx = s.activePlayerIndex;
      const p = s.players[pIdx];
      if (p.inCrisis) {
        if (p.profile === 'human' && !action.crisisChoice) {
          s.phase = 'crisis-choice';
          return s;
        }
        if (action.crisisChoice === 'pay' || (p.profile !== 'human' && p.cash >= 50)) {
          s = adjustCash(s, -50, p.name + ': pay 50 TN to exit Crisis', pIdx);
          p.inCrisis = false;
          s = logRow(s, { actor: p.name, event:'EXIT CRISIS', detail:'Paid 50 TN', cls:'event' });
        } else if (action.crisisChoice === 'doubles') {
          const dd1 = Math.floor(s.rng() * 6) + 1;
          const dd2 = Math.floor(s.rng() * 6) + 1;
          s = logRow(s, { actor: p.name, event:'CRISIS ROLL', detail:'Doubles attempt 2d6 = ' + dd1 + ' + ' + dd2, cls:'event' });
          if (dd1 === dd2) {
            p.inCrisis = false;
            s.lastRoll = { d1: dd1, d2: dd2, total: dd1 + dd2 };
            s.turnIndex += 1;
            s = logRow(s, { actor: p.name, event:'EXIT CRISIS', detail:'Rolled doubles · exits Crisis and moves ' + (dd1 + dd2), cls:'event' });
            return reduce(s, { type:'MOVE_TOKEN', amount: dd1 + dd2 });
          } else {
            s = logRow(s, { actor: p.name, event:'STAY CRISIS', detail:'No doubles · turn ends', cls:'event' });
            return reduce(s, { type:'END_TURN' });
          }
        } else if (action.crisisChoice === 'skip') {
          p.crisisSkipBanked = true;
          s = logRow(s, { actor: p.name, event:'SKIP TURN', detail:'Skipping turn · Crisis clears next turn', cls:'event' });
          return reduce(s, { type:'END_TURN' });
        } else if (p.crisisSkipBanked) {
          p.inCrisis = false;
          p.crisisSkipBanked = false;
          s = logRow(s, { actor: p.name, event:'EXIT CRISIS', detail:'Skip-turn banked · free to move', cls:'event' });
        } else {
          s = logRow(s, { actor: p.name, event:'SKIP TURN', detail:'In Crisis without cash · skipping', cls:'event' });
          return reduce(s, { type:'END_TURN' });
        }
      }
      const d1 = Math.floor(s.rng() * 6) + 1;
      const d2 = Math.floor(s.rng() * 6) + 1;
      const total = d1 + d2;
      s.lastRoll = { d1, d2, total };
      s.turnIndex += 1;
      s = logRow(s, { actor: p.name, event:'ROLL', detail:'2d6 = ' + total + ' (' + d1 + '+' + d2 + ')', cls:'move' });
      return reduce(s, { type:'MOVE_TOKEN', amount: total });
    }

    case 'MOVE_TOKEN': {
      const pIdx = s.activePlayerIndex;
      const p = s.players[pIdx];
      const from = p.position;
      const to = (from + action.amount) % 40;
      const passedStart = (from + action.amount) >= 40;
      p.position = to;
      s = logRow(s, { actor: p.name, event:'MOVE', detail:'Move ' + action.amount + ' · ' + from + ' → ' + to + ' (' + SPACES[to].name + ')', cls:'move' });
      if (passedStart && to !== 0) s = reduce(s, { type:'PASS_TREASURY_OPENS' });
      else if (to === 0) s = reduce(s, { type:'PASS_TREASURY_OPENS', landed: true });
      if (s.status !== 'gameOver') return reduce(s, { type:'RESOLVE_LANDING' });
      return s;
    }

    case 'PASS_TREASURY_OPENS': {
      const pIdx = s.activePlayerIndex;
      const amount = action.landed ? 400 : 200;
      s = adjustCash(s, amount, action.landed ? 'Treasury Opens: landed' : 'Treasury Opens: passed', pIdx);
      /* Circuit tracking for victory-by-rotation diagnostic.
         Every pass through Treasury Opens (landed or passed) counts as a completed circuit. */
      const p = s.players[pIdx];
      p.circuitsCompleted = (p.circuitsCompleted || 0) + 1;
      s = logRow(s, { actor: p.name, event:'CIRCUIT', detail: p.name + ' completes circuit ' + p.circuitsCompleted + ' · turn ' + s.turnIndex, cls:'event' });
      return s;
    }

    case 'RESOLVE_LANDING': {
      const pIdx = s.activePlayerIndex;
      const p = s.players[pIdx];
      const space = SPACES[p.position];
      const k = space.kind;

      if (k.startsWith('sys-') || k === 'route' || k === 'institution') {
        const ownerIdx = findOwnerIndex(s, space.num);
        if (ownerIdx < 0) {
          s.pendingLanding = { spaceNum: space.num, playerIndex: pIdx };
          s.phase = 'asset-decision';
          return s;
        } else if (ownerIdx === pIdx) {
          s = logRow(s, { actor:'Space', event:'OWN', detail: p.name + ' landed on own ' + space.name, cls:'move' });
          return finishLanding(s);
        } else {
          const rent = computeRent(s, space.num, ownerIdx);
          if (rent > 0) {
            s = adjustCash(s, -rent, 'Rent on ' + space.name + ' to ' + s.players[ownerIdx].name, pIdx);
            s = adjustCash(s, rent, 'Rent from ' + p.name + ' for ' + space.name, ownerIdx);
          } else {
            s = logRow(s, { actor:'Space', event:'NO RENT', detail: space.name + ': rent suspended or unowned-payment-condition', cls:'move' });
          }
          return finishLanding(s);
        }
      }
      if (k === 'tax') {
        s = adjustCash(s, -space.amount, space.name + ' tax', pIdx);
        if (space.resistBump) s = adjustTrack(s, 'resistance', space.resistBump, space.name);
        return finishLanding(s);
      }
      if (k === 'card-shock' || k === 'card-debate') {
        return reduce(s, { type:'DRAW_CARD', deck: k === 'card-shock' ? 'market' : 'debate' });
      }
      if (k === 'corner-crisis') {
        p.inCrisis = true;
        s = logRow(s, { actor:'Space', event:'CRISIS', detail: p.name + ' landed on Crisis', cls:'event' });
        return finishLanding(s);
      }
      if (k === 'corner-send') {
        p.position = 10;
        p.inCrisis = true;
        s = logRow(s, { actor:'Space', event:'SEND', detail: p.name + ' sent to Crisis', cls:'event' });
        return finishLanding(s);
      }
      s = logRow(s, { actor:'Space', event:'SAFE', detail: p.name + ' on ' + space.name + ' · no action', cls:'move' });
      return finishLanding(s);
    }

    case 'BUY_ASSET': {
      const pIdx = s.pendingLanding.playerIndex;
      const sp = SPACES[s.pendingLanding.spaceNum];
      const asset = ASSETS[sp.num];
      const p = s.players[pIdx];
      if (p.cash < asset.cost) {
        s = logRow(s, { actor: p.name, event:'CANNOT BUY', detail:'Insufficient cash for ' + sp.name + ' · auctioning', cls:'cash' });
        s.pendingAuction = startAuction(s, sp.num, pIdx, 'insufficient cash');
        s.pendingLanding = null;
        s.phase = 'auction';
        return s;
      }
      s = adjustCash(s, -asset.cost, 'Buy ' + sp.name, pIdx);
      p.ownedAssets.push({ spaceNum: sp.num, tier: 0 });
      s = logRow(s, { actor: p.name, event:'OWN', detail:'Now owns ' + sp.name + (action.reason ? ' · ' + action.reason : ''), cls:'cash' });
      s = bumpIndustrialCapacityOnFirstPurchase(s, sp.num);
      s.pendingLanding = null;
      return finishLanding(s);
    }

    case 'DECLINE_ASSET': {
      const pIdx = s.pendingLanding.playerIndex;
      const sp = SPACES[s.pendingLanding.spaceNum];
      s = logRow(s, { actor: s.players[pIdx].name, event:'DECLINE', detail:'Declined ' + sp.name + ' · auction opens' + (action.reason ? ' · ' + action.reason : ''), cls:'cash' });
      s.pendingAuction = startAuction(s, sp.num, pIdx, 'declined purchase');
      s.pendingLanding = null;
      s.phase = 'auction';
      return processNextAuctionBid(s);
    }

    case 'AUCTION_BID': {
      const { playerIndex, amount } = action;
      const auction = s.pendingAuction;
      if (amount > auction.highBid) {
        auction.highBid = amount;
        auction.highBidder = playerIndex;
      }
      auction.bids.push({ playerIndex, amount, reason: action.reason || (playerIndex === 0 ? 'human bid' : 'opponent bid') });
      s = logRow(s, { actor: s.players[playerIndex].name, event:'BID', detail:'Bids ' + (amount === 0 ? 'PASS' : '$' + amount) + ' on ' + SPACES[auction.spaceNum].name + ' · ' + (action.reason || 'no reason logged'), cls:'auction' });
      auction.bidsRemaining.shift();
      return processNextAuctionBid(s);
    }

    case 'UPGRADE_ASSET': {
      const pIdx = action.playerIndex != null ? action.playerIndex : s.activePlayerIndex;
      const p = s.players[pIdx];
      const a = p.ownedAssets.find(x => x.spaceNum === action.spaceNum);
      if (!a || a.tier >= 3) return s;
      const props = ASSETS[a.spaceNum];
      if (!props.up) return s;
      if (!ownsFullSet(s, pIdx, props.sys)) return s;
      let cost = props.up;
      if ((props.sys === 'manufactures' || props.sys === 'strategic-industry') && s.flags.manufacturesLap === s.lap) cost = Math.floor(cost / 2);
      if (p.cash < cost) return s;
      s = adjustCash(s, -cost, 'Upgrade ' + SPACES[a.spaceNum].name + ' → Tier ' + 'I'.repeat(a.tier + 1) + (action.reason ? ' · ' + action.reason : ''), pIdx);
      a.tier += 1;
      return logRow(s, { actor: p.name, event:'UPGRADE', detail: SPACES[a.spaceNum].name + ' now Tier ' + 'I'.repeat(a.tier), cls:'cash' });
    }

    case 'DRAW_CARD': {
      const pIdx = s.activePlayerIndex;
      const deckKey = action.deck;
      const cards = deckKey === 'market' ? MARKET_SHOCK_CARDS : REPUBLIC_DEBATE_CARDS;
      const discardKey = deckKey + 'Discard';
      if (s.decks[deckKey].length === 0) {
        s.decks[deckKey] = shuffleDeck(s.rng, s.decks[discardKey]);
        s.decks[discardKey] = [];
        s = logRow(s, { actor:'Deck', event:'RESHUFFLE', detail: deckKey + ' deck exhausted · reshuffled', cls:'card' });
      }
      const cardId = s.decks[deckKey].shift();
      const card = cards.find(c => c.id === cardId);
      s = logRow(s, { actor:'Deck', event:'DRAW', detail: s.players[pIdx].name + ' drew ' + card.name, cls:'card' });
      s.pendingCard = { deck: deckKey, cardId, hasChoices: !!card.choices, playerIndex: pIdx };
      s.phase = card.choices ? 'card-choice' : 'card-resolve';
      if (pIdx !== 0) {
        if (card.choices) {
          const profile = PROFILES[s.players[pIdx].profile];
          const choice = profile.decideCardChoice ? profile.decideCardChoice(s, pIdx, card) : { idx: 1, reason:'default' };
          s = logRow(s, { actor: s.players[pIdx].name, event:'CARD CHOICE', detail:'Choosing "' + card.choices[choice.idx].label + '" · ' + choice.reason, cls:'card' });
          setTimeout(() => dispatch({ type:'RESOLVE_CARD_CHOICE', choiceIndex: choice.idx }), 250);
        } else {
          setTimeout(() => dispatch({ type:'RESOLVE_CARD' }), 250);
        }
      }
      return s;
    }

    case 'RESOLVE_CARD': {
      const { deck, cardId, playerIndex } = s.pendingCard;
      const cards = deck === 'market' ? MARKET_SHOCK_CARDS : REPUBLIC_DEBATE_CARDS;
      const card = cards.find(c => c.id === cardId);
      s = card.resolve(s, playerIndex);
      if (!(card.id === 12 && deck === 'debate' && s.players[playerIndex].keptHamilton)) {
        s.decks[deck + 'Discard'].push(cardId);
      }
      s.pendingCard = null;
      return finishLanding(s);
    }

    case 'RESOLVE_CARD_CHOICE': {
      const { deck, cardId, playerIndex } = s.pendingCard;
      const cards = deck === 'market' ? MARKET_SHOCK_CARDS : REPUBLIC_DEBATE_CARDS;
      const card = cards.find(c => c.id === cardId);
      s = card.choices[action.choiceIndex].resolve(s, playerIndex);
      s.decks[deck + 'Discard'].push(cardId);
      s.pendingCard = null;
      return finishLanding(s);
    }

    case 'TRIGGER_DEFAULT': {
      s = logRow(s, { actor:'System', event:'DEFAULT', detail:'Public Credit = 0 · all players lose 50 % cash + 1 random upgrade', cls:'event' });
      for (let i = 0; i < s.players.length; i++) {
        const p = s.players[i];
        const before = p.cash;
        p.cash = Math.floor(p.cash / 2);
        s = logRow(s, { actor:'System', event:'DEFAULT', detail: p.name + ' loses ' + (before - p.cash) + ' TN (50 %)', cls:'event' });
        const upgraded = p.ownedAssets.filter(a => a.tier > 0);
        if (upgraded.length > 0) {
          const target = upgraded[Math.floor(s.rng() * upgraded.length)];
          target.tier -= 1;
          s = logRow(s, { actor:'System', event:'DEFAULT', detail: p.name + ': ' + SPACES[target.spaceNum].name + ' loses 1 upgrade', cls:'event' });
        }
      }
      s.tracks.credit.value = 3;
      s.tracks.credit.lastReason = 'Default reset';
      s.pendingDefault = false;
      return s;
    }

    case 'TRIGGER_CREDIT_CRISIS': {
      s = logRow(s, { actor:'System', event:'CREDIT_CRISIS', detail:'Public Credit ≤ 4 · financial confidence collapses · all players: Resistance +1', cls:'event' });
      s = adjustTrack(s, 'resistance', 1, 'Credit Crisis');
      s.flags.creditCrisisFired = true;
      s.pendingCreditCrisis = false;
      return s;
    }

    case 'TRIGGER_REBELLION': {
      s = logRow(s, { actor:'System', event:'REBELLION', detail:'Resistance = 12 · Revenue upgrades destroyed · Whiskey owner → Crisis · Resistance → 6', cls:'event' });
      for (let i = 0; i < s.players.length; i++) {
        s.players[i].ownedAssets.forEach(a => { if (ASSETS[a.spaceNum]?.sys === 'revenue-system') a.tier = 0; });
      }
      const wIdx = findOwnerIndex(s, 14);
      if (wIdx >= 0) {
        s.players[wIdx].position = 10;
        s.players[wIdx].inCrisis = true;
      }
      s.tracks.resistance.value = 6;
      s.tracks.resistance.lastReason = 'Rebellion reset';
      s.pendingRebellion = false;
      return s;
    }

    case 'END_TURN': {
      s.activePlayerIndex = (s.activePlayerIndex + 1) % s.players.length;
      s.phase = 'awaiting-roll';
      if (s.activePlayerIndex === 0) {
        /* Per-round snapshot for victory-model diagnostic. Captures IP for each
           player at the end of the round that just completed (s.lap, before
           increment). Pure read — scorePlayer does not mutate state. */
        if (s.roundSnapshots) {
          s.roundSnapshots.push({
            roundCompleted: s.lap,
            ips: s.players.map((p, i) => scorePlayer(s, i).total),
            cash: s.players.map(p => p.cash),
            bankrupt: s.players.map(p => p.bankruptLaps),
            tracks: {
              credit: s.tracks.credit.value,
              resistance: s.tracks.resistance.value,
              capacity: s.tracks.capacity.value,
            },
          });
        }
        s.lap += 1;
        if (s.lap > TOTAL_ROUNDS) {
          s = logRow(s, { actor:'System', event:'GAME OVER', detail: TOTAL_ROUNDS + ' laps complete · scoring', cls:'event' });
          return reduce(s, { type:'END_GAME' });
        }
        s = logRow(s, { actor:'System', event:'LAP', detail:'Begin lap ' + s.lap, cls:'event' });
        return reduce(s, { type:'BEGIN_LAP' });
      }
      return s;
    }

    case 'END_GAME': {
      s = computeFinalInfluence(s);
      s.phase = 'game-over';
      s.status = 'gameOver';
      return s;
    }

    default:
      return s;
  }
};

function finishLanding(s) {
  if (s.phase === 'auction')     return s;
  if (s.phase === 'card-choice' && s.pendingCard) return s;
  if (s.pendingResolveLanding) {
    s.pendingResolveLanding = false;
    return reduce(s, { type:'RESOLVE_LANDING' });
  }
  s.phase = 'awaiting-roll';
  return reduce(s, { type:'END_TURN' });
}

function processNextAuctionBid(s) {
  const a = s.pendingAuction;
  if (!a) return s;
  while (a.bidsRemaining.length > 0) {
    const pIdx = a.bidsRemaining[0];
    const p = s.players[pIdx];
    if (p.profile === 'human') {
      s.phase = 'auction';
      return s;
    }
    const profile = PROFILES[p.profile];
    const decision = profile.decideAuctionBid(s, pIdx, a.spaceNum, a.highBid);
    a.bidsRemaining.shift();
    s = logRow(s, { actor: p.name, event:'BID', detail:'Bids ' + (decision.bid === 0 ? 'PASS' : '$' + decision.bid) + ' on ' + SPACES[a.spaceNum].name + ' · ' + decision.reason, cls:'auction' });
    a.bids.push({ playerIndex: pIdx, amount: decision.bid, reason: decision.reason });
    if (decision.bid > a.highBid) {
      a.highBid = decision.bid;
      a.highBidder = pIdx;
    }
  }
  if (a.highBid > 0 && a.highBidder >= 0) {
    const winner = s.players[a.highBidder];
    s = adjustCash(s, -a.highBid, 'Auction win: ' + SPACES[a.spaceNum].name, a.highBidder);
    winner.ownedAssets.push({ spaceNum: a.spaceNum, tier: 0 });
    s = logRow(s, { actor: winner.name, event:'AUCTION WIN', detail: 'Won ' + SPACES[a.spaceNum].name + ' for $' + a.highBid, cls:'auction' });
    s = bumpIndustrialCapacityOnFirstPurchase(s, a.spaceNum);
  } else {
    s = logRow(s, { actor:'Auction', event:'UNSOLD', detail: SPACES[a.spaceNum].name + ' remains unowned (no bids ≥ 10 TN)', cls:'auction' });
  }
  s.pendingAuction = null;
  s.phase = 'awaiting-roll';
  return reduce(s, { type:'END_TURN' });
}

/* RENT — verbatim 1837-1887 */
function computeRent(s, spaceNum, ownerIdx) {
  const space = SPACES[spaceNum];
  const asset = ASSETS[spaceNum];
  const owner = s.players[ownerIdx];

  if (space.kind === 'route') {
    if (s.flags.shippingDisruptedUntilTurn && s.turnIndex < s.flags.shippingDisruptedUntilTurn) return 0;
    const n = countOwnedRoutesByIdx(s, ownerIdx);
    let pay = ROUTE_LADDER[Math.min(n, 4)];
    if (s.tracks.credit.value <= 2) pay = Math.floor(pay / 2);
    return pay;
  }
  if (space.kind === 'institution') {
    const diceAvg = s.lastRoll ? s.lastRoll.total : 7;
    if (space.instKind === 'bank') {
      return (s.flags.bankCharterPassed ? 10 : 4) * diceAvg;
    }
    if (space.instKind === 'mint') {
      const hasBank = ownsInstitution(s, ownerIdx, 'bank');
      if (!hasBank) return 0;
      return (s.flags.bankCharterPassed ? 20 : 10) * diceAvg;
    }
    return 0;
  }
  const ownedAsset = owner.ownedAssets.find(a => a.spaceNum === spaceNum);
  if (!ownedAsset) return 0;
  const tier = ownedAsset.tier;
  let multiplier = 2;
  const fullSet = ownsFullSet(s, ownerIdx, asset.sys);
  if (tier === 0) multiplier = fullSet ? 2 : 1;
  else multiplier = [5, 15, 30][tier - 1];

  let rent = asset.base * multiplier;
  if (asset.sys === 'revolutionary-debt' && s.flags.fundingPassed) rent = Math.floor(rent * 1.5);
  if (asset.sys === 'state-debt' && s.flags.assumptionPassed) rent = rent * 2;
  if (asset.sys === 'revenue-system' && s.flags.tariffPassed) rent = Math.floor(rent * 1.5);
  if (asset.sys === 'revenue-system' && s.flags.revenueHalvedLap === s.lap) rent = Math.floor(rent / 2);
  if (spaceNum === 14 && s.flags.exciseDoubleLap === s.lap) rent = rent * 2;
  if (spaceNum === 31 && s.flags.textileDoubleLap === s.lap) rent = rent * 2;
  if ((asset.sys === 'revolutionary-debt' || asset.sys === 'state-debt') && s.flags.debtDoubleLap === s.lap) rent = rent * 2;
  if (asset.sys === 'commercial-infrastructure' && s.flags.shippingDisruptedUntilTurn && s.turnIndex < s.flags.shippingDisruptedUntilTurn) rent = 0;
  if (asset.sys === 'manufactures' || asset.sys === 'strategic-industry') {
    if (s.tracks.capacity.value >= 8) rent = Math.floor(rent * 1.5);
    else if (s.tracks.capacity.value >= 6) rent = Math.floor(rent * 1.25);
  }
  return rent;
}

/* SCORING — verbatim 1892-1940 */
function computeFinalInfluence(s) {
  s.finalScores = s.players.map(p => scorePlayer(s, p.idx));
  s.players.forEach((p, i) => p.influencePoints = s.finalScores[i].total);
  s = logRow(s, { actor:'System', event:'SCORE', detail: 'Final Influence · ' + s.players.map((p, i) => p.name + ' ' + s.finalScores[i].total).join(' · '), cls:'event' });
  return s;
}

function scorePlayer(s, pIdx) {
  const p = s.players[pIdx];
  const breakdown = []; let total = 0;
  const add = (label, detail, pts) => { total += pts; breakdown.push({ label, detail, pts }); };
  add('Cash held', Math.floor(p.cash / 400) + ' × 400 TN', Math.floor(p.cash / 400));
  const propsOwned = p.ownedAssets.filter(a => ASSETS[a.spaceNum]?.sys).length;
  add('Properties owned', propsOwned + ' properties', propsOwned);
  const upgradedCount = p.ownedAssets.filter(a => a.tier > 0).length;
  add('Upgraded properties', upgradedCount + ' upgraded', upgradedCount * 2);
  let setsCount = 0;
  Object.keys(SYS_LABEL).forEach(sys => { if (ownsFullSet(s, pIdx, sys)) setsCount++; });
  add('Complete sets', setsCount + ' complete', setsCount * 3);
  if (ownsFullSet(s, pIdx, 'manufactures')) add('Industrial Mfg set', 'full Manufactures set', 3);
  if (ownsFullSet(s, pIdx, 'strategic-industry')) add('Industrial Strategic set', 'full Strategic set', 2);
  const routes = countOwnedRoutesByIdx(s, pIdx);
  add('Routes owned', routes + ' routes', routes);
  const insts = p.ownedAssets.filter(a => SPACES[a.spaceNum].kind === 'institution').length;
  add('Institutions owned', insts + ' institutions', insts * 2);
  if (s.tracks.credit.value >= 8 && countOwnedSys(s, pIdx, 'national-finance') > 0) {
    const bonus = s.tracks.credit.value === 12 ? 2 : 1;
    add(s.tracks.credit.value === 12 ? 'Credit = 12 end-game' : 'Credit ≥ 8 end-game',
        'NF owner · +' + bonus,
        bonus);
  }
  if (s.tracks.capacity.value >= 8) {
    const hasMfg = countOwnedSys(s, pIdx, 'manufactures') > 0;
    const hasStrat = countOwnedSys(s, pIdx, 'strategic-industry') > 0;
    let bonus = 0; if (hasMfg) bonus += 2; if (hasStrat) bonus += 2;
    if (bonus > 0) add('Capacity ≥ 8 bonus', 'owns Mfg ' + (hasMfg ? '✓' : '✕') + ' / Strategic ' + (hasStrat ? '✓' : '✕'), bonus);
  }
  if (s.tracks.capacity.value >= 10) {
    const hasMfg = countOwnedSys(s, pIdx, 'manufactures') > 0;
    const hasStrat = countOwnedSys(s, pIdx, 'strategic-industry') > 0;
    let bonus = 0; if (hasMfg) bonus += 2; if (hasStrat) bonus += 2;
    if (bonus > 0) add('Capacity ≥ 10 milestone', 'owns Mfg ' + (hasMfg ? '✓' : '✕') + ' / Strategic ' + (hasStrat ? '✓' : '✕'), bonus);
  }
  if (p.keptHamilton) add('"You Are Hamilton" kept', 'card retained', 1);
  if (p.bankruptLaps > 0) add('Bankrupt laps', p.bankruptLaps + ' laps', -p.bankruptLaps);
  return { breakdown, total };
}

/* PHASE 6.1 HYGIENE WRAPPERS — verbatim 3836-3876 */
let __TM_activeHint = -1;

const __TM_origAdjustCash = adjustCash;
adjustCash = function(s, delta, reason, playerIdx) {
  if (playerIdx == null) playerIdx = s.activePlayerIndex;
  const before = s.ledger.length;
  s = __TM_origAdjustCash(s, delta, reason, playerIdx);
  for (let i = before; i < s.ledger.length; i++) {
    s.ledger[i].actorIdx = playerIdx;
  }
  return s;
};

const __TM_origLogRow = logRow;
logRow = function(s, row) {
  if (row.actorIdx === undefined && __TM_activeHint >= 0) row.actorIdx = __TM_activeHint;
  return __TM_origLogRow(s, row);
};

const __TM_origReduce = reduce;
reduce = function(s, action) {
  const saved = __TM_activeHint;
  __TM_activeHint = (action && typeof action.playerIndex === 'number')
    ? action.playerIndex
    : s.activePlayerIndex;
  try { return __TM_origReduce(s, action); }
  finally { __TM_activeHint = saved; }
};

/* runBatchGame — verbatim 3485-3578 */
function runBatchGame(seed, profileTriplet, charterEnabled) {
  let s = initialState(seed);
  for (let i = 0; i < 3; i++) {
    s.players[i].profile = profileTriplet[i];
    s.players[i].name = PROFILE_DEFAULT_NAMES[profileTriplet[i]] || PROFILES[profileTriplet[i]].label;
  }
  s.ledger[0].detail = 'Batch game · seed ' + seed + ' · ' + s.players.map(p => p.name).join(' + ');
  const savedToggle = __CHARTER_ENABLED;
  if (charterEnabled === false) __CHARTER_ENABLED = false;
  try { s = applyStartingCharter(s); } finally { __CHARTER_ENABLED = savedToggle; }
  const localLog = [];
  function logEntry(action) {
    localLog.push({
      playerIdx: s.activePlayerIndex,
      action: action.type,
      params: Object.fromEntries(Object.entries(action).filter(([k]) => k !== 'type')),
      turn: s.turnIndex, lap: s.lap,
    });
  }
  function step(action) { logEntry(action); s = reduce(s, action); }

  step({ type:'BEGIN_LAP' });
  let safety = 8000;
  while (s.status !== 'gameOver' && safety-- > 0) {
    if (s.pendingDefault) { step({ type:'TRIGGER_DEFAULT' }); continue; }
    if (s.pendingRebellion) { step({ type:'TRIGGER_REBELLION' }); continue; }
    if (s.pendingCreditCrisis) { step({ type:'TRIGGER_CREDIT_CRISIS' }); continue; }
    if (s.phase === 'act-vote' && s.acts.current) {
      let advanced = false;
      for (let i = 0; i < s.players.length; i++) {
        if (s.acts.current && s.acts.current.votes[i] != null) continue;
        if (!s.acts.current) break;
        const p = s.players[i];
        const profile = PROFILES[p.profile];
        const fee = profile.decideEarlyVoteFee(s, i);
        if (fee.pay) {
          s = adjustCash(s, -100, 'Force-vote fee · ' + fee.reason, i);
          s = logRow(s, { actor: p.name, event:'FORCE-FEE', detail:'Paid 100 TN to force Act vote · ' + fee.reason, cls:'vote' });
        }
        const decision = profile.decideVote(s, i, s.acts.current.actId);
        step({ type:'CAST_VOTE', playerIndex: i, vote: decision.vote.toLowerCase(), reason: decision.reason });
        advanced = true;
        if (!s.acts.current) break;
      }
      if (advanced) continue;
    }
    const pIdx = s.activePlayerIndex;
    const p = s.players[pIdx];
    const profile = PROFILES[p.profile];
    if (s.phase === 'awaiting-roll') {
      const up = profile.decideUpgrade(s, pIdx);
      if (up) { step({ type:'UPGRADE_ASSET', playerIndex: pIdx, spaceNum: up.spaceNum, reason: up.reason }); continue; }
      step({ type:'ROLL_DICE' }); continue;
    }
    if (s.phase === 'crisis-choice') { step({ type:'ROLL_DICE', crisisChoice:'pay' }); continue; }
    if (s.phase === 'asset-decision' && s.pendingLanding) {
      const num = s.pendingLanding.spaceNum;
      const decision = profile.decideBuy(s, pIdx, num);
      step({ type: decision.buy ? 'BUY_ASSET' : 'DECLINE_ASSET', reason: decision.reason });
      continue;
    }
    if (s.phase === 'auction' && s.pendingAuction) {
      const a = s.pendingAuction;
      if (a.bidsRemaining.length > 0) {
        const bidder = a.bidsRemaining[0];
        const bp = s.players[bidder];
        const bprofile = PROFILES[bp.profile];
        const decision = bprofile.decideAuctionBid(s, bidder, a.spaceNum, a.highBid);
        step({ type:'AUCTION_BID', playerIndex: bidder, amount: decision.bid, reason: decision.reason });
      } else {
        s.pendingAuction = null; s.phase = 'awaiting-roll';
        step({ type:'END_TURN' });
      }
      continue;
    }
    if (s.phase === 'card-resolve' && s.pendingCard) { step({ type:'RESOLVE_CARD' }); continue; }
    if (s.phase === 'card-choice' && s.pendingCard) {
      const card = (s.pendingCard.deck === 'market' ? MARKET_SHOCK_CARDS : REPUBLIC_DEBATE_CARDS).find(c => c.id === s.pendingCard.cardId);
      const choice = profile.decideCardChoice ? profile.decideCardChoice(s, pIdx, card) : { idx: 1, reason:'default' };
      step({ type:'RESOLVE_CARD_CHOICE', choiceIndex: choice.idx });
      continue;
    }
    if (s.phase === 'card-choice' && !s.pendingCard) { step({ type:'END_TURN' }); continue; }
    if (s.players.every(pl => pl.cash < 0)) { step({ type:'END_GAME' }); break; }
    break;
  }
  return { state: s, decisionLog: localLog };
}

/* =====================================================================
 * TELEMETRY HOOKS — observation only
 * Wraps adjustCash and adjustTrack ONE MORE TIME (after Phase 6.1).
 * The hooks read state before/after each call and push into a per-game
 * DIAG_TELEMETRY object. Zero state mutations beyond the telemetry
 * object itself.
 * ===================================================================== */

let DIAG_TELEMETRY = null;

function makeBlankTelemetry() {
  const tracks = {};
  for (const key of ['credit', 'resistance', 'capacity']) {
    const init = key === 'credit' ? 5 : key === 'resistance' ? 2 : 1;
    const firstLapReached = {};
    for (let v = 0; v <= 12; v++) firstLapReached[v] = null;
    firstLapReached[init] = 1;
    tracks[key] = {
      start: init,
      min: init,
      max: init,
      end: init,
      firstLapReached,
    };
  }
  const cashByPlayer = [];
  for (let i = 0; i < 3; i++) {
    cashByPlayer.push({
      start: 1500,
      min: 1500,
      minLap: null,
      minReason: null,
      end: 1500,
      everBelow0Lap: null,
      everBelow100Lap: null,
      everBelow200Lap: null,
      below0Crossings: 0,
      below100Crossings: 0,
      below200Crossings: 0,
      largestSingleLoss: 0,
      largestSingleLossReason: null,
      largestSingleLossLap: null,
      bankruptcyTriggerReasons: [],
    });
  }
  return {
    tracks,
    cashByPlayer,
    pressureEvents: [],
    nearMiss: {
      creditMin: 5,  creditMax: 5,
      resistanceMin: 2, resistanceMax: 2,
      capacityMin: 1, capacityMax: 1,
    },
  };
}

const __DIAG_origAdjustCash = adjustCash;
adjustCash = function(s, delta, reason, playerIdx) {
  if (playerIdx == null) playerIdx = s.activePlayerIndex;
  const before = s.players[playerIdx].cash;
  const result = __DIAG_origAdjustCash(s, delta, reason, playerIdx);
  const after = result.players[playerIdx].cash;
  if (DIAG_TELEMETRY) {
    const tel = DIAG_TELEMETRY.cashByPlayer[playerIdx];
    tel.end = after;
    if (after < tel.min) { tel.min = after; tel.minLap = result.lap; tel.minReason = reason; }
    if (delta < 0 && -delta > tel.largestSingleLoss) {
      tel.largestSingleLoss = -delta;
      tel.largestSingleLossReason = reason;
      tel.largestSingleLossLap = result.lap;
    }
    if (before >= 0 && after < 0) {
      tel.below0Crossings += 1;
      if (tel.everBelow0Lap === null) tel.everBelow0Lap = result.lap;
      tel.bankruptcyTriggerReasons.push({ lap: result.lap, reason, delta, after });
    }
    if (before >= 100 && after < 100) {
      tel.below100Crossings += 1;
      if (tel.everBelow100Lap === null) tel.everBelow100Lap = result.lap;
    }
    if (before >= 200 && after < 200) {
      tel.below200Crossings += 1;
      if (tel.everBelow200Lap === null) tel.everBelow200Lap = result.lap;
    }
  }
  return result;
};

const __DIAG_origAdjustTrack = adjustTrack;
adjustTrack = function(s, key, delta, reason) {
  const before = s.tracks[key].value;
  const result = __DIAG_origAdjustTrack(s, key, delta, reason);
  const after = result.tracks[key].value;
  if (DIAG_TELEMETRY) {
    const tel = DIAG_TELEMETRY.tracks[key];
    if (after < tel.min) tel.min = after;
    if (after > tel.max) tel.max = after;
    tel.end = after;
    if (tel.firstLapReached[after] === null) tel.firstLapReached[after] = result.lap;
    DIAG_TELEMETRY.pressureEvents.push({
      lap: result.lap,
      turn: result.turnIndex,
      actorIdx: result.activePlayerIndex,
      track: key,
      requestedDelta: delta,
      appliedDelta: after - before,
      before,
      after,
      reason,
    });
    const nm = DIAG_TELEMETRY.nearMiss;
    if (key === 'credit') { if (after < nm.creditMin) nm.creditMin = after; if (after > nm.creditMax) nm.creditMax = after; }
    if (key === 'resistance') { if (after < nm.resistanceMin) nm.resistanceMin = after; if (after > nm.resistanceMax) nm.resistanceMax = after; }
    if (key === 'capacity') { if (after < nm.capacityMin) nm.capacityMin = after; if (after > nm.capacityMax) nm.capacityMax = after; }
  }
  return result;
};

function classifyTrackSource(reason) {
  for (const act of ACTS) {
    if (reason === act.name + ' passed') return { type: 'Act', name: act.name };
  }
  for (const card of MARKET_SHOCK_CARDS) {
    if (reason === card.name) return { type: 'Market Shock', name: card.name };
    if (reason.startsWith(card.name + ':')) return { type: 'Market Shock', name: card.name };
  }
  for (const card of REPUBLIC_DEBATE_CARDS) {
    if (reason === card.name) return { type: 'Republic Debate', name: card.name };
    if (reason.startsWith(card.name + ':')) return { type: 'Republic Debate', name: card.name };
  }
  if (reason === 'Game start') return { type: 'Setup', name: 'Game start' };
  if (reason === 'Industrial Charter at setup') return { type: 'Setup', name: 'Industrial Charter' };
  if (reason === 'Default reset') return { type: 'Reset', name: 'Default reset' };
  if (reason === 'Rebellion reset') return { type: 'Reset', name: 'Rebellion reset' };
  if (reason === 'Speculation Scandal') return { type: 'Tax Space', name: 'Speculation Scandal' };
  const purchaseMatch = reason.match(/^(.+) enters production$/);
  if (purchaseMatch) return { type: 'Industrial Purchase', name: purchaseMatch[1] };
  return { type: 'Other', name: reason };
}

function runDiagnosisGame(seed, profileTriplet, charterEnabled) {
  DIAG_TELEMETRY = makeBlankTelemetry();
  const result = runBatchGame(seed, profileTriplet, charterEnabled);
  const tel = DIAG_TELEMETRY;
  DIAG_TELEMETRY = null;
  for (const ev of tel.pressureEvents) {
    const cls = classifyTrackSource(ev.reason);
    ev.sourceType = cls.type;
    ev.sourceName = cls.name;
    ev.actor = result.state.players[ev.actorIdx]?.name || null;
  }
  const finalState = result.state;
  const winnerIdx = (() => {
    let wi = 0, top = -Infinity;
    finalState.finalScores.forEach((sc, i) => { if (sc.total > top) { top = sc.total; wi = i; } });
    return wi;
  })();
  const bankruptcyEventsByPlayer = finalState.players.map(p => p.bankruptLaps);
  const bankruptcyEventsTotal = bankruptcyEventsByPlayer.reduce((a, b) => a + b, 0);
  const defaultFired = finalState.ledger.some(r => r.event === 'DEFAULT' && r.detail.startsWith('Public Credit = 0'));
  const rebellionFired = finalState.ledger.some(r => r.event === 'REBELLION');
  return {
    seed,
    profileTriplet: profileTriplet.slice(),
    charterEnabled: charterEnabled !== false,
    startingCharter: finalState.flags.startingCharter || null,
    winner: {
      profile: finalState.players[winnerIdx].profile,
      slotIndex: winnerIdx,
      influence: finalState.finalScores[winnerIdx].total,
    },
    scores: finalState.finalScores.map(sc => sc.total),
    players: finalState.players.map((p, i) => ({
      slot: i,
      profile: p.profile,
      finalCash: p.cash,
      finalInfluence: finalState.finalScores[i].total,
      scoreBreakdown: finalState.finalScores[i].breakdown,
      bankruptLaps: p.bankruptLaps,
      routesOwned: countOwnedRoutesByIdx(finalState, i),
      ownedAssetCount: p.ownedAssets.length,
      upgradedAssetCount: p.ownedAssets.filter(a => a.tier > 0).length,
      finalPosition: p.position,
      finalTracks: {
        credit: finalState.tracks.credit.value,
        resistance: finalState.tracks.resistance.value,
        capacity: finalState.tracks.capacity.value,
      },
    })),
    lapsReached: finalState.lap > TOTAL_ROUNDS ? (TOTAL_ROUNDS + 1) : finalState.lap,
    totalTurns: finalState.turnIndex,
    finalCapacity: finalState.tracks.capacity.value,
    defaultFired,
    rebellionFired,
    bankruptcyEvents: bankruptcyEventsTotal,
    bankruptcyEventsByPlayer,
    telemetry: tel,
  };
}

function runDiagnosisBatch(seeds, profileTriplet, charterEnabled, configName) {
  const games = [];
  for (const seed of seeds) {
    games.push(runDiagnosisGame(seed, profileTriplet, charterEnabled));
  }
  return {
    schemaVersion: 'sovereign-failure-pressure-diagnosis-v1',
    configName,
    profileTriplet: profileTriplet.slice(),
    charterEnabled: charterEnabled !== false,
    seedRange: [seeds[0], seeds[seeds.length - 1]],
    gameCount: games.length,
    generated: new Date().toISOString(),
    rulesetVersion: 'v0.10',
    pacingDiagRoundCount: TOTAL_ROUNDS,
    games,
  };
}

export {
  runBatchGame,
  runDiagnosisGame,
  runDiagnosisBatch,
  classifyTrackSource,
  setTotalRounds,
  getTotalRounds,
  ACTS,
  MARKET_SHOCK_CARDS,
  REPUBLIC_DEBATE_CARDS,
  SPACES,
  ASSETS,
  PROFILES,
  PROFILE_DEFAULT_NAMES,
};
