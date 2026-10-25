---
id: "hq-infirmary"
title: "The Infirmary (Medical Wing)"
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
  primary: "survival"
  secondary: "intel"
  bridges: []
stats:
  baseline_beds: 2
  dice_per_bed: 3
  healing_threshold: 5
modules:
  - id: "mod-surgical-wing"
    title: "Surgical Wing"
    cost_credits: 4
    cost_pip: 0
    reward_pip: 1
    effect: "Adds +2 additional Treatment Beds (4 total beds base; 6 during Stand-Down)."
  - id: "mod-trauma-cybernetics"
    title: "Trauma Cybernetics"
    cost_credits: 4
    cost_pip: 0
    reward_pip: 1
    effect: "All Healing Dice across all beds clear damage on a 4+ (instead of 5+). Critical Injury recovery rolls improve from 6+ to 5+."
  - id: "mod-gene-stasis-tank"
    title: "Gene-Stasis Tank"
    cost_credits: 3
    cost_pip: 1
    reward_pip: 1
    effect: "During Downtime Step 3, any Faction may spend 1 [EF] from their Vault to automatically restore 1 missing HP to an operative without rolling dice (0% risk of natural 1 Permanent Trauma)."
rules_text: "Baseline: 2 Treatment Beds, 3 Healing Dice per bed (heals on 5+; natural 1 causes Permanent Trauma; unhealed HP becomes Critical Injury). Sponsorable Modules: Surgical Wing (4 [CR]), Trauma Cybernetics (4 [CR]), Gene-Stasis Tank (1 [PIP] + 3 [CR])."
tags:
  - "hq"
  - "medical"
  - "healing"
  - "trauma"
art_spec:
  asset_path: "/assets/cards/hq/hq_infirmary.webp"
  aspect_ratio: "70:120"
  visual_description: "A clinical sci-fi trauma bay inside an underground agency bunker featuring two robotic surgical beds, glowing holographic vital-sign monitors, and a pressurized gene-stasis cylinder along the back wall."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# The Infirmary (Medical Wing)

* **Baseline Capability:** **2 Treatment Beds**. Each bed provides **3 Healing Dice** to a resting non-deployed operative during Step 3 of HQ Downtime.
* **Healing Resolution:** Every die showing **`5+`** heals `1 missing HP`. Rolling a **natural `1`** calcifies that point of damage into a **Permanent Trauma Token** (`-1 Max HP`, `-1 Starting Static Die`). Any damage remaining unhealed at the end of Step 3 converts into a **Critical Injury Token**.

---

## Sponsorable Modules

Sponsoring any module awards **`+1 [PIP]`** (`2 [VP]`) to the funding Faction and places their Faction Token on the module.

| Module Name | Sponsorship Cost | Reward | Agency-Wide Passive Effect |
| :--- | :--- | :---: | :--- |
| **Surgical Wing** | `4 [CR]` | `+1 [PIP]` | Adds **+2 additional Treatment Beds** (4 total beds baseline; 6 during a Stand-Down round). |
| **Trauma Cybernetics** | `4 [CR]` | `+1 [PIP]` | Upgrades medical lasers: all Healing Dice clear damage on a **`4+`** (and Critical Injury healing improves from `6+` to **`5+`**). |
| **Gene-Stasis Tank** | `1 [PIP] + 3 [CR]` | `+1 [PIP]` | Spending **`1 [EF]`** from a Faction Vault during Downtime automatically restores `1 missing HP` without rolling dice (zero risk of natural `1` Permanent Trauma). |
