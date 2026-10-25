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
