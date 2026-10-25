---
id: "core-vault-economy"
title: "Faction Vault Economy & HQ Downtime Phase"
component_type: "core_rule"
category: "core"
order: 6
summary: "Rules for Faction Vaults, the three primary currencies (Credits, Effort, PIP), non-currency rewards/trackers (Momentum, Loyalty, Doom, VP), Binding Promises, and the 8-step HQ Downtime Phase."
---

# Faction Vault Economy & HQ Downtime Phase

## 1. Faction Vaults & The Asset Pooling Protocol

In **Away Team**, individual operatives do not own private money, gear, or tokens. All spendable operational assets belong to the **Faction** and are stored in each player's **Faction Vault** on their Faction Dashboard:

* **Three Primary Vault Currencies:** All **Credits ([CR])**, **Effort ([EF])**, and **Political Influence ([PIP])** earned during missions or downtime are deposited directly into the Faction Vault and spent from there.
* **The Armory Cache:** Purchased or salvaged equipment cards belong to the Faction. When operatives return to HQ, all equipped items are unequipped back into the Faction's Armory Cache, allowing gear to be freely reassigned to different operatives on the next drop.
* **Effort Persistence:** Unspent [EF] remains in the Faction Vault indefinitely between missions (up to the Faction's storage cap) until spent on Class Abilities, Faction Powers, or Squad Leader actions.

---

## 2. Primary Currencies vs. Mission States, Rewards & Meta Trackers

To keep bookkeeping clear, **Away Team** separates **Primary Vault Currencies** (which you store and spend) from **In-Mission States**, **Personnel Progression Rewards**, and **Macro Trackers**:

### 2.1 The Three Primary Vault Currencies (Spendable Assets)

| Primary Currency | Notation | ES Value | Tradeable? | Primary Operational Uses |
| :--- | :---: | :---: | :---: | :--- |
| **Credits** | [CR] | `0.50 ES` | **Yes** *(Binding Promises)* | Buying Quartermaster gear, sponsoring HQ Modules, recruiting operatives (`[8 CR]`), and bidding in the Command Auction. |
| **Effort** | [EF] | `1.33 ES` | **No** *(Vault-Bound)* | Activating Class Abilities (`[1 EF]`), [Complex] hardware, Faction Powers, Squad Leader *Logistical Refresh* (`[2 EF]`–`[3 EF]`), and `0 HP` stabilization (`[1 EF]`). |
| **Political Influence** | [PIP] | `6.00 ES` | **No** *(Vault-Bound)* | Sponsoring high-tier HQ modules & Landmarks, breaking Command Auction ties, paying the Vulture Tax (`[-1 PIP]` per 2 looted items), and worth `[2 VP]` per `[1 PIP]` at endgame. |

### 2.2 Non-Currency States, Rewards & Meta Trackers (Never Spent or Traded)

| Concept / Tracker | Notation | Category | How It Works & Why It Is Not a Currency |
| :--- | :---: | :--- | :--- |
| **Operational Momentum** | [MOM] | **In-Mission Tactical Flow** | Earned **only during an active mission** when clearing a Stage by $\ge D + 2$ successes. Immediately refunds `1 spent static die` to a participating operative and triggers Momentum-reactive powers. Never stored in the Vault; resets at mission extraction. |
| **Loyalty** | [LOY] | **Operative Progression Reward** | Attached directly to an individual Specialist Operative card (earned by surviving missions or Martyrdom). **Cannot be spent or traded.** Reaching higher ranks (`1 / 3 / 6 / [10+ LOY]`, Tiers 1–4) permanently unlocks Faction Loyalty Tree abilities, scales Multi-Tier Perks, and awards `[2 VP]` per `[1 LOY]` at endgame. |
| **Doom** | [DOOM] | **Meta Campaign Clock** | Global catastrophe countdown tracked on the Campaign Dossier—not on player boards. Advances (`[+1 DOOM]`) on mission failure or forced extraction; reaching Max Doom ends the campaign in a coalition loss. |
| **Victory Points** | [VP] | **Endgame Score Tracker** | Corporate supremacy score tallied at the end of the campaign (from Sponsored HQ Modules, Open Agendas, Secret Objectives, Tier 4 Icons, and Vault reserves) to crown the winning Director. |

### Earning Operative Loyalty ([LOY])
1. **Survival Baseline:** Every deployed operative who returns from a mission **alive** earns `[+1 LOY]`.
2. **Squad Leader Bonus:** If the mission is successfully cleared, the **Squad Leader** earns `[+1 LOY]` additional (`[+2 LOY]` total).
3. **Milestones & Facilities:** Specific Open Agendas, Side-Missions, or the *Tactical Simulator* Landmark award bonus [LOY].

### The Law of Binding Promises
During any Stage Briefing (Step 1) or HQ Downtime Phase, players may freely trade **[CR]**, **Armory Items**, or **immediate tactical actions** (e.g., *"Pay me `[2 CR]` now and I will activate Dual-Vector Mapping on this stage"*). Once resources change hands, promises of immediate action in the current step are **legally binding**. **[EF] and [PIP] cannot be traded between players, and [LOY], [MOM], [DOOM], and [VP] are non-currency states/trackers.**

---

## 3. The 8-Step HQ Downtime Phase

Between mission deployments, all players return to Agency Headquarters and resolve the **HQ Downtime Phase** in a strict 8-step sequence:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: DEBRIEF & PAYOUTS                                                    │
│  • Collect mission [CR], [PIP], and [+1 LOY] for surviving agents.   │
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
│  • Hire new operatives from the face-up pool ([8 CR] base cost).             │
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
Before launching the next mission, players bid [CR] (minimum bid: [0 CR], resolved via standard tie-breakers: [CR] $\rightarrow$ [PIP] $\rightarrow$ [LOY] $\rightarrow$ Roll-off) to determine the Agency's operational posture:
* **Option A — DEPLOY:** Proceed normally through Downtime and launch the next Campaign or Side-Mission in Step 8.
* **Option B — STAND-DOWN (Maintenance Round):** Skip Step 8 (no mission deployment this round). Instead:
  * Infirmary capacity increases by **+2 Treatment Beds** (4 beds base).
  * Every Infirmary bed gains **+2 bonus Healing Dice** (5 dice per bed).
  * The Quartermaster shop inventory completely refreshes for free.
  * *(Note: If the active Campaign Dossier penalizes Stand-Downs with [+1 DOOM], advance the Doom Tracker accordingly).*

### Step 4 Deep-Dive: Corporate Sponsorship (HQ Upgrades)
HQ starts with **5 Baseline Facilities** (*Infirmary*, *Quartermaster*, *Recruitment Bureau*, *Intel Array*, *Boardroom*), each offering 3 upgrade modules, plus **4 Standalone Landmark Modules**:
* **Single-Sponsor Rule:** A Faction pays the module's full cost ([4 CR] or `[1 PIP] + [3–4 CR]`) in a single Downtime step, claims **[+1 PIP]** ([+2 PIP] for Landmarks), and places their **Faction Token** on the module.
* **Shared vs. Sponsor-Controlled:** Most modules upgrade the entire Agency's capabilities, while specific perks (such as *Cryo-Stasis Chamber*, *Tactical Simulator*, *Lobbying Network*, and *Press Office*) grant exclusive control or royalties to the Sponsor Faction.
