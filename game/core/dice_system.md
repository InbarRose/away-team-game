---
id: "core-dice-system"
title: "Static Pool Dice Engine & Operational Momentum"
component_type: "core_rule"
category: "core"
order: 2
summary: "Mechanics of non-refreshing static dice pools, Focus probability thresholds (3+, 4+, 5+), Backfire damage on natural 1s, and the Operational Momentum refill loop."
---

# Static Pool Dice Engine & Operational Momentum

## 1. The Static Pool Paradigm

In standard tactical board games, dice represent a recurring action economy that refreshes every turn. **Away Team** replaces this safety net with the **Static Pool Paradigm**.

When an operative deploys from the HQ bench, their **Starting Static Dice Pool** (ranging from **4 to 10 physical d6 dice** based on their character profile, gear, and injuries) is a **finite, non-refreshing resource for the entire mission duration**.

```text
[ MISSION LAUNCH ] ──► Operative enters with 7 Static Dice in Active Pool.
       │
       ├──► STAGE 1: Player commits & rolls 3 dice to secure clearance.
       │             (3 dice are moved to the Spent Pool)
       │
       └──► STAGE 2: Operative enters room with only 4 AVAILABLE DICE.
```

### Permanent Exhaustion vs. Temporary Dice
* **Static Dice:** Dice committed from an operative's sheet are moved to their **Spent Pool** after rolling. They do **not** automatically refresh between stages. They can only be restored via **Operational Momentum ([MOM])**, the Squad Leader's **Logistical Refresh**, or specific item/class/faction abilities.
* **Temporary Dice:** Bonus dice granted for a single check by Class Abilities (such as Soldier's *Lock and Load*) or Handheld/Complex equipment are rolled alongside committed static dice, then returned to the supply box immediately after the stage resolves. Temporary dice never deplete or inflate an operative's permanent static pool cap.

---

## 2. Focus Thresholds & Standardized Risk Math

When rolling dice during a stage check, each operative's success probability is determined by how their printed **Focus** ratings align with the stage's active **Operational Focus**:

| Operative Focus Alignment | Initiative Phase | Success Threshold | Expected Success / Die | Backfire Window |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Focus (Specialist)** | Phase 1 (Acts First) | **`3+`** (`3, 4, 5, 6`) | `0.67 ES` (66.7%) | **Natural `1` Only** |
| **Secondary Focus (Matched)** | Phase 2 (Support) | **`4+`** (`4, 5, 6`) | `0.50 ES` (50.0%) | **Natural `1` Only** |
| **Out of Focus (Unmatched)** | Phase 2 (Support) | **`5+`** (`5, 6`) | `0.33 ES` (33.3%) | **Natural `1` Only** |

### Why Backfire Risk is Standardized (`Natural 1`)
Every die rolled—whether thrown by a Phase 1 Specialist or an Out-of-Focus Support operative—carries the exact same baseline trauma hazard: a **1-in-6 (`16.7%`) chance of rolling a natural `1` (Backfire)**, which inflicts **1 point of immediate HP damage** to the rolling operative.

Operating Out of Focus is penalized not by arbitrary extra damage, but by **severe dice inefficiency**: an Out-of-Focus operative must burn twice as many precious static dice as a Specialist to generate the same number of successes, exposing themselves to twice as many Backfire checks in the process.

### Focus Bridging & Focus Elevation
* **Focus Bridge (Items & Perks):** Many Tier 1 and Tier 2 Handheld items, Complex rigs, and Faction Perks grant a **Focus Bridge**, allowing an Out-of-Focus (`5+`) operative to roll in the bridged category as if it were a **Secondary Focus (`4+`)**.
* **Focus Elevation:** High-tier abilities (e.g., *Neural Override Matrix*, *Neuro-Overclock Ampoule*) can elevate a Secondary Focus (`4+`) to **Primary Focus (`3+`)**, allowing the operative to act in Phase 1 Initiative as a full Specialist.

---

## 3. Operational Momentum ([MOM])

To prevent conservative dice hoarding ("penny-pinching") and reward aggressive Specialist play, clearing a stage with excess successes generates **Operational Momentum ([MOM])**.

### 3.1 Generating Momentum
When the squad clears a stage and their **Total Successes** exceed the stage's **Target Difficulty ($D$)** by **$+2$ or more**, every success starting at $D + 2$ generates **1 Momentum ([MOM])**:

$$\text{Momentum} = \text{Total Successes} - D - 1 \quad (\text{for } \text{Total Successes} \ge D + 2)$$

| Target Difficulty ($D$) | Total Successes Rolled | Margin Above Target | Momentum ([MOM]) Generated |
| :---: | :---: | :---: | :--- |
| **3** | 3 | $+0$ | **[0 MOM]** (Standard Clear) |
| **3** | 4 | $+1$ | **[0 MOM]** (Clean Clear) |
| **3** | 5 | **$+2$** | **[1 MOM]** |
| **3** | 6 | **$+3$** | **[2 MOM]** |
| **3** | 7 | **$+4$** | **[3 MOM]** |

### 3.2 Spending Momentum (Squad Leader Distribution)
Immediately during **Step 5 (Resolution)** of the completed stage, the **Squad Leader** distributes all generated [MOM] points across the squad:

* **Exchange Rate:** **[1 MOM] = Restore `1 spent static die`** from an operative's Spent Pool back to their Active Static Pool.
* **The Skin-in-the-Game Constraint:** Momentum dice can **ONLY** be restored to operatives who **actually committed and rolled at least 1 die** during the stage just completed. Operatives who committed `0` dice cannot receive Momentum refunds (unless a specific power such as *Field Scavenger* overrides this rule).
* **Cap Limit:** An operative's restored static dice can never exceed their starting mission static pool cap.


---

## 4. Rulebook Callouts, Examples of Play & Diagram Blueprints

> [!TIP]
> **Tactical Insight — Why Focus Alignment Saves Lives:** Because every die rolled has a flat `16.7%` (`1-in-6`) chance of inflicting `1 HP` Backfire damage, rolling **Out of Focus (`5+`, `0.33 ES/die`)** is doubly punishing. To generate `2 Expected Successes`, a Primary Specialist (`3+`) only needs to roll **3 dice** (`0.50` expected Backfire damage), whereas an Out-of-Focus operative (`5+`) must roll **6 dice** (`1.00` expected Backfire damage AND double the static pool depletion). Always equip a **Focus Bridge** weapon (`4+`) or use **Dynamic Focus Swaps** before rolling Out of Focus!

> [!IMPORTANT]
> **The Skin-in-the-Game Rule for `[MOM]` Refunds:** You cannot "free-ride" on your teammates' rolls to refill your own spent dice pool. An operative is **only eligible** to receive a restored static die from `[1 MOM]` if they **committed and rolled at least `1` static die** during that specific stage (unless a specific ability such as *Field Scavenger* overrides this restriction).

> [!EXAMPLE]
> **Example of Play — Static Pool Depletion & Momentum Refill:**
> * **The Ghost Point** (`2 HP`, `7 Starting Static Dice`, Primary `[Infiltrate]` `3+`) enters **Stage 1: Outer Perimeter** (`[Infiltrate]`, Target Difficulty $D = 3$).
> * She commits **4 of her 7 static dice**, leaving **3 Available Static Dice** on her card.
> * Along with her teammate **The Prowler** (who commits **3 static dice**), they roll `7 dice` total at `3+` and score **6 Successes** (`+3` above $D = 3$).
> * The stage clears with $\text{Momentum} = 6 - 3 - 1 = \mathbf{[2\text{ MOM}]}$.
> * Both The Ghost Point and The Prowler rolled at least 1 die, so both are eligible for refunds. The Squad Leader gives `[1 MOM]` to each: The Ghost Point moves `1 spent die` back to her Active Pool, entering Stage 2 with **4 Available Static Dice** (`3 Spent`).

> [!DIAGRAM]
> **Figure 2.1 — Anatomy of the Static Dice Pool & Focus Thresholds**
> * **Visual Specification:** Schematic flow diagram showing an Operative Card's **Active Static Pool (`7d6`)** splitting into **Committed Dice (`3d6`)** + **Temporary Bonus Dice (`+2d6` from Lock and Load)**. Shows the 3 threshold bands (`3+` Primary Crimson/Cyan, `4+` Secondary/Bridge Amber, `5+` Out-of-Focus Slate) and the red skull `1` Backfire face, followed by committed static dice moving to the **Spent Pool** while temporary dice return to the supply box.
> * **Aspect Ratio:** `16:9` Rulebook Diagram • **Asset Path:** `/assets/rulebook/fig_2_1_static_dice_flow.webp`
