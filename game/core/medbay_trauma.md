---
id: "core-medbay-trauma"
title: "Chapter 6: Field Casualties, Triage & Med Bay Trauma Engine"
component_type: "core_rule"
category: "core"
order: 6
summary: "Rules for 0 HP emergency stabilization, field casualty drops and the Vulture Tax, the HQ Infirmary bed recovery system, Critical Injuries, and Permanent Trauma."
---

# Mortality, Med Bay & Critical Trauma Engine

## 1. The `0 HP` Operational Protocol & Field Casualties

Operatives feature baseline maximum health pools ranging from **2 to 5 Hit Points (`HP`)**, strictly balanced against their static dice pools and unique powers. When an operative's health drops to **`0 HP`** due to Backfire (`1s`) or a Stage Failure penalty, an immediate **Emergency Stabilization Window** opens before death becomes permanent.

```text
                [ OPERATIVE HEALTH REACHES 0 HP ]
                               │
                               ▼
                [ EMERGENCY STABILIZATION WINDOW ]
           Spend [1 EF] OR Discard 1 Medical Consumable
                               │
         ┌─────────────────────┴─────────────────────┐
         ▼                                           ▼
  [ STABILIZED ]                             [ UNSTABILIZED / PASSED ]
Operative resets to 1 HP;                  Operative is KILLED IN ACTION.
Remains active in squad.                   Proceed to Field Casualty Drop.
```

### 1.1 Emergency Stabilization
Before the operative is declared dead, the controlling Faction **or any deployed ally** may trigger an immediate stabilization:
* **Cost:** Spend **`[1 EF]`** from a Faction Vault OR discard **1 Medical Consumable** (e.g., *Field Trauma Medkit*, *Nanite Bio-Foam Canister*).
* **Effect:** The operative resets to **`1 HP`** and continues the mission in their deployment slot.

### 1.2 Field Casualty Drop & The Vulture Economy
If no player pays the stabilization cost, the operative is **Killed in Action (KIA)**:
1. **The Dead Pool Ledger:** Place the fallen operative's card face-up in the owning Faction's **Dead Pool**. Their owning Faction immediately gains **[+2 PIP]** (*Sacrifice for the Agency*), and all accumulated **[LOY]** on the card is preserved for endgame Martyrdom VP scoring (`[1 LOY] = [2 VP]`, or higher with specific Faction perks).
2. **Dropped Equipment:** All items equipped to the fallen operative drop onto the active Stage Card. Surviving squad members must resolve the dropped gear before advancing:
   * **Option A — Retain & Return:** Leave the dropped items in the drop ship's common cargo. If the squad completes or safely retreats from the mission, the items return to the original owner's Faction Vault for free.
   * **Option B — Rival Claim (The Vulture Tax):** Any surviving rival Faction may claim the fallen operative's items into their own inventory/vault, but must immediately pay an **Administrative Vulture Tax of [-1 PIP] for every 2 items claimed (rounded up)**.
   * **Contested Loot:** If multiple rivals attempt to claim the same dropped item and cannot negotiate a split, each rolls a d6; highest roll pays the [PIP] tax and claims the item. On a tie, the item is destroyed in the crossfire.

---

## 2. The HQ Med Bay & Critical Trauma Engine

Surviving operatives who return to HQ with missing HP do **not** heal automatically. Instead of rolling on a disconnected injury table, recovery is resolved directly through the **HQ Infirmary** during **Step 3 of HQ Downtime**.

```text
1. FIELD DAMAGE ──► Healed mid-mission? ──► NO PERMANENT IMPACT
       │
       ▼ (Unhealed damage returned to HQ)
2. MED BAY ASSIGNMENT ──► Assign wounded operative to an Infirmary Bed
       │
       ├─► Roll Med Bay Healing Dice (1 die per missing HP, up to bed pool):
       │     • Success (5+ / 4+ upgraded) ──► 1 Damage Point Healed Cleanly
       │     • Natural 1 (Calcification)  ──► Converts to PERMANENT TRAUMA Token
       │     • Failure (2–4 / 2–3)        ──► Damage remains unhealed
       │
       ▼ (End of Downtime Step 3)
3. UNHEALED DAMAGE ──► Each remaining unhealed HP converts into a CRITICAL INJURY Token
                       (-1 Max HP, -1 Starting Static Die; Operative can still deploy)
```

### 2.1 Infirmary Bed Capacity & Healing Dice
* **Baseline Capacity:** HQ starts with **2 Treatment Beds**, each providing **3 Healing Dice** hitting on a **`5+`**.
* **Stand-Down Round Bonus:** If the Agency votes to **Stand-Down (R&R)** during Step 2 of Downtime, Infirmary capacity increases by **+2 Beds (4 total)** and each bed gains **+2 Healing Dice (5 dice per bed)**.
* **Bed Assignment:** Wounded operatives who cannot be assigned to a bed (due to bed scarcity) cannot roll Healing Dice during that Downtime.

### 2.2 Critical Injury Tokens vs. Permanent Trauma Tokens

| Condition Token | How It Is Acquired | Mechanical Penalty | How It Is Removed |
| :--- | :--- | :--- | :--- |
| **Critical Injury Token** *(Temporary Scar)* | Any missing HP that remains **unhealed** at the end of Downtime Step 3 (from missed rolls or no available bed). | **`-1 Max HP`** and **`-1 Starting Static Die`** on mission launch. **Operative CAN still deploy** (unless effective Max HP is reduced to 0). | Assign to an Infirmary Bed in a future Downtime and roll at a **`-1` threshold penalty** (`6+` base, or `5+` with *Trauma Cybernetics*), OR use *Gene-Stasis Tank* / *Cybernetic Lab*. |
| **Permanent Trauma Token** *(Locked Complication)* | Rolling a **natural `1`** on a Med Bay Healing Die during Downtime Step 3. | **`-1 Max HP`** and **`-1 Starting Static Die`** on mission launch. **Operative CAN still deploy** (unless effective Max HP is reduced to 0). | **Locked** against normal Med Bay rolls. Can **only** be purged via the **Cybernetic Lab** ([5 CR]) or **Rehab Lab** ([3 EF]). |

### 2.3 Medically Grounded Protocol (0 Effective Max HP — `BL-RULES-08`)
Each Critical Injury or Permanent Trauma token inflicts a compounding `-1 Max HP` penalty. If an operative accumulates enough tokens that their **effective Max HP is reduced to `0`** (for example, a `2 HP` specialist such as *The Prowler* or *The Spymaster* taking 2 injury/trauma tokens):
* The operative is **Medically Grounded** and **Ineligible to Deploy** on missions.
* They cannot be selected as one of the Faction's deployed field agents in Step 8 of HQ Downtime.
* They must remain grounded in the HQ Reserve until at least 1 token is cured or purged at the Infirmary or Cybernetic Lab, raising their effective Max HP back to $\ge 1$.

---

## 3. Medical Facility & Landmark Synergies

| Facility / Module | Cost | Medical Recovery Impact |
| :--- | :--- | :--- |
| **Baseline Infirmary** | *Starting HQ* | **2 Beds**, **3 Healing Dice** per bed, heals on **`5+`**. |
| **Surgical Wing** *(Infirmary Module)* | [4 CR] | Adds **+2 Treatment Beds** (4 total beds baseline; 6 during Stand-Down). |
| **Trauma Cybernetics** *(Infirmary Module)* | [4 CR] | Lowers healing threshold to **`4+`** (and offsets Critical Injury healing from `6+` to **`5+`**). |
| **Gene-Stasis Tank** *(Infirmary Module)* | `[1 PIP] + [3 CR]` | Spend **[1 EF]** during Downtime to **auto-heal 1 missing HP** without rolling (0% risk of natural `1` Permanent Trauma). |
| **Cryo-Stasis Chamber** *(Standalone Landmark)* | `[2 PIP] + [6 CR]` | **Sponsor-Controlled (1 Bed):** Automatically restores **100% HP** with `0` dice rolled. |
| **Cybernetic Lab** *(Tier 3 Medical)* | [16 CR] *(Shared)* | Pay **[5 CR]** to completely purge a **Permanent Trauma** or **Critical Injury** token. |


---

## 4. Rulebook Callouts, Examples of Play & Diagram Blueprints

> [!WARNING]
> **Medically Grounded at 0 Max HP (`BL-RULES-08`):** Fragile `2 HP` operatives become Medically Grounded if they accumulate 2 Critical Injury or Permanent Trauma tokens. They cannot deploy on missions until at least 1 token is purged at the Infirmary or Cybernetic Lab, protecting the squad from deploying unplayable zero-health casualties.

> [!IMPORTANT]
> **Stabilization Extortion & Binding Promises at `0 HP`:** When an operative drops to `0 HP` during Step 4, **any deployed ally** may pay the `[1 EF]` or Medical Consumable cost to save them—not just the owning Faction! If the owning Faction is out of [EF], rivals can legally demand an immediate **Binding Promise** (e.g., *"Pay me `[3 CR]` from your Vault right now and I will burn my `[1 EF]` to stabilize your veteran agent"*).

> [!WARNING]
> **Calcification Risk (`Natural 1` in Med Bay):** Rolling baseline Infirmary Healing Dice (`5+`) always carries a `1-in-6` chance per die of rolling a natural `1`, which calcifies that wound into a **Permanent Trauma Token** (`-1 Max HP`, `-1 Starting Static Die`, locked against normal bed rolls). For high-Loyalty Tier 3 or Tier 4 veterans, consider using the **Gene-Stasis Tank** (`[1 EF]` = auto-heal `1 HP` with `0%` trauma risk) or **Cryo-Stasis Chamber** (`100%` risk-free heal)!

> [!EXAMPLE]
> **Example of Play — Field Casualty, Martyrdom & The Vulture Tax:**
> 1. **Obsidian's** operative **The Saboteur** (`[4 LOY]`, carrying a *Heavy Rotary Cannon* and *Tactical Slicer Deck*) takes 2 Backfire damage in Stage 3 and drops to `0 HP`.
> 2. Obsidian has `[0 EF]` in their Vault. They offer `[2 CR]` to **Titan** to pay `[1 EF]` for stabilization, but Titan refuses—wanting The Saboteur's *Heavy Rotary Cannon*!
> 3. **The Saboteur is Killed in Action (KIA):**
>    * Obsidian moves The Saboteur to their **Dead Pool**, immediately gains **`[+2 PIP]`** (*Sacrifice for the Agency*), and locks in The Saboteur's `[4 LOY]` as **`[8 VP]`** of permanent Martyrdom score.
>    * The 2 equipped items drop onto the stage. **Titan** invokes **Option B (Rival Claim / Vulture Tax)**, paying **`[-1 PIP]`** (`1 PIP` covers up to 2 looted items) to claim both the *Heavy Rotary Cannon* and *Tactical Slicer Deck* directly into Titan's Armory!

> [!DIAGRAM]
> **Figure 5.1 — The Med Bay Triage & Trauma Lifecycle**
> * **Visual Specification:** Dual-track medical bay schematic. Top track shows **In-Mission `0 HP` Stabilization** branching into *Saved at `1 HP`* vs *Dead Pool Martyr (`[+2 PIP]` + Vulture Loot Drop)*. Bottom track shows **HQ Downtime Step 3 Infirmary Beds**: rolling `5+` (Clean Heal), `2–4` (Converts to **Critical Injury Token**), and `1` (Converts to **Permanent Trauma Token** requiring Cybernetic Lab purge).
> * **Aspect Ratio:** `16:9` Rulebook Diagram • **Asset Path:** `/assets/rulebook/fig_5_1_medbay_trauma_flow.webp`
