---
id: "mission-apex-extraction-4-bioweapon-facility-decapitation"
title: "Mission 4: Bioweapon Facility Decapitation (Campaign Climax)"
component_type: "mission"
category: "campaign_mission"
faction: "neutral"
tier: 4
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
    - "survival"
stats:
  es_budget: null
  hp_cap: null
  static_dice: null
  temp_dice_bonus: null
  slots_required: []
  armor_buffer: null
  campaign_id: "campaign-apex-extraction"
  mission_number: 4
  stage_count: 4
  doom_on_failure: 1
  bounty_credits: 0
  bounty_pip: 0
  bounty_effort: 0
  squad_requirement: "Side-Missions strictly locked out prior to launch; 4-Stage Finale"
stages:
  - stage_number: 1
    name: "Outer Rampart Siege"
    preset_focus: "combat"
    target_difficulty: 4
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "infiltrate"
      target_difficulty: 4
      cost: "0 Effort (Uses VIP Biometric Overrides)"
      description: "Use the extracted VIP's biometric clearance codes to slip through the subterranean waste-disposal airlocks unseen."
    failure_penalty: "Rampart artillery barrage! Every deployed operative takes 1 point of HP damage, and Stage 2 Target Difficulty escalates by +1 Success."
  - stage_number: 2
    name: "Reactor Core Overload"
    preset_focus: "operations"
    target_difficulty: 5
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 6
      cost: "Triggers core radiation vent (+1 Difficulty)"
      description: "Detonate high-explosive charges directly against the primary reactor coolant manifolds while fighting off core technicians and sentries."
    failure_penalty: "Plasma radiation surge! Every deployed operative loses 1 static die and takes 1 point of HP damage."
  - stage_number: 3
    name: "Executive Guard Core"
    preset_focus: "combat"
    target_difficulty: 5
    dynamic_swap: null
    failure_penalty: "Elite Directorate counter-strike! Every deployed operative takes 1 point of HP damage, the Squad Leader loses 1 [EF], and Stage 4 Target Difficulty escalates by +1 Success."
  - stage_number: 4
    name: "Meltdown Evacuation"
    preset_focus: "survival"
    target_difficulty: 5
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "operations"
      target_difficulty: 5
      cost: "1 Effort from Squad Leader's Vault"
      description: "Spend 1 [EF] to hotwire the executive escape pod rail-launchers and blast out of the collapsing mountain complex."
    failure_penalty: "Mission Failure: Catastrophic subterranean collapse aborts the assault! Add +1 [DOOM] and consume 1 Campaign Retry (if budget remains)."
rules_text: "Operation: Apex Extraction — Mission 4 Campaign Climax (4 Stages). Pre-Mission Lockdown: Side-Missions strictly prohibited prior to launch. Stage 1: Outer Rampart Siege ([Combat] D4; Bypass to [Infiltrate] D4). Stage 2: Reactor Core Overload ([Operations] D5; Force Breach to [Combat] D6). Stage 3: Executive Guard Core ([Combat] D5, Mandatory Fight). Stage 4: Meltdown Evacuation ([Survival] D5; Bypass to [Operations] D5 for 1 [EF]). Clearing Stage 4 wins the Campaign!"
active_ability: null
tags:
  - "mission"
  - "apex-extraction"
  - "mission-4"
  - "climax"
  - "facility"
  - "four-stage"
art_spec:
  asset_path: "/assets/cards/missions/mission_apex_extraction_4_bioweapon_facility_decapitation.webp"
  aspect_ratio: "70:120"
  visual_description: "An apocalyptic subterranean bioweapon reactor core in catastrophic meltdown, with toxic emerald containment vats shattering, elite black-armored Executive Guards firing plasma rifles, and the strike team sprinting toward an emergency rail-pod evacuation tunnel."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Mission 4: Bioweapon Facility Decapitation (Campaign Climax)

> **Campaign:** [Operation: Apex Extraction](../campaigns/campaign-apex-extraction.md) (`Mission 4 of 4 — Campaign Finale`)  
> **Location:** Ascendant Prime Core Laboratory (`[Facility]` Final Stand)  
> **Pre-Mission Lockdown:** Side-Missions are strictly prohibited prior to launching Mission 4  
> **Base Clearance Bounty:** **CAMPAIGN VICTORY!** (Triggers Final Executive `[VP]` Audit)

---

## 1. Narrative Briefing

With the VIP (**Dr. Elena Vance** or **Dr. Kaelen**) in Agency custody and Side-Missions locked out, the strike team launches an all-out decapitation strike against **Ascendant's Prime Core Laboratory**. Armed with the VIP's master biometric overrides, the squad must storm the fortified outer ramparts, trigger an irreversible overload in the subterranean reactor core, annihilate Ascendant's elite Executive Guard, and escape the collapsing mountain complex before total meltdown.

---

## 2. Preset Stage Track (4 Stages — Campaign Climax)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Outer Rampart Siege** | `[Combat]` | **4 Successes** | **Tactical Bypass (`[Infiltrate]`):** Target $D = 4$ | Artillery barrage! All deployed operatives take **1 HP damage**; Stage 2 $D$ increases by **$+1$ Success**. |
| **2** | **Reactor Core Overload** | `[Operations]` | **5 Successes** *(6 if S1 failed)* | **Force Breach (`[Combat]`):** Target $D = 6$ | Radiation surge! All deployed operatives take **1 HP damage** and lose **1 static die**. |
| **3** | **Executive Guard Core** | `[Combat]` | **5 Successes** | *(None — Mandatory Elite Fight)* | Elite counter-strike! All operatives take **1 HP damage**, Squad Leader loses **`1 [EF]`**, Stage 4 $D$ **$+1$**. |
| **4** | **Meltdown Evacuation** | `[Survival]` | **5 Successes** *(6 if S3 failed)* | **Tactical Bypass (`[Operations]`):** Cost `1 [EF]`, Target $D = 5$ | **Mission Failure:** Add **`+1 [DOOM]`** and consume **1 Campaign Retry** (if budget remains). |

---

## 3. Detailed Stage Breakdown

### Stage 1: Outer Rampart Siege
* **Preset Focus:** `[Combat]` — **Target Difficulty: 4 Successes**
  * *Narrative:* Breaching the heavily fortified outer bunker ramparts of Ascendant's Prime Core Laboratory.
* **Dynamic Focus Swap — Tactical Bypass (`[Infiltrate]`):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to `[Infiltrate]` at **Target Difficulty: 4 Successes**.
  * *Narrative:* Use the extracted VIP's biometric clearance codes to slip through the subterranean waste-disposal airlocks unseen.
* **Stage Failure Penalty (Tactical Blowback):**
  * Rampart artillery barrage! Every deployed operative takes **1 point of HP damage**, and Stage 2 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 2: Reactor Core Overload
* **Preset Focus:** `[Operations]` — **Target Difficulty: 5 Successes** *(Escalates to **6 Successes** if Stage 1 failed)*
  * *Narrative:* Overriding the subterranean fusion reactor safety interlocks to initiate a facility-wide thermal sterilization purge of the *Apex Chimera* bioweapon vats.
* **Dynamic Focus Swap — Force Breach (`[Combat]`):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to `[Combat]` at **Target Difficulty: 6 Successes** *(or **7 Successes** if Stage 1 failed)*.
  * *Narrative:* Detonate high-explosive demolition charges directly against the primary reactor coolant manifolds while fighting off armed core technicians.
* **Stage Failure Penalty (Tactical Blowback):**
  * Plasma radiation surge! Every deployed operative takes **1 point of HP damage** and loses **1 static die** from their pool.

---

### Stage 3: Executive Guard Core (Mandatory Fight)
* **Preset Focus:** `[Combat]` — **Target Difficulty: 5 Successes**
  * *Narrative:* A brutal firefight against Ascendant's cybernetically enhanced Executive Directorate Guard blocking the evacuation shaft.
* **No Dynamic Swap Available:** Mandatory kinetic bottleneck.
* **Stage Failure Penalty (Tactical Blowback):**
  * Elite Directorate counter-strike! Every deployed operative takes **1 point of HP damage**, the Squad Leader loses **`1 [EF]`** from their Faction Vault, and Stage 4 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 4: Meltdown Evacuation (Campaign Finale)
* **Preset Focus:** `[Survival]` — **Target Difficulty: 5 Successes** *(Escalates to **6 Successes** if Stage 3 failed)*
  * *Narrative:* Sprinting through collapsing subterranean tunnels and toxic chemical fires to reach the surface extraction point before the reactor detonates.
* **Dynamic Focus Swap — Tactical Bypass (`[Operations]`):**
  * During Step 1 (Briefing), the Squad Leader may spend **`1 [EF]`** from their Faction Vault to shift the stage to `[Operations]` at **Target Difficulty: 5 Successes** *(or **6 Successes** if Stage 3 failed)*.
  * *Narrative:* Hotwire the executive high-speed rail-pod launchers to blast out of the collapsing mountain complex.
* **Stage Clearance (Campaign Victory!):**
  * **CAMPAIGN VICTORY!** The *Apex Chimera* bioweapon facility is obliterated and the strike team survives. Proceed immediately to the **Final Executive `[VP]` Audit**: convert `[PIP]` (`2 VP`), living & Dead Pool `[LOY]` (`2 VP` + `3 VP` per Tier 4 Icon), and score Tiered **Secret Objectives** (`15 / 10 / 5 VP`).
* **Stage Failure Penalty (Mission Failure):**
  * Catastrophic tunnel collapse forces an emergency abort! Advance the Campaign Doom Track by **`+1 [DOOM]`** and consume **`1 Campaign Retry`**. If `[DOOM]` hits `4` or the squad has exceeded its `2-Retry Global Cap`, the campaign ends in **Game Over (Agency Collapse)**.
