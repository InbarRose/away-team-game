---
id: "agent-13-combat-medic"
title: "Dr. Aris Thorne (The Combat Medic)"
component_type: "character"
category: "scientist"
faction: "neutral"
tier: 1
deck_copies: 1
cost:
  credits: 8
  effort: 0
  pip: 0
focus_affinity:
  primary: "combat"
  secondary: "intel"
  bridges: []
stats:
  es_budget: 9.0
  hp_cap: 3
  static_dice: 6
  class_offset_es: 0.5
  power_es: 1.0
  slots_required: []
  armor_buffer: 0
class_ability:
  name: "Dual-Vector Mapping"
  cost_effort: 1
  effect: "Activate during Step 1 (Briefing). Choose any Focus category distinct from the room's printed Focus and add it as a concurrent Operational Focus for the duration of the stage."
unique_power:
  name: "Emergency Triage"
  tier: 2
  es_value: 1.0
  trigger: "Reactive — once per mission when any deployed operative drops to 0 HP"
  effect: "Spend 1 static die from Aris's active pool to immediately stabilize that operative at 1 HP without spending [EF] or discarding a Consumable item."
rules_text: "Class (Scientist — Dual-Vector Mapping, 1 [EF]): Add a second concurrent Operational Focus to the current stage. Unique Power (Emergency Triage): Once per mission when an ally hits 0 HP, spend 1 static die to stabilize them at 1 HP for free."
tags:
  - "character"
  - "scientist"
  - "primary-combat"
  - "secondary-intel"
  - "medic"
art_spec:
  asset_path: "/assets/cards/characters/agent_13_combat_medic.webp"
  aspect_ratio: "63:88"
  visual_description: "A battle-hardened field trauma surgeon in crimson-trimmed ballistic armor, holding a pneumatic auto-suture gun in one hand and a compact carbine in the other."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# Agent 13: Dr. Aris Thorne (*The Combat Medic*)

* **Class:** Scientist (`Primary Combat`)
* **Focus Profile:** Primary: `[Combat]` (`3+`) | Secondary: `[Intel]` (`4+`) | Out of Focus: `5+`
* **Base Stats:** **`3 HP`** (`4.5 ES`) • **`6 Static Dice`** (`3.0 ES`) • **Power:** `1.0 ES` • **Class Offset:** `+0.5 ES` (**Total:** `9.0 ES`)

---

## Class Ability: Dual-Vector Mapping (`1 [EF]`)

Activate during Step 1 (Briefing). Choose any Focus category and **add it as a concurrent Operational Focus** for the room, allowing operatives to use either the printed Focus or the added Focus for Phase 1/2 thresholds.

---

## Unique Power: Emergency Triage (`1.0 ES` — Tier 2 Reactive)

Once per mission, when any deployed operative drops to **`0 HP`** mid-stage, Aris can spend **`1 static die`** from his active pool to immediately stabilize that operative at **`1 HP`** without spending Vault `[EF]` or discarding a Medical Consumable.
