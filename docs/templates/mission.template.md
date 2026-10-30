---
id: "mission-[campaign]-[index]-[codename]"
title: "Operation: [Mission Name]"
component_type: "mission"
category: "campaign_mission"
faction: "neutral"
tier: 1
deck_copies: 1
campaign_id: "[campaign-iron-dawn | campaign-apex-extraction]"
mission_index: 1
threat_level: "[Standard | High | Critical]"
payout:
  base_stipend_per_operative: 2
  base_pip_per_faction: 1
  shared_bounty_credits: 6
  shared_bounty_pip: 1
failure_penalty:
  fail_tracker_increment: 1
stages:
  - stage_number: 1
    title: "[Stage 1 Encounter Area]"
    focus: "[combat | infiltrate | tech | intel | survival | command]"
    difficulty: 4
    modifier_draws: 1
    description: "[Encounter tactical overview.]"
  - stage_number: 2
    title: "[Stage 2 Encounter Area]"
    focus: "[combat | infiltrate | tech | intel | survival | command]"
    difficulty: 4
    modifier_draws: 1
    description: "[Encounter tactical overview.]"
  - stage_number: 3
    title: "[Stage 3 Objective Room]"
    focus: "[combat | infiltrate | tech | intel | survival | command]"
    difficulty: 5
    modifier_draws: 1
    description: "[Climactic objective encounter.]"
rules_text: "Clear all 3 sequential stages to secure sector bounty. Failure on any stage advances Mission Failure Tracker (+1 [FAIL])."
tags:
  - "mission"
  - "campaign"
art_spec:
  asset_path: "/assets/cards/missions/mission_[codename].webp"
  aspect_ratio: "70:120"
  visual_description: "[Top-down holographic tactical mission briefing map with glowing waypoints.]"
  art_style: "Holographic tactical map, top-down isometric briefing schematic, amber and cyan UI."
---

# Mission Briefing: Operation [Mission Name]

## 1. Tactical Intelligence
[Operational briefing, enemy presence, environmental conditions, and strategic value.]

## 2. Squad Loadout Recommendations
[Recommended Specialist classes, focus alignments, and utility equipment.]
