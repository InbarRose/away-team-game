---
id: "mission-apex-extraction-2-black-site-infiltration"
title: "Mission 2: Black-Site Infiltration (Double-Mission: Part A)"
component_type: "mission"
category: "campaign_mission"
faction: "neutral"
tier: 3
deck_copies: 1
cost:
  credits: 0
  effort: 0
  pip: 0
focus_affinity:
  primary: "combat"
  secondary: "operations"
  bridges:
    - "infiltrate"
stats:
  es_budget: null
  hp_cap: null
  static_dice: null
  temp_dice_bonus: null
  slots_required: []
  armor_buffer: null
  campaign_id: "campaign-apex-extraction"
  mission_number: 2
  stage_count: 3
  doom_on_failure: 2
  bounty_credits: 8
  bounty_pip: 2
  bounty_effort: 0
  squad_requirement: "At least 1 [Combat] and 1 [Operations] operative"
  continuous_drop_next: "mission-apex-extraction-3-vip-exfiltration-escort"
stages:
  - stage_number: 1
    name: "Perimeter Guard Gate"
    preset_focus: "combat"
    target_difficulty: 4
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "infiltrate"
      target_difficulty: 4
      cost: "0 Effort (Standard Bypass)"
      description: "Spoof biometric gate transponders and slip past the outer black-site checkpoint."
    failure_penalty: "Black-site lockdown initiated! Every deployed operative loses 1 static die from shock, and Stage 2 Target Difficulty escalates by +1 Success."
  - stage_number: 2
    name: "Sub-Level Barracks"
    preset_focus: "combat"
    target_difficulty: 3
    dynamic_swap: null
    failure_penalty: "Close-quarters crossfire! Every deployed operative takes 1 point of HP damage, and Stage 3 Target Difficulty escalates by +1 Success."
  - stage_number: 3
    name: "Bio-Vault Cellblock"
    preset_focus: "operations"
    target_difficulty: 4
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 5
      cost: "Triggers cellblock purge (+1 Difficulty)"
      description: "Detonate shaped breaching charges on the containment cell doors and fight through the warden's guard detail."
    failure_penalty: "Mission Failure: VIP Dr. Vance is executed/evacuated! Add +2 [DOOM] and consume 1 Campaign Retry. Unlocks 1 optional Side-Mission before retrying at Facility Beta for Target B (Dr. Kaelen)."
rules_text: "Operation: Apex Extraction — Mission 2 (Double-Mission Part A, 3 Stages). Stage 1: Perimeter Guard Gate ([Combat] D4; Bypass to [Infiltrate] D4). Stage 2: Sub-Level Barracks ([Combat] D3, Mandatory Fight). Stage 3: Bio-Vault Cellblock ([Operations] D4; Force Breach to [Combat] D5). CONTINUOUS LINK: Upon clearing Stage 3, SKIP HQ DOWNTIME and deploy immediately into Mission 3 with surviving HP, unspent dice, and gear! FAILURE CONTINGENCY: Failing adds +2 [DOOM], consumes 1 Retry, allows 1 Side-Mission, and pivots retry to Facility Beta for Target B (Dr. Kaelen)."
active_ability: null
tags:
  - "mission"
  - "apex-extraction"
  - "mission-2"
  - "continuous-drop-part-a"
  - "facility"
  - "covert"
  - "three-stage"
art_spec:
  asset_path: "/assets/cards/missions/mission_apex_extraction_2_black_site_infiltration.webp"
  aspect_ratio: "70:120"
  visual_description: "A sterile, menacing subterranean black-site cellblock illuminated by emerald bio-containment fields, where tactical operatives breach a reinforced cryo-cell holding a scientist in a stained lab coat while sparks fly from overridden security consoles."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Mission 2: Black-Site Infiltration (Double-Mission: Part A)

> **Campaign:** [Operation: Apex Extraction](../campaigns/campaign-apex-extraction.md) (`Mission 2 of 4 — Double-Mission Part A`)  
> **Location:** Ascendant Research Complex Alpha (`[Facility]` / `[Covert]` VIP Abduction)  
> **Special Deployment Rule:** **`[Continuous Drop]` Link to Mission 3** (Skip HQ Downtime on Clearance!)  
> **Failure Penalty:** **`+2 [DOOM]`** + Consumes `1 Campaign Retry` + Pivots to **Target B (Dr. Kaelen)**

---

## 1. Narrative Briefing & Special Rules

The strike team infiltrates **Ascendant Research Complex Alpha** to breach outer security defenses, fight through the sub-level garrison barracks, and override the high-security bio-locks sealing **Dr. Elena Vance** inside the Bio-Vault Cellblock.

### Continuous Link Rule (`Part A` $\rightarrow$ `Part B [No HQ]`)
* If Mission 2 succeeds, **skip HQ Downtime completely!**
* The squad **does not return to HQ**—they immediately transition into **[Mission 3: VIP Exfiltration Escort](./mission-apex-extraction-3-vip-exfiltration-escort.md)** carrying only their surviving HP, remaining unspent static dice, equipped gear, and unspent Consumables.

### Failure & Retry Contingency (Target B Pivot)
* If Mission 2 fails, **Dr. Elena Vance** is executed or evacuated off-world by Ascendant forces.
* **Failure Penalty:** Advance the Campaign Doom Track by **`+2 [DOOM]`** and consume **`1 Campaign Retry`** from the global 2-retry budget.
* **Side-Mission Recovery Window:** Upon retreating to HQ, the squad is granted **1 optional Side-Mission opportunity** to farm gear/credits and heal in the Infirmary before retrying Mission 2.
* **The Narrative Retry Pivot:** Retrying Mission 2 forces the squad to launch a secondary assault on **Facility Beta** to capture Dr. Vance's lead assistant, **Dr. Kaelen**, under heightened guard parameters.

---

## 2. Preset Stage Track (3 Stages)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Perimeter Guard Gate** | `[Combat]` | **4 Successes** | **Tactical Bypass (`[Infiltrate]`):** Target $D = 4$ | Lockdown initiated! All deployed operatives lose **1 static die**; Stage 2 $D$ increases by **$+1$ Success**. |
| **2** | **Sub-Level Barracks** | `[Combat]` | **3 Successes** *(4 if S1 failed)* | *(None — Mandatory Kinetic Fight)* | Close-quarters crossfire! All deployed operatives take **1 HP damage**; Stage 3 $D$ increases by **$+1$ Success**. |
| **3** | **Bio-Vault Cellblock** | `[Operations]` | **4 Successes** *(+1 if S2 failed)* | **Force Breach (`[Combat]`):** Target $D = 5$ | **Mission Failure:** Add **`+2 [DOOM]`**, consume **1 Retry**, allow `1 Side-Mission`, pivot to **Dr. Kaelen**. |

---

## 3. Detailed Stage Breakdown

### Stage 1: Perimeter Guard Gate
* **Preset Focus:** `[Combat]` — **Target Difficulty: 4 Successes**
  * *Narrative:* Assaulting the heavily armed outer security gate of Ascendant Complex Alpha (or Facility Beta on a Target B retry).
* **Dynamic Focus Swap — Tactical Bypass (`[Infiltrate]`):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to `[Infiltrate]` at **Target Difficulty: 4 Successes**.
  * *Narrative:* Spoof biometric gate transponders and slip past the outer black-site checkpoint undetected.
* **Stage Failure Penalty (Tactical Blowback):**
  * Black-site lockdown initiated! Every deployed operative loses **1 static die** from shock, and Stage 2 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 2: Sub-Level Barracks (Mandatory Fight)
* **Preset Focus:** `[Combat]` — **Target Difficulty: 3 Successes** *(Escalates to **4 Successes** if Stage 1 failed)*
  * *Narrative:* A point-blank firefight through the rapid-response security barracks blocking the elevator to the holding cells.
* **No Dynamic Swap Available:** Mandatory kinetic bottleneck.
* **Stage Failure Penalty (Tactical Blowback):**
  * Close-quarters crossfire! Every deployed operative takes **1 point of HP damage**, and Stage 3 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 3: Bio-Vault Cellblock (Part A Climax Stage)
* **Preset Focus:** `[Operations]` — **Target Difficulty: 4 Successes** *(Escalates to **5 Successes** if Stage 2 failed)*
  * *Narrative:* Overriding the triple-redundant biometric containment locks to extract VIP Dr. Elena Vance (or Dr. Kaelen) from her holding cell.
* **Dynamic Focus Swap — Force Breach (`[Combat]`):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to `[Combat]` at **Target Difficulty: 5 Successes** *(or **6 Successes** if Stage 2 failed)*.
  * *Narrative:* Detonate shaped breaching charges on the containment cell doors and gun down the warden's guard detail.
* **Stage Clearance (`[Continuous Drop]` Trigger):**
  * **VIP Secured!** Award **`8 [CR]`** and **`2 [PIP]`** to Faction Vaults (logged for HQ). **Do NOT return to HQ**—proceed immediately to Stage 1 of **[Mission 3: VIP Exfiltration Escort](./mission-apex-extraction-3-vip-exfiltration-escort.md)** with current HP, unspent static dice, and remaining consumables!
* **Stage Failure Penalty (Mission Failure):**
  * VIP Dr. Vance is lost! Add **`+2 [DOOM]`** and consume **`1 Campaign Retry`**. Return to HQ (with **1 optional Side-Mission** allowed) before retrying Mission 2 at Facility Beta for **Dr. Kaelen**.
