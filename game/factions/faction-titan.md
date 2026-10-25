---
id: "faction-titan"
title: "Titan Heavy Logistics"
component_type: "faction"
category: "orbital_logistics"
faction: "faction-titan"
color_hex: "#D97706"
tier: 1
deck_copies: 1
cost:
  credits: 0
  effort: 0
  pip: 0
starting_assets:
  credits: 4
  effort: 2
  pip: 1
focus_affinity:
  primary: "operations"
  secondary: "combat"
  bridges: []
base_power:
  name: "Orbital Munitions Resupply"
  trigger: "Activate during any Transition Step between stages"
  effect: "Spend [2 EF] to immediately grant +1 static die back to the active pools of every deployed operative on the squad."
loyalty_tiers:
  tier_1:
    loyalty_required: 1
    title: "Contractor — Deep Pockets"
    effect: "Can carry +1 extra Consumable item beyond standard inventory limits."
  tier_2:
    loyalty_required: 3
    title: "Veteran — Heavy Drop Specialist"
    effect: "When Titan triggers Orbital Munitions Resupply, this character restores +2 static dice instead of +1."
  tier_3:
    loyalty_required: 6
    title: "Operative — Field Quartermaster (Squad Benefit)"
    effect: "Once per mission, during a Transition Step, restore 1 spent static die to every squad member for free ([0 EF] cost)."
  tier_4:
    loyalty_required: 10
    title: "Corporate Icon — Logistics Paragon (+3 VPs)"
    effect: "Active static dice pools across the entire squad can never drop below 2 dice during any stage. Awards [+3 VP] at end-of-game."
rules_text: "Base Power (Orbital Munitions Resupply): Spend [2 EF] during any Transition Step to restore +1 spent static die to every deployed operative on the squad."
tags:
  - "faction"
  - "operations"
  - "logistics"
  - "dice-refresh"
art_spec:
  asset_path: "/assets/factions/faction_titan.webp"
  aspect_ratio: "70:120"
  visual_description: "An industrial hazard-amber corporate emblem featuring a heavy orbital drop-pod descending through atmospheric plasma inside a colossal mechanized cargo bay."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Titan Heavy Logistics

*Orbital Supply Chain & Industrial Hardware Conglomerate*

* **Faction Color:** Industrial Amber (`#D97706`)
* **Strategic Identity:** Squad-wide static dice replenishment, extra consumable capacity, and acting as the strike team's logistical backbone even when not serving as Squad Leader.
* **Starting Vault Assets:** [4 CR] • [2 EF] • [1 PIP]

---

## Base Faction Power: Orbital Munitions Resupply

Activate during any **Transition Step** between stages (regardless of whether Titan holds the Squad Leader title). Spend **`[2 EF]`** from Titan's Vault to immediately restore **`+1 spent static die`** back to the active pools of **every deployed operative on the squad**.

---

## Operative Loyalty Progression Tree

| Loyalty Tier | Required [LOY] | Rank & Ability Name | Mechanical Effect |
| :--- | :---: | :--- | :--- |
| **Tier 1** | [1 LOY] | **Contractor:** *Deep Pockets* | This operative can carry **+1 extra Consumable item** beyond standard inventory slot limits. |
| **Tier 2** | [3 LOY] | **Veteran:** *Heavy Drop Specialist* | Whenever Titan triggers *Orbital Munitions Resupply*, this operative restores **`+2 spent static dice`** instead of `+1`. |
| **Tier 3** | [6 LOY] | **Operative:** *Field Quartermaster* *(Squad)* | Once per mission, during a Transition Step, restore **`1 spent static die` to every squad member** for free ([0 EF] cost). |
| **Tier 4** | [10+ LOY] | **Corporate Icon:** *Logistics Paragon* *([+3 VP])* | While deployed, active static dice pools across the **entire squad** can never drop below `2 dice`. Worth **[+3 VP]** at end of campaign. |
