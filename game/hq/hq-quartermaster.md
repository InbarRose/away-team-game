---
id: "hq-quartermaster"
title: "The Quartermaster (Armory Vault)"
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
  primary: "combat"
  secondary: "operations"
  bridges: []
stats:
  baseline_item_slots: 3
modules:
  - id: "mod-black-market-terminal"
    title: "Black Market Terminal"
    cost_credits: 4
    cost_pip: 0
    reward_pip: 1
    effect: "Unlocks high-tier equipment: Tier 2 Handhelds, Wearables, Multi-Slot Rigs, Consumables, and Complex items are mixed into the shop rotation."
  - id: "mod-bulk-logistics"
    title: "Bulk Logistics"
    cost_credits: 4
    cost_pip: 0
    reward_pip: 1
    effect: "Expands the Quartermaster display to 5 face-up item slots. All single-use Consumables cost [-1 CR] (minimum [1 CR])."
  - id: "mod-custom-workshop"
    title: "Custom Workshop"
    cost_credits: 3
    cost_pip: 1
    reward_pip: 1
    effect: "Gear tuning: equipping at least one non-consumable item during Step 8 (Loadout) grants that operative +1 temporary static die on their very first roll of the mission."
rules_text: "Baseline: 3 face-up Tier 1 Armory Item slots during Downtime Step 6. Sponsorable Modules: Black Market Terminal ([4 CR]), Bulk Logistics ([4 CR]), Custom Workshop ([1 PIP] + [3 CR])."
tags:
  - "hq"
  - "armory"
  - "shop"
  - "equipment"
art_spec:
  asset_path: "/assets/cards/hq/hq_quartermaster.webp"
  aspect_ratio: "70:120"
  visual_description: "A fortified underground weapons cage and automated ordnance rack displaying matte-black carbines, exo-rigs, and tactical visors behind a reinforced wire-mesh counter."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# The Quartermaster (Armory Vault)

* **Baseline Capability:** **3 Face-Up Item Slots**. Displays Tier 1 Handhelds, Wearables, Consumables, and Complex items at standard [CR] prices during Step 6 of HQ Downtime.

---

## Sponsorable Modules

| Module Name | Sponsorship Cost | Reward | Agency-Wide Passive Effect |
| :--- | :--- | :---: | :--- |
| **Black Market Terminal** | [4 CR] | [+1 PIP] | Unlocks **Tier 2** Handhelds, Wearables, Multi-Slot Rigs, Consumables, and Complex items in the Quartermaster deck rotation. |
| **Bulk Logistics** | [4 CR] | [+1 PIP] | Expands the shop display to **5 face-up item slots**. Single-use Consumables cost **[-1 CR]** (minimum [1 CR]). |
| **Custom Workshop** | `[1 PIP] + [3 CR]` | [+1 PIP] | Equipping a non-consumable item during Loadout grants that operative **`+1 temporary static die`** on their very first stage roll of the mission. |
