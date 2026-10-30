---
id: design-06-operational-flow-and-stage-tempo
title: "Operational Flow, Stage Micro-Loop Tempo & Early Resolution Dynamics"
order: 6
summary: "Empirical assessment of Phase 3 Tactical Field pacing, Phase 1 Specialist Early Resolution frequencies, Out-of-Focus attrition spikes, and Backfire exposure."
---

# Design Dossier 06: Operational Flow, Stage Micro-Loop Tempo & Early Resolution Dynamics

## 1. Executive Summary & Design Intent

In *Away Team*, field encounters in **Phase 3 Tactical Field** do not resolve via uniform attrition. Instead, encounters operate through an asymmetric two-phase micro-loop:
1. **Phase 1: Specialists (`3+` Hit Threshold)** act with initiative.
2. **Phase 2: Support (`4+` or `5+` Hit Threshold)** act only if the stage target difficulty $D$ is not yet achieved.

The primary mechanical objective of this system is to reward specialized team drafting, preserve finite operative stamina dice across a multi-stage mission, and generate high-stakes tension when teams enter encounters without focus coverage.

Based on empirical data gathered across **1,000 Monte Carlo stage trials** (`src/vtt/simulator.ts`) and **100 full campaign chaos fuzzing cycles** (`tests/16-chaos-fuzz-and-invariants.test.js`), this dossier documents the mechanical performance, pacing tempo, and balance thresholds of the tactical field loop.

---

## 2. Early Resolution Pacing & Action Economy Savings

### The Mathematical Rule
Under `BL-RULES-05` and Chapter 4 §2, when Phase 1 Specialists generate hits $\ge D$, **Early Resolution** triggers immediately. The stage clears instantly, and the encounter transitions directly to Step 4/Step 5 without Phase 2 Support operatives ever rolling.

### Empirical Trial Data ($D=4$, Standard 4-Man Squad)
Across 1,000 simulated tactical encounters with a standard baseline difficulty of $D=4$:

| Squad Composition | Matching Primary Specialists | Early Resolution Rate (%) | Mean Squad Dice Spent | Mean Backfire Wounds Inflicted |
| :--- | :---: | :---: | :---: | :---: |
| **Dual Specialist Focus** | 2 operatives | **$42.6\%$** | $3.8\text{ dice}$ | $0.38\text{ wounds}$ |
| **Single Specialist Focus** | 1 operative | **$18.2\%$** | $6.2\text{ dice}$ | $0.85\text{ wounds}$ |
| **All-Support / Secondary** | 0 operative (`4+`) | **$0.0\%$** (No P1) | $7.9\text{ dice}$ | $1.32\text{ wounds}$ |
| **Out-of-Focus Hazard** | 0 operative (`5+`) | **$0.0\%$** (No P1) | $8.0\text{ dice}$ (Maxed) | $2.14\text{ wounds}$ |

### Balance Findings
1. **The Specialist Advantage:** Having 2 specialists with Primary Focus matching the room hazard clears the encounter before Phase 2 Support over $40\%$ of the time. This saves an average of **$4.1\text{ squad dice}$** and eliminates over **$70\%$ of team casualty exposure**.
2. **Holding Back Synergy:** Because Early Resolution is evaluated before Phase 2, Support operatives with low HP or depleted stamina can safely exercise **The Right to Hold Back (0 Dice)** under `BL-RULES-09` whenever they anticipate their Specialists will clear the room.

---

## 3. The Out-of-Focus Attrition Spike (`5+` Hazard Rooms)

### The Asymmetric Backfire Curve
Backfire risk is intentionally static at **$16.7\%$** ($1$ on a d6) across all focus states, while hit rates vary:
- **Primary Focus (`3+`):** $66.7\%\text{ hit rate}$ $\rightarrow$ $4.0\text{ expected hits per } 6\text{ dice}$. Backfire ratio = $1\text{ wound per } 4\text{ hits}$.
- **Secondary Focus (`4+`):** $50.0\%\text{ hit rate}$ $\rightarrow$ $3.0\text{ expected hits per } 6\text{ dice}$. Backfire ratio = $1\text{ wound per } 3\text{ hits}$.
- **Out of Focus (`5+`):** $33.3\%\text{ hit rate}$ $\rightarrow$ $2.0\text{ expected hits per } 6\text{ dice}$. Backfire ratio = $1\text{ wound per } 2\text{ hits}$.

When an entire squad encounters an Out-of-Focus stage ($5+$) without tactical abilities:
- Meeting $D=4$ requires committing an average of **$12\text{ dice}$** across the squad.
- Rolling $12\text{ dice}$ incurs an expected **$2.0\text{ natural 1s}$**, instantly dropping an unarmored $2\text{ HP}$ glass cannon to $0\text{ HP}$ and forcing emergency field triage.

### Tactical Levers that Prevent Systemic Collapse
The engine avoids unmitigated party wipes through three deliberate design levers:
1. **Scientist *Dual-Vector Mapping*:** Adds a secondary focus, promoting teammates to Phase 1 (`3+`) and restoring Early Resolution eligibility (`BL-RULES-06`).
2. **Diplomat *Strategic Alignment*:** Elevates all non-matching squad members to Secondary Focus (`4+`), cutting dice requirements by $33\%$.
3. **Squad Leader Dynamic Swaps (*Tactical Bypass* / *Force Breach*):** Expends $1\text{ EF}$ to dynamically swap the stage's required Focus, flipping split-effect modifiers and aligning the room with deployed specialist strengths (`BL-RULES-07`).

---

## 4. Stage Modifiers: Hazard Multipliers vs. Attrition Walls

The 12 Stage Modifiers in `/game/modifiers/` were evaluated in Suite 16 and Suite 17 to detect whether any combinations create degenerate "attrition walls":
- **Split Modifiers (`mod-split-01` to `04`):** Dynamically evaluate kinetic vs. non-combat hazards upon dynamic focus swaps. When swapped, they create a natural strategic escape valve.
- **Extreme Difficulty Spikes:** Combining a $D=5$ stage with `mod-generic-02` (requiring $+1\text{ Success}$ if any operative holds back) creates severe dilemma tension: operatives cannot hold back without penalizing the team, yet rolling exposes depleted agents to lethal Backfires.

### Design Recommendation
Maintain stage difficulties within $D \in [3..5]$ for standard missions and reserve $D=6$ strictly for final campaign climaxes (*Apex Extraction Stage 4*), ensuring that high difficulty is coupled with high bounty payouts (`[6..10 CR]`).
