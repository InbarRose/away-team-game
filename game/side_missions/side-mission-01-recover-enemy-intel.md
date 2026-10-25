---
id: "side-mission-01-recover-enemy-intel"
title: "Side-Mission: Recover Enemy Intel"
component_type: "side_mission"
category: "side_mission"
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
    - "infiltrate"
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
  bounty_pip: 1
  bounty_effort: 0
  bonus_bounty: "Maintain stealth through Stage 1 (via [Infiltrate] Swap) -> +3 [CR], +1 [PIP]"
themes:
  - "Urban"
  - "Covert"
  - "Facility"
stages:
  - stage_number: 1
    name: "Perimeter Watchtower"
    preset_focus: "combat"
    target_difficulty: 3
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "infiltrate"
      target_difficulty: 4
      cost: "0 Effort (Stealth Insertion — unlocks Bonus Stealth Bounty)"
      description: "Shift stage to [Infiltrate] (Target D=4) to slip past the watchtower undetected and preserve the Stealth Bounty."
    failure_penalty: "Alarm Tripped! Stealth bonus bounty is failed. Every deployed operative loses 1 static die from shock, and Stage 2 and Stage 3 Target Difficulties escalate by +1 Success."
  - stage_number: 2
    name: "Internal Navigation"
    preset_focus: "operations"
    target_difficulty: 3
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 5
      cost: "Triggers high facility alert (+1 Difficulty)"
      description: "Blast through the internal blast doors with breaching charges."
    failure_penalty: "Security countermeasures trigger! Venting gas inflicts 1 point of HP damage on every deployed operative and deducts 1 [EF] from the Squad Leader's Faction Vault."
  - stage_number: 3
    name: "The Data Vault"
    preset_focus: "intel"
    target_difficulty: 3
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 6
      cost: "Triggers vault turret lockdown (+1 to +2 Difficulty)"
      description: "Physically rip the classified drives from the server racks under heavy automated turret fire."
    failure_penalty: "Anti-intrusion wipe completes! The data is permanently lost. Side-Mission ends in failure without base payouts."
rules_text: "Side-Mission (Themes: [Urban], [Covert], [Facility] — 3 Stages). Base Payout: [6 CR], [1 PIP]. Bonus Stealth Bounty: Maintain stealth through Stage 1 -> [+3 CR], [+1 PIP]. Stage 1: Perimeter Watchtower ([Combat] D3; Stealth Bypass to [Infiltrate] D4). Stage 2: Internal Navigation ([Operations] D3 if stealth maintained, D4 if loud/failed). Stage 3: The Data Vault ([Intel] D3 if stealth maintained, D5 if alert is high)."
active_ability: null
tags:
  - "side-mission"
  - "urban"
  - "covert"
  - "facility"
  - "intel-bounty"
  - "three-stage"
art_spec:
  asset_path: "/assets/cards/side_missions/side_mission_01_recover_enemy_intel.webp"
  aspect_ratio: "70:120"
  visual_description: "A covert operative in a cloaking hood crouched atop a rain-swept corporate perimeter watchtower overlooking a glowing subterranean data vault, with cyan holographic server schematics projected on their visor."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Side-Mission: Recover Enemy Intel

> **Themes:** 🏙️ [Urban] • 💼 [Covert] • 🔬 [Facility]  
> **Base Clearance Bounty:** [6 CR], [1 PIP]  
> **Bonus Stealth Bounty:** Maintain stealth through Stage 1 ([Infiltrate] Swap cleared) $\rightarrow$ **[+3 CR], [+1 PIP]** ([9 CR], [2 PIP] Total!)

---

## 1. Narrative Briefing

A rival corporate directorate is storing unredacted black-project dossiers inside a fortified regional data annex. The strike team deploys between Campaign Missions to neutralize or slip past the outer perimeter watchtower, navigate the internal security blast doors, and siphon the classified drives from the central Data Vault before an anti-intrusion wipe purges the servers.

---

## 2. Preset Stage Track (3 Stages)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Perimeter Watchtower** | [Combat] | **3 Successes** | **Stealth Insertion ([Infiltrate]):** Target $D = 4$ | Alarm Tripped! Stealth bounty lost; all operatives lose **1 static die**; S2 & S3 $D$ **$+1$**. |
| **2** | **Internal Navigation** | [Operations] | **3 Successes** *(4 if loud/failed)* | **Force Breach ([Combat]):** Target $D = 5$ | Venting Gas! All deployed operatives take **1 HP damage** and Squad Leader loses **[1 EF]**. |
| **3** | **The Data Vault** | [Intel] | **3 Successes** *(5 if alert high)* | **Force Breach ([Combat]):** Target $D = 6$ | **Mission Failure (Wipe):** Data lost! Squad extracts empty-handed without base payouts. |

---

## 3. Detailed Stage Breakdown

### Stage 1: Perimeter Watchtower
* **Preset Focus:** [Combat] — **Target Difficulty: 3 Successes**
  * *Narrative:* Assaulting the outer perimeter watchtower with suppressed kinetic fire (note: clearing via loud [Combat] forfeits the Bonus Stealth Bounty and raises internal alert to $D=4$ on Stage 2).
* **Dynamic Focus Swap — Stealth Insertion ([Infiltrate]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Infiltrate] at **Target Difficulty: 4 Successes**.
  * *Narrative:* Ghost past the watchtower searchlights undetected, preserving the **Bonus Stealth Bounty (`[+3 CR], [+1 PIP]`)** and keeping Stage 2 and Stage 3 at their minimum Target Difficulty (`3 Successes`).
* **Stage Failure Penalty (Tactical Blowback):**
  * Alarm Tripped! The Bonus Stealth Bounty is failed.
  * Every deployed operative loses **1 static die** from shock.
  * Security blast doors lock downstream: Stage 2 and Stage 3 Target Difficulties escalate by **`+1 Success`**.

---

### Stage 2: Internal Navigation
* **Preset Focus:** [Operations] — **Target Difficulty: 3 Successes** if Stage 1 stealth succeeded; **4 Successes** if Stage 1 was loud or failed.
  * *Narrative:* Hacking internal blast door controls and bypassing laser grids to reach the central data core.
* **Dynamic Focus Swap — Force Breach ([Combat]):**
  * Shift the stage to [Combat] at **Target Difficulty: 5 Successes** (*Blow the internal blast doors and fight through facility security*).
* **Stage Failure Penalty (Tactical Blowback):**
  * Security countermeasures trigger! Venting neuro-gas inflicts **1 point of HP damage** on every deployed operative and deducts **[1 EF]** from the Squad Leader's Faction Vault.

---

### Stage 3: The Data Vault (Climax Stage)
* **Preset Focus:** [Intel] — **Target Difficulty: 3 Successes** if stealth was maintained; **5 Successes** if facility alert is high.
  * *Narrative:* Siphoning classified solid-state drives under high-pressure encryption countermeasures.
* **Dynamic Focus Swap — Force Breach ([Combat]):**
  * Shift the stage to [Combat] at **Target Difficulty: 6 Successes** (*Physically rip out the server blades under automated turret fire*).
* **Stage Clearance:**
  * **Side-Mission Cleared!** Award **[6 CR]** and **[1 PIP]** (plus **[+3 CR]** and **[+1 PIP]** if stealth was maintained in Stage 1).
* **Stage Failure Penalty (Mission Failure):**
  * Anti-intrusion wipe completes! The data is permanently lost. The squad returns to HQ empty-handed without base payouts (adds [0 DOOM] unless specified otherwise by the active Campaign Dossier).
