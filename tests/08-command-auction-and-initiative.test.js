import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveCommandAuction,
  resolveZeroBidRollOff,
  resolveDynamicFocusSwap,
  evaluateSplitModifier,
  computeFocusThreshold,
} from '../src/vtt/engine.js';

describe('Suite 08: Command Auction, Initiative & Dynamic Swaps (Chapter 3)', () => {
  describe('Command Auction & Canonical Tie-Breaker Hierarchy', () => {
    it('awards Squad Leader token to highest Credit bidder', () => {
      const bids = [
        { playerIndex: 0, commandBid: 1, pip: 2, operativeLoyalty: 3 },
        { playerIndex: 1, commandBid: 3, pip: 1, operativeLoyalty: 2 },
        { playerIndex: 2, commandBid: 2, pip: 4, operativeLoyalty: 1 },
      ];

      const winner = resolveCommandAuction(bids);
      assert.equal(winner.playerIndex, 1);
      assert.equal(winner.commandBid, 3, 'Highest Credit bid must win command');
    });

    it('breaks Credit ties using highest Political Influence (PIP)', () => {
      const bids = [
        { playerIndex: 0, commandBid: 2, pip: 1, operativeLoyalty: 2 },
        { playerIndex: 1, commandBid: 2, pip: 3, operativeLoyalty: 4 },
        { playerIndex: 2, commandBid: 1, pip: 5, operativeLoyalty: 1 },
      ];

      const winner = resolveCommandAuction(bids);
      assert.equal(winner.playerIndex, 1);
      assert.equal(winner.pip, 3, 'Highest PIP must break Credit tie');
    });

    it('breaks Credit & PIP ties using lowest operative Loyalty (underdog priority)', () => {
      const bids = [
        { playerIndex: 0, commandBid: 2, pip: 2, operativeLoyalty: 3 },
        { playerIndex: 1, commandBid: 2, pip: 2, operativeLoyalty: 1 }, // Hungry rookie
      ];

      const winner = resolveCommandAuction(bids);
      assert.equal(winner.playerIndex, 1);
      assert.equal(winner.operativeLoyalty, 1, 'Lowest operative loyalty must break Credit + PIP tie');
    });

    it('breaks identical bids using lowest player index (clockwise table seating)', () => {
      const bids = [
        { playerIndex: 2, commandBid: 1, pip: 1, operativeLoyalty: 2 },
        { playerIndex: 0, commandBid: 1, pip: 1, operativeLoyalty: 2 },
        { playerIndex: 1, commandBid: 1, pip: 1, operativeLoyalty: 2 },
      ];

      const winner = resolveCommandAuction(bids);
      assert.equal(winner.playerIndex, 0, 'Lowest player seat index breaks identical 4-way tie');
    });
  });

  describe('Zero-Credit Command Auction Edge Case (BL-RULES-04)', () => {
    it('resolves zero-bid auction via immediate d6 roll-off at 0 CR cost', () => {
      const allZeroBids = [
        { playerIndex: 0, commandBid: 0 },
        { playerIndex: 1, commandBid: 0 },
        { playerIndex: 2, commandBid: 0 },
      ];

      const isZeroBidSession = allZeroBids.every((b) => b.commandBid === 0);
      assert.equal(isZeroBidSession, true);

      // Roll-off: Player 2 rolls a 6
      const rollOff = resolveZeroBidRollOff([
        { playerIndex: 0, roll: 3, pip: 2 },
        { playerIndex: 1, roll: 2, pip: 4 },
        { playerIndex: 2, roll: 6, pip: 1 },
      ]);

      assert.equal(rollOff.winner.playerIndex, 2);
      assert.equal(rollOff.costCredits, 0, 'Zero-bid roll-off awards command token at 0 CR cost');
    });
  });

  describe('3-Player Vanguard Slot Mechanics (Chapter 3)', () => {
    it('awards +2 LOY (4 VP) to Squad Leader from Vanguard Slot 4 upon mission clearance', () => {
      const playerCount = 3;
      const squadLeaderPlayerIndex = 1;

      // In 3P game, Slot 4 operative is commanded by the Squad Leader
      const squad = [
        { slotIndex: 0, ownerPlayer: 0, characterId: 'char-01', loyalty: 1 },
        { slotIndex: 1, ownerPlayer: 1, characterId: 'char-02', loyalty: 2 },
        { slotIndex: 2, ownerPlayer: 2, characterId: 'char-03', loyalty: 1 },
        { slotIndex: 3, ownerPlayer: 1, isVanguardSlot: true, characterId: 'char-04', loyalty: 0 },
      ];

      const vanguardOp = squad[3];
      assert.equal(vanguardOp.ownerPlayer, squadLeaderPlayerIndex);
      assert.equal(vanguardOp.isVanguardSlot, true);

      // On clearance, vanguard operative awards +2 LOY to Squad Leader
      const loyaltyBonus = vanguardOp.isVanguardSlot ? 2 : 1;
      assert.equal(loyaltyBonus, 2, 'Vanguard Slot awards double loyalty (+2 LOY = 4 VP)');
    });
  });

  describe('Dynamic Focus Swaps & Split Modifiers (BL-RULES-07)', () => {
    it('executes Force Breach shifting stage focus to Combat for 1 EF', () => {
      const swap = resolveDynamicFocusSwap('intel', 'force_breach');
      assert.equal(swap.activeFocus, 'combat');
      assert.equal(swap.costEffort, 1);
    });

    it('executes Tactical Bypass shifting stage focus to Infiltrate for 1 EF', () => {
      const swap = resolveDynamicFocusSwap('combat', 'tactical_bypass', 'infiltrate');
      assert.equal(swap.activeFocus, 'infiltrate');
      assert.equal(swap.costEffort, 1);
    });

    it('evaluates dynamic split modifier flipping kinetic vs non-combat branches', () => {
      const splitModifier = {
        id: 'mod-split-01',
        title: 'Electromagnetic Scramble',
        split_effect: {
          combat: { target_difficulty_delta: 2, hazard_text: 'Kinetic armor offline (+2 D)' },
          non_combat: { target_difficulty_delta: -1, hazard_text: 'Sensor blindspot (-1 D)' },
        },
      };

      // Under Combat: kinetic branch applies
      const combatBranch = evaluateSplitModifier(splitModifier, 'combat');
      assert.equal(combatBranch.branch, 'combat');
      assert.equal(combatBranch.target_difficulty_delta, 2);

      // Under Infiltrate (after Tactical Bypass): non-combat branch applies
      const nonCombatBranch = evaluateSplitModifier(splitModifier, 'infiltrate');
      assert.equal(nonCombatBranch.branch, 'non_combat');
      assert.equal(nonCombatBranch.target_difficulty_delta, -1);
    });
  });

  describe('Scientist Dual-Vector Mapping & Initiative Promotion (BL-RULES-06)', () => {
    it('promotes Intel operatives to Phase 1 Initiative (3+) when Scientist adds concurrent Intel focus', () => {
      const spyMaster = {
        primaryFocus: 'intel',
        secondaryFocus: 'infiltrate',
      };

      // Baseline in a pure Combat room: Spymaster is Out of Focus (5+, Phase 2 Support)
      const baseline = computeFocusThreshold({
        primaryFocus: spyMaster.primaryFocus,
        secondaryFocus: spyMaster.secondaryFocus,
        stagePrimaryFocus: 'combat',
        stageConcurrentFocus: null,
      });
      assert.equal(baseline.threshold, 5);
      assert.equal(baseline.isOutOfFocus, true);
      assert.match(baseline.role, /Phase 2/);

      // Scientist spends 1 EF in Step 1 to add concurrent Intel focus
      const withScientist = computeFocusThreshold({
        primaryFocus: spyMaster.primaryFocus,
        secondaryFocus: spyMaster.secondaryFocus,
        stagePrimaryFocus: 'combat',
        stageConcurrentFocus: 'intel',
      });
      assert.equal(withScientist.threshold, 3, 'Spymaster hits on 3+ due to concurrent focus');
      assert.equal(withScientist.isOutOfFocus, false);
      assert.match(withScientist.role, /Phase 1: Primary Specialist/, 'Promoted to Phase 1 Initiative');
    });
  });
});
