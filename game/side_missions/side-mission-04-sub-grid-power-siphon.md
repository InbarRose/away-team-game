---
id: "side-mission-04-sub-grid-power-siphon"
title: "Side-Mission: Sub-Grid Power Siphon"
component_type: "side_mission"
category: "side_mission"
faction: "neutral"
tier: 2
deck_copies: 1
cost:
  credits: 0
  effort: 0
  pip: 0
focus_affinity:
  primary: "operations"
  secondary: "combat"
  bridges:
    - "infiltrate"
    - "survival"
stats:
  es_budget: null
  hp_cap: null
  static_dice: null
  temp_dice_bonus: null
  slots_required: []
  armor_buffer: null
  stage_count: 3
  bounty_credits: 5
  bounty_pip: 0
  bounty_effort: 2
  bonus_bounty: "Clear Stage 2 without rolling any natural 1s (Backfires) -> +2 [CR]"
themes:
  - "Facility"
  - "Urban"
stages:
  - stage_number: 1
    name: "Maintenance Checkpoint"
    preset_focus: "combat"
    target_difficulty: 3
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "infiltrate"
      target_difficulty: 4
      cost: "0 Effort (Standard Bypass)"
      description: "Crawl through high-voltage utility conduits to bypass the maintenance checkpoint."
    failure_penalty: "Alert tripped! Stage 2 Target Difficulty escalates by +1 Success."
  - stage_number: 2
    name: "High-Voltage Recalibration"
    preset_focus: "operations"
    target_difficulty: 4
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 5
      cost: "Triggers transformer coolant rupture (+1 Difficulty)"
      description: "Override the transformers by shooting out the pressurized liquid nitrogen cooling lines."
    failure_penalty: "Voltage arc! Every deployed operative takes 1 point of HP damage."
  - stage_number: 3
    name: "Generator Overdrive"
    preset_focus: "survival"
    target_difficulty: 4
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "operations"
      target_difficulty: 4
      cost: "0 Effort (Terminal Override)"
      description: "Engage emergency heat sinks via terminal overrides to vent the plasma feedback safely."
    failure_penalty: "Generator safety trip! The siphon fails; the squad extracts without base payouts."
rules_text: "Side-Mission (Themes: [Facility], [Urban] — 3 Stages). Base Clearance Bounty: 5 [CR], 2 [EF] deposited directly into Vault. Bonus Bounty: Clear Stage 2 without rolling natural 1s -> +2 [CR]. Stage 1: Maintenance Checkpoint ([Combat] D3; Bypass to [Infiltrate] D4). Stage 2: High-Voltage Recalibration ([Operations] D4; Force Breach to [Combat] D5). Stage 3: Generator Overdrive ([Survival] D4; Bypass to [Operations] D4)."
active_ability: null
tags:
  - "side-mission"
  - "facility"
  - "urban"
  - "effort-bounty"
  - "three-stage"
art_spec:
  asset_path: "/assets/cards/side_missions/side_mission_04_sub_grid_power_siphon.webp"
  aspect_ratio: "70:120"
  visual_description: "A cavernous subterranean corporate power substation crackling with electric-teal plasma arcs and towering high-voltage capacitor banks, as an Engineer operative connects heavy siphon cables to a glowing battery core."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Side-Mission: Sub-Grid Power Siphon

> **Themes:** 🔬 `[Facility]` • 🏙️ `[Urban]`  
> **Base Clearance Bounty:** `5 [CR]`, **`2 [EF]`** *(deposited directly into Faction Vault)*  
> **Bonus Bounty:** Clear Stage 2 without rolling any **natural 1s (Backfires)** $\rightarrow$ **`+2 [CR]`** (`7 [CR]`, `2 [EF]` Total!)

---

## 1. Narrative Briefing

Located in the subterranean levels of a massive corporate arcology, an auxiliary power substation feeds high-density energy to regional security grids. The strike team infiltrates the sub-grid to neutralize perimeter sentries, recalibrate the high-voltage conduits, and siphon raw `[EF]` battery reserves directly into Faction Vaults.

---

## 2. Preset Stage Track (3 Stages)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Maintenance Checkpoint** | `[Combat]` | **3 Successes** | **Tactical Bypass (`[Infiltrate]`):** Target $D = 4$ | Alert tripped! Stage 2 Target Difficulty escalates by **$+1$ Success**. |
| **2** | **High-Voltage Recalibration** | `[Operations]` | **4 Successes** *(5 if S1 failed)* | **Force Breach (`[Combat]`):** Target $D = 5$ | Voltage arc! Every deployed operative takes **1 HP damage**. |
| **3** | **Generator Overdrive** | `[Survival]` | **4 Successes** | **Tactical Bypass (`[Operations]`):** Target $D = 4$ | **Mission Failure:** Generator safety trip! Squad extracts without payouts. |

---

## 3. Detailed Stage Breakdown

### Stage 1: Maintenance Checkpoint
* **Preset Focus:** `[Combat]` — **Target Difficulty: 3 Successes**
  * *Narrative:* Neutralizing armed facility engineers and automated sentries guarding the substation entrance.
* **Dynamic Focus Swap — Tactical Bypass (`[Infiltrate]`):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to `[Infiltrate]` at **Target Difficulty: 4 Successes**.
  * *Narrative:* Crawl through high-voltage utility conduits unseen.
* **Stage Failure Penalty (Tactical Blowback):**
  * Alert tripped! Stage 2 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 2: High-Voltage Recalibration
* **Preset Focus:** `[Operations]` — **Target Difficulty: 4 Successes** *(Escalates to **5 Successes** if Stage 1 failed)*
  * *Narrative:* Re-routing electrical feeds to extract energy without tripping the main substation breakers.
* **Dynamic Focus Swap — Force Breach (`[Combat]`):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to `[Combat]` at **Target Difficulty: 5 Successes** *(or **6 Successes** if Stage 1 failed)*.
  * *Narrative:* Override the transformers by shooting out the pressurized liquid nitrogen cooling lines.
* **Bonus Condition:** If Stage 2 is cleared with **zero natural 1s (Backfires)** rolled across all operatives, unlock the **`+2 [CR]` Bonus Bounty**!
* **Stage Failure Penalty (Tactical Blowback):**
  * Voltage arc! Every deployed operative takes **1 point of HP damage**.

---

### Stage 3: Generator Overdrive (Climax Stage)
* **Preset Focus:** `[Survival]` — **Target Difficulty: 4 Successes**
  * *Narrative:* Enduring intense thermal radiation and plasma feedback while harvesting the overloaded power core.
* **Dynamic Focus Swap — Tactical Bypass (`[Operations]`):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to `[Operations]` at **Target Difficulty: 4 Successes**.
  * *Narrative:* Engage emergency heat sinks via terminal overrides.
* **Stage Clearance:**
  * **Side-Mission Cleared!** Award **`5 [CR]`** and **`2 [EF]`** (plus **`+2 [CR]`** if no natural 1s were rolled in Stage 2).
* **Stage Failure Penalty (Mission Failure):**
  * Generator safety trip! The siphon fails and the squad extracts without base payouts.
