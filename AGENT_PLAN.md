# PROJECT SPECIFICATION & AGENT EXECUTION PLAN: AWAY TEAM DIGITAL PLATFORM & REPOSITORY ENGINE

> **Status:** Active Master Specification  
> **Project Tracking:** See [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) for the live Agile Backlog, Iteration Status, and Architecture Decision Records (ADRs).

---

## 1. PROJECT OBJECTIVES & MANDATORY AGENT WORKFLOW RULES

Transform this repository into a dual-purpose tabletop game hub and asset pipeline, executed in **small, atomic, committable agile increments**:

1. **Structured Rulebook & Component Source of Truth (`/game/`):** Convert the raw design drafts in `docs/original_design_document_dump/` into a clean, modular hierarchy of Markdown files with rich YAML frontmatter.
2. **Automated Asset & Image-Generation Pipeline (`/manifests/` & `/assets/`):** Standardized `art_spec` metadata on every game entity (prompts, aspect ratios, art style, and target asset paths) paired with a Node.js manifest generator (`manifests/generate_manifests.js`) that exports JSON manifests for downstream image-generation tools.
3. **Static Wiki & Card Browser (`src/` on GitHub Pages — `https://awayteam.inbarrose.com`):** Built with **Astro + React/TypeScript**, featuring full-text search, semantic keyword badges/icons, interactive card-render previews, and filterable component databases.
4. **Virtual Tabletop (VTT) Foundation (`src/vtt/`):** A browser-based TypeScript/React virtual game environment for managing Faction Vaults, staging 4-operative squads, running Stage checks with the Static Pool dice roller, tracking Med Bay recovery, and progressing through Campaign dossiers.

### 1.1 Mandatory Agent Engineering & Git Workflow Instructions
All agents and contributors working in this repository MUST follow these rules at all times:
* **Atomic Commits:** Make small, self-contained, atomic commits scoped to a single logical unit of work (e.g., Core Rulebook, Factions & HQ, Specialist Operatives, Armory Items, Political Decks, Campaigns/Missions, Manifest Pipeline, Web Engine/VTT, Test Suites & CI).
* **Side Branches & Pull Requests to `main`:** Never push feature work directly to `main`. Always create a descriptive side branch and open a Pull Request into main. All PRs must pass checks and get merged cleanly. Formalized in AGENTS.md.
* **Comprehensive Test Suites (`tests/`):** Every change must be accompanied by and pass automated test suites (`npm test`) covering:
  * **Suite 01 (`tests/01-structure-and-intent.test.js`):** Repository architecture, directory layout, exact component counts, and custom domain (`awayteam.inbarrose.com`) intent.
  * **Suite 02 (`tests/02-schema-and-art-pipeline.test.js`):** YAML frontmatter schema, unique IDs, `art_spec` completeness, and JSON manifest export synchronization.
  * **Suite 03 (`tests/03-game-math-and-balance.test.js`):** Mathematical balance intent (`9.0 ES` character creation formula across all 24 operatives, 24-Agent Focus Matrix, Armory slot/tier structure, 4-tier Faction Loyalty trees, 3/4-tier Perks, and 15/10/5 VP Secret Objectives).
  * **Suite 04 (`tests/04-wiki-and-vtt-functionality.test.js`):** Semantic CSS design tokens, SVG assets, and VTT engine rules (Focus thresholds, Out-of-Focus Natural 1 Backfires, Operational Momentum, Command Auction tie-breakers, 6-Slot Loadout validation, and Med Bay/Trauma tables).
* **GitHub Actions PR Gate (`.github/workflows/test-pr.yml`):** Every Pull Request targeting `main` automatically runs `node manifests/generate_manifests.js` and `npm test`.

---

## 2. AUTHORITATIVE RULESET & DESIGN DECISIONS

Based on the three source documents in `docs/original_design_document_dump/`, the system follows these canonical rules:

* **Primary Ruleset Source:** `away team economy abilities and cards.md` is the authoritative latest specification, superseding older mechanics where they conflict, while retaining lore and character names from `away team v3 draft.md` and `Memory draft away team July 18.md`.
* **Core Lexicon:**
  * **Focus (not Labels/Tags):** Every operative has **1 Primary Focus (hits on 3+)** and **1 Secondary Focus (hits on 4+)**. All other categories are **Out of Focus (hits on 5+)**. Natural **1s** always trigger **Backfire** damage (1 HP).
  * **Effort (`[EF]`, not Tokens):** Stored in the Faction Vault (1.33 ES value). Fuels Class Abilities (flat 1 Effort cost), Faction Powers, and Squad Leader *Logistical Refresh*. Cannot be traded between players.
  * **Operational Momentum (`[MOM]`, replaces static Overkill tables):** Exceeding a stage's Target Difficulty ($D$) by $+2$ or more generates $\text{Momentum} = \text{Total Successes} - D - 1$. Each Momentum point lets the Squad Leader restore 1 spent static die to an operative who rolled in that stage.
  * **Squad Leader & Command Auction:** Elected via Credit auction before launch (min 1 Credit; tie-breakers: Credits $\rightarrow$ PIP $\rightarrow$ Loyalty $\rightarrow$ Roll-off). Controls branching paths, **Dynamic Focus Swaps** (*Force Breach* to `[Combat]` or *Tactical Bypass* to non-combat), *Logistical Refresh* (2 Effort = +1 die to all; 3 Effort = +2 dice to all), and *Tactical / Forced Retreats*.
  * **Med Bay & Critical Trauma Engine (replaces d6 Injury Chart):** Unhealed damage is treated in HQ Infirmary beds (Baseline: 2 beds, 3 Healing Dice per bed hitting on 5+; Stand-Down adds +2 beds and +2 dice/bed). Rolling a natural 1 calcifies into a **Permanent Trauma Token** (-1 Max HP, -1 Starting Die, locked until *Cybernetic Lab*). Unhealed damage at the end of Downtime becomes a **Critical Injury Token** (-1 Max HP, -1 Starting Die, deployable, -1 penalty to future healing rolls).
  * **HQ Infrastructure (5 Baseline Facilities + Sponsored Modules + Landmarks):** The Infirmary, The Quartermaster, The Recruitment Bureau, The Intel Array, and The Boardroom (each with 3 sponsorable modules), plus 4 Standalone Landmark Modules (*Cryo-Stasis Chamber*, *Supply Lines*, *The War Room*, *Tactical Simulator*).
  * **Character Creation Budget (9.0 ES):**
    $$\text{Character Budget (9.0 ES)} = \text{HP Value (1.5 ES/HP)} + \text{Dice Value (0.5 ES/Die)} + \text{Unique Power (0.5–2.0 ES)} \pm \text{Class Offset}$$

---

## 3. REPOSITORY DIRECTORY LAYOUT

```text
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated build & deploy to GitHub Pages
├── AGENT_PLAN.md                   # Master architectural & system specification
├── PROJECT_STATUS.md               # Agile project management tracker, ADRs & backlog
├── docs/
│   └── original_design_document_dump/ # Raw historical design drafts (preserved)
├── assets/                         # Visual assets & generated images
│   ├── cards/                      # Card faces (organized by component_type)
│   ├── icons/                      # SVG icons for Focus, currencies, classes, slots
│   ├── tokens/                     # Printable/digital token graphics
│   └── factions/                   # Faction logos, banners, sigils
├── game/                           # Source-of-truth rulebook & component markdown
│   ├── core/                       # Foundational rules modules
│   │   ├── rules_overview.md       # Semi-co-op loop, player scaling (1-4P), stage sequence
│   │   ├── dice_system.md          # Static pools, Focus thresholds (3+/4+/5+), Backfire, Momentum
│   │   ├── classes_and_focus.md    # 6 Core Classes, 1-Effort Class Abilities, 50/35/15 Pyramid
│   │   ├── squad_leader_command.md # Command Auction, Logistical Refresh, Dynamic Swaps, Retreats
│   │   ├── medbay_trauma.md        # Infirmary beds, Healing Dice, Critical Injury, Permanent Trauma
│   │   ├── vault_economy.md        # Credits, Effort, PIP, Loyalty, Vulture Tax, Dead Pool, HQ Downtime
│   │   ├── campaign_engine.md      # Doom tracker, Retries, Continuous Drops, Safehouse Protocol
│   │   └── math_and_balance.md     # Expected Success (ES) conversion chart & 9.0 ES character budget
│   ├── factions/                   # 8 Faction dossiers, base powers, and 4-tier loyalty trees
│   ├── characters/                 # 24 Specialist operative cards (Agents 01–24)
│   ├── items/                      # Complete Armory database (89 distinct item templates)
│   │   ├── handheld_t1/            # 10 1-Handed & 6 2-Handed Tier 1 items
│   │   ├── handheld_t2/            # 6 1-Handed & 6 2-Handed Tier 2 items
│   │   ├── wearables_t1/           # 16 Single-Slot Tier 1 items ([Head], [Body], [Legs], [Pack])
│   │   ├── wearables_t2/           # 16 Single-Slot Tier 2 items ([Head], [Body], [Legs], [Pack])
│   │   ├── multi_slot/             # 8 Multi-Slot Rigs & Full Suits (Tier 1 & Tier 2)
│   │   ├── consumables/            # 11 Single-use Consumables (Tier 1 & Tier 2)
│   │   └── complex/                # 8 Deployable Turrets, Drones & Siege Rigs (Tier 1 & Tier 2)
│   ├── perks/                      # 12 Thematic Multi-Tier Perk Doctrine cards
│   ├── agendas/                    # 24 Open Agenda cards (In-Mission, HQ/Deals, Personnel)
│   ├── secret_objectives/          # 10 Tiered Secret Objective cards (15 / 10 / 5 VP tiers)
│   ├── modifiers/                  # 12 Stage Modifier cards (4 Split-Effect, 8 Generic System)
│   ├── hq/                         # 5 Base Facilities (with 15 Modules) + 4 Standalone Landmarks
│   ├── campaigns/                  # Campaign dossiers (Operation: Iron Dawn, Operation: Apex Extraction)
│   ├── missions/                   # 7 Campaign Mission briefs with preset stage tracks & swaps
│   └── side_missions/              # 5 Themed Side-Missions + Theme Tag definitions
├── manifests/                      # Aggregated JSON component data & validation scripts
│   ├── generate_manifests.js       # Node script parsing /game/ frontmatter into JSON exports
│   └── exports/                    # Auto-generated JSON manifests for VTT, Wiki, and Image Gen
├── src/                            # Astro + React/TypeScript Web Engine (Wiki + VTT)
│   ├── components/                 # Card renderers, semantic token badges, filterable grids
│   ├── pages/                      # Wiki routes, armory browser, roster viewer, campaign hub
│   ├── vtt/                        # TypeScript VTT state engine, squad staging, dice roller
│   └── styles/                     # CSS design tokens, Focus colors, faction palettes
└── package.json
```

---

## 4. SEMANTIC DESIGN TOKENS & VISUAL SYSTEM

Every instance of game terminology in the Wiki and VTT must use consistent semantic colors, notations, and inline SVG badge wrappers.

### 4.1 Focus Types (The 50 / 35 / 15 Skewed Pyramid)

| Focus Type | Pyramid Tier | Color Hex | CSS Token | Icon Glyph Concept |
| :--- | :--- | :--- | :--- | :--- |
| `[Combat]` | Tier 1 (~50%) | `#E03E3E` (Crimson) | `--focus-combat` | Crossed Rifles / Target Reticle |
| `[Infiltrate]` | Tier 2 (~35%) | `#9B51E0` (Purple) | `--focus-infiltrate` | Hooded Cloak / Shadow Dagger |
| `[Intel]` | Tier 2 (~35%) | `#00A3FF` (Cyan) | `--focus-intel` | Cybernetic Eye / Data Terminal |
| `[Negotiate]` | Tier 2 (~35%) | `#F2C94C` (Amber) | `--focus-negotiate` | Balanced Scales / Executive Seal |
| `[Operations]` | Tier 3 (~15%) | `#F2994A` (Orange) | `--focus-ops` | Interlocking Gears / Wrench |
| `[Survival]` | Tier 3 (~15%) | `#219653` (Green) | `--focus-survival` | Bio-Hazard Shield / Vital Pulse |

### 4.2 Currencies & Operational Metrics

| Metric | Color Hex | Notation | ES Value | Semantic Function |
| :--- | :--- | :--- | :--- | :--- |
| **Credits** | `#FFD700` (Gold) | `[CR]` | `0.50 ES` | Gear purchases, HQ module sponsorship, Command Auction bids (`1 CR = 1 VP` in HQ) |
| **Effort** | `#00E5FF` (Electric Teal) | `[EF]` | `1.33 ES` | Vault fuel for 1-Effort Class Abilities, Faction Powers, and Logistical Refresh (non-tradeable) |
| **Political Influence** | `#D63384` (Magenta) | `[PIP]` | `6.00 ES` | Corporate leverage, HQ module unlocks, Vulture Tax, auction tie-breaker (`1 PIP = 2 VPs`) |
| **Loyalty** | `#3B82F6` (Royal Blue) | `[LOY]` | `0.00 ES` (Field) | Operative rank progression (Tiers 1/3/6/10+), Perk synergies, Dead Pool Martyrdom VPs |
| **Momentum** | `#10B981` (Emerald) | `[MOM]` | `0.50 ES` | Generated at $\ge D+2$ successes; restores 1 spent static die per point to active rollers |
| **Doom** | `#8B0000` (Blood Red) | `[DOOM]` | — | Campaign catastrophe countdown track (3–4 max per campaign dossier) |
| **Victory Points** | `#F59E0B` (Amber Gold) | `[VP]` | `0.50 ES` | Ultimate competitive endgame scoring metric |

### 4.3 The 8 Faction Palettes

| Faction ID | Faction Name | Primary Hex | Archetype & Focus |
| :--- | :--- | :--- | :--- |
| `faction-aegis` | **Aegis Tactical Directorate** | `#2C3E50` (Gunmetal Slate) | PMC & Heavy Ordnance (`[Combat]` / Momentum) |
| `faction-nexus` | **Nexus Cybernetics & Data** | `#00BCD4` (Neon Cyan) | Technocratic Intelligence (`[Intel]` / `[Operations]`) |
| `faction-vanderbilt` | **Vanderbilt Sovereign Group** | `#C5A059` (Gilded Brass) | Venture Capital & Hostile Buyouts (`[CR]` / Auctions) |
| `faction-obsidian` | **Obsidian Syndicate** | `#1C1917` (Matte Obsidian) | Black-Ops Espionage (`[Infiltrate]` / Agendas) |
| `faction-titan` | **Titan Heavy Logistics** | `#D97706` (Industrial Amber) | Orbital Supply Chain (Squad-wide Static Dice Refresh) |
| `faction-ascendant` | **Ascendant Bio-Tech** | `#059669` (Toxic Emerald) | Cloning & Cyber-Medicine (Damage-to-Effort / Med Bay) |
| `faction-aurelius` | **Aurelius Media & Political Lobby** | `#4F46E5` (Broadcast Indigo) | PR Spin & Influence (`[Negotiate]` / `[PIP]` Conversion) |
| `faction-ironclad` | **Ironclad Extraction Scavengers** | `#92400E` (Rust Bronze) | Wreck Salvage & Vulture Economy (`[Survival]` / Scrap) |

---

## 5. COMPONENT FRONTMATTER SCHEMA & ART PIPELINE

Every component file under `/game/**/*.md` (excluding `/game/core/*.md` rule chapters, which use standard doc frontmatter) must include structured YAML frontmatter conforming to the master schema below.

### 5.1 Master YAML Frontmatter Template

```yaml
---
id: "item-handheld-t1-standard-sidearm"
title: "Standard Issue Sidearm"
component_type: "item" # [faction, character, item, perk, agenda, secret_objective, modifier, hq_facility, campaign, mission, side_mission]
category: "handheld_1h" # Sub-category (e.g., soldier, handheld_1h, wearable_head, multi_slot, consumable, complex, split_modifier, etc.)
faction: "neutral"      # Faction ID or "neutral"
tier: 1                 # Rarity, tier, or difficulty level (1, 2, 3, 4)
deck_copies: 6          # Number of physical/digital copies in the deck
cost:
  credits: 3
  effort: 0
  pip: 0
focus_affinity:
  primary: "combat"
  secondary: null
  bridges:
    - "combat"
stats:
  es_budget: 1.5
  hp_cap: null
  static_dice: null
  temp_dice_bonus: 1
  slots_required:
    - "hand_1"
  armor_buffer: null
rules_text: "Grants +1 Temporary Static Die in [Combat]. Bridges out-of-focus operatives to Secondary Focus (4+) in [Combat]."
active_ability: null
tags:
  - "weapon"
  - "one-handed"
  - "combat"
  - "focus-bridge"
art_spec:
  asset_path: "/assets/cards/items/standard_issue_sidearm.webp"
  aspect_ratio: "63:88" # Standard poker card (63:88), Tarot/Board (70:120), or Square Token (1:1)
  visual_description: "A rugged, matte-black military semi-automatic pistol with an integrated green laser sight and digital ammo counter reading '15', resting on a scratched steel briefing table under harsh fluorescent lighting."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---
```

### 5.2 Automated Manifest Exporter (`manifests/generate_manifests.js`)

A Node.js script that:
1. Crawls all component Markdown files under `/game/` (excluding `/game/core/`).
2. Parses YAML frontmatter and Markdown body content using `gray-matter`.
3. Validates required schema fields (`id`, `title`, `component_type`, `art_spec.asset_path`, `art_spec.visual_description`, `art_spec.art_style`, `art_spec.aspect_ratio`) and checks for duplicate `id`s.
4. Outputs clean, deterministic JSON files into `/manifests/exports/`:
   * `all_components.json` — Complete database of all parsed components.
   * `image_generation_manifest.json` — Streamlined array of `{ id, title, component_type, category, faction, asset_path, aspect_ratio, visual_description, art_style }` ready to feed into batch image-generation tools.
   * Category-specific manifests:
     * `factions.json` (8 factions)
     * `characters.json` (24 operatives)
     * `items.json` (89 armory items across all 7 sub-categories)
     * `perks.json` (12 multi-tier doctrines)
     * `agendas.json` (24 open agendas)
     * `secret_objectives.json` (10 tiered secret objectives)
     * `modifiers.json` (12 stage modifiers)
     * `hq_facilities.json` (5 base facilities / 15 modules + 4 landmarks)
     * `campaigns_and_missions.json` (2 campaigns, 7 campaign missions, 5 side-missions)

---

## 6. STATIC WIKI ENGINE & VIRTUAL TABLETOP (ASTRO + REACT/TS)

### 6.1 Wiki & Reference Features
* **Rulebook Reader:** Clean navigation across all `/game/core/` system chapters.
* **Semantic Keyword Parser / Badges:** Inline rendering of `[Combat]`, `[Infiltrate]`, `[Intel]`, `[Operations]`, `[Negotiate]`, `[Survival]`, `[CR]`, `[EF]`, `[PIP]`, `[LOY]`, `[MOM]`, `[DOOM]`, and `[VP]` with their designated hex colors, SVG icons, and hover tooltips.
* **Interactive Card Browser:** Filterable, searchable galleries for Characters, Armory Items (filter by slot, tier, focus, cost), Perks (interactive T1–T4 view), Agendas, Secret Objectives, Modifiers, Factions, and Missions.
* **Physical Card Preview Renderer:** Displays each component as a tabletop card mockup with its stats, slot badges, focus bars, rules text, and either its loaded `/assets/` image or a stylized `art_spec` placeholder blueprint.

### 6.2 Virtual Tabletop (VTT) Environment (`/src/vtt/`)
* **Campaign & HQ State Tracker:** Tracks active Campaign Dossier, Mission Index, Doom Tracker, Retry Budget, and constructed HQ Facility Modules / Landmarks.
* **Faction Vault Dashboards (1–4 Players):** Tracks Credits `[CR]`, Effort `[EF]`, `[PIP]`, Victory Points `[VP]`, Benched/Deployed Operatives, Dead Pool Martyrs, Equipped Perks, Open Agendas, and Secret Objectives.
* **Mission Staging & Active Stage Resolver:**
  * 4-Operative Squad Formation + Squad Leader designation & Command abilities (*Logistical Refresh*, *Dynamic Focus Swaps*, *Tactical Retreat*).
  * Active Stage Card + Stage Modifier Card overlay + Target Difficulty & Momentum calculator.
  * **Interactive Static Pool Dice Roller:** Commits dice from each operative's static pool for Phase 1 (Specialists, 3+), Phase 2 (Support, 4+ or 5+), tracks natural 1 Backfires, tallies successes, calculates Momentum ($\ge D+2$), and allows Momentum die refunds.
* **Med Bay Recovery Simulator:** Assigns wounded operatives to Infirmary beds, rolls Healing Dice (5+ or 4+), and assigns Critical Injury or Permanent Trauma tokens.
* **Local Persistence & JSON Import/Export:** Saves game state automatically to `localStorage` and supports exporting/importing campaign save files as JSON.

---

## 7. AGILE EXECUTION ROADMAP (ATOMIC ITERATIONS)

To prevent data loss and support frequent, clean Git commits, implementation is divided into small, self-contained iterations tracked in [`PROJECT_STATUS.md`](./PROJECT_STATUS.md):

* **Iteration 0:** Project Plan (`AGENT_PLAN.md`) & Agile Tracker (`PROJECT_STATUS.md`) initialization.
* **Iteration 1:** Scaffold directory tree (`/game/`, `/assets/`, `/manifests/`, `/src/`) + migrate Core Rulebook chapters (`/game/core/*.md`).
* **Iteration 2:** Create the 8 Faction Dossiers (`/game/factions/*.md`) + HQ Facilities & Landmarks (`/game/hq/*.md`).
* **Iteration 3:** Create the 24 Specialist Operative cards (`/game/characters/*.md`) synthesized with the 9.0 ES budget and named characters.
* **Iteration 4:** Create Armory Items Part 1 — Handhelds T1 & T2 (`/game/items/handheld_t1/`, `/game/items/handheld_t2/` — 28 items).
* **Iteration 5:** Create Armory Items Part 2 — Single-Slot Wearables T1 & T2 (`/game/items/wearables_t1/`, `/game/items/wearables_t2/` — 32 items).
* **Iteration 6:** Create Armory Items Part 3 — Multi-Slot Rigs, Consumables, and Complex Items (`/game/items/multi_slot/`, `/game/items/consumables/`, `/game/items/complex/` — 27 items).
* **Iteration 7:** Create Political & Encounter Decks — 12 Perks (`/game/perks/`), 24 Open Agendas (`/game/agendas/`), 10 Secret Objectives (`/game/secret_objectives/`), and 12 Stage Modifiers (`/game/modifiers/`).
* **Iteration 8:** Create Campaign Dossiers, Campaign Missions, and Side-Missions (`/game/campaigns/`, `/game/missions/`, `/game/side_missions/`).
* **Iteration 9:** Build & run the Manifest Generator (`manifests/generate_manifests.js`) + schema validation + generate all JSON exports in `/manifests/exports/`.
* **Iteration 10:** Initialize Astro + React/TypeScript web platform, semantic design tokens (`src/styles/`), SVG icon system (`assets/icons/`), and Rulebook Wiki pages.
* **Iteration 11:** Build interactive Card Renderers & Filterable Component Databases (Armory, Roster, Factions, Decks, Missions).
* **Iteration 12:** Build the Virtual Tabletop (VTT) state engine & playable UI (`src/vtt/`) + GitHub Pages CI/CD workflow (`.github/workflows/deploy.yml`).
