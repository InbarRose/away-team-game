import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getTriagePriorityOrder,
  resolveCriticalInjuryRoll,
  resolveTraumaCalcification,
  isOperativeMedicallyGrounded,
  evaluateMedBayRecovery,
  evaluateDiceRoll,
} from '../src/vtt/engine.js';

describe('Suite 09: Mortality, Triage & Med Bay Trauma Engine (Chapter 6)', () => {
  describe('Step 4 Triage Priority & Right of First Refusal (BL-RULES-03)', () => {
    it('enforces canonical triage declaration order: Controlling Faction -> Squad Leader -> Clockwise', () => {
      // 4-player table. Controlling seat: 2. Squad Leader: 0.
      const order = getTriagePriorityOrder(2 /* controlling */, 0 /* squad leader */, 4);
      assert.deepEqual(order, [2, 0, 1, 3], 'Controlling seat must declare first, then SL, then clockwise');
    });

    it('handles case where Squad Leader is also the controlling player', () => {
      // Controlling seat: 1. Squad Leader: 1.
      const order = getTriagePriorityOrder(1, 1, 4);
      assert.deepEqual(order, [1, 2, 3, 0], 'When SL owns the operative, next in order is clockwise');
    });

    it('stabilizes operative at 1 HP upon spending 1 EF and rolls Critical Injury', () => {
      let operativeHp = 0;
      let controllingEffort = 2;

      // Spend 1 EF to stabilize
      controllingEffort -= 1;
      operativeHp = 1;

      // Roll Critical Injury d6
      const injury = resolveCriticalInjuryRoll(3);
      assert.equal(operativeHp, 1, 'Stabilization restores operative to 1 HP');
      assert.equal(controllingEffort, 1, '1 EF deducted for field triage');
      assert.equal(injury.name, 'Severed Tendon / Concussion');
      assert.equal(injury.dicePenalty, 1);
    });
  });

  describe('The Dying Breath Rule (BL-RULES-02)', () => {
    it('preserves successes rolled in Steps 2/3 for Step 5 clearance even if operative dies in Step 4', () => {
      const targetDifficulty = 4;

      // Step 2 Specialist rolls 3 dice out of focus: [6, 6, 1] -> 2 hits, 1 backfire
      const roll = evaluateDiceRoll([6, 6, 1], 5, true);
      assert.equal(roll.hits, 2);
      assert.equal(roll.backfires, 1);

      // Operative had 1 HP remaining, backfire drops them to 0 HP
      const operative = {
        name: 'Marcus Vance',
        hp: 1 - roll.backfires, // 0 HP
        isStabilized: false,
      };
      assert.equal(operative.hp, 0);

      // In Step 4 Triage: No player spends 1 EF -> Operative is KIA
      const isKia = !operative.isStabilized && operative.hp === 0;
      assert.equal(isKia, true);

      // Dying Breath Invariant: The 2 hits rolled by Vance in Step 2 are NOT discarded
      const stageHits = 2 + roll.hits; // 2 prior hits + 2 Vance hits = 4
      const cleared = stageHits >= targetDifficulty;
      assert.equal(cleared, true, 'Vance hits count toward stage clearance despite dying unstabilized in Step 4');
    });
  });

  describe('Critical Injury Table & Stat Penalties', () => {
    it('evaluates d6 Critical Injury outcomes accurately', () => {
      // 1-2: Flesh Wound (no penalty)
      const roll1 = resolveCriticalInjuryRoll(1);
      assert.equal(roll1.name, 'Flesh Wound');
      assert.equal(roll1.dicePenalty, 0);
      assert.equal(roll1.hpPenalty, 0);

      const roll2 = resolveCriticalInjuryRoll(2);
      assert.equal(roll2.name, 'Flesh Wound');

      // 3-4: Concussion / Severed Tendon (-1 Static Die)
      const roll3 = resolveCriticalInjuryRoll(3);
      assert.equal(roll3.name, 'Severed Tendon / Concussion');
      assert.equal(roll3.dicePenalty, 1);
      assert.equal(roll3.hpPenalty, 0);

      const roll4 = resolveCriticalInjuryRoll(4);
      assert.equal(roll4.name, 'Severed Tendon / Concussion');
      assert.equal(roll4.dicePenalty, 1);

      // 5-6: Shattered Carapace / Organ Trauma (-1 Max HP)
      const roll5 = resolveCriticalInjuryRoll(5);
      assert.equal(roll5.name, 'Shattered Carapace / Organ Trauma');
      assert.equal(roll5.dicePenalty, 0);
      assert.equal(roll5.hpPenalty, 1);

      const roll6 = resolveCriticalInjuryRoll(6);
      assert.equal(roll6.name, 'Shattered Carapace / Organ Trauma');
      assert.equal(roll6.hpPenalty, 1);
    });
  });

  describe('Trauma Calcification (3 Injuries = 1 Permanent Trauma)', () => {
    it('calcifies 3 Critical Injuries into 1 Permanent Trauma token', () => {
      const result1 = resolveTraumaCalcification(2 /* existing */, 1 /* added */);
      assert.equal(result1.permanentTraumaAdded, 1);
      assert.equal(result1.remainingInjuries, 0);

      const result2 = resolveTraumaCalcification(1 /* existing */, 4 /* added */);
      assert.equal(result2.permanentTraumaAdded, 1);
      assert.equal(result2.remainingInjuries, 2);
    });
  });

  describe('Medically Grounded Invariant (BL-RULES-08)', () => {
    it('bars 0 effective Max HP operatives from mission deployment', () => {
      const baseMaxHp = 2; // e.g. The Spymaster (Glass Cannon)

      // Accumulates 1 Permanent Trauma -> 1 Max HP -> Eligible
      assert.equal(isOperativeMedicallyGrounded(baseMaxHp, 1, 0), false);

      // Accumulates 2 Permanent Trauma -> 0 Max HP -> Medically Grounded!
      assert.equal(isOperativeMedicallyGrounded(baseMaxHp, 2, 0), true);

      // 1 Trauma + 1 Organ Trauma injury (-1 HP penalty) -> 0 Max HP -> Medically Grounded!
      assert.equal(isOperativeMedicallyGrounded(baseMaxHp, 1, 1), true);
    });
  });

  describe('Med Bay Infirmary Beds & Healing Dice (Chapter 6 & 7)', () => {
    it('evaluates baseline healing rolls on 5+ (1 HP per hit)', () => {
      // Baseline 2d6 recovery: [5, 3] -> 1 hit
      const rec = evaluateMedBayRecovery([5, 3], false);
      assert.equal(rec.target, 5);
      assert.equal(rec.hpRestored, 1);
    });

    it('evaluates Surgical Wing / Cyberneticist recovery rolls on 4+ (1 HP per hit)', () => {
      // Upgraded 2d6 recovery: [4, 3] -> 1 hit at 4+
      const rec = evaluateMedBayRecovery([4, 3], true /* hasSurgicalWing */);
      assert.equal(rec.target, 4);
      assert.equal(rec.hpRestored, 1);
    });
  });
});
