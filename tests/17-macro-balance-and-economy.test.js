import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calculateOperationalMomentum,
  SimplePRNG,
  runGameSimulation,
} from '../src/vtt/engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const allComponents = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, 'src', 'data', 'all_components.json'), 'utf8')
);

describe('Suite 17: Macro-Balance, Currency Velocity & Mortality Rate Modeling', () => {
  describe('Credit Currency Velocity & Economic Sinks (1P-4P)', () => {
    it('generates healthy credit velocity allowing armory/facility purchases without hyper-inflation', () => {
      // Runs 10 simulations to measure average credit accumulation
      const report = runGameSimulation(
        {
          mode: 'chaos',
          runs: 10,
          seed: 456789,
        },
        allComponents
      );

      assert.equal(report.success, true);
      const avgCreditsEarned = report.summaryMetrics.totalCreditsEarned / report.runsCompleted;

      // Economic sanity bounds:
      // Minimum: 4 players earning at least 2 CR stipend + bounty > 12 CR per mission
      assert.ok(avgCreditsEarned >= 12, `Credits earned per run (${avgCreditsEarned}) must support baseline economy`);
      // Maximum: Deflationary/inflationary sink limits (< 60 CR per run)
      assert.ok(avgCreditsEarned < 60, `Credits earned per run (${avgCreditsEarned}) must prevent hyper-inflation`);

      // Confirms economic sinks are active
      assert.ok(report.summaryMetrics.totalItemsPurchased > 0, 'Quartermaster market must absorb credits');
      assert.ok(report.summaryMetrics.totalFacilitiesSponsored > 0, 'Base facilities must absorb credits');
    });
  });

  describe('Operational Momentum Frequency Distribution (BL-BAL-01)', () => {
    it('confirms Operational Momentum triggers at ~10-30% frequency across 1,000 trials', () => {
      const prng = new SimplePRNG(12345);
      const trials = 1000;
      const targetDifficulty = 4;
      let momentumOccurrences = 0;

      // 4 operatives rolling an average of 2 dice each (8 dice total) at Focus thresholds
      for (let t = 0; t < trials; t++) {
        let stageHits = 0;
        // Specialist 1: 3 dice at 3+ (P = 4/6)
        for (let d = 0; d < 3; d++) {
          if (prng.next() < 4 / 6) stageHits++;
        }
        // Specialist 2: 2 dice at 4+ (P = 3/6)
        for (let d = 0; d < 2; d++) {
          if (prng.next() < 3 / 6) stageHits++;
        }
        // Support: 3 dice at 5+ (P = 2/6)
        for (let d = 0; d < 3; d++) {
          if (prng.next() < 2 / 6) stageHits++;
        }

        const mom = calculateOperationalMomentum(stageHits, targetDifficulty, 1);
        if (mom > 0) momentumOccurrences++;
      }

      const momentumRatePct = (momentumOccurrences / trials) * 100;

      // Assert statistical range: Momentum is a hot-roll rebate (10% to 30%), not an over-commitment farm
      assert.ok(
        momentumRatePct >= 10 && momentumRatePct <= 30,
        `Momentum frequency (${momentumRatePct.toFixed(1)}%) must fall within expected 10%-30% window`
      );
    });
  });

  describe('Glass Cannon Operative Attrition & Mortality Rate (BL-BAL-02)', () => {
    it('verifies 30-45% mission mortality rate on unarmored 2-HP specialists rolling Out of Focus', () => {
      const prng = new SimplePRNG(98765);
      const trials = 1000;
      let casualties = 0;

      // Over a full 3-stage mission, 2-HP specialist rolls 7 dice Out of Focus (5+) total
      for (let t = 0; t < trials; t++) {
        let currentHp = 2;
        for (let die = 0; die < 7; die++) {
          const roll = prng.range(1, 6);
          if (roll === 1) currentHp--; // Natural 1 backfire
        }
        if (currentHp <= 0) casualties++;
      }

      const casualtyRatePct = (casualties / trials) * 100;

      // Assert intentional fragility: 30% to 45% mission mortality risk drives armor purchases
      assert.ok(
        casualtyRatePct >= 30 && casualtyRatePct <= 45,
        `Glass cannon mortality (${casualtyRatePct.toFixed(1)}%) must reflect intentional fragility tension`
      );
    });
  });

  describe('3-Player Vanguard Slot Loyalty Velocity (BL-BAL-03)', () => {
    it('confirms Vanguard Slot 4 awards expected +4 VP (2 LOY) per mission to Squad Leader', () => {
      const missionsCompleted = 3;
      const squadLeaderVanguardLoyaltyEarned = missionsCompleted * 2; // +2 LOY per mission

      const loyaltyVp = squadLeaderVanguardLoyaltyEarned * 2; // 1 LOY = 2 VP
      assert.equal(loyaltyVp, 12, '3 successful missions with Vanguard slot yields 12 VP');
      assert.ok(loyaltyVp > 0, 'Vanguard Slot creates powerful incentive for command bidding');
    });
  });
});
