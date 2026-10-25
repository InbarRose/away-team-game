---
id: "campaign-apex-extraction"
title: "Operation: Apex Extraction"
component_type: "campaign"
category: "campaign_dossier"
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
  mission_count: 4
  max_doom: 4
  max_retries: 2
  total_stages: 13
  combat_stage_count: 8
  combat_ratio: 0.615
campaign_parameters:
  difficulty_rating: "Medium / Hard Complex Campaign"
  sequence_length: 4
  max_doom_threshold: 4
  retry_policy: "Global cap of MAX 2 RETRIES TOTAL across the entire campaign. Failing M1 or M4 adds +1 Doom; failing M2 or M3 adds +2 Doom and triggers the Target B Assistant contingency."
  side_mission_policy: "Pre-Mission 2: Freely allowed. On M2/M3 Failure: 1 Side-Mission allowed before retrying for Target B (Dr. Kaelen). Post-Mission 3 Success: Side-Missions permanently LOCKED prior to Mission 4."
  side_mission_failure_penalty: "Local squad HP/dice/resource blowback; does not consume Campaign Retries."
  continuous_drop_link: "Mission 2 (Part A) -> Mission 3 (Part B) [Continuous Drop / No HQ]"
  allowed_themes:
    - "Urban"
    - "Facility"
    - "Covert"
    - "Planet"
  missions:
    - "mission-apex-extraction-1-signal-reconnaissance"
    - "mission-apex-extraction-2-black-site-infiltration"
    - "mission-apex-extraction-3-vip-exfiltration-escort"
    - "mission-apex-extraction-4-bioweapon-facility-decapitation"
stages: []
rules_text: "Hard 4-Mission Campaign Dossier. Max Doom Threshold: [4 DOOM]. Global Retry Budget: Max 2 Retries Total. Missions 2 & 3 form a linked [Continuous Drop] / [No HQ] operation ([+2 DOOM] on failure, pivoting to Target B Dr. Kaelen with a 1 Side-Mission recovery window). Upon clearing Mission 3, all Side-Missions are permanently locked out prior to Mission 4."
active_ability: null
tags:
  - "campaign"
  - "hard"
  - "continuous-drop"
  - "no-hq"
  - "vip-extraction"
  - "four-mission-arc"
art_spec:
  asset_path: "/assets/cards/campaigns/campaign_apex_extraction.webp"
  aspect_ratio: "70:120"
  visual_description: "A high-stakes tactical command dossier showing a satellite thermal feed of a heavily fortified mountain bioweapons complex, an armored convoy racing along a collapsing cliffside highway under gunship fire, and biometric mugshots of VIP targets Dr. Elena Vance and Dr. Kaelen stamped 'PRIORITY EXTRACTION'."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Campaign Dossier: Operation: Apex Extraction

> **Difficulty Rating:** Medium / Hard Complex Campaign (`Tier 3`)  
> **Operational Scope:** 4 Dense Campaign Missions (3–4 Stages Each; 13 Total Stages)  
> **Special Rules:** Global Retry Cap (`Max 2`), Linked Double-Mission ([Continuous Drop] / [No HQ]), Target B Pivot, and Finale Side-Mission Lockout

---

## 1. Executive Narrative Brief

**Ascendant Bio-Tech** has abducted **Dr. Elena Vance**, chief architect of the *Apex Chimera* bioweapon protocol, holding her inside a heavily fortified subterranean black-site. Your strike team must execute a high-risk four-phase campaign:

1. **Mission 1 — Signal Reconnaissance ([Planet] / [Facility]):** Assault a remote border communications array to decrypt prisoner transport telemetry and pinpoint Dr. Vance's black-site holding cell.
2. **Mission 2 — Black-Site Infiltration ([Facility] / [Covert] — Double-Mission Part A):** Breach Ascendant Research Complex Alpha and extract the VIP from the Bio-Vault Cellblock. **Upon success, skip HQ Downtime entirely and deploy directly into Mission 3!**
3. **Mission 3 — VIP Exfiltration Escort ([Planet] / [Urban] — Double-Mission Part B [Continuous Drop]):** With surviving HP, unspent static dice, and remaining consumables from Mission 2, hijack an armored convoy, survive a mountain pass ambush, and hold the rooftop helipad until extraction arrives.
4. **Mission 4 — Bioweapon Facility Decapitation ([Facility] — Campaign Climax):** With all Side-Missions locked out, use the VIP's biometric overrides to storm Ascendant's Prime Core Laboratory, overload the reactor, purge the Executive Guard, and escape the meltdown.

---

## 2. Campaign Parameters & Lever Configuration

| Parameter | Rule Specification |
| :--- | :--- |
| **Difficulty Rating** | **Medium / Hard Complex Campaign** |
| **Sequence Length** | **4 Campaign Missions** (3 Stages in M1–M3; 4 Stages in M4) |
| **Max Doom Threshold** | **[4 DOOM] Points** (Immediate Agency Collapse / Game Over at [4 DOOM]) |
| **Global Retry Budget** | **MAX 2 RETRIES TOTAL** across the entire campaign |
| **The Double-Mission Arc** | **Missions 2 & 3** form a linked 2-Part [Continuous Drop] / [No HQ] Operation |
| **Side-Mission Lockout Policy** | • **Pre-Mission 2:** Side-Missions freely allowed.<br>• **Fail Mission 2 or 3:** `1 Side-Mission ALLOWED` before retrying for the Assistant (*Dr. Kaelen*).<br>• **Post-Mission 3 Success:** Side-Missions **LOCKED OUT COMPLETELY** (No side-ops between M3 and M4). |
| **Allowed Side-Mission Themes** | [Urban], [Facility], [Covert], [Planet] |

---

## 3. Advanced Campaign Mechanics

### 3.1 The Double-Mission Link ([Continuous Drop] / [No HQ])
When the squad clears Stage 3 of **Mission 2 (Black-Site Infiltration)**, they **do not return to HQ**:
* Skip the HQ Downtime Phase completely (no Infirmary healing, no Quartermaster shopping, no static dice pool reset).
* Operatives carry their surviving HP, remaining unspent static dice, equipped gear, and unspent Consumables directly into Stage 1 of **Mission 3 (VIP Exfiltration Escort)**.

### 3.2 Failure & Retry Contingency: The "Target B" Assistant Pivot
If the squad fails **Mission 2** OR **Mission 3**:
* **Narrative Consequence:** Primary VIP **Dr. Elena Vance** is executed or permanently evacuated off-world by Ascendant forces.
* **Campaign Penalty:** Advance the Doom Track by **[+2 DOOM]** and consume **`1 Campaign Retry`** from the 2-retry global budget.
* **Recovery Window:** Upon retreating to HQ, the squad is permitted **1 optional Side-Mission** to farm [CR], [EF], or gear and heal in the Infirmary before launching their retry.
* **Target B Pivot:** Retrying the linked operation targets **Facility Beta** to extract Dr. Vance's lead assistant, **Dr. Kaelen**, starting at Mission 2 under heightened guard parameters.

### 3.3 Post-Mission 3 Lockout
Once the VIP (Dr. Vance or Dr. Kaelen) is successfully extracted at the end of Mission 3, Ascendant initiates an immediate purge of their Prime Core Laboratory. **All Side-Missions lock out permanently**—after resolving HQ Downtime between Mission 3 and Mission 4, the squad must launch directly into **Mission 4**.

---

## 4. Campaign Mission Sequence

1. **[Mission 1: Signal Reconnaissance](../missions/mission-apex-extraction-1-signal-reconnaissance.md)** — 3 Stages (`Outer Gate Checkpoint` $\rightarrow$ `Patrol Bunker` $\rightarrow$ `Relay Server Vault`). Fail Penalty: [+1 DOOM].
2. **[Mission 2: Black-Site Infiltration (Part A)](../missions/mission-apex-extraction-2-black-site-infiltration.md)** — 3 Stages (`Perimeter Guard Gate` $\rightarrow$ `Sub-Level Barracks` $\rightarrow$ `Bio-Vault Cellblock`). Links directly to M3 ([No HQ]). Fail Penalty: [+2 DOOM].
3. **[Mission 3: VIP Exfiltration Escort (Part B)](../missions/mission-apex-extraction-3-vip-exfiltration-escort.md)** — 3 Stages (`Convoy Ambush` $\rightarrow$ `Mountain Pass Run` $\rightarrow$ `Helipad Evac Siege`). [Continuous Drop]. Fail Penalty: [+2 DOOM].
4. **[Mission 4: Bioweapon Facility Decapitation (Climax)](../missions/mission-apex-extraction-4-bioweapon-facility-decapitation.md)** — 4 Stages (`Outer Rampart Siege` $\rightarrow$ `Reactor Core Overload` $\rightarrow$ `Executive Guard Core` $\rightarrow$ `Meltdown Evacuation`). Fail Penalty: [+1 DOOM].

---

## 5. Balance & Focus Pyramid Audit

| Metric | Specification |
| :--- | :--- |
| **Stage Counts Per Mission** | Mission 1: `3` \| Mission 2: `3` \| Mission 3: `3` \| Mission 4: `4` (`13 Stages Total`) |
| **Focus Pyramid Distribution** | `8 of 13 Total Stages` are [Combat] (`61.5% [Combat]` — Exceeds 50% Rule) |
| **Frontline Mandate** | Every mission contains at least 1 Mandatory [Combat] stage |
| **Side-Mission Rules** | Open pre-M2; `1` allowed on M2/M3 failure retry; permanently locked after M3 success |
