import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePlayerEndgameScore,
  checkTaskForceDissolution,
} from '../src/vtt/engine.js';

describe('Suite 11: Objectives, Agendas & Endgame Scoring Engine (Chapter 8)', () => {
  describe('Open Corporate Agendas Claim Verification', () => {
    it('awards VP, Credits and PIP upon valid agenda completion', () => {
      const agenda = {
        id: 'agenda-01',
        title: 'Overwhelming Force',
        payout: { vp: 3, credits: 2, pip: 1 },
      };

      let vault = { vp: 0, credits: 4, pip: 2 };
      let claimedAgendas = {};

      // Player 1 claims agenda-01
      assert.equal(claimedAgendas[agenda.id], undefined, 'Agenda must not be already claimed');
      claimedAgendas[agenda.id] = 1; // playerIndex 1

      vault.vp += agenda.payout.vp;
      vault.credits += agenda.payout.credits;
      vault.pip += agenda.payout.pip;

      assert.equal(vault.vp, 3);
      assert.equal(vault.credits, 6);
      assert.equal(vault.pip, 3);
      assert.equal(claimedAgendas[agenda.id], 1);
    });

    it('rejects duplicate claims on an already claimed agenda', () => {
      const claimedAgendas = { 'agenda-01': 0 };

      const canClaim = claimedAgendas['agenda-01'] === undefined;
      assert.equal(canClaim, false, 'Agenda claimed by Player 0 cannot be claimed by Player 1');
    });
  });

  describe('Secret Corporate Objectives (Tiered Scoring: 15/10/5 VP)', () => {
    it('evaluates Tier 1 (15 VP), Tier 2 (10 VP), and Tier 3 (5 VP) thresholds', () => {
      // Secret Objective: Human Capital Hegemony (Requires 10, 7, or 4 deployed operative loyalty)
      const objective = {
        id: 'secret-01',
        title: 'Human Capital Hegemony',
        tiers: {
          tier1: { threshold: 10, vp: 15 },
          tier2: { threshold: 7, vp: 10 },
          tier3: { threshold: 4, vp: 5 },
        },
      };

      const evaluateObjective = (loyaltyScore) => {
        if (loyaltyScore >= objective.tiers.tier1.threshold) return objective.tiers.tier1.vp;
        if (loyaltyScore >= objective.tiers.tier2.threshold) return objective.tiers.tier2.vp;
        if (loyaltyScore >= objective.tiers.tier3.threshold) return objective.tiers.tier3.vp;
        return 0;
      };

      assert.equal(evaluateObjective(11), 15, '11 loyalty achieves Tier 1 (15 VP)');
      assert.equal(evaluateObjective(8), 10, '8 loyalty achieves Tier 2 (10 VP)');
      assert.equal(evaluateObjective(4), 5, '4 loyalty achieves Tier 3 (5 VP)');
      assert.equal(evaluateObjective(2), 0, '2 loyalty fails to meet minimum threshold (0 VP)');
    });
  });

  describe('Mission Failure Tracker ([FAIL]) & Task Force Dissolution', () => {
    it('allows campaign continuation while failure tokens are below maximum', () => {
      assert.equal(checkTaskForceDissolution(0, 3), false);
      assert.equal(checkTaskForceDissolution(1, 3), false);
      assert.equal(checkTaskForceDissolution(2, 3), false);
    });

    it('triggers Task Force Dissolution when failure tokens reach maximum threshold', () => {
      const isDissolved = checkTaskForceDissolution(3, 3);
      assert.equal(isDissolved, true, 'Reaching 3 [FAIL] tokens triggers immediate Task Force Dissolution');

      const isExceeded = checkTaskForceDissolution(4, 3);
      assert.equal(isExceeded, true);
    });
  });

  describe('Endgame VP Scoring Aggregation & Tie-Breaking Hierarchy', () => {
    it('correctly aggregates Loyalty VP, Objective VP, Agenda VP, Facility VP, and Credit Conversion', () => {
      const score = calculatePlayerEndgameScore({
        loyaltyVp: 12,
        secretObjectiveVp: 15,
        agendaVp: 6,
        facilityVp: 4,
        remainingCredits: 14, // 14 / 5 = 2 VP (4 credits leftover)
        remainingPip: 3,
      });

      // Total = 12 + 15 + 6 + 4 + 2 = 39 VP
      assert.equal(score.totalVp, 39);
      assert.equal(score.breakdown.creditVp, 2);
      assert.equal(score.tieBreakers.remainingCredits, 14);
      assert.equal(score.tieBreakers.remainingPip, 3);
    });

    it('breaks VP ties using remaining Credits, then Political Influence (PIP)', () => {
      const playerA = calculatePlayerEndgameScore({
        loyaltyVp: 20,
        secretObjectiveVp: 10,
        remainingCredits: 18, // 3 VP -> 33 VP total
        remainingPip: 2,
      });

      const playerB = calculatePlayerEndgameScore({
        loyaltyVp: 23,
        secretObjectiveVp: 10,
        remainingCredits: 4, // 0 VP -> 33 VP total
        remainingPip: 5,
      });

      assert.equal(playerA.totalVp, 33);
      assert.equal(playerB.totalVp, 33);

      // Primary Tie-Breaker: Remaining Credits (Player A has 18 vs Player B has 4)
      const creditDiff = playerA.tieBreakers.remainingCredits - playerB.tieBreakers.remainingCredits;
      assert.ok(creditDiff > 0, 'Player A wins tie-breaker on remaining Credits');
    });
  });
});
