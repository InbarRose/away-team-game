---
id: "mission-iron-dawn-3-orbital-array-sabotage"
title: "Mission 3: Orbital Array Sabotage / Extraction Zero"
component_type: "mission"
category: "campaign_mission"
faction: "neutral"
tier: 2
deck_copies: 1
cost:
  credits: 0
  effort: 0
  pip: 0
focus_affinity:
  primary: "combat"
  secondary: "survival"
  bridges:
    - "operations"
    - "infiltrate"
stats:
  es_budget: null
  hp_cap: null
  static_dice: null
  temp_dice_bonus: null
  slots_required: []
  armor_buffer: null
  campaign_id: "campaign-iron-dawn"
  mission_number: 3
  stage_count: 3
  doom_on_failure: 1
  bounty_credits: 0
  bounty_pip: 0
  bounty_effort: 0
  squad_requirement: "At least 2 [Combat] and 1 [Survival] operative"
stages:
  - stage_number: 1
    name: "Hangar Bay Breach / Overload Terminal"
    preset_focus: "combat"
    target_difficulty: 4
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "infiltrate"
      target_difficulty: 4
      cost: "[0 EF] (or Force Breach from [Operations] D4 to [Combat] D5 in Extraction Zero variant)"
      description: "Slip through external zero-g maintenance airlocks (or shoot out the reactor control relays manually under guard fire in the Overload Terminal variant)."
    failure_penalty: "Core malfunction / explosive decompression! Every deployed operative takes 1 point of HP damage and loses 1 static die."
  - stage_number: 2
    name: "Relay Power Grid / Helipad Defense"
    preset_focus: "operations"
    target_difficulty: 4
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 5
      cost: "Triggers station siege alert (Mandatory [Combat] D5 siege in Helipad Defense variant)"
      description: "Plant demolition charges directly on the primary power conduits while holding off waves of orbital security reinforcements."
    failure_penalty: "Heavy crossfire and arc discharge! Every deployed operative takes 1 point of HP damage and Stage 3 Target Difficulty escalates by +1 Success."
  - stage_number: 3
    name: "Master Control Hub / Evacuation Dash"
    preset_focus: "combat"
    target_difficulty: 5
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "survival"
      target_difficulty: 4
      cost: "1 static die per deployed operative"
      description: "Every deployed operative spends 1 static die to leap across collapsing zero-g catwalks and burning landing strips directly onto the extraction shuttle ramp."
    failure_penalty: "Mission Failure: Sabotage fails / shuttle wave aborted! Add [+1 FAIL] to the Campaign Track. If Doom hits 3, Game Over; otherwise squad may retry Mission 3."
rules_text: "Operation: Iron Dawn — Mission 3 Climax (3 Stages). Requires >= 2 [Combat] and >= 1 [Survival] operative. Stage 1: Hangar Bay Breach / Overload Terminal ([Combat] D4 with [Infiltrate] D4 Bypass, or [Operations] D4 with [Combat] D5 Breach). Stage 2: Relay Power Grid / Helipad Defense ([Operations] D4 with [Combat] D5 Breach, or Mandatory [Combat] D5 Siege). Stage 3: Master Control Hub / Evacuation Dash ([Combat] D4-5; Bypass to [Survival] D4-5 by spending 1 static die per operative). Clearing Stage 3 wins the Campaign!"
active_ability: null
tags:
  - "mission"
  - "iron-dawn"
  - "mission-3"
  - "climax"
  - "space"
  - "facility"
  - "three-stage"
art_spec:
  asset_path: "/assets/cards/missions/mission_iron_dawn_3_orbital_array_sabotage.webp"
  aspect_ratio: "70:120"
  visual_description: "A dramatic zero-g firefight inside the burning hangar bay of an orbital communications spire as plasma conduits overload, with operatives leaping across collapsing catwalks toward an open assault shuttle ramp against a backdrop of Earth in low orbit."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Mission 3: Orbital Array Sabotage / Extraction Zero

> **Campaign:** [Operation: Iron Dawn](../campaigns/campaign-iron-dawn.md) (`Mission 3 of 3 — Campaign Finale`)  
> **Location:** High-Orbit Communications Spire ([Space] Macro-Arc) / Meltdown Landing Strip ([Facility] Variant)  
> **Base Clearance Bounty:** **CAMPAIGN VICTORY!** (Triggers Final Executive [VP] Audit)  
> **Squad Target Requirement:** $\ge 2$ [Combat], $\ge 1$ [Survival] operative

---

## 1. Narrative Briefing & Theater Variants

* **Revised Global Macro-Arc ("Orbital Array Sabotage" — High-Orbit Spire):** To permanently dismantle Ascendant Bio-Tech, the squad launches an orbital assault shuttle to breach their high-orbit broadcast station, sabotage the primary power relays, and sever their global command network at the Master Control Hub.
* **Facility Incursion Variant ("Extraction Zero"):** With telemetry secured, the facility enters catastrophic meltdown. The squad must overload the reactor terminal, hold the rooftop helipad against waves of reinforcements, and dash across the collapsing superstructure onto the extraction shuttle.
* **Retry Narrative:** If Stage 3 fails, the sabotage sequence is aborted (or the shuttle is forced to wave off) and the squad executes an emergency retreat ([+1 FAIL]). If [FAIL] reaches `3`, the Agency suffers **Game Over**; if [FAIL] is `1` or `2`, the squad returns to HQ and may launch a second orbital drop before the station changes orbit.

---

## 2. Preset Stage Track (3 Stages — Campaign Climax)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Hangar Bay Breach** *(or Overload Terminal)* | [Combat] *(or [Operations])* | **4 Successes** | **Bypass ([Infiltrate] D4)** *or* **Breach ([Combat] D5)** | Explosion vents through chamber! Every deployed operative takes **1 HP damage** and loses **1 static die**. |
| **2** | **Relay Power Grid** *(or Helipad Defense)* | [Operations] *(or [Combat])* | **4–5 Successes** | **Force Breach ([Combat] D5)** *(Mandatory Siege in Variant)* | Heavy crossfire! Every deployed operative takes **1 HP damage**; Stage 3 $D$ increases by **$+1$ Success**. |
| **3** | **Master Control Hub** *(or Evacuation Dash)* | [Combat] | **4–5 Successes** *(+1 if S2 failed)* | **Tactical Bypass ([Survival] D4–5):** Cost `1 die/operative` | **Mission Failure:** Add **[+1 FAIL]**. If [FAIL] $< 3$, squad may retry Mission 3. |

---

## 3. Detailed Stage Breakdown

### Stage 1: Hangar Bay Breach / Overload Terminal
* **Global Orbital Track (`Hangar Bay Breach`):**
  * **Preset Focus:** [Combat] — **Target Difficulty: 4 Successes** (*Breaching the orbital docking bay under guard fire*).
  * **Tactical Bypass ([Infiltrate]):** Shift to [Infiltrate] at **Target Difficulty: 4 Successes** (*Slip through external zero-g maintenance airlocks*).
* **Facility Meltdown Track (`Overload Terminal`):**
  * **Preset Focus:** [Operations] — **Target Difficulty: 4 Successes** (*Overclocking the facility power core to destroy all remaining research*).
  * **Force Breach ([Combat]):** Shift to [Combat] at **Target Difficulty: 5 Successes** (*Shoot out the control relays manually under heavy guard fire*).
* **Stage Failure Penalty (Tactical Blowback):**
  * Core malfunction and explosive decompression! **Every deployed operative takes 1 point of HP damage** and loses **1 static die** from their pool.

---

### Stage 2: Relay Power Grid / Helipad Defense
* **Global Orbital Track (`Relay Power Grid`):**
  * **Preset Focus:** [Operations] — **Target Difficulty: 4 Successes** (*Sabotaging the station's primary broadcast power conduits*).
  * **Force Breach ([Combat]):** Shift to [Combat] at **Target Difficulty: 5 Successes** (*Demolish the relay transformers while holding off orbital security forces*).
* **Facility Meltdown Track (`Helipad Defense`):**
  * **Preset Focus:** [Combat] — **Target Difficulty: 5 Successes** (*Mandatory siege firefight holding off waves of enemy reinforcements on the rooftop helipad; no Dynamic Swap available*).
* **Stage Failure Penalty (Tactical Blowback):**
  * Heavy crossfire! **Every deployed operative takes 1 point of HP damage** and Stage 3 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 3: Master Control Hub / Evacuation Dash (Campaign Finale)
* **Preset Focus:** [Combat] — **Target Difficulty: 5 Successes** on Orbital Track / **4 Successes** on Facility Track *(Escalates by **`+1 Success`** if Stage 2 failed)*
  * *Narrative:* Severing Ascendant's master network core and fighting across the burning landing bay to reach the open extraction shuttle ramp.
* **Dynamic Focus Swap — Tactical Bypass ([Survival]):**
  * During Step 1 (Briefing), **every deployed operative may spend 1 static die** from their pool to shift the stage to [Survival] at **Target Difficulty: 4 Successes** (Facility Track) or **5 Successes** (Orbital Track).
  * *Narrative:* Leap across collapsing superstructure catwalks and zero-g debris directly onto the extraction shuttle ramp.
* **Stage Clearance (Campaign Victory!):**
  * **CAMPAIGN VICTORY!** Ascendant Bio-Tech's network is permanently destroyed and the strike team escapes into orbit. Proceed immediately to the **Final Executive [VP] Audit**: convert [PIP] (`[2 VP]`), living & Dead Pool [LOY] (`[2 VP]` + `[3 VP]` per Tier 4 Icon), and score Tiered **Secret Objectives** (`15 / 10 / [5 VP]`).
* **Stage Failure Penalty (Mission Failure):**
  * The sabotage charges fail / the shuttle is forced to wave off! Advance the Campaign Mission Failure Track by **[+1 FAIL]**. If [FAIL] reaches `3`, the campaign ends in **Game Over (Task Force Dissolution)**. If [FAIL] is `1` or `2`, the squad returns to HQ and may retry Mission 3.
