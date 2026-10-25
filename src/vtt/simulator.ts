/**
 * AWAY TEAM — 6.0 STATIC DICE ENGINE & MONTE CARLO BALANCE SIMULATOR
 *
 * Provides deterministic Expected Success (ES) calculations, Operational Momentum
 * formulas, and 1,000-trial Monte Carlo stage/mission simulations for VTT hints
 * and automated balance verification.
 */

export interface SimOperativeInput {
  id: string;
  title: string;
  className: string;
  threshold: 3 | 4 | 5; // 3+ Primary, 4+ Secondary/Bridge, 5+ Out of Focus
  committedDice: number;
  currentHp: number;
  armorBuffer: number;
  ignoreFirstBackfire?: boolean; // e.g., Aegis Tier 1 CQC Drill
}

export interface StageSimulationResult {
  trials: number;
  targetDifficulty: number;
  totalDiceCommitted: number;
  theoreticalExpectedSuccesses: number;
  theoreticalExpectedBackfires: number;
  clearProbabilityPct: number;
  earlyPhase1ClearProbabilityPct: number;
  momentumProbabilityPct: number;
  averageSuccesses: number;
  averageMomentumGenerated: number;
  averageHpLost: number;
  zeroHpCasualtyProbabilityPct: number;
  tacticalVerdict: string;
}

/**
 * Expected Successes (ES) per single d6 die at a given Focus threshold:
 *  - 3+ (Primary): 4/6 = 0.6667 ES
 *  - 4+ (Secondary/Bridged): 3/6 = 0.5000 ES
 *  - 5+ (Out of Focus): 2/6 = 0.3333 ES
 */
export function expectedSuccessPerDie(threshold: number): number {
  if (threshold <= 3) return 4 / 6;
  if (threshold === 4) return 3 / 6;
  return 2 / 6;
}

/**
 * Standardized Backfire probability per rolled d6 die (natural 1 = 1/6 = 16.67%).
 */
export const BACKFIRE_PROB_PER_DIE = 1 / 6;

/**
 * Canonical Operational Momentum ([MOM]) formula from /game/core/dice_system.md:
 *   For Total Successes >= D + 2:
 *     Momentum = Total Successes - D - 1
 *   Otherwise:
 *     Momentum = 0
 */
export function calculateOperationalMomentum(
  totalSuccesses: number,
  targetDifficulty: number
): number {
  if (totalSuccesses >= targetDifficulty + 2) {
    return totalSuccesses - targetDifficulty - 1;
  }
  return 0;
}

/**
 * Evaluates a character's 9.0 ES budget breakdown from /game/core/math_and_balance.md:
 *   Total ES = (HP * 1.5) + (Static Dice * 0.5) + Unique Power ES + Class Offset
 */
export function evaluateCharacterBudgetES(params: {
  hpCap: number;
  staticDice: number;
  powerEs: number;
  className: string;
}): {
  hpEs: number;
  diceEs: number;
  powerEs: number;
  classOffsetEs: number;
  totalEs: number;
} {
  const hpEs = params.hpCap * 1.5;
  const diceEs = params.staticDice * 0.5;
  const lc = (params.className || '').toLowerCase();
  const classOffsetEs =
    lc === 'survivalist' ? 1.0 : lc === 'scientist' ? 0.5 : 0.0;
  const totalEs =
    Math.round((hpEs + diceEs + params.powerEs + classOffsetEs) * 100) / 100;
  return {
    hpEs,
    diceEs,
    powerEs: params.powerEs,
    classOffsetEs,
    totalEs,
  };
}

/**
 * Runs a Monte Carlo simulation (default 1,000 trials) of the 5-step Stage Resolution
 * Micro-Loop (including Phase 1 Specialist Early Resolution Check and Phase 2 Support).
 */
export function simulateStageMonteCarlo(
  operatives: SimOperativeInput[],
  targetDifficulty: number,
  trials = 1000,
  rng: () => number = Math.random
): StageSimulationResult {
  const safeTrials = Math.max(100, Math.min(10000, trials));
  const safeTarget = Math.max(1, targetDifficulty);

  const totalDiceCommitted = operatives.reduce(
    (sum, op) => sum + Math.max(0, op.committedDice),
    0
  );

  const theoreticalExpectedSuccesses = operatives.reduce(
    (sum, op) =>
      sum + Math.max(0, op.committedDice) * expectedSuccessPerDie(op.threshold),
    0
  );

  const theoreticalExpectedBackfires = operatives.reduce((sum, op) => {
    const rawExpected = Math.max(0, op.committedDice) * BACKFIRE_PROB_PER_DIE;
    return sum + Math.max(0, rawExpected - op.armorBuffer);
  }, 0);

  let clears = 0;
  let earlyPhase1Clears = 0;
  let momentumTriggers = 0;
  let sumSuccesses = 0;
  let sumMomentum = 0;
  let sumHpLost = 0;
  let casualtyTrials = 0;

  const phase1Ops = operatives.filter((op) => op.threshold === 3 && op.committedDice > 0);
  const phase2Ops = operatives.filter((op) => op.threshold > 3 && op.committedDice > 0);

  for (let t = 0; t < safeTrials; t++) {
    let trialSuccesses = 0;
    let trialHpLost = 0;
    let anyZeroHp = false;

    // Step 2: Phase 1 Initiative (Primary 3+ Specialists)
    for (const op of phase1Ops) {
      let opBackfires = 0;
      for (let d = 0; d < op.committedDice; d++) {
        const face = Math.floor(rng() * 6) + 1;
        if (face >= op.threshold) trialSuccesses++;
        if (face === 1) opBackfires++;
      }
      if (op.ignoreFirstBackfire && opBackfires > 0) {
        opBackfires -= 1;
      }
      const netDamage = Math.max(0, opBackfires - op.armorBuffer);
      trialHpLost += netDamage;
      if (op.currentHp - netDamage <= 0) {
        anyZeroHp = true;
      }
    }

    const clearedInPhase1 = trialSuccesses >= safeTarget;
    if (clearedInPhase1) {
      earlyPhase1Clears++;
    } else {
      // Step 3: Phase 2 Initiative (Support 4+ / 5+ only roll if Phase 1 did not clear!)
      for (const op of phase2Ops) {
        let opBackfires = 0;
        for (let d = 0; d < op.committedDice; d++) {
          const face = Math.floor(rng() * 6) + 1;
          if (face >= op.threshold) trialSuccesses++;
          if (face === 1) opBackfires++;
        }
        if (op.ignoreFirstBackfire && opBackfires > 0) {
          opBackfires -= 1;
        }
        const netDamage = Math.max(0, opBackfires - op.armorBuffer);
        trialHpLost += netDamage;
        if (op.currentHp - netDamage <= 0) {
          anyZeroHp = true;
        }
      }
    }

    if (trialSuccesses >= safeTarget) {
      clears++;
    }
    const mom = calculateOperationalMomentum(trialSuccesses, safeTarget);
    if (mom > 0) {
      momentumTriggers++;
      sumMomentum += mom;
    }

    sumSuccesses += trialSuccesses;
    sumHpLost += trialHpLost;
    if (anyZeroHp) casualtyTrials++;
  }

  const clearProbabilityPct = Math.round((clears / safeTrials) * 1000) / 10;
  const earlyPhase1ClearProbabilityPct =
    Math.round((earlyPhase1Clears / safeTrials) * 1000) / 10;
  const momentumProbabilityPct =
    Math.round((momentumTriggers / safeTrials) * 1000) / 10;
  const averageSuccesses = Math.round((sumSuccesses / safeTrials) * 100) / 100;
  const averageMomentumGenerated =
    Math.round((sumMomentum / safeTrials) * 100) / 100;
  const averageHpLost = Math.round((sumHpLost / safeTrials) * 100) / 100;
  const zeroHpCasualtyProbabilityPct =
    Math.round((casualtyTrials / safeTrials) * 1000) / 10;

  let tacticalVerdict = '';
  if (clearProbabilityPct >= 85) {
    tacticalVerdict =
      'HIGH CONFIDENCE CLEAR: Strong dice commitment. High chance of generating Operational Momentum ([MOM]) die refunds.';
  } else if (clearProbabilityPct >= 60) {
    tacticalVerdict =
      'MODERATE RISK: Consider committing +1–2 more static dice or spending [1 EF] on Lock and Load / Adaptive Calibration to secure the clear.';
  } else {
    tacticalVerdict =
      'DANGER — LIKELY STAGE FAILURE: Expected successes fall below Target Difficulty D. Trigger a Dynamic Focus Swap, Dual-Vector Mapping ([1 EF]), or commit more Specialist dice!';
  }

  return {
    trials: safeTrials,
    targetDifficulty: safeTarget,
    totalDiceCommitted,
    theoreticalExpectedSuccesses:
      Math.round(theoreticalExpectedSuccesses * 100) / 100,
    theoreticalExpectedBackfires:
      Math.round(theoreticalExpectedBackfires * 100) / 100,
    clearProbabilityPct,
    earlyPhase1ClearProbabilityPct,
    momentumProbabilityPct,
    averageSuccesses,
    averageMomentumGenerated,
    averageHpLost,
    zeroHpCasualtyProbabilityPct,
    tacticalVerdict,
  };
}
