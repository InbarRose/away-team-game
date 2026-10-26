# AWAY TEAM — AGILE PROJECT MANAGEMENT & STATUS TRACKER

> **Last Updated:** 2026-10-24  
> **Current Phase:** ALL ITERATIONS COMPLETE (Iterations 0–12 Delivered & Verified)  
> **Completed:** All 208 `/game/` Markdown files, Automated Manifest Exporter (`manifests/generate_manifests.js` + 12 JSON exports), SVG Icon Suite (`assets/`), Astro + React/TS Wiki, Card Browser, Virtual Tabletop (`src/`), and GitHub Pages CI/CD (`.github/workflows/deploy.yml`).

---

## 1. AGILE PROCESS & INTERRUPTION-SAFE WORKFLOW

To ensure we never lose work to interruptions or timeouts and to keep Git commits small and atomic:

1. **One Atomic Iteration Per Turn (or Sub-Batch):** Each iteration is scoped to a cohesive, small set of files.
2. **Update Tracker Before Stopping:** At the end of each iteration, `PROJECT_STATUS.md` is updated with `[x]` for completed items and notes on what is next.
3. **Commit Checkpoint:** After each iteration completes, we pause (or notify) so you can `git commit` that atomic slice cleanly.
4. **Session Recovery Protocol (If Interrupted):**
   * Run `git status` and read `PROJECT_STATUS.md`.
   * Check which tasks in the current iteration are already on disk vs. remaining.
   * Resume from the exact unfinished file without redoing completed work.

---

## 2. ARCHITECTURE & DESIGN DECISION LOG (ADRs)

| ID | Date | Decision | Rationale / Source |
| :--- | :--- | :--- | :--- |
| **ADR-01** | 2026-10-24 | **Atomic Iteration Workflow:** Create `AGENT_PLAN.md` and `PROJECT_STATUS.md` first, pause for commit, and execute the repository transformation in small, committable agile increments. | Prevents lost work on interruption and matches user preference for frequent atomic commits. |
| **ADR-02** | 2026-10-24 | **Authoritative Ruleset:** Use `docs/original_design_document_dump/away team economy abilities and cards.md` as the canonical v1.0 system spec (**Effort**, **Focus**, **Momentum**, **5-Facility Sponsored HQ**, **Med Bay & Critical Trauma Engine**, **8 Factions with Loyalty Tiers**, **9.0 ES Budget**), while preserving compatible lore and character names from `away team v3 draft.md` and `Memory draft away team July 18.md`. | Consolidates the design evolution into a single coherent, mathematically balanced rulebook. |
| **ADR-03** | 2026-10-24 | **24-Operative Roster Synthesis:** Map the named characters from earlier drafts (e.g., Sarah "Specter" Croft, Marcus "The Anvil" Vance, Dr. Aris Thorne, Kaelen "Echo" Cross, Soren de Witt, etc.) onto the 24-Agent Focus Matrix (`Agents 01–24` across Soldier, Recon, Survivalist, Scientist, Diplomat, Technician) and complete remaining operatives/powers using the **9.0 ES budget formula**. | Gives all 24 specialist cards rich narrative identity AND exact mathematical balance. |
| **ADR-04** | 2026-10-24 | **Web Stack:** Use **Astro + React/TypeScript** for the GitHub Pages platform (`src/`). | Ideal hybrid for fast static Markdown documentation/wiki pages + interactive React/TS islands for the Card Browser and Virtual Tabletop (VTT). |
| **ADR-05** | 2026-10-24 | **Custom Domain (`awayteam.inbarrose.com`):** Configure `public/CNAME`, `astro.config.mjs` (`site: 'https://awayteam.inbarrose.com'`, `base: '/'`), and `.github/workflows/deploy.yml` for root-path subdomain hosting, plus `manifests/serve_local.js` for zero-dependency local previewing. | Eliminates subdirectory path prefixing (`/repo-name/`) and enables instant local and production hosting. |
| **ADR-06** | 2026-10-24 | **Atomic Commits, Side-Branch PR Workflow & 4-Suite Automated Testing:** Enforce atomic commits on side branches, PRs to `main`, and `.github/workflows/test-pr.yml` running 4 test suites (`tests/01` through `tests/04`) covering structure, schema, `9.0 ES` game math, and VTT functionality. | Guarantees structural, mathematical, and functional integrity on every PR before merging to `main`. |
| **ADR-07** | 2026-10-24 | **Dedicated Wiki Pages, Inter-Clicky Links & 4-Tier Currency Taxonomy:** Replace modal popups with dedicated Wiki pages (`#/wiki/component/<id>`, `#/wiki/focus/<focus>`, `#/wiki/class/<class>`, `#/wiki/concept/currencies`), normalize all 208 Markdown files to unified compound tokens (`[+1 CR]`, `[2 EF]`, `[10 LOY]`, `[+3 VP]`), and explicitly separate the 3 Primary Currencies (`[CR]`, `[EF]`, `[PIP]`) from transient Mission Momentum (`[MOM]`), Operative Loyalty rank (`[LOY]`), and Meta Trackers (`[DOOM]`, `[VP]`). | Makes the Wiki far easier to read, navigate, and cross-reference without changing any game rules. |
| **ADR-08** | 2026-10-24 | **Auto-Merge PR Workflow & Design Companion Backlog (`BACKLOG.md`):** After committing atomic increments on a side branch, running local test suites (`npm test`), and opening a Pull Request to `main`, automatically verify CI checks and **merge the PR into `main`**. Maintain `BACKLOG.md` to track design companion rule audits, edge-case questions, VTT simulator findings, and product backlog items without altering game rules prematurely. | Ensures `main` and GitHub Pages stay continuously up to date and establishes a structured design-companion feedback loop. |
| **ADR-09** | 2026-10-25 | **Internal Design Documentation Split, Mission Failure Thematic Refactor (`[FAIL]`), & Rules Feedback Resolution:** Split internal balancing, ES math, probability curves, and anti-dilution theory into `docs/design/` and web portal tab (`#/wiki/design`), keeping `/game/core/` strictly player-facing (with new Chapter 8 `table_setup_and_glossary.md`). Thematically reframe "Doom" to **Mission Failure Tracker** (`[FAIL]`) triggering **Task Force Dissolution**. Codify resolved rules feedback: (1) dual-stream payouts (`BL-RULES-01`), (2) Dying Breath rule (`BL-RULES-02`), (3) stabilization and loot priority (`BL-RULES-03`), (4) zero-bid d6 roll-off (`BL-RULES-04`), and (5) Technician Early Resolution (`BL-RULES-05`). | Cleanly separates player-facing instructions from developer theory, grounds narrative immersion in corporate sci-fi, and eliminates core rules timing ambiguities. |
| **ADR-10** | 2026-10-25 | **Rules 06–08 Codification & Balance Model Intent Confirmations (BL-BAL-01 to 03):** Formally codify designer decisions on remaining rules backlog items: (1) Scientist *Dual-Vector Mapping* initiative promotion to Phase 1 (`BL-RULES-06`), (2) Dynamic Split-Effect Stage Modifier evaluation following *Tactical Bypass* / *Force Breach* (`BL-RULES-07`), and (3) Medically Grounded Protocol barring 0 Max HP operatives from mission deployment (`BL-RULES-08`). Confirm intentionality of core mathematical balance properties: Momentum as high-variance rebate (`BL-BAL-01`), glass-cannon fragility driving defensive itemization (`BL-BAL-02`), and accelerated 3P Vanguard Loyalty velocity driving aggressive auction bids (`BL-BAL-03`). | Closes all open rules backlog items with author sign-off and preserves intentional game-feel balance tensions. |

---

## 3. SPRINT BACKLOG & PROGRESS TRACKER

### ✅ Iteration 0: Project Architecture & Agile Setup (COMPLETE)
- [x] Read and analyze all 3 design documents in `docs/original_design_document_dump/`.
- [x] Align on ruleset authority, 24-character synthesis, web stack, and atomic pacing.
- [x] Create `AGENT_PLAN.md` with full directory structure, semantic tokens, YAML frontmatter schema, and component inventory.
- [x] Create `PROJECT_STATUS.md` with ADR log, recovery protocol, and granular iteration backlog.

---

### ✅ Iteration 1: Directory Scaffolding & Core Rulebook (`/game/core/`) (COMPLETE)
*Goal: Scaffold the directory tree and author the 8 authoritative Core Rulebook chapters under `/game/core/`.*
- [x] Create directory structure (`/game/` subdirectories, `/assets/`, `/manifests/exports/`, `/src/`).
- [x] `game/core/rules_overview.md` — Core concept, semi-co-op paradox, player count scaling (1–4P & Vanguard Auction), stage resolution sequence.
- [x] `game/core/dice_system.md` — Static Pool paradigm, Focus thresholds (3+ Primary, 4+ Secondary, 5+ Out of Focus), Backfire (natural 1s), Operational Momentum ($\ge D+2$).
- [x] `game/core/classes_and_focus.md` — The 50/35/15 Skewed Focus Pyramid, the 6 Core Classes (Soldier, Recon, Survivalist, Scientist, Diplomat, Technician), and their 1-Effort Class Abilities.
- [x] `game/core/squad_leader_command.md` — Command Auction, Tie-Breaker hierarchy, Executive Authority, Logistical Refresh (2/3 Effort), Dynamic Focus Swaps (Force Breach / Tactical Bypass), Tactical & Forced Retreats.
- [x] `game/core/medbay_trauma.md` — 0 HP Stabilization protocol, Field Casualty drops & Vulture Tax, Med Bay bed capacity & Healing Dice (5+/4+), Critical Injury tokens vs. Permanent Trauma tokens.
- [x] `game/core/vault_economy.md` — Faction Vaults, Credits `[CR]`, Effort `[EF]`, `[PIP]`, Loyalty `[LOY]`, Dead Pool Martyrdom, 8-Step HQ Downtime flow, Stand-Down Auction, Recruitment & Quartermaster.
- [x] `game/core/campaign_engine.md` — Campaign structure (3–5 missions), Doom Tracker, Retry budgets & narrative framing, Continuous Drops (`[No HQ]`), Safehouse Protocol (`[Facility]`), Endgame VP tally.
- [x] `game/core/math_and_balance.md` — Expected Success (ES) atomic conversion chart, stage difficulty formulas, and the 9.0 ES Character Creation Budget.

---

### ✅ Iteration 2: Factions (`/game/factions/`) & HQ Infrastructure (`/game/hq/`) (COMPLETE)
*Goal: Create all 8 Faction Dossiers (with 4-tier Loyalty trees & `art_spec`) and HQ Facilities/Landmarks.*
- [x] **8 Faction Files (`/game/factions/`):**
  - [x] `faction-aegis.md` (Aegis Tactical Directorate)
  - [x] `faction-nexus.md` (Nexus Cybernetics & Data)
  - [x] `faction-vanderbilt.md` (Vanderbilt Sovereign Group)
  - [x] `faction-obsidian.md` (Obsidian Syndicate)
  - [x] `faction-titan.md` (Titan Heavy Logistics)
  - [x] `faction-ascendant.md` (Ascendant Bio-Tech)
  - [x] `faction-aurelius.md` (Aurelius Media & Political Lobby)
  - [x] `faction-ironclad.md` (Ironclad Extraction Scavengers)
- [x] **9 HQ Facility & Landmark Files (`/game/hq/`):**
  - [x] `hq-infirmary.md` (Baseline + Surgical Wing, Trauma Cybernetics, Gene-Stasis Tank)
  - [x] `hq-quartermaster.md` (Baseline + Black Market Terminal, Bulk Logistics, Custom Workshop)
  - [x] `hq-recruitment-bureau.md` (Baseline + Headhunter Network, Signing Bonus Incentives, Academy Fast-Track)
  - [x] `hq-intel-array.md` (Baseline + Satellite Telemetry, Covert Desk, Signal Jammer)
  - [x] `hq-boardroom.md` (Baseline + Executive Suite, Lobbying Network, Press Office)
  - [x] `hq-landmark-cryo-stasis.md` (Cryo-Stasis Chamber)
  - [x] `hq-landmark-supply-lines.md` (Supply Lines)
  - [x] `hq-landmark-war-room.md` (The War Room)
  - [x] `hq-landmark-tactical-simulator.md` (Tactical Simulator)

---

### ✅ Iteration 3: The 24 Specialist Operatives (`/game/characters/`) (COMPLETE)
*Goal: Create all 24 Specialist Operative cards mapped to the 24-Agent Focus Matrix, 9.0 ES budget, named characters, and `art_spec`.*
- [x] **Soldier Class (`agent-01` to `agent-04`):** Commander, Pointman, Breacher, Juggernaut.
- [x] **Recon Class (`agent-05` to `agent-08`):** Guerrilla, Saboteur, Ghost Point, Prowler.
- [x] **Survivalist Class (`agent-09` to `agent-12`):** Ranger, Sentinel, Vanguard Tracker, Outpost Mechanic.
- [x] **Scientist Class (`agent-13` to `agent-16`):** Combat Medic, Field Biologist, Virologist, Systems Architect.
- [x] **Diplomat Class (`agent-17` to `agent-20`):** Political Enforcer, Crisis Coordinator, Spymaster, Black-Ops Envoy.
- [x] **Technician Class (`agent-21` to `agent-24`):** Combat Slicer, Hardware Mechanic, Cryptologist, EOD Drone Operator.

---

### ✅ Iteration 4: Armory Items Part 1 — Handheld Equipment (`/game/items/handheld_t1/` & `handheld_t2/`) (COMPLETE)
*Goal: Create all 28 Handheld 1-Handed and 2-Handed item templates with full YAML frontmatter and `art_spec`.*
- [x] **Tier 1 1-Handed (10 items):** Standard Issue Sidearm (6 copies), Tactical Slicer Deck, Mag-Lock Bypass Rig, Corporate Audit Node, Bio-Hazard Sensor Array, Tactical Multi-Tool, Diplomatic Envoy AI, Fiber-Optic Micro-Recon Probe, Psychometric Dossier Pad, Holographic ID Emitter.
- [x] **Tier 1 2-Handed (6 items):** Tactical Assault Rifle (3 copies), Heavy Operations Terminal, Industrial Hazard Cutter, Long-Range Telemetry Array, Thermal Infiltration Disruptor, Holo-Broadcast Comm Unit.
- [x] **Tier 2 1-Handed (6 items):** Heavy Smart-Pistol, Tactical Hazard Sidearm, Spec-Ops Recon Sidearm, Executive Enforcer Sidearm, Covert Eliminator Sidearm, Omni-Agency Command Rig.
- [x] **Tier 2 2-Handed (6 items):** Heavy Rotary Cannon (3 copies), Quantum Processing Terminal, Industrial Thermal Cutter, High-Gain Deep-Scanner, Active Camo Field Emitter, Sub-Neural Broadcast Rig.

---

### ✅ Iteration 5: Armory Items Part 2 — Single-Slot Wearables (`/game/items/wearables_t1/` & `wearables_t2/`) (COMPLETE)
*Goal: Create all 32 Single-Slot Wearable & Pack items (`[Head]`, `[Body]`, `[Legs]`, `[Pack]`) across Tiers 1 and 2.*
- [x] **Tier 1 Wearables (16 items):** 4 `[Head]`, 4 `[Body]`, 4 `[Legs]`, 4 `[Pack]`.
- [x] **Tier 2 Wearables (16 items):** 4 `[Head]`, 4 `[Body]`, 4 `[Legs]`, 4 `[Pack]`.

---

### ✅ Iteration 6: Armory Items Part 3 — Multi-Slot, Consumables & Complex (`/game/items/`) (COMPLETE)
*Goal: Create the remaining 27 Armory items.*
- [x] **Multi-Slot Wearables (`/game/items/multi_slot/` — 8 items):** 4 Tier 1 rigs + 4 Tier 2 rigs/suits.
- [x] **Consumables (`/game/items/consumables/` — 11 items):** 6 Tier 1 consumables + 5 Tier 2 consumables.
- [x] **Complex Items (`/game/items/complex/` — 8 items):** 4 Tier 1 deployables/drones + 4 Tier 2 heavy complex items.

---

### ✅ Iteration 7: Political & Encounter Decks (`/game/perks/`, `agendas/`, `secret_objectives/`, `modifiers/`) (COMPLETE)
*Goal: Create all 58 Political Deck cards and 12 Stage Modifier cards.*
- [x] **12 Thematic Multi-Tier Perk Cards (`/game/perks/`):** Cards 1–12.
- [x] **24 Open Agenda Cards (`/game/agendas/`):** Category A (1–10), Category B (11–17), Category C (18–24).
- [x] **10 Tiered Secret Objective Cards (`/game/secret_objectives/`):** Cards 1–10 (15/10/5 VP tiers).
- [x] **12 Stage Modifier Cards (`/game/modifiers/`):** 4 Split-Effect + 8 Generic System modifiers.

---

### ✅ Iteration 8: Campaigns, Missions & Side-Missions (`/game/campaigns/`, `missions/`, `side_missions/`) (COMPLETE)
*Goal: Create all Campaign Dossiers, Fixed Mission Briefs, and Themed Side-Missions.*
- [x] **2 Campaign Dossiers (`/game/campaigns/`):** `campaign-iron-dawn.md`, `campaign-apex-extraction.md`.
- [x] **7 Campaign Mission Briefs (`/game/missions/`):** Iron Dawn M1–M3 (3 files) + Apex Extraction M1–M4 (4 files).
- [x] **5 Themed Side-Missions (`/game/side_missions/`):** Recover Enemy Intel, Black-Market Arms Cache, Derelict Satellite Salvage, Sub-Grid Power Siphon, Bio-Specimen Containment Purge.

---

### ✅ Iteration 9: Automated Manifest Generator (`manifests/generate_manifests.js`) (COMPLETE)
*Goal: Build the Node.js manifest exporter, validate all frontmatter schemas across `/game/`, and export JSON manifests.*
- [x] Initialize `package.json` with `generate:manifests` and build scripts.
- [x] Implement `manifests/generate_manifests.js`.
- [x] Generate and verify `/manifests/exports/all_components.json` (200 components), `image_generation_manifest.json` (200 art specs), `core_rules.json` (8 chapters), and all 9 category JSON files with 0 validation errors.

---

### ✅ Iteration 10: Astro + React/TS Foundation, Design Tokens & Rulebook Wiki (COMPLETE)
*Goal: Set up the Astro + React/TS project, CSS design tokens, inline SVG badges, and Rulebook Wiki pages.*
- [x] Configure Astro (`astro.config.mjs`), React, TypeScript (`tsconfig.json`), and GitHub Pages base path settings.
- [x] Build `src/styles/tokens.css` design tokens (Focus colors, Currency badges, Faction palettes) and 20 SVG icons in `assets/icons/` and `assets/factions/`.
- [x] Build Wiki layout, sidebar navigation, glossary tooltips (`src/components/SemanticText.tsx`), and Rulebook Markdown rendering routes (`src/components/MarkdownRenderer.tsx`, `src/components/WikiPortal.tsx`).

---

### ✅ Iteration 11: Interactive Card Renderers & Filterable Component Databases (COMPLETE)
*Goal: Build physical-style tabletop card components and filterable databases for the Wiki.*
- [x] Build `<ComponentCard />` (`src/components/ComponentCard.tsx`) supporting Operatives, Items, Perks, Agendas, Secret Objectives, Modifiers, Factions, HQ Facilities, and Missions with `art_spec` blueprint placeholders and one-click prompt copy.
- [x] Build filterable browser views for Armory (87), Specialist Roster (24), Factions (8), HQ & Landmarks (9), Political Decks (46), Stage Modifiers (12), Campaigns/Missions (14), and Art Pipeline Manifest Inspector (200).

---

### ✅ Iteration 12: Virtual Tabletop (VTT) Engine & GitHub Pages Deployment (COMPLETE)
*Goal: Build the playable browser VTT under `src/vtt/` and the `.github/workflows/deploy.yml` pipeline.*
- [x] Implement TypeScript VTT state engine with `localStorage` persistence and JSON save export/reset (`src/vtt/VirtualTabletop.tsx`).
- [x] Build VTT views: Campaign/Mission/Doom Tracker, 4-Player Faction Vault Dashboards & Command Auction Resolver, 4-Operative Squad Staging with 6-Slot Anatomical Loadout Validator, Active Stage Resolver + Static Pool Dice Roller + Momentum Calculator, Sponsored HQ Facility Tracker, and Med Bay / Critical Trauma Roller.
- [x] Create `.github/workflows/deploy.yml` and `README.md`.

---

### ✅ Iteration 13: Dedicated Wiki Pages, Inter-Clicky Links & 4-Tier Currency Taxonomy (COMPLETE — PR #2 Merged)
- [x] Clarify 4-tier taxonomy (`[CR]`/`[EF]`/`[PIP]` Primary Currencies vs `[MOM]` Mission Flow vs `[LOY]` Operative Rank vs `[DOOM]`/`[VP]` Meta Trackers).
- [x] Normalize all 208 `/game/` Markdown files into unified compound tokens (`[+1 CR]`, `[2 EF]`, `[10+ LOY]`, `[+3 VP]`).
- [x] Replace modal popups with dedicated hash-routed Wiki pages, Infoboxes, breadcrumbs, and See Also backlinks.

---

### ✅ Iteration 14: Design Companion Audit, Core Rulebook Callouts/Examples & Official Print Rulebook Reader (COMPLETE)
- [x] Create `BACKLOG.md` with Design Companion Review, 8 Rule Edge-Case Questions (`BL-RULES-01` to `BL-RULES-08`), Balance Insights (`BL-BAL-01` to `BL-BAL-04`), and Product Roadmap.
- [x] Enrich all 8 `/game/core/*.md` chapters with Golden Rule callouts (`> [!IMPORTANT]`), Tactical Tips (`> [!TIP]`), step-by-step Examples of Play (`> [!EXAMPLE]`), and Diagram Placeholders (`> [!DIAGRAM]`) without changing any rules.
- [x] Upgrade `src/components/MarkdownRenderer.tsx` and `src/components/WikiPortal.tsx` with a sleek **Wiki Homepage (`#/wiki/home`)**, **Emulated Print-Style Rulebook Reader (`#/wiki/rulebook`)**, and **Design Companion & Backlog (`#/wiki/backlog`)** view.

---

### ✅ Iteration 15: VTT 7-Step Sequencer, Hover Explanations & Monte Carlo Balance Simulator (COMPLETE)
- [x] Build `src/vtt/simulator.ts` with deterministic & Monte Carlo (`1,000-trial`) stage/mission probability engine and `9.0 ES` character auditor.
- [x] Upgrade `src/vtt/VirtualTabletop.tsx` with a guided 7-Step Phase Sequencer, Contextual Rules Coach, hover-over explanations, per-stage Static Dice commitment/spending/refunds, and an interactive **Balance & Monte Carlo Simulator** tab.
- [x] Add `tests/05-vtt-engine-and-simulator.test.js` and verify all 5 test suites pass.

---

### ✅ Iteration 16: Internal Design Documentation Split, Mission Failure Refactor ([FAIL]), & Rules Resolution (COMPLETE)
- [x] Create dedicated internal design documentation in `docs/design/` (5 deep technical docs covering mathematical engine & 9.0 ES ledger, skewed focus pyramid & anti-dilution, semi-cooperative paradox, economy & valuation models, and 24-agent character envelopes).
- [x] Strip internal ES offset and probability commentary from `/game/core/` and add Chapter 8: `game/core/table_setup_and_glossary.md` (Table anatomy, component glossary, worked Example of Play, and Tabletop Setup blueprint).
- [x] Thematically reframe "Doom" to corporate sci-fi "Mission Failure Tracker" (`[FAIL]`) and coalition loss to "Task Force Dissolution" across all 208 game markdown files, CSS tokens (`--currency-fail`), VTT state, and Wiki components.
- [x] Codify rules decisions on `BL-RULES-01` (dual-stream participation stipend + shared contract pot), `BL-RULES-02` (Dying Breath rule), `BL-RULES-03` (stabilization & vulture claim declaration order), `BL-RULES-04` (zero-bid immediate d6 roll-off), and `BL-RULES-05` (Technician early resolution).
- [x] Upgrade Wiki with dedicated Internal Design Docs reader (`#/wiki/design`) and update all 5 test suites (24/24 passing).

---

### ✅ Iteration 17: Rules 06–08 Codification & Balance Confirmations (COMPLETE)
- [x] Codify `BL-RULES-06` in `game/core/classes_and_focus.md` and `rules_overview.md`: Scientist *Dual-Vector Mapping* promotes operatives with matching Primary Focus to Phase 1 Initiative (`3+`) with Early Resolution eligibility.
- [x] Codify `BL-RULES-07` in `game/core/squad_leader_command.md` and `rules_overview.md`: Dynamic Focus Swaps (*Tactical Bypass* / *Force Breach*) cause active Split-Effect Stage Modifiers to evaluate dynamically against the newly active Focus.
- [x] Codify `BL-RULES-08` in `game/core/medbay_trauma.md`: Medically Grounded Protocol renders operatives with 0 effective Max HP ineligible to deploy until at least 1 Critical Injury or Permanent Trauma token is purged.
- [x] Document designer confirmation of `BL-BAL-01` (Momentum as variance cushion), `BL-BAL-02` (Glass-cannon backfire vulnerability), and `BL-BAL-03` (3P Vanguard Loyalty velocity) in `docs/design/01_mathematical_engine_and_9es_ledger.md` and `docs/design/04_economy_and_valuation_models.md`.
- [x] Update `BACKLOG.md` with all 8 rules marked resolved and add regression test coverage to `tests/05-vtt-engine-and-simulator.test.js` (25/25 tests passing).
