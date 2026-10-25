---
id: "core-campaign-engine"
title: "Campaign Engine, Missions & Endgame Scoring"
component_type: "core_rule"
category: "core"
order: 7
summary: "Macro-campaign architecture, the Doom Tracker, Retry logic, Continuous Drops ([No HQ]), Safehouse Protocol, Side-Mission Theme tags, and Final VP Scoring."
---

# Campaign Engine, Missions & Endgame Scoring

## 1. Campaign Structure & Macro-Spacing

A campaign in **Away Team** consists of **3 to 5 fixed, story-driven Campaign Missions** arranged in a linear narrative arc (e.g., *Operation: Iron Dawn* or *Operation: Apex Extraction*), interspersed with optional **Side-Missions**.

### Macro-Spacing Across Time & Space
* **Distinct Deployments:** Campaign Missions take place across distinct global or orbital locations separated by days or weeks of in-world preparation. Returning to HQ between missions represents extracting from one theater of operations to analyze intelligence, treat trauma, and outfit the strike team for the next phase.
* **Coherent Retry Framing:** Campaign Missions are framed around achieving an **operational objective** (*Sabotage the Relay*, *Extract the VIP*). If a mission fails, the narrative records that the squad was forced into an emergency retreat before securing the objective. Retrying a failed mission represents launching a **Second Assault Wave** against an alerted target (or pivoting to a secondary target, such as extracting Dr. Kaelen in *Apex Extraction*).

---

## 2. Campaign Difficulty Levers & Special Protocols

Each Campaign Dossier defines five structural parameters:

1. **Mission Sequence Length:** `3 Missions` (Standard/Initializer) to `4–5 Missions` (Complex/Hard).
2. **Maximum Doom Threshold (`[DOOM]`):** Typically **3 to 4 `[DOOM]` points**. Note that **individual stage failures never add `[DOOM]`**—Stage failures inflict local tactical blowback (HP damage, static die loss, downstream stage difficulty $+1$). **`[DOOM]` is added strictly when an entire Mission fails** (or when a campaign rule explicitly triggers it). If `[DOOM]` reaches the campaign threshold, the Agency suffers immediate **Operational Collapse (Game Over)**.
3. **Global Retry Budget:** Easy campaigns allow free mission retries (limited only by the `[DOOM]` track), whereas hard campaigns enforce a strict **Global Retry Cap** (e.g., max 2 total retries across the campaign).
4. **Side-Mission Windows & Lockouts:** Campaigns specify when Side-Missions are open, capped, or locked out (e.g., after clearing Mission 3 in *Apex Extraction*, Side-Missions lock out permanently prior to the finale).
5. **Special Deployment Tags:**
   * **`[Continuous Drop]` / `[No HQ]`:** Links two consecutive missions (e.g., Mission 2 $\rightarrow$ Mission 3 in *Apex Extraction*). Upon clearing Part A, the squad **skips HQ Downtime entirely**, carrying their surviving HP, unspent static dice, equipped gear, and remaining consumables directly into Part B.
   * **`[Facility]` Safehouse Protocol:** When a campaign or mission sequence takes place entirely inside a monolithic mega-complex, HQ Downtime is reframed in-situ as retreating to a **Secured Sub-Level Safehouse** with portable stasis pods and terminal-hacked 3D supply fabricators.

---

## 3. Side-Mission Theme System

Every Side-Mission card carries **1 to 3 Environment & Context Theme Tags**. A Campaign Dossier lists its **Allowed Themes**, ensuring only narratively compatible Side-Missions enter the Intel Array market:

* 🏙️ **`[Urban]`:** Corporate arcologies, neon nightlife districts, syndicate black markets, transit hubs.
* 🛰️ **`[Space]`:** Orbital stations, derelict satellites, zero-g shipyards, high-orbit communication spires.
* 🌲 **`[Planet]`:** Wilderness incursions, alien jungle biomes, surface outposts, mountain passes.
* 🔬 **`[Facility]`:** Subterranean bio-labs, automated factories, containment sectors, reactor bunkers.
* 💼 **`[Covert]`:** Executive suites, diplomatic galas, encrypted data centers, political safehouses.

---

## 4. Operative Equipment Slots

During Step 8 of HQ Downtime (Loadout), each deployed operative can equip items from their Faction's Armory Cache up to their physical slot capacity:

* **Hands (`[Hand L]` + `[Hand R]` — 2 Hand Slots):** Can hold up to **two 1-Handed items** OR **one 2-Handed item** (some Multi-Slot Rigs such as the *Weapon-Mount Utility Frame* or *Titan Dreadnought Chassis* grant a **3rd `[Hand]` slot**).
* **Wearable Slots (`[Head]`, `[Body]`, `[Legs]`, `[Pack]` — 1 Slot Each):** Single-slot wearables occupy their respective slot; **Multi-Slot Rigs** occupy 2 or 3 combined slots (e.g., `[Head] + [Body]` or `[Head] + [Body] + [Legs]`).
* **Complex Slot (`[Complex]` — 1 Slot):** Holds 1 deployable turret, autonomous drone, or heavy siege rig.
* **Consumable Slots (`2 Slots` Baseline):** Each operative can carry up to **2 single-use Consumables** (expandable via `[Pack]` items like the *Field Logistics Backpack* or *Master Quartermaster Frame*, or the *Deep Pockets* perk).

---

## 5. Campaign Victory & Final `[VP]` Audit

When the squad clears the final Climax Stage of the campaign's last mission, the campaign ends in **Collective Survival**, and Factions immediately conduct the **Final Executive Audit** to determine the individual winner:

1. **Accumulated Score Track `[VP]`:** VPs earned throughout the campaign from completing **Open Agendas** (`+2 to +4 [VP]` each) and HQ sponsorships.
2. **Political Influence Power (`[PIP]`):** Every `[PIP]` on your Faction Dashboard converts at **`1 [PIP] = 2 [VP]`**.
3. **Personnel Loyalty (`[LOY]`):** Every point of `[LOY]` on your **living bench operatives** AND **Dead Pool martyrs** converts at standard **`1 [LOY] = 2 [VP]`**, plus **`+3 [VP]`** for every operative who reached **Loyalty Tier 4 (`10+ [LOY]` Corporate Icon)**.
4. **Tiered Secret Objectives:** Reveal hidden **Secret Objective** cards and award **`+15 [VP]` (1st Place)**, **`+10 [VP]` (2nd Place)**, and **`+5 [VP]` (3rd Place)** (minimum 1 unit required to qualify).
5. **Tie-Breaker:** Highest remaining `[PIP]`, then highest remaining `[CR]`, then most living operatives.
