---
id: "hq-intel-array"
title: "The Intel Array (Telemetry & Operations)"
component_type: "hq_facility"
category: "baseline_facility"
faction: "neutral"
tier: 1
deck_copies: 1
cost:
  credits: 4
  effort: 0
  pip: 0
focus_affinity:
  primary: "intel"
  secondary: "infiltrate"
  bridges: []
stats:
  baseline_side_op_slots: 1
modules:
  - id: "mod-satellite-telemetry"
    title: "Satellite Telemetry"
    cost_credits: 4
    cost_pip: 0
    reward_pip: 1
    effect: "During Step 1 (Briefing) of any stage, the Squad Leader may privately inspect the Stage Modifier cards for all upcoming stages on the mission track."
  - id: "mod-covert-desk"
    title: "Covert Desk"
    cost_credits: 4
    cost_pip: 0
    reward_pip: 1
    effect: "Adds +1 active Side-Mission / shared Open Agenda slot at HQ (2 total), expanding operational choices during Downtime."
  - id: "mod-signal-jammer"
    title: "Signal Jammer"
    cost_credits: 3
    cost_pip: 1
    reward_pip: 1
    effect: "Once per mission drop, the Squad Leader can spend 1 [EF] from their Vault to completely ignore and cancel the negative text of an active Stage Modifier card."
rules_text: "Baseline: 1 Active Side-Mission slot. Sponsorable Modules: Satellite Telemetry (4 [CR]), Covert Desk (4 [CR]), Signal Jammer (1 [PIP] + 3 [CR])."
tags:
  - "hq"
  - "intel"
  - "modifiers"
  - "side-missions"
art_spec:
  asset_path: "/assets/cards/hq/hq_intel_array.webp"
  aspect_ratio: "70:120"
  visual_description: "A cavernous subterranean satellite telemetry hub dominated by a glowing 3D topographical globe, multi-band signal receivers, and banks of decryption terminals."
  art_style: "Near-future gritty corporate sci-fi concept art, hard-surface industrial design, matte digital illustration with dramatic rim lighting."
---

# The Intel Array (Telemetry & Operations)

* **Baseline Capability:** **1 Active Side-Mission Slot** seeded from the campaign's allowed Theme tags during HQ Downtime.

---

## Sponsorable Modules

| Module Name | Sponsorship Cost | Reward | Agency-Wide Passive Effect |
| :--- | :--- | :---: | :--- |
| **Satellite Telemetry** | `4 [CR]` | `+1 [PIP]` | During Step 1 (Briefing), the Squad Leader may privately inspect the **Stage Modifier cards** for all upcoming stages on the mission track. |
| **Covert Desk** | `4 [CR]` | `+1 [PIP]` | Adds **+1 Side-Mission / Open Agenda slot** (`2` total), increasing available secondary operations. |
| **Signal Jammer** | `1 [PIP] + 3 [CR]` | `+1 [PIP]` | Once per mission drop, the Squad Leader may spend **`1 [EF]`** to completely ignore the negative text of an active Stage Modifier card. |
