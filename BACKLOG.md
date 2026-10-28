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
- [x] **`BL-UX-04` — Standalone Homepage Portal (`#/home`):** Created dedicated command-deck landing page showcasing the 3 digital platform hubs, core 6.0 engine innovations, live component metrics, and community links.
- [x] **`BL-UX-05` — Standalone Design Companion Portal (`#/design`):** Extracted developer design dossiers, 9.0 ES mathematical ledger, and companion backlog outside the Rules Wiki into an independent top-level engineering workspace.
- [x] **`BL-OPS-01` — GitHub Issue Templates & In-App Reporter:** Added structured issue templates for Bug Reports, Gameplay Feedback, and Feature Requests in `.github/ISSUE_TEMPLATE/`, with in-app modal launcher and repo links.

- [x] **`BL-VTT-03` — Rigid Procedural VTT FSM & Visual Card Drafting:** Replaced freeform counter controls and arbitrary dropdown selectors with a strict procedural finite state machine (`setup_players` -> `setup_factions` -> `setup_bench` -> `setup_campaign` -> `phase1_brief` -> `phase2_auction` -> `phase3_tactical` -> `phase4_hq`). Added visual Faction Dossier sheets (seals, printed starting assets, 4-tier loyalty trees), specialist operative bench draft trays, zero-starting-item loadout enforcement, and procedural campaign mission advancement.
- [x] **`BL-VTT-04` — Tactile Physical Tabletop UI & Cause-and-Effect Explanations:** Replaced neon cyan laser glow with matte slate tabletop felt, physical card tokens (Tarot 70×120, Poker 63×88, Stage cards), 3D tactile dice trays, and explicit outcome tooltips.

- [x] **`BL-RULES-09` — Individual Operative Dice Sovereignty & The Right to Hold Back:** Codified that each player independently decides how many dice their character rolls (0 to max available) in Step 2 and Step 3. Neither teammates nor the Squad Leader may force dice commitments. 0 dice is completely legal ("Holding Back"), preserving stamina and avoiding Backfires while forfeiting `[MOM]` refunds.
- [x] **`BL-VTT-05` — Tabletop Dice Commitment Console & Individual Roll Triggers:** Enhanced Phase 3 Tactical Field with Director attribution headers, quick-select stamina pills (`0 (Hold)`, `1`, `2`, `3`, `Max`), individual roll action buttons on operative cards, and coordinated squad roll levers.
- [x] **`BL-VTT-06` — Dual-Stream Payout Console & Idempotent Claim Lock (`BL-RULES-01`):** Fixed multi-click duplicate payout bug in Phase 4 HQ Downtime with single-claim state lock (`payoutsClaimed`). Built interactive Dual-Stream Payout Console displaying Stream 1 guaranteed operative stipends (`+2 CR` per deployed agent, `+1 PIP` per faction) and Stream 2 negotiated clearance pot (`6 CR`), with interactive player allocation steppers and canonical split fallbacks.
- [x] **`BL-VTT-07` — Quartermaster Market Depletion & Active Director Console:** Fixed item buying so purchased gear is removed from `armoryMarketItemIds`, replenishes the market row from the armory deck, deducts Credits from the selectable active Director, and equips gear onto targeted operative anatomical slots or deposits into Faction Armory Cache.
- [x] **`BL-VTT-08` — Tabletop Desk Pieces, HQ Facility Board, Boardroom Perks & Secret Objectives:** Built Tabletop Desk displaying Faction Crest, Vault chits, and 6-slot anatomical gear rack. Implemented Step 0.4 dealing 3 Open Corporate Agendas and 2 Secret Corporate Objectives (keep 1) with privacy peek/conceal toggle. Added Step 4 Corporate Facility Sponsorships (`<HQFacilityBoard>`) and Step 7 Boardroom Doctrines (`<FactionPerksConsole>`).
- [x] **`BL-VTT-09` — Strict Mid-Game Navigation Guard & New Game Modal:** Separated phase navigation into `SETUP_STEPS` (visible strictly during Step 0.1–0.5 setup) and `IN_GAME_PHASES` (Phase 1–4 + Sim). Banned backward mid-game progression to setup; resets require explicit confirmation via the "Start a New Game?" modal.
- [x] **`BL-TEST-01` — Deterministic Acceptance & Scenario Testing Engine (`src/vtt/gameSimulator.ts`):** Implemented repeatable test scenarios (`smoke_clean_clear`, `martyr_dying_breath`) and pluggable `diceOverride` hooks in `runGameSimulation`, asserting exact state outcomes, dual-stream payouts, and Dying Breath timings.
- [x] **`BL-TEST-02` — Chaos / Fuzzing Testing Loop & Invariant Verifier:** Implemented Monte Carlo chaos engine simulating $N$ full campaign loops with pseudo-random player choices, asserting 6 invariants (non-negative vaults, operative HP/dice bounds, 4-man squad invariant, market replenishment, dual-stream payouts, and deadlock-free bounded execution).
- [x] **`BL-VTT-10` — In-Browser Multi-Mode Sim Console & Telemetry Export:** Upgraded Tab 5 into a 3-tab verification console (`Combat Monte Carlo`, `Deterministic Scenarios`, `Chaos Fuzz Simulator`) with real-time log viewers, pass/fail status banners, and one-click JSON telemetry exports.

### 📋 Upcoming Backlog (Next Iterations)
- [ ] **`BL-VTT-03` — Interactive Political Deck & Secret Objective Dealer in VTT:** Deal 2 hidden Secret Objectives (keep 1) and draw 3 Open Agendas into active play inside the VTT state, with automatic `[VP]` scoring triggers when conditions are met.
- [ ] **`BL-VTT-04` — Automated AI / Solo Bot ("The Attrition Director"):** In 1P or 2P VTT sessions, simulate rival Faction bidding in the Command Auction and Stand-Down Auction using heuristic EV bidding rules.
- [ ] **`BL-ART-01` — Batch Generative Image Pipeline Runner:** Node.js script consuming `manifests/exports/image_generation_manifest.json` (`200` prompts) to batch-render WebP card art into `/assets/cards/` and `/assets/factions/`.
- [ ] **`BL-PRINT-01` — Print-and-Play (PnP) PDF / Print Sheet Stylesheet (`@media print`):** Allow exporting the Official Rulebook (`#/wiki/rulebook`) and 9-up Poker/Tarot card sheets directly to PDF from the browser for physical table playtesting.
