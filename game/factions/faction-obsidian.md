---
id: "faction-obsidian"
title: "Obsidian Syndicate"
component_type: "faction"
category: "espionage_covert"
faction: "faction-obsidian"
color_hex: "#1C1917"
tier: 1
deck_copies: 1
cost:
  credits: 0
  effort: 0
  pip: 0
starting_assets:
  credits: 3
  effort: 1
  pip: 2
focus_affinity:
  primary: "infiltrate"
  secondary: "intel"
  bridges: []
base_power:
  name: "Black Budget"
  trigger: "During Step 7 (Boardroom) of HQ Downtime"
  effect: "Draw 1 extra Open Agenda and 1 extra Faction Perk. Choose 1 to keep (ignoring Boardroom capacity limits for the next drop) and discard the other."
loyalty_tiers:
  tier_1:
    loyalty_required: 1
    title: "Contractor — Shadow Walk"
    effect: "Treat [Infiltrate] as a Secondary Focus (4+) if currently Out of Focus (5+)."
  tier_2:
    loyalty_required: 3
    title: "Veteran — Counter-Surveillance (Squad Benefit)"
    effect: "When this character is deployed, the entire squad ignores negative Stage Modifiers during [Infiltrate] stages."
  tier_3:
    loyalty_required: 6
    title: "Operative — Deep Cover"
    effect: "Completing an Open Agenda with this character deployed grants [+1 EF] directly to Obsidian's Vault."
  tier_4:
    loyalty_required: 10
    title: "Corporate Icon — Shadow Director ([+3 VP])"
    effect: "Draw 2 Secret Objectives and keep both; while deployed, all squad stealth/[Infiltrate] checks gain +1 automatic Success. Awards [+3 VP] at end-of-game."
rules_text: "Base Power (Black Budget): During Boardroom step, draw 1 extra Open Agenda and 1 extra Perk; keep 1 beyond standard Boardroom slot limits."
tags:
  - "faction"
  - "infiltrate"
  - "agendas"
  - "stealth"
art_spec:
  asset_path: "/assets/factions/faction_obsidian.png"
  aspect_ratio: "70:120"
  visual_description: "A razor-sharp matte-obsidian geometric monolith emblem fractured with faint violet light seams, emerging from deep shadow inside a covert black-site briefing room."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Obsidian Syndicate

*Black-Ops Espionage & Covert Network*

* **Faction Color:** Matte Obsidian (`#1C1917`)
* **Strategic Identity:** Covert [Infiltrate] supremacy, breaking Boardroom Agenda/Perk capacity limits, and hidden endgame scoring.
* **Starting Vault Assets:** [3 CR] • [1 EF] • [2 PIP]

---

## Base Faction Power: Black Budget

During **Step 7 (Boardroom Politics)** of HQ Downtime, Obsidian draws **1 extra Open Agenda** and **1 extra Faction Perk**. Choose **1** of those drawn cards to keep active for the upcoming mission drop (**ignoring standard Boardroom slot capacity limits**) and discard the other.

---

## Operative Loyalty Progression Tree

| Loyalty Tier | Required [LOY] | Rank & Ability Name | Mechanical Effect |
| :--- | :---: | :--- | :--- |
| **Tier 1** | [1 LOY] | **Contractor:** *Shadow Walk* | Treat [Infiltrate] as a **Secondary Focus (`4+`)** if currently Out of Focus (`5+`). |
| **Tier 2** | [3 LOY] | **Veteran:** *Counter-Surveillance* *(Squad)* | While this operative is deployed, the **entire squad ignores negative Stage Modifiers** during [Infiltrate] stages. |
| **Tier 3** | [6 LOY] | **Operative:** *Deep Cover* | Whenever Obsidian completes an Open Agenda while this operative is deployed, deposit **[+1 EF]** into Obsidian's Vault. |
| **Tier 4** | [10+ LOY] | **Corporate Icon:** *Shadow Director* *([+3 VP])* | Draw 1 additional **Secret Objective** and score both at endgame; while deployed, all [Infiltrate] stages gain **+1 automatic Success**. Worth **[+3 VP]** at end of campaign. |
