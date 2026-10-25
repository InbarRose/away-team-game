---
id: "hq-boardroom"
title: "The Boardroom (Executive Floor)"
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
  secondary: "operations"
  bridges: []
stats:
  baseline_agenda_slots: 1
  baseline_perk_slots: 1
modules:
  - id: "mod-executive-suite"
    title: "Executive Suite"
    cost_credits: 4
    cost_pip: 0
    reward_pip: 1
    effect: "Expands corporate capacity for all Factions to 2 active Open Agenda slots and 2 Equippable Perk slots."
  - id: "mod-lobbying-network"
    title: "Lobbying Network"
    cost_credits: 4
    cost_pip: 0
    reward_pip: 1
    effect: "SPONSOR BENEFIT: Once per Downtime round, the Sponsor Faction may discard 1 unwanted Open Agenda or Perk card and draw a replacement."
  - id: "mod-press-office"
    title: "Press Office"
    cost_credits: 4
    cost_pip: 1
    reward_pip: 1
    effect: "SPONSOR BENEFIT: Media royalties—whenever ANY player completes an Open Agenda during a mission, the Sponsor Faction collects +1 [CR] from the supply."
rules_text: "Baseline: 1 Active Open Agenda Slot and 1 Equippable Perk Slot per Faction. Sponsorable Modules: Executive Suite (4 [CR]), Lobbying Network (4 [CR]), Press Office (1 [PIP] + 4 [CR])."
tags:
  - "hq"
  - "boardroom"
  - "agendas"
  - "perks"
art_spec:
  asset_path: "/assets/cards/hq/hq_boardroom.webp"
  aspect_ratio: "70:120"
  visual_description: "A high-security monolithic obsidian boardroom table surrounded by leather executive chairs, encrypted voting consoles, and an illuminated corporate seal overhead."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# The Boardroom (Executive Floor)

* **Baseline Capability:** Each Faction maintains **1 Active Open Agenda Slot** and **1 Equippable Perk Slot** on their Faction Dashboard during Step 7 of HQ Downtime.

---

## Sponsorable Modules

| Module Name | Sponsorship Cost | Reward | Passive / Sponsor Effect |
| :--- | :--- | :---: | :--- |
| **Executive Suite** | `4 [CR]` | `+1 [PIP]` | **Agency-Wide:** Expands capacity for every Faction to **2 Active Open Agendas** and **2 Equippable Perks**. |
| **Lobbying Network** | `4 [CR]` | `+1 [PIP]` | **Sponsor Benefit:** Once per Downtime, the Sponsor Faction may cycle (discard and redraw) 1 unwanted Agenda or Perk card. |
| **Press Office** | `1 [PIP] + 4 [CR]` | `+1 [PIP]` | **Sponsor Benefit:** Whenever **any player** completes an Open Agenda during a mission, the Sponsor Faction collects **`+1 [CR]`** from the bank. |
