---
id: "core-rules-overview"
title: "Rules Overview & Game Loop"
component_type: "core_rule"
category: "core"
order: 1
summary: "Foundational game concepts, the semi-cooperative paradox, 1-to-4 player scaling matrix, and the tactical stage resolution micro-loop."
---

# Rules Overview & Game Loop

## 1. Core Game Concept & The Semi-Cooperative Paradox

**Away Team** is a semi-cooperative tactical sci-fi campaign game for **1 to 4 players**. Players do not operate as independent field agents; instead, they embody competing institutional **Factions** fighting for executive dominance within Agency Headquarters.

While the squad must cooperate during deadly field deployments to stop global threats and prevent the campaign from collapsing, **individual victory is strictly personal**, determined by accumulating the most **Victory Points ([VP])** by the end of the campaign.

### The Tragedy of the Commons
* **The Shared Burden:** Stages feature high Target Difficulties that require coordinated dice commitments, tactical gear, and specialized class abilities. Neglecting a teammate's crisis or withholding support causes stages and missions to fail—inflicting physical trauma across the squad and advancing the global **Doom Tracker ([DOOM])**.
* **The Greedy Incentive:** Every resource spent to preserve the team—whether Credits ([CR]) spent on supplies, Effort ([EF]) burned to activate class powers, or finite static dice committed to clear a failing room—is an asset deducted from your Faction's private endgame scoring potential.
* **Operational Collapse:** If the global [DOOM] tracker reaches its campaign maximum, or if the Agency cannot field a legal 4-operative squad during deployment, the Agency suffers an immediate **Operational Collapse** (collective defeat).

---

## 2. Player Count Scaling Matrix (The 4-Operative Mandate)

Regardless of the number of human players sitting at the table, every tactical mission enforces a strict squad size of **exactly 4 deployed operatives**. Character ownership is divided into isolated personal rosters managed on each player's **Faction Dashboard**.

| Player Count | Mandatory Deployment Per Player | Unassigned Vanguard Slot | Minimum Roster Bench |
| :--- | :--- | :--- | :--- |
| **Solo Mode (1P)** | 4 Operatives Controlled | None | 4 Active Operatives |
| **2 Players (2P)** | 2 Operatives Deployed Each | None | 4 Active Operatives (2 per Player) |
| **3 Players (3P)** | 1 Operative Deployed Each | **1 Slot (Vanguard Auction)** | 6 Active Operatives (2 per Player) |
| **4 Players (4P)** | 1 Operative Deployed Each | None | 4 Active Operatives (1 per Player) |

### Solo Mode (The Attrition Sandbox)
A single player manages all 4 deployment slots against the game's attrition and [DOOM] engine. Competitive auctions, [PIP] extortion, and vulture looting taxes are deactivated.

### 2-Player Configuration (Dual-Specialist Front)
Each player commands an independent Faction and deploys **2 operatives** to fulfill the 4-operative mandate. Players manage separate Faction Vaults and harvest rewards based on which of their operatives participated or cleared stages.

### 3-Player Configuration (The Unassigned Vanguard Slot)
Each of the 3 players assigns **1 operative** from their bench to fill Slots 1, 2, and 3. **Slot 4** is the *Unassigned Vanguard Slot*:
1. **The Vanguard Auction:** Before loadouts are finalized, the 3 players bid [CR] from their Faction Vaults (tie-breakers: [PIP] $\rightarrow$ [LOY] $\rightarrow$ Roll-off).
2. **Double-Deployment:** The winning Faction pays their [CR] bid to the HQ bank and deploys a **second operative** from their bench into Slot 4.
3. **Strategic Trade-off:** Double-deploying burns through two operatives' static dice pools simultaneously, but grants two bodies on the ground to harvest stage rewards, [LOY] survival bonuses, and Open Agendas.

### 4-Player Configuration (True Specialist Ownership)
Each of the 4 players controls a distinct Faction and deploys **1 operative**. Every decision, binding deal, and survival risk is tied to your single representative on the ground.

### Mandatory Deployment Directive
If a Faction possesses at least one healthy, eligible operative on their bench, they are **legally barred from sitting out a mission**. To protect a veteran operative without deploying them, a player must either negotiate a **Slot Buyout** with a rival Faction or win the **Stand-Down Auction** during HQ Downtime.

---

## 3. Macro Game Loop

A campaign alternates between two primary phases across a sequence of **3 to 5 Campaign Missions** (interspersed with optional **Side-Missions**):

1. **The Mission Phase (Field Deployment):**
   * Assemble the 4-operative squad, conduct the **Command Auction** to elect the **Squad Leader**, and equip loadouts from Faction Vaults.
   * Progress sequentially through the Mission Brief's **3 to 5 Stage Cards**.
   * Resolve each room using the 5-step Stage Resolution Micro-Loop.
2. **The HQ Downtime Phase (Base Operations):**
   * Return surviving operatives and unexpended gear to Faction Vaults.
   * Execute the 8-step HQ sequence: Debrief & Payouts $\rightarrow$ Stand-Down Auction $\rightarrow$ Infirmary Medical Recovery $\rightarrow$ Corporate Sponsorship (HQ Upgrades) $\rightarrow$ Recruitment Bureau $\rightarrow$ Quartermaster Procurement $\rightarrow$ Boardroom Politics $\rightarrow$ Next Mission Loadout.

---

## 4. The Stage Resolution Micro-Loop

Each mission consists of a curated track of **Stage Cards**. Every stage defines its **Preset Focus** ([Combat], [Infiltrate], [Intel], [Operations], [Negotiate], or [Survival]), **Target Difficulty ($D$)**, **Dynamic Focus Swap options**, and **Stage Failure Penalty**.

When entering a stage, resolve the encounter in **5 strict steps**:

### Step 1: Briefing & Transaction Window
* Reveal the current Stage Card and draw **1 Stage Modifier Card** face-up.
* The **Squad Leader** may declare a **Dynamic Focus Swap** (*Force Breach* to [Combat] or *Tactical Bypass* to a non-combat Focus).
* Factions may activate Step 1 Class Abilities (e.g., Recon *Intel Reconnaissance*, Scientist *Dual-Vector Mapping*, Diplomat *Strategic Alignment*), deploy [Complex] items, use Briefing consumables, or broker **Binding Promises** (trading [CR] or items; [EF] and [LOY] cannot be traded).

### Step 2: Phase 1 Initiative (The Specialists)
Operatives whose **Primary Focus** matches the stage's active Focus act first:
1. **Commitment:** Specialist players coordinate and commit any number of unspent dice from their operatives' static pools.
2. **The Specialist Roll:** Roll all committed Specialist dice simultaneously:
   * **Success (`3+`):** Each die showing `3`, `4`, `5`, or `6` adds **+1 Success**.
   * **Backfire (`1`):** Each natural `1` inflicts **1 point of immediate HP damage** to that operative.
3. **Early Resolution Check:** If total successes meet or exceed the Target Difficulty ($D$), the stage is **immediately cleared**! Skip Phase 2 entirely—Support operatives preserve all of their uncommitted dice and avoid rolling hazards. *(Note: Technician's Adaptive Calibration may be triggered here to let a Specialist roll additional dice before moving to Phase 2).*

### Step 3: Phase 2 Initiative (The Support)
If the Specialists did not meet the Target Difficulty ($D$), the remaining operatives must step up (or the Squad Leader/team may vote to **Concede the Stage / Tactical Retreat** to take the failure penalty without rolling Support dice):
1. **Commitment:** Non-Primary operatives commit dice from their remaining static pools.
2. **The Support Roll:** Roll all committed Support dice simultaneously:
   * **Secondary Focus (`4+`):** Operatives with the stage's Focus as their Secondary Focus score a Success on `4`, `5`, or `6`.
   * **Out of Focus (`5+`):** Operatives with no matching Focus score a Success on `5` or `6`.
   * **Backfire (`1`):** Natural `1s` inflict **1 point of immediate HP damage** (unless modified by a Stage Modifier).

### Step 4: Post-Initiative & Triage Window
* Trigger late-stage character powers, re-roll effects (e.g., *Pattern Recognition*, *Tactical HUD Visor*), or reactive damage mitigation (e.g., Survivalist *Emergency Field Medicine*, *Smoke Canister*).
* If any operative is reduced to `0 HP`, immediately resolve the **Emergency Stabilization Window** (spend [1 EF] or discard a Medical Consumable to reset to `1 HP`, or the operative is killed and drops their gear).

### Step 5: Resolution & Operational Momentum
Compare total accumulated successes against the stage's Target Difficulty ($D$):
* **Stage Cleared ($\text{Successes} \ge D$):** Claim any stage-specific rewards.
* **Operational Momentum ($\text{Successes} \ge D + 2$):** Generate $\text{Momentum} = \text{Total Successes} - D - 1$. The **Squad Leader** immediately distributes [MOM] points to restore spent static dice (`[1 MOM] = +1 restored static die`) to operatives who committed and rolled at least 1 die in this stage.
* **Stage Failed ($\text{Successes} < D$):** Suffer the printed **Stage Failure Penalty** (HP damage, static die loss, [CR]/[EF] loss, or downstream difficulty escalation). If the stage was a Mission Climax stage (or the Squad Leader calls a **Forced Retreat**), the mission ends in failure.

### Transition Step (Between Stages)
Before revealing the next stage card:
* The Squad Leader may trigger **Logistical Refresh** ([2 EF] to restore 1 die to all operatives, or [3 EF] to restore 2 dice to all operatives) or declare a **Tactical Retreat** (if after Stage 1 and either an operative is at `1 HP` or $>50\%$ of squad static dice are spent).
* Operatives may use Transition Step abilities or items.
