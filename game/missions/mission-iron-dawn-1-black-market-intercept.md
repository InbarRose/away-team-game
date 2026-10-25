---
id: "mission-iron-dawn-1-black-market-intercept"
title: "Mission 1: Black-Market Intercept / Perimeter Breach"
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
  campaign_id: "campaign-iron-dawn"
  mission_number: 1
  stage_count: 2
  doom_on_failure: 1
  bounty_credits: 6
  bounty_pip: 1
  bounty_effort: 0
  squad_requirement: "At least 1 [Combat] operative"
stages:
  - stage_number: 1
    name: "Syndicate Alleyway / Outer Checkpoint Watchtower"
    preset_focus: "combat"
    target_difficulty: 3
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "infiltrate"
      target_difficulty: 4
      cost: "0 Effort (Standard Bypass)"
      description: "Slip unseen through neon rooftop fire escapes or frozen drainage pipes to bypass the perimeter guards."
    failure_penalty: "Security alert sounds! Every deployed operative loses 1 static die from shock, and Stage 2 Target Difficulty escalates by +1 Success."
  - stage_number: 2
    name: "Broker's Safe-Vault / Lift Terminal Control"
    preset_focus: "operations"
    target_difficulty: 4
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 5
      cost: "Triggers facility alarm (+1 Difficulty)"
      description: "Blow the reinforced vault or blast doors with thermal charges and fight through the security lobby."
    failure_penalty: "Mission Failure: Internal lockdown seals the vault/lift completely. Add +1 [DOOM] to the Campaign Track. Retrying Mission 1 is permitted."
rules_text: "Operation: Iron Dawn — Mission 1 (2 Stages). Base Clearance Bounty: [6 CR], [1 PIP]. Requires >= 1 [Combat] operative. Stage 1: Syndicate Alleyway / Outer Checkpoint ([Combat] D3; Bypass to [Infiltrate] D4). Stage 2: Broker's Safe-Vault / Lift Terminal Control ([Operations] D4, or D5 if Stage 1 failed; Force Breach to [Combat] D5). Mission Failure adds [+1 DOOM] and triggers a Tactical Retreat (freely retriable)."
active_ability: null
tags:
  - "mission"
  - "iron-dawn"
  - "mission-1"
  - "urban"
  - "facility"
  - "two-stage"
art_spec:
  asset_path: "/assets/cards/missions/mission_iron_dawn_1_black_market_intercept.webp"
  aspect_ratio: "70:120"
  visual_description: "A rain-slicked cyberpunk alleyway in the Neon Syndicate District leading to a heavy biometric vault door, split with a tactical inset of a snow-swept mountain perimeter watchtower guarding a subterranean elevator shaft."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Mission 1: Black-Market Intercept / Perimeter Breach

> **Campaign:** [Operation: Iron Dawn](../campaigns/campaign-iron-dawn.md) (`Mission 1 of 3`)  
> **Location:** Neon Syndicate District ([Urban] Macro-Arc) / Mountain Perimeter Outpost ([Facility] Variant)  
> **Base Clearance Bounty:** [6 CR], [1 PIP]  
> **Squad Target Requirement:** $\ge 1$ [Combat] operative

---

## 1. Narrative Briefing & Theater Variants

This mission card supports both canonical theater variants from the *Operation: Iron Dawn* design specification:

* **Revised Global Macro-Arc ("Black-Market Intercept" — Neon Syndicate District):** Ascendant Bio-Tech is smuggling experimental cyber-warfare encryption drives through an underground black market. The squad deploys to an urban nightlife district to neutralize syndicate lookouts, breach the broker's secure vault, and steal the master decryption keys needed to locate Ascendant's deep-sea laboratory.
* **Facility Incursion Variant ("Perimeter Breach" — Mountain Outpost):** The squad drops into the snow-covered mountains surrounding an unauthorized Ascendant Bio-Tech research facility to neutralize the outer watchtower checkpoint and hijack the subterranean lift terminal.
* **Return to HQ:** Upon clearing Stage 2, the squad extracts to HQ to decipher the stolen telemetry and outfit for Mission 2.
* **Retry Narrative:** If Stage 2 fails, internal lockdown seals the target and the squad executes a **Tactical Retreat** ([+1 DOOM]). Retrying Mission 1 launches a **Second Assault Wave** against the broker's secondary safehouse (or alerted perimeter gate).

---

## 2. Preset Stage Track (2 Stages)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Syndicate Alleyway** *(or Outer Checkpoint)* | [Combat] | **3 Successes** | **Tactical Bypass ([Infiltrate]):** Target $D = 4$ | Alarm sounds! All deployed operatives lose **1 static die**; Stage 2 $D$ increases by **$+1$ Success**. |
| **2** | **Broker's Safe-Vault** *(or Lift Terminal Control)* | [Operations] | **4 Successes** *(5 if S1 failed)* | **Force Breach ([Combat]):** Target $D = 5$ | **Mission Failure:** Lockdown seals target. Add **[+1 DOOM]** to Campaign Track (Retriable). |

---

## 3. Detailed Stage Breakdown

### Stage 1: Syndicate Alleyway / Outer Checkpoint Watchtower
* **Preset Focus:** [Combat] — **Target Difficulty: 3 Successes**
  * *Narrative:* Neutralizing armed syndicate lookouts in the rain-soaked alleyway (or perimeter guards at the mountain fence).
* **Dynamic Focus Swap — Tactical Bypass ([Infiltrate]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Infiltrate] at **Target Difficulty: 4 Successes**.
  * *Narrative:* The squad slips unseen across neon-lit rooftop fire escapes or frozen drainage pipes.
* **Momentum Threshold ([MOM]):** $5+$ Successes on [Combat] ($6+$ on [Infiltrate]) generates $\text{Momentum} = \text{Total Successes} - D - 1$.
* **Stage Failure Penalty (Tactical Blowback):**
  * Security alert sounds!
  * Every deployed operative immediately loses **1 static die** from their pool due to shock.
  * Downstream lockdown: Stage 2 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 2: Broker's Safe-Vault / Lift Terminal Control (Climax Stage)
* **Preset Focus:** [Operations] — **Target Difficulty: 4 Successes** *(Escalates to **5 Successes** if Stage 1 failed)*
  * *Narrative:* Cracking the biometric encryption lock on the broker's safe-vault (or hacking the blast doors to hijack the subterranean lift).
* **Dynamic Focus Swap — Force Breach ([Combat]):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to [Combat] at **Target Difficulty: 5 Successes** *(or **6 Successes** if Stage 1 failed)*.
  * *Narrative:* Blow the reinforced vault door with thermal charges and fight through the converging security response team.
* **Stage Clearance:**
  * **Mission Accomplished!** Award **[6 CR]** and **[1 PIP]** (distributed per Campaign / Squad Leader rules) and advance the campaign dossier to **Mission 2**.
* **Stage Failure Penalty (Mission Failure):**
  * Internal lockdown seals the vault/lift completely, forcing an emergency extraction empty-handed.
  * Advance the Campaign Doom Track by **[+1 DOOM]**. If [DOOM] is below 3, the squad returns to HQ for Downtime and may retry Mission 1.
