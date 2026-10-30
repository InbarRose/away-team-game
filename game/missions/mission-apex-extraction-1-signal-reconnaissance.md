---
id: "mission-apex-extraction-1-signal-reconnaissance"
title: "Mission 1: Signal Reconnaissance"
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
  secondary: "intel"
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
  campaign_id: "campaign-apex-extraction"
  mission_number: 1
  stage_count: 3
  doom_on_failure: 1
  bounty_credits: 6
  bounty_pip: 1
  bounty_effort: 0
  squad_requirement: "At least 1 [Combat] and 1 [Intel] operative"
stages:
  - stage_number: 1
    name: "Outer Gate Checkpoint"
    preset_focus: "combat"
    target_difficulty: 3
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "infiltrate"
      target_difficulty: 4
      cost: "[0 EF] (Standard Bypass)"
      description: "Scale the snowy perimeter cliffside and cut through sensor fencing unseen."
    failure_penalty: "Perimeter alarm triggered! Every deployed operative loses 1 static die from shock, and Stage 2 Target Difficulty escalates by +1 Success."
  - stage_number: 2
    name: "Patrol Bunker"
    preset_focus: "combat"
    target_difficulty: 4
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "survival"
      target_difficulty: 4
      cost: "[1 EF] from Squad Leader's Vault"
      description: "Spend [1 EF] to detour around the fortified guard bunker through sub-zero mountain drainage tunnels."
    failure_penalty: "Suppressive bunker fire! Every deployed operative takes 1 point of HP damage, and Stage 3 Target Difficulty escalates by +1 Success."
  - stage_number: 3
    name: "Relay Server Vault"
    preset_focus: "intel"
    target_difficulty: 4
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 6
      cost: "Triggers automated vault defenses (+2 Difficulty)"
      description: "Blast open the encrypted server racks and physically extract the telemetry drives under heavy security fire."
    failure_penalty: "Mission Failure: Telemetry wiped before decryption! Add [+1 FAIL] to the Campaign Track and consume 1 Campaign Retry from the global 2-retry budget."
rules_text: "Operation: Apex Extraction — Mission 1 (3 Stages). Base Clearance Bounty: [6 CR], [1 PIP]. Side-Missions unlocked upon return to HQ. Stage 1: Outer Gate Checkpoint ([Combat] D3; Bypass to [Infiltrate] D4). Stage 2: Patrol Bunker ([Combat] D4; Bypass to [Survival] D4 for [1 EF]). Stage 3: Relay Server Vault ([Intel] D4; Force Breach to [Combat] D6). Mission Failure adds [+1 FAIL] and consumes 1 of 2 Campaign Retries."
active_ability: null
tags:
  - "mission"
  - "apex-extraction"
  - "mission-1"
  - "planet"
  - "facility"
  - "three-stage"
art_spec:
  asset_path: "/assets/cards/missions/mission_apex_extraction_1_signal_reconnaissance.png"
  aspect_ratio: "70:120"
  visual_description: "A high-altitude border communications array perched on a jagged, wind-swept mountain peak at night, with a giant satellite dish glowing crimson and operatives breaching a concrete patrol bunker toward an underground server vault."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Mission 1: Signal Reconnaissance

> **Campaign:** [Operation: Apex Extraction](../campaigns/campaign-apex-extraction.md) (`Mission 1 of 4`)  
> **Location:** Border Communications Array ([Planet] / [Facility] Standard Drop)  
> **Base Clearance Bounty:** [6 CR], [1 PIP]  
> **Side-Mission Window:** Unlocked and freely available upon return to HQ

---

## 1. Narrative Briefing

**Ascendant Bio-Tech** has captured **Dr. Elena Vance**, chief bioweapons architect, and is routing her prisoner transport coordinates through a remote mountain communications relay post. The strike team drops onto the windswept ridge to breach the perimeter checkpoint, clear or bypass the fortified patrol bunker, and decrypt the relay server vault to pinpoint her black-site holding cell.

* **Return to HQ:** Upon clearing Stage 3, the squad extracts to HQ to process the telemetry and prepare for the **Double-Mission Continuous Drop (Missions 2 & 3)**. Side-Missions are freely unlocked prior to launching Mission 2.
* **Failure & Retry Rules:** Failing Mission 1 advances the Campaign Mission Failure Track by **[+1 FAIL]** and consumes **`1 Campaign Retry`** from the campaign's strict **2-retry global budget**.

---

## 2. Preset Stage Track (3 Stages)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Outer Gate Checkpoint** | [Combat] | **3 Successes** | **Tactical Bypass ([Infiltrate]):** Target $D = 4$ | Alarm triggered! All deployed operatives lose **1 static die**; Stage 2 $D$ increases by **$+1$ Success**. |
| **2** | **Patrol Bunker** | [Combat] | **4 Successes** *(5 if S1 failed)* | **Tactical Bypass ([Survival]):** Cost [1 EF], Target $D = 4$ | Suppressive fire! All deployed operatives take **1 HP damage**; Stage 3 $D$ increases by **$+1$ Success**. |
| **3** | **Relay Server Vault** | [Intel] | **4 Successes** *(+1 if S2 failed)* | **Force Breach ([Combat]):** Target $D = 6$ | **Mission Failure:** Add **[+1 FAIL]** and consume **1 Campaign Retry** (of 2 max). |

---

## 3. Detailed Stage Breakdown

### Stage 1: Outer Gate Checkpoint
* **Preset Focus:** [Combat] — **Target Difficulty: 3 Successes**
  * *Narrative:* Eliminating Ascendant perimeter sentries at the mountain access gate before they can alert the bunker garrison.
* **Dynamic Focus Swap — Tactical Bypass ([Infiltrate]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Infiltrate] at **Target Difficulty: 4 Successes**.
  * *Narrative:* Scale the icy perimeter cliffside and cut through laser sensor fencing unseen.
* **Stage Failure Penalty (Tactical Blowback):**
  * Perimeter alarm triggered! Every deployed operative loses **1 static die** from shock, and Stage 2 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 2: Patrol Bunker
* **Preset Focus:** [Combat] — **Target Difficulty: 4 Successes** *(Escalates to **5 Successes** if Stage 1 failed)*
  * *Narrative:* Clearing a reinforced concrete guard bunker blocking the subterranean conduit to the relay vault.
* **Dynamic Focus Swap — Tactical Bypass ([Survival]):**
  * During Step 1 (Briefing), the Squad Leader may spend **[1 EF]** from their Faction Vault to shift the stage to [Survival] at **Target Difficulty: 4 Successes** *(or **5 Successes** if Stage 1 failed)*.
  * *Narrative:* Detour around the fortified bunker by crawling through sub-zero mountain drainage tunnels.
* **Stage Failure Penalty (Tactical Blowback):**
  * Heavy interlocking gunfire! Every deployed operative takes **1 point of HP damage**, and Stage 3 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 3: Relay Server Vault (Climax Stage)
* **Preset Focus:** [Intel] — **Target Difficulty: 4 Successes** *(Escalates to **5 Successes** if Stage 2 failed)*
  * *Narrative:* Overriding server ICE terminals and decrypting prisoner transport telemetry confirming Dr. Vance's location at Complex Alpha.
* **Dynamic Focus Swap — Force Breach ([Combat]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Combat] at **Target Difficulty: 6 Successes** *(or **7 Successes** if Stage 2 failed)*.
  * *Narrative:* Blast open the encrypted server racks and physically rip out the master telemetry drives under heavy security fire.
* **Stage Clearance:**
  * **Mission Accomplished!** Award **[6 CR]** and **[1 PIP]**. The squad returns to HQ with Side-Missions unlocked before launching Mission 2.
* **Stage Failure Penalty (Mission Failure):**
  * Telemetry is wiped before decryption completes! Advance the Campaign Mission Failure Track by **[+1 FAIL]** and consume **`1 Campaign Retry`** from the global 2-retry budget.
