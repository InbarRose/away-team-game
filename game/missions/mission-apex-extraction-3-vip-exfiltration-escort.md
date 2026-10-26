---
id: "mission-apex-extraction-3-vip-exfiltration-escort"
title: "Mission 3: VIP Exfiltration Escort (Double-Mission: Part B)"
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
  secondary: "survival"
  bridges: []
stats:
  es_budget: null
  hp_cap: null
  static_dice: null
  temp_dice_bonus: null
  slots_required: []
  armor_buffer: null
  campaign_id: "campaign-apex-extraction"
  mission_number: 3
  stage_count: 3
  doom_on_failure: 2
  bounty_credits: 10
  bounty_pip: 2
  bounty_effort: 0
  squad_requirement: "Entered directly from Mission 2 via [Continuous Drop] / [No HQ]"
  continuous_drop_from: "mission-apex-extraction-2-black-site-infiltration"
stages:
  - stage_number: 1
    name: "Convoy Ambush"
    preset_focus: "combat"
    target_difficulty: 4
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "survival"
      target_difficulty: 4
      cost: "[1 EF] from Squad Leader's Vault"
      description: "Spend [1 EF] to ram the armored transport through the roadblock barrier and veer onto an off-road industrial service trail."
    failure_penalty: "Armor-piercing RPG strike! Every deployed operative takes 1 point of HP damage, and Stage 2 Target Difficulty escalates by +1 Success."
  - stage_number: 2
    name: "Mountain Pass Run"
    preset_focus: "survival"
    target_difficulty: 4
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 5
      cost: "Triggers gunship pursuit (+1 Difficulty)"
      description: "Stand your ground on the crumbling cliffside catwalks and engage the pursuing Ascendant VTOL gunships with heavy weapons."
    failure_penalty: "Collapsing catwalk debris! Every deployed operative loses 1 static die from exhaustion, and Stage 3 Target Difficulty escalates by +1 Success."
  - stage_number: 3
    name: "Helipad Evac Siege"
    preset_focus: "combat"
    target_difficulty: 5
    dynamic_swap: null
    failure_penalty: "Mission Failure: The VIP is recaptured by enemy forces! Add [+2 FAIL] and consume 1 Campaign Retry. Squad may execute 1 optional Side-Mission before retrying M2/M3 for Target B (Dr. Kaelen)."
rules_text: "Operation: Apex Extraction — Mission 3 (Double-Mission Part B, [Continuous Drop] / [No HQ], 3 Stages). Squad enters directly from Mission 2 without HQ Downtime! Stage 1: Convoy Ambush ([Combat] D4; Bypass to [Survival] D4 for [1 EF]). Stage 2: Mountain Pass Run ([Survival] D4; Force Breach to [Combat] D5). Stage 3: Helipad Evac Siege ([Combat] D5, Mandatory Siege Fight). POST-MISSION 3 LOCKOUT: Upon clearing Stage 3, all Side-Missions lock out permanently prior to Mission 4! Failing adds [+2 FAIL] and consumes 1 Retry."
active_ability: null
tags:
  - "mission"
  - "apex-extraction"
  - "mission-3"
  - "continuous-drop"
  - "no-hq"
  - "planet"
  - "urban"
  - "three-stage"
art_spec:
  asset_path: "/assets/cards/missions/mission_apex_extraction_3_vip_exfiltration_escort.webp"
  aspect_ratio: "70:120"
  visual_description: "A battered, bullet-riddled armored transport truck careening across a collapsing mountain highway bridge toward a rooftop helipad in a driving rainstorm, as exhausted operatives shield a VIP scientist from incoming VTOL gunship fire."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Mission 3: VIP Exfiltration Escort (Double-Mission: Part B)

> **Campaign:** [Operation: Apex Extraction](../campaigns/campaign-apex-extraction.md) (`Mission 3 of 4 — Double-Mission Part B`)  
> **Location:** Industrial Highway / Mountain Pass ([Continuous Drop] / [No HQ] from Mission 2)  
> **Base Clearance Bounty:** [10 CR], [2 PIP]  
> **Post-Clearance Lockout:** Upon clearing Stage 3, **all Side-Missions lock out permanently** prior to Mission 4!

---

## 1. Narrative Briefing & Special Rules

Carrying the extracted VIP (**Dr. Elena Vance** or **Dr. Kaelen**), the exhausted strike team bursts out of the subterranean black-site onto an industrial mountain highway. With Ascendant kill-squads and VTOL gunships closing in, the squad must hijack an armored transport, survive a perilous run across crumbling mountain pass catwalks, and defend the elevated helipad until the Agency extraction shuttle touches down.

### [Continuous Drop] / [No HQ] Entry Rule
* The squad enters Stage 1 of Mission 3 **directly from Mission 2 without an HQ Downtime Phase**.
* Operatives retain only the HP, unspent static dice, Armor Buffers (which refresh per stage as normal if intact), and remaining Consumables that survived Mission 2.
* The Squad Leader may still use **Logistical Refresh** ([2 EF] = $+1$ static die to all; [3 EF] = $+2$ static dice to all) during Step 1 (Briefing) of any stage to replenish the exhausted squad's dice pools!

### Post-Mission 3 Side-Mission Lockout Rule
* Upon successfully clearing Stage 3, the squad returns to HQ for one final Downtime Phase (healing, shopping, and Command Auction), but **all Side-Missions are permanently locked out**. The squad must proceed straight into **Mission 4 (Bioweapon Facility Decapitation)**.

### Failure & Retry Contingency
* If Mission 3 fails, the VIP is recaptured or killed during the siege.
* **Failure Penalty:** Advance the Campaign Mission Failure Track by **[+2 FAIL]** and consume **`1 Campaign Retry`** from the global 2-retry budget.
* **Recovery Window:** If [FAIL] is below 4 and a retry remains, the squad returns to HQ and may execute **1 optional Side-Mission** before retrying the linked Mission 2/3 arc for the secondary target (**Dr. Kaelen**).

---

## 2. Preset Stage Track (3 Stages)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Convoy Ambush** | [Combat] | **4 Successes** | **Tactical Bypass ([Survival]):** Cost [1 EF], Target $D = 4$ | RPG strike! All deployed operatives take **1 HP damage**; Stage 2 $D$ increases by **$+1$ Success**. |
| **2** | **Mountain Pass Run** | [Survival] | **4 Successes** *(5 if S1 failed)* | **Force Breach ([Combat]):** Target $D = 5$ | Collapsing catwalk! All deployed operatives lose **1 static die**; Stage 3 $D$ increases by **$+1$ Success**. |
| **3** | **Helipad Evac Siege** | [Combat] | **5 Successes** *(+1 if S2 failed)* | *(None — Mandatory Siege Firefight)* | **Mission Failure:** VIP recaptured! Add **[+2 FAIL]**, consume **1 Retry**, allow `1 Side-Mission`. |

---

## 3. Detailed Stage Breakdown

### Stage 1: Convoy Ambush
* **Preset Focus:** [Combat] — **Target Difficulty: 4 Successes**
  * *Narrative:* Fighting through an Ascendant armored roadblock ambushing the hijacked transport convoy on the industrial highway.
* **Dynamic Focus Swap — Tactical Bypass ([Survival]):**
  * During Step 1 (Briefing), the Squad Leader may spend **[1 EF]** from their Faction Vault to shift the stage to [Survival] at **Target Difficulty: 4 Successes**.
  * *Narrative:* Ram the armored transport through the roadblock barrier and veer onto a treacherous off-road industrial service trail.
* **Stage Failure Penalty (Tactical Blowback):**
  * Armor-piercing RPG strike! Every deployed operative takes **1 point of HP damage**, and Stage 2 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 2: Mountain Pass Run
* **Preset Focus:** [Survival] — **Target Difficulty: 4 Successes** *(Escalates to **5 Successes** if Stage 1 failed)*
  * *Narrative:* Escorting the VIP on foot across crumbling, ice-slicked cliffside catwalks after the transport is disabled.
* **Dynamic Focus Swap — Force Breach ([Combat]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Combat] at **Target Difficulty: 5 Successes** *(or **6 Successes** if Stage 1 failed)*.
  * *Narrative:* Stand your ground on the exposed bridge span and engage the pursuing Ascendant VTOL gunships with heavy weapons.
* **Stage Failure Penalty (Tactical Blowback):**
  * Collapsing catwalk debris! Every deployed operative loses **1 static die** from exhaustion, and Stage 3 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 3: Helipad Evac Siege (Part B Climax Stage)
* **Preset Focus:** [Combat] — **Target Difficulty: 5 Successes** *(Escalates to **6 Successes** if Stage 2 failed)*
  * *Narrative:* Holding the rooftop extraction helipad against a desperate final wave of Ascendant shock troops while the VIP boards the shuttle.
* **No Dynamic Swap Available:** Mandatory siege firefight.
* **Stage Clearance:**
  * **VIP Extracted!** Award **[10 CR]** and **[2 PIP]**. Return to HQ for final Downtime preparation. **All Side-Missions are now permanently LOCKED OUT** prior to Mission 4.
* **Stage Failure Penalty (Mission Failure):**
  * The VIP is recaptured by enemy forces! Add **[+2 FAIL]** and consume **`1 Campaign Retry`**. If eligible to continue, the squad may run **1 optional Side-Mission** before retrying Mission 2/3 for **Dr. Kaelen**.
