---
id: "core-vault-economy"
title: "Faction Vault Economy & HQ Downtime Phase"
component_type: "core_rule"
category: "core"
order: 6
summary: "Rules for Faction Vaults, the four core currencies (Credits, Effort, PIP, Loyalty), Binding Promises, the 8-step HQ Downtime Phase, and corporate facility sponsorship."
---

# Faction Vault Economy & HQ Downtime Phase

## 1. Faction Vaults & The Asset Pooling Protocol

In **Away Team**, individual operatives do not own private money, gear, or tokens. All operational assets belong to the **Faction** and are stored in each player's **Faction Vault** on their Faction Dashboard:

* **Liquid Vault Assets:** All Credits (`[CR]`), Effort (`[EF]`), and Political Influence Power (`[PIP]`) earned during missions or downtime are deposited directly into the Faction Vault.
* **The Armory Cache:** Purchased or salvaged equipment cards belong to the Faction. When operatives return to HQ, all equipped items are unequipped back into the Faction's Armory Cache, allowing gear to be freely reassigned to different operatives on the next drop.
* **Effort Persistence:** Unspent `[EF]` remains in the Faction Vault indefinitely between missions (up to the Faction's storage cap) until spent on Class Abilities, Faction Powers, or Squad Leader actions.

---

## 2. The Four Core Currencies & Metrics

| Currency | Notation | ES Value | Endgame VP Conversion | Primary Operational Uses |
| :--- | :---: | :---: | :--- | :--- |
| **Credits** | `[CR]` | `0.50 ES` | **`1 [CR] = 1 [VP]`** *(when invested in HQ or via liquidity rules)* | Buying Quartermaster gear, sponsoring HQ Modules, recruiting operatives (`8 [CR]`), Command Auction bids. **Tradeable.** |
| **Effort** | `[EF]` | `1.33 ES` | Fuels Agenda/Objective scoring | Activating any Class Ability (`1 [EF]`), Faction Powers, Squad Leader *Logistical Refresh* (`2–3 [EF]`), `0 HP` stabilization (`1 [EF]`). **Non-Tradeable.** |
| **Political Influence** | `[PIP]` | `6.00 ES` | **`1 [PIP] = 2 [VP]`** | Sponsoring high-tier HQ modules & Landmarks, breaking auction ties, paying the Vulture Tax (`-1 [PIP]` per 2 looted items). **Non-Tradeable.** |
| **Loyalty** | `[LOY]` | `0.00 ES` *(Field)* | **`1 [LOY] = 2 [VP]`** *(Living & Dead Pool)* | Tracked on individual operative cards. Unlocks **Faction Loyalty Tiers (`1 / 3 / 6 / 10+`)**, scales Multi-Tier Perks, breaks auction ties. **Non-Tradeable.** |

### Earning Operative Loyalty (`[LOY]`)
1. **Survival Baseline:** Every deployed operative who returns from a mission **alive** earns **`+1 [LOY]`**.
2. **Squad Leader Bonus:** If the mission is successfully cleared, the **Squad Leader** earns **`+1 additional [LOY]`** (`+2 [LOY]` total).
3. **Milestones & Facilities:** Specific Open Agendas, Side-Missions, or the *Tactical Simulator* Landmark award bonus `[LOY]`.

### The Law of Binding Promises
During any Stage Briefing (Step 1) or HQ Downtime Phase, players may freely trade **`[CR]`**, **Armory Items**, or **immediate tactical actions** (e.g., *"Pay me 2 Credits now and I will activate Dual-Vector Mapping on this stage"*). Once resources change hands, promises of immediate action in the current step are **legally binding**. **`[EF]`, `[PIP]`, and `[LOY]` can never be traded between players.**

---

## 3. The 8-Step HQ Downtime Phase

Between mission deployments, all players return to Agency Headquarters and resolve the **HQ Downtime Phase** in a strict 8-step sequence:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: DEBRIEF & PAYOUTS                                                    │
│  • Collect mission Credits [CR], [PIP], and +1 [LOY] for surviving agents.   │
├──────────────────────────────────────────────────────────────────────────────┤
│ STEP 2: THE STAND-DOWN AUCTION (DEPLOY VS. R&R)                              │
│  • Bid [CR] (min 0) to decide whether the Agency DEPLOYS or STANDS DOWN.     │
├──────────────────────────────────────────────────────────────────────────────┤
│ STEP 3: HEALING & MEDICAL RECOVERY                                           │
│  • Assign wounded bench operatives to Infirmary beds or Cryo-Stasis.         │
│  • Roll Healing Dice (5+/4+); unhealed damage becomes Critical Injuries.     │
├──────────────────────────────────────────────────────────────────────────────┤
│ STEP 4: CORPORATE SPONSORSHIP & BASE EXPANSION                               │
│  • Factions pay [CR]/[PIP] to sponsor HQ Modules (+1 PIP) or Landmarks (+2). │
├──────────────────────────────────────────────────────────────────────────────┤
│ STEP 5: RECRUITMENT BUREAU                                                   │
│  • Hire new operatives from the face-up pool (8 [CR] base cost).             │
├──────────────────────────────────────────────────────────────────────────────┤
│ STEP 6: QUARTERMASTER PROCUREMENT                                            │
│  • Buy, sell, or trade Handhelds, Wearables, Consumables, and Complex gear.  │
├──────────────────────────────────────────────────────────────────────────────┤
│ STEP 7: BOARDROOM POLITICS                                                   │
│  • Equip Multi-Tier Perks, audit Open Agendas, and manage political slots.   │
├──────────────────────────────────────────────────────────────────────────────┤
│ STEP 8: COMMAND AUCTION & MISSION LOADOUT (IF DEPLOYING)                     │
│  • Assemble the 4-operative squad, bid [CR] for Squad Leader, equip gear.    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Step 2 Deep-Dive: The Stand-Down Auction
Before launching the next mission, players bid `[CR]` (minimum bid: `0 [CR]`, resolved via standard tie-breakers: `[CR]` $\rightarrow$ `[PIP]` $\rightarrow$ `[LOY]` $\rightarrow$ Roll-off) to determine the Agency's operational posture:
* **Option A — DEPLOY:** Proceed normally through Downtime and launch the next Campaign or Side-Mission in Step 8.
* **Option B — STAND-DOWN (Maintenance Round):** Skip Step 8 (no mission deployment this round). Instead:
  * Infirmary capacity increases by **+2 Treatment Beds** (4 beds base).
  * Every Infirmary bed gains **+2 bonus Healing Dice** (5 dice per bed).
  * The Quartermaster shop inventory completely refreshes for free.
  * *(Note: If the active Campaign Dossier penalizes Stand-Downs with `+1 [DOOM]`, advance the Doom Tracker accordingly).*

### Step 4 Deep-Dive: Corporate Sponsorship (HQ Upgrades)
HQ starts with **5 Baseline Facilities** (*Infirmary*, *Quartermaster*, *Recruitment Bureau*, *Intel Array*, *Boardroom*), each offering 3 upgrade modules, plus **4 Standalone Landmark Modules**:
* **Single-Sponsor Rule:** A Faction pays the module's full cost (`4 [CR]` or `1 [PIP] + 3–4 [CR]`) in a single Downtime step, claims **`+1 [PIP]`** (`+2 [PIP]` for Landmarks), and places their **Faction Token** on the module.
* **Shared vs. Sponsor-Controlled:** Most modules upgrade the entire Agency's capabilities, while specific perks (such as *Cryo-Stasis Chamber*, *Tactical Simulator*, *Lobbying Network*, and *Press Office*) grant exclusive control or royalties to the Sponsor Faction.
