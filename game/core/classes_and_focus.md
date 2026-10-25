---
id: "core-classes-and-focus"
title: "The Skewed Focus Pyramid & 6 Core Classes"
component_type: "core_rule"
category: "core"
order: 3
summary: "The 50/35/15 Skewed Focus Pyramid, the 6 functional operative classes, their 1-Effort Class Abilities, and the 24-Operative Roster Matrix."
---

# The Skewed Focus Pyramid & 6 Core Classes

## 1. The 50 / 35 / 15 Skewed Focus Pyramid

To eliminate the design trap of "diluted rosters"—where specialized operatives sit idle with no relevant tasks—**Away Team** structures all campaign and side-mission stages around an intentionally weighted, asymmetric challenge distribution called the **Skewed Focus Pyramid**.

```text
                  ┌────────────────────────────┐
                  │   TIER 1: KINETIC FOCUS    │  ◄── ~50% of All Stage Cards
                  │         [Combat]           │
                  └─────────────┬──────────────┘
            ┌───────────────────┴───────────────────┐
            │       TIER 2: SPECIALIST FOCUS        │  ◄── ~35% of All Stage Cards
            │  [Intel] • [Infiltrate] • [Negotiate] │
            └───────────────────┬───────────────────┘
                  ┌─────────────┴──────────────┐
                  │   TIER 3: UTILITY FOCUS    │  ◄── ~15% of All Stage Cards
                  │ [Operations] • [Survival]  │
                  └────────────────────────────┘
```

1. **Tier 1: The Baseline (`[Combat]` — $\ge 50\%$):** Half of all encounters require tactical violence. Every mission (Campaign or Side-Mission) is guaranteed to contain at least one mandatory `[Combat]` bottleneck.
2. **Tier 2: Operational Objectives (`[Intel]`, `[Infiltrate]`, `[Negotiate]` — $\sim 35\%$):** These focuses represent *how* a mission's core objective is extracted, bypassed, or leveraged. Throwing Out-of-Focus operatives at Tier 2 rooms without specialist support drains squad dice rapidly.
3. **Tier 3: Friction Hazards (`[Operations]`, `[Survival]` — $\sim 15\%$):** High-pressure environmental gear checks, reactor overloads, and security lockouts designed to test squad versatility or force Dynamic Focus Swaps.

---

## 2. The 6 Core Class Abilities

The 24 unique specialist operatives are divided into **6 functional Classes** (4 operatives per class). Every operative has an integrated **Class Active Ability** that costs a flat **`1 Effort [EF]`** from their Faction Vault.

### 1. Soldier — *Lock and Load*
* **Cost:** `1 [EF]`
* **Trigger:** Activate during any Phase 1 or Phase 2 Initiative step, before dice are committed to the pool.
* **Effect:** Draw **+2 temporary dice** from the supply box and add them directly to this operative's active rolling pool for this phase only. These bonus dice do not deplete the operative's static mission pool and are returned to the box immediately after the roll resolves.
* **Class Offset:** `0.0 ES` (Full baseline stat budget).

### 2. Recon — *Intel Reconnaissance*
* **Cost:** `1 [EF]`
* **Trigger:** Activate during Step 1 (Stage Briefing), immediately after a Stage Card is revealed (or during modifier preview on preset tracks).
* **Effect:** Scout the perimeter to manipulate upcoming hazards or stage routing:
  * **On Modular / Side-Mission Tracks:** Peek at the upcoming Stage Card or top 2 Stage Modifier cards; choose to **Bypass** (replace the current card/modifier with the scouted one, purging the unchosen card) or **Hold Position** (keep current and purge the scouted hazard).
* **Class Offset:** `0.0 ES` (Standard stat budget).

### 3. Scientist — *Dual-Vector Mapping*
* **Cost:** `1 [EF]`
* **Trigger:** Activate during Step 1 (Stage Briefing), after the room's Operational Focus and Stage Modifier are revealed, before dice are committed.
* **Effect:** Deep-scan environmental vulnerabilities. Choose any one Focus category distinct from the room's current printed Focus. For the duration of this stage, **add the chosen category as a concurrent Operational Focus for the room**. Operatives may use *either* the original Focus *or* the Scientist's added Focus to determine their Initiative Phase and success threshold (`3+` Primary, `4+` Secondary).
* **Class Offset:** `-0.5 ES` (Slightly leaner base stats due to high squad-wide `2.00 ES` output yield).

### 4. Diplomat — *Strategic Alignment*
* **Cost:** `1 [EF]`
* **Trigger:** Activate during Step 1 (Stage Briefing), after the room's Operational Focus and Stage Modifier are revealed.
* **Effect:** Enforce executive compliance. Choose any one Focus category (typically the room's active Focus). For the duration of this stage, the **entire active squad** treats that category as a **Secondary Focus (`4+`)**, unless an individual operative already possesses it as a Primary Focus (`3+`).
* **Class Offset:** `0.0 ES` (Standard stat budget).

### 5. Technician — *Adaptive Calibration*
* **Cost:** `1 [EF]`
* **Trigger:** Activate immediately after the Phase 1 Initiative (Specialists) roll concludes, before moving to Phase 2 Support or resolving failure penalties.
* **Effect:** Real-time stream calibration. Allow any deployed operative with the room's **Primary Focus (`3+`)** to immediately commit and roll **additional dice from their remaining static pool** to close the success deficit before non-specialists are forced to roll.
* **Class Offset:** `0.0 ES` (Standard stat budget).

### 6. Survivalist — *Emergency Field Medicine*
* **Cost:** `1 [EF]`
* **Trigger:** Activate immediately after a rolling phase concludes, in direct response to damage being recorded.
* **Effect:** Apply battlefield triage. **Remove up to 2 Hit Points lost by a single operative** during this specific stage.
* **Constraints:** Cannot heal old wounds from prior stages (non-retroactive); affects 1 operative per activation; limited to **once per stage** per Survivalist operative.
* **Class Offset:** `-1.0 ES` (Leaner base stats to balance `3.00 ES` trauma mitigation yield).

---

## 3. The 24-Operative Roster Matrix

Across the 6 classes, Focus pairings are mathematically distributed into **11 Primary Combatants**, **5 Secondary Combatants**, and **8 Zero-Combat Specialists**:

| Class | Agent ID & Archetype | Primary Focus (`3+`) | Secondary Focus (`4+`) | Combat Role |
| :--- | :--- | :--- | :--- | :--- |
| **Soldier** | `agent-01` The Commander | `[Combat]` | `[Intel]` | Primary Combat |
| **Soldier** | `agent-02` The Pointman | `[Combat]` | `[Infiltrate]` | Primary Combat |
| **Soldier** | `agent-03` The Breacher | `[Combat]` | `[Operations]` | Primary Combat |
| **Soldier** | `agent-04` The Juggernaut | `[Combat]` | `[Survival]` | Primary Combat |
| **Recon** | `agent-05` The Guerrilla | `[Combat]` | `[Infiltrate]` | Primary Combat |
| **Recon** | `agent-06` The Saboteur | `[Combat]` | `[Operations]` | Primary Combat |
| **Recon** | `agent-07` The Ghost Point | `[Infiltrate]` | `[Combat]` | Secondary Combat |
| **Recon** | `agent-08` The Prowler | `[Infiltrate]` | `[Intel]` | Zero-Combat Specialist |
| **Survivalist** | `agent-09` The Ranger | `[Combat]` | `[Survival]` | Primary Combat |
| **Survivalist** | `agent-10` The Sentinel | `[Combat]` | `[Intel]` | Primary Combat |
| **Survivalist** | `agent-11` The Vanguard Tracker | `[Survival]` | `[Combat]` | Secondary Combat |
| **Survivalist** | `agent-12` The Outpost Mechanic | `[Survival]` | `[Operations]` | Zero-Combat Specialist |
| **Scientist** | `agent-13` The Combat Medic | `[Combat]` | `[Intel]` | Primary Combat |
| **Scientist** | `agent-14` The Field Biologist | `[Intel]` | `[Combat]` | Secondary Combat |
| **Scientist** | `agent-15` The Virologist | `[Intel]` | `[Infiltrate]` | Zero-Combat Specialist |
| **Scientist** | `agent-16` The Systems Architect | `[Intel]` | `[Operations]` | Zero-Combat Specialist |
| **Diplomat** | `agent-17` The Political Enforcer | `[Combat]` | `[Negotiate]` | Primary Combat |
| **Diplomat** | `agent-18` The Crisis Coordinator | `[Negotiate]` | `[Combat]` | Secondary Combat |
| **Diplomat** | `agent-19` The Spymaster | `[Negotiate]` | `[Intel]` | Zero-Combat Specialist |
| **Diplomat** | `agent-20` The Black-Ops Envoy | `[Negotiate]` | `[Infiltrate]` | Zero-Combat Specialist |
| **Technician** | `agent-21` The Combat Slicer | `[Combat]` | `[Operations]` | Primary Combat |
| **Technician** | `agent-22` The Hardware Mechanic | `[Operations]` | `[Combat]` | Secondary Combat |
| **Technician** | `agent-23` The Cryptologist | `[Operations]` | `[Intel]` | Zero-Combat Specialist |
| **Technician** | `agent-24` The EOD Drone Operator | `[Operations]` | `[Infiltrate]` | Zero-Combat Specialist |
