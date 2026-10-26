---
id: "mission-iron-dawn-2-deep-sea-laboratory-raid"
title: "Mission 2: Deep-Sea Laboratory Raid / The Subterranean Core"
component_type: "mission"
category: "campaign_mission"
faction: "neutral"
tier: 1
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
stats:
  es_budget: null
  hp_cap: null
  static_dice: null
  temp_dice_bonus: null
  slots_required: []
  armor_buffer: null
  campaign_id: "campaign-iron-dawn"
  mission_number: 2
  stage_count: 3
  doom_on_failure: 1
  bounty_credits: 8
  bounty_pip: 2
  bounty_effort: 0
  squad_requirement: "At least 1 [Combat] and 1 [Intel] operative"
stages:
  - stage_number: 1
    name: "Ocean Platform Docks / Containment Sector Patrol"
    preset_focus: "combat"
    target_difficulty: 4
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "survival"
      target_difficulty: 4
      cost: "[1 EF] from Squad Leader's Vault"
      description: "Spend [1 EF] to bypass the heavy security patrol by swimming through pressurized intake ducts or climbing toxic ventilation shafts."
    failure_penalty: "Ambush counter-attack! Every deployed operative takes 1 point of HP damage."
  - stage_number: 2
    name: "Heavy Enforcer Gate"
    preset_focus: "combat"
    target_difficulty: 3
    dynamic_swap: null
    failure_penalty: "Heavy suppressive fire! The Squad Leader loses [2 CR] from their Vault (damaged gear) and Stage 3 Target Difficulty escalates by +1 Success."
  - stage_number: 3
    name: "Sub-Level Mainframe / Bio-Lab Mainframe"
    preset_focus: "intel"
    target_difficulty: 4
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 6
      cost: "Triggers automated turret purge (+2 Difficulty)"
      description: "Destroy the server liquid-cooling housing to force a physical core dump under heavy automated gunfire."
    failure_penalty: "Mission Failure: Data wiped by automated purge! The squad retreats empty-handed. Add [+1 FAIL] to the Campaign Track (Retriable)."
rules_text: "Operation: Iron Dawn — Mission 2 (3 Stages). Base Clearance Bounty: [8 CR], [2 PIP]. Requires >= 1 [Combat] and >= 1 [Intel] operative. Stage 1: Ocean Platform Docks / Containment Patrol ([Combat] D4; Bypass to [Survival] D4 for [1 EF]). Stage 2: Heavy Enforcer Gate ([Combat] D3, Mandatory Fight). Stage 3: Sub-Level Mainframe / Bio-Lab Mainframe ([Intel] D4, or D5 if Stage 2 failed; Force Breach to [Combat] D6). Mission Failure adds [+1 FAIL]."
active_ability: null
tags:
  - "mission"
  - "iron-dawn"
  - "mission-2"
  - "facility"
  - "three-stage"
art_spec:
  asset_path: "/assets/cards/missions/mission_iron_dawn_2_deep_sea_laboratory_raid.webp"
  aspect_ratio: "70:120"
  visual_description: "A claustrophobic deep-sea research facility corridor with reinforced glass windows looking out into bioluminescent abyssal ocean water, where a four-operative strike team battles an automated heavy security mech guarding a glowing cyan mainframe vault."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Mission 2: Deep-Sea Laboratory Raid / The Subterranean Core

> **Campaign:** [Operation: Iron Dawn](../campaigns/campaign-iron-dawn.md) (`Mission 2 of 3`)  
> **Location:** Pacific Trench Facility ([Facility] Ocean Platform) / Subterranean Bio-Core ([Facility] Variant)  
> **Base Clearance Bounty:** [8 CR], [2 PIP]  
> **Squad Target Requirement:** $\ge 1$ [Combat], $\ge 1$ [Intel] operative

---

## 1. Narrative Briefing & Theater Variants

* **Revised Global Macro-Arc ("Deep-Sea Laboratory Raid" — Pacific Trench Rig):** Using the encryption keys recovered in Mission 1, HQ tracks Ascendant Bio-Tech's primary genetic laboratory to a submerged ocean platform in the Pacific Trench. The squad deploys via stealth sub-pod to clear the docking bay, destroy the automated Enforcer mech guarding the inner bulkhead, and siphon prototype genetic blueprints from the sub-level mainframe.
* **Facility Incursion Variant ("The Subterranean Core"):** Descending into the lower containment sectors of Ascendant's facility, the squad breaches security patrols, defeats the heavy mech bottleneck, and extracts classified telemetry before automated purges wipe the servers.
* **Return to HQ:** Upon clearing Stage 3, the squad extracts with the blueprints and orbital coordinates, returning to HQ to prepare for the final strike against Ascendant's high-orbit command array.
* **Retry Narrative:** If Stage 3 fails, automated server purges wipe the local terminal and force the squad to retreat to the sub-pod ([+1 FAIL]). Retrying launches a second dive against an alerted facility before the backup drives are relocated.

---

## 2. Preset Stage Track (3 Stages)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Ocean Platform Docks** *(or Containment Patrol)* | [Combat] | **4 Successes** | **Tactical Bypass ([Survival]):** Cost [1 EF], Target $D = 4$ | Ambush counter-attack! Every deployed operative takes **1 HP damage**. |
| **2** | **Heavy Enforcer Gate** | [Combat] | **3 Successes** | *(None — Mandatory Kinetic Bottleneck)* | Heavy fire! Squad Leader loses **[2 CR]**; Stage 3 $D$ increases by **$+1$ Success**. |
| **3** | **Sub-Level Mainframe** *(or Bio-Lab Mainframe)* | [Intel] | **4 Successes** *(5 if S2 failed)* | **Force Breach ([Combat]):** Target $D = 6$ | **Mission Failure:** Data wiped! Squad retreats empty-handed. Add **[+1 FAIL]**. |

---

## 3. Detailed Stage Breakdown

### Stage 1: Ocean Platform Docks / Containment Sector Patrol
* **Preset Focus:** [Combat] — **Target Difficulty: 4 Successes**
  * *Narrative:* Ambushing a heavily armed Ascendant security squad patrolling the sub-pod docking bay and bio-chambers.
* **Dynamic Focus Swap — Tactical Bypass ([Survival]):**
  * During Step 1 (Briefing), the Squad Leader may spend **[1 EF]** from their Faction Vault to shift the stage to [Survival] at **Target Difficulty: 4 Successes**.
  * *Narrative:* Bypass the patrol by navigating pressurized seawater intake ducts and active toxic ventilation shafts.
* **Stage Failure Penalty (Tactical Blowback):**
  * Ambush counter-attack! Every deployed operative takes **1 point of HP damage** (mitigable by Armor Buffers).

---

### Stage 2: Heavy Enforcer Gate (Mandatory Fight)
* **Preset Focus:** [Combat] — **Target Difficulty: 3 Successes**
  * *Narrative:* Point-blank clash against an automated heavy security mech blocking the reinforced vault bulkhead.
* **No Dynamic Swap Available:** This stage is a mandatory kinetic bottleneck and cannot be bypassed.
* **Stage Failure Penalty (Tactical Blowback):**
  * Heavy suppressive fire damages squad equipment! The Squad Leader immediately loses **[2 CR]** from their Faction Vault.
  * Additionally, Stage 3 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 3: Sub-Level Mainframe / Bio-Lab Mainframe (Climax Stage)
* **Preset Focus:** [Intel] — **Target Difficulty: 4 Successes** *(Escalates to **5 Successes** if Stage 2 failed)*
  * *Narrative:* Siphoning core genetic telemetry and orbital command coordinates while automated containment purges initiate.
* **Dynamic Focus Swap — Force Breach ([Combat]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Combat] at **Target Difficulty: 6 Successes** *(or **7 Successes** if Stage 2 failed)*.
  * *Narrative:* Destroy the server liquid-cooling housing with gunfire to force an emergency physical core dump while holding off automated defense turrets.
* **Stage Clearance:**
  * **Mission Accomplished!** Award **[8 CR]** and **[2 PIP]** and advance the campaign dossier to **Mission 3**.
* **Stage Failure Penalty (Mission Failure):**
  * The anti-intrusion wipe completes and the squad is forced to retreat empty-handed.
  * Advance the Campaign Mission Failure Track by **[+1 FAIL]**. If [FAIL] remains below 3, the squad returns to HQ and may retry Mission 2.
