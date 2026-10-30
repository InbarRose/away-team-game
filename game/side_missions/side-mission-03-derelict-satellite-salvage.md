---
id: "side-mission-03-derelict-satellite-salvage"
title: "Side-Mission: Derelict Satellite Salvage"
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
  primary: "combat"
  secondary: "intel"
  bridges:
    - "survival"
    - "operations"
stats:
  es_budget: null
  hp_cap: null
  static_dice: null
  temp_dice_bonus: null
  slots_required: []
  armor_buffer: null
  stage_count: 3
  bounty_credits: 6
  bounty_pip: 2
  bounty_effort: 0
  bonus_bounty: "Spend [0 EF] during the entire mission -> [+2 CR]"
themes:
  - "Space"
stages:
  - stage_number: 1
    name: "Airlock Debris Field"
    preset_focus: "survival"
    target_difficulty: 3
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 4
      cost: "Triggers hull shockwave (+1 Difficulty)"
      description: "Blast through the jammed airlock doors and floating debris using heavy firearms."
    failure_penalty: "Debris impact! Every deployed operative loses 1 static die from shock."
  - stage_number: 2
    name: "Sentry Drone Bay"
    preset_focus: "combat"
    target_difficulty: 4
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "operations"
      target_difficulty: 4
      cost: "[0 EF] (Terminal Hack)"
      description: "Hack the drone control terminal to shut down the automated security drones remotely."
    failure_penalty: "Electrical discharge! The Squad Leader loses [1 EF] from their Faction Vault."
  - stage_number: 3
    name: "Mainframe Core Siphon"
    preset_focus: "intel"
    target_difficulty: 4
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 6
      cost: "Triggers automated turret fire (+2 Difficulty)"
      description: "Physically rip out the server drives under automated turret fire as the satellite breaks apart."
    failure_penalty: "Orbit decays! Mission fails; the squad retreats to the shuttle empty-handed without base payouts."
rules_text: "Side-Mission (Themes: [Space] — 3 Stages). Base Clearance Bounty: [6 CR], [2 PIP]. Bonus Bounty: Spend [0 EF] during the mission -> [+2 CR]. Stage 1: Airlock Debris Field ([Survival] D3; Force Breach to [Combat] D4). Stage 2: Sentry Drone Bay ([Combat] D4; Bypass to [Operations] D4). Stage 3: Mainframe Core Siphon ([Intel] D4; Force Breach to [Combat] D6)."
active_ability: null
tags:
  - "side-mission"
  - "space"
  - "zero-g"
  - "satellite"
  - "three-stage"
art_spec:
  asset_path: "/assets/cards/side_missions/side_mission_03_derelict_satellite_salvage.png"
  aspect_ratio: "70:120"
  visual_description: "A decommissioned corporate research satellite tumbling through low planetary orbit surrounded by glowing atmospheric re-entry sparks and floating hull debris, as EVA-suited operatives breach the airlock."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Side-Mission: Derelict Satellite Salvage

> **Themes:** 🛰️ [Space]  
> **Base Clearance Bounty:** [6 CR], [2 PIP]  
> **Bonus Bounty:** Spend **[0 EF]** during the entire mission $\rightarrow$ **[+2 CR]** ([8 CR], [2 PIP] Total!)

---

## 1. Narrative Briefing

A decommissioned corporate research satellite is drifting into terminal orbital decay. The strike team docks via assault shuttle to navigate the zero-g hull debris field, neutralize or hack the active sentry drone bay, and siphon prototype telemetry cores before atmospheric re-entry incinerates the station.

---

## 2. Preset Stage Track (3 Stages)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Airlock Debris Field** | [Survival] | **3 Successes** | **Force Breach ([Combat]):** Target $D = 4$ | Debris impact! Every deployed operative loses **1 static die** from shock. |
| **2** | **Sentry Drone Bay** | [Combat] | **4 Successes** | **Tactical Bypass ([Operations]):** Target $D = 4$ | Electrical discharge! Squad Leader loses **[1 EF]** from their Faction Vault. |
| **3** | **Mainframe Core Siphon** | [Intel] | **4 Successes** | **Force Breach ([Combat]):** Target $D = 6$ | **Mission Failure:** Orbit decays! Squad retreats empty-handed without base payouts. |

---

## 3. Detailed Stage Breakdown

### Stage 1: Airlock Debris Field
* **Preset Focus:** [Survival] — **Target Difficulty: 3 Successes**
  * *Narrative:* Navigating zero-g space debris and venting cryo-gas to breach the outer airlock.
* **Dynamic Focus Swap — Force Breach ([Combat]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Combat] at **Target Difficulty: 4 Successes**.
  * *Narrative:* Blast through jammed airlock doors using heavy firearms.
* **Stage Failure Penalty (Tactical Blowback):**
  * Debris impact! Every deployed operative loses **1 static die** from shock.

---

### Stage 2: Sentry Drone Bay
* **Preset Focus:** [Combat] — **Target Difficulty: 4 Successes**
  * *Narrative:* Destroying active automated security drones guarding the zero-g main corridor.
* **Dynamic Focus Swap — Tactical Bypass ([Operations]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Operations] at **Target Difficulty: 4 Successes**.
  * *Narrative:* Hack the drone sub-terminal to shut them down remotely.
* **Stage Failure Penalty (Tactical Blowback):**
  * Electrical discharge! The Squad Leader loses **[1 EF]** from their Faction Vault.

---

### Stage 3: Mainframe Core Siphon (Climax Stage)
* **Preset Focus:** [Intel] — **Target Difficulty: 4 Successes**
  * *Narrative:* Extracting encrypted research telemetry as the satellite superstructure begins breaking apart in upper-atmosphere friction.
* **Dynamic Focus Swap — Force Breach ([Combat]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Combat] at **Target Difficulty: 6 Successes**.
  * *Narrative:* Physically rip out the server drives under automated turret fire.
* **Stage Clearance:**
  * **Side-Mission Cleared!** Award **[6 CR]** and **[2 PIP]** (plus **[+2 CR]** if no Faction spent any [EF] on Class Abilities, Faction Powers, or Logistical Refresh during the mission).
* **Stage Failure Penalty (Mission Failure):**
  * Orbit decays! The mission fails and the squad retreats to the shuttle empty-handed without base payouts.
