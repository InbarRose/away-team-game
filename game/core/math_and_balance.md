---
id: "core-math-and-balance"
title: "Mathematical Engine & 9.0 ES Balance Ledger"
component_type: "core_rule"
category: "core"
order: 8
summary: "The Expected Success (ES) atomic unit of power, currency conversion rates, stage difficulty scaling formulas, and the 9.0 ES Character Creation Budget."
---

# Mathematical Engine & 9.0 ES Balance Ledger

To ensure that asymmetrical Faction powers, 24 distinct specialist operatives, and 89 armory items remain tightly balanced, every mechanic in **Away Team** is anchored to a single atomic unit: the **Expected Success (`ES`)**.

---

## 1. The d6 Probability Anchor

Because static dice pools do not refresh between stages, every die rolled represents a finite operational expenditure:

* **Primary Focus Roll (`3+`):** Succeeds on `3, 4, 5, 6` $\rightarrow E = \frac{4}{6} \approx \mathbf{0.67\text{ ES}}$ per die.
* **Secondary Focus Roll (`4+`):** Succeeds on `4, 5, 6` $\rightarrow E = \frac{3}{6} = \mathbf{0.50\text{ ES}}$ per die.
* **Out-of-Focus Roll (`5+`):** Succeeds on `5, 6` $\rightarrow E = \frac{2}{6} \approx \mathbf{0.33\text{ ES}}$ per die.
* **Standardized Backfire Risk (`1`):** Every die rolled faces a flat $\frac{1}{6} \approx \mathbf{16.7\%}$ probability of rolling a natural `1` (1 HP damage).

---

## 2. The Atomic Conversion Chart (`ES` Ledger)

| Component / Currency | Baseline `ES` Value | Mathematical & Economic Justification |
| :--- | :---: | :--- |
| **`1 Guaranteed Success`** | **`1.00 ES`** | The fundamental unit required to clear Stage Target Difficulties. |
| **`1 Static Die` (Average)** | **`0.50 ES`** | Weighted average across the 50/35/15 Focus Pyramid (`3+`, `4+`, `5+`). |
| **`1 Hit Point (HP)`** | **`1.50 ES`** | Absorbs $\sim 6$ die rolls of Backfire (`16.7%`) risk, or 3 high-hazard checks. |
| **`1 Effort Token [EF]`** | **`1.33 ES`** | Vault fuel. `1 [EF]` activates *Lock and Load* for $+2$ Specialist dice ($2 \times 0.67 = 1.33\text{ ES}$). |
| **`1 Credit [CR]`** | **`0.50 ES`** | Baseline currency. Tier 1 Handhelds cost `3 [CR]` (`1.50 ES`); Tier 2 Wearables cost `7 [CR]` (`3.50 ES`). |
| **`1 Political Influence [PIP]`** | **`6.00 ES`** | High-scarcity executive leverage. Worth `2 [VP]` at endgame and unlocks major HQ modules. |
| **`1 Loyalty [LOY]`** | **`0.00 ES` (Field)** | Campaign progression & VP metric. Does not inflate in-mission character combat budgets. |

---

## 3. Character Creation Budget (`9.0 ES` Standard)

Every Specialist Operative card is constructed on a strict **`9.0 ES` Target Budget**:

$$\text{Total Character Budget (9.0 ES)} = (\text{HP} \times 1.5\text{ ES}) + (\text{Static Dice} \times 0.5\text{ ES}) + \text{Unique Power (0.5–2.0 ES)} + \text{Class Offset}$$

### 3.1 Class Offset Adjustments
Because all 6 Class Abilities cost `1 [EF]` (`1.33 ES`) but produce slightly different tactical yields, two classes include a small budget offset:

| Class | Class Ability (`1 [EF]`) | Tactical Yield | Stat Budget Offset | Available Stat + Power Pool |
| :--- | :--- | :---: | :---: | :---: |
| **Soldier** | *Lock and Load* (+2 temp dice) | `1.33 ES` | `0.0 ES` | **`9.0 ES`** |
| **Recon** | *Intel Reconnaissance* (Stage/Mod scout) | `1.50 ES` | `0.0 ES` | **`9.0 ES`** |
| **Diplomat** | *Strategic Alignment* (Squad `4+` focus) | `1.66 ES` | `0.0 ES` | **`9.0 ES`** |
| **Technician** | *Adaptive Calibration* (Late Specialist roll) | `1.50 ES` | `0.0 ES` | **`9.0 ES`** |
| **Scientist** | *Dual-Vector Mapping* (Concurrent room focus) | `2.00 ES` | **`-0.5 ES`** | **`8.5 ES`** |
| **Survivalist** | *Emergency Field Medicine* (Heal 2 stage HP) | `3.00 ES` | **`-1.0 ES`** | **`8.0 ES`** |

### 3.2 Operative Stat Envelopes & Archetype Templates
* **Hit Points (`HP`):** `2 HP` (`3.0 ES`) to `5 HP` (`7.5 ES`).
* **Starting Static Dice Pool:** `4 Dice` (`2.0 ES`) to `10 Dice` (`5.0 ES`).
* **Unique Character Power:**
  * **Tier 1 Minor Passive (`0.5 ES`):** Paired with heavy stat lines (e.g., `4 HP / 5 Dice = 8.5 ES` + `0.5 ES` power = `9.0 ES`, or `3 HP / 8 Dice = 8.5 ES` + `0.5 ES` power = `9.0 ES`).
  * **Tier 2 Moderate Active/Passive (`1.0 ES`):** Paired with balanced stat lines (e.g., `3 HP / 7 Dice = 8.0 ES` + `1.0 ES` power = `9.0 ES`, or `4 HP / 4 Dice = 8.0 ES` + `1.0 ES` power = `9.0 ES`).
  * **Tier 3 Major Game-Changer (`1.5–2.0 ES`):** Paired with Glass Cannon or Specialist Liability stat lines (e.g., `2 HP / 8 Dice = 7.0 ES` + `2.0 ES` power = `9.0 ES`, or `3 HP / 5 Dice = 7.0 ES` + `2.0 ES` power = `9.0 ES`).

---

## 4. Mission & Stage Attrition Math

* **Squad Dice Pool (4 Operatives):** Typically **22 to 30 static dice** across the 4 deployed operatives.
* **Stage Difficulty Curve (3–5 Stages per Mission):**
  * **Stage 1 (Entry / Perimeter):** `3–4 Successes`
  * **Stage 2 (Internal Security / Navigation):** `3–4 Successes`
  * **Stage 3 (Core Objective / Climax):** `4–5 Successes`
  * **Stage 4 (Extraction / Final Siege):** `5–6 Successes`
* **Total Mission Demand:** `12 to 18 Successes` per mission. Because 24–28 static dice rolling against a mix of `3+`, `4+`, and `5+` thresholds generate roughly `12 to 15 ES` before exhaustion, squads must leverage **Primary Focus Specialists**, **Operational Momentum (`[MOM]`)** die refunds, **Dynamic Focus Swaps**, and **Squad Leader Logistical Refreshes** to survive multi-stage operations.
