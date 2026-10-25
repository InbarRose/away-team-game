export function computeFocusThreshold(params: {
  primaryFocus?: string | null;
  secondaryFocus?: string | null;
  itemBridgeFocuses?: (string | null | undefined)[];
  stagePrimaryFocus: string;
  stageConcurrentFocus?: string | null;
}): {
  threshold: number;
  role: string;
  isOutOfFocus: boolean;
};

export function evaluateDiceRoll(
  rolledDice: number[],
  threshold: number,
  isOutOfFocus?: boolean,
  ignoreNaturalOnes?: boolean
): {
  hits: number;
  misses: number;
  backfires: number;
};

export function evaluateStageOutcome(
  totalSuccesses: number,
  targetDifficulty: number
): {
  cleared: boolean;
  margin: number;
  momentumEarned: boolean;
};

export function calculateTargetDifficulty(
  playerCount: number,
  modifierDelta?: number
): number;

export function resolveCommandAuction<
  T extends {
    playerIndex?: number;
    commandBid: number;
    pip?: number;
    operativeLoyalty?: number;
  }
>(bids: T[]): T | null;

export function validateSlotLoadout(
  equippedItems: any[],
  candidateItem: any
): {
  valid: boolean;
  reason: string | null;
};

export function evaluateMedBayRecovery(
  diceRolls: number[],
  hasSurgicalWing?: boolean
): {
  target: number;
  hpRestored: number;
};

export function resolveCriticalInjuryRoll(d6Roll: number): {
  roll: number;
  name: string;
  dicePenalty: number;
  hpPenalty: number;
};
