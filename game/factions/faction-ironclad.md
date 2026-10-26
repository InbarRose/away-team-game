---
id: "faction-ironclad"
title: "Ironclad Extraction Scavengers"
component_type: "faction"
category: "salvage_survival"
faction: "faction-ironclad"
color_hex: "#92400E"
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
  primary: "survival"
  secondary: "operations"
  bridges: []
base_power:
  name: "Vulture Salvage"
  trigger: "Whenever a stage is failed by the squad OR when an operative discards/burns an Item"
  effect: "Ironclad gains [+2 CR] whenever a stage fails or an item is discarded/consumed. Ironclad can buy discarded items from the scrap pile at half price (rounded up) during Downtime."
loyalty_tiers:
  tier_1:
    loyalty_required: 1
    title: "Contractor — Rigged Gear"
    effect: "Treat [Survival] as a Secondary Focus (4+) if currently Out of Focus (5+)."
  tier_2:
    loyalty_required: 3
    title: "Veteran — Field Reclamation (Squad Benefit)"
    effect: "When an ally uses/discards a Consumable item, this character can roll 1 die; on a 4+, reclaim the item back into inventory instead of discarding it."
  tier_3:
    loyalty_required: 6
    title: "Operative — Ablative Armor (Squad Benefit)"
    effect: "When a stage fails, this character salvages [+2 CR] for Ironclad and shields 1 ally from taking HP damage."
  tier_4:
    loyalty_required: 10
    title: "Corporate Icon — Scrap Monarch ([+3 VP])"
    effect: "All squad members gain +1 Wearable/Armor Slot; consumable items used by any squad member have a 50% (4+) chance to not be consumed. Awards [+3 VP] at end-of-game."
rules_text: "Base Power (Vulture Salvage): Gain [+2 CR] whenever a stage fails or an item is burned/discarded. Buy discarded scrap items at half price during Downtime."
tags:
  - "faction"
  - "survival"
  - "salvage"
  - "consumables"
art_spec:
  asset_path: "/assets/factions/faction_ironclad.webp"
  aspect_ratio: "70:120"
  visual_description: "A weathered rust-bronze industrial claw emblem clamping onto a salvaged reactor core, stenciled onto pitted hull plating with welding sparks flying in the background."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Ironclad Extraction Scavengers

*Deep-Space Mining, Wreck Salvage & Vulture Operations*

* **Faction Color:** Rust Bronze (`#92400E`)
* **Strategic Identity:** Profiting from stage failures and expended consumables, recycling squad gear, and mastering [Survival] environments.
* **Starting Vault Assets:** [4 CR] • [1 EF] • [1 PIP]

---

## Base Faction Power: Vulture Salvage

* **Scrap Harvesting:** Whenever a stage is **failed** by the squad OR whenever an operative **discards/consumes an Item card**, Ironclad harvests **`[+2 CR]`** from the bank (once per trigger event).
* **Scrapyard Procurement:** During Step 6 (Quartermaster) of HQ Downtime, Ironclad may purchase discarded/destroyed items from the scrap pile at **half [CR] cost** (rounded up).

---

## Operative Loyalty Progression Tree

| Loyalty Tier | Required [LOY] | Rank & Ability Name | Mechanical Effect |
| :--- | :---: | :--- | :--- |
| **Tier 1** | [1 LOY] | **Contractor:** *Rigged Gear* | Treat [Survival] as a **Secondary Focus (`4+`)** if currently Out of Focus (`5+`). |
| **Tier 2** | [3 LOY] | **Veteran:** *Field Reclamation* *(Squad)* | Whenever any squad member uses a Consumable item, roll 1 d6; on a **`4+`**, reclaim the card back into inventory instead of discarding it. |
| **Tier 3** | [6 LOY] | **Operative:** *Ablative Armor* *(Squad)* | When a stage fails, this operative salvages **[+2 CR]** for Ironclad and shields **1 ally from taking Stage Failure HP damage**. |
| **Tier 4** | [10+ LOY] | **Corporate Icon:** *Scrap Monarch* *([+3 VP])* | All squad members gain **+1 extra Wearable/Consumable slot**; all consumables used by the squad recycle on a `4+`. Worth **[+3 VP]** at end of campaign. |
