---
id: "core-dice-system"
title: "Chapter 4: Phase 3 — The Tactical Mission Phase (In the Field)"
component_type: "core_rule"
category: "core"
order: 4
summary: "The field deployment phase: static dice pool paradigm, 50/35/15 focus pyramid, backfire damage, and the complete 5-step stage resolution micro-loop."
---

# Chapter 4: Phase 3 — The Tactical Mission Phase (In the Field)

---

## 1. The Static Pool Paradigm (Finite Operational Stamina)

Most tactical board games refresh all dice at the end of each round. **Away Team** rejects this arcade convention in favor of high-friction stamina management:

* **Static Mission Pools:** Each operative deploys with a fixed **Static Dice Pool** (typically **6 to 8 dice** depending on class budget).
* **Dice Exhaustion:** Dice committed and rolled during a stage move to that operative's **Spent Pool**. They remain exhausted until restored via **Operational Momentum ([MOM])** or a Squad Leader **Logistical Refresh**.
* **Variance Cushion (`BL-BAL-01`):** Operatives who burn through their dice early in a mission will face later climax stages empty-handed, forcing dangerous Out-of-Focus rolls from teammates!

### 1.1 Individual Dice Commitment Sovereignty & The Right to Hold Back
A foundational pillar of **Away Team**'s semi-cooperative design is **operative stamina sovereignty**:
* **Player Choice on Every Roll:** Whenever an operative is eligible to roll (in Step 2 for Primary Specialists, or in Step 3 for Support), that operative's controlling player **freely and independently decides exactly how many dice to commit and roll**, choosing any quantity from `0 dice` up to their operative's current remaining available static dice.
* **Anti-Quarterbacking Protection:** Neither teammates nor the Squad Leader can compel a player to roll dice from their character. Each player owns their operative's stamina and risk budget.
* **The Right to Hold Back (`0 Dice`):** Choosing to commit `0 dice` ("Holding Back" or "Withholding") is a fully legal tactical choice. It preserves finite dice for subsequent stages and entirely eliminates the 16.7% Backfire injury risk. However, per the **Skin-in-the-Game Constraint**, committing 0 dice forfeits any eligibility to receive Operational Momentum (`[MOM]`) die refunds in Step 5.
* **3-Player Vanguard Slot Governance:** In 3-player games, the unassigned fourth operative in the Vanguard Slot is commanded by the elected Squad Leader, who decides how many dice that Vanguard operative commits from their pool.
* **Declaration Order:** Players may negotiate and discuss commitments openly. When executing an initiative step, the Squad Leader declares their operative's committed dice count first, followed clockwise around the table. All committed dice for that step resolve simultaneously.

---

## 2. The 50 / 35 / 15 Focus Pyramid & Thresholds

Every stage encounter requires an active **Operational Focus** representing the challenge type:

```text
                 ▲
                / \
               /   \      TIER 3: FRICTION HAZARDS (~15%)
              / T3  \     [Operations] • [Survival]
             /───────\
            /         \   TIER 2: SPECIALIST OBJECTIVES (~35%)
           /    T2     \  [Infiltrate] • [Intel] • [Negotiate]
          /─────────────\
         /               \ TIER 1: KINETIC BASELINE (~50%)
        /       T1        \[Combat]
       /───────────────────\
```

When rolling against the stage's active Focus, each operative hits based on their alignment:

| Operative Alignment | Focus Relationship | Success Threshold | Backfire Risk |
| :--- | :--- | :---: | :---: |
| **Primary Focus** | The room's Focus matches operative's Primary Focus | **`3+`** (`67%` success) | `1` on d6 (`16.7%`) |
| **Secondary / Bridge** | Operative holds Secondary Focus or equipped Focus Bridge item | **`4+`** (`50%` success) | `1` on d6 (`16.7%`) |
| **Out of Focus** | Operative has no matching alignment | **`5+`** (`33%` success) | `1` on d6 (`16.7%`) |

### Standardized Backfire Risk (`Natural 1`)
Regardless of threshold, **every natural `1` rolled is an unpreventable Backfire** inflicting **`1 HP` of immediate damage** to that operative. Out-of-Focus operatives must roll twice as many dice to achieve the same successes, doubling their exposure to lethal Backfires!

---

## 3. The 5-Step Stage Resolution Micro-Loop

The Away Team advances sequentially through the mission track's 3 to 5 Stage Cards. Each room resolves in **5 strict steps**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE 5-STEP STAGE RESOLUTION MICRO-LOOP                   │
└─────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
 ┌───────────┐     Step 1: BRIEFING, MODIFIERS & DYNAMIC SWAPS
 │  STEP 1   │ ──► Reveal Stage Card & Modifier. Squad Leader may Force Breach
 └───────────┘     or Tactical Bypass. Step 1 Class Abilities activate.
       │
       ▼
 ┌───────────┐     Step 2: PHASE 1 INITIATIVE — THE SPECIALISTS (3+)
 │  STEP 2   │ ──► Primary Focus specialists commit & roll at 3+.
 └───────────┘     EARLY RESOLUTION: If Successes >= D, SKIP Phase 2 Support!
       │
       ▼ (If Successes < D)
 ┌───────────┐     Step 3: PHASE 2 INITIATIVE — THE SUPPORT (4+ / 5+)
 │  STEP 3   │ ──► Non-Primary operatives commit & roll at 4+ or 5+.
 └───────────┘     All natural 1s inflict 1 HP Backfire damage.
       │
       ▼
 ┌───────────┐     Step 4: POST-INITIATIVE & TRIAGE WINDOW
 │  STEP 4   │ ──► Trigger damage mitigation. If an operative is at 0 HP,
 └───────────┘     resolve Emergency Stabilization (Owning Faction first).
       │
       ▼
 ┌───────────┐     Step 5: RESOLUTION & OPERATIONAL MOMENTUM ([MOM])
 │  STEP 5   │ ──► Compare Successes to D. If >= D + 2, generate Momentum:
 └───────────┘     MOM = Successes - D - 1. Leader refunds spent dice!
```

### Step 1: Briefing, Modifiers & Dynamic Swaps
* Reveal the Stage Card and attach **1 Stage Modifier Card**.
* The **Squad Leader** may execute a **Dynamic Focus Swap** (*Force Breach* to `[Combat]` or *Tactical Bypass* to non-combat). Active Split-Effect Modifiers evaluate dynamically against the new Focus (`BL-RULES-07`).
* Factions may activate Step 1 abilities: Recon *Intel Reconnaissance*, Scientist *Dual-Vector Mapping* (which promotes matching specialists to Phase 1 Initiative [`BL-RULES-06`]), or Diplomat *Strategic Alignment*.

### Step 2: Phase 1 Initiative — The Specialists (`3+`)
Operatives whose Primary Focus matches the room act first:
1. **Specialist Dice Commitment:** Each controlling player independently selects how many dice their specialist commits (from `0 dice` to their maximum available static dice).
2. **Roll & Resolve:** Roll all committed Specialist dice simultaneously: **`3+` = +1 Success**, **`1` = 1 HP Backfire**.
3. **Early Resolution Check:** If total successes meet or exceed Target Difficulty $D$, the stage is **instantly cleared**! Skip Step 3 entirely—Support operatives preserve all dice and avoid Backfire injury! *(Technician Adaptive Calibration may extend Phase 1 to trigger Early Resolution per `BL-RULES-05`)*.

### Step 3: Phase 2 Initiative — The Support (`4+` / `5+`)
If the Specialists did not reach Target Difficulty $D$, non-specialists must step up:
1. **Support Dice Commitment:** Each controlling player with remaining non-specialist operatives independently selects how many dice to commit (from `0 dice` up to available static dice).
2. **Roll & Resolve:** Secondary Focus operatives hit on **`4+`**; Out-of-Focus operatives hit on **`5+`**. Every natural `1` inflicts **`1 HP` of Backfire damage**.

### Step 4: Post-Initiative & Triage Window
* Trigger Survivalist *Emergency Field Medicine* (`[1 EF]` heals up to 2 stage HP).
* **Emergency Stabilization at `0 HP` (`BL-RULES-03`):** If an agent drops to `0 HP`, any ally may pay `[1 EF]` or a Medkit to stabilize them at `1 HP`. Right of first refusal: Owning Faction first $ightarrow$ Squad Leader second $ightarrow$ Clockwise.
* **Dying Breath Rule (`BL-RULES-02`):** Successes rolled on a lethal throw count toward stage resolution in Step 5 even if the operative dies unstabilized.

### Step 5: Resolution & Operational Momentum (`[MOM]`)
Compare total successes against Target Difficulty $D$:
* **Stage Cleared ($	ext{Successes} ge D$):** Room is cleared!
* **Operational Momentum ($	ext{Successes} ge D + 2$):** Generate $	ext{Momentum} = 	ext{Successes} - D - 1$. The Squad Leader distributes `[1 MOM] = +1 restored die` to operatives who committed $ge 1$ die in this stage.
* **Stage Failed ($	ext{Successes} < D$):** Suffer printed Stage Failure Penalty.

---

## 4. Rulebook Callouts, Examples of Play & Diagram Blueprints

> [!IMPORTANT]
> **Skin-in-the-Game Constraint on Momentum Refunds:** Only operatives who committed and rolled at least 1 static die in this stage are legally eligible to receive Momentum die refunds. Selfish players who withhold all dice cannot receive Momentum rebates!

> [!EXAMPLE]
> **Example of Play — Early Resolution in Action:**
> 1. The squad enters **Vault Core Access** (`[Infiltrate]`, Target Difficulty $D = 4$).
> 2. **The Ghost Point** (Primary `[Infiltrate]` `3+`) commits `5 static dice` in Phase 1.
> 3. The roll produces `6, 5, 4, 3, 1` — scoring **4 Successes** and **1 Backfire** (`1 HP` damage).
> 4. Because `4 Successes` meets $D = 4$, **Early Resolution triggers immediately**! Support teammates (*The Commander*, *The Juggernaut*) skip Phase 2 completely, preserving all of their combat dice for the upcoming boss fight.

> [!DIAGRAM]
> **Figure 4.1 — The 5-Step Stage Micro-Loop & Threshold Resolution Tree**
> * **Visual Specification:** Detailed stage encounter flowchart showing Phase 1 Specialists branch (checking Early Resolution) leading to Phase 2 Support fallback, followed by Step 4 Triage priority tree and Step 5 Momentum calculation formula.
> * **Aspect Ratio:** `16:9` Rulebook Spread Diagram • **Asset Path:** `/assets/rulebook/fig_2_1_stage_micro_loop.webp`
