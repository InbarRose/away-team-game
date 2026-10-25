---
id: "hq-recruitment-bureau"
title: "The Recruitment Bureau (Personnel Division)"
component_type: "hq_facility"
category: "baseline_facility"
faction: "neutral"
tier: 1
deck_copies: 1
cost:
  credits: 4
  effort: 0
  pip: 0
focus_affinity:
  primary: "negotiate"
  secondary: "combat"
  bridges: []
stats:
  baseline_recruit_slots: 2
  base_hire_cost_credits: 8
modules:
  - id: "mod-headhunter-network"
    title: "Headhunter Network"
    cost_credits: 4
    cost_pip: 0
    reward_pip: 1
    effect: "Expands the face-up recruitment market from 2 to 4 available Specialist Operative choices."
  - id: "mod-signing-bonus-incentives"
    title: "Signing Bonus Incentives"
    cost_credits: 4
    cost_pip: 0
    reward_pip: 1
    effect: "Reduces operative hiring cost by [-2 CR] (from [8 CR] down to [6 CR]). Newly hired recruits immediately draw 1 free random Tier 1 Consumable item."
  - id: "mod-academy-fast-track"
    title: "Academy Fast-Track"
    cost_credits: 3
    cost_pip: 1
    reward_pip: 1
    effect: "All newly hired recruits enter their Faction roster starting with [1 LOY] (immediately unlocking Loyalty Tier 1 Contractor perks)."
rules_text: "Baseline: 2 face-up Recruit Cards, hiring cost [8 CR] per operative (enters at full HP, [0 LOY]). Sponsorable Modules: Headhunter Network ([4 CR]), Signing Bonus Incentives ([4 CR]), Academy Fast-Track ([1 PIP] + [3 CR])."
tags:
  - "hq"
  - "recruitment"
  - "personnel"
  - "loyalty"
art_spec:
  asset_path: "/assets/cards/hq/hq_recruitment_bureau.webp"
  aspect_ratio: "70:120"
  visual_description: "A dimly lit corporate personnel dossier room featuring wall-sized holographic operative profiles, biometric scanners, and encrypted contract terminals."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# The Recruitment Bureau (Personnel Division)

* **Baseline Capability:** **2 Face-Up Recruit Cards**. During Step 5 of HQ Downtime, Factions may pay **`[8 CR]`** to hire an available operative onto their roster bench at full HP and [0 LOY].

---

## Sponsorable Modules

| Module Name | Sponsorship Cost | Reward | Agency-Wide Passive Effect |
| :--- | :--- | :---: | :--- |
| **Headhunter Network** | [4 CR] | [+1 PIP] | Expands the recruitment pool to **4 face-up operative choices**. |
| **Signing Bonus Incentives** | [4 CR] | [+1 PIP] | Reduces operative hiring cost by **[-2 CR]** ([6 CR] total) and grants 1 free random Tier 1 Consumable upon hiring. |
| **Academy Fast-Track** | `[1 PIP] + [3 CR]` | [+1 PIP] | Newly hired recruits enter the Faction roster with **`+1 starting [LOY]`** (unlocking Loyalty Tier 1 immediately). |
