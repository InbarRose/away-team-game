---
id: "campaign-iron-dawn"
title: "Operation: Iron Dawn"
component_type: "campaign"
category: "campaign_dossier"
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
  bridges: []
stats:
  es_budget: null
  hp_cap: null
  static_dice: null
  temp_dice_bonus: null
  slots_required: []
  armor_buffer: null
  mission_count: 3
  max_doom: 3
  max_retries: null
  total_stages: 8
  combat_stage_count: 5
  combat_ratio: 0.625
campaign_parameters:
  difficulty_rating: "Easy / Standard Initializer"
  sequence_length: 3
  max_doom_threshold: 3
  retry_policy: "Freely retriable upon failure (+1 Doom per failed Campaign Mission; Tactical Retreat before objective clearance)."
  side_mission_policy: "Unlimited access between Campaign Missions."
  side_mission_failure_penalty: "0 Doom Points (local squad HP/dice/resource blowback only)."
  allowed_themes:
    - "Urban"
    - "Facility"
    - "Space"
    - "Covert"
    - "Planet"
  missions:
    - "mission-iron-dawn-1-black-market-intercept"
    - "mission-iron-dawn-2-deep-sea-laboratory-raid"
    - "mission-iron-dawn-3-orbital-array-sabotage"
stages: []
rules_text: "Standard 3-Mission Campaign Dossier. Max Doom Threshold: [3 DOOM]. Unlimited Side-Missions between drops ([0 DOOM] on Side-Mission failure). Campaign Missions are freely retriable upon failure ([+1 DOOM] per failed mission). Clearing Mission 3 triggers Campaign Victory and Final Executive [VP] Audit."
active_ability: null
tags:
  - "campaign"
  - "easy"
  - "standard"
  - "ascendant-biotech"
  - "three-mission-arc"
art_spec:
  asset_path: "/assets/cards/campaigns/campaign_iron_dawn.webp"
  aspect_ratio: "70:120"
  visual_description: "A holographic war-room tactical projection table displaying three linked global targets: a neon-drenched cyberpunk syndicate district, a submerged deep-ocean drilling rig in the Pacific Trench, and a high-orbit communications spire silhouetted against a rising sun over Earth's curvature."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Campaign Dossier: Operation: Iron Dawn

> **Difficulty Rating:** Easy / Standard Initializer (`Tier 1`)  
> **Operational Scope:** 3 Distinct Global & Orbital Deployments (8 Total Stages)  
> **Primary Antagonist:** Ascendant Bio-Tech Research Directorate

---

## 1. Executive Narrative Brief

**Ascendant Bio-Tech** has gone rogue, smuggling illegal cyber-warfare encryption drives and prohibited genetic weapon blueprints through an international shadow network. Your Joint Agency Strike Team is tasked with a three-stage global dismantling operation:

1. **Mission 1 — Black-Market Intercept ([Urban] / [Facility]):** Drop into the Neon Syndicate District (or the mountain perimeter checkpoint in the *Perimeter Breach* variant) to intercept the encryption broker and secure the master decryption keys.
2. **Mission 2 — Deep-Sea Laboratory Raid ([Facility]):** Use the decrypted coordinates to dive into the Pacific Trench Facility, breach heavy automated defenses, and siphon prototype genetic telemetry from the sub-level mainframe.
3. **Mission 3 — Orbital Array Sabotage ([Space]):** Launch a final shuttle assault against Ascendant's high-orbit communications spire, overload the relay power grid, hold the extraction bay under siege, and sever their global command network forever.

---

## 2. Campaign Parameters & Lever Configuration

| Parameter | Rule Specification |
| :--- | :--- |
| **Difficulty Rating** | **Easy / Standard Initializer** |
| **Sequence Length** | **3 Fixed Linear Campaign Missions** |
| **Max Doom Threshold** | **[3 DOOM] Points** (Immediate Agency Collapse / Game Over at [3 DOOM]) |
| **Side-Mission Policy** | **UNLIMITED** access during HQ Downtime between Campaign Missions |
| **Side-Mission Failure Penalty** | **[0 DOOM] Points** (Local tactical HP damage, static die loss, or resource drain only) |
| **Campaign Mission Retry Policy** | **Freely Retriable** upon failure ([+1 DOOM] per failed Campaign Mission) |
| **Allowed Side-Mission Themes** | [Urban], [Facility], [Space], [Covert], [Planet] |

---

## 3. Macro-Spacing & Coherent Retry Logic

* **Macro-Spacing Across Time & Space:** Each mission in *Operation: Iron Dawn* represents a major strategic deployment separated by days or weeks of intelligence processing, Infirmary trauma recovery, and Quartermaster re-arming at HQ.
* **Tactical Retreat & Second Assault Wave:** If the squad fails a Campaign Mission climax stage or declares an emergency retreat, the narrative records that the strike team pulled back before securing the objective. The campaign track advances by **[+1 DOOM]**, and the squad returns to HQ. Retrying the mission represents launching a **Second Assault Wave** against an alerted target or secondary safehouse.

---

## 4. Campaign Mission Sequence

### Mission 1: [Black-Market Intercept / Perimeter Breach](../missions/mission-iron-dawn-1-black-market-intercept.md)
* **Stages:** 2 Stages (`Syndicate Alleyway / Outer Checkpoint` $\rightarrow$ `Broker's Safe-Vault / Lift Terminal Control`)
* **Base Clearance Bounty:** [6 CR], [1 PIP]
* **Squad Requirement:** $\ge 1$ [Combat] operative

### Mission 2: [Deep-Sea Laboratory Raid / The Subterranean Core](../missions/mission-iron-dawn-2-deep-sea-laboratory-raid.md)
* **Stages:** 3 Stages (`Ocean Platform Docks / Containment Patrol` $\rightarrow$ `Heavy Enforcer Gate` $\rightarrow$ `Sub-Level Mainframe / Bio-Lab Mainframe`)
* **Base Clearance Bounty:** [8 CR], [2 PIP]
* **Squad Requirement:** $\ge 1$ [Combat], $\ge 1$ [Intel] operative

### Mission 3: [Orbital Array Sabotage / Extraction Zero](../missions/mission-iron-dawn-3-orbital-array-sabotage.md)
* **Stages:** 3 Stages (`Hangar Bay Breach / Overload Terminal` $\rightarrow$ `Relay Power Grid / Helipad Defense` $\rightarrow$ `Master Control Hub / Evacuation Dash`)
* **Base Clearance Bounty:** **CAMPAIGN VICTORY!** (Proceed to Final Executive [VP] Audit)
* **Squad Requirement:** $\ge 2$ [Combat], $\ge 1$ [Survival] operative

---

## 5. Balance & Focus Pyramid Audit

| Metric | Specification |
| :--- | :--- |
| **Total Stages Across Campaign** | `8 Stages` (2 + 3 + 3) |
| **Base [Combat] Stages** | `5 of 8 Stages` (`62.5% [Combat]` — Exceeds the 50% Focus Pyramid Mandate) |
| **Frontline Mandate** | Every mission includes at least 1 [Combat] stage |
| **Dynamic Focus Swaps** | Available on `6 of 8 Stages` (*Force Breach* or *Tactical Bypass*) |
| **Doom Escalation** | Stage failures inflict local HP/dice/credit blowback; Mission failures add [+1 DOOM] (`3 Max`) |
