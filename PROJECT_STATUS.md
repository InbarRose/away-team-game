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
| **ADR-11** | 2026-10-25 | **Dedicated Top-Level Home Portal, Standalone Design Companion Portal & GitHub Issue Pipeline:** Extracted the Design Companion and mathematical dossiers completely outside the Rules Wiki into a standalone top-level section (`DesignCompanionPortal.tsx`, `#/design`). Authored a comprehensive command-deck Homepage (`HomePortal.tsx`, `#/home`) linking to the 3 platform hubs (Rules Wiki, VTT, Design Companion). Added structured GitHub issue templates (`bug_report.md`, `gameplay_feedback.md`, `feature_request.md`, `config.yml`) and an in-app Feedback & Issues modal with one-click pre-filled issue launchers. | Cleans up platform navigation, cleanly separates developer engineering from player reference, and enables transparent community playtesting and feedback. |

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

---

### ✅ Iteration 18: Dedicated Home Portal, Standalone Design Companion & GitHub Issue Templates (COMPLETE)
- [x] Create standalone `HomePortal.tsx` (`#/home`) serving as the digital command deck routing to Rules Wiki, VTT Simulator, and Design Companion, with key mechanics breakdown and live stat telemetry.
- [x] Create standalone `DesignCompanionPortal.tsx` (`#/design`) completely outside the Rules Wiki, featuring sub-tabs for System Dossiers (5 docs), Companion Audit & Decisions (`BACKLOG.md`), and Architecture Decision Records (ADRs).
- [x] Streamline `WikiPortal.tsx` to focus strictly on player-facing rulebooks, printable reader, component card browsers, and currency taxonomies.
- [x] Add GitHub issue templates in `.github/ISSUE_TEMPLATE/` (`bug_report.md`, `gameplay_feedback.md`, `feature_request.md`, `config.yml`).
- [x] Update `AppShell.tsx` with top-level 4-mode navigation (`home`, `wiki`, `design`, `vtt`), GitHub repository badge, and an interactive &ldquo;Feedback & Issues&rdquo; modal launcher.
- [x] Add regression test coverage in `tests/01-structure-and-intent.test.js` (26/26 tests passing) and verify production Astro build.

---

### ✅ Iteration 19: Chronological Board Game Rulebook Flow & VTT Macro Phase Alignment (COMPLETE)
- [x] Restructure all 8 Core Rulebook chapters in `game/core/` to follow the exact chronological flow of a published tabletop game (Overview & Objectives -> Box Contents & Setup -> Phase 1 Mission Select & Phase 2 Command Auction -> Phase 3 Tactical Field Mission -> Specialist Classes & Focus -> Casualties & Med Bay -> Phase 4 HQ Downtime -> Campaign Progression & Victory).
- [x] Codify 1P/2P/3P/4P table setup variants with official 3-Player Vanguard Slot mechanics.
- [x] Enhance the Print Rulebook reader in `src/components/WikiPortal.tsx` with Phase Banners, table of contents, and card anatomy schematics.
- [x] Re-architect the Virtual Tabletop in `src/vtt/VirtualTabletop.tsx` with a top-level **Board Game Phase Bar** (`Setup` -> `Phase 1: Mission` -> `Phase 2: Command & Roster` -> `Phase 3: Tactical Field` -> `Phase 4: HQ Downtime` -> `Simulator & Balance Ledger`).
- [x] Implement interactive Phase 0 Setup panel (player counts, Faction Director seats, starting vaults, setup sequence).
- [x] Implement Phase 1 Mission Selection with threat assessment, stage preview, and Dissolution failure tracker.
- [x] Implement Phase 2 Command Auction bidding console with live canonical tie-breakers, zero-bid roll-off (`BL-RULES-04`), and 6-slot loadout validator.
- [x] Implement Phase 3 Tactical Mission with 7-step sequencer, dynamic focus swaps, static dice pools, and triage.
- [x] Implement Phase 4 HQ Downtime with 8-step cycle, dual-stream debrief payouts calculator (`BL-RULES-01`), recovery beds, and sponsored base modules.
- [x] Add regression test coverage in `tests/05-vtt-engine-and-simulator.test.js` (27/27 tests passing) and verify production Astro build.

---

---

### ✅ Iteration 20: Procedural VTT FSM Engine, Visual Component Drafting & Tactile Tabletop UX (COMPLETE)
- [x] **Finite State Machine & One-Phase-at-a-Time:** Replaced the open dashboard with a strict procedural finite state machine (`setup_players` -> `setup_factions` -> `setup_bench` -> `setup_campaign` -> `phase1_brief` -> `phase2_auction` -> `phase3_tactical` -> `phase4_hq`). Removed arbitrary `+ / -` counter manipulators, ensuring all state changes are driven strictly by rules-governed actions.
- [x] **Sequential Visual Faction Drafting:** Replaced dropdown selector with a card grid browsing all 8 Faction Dossiers (visual Faction Sheets displaying seals, lore, printed asymmetric starting assets, passive trait, and 4-tier Loyalty track).
- [x] **Specialist Operative Draft Tray:** Implemented sequential drafting of 3 operatives per player bench with full visual Tarot cards (70×120 aspect ratio, 9.0 ES budget stats, class power, unique ability, loyalty badge) and assignment to Active Deployment Slots.
- [x] **Zero Starting Items Enforcement:** Fixed initial state so operatives strictly begin with zero items; items must be purchased and equipped during Phase 4 HQ Downtime at the Quartermaster Armory.
- [x] **Procedural Campaign Track:** Mission and stage sequences are procedurally loaded from campaign parameters (`campaign.campaign_parameters.missions`) and mission stage decks, preventing arbitrary out-of-order stage skipping.
- [x] **Tactile Tabletop Aesthetics & Component System:** Replaced neon cyan glow styling with dark slate tabletop felt (`.vtt-tabletop`), tactile physical cards (`OperativeCard`, `FactionDossierCard`, `StageCard`, `ArmoryItemCard`), and a 3D-styled dice tray (`TactileDiceTray`).
- [x] **Explanatory Tooltips & Cause-and-Effect Copy:** Added explicit hover/outcome text and action logs explaining resource costs, die probabilities, and rule mechanics across every button.
- [x] Verify all 27 tests in suites 01–05 pass and Astro static build succeeds with 0 errors.

---

---

### ✅ Iteration 21: Individual Operative Dice Sovereignty & Tabletop Commitment Controls (COMPLETE)
- [x] **Core Rules Codification:** Codified **Individual Operative Dice Sovereignty** across `game/core/dice_system.md` (§1.1, §3), `game/core/rules_overview.md` (§3), and `game/core/squad_leader_command.md` (§4).
- [x] **The Right to Hold Back (0 Dice):** Explicitly codified that committing `0 dice` ("Holding Back") is a legal tactical choice that preserves stamina and completely eliminates Backfire injury risk, while forfeiting Operational Momentum (`[MOM]`) refunds under the Skin-in-the-Game constraint.
- [x] **Vanguard Slot Authority:** Clarified that in 3-player games, the elected Squad Leader commands the fourth unassigned operative in the Vanguard Slot, deciding their dice commitments and target allocation.
- [x] **VTT Player-Level Commitment Console:** Implemented dedicated dice commitment controls on each `OperativeCard` in Phase 3 Tactical Field with player attribution, quick-select pills (`[0 (Hold)]`, `[1]`, `[2]`, `[3]`, `[Max]`), mathematical hit/backfire forecasts, and individual operative roll triggers (`handleRollSingleOperative`).
- [x] **Coordinated Squad Controls:** Added coordinated roll buttons and skip levers in the tactical Action Bar.
- [x] **Comprehensive Test Coverage:** Added test suite in `tests/05-vtt-engine-and-simulator.test.js` verifying rulebook chapters, engine coach hints, and VTT commitment methods (28/28 tests passing).

---

### ✅ Iteration 22: Dual-Stream Debrief Payouts & Multi-Click Claim Lock (COMPLETE)
- [x] **Core Rules Codification:** Codified the authoritative **Dual-Stream Payout Model** in `game/core/vault_economy.md` (§1) distinguishing Stream 1 guaranteed operative participation stipends (`[+2 CR]` per operative, `[+1 PIP]` per faction) from Stream 2 negotiated clearance bounty pot (`[6 CR]` and `[1 PIP]`), with 3P Vanguard Slot stipend flow and single-claim invariant.
- [x] **Regenerated JSON Manifests:** Updated core rules exports in `manifests/exports/core_rules.json` and `src/data/core_rules.json`.
- [x] **Multi-Click Idempotency Lock:** Fixed bug in `src/vtt/VirtualTabletop.tsx` where repeatedly clicking "Claim & Deposit Payouts into Vaults" awarded infinite payouts, locking execution behind `payoutsClaimed: true` and resetting state upon concluding HQ downtime.
- [x] **Interactive Dual-Stream Payout Console:** Replaced automated opaque lump sum with an interactive debrief console displaying player Director seats, participating operatives, base stipends, interactive negotiation steppers (`- / +`) for the shared pool, total payout preview, and unallocated pool warning badges.
- [x] **Comprehensive Test Coverage:** Added Test 10 in `tests/05-vtt-engine-and-simulator.test.js` validating dual-stream mechanics, negotiation state, and multi-click claim locking (29/29 tests pass).

---

### ✅ Iteration 23: Tabletop Desk, Quartermaster Market Depletion, HQ Facility Board & Secret Corporate Objectives (COMPLETE)
- [x] **Director Console Sovereignty & Tabletop Desk:** Added selectable active Director seat (`activeDirectorIndex`) with pass turn buttons. Built Virtual Desk displaying Faction Crest, passive trait, Vault chits, 6-slot anatomical operative loadout rack (`[Head]`, `[Body]`, `[Hands 1]`, `[Hands 2]`, `[Accessory 1]`, `[Accessory 2]`) with gear unequip/equip controls, Faction Armory Cache, and Secret Corporate Objective card.
- [x] **Quartermaster Armory Market Depletion:** Fixed item purchasing bug so bought items are removed from `armoryMarketItemIds` and replenished from the deck. Deducts Credits from the acting Director, delivers gear to target operative (updating armor buffer) or to Faction Cache, and provides a market refresh button.
- [x] **Corporate Base Operations & HQ Facility Sponsorships:** Built `<HQFacilityBoard>` in Phase 4 for all 5 Base Facilities and 4 Landmarks. Active Director spends Credits/PIP to sponsor modules, earning `+1/+2 PIP` and `+2/+4 VP`, stamping their Faction token.
- [x] **Boardroom Doctrines & Faction Perks:** Built `<FactionPerksConsole>` in Phase 4 Step 7, allowing Directors to unlock tactical doctrines using Credits or PIP.
- [x] **Tabletop Step 0.4: Agendas & Secret Corporate Objectives:** Added Step 0.4 to setup flow dealing 3 face-up Open Corporate Agendas to the table (with in-mission claim bounties in Phase 1, 2, 3), and 2 Secret Corporate Objectives per Director seat (with keep selection button and privacy peek/conceal toggle).
- [x] **Automated Test Coverage:** Added Tests 11 & 12 in `tests/05-vtt-engine-and-simulator.test.js` (31/31 tests pass across all 5 suites).

---
---

### 📋 Architecture Decision Records (ADRs)

#### ADR-19: VTT Finite State Machine, Tactical Operations & Client Storage Test Architecture (Suites 12–15)
* **Context:** The Virtual Tabletop represents a complex interactive client with a multi-step Finite State Machine (Steps 0.1–0.5 setup through Phase 4 HQ downtime), player sovereignty dice commitment steppers, active Director desk consoles, and localStorage persistence. We needed targeted test suites verifying these state transitions, data structures, and edge-case behaviors without requiring heavy browser mocks.
* **Decision:**
  1. **Suite 12 (VTT FSM & Setup Flow):** Tests 1P–4P table configuration, 3P Vanguard Slot allocation, sequential Faction Draft seat cycling ($0 ightarrow N-1$), asymmetric vault assets, Zero-Starting-Item invariant on drafted specialists, Open Agendas/Secret Objectives draft (Step 0.4), and campaign initialization.
  2. **Suite 13 (VTT Tactical Operations & Dice Sovereignty):** Tests individual operative dice commitment without mutating teammates, stamina bounds clamping ($[0..	ext{Available}]$), individual roll execution and Backfire wound application, coordinated squad roll protection for holding-back specialists, Early Resolution step advancement ($2 ightarrow 5$), and Step 5 Momentum die refunds.
  3. **Suite 14 (VTT HQ Consoles & Active Director Desk):** Tests active Director console switcher, vault scoping, 6-slot anatomical grid compatibility ($2	ext{ Hands}$ limit via `validateSlotLoadout`), armory cache equipping, armor buffer updates, unequip return protocol, boardroom perks, and facility sponsorship records.
  4. **Suite 15 (Client Storage Persistence & Safety Guards):** Tests `localStorage` state round-trip serialization/hydration, graceful degradation on corrupted JSON, save file export/import numeric invariants ($N ge 0$, no `NaN`), in-game navigation isolation (`IN_GAME_PHASES` vs `SETUP_STEPS`), and "Start New Game" confirmation modal.
  5. **Native Test Execution:** All 106 tests across 15 suites execute cleanly in $< 3.9$ seconds with 0 external dependencies.
* **Status:** Adopted and verified across all test suites and static build.

#### ADR-18: Documented Rules-Derived Testing Architecture (Suites 07–11)
* **Context:** The game's canonical rules are formally articulated across 8 chapters in `/game/core/`, but earlier test coverage primarily focused on directory structure, schemas, and character budget mathematics. We needed direct, automated rules contracts derived from the documented ruleset so that any future rule updates or engine refactors automatically verify compliance or flag drift.
* **Decision:**
  1. **Suite 07 (Chapter 4 Tactical Dice & Momentum):** Tests focus thresholds (3+, 4+, 5+), mathematical ES expectations (4/6, 3/6, 2/6), standardized Backfire on 5+, Operational Momentum formula ($MOM = Hits - D - 1$ at $ge D+2$), Skin-in-the-Game invariant, Holding Back protocol (0 dice), and Phase 1 Early Resolution.
  2. **Suite 08 (Chapter 3 Command & Initiative):** Tests Credit bidding, 4-tier tie-breakers (Credits $ightarrow$ PIP $ightarrow$ Loyalty $ightarrow$ Seat), 0-bid roll-offs (`BL-RULES-04`), 3-Player Vanguard Slot double loyalty, Dynamic Swaps (`BL-RULES-07`), and Scientist Phase 1 promotion (`BL-RULES-06`).
  3. **Suite 09 (Chapter 6 Mortality & Med Bay):** Tests Step 4 Triage priority order (`BL-RULES-03`), Dying Breath locked successes (`BL-RULES-02`), d6 Critical Injury tables, Trauma Calcification (3 injuries = 1 trauma), Medically Grounded 0 Max HP deploy ban (`BL-RULES-08`), and 5+/4+ Med Bay recovery.
  4. **Suite 10 (Chapter 7 HQ Downtime Economy):** Tests dual-stream debrief payouts (`BL-RULES-01`), Vanguard Slot +2 CR recipient, claim idempotency, Quartermaster market depletion/replenishment, and facility sponsorships.
  5. **Suite 11 (Chapter 8 Endgame & Agendas):** Tests 3 Open Agendas claims, tiered Secret Corporate Objectives (15/10/5 VP), Failure tracker dissolution ($3	ext{ [FAIL]}$), and comprehensive endgame VP scoring aggregation.
  6. **Zero-Dependency Native Execution:** All 79 tests run via Node.js native test runner (`node:test`) in $< 2.5$ seconds locally and in GitHub Actions CI.
* **Status:** Adopted and verified across all test suites and static build.

#### ADR-17: Strict Mid-Game Navigation Isolation, Deterministic Acceptance Scenarios, & Chaos / Fuzz Testing Engine
* **Context:** Once players began an active campaign game, navigating to Setup wiped game state without a formal reset. Furthermore, the engine lacked systematic test coverage for deadlocks, invariant violations under chaotic random play, and repeatable deterministic scenarios with overridable random outcomes.
* **Decision:**
  1. **Navigation Isolation:** Strictly separate `SETUP_STEPS` (Step 0.1–0.5) from `IN_GAME_PHASES` (Phase 1–4 + Sim). Setup steps are only accessible prior to campaign launch. Once in-game, resetting requires explicit user confirmation via a modal ("Start a New Game?").
  2. **Deterministic Acceptance Testing:** Built `src/vtt/gameSimulator.ts` with preset test scenarios (`smoke_clean_clear`, `martyr_dying_breath`) and pluggable `diceOverride` hooks allowing static dice roll injection for automated acceptance testing.
  3. **Chaos / Fuzz Simulation & Invariant Verifier:** Built seedable PRNG simulation running full automated playthroughs with stochastic player decisions, validating 6 invariants: non-negative currency, valid HP/dice bounds, 4-operative roster stability, bounded execution ($< 250$ steps/run, 0 deadlocks), market replenishment, and dual-stream payouts.
  4. **In-Browser Sim Console & Telemetry Export:** Upgraded Tab 5 in the VTT to feature 3 operational sub-modes (Combat Monte Carlo, Deterministic Scenarios, Chaos Fuzz Simulator) and one-click JSON telemetry export for telemetry analysis.
* **Status:** Adopted and verified across all test suites and static build.

#### ADR-16: Quartermaster Market Depletion, Director Console Sovereignty, & Secret Corporate Objectives Tabletop Architecture
* **Context:** In Phase 4 HQ Downtime, purchasing an armory item did not deplete the shop or clarify which Director was buying. Additionally, HQ facility improvements, boardroom perks, open agendas, and secret corporate objectives were missing from the interactive tabletop.
* **Decision:**
  1. **Quartermaster Market Depletion & Stock Flow:** When an item is bought, it is removed from `state.armoryMarketItemIds`, a replacement item is drawn from the deck, and the item is delivered to the target operative or to the active Director's `factionArmoryCaches`.
  2. **Active Director Tabletop Desk & Pieces:** Players select which Director is acting at the console via a prominent switcher bar. The Desk displays the Faction Crest, Vault chits, 6-slot anatomical gear rack (`head`, `body`, `hands`, `accessory`), and secret objective card.
  3. **Corporate Facility Board & Perks Console:** Built dedicated components (`<HQFacilityBoard>` and `<FactionPerksConsole>`) for Base Facility sponsorships and Boardroom executive doctrines.
  4. **Open Agendas & Secret Objectives Setup (Step 0.4):** Dealt 3 face-up Open Corporate Agendas to the table and 2 Secret Corporate Objectives to each player (keep 1) with privacy peek/conceal toggles.
* **Status:** Adopted and verified across all test suites and static build.

#### ADR-15: Dual-Stream Debrief Payout Architecture & Multi-Click Claim Lock
* **Context:** Players previously could click "Claim & Deposit Payouts into Vaults" multiple times, triggering duplicate payouts. Additionally, payouts were mathematically lumped together without making the distinction between per-character stipends and the shared negotiable bounty pool visible or interactive.
* **Decision:**
  1. **Single-Claim Invariant:** Lock claim execution behind `state.payoutsClaimed`. Once deposited, the button is disabled and shows `✅ Payouts Deposited into Vaults (Claimed)`. Concluding HQ Downtime resets `payoutsClaimed` for the next mission.
  2. **Dual-Stream Transparency & Steppers:** Clearly display Stream 1 guaranteed stipends (`+2 CR` per deployed operative, `+1 PIP` per faction) and provide an interactive negotiated stepper for Stream 2 (`negotiatedBountyCredits`), allowing players to adjust how the shared clearance bounty pool is divided at the table before claiming.
  3. **3-Player Vanguard Alignment:** The operative in Vanguard Slot (Slot 4) commanded by the Squad Leader correctly awards their `+2 CR` stipend to the Squad Leader's vault.
* **Status:** Adopted and verified across all test suites and static build.

#### ADR-14: Individual Operative Dice Sovereignty & Tabletop Commitment Console
* **Context:** Tactical dice commitment was previously ambiguous: players wondered whether all characters were required to roll, who determined the dice counts, and whether holding back was permissible. In the VTT, commitment was an unprompted counter rather than an active player choice.
* **Decision:**
  1. **Codify Stamina Sovereignty:** In every stage encounter, each controlling player independently decides how many dice their operative will roll from their remaining available static dice pool (from `0 dice` up to maximum).
  2. **Holding Back Protocol:** Rolling `0 dice` is a valid tactical maneuver that avoids stamina depletion and Backfires. However, operatives who commit 0 dice are legally disqualified from receiving `[MOM]` refunds in Step 5.
  3. **Tabletop UX & Individual Triggers:** In the VTT, each card displays the controlling Director seat, a dedicated quick-select stamina bar (`0 (Hold)`, `1`, `2`, `3`, `Max`), and an individual roll trigger alongside coordinated squad actions.
* **Status:** Adopted and verified across all test suites and static build.

#### ADR-13: Procedural Finite State Machine (FSM), Visual Drafting & Tactile Tabletop Component Architecture
* **Context:** The previous Virtual Tabletop resembled an open debug dashboard with freeform counter adjusters (`+ / -`), dropdown selectors, premature item loadouts on newly drafted operatives, and glowing neon laser aesthetic styling that detracted from an authentic tabletop board game feel.
* **Decision:**
  1. **Enforce Rigid FSM Flow:** Lock player progression to a strictly sequential Finite State Machine:
     - `setup_players` (1P–4P selection) $\rightarrow$ `setup_factions` (sequential Faction Dossier claims) $\rightarrow$ `setup_bench` (specialist drafting into player bench trays) $\rightarrow$ `setup_campaign` (locking mission tracks) $\rightarrow$ `phase1_brief` $\rightarrow$ `phase2_auction` $\rightarrow$ `phase3_tactical` $\rightarrow$ `phase4_hq`.
  2. **Zero-Item Starting Invariant:** Operatives strictly begin with empty item slots (`equippedItemIds: []`). Equipment can only be obtained through Phase 4 HQ Quartermaster Armory purchases using earned Credit bounties.
  3. **Visual Physical Card Components:**
     - `OperativeCard.tsx`: Standard Tarot 70×120 proportions displaying class badge, 9.0 ES budget stats, class power, unique ability, and loyalty track.
     - `FactionDossierCard.tsx`: Visual Faction Sheet featuring thematic seals, printed asymmetric starting assets (`credits`, `effort`, `pip`), passive trait, and 4-tier loyalty track.
     - `StageCard.tsx`: Hazard card displaying room Focus, Target Difficulty $D$, attached modifier, and Squad Leader dynamic swap levers.
     - `TactileDiceTray.tsx`: 3D tactile dice cubes for rolling, highlighting hits (green), misses (dark), and Backfires (red).
     - `ArmoryItemCard.tsx`: Standard Poker 63×88 card with anatomical slot badges, Credit prices, and Focus bridges.
  4. **Tabletop Aesthetic Design Tokens:** Removed `#00e5ff` cyan neon glow in favor of matte dark-slate tabletop felt (`tokens.css`), physical card elevation borders, and subtle muted state badges.
* **Status:** Adopted and verified across all test suites and static build.

#### ADR-12: Chronological Board Game Sequence of Play & VTT Macro Phase Alignment
* **Context:** The core rulebook and VTT previously presented game concepts non-chronologically, mixing setup, mid-mission tactical resolution, and downtime economies across non-sequential chapters and unsequenced VTT dashboard views.
* **Decision:**
  1. Renumber and restructure all 8 core rulebook chapters in `game/core/` into chronological board game order:
     - Chapter 1: *Game Overview, Concept & Objectives* (Theme, abstract, semi-co-op paradox, victory conditions).
     - Chapter 2: *Game Components & Tabletop Setup* (1P/2P/3P/4P variations, Vanguard slot, 6-step setup, card anatomy).
     - Chapter 3: *Phase 1 (Mission Select) & Phase 2 (Roster & Command Auction)* (Briefings, 4-agent deployment, command bids, tie-breakers, roll-offs, executive levers).
     - Chapter 4: *Phase 3 — The Tactical Mission Phase (In the Field)* (Static pools, 3+/4+/5+ thresholds, 5-step stage micro-loop, early resolution, momentum).
     - Chapter 5: *Specialist Classes & The Focus Matrix* (6 classes, 1-EF standard powers, exact timing windows, 24-agent focus matrix).
     - Chapter 6: *Field Casualties, Triage & Med Bay Trauma Engine* (Step 4 triage, Dying Breath, vulture looting, infirmary beds, calcification).
     - Chapter 7: *Phase 4 — Headquarters Downtime Phase (Base Operations)* (8-step HQ cycle: debrief dual-stream payouts, stand-down auction, med bay, sponsorships, armory).
     - Chapter 8: *Campaign Progression, Failure Tracker & Endgame Victory* (Branching campaigns, failure tracker, final VP scoring tally, keyword glossary).
  2. Implement an identical top-level Board Game Phase Navigation Bar in the VTT (`Setup` -> `Phase 1` -> `Phase 2` -> `Phase 3` -> `Phase 4` -> `Simulator`), providing dedicated screens, contextual guidance, and sequential forward progression buttons for all 4 phases of tabletop play.
* **Status:** Adopted and verified across all test suites and static build.
