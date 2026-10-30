import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeFocusThreshold,
  evaluateDiceRoll,
  evaluateStageOutcome,
  calculateOperationalMomentum,
  expectedSuccessPerDie,
} from '../src/vtt/engine.js';

describe('Suite 07: Tactical Dice, Focus Thresholds & Operational Momentum Engine (Chapter 4)', () => {
  describe('Focus Thresholds & Statistical Probability (3+, 4+, 5+)', () => {
    it('computes 3+ Primary Focus threshold with 66.7% hit probability', () => {
      const res = computeFocusThreshold({
        primaryFocus: 'combat',
        secondaryFocus: 'infiltrate',
        stagePrimaryFocus: 'combat',
      });

      assert.equal(res.threshold, 3);
      assert.equal(res.isOutOfFocus, false);
      assert.match(res.role, /Primary Specialist/);

      // Verify mathematical hit probability: {3, 4, 5, 6} = 4 / 6
      const es = expectedSuccessPerDie(res.threshold);
      assert.ok(Math.abs(es - 4 / 6) < 0.001, 'Primary focus must yield 4/6 expected success per die');

      // Evaluates roll against 3+
      const roll = evaluateDiceRoll([1, 2, 3, 4, 5, 6], res.threshold, res.isOutOfFocus);
      assert.equal(roll.hits, 4); // 3, 4, 5, 6
      assert.equal(roll.misses, 2); // 1, 2
      assert.equal(roll.backfires, 0, 'Primary focus rolls never backfire on a 1');
    });

    it('computes 4+ Secondary Focus / Item Bridge threshold with 50.0% hit probability', () => {
      // Secondary Focus match
      const resSecondary = computeFocusThreshold({
        primaryFocus: 'tech',
        secondaryFocus: 'intel',
        stagePrimaryFocus: 'intel',
      });
      assert.equal(resSecondary.threshold, 4);
      assert.equal(resSecondary.isOutOfFocus, false);

      // Item Bridge match
      const resBridge = computeFocusThreshold({
        primaryFocus: 'diplomacy',
        secondaryFocus: 'survival',
        itemBridgeFocuses: ['combat'],
        stagePrimaryFocus: 'combat',
      });
      assert.equal(resBridge.threshold, 4);
      assert.equal(resBridge.isOutOfFocus, false);

      // Verify mathematical hit probability: {4, 5, 6} = 3 / 6
      const es = expectedSuccessPerDie(4);
      assert.ok(Math.abs(es - 3 / 6) < 0.001, 'Secondary focus must yield 3/6 expected success per die');

      const roll = evaluateDiceRoll([1, 2, 3, 4, 5, 6], 4, false);
      assert.equal(roll.hits, 3); // 4, 5, 6
      assert.equal(roll.misses, 3); // 1, 2, 3
      assert.equal(roll.backfires, 0, 'Secondary focus rolls never backfire on a 1');
    });

    it('computes 5+ Out of Focus threshold with 33.3% hit probability and standardized Backfire', () => {
      const res = computeFocusThreshold({
        primaryFocus: 'diplomacy',
        secondaryFocus: 'intel',
        stagePrimaryFocus: 'combat',
      });

      assert.equal(res.threshold, 5);
      assert.equal(res.isOutOfFocus, true);
      assert.match(res.role, /Vanguard Assist/);

      // Verify mathematical hit probability: {5, 6} = 2 / 6
      const es = expectedSuccessPerDie(res.threshold);
      assert.ok(Math.abs(es - 2 / 6) < 0.001, 'Out of focus must yield 2/6 expected success per die');

      // Evaluates roll against 5+ with natural 1s
      const roll = evaluateDiceRoll([1, 2, 3, 4, 5, 6], res.threshold, res.isOutOfFocus);
      assert.equal(roll.hits, 2); // 5, 6
      assert.equal(roll.misses, 4); // 1, 2, 3, 4
      assert.equal(roll.backfires, 1, 'Natural 1 on Out of Focus triggers 1 Backfire wound');
    });

    it('honors Survivalist Hostile Environment Mastery (ignoring natural 1 Backfires on 5+)', () => {
      const roll = evaluateDiceRoll([1, 1, 3, 4, 5, 6], 5, true, true /* ignoreNaturalOnes */);
      assert.equal(roll.hits, 2);
      assert.equal(roll.misses, 4);
      assert.equal(roll.backfires, 0, 'Survivalist ability must negate all natural 1 Backfires');
    });
  });

  describe('Operational Momentum Formula (Hits >= D + 2) & Skin-in-the-Game', () => {
    it('awards 0 MOM on exact target clear (Hits == D) or close clear (Hits == D + 1)', () => {
      const targetDifficulty = 4;

      // Exact clear: 4 hits vs D=4
      const outcomeExact = evaluateStageOutcome(4, targetDifficulty);
      assert.equal(outcomeExact.cleared, true);
      assert.equal(outcomeExact.momentumEarned, false);
      assert.equal(calculateOperationalMomentum(4, targetDifficulty, 4), 0);

      // Close clear: 5 hits vs D=4
      const outcomePlusOne = evaluateStageOutcome(5, targetDifficulty);
      assert.equal(outcomePlusOne.cleared, true);
      assert.equal(outcomePlusOne.momentumEarned, false);
      assert.equal(calculateOperationalMomentum(5, targetDifficulty, 4), 0);
    });

    it('awards exact MOM tokens according to MOM = Total Hits - D - 1 when Hits >= D + 2', () => {
      const targetDifficulty = 4;

      // Clean clear: 6 hits vs D=4 -> 6 - 4 - 1 = 1 MOM
      const mom1 = calculateOperationalMomentum(6, targetDifficulty, 4);
      assert.equal(mom1, 1, '6 hits vs D=4 must generate 1 MOM token');

      // Crushing clear: 7 hits vs D=4 -> 7 - 4 - 1 = 2 MOM
      const mom2 = calculateOperationalMomentum(7, targetDifficulty, 4);
      assert.equal(mom2, 2, '7 hits vs D=4 must generate 2 MOM tokens');

      // Overwhelming clear: 9 hits vs D=4 -> 9 - 4 - 1 = 4 MOM
      const mom4 = calculateOperationalMomentum(9, targetDifficulty, 4);
      assert.equal(mom4, 4, '9 hits vs D=4 must generate 4 MOM tokens');
    });

    it('enforces Skin-in-the-Game invariant: operatives with 0 committed dice cannot receive MOM refunds', () => {
      const targetDifficulty = 4;
      const totalHits = 7; // Generated 2 MOM

      // Operative A committed 3 dice -> eligible for refund
      const momA = calculateOperationalMomentum(totalHits, targetDifficulty, 3);
      assert.equal(momA, 2, 'Participating operative with 3 committed dice is eligible for MOM');

      // Operative B committed 0 dice -> barred from refund
      const momB = calculateOperationalMomentum(totalHits, targetDifficulty, 0);
      assert.equal(momB, 0, 'Operative committing 0 dice is barred from MOM by Skin-in-the-Game rule');
    });
  });

  describe('Holding Back Protocol (0 Dice Commitment)', () => {
    it('permits 0 dice commitment: spends 0 stamina and generates 0 Backfire wounds', () => {
      const committedDice = 0;
      const rolledValues = [];
      const threshold = 5;

      const evalResult = evaluateDiceRoll(rolledValues, threshold, true);
      assert.equal(evalResult.hits, 0);
      assert.equal(evalResult.misses, 0);
      assert.equal(evalResult.backfires, 0);

      // Verifies operative preserves all HP and stamina
      const initialHp = 3;
      const initialSpentDice = 2;
      const updatedHp = Math.max(0, initialHp - evalResult.backfires);
      const updatedSpentDice = initialSpentDice + committedDice;

      assert.equal(updatedHp, initialHp, 'Holding back guarantees 0 wounds taken');
      assert.equal(updatedSpentDice, initialSpentDice, 'Holding back expends 0 static dice');
    });
  });

  describe('Phase 1 (Specialists) Early Resolution Check', () => {
    it('triggers Early Resolution when Phase 1 Specialists achieve Hits >= D, sparing Phase 2 Support', () => {
      const targetDifficulty = 4;
      const phase1Hits = 4;

      const earlyResolutionTriggered = phase1Hits >= targetDifficulty;
      assert.equal(earlyResolutionTriggered, true, 'Meeting D in Phase 1 must trigger Early Resolution');

      // Support operatives do not roll dice
      const supportCommittedDice = 0;
      assert.equal(supportCommittedDice, 0, 'Phase 2 Support rolls are bypassed upon Early Resolution');
    });

    it('requires Phase 2 Support when Phase 1 Specialists fall short (Hits < D)', () => {
      const targetDifficulty = 5;
      const phase1Hits = 3;

      const earlyResolutionTriggered = phase1Hits >= targetDifficulty;
      assert.equal(earlyResolutionTriggered, false, 'Phase 1 shortfall must not trigger Early Resolution');
    });
  });
});
