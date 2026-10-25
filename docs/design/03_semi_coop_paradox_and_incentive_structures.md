---
id: "design-03-semi-coop-incentives"
title: "The Semi-Cooperative Paradox & Anti-Alpha Gaming Architecture"
document_type: "design_reference"
category: "design"
order: 3
summary: "Analysis of the semi-cooperative design dilemma, solving alpha gamer dominance through decentralized ownership, binding promises, and competitive agency incentives."
---

# The Semi-Cooperative Paradox & Anti-Alpha Gaming Architecture

> [!NOTE]
> **Internal Design Documentation:** This document outlines the psychological and systemic mechanics engineered into **Away Team** to solve the notorious "Alpha Gamer" problem and maintain genuine tension between cooperative survival and competitive victory.

---

## 1. The Alpha Gamer Pathology in Pure Co-ops

In pure cooperative tabletop games (such as *Pandemic* or *Spirit Island*), all information is typically public, and all players share an identical win/loss condition.

Inevitably, the most experienced or assertive player at the table begins "quarterbacking" or "alpha gaming"—telling everyone else what cards to play, where to move, and which dice to roll. The game collapses into a single-player puzzle played by one person with three spectators.

---

## 2. The Institutional Solution: Factions Within an Agency

**Away Team** neutralizes quarterbacking by structuring player incentives around the **Tragedy of the Commons**:

1. **Personal Ownership:** A player does not control "the squad"—they control their own corporate **Faction** and their single deployed operative on the ground.
2. **Private Asymmetrical Scoring:** The Agency winning the campaign is merely the prerequisite for individual victory. The actual winner is the Faction Director with the highest **Victory Points ([VP])**.
3. **The Finite Resource Drain:** Every die rolled in a stage has a 16.7% chance of inflicting damage. Every Effort (`[EF]`) spent on an ally's behalf is Effort unavailable for private scoring or HQ upgrades.

### 2.1 The Two-Phase Separation
* **Field Deployment (The Mission):** Highly tactical, high casualty risk, mutual dependence. If the mission fails, the **Mission Failure Tracker ([FAIL])** advances toward **Task Force Dissolution** (collective defeat).
* **HQ Downtime (The Boardroom):** Ruthlessly competitive. Factions buy out corporate landmarks, outbid rivals for Squad Leader status, and audit secret corporate agendas.

---

## 3. Anti-Quarterbacking Rules Anchors

Three explicit rules prevent players from dictating their teammates' moves:

### 3.1 Non-Compulsory Rolling
No player—not even the Squad Leader—can force another player to commit dice to a stage pool. Each player decides how many of their operative's static dice to risk. If an ally refuses to commit dice because they suspect a wipe or want to preserve their operative for the next stage, the remaining squad must either shoulder the burden or vote to concede.

### 3.2 The Command Auction & Formalized Authority
Field decisions (such as choosing whether to initiate a Dynamic Focus Swap, which path to take, or who receives Momentum die refunds) are not decided by committee consensus or shouting matches. They belong solely to the **Squad Leader**, an executive role won through a competitive auction before deployment.

### 3.3 The Law of Binding Promises
Negotiations and deals are explicitly permitted and legally enforceable. If Player A pays Player B `[2 CR]` to activate *Dual-Vector Mapping* on the current stage, Player B *must* execute the promised action once the currency changes hands. This formalizes table talk into contractual transactions rather than vague peer pressure.
