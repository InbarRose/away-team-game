---
id: "faction-vanderbilt"
title: "Vanderbilt Sovereign Group"
component_type: "faction"
category: "venture_monopoly"
faction: "faction-vanderbilt"
color_hex: "#C5A059"
tier: 1
deck_copies: 1
cost:
  credits: 0
  effort: 0
  pip: 0
starting_assets:
  credits: 6
  effort: 0
  pip: 2
focus_affinity:
  primary: "negotiate"
  secondary: "intel"
  bridges: []
base_power:
  name: "Hostile Buyout"
  trigger: "During HQ Sponsorship and Command Auctions"
  effect: "When Vanderbilt sponsors an HQ Module, receive a [1 CR] rebate. In the Command Auction, Vanderbilt may spend [1 CR] to force any rival bidder to match with [+2 CR] or forfeit."
loyalty_tiers:
  tier_1:
    loyalty_required: 1
    title: "Contractor — Corporate Subsidy"
    effect: "The purchase cost of gear equipped to this character is reduced by [-1 CR] (minimum [1 CR])."
  tier_2:
    loyalty_required: 3
    title: "Veteran — Golden Parachute (Squad Benefit)"
    effect: "When this character serves as Squad Leader, refund [1 CR] spent during the Command Auction back to Vanderbilt's Vault upon mission completion."
  tier_3:
    loyalty_required: 6
    title: "Operative — Dividends Engine"
    effect: "Every time this character participates in a cleared stage, deposit [+1 CR] into Vanderbilt's Vault."
  tier_4:
    loyalty_required: 10
    title: "Corporate Icon — Board Chair ([+3 VP])"
    effect: "When deployed, every player on the squad may re-roll one failed die per stage. Awards [+3 VP] at end-of-game."
rules_text: "Base Power (Hostile Buyout): Receive a [1 CR] rebate on HQ Module sponsorships. Spend [1 CR] in Command Auctions to force rivals to pay [+2 CR] or fold."
tags:
  - "faction"
  - "negotiate"
  - "credits"
  - "auctions"
art_spec:
  asset_path: "/assets/factions/faction_vanderbilt.png"
  aspect_ratio: "70:120"
  visual_description: "An opulent gilded-brass and black-marble corporate sigil featuring a stylized sovereign crown integrated with rising financial ticker bars inside a penthouse boardroom overlooking an orbital skyline."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Vanderbilt Sovereign Group

*Venture Capital Syndicate & Monopoly Holdings*

* **Faction Color:** Gilded Brass (`#C5A059`)
* **Strategic Identity:** Liquid [CR] monopoly, HQ infrastructure rebates, and pricing rivals out of Command Auctions.
* **Starting Vault Assets:** [6 CR] • [0 EF] • [2 PIP]

---

## Base Faction Power: Hostile Buyout

* **Infrastructure Rebate:** Whenever Vanderbilt sponsors an HQ Facility Module or Standalone Landmark, immediately receive a **`[1 CR]` rebate** from the supply bank.
* **Auction Squeeze:** During the Command Auction, Vanderbilt may spend **[1 CR]** to force any rival bidder to outbid by **[+2 CR]** (instead of [+1 CR]) or immediately forfeit their bid.

---

## Operative Loyalty Progression Tree

| Loyalty Tier | Required [LOY] | Rank & Ability Name | Mechanical Effect |
| :--- | :---: | :--- | :--- |
| **Tier 1** | [1 LOY] | **Contractor:** *Corporate Subsidy* | Quartermaster gear purchased for and immediately equipped to this operative costs **[-1 CR]** (minimum [1 CR]). |
| **Tier 2** | [3 LOY] | **Veteran:** *Golden Parachute* *(Squad)* | When this operative serves as **Squad Leader**, refund **[1 CR]** spent during the Command Auction back to Vanderbilt's Vault upon mission completion. |
| **Tier 3** | [6 LOY] | **Operative:** *Dividends Engine* | Every time this operative commits at least 1 die to a cleared stage, deposit **[+1 CR]** into Vanderbilt's Vault. |
| **Tier 4** | [10+ LOY] | **Corporate Icon:** *Board Chair* *([+3 VP])* | While deployed, **every operative on the squad** may re-roll 1 failed die per stage. Worth **[+3 VP]** at end of campaign. |
