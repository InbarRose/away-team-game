---
id: "core-table-setup-and-glossary"
title: "Table Setup, Component Anatomy & Glossary"
component_type: "core_rule"
category: "core"
order: 8
summary: "Physical table layout blueprint, player enclave anatomy, component definitions, and complete semantic keyword glossary."
---

# Table Setup, Component Anatomy & Glossary

---

## 1. Physical Table Layout Blueprint

Setting up **Away Team** organizes the table into two concentric operational zones: the **Central Command Zone** (shared mission stage track, market boards, and campaign records) and the **Perimeter Faction Enclaves** (individual player dashboards, operative slots, and vault reserves).

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PERIMETER: PLAYER 1                             │
│                  [Faction Dashboard • Vault • Active Agent]                 │
├───────────────┬─────────────────────────────────────────────┬───────────────┤
│               │             CENTRAL COMMAND ZONE            │               │
│               │                                             │               │
│  PERIMETER:   │  ┌───────────────┐       ┌───────────────┐  │  PERIMETER:   │
│   PLAYER 4    │  │  STAGE TRACK  │       │  HQ FACILITY  │  │   PLAYER 2    │
│               │  │  Stages 1 – 4 │       │  5 Facilities │  │               │
│   [Faction    │  └───────────────┘       └───────────────┘  │   [Faction    │
│  Dashboard    │  ┌───────────────┐       ┌───────────────┐  │  Dashboard    │
│   • Vault     │  │ RECRUITMENT & │       │ CAMPAIGN LOG  │  │   • Vault     │
│  • Agent]     │  │ QUARTERMASTER │       │ [FAIL] TRACK  │  │  • Agent]     │
│               │  └───────────────┘       └───────────────┘  │               │
├───────────────┴─────────────────────────────────────────────┴───────────────┤
│                             PERIMETER: PLAYER 3                             │
│                  [Faction Dashboard • Vault • Active Agent]                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Setting Up the Central Command Zone
1. **The Campaign Dossier:** Place the active campaign sheet (e.g., *Operation: Iron Dawn*) in the center. Initialize the **Mission Failure Tracker ([FAIL])** at `0`.
2. **The Active Mission Stage Track:** Deal the printed sequence of 3 to 5 Stage Cards face-down in a horizontal line. Place the **Stage Modifier Deck** adjacent to the track.
3. **The HQ Facility Board:** Lay out the 5 baseline Facility cards (*Infirmary*, *Quartermaster*, *Recruitment Bureau*, *Intel Array*, *Boardroom*) alongside the 4 Landmark slots.
4. **Markets & Supplies:**
   * **Recruitment Pool:** Deal 3 face-up Specialist Operatives from the Character Deck.
   * **Quartermaster Shop:** Deal 4 face-up Armory items (Handhelds, Wearables, Consumables).
   * **Bank Supply:** Organize Credits `[CR]`, Effort `[EF]`, Political Influence `[PIP]`, and general dice supplies.

### 1.2 Setting Up Player Faction Enclaves
Each player receives:
1. **1 Faction Dossier & Dashboard:** Selected from the 8 available corporate factions (e.g., *Aegis Security Solutions*, *Vanderbilt Sovereign Group*).
2. **Starting Vault Assets:** As indicated on the chosen Faction card (typically `[5 CR]`, `[3 EF]`, `[1 PIP]`).
3. **Starting Operatives:** Recruit your starting specialist operative to fill your active slot, placing any backup operatives in your **Bench Tray**.
4. **Physical Dice Tray:** Retrieve static dice matching your deployed operative's starting pool.

---

## 2. Component Anatomy

### 2.1 Specialist Operative Card Anatomy
* **Header:** Operative Name, Call-sign, and Class icon (Soldier, Recon, Scientist, Diplomat, Technician, Survivalist).
* **Focus Affinities:** **Primary Focus (`3+`)** and **Secondary Focus (`4+`)**.
* **Stat Envelope:** Maximum Hit Points (`HP`) and Starting Static Dice Pool.
* **Class Ability:** Integrated standard `[1 EF]` class action.
* **Unique Tactical Power:** Named passive or active signature ability.
* **Loyalty Track:** 4-tier rank track (`1 / 3 / 6 / [10+ LOY]`) for mission survival stars.

### 2.2 Armory Item Card Anatomy
* **Slot Requirement:** [Hand L], [Hand R], [Head], [Body], [Legs], [Pack], or [Complex].
* **Cost:** Purchase cost in [CR] from the Quartermaster.
* **Activation Trigger:** Passive, Step 1 Briefing, Rolling Phase, or Post-Initiative Triage.
* **Operational Effect:** Direct mechanical bonus, die modification, or defensive mitigation.

### 2.3 Stage Encounter Card Anatomy
* **Stage Name & Sector:** Flavor brief and sector tag ([Urban], [Space], [Facility], etc.).
* **Preset Focus:** The operational focus required to beat the room ([Combat], [Infiltrate], [Intel], [Operations], [Negotiate], [Survival]).
* **Target Difficulty ($D$):** Number of uncancelled successes needed to clear the stage.
* **Dynamic Focus Swap Options:** Rules for *Force Breach* (to Combat) or *Tactical Bypass*.
* **Failure Penalty:** Immediate consequences suffered if the squad fails or retreats.

---

## 3. Comprehensive Semantic Keyword Glossary

### Core Currencies & Metrics
* **[CR] — Credits:** Liquid corporate currency stored in Faction Vaults. Used for equipment purchases, hiring operatives, sponsoring facilities, and bidding in auctions. Fully tradeable between players.
* **[EF] — Effort:** Tactical operational fuel stored in Faction Vaults. Expended to trigger Class Abilities, power Complex equipment, perform Logistical Refreshes, and stabilize dying operatives. Non-tradeable.
* **[PIP] — Political Influence:** High-scarcity executive leverage. Used to sponsor high-tier HQ modules, break auction ties, and satisfy Vulture Taxes. Worth `[2 VP]` each at campaign conclusion. Non-tradeable.
* **[MOM] — Operational Momentum:** Transient tactical momentum generated during an active mission when clearing a stage with $\ge D + 2$ successes. Spent immediately to restore spent static dice. Never stored in vaults.
* **[LOY] — Loyalty:** Personal operative progression rank earned by surviving missions. Permanently bound to individual character cards; cannot be spent or traded. Unlocks faction perks and scores `[2 VP]` per point at endgame.
* **[FAIL] — Mission Failure Tracker:** Macro campaign tracker recording catastrophic operational failures. If the tracker reaches the campaign's failure limit, the coalition suffers Task Force Dissolution (collective defeat).
* **[VP] — Victory Points:** Final corporate supremacy score tallied at the end of the campaign to determine the winning Faction Director.

### Focus Categories
* **[Combat]:** Kinetic firefights, breaches, suppression, and physical violence (Tier 1: 50% of stages).
* **[Infiltrate]:** Stealth, lock bypass, security circumvention, and covert movement (Tier 2).
* **[Intel]:** Decryption, sensor sweeps, terminal hacking, and research analysis (Tier 2).
* **[Operations]:** Mechanical engineering, heavy machinery, sabotage, and jury-rigging (Tier 3).
* **[Negotiate]:** Social engineering, parley, extortion, interrogation, and corporate diplomacy (Tier 2).
* **[Survival]:** Hostile atmospheric navigation, biohazard containment, and physical endurance (Tier 3).

---

## 4. Rulebook Callouts, Examples of Play & Diagram Blueprints

> [!NOTE]
> **Component Verification Checklist:** Before embarking on your first campaign, verify that your game set includes all 200 components: 8 Faction Dossiers, 24 Specialist Operatives, 87 Armory Items, 12 Perks, 24 Agendas, 10 Secret Objectives, 12 Modifiers, and 2 Campaign Dossiers (with 14 missions).

> [!EXAMPLE]
> **Example of Play — Setting Up a 4-Player Operation:**
> 1. Four Directors select their corporate Factions: Aegis, Obsidian, Vanderbilt, and Titan.
> 2. Each Director sets up their Faction Dashboard with starting Vault assets (`[5 CR]`, `[3 EF]`, `[1 PIP]`).
> 3. Each player recruits their initial specialist operative to fill their active field slot (e.g., Aegis deploys *The Commander*).
> 4. In the Central Command Zone, place the *Operation: Iron Dawn* Campaign Dossier, initialize the **Mission Failure Tracker ([FAIL])** at `0`, and deal the 3 Stage Cards for Mission 1 (*Black-Market Intercept*).

> [!DIAGRAM]
> **Figure 8.1 — Complete Table Setup & Component Hierarchy Schematic**
> * **Visual Specification:** Comprehensive full-table layout illustration showing Central Command Zone with active Mission Stage Track (Stages 1–3), Stage Modifier deck, HQ Facility Board (5 facilities + 4 landmarks), and Recruitment/Quartermaster markets, flanked by 4 player perimeter enclaves with Faction Dashboards, 3-Currency Vaults, and Operative Loadout Mats.
> * **Aspect Ratio:** `16:9` Rulebook Spread Diagram • **Asset Path:** `/assets/rulebook/fig_8_1_complete_table_setup.webp`
