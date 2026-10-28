---
id: "core-squad-leader-command"
title: "Chapter 3: Phase 1 (Mission Select) & Phase 2 (Roster & Command Auction)"
component_type: "core_rule"
category: "core"
order: 3
summary: "Detailed procedures for Phase 1 (Mission Selection & Intelligence Briefing) and Phase 2 (Roster Staging, 6-Slot Loadouts, and the Command Auction)."
---

# Chapter 3: Phase 1 (Mission Select) & Phase 2 (Roster & Command)

---

## 1. Phase 1: Mission Selection & Intelligence Briefing

Before deploying operatives into the field, the coalition reviews available intelligence and formalizes operational contracts:

### 1.1 Selecting the Active Mission
* Consult the active **Campaign Dossier** (*Operation: Iron Dawn* or *Operation: Apex Extraction*).
* In sequential campaign play, the squad selects the next unlocked mission along the operational track. On branching campaign nodes, players negotiate and vote on which mission sector to assault.

### 1.2 The Intelligence Briefing
Examine the active **Mission Brief Card**:
1. **Sector Tag:** Identifies the operational theater (e.g., `[Urban]`, `[Space]`, `[Facility]`, `[Derelict]`), which determines which armory items and stage modifiers receive environmental bonuses or penalties.
2. **Stage Track Length:** Missions feature **3 to 5 Stage Cards** that must be cleared sequentially.
3. **Target Difficulty Preview:** Displays the baseline Target Difficulty $D$ (required successes) for each stage along the track.
4. **Base Clearance Bounty:** Lists the institutional payout awarded upon mission completion (e.g., *Iron Dawn Mission 1*: `[6 CR], [1 PIP]`).
5. **Permitted Dynamic Swaps:** Notes whether stages allow *Force Breach* (to `[Combat]`) or *Tactical Bypass* (to non-combat focuses).

---

## 2. Phase 2: Roster Assembly & Tactical Loadouts

Once the mission brief is accepted, players assemble the strike team and equip their operatives:

### 2.1 The 4-Operative Deployment Mandate
* The Away Team **must always field exactly 4 specialist operatives**.
* In a 4-player game, each Director deploys 1 operative from their personal bench.
* In a 3-player game, Slots 1–3 are assigned to each player, and **Slot 4 (The Vanguard Slot)** is auctioned off to the highest bidder, allowing one player to double-deploy.
* **Mandatory Deployment Directive:** A Faction with an eligible, living operative on their bench cannot voluntarily sit out a mission unless they negotiate a buyout or win the Stand-Down Auction during HQ Downtime.

### 2.2 Equipping the 6-Slot Anatomical Loadout
Each deployed operative features a strict **6-Slot Anatomical Loadout Matrix**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       6-SLOT ANATOMICAL LOADOUT                             │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│  [HAND L] (1-Handed) │  [HEAD] (Sensors/HUD)│  [PACK] (Consumables/Gear)    │
│  Pistol, Multi-Tool  │  Targeting Visor     │  Medkits, Siphon Cells        │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│  [HAND R] (1-Handed) │  [BODY] (Armor/Vest) │  [COMPLEX] (Heavy Rig/Tech)   │
│  Shield, Slicer Deck │  Ballistic Carapace  │  Turret Deployer, Drone Rig   │
└──────────────────────┴──────────────────────┴───────────────────────────────┘
```

* **2-Handed Weapons:** Equip into *both* `[Hand L]` and `[Hand R]` simultaneously.
* **Complex Items:** Must be powered by spending `[1 EF]` or equipped by an operative whose Focus matches the item's requirement.

---

## 3. The Command Auction (Electing the Squad Leader)

Field command is not assigned by arbitrary turn order; it is **bought with corporate capital**:

### 3.1 Bidding Procedure
1. All players review the mission brief and their operative loadouts.
2. Starting with the player who held the Squad Leader token last mission (or highest initial `[PIP]` on Mission 1), each player declares a bid in **Credits (`[CR]`)** from their Faction Vault, or passes.
3. Bidding proceeds clockwise around the table in escalating single-round or open-auction fashion with a **Minimum Entry Bid of `[1 CR]`**.
4. The highest bidder pays their bid in Credits to the central Agency bank and receives the **Squad Leader Token**.

### 3.2 Canonical Tie-Breakers & Zero-Bid Roll-Off (`BL-RULES-04`)
If two or more players bid the same amount, or if all players bid `[0 CR]` or decline to bid:
1. **Tier 1 Tie-Breaker:** Highest total **Political Influence (`[PIP]`)** in Faction Vault.
2. **Tier 2 Tie-Breaker:** Highest current **Loyalty (`[LOY]`)** on the deployed candidate operative.
3. **Zero-Bid High-Stakes Roll-Off (`BL-RULES-04`):** If all Factions bid `[0 CR]` or decline to bid, an **immediate high-stakes d6 roll-off** is conducted. The player rolling highest becomes the Squad Leader for `[0 CR]` cost!

---

## 4. Squad Leader Executive Levers & Command Authority

Winning the Command Auction grants massive tactical authority during Phase 3 (The Tactical Mission):

1. **Step 1 Dynamic Focus Swaps (`BL-RULES-07`):**
   * 💥 **Force Breach (`[Non-Combat]` $ightarrow$ `[Combat]`):** Turn a stealth or technical stage into a kinetic firefight. Increases Target Difficulty by `+1` or `+2`, but matches your combat specialists.
   * 🌿 **Tactical Bypass (`[Combat]` $ightarrow$ `[Non-Combat]`):** Siphon security gates or slip through vents to change the stage focus to `[Operations]`, `[Infiltrate]`, or `[Survival]`.
### Dynamic Split-Effect Modifier Interaction (BL-RULES-07)
When a Stage Modifier with a **Split-Effect** (e.g., *Security Hardening*, *Atmospheric Hazard*, or *Hostile Counter-Measures*) is active, its effects check the room's **currently active Focus**:
* If the Squad Leader executes a *Tactical Bypass* swapping from [Combat] to [Infiltrate], the modifier **immediately shifts from its [Combat] clause to its [Non-Combat] clause**.
* Conversely, executing a *Force Breach* switches any active Split Modifier into its kinetic [Combat] profile.

2. **Step 5 Momentum Distribution:**
   * When the squad clears a stage by $ge D + 2$, the Squad Leader unilaterally decides which participating operatives receive the restored static dice.
3. **Transition Step Logistical Refresh:**
   * The Squad Leader may burn `[2 EF]` (restore +1 die squad-wide) or `[3 EF]` (restore +2 dice squad-wide) from their private vault.
4. **Protocols of Retreat:**
   * **Tactical Retreat:** Controlled abort between stages if after Stage 1 and either an agent is at `1 HP` or $>50%$ of squad static dice are spent.
   * **Forced Retreat:** Emergency evacuation after a failed stage.

### Command Limits & Operative Sovereignty
While the Squad Leader holds unilateral authority over Focus Swaps, Momentum distribution, and Mission Retreats, **the Squad Leader cannot order or compel other players to commit dice from their operatives**.
* Each player independently decides how many dice their character commits in Step 2 (Specialists) and Step 3 (Support).
* In 3-Player games, the Squad Leader commands the fourth unassigned operative in the **Vanguard Slot**, deciding their dice commitments and target allocation.

---

## 5. Command Accountability: Risk vs. Reward

| Mission Outcome | Faction Political Impact | Squad Leader Operative Impact |
| :--- | :--- | :--- |
| **Mission Cleared (Success)** | **`[+1 PIP]`** (`[2 VP]`) to Squad Leader Vault | **`[+1 LOY]`** (`[+2 LOY]` total including survival) |
| **Mission Failed / Retreated** | **`[-1 PIP]`** (`[-2 VP]`) deducted from Vault | **`0 LOY`** (`[+1 LOY]` if returning alive) |

---

## 6. Rulebook Callouts, Examples of Play & Diagram Blueprints

> [!IMPORTANT]
> **Dynamic Modifier Interaction on Focus Swaps (`BL-RULES-07`):** Dynamic Focus Swaps declared by the Squad Leader alter the stage's active Focus immediately. Any active Stage Modifier containing a Split-Effect dynamically checks the *new* Focus—allowing a clever Squad Leader to use *Tactical Bypass* to sidestep brutal Combat-only penalties.

> [!WARNING]
> **The Accountability Trap:** Taking the Squad Leader contract grants huge power, but if the mission ends in failure or retreat, your Faction suffers **`[-1 PIP]` (`[-2 VP]`)** and your operative forfeits the bonus Loyalty star!

> [!EXAMPLE]
> **Example of Play — The Command Auction & Binding Side-Deals:**
> 1. In Phase 2, 4 players assemble the strike team. **Aegis** wants Squad Leader to guarantee their Commander gets the first Momentum die refund.
> 2. Aegis bids `[1 CR]`. **Vanderbilt** threatens to raise to `[2 CR]`.
> 3. Aegis offers a **Binding Promise**: *"Don't raise the bid; let me win Squad Leader for `[1 CR]`, and I will pay you `[1 CR]` directly from my vault right now."*
> 4. Vanderbilt accepts! Aegis pays `[1 CR]` to Vanderbilt and `[1 CR]` to the bank.

> [!DIAGRAM]
> **Figure 3.1 — Squad Leader Authority & Command Decision Tree**
> * **Visual Specification:** Command console schematic illustrating the Squad Leader's 4 levers: (1) Step 1 Dynamic Focus Swap, (2) Step 5 Momentum Die Distribution, (3) Transition Step Logistical Refresh, and (4) Tactical vs. Forced Retreat gates.
> * **Aspect Ratio:** `16:9` Rulebook Diagram • **Asset Path:** `/assets/rulebook/fig_4_1_squad_leader_console.webp`
