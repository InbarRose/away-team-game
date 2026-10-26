---
id: "faction-nexus"
title: "Nexus Cybernetics & Data"
component_type: "faction"
category: "technocratic_intel"
faction: "faction-nexus"
color_hex: "#00BCD4"
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
  secondary: "operations"
  bridges: []
base_power:
  name: "Deep-Data Synthesis"
  trigger: "Activate during Step 1 (Briefing) of an [Intel] or [Operations] stage"
  effect: "Spend [1 EF] to look at the top 2 cards of the Stage Modifier deck and place them back in any order. If the room is cleared, gain [+2 CR]."
loyalty_tiers:
  tier_1:
    loyalty_required: 1
    title: "Contractor — Sub-Routine Bypass"
    effect: "Treat [Operations] as a Secondary Focus (4+) if currently Out of Focus (5+)."
  tier_2:
    loyalty_required: 3
    title: "Veteran — Telemetry Relay (Squad Benefit)"
    effect: "When this character clears an [Intel] stage as Specialist, reduce the Target Difficulty of the next stage on the brief by -1 Success (min 1) for the whole squad."
  tier_3:
    loyalty_required: 6
    title: "Operative — Mainframe Override"
    effect: "Once per mission, during Step 1 (Briefing), swap the room's current Focus category to [Intel] or [Operations] without spending Effort."
  tier_4:
    loyalty_required: 10
    title: "Corporate Icon — Neural Apex ([+3 VP])"
    effect: "While deployed, all squad members treat [Intel] and [Operations] as Primary Focus (3+). Awards [+3 VP] at end-of-game."
rules_text: "Base Power (Deep-Data Synthesis): Spend [1 EF] during Briefing of an [Intel] or [Operations] stage to reorder top 2 Stage Modifiers; gain [+2 CR] on stage clear."
tags:
  - "faction"
  - "intel"
  - "operations"
  - "telemetry"
art_spec:
  asset_path: "/assets/factions/faction_nexus.webp"
  aspect_ratio: "70:120"
  visual_description: "A sleek neon-cyan holographic neural lattice emblem hovering inside a dark clean-room server core, with fiber-optic data streams converging into a stylized cybernetic iris."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Nexus Cybernetics & Data

*Technocratic Intelligence Collective & Systems Architecture*

* **Faction Color:** Neon Cyan (`#00BCD4`)
* **Strategic Identity:** Stage Modifier manipulation, [Intel] and [Operations] mastery, and converting technical clearances into liquid [CR].
* **Starting Vault Assets:** [3 CR] • [2 EF] • [1 PIP]

---

## Base Faction Power: Deep-Data Synthesis

Activate during **Step 1 (Briefing)** of an [Intel] or [Operations] stage. Spend **`[1 EF]`** from your Vault to look at the top 2 cards of the Stage Modifier deck and place them back in any order. If the stage is successfully cleared, Nexus gains **`[+2 CR]`**.

---

## Operative Loyalty Progression Tree

| Loyalty Tier | Required [LOY] | Rank & Ability Name | Mechanical Effect |
| :--- | :---: | :--- | :--- |
| **Tier 1** | [1 LOY] | **Contractor:** *Sub-Routine Bypass* | Treat [Operations] as a **Secondary Focus (`4+`)** if currently Out of Focus (`5+`). |
| **Tier 2** | [3 LOY] | **Veteran:** *Telemetry Relay* *(Squad)* | When this operative clears an [Intel] stage as a Specialist, reduce the Target Difficulty of the next stage on the brief by **`-1 Success`** (min 1) for the whole squad. |
| **Tier 3** | [6 LOY] | **Operative:** *Mainframe Override* | Once per mission, during Step 1 (Briefing), swap the room's active Focus to [Intel] or [Operations] for free ([0 EF]). |
| **Tier 4** | [10+ LOY] | **Corporate Icon:** *Neural Apex* *([+3 VP])* | While deployed, all squad members treat [Intel] and [Operations] as **Primary Focus (`3+`)**. Worth **[+3 VP]** at end of campaign. |
