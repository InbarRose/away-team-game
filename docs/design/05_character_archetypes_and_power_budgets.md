---
id: "design-05-character-archetypes"
title: "Operative Design Envelopes & Power Budgets"
document_type: "design_reference"
category: "design"
order: 5
summary: "Anatomy of the 24-agent roster, stat envelopes (HP vs Static Dice), active and passive power budgeting, and archetype classifications."
---

# Operative Design Envelopes & Power Budgets

> [!NOTE]
> **Internal Design Documentation:** This document details the mathematical design envelopes used to author each of the 24 Specialist Operatives in **Away Team**.

---

## 1. Stat Silhouette Envelopes

Every operative combines **Max Hit Points (HP)**, **Starting Static Dice Pool**, a **Unique Character Power**, and their **Class Offset** to reach exactly **`9.0 ES`**:

$$\text{Budget} = (\text{HP} \times 1.5) + (\text{Dice} \times 0.5) + \text{Power Value} + \text{Class Offset} = \mathbf{9.0\text{ ES}}$$

### 1.1 The Three Classical Silhouettes

1. **The Juggernaut / Bruiser (High HP, Low Dice):**
   * *Profile:* `4–5 HP`, `4–5 Dice`.
   * *Role:* Frontline damage sponge. Built to absorb Backfire damage (`1`s) and hazard blowback without falling into the 0 HP stabilization window.
   * *Example:* `agent-04` The Juggernaut (`5 HP` = `7.5 ES` + `3 Dice` = `1.5 ES` + `0.0 ES` passive = `9.0 ES`).

2. **The Commander / Operator (Balanced Mid-Range):**
   * *Profile:* `3 HP`, `7–8 Dice`.
   * *Role:* The tactical engine. Possesses enough static dice to contribute meaningfully to multiple stages while maintaining a safe HP cushion.
   * *Example:* `agent-01` The Commander (`3 HP` = `4.5 ES` + `7 Dice` = `3.5 ES` + `1.0 ES` active power = `9.0 ES`).

3. **The Glass Cannon / Spymaster (Low HP, High Dice / High Power):**
   * *Profile:* `2 HP`, `8–10 Dice` OR `2 HP`, `6 Dice`, `2.0 ES Power`.
   * *Role:* High-risk, high-reward specialist. Capable of clearing difficult rooms single-handedly, but a single unlucky roll with multiple `1`s can trigger instant incapacitation.
   * *Example:* `agent-19` The Spymaster (`2 HP` = `3.0 ES` + `8 Dice` = `4.0 ES` + `2.0 ES` active power = `9.0 ES`).

---

## 2. Power Tier Budgeting

Unique character abilities are assigned an ES weight based on their expected yield across an average 4-stage mission:

* **Tier 1 Passive / Minor Active (`0.5 ES`):** Conditional bonuses, minor dice rerolls, or situational damage resistance (e.g., *Ignore the first Backfire point on Combat stages*).
* **Tier 2 Moderate Active (`1.0 ES`):** Consistent utility that shifts odds once per mission or modifies team resource flow (e.g., *Restore 1 spent die upon clearing an Intel stage*).
* **Tier 3 Major Tactical Shift (`1.5–2.0 ES`):** Powerful abilities that alter game rules, grant free item activations, or bypass stage penalties entirely.

This explicit budgeting guarantees that operatives feel radically asymmetrical in play without creating tier lists where certain characters are statistically strictly better than others.
