---
id: "faction-aurelius"
title: "Aurelius Media & Political Lobby"
component_type: "faction"
category: "media_politics"
faction: "faction-aurelius"
color_hex: "#4F46E5"
tier: 1
deck_copies: 1
cost:
  credits: 0
  effort: 0
  pip: 0
starting_assets:
  credits: 4
  effort: 1
  pip: 2
focus_affinity:
  primary: "negotiate"
  secondary: "infiltrate"
  bridges: []
base_power:
  name: "Media Spin"
  trigger: "At the conclusion of a successful mission or Stand-Down round"
  effect: "Spend [2 EF] to convert [1 LOY] on any of your operatives into [+1 PIP], OR convert [1 PIP] into [+3 CR]."
loyalty_tiers:
  tier_1:
    loyalty_required: 1
    title: "Contractor — Silver Tongue"
    effect: "Treat [Negotiate] as a Secondary Focus (4+) if currently Out of Focus (5+)."
  tier_2:
    loyalty_required: 3
    title: "Veteran — PR Campaign"
    effect: "Whenever this character clears a stage as Specialist, Aurelius gains [+1 CR] from news royalties."
  tier_3:
    loyalty_required: 6
    title: "Operative — Crisis Management (Squad Benefit)"
    effect: "Once per mission, if a stage fails while this character is deployed, prevent the loss of Faction [PIP] and reduce any Doom Tracker penalty by 1."
  tier_4:
    loyalty_required: 10
    title: "Corporate Icon — Global Icon (+3 VPs)"
    effect: "Earn double [PIP] payouts whenever Aurelius completes a mission with this character as Squad Leader. Awards [+3 VP] at end-of-game."
rules_text: "Base Power (Media Spin): After a mission or Stand-Down, spend [2 EF] to convert [1 LOY] into [+1 PIP], or convert [1 PIP] into [+3 CR]."
tags:
  - "faction"
  - "negotiate"
  - "pip"
  - "media"
art_spec:
  asset_path: "/assets/factions/faction_aurelius.webp"
  aspect_ratio: "70:120"
  visual_description: "A luminous broadcasting-indigo corporate crest shaped like an orbital satellite dish projecting concentric signal waves around a stylized globe inside a high-tech media control room."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Aurelius Media & Political Lobby

*Corporate News Network & Public Relations Monolith*

* **Faction Color:** Broadcasting Indigo (`#4F46E5`)
* **Strategic Identity:** Political Influence ([PIP]) arbitrage, [Negotiate] dominance, and shielding the squad from political/Doom fallout on failed stages.
* **Starting Vault Assets:** [4 CR] • [1 EF] • [2 PIP]

---

## Base Faction Power: Media Spin

At the conclusion of a successful mission or a Stand-Down round (during Step 1 of HQ Downtime), Aurelius may spend **`[2 EF]`** from their Vault to execute one of the following conversions:
* Convert **[1 LOY]** from any Aurelius operative into **[+1 PIP]** on your Faction Dashboard; **OR**
* Convert **[1 PIP]** from your Faction Dashboard into **`[+3 CR]`**.

---

## Operative Loyalty Progression Tree

| Loyalty Tier | Required [LOY] | Rank & Ability Name | Mechanical Effect |
| :--- | :---: | :--- | :--- |
| **Tier 1** | [1 LOY] | **Contractor:** *Silver Tongue* | Treat [Negotiate] as a **Secondary Focus (`4+`)** if currently Out of Focus (`5+`). |
| **Tier 2** | [3 LOY] | **Veteran:** *PR Campaign* | Whenever this operative participates in clearing a stage as a Phase 1 Specialist, Aurelius gains **[+1 CR]** from broadcast royalties. |
| **Tier 3** | [6 LOY] | **Operative:** *Crisis Management* *(Squad)* | Once per mission, if a stage or mission fails while this operative is deployed, prevent all Faction [PIP] losses and reduce any [DOOM] penalty by `1`. |
| **Tier 4** | [10+ LOY] | **Corporate Icon:** *Global Icon* *([+3 VP])* | Earn **double [PIP] payouts** whenever Aurelius completes a mission with this operative serving as Squad Leader. Worth **[+3 VP]** at end of campaign. |
