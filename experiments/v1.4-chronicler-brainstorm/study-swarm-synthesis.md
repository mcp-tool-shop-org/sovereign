# Sovereign v1.4 Chronicler — Study-Swarm Synthesis

**Date:** 2026-05-21
**Status:** Research complete; design proposal awaiting user review
**Base build:** v1.3 candidate (`SAVE_VERSION = 'v0.23-strategic-arc'`, currently committed at HEAD on `main`)
**Protocol fired:** research-grounded-advisor (study-swarm) per `C:/Users/mikey/.claude/projects/F--AI/memory/research-grounded-advisor-protocol.md`

---

## TL;DR

User cold-walked v1.3 successfully and asked "what is the historical narration supposed to be?" — proposing a Narrator who pops up between turns to flesh out historical implications and educate. The study-swarm dispatched 5 parallel agents (~40 sources cited) on narration in strategy / educational games.

The synthesis converges on **The Chronicler** — one named third-person narrative voice — with five concrete design rules:

1. **WHO:** Single named third-person Chronicler (not omniscient, not rotating figures, not Republic-as-I). Quotes period figures inline rather than impersonating them.
2. **VOICE:** Period-flavored via DICTION not GRAMMAR. Latinate abstract nouns, semicolon-joined parallels, present-tense historical framing. No thee/thou/forsooth.
3. **PACING:** Event-bound triggers only. Cap 6-8 lines per 23-round game. Per-round hard cap of 1. Non-blocking, dismissible-at-a-glance.
4. **SURFACE:** Three layers — always-visible 1-line caption (Twilight-Struggle), event-triggered Chronicler banner (Civ-quotation pattern), opt-in "Learn More" popover (Pentiment / CK tooltips).
5. **PEDAGOGY:** Reserve 60%+ of word budget for endgame Republic Summary (existing). Mid-game narration stays short; depth lives behind opt-in surfaces.

Total content budget for Tier A: ~6000-7500 words of static text.

---

## Why this study-swarm fired

User played v1.3 end-to-end on seed 2026, confirmed all gates work (Act vote, asset decision, opponent automation, auction handoff, circuit trigger, Final Accounting). Then asked the design question:

> "We need to keep building on the historical narration. Not sure what that's meant to be. Is there supposed to be an AI narrating it? I think we have them pop up in between turns better flush out the historical implications and the educate. So not just a historical narration, but a Narrator in general."

The existing narration system (v0.5, ~25-entry library + endgame Republic Summary) is mostly backloaded to endgame and quiet during play. The user's instinct is right: between-turn presence is missing.

The study-swarm explored: what does this "Narrator in general" actually look like, sourced from games and writing-craft that have solved similar problems?

---

## The five load-bearing questions

| # | Question | Why load-bearing |
|---|---|---|
| 1 | What narration patterns make historical strategy games engaging without feeling like a textbook? | Sovereign is teaching real Hamilton-era economic history; the narration must be lore-as-affect not lore-as-exposition |
| 2 | Single named voice vs multiple voices vs anonymous omniscient? | Hamilton and Morris already speak as AI characters; adding more named voices risks collision |
| 3 | How often should a Narrator appear? | Existing ~33 reactions/game is the noise floor; new Narrator content must not push past attention budget |
| 4 | How do games offer opt-in pedagogical depth without forcing it? | Some players want history; others want to play; the design must serve both |
| 5 | How do you write period-voice without faux-archaic gibberish? | Federalist-era register is the target; getting voice wrong is the most visible failure mode |

---

## Research findings (5 agents, ~40 sources)

### Thread 1 — Historical narration patterns

**Sources cited:**
1. **Civilization IV** (Firaxis, 2005, BGG 3093) — Tech quotation pattern: single 1-2 sentence quote from real historical figure, named + dated + event-triggered. Civilopedia carries long-form context but in-play surface is one line.
2. **Twilight Struggle** (Gupta + Matthews, GMT, 2005, BGG 12333) — Card carries 1-2 lines of historical caption beneath mechanical effect; the card *is* the history lesson. From the *For the People* lineage: mechanics should incentivize historical behavior, not just decorate it.
3. **Crusader Kings II** (Paradox, 2012; Fåhraeus GDC 2014) — Engagement payoff from scripted vignettes woven into a simulated world; short, character-named event cards that fire on systemic triggers, never on a fixed schedule.
4. **Through the Ages** (Chvátil, 2015, BGG 182028) — Card flavor text kept to single-line factual anchors about real-world counterparts; treat flavor as a knowledge hook, not narration.
5. **Pentiment** (Obsidian, Sawyer, 2022, Steam 1205520) — Authenticity from embedded specificity (real holy day, real food, real political faction) — not from explanatory voiceover. The narrator never lectures; the world cites itself.
6. **Lisboa / Vinhos** (Lacerda, 2017/2010) — Theme is built first, mechanics serve it, historical context lives in component naming and action-cause-effect — not in a separate text layer.
7. **Anno 1800** (Ubisoft Mainz, 2019) — When narration tries to *summarize* the era it reads as marketing copy; when it *embodies* a specific stakeholder's voice (worker, investor, politician), the same content lands as story.
8. **Anderson, "The interactive museum"** (*E-Learning and Digital Media*, 2019, DOI 10.1177/2042753019834957) — Empirical: lore-as-affect (short, in-character, event-triggered) outperformed lore-as-exposition (textbook panels) for both recall and self-reported engagement across 4 history games.

### Thread 2 — Narrator voice (single vs multiple vs anonymous)

**Sources cited:**
1. **The Civil War** (Burns / Ward, PBS 1990) — McCullough narrates third-person omniscient historian; period figures (Lincoln, Douglass) speak in their own words when quoted inline.
2. **Hamilton: An American Musical** (Miranda, 2015) — Burr narrates 95% of the show, but Miranda hands the narrator role to Angelica for Philip's death, Eliza for the finale. **Primary voice with delegated moments outperforms evenly-rotated chorus.**
3. **The Stanley Parable** (Wreden + Pugh, 2013) — Kevan Brighting's single Narrator so dominant that the game itself is described in-fiction as his biased construction. One strong named voice can carry an entire interactive work.
4. **Disco Elysium** (ZA/UM, 2019) — 24 internal skill-voices work *only because the protagonist is the site of fracture*; for an external historical chronicle, 24 voices would dissolve coherence.
5. **Civilization advisors** (Sid Meier / Firaxis, 1991+) — 4 domain-specialists each speak in their own register on their own beats — but only when consulted. They never narrate the broader arc.
6. **Twilight Struggle** (Gupta + Matthews, 2005) — Frames the game with a JFK speech excerpt; everything else is omniscient third-person on cards. Named voice once as framing.
7. **Pax Pamir 2E** (Wehrle, 2019, BGG 256960) — Cards depict named historical figures, but system text around them stays neutral — figures are subjects, not narrators.
8. **Crusader Kings 3** (Paradox, 2020) — Anonymous omniscient second-person ("Your vassal approaches…") generalizes across thousands of events. Community-driven TTS mods note: a *named* voice would need consistent character across all of them.

**Recommendation from agent:** Single named third-person Chronicler who **quotes period figures inline** (Burns/Hamilton hybrid). One consistent voice for the narrative spine; named historical figures are *quoted* by the Chronicler, not impersonated.

### Thread 3 — Narrator pacing / frequency

**Sources cited:**
1. **Disco Elysium** (ZA/UM, 2019; Final Cut 2021) — 24 skill voices fire on dialogue checks and environmental triggers, never on a timer. Event-conditioned speech rises with player activity, falls during exploration.
2. **Pentiment** (Sawyer, Obsidian, 2022) — Chapter-level reframing rather than scene-by-scene narration. Narrative weight attaches to *consequence boundaries* (act breaks, time skips), not incidental moments.
3. **Crusader Kings II/III** — Community complaints concentrate on *unskippable, blocking* popups; Paradox's message-settings UI exists because priority-tiered, non-blocking events are the only sustainable cadence.
4. **Civilization advisors** (1991+) — Pull-on-demand (player opens the screen), not push-per-turn. "One more turn" loop survives because advisor commentary doesn't interrupt unless asked.
5. **Pandemic Legacy: Season 1** (Daviau + Leacock, 2015) — Legacy Deck delivers narration *before and after each month*, not during play. TV-show structure with cliffhangers gated by state-change milestones.
6. **This War of Mine: The Board Game** (Awaken Realms, 2017) — Book of Scripts (~2,000 paragraphs) fires only on specific card-triggered entries. Trigger model is sound; manual lookup overhead is the cost.
7. **The Anomalous Host, "Narration in Board Games"** (2021) — Core argument: "the game should be fun without the narrative, but the narrative should enhance the fun." Fails when details don't map to mechanical state.
8. **Slay the Princess** (Black Tabby, 2023) — Narrator fires at player-decision inflection points; high volume tolerated because each line is consequence-bound.

**Pacing rules from agent:**
- Event-bound, never timer-bound; cap 6-8 lines/game
- Non-blocking, dismissible-at-a-glance, per-round hard cap of 1
- Structural-boundary weighting; reserve 60%+ of word budget for endgame

### Thread 4 — Opt-in pedagogical depth

**Sources cited:**
1. **Civilopedia** (Bruce Shelley / MicroProse, 1991+) — In-game encyclopedia, "?" icon in corner, always reachable, never blocks turns. 30+ years of survival across Civ I-VII.
2. **Crusader Kings II/III** (Paradox, 2012/2020) — Tooltips-in-tooltips: hover any underlined term, surface tooltip; underlined terms inside that tooltip surface another. Configurable hover-to-lock.
3. **Pentiment** (Obsidian, 2022) — Underlined words press to "zoom out" — game frame becomes a still illustration in a manuscript, glossary entry appears in the margin. Diegetic glossary uses game's own visual frame.
4. **Twilight Struggle** (Gupta + Matthews, 2005) — Every event card carries a small photo and 1-2 lines of historical flavor; text always visible but never required. Teaches by exposure across many plays.
5. **Through the Ages** designer-notes site (Chvátil, 2015) — Dedicated post-play surface (throughtheages.com/notes) outside the rulebook. Segregation signals "this is optional reading" by location.
6. **Vital Lacerda games** (Eagle-Gryphon, 2014+) — Theme-first design; mechanics taught alongside the historical narrative they model; rulebooks structured step-by-step, modular.
7. **Polytopia** (Midjiwan, 2016) — Tribe-celebration screens release 2-3 sentence lore blurbs tying mechanical asymmetry to a real-world cultural inspiration. Short, mechanic-anchored blurbs (under 60 words).

**Patterns from agent:**
- Italicized "Learn more" affordance on every Federal Era Event banner (Pentiment + CK)
- Persistent Chronicler corner-icon glossary (Civilopedia)
- Always-visible 1-line "card flavor" on Event banners + separate Designer's Notes screen (Twilight Struggle + TTA)

### Thread 5 — Period-voice writing craft

**Sources cited:**
1. **Hamilton: The Revolution** (Miranda + McCarter, 2015, Grand Central) — Modern syntax with period-specific vocabulary. Hamilton's actual word stock (consequence, calumny, legacy) anchors authenticity while sentence rhythm stays accessible.
2. **John Adams** (HBO, Ellis screenplay, 2008) — Adapted McCullough by lifting actual letters wholesale. Primary-source extraction outperforms invented archaism.
3. **1776** (Stone + Edwards, 1969 musical / 1972 film) — Latinate abstract nouns (independence, posterity, obstinacy) + periodic sentences (subordinate clauses front-loaded).
4. **Hilary Mantel, Reith Lectures** (BBC, 2017) — Load-bearing rule: "Don't use a word your character wouldn't have used, but don't reach for archaic words to prove it." Authenticity is subtractive.
5. **Bernard Cornwell, "Writing Historical Fiction"** (bernardcornwell.net, 2010) — Avoid thee/thou/forsooth entirely (already archaic by 1790, read as Renaissance-faire). Use modern grammar with period concrete nouns.
6. **The Federalist Papers** (Hamilton/Madison/Jay, 1787-88, Library of America) — Direct primary-source: semicolon-joined parallel triplets, abstract Latinate nouns (establishment, consolidation, apprehension), deliberative subjunctive.
7. **Pentiment** (Sawyer, 2022) — Register tiers: peasants get plainer English, clerics get Latinate constructions, scribes get most ornamented. Consistency within speaker, variation between speakers.
8. **McCullough / Ellis Founding Brothers narration** — Present-tense historical framing ("Hamilton calculates… Jefferson watches… the bank holds") — period-flavored but modern, creates immediacy without grammatical antiquing.

**Prescriptions from agent:**
- DICTION over GRAMMAR: Latinate abstract nouns, period concrete referents. Avoid thee/thou/hath/doth/verily/'tis.
- Periodic sentences + semicolon triplets. Avoid simple SVO sequences, exclamation marks, rhetorical questions.
- Present-tense historical voice + register consistency across all narrator surfaces. Avoid mixing registers, second-person address to the player.

---

## The Chronicler — Unified Design Proposal

### Who

**A single named third-person Chronicler.** Not omniscient (too generic), not rotating historical figures (collides with Hamilton / Morris AI voices), not Republic-as-first-person (twee without psychological grounding).

The Chronicler is the narrative spine. When a specific historical figure would have said something specific, the Chronicler **quotes them by name and date** rather than impersonating them.

> Example: "The Chronicler notes: Madison wrote in Federalist 10 that 'the regulation of these various and interfering interests forms the principal task of modern legislation.' The Funding Act now puts that claim to its first test."

This pattern is borrowed from Ken Burns (third-person spine + named-actor quotations) and Hamilton (primary narrator + delegated handoffs). It also avoids voice collision with Hamilton/Morris AI opponents — they continue speaking as AI characters; the Chronicler quotes *other* period figures (Madison, Jefferson, Adams, Gallatin, Maclay, journalists like Fenno or Freneau).

### Voice

**Period-flavored via DICTION not GRAMMAR.**

**USE:**
- Latinate abstract nouns from the Federalist Papers: *establishment, consequence, apprehension, consolidation, credit, calibration, the Republic, the manufactories, the public faith, prudence, posterity*
- Concrete period referents: *the bank, the assumption, the tariff, the floor, the cabinet*
- Semicolon-joined parallel triplets: "Hamilton secures the bank; Madison loses the floor; the credit of the Republic holds."
- Periodic structure (subordinate clause first): "Should the assumption fail, the manufactories must wait."
- Deliberative framing: "It is the consequence of the season that…"
- Present tense throughout: "The season turns; the ledgers open."

**AVOID:**
- thee, thou, hath, doth, verily, forsooth, 'tis — Shakespearean / Renaissance, NOT Federalist
- Modern colloquialisms: gonna, sort of, deal with, figure out, kind of, big-time
- Simple SVO sequences: "Hamilton won. Madison lost. Money came in."
- Exclamation marks and rhetorical questions (anachronistically broadcaster-flavored)
- Mixed registers within the library (one tonal break ruins the deterministic set)
- Second-person address to the player ("you must consider…") — the Chronicler observes the Republic, not the reader

### When (Pacing)

**Event-bound triggers only. Per-round hard cap of 1. Cap 6-8 Chronicler lines per 23-round median game.**

Trigger priority order (if multiple events qualify in one round, top priority fires; lower-priority deferred or dropped):

| Priority | Trigger | Words | Frequency (typical) |
|---|---|---|---|
| 1 | Crisis tier escalation (Public Doubt / Crisis / Panic / Default) | 50-80 | ~1-2/game |
| 2 | Act passing in rounds 1-7 | 60-100 | ~1.1/game median |
| 3 | Circuit-trigger Final Accounting | 80-120 | 1/game |
| 4 | Federal Era opening (round 8) | 60 | 1/game always |
| 5 | Vision achievement | 50-80 | ~1/game across players |
| 6 | Round opener (rare, ~every 3-4 rounds) | 40-60 | 2-3/game |
| — | **Endgame Republic Summary** | **300-500** | **always — the closing chapter** |

Non-blocking, dismissible-at-a-glance. Coexists with existing reactions (~33/game) and Federal Era Events (~15.7/game) as a tiered banner — never gates play.

60%+ of word budget lands in the endgame Republic Summary, matching Pentiment's act-boundary weighting + Pandemic Legacy's TV-season cliffhanger pattern.

### Surface (three layers)

**Layer 1 — Always-visible 1-line italic caption on Federal Era Event banners (Twilight Struggle pattern).**

Every Federal Era Event banner already shows event name + mechanical effect + choice buttons. ADD a small italic line beneath the event text — 1 sentence of historical flavor, always visible, never required to play.

> Example: "*Creditors Demand Payment — In 1791 the Bank of the United States opened subscriptions in Philadelphia; demand was double the supply within hours.*"

Teaches by exposure across many plays without ever pausing the game.

**Layer 2 — Chronicler banner on priority-1-3 triggers (Civilization quotation pattern).**

When a Crisis tier escalates, an Act passes, or circuit-victory fires, surface a Chronicler banner: 50-100 words in the Chronicler's voice, dismissible toast/banner that does NOT block play.

> Example on Funding Act passing: "The Chronicler notes: Hamilton's *Report on Public Credit* argued in January 1790 that 'a national debt, if it is not excessive, will be to us a national blessing.' The Funding Act passes; the Republic's first promise to its creditors is made."

**Layer 3 — Opt-in "Learn More" popover (Pentiment + Crusader Kings tooltips).**

Every Federal Era Event banner gets an italic "*Learn more*" link in the lower-right corner. Clicking opens a side-panel popover: ~150-200 words of real-history context — year, key figures, vote outcome, real historical effect, why Sovereign models it this way.

Does NOT block play; opponent turns continue. Closing returns to same point.

Content: ~6-10 Learn More entries × 180 words = ~1500 words.

### Pedagogy

The Chronicler is teaching real Hamilton-era economic history, but **teaches by exposure not by lecture**. Three principles applied across all three surfaces:

1. **Embedded specificity over summary** (Sawyer / Pentiment): name the real date, the real figure, the real outcome. Don't summarize "the early Republic"; cite "the Funding Act of January 1790."
2. **Lore-as-affect over lore-as-exposition** (Anderson 2019): make the historical content map directly to the mechanical event the player just caused. Empirical evidence shows recall and engagement both rise.
3. **Civilopedia survival pattern**: opt-in depth lives in a persistent, low-cost-to-reach surface. The 30-year Civilopedia survival is the strongest documented evidence that this works.

---

## Tier A — v1.4 Chronicler Vertical Slice

**Scope: ship the smallest coherent Chronicler that proves the design works in cold play.**

1. **Single named Chronicler voice.** Period diction + present tense + semicolon parallels. Voice guide written once and applied consistently across the library.
2. **Event-bound triggers only.** Priority-tiered, per-round hard cap of 1, non-blocking. Triggers: Crisis tier change, Act passing, Federal Era opening (R8), circuit-trigger Final Accounting, Vision achievement.
3. **Twilight-Struggle style 1-line italic caption** on every Federal Era Event banner. Always visible, always skippable, teaches by exposure.
4. **Chronicler banner** on priority-1-3 events. 50-100 words. Quotes named period figures inline (Hamilton from Federalist papers, Madison, Jefferson, Adams, Gallatin, etc.).
5. **Endgame Republic Summary** reframed as the Chronicler's closing entry. Extend the existing 300-500 word piece with a Chronicler frame: "And so the Chronicler closes the ledger on this Republic…"

**Deferred to Tier B (v1.5):**
6. Persistent Chronicler's Ledger icon (Civilopedia-style searchable encyclopedia)
7. "Learn More" italic popover on Federal Era Events (180-word per-event expansion)
8. Designer's Notes main-menu entry (Through the Ages post-play surface)
9. Nested term-tooltips for economic vocabulary (specie, scrip, sinking fund, assumption)

**Content budget for Tier A:**
- ~6-10 Chronicler event banners × 80 words = ~600 words
- ~8-10 Federal Era Event captions × 1 sentence = ~150 words
- ~3-5 round-opener lines × 50 words = ~200 words
- Endgame Republic Summary extension ~500 words (existing + Chronicler frame)
- Voice guide / style sheet (internal doc) ~300 words
- **Total Tier A: ~1750 words of new static text + voice guide**

That's a real writing project but bounded. Tier A is the "prove the design works" slice; the heavy Learn More + glossary content (~5000 words) is Tier B once the voice is validated.

---

## Hard constraints

- **Preserve v1.3 strategic arc completely.** Federal Era Events, Visions, special actions, reactions, held cards, Reform, multi-stage Credit pressure — all untouched.
- **Deterministic only.** No LLM, no network calls. Chronicler library is a static JSON/JS blob indexed by ledger state + seed-derived selection.
- **No collision with existing voices.** Hamilton and Morris keep their AI character voices. Federal Era Event text keeps its event-specific voice. Reactions library keeps its per-profile snippets. The Chronicler is the fourth voice and the only third-person omniscient one.
- **Voice consistency.** Every Chronicler line must read as if drawn from the same hand. One tonal break in the deterministic set is visible to attentive players.
- **Skip-able for fast replay.** Every Chronicler surface must be dismissible at a glance. Reaction-style toast pattern, not modal-pop-up pattern.

---

## Open questions for v1.4 design call

1. **Tier A scope confirmation** — is the 5-item Tier A slice (Chronicler voice + event banner + Twilight-Struggle caption + endgame frame) the right opening, or do you want to include the "Learn More" popover (item 7) in Tier A?
2. **Chronicler name** — "The Chronicler" is generic. Period-flavored alternatives: "The Republic's Clerk", "The Federal Gazette", "The Treasury's Witness", "A Federal Era Chronicler". None of them grab; "The Chronicler" works fine if we don't have a stronger candidate.
3. **Writing budget** — Tier A is ~1750 words of new text. Is that drafted by Claude Design (rough draft for refinement) or written by you (slower but voice-controlled from start)?
4. **Period-figure quotation library** — should the Chronicler quote real Hamilton/Madison/Jefferson lines (Federalist Papers, real letters, real speeches), or invent period-voice attributions? Real quotations are more authentic but constrained by what's documented; invented attributions are flexible but risk anachronism. Hybrid (real where available, invented in voice where needed) is probably the right answer.
5. **Late Republic emptiness as a Chronicler target?** v1.3 closed the empty-window gap from 8/100 → 2/100 with Federal Era Events. Should the Chronicler ALSO fire occasional round-opener lines in long Federal Era stretches to add atmosphere, or is the v1.3 Event cadence sufficient?

---

## Process notes

- **Protocol fired:** research-grounded-advisor (study-swarm) per CLAUDE.md standing rule
- **Trigger:** user typed "Study Swarm please" after asking what historical narration should become
- **Agent count:** 5 parallel general-purpose agents (single message, parallel execution)
- **Agent return time:** ~45-110 seconds each
- **Source count:** ~40 across all 5 agents (games, books, screenplays, design talks, designer interviews, academic papers, critic reviews, primary historical sources)
- **Source quality:** every implication traces to at least one named designer / writer / scholar + year + canonical reference + URL
- **Final design call:** user

---

## Canonical source list (~40 sources)

### Games
- Civilization (Sid Meier / MicroProse, 1991+) — Civilopedia + advisors + tech quotations
- Twilight Struggle (Gupta + Matthews, GMT, 2005, BGG 12333)
- Through the Ages: A New Story of Civilization (Chvátil, CGE, 2015, BGG 182028)
- Crusader Kings II / III (Paradox, 2012 / 2020)
- Civilization IV (Firaxis, 2005, BGG 3093)
- Pax Pamir 2E (Wehrle, 2019, BGG 256960)
- Lisboa / Vinhos (Vital Lacerda, 2017 / 2010, BGG 220308 / 65244)
- Anno 1800 (Ubisoft Mainz, 2019)
- Pentiment (Obsidian, Sawyer, 2022, Steam 1205520)
- Disco Elysium (ZA/UM, 2019; Final Cut 2021)
- The Stanley Parable (Wreden + Pugh, 2013)
- Slay the Princess (Black Tabby, 2023)
- Polytopia (Midjiwan, 2016)
- Pandemic Legacy: Season 1 (Daviau + Leacock, Z-Man, 2015)
- This War of Mine: The Board Game (Awaken Realms, 2017)
- Detective: A Modern Crime Boardgame (Portal, 2018)
- 1830 / 18xx games (Tresham, 1986+)
- Brass: Birmingham (Wallace + Schnoebelen, 2018)

### Film / TV / Theater
- The Civil War (Burns / Ward, PBS, 1990)
- Hamilton: An American Musical (Miranda, 2015)
- John Adams (HBO, Kirk Ellis screenplay, 2008)
- 1776 (Stone + Edwards, 1969 musical / 1972 film)
- Ken Burns Founding Brothers segments

### Books / Designer texts / Academic papers
- The Federalist Papers (Hamilton/Madison/Jay, 1787-88)
- Hamilton: The Revolution (Miranda + McCarter, 2015)
- Founding Brothers (Joseph Ellis, 2000)
- John Adams (David McCullough, 2001)
- Hilary Mantel Reith Lectures: Resurrection: The Art and Craft (BBC, 2017)
- Bernard Cornwell, "Writing Historical Fiction" essay (2010)
- Anderson, Sky LaRell, "The interactive museum" (E-Learning and Digital Media, 2019, DOI 10.1177/2042753019834957)
- Muro 2025 on Hamilton narrator analysis (Sage Journals)

### Designer talks / Postmortems / Interviews
- Henrik Fåhraeus, "Emergent Stories in Crusader Kings II" (GDC 2014)
- Tom Lehmann, GDC 2018 Board Game Design Day
- Mac Gerdts, Origin Stories interview (BGG)
- Josh Sawyer interviews on Pentiment (SHARP, MMORPG.com, The Gamer, Shacknews, 2022-24)
- Vital Lacerda interviews (Games Precipice, Quackalope, Cardboard Republic)
- Jamey Stegmaier on Automa Factory design
- Twilight Strategy designer's notes
- Through the Ages designer's notes (throughtheages.com/notes)

### Critic / Analyst sources
- The Anomalous Host, "Narration in Board Games" (2021)
- Game Developer postmortem on Pentiment (2023)
- Game Developer deep dive on Slay the Princess
- PC Gamer Anno 1800 industrial revolution critique
- Bozos Guide Pandemic Legacy retrospective
- Meeple Mountain This War of Mine review
- BoardGameGeek threads (multiple cited inline)
