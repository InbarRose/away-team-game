# AWAY TEAM — DESIGN COMPANION AUDIT & PRODUCT BACKLOG

> **Role:** Lead Systems & UX Design Companion  
> **Scope:** Comprehensive audit of the **Away Team** 6.0 Engine ruleset, mathematical ledger (`9.0 ES`), edge-case timing windows, Wiki/Rulebook presentation, and Virtual Tabletop (VTT) simulation architecture.  
> **Golden Constraint:** *No rules or numbers have been altered without your explicit sign-off.* All rule observations below are cataloged as actionable design decisions while explanatory text, callouts, and examples have been sharpened across the rulebook.

---

## 1. EXECUTIVE DESIGN COMPANION REVIEW: WHAT WORKS BRILLIANTLY

Before diving into edge cases and backlog items, here is a candid assessment of why the **Away Team** core architecture is genuinely compelling from a tabletop systems perspective:

1. **The Static Pool Paradigm + Operational Momentum (`[MOM]`) Solves the "Co-Op Hoarding Trap":**
   * In most semi-cooperative games (*Dead of Winter*, *Nemesis*), selfish players hoard their best resources for the final turn while letting teammates absorb early attrition.
   * Your **Operational Momentum formula** ($\text{MOM} = \text{Successes} - D - 1$ at $\ge D + 2$) paired with the **Skin-in-the-Game Constraint** (*only operatives who committed $\ge 1$ die in the stage can receive `[MOM]` die refunds*) creates a brilliant prisoners' dilemma: if you don't commit dice, you can't get refunded; if the team over-commits together and crushes the stage by $+2$, the Squad Leader refunds spent dice and Aegis/momentum perks fire.
2. **Standardized Backfire (`Natural 1`) vs. Variable Success Thresholds (`3+`, `4+`, `5+`):**
   * Keeping Backfire risk at a flat `16.7%` (`1` on a d6) across all Focus alignments while scaling expected successes (`0.67 ES` $\rightarrow$ `0.50 ES` $\rightarrow$ `0.33 ES`) makes the math intuitive at the table. Players immediately feel why sending an Out-of-Focus (`5+`) operative into a hazard is dangerous: they have to roll **twice as many dice** to get the same result, doubling their exposure to `1s`.
3. **Phase 1 (Specialists) Early Resolution Check:**
   * Allowing Phase 1 (`3+`) Specialists to clear the stage immediately—skipping Phase 2 Support rolls entirely—makes bringing the right Specialist feel heroic and saves the rest of the squad's finite dice and HP.
4. **The 4-Tier Separation of Currencies (`[CR]`, `[EF]`, `[PIP]`) vs. `[MOM]`, `[LOY]`, and `[DOOM]`/`[VP]`:**
   * Separating spendable Vault assets from transient mission flow (`[MOM]`), character-bound progression (`[LOY]`), and macro trackers (`[DOOM]`, `[VP]`) eliminates cognitive overload on the Faction Dashboard.

---

## 2. RULES LOGIC & EDGE-CASE BACKLOG (FOR DESIGNER REVIEW)

While auditing all 8 Core Rulebook chapters and 200 components, I identified **8 specific timing, economic, and edge-case questions** that playtesters will inevitably encounter. No rules were changed; instead, I have documented the current baseline behavior in the rulebook callouts and logged the design choices below for your review:

| ID | Status / Priority | System / Chapter | Observation / Ambiguity | Designer Decision & Resolution |
| :--- | :---: | :--- | :--- | :--- |
| **`BL-RULES-01`** | ✅ **RESOLVED** | **Vault Economy & Mission Briefs** (`Step 1: Debrief & Payouts`) | **Mission Bounty Distribution:** Is clearance bounty paid to each participating Faction, or a shared pot? | **Adopted:** **Dual-Stream Payout Model.** Each participating operative receives a guaranteed base stipend (`[2 CR]`), each Faction receives `[1 PIP]`, and the remaining Clearance Bounty pot is divided equally among deployed players, with any odd remainder allocated at the **Squad Leader's discretion** (players may negotiate terms with Binding Promises). |
| **`BL-RULES-02`** | ✅ **RESOLVED** | **Stage Resolution & Mortality** (`Step 2/3` vs `Step 4`) | **The "Martyr's Last Stand" Timing:** If an operative drops to `0 HP` from backfire and dies unstabilized in Step 4, do their successes count? | **Adopted:** **"Dying Breath Rule."** Yes! Successes rolled in Steps 2/3 lock in immediately for Stage Resolution in Step 5 even if the operative dies in Step 4. |
| **`BL-RULES-03`** | ✅ **RESOLVED** | **Mortality & Vulture Economy** (`medbay_trauma.md` §1.2) | **Priority Order for Stabilization & Vulture Claims:** In what order do players declare stabilization and vulture loot claims? | **Adopted:** **Triage Right of First Refusal:** Owning Faction first → Squad Leader second → Clockwise. **Vulture Claims:** Squad Leader declares first, then clockwise around the table; contested claims roll off. |
| **`BL-RULES-04`** | ✅ **RESOLVED** | **Squad Leader Command** (`squad_leader_command.md` §1) | **Zero-Credit Command Auction Edge Case:** What happens if no Faction bids $\ge [1\text{ CR}]$? | **Adopted:** **Immediate d6 Roll-Off.** If all Factions bid zero or decline, an immediate high-stakes d6 roll-off determines the Squad Leader for that mission at `[0 CR]` cost. |
| **`BL-RULES-05`** | ✅ **RESOLVED** | **Classes & Focus** (`classes_and_focus.md` §2.5) | **Technician *Adaptive Calibration* Early Resolution:** If bonus rolls reach Target Difficulty $D$, does it trigger Early Resolution? | **Adopted:** **Yes.** Adaptive Calibration extends Phase 1; meeting $D$ triggers Early Resolution and spares Phase 2 Support. |
| **`BL-RULES-06`** | 🟡 **P2** | **Classes & Focus** (`classes_and_focus.md` §2.3) | **Scientist *Dual-Vector Mapping* Initiative Promotion:** When Scientist adds a second concurrent Focus (e.g., adding `[Intel]` to a `[Combat]` room), operatives with Primary `[Intel]` (`3+`) now match the room's active Focus. Do they act in **Phase 1 Initiative (Specialists)**? | **Recommendation:** **Yes**, as stated in `classes_and_focus.md`, they use the added Focus for both Initiative Phase and threshold (`3+`). Added a worked example so players see how powerful Scientist is in Phase 1. |
| **`BL-RULES-07`** | 🟡 **P2** | **Squad Leader Swaps** (`squad_leader_command.md` §4) | **Dynamic Focus Swap Timing vs. Stage Modifiers:** In `rules_overview.md` Step 1, the Stage Card and 1 Stage Modifier Card are revealed *before* the Squad Leader declares a Dynamic Focus Swap (*Force Breach* / *Tactical Bypass*). Does a *Tactical Bypass* also switch which half of a **Split-Effect Modifier** (`[Combat]` vs `[Non-Combat]`) applies? | **Recommendation:** **Yes!** Since Split Modifiers check the stage's *active* Focus, swapping from `[Combat]` to `[Infiltrate]` dynamically flips the modifier from its kinetic effect to its non-combat effect (adding awesome tactical depth to Step 1). |
| **`BL-RULES-08`** | 🟢 **P3** | **Med Bay & Trauma** (`medbay_trauma.md` §2.2) | **Critical Injury Stacking Lethal Threshold:** Each Critical Injury or Permanent Trauma token inflicts `-1 Max HP` and `-1 Starting Static Die`. What happens if a `2 HP` operative (*The Prowler*, *The Spymaster*) accumulates **2 Trauma/Injury tokens** (`0 Max HP`)? | **Recommendation:** Specify that an operative whose effective `Max HP` is reduced to `0` is **Medically Grounded (Ineligible to Deploy)** until at least 1 token is purged at the Infirmary / Cybernetic Lab. |

---

## 3. MATHEMATICAL & BALANCE OBSERVATIONS (`9.0 ES` LEDGER)

Using the new VTT Monte Carlo Simulator (`src/vtt/simulator.ts`), here are **4 balance insights** to monitor during playtesting:

1. **`BL-BAL-01` — The `$D + 1# AWAY TEAM — DESIGN COMPANION AUDIT & PRODUCT BACKLOG

> **Role:** Lead Systems & UX Design Companion  
> **Scope:** Comprehensive audit of the **Away Team** 6.0 Engine ruleset, mathematical ledger (`9.0 ES`), edge-case timing windows, Wiki/Rulebook presentation, and Virtual Tabletop (VTT) simulation architecture.  
> **Golden Constraint:** *No rules or numbers have been altered without your explicit sign-off.* All rule observations below are cataloged as actionable design decisions while explanatory text, callouts, and examples have been sharpened across the rulebook.

---

## 1. EXECUTIVE DESIGN COMPANION REVIEW: WHAT WORKS BRILLIANTLY

Before diving into edge cases and backlog items, here is a candid assessment of why the **Away Team** core architecture is genuinely compelling from a tabletop systems perspective:

1. **The Static Pool Paradigm + Operational Momentum (`[MOM]`) Solves the "Co-Op Hoarding Trap":**
   * In most semi-cooperative games (*Dead of Winter*, *Nemesis*), selfish players hoard their best resources for the final turn while letting teammates absorb early attrition.
   * Your **Operational Momentum formula** ($\text{MOM} = \text{Successes} - D - 1$ at $\ge D + 2$) paired with the **Skin-in-the-Game Constraint** (*only operatives who committed $\ge 1$ die in the stage can receive `[MOM]` die refunds*) creates a brilliant prisoners' dilemma: if you don't commit dice, you can't get refunded; if the team over-commits together and crushes the stage by $+2$, the Squad Leader refunds spent dice and Aegis/momentum perks fire.
2. **Standardized Backfire (`Natural 1`) vs. Variable Success Thresholds (`3+`, `4+`, `5+`):**
   * Keeping Backfire risk at a flat `16.7%` (`1` on a d6) across all Focus alignments while scaling expected successes (`0.67 ES` $\rightarrow$ `0.50 ES` $\rightarrow$ `0.33 ES`) makes the math intuitive at the table. Players immediately feel why sending an Out-of-Focus (`5+`) operative into a hazard is dangerous: they have to roll **twice as many dice** to get the same result, doubling their exposure to `1s`.
3. **Phase 1 (Specialists) Early Resolution Check:**
   * Allowing Phase 1 (`3+`) Specialists to clear the stage immediately—skipping Phase 2 Support rolls entirely—makes bringing the right Specialist feel heroic and saves the rest of the squad's finite dice and HP.
4. **The 4-Tier Separation of Currencies (`[CR]`, `[EF]`, `[PIP]`) vs. `[MOM]`, `[LOY]`, and `[DOOM]`/`[VP]`:**
   * Separating spendable Vault assets from transient mission flow (`[MOM]`), character-bound progression (`[LOY]`), and macro trackers (`[DOOM]`, `[VP]`) eliminates cognitive overload on the Faction Dashboard.

---

## 2. RULES LOGIC & EDGE-CASE BACKLOG (FOR DESIGNER REVIEW)

While auditing all 8 Core Rulebook chapters and 200 components, I identified **8 specific timing, economic, and edge-case questions** that playtesters will inevitably encounter. No rules were changed; instead, I have documented the current baseline behavior in the rulebook callouts and logged the design choices below for your review:

| ID | Status / Priority | System / Chapter | Observation / Ambiguity | Designer Decision & Resolution |
| :--- | :---: | :--- | :--- | :--- |
| **`BL-RULES-01`** | ✅ **RESOLVED** | **Vault Economy & Mission Briefs** (`Step 1: Debrief & Payouts`) | **Mission Bounty Distribution:** Is clearance bounty paid to each participating Faction, or a shared pot? | **Adopted:** **Dual-Stream Payout Model.** Each participating operative receives a guaranteed base stipend (`[2 CR]`), each Faction receives `[1 PIP]`, and the remaining Clearance Bounty pot is divided equally among deployed players, with any odd remainder allocated at the **Squad Leader's discretion** (players may negotiate terms with Binding Promises). |
| **`BL-RULES-02`** | ✅ **RESOLVED** | **Stage Resolution & Mortality** (`Step 2/3` vs `Step 4`) | **The "Martyr's Last Stand" Timing:** If an operative drops to `0 HP` from backfire and dies unstabilized in Step 4, do their successes count? | **Adopted:** **"Dying Breath Rule."** Yes! Successes rolled in Steps 2/3 lock in immediately for Stage Resolution in Step 5 even if the operative dies in Step 4. |
| **`BL-RULES-03`** | ✅ **RESOLVED** | **Mortality & Vulture Economy** (`medbay_trauma.md` §1.2) | **Priority Order for Stabilization & Vulture Claims:** In what order do players declare stabilization and vulture loot claims? | **Adopted:** **Triage Right of First Refusal:** Owning Faction first → Squad Leader second → Clockwise. **Vulture Claims:** Squad Leader declares first, then clockwise around the table; contested claims roll off. |
| **`BL-RULES-04`** | ✅ **RESOLVED** | **Squad Leader Command** (`squad_leader_command.md` §1) | **Zero-Credit Command Auction Edge Case:** What happens if no Faction bids $\ge [1\text{ CR}]$? | **Adopted:** **Immediate d6 Roll-Off.** If all Factions bid zero or decline, an immediate high-stakes d6 roll-off determines the Squad Leader for that mission at `[0 CR]` cost. |
| **`BL-RULES-05`** | ✅ **RESOLVED** | **Classes & Focus** (`classes_and_focus.md` §2.5) | **Technician *Adaptive Calibration* Early Resolution:** If bonus rolls reach Target Difficulty $D$, does it trigger Early Resolution? | **Adopted:** **Yes.** Adaptive Calibration extends Phase 1; meeting $D$ triggers Early Resolution and spares Phase 2 Support. |
| **`BL-RULES-06`** | 🟡 **P2** | **Classes & Focus** (`classes_and_focus.md` §2.3) | **Scientist *Dual-Vector Mapping* Initiative Promotion:** When Scientist adds a second concurrent Focus (e.g., adding `[Intel]` to a `[Combat]` room), operatives with Primary `[Intel]` (`3+`) now match the room's active Focus. Do they act in **Phase 1 Initiative (Specialists)**? | **Recommendation:** **Yes**, as stated in `classes_and_focus.md`, they use the added Focus for both Initiative Phase and threshold (`3+`). Added a worked example so players see how powerful Scientist is in Phase 1. |
| **`BL-RULES-07`** | 🟡 **P2** | **Squad Leader Swaps** (`squad_leader_command.md` §4) | **Dynamic Focus Swap Timing vs. Stage Modifiers:** In `rules_overview.md` Step 1, the Stage Card and 1 Stage Modifier Card are revealed *before* the Squad Leader declares a Dynamic Focus Swap (*Force Breach* / *Tactical Bypass*). Does a *Tactical Bypass* also switch which half of a **Split-Effect Modifier** (`[Combat]` vs `[Non-Combat]`) applies? | **Recommendation:** **Yes!** Since Split Modifiers check the stage's *active* Focus, swapping from `[Combat]` to `[Infiltrate]` dynamically flips the modifier from its kinetic effect to its non-combat effect (adding awesome tactical depth to Step 1). |
| **`BL-RULES-08`** | 🟢 **P3** | **Med Bay & Trauma** (`medbay_trauma.md` §2.2) | **Critical Injury Stacking Lethal Threshold:** Each Critical Injury or Permanent Trauma token inflicts `-1 Max HP` and `-1 Starting Static Die`. What happens if a `2 HP` operative (*The Prowler*, *The Spymaster*) accumulates **2 Trauma/Injury tokens** (`0 Max HP`)? | **Recommendation:** Specify that an operative whose effective `Max HP` is reduced to `0` is **Medically Grounded (Ineligible to Deploy)** until at least 1 token is purged at the Infirmary / Cybernetic Lab. |

---

## 3. MATHEMATICAL & BALANCE OBSERVATIONS (`9.0 ES` LEDGER)

Using the new VTT Monte Carlo Simulator (`src/vtt/simulator.ts`), here are **4 balance insights** to monitor during playtesting:

 "Clean Clear" Margin in Operational Momentum (CONFIRMED INTENTIONAL):**
   * **Designer Confirmation:** Momentum is intentionally designed as a **variance cushion / "hot-roll rebate"** ($ge D + 2$), not a farmable over-commitment target. Intentionally over-committing extra dice to chase Momentum is mathematically net-negative; instead, Momentum cushions hot rolls and rewards natural variance.
2. **`BL-BAL-02` — 2-HP "Glass Cannon" Operatives (`2 HP / 8 Dice`) & Backfire Variance (CONFIRMED INTENTIONAL):**
   * **Designer Confirmation:** The 39.5% mission mortality attrition risk from natural 1 Backfires on `2 HP / 8 Dice` specialists (*Ghost Point*, *Virologist*, *Spymaster*) is completely intentional. It creates essential emergent tactical demand for `[Body]` armor protection and `[1 EF]` emergency field stabilization.
3. **`BL-BAL-03` — 3-Player Vanguard Slot (`Slot 4`) Loyalty Velocity (CONFIRMED INTENTIONAL):**
   * **Designer Confirmation:** Double Loyalty accumulation (`[+2 LOY]` = `[4 VP]`) on the 3-Player Vanguard Slot is intentional. It drives aggressive, high-stakes bidding (`[2–3 CR]`) in the Vanguard Auction, balancing the doubled static dice attrition.
4. **`BL-BAL-04` — Scientist *Dual-Vector Mapping* (`-0.5 ES` Offset) vs. Diplomat *Strategic Alignment* (`0.0 ES` Offset):**
   * Both abilities solve out-of-focus rooms in Step 1 for `[1 EF]`, yet Scientist carries a `-0.5 ES` stat tax while Diplomat carries `0.0 ES`. In squads where at least one teammate has Primary (`3+`) in the secondary focus, Scientist is stronger; in all-Out-of-Focus rooms, Diplomat's squad-wide `4+` is stronger. Both feel well-differentiated!

---

## 4. PRODUCT & ENGINEERING BACKLOG (PRIORITIZED ROADMAP)

### ✅ Completed in Current Sprint (`Iteration 13–15`)
- [x] **`BL-UX-01` — Dedicated Wiki Homepage (`#/wiki/home`):** High-concept executive pitch, 4 core pillars, interactive Sequence of Play diagram, Focus Pyramid visual breakdown, and quick-launch portal cards.
- [x] **`BL-UX-02` — Emulated Print-Style Official Rulebook Reader (`#/wiki/rulebook`):** Deluxe tabletop rulebook layout with Chapter pagination, Table of Contents, Golden Rule/Tip/Warning callouts, step-by-step Examples of Play, Illustrated Diagram Placeholders, and Quick Reference sheet.
- [x] **`BL-UX-03` — Core Rulebook Clarity Pass (`/game/core/*.md`):** Added worked Examples of Play, callout boxes, timing clarifications, and diagram blueprints across all 8 chapters without changing any rules.
- [x] **`BL-VTT-01` — 7-Step Guided Game Sequencer & Contextual Hover Coach:** Step-by-step interactive phase bar guiding players through Briefing $\rightarrow$ Phase 1 Specialists $\rightarrow$ Phase 2 Support $\rightarrow$ Triage $\rightarrow$ Momentum $\rightarrow$ Transition $\rightarrow$ HQ Downtime, with rich hover explanations.
- [x] **`BL-VTT-02` — True Static Pool Commitment & Monte Carlo Balance Simulator (`src/vtt/simulator.ts`):** Per-stage dice commitment, spent dice tracking, `[MOM]` die refunds, and a 1,000-trial statistical simulator inside the VTT.

### 📋 Upcoming Backlog (Next Iterations)
- [ ] **`BL-VTT-03` — Interactive Political Deck & Secret Objective Dealer in VTT:** Deal 2 hidden Secret Objectives (keep 1) and draw 3 Open Agendas into active play inside the VTT state, with automatic `[VP]` scoring triggers when conditions are met.
- [ ] **`BL-VTT-04` — Automated AI / Solo Bot ("The Attrition Director"):** In 1P or 2P VTT sessions, simulate rival Faction bidding in the Command Auction and Stand-Down Auction using heuristic EV bidding rules.
- [ ] **`BL-ART-01` — Batch Generative Image Pipeline Runner:** Node.js script consuming `manifests/exports/image_generation_manifest.json` (`200` prompts) to batch-render WebP card art into `/assets/cards/` and `/assets/factions/`.
- [ ] **`BL-PRINT-01` — Print-and-Play (PnP) PDF / Print Sheet Stylesheet (`@media print`):** Allow exporting the Official Rulebook (`#/wiki/rulebook`) and 9-up Poker/Tarot card sheets directly to PDF from the browser for physical table playtesting.
