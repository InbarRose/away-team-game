---
id: design-07-economic-liquidity-and-velocity-curves
title: "Economic Liquidity, Currency Velocity & Anti-Inflation Sinks"
order: 7
summary: "Macroeconomic analysis of the 4-tier currency taxonomy, dual-stream payout flows across 1P-4P table configurations, and the balance of Armory and HQ facility sinks."
---

# Design Dossier 07: Economic Liquidity, Currency Velocity & Anti-Inflation Sinks

## 1. The Macroeconomic Model

*Away Team* avoids economic hyper-inflation through a strictly calibrated circular economy. Currencies are created through **Mission Debrief Payouts** (Phase 4 Step 1) and destroyed through **Armory Purchases, Base Module Sponsorships, Boardroom Perks, and Infirmary Treatments**.

The game explicitly divides economic assets into **Four Distinct Tiers** (`tokens.css`, Chapter 7 §1):
1. **Liquid Vault Assets:** Credits (`[CR]`), Effort (`[EF]`), and Political Influence Points (`[PIP]`).
2. **Transient Tactical Momentum:** Operational Momentum (`[MOM]`) and Temporary Armor Buffers.
3. **Character-Bound Progression:** Specialist Loyalty Rank (`[LOY]`) and Trauma Tokens.
4. **Macro Campaign Trackers:** Mission Failure Tracker (`[FAIL]`) and Victory Points (`[VP]`).

This dossier analyzes currency velocity, purchasing power, and liquidity sinks based on 100-cycle chaos fuzzing runs (`tests/16-chaos-fuzz-and-invariants.test.js`) and macro-balance simulations (`tests/17-macro-balance-and-economy.test.js`).

---

## 2. Dual-Stream Payout Dynamics Across Player Counts

Under the canonical **Dual-Stream Payout Model** (`BL-RULES-01`, Chapter 7 §1):
- **Stream 1 (Guaranteed Stipends):** Awarded directly to participating agents/factions ($+2\text{ CR}$ per deployed operative, $+1\text{ PIP}$ per faction).
- **Stream 2 (Clearance Bounty Pot):** A shared pool (typically $6\text{ CR}$ and $1\text{ PIP}$) divided among deployed Directors through table negotiation or canonical split.

### Credit Injection per Mission by Player Count

| Player Seating | Stream 1 Operative Stipends | Stream 2 Clearance Pot | Total Mission Credits | Mean Credits / Player / Mission |
| :---: | :---: | :---: | :---: | :---: |
| **1-Player (Solo)** | $4 \times 2 = 8\text{ CR}$ | $6\text{ CR}$ (Full Pot) | **$14\text{ CR}$** | **$14.0\text{ CR}$** |
| **2-Player** | $4 \times 2 = 8\text{ CR}$ ($4/\text{player}$) | $6\text{ CR}$ ($3/\text{player}$) | **$14\text{ CR}$** | **$7.0\text{ CR}$** |
| **3-Player** | $4 \times 2 = 8\text{ CR}$ ($4/\text{Leader}, 2/\text{Others}$) | $6\text{ CR}$ ($2/\text{player}$) | **$14\text{ CR}$** | **$4.7\text{ CR}$** (Leader: $6.0$) |
| **4-Player** | $4 \times 2 = 8\text{ CR}$ ($2/\text{player}$) | $6\text{ CR}$ ($1.5/\text{player}$) | **$14\text{ CR}$** | **$3.5\text{ CR}$** |

### Velocity Insights
1. **Zero-Sum Stability:** Total credit generation across the task force is invariant to player count ($14\text{ CR}$ per mission). This ensures that the global economy does not inflate or deflate when player counts vary.
2. **3-Player Vanguard Slot Dynamics (`BL-BAL-03`):** In 3-player games, the elected Squad Leader commands Slot 4 and collects the additional $+2\text{ CR}$ stipend. This creates an asymmetric economic incentive ($6\text{ CR}$ vs $4\text{ CR}$) that fuels intense bidding in the Phase 2 Command Auction.

---

## 3. Economic Sinks & Purchasing Friction

To prevent runaway capital accumulation, the economy provides three nested tiers of expenditures in Phase 4 HQ Downtime:

```
[ Mission Payout: +14 CR Total ]
           │
           ├──► [ Quartermaster Armory Market ]
           │      • Tier 1 Gear: 2–4 CR
           │      • Tier 2 Weapons/Rigs: 5–8 CR
           │
           ├──► [ Corporate HQ Facilities ]
           │      • Base Module: 6 CR + 1 PIP (Awards +1 PIP, +2 VP)
           │      • Landmark Module: 10 CR + 2 PIP (Awards +2 PIP, +4 VP)
           │
           ├──► [ Boardroom Perks & Doctrines ]
           │      • Tier 1–3 Perks: 2–6 CR or 1–3 PIP
           │
           └──► [ Med Bay & Cybernetic Lab ]
                  • Stabilize / Treat Injury: 2 CR or 1 EF
```

### Empirical Burn Rates (100 Chaos Campaign Cycles)
- **Armory Market Absorption:** Over $58\%$ of all earned credits are spent on Armory items within 1 round of being earned.
- **Facility Sponsorship Absorption:** By Mission 2, players pool or allocate surplus capital ($6\text{--}10\text{ CR}$) into HQ facility modules to lock in permanent VP and faction perks.
- **Net Vault Accumulation Invariant:** At the conclusion of a 3-mission campaign, the average player vault holds **$< 6.5\text{ CR}$**, satisfying the systemic requirement that currency velocity remains brisk and hoards remain modest.

---

## 4. The 1P/2P Inflation Vulnerability & Solo Balancing

In 4-player games, natural bidding competition in the Command Auction burns $1\text{--}4\text{ CR}$ per mission. In 1P (Solo) and 2P configurations, however, auction bidding pressure is naturally muted, resulting in higher net liquid cash.

### Architectural Solution: "The Attrition Director" (ADR-23)
To ensure equal economic tension across all player counts:
- In 1P/2P games, an automated rival corporate faction ("The Attrition Director") competes in the Command Auction with an expected bid of $\lceil D / 2 \rceil\text{ CR}$.
- The Attrition Director sweeps 1 random Tier 2 item from the Quartermaster Armory Market at the end of Step 6 if left unbought, preserving market turnover.
