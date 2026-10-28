/**
 * AWAY TEAM — Pure Functional VTT Rules & Resolution Engine (6.0 Spec)
 * ---------------------------------------------------------------------
 * Shared by the browser Virtual Tabletop (src/vtt/VirtualTabletop.tsx)
 * and the automated test suites (tests/04-wiki-and-vtt-functionality.test.js).
 */

/**
 * Computes an operative's target roll threshold (3+, 4+, or 5+) and role
 * based on stage primary focus, optional concurrent focus (Scientist), and item bridges.
 */
export function computeFocusThreshold({
  primaryFocus,
  secondaryFocus = null,
  itemBridgeFocuses = [],
  stagePrimaryFocus,
  stageConcurrentFocus = null,
}) {
  const activeStageFocuses = [stagePrimaryFocus, stageConcurrentFocus]
    .filter(Boolean)
    .map((f) => String(f).toLowerCase());

  const opPrimary = primaryFocus ? String(primaryFocus).toLowerCase() : null;
  const opSecondary = secondaryFocus ? String(secondaryFocus).toLowerCase() : null;
  const bridges = (itemBridgeFocuses || [])
    .filter(Boolean)
    .map((b) => String(b).toLowerCase());

  if (opPrimary && activeStageFocuses.includes(opPrimary)) {
    return {
      threshold: 3,
      role: 'Phase 1: Primary Specialist (3+)',
      isOutOfFocus: false,
    };
  }

  if (
    (opSecondary && activeStageFocuses.includes(opSecondary)) ||
    bridges.some((b) => activeStageFocuses.includes(b))
  ) {
    return {
      threshold: 4,
      role: 'Phase 1: Secondary/Bridge Specialist (4+)',
      isOutOfFocus: false,
    };
  }

  return {
    threshold: 5,
    role: 'Phase 2: Vanguard Assist (5+)',
    isOutOfFocus: true,
  };
}

/**
 * Evaluates a rolled static dice pool against a threshold.
 * Natural 1s trigger Backfire hazards ONLY when rolling Out of Focus (5+),
 * unless negated by Survivalist's Hostile Environment Mastery (ignoreNaturalOnes).
 */
export function evaluateDiceRoll(
  rolledDice,
  threshold,
  isOutOfFocus = threshold === 5,
  ignoreNaturalOnes = false
) {
  const hits = rolledDice.filter((d) => d >= threshold).length;
  const backfires =
    isOutOfFocus && !ignoreNaturalOnes
      ? rolledDice.filter((d) => d === 1).length
      : 0;
  const misses = rolledDice.length - hits;
  return { hits, misses, backfires };
}

/**
 * Evaluates stage resolution and Operational Momentum ([MOM]).
 * Momentum is awarded when totalSuccesses >= targetDifficulty + 2.
 */
export function evaluateStageOutcome(totalSuccesses, targetDifficulty) {
  const cleared = totalSuccesses >= targetDifficulty;
  const margin = totalSuccesses - targetDifficulty;
  const momentumEarned = totalSuccesses >= targetDifficulty + 2;
  return { cleared, margin, momentumEarned };
}

/**
 * Calculates scaled stage target difficulty: ceil(3.5 * playerCount) + modifierDelta
 * (Minimum difficulty of 1).
 */
export function calculateTargetDifficulty(playerCount, modifierDelta = 0) {
  const base = Math.ceil(3.5 * playerCount);
  return Math.max(1, base + modifierDelta);
}

/**
 * Resolves the Command Auction according to the canonical tie-breaker hierarchy:
 * 1. Highest Credit [CR] bid
 * 2. Highest Political Influence [PIP]
 * 3. Lowest deployed operative Loyalty [LOY]
 * 4. Lowest player index
 */
export function resolveCommandAuction(bids) {
  if (!bids || bids.length === 0) return null;
  const sorted = [...bids].sort((a, b) => {
    if (b.commandBid !== a.commandBid) return b.commandBid - a.commandBid;
    if ((b.pip ?? 0) !== (a.pip ?? 0)) return (b.pip ?? 0) - (a.pip ?? 0);
    if ((a.operativeLoyalty ?? 1) !== (b.operativeLoyalty ?? 1)) {
      return (a.operativeLoyalty ?? 1) - (b.operativeLoyalty ?? 1);
    }
    return (a.playerIndex ?? 0) - (b.playerIndex ?? 0);
  });
  return sorted[0];
}

/**
 * Validates whether a candidate item can be equipped onto an operative's
 * 6-Slot Anatomical Grid ([Head], [Body], [Legs], [Pack], [Hand L], [Hand R]).
 */
export function validateSlotLoadout(equippedItems, candidateItem) {
  const candidateSlots = candidateItem?.stats?.slots_required || [];
  if (candidateSlots.length === 0) {
    // Consumables and Belt/Complex items without anatomical slot locks can always be carried
    return { valid: true, reason: null };
  }

  let currentHandsUsed = 0;
  const occupiedBodySlots = new Set();

  for (const item of equippedItems) {
    const slots = item?.stats?.slots_required || [];
    for (const slot of slots) {
      if (String(slot).toLowerCase().includes('hand')) {
        currentHandsUsed += 1;
      } else {
        occupiedBodySlots.add(slot);
      }
    }
  }

  const candidateHandCount = candidateSlots.filter((s) =>
    String(s).toLowerCase().includes('hand')
  ).length;

  if (currentHandsUsed + candidateHandCount > 2) {
    return {
      valid: false,
      reason: `Exceeds 2 Hand slots (currently using ${currentHandsUsed}/2 hands, item requires ${candidateHandCount}).`,
    };
  }

  for (const slot of candidateSlots) {
    if (String(slot).toLowerCase().includes('hand')) continue;
    if (occupiedBodySlots.has(slot)) {
      return {
        valid: false,
        reason: `Slot [${slot}] is already occupied.`,
      };
    }
  }

  return { valid: true, reason: null };
}

/**
 * Evaluates Med Bay 2d6 recovery roll (5+ baseline, 4+ with Surgical Wing).
 */
export function evaluateMedBayRecovery(diceRolls, hasSurgicalWing = false) {
  const target = hasSurgicalWing ? 4 : 5;
  const hpRestored = diceRolls.filter((d) => d >= target).length;
  return { target, hpRestored };
}

/**
 * Evaluates the 1d6 Critical Injury Stabilization table when an operative drops to 0 HP.
 */
export function resolveCriticalInjuryRoll(d6Roll) {
  if (d6Roll <= 2) {
    return {
      roll: d6Roll,
      name: 'Flesh Wound',
      dicePenalty: 0,
      hpPenalty: 0,
    };
  }
  if (d6Roll <= 4) {
    return {
      roll: d6Roll,
      name: 'Severed Tendon / Concussion',
      dicePenalty: 1,
      hpPenalty: 0,
    };
  }
  return {
    roll: d6Roll,
    name: 'Shattered Carapace / Organ Trauma',
    dicePenalty: 0,
    hpPenalty: 1,
  };
}


/**
 * 7-Step Guided Game Loop Sequencer Metadata (Following /game/core/rules_overview.md)
 */
export const VTT_SEQUENCE_STEPS = [
  {
    step: 1,
    code: 'STEP_1_BRIEFING',
    shortTitle: '1. Briefing & Swaps',
    fullTitle: 'Step 1: Stage Briefing, Modifiers & Dynamic Focus Swaps',
    phaseGroup: 'Mission Stage Micro-Loop',
    coachHint:
      'Reveal the Stage Card and attach 1 Stage Modifier. The Squad Leader may declare Force Breach (shift to [Combat]) or Tactical Bypass (shift to non-combat). Recon, Scientist (Dual-Vector Mapping), and Diplomat (Strategic Alignment) may spend [1 EF] now. Players may broker Binding Promises ([CR] / items).',
  },
  {
    step: 2,
    code: 'STEP_2_PHASE1_SPECIALISTS',
    shortTitle: '2. Phase 1: Specialists (3+)',
    fullTitle: 'Step 2: Phase 1 Initiative — Primary Focus Specialists (3+)',
    phaseGroup: 'Mission Stage Micro-Loop',
    coachHint:
      'Each player independently chooses how many dice their specialist commits (from 0 to available stamina; holding back preserves stamina and avoids Backfires). Operatives whose Primary Focus matches the active room Focus act first! Commit static dice from their remaining pool and roll (3, 4, 5, 6 = Success; natural 1 = 1 HP Backfire). EARLY RESOLUTION: If Phase 1 successes meet or exceed Target Difficulty D, the stage is cleared immediately and Phase 2 Support skips rolling!',
  },
  {
    step: 3,
    code: 'STEP_3_PHASE2_SUPPORT',
    shortTitle: '3. Phase 2: Support (4+/5+)',
    fullTitle: 'Step 3: Phase 2 Initiative — Support Operatives (4+ Secondary / 5+ Out of Focus)',
    phaseGroup: 'Mission Stage Micro-Loop',
    coachHint:
      'If Phase 1 Specialists did not reach Target Difficulty D (and Technician did not close the gap with Adaptive Calibration), each player with remaining Support operatives independently chooses how many dice to commit (from 0 to available stamina). Non-Primary operatives commit and roll static dice: Secondary/Bridged Focus hits on 4+; Out of Focus hits on 5+.',
  },
  {
    step: 4,
    code: 'STEP_4_TRIAGE',
    shortTitle: '4. Triage & 0 HP Check',
    fullTitle: 'Step 4: Post-Initiative Triage & Emergency Stabilization Window',
    phaseGroup: 'Mission Stage Micro-Loop',
    coachHint:
      'Trigger reactive damage mitigation (Survivalist Emergency Field Medicine [1 EF] heals up to 2 stage HP). If any operative is at 0 HP, any Faction may spend [1 EF] or discard a Medical Consumable to stabilize them at 1 HP—otherwise they are KIA (Martyr: +2 [PIP] to owner, and rivals may claim dropped gear via the [-1 PIP] Vulture Tax).',
  },
  {
    step: 5,
    code: 'STEP_5_MOMENTUM',
    shortTitle: '5. Resolution & [MOM]',
    fullTitle: 'Step 5: Stage Resolution & Operational Momentum ([MOM]) Distribution',
    phaseGroup: 'Mission Stage Micro-Loop',
    coachHint:
      'Compare total successes against Target Difficulty D. If Successes >= D + 2, generate Operational Momentum: MOM = Successes - D - 1. The Squad Leader immediately spends [1 MOM] to restore 1 spent static die to any operative who committed and rolled >= 1 die in this stage!',
  },
  {
    step: 6,
    code: 'STEP_6_TRANSITION',
    shortTitle: '6. Transition & Resupply',
    fullTitle: 'Step 6: Between-Stage Transition, Logistical Refresh & Retreat Check',
    phaseGroup: 'Mission Stage Micro-Loop',
    coachHint:
      'Before revealing the next stage, the Squad Leader may spend [2 EF] (restore +1 spent static die to all 4 operatives) or [3 EF] (restore +2 spent static dice to all 4 operatives), or call a Tactical Retreat if >50% of squad dice are spent or an operative is at 1 HP.',
  },
  {
    step: 7,
    code: 'STEP_7_HQ_DOWNTIME',
    shortTitle: '7. HQ Downtime (8 Steps)',
    fullTitle: 'Step 7: Agency HQ Downtime — Debrief, Med Bay, Sponsorships & Command Auction',
    phaseGroup: 'Macro Campaign Loop',
    coachHint:
      'Return to Agency HQ: (1) Award mission [CR]/[PIP] and [+1 LOY] to surviving operatives (+2 LOY to winning Squad Leader), (2) Stand-Down Auction, (3) Infirmary Bed Healing Dice (5+/4+), (4) Sponsor HQ Modules (+1 PIP / +2 VP), (5) Recruitment Bureau ([8 CR]), (6) Quartermaster Armory, (7) Boardroom Perks, (8) Command Auction for next drop.',
  },
];

/**
 * Expected Successes (ES) per single d6 die at a given Focus threshold (3+, 4+, 5+).
 */
export function expectedSuccessPerDie(threshold) {
  if (threshold <= 3) return 4 / 6;
  if (threshold === 4) return 3 / 6;
  return 2 / 6;
}

/**
 * Canonical Operational Momentum ([MOM]) formula from /game/core/dice_system.md:
 *   MOM = Total Successes - D - 1 (for Total Successes >= D + 2)
 */
export function calculateOperationalMomentum(totalSuccesses, targetDifficulty) {
  if (totalSuccesses >= targetDifficulty + 2) {
    return totalSuccesses - targetDifficulty - 1;
  }
  return 0;
}

/**
 * Evaluates a character's 9.0 ES budget breakdown from /game/core/math_and_balance.md.
 */
export function evaluateCharacterBudgetES({
  hpCap,
  staticDice,
  powerEs,
  className,
}) {
  const hpEs = hpCap * 1.5;
  const diceEs = staticDice * 0.5;
  const lc = String(className || '').toLowerCase();
  const classOffsetEs =
    lc === 'survivalist' ? 1.0 : lc === 'scientist' ? 0.5 : 0.0;
  const totalEs =
    Math.round((hpEs + diceEs + powerEs + classOffsetEs) * 100) / 100;
  return {
    hpEs,
    diceEs,
    powerEs,
    classOffsetEs,
    totalEs,
  };
}

/**
 * Runs a 1,000-trial Monte Carlo simulation of the 5-step Stage Resolution Micro-Loop.
 */
export function simulateStageMonteCarlo(
  operatives,
  targetDifficulty,
  trials = 1000,
  rng = Math.random
) {
  const safeTrials = Math.max(100, Math.min(10000, trials));
  const safeTarget = Math.max(1, targetDifficulty);

  const totalDiceCommitted = operatives.reduce(
    (sum, op) => sum + Math.max(0, op.committedDice || 0),
    0
  );

  const theoreticalExpectedSuccesses = operatives.reduce(
    (sum, op) =>
      sum +
      Math.max(0, op.committedDice || 0) * expectedSuccessPerDie(op.threshold),
    0
  );

  const theoreticalExpectedBackfires = operatives.reduce((sum, op) => {
    const rawExpected = Math.max(0, op.committedDice || 0) * (1 / 6);
    return sum + Math.max(0, rawExpected - (op.armorBuffer || 0));
  }, 0);

  let clears = 0;
  let earlyPhase1Clears = 0;
  let momentumTriggers = 0;
  let sumSuccesses = 0;
  let sumMomentum = 0;
  let sumHpLost = 0;
  let casualtyTrials = 0;

  const phase1Ops = operatives.filter(
    (op) => op.threshold === 3 && (op.committedDice || 0) > 0
  );
  const phase2Ops = operatives.filter(
    (op) => op.threshold > 3 && (op.committedDice || 0) > 0
  );

  for (let t = 0; t < safeTrials; t++) {
    let trialSuccesses = 0;
    let trialHpLost = 0;
    let anyZeroHp = false;

    for (const op of phase1Ops) {
      let opBackfires = 0;
      for (let d = 0; d < op.committedDice; d++) {
        const face = Math.floor(rng() * 6) + 1;
        if (face >= op.threshold) trialSuccesses++;
        if (face === 1) opBackfires++;
      }
      if (op.ignoreFirstBackfire && opBackfires > 0) opBackfires -= 1;
      const netDamage = Math.max(0, opBackfires - (op.armorBuffer || 0));
      trialHpLost += netDamage;
      if ((op.currentHp || 3) - netDamage <= 0) anyZeroHp = true;
    }

    const clearedInPhase1 = trialSuccesses >= safeTarget;
    if (clearedInPhase1) {
      earlyPhase1Clears++;
    } else {
      for (const op of phase2Ops) {
        let opBackfires = 0;
        for (let d = 0; d < op.committedDice; d++) {
          const face = Math.floor(rng() * 6) + 1;
          if (face >= op.threshold) trialSuccesses++;
          if (face === 1) opBackfires++;
        }
        if (op.ignoreFirstBackfire && opBackfires > 0) opBackfires -= 1;
        const netDamage = Math.max(0, opBackfires - (op.armorBuffer || 0));
        trialHpLost += netDamage;
        if ((op.currentHp || 3) - netDamage <= 0) anyZeroHp = true;
      }
    }

    if (trialSuccesses >= safeTarget) clears++;
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
    averageSuccesses: Math.round((sumSuccesses / safeTrials) * 100) / 100,
    averageMomentumGenerated:
      Math.round((sumMomentum / safeTrials) * 100) / 100,
    averageHpLost: Math.round((sumHpLost / safeTrials) * 100) / 100,
    zeroHpCasualtyProbabilityPct:
      Math.round((casualtyTrials / safeTrials) * 1000) / 10,
    tacticalVerdict,
  };
}
