# AGENTS.md — Mandatory Agent Operating Instructions

> **Repository:** Away Team (`away-team-game`)  
> **Target Audience:** All AI Coding Assistants & Automated Developers  
> **Core Rule:** All work lands on side branches, verified via automated test suites and linters, submitted as Pull Requests into `main`, and merged cleanly.

---

## 1. Branching, PR & Git Workflow Rules

1. **Never Commit Feature Work Directly to `main`:**
   - The `main` branch is protected and reserved strictly for stable, tested releases.
   - All tasks, bug fixes, features, component balancing, and artwork additions MUST be implemented on dedicated, descriptive side branches (e.g., `feat/design-companion-and-authoring-framework`, `fix/command-auction-tiebreaker`).

2. **Atomic Commits with Meaningful Messages:**
   - Commit frequently in small, cohesive, atomic slices so commits can be reviewed and rolled back independently.
   - Use conventional commit prefixes: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `ci:`.

3. **Pre-Push Verification Standard:**
   Before pushing any branch to origin or opening a Pull Request, the agent MUST run:
   - `npm run lint:components` (Verifies YAML frontmatter schemas, 9.0 ES character budget, anatomical slots, price-to-tier ratios, and aspect ratios).
   - `npm test` (Executes all 17 automated test suites spanning rules contracts, FSM transitions, client storage, chaos fuzzing, and macro-balance).
   - `npm run build` (Ensures the Astro static production site compiles with 0 errors).

4. **Pull Request Lifecycle & Merging:**
   - Push the branch to `origin` using `BypassSandbox: true` for Git credentials.
   - Provide the user with a clickable GitHub Pull Request link.
   - In accordance with repository rules, all PRs must merge cleanly into `main` without unresolved merge conflicts.

5. **Branch Hygiene & Pruning:**
   - When a PR is merged into `main`, prune the remote feature branch and delete the local tracking branch.
   - Do NOT leave abandoned or duplicate side branches dangling. Keep the remote branch tree lean.

---

## 2. Tabletop Game Philosophy & Balance Contracts

1. **The Semi-Cooperative Paradox:**
   - Collective doom occurs at $\ge 3\text{ [FAIL]}$, causing Task Force Dissolution (all players lose).
   - Victory is individual and zero-sum (highest Victory Points wins).
   - Never introduce mechanics that collapse the tension into pure co-op or encourage degenerate kingmaking.

2. **The 9.0 ES Character Ledger:**
   - All Specialist Operatives must obey the exact 9.0 ES mathematical formula:
     $$\text{ES} = (\text{HP} \times 1.5) + (\text{Static Dice} \times 0.5) + \text{Power ES} + \text{Class Offset} = 9.0$$
   - Any added capability or high stamina pool must carry an explicit stat penalty or ES offset.

3. **Standardized Backfire vs. Skewed Focus:**
   - Backfire risk is fixed at $16.7\%$ (`Natural 1` on d6) across all Focus categories.
   - Hit thresholds scale: Primary (`3+`), Secondary (`4+`), Out-of-Focus (`5+`).
   - Operational Momentum is a hot-roll variance rebate ($\ge D + 2$), never a farmable baseline.

4. **Preserve Rules Traceability:**
   - Core player-facing rules reside in `/game/core/` (Chapters 1–8).
   - Developer engineering, probability theory, and mathematical ledgers reside in `/docs/design/` (Dossiers 01–09).
   - Component templates reside in `/docs/templates/`.
