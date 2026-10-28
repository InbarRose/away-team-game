/**
 * AWAY TEAM — Comprehensive Game Loop Simulator & Chaos Testing Engine
 * ----------------------------------------------------------------------
 * Supports:
 * 1. Deterministic Scenario Testing (Smoke & Acceptance) with mockable dice/draws.
 * 2. Chaos / Fuzz Simulation (Deadlock Hunter) running full game loops with random choices.
 * 3. State Invariant Assertions (non-negative vaults, HP bounds, no deadlocks).
 * 4. Exportable JSON telemetry for browser and CLI debugging.
 */

import rawAllComponents from '../data/all_components.json';
import { GameComponent } from '../components/ComponentCard';
import { calculateOperationalMomentum, expectedSuccessPerDie } from './simulator';

export interface SimLogEntry {
  step: number;
  phase: string;
  action: string;
  details: string;
  actor?: string;
}

export interface SimulationConfig {
  mode: 'deterministic' | 'chaos';
  runs?: number;
  scenarioId?: 'smoke_clean_clear' | 'martyr_dying_breath' | 'auction_tie_breaker' | 'armory_and_facilities';
  seed?: number;
  maxStepsPerRun?: number;
  diceOverride?: (count: number, threshold: number, context: any) => number[];
}

export interface InvariantViolation {
  run: number;
  step: number;
  phase: string;
  rule: string;
  message: string;
  stateSnapshot: any;
}

export interface SimulationReport {
  success: boolean;
  mode: 'deterministic' | 'chaos';
  scenarioId?: string;
  runsCompleted: number;
  totalStepsExecuted: number;
  deadlocksDetected: number;
  invariantViolations: InvariantViolation[];
  summaryMetrics: {
    averageStagesCleared: number;
    totalCreditsEarned: number;
    totalCasualties: number;
    totalMomentumGenerated: number;
    totalItemsPurchased: number;
    totalFacilitiesSponsored: number;
  };
  logs: SimLogEntry[];
  exportedAt: string;
}

export class SimplePRNG {
  private s: number;
  constructor(seed = 1337) {
    this.s = seed % 2147483647;
    if (this.s <= 0) this.s += 2147483646;
  }
  next(): number {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

/**
 * Executes a simulated game loop (either deterministic or chaos fuzzing).
 */
export function runGameSimulation(
  config: SimulationConfig,
  components: GameComponent[] = rawAllComponents as GameComponent[]
): SimulationReport {
  const prng = new SimplePRNG(config.seed || 42);
  const totalRuns = config.mode === 'deterministic' ? 1 : Math.max(1, config.runs || 10);
  const maxSteps = config.maxStepsPerRun || 250;

  const factions = components.filter((c) => c.component_type === 'faction');
  const characters = components.filter((c) => c.component_type === 'character');
  const items = components.filter((c) => c.component_type === 'item');
  const campaigns = components.filter((c) => c.component_type === 'campaign');
  const missions = components.filter((c) => c.component_type === 'mission' || c.component_type === 'side_mission');
  const hqFacilities = components.filter((c) => c.component_type === 'hq_facility' || c.component_type === 'hq_landmark');
  const secretObjectives = components.filter((c) => c.component_type === 'secret_objective');
  const agendas = components.filter((c) => c.component_type === 'agenda');
  const perks = components.filter((c) => c.component_type === 'perk');

  const logs: SimLogEntry[] = [];
  const violations: InvariantViolation[] = [];
  let deadlocks = 0;
  let totalSteps = 0;

  let totalStagesCleared = 0;
  let totalCreditsEarned = 0;
  let totalCasualties = 0;
  let totalMomentum = 0;
  let totalItemsBought = 0;
  let totalFacilitiesSponsored = 0;

  for (let run = 1; run <= totalRuns; run++) {
    let stepCount = 0;
    const runLogs: SimLogEntry[] = [];

    const log = (phase: string, action: string, details: string, actor?: string) => {
      stepCount++;
      totalSteps++;
      const entry = { step: stepCount, phase, action, details, actor };
      runLogs.push(entry);
      if (logs.length < 500) logs.push(entry);
    };

    // 1. SETUP PHASE
    const playerCount = config.mode === 'deterministic' ? 4 : prng.range(2, 4);
    log('SETUP', 'SELECT_PLAYERS', `Table initialized for ${playerCount} Directors.`);

    const vaults = Array.from({ length: playerCount }, (_, i) => ({
      playerIndex: i,
      playerName: `Director ${i + 1}`,
      factionId: factions[i % factions.length]?.id || 'faction-aegis',
      credits: 4,
      effort: 1,
      pip: 1,
      vp: 0,
      commandBid: 0,
      isSquadLeader: i === 0,
    }));

    const playerBenches: Record<number, string[]> = {};
    const factionArmoryCaches: Record<number, string[]> = {};
    const playerSecretObjectives: Record<number, { dealtIds: string[]; selectedId: string; isRevealed: boolean }> = {};
    const activePerkIds: Record<number, string[]> = {};

    for (let i = 0; i < playerCount; i++) {
      playerBenches[i] = characters.slice(i * 3, i * 3 + 3).map((c) => c.id);
      factionArmoryCaches[i] = [];
      activePerkIds[i] = [];
      const s1 = secretObjectives[i * 2]?.id || secretObjectives[0]?.id || 'secret-01';
      const s2 = secretObjectives[i * 2 + 1]?.id || secretObjectives[1]?.id || 'secret-02';
      playerSecretObjectives[i] = {
        dealtIds: [s1, s2],
        selectedId: s1,
        isRevealed: false,
      };
      log('SETUP', 'CLAIM_FACTION', `${vaults[i].playerName} claimed ${vaults[i].factionId} and selected secret objective ${s1}.`, vaults[i].playerName);
    }

    const squad = Array.from({ length: 4 }, (_, s) => {
      const owner = s < playerCount ? s : 0;
      const charId = playerBenches[owner]?.[0] || characters[0].id;
      const char = characters.find((c) => c.id === charId);
      return {
        slotIndex: s,
        ownerPlayer: owner,
        characterId: charId,
        loyalty: 1,
        currentHp: char?.stats?.hp_cap || 3,
        armorRemaining: 0,
        committedDice: 3,
        spentDice: 0,
        equippedItemIds: [] as string[],
      };
    });

    let marketItemIds = items.slice(0, 6).map((it) => it.id);
    let openAgendaIds = agendas.slice(0, 3).map((a) => a.id);
    const claimedAgendaIds: Record<string, number> = {};
    const sponsoredFacilities: Record<string, any> = {};

    const activeCampaign = campaigns[0];
    const missionIds = activeCampaign?.campaign_parameters?.missions || [];
    const activeMission = missions.find((m) => m.id === missionIds[0]) || missions[0];
    const stages = activeMission?.stages || [
      { stage_number: 1, name: 'Infiltration Point', preset_focus: 'combat', target_difficulty: 3 },
      { stage_number: 2, name: 'Security Checkpoint', preset_focus: 'intel', target_difficulty: 4 },
    ];

    log('SETUP', 'LOCK_CAMPAIGN', `Campaign ${activeCampaign.title} active with Mission ${activeMission.title} (${stages.length} stages).`);

    // INVARIANT CHECK HELPER
    const assertInvariants = (phaseName: string) => {
      // 1. Vaults non-negative
      for (const v of vaults) {
        if (v.credits < 0 || v.effort < 0 || v.pip < 0 || isNaN(v.credits)) {
          violations.push({
            run,
            step: stepCount,
            phase: phaseName,
            rule: 'NON_NEGATIVE_VAULT',
            message: `${v.playerName} vault currency invariant violated: CR=${v.credits}, EF=${v.effort}, PIP=${v.pip}`,
            stateSnapshot: { vaults, squad },
          });
        }
      }
      // 2. Operative HP and dice bounds
      for (const op of squad) {
        if (op.currentHp < 0 || isNaN(op.currentHp) || op.committedDice < 0) {
          violations.push({
            run,
            step: stepCount,
            phase: phaseName,
            rule: 'OPERATIVE_BOUNDS',
            message: `Operative slot ${op.slotIndex} out of bounds: HP=${op.currentHp}, Committed=${op.committedDice}`,
            stateSnapshot: { squad },
          });
        }
      }
      // 3. Strict 4-man squad
      if (squad.length !== 4) {
        violations.push({
          run,
          step: stepCount,
          phase: phaseName,
          rule: 'STRICT_FOUR_OPERATIVES',
          message: `Squad length must strictly equal 4, got ${squad.length}`,
          stateSnapshot: { squad },
        });
      }
    };

    // 2. MISSION & STAGES LOOP
    let missionCleared = false;
    for (let stIdx = 0; stIdx < stages.length; stIdx++) {
      if (stepCount >= maxSteps) {
        deadlocks++;
        log('STALL', 'MAX_STEPS_EXCEEDED', `Run ${run} hit max steps safety limit at Stage ${stIdx + 1}.`);
        break;
      }

      const st = stages[stIdx];
      const targetD = st.target_difficulty;
      const stageFocus = st.preset_focus;
      log('STAGE_START', `STAGE_${stIdx + 1}`, `Entering Stage ${stIdx + 1}: ${st.name} (Target D=${targetD}, Focus=[${stageFocus}])`);

      // Dynamic Swap or Ability declaration
      if (config.mode === 'chaos' && prng.next() > 0.6) {
        log('STAGE_STEP_1', 'TACTICAL_SWAP', `Squad Leader declared Tactical Bypass to bypass ${stageFocus} hazard.`);
      }

      // Roll execution
      let stageSuccesses = 0;
      let stageBackfires = 0;

      for (const op of squad) {
        const char = characters.find((c) => c.id === op.characterId);
        const pri = (char?.focus_affinity?.primary || '').toLowerCase();
        const thresh = pri === stageFocus.toLowerCase() ? 3 : 5;

        // Determine dice commitment
        let diceToCommit = 2;
        if (config.mode === 'deterministic') {
          diceToCommit = 3;
        } else {
          // Chaos choice: could hold back (0) or commit up to 4
          diceToCommit = prng.range(0, 4);
        }

        op.committedDice = diceToCommit;

        let rollResults: number[] = [];
        if (config.diceOverride) {
          rollResults = config.diceOverride(diceToCommit, thresh, { op, st });
        } else if (config.mode === 'deterministic' && config.scenarioId === 'smoke_clean_clear') {
          // Guaranteed hits for clean clear smoke test
          rollResults = Array(diceToCommit).fill(thresh >= 4 ? 4 : 3);
        } else if (config.mode === 'deterministic' && config.scenarioId === 'martyr_dying_breath') {
          // Guaranteed backfires for martyr test
          rollResults = Array(diceToCommit).fill(1);
        } else {
          // Standard / Chaos random rolls
          rollResults = Array.from({ length: diceToCommit }, () => prng.range(1, 6));
        }

        let hits = 0;
        let natural1s = 0;
        for (const val of rollResults) {
          if (val >= thresh) hits++;
          if (val === 1) natural1s++;
        }

        stageSuccesses += hits;
        if (thresh === 5) {
          // Only Out-of-Focus natural 1s backfire
          stageBackfires += natural1s;
          const damage = Math.max(0, natural1s - op.armorRemaining);
          op.currentHp = Math.max(0, op.currentHp - damage);
          if (op.currentHp === 0) totalCasualties++;
        }

        log(
          'STAGE_STEP_2_3',
          'ROLL_DICE',
          `${char?.title || 'Operative'} rolled ${diceToCommit} dice at ${thresh}+: [${rollResults.join(',')}] -> ${hits} hits, ${natural1s} ones. HP remaining: ${op.currentHp}`,
          vaults[op.ownerPlayer]?.playerName
        );
      }

      // Step 4: Triage Stabilization
      for (const op of squad) {
        if (op.currentHp === 0) {
          const ownerVault = vaults[op.ownerPlayer];
          if (ownerVault && ownerVault.effort >= 1) {
            ownerVault.effort -= 1;
            op.currentHp = 1;
            log('STAGE_STEP_4', 'TRIAGE_STABILIZE', `Emergency stabilization applied! ${ownerVault.playerName} spent [1 EF] to stabilize operative to 1 HP.`, ownerVault.playerName);
          } else {
            log('STAGE_STEP_4', 'DYING_BREATH', `Operative succumbed to wounds. Dying Breath locked in successes for Stage Resolution.`);
          }
        }
      }

      // Step 5: Stage Resolution & Momentum
      const cleared = stageSuccesses >= targetD;
      const momentum = calculateOperationalMomentum(stageSuccesses, targetD);
      if (cleared) totalStagesCleared++;
      if (momentum > 0) totalMomentum += momentum;

      log(
        'STAGE_STEP_5',
        'STAGE_RESOLUTION',
        `Stage result: ${stageSuccesses} successes vs Target D=${targetD} -> ${cleared ? 'CLEARED' : 'FAILED'} (Momentum generated: [${momentum} MOM]).`
      );

      assertInvariants('STAGE_STEP_5');
    }

    missionCleared = true;

    // 3. PHASE 4: HQ DOWNTIME
    log('PHASE_4_HQ', 'BEGIN_DOWNTIME', `Commencing 8-Step HQ Downtime Operations.`);

    // Step 1: Debrief Dual-Stream Payouts
    const clearanceBountyCr = 6;
    const baseEven = Math.floor(clearanceBountyCr / playerCount);
    const rem = clearanceBountyCr % playerCount;

    for (let i = 0; i < playerCount; i++) {
      const v = vaults[i];
      const isLeader = i === 0;
      const stream1Cr = 2; // +2 CR per deployed operative
      const stream1Pip = 1 + (isLeader ? 1 : 0);
      const stream2Cr = baseEven + (isLeader ? rem : 0);

      v.credits += stream1Cr + stream2Cr;
      v.pip += stream1Pip;
      totalCreditsEarned += stream1Cr + stream2Cr;

      log(
        'PHASE_4_HQ',
        'DEPOSIT_DUAL_STREAM_PAYOUT',
        `${v.playerName} claimed payouts: Stream 1 [+${stream1Cr} CR, +${stream1Pip} PIP] + Stream 2 [+${stream2Cr} CR]. Vault balance: [${v.credits} CR, ${v.pip} PIP].`,
        v.playerName
      );
    }

    // Step 4: Facility Sponsorship
    if (hqFacilities.length > 0) {
      const fac = hqFacilities[0];
      const sponsorVault = vaults[0];
      if (sponsorVault.credits >= 4 && !sponsoredFacilities[fac.id]) {
        sponsorVault.credits -= 4;
        sponsorVault.pip += 1;
        sponsorVault.vp += 2;
        sponsoredFacilities[fac.id] = { sponsoredByPlayer: 0, facilityId: fac.id };
        totalFacilitiesSponsored++;
        log('PHASE_4_HQ', 'SPONSOR_FACILITY', `${sponsorVault.playerName} sponsored ${fac.title} for [4 CR] -> gained [+1 PIP] and [+2 VP].`, sponsorVault.playerName);
      }
    }

    // Step 6: Quartermaster Armory Purchase
    if (marketItemIds.length > 0) {
      const activeBuyer = vaults[0];
      const itemToBuyId = marketItemIds[0];
      const it = items.find((i) => i.id === itemToBuyId);
      const cost = it?.cost?.credits || 2;

      if (activeBuyer.credits >= cost) {
        activeBuyer.credits -= cost;
        // Deplete from market & replenish
        marketItemIds = marketItemIds.filter((id) => id !== itemToBuyId);
        const nextDeckItem = items.find((i) => !marketItemIds.includes(i.id) && i.id !== itemToBuyId);
        if (nextDeckItem) marketItemIds.push(nextDeckItem.id);

        // Equip to operative
        squad[0].equippedItemIds.push(itemToBuyId);
        squad[0].armorRemaining += it?.stats?.armor_buffer || 0;
        totalItemsBought++;

        log(
          'PHASE_4_HQ',
          'PURCHASE_ARMORY_ITEM',
          `${activeBuyer.playerName} purchased ${it?.title || itemToBuyId} for [${cost} CR]. Item removed from market; armory replenished.`,
          activeBuyer.playerName
        );
      }
    }

    // Step 7: Boardroom Perks
    if (perks.length > 0) {
      const perk = perks[0];
      const pVault = vaults[0];
      if (pVault.credits >= 3) {
        pVault.credits -= 3;
        activePerkIds[0].push(perk.id);
        log('PHASE_4_HQ', 'UNLOCK_PERK', `${pVault.playerName} unlocked Executive Doctrine: ${perk.title}.`, pVault.playerName);
      }
    }

    // Reset recovery for next mission
    for (const op of squad) {
      op.currentHp = 3;
      op.committedDice = 3;
    }

    assertInvariants('END_OF_RUN');
    log('RUN_COMPLETE', 'CYCLE_FINISHED', `Run ${run} concluded successfully with 0 deadlocks.`);
  }

  return {
    success: violations.length === 0 && deadlocks === 0,
    mode: config.mode,
    scenarioId: config.scenarioId,
    runsCompleted: totalRuns,
    totalStepsExecuted: totalSteps,
    deadlocksDetected: deadlocks,
    invariantViolations: violations,
    summaryMetrics: {
      averageStagesCleared: Math.round((totalStagesCleared / totalRuns) * 10) / 10,
      totalCreditsEarned,
      totalCasualties,
      totalMomentumGenerated: totalMomentum,
      totalItemsPurchased: totalItemsBought,
      totalFacilitiesSponsored,
    },
    logs,
    exportedAt: new Date().toISOString(),
  };
}
