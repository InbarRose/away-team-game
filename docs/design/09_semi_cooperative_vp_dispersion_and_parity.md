---
id: design-09-semi-cooperative-vp-dispersion-and-parity
title: "Semi-Cooperative Paradox, VP Dispersion & Coalition Parity"
order: 9
summary: "Game-theoretic analysis of the semi-cooperative paradox, victory point dispersion across scoring streams, kingmaking prevention, and coalition stability."
---

# Design Dossier 09: Semi-Cooperative Paradox, VP Dispersion & Coalition Parity

## 1. The Core Paradox: Collective Survival vs. Private Greed

*Away Team* is built on a fundamental structural tension known as **The Semi-Cooperative Paradox**:
- **Collective Doom:** If the Mission Failure Tracker reaches **$3\text{ [FAIL]}$**, Task Force Dissolution occurs immediately. All players lose, and the corporate coalition collapses.
- **Individual Triumph:** If the campaign succeeds, victory is strictly individual and zero-sum. The Director with the highest Victory Points (`[VP]`) wins sole control of the sector.

This tension produces a fragile coalition where players must collaborate to survive tactical hazards while subtly positioning their specialists to claim asymmetric bounties, faction loyalty, and secret corporate agendas.

---

## 2. Victory Point Dispersion & Scoring Architecture

Endgame scoring synthesizes four independent streams of achievement evaluated in Chapter 8 §2:

```
[ Final Endgame VP Score (28–36 VP Target) ]
                 │
                 ├──► [ Faction Loyalty Tracks (0–12 VP) ]
                 │      • 4 Tiers: Tier 1 (+2), Tier 2 (+4), Tier 3 (+8), Tier 4 (+12)
                 │
                 ├──► [ Secret Corporate Objectives (5–15 VP) ]
                 │      • Tier 1 Dominance (15 VP)
                 │      • Tier 2 Subversion (10 VP)
                 │      • Tier 3 Contingency (5 VP)
                 │
                 ├──► [ HQ Facility Sponsorships (0–8 VP) ]
                 │      • Base Module (+2 VP each)
                 │      • Landmark Module (+4 VP each)
                 │
                 └──► [ Open Agendas & Campaign Honors (0–6 VP) ]
                        • Public mission bounties claimed during play
```

### Empirical VP Distribution (100 Chaos Campaign Cycles)
Across 100 simulated 4-player campaigns:
- **Winning Score Range:** $28\text{--}38\text{ VP}$ (Mean: $32.4\text{ VP}$).
- **Runner-Up Margin:** $2.8\text{ VP}$ spread between 1st and 2nd place.
- **Last Place Margin:** $9.4\text{ VP}$ spread between 1st and 4th place.
- **Gini Coefficient:** $0.16$ (reflecting healthy competitive parity where no single scoring stream creates an insurmountable runaway lead).

---

## 3. Kingmaking Prevention & The Contingency Tier

A common failure mode in semi-cooperative board games is late-game **kingmaking**: a trailing player who cannot win sabotages the mission to force a collective loss.

*Away Team* addresses kingmaking through three mechanical guardrails:
1. **Tier 3 Contingency Secret Objectives ($5\text{ VP}$):** Secret Objectives feature realistic, low-threshold fallback conditions (e.g., *Ensure all operatives survive*, or *Hold $\ge 4\text{ CR}$ in Vault*). A trailing player who cannot hit their $15\text{ VP}$ Dominance condition can pivot to their $5\text{ VP}$ Contingency to capture 2nd or 3rd place honors.
2. **Failure Tracker Dissolution Risk:** The corporate penalty for Task Force Dissolution wipes all VP records. Trailing players earn $0\text{ VP}$ in a coalition wipeout, making intentional sabotage mathematically inferior to banking baseline VP.
3. **The Stand-Down Compensation:** In Phase 4 HQ Downtime Step 2, operatives who stand down from deployment receive $+1\text{ LOY}$ compensation, steadily advancing trailing players on their Faction Loyalty trees.

---

## 4. The 3-Player Vanguard Asymmetry

In 3-player games, the 4th operative is designated the **Vanguard Slot** (`Slot 4`). The elected Squad Leader commands the Vanguard Slot, absorbing its stamina depletion while earning double loyalty:
$$\text{Vanguard Slot Clear} \rightarrow +2\text{ LOY} = +4\text{ VP}$$

This $+4\text{ VP}$ reward creates an intense economic bidding war in Phase 2 Command Auctions. Trailing players aggressively bid credits to capture the Squad Leader title, self-correcting point disparities and driving dynamic coalition shifts.
