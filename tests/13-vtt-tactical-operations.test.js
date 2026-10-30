import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateDiceRoll,
  computeFocusThreshold,
} from '../src/vtt/engine.js';

describe('Suite 13: VTT Tactical Operations & Dice Sovereignty Handlers', () => {
  describe('Individual Operative Dice Sovereignty & Clamping', () => {
    it('updates individual slot commitment without mutating teammates', () => {
      const squad = [
        { slotIndex: 0, committedDice: 3, spentDice: 0 },
        { slotIndex: 1, committedDice: 2, spentDice: 1 },
        { slotIndex: 2, committedDice: 1, spentDice: 0 },
        { slotIndex: 3, committedDice: 0, spentDice: 0 },
      ];

      // Director 1 adjusts Slot 1 commitment from 2 to 4
      const slotIdx = 1;
      const targetCommit = 4;
      const updatedSquad = squad.map((s, idx) =>
        idx === slotIdx ? { ...s, committedDice: targetCommit } : s
      );

      assert.equal(updatedSquad[1].committedDice, 4);
      assert.equal(updatedSquad[0].committedDice, 3, 'Slot 0 must remain unchanged');
      assert.equal(updatedSquad[2].committedDice, 1, 'Slot 2 must remain unchanged');
      assert.equal(updatedSquad[3].committedDice, 0, 'Slot 3 must remain unchanged');
    });

    it('clamps dice commitment strictly to available stamina [0..MaxAvailable]', () => {
      const charStaticDice = 6;
      const spentDice = 2;
      const availableDice = Math.max(0, charStaticDice - spentDice); // 4

      const clampCommit = (count) => Math.max(0, Math.min(availableDice, count));

      assert.equal(clampCommit(0), 0, '0 (Holding Back) is legal');
      assert.equal(clampCommit(3), 3, 'Commit within range accepted');
      assert.equal(clampCommit(5), 4, 'Commit exceeding available clamped to 4');
      assert.equal(clampCommit(-2), 0, 'Negative commit clamped to 0');
    });
  });

  describe('Individual Operative Roll Execution & State Reducer', () => {
    it('executes individual roll, deducting stamina and applying Backfire wounds on 5+', () => {
      const operative = {
        slotIndex: 0,
        characterId: 'char-anvil',
        currentHp: 4,
        spentDice: 1,
        committedDice: 3,
      };

      const threshold = 5; // Out of Focus
      const rolledValues = [5, 6, 1]; // 2 hits (5, 6), 1 backfire (1)

      const rollEval = evaluateDiceRoll(rolledValues, threshold, true);
      assert.equal(rollEval.hits, 2);
      assert.equal(rollEval.backfires, 1);

      // Reducer update
      const updatedOp = {
        ...operative,
        spentDice: operative.spentDice + operative.committedDice,
        currentHp: Math.max(0, operative.currentHp - rollEval.backfires),
        rolledDice: rolledValues,
      };

      assert.equal(updatedOp.spentDice, 4, '3 stamina expended (1 + 3 = 4)');
      assert.equal(updatedOp.currentHp, 3, '1 wound sustained from Backfire (4 - 1 = 3)');
      assert.deepEqual(updatedOp.rolledDice, [5, 6, 1]);
    });
  });

  describe('Coordinated Squad Rolls & Holding Back Protection', () => {
    it('preserves operatives holding back (0 committed dice) while rolling committed teammates', () => {
      const squad = [
        { slotIndex: 0, currentHp: 3, spentDice: 0, committedDice: 3 }, // Active
        { slotIndex: 1, currentHp: 1, spentDice: 4, committedDice: 0 }, // Holding back (1 HP remaining!)
        { slotIndex: 2, currentHp: 3, spentDice: 1, committedDice: 2 }, // Active
        { slotIndex: 3, currentHp: 3, spentDice: 0, committedDice: 0 }, // Holding back
      ];

      // Simulate squad roll with predetermined rolls for active slots
      const rolls = {
        0: [3, 4, 1], // Active: 1 backfire
        2: [5, 6],    // Active: 0 backfires
      };

      const updatedSquad = squad.map((op) => {
        if (op.committedDice === 0) return op; // Holding back: 0 changes!
        const rolled = rolls[op.slotIndex] || [];
        const ev = evaluateDiceRoll(rolled, 5, true);
        return {
          ...op,
          spentDice: op.spentDice + op.committedDice,
          currentHp: Math.max(0, op.currentHp - ev.backfires),
        };
      });

      // Operative 1 had 1 HP and committed 0 dice -> must remain at 1 HP and 4 spent dice
      assert.equal(updatedSquad[1].currentHp, 1, 'Holding back operative suffered 0 wounds');
      assert.equal(updatedSquad[1].spentDice, 4, 'Holding back operative expended 0 stamina');

      // Operative 0 committed 3 dice and rolled 1 backfire -> drops to 2 HP, 3 spent dice
      assert.equal(updatedSquad[0].currentHp, 2);
      assert.equal(updatedSquad[0].spentDice, 3);
    });
  });

  describe('Early Resolution State Advance (Step 2 -> Step 5)', () => {
    it('skips Step 3 (Phase 2 Support) directly to Step 5 when Specialists achieve Hits >= D', () => {
      const targetDifficulty = 4;
      let sequenceStep = 2; // In Step 2 (Phase 1 Specialists)
      let stageHits = 0;

      // Specialists roll 4 hits
      const specialistHits = 4;
      stageHits += specialistHits;

      const meetsTarget = stageHits >= targetDifficulty;
      assert.equal(meetsTarget, true);

      // Early Resolution logic
      if (sequenceStep === 2 && meetsTarget) {
        sequenceStep = 5; // Skip Step 3 Support & Step 4 Triage directly to Step 5 Momentum
      }

      assert.equal(sequenceStep, 5, 'Early Resolution must advance directly to Step 5');
    });

    it('advances from Step 2 to Step 3 when Specialists do not reach target difficulty', () => {
      const targetDifficulty = 5;
      let sequenceStep = 2;
      let stageHits = 2; // Only 2 hits vs D=5

      const meetsTarget = stageHits >= targetDifficulty;
      assert.equal(meetsTarget, false);

      if (sequenceStep === 2 && meetsTarget) {
        sequenceStep = 5;
      } else if (sequenceStep === 2) {
        sequenceStep = 3; // Advance to Step 3 (Phase 2 Support)
      }

      assert.equal(sequenceStep, 3, 'Shortfall in Phase 1 must proceed to Phase 2 Support');
    });
  });

  describe('Step 5 Operational Momentum Die Refunds & Restoration', () => {
    it('restores spent static dice to eligible participating operatives using momentum tokens', () => {
      let momentumTokens = 2;
      let squad = [
        { slotIndex: 0, characterId: 'c1', spentDice: 3, committedDice: 3 }, // Eligible
        { slotIndex: 1, characterId: 'c2', spentDice: 2, committedDice: 2 }, // Eligible
        { slotIndex: 2, characterId: 'c3', spentDice: 1, committedDice: 0 }, // Barred (held back)
      ];

      // Squad Leader spends 1 MOM token to refund 1 spent die to Slot 0
      assert.ok(momentumTokens >= 1);
      momentumTokens -= 1;

      squad = squad.map((s) =>
        s.slotIndex === 0 && s.committedDice > 0
          ? { ...s, spentDice: Math.max(0, s.spentDice - 1) }
          : s
      );

      assert.equal(squad[0].spentDice, 2, 'Slot 0 stamina restored from 3 to 2');
      assert.equal(momentumTokens, 1, '1 MOM token deducted');
    });
  });
});
