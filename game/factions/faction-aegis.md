---
id: "faction-aegis"
title: "Aegis Tactical Directorate"
component_type: "faction"
category: "pmc_ordnance"
faction: "faction-aegis"
color_hex: "#2C3E50"
tier: 1
deck_copies: 1
cost:
  credits: 0
  effort: 0
  pip: 0
starting_assets:
  credits: 4
  effort: 1
  pip: 1
focus_affinity:
  primary: "combat"
  secondary: "survival"
  bridges: []
base_power:
  name: "Kinetic Reclamation"
  trigger: "Whenever an Aegis agent generates Momentum (+2 or higher on a cleared stage)"
  effect: "Aegis immediately deposits [+1 EF] into their Faction Vault."
loyalty_tiers:
  tier_1:
    loyalty_required: 1
    title: "Contractor — CQC Drill"
    effect: "Ignore the first natural 1 (Backfire) rolled by this character each stage."
  tier_2:
    loyalty_required: 3
    title: "Veteran — Covering Fire (Squad Benefit)"
    effect: "When this character generates Momentum, grant +1 additional Momentum refund die to an ally who rolled in that stage."
  tier_3:
    loyalty_required: 6
    title: "Operative — Tactical Command"
    effect: "Once per mission, when this character rolls a natural 1, convert it into a Success instead of taking damage."
  tier_4:
    loyalty_required: 10
    title: "Corporate Icon — War Hero ([+3 VP])"
    effect: "All allies in this character's squad gain +1 temporary static die during Phase 1 in [Combat] stages. Awards [+3 VP] at end-of-game."
rules_text: "Base Power (Kinetic Reclamation): Whenever an Aegis agent generates [MOM], deposit [+1 EF] into your Vault."
tags:
  - "faction"
  - "combat"
  - "momentum"
  - "pmc"
art_spec:
  asset_path: "/assets/factions/faction_aegis.png"
  aspect_ratio: "70:120"
  visual_description: "A brutalist gunmetal-slate corporate command crest featuring an angular tactical shield bisected by twin heavy rifle barrels, set against an armored bulkhead lit by cold tactical HUD projections."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Aegis Tactical Directorate

*Private Military Contractor & Heavy Ordnance Syndicate*

* **Faction Color:** Gunmetal Slate (`#2C3E50`)
* **Strategic Identity:** Frontline kinetic dominance, Momentum generation, and turning aggressive stage clears into sustainable Vault [EF].
* **Starting Vault Assets:** [4 CR] • [1 EF] • [1 PIP]

---

## Base Faction Power: Kinetic Reclamation

Whenever an Aegis operative participates in a stage that generates **Operational Momentum ([MOM], $+2$ or higher above Target Difficulty)**, Aegis immediately deposits **`[+1 EF]`** from the supply into their Faction Vault.

---

## Operative Loyalty Progression Tree

| Loyalty Tier | Required [LOY] | Rank & Ability Name | Mechanical Effect |
| :--- | :---: | :--- | :--- |
| **Tier 1** | [1 LOY] | **Contractor:** *CQC Drill* | Ignore the first natural `1` (Backfire) rolled by this operative each stage. |
| **Tier 2** | [3 LOY] | **Veteran:** *Covering Fire* *(Squad)* | When this operative helps generate [MOM], grant **+1 additional Momentum refund die** to an ally who rolled in that stage. |
| **Tier 3** | [6 LOY] | **Operative:** *Tactical Command* | Once per mission, when this operative rolls a natural `1`, convert it into a **Success** instead of taking Backfire damage. |
| **Tier 4** | [10+ LOY] | **Corporate Icon:** *War Hero* *([+3 VP])* | All allies in this operative's squad gain **+1 temporary static die** during Phase 1 in [Combat] stages. Worth **[+3 VP]** at end of campaign. |
