---
id: "perk-12-reconnaissance-grid"
title: "Reconnaissance Grid"
component_type: "perk"
category: "tactical_doctrine"
faction: "neutral"
tier: 3
deck_copies: 1
cost:
  credits: 0
  effort: 0
  pip: 0
focus_affinity:
  primary: "intel"
  secondary: "infiltrate"
  bridges: []
stats:
  es_budget: 2.0
  hp_cap: null
  static_dice: null
  temp_dice_bonus: null
  slots_required: []
  armor_buffer: null
tier_unlocks:
  - tier: 1
    loyalty_required: 1
    ability_name: "Scout Telemetry"
    effect: "During Step 1 (Briefing), look at the top card of the Stage Modifier deck before committing dice to the pool."
  - tier: 2
    loyalty_required: 3
    ability_name: "Intel Siphon"
    effect: "Whenever this operative scores 2+ successes on an [Intel] check, deposit +1 Effort [EF] directly into your Vault."
  - tier: 3
    loyalty_required: 6
    ability_name: "Threat Scramble"
    effect: "Once per mission drop, spend 1 Effort [EF] to cancel and redraw an active Stage Modifier card."
rules_text: "T1 (1 LOY) Scout Telemetry: During Briefing, peek at the top Stage Modifier card before committing dice. T2 (3 LOY) Intel Siphon: Scoring 2+ successes on an [Intel] check deposits +1 [EF] into Vault. T3 (6 LOY) Threat Scramble: 1/mission, spend 1 [EF] to cancel and redraw an active Stage Modifier card."
active_ability: "Threat Scramble (1 EF, 1/mission)"
tags:
  - "perk"
  - "doctrine"
  - "intel"
  - "recon"
  - "modifier-control"
art_spec:
  asset_path: "/assets/cards/perks/perk_12_reconnaissance_grid.webp"
  aspect_ratio: "63:88"
  visual_description: "A recon specialist perched on an elevated gantry, peering through a multi-spectrum visor while a palm-sized pulse drone scans the room ahead with blue lidar wireframe beams."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Reconnaissance Grid

**Thematic Profile:** Telemetry & Threat Analysis — threat forecasting, stage modifier manipulation, and data intelligence gathering.

## Loyalty Tier Progression

| Tier | Loyalty Required | Ability Name | Mechanical Effect & Cost |
| :--- | :--- | :--- | :--- |
| **Tier 1** | `1 [LOY]` | **Scout Telemetry** | During Step 1 (Briefing), look at the top card of the **Stage Modifier deck** before committing dice to the pool. |
| **Tier 2** | `3 [LOY]` | **Intel Siphon** | Whenever this operative scores **2+ successes** on an `[Intel]` check, deposit **+1 `[EF]`** directly into your Vault. |
| **Tier 3** | `6 [LOY]` | **Threat Scramble** | Once per mission drop, spend **1 `[EF]`** to cancel and redraw an active Stage Modifier card. |
