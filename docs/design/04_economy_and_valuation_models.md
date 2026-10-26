---
id: "design-04-economy-models"
title: "Economy, Friction Taxes & Valuation Models"
document_type: "design_reference"
category: "design"
order: 4
summary: "Economic modelling of Credits, Effort, and PIP, market sinks, the Vulture Tax friction formula, and inflation control across multi-mission campaigns."
---

# Economy, Friction Taxes & Valuation Models

> [!NOTE]
> **Internal Design Documentation:** This document details the economic architecture of **Away Team**, including the monetary sinks, friction taxes, and exchange rates governing Faction Vaults.

---

## 1. The 3-Currency Ecosystem & Velocity of Capital

A common failure mode in campaign games is "hyperinflation": by mission 4, players have accumulated so much gold or credits that decisions become trivial.

**Away Team** solves this through three distinct currencies with non-overlapping velocity and purpose:

```text
┌──────────────────────┬──────────────────────┬──────────────────────┐
│     CREDITS [CR]     │     EFFORT [EF]      │      PIP [PIP]       │
├──────────────────────┼──────────────────────┼──────────────────────┤
│  • Liquid Currency   │  • Operational Fuel  │  • Sovereign Power   │
│  • Fully Tradeable   │  • Vault-Bound       │  • Vault-Bound       │
│  • Fast Velocity     │  • Mid Velocity      │  • Low Velocity      │
│  • Primary Sinks:    │  • Primary Sinks:    │  • Primary Sinks:    │
│    - Quartermaster   │    - Class Abilities │    - HQ Sponsorships │
│    - Auctions        │    - Logistical Drops│    - Vulture Tax     │
│    - Recruitment     │    - Stabilization   │    - Tie-Breakers    │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

---

## 2. Friction Mechanics: The Vulture Tax

When an operative is Killed in Action (KIA), their equipped gear is dropped on the active stage. If surviving squad members were permitted to loot this equipment for free, high-casualty runs would inadvertently enrich rival players, creating perverse incentives to deliberately let teammates die.

### The Friction Equation:
To counteract this, looting rival equipment requires an **Administrative Vulture Tax**:

$$\text{Vulture Tax} = \left\lceil \frac{\text{Items Claimed}}{2} \right\rceil \times \mathbf{[1\text{ PIP}]}$$

Because `[1 PIP]` is worth `6.00 ES` (and `[2 VP]` at endgame), looting two items costs the equivalent of `1 VP`. Players will only loot fallen teammates when the gear is genuinely game-changing, preventing reckless cannibalization.

---

## 3. Payout Architecture: Stipend vs. Shared Pool

To ensure fair participation across different player counts while keeping negotiation lively, mission rewards are split into two streams:

1. **Participation Stipend:** Every deployed character receives a baseline stipend of `[2 CR]`, and every participating Faction receives `[1 PIP]`. This guarantees that even if a mission goes terribly, deploying an operative does not leave a player completely bankrupt.
2. **Shared Mission Clearance Bounty:** Clearing the mission deposits a collective pool of `[CR]` and `[PIP]` into the middle of the table. By default, it is split evenly among players, with any odd remainder allocated by the Squad Leader. However, players may alter this distribution through pre-mission contract negotiations.


## 4. 3-Player Vanguard Slot Valuation & Loyalty Velocity (`BL-BAL-03` — Designer Confirmed)

* **Intentional Design Confirmation:** In a 3-player configuration, the winner of the **Vanguard Auction** controls 2 of the 4 deployed operatives (Slot 4 Vanguard). If both survive, that Faction reaps `[+2 LOY]` (`[4 VP]` endgame value) in a single mission.
* **Economic Balance:** This accelerated Loyalty velocity is an intentional incentive. Bidding `[2–3 CR]` for the Vanguard Slot is mathematically optimal and drives aggressive auction competition, compensating for the increased risk of dice depletion across two operatives simultaneously.