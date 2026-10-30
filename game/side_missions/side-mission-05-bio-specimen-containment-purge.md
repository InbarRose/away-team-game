---
id: "side-mission-05-bio-specimen-containment-purge"
title: "Side-Mission: Bio-Specimen Containment Purge"
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
    - "operations"
    - "survival"
stats:
  es_budget: null
  hp_cap: null
  static_dice: null
  temp_dice_bonus: null
  slots_required: []
  armor_buffer: null
  stage_count: 3
  bounty_credits: 6
  bounty_pip: 1
  bounty_effort: 0
  bonus_bounty: "Deploy at least 1 Scientist operative -> +1 free Consumable Item card"
themes:
  - "Planet"
  - "Facility"
stages:
  - stage_number: 1
    name: "Decontamination Chamber Seal"
    preset_focus: "operations"
    target_difficulty: 3
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 4
      cost: "Shatters bio-seal (+1 Difficulty)"
      description: "Blast through the reinforced quartz decontamination glass with explosive charges."
    failure_penalty: "Toxic gas leak! Every deployed operative takes 1 point of HP damage."
  - stage_number: 2
    name: "Specimen Nest Siege"
    preset_focus: "combat"
    target_difficulty: 5
    dynamic_swap: null
    failure_penalty: "Vicious onslaught! Every deployed operative takes 1 point of HP damage and loses 1 static die."
  - stage_number: 3
    name: "Genetic Data Core"
    preset_focus: "intel"
    target_difficulty: 4
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "survival"
      target_difficulty: 4
      cost: "[0 EF] (Physical Specimen Extraction)"
      description: "Grab the physical specimen cryo-canisters and escape through the flooded jungle drainage pipes."
    failure_penalty: "Lab purges automatically! Genetic data is incinerated; mission fails without base payouts."
rules_text: "Side-Mission (Themes: [Planet], [Facility] — 3 Stages). Base Clearance Bounty: [6 CR], [1 PIP]. Bonus Bounty: Deploy at least 1 Scientist -> +1 free Consumable Item card. Stage 1: Decontamination Chamber Seal ([Operations] D3; Force Breach to [Combat] D4). Stage 2: Specimen Nest Siege ([Combat] D5, Mandatory Siege Fight). Stage 3: Genetic Data Core ([Intel] D4; Bypass to [Survival] D4)."
active_ability: null
tags:
  - "side-mission"
  - "planet"
  - "facility"
  - "bio-specimen"
  - "scientist-bonus"
  - "three-stage"
art_spec:
  asset_path: "/assets/cards/side_missions/side_mission_05_bio_specimen_containment_purge.png"
  aspect_ratio: "70:120"
  visual_description: "An overgrown jungle bio-research atrium with shattered stasis tubes and encroaching alien bioluminescent vines, where operatives in hazard gear hold off swarming chimeras while a Scientist extracts glowing genetic cryo-canisters."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Side-Mission: Bio-Specimen Containment Purge

> **Themes:** 🌲 [Planet] • 🔬 [Facility]  
> **Base Clearance Bounty:** [6 CR], [1 PIP]  
> **Bonus Bounty:** Deploy at least **1 `Scientist` operative** on the squad $\rightarrow$ **`+1 Free Consumable Item Card`**

---

## 1. Narrative Briefing

A surface bio-research laboratory on an isolated jungle planet has suffered a catastrophic alien specimen containment breach. The strike team touches down to override the sealed decontamination airlocks, purge the swarming bio-specimens nesting in the main atrium, and siphon the genetic sequencing data before the facility's automated thermal purge incinerates the lab.

---

## 2. Preset Stage Track (3 Stages)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Decontamination Chamber Seal** | [Operations] | **3 Successes** | **Force Breach ([Combat]):** Target $D = 4$ | Toxic gas leak! Every deployed operative takes **1 HP damage**. |
| **2** | **Specimen Nest Siege** | [Combat] | **5 Successes** | *(None — Mandatory Siege Firefight)* | Vicious onslaught! Every deployed operative takes **1 HP damage** and loses **1 static die**. |
| **3** | **Genetic Data Core** | [Intel] | **4 Successes** | **Tactical Bypass ([Survival]):** Target $D = 4$ | **Mission Failure:** Lab purges automatically! Data destroyed; squad extracts without payouts. |

---

## 3. Detailed Stage Breakdown

### Stage 1: Decontamination Chamber Seal
* **Preset Focus:** [Operations] — **Target Difficulty: 3 Successes**
  * *Narrative:* Overriding sealed bio-hazard airlock doors to access the quarantined laboratory interior.
* **Dynamic Focus Swap — Force Breach ([Combat]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Combat] at **Target Difficulty: 4 Successes**.
  * *Narrative:* Blast through the reinforced quartz decontamination glass with explosive charges.
* **Stage Failure Penalty (Tactical Blowback):**
  * Toxic gas leak! Every deployed operative takes **1 point of HP damage**.

---

### Stage 2: Specimen Nest Siege (Mandatory Fight)
* **Preset Focus:** [Combat] — **Target Difficulty: 5 Successes**
  * *Narrative:* Holding the defensive perimeter against swarming bio-specimens inside the overgrown main atrium.
* **No Dynamic Swap Available:** Mandatory siege firefight.
* **Stage Failure Penalty (Tactical Blowback):**
  * Vicious onslaught! Every deployed operative takes **1 point of HP damage** and loses **1 static die** from their pool.

---

### Stage 3: Genetic Data Core (Climax Stage)
* **Preset Focus:** [Intel] — **Target Difficulty: 4 Successes**
  * *Narrative:* Siphoning genetic sequencing data from the central laboratory core while the self-destruct countdown ticks down.
* **Dynamic Focus Swap — Tactical Bypass ([Survival]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Survival] at **Target Difficulty: 4 Successes**.
  * *Narrative:* Grab the physical specimen cryo-canisters and escape through flooded jungle drainage pipes.
* **Stage Clearance:**
  * **Side-Mission Cleared!** Award **[6 CR]** and **[1 PIP]** (plus **`+1 free Consumable Item card`** if at least 1 `Scientist` operative was deployed on the 4-character away team).
* **Stage Failure Penalty (Mission Failure):**
  * The lab purges automatically! The genetic data is incinerated and the mission fails without base payouts.
