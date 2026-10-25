---
id: "core-squad-leader-command"
title: "Operational Command (The Squad Leader)"
component_type: "core_rule"
category: "core"
order: 4
summary: "Rules for the pre-mission Command Auction, Squad Leader executive authority, Logistical Refresh dice resupply, Dynamic Focus Swaps, and Retreat protocols."
---

# Operational Command (The Squad Leader)

To prevent "alpha gaming" and create high-stakes table politics, **Away Team** codifies field leadership into an explicit, auctioned role: the **Squad Leader**.

---

## 1. The Command Auction

During **Step 8 of HQ Downtime (Loadout Step)**, once the 4-operative strike team is assembled, players bid for the right to assign the **Squad Leader Token** to their deployed operative.

### Bidding & Table Politics
* **Minimum Entry Bid:** `1 Credit [CR]` paid from a Faction Vault directly to the HQ supply bank (unless modified by a character power such as *Corporate Executive*).
* **Side-Deals & Bribes:** Factions are explicitly encouraged to negotiate binding side-deals to avoid costly bidding wars (e.g., *"Let me take Squad Leader for 1 Credit, and I will guarantee you the first Momentum die refund in Stage 1"*).

### Tie-Breaker Hierarchy
If two or more Factions match the highest `[CR]` bid and refuse to raise or step down, resolve the tie using this strict hierarchy:
1. **Highest Credits Bid (`[CR]`):** Highest payment to the HQ bank wins.
2. **Highest Faction `[PIP]`:** The Faction currently holding more Political Influence Power wins.
3. **Highest Operative `[LOY]`:** The Faction whose deployed candidate has higher personal Loyalty wins.
4. **Die Roll-Off:** Roll a d6 until a single clear winner emerges.

---

## 2. Executive Operational Authority

During the mission, the player controlling the Squad Leader holds **final decision-making authority** over all non-rolling squad choices:
* Declaring **Dynamic Focus Swaps** (*Force Breach* or *Tactical Bypass*) during Step 1 (Briefing).
* Selecting branching paths or resolving narrative dilemmas on Mission Briefs.
* Distributing **Operational Momentum (`[MOM]`)** die refunds among eligible rollers at the end of a cleared stage.
* Deciding whether the squad concedes a room before Phase 2 Support rolls.
* Triggering **Logistical Resupply** or declaring a **Tactical / Forced Retreat**.

---

## 3. Command Ability: Logistical Resupply

The Squad Leader maintains a direct uplink to HQ orbital supply drops. During any **Transition Step** between stages (never mid-stage during a rolling phase), the Squad Leader may spend pooled **`[EF]`** directly from their Faction Vault to inject spent dice back into the entire squad's static pools:

| Command Action | Vault Cost | Squad-Wide Effect | Mathematical Value |
| :--- | :--- | :--- | :--- |
| **Logistical Refresh (Tier 1)** | **`2 [EF]`** (`2.66 ES`) | Restore **+1 spent static die** to **every** deployed operative (`4 dice` total). | `2.00–2.68 ES` expected return |
| **Logistical Refresh (Tier 2)** | **`3 [EF]`** (`4.00 ES`) | Restore **+2 spent static dice** to **every** deployed operative (`8 dice` total). | `4.00–5.33 ES` expected return |

---

## 4. Dynamic Focus Swaps (Stage Overrides)

During **Step 1 (Briefing)** of a stage, if the Mission Brief permits a Dynamic Focus Swap, the Squad Leader may alter how the squad tackles the room:

* 💥 **Force Breach (`[Non-Combat]` $\rightarrow$ `[Combat]`):** Turn a technical, stealth, or social stage into a brute-force firefight. The stage's active Focus becomes `[Combat]`, but the Target Difficulty increases by **$+1$ or $+2$ Successes** (as printed on the Mission Brief) due to triggered security alarms.
* 🌿 **Tactical Bypass (`[Combat]` $\rightarrow$ `[Non-Combat]`):** Detour around an armed patrol by slicing security gates (`[Operations]`), slipping through vents (`[Infiltrate]`), or scaling hazardous terrain (`[Survival]`). Shifts the active Focus to the listed category at the printed Target Difficulty (some bypasses require spending `1 [EF]` or `1 static die` per operative as specified on the brief).

---

## 5. Protocols of Retreat

When a mission turns into a lethal meat-grinder, the Squad Leader can abort the operation to save veteran operatives from permanent death. A retreat marks the mission as **Failed**, triggering campaign-level failure rules, but extracts surviving operatives alive.

### 5.1 Tactical Retreat (The Controlled Abort)
The Squad Leader may voluntarily call a Tactical Retreat during any **Transition Step** between stages, provided **both** conditions are met:
1. The squad has successfully cleared **at least Stage 1** of the mission.
2. **AND** either at least one deployed operative is currently at **exactly `1 HP`**, **OR** more than **half (`50%`)** of the squad's collective starting static dice are currently in the Spent Pool.

### 5.2 Forced Retreat (Emergency Extraction)
If the squad fails to clear a stage and suffers its **Stage Failure Penalty**, the Squad Leader may immediately call a **Forced Retreat**, aborting all remaining stages on the track and extracting the surviving squad to HQ.

---

## 6. Command Accountability: Risk & Reward Stakes

Taking the Squad Leader contract carries high institutional stakes at the end of the drop:

| Mission Outcome | Faction Political Impact | Squad Leader Operative Impact |
| :--- | :--- | :--- |
| **Mission Cleared (Success)** | **`+1 [PIP]`** (`2 VPs`) to Squad Leader's Faction Vault | **`+1 Bonus [LOY]`** (`+2 [LOY]` total including survival) |
| **Mission Failed / Retreated** | **`-1 [PIP]`** (`-2 VPs`) deducted from Squad Leader's Vault | **`0 Bonus [LOY]`** (`+1 [LOY]` if returning alive) |
