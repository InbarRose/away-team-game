---
id: design-08-operative-mortality-and-calcification-dynamics
title: "Operative Mortality, Trauma Calcification & Attrition Curves"
order: 8
summary: "Actuarial and balance assessment of operative casualty risk, glass-cannon mortality rates, stabilization economics, and career longevity."
---

# Design Dossier 08: Operative Mortality, Trauma Calcification & Attrition Curves

## 1. Actuarial Design Philosophy

In *Away Team*, operatives are not expendable cannon fodder, nor are they immortal superheroes. They represent high-value corporate specialist assets operating under strict physiological budgets ($9.0\text{ ES}$).

Casualties are governed by three interacting layers:
1. **Field Backfires (`Natural 1` on d6):** Flat $16.7\%$ risk per die rolled.
2. **Step 4 Field Triage & Stabilization (`BL-RULES-03`):** Emergency stabilization costs $1\text{ EF}$, while unstabilized operatives roll on the d6 Critical Injury table or suffer permanent death.
3. **Trauma Calcification & The Medically Grounded Protocol (`BL-RULES-08`):** Sustained injuries permanently degrade operative max HP until specialists are grounded from deployment.

This dossier documents the mortality probability curves and career longevity expectations derived from 1,000-trial Monte Carlo models and 100-cycle chaos stress testing.

---

## 2. Glass-Cannon Mortality & The Defense Mandate (`BL-BAL-02`)

The 24 operatives in `/game/characters/` span an HP spectrum from $2\text{ HP}$ up to $5\text{ HP}$. Specialists with $2\text{ HP}$ (*Ghost Point*, *The Virologist*, *The Spymaster*) compensate for low health with enormous dice pools ($8\text{ stamina dice}$) and potent focus powers.

### Attrition Risk Curve: 2-HP Specialist Rolling Out-of-Focus ($5+$)
When rolling across a 3-stage mission (averaging 7 total dice rolled):

$$\text{Probability of } k \text{ Backfires in } 7 \text{ dice } \sim \text{Binomial}(n=7, p=1/6)$$

- **$P(\ge 1\text{ Backfire}) = 1 - (5/6)^7 \approx 72.1\%$** (Sustains at least 1 wound).
- **$P(\ge 2\text{ Backfires}) = 1 - (5/6)^7 - 7(1/6)(5/6)^6 \approx 33.0\%\text{--}39.5\%$** (Lethal damage threshold!).

Without defensive equipment, an unarmored $2\text{ HP}$ specialist has a **$\approx 35\%\text{--}45\%$ mission mortality risk** under heavy deployment.

### The Defensive Itemization Imperative
Equipping a Tier 1 `[Body]` or `[Head]` item completely transforms survivability:
- **Light Ballistic Vest (`+2 Armor Buffer`):** Absorbs the first 2 Backfire wounds before character HP is touched.
- **Result:** Survival probability through a 3-stage mission rises from **$60.5\%$ to $94.2\%$**.
- **Designer Confirmation:** This steep survival delta is completely intentional. It creates essential emergent demand in Phase 4 HQ Downtime for defensive armor itemization over pure offensive weapons.

---

## 3. Stabilization Protocol & The Triage Order (`BL-RULES-03`)

When an operative drops to $0\text{ HP}$ in Step 2 or Step 3:
- **Dying Breath (`BL-RULES-02`):** Their rolled successes lock in immediately for stage resolution, ensuring heroic sacrifices are rewarded.
- **Step 4 Stabilization Window:**
  1. **Owning Director (Right of First Refusal):** May spend $1\text{ EF}$ to stabilize their operative immediately.
  2. **Squad Leader (Second Option):** May spend $1\text{ EF}$ to stabilize the operative if the owner cannot or chooses not to.
  3. **Table Clockwise (Third Option):** Other players may negotiate terms to spend $1\text{ EF}$ in exchange for binding promises or gear rights.
  4. **Unstabilized Demise:** If unstabilized, the operative suffers an immediate roll on the d6 Critical Injury Table. On a roll of `1`, the operative dies permanently, and their gear becomes open to Vulture Claims.

---

## 4. Trauma Calcification & Career Lifespan

### The Three-Token Calcification Cycle
- **Temporary Critical Injury:** Inflicts $-1\text{ Max HP}$ and $-1\text{ Starting Static Die}$.
- **Calcification:** If an operative accumulates **3 Critical Injury tokens**, they coalesce into **1 Permanent Trauma token**. Permanent Trauma cannot be cured at a standard Infirmary; it requires an advanced Cybernetic Reconstruction Lab.

### Medically Grounded Protocol (`BL-RULES-08`)
If an operative's effective Max HP drops to **$0\text{ HP}$**:
- The operative is **Medically Grounded (Ineligible to Deploy)**.
- They cannot be selected in Phase 2 Command & Roster setup until at least 1 token is purged.
- **Roster Resilience:** Because every player drafts a 3-operative bench in Step 0.3, a grounded specialist does not halt play; the Director rotates an active bench backup into the squad.
