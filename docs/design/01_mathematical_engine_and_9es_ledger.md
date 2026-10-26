---
id: "design-01-math-engine"
title: "Mathematical Engine & 9.0 ES Balance Ledger"
document_type: "design_reference"
category: "design"
order: 1
summary: "Internal developer documentation on the atomic Expected Success (ES) unit of power, dice probability curves, character balance equations, and the 9.0 ES budget ledger."
---

# Mathematical Engine & 9.0 ES Balance Ledger

> [!NOTE]
> **Internal Design Documentation:** This document contains the foundational mathematics, statistical models, and balance formulas used by game designers to balance **Away Team**. It is maintained as an internal development reference and design audit tool, distinct from the player-facing rulebook.

---

## 1. The Atomic Currency: Expected Success (`ES`)

To ensure that 8 asymmetrical Factions, 24 specialist operatives, and 89 armory items interact predictably without hidden power creep, every resource in the game is converted into a single common denominator: the **Expected Success (`ES`)**.

An Expected Success represents the statistical yield of 1 guaranteed, unmitigated success toward clearing a Stage Target Difficulty ($D$).

### 1.1 The d6 Probability Anchor
Because operatives roll standard six-sided dice ($d6$) without replenishing their static pools between stages, each die committed has a mathematically precise yield based on the operative's Focus affinity:

* **Primary Focus Roll (`3+`):** Succeeds on `3, 4, 5, 6` $\rightarrow E = \frac{4}{6} \approx \mathbf{0.67\text{ ES}}$ per die.
* **Secondary Focus Roll (`4+`):** Succeeds on `4, 5, 6` $\rightarrow E = \frac{3}{6} = \mathbf{0.50\text{ ES}}$ per die.
* **Out-of-Focus Roll (`5+`):** Succeeds on `5, 6` $\rightarrow E = \frac{2}{6} \approx \mathbf{0.33\text{ ES}}$ per die.
* **Standardized Backfire Risk (`1`):** Every die rolled faces a flat $\frac{1}{6} \approx \mathbf{16.7\%}$ probability of rolling a natural `1` (inflicting 1 HP damage).

---

## 2. The Comprehensive `ES` Conversion Ledger

Every component, token, and currency is anchored to the ES ledger:

| Component / Currency | Baseline `ES` Value | Design & Economic Justification |
| :--- | :---: | :--- |
| **`1 Guaranteed Success`** | **`1.00 ES`** | Atomic benchmark required to clear Stage Target Difficulties ($D$). |
| **`1 Static Die` (Average)** | **`0.50 ES`** | Weighted average across the 50/35/15 Focus Pyramid distribution. |
| **`1 Hit Point (HP)`** | **`1.50 ES`** | Absorbs $\sim 6$ die rolls of Backfire (`16.7%`) risk, or 3 high-hazard checks. |
| **`[1 EF]` (Effort)** | **`1.33 ES`** | Vault fuel. [1 EF] activates *Lock and Load* for $+2$ Specialist dice ($2 \times 0.67 = 1.33\text{ ES}$). |
| **`[1 CR]` (Credit)** | **`0.50 ES`** | Liquid baseline currency. Tier 1 Handhelds cost [3 CR] (`1.50 ES`); Tier 2 Wearables cost [7 CR] (`3.50 ES`). |
| **`[1 PIP]` (Political Influence)** | **`6.00 ES`** | High-scarcity executive leverage. Unlocks major HQ modules, pays Vulture Tax, and scores [2 VP] at endgame. |
| **`[1 LOY]` (Loyalty)** | **`0.00 ES` (Field)** | Permanent character progression & VP metric. Does not inflate tactical combat budgets during deployment. |

---

## 3. The 9.0 ES Character Creation Budget

Every Specialist Operative in the 24-agent roster is engineered against a strict **`9.0 ES` Target Budget**:

$$\text{Total Character Budget (9.0 ES)} = (\text{HP} \times 1.5\text{ ES}) + (\text{Static Dice} \times 0.5\text{ ES}) + \text{Unique Power (0.5–2.0 ES)} + \text{Class Offset}$$

### 3.1 Class Offset Deductions
All 6 Class Abilities cost a uniform `[1 EF]` (`1.33 ES`). However, because their tactical yields vary slightly in practical play, two classes incorporate a structural budget deduction:

| Class | Class Ability ([1 EF]) | Tactical Yield | Stat Budget Offset | Net Stat + Power Pool |
| :--- | :--- | :---: | :---: | :---: |
| **Soldier** | *Lock and Load* (+2 temp dice) | `1.33 ES` | `0.0 ES` | **`9.0 ES`** |
| **Recon** | *Intel Reconnaissance* (Stage/Mod scout) | `1.50 ES` | `0.0 ES` | **`9.0 ES`** |
| **Diplomat** | *Strategic Alignment* (Squad `4+` focus) | `1.66 ES` | `0.0 ES` | **`9.0 ES`** |
| **Technician** | *Adaptive Calibration* (Late Specialist roll) | `1.50 ES` | `0.0 ES` | **`9.0 ES`** |
| **Scientist** | *Dual-Vector Mapping* (Concurrent room focus) | `2.00 ES` | **`-0.5 ES`** | **`8.5 ES`** |
| **Survivalist** | *Emergency Field Medicine* (Heal 2 stage HP) | `3.00 ES` | **`-1.0 ES`** | **`8.0 ES`** |

* **Scientist Offset (`-0.5 ES`):** By transforming an entire stage into a dual-focus room, Scientists allow teammates to roll at `3+` rather than `5+`, producing massive squad-wide efficiency spikes. Their personal stat line is budgeted at `8.5 ES`.
* **Survivalist Offset (`-1.0 ES`):** Restoring up to `2 HP` mid-mission recovers `3.00 ES` of vital squad buffer. To compensate, Survivalists operate on an `8.0 ES` stat line.

---

## 4. Stage Attrition & Squad Pool Mechanics

* **Squad Dice Pool:** A standard 4-operative strike team brings **22 to 30 static dice** into a mission.
* **Stage Targets Across 3–5 Stages:** Total demand ranges from **12 to 18 Successes**.
* **The Attrition Curve:** Without momentum refunds or logistical resupply, 26 static dice at an average yield of `0.50 ES` produce `13.0 ES` of output—barely enough to finish a 3-stage mission and causing exhaustion on Stage 4.
* **Design Levers:**
  1. *Primary Focus Matching (`3+`):* Yields $\sim 0.67\text{ ES}$ per die, stretching 26 dice to `17.4 ES`.
  2. *Operational Momentum (`[MOM]`):* Refunds static dice when rolling high margins ($\ge D + 2$), providing positive feedback for optimal specialist deployment.
  3. *Squad Leader Logistical Refresh:* Injects 4 or 8 dice mid-mission at the cost of Faction Effort (`[2 EF]` or `[3 EF]`).


### 4.1 Operational Momentum as a Variance Cushion (`BL-BAL-01` — Designer Confirmed)
* **Intentional Design Confirmation:** The requirement of clearing a stage by $\ge D + 2$ to generate `[1 MOM]` is intentionally designed as a **variance cushion / "hot-roll rebate"**, rather than an incentive to over-commit dice.
* **Mathematical Rationale:** Because committing extra dice purely to chase Momentum is mathematically net-negative ($2.00\text{ ES}$ in extra dice to recoup $0.67\text{ ES}$ in a refunded die), players should never waste finite dice farming Momentum. Rather, Momentum provides positive relief when a normal roll runs unusually hot.

### 4.2 2-HP Operatives & Backfire Vulnerability (`BL-BAL-02` — Designer Confirmed)
* **Intentional Design Confirmation:** Operatives with `2 HP` and `8 Static Dice` (*Ghost Point*, *Virologist*, *Spymaster*) possess an intentional `39.5%` mission attrition mortality risk to Backfires (`1s`).
* **Design Purpose:** This extreme fragility makes defensive `[Body]` armor, tactical positioning, and emergency `[1 EF]` field stabilization essential emergent synergies for fragile specialist builds.