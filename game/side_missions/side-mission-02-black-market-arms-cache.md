---
id: "side-mission-02-black-market-arms-cache"
title: "Side-Mission: Black-Market Arms Cache"
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
  stage_count: 3
  bounty_credits: 7
  bounty_pip: 1
  bounty_effort: 0
  bonus_bounty: "Clear Stage 3 with Momentum (+2 or higher above Target D) -> +1 free Consumable Item card"
themes:
  - "Urban"
  - "Covert"
stages:
  - stage_number: 1
    name: "Syndicate Alleyway"
    preset_focus: "combat"
    target_difficulty: 3
    dynamic_swap:
      type: "tactical_bypass"
      target_focus: "infiltrate"
      target_difficulty: 4
      cost: "0 Effort (Standard Bypass)"
      description: "Slip through rooftop fire escapes unseen to bypass the syndicate lookouts."
    failure_penalty: "Alarm raised! Stage 2 Target Difficulty escalates by +1 Success."
  - stage_number: 2
    name: "Guard Barracks"
    preset_focus: "combat"
    target_difficulty: 4
    dynamic_swap: null
    failure_penalty: "Suppression fire! Every deployed operative takes 1 point of HP damage."
  - stage_number: 3
    name: "Armory Main Vault"
    preset_focus: "operations"
    target_difficulty: 4
    dynamic_swap:
      type: "force_breach"
      target_focus: "combat"
      target_difficulty: 5
      cost: "Triggers vault demolition alarm (+1 Difficulty)"
      description: "Blow the vault doors with thermite charges under heavy fire."
    failure_penalty: "Vault auto-locks! The squad extracts empty-handed without base payouts."
rules_text: "Side-Mission (Themes: [Urban], [Covert] — 3 Stages). Base Clearance Bounty: 7 [CR], 1 [PIP]. Bonus Bounty: Clear Stage 3 with [MOM] (+2 or higher) -> +1 free Consumable Item card. Stage 1: Syndicate Alleyway ([Combat] D3; Bypass to [Infiltrate] D4). Stage 2: Guard Barracks ([Combat] D4, Mandatory Fight). Stage 3: Armory Main Vault ([Operations] D4; Force Breach to [Combat] D5)."
active_ability: null
tags:
  - "side-mission"
  - "urban"
  - "covert"
  - "arms-cache"
  - "three-stage"
art_spec:
  asset_path: "/assets/cards/side_missions/side_mission_02_black_market_arms_cache.webp"
  aspect_ratio: "70:120"
  visual_description: "An underground syndicate armory vault illuminated by harsh amber industrial strips, packed with crates of military-grade rifles, grenades, and tactical rigs as operatives crack the biometric vault door."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Side-Mission: Black-Market Arms Cache

> **Themes:** 🏙️ `[Urban]` • 💼 `[Covert]`  
> **Base Clearance Bounty:** `7 [CR]`, `1 [PIP]`  
> **Bonus Bounty:** Clear Stage 3 with **Momentum (`[MOM]`, $+2$ or higher above $D$)** $\rightarrow$ **`+1 Free Consumable Item Card`**

---

## 1. Narrative Briefing

A local crime syndicate operating out of a neon-lit urban nightlife district is hoarding military-grade kinetic weaponry and field ordnance. The strike team drops into the lower city to bypass or eliminate street lookouts, clear the syndicate armorers' barracks, and crack the biometric lock on the Armory Main Vault to extract high-tier stock.

---

## 2. Preset Stage Track (3 Stages)

| Stage | Stage Name | Preset Focus | Target Difficulty ($D$) | Dynamic Focus Swap Option | Stage Failure Penalty |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **1** | **Syndicate Alleyway** | `[Combat]` | **3 Successes** | **Tactical Bypass (`[Infiltrate]`):** Target $D = 4$ | Alarm raised! Stage 2 Target Difficulty escalates by **$+1$ Success**. |
| **2** | **Guard Barracks** | `[Combat]` | **4 Successes** *(5 if S1 failed)* | *(None — Mandatory Kinetic Bottleneck)* | Suppression fire! Every deployed operative takes **1 HP damage**. |
| **3** | **Armory Main Vault** | `[Operations]` | **4 Successes** | **Force Breach (`[Combat]`):** Target $D = 5$ | **Mission Failure:** Vault auto-locks! Squad extracts empty-handed without base payouts. |

---

## 3. Detailed Stage Breakdown

### Stage 1: Syndicate Alleyway
* **Preset Focus:** `[Combat]` — **Target Difficulty: 3 Successes**
  * *Narrative:* Gunfight against syndicate lookouts guarding the rain-slicked alley entrance.
* **Dynamic Focus Swap — Tactical Bypass (`[Infiltrate]`):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to `[Infiltrate]` at **Target Difficulty: 4 Successes**.
  * *Narrative:* Slip through rooftop fire escapes unseen.
* **Stage Failure Penalty (Tactical Blowback):**
  * Alarm raised! Stage 2 Target Difficulty escalates by **`+1 Success`**.

---

### Stage 2: Guard Barracks (Mandatory Fight)
* **Preset Focus:** `[Combat]` — **Target Difficulty: 4 Successes** *(Escalates to **5 Successes** if Stage 1 failed)*
  * *Narrative:* Point-blank firefight inside the syndicate armorers' quarters.
* **No Dynamic Swap Available:** Mandatory kinetic bottleneck.
* **Stage Failure Penalty (Tactical Blowback):**
  * Suppression fire! Every deployed operative takes **1 point of HP damage**.

---

### Stage 3: Armory Main Vault (Climax Stage)
* **Preset Focus:** `[Operations]` — **Target Difficulty: 4 Successes**
  * *Narrative:* Cracking the biometric lock on the heavy weapons vault.
* **Dynamic Focus Swap — Force Breach (`[Combat]`):**
  * During Step 1 (Briefing), the Squad Leader may shift the stage to `[Combat]` at **Target Difficulty: 5 Successes**.
  * *Narrative:* Blow the vault doors with thermite charges under heavy fire.
* **Stage Clearance:**
  * **Side-Mission Cleared!** Award **`7 [CR]`** and **`1 [PIP]`**. If total successes on Stage 3 reached **`6+ Successes`** on `[Operations]` (or **`7+ Successes`** on `[Combat]` Force Breach), generating at least `1 [MOM]`, also award **`+1 free Consumable Item card`**!
* **Stage Failure Penalty (Mission Failure):**
  * Vault auto-locks! The squad extracts empty-handed without base payouts.
