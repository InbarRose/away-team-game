---
id: "faction-ascendant"
title: "Ascendant Bio-Tech"
component_type: "faction"
category: "biotech_medicine"
faction: "faction-ascendant"
color_hex: "#059669"
tier: 1
deck_copies: 1
cost:
  credits: 0
  effort: 0
  pip: 0
starting_assets:
  credits: 3
  effort: 2
  pip: 1
focus_affinity:
  primary: "intel"
  secondary: "survival"
  bridges: []
base_power:
  name: "Cellular Scrapping"
  trigger: "Whenever an Ascendant agent suffers 1+ Backfire damage (1s) or drops to 0 HP; and during Med Bay recovery"
  effect: "Deposit [+1 EF] into your Vault whenever an Ascendant operative takes Backfire damage or hits 0 HP. Ascendant operatives lower their Infirmary Healing Die target threshold by -1 (e.g., 5+ becomes 4+)."
loyalty_tiers:
  tier_1:
    loyalty_required: 1
    title: "Contractor — Dermal Plating"
    effect: "+1 Maximum Hit Point on this operative's sheet."
  tier_2:
    loyalty_required: 3
    title: "Veteran — Adrenaline Surge"
    effect: "Whenever this character takes HP damage, immediately restore 1 spent static die back to their active pool."
  tier_3:
    loyalty_required: 6
    title: "Operative — Bio-Catalyst (HQ Benefit)"
    effect: "While resting in the Infirmary during Downtime, all other characters resting in Infirmary beds gain +1 bonus Healing Die."
  tier_4:
    loyalty_required: 10
    title: "Corporate Icon — Apex Specimen (+3 VPs)"
    effect: "Automatically survives mission failure at 1 HP; restores 1 HP to every squad member after each cleared stage. Awards [+3 VP] at end-of-game."
rules_text: "Base Power (Cellular Scrapping): Gain [+1 EF] whenever your operative takes Backfire damage or drops to 0 HP. Your operatives heal on -1 lower threshold in the Infirmary."
tags:
  - "faction"
  - "biotech"
  - "medical"
  - "effort-engine"
art_spec:
  asset_path: "/assets/factions/faction_ascendant.webp"
  aspect_ratio: "70:120"
  visual_description: "A glowing toxic-emerald double-helix emblem coiled around a surgical caduceus inside a pressurized bio-containment cylinder filled with bioluminescent nutrient fluid."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Ascendant Bio-Tech

*Cloning Systems, Genetic Engineering & Cyber-Medicine*

* **Faction Color:** Toxic Emerald (`#059669`)
* **Strategic Identity:** Converting physical trauma into Vault [EF], superior Infirmary healing thresholds, and bio-regenerative resilience.
* **Starting Vault Assets:** [3 CR] • [2 EF] • [1 PIP]

---

## Base Faction Power: Cellular Scrapping

* **Trauma Harvesting:** Whenever an Ascendant operative suffers `1+` Backfire damage (`1s`) or drops to `0 HP`, immediately deposit **`[+1 EF]`** into Ascendant's Vault.
* **Enhanced Cellular Recovery:** Ascendant operatives improve their Infirmary Healing Die threshold by **`-1`** (healing on **`4+`** base, or **`3+`** with *Trauma Cybernetics*).

---

## Operative Loyalty Progression Tree

| Loyalty Tier | Required [LOY] | Rank & Ability Name | Mechanical Effect |
| :--- | :---: | :--- | :--- |
| **Tier 1** | [1 LOY] | **Contractor:** *Dermal Plating* | Permanently increases this operative's Maximum Hit Points by **`+1 HP`**. |
| **Tier 2** | [3 LOY] | **Veteran:** *Adrenaline Surge* | Whenever this operative takes HP damage, immediately restore **`1 spent static die`** back to their active pool. |
| **Tier 3** | [6 LOY] | **Operative:** *Bio-Catalyst* *(HQ Benefit)* | While resting in an Infirmary bed during Downtime, **all other operatives resting in beds** gain **`+1 bonus Healing Die`**. |
| **Tier 4** | [10+ LOY] | **Corporate Icon:** *Apex Specimen* *([+3 VP])* | Automatically survives mission failure at `1 HP`; restores **`1 HP` to every squad member** after each cleared stage. Worth **[+3 VP]** at end of campaign. |
