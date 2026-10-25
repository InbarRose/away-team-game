import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXPORTS_DIR = path.resolve(__dirname, '..', 'manifests', 'exports');

const characters = JSON.parse(fs.readFileSync(path.join(EXPORTS_DIR, 'characters.json'), 'utf8'));
const items = JSON.parse(fs.readFileSync(path.join(EXPORTS_DIR, 'items.json'), 'utf8'));
const factions = JSON.parse(fs.readFileSync(path.join(EXPORTS_DIR, 'factions.json'), 'utf8'));
const perks = JSON.parse(fs.readFileSync(path.join(EXPORTS_DIR, 'perks.json'), 'utf8'));
const agendas = JSON.parse(fs.readFileSync(path.join(EXPORTS_DIR, 'agendas.json'), 'utf8'));
const secretObjectives = JSON.parse(
  fs.readFileSync(path.join(EXPORTS_DIR, 'secret_objectives.json'), 'utf8')
);
const modifiers = JSON.parse(fs.readFileSync(path.join(EXPORTS_DIR, 'modifiers.json'), 'utf8'));

describe('Suite 03: Game Math, 9.0 ES Character Budget & Deck Balance Intent', () => {
  it('verifies all 24 Specialist Operatives obey the exact 9.0 ES mathematical budget formula', () => {
    assert.equal(characters.length, 24, 'Must have 24 characters');

    const expectedClassOffsets = {
      soldier: 0.0,
      recon: 0.0,
      diplomat: 0.0,
      technician: 0.0,
      scientist: 0.5,
      survivalist: 1.0,
    };

    const classCounts = {};

    for (const char of characters) {
      const cls = char.category;
      assert.ok(cls in expectedClassOffsets, `Invalid class '${cls}' on ${char.id}`);
      classCounts[cls] = (classCounts[cls] || 0) + 1;

      const hp = char.stats.hp_cap;
      const dice = char.stats.static_dice;
      const classOffset = char.stats.class_offset_es;
      const powerEs = char.stats.power_es;

      assert.equal(
        classOffset,
        expectedClassOffsets[cls],
        `${char.id} (${cls}) must have class_offset_es = ${expectedClassOffsets[cls]}`
      );

      const calculatedEs = hp * 1.5 + dice * 0.5 + powerEs + classOffset;
      assert.equal(
        calculatedEs,
        9.0,
        `${char.id} failed 9.0 ES budget formula: (${hp}*1.5) + (${dice}*0.5) + ${powerEs} + ${classOffset} = ${calculatedEs}`
      );
      assert.equal(char.stats.es_budget, 9.0, `${char.id} stats.es_budget must be 9.0`);
    }

    // Each of the 6 classes must have exactly 4 operatives
    for (const [cls, count] of Object.entries(classCounts)) {
      assert.equal(count, 4, `Class '${cls}' must have exactly 4 operatives, found ${count}`);
    }
  });

  it('verifies the 24-Agent Focus Matrix (11 Primary Combat, 5 Secondary Combat, 8 Zero-Combat Specialists)', () => {
    const primaryCombat = characters.filter(
      (c) => c.focus_affinity.primary === 'combat'
    );
    const secondaryCombat = characters.filter(
      (c) =>
        c.focus_affinity.primary !== 'combat' &&
        c.focus_affinity.secondary === 'combat'
    );
    const zeroCombat = characters.filter(
      (c) =>
        c.focus_affinity.primary !== 'combat' &&
        c.focus_affinity.secondary !== 'combat'
    );

    assert.equal(primaryCombat.length, 11, 'Exactly 11 operatives must have Primary Combat affinity');
    assert.equal(secondaryCombat.length, 5, 'Exactly 5 operatives must have Secondary Combat affinity');
    assert.equal(zeroCombat.length, 8, 'Exactly 8 operatives must be Zero-Combat specialists');

    for (const zc of zeroCombat) {
      assert.ok(
        (zc.tags || []).includes('zero-combat'),
        `Zero-Combat operative ${zc.id} must include 'zero-combat' tag`
      );
    }
  });

  it('verifies all 87 Armory items have valid tiers, Credit costs, and anatomical slot definitions', () => {
    assert.equal(items.length, 87, 'Must have 87 Armory item templates');

    for (const item of items) {
      assert.ok(
        item.tier === 1 || item.tier === 2,
        `Item ${item.id} must be Tier 1 or Tier 2, found ${item.tier}`
      );
      assert.ok(
        item.cost && typeof item.cost.credits === 'number' && item.cost.credits > 0,
        `Item ${item.id} must have a positive Credit cost`
      );

      if (item.category !== 'consumable' && item.category !== 'complex') {
        assert.ok(
          Array.isArray(item.stats?.slots_required) && item.stats.slots_required.length >= 1,
          `Wearable/Handheld item ${item.id} must declare stats.slots_required`
        );
      }
    }
  });

  it('verifies Faction Loyalty trees (4 tiers), Perks (3 tiers), Secret Objectives (15/10/5 VP), and Modifiers (4 Split / 8 Generic)', () => {
    assert.equal(factions.length, 8);
    for (const fac of factions) {
      const tiers = fac.loyalty_tiers || fac.loyalty_tree;
      assert.ok(
        tiers &&
          (Array.isArray(tiers)
            ? tiers.length === 4
            : Object.keys(tiers).length === 4),
        `Faction ${fac.id} must define 4 progressive loyalty tiers`
      );
    }

    assert.equal(perks.length, 12);
    for (const perk of perks) {
      assert.ok(
        Array.isArray(perk.tier_unlocks) &&
          perk.tier_unlocks.length >= 3 &&
          perk.tier_unlocks.length <= 4,
        `Perk ${perk.id} must define 3 or 4 progressive tier_unlocks`
      );
    }

    assert.equal(agendas.length, 24);
    assert.equal(secretObjectives.length, 10);
    for (const so of secretObjectives) {
      assert.ok(
        so.scoring_tiers &&
          so.scoring_tiers.first_place_vp === 15 &&
          so.scoring_tiers.second_place_vp === 10 &&
          so.scoring_tiers.third_place_vp === 5,
        `Secret Objective ${so.id} must define 15/10/5 VP scoring_tiers`
      );
    }

    assert.equal(modifiers.length, 12);
    const splitMods = modifiers.filter((m) => m.category === 'split_modifier');
    const genericMods = modifiers.filter((m) => m.category === 'generic_modifier');
    assert.equal(splitMods.length, 4, 'Must have 4 split_modifier cards');
    assert.equal(genericMods.length, 8, 'Must have 8 generic_modifier cards');
  });
});
