---
id: "design-02-focus-pyramid"
title: "The Skewed Focus Pyramid & Anti-Dilution Game Design"
document_type: "design_reference"
category: "design"
order: 2
summary: "Design rationale behind the 50/35/15 challenge distribution, anti-dilution principles, and why symmetrical skill trees break in tactical semi-cooperative games."
---

# The Skewed Focus Pyramid & Anti-Dilution Game Design

> [!NOTE]
> **Internal Design Documentation:** This document details the systemic design philosophy behind the **50 / 35 / 15 Focus Pyramid** and how **Away Team** avoids the classic "diluted specialist" trap common in asymmetric tabletop games.

---

## 1. The Dilution Problem in Asymmetric Tabletop Games

In many class-based or skill-based cooperative games, designers provide equal numerical representation across all character disciplines (e.g., 20% Combat, 20% Stealth, 20% Tech, 20% Social, 20% Survival).

When encounter decks draw evenly from this pool:
1. **The Specialist Sits Idle:** A dedicated Diplomat or Survivalist may go two or three consecutive missions without encountering their primary discipline.
2. **Forced Filler Checks:** Designers are forced to invent contrived "Diplomacy checks" in the middle of a burning reactor core to make non-combat classes feel useful.
3. **The Generalist Dominance:** Players quickly learn to abandon specialized builds in favor of flat, jack-of-all-trades characters who are never locked out of any encounter.

---

## 2. The 50 / 35 / 15 Solution

To solve this dilemma, **Away Team** intentionally skews its mission and stage generation into three distinct tiers:

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

### 2.1 Tier 1: The Combat Baseline ($\ge 50\%$)
* **Design Purpose:** Combat is the universal language of high-stakes sci-fi conflict. Every mission sequence guarantees at least one, and usually multiple, [Combat] stages.
* **Roster Distribution:** Because 50% of rooms are kinetic, **16 out of 24 operatives (67%)** possess [Combat] as either their Primary (`3+`) or Secondary (`4+`) Focus. No player can field a squad that is utterly helpless in a firefight.
* **The Zero-Combat Operative:** Exactly 8 operatives have no combat affinity whatsoever. When deployed, these operatives must rely on their superior Tier 2/3 focus or powerful active abilities (e.g., *Systems Architect*, *Spymaster*, *Virologist*), creating tense tactical escort dynamics.

### 2.2 Tier 2: The Tactical Core ($\sim 35\%$)
* **Design Purpose:** Represents *how* objectives are seized, decrypted, or negotiated.
* **Disciplines:** `[Intel]`, `[Infiltrate]`, and `[Negotiate]`.
* **Mechanical Pressure:** While Out-of-Focus operatives *can* roll at `5+`, doing so burns static dice rapidly. Tier 2 stages reward players who brought the right specialist to bear.

### 2.3 Tier 3: Environmental Friction ($\sim 15\%$)
* **Design Purpose:** Represents catastrophic failures, lockdown sequences, toxic atmospheric breaches, and structural collapse.
* **Disciplines:** `[Operations]` and `[Survival]`.
* **Dynamic Pivots:** Because these rooms appear less frequently, players often leverage **Dynamic Focus Swaps** (*Force Breach* to turn a lock into a firefight) or class powers like *Dual-Vector Mapping* to solve them.

---

## 3. Roster Matrix Alignment

The 24 operatives map precisely across this distribution:

* **11 Primary Combatants (`3+`):** Anchors for Tier 1 rooms.
* **5 Secondary Combatants (`4+`):** Versatile bridge operatives capable of supporting both kinetic and technical rooms.
* **8 Zero-Combat Specialists (`5+` in Combat):** Supreme specialists in Tier 2 and Tier 3 disciplines whose high-yield powers justify their combat vulnerability.
