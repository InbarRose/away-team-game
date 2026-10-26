import React, { useEffect, useMemo, useState } from 'react';
import { GameComponent } from '../components/ComponentCard';
import rawAllComponents from '../data/all_components.json';
import { FocusBadge, SemanticText } from '../components/SemanticText';
import {
  calculateOperationalMomentum,
  evaluateCharacterBudgetES,
  expectedSuccessPerDie,
  simulateStageMonteCarlo,
} from './simulator';

interface VTTProps {
  components: GameComponent[];
}

interface FactionVault {
  playerIndex: number;
  playerName: string;
  factionId: string;
  credits: number;
  effort: number;
  pip: number;
  vp: number;
  commandBid: number;
  isSquadLeader: boolean;
}

interface DeployedOperative {
  slotIndex: number;
  ownerPlayer: number;
  characterId: string;
  loyalty: number;
  currentHp: number;
  armorRemaining: number;
  bonusDice: number;
  committedDice: number;
  spentDice: number;
  critInjuryDicePenalty: number;
  critInjuryHpPenalty: number;
  traumaNote: string;
  equippedItemIds: string[];
  rolledDice: number[];
  inMedBay: boolean;
}

interface VTTState {
  playerCount: number;
  sequenceStep: number; // 1..7 guided game loop step
  campaignId: string;
  missionId: string;
  stageIndex: number;
  overrideFocus: string | null;
  secondaryConcurrentFocus: string | null;
  activeModifierId: string;
  targetDifficulty: number;
  doom: number;
  retriesUsed: number;
  momentumTokens: number;
  sponsoredModules: Record<string, number>; // moduleName -> playerIndex
  vaults: FactionVault[];
  squad: DeployedOperative[];
  combatLog: string[];
}

const SEQUENCE_STEPS = [
  {
    step: 1,
    shortTitle: '1. Briefing & Swaps',
    fullTitle: 'Step 1: Stage Briefing, Modifiers & Dynamic Focus Swaps',
    coachHint:
      'Reveal the Stage Card and attach 1 Stage Modifier. The Squad Leader may declare Force Breach (shift to [Combat]) or Tactical Bypass (shift to [Infiltrate]). Recon, Scientist (Dual-Vector Mapping), and Diplomat (Strategic Alignment) may spend [1 EF] now. Players may broker Binding Promises ([CR] / items).',
  },
  {
    step: 2,
    shortTitle: '2. Phase 1: Specialists (3+)',
    fullTitle: 'Step 2: Phase 1 Initiative — Primary Focus Specialists (3+)',
    coachHint:
      'Operatives whose Primary Focus matches the active room Focus act first! Set their Committed Dice and click "Roll Phase 1 Specialists (3+)". EARLY RESOLUTION: If Phase 1 successes meet or exceed Target Difficulty D, the stage is cleared immediately and Phase 2 Support skips rolling!',
  },
  {
    step: 3,
    shortTitle: '3. Phase 2: Support (4+/5+)',
    fullTitle: 'Step 3: Phase 2 Initiative — Support Operatives (4+ Secondary / 5+ Out of Focus)',
    coachHint:
      'If Phase 1 Specialists did not reach Target Difficulty D, non-Primary operatives commit and roll static dice: Secondary/Bridged Focus hits on 4+; Out of Focus hits on 5+. Every natural 1 inflicts 1 HP Backfire damage.',
  },
  {
    step: 4,
    shortTitle: '4. Triage & 0 HP Check',
    fullTitle: 'Step 4: Post-Initiative Triage & Emergency Stabilization Window',
    coachHint:
      'Trigger reactive damage mitigation (Survivalist Emergency Field Medicine [1 EF] heals up to 2 stage HP). If any operative is at 0 HP, any Faction may spend [1 EF] or discard a Medkit to stabilize them at 1 HP—otherwise they are KIA (Martyr: +2 [PIP] to owner, and rivals may claim dropped gear via the [-1 PIP] Vulture Tax).',
  },
  {
    step: 5,
    shortTitle: '5. Resolution & [MOM]',
    fullTitle: 'Step 5: Stage Resolution & Operational Momentum ([MOM]) Distribution',
    coachHint:
      'Compare total successes against Target Difficulty D. If Successes >= D + 2, generate Operational Momentum: MOM = Successes - D - 1. The Squad Leader immediately spends [1 MOM] to restore 1 spent static die to any operative who committed and rolled >= 1 die in this stage!',
  },
  {
    step: 6,
    shortTitle: '6. Transition & Resupply',
    fullTitle: 'Step 6: Between-Stage Transition, Logistical Refresh & Retreat Check',
    coachHint:
      'Before revealing the next stage, the Squad Leader may spend [2 EF] (restore +1 spent static die to all 4 operatives) or [3 EF] (restore +2 spent static dice to all 4 operatives), or call a Tactical Retreat if >50% of squad dice are spent or an operative is at 1 HP.',
  },
  {
    step: 7,
    shortTitle: '7. HQ Downtime (8 Steps)',
    fullTitle: 'Step 7: Agency HQ Downtime — Debrief, Med Bay, Sponsorships & Command Auction',
    coachHint:
      'Return to Agency HQ: (1) Award mission [CR]/[PIP] and [+1 LOY] to surviving operatives (+2 LOY to winning Squad Leader), (2) Stand-Down Auction, (3) Infirmary Bed Healing Dice (5+/4+), (4) Sponsor HQ Modules (+1 PIP / +2 VP), (5) Recruitment Bureau ([8 CR]), (6) Quartermaster Armory, (7) Boardroom Perks, (8) Command Auction for next drop.',
  },
];

const STORAGE_KEY = 'away_team_vtt_state_v2';

const DEFAULT_STATE: VTTState = {
  playerCount: 4,
  sequenceStep: 1,
  campaignId: 'campaign-iron-dawn',
  missionId: 'mission-iron-dawn-1-black-market-intercept',
  stageIndex: 0,
  overrideFocus: null,
  secondaryConcurrentFocus: null,
  activeModifierId: '',
  targetDifficulty: 4,
  doom: 0,
  retriesUsed: 0,
  momentumTokens: 0,
  sponsoredModules: {},
  vaults: [
    {
      playerIndex: 0,
      playerName: 'Director P1',
      factionId: 'faction-aegis',
      credits: 12,
      effort: 3,
      pip: 2,
      vp: 0,
      commandBid: 2,
      isSquadLeader: true,
    },
    {
      playerIndex: 1,
      playerName: 'Director P2',
      factionId: 'faction-nexus',
      credits: 12,
      effort: 3,
      pip: 2,
      vp: 0,
      commandBid: 1,
      isSquadLeader: false,
    },
    {
      playerIndex: 2,
      playerName: 'Director P3',
      factionId: 'faction-vanderbilt',
      credits: 14,
      effort: 2,
      pip: 3,
      vp: 0,
      commandBid: 0,
      isSquadLeader: false,
    },
    {
      playerIndex: 3,
      playerName: 'Director P4',
      factionId: 'faction-ascendant',
      credits: 12,
      effort: 3,
      pip: 2,
      vp: 0,
      commandBid: 0,
      isSquadLeader: false,
    },
  ],
  squad: [
    {
      slotIndex: 0,
      ownerPlayer: 0,
      characterId: 'agent-01-commander',
      loyalty: 1,
      currentHp: 3,
      armorRemaining: 0,
      bonusDice: 0,
      committedDice: 3,
      spentDice: 0,
      critInjuryDicePenalty: 0,
      critInjuryHpPenalty: 0,
      traumaNote: '',
      equippedItemIds: ['item-handheld-t1-standard-issue-sidearm'],
      rolledDice: [],
      inMedBay: false,
    },
    {
      slotIndex: 1,
      ownerPlayer: 1,
      characterId: 'agent-07-ghost-point',
      loyalty: 1,
      currentHp: 2,
      armorRemaining: 0,
      bonusDice: 0,
      committedDice: 2,
      spentDice: 0,
      critInjuryDicePenalty: 0,
      critInjuryHpPenalty: 0,
      traumaNote: '',
      equippedItemIds: ['item-handheld-t1-tactical-slicer-deck'],
      rolledDice: [],
      inMedBay: false,
    },
    {
      slotIndex: 2,
      ownerPlayer: 2,
      characterId: 'agent-19-spymaster',
      loyalty: 1,
      currentHp: 2,
      armorRemaining: 0,
      bonusDice: 0,
      committedDice: 2,
      spentDice: 0,
      critInjuryDicePenalty: 0,
      critInjuryHpPenalty: 0,
      traumaNote: '',
      equippedItemIds: ['item-handheld-t1-diplomatic-envoy-ai'],
      rolledDice: [],
      inMedBay: false,
    },
    {
      slotIndex: 3,
      ownerPlayer: 3,
      characterId: 'agent-13-combat-medic',
      loyalty: 1,
      currentHp: 3,
      armorRemaining: 0,
      bonusDice: 0,
      committedDice: 2,
      spentDice: 0,
      critInjuryDicePenalty: 0,
      critInjuryHpPenalty: 0,
      traumaNote: '',
      rolledDice: [],
      equippedItemIds: ['item-consumable-t1-field-trauma-medkit'],
      inMedBay: false,
    },
  ],
  combatLog: [
    '[SYSTEM] Away Team Sequenced VTT & Monte Carlo Balance Engine initialized. Follow the 7-Step Phase Sequencer above.',
  ],
};


export type VTTTabKey =
  | 'setup'
  | 'phase1_mission'
  | 'phase2_command'
  | 'stage'
  | 'squad'
  | 'hq'
  | 'medbay'
  | 'simulator';

export const BOARD_GAME_PHASES = [
  {
    id: 'setup' as const,
    title: '⚙️ Setup',
    subtitle: '1–4 Players & Factions',
    badgeClass: 'badge-setup',
  },
  {
    id: 'phase1_mission' as const,
    title: '🗺️ Phase 1: Mission',
    subtitle: 'Briefing & Threat Deck',
    badgeClass: 'badge-phase1',
  },
  {
    id: 'phase2_command' as const,
    title: '👑 Phase 2: Command',
    subtitle: 'Roster & Command Auction',
    badgeClass: 'badge-phase2',
  },
  {
    id: 'stage' as const,
    title: '🎲 Phase 3: Tactical Field',
    subtitle: '5-Step Stage Micro-Loop',
    badgeClass: 'badge-phase3',
  },
  {
    id: 'hq' as const,
    title: '🏢 Phase 4: HQ Downtime',
    subtitle: '8-Step Base Operations',
    badgeClass: 'badge-phase4',
  },
  {
    id: 'simulator' as const,
    title: '📊 Balance & Sim',
    subtitle: 'Monte Carlo & 9.0 ES',
    badgeClass: 'badge-sim',
  },
] as const;

export function VirtualTabletop({ components = rawAllComponents as GameComponent[], onReturnToWiki }: VTTProps) {
  const [state, setState] = useState<VTTState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<VTTTabKey>('setup');
  const [tacticalSubTab, setTacticalSubTab] = useState<'stage' | 'medbay'>('stage');
  const [bountyPoolCr, setBountyPoolCr] = useState<number>(8);
  const [bountyPoolPip, setBountyPoolPip] = useState<number>(1);
  const [simTrials, setSimTrials] = useState<number>(1000);
  const [simSeedBump, setSimSeedBump] = useState<number>(0);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.vaults && parsed.squad) {
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            sequenceStep: parsed.sequenceStep || 1,
          });
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const factions = useMemo(
    () => components.filter((c) => c.component_type === 'faction'),
    [components]
  );
  const characters = useMemo(
    () => components.filter((c) => c.component_type === 'character'),
    [components]
  );
  const items = useMemo(
    () => components.filter((c) => c.component_type === 'item'),
    [components]
  );
  const modifiers = useMemo(
    () => components.filter((c) => c.component_type === 'modifier'),
    [components]
  );
  const campaigns = useMemo(
    () => components.filter((c) => c.component_type === 'campaign'),
    [components]
  );
  const missions = useMemo(
    () =>
      components.filter(
        (c) => c.component_type === 'mission' || c.component_type === 'side_mission'
      ),
    [components]
  );
  const hqFacilities = useMemo(
    () =>
      components.filter(
        (c) => c.component_type === 'hq_facility' || c.component_type === 'hq_landmark'
      ),
    [components]
  );

  const activeCampaign = useMemo(
    () => campaigns.find((c) => c.id === state.campaignId) || campaigns[0],
    [campaigns, state.campaignId]
  );

  const activeMission = useMemo(
    () => missions.find((m) => m.id === state.missionId) || missions[0],
    [missions, state.missionId]
  );

  const activeStages: any[] = activeMission?.stages || [];
  const currentStage = activeStages[state.stageIndex] || activeStages[0] || {
    stage_number: 1,
    name: 'Outer Breach',
    primary_focus: 'combat',
    hazard_text: 'Roll 1s trigger 1 HP suppressive fire damage.',
  };

  const effectivePrimaryFocus = (
    state.overrideFocus ||
    currentStage?.primary_focus ||
    activeMission?.focus_affinity?.primary ||
    'combat'
  ).toLowerCase();

  const activeModifier = useMemo(
    () => modifiers.find((m) => m.id === state.activeModifierId) || null,
    [modifiers, state.activeModifierId]
  );

  const activeStepMeta =
    SEQUENCE_STEPS.find((s) => s.step === state.sequenceStep) || SEQUENCE_STEPS[0];

  const appendLog = (entry: string) => {
    setState((prev) => ({
      ...prev,
      combatLog: [`[${new Date().toLocaleTimeString()}] ${entry}`, ...prev.combatLog.slice(0, 39)],
    }));
  };

  // Compute an operative's threshold (3+ Primary, 4+ Secondary/Bridge, 5+ Out of Focus)
  const getOperativeEval = (op: DeployedOperative) => {
    const char = characters.find((c) => c.id === op.characterId) || characters[0];
    const equipped = op.equippedItemIds
      .map((id) => items.find((it) => it.id === id))
      .filter(Boolean) as GameComponent[];

    const primary = char?.focus_affinity?.primary?.toLowerCase();
    const secondary = char?.focus_affinity?.secondary?.toLowerCase();
    const itemBridges = equipped.flatMap((it) => [
      it.focus_affinity?.primary?.toLowerCase(),
      it.focus_affinity?.secondary?.toLowerCase(),
      ...(it.focus_affinity?.bridges || []).map((b) => b.toLowerCase()),
    ]);

    const focusTargets = [effectivePrimaryFocus];
    if (state.secondaryConcurrentFocus) {
      focusTargets.push(state.secondaryConcurrentFocus.toLowerCase());
    }

    let threshold: 3 | 4 | 5 = 5;
    let roleLabel = 'Phase 2: Out-of-Focus Support (5+)';
    let isOutOfFocus = true;
    let isPhase1Specialist = false;

    if (primary && focusTargets.includes(primary)) {
      threshold = 3;
      roleLabel = 'Phase 1: Primary Specialist (3+)';
      isOutOfFocus = false;
      isPhase1Specialist = true;
    } else if (
      (secondary && focusTargets.includes(secondary)) ||
      itemBridges.some((b) => b && focusTargets.includes(b))
    ) {
      threshold = 4;
      roleLabel = 'Phase 2: Secondary/Bridge Support (4+)';
      isOutOfFocus = false;
      isPhase1Specialist = false;
    }

    const itemStaticDice = equipped.reduce(
      (sum, it) => sum + (it.stats?.static_dice || 0),
      0
    );
    const itemArmor = equipped.reduce(
      (sum, it) => sum + (it.stats?.armor_buffer || 0),
      0
    );
    const totalDice = Math.max(
      1,
      (char?.stats?.static_dice || 6) +
        itemStaticDice -
        (op.critInjuryDicePenalty || 0)
    );
    const spentDice = Math.min(totalDice, Math.max(0, op.spentDice || 0));
    const availableStaticDice = Math.max(0, totalDice - spentDice);
    const committedDice = Math.min(
      availableStaticDice,
      Math.max(0, op.committedDice ?? Math.min(3, availableStaticDice))
    );
    const effectiveRollCount = Math.max(0, committedDice + (op.bonusDice || 0));

    const maxHp = Math.max(
      1,
      (char?.stats?.hp_cap || 3) - (op.critInjuryHpPenalty || 0)
    );

    const hits = op.rolledDice.filter((d) => d >= threshold).length;
    const backfires = op.rolledDice.filter((d) => d === 1).length;

    return {
      char,
      equipped,
      threshold,
      roleLabel,
      isOutOfFocus,
      isPhase1Specialist,
      totalDice,
      spentDice,
      availableStaticDice,
      committedDice,
      effectiveRollCount,
      maxHp,
      itemArmor,
      hits,
      backfires,
    };
  };

  // Squad-wide roll summary
  const squadSummary = useMemo(() => {
    let totalSuccesses = 0;
    let totalBackfires = 0;
    let totalCommittedDice = 0;
    let expectedSuccesses = 0;

    for (const op of state.squad) {
      if (op.inMedBay || op.currentHp <= 0) continue;
      const ev = getOperativeEval(op);
      totalSuccesses += ev.hits;
      totalBackfires += ev.backfires;
      totalCommittedDice += ev.effectiveRollCount;
      expectedSuccesses += ev.effectiveRollCount * expectedSuccessPerDie(ev.threshold);
    }

    const cleared = totalSuccesses >= state.targetDifficulty;
    const momentumGenerated = calculateOperationalMomentum(
      totalSuccesses,
      state.targetDifficulty
    );
    const momentumEarned = momentumGenerated > 0;

    return {
      totalSuccesses,
      totalBackfires,
      totalCommittedDice,
      expectedSuccesses: Math.round(expectedSuccesses * 100) / 100,
      cleared,
      momentumEarned,
      momentumGenerated,
    };
  }, [
    state.squad,
    state.targetDifficulty,
    effectivePrimaryFocus,
    state.secondaryConcurrentFocus,
  ]);

  // Live Monte Carlo simulation result for the active stage & squad
  const liveSimulation = useMemo(() => {
    const simInputs = state.squad
      .filter((op) => !op.inMedBay && op.currentHp > 0)
      .map((op) => {
        const ev = getOperativeEval(op);
        const ownerFaction = state.vaults[op.ownerPlayer]?.factionId;
        return {
          id: op.characterId,
          title: ev.char?.title || op.characterId,
          className: ev.char?.category || 'soldier',
          threshold: ev.threshold,
          committedDice: ev.effectiveRollCount,
          currentHp: op.currentHp,
          armorBuffer: ev.itemArmor,
          ignoreFirstBackfire: ownerFaction === 'faction-aegis' && op.loyalty >= 1,
        };
      });

    return simulateStageMonteCarlo(simInputs, state.targetDifficulty, simTrials);
  }, [
    state.squad,
    state.vaults,
    state.targetDifficulty,
    effectivePrimaryFocus,
    state.secondaryConcurrentFocus,
    simTrials,
    simSeedBump,
  ]);

  // Roll only Phase 1 Specialists (3+) first, checking for Early Resolution
  const handleRollPhase1Specialists = () => {
    let phase1Hits = 0;
    const nextSquad = state.squad.map((op) => {
      if (op.inMedBay || op.currentHp <= 0) return { ...op, rolledDice: [] };
      const ev = getOperativeEval(op);
      if (!ev.isPhase1Specialist || ev.effectiveRollCount <= 0) {
        return { ...op, rolledDice: [] };
      }
      const rolled = Array.from({ length: ev.effectiveRollCount }, () =>
        Math.floor(Math.random() * 6) + 1
      );
      phase1Hits += rolled.filter((d) => d >= ev.threshold).length;
      return {
        ...op,
        rolledDice: rolled,
        spentDice: Math.min(ev.totalDice, (op.spentDice || 0) + ev.committedDice),
        bonusDice: 0,
      };
    });

    const earlyClear = phase1Hits >= state.targetDifficulty;
    const momGen = calculateOperationalMomentum(phase1Hits, state.targetDifficulty);

    setState((prev) => ({
      ...prev,
      squad: nextSquad,
      sequenceStep: earlyClear ? 5 : 3,
      momentumTokens: earlyClear ? prev.momentumTokens + momGen : prev.momentumTokens,
    }));

    if (earlyClear) {
      appendLog(
        `⚡ PHASE 1 EARLY RESOLUTION! Primary (3+) Specialists scored ${phase1Hits}/${state.targetDifficulty} hits—clearing the stage immediately! Phase 2 Support saves all static dice! (+${momGen} [MOM])`
      );
    } else {
      appendLog(
        `Phase 1 Specialists rolled ${phase1Hits}/${state.targetDifficulty} hits. Advancing to Step 3 (Phase 2 Support 4+/5+) to close the remaining ${state.targetDifficulty - phase1Hits} hit deficit.`
      );
    }
  };

  // Roll all active operatives' committed static dice pools
  const handleRollSquadPools = () => {
    let totalHits = 0;
    const nextSquad = state.squad.map((op) => {
      if (op.inMedBay || op.currentHp <= 0) {
        return { ...op, rolledDice: [] };
      }
      const ev = getOperativeEval(op);
      // If already rolled in Phase 1, keep their roll
      if (op.rolledDice.length > 0 && state.sequenceStep === 3 && ev.isPhase1Specialist) {
        totalHits += ev.hits;
        return op;
      }
      const countToRoll = Math.max(1, ev.effectiveRollCount);
      const rolled = Array.from({ length: countToRoll }, () =>
        Math.floor(Math.random() * 6) + 1
      );
      totalHits += rolled.filter((d) => d >= ev.threshold).length;
      return {
        ...op,
        rolledDice: rolled,
        spentDice: Math.min(ev.totalDice, (op.spentDice || 0) + ev.committedDice),
        bonusDice: 0,
      };
    });

    const momGen = calculateOperationalMomentum(totalHits, state.targetDifficulty);

    setState((prev) => ({
      ...prev,
      squad: nextSquad,
      sequenceStep: 4,
      momentumTokens: prev.momentumTokens + momGen,
    }));
    appendLog(
      `Rolled Committed Static Dice on [${effectivePrimaryFocus.toUpperCase()}] stage: ${totalHits}/${state.targetDifficulty} Successes (${
        totalHits >= state.targetDifficulty ? `CLEARED! +${momGen} [MOM]` : 'FAILED'
      }).`
    );
  };

  // Spend 1 [MOM] token to restore 1 spent static die to an eligible operative
  const handleRefundDieWithMomentum = (slotIdx: number) => {
    if (state.momentumTokens <= 0) return;
    const op = state.squad[slotIdx];
    if ((op.spentDice || 0) <= 0) return;
    const ev = getOperativeEval(op);

    setState((prev) => ({
      ...prev,
      momentumTokens: Math.max(0, prev.momentumTokens - 1),
      squad: prev.squad.map((s, i) =>
        i === slotIdx
          ? { ...s, spentDice: Math.max(0, (s.spentDice || 0) - 1) }
          : s
      ),
    }));
    appendLog(
      `Spent [1 MOM] to restore +1 spent static die to ${ev.char?.title}'s Active Pool.`
    );
  };

  // Squad Leader Logistical Refresh ([2 EF] = +1 die all, [3 EF] = +2 dice all)
  const handleLogisticalRefresh = (tierCostEf: 2 | 3) => {
    const restoreCount = tierCostEf === 2 ? 1 : 2;
    const leaderIdx = state.vaults.findIndex((v) => v.isSquadLeader);
    const payIdx = leaderIdx >= 0 ? leaderIdx : 0;

    setState((prev) => ({
      ...prev,
      vaults: prev.vaults.map((v, idx) =>
        idx === payIdx
          ? { ...v, effort: Math.max(0, v.effort - tierCostEf) }
          : v
      ),
      squad: prev.squad.map((s) => ({
        ...s,
        spentDice: Math.max(0, (s.spentDice || 0) - restoreCount),
      })),
    }));
    appendLog(
      `Squad Leader triggered Logistical Refresh ([${tierCostEf} EF]): Restored +${restoreCount} spent static die/dice to all 4 deployed operatives!`
    );
  };

  // Resolve Command Auction
  
  // High-Stakes Zero-Bid Roll-Off (BL-RULES-04)
  const handleZeroBidRollOff = () => {
    const rolls = state.vaults.map((v) => ({
      playerIndex: v.playerIndex,
      playerName: v.playerName,
      roll: Math.floor(Math.random() * 6) + 1,
    }));
    rolls.sort((a, b) => b.roll - a.roll);
    const winner = rolls[0];

    setState((prev) => ({
      ...prev,
      vaults: prev.vaults.map((v) => ({
        ...v,
        isSquadLeader: v.playerIndex === winner.playerIndex,
      })),
    }));
    appendLog(
      `🎲 Zero-Bid High-Stakes Roll-Off (BL-RULES-04): ${rolls
        .map((r) => `${r.playerName}: ${r.roll}`)
        .join(', ')}. ${winner.playerName} rolled highest (${winner.roll}) and is thrust into the Squad Leader role for [0 CR]!`
    );
  };

  // Debrief Dual-Stream Payouts (BL-RULES-01)
  const handleDistributeMissionPayouts = (bountyCredits: number, bountyPip: number) => {
    const activeCount = state.playerCount || 4;
    const squadLeader = state.vaults.find((v) => v.isSquadLeader);
    const leaderIdx = squadLeader ? squadLeader.playerIndex : 0;

    const evenCredits = Math.floor(bountyCredits / activeCount);
    const remainderCredits = bountyCredits % activeCount;
    const evenPip = Math.floor(bountyPip / activeCount);
    const remainderPip = bountyPip % activeCount;

    setState((prev) => ({
      ...prev,
      vaults: prev.vaults.map((v) => {
        const isLeader = v.playerIndex === leaderIdx;
        const totalCrGain = 2 + evenCredits + (isLeader ? remainderCredits : 0);
        const totalPipGain = 1 + evenPip + (isLeader ? remainderPip : 0);
        return {
          ...v,
          credits: v.credits + totalCrGain,
          pip: v.pip + totalPipGain,
        };
      }),
    }));
    appendLog(
      `🏢 HQ Debrief (BL-RULES-01): Awarded [2 CR] + [1 PIP] baseline stipend + [${bountyCredits} CR, ${bountyPip} PIP] mission pool divided evenly (${evenCredits} CR, ${evenPip} PIP each). Squad Leader (${state.vaults[leaderIdx].playerName}) received the odd remainder (+${remainderCredits} CR, +${remainderPip} PIP).`
    );
  };

  const handleResolveCommandAuction = () => {
    let winnerIdx = 0;
    let bestBid = -1;
    let bestPip = -1;

    for (const v of state.vaults) {
      if (
        v.commandBid > bestBid ||
        (v.commandBid === bestBid && v.pip > bestPip)
      ) {
        bestBid = v.commandBid;
        bestPip = v.pip;
        winnerIdx = v.playerIndex;
      }
    }

    setState((prev) => ({
      ...prev,
      vaults: prev.vaults.map((v) => ({
        ...v,
        credits:
          v.playerIndex === winnerIdx
            ? Math.max(0, v.credits - v.commandBid)
            : v.credits,
        isSquadLeader: v.playerIndex === winnerIdx,
      })),
    }));
    appendLog(
      `Command Auction resolved: ${state.vaults[winnerIdx].playerName} elected Squad Leader with a bid of [${bestBid} CR] (tie-breaker: [${bestPip} PIP]).`
    );
  };

  // Convert 1 miss to hit using 1 [EF] (Technician / Momentum / Reroll helper)
  const handleConvertMissToHit = (slotIdx: number) => {
    const op = state.squad[slotIdx];
    const ev = getOperativeEval(op);
    const missIdx = op.rolledDice.findIndex((d) => d < ev.threshold);
    if (missIdx === -1) return;

    const updatedDice = [...op.rolledDice];
    updatedDice[missIdx] = ev.threshold;

    setState((prev) => ({
      ...prev,
      squad: prev.squad.map((s, idx) =>
        idx === slotIdx ? { ...s, rolledDice: updatedDice } : s
      ),
    }));
    appendLog(
      `${ev.char?.title}: Converted 1 missed die into a guaranteed hit (${ev.threshold}+).`
    );
  };

  // Roll Med Bay Recovery (2d6, 5+ default or 4+ with Surgical Wing)
  const handleRollMedBay = (slotIdx: number) => {
    const hasSurgicalWing = state.sponsoredModules['Surgical Wing'] != null;
    const target = hasSurgicalWing ? 4 : 5;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const healed = [d1, d2].filter((d) => d >= target).length;

    setState((prev) => ({
      ...prev,
      squad: prev.squad.map((op, idx) => {
        if (idx !== slotIdx) return op;
        const ev = getOperativeEval(op);
        return {
          ...op,
          currentHp: Math.min(ev.maxHp, op.currentHp + healed),
        };
      }),
    }));
    appendLog(
      `Med Bay Recovery Roll for Slot ${slotIdx + 1}: Rolled [${d1}, ${d2}] (Target ${target}+) → Restored +${healed} HP.`
    );
  };

  // Roll Critical Injury / Trauma d6
  const handleRollTraumaTable = (slotIdx: number) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    let outcome = '';
    setState((prev) => ({
      ...prev,
      squad: prev.squad.map((op, idx) => {
        if (idx !== slotIdx) return op;
        if (roll <= 2) {
          outcome = `Roll ${roll} (Flesh Wound): Stabilized at 1 HP with no permanent stat penalty.`;
          return { ...op, currentHp: 1 };
        } else if (roll <= 4) {
          outcome = `Roll ${roll} (Severed Tendon / Concussion): Suffered -1 Max Static Die token.`;
          return {
            ...op,
            currentHp: 1,
            critInjuryDicePenalty: op.critInjuryDicePenalty + 1,
            traumaNote: 'Crit Injury (-1 Static Die)',
          };
        } else {
          outcome = `Roll ${roll} (Shattered Carapace / Organ Trauma): Suffered -1 Max HP token.`;
          return {
            ...op,
            currentHp: 1,
            critInjuryHpPenalty: op.critInjuryHpPenalty + 1,
            traumaNote: 'Crit Injury (-1 Max HP)',
          };
        }
      }),
    }));
    appendLog(`Slot ${slotIdx + 1} Stabilization Roll: ${outcome}`);
  };

  // Validate 6-slot equipment constraint when equipping an item
  const handleEquipItem = (slotIdx: number, newItemId: string) => {
    if (!newItemId) return;
    const op = state.squad[slotIdx];
    const candidate = items.find((i) => i.id === newItemId);
    if (!candidate) return;

    const currentItems = op.equippedItemIds
      .map((id) => items.find((i) => i.id === id))
      .filter(Boolean) as GameComponent[];

    const candidateSlots = candidate.stats?.slots_required || [];
    const handCount = currentItems.reduce(
      (sum, it) =>
        sum +
        (it.stats?.slots_required || []).filter((s) =>
          s.toLowerCase().includes('hand')
        ).length,
      0
    );
    const candidateHandCount = candidateSlots.filter((s) =>
      s.toLowerCase().includes('hand')
    ).length;

    if (handCount + candidateHandCount > 2) {
      appendLog(
        `⚠ Cannot equip ${candidate.title}: Exceeds 2 Hand slots ([Hand L] + [Hand R]). Unequip a handheld item first.`
      );
      return;
    }

    for (const reqSlot of candidateSlots) {
      if (reqSlot.toLowerCase().includes('hand')) continue;
      const occupied = currentItems.some((it) =>
        (it.stats?.slots_required || []).includes(reqSlot)
      );
      if (occupied) {
        appendLog(
          `⚠ Cannot equip ${candidate.title}: Equipment slot [${reqSlot}] is already occupied on this operative.`
        );
        return;
      }
    }

    setState((prev) => ({
      ...prev,
      squad: prev.squad.map((s, idx) =>
        idx === slotIdx
          ? {
              ...s,
              equippedItemIds: [...s.equippedItemIds, newItemId],
              armorRemaining:
                s.armorRemaining + (candidate.stats?.armor_buffer || 0),
            }
          : s
      ),
    }));
    appendLog(`Equipped ${candidate.title} onto Operative Slot ${slotIdx + 1}.`);
  };

  return (
    <div className="vtt-container">
      {/* ====================================================================
          VTT HEADER BAR: MISSION STATUS, RESOURCE BADGES & ACTIONS
         ==================================================================== */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '0.04em' }}>
              AWAY TEAM — VIRTUAL TABLETOP
            </strong>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--currency-effort)', fontFamily: 'var(--font-mono)' }}>
              • Board Game Operations Engine
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              📍 {activeMission?.title || 'Mission 1'}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: 'var(--currency-doom-bg)',
                border: '1px solid var(--currency-doom)',
                color: '#f87171',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
              }}
              title="Campaign Mission Failure Tracker ([FAIL]) — Dissolution occurs when reaching threshold!"
            >
              💀 {state.doom} / {activeCampaign?.stats?.max_doom || 3} [FAIL]
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: 'var(--currency-momentum-bg)',
                border: '1px solid var(--currency-momentum)',
                color: '#34d399',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
              }}
              title="Operational Momentum ([MOM]) earned from clears >= D+2. Restores spent static dice!"
            >
              ⚡ {state.momentumTokens} [MOM]
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {onReturnToWiki && (
            <button
              type="button"
              className="vtt-btn"
              onClick={onReturnToWiki}
              title="Return to the Away Team Rules & Reference Wiki"
            >
              📖 Rules Wiki
            </button>
          )}
          <button
            type="button"
            className="vtt-btn"
            title="Export current campaign, vaults, and squad state as a JSON save file"
            onClick={() => {
              const blob = new Blob([JSON.stringify(state, null, 2)], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'away_team_campaign_save.json';
              a.click();
            }}
          >
            💾 Export Save
          </button>
          <button
            type="button"
            className="vtt-btn vtt-btn-danger"
            title="Reset the entire Virtual Tabletop back to initial state"
            onClick={() => {
              setState(DEFAULT_STATE);
              localStorage.removeItem(STORAGE_KEY);
            }}
          >
            ↺ Reset
          </button>
        </div>
      </header>

      {/* ====================================================================
          BOARD GAME MACRO PHASE BAR (SETUP -> PHASE 1 -> PHASE 2 -> PHASE 3 -> PHASE 4 -> SIM)
         ==================================================================== */}
      <nav className="vtt-phase-nav" aria-label="Board Game Phase Progression">
        {BOARD_GAME_PHASES.map((p) => {
          const isCurrent =
            activeTab === p.id ||
            (p.id === 'stage' && (activeTab === 'stage' || activeTab === 'medbay')) ||
            (p.id === 'phase2_command' && activeTab === 'squad');
          return (
            <button
              key={p.id}
              type="button"
              className={`vtt-phase-tab ${isCurrent ? `active ${p.badgeClass}` : ''}`}
              onClick={() => setActiveTab(p.id as any)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
                <strong style={{ fontSize: '0.88rem' }}>{p.title}</strong>
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: isCurrent ? '#f1f5f9' : 'var(--text-muted)',
                  marginTop: '0.2rem',
                }}
              >
                {p.subtitle}
              </div>
            </button>
          );
        })}
      </nav>

      {/* ====================================================================
          PHASE 0: GAME SETUP (1-4 PLAYERS, FACTIONS, VANGUARD SLOT & VAULTS)
         ==================================================================== */}
      {activeTab === 'setup' && (
        <section className="vtt-panel">
          <div className="vtt-panel-title">
            <span>⚙️ TABLETOP SETUP & AGENCY COUNCIL INITIALIZATION</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Chapter 2 Tabletop Rules
            </span>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '0 0 1rem 0' }}>
            Configure player count, assign Faction Director seats, and review the initial tabletop setup steps.
            In 3-player games, the 4th slot functions as the <strong>Vanguard Slot</strong>.
          </p>

          {/* Player Count Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--currency-effort)', display: 'block', marginBottom: '0.4rem' }}>
              TABLE PLAYER COUNT CONFIGURATION
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { count: 1, label: '👤 1 Player (Solo Directive)', desc: 'Automated 4-operative strike squad' },
                { count: 2, label: '👥 2 Players (Duo Task Force)', desc: 'Each player commands 2 operative slots' },
                { count: 3, label: '🛡️ 3 Players (Trio + Vanguard Slot)', desc: 'Squad Leader commands 4th Vanguard slot' },
                { count: 4, label: '🏛️ 4 Players (Full Agency Council)', desc: 'Standard 4-faction semi-cooperative council' },
              ].map((cfg) => (
                <button
                  key={cfg.count}
                  type="button"
                  className={`vtt-btn ${state.playerCount === cfg.count ? 'vtt-btn-primary' : ''}`}
                  onClick={() => setState((p) => ({ ...p, playerCount: cfg.count }))}
                  style={{ textAlign: 'left', padding: '0.5rem 0.8rem' }}
                >
                  <div style={{ fontWeight: 700 }}>{cfg.label}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{cfg.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3-Player Vanguard Slot Callout */}
          {state.playerCount === 3 && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                background: 'rgba(192, 132, 252, 0.1)',
                border: '1px solid #c084fc',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
              }}
            >
              <strong style={{ color: '#e9d5ff' }}>🛡️ The 3-Player Vanguard Slot Protocol:</strong>
              <div style={{ color: '#d8b4fe', marginTop: '0.25rem' }}>
                The 4th Operative is designated as the <strong>Vanguard Agent</strong>. The winning Squad Leader
                deploys and commands the Vanguard operative during Phase 3, but the Vanguard agent’s survival rewards
                and Med Bay liability are shared by the Agency Council.
              </div>
            </div>
          )}

          {/* Faction Director Vault Endowments */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              DIRECTOR SEATS & INITIAL VAULT ENDOWMENTS
            </div>
            <div className="vtt-grid-4">
              {state.vaults.slice(0, state.playerCount || 4).map((v, idx) => (
                <div
                  key={v.playerIndex}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Seat {idx + 1}: {v.playerName}</strong>
                    {v.isSquadLeader && (
                      <span className="semantic-badge badge-currency-cr">👑 Squad Leader</span>
                    )}
                  </div>
                  <select
                    value={v.factionId}
                    onChange={(e) => {
                      const nextFac = e.target.value;
                      setState((p) => ({
                        ...p,
                        vaults: p.vaults.map((item, i) =>
                          i === idx ? { ...item, factionId: nextFac } : item
                        ),
                      }));
                    }}
                    style={{
                      width: '100%',
                      padding: '0.35rem',
                      borderRadius: '4px',
                      background: 'var(--bg-void)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-strong)',
                      fontSize: '0.78rem',
                      marginBottom: '0.65rem',
                    }}
                  >
                    {factions.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.title}
                      </option>
                    ))}
                  </select>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem', textAlign: 'center' }}>
                    <div style={{ padding: '0.35rem', borderRadius: '4px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)' }}>
                      <div className="semantic-badge badge-currency-cr">CR</div>
                      <div style={{ fontWeight: 800, marginTop: '0.15rem' }}>{v.credits}</div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '0.2rem' }}>
                        <button type="button" className="vtt-btn" style={{ padding: '1px 5px' }} onClick={() => setState((p) => ({ ...p, vaults: p.vaults.map((it, i) => i === idx ? { ...it, credits: Math.max(0, it.credits - 1) } : it) }))}>-</button>
                        <button type="button" className="vtt-btn" style={{ padding: '1px 5px' }} onClick={() => setState((p) => ({ ...p, vaults: p.vaults.map((it, i) => i === idx ? { ...it, credits: it.credits + 1 } : it) }))}>+</button>
                      </div>
                    </div>
                    <div style={{ padding: '0.35rem', borderRadius: '4px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)' }}>
                      <div className="semantic-badge badge-currency-ef">EF</div>
                      <div style={{ fontWeight: 800, marginTop: '0.15rem' }}>{v.effort}</div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '0.2rem' }}>
                        <button type="button" className="vtt-btn" style={{ padding: '1px 5px' }} onClick={() => setState((p) => ({ ...p, vaults: p.vaults.map((it, i) => i === idx ? { ...it, effort: Math.max(0, it.effort - 1) } : it) }))}>-</button>
                        <button type="button" className="vtt-btn" style={{ padding: '1px 5px' }} onClick={() => setState((p) => ({ ...p, vaults: p.vaults.map((it, i) => i === idx ? { ...it, effort: it.effort + 1 } : it) }))}>+</button>
                      </div>
                    </div>
                    <div style={{ padding: '0.35rem', borderRadius: '4px', background: 'var(--bg-void)', border: '1px solid var(--border-subtle)' }}>
                      <div className="semantic-badge badge-currency-pip">PIP</div>
                      <div style={{ fontWeight: 800, marginTop: '0.15rem' }}>{v.pip}</div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '0.2rem' }}>
                        <button type="button" className="vtt-btn" style={{ padding: '1px 5px' }} onClick={() => setState((p) => ({ ...p, vaults: p.vaults.map((it, i) => i === idx ? { ...it, pip: Math.max(0, it.pip - 1) } : it) }))}>-</button>
                        <button type="button" className="vtt-btn" style={{ padding: '1px 5px' }} onClick={() => setState((p) => ({ ...p, vaults: p.vaults.map((it, i) => i === idx ? { ...it, pip: it.pip + 1 } : it) }))}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Setup Steps Reference */}
          <div style={{ padding: '0.85rem', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--currency-effort)', marginBottom: '0.4rem' }}>
              6-STEP TABLETOP INITIALIZATION SEQUENCE (FIELD MANUAL)
            </div>
            <ol style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <li><strong>Step 1: Agency Council & Vault Allocation:</strong> Each player chooses 1 Faction and takes their Player Mat, starting [12 CR], [3 EF], and [2 PIP].</li>
              <li><strong>Step 2: Specialist Roster Bench:</strong> Shuffle the 24 Specialist Operative cards and deal 3 to each Faction bench.</li>
              <li><strong>Step 3: Armory Supply Market:</strong> Deal 6 face-up Armory cards to form the Quartermaster supply row.</li>
              <li><strong>Step 4: Headquarters Station Deployment:</strong> Place the 9 HQ Facilities in the central base grid.</li>
              <li><strong>Step 5: Campaign Dossier & Threat Deck:</strong> Select active campaign and assemble the stage deck.</li>
              <li><strong>Step 6: Initial Command Auction:</strong> Players bid [CR] to claim the Squad Leader Token for Drop 1.</li>
            </ol>
          </div>

          <button
            type="button"
            className="vtt-btn vtt-btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.92rem', fontWeight: 700 }}
            onClick={() => setActiveTab('phase1_mission')}
          >
            Proceed to Phase 1: Mission Selection & Briefing ▶
          </button>
        </section>
      )}

      {/* ====================================================================
          PHASE 1: MISSION SELECT & INTELLIGENCE BRIEFING
         ==================================================================== */}
      {activeTab === 'phase1_mission' && (
        <section className="vtt-panel">
          <div className="vtt-panel-title">
            <span>🗺️ PHASE 1: MISSION SELECTION & THREAT INTELLIGENCE</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Chapter 3 Tabletop Rules
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            {/* Campaign Dossier Selector */}
            <div style={{ padding: '0.85rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <label style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--currency-effort)', display: 'block', marginBottom: '0.35rem' }}>
                ACTIVE CAMPAIGN DOSSIER
              </label>
              <select
                value={state.campaignId}
                onChange={(e) => setState((p) => ({ ...p, campaignId: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  borderRadius: '6px',
                  background: 'var(--bg-void)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-strong)',
                  marginBottom: '0.6rem',
                }}
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                <SemanticText text={activeCampaign?.rules_text || activeCampaign?.flavor_text || ''} />
              </div>
            </div>

            {/* Mission Selector */}
            <div style={{ padding: '0.85rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <label style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--currency-effort)', display: 'block', marginBottom: '0.35rem' }}>
                ACTIVE MISSION / SIDE-MISSION BRIEF
              </label>
              <select
                value={state.missionId}
                onChange={(e) => setState((p) => ({ ...p, missionId: e.target.value, stageIndex: 0, overrideFocus: null }))}
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  borderRadius: '6px',
                  background: 'var(--bg-void)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-strong)',
                  marginBottom: '0.6rem',
                }}
              >
                {missions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                <SemanticText text={activeMission?.rules_text || activeMission?.flavor_text || ''} />
              </div>
            </div>

            {/* Mission Failure Tracker */}
            <div style={{ padding: '0.85rem', borderRadius: '6px', background: 'var(--currency-doom-bg)', border: '1px solid var(--currency-doom)' }}>
              <label style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#f87171', display: 'block', marginBottom: '0.35rem' }}>
                TASK FORCE DISSOLUTION TRACKER ([FAIL])
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                <button type="button" className="vtt-btn" onClick={() => setState((p) => ({ ...p, doom: Math.max(0, p.doom - 1) }))}>-</button>
                <strong style={{ fontSize: '1.2rem', color: '#ff8080' }}>
                  {state.doom} / {activeCampaign?.stats?.max_doom || 3} [FAIL]
                </strong>
                <button type="button" className="vtt-btn" onClick={() => setState((p) => ({ ...p, doom: p.doom + 1 }))}>+</button>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#fca5a5' }}>
                Advances only when an entire Mission fails or retreats. Reaching {activeCampaign?.stats?.max_doom || 3} dissolves the Task Force!
              </div>
            </div>
          </div>

          {/* Stages Breakdown Preview */}
          <div style={{ padding: '0.85rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--currency-effort)', marginBottom: '0.5rem' }}>
              MISSION STAGE SEQUENCE PREVIEW ({activeStages.length} STAGES)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
              {activeStages.map((st: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '6px',
                    background: 'var(--bg-void)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <strong>Stage {idx + 1}: {st.name}</strong>
                    <span className="semantic-badge badge-currency-cr">D={st.target_difficulty}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <FocusBadge focus={st.focus_required} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Focus Required</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className="vtt-btn"
              onClick={() => setActiveTab('setup')}
            >
              ◀ Back to Setup
            </button>
            <button
              type="button"
              className="vtt-btn vtt-btn-primary"
              style={{ flex: 1, padding: '0.75rem', fontSize: '0.92rem', fontWeight: 700 }}
              onClick={() => setActiveTab('phase2_command')}
            >
              Proceed to Phase 2: Roster Assembly & Command Auction ▶
            </button>
          </div>
        </section>
      )}

      {/* ====================================================================
          PHASE 2: ROSTER ASSEMBLY & COMMAND AUCTION
         ==================================================================== */}
      {(activeTab === 'phase2_command' || activeTab === 'squad') && (
        <section className="vtt-panel">
          <div className="vtt-panel-title">
            <span>👑 PHASE 2: SQUAD LEADER COMMAND AUCTION & 6-SLOT LOADOUTS</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Chapter 3 Tabletop Rules
            </span>
          </div>

          {/* Command Auction Bidding Console */}
          <div
            style={{
              padding: '0.9rem',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--currency-credits)' }}>
                  👑 Command Auction Bidding Console ([1 CR] Entry Bid)
                </strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Tie-Breakers: Highest [CR] → Highest [PIP] → Highest Candidate [LOY] → Roll-Off (BL-RULES-04)
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="vtt-btn vtt-btn-primary"
                  onClick={handleResolveCommandAuction}
                  title="Elect Squad Leader using standard canonical tie-breaker hierarchy"
                >
                  👑 Resolve Auction
                </button>
                <button
                  type="button"
                  className="vtt-btn"
                  onClick={handleZeroBidRollOff}
                  title="High-Stakes d6 Roll-Off if all players bid [0 CR] or decline (BL-RULES-04)"
                >
                  🎲 0-Bid Roll-Off (BL-RULES-04)
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.65rem' }}>
              {state.vaults.slice(0, state.playerCount || 4).map((v, idx) => (
                <div
                  key={v.playerIndex}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '6px',
                    background: v.isSquadLeader ? 'rgba(0, 229, 255, 0.12)' : 'var(--bg-card)',
                    border: v.isSquadLeader ? '1px solid var(--currency-effort)' : '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong>{v.playerName}</strong>
                    {v.isSquadLeader && <span className="semantic-badge badge-currency-cr">👑 SQUAD LEADER</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Credit Bid:</span>
                    <input
                      type="number"
                      min={0}
                      max={v.credits}
                      value={v.commandBid}
                      onChange={(e) => {
                        const bid = Math.max(0, Number(e.target.value) || 0);
                        setState((prev) => ({
                          ...prev,
                          vaults: prev.vaults.map((item, i) =>
                            i === idx ? { ...item, commandBid: bid } : item
                          ),
                        }));
                      }}
                      style={{
                        width: '60px',
                        padding: '0.2rem 0.35rem',
                        borderRadius: '4px',
                        background: 'var(--bg-void)',
                        color: 'var(--currency-credits)',
                        border: '1px solid var(--border-strong)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Squad Leader Levers Banner */}
            <div style={{ marginTop: '0.75rem', padding: '0.55rem 0.75rem', borderRadius: '4px', background: 'rgba(0, 229, 255, 0.06)', border: '1px solid rgba(0, 229, 255, 0.25)', fontSize: '0.76rem', color: '#cbd5e1' }}>
              <strong>Squad Leader Powers:</strong> (1) Step 1 Dynamic Focus Swap (Force Breach / Tactical Bypass + BL-RULES-07 Split Modifiers), (2) Step 5 Momentum Die Allocation, (3) Transition Logistical Refresh ([2 EF] / [3 EF]), (4) Tactical vs Forced Retreat.
            </div>
          </div>

          {/* Away Team Operatives Roster & 6-Slot Anatomical Validator */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--currency-effort)', marginBottom: '0.5rem' }}>
              AWAY TEAM ROSTER & 6-SLOT ANATOMICAL LOADOUTS (4 OPERATIVES)
            </div>
            <div className="vtt-grid-4">
              {state.squad.map((op, slotIdx) => {
                const char = characters.find((c) => c.id === op.characterId);
                const charStats = char?.stats || {};
                const baseDice = (charStats.dice_pool || 6) + op.bonusDice - op.critInjuryDicePenalty;
                const maxHp = (charStats.max_hp || 3) - op.critInjuryHpPenalty;
                const equippedItems = items.filter((it) => op.equippedItemIds.includes(it.id));

                return (
                  <div
                    key={slotIdx}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.9rem' }}>Slot {slotIdx + 1}: {char?.title || 'Unassigned'}</strong>
                      <span className="semantic-badge badge-focus-combat">{charStats.focus_primary || 'Combat'}</span>
                    </div>

                    <select
                      value={op.characterId}
                      onChange={(e) => {
                        const newCharId = e.target.value;
                        setState((p) => ({
                          ...p,
                          squad: p.squad.map((s, i) =>
                            i === slotIdx ? { ...s, characterId: newCharId } : s
                          ),
                        }));
                      }}
                      style={{
                        padding: '0.35rem',
                        borderRadius: '4px',
                        background: 'var(--bg-void)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-strong)',
                        fontSize: '0.76rem',
                      }}
                    >
                      {characters.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.stats?.focus_primary} 3+, {c.stats?.dice_pool}d6, {c.stats?.max_hp} HP)
                        </option>
                      ))}
                    </select>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span>HP: <strong style={{ color: '#ff8080' }}>{op.currentHp} / {maxHp}</strong></span>
                      <span>Static Dice Pool: <strong style={{ color: 'var(--currency-effort)' }}>{baseDice - op.spentDice} / {baseDice}d6</strong></span>
                    </div>

                    {/* 6-Slot Anatomical Equip Section */}
                    <div style={{ fontSize: '0.74rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Equipped Items ({equippedItems.length}):</div>
                      {equippedItems.map((it) => (
                        <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ color: '#cbd5e1' }}>• {it.title}</span>
                          <button
                            type="button"
                            className="vtt-btn"
                            style={{ padding: '0 4px', fontSize: '0.68rem' }}
                            onClick={() => handleUnequipItem(slotIdx, it.id)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleEquipItem(slotIdx, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        style={{
                          width: '100%',
                          marginTop: '0.35rem',
                          padding: '0.25rem',
                          borderRadius: '4px',
                          background: 'var(--bg-void)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.72rem',
                        }}
                      >
                        <option value="">+ Equip Armory Item...</option>
                        {items
                          .filter((it) => !op.equippedItemIds.includes(it.id))
                          .map((it) => (
                            <option key={it.id} value={it.id}>
                              {it.title} ({it.cost_credits} CR, {it.stats?.slots_required?.join(', ') || 'Item'})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className="vtt-btn"
              onClick={() => setActiveTab('phase1_mission')}
            >
              ◀ Back to Phase 1: Mission Select
            </button>
            <button
              type="button"
              className="vtt-btn vtt-btn-primary"
              style={{ flex: 1, padding: '0.75rem', fontSize: '0.92rem', fontWeight: 700 }}
              onClick={() => setActiveTab('stage')}
            >
              Deploy Away Team: Phase 3 Tactical Mission ▶
            </button>
          </div>
        </section>
      )}

      {/* ====================================================================
          PHASE 3: TACTICAL MISSION (GUIDED SEQUENCER & RULES COACH)
         ==================================================================== */}
      {(activeTab === 'stage' || activeTab === 'medbay') && (
        <>
          <section className="vtt-panel">
            <div className="vtt-panel-title">
              <span>🧭 GUIDED 7-STEP GAME LOOP SEQUENCER & TACTICAL RULES COACH</span>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="vtt-btn"
                  title="Move to the previous step in the official Sequence of Play"
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      sequenceStep: p.sequenceStep > 1 ? p.sequenceStep - 1 : 7,
                    }))
                  }
                >
                  ◀ Prev Step
                </button>
                <button
                  type="button"
                  className="vtt-btn vtt-btn-primary"
                  title="Advance to the next step in the official Sequence of Play"
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      sequenceStep: p.sequenceStep < 7 ? p.sequenceStep + 1 : 1,
                    }))
                  }
                >
                  Next Step ▶
                </button>
              </div>
            </div>

            {/* 7-Step Clickable Sequencer Bar */}
            <div className="vtt-sequencer-bar">
              {SEQUENCE_STEPS.map((st) => {
                const isActive = state.sequenceStep === st.step;
                const isDone = state.sequenceStep > st.step;
                return (
                  <button
                    key={st.step}
                    type="button"
                    className={`vtt-step-pill ${isActive ? 'active' : isDone ? 'completed' : ''}`}
                    title={st.coachHint}
                    onClick={() => {
                      setState((p) => ({ ...p, sequenceStep: st.step }));
                      if (st.step === 4 || st.step === 7) setTacticalSubTab('medbay');
                      else setTacticalSubTab('stage');
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.66rem',
                        color: isActive
                          ? 'var(--currency-effort)'
                          : isDone
                          ? '#34d399'
                          : 'var(--text-muted)',
                      }}
                    >
                      {isDone ? '✓ COMPLETED' : isActive ? '● ACTIVE STEP' : `STEP 0${st.step}`}
                    </div>
                    <strong style={{ fontSize: '0.78rem' }}>{st.shortTitle}</strong>
                  </button>
                );
              })}
            </div>

            {/* Contextual Rules Coach & Live Probability Hint */}
            <div className="vtt-coach-banner">
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--currency-effort)',
                    fontWeight: 700,
                    marginBottom: '0.2rem',
                  }}
                >
                  💡 ACTIVE STEP RULES COACH — {activeStepMeta.fullTitle}
                </div>
                <div style={{ color: '#dbe4f0', lineHeight: 1.5 }}>
                  <SemanticText text={activeStepMeta.coachHint} />
                </div>
              </div>

              <div
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: '6px',
                  background: 'rgba(15, 23, 42, 0.88)',
                  border: '1px solid var(--border-strong)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  minWidth: '255px',
                }}
                title="Live 1,000-trial Monte Carlo simulation of your currently committed static dice against Target Difficulty D"
              >
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.68rem' }}>
                  PRE-ROLL MONTE CARLO FORECAST ({squadSummary.totalCommittedDice}d6 vs D={state.targetDifficulty})
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  <span>Clear Odds:</span>
                  <strong
                    style={{
                      color:
                        liveSimulation.clearProbabilityPct >= 80
                          ? '#34d399'
                          : liveSimulation.clearProbabilityPct >= 55
                          ? '#fbbf24'
                          : '#f87171',
                    }}
                  >
                    {liveSimulation.clearProbabilityPct}% (E={squadSummary.expectedSuccesses} ES)
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Phase 1 Early Clear:</span>
                  <strong style={{ color: '#38bdf8' }}>
                    {liveSimulation.earlyPhase1ClearProbabilityPct}%
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Momentum ([MOM]) Odds:</span>
                  <strong style={{ color: '#a855f7' }}>
                    {liveSimulation.momentumProbabilityPct}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Sub-view switcher within Phase 3 */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                type="button"
                className={`vtt-btn ${(activeTab === 'stage' && tacticalSubTab === 'stage') ? 'vtt-btn-primary' : ''}`}
                onClick={() => { setActiveTab('stage'); setTacticalSubTab('stage'); }}
              >
                🎲 Active Stage & Static Dice Resolver
              </button>
              <button
                type="button"
                className={`vtt-btn ${(activeTab === 'medbay' || tacticalSubTab === 'medbay') ? 'vtt-btn-primary' : ''}`}
                onClick={() => { setActiveTab('medbay'); setTacticalSubTab('medbay'); }}
              >
                🏥 Field Casualties & Med Bay Trauma Roller
              </button>
            </div>
          </section>
        </>
      )}

{/* TAB 1: STAGE RESOLVER & DICE ENGINE */}
      {activeTab === 'stage' && (
        <section className="vtt-panel">
          <div className="vtt-panel-title">
            <span>
              ACTIVE STAGE: {currentStage?.name || 'Stage 1'} (Stage {state.stageIndex + 1} of{' '}
              {Math.max(1, activeStages.length)})
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {activeStages.map((st: any, sIdx: number) => (
                <button
                  key={sIdx}
                  type="button"
                  className={`vtt-btn ${state.stageIndex === sIdx ? 'vtt-btn-primary' : ''}`}
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      stageIndex: sIdx,
                      sequenceStep: 1,
                      overrideFocus: null,
                      secondaryConcurrentFocus: null,
                      squad: p.squad.map((op) => ({ ...op, rolledDice: [] })),
                    }))
                  }
                >
                  Stage {sIdx + 1}: {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stage Briefing Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '0.85rem',
              padding: '0.85rem',
              borderRadius: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1rem',
            }}
          >
            <div title="Step 1 Dynamic Focus Swaps: The Squad Leader may shift a non-combat room to [Combat] (+1/+2 Difficulty) via Force Breach, or shift a [Combat] room to [Infiltrate] via Tactical Bypass.">
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                EFFECTIVE OPERATIONAL FOCUS
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                <FocusBadge focus={effectivePrimaryFocus} roleLabel="Primary" />
                {state.secondaryConcurrentFocus && (
                  <FocusBadge focus={state.secondaryConcurrentFocus} roleLabel="+Scientist" />
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="vtt-btn"
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => {
                    setState((p) => ({
                      ...p,
                      overrideFocus: 'combat',
                      targetDifficulty: p.targetDifficulty + 1,
                    }));
                    appendLog(
                      'Squad Leader declared Force Breach: Stage Focus shifted to [Combat] (+1 Target Difficulty).'
                    );
                  }}
                >
                  💥 Force Breach → [Combat]
                </button>
                <button
                  type="button"
                  className="vtt-btn"
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => {
                    setState((p) => ({ ...p, overrideFocus: 'infiltrate' }));
                    appendLog(
                      'Squad Leader declared Tactical Bypass: Stage Focus shifted to [Infiltrate].'
                    );
                  }}
                >
                  🌿 Bypass → [Infiltrate]
                </button>
              </div>
            </div>

            <div title="Step 1 Class Powers: Scientist's Dual-Vector Mapping ([1 EF]) adds a second concurrent Focus so operatives matching either Focus roll at 3+ in Phase 1!">
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>
                FOCUS OVERRIDE / SCIENTIST DUAL-VECTOR ([1 EF])
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem' }}>
                <select
                  value={state.overrideFocus || ''}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      overrideFocus: e.target.value || null,
                    }))
                  }
                  style={{
                    flex: 1,
                    padding: '0.35rem',
                    borderRadius: '4px',
                    background: 'var(--bg-void)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.76rem',
                  }}
                >
                  <option value="">Printed Focus ({currentStage?.primary_focus || 'combat'})</option>
                  <option value="combat">Shift → [Combat]</option>
                  <option value="infiltrate">Shift → [Infiltrate]</option>
                  <option value="intel">Shift → [Intel]</option>
                  <option value="operations">Shift → [Operations]</option>
                  <option value="negotiate">Shift → [Negotiate]</option>
                  <option value="survival">Shift → [Survival]</option>
                </select>
                <select
                  value={state.secondaryConcurrentFocus || ''}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      secondaryConcurrentFocus: e.target.value || null,
                    }))
                  }
                  style={{
                    flex: 1,
                    padding: '0.35rem',
                    borderRadius: '4px',
                    background: 'var(--bg-void)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.76rem',
                  }}
                >
                  <option value="">+Dual Focus (Scientist)</option>
                  <option value="combat">+[Combat]</option>
                  <option value="infiltrate">+[Infiltrate]</option>
                  <option value="intel">+[Intel]</option>
                  <option value="operations">+[Operations]</option>
                  <option value="negotiate">+[Negotiate]</option>
                  <option value="survival">+[Survival]</option>
                </select>
              </div>
            </div>

            <div title="Step 1 Stage Modifier: Draw 1 Stage Modifier card face-up when entering the stage.">
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>
                ATTACHED STAGE MODIFIER CARD
              </label>
              <select
                value={state.activeModifierId}
                onChange={(e) =>
                  setState((p) => ({ ...p, activeModifierId: e.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '0.4rem',
                  marginTop: '0.3rem',
                  borderRadius: '4px',
                  background: 'var(--bg-void)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.78rem',
                }}
              >
                <option value="">— No Stage Modifier Attached —</option>
                {modifiers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
              {activeModifier && (
                <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '0.3rem' }}>
                  <SemanticText text={activeModifier.rules_text} />
                </div>
              )}
            </div>

            <div title="Stage Target Difficulty (D): Standard stages require 3–6 Successes. Clearing by >= D+2 generates Operational Momentum (MOM = Successes - D - 1).">
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                STAGE TARGET DIFFICULTY (D)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                <button
                  type="button"
                  className="vtt-btn"
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      targetDifficulty: Math.max(1, p.targetDifficulty - 1),
                    }))
                  }
                >
                  -1
                </button>
                <strong style={{ fontSize: '1.25rem', color: 'var(--currency-effort)' }}>
                  {state.targetDifficulty} Successes
                </strong>
                <button
                  type="button"
                  className="vtt-btn"
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      targetDifficulty: p.targetDifficulty + 1,
                    }))
                  }
                >
                  +1
                </button>
              </div>
            </div>
          </div>

          {/* Roll CTA & Live Stage Outcome Banner */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.9rem 1.1rem',
              borderRadius: '8px',
              background: squadSummary.cleared
                ? 'rgba(16, 185, 129, 0.14)'
                : 'rgba(15, 23, 42, 0.9)',
              border: squadSummary.cleared
                ? '1px solid var(--currency-momentum)'
                : '1px solid var(--border-strong)',
              marginBottom: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                SQUAD TOTAL: {squadSummary.totalSuccesses} / {state.targetDifficulty} SUCCESSES{' '}
                {squadSummary.cleared ? '✅ STAGE CLEARED!' : '⏳ AWAITING / SHORT OF THRESHOLD'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {squadSummary.momentumEarned
                  ? `⚡ OPERATIONAL MOMENTUM ACHIEVED (>= D+2)! Generated +${squadSummary.momentumGenerated} [MOM] die refund(s)!`
                  : `Need ${Math.max(
                      0,
                      state.targetDifficulty + 2 - squadSummary.totalSuccesses
                    )} more successes for Operational Momentum [MOM].`}{' '}
                • Natural 1 Backfires: <strong>{squadSummary.totalBackfires}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="vtt-btn"
                style={{
                  fontSize: '0.86rem',
                  padding: '0.55rem 0.95rem',
                  borderColor: '#38bdf8',
                  color: '#7dd3fc',
                }}
                title="Step 2 (Phase 1 Specialists): Roll ONLY Primary Focus (3+) operatives first. If they reach D, Early Resolution clears the stage and Support operatives save all their static dice!"
                onClick={handleRollPhase1Specialists}
              >
                ⚡ Step 2: Roll Phase 1 Specialists (3+)
              </button>
              <button
                type="button"
                className="vtt-btn vtt-btn-primary"
                style={{ fontSize: '0.9rem', padding: '0.55rem 1.1rem' }}
                title="Roll all committed static dice pools across the active Away Team"
                onClick={handleRollSquadPools}
              >
                🎲 Roll All Active Static Dice Pools
              </button>
            </div>
          </div>

          {/* 4-Operative Dice Resolution Cards */}
          <div className="vtt-grid-4">
            {state.squad.map((op, slotIdx) => {
              const ev = getOperativeEval(op);
              return (
                <div
                  key={op.slotIndex}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: ev.isPhase1Specialist
                      ? '1px solid rgba(56, 189, 248, 0.5)'
                      : '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>{ev.char?.title}</strong>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: ev.isPhase1Specialist ? '#38bdf8' : 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {ev.roleLabel}
                      </div>
                    </div>
                    <span
                      className="semantic-badge badge-currency-loy"
                      title="Personal Operative Loyalty Rank ([LOY]) — Non-tradeable rank attached to this card. Unlocks Faction Loyalty Tiers 1–4 and scores 2 VP per LOY at endgame."
                    >
                      LOY {op.loyalty}
                    </span>
                  </div>

                  {/* Operative Affinity & Static Pool Status */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.55rem 0' }}>
                    <FocusBadge focus={ev.char?.focus_affinity?.primary} roleLabel="1°" />
                    <FocusBadge focus={ev.char?.focus_affinity?.secondary} roleLabel="2°" />
                    <span
                      className="stat-pill"
                      style={{ color: '#f87171' }}
                      title="Current Hit Points / Maximum Hit Points"
                    >
                      ♥ {op.currentHp}/{ev.maxHp} HP
                    </span>
                    <span
                      className="stat-pill"
                      style={{ color: '#38bdf8' }}
                      title={`Static Dice Pool: ${ev.availableStaticDice} Available / ${ev.spentDice} Spent (${ev.totalDice} Max Cap)`}
                    >
                      🎲 {ev.availableStaticDice}/{ev.totalDice} Avail ({ev.spentDice} Spent)
                    </span>
                  </div>

                  {/* Per-Stage Static Dice Commitment & Temp Dice Controls */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.35rem',
                      fontSize: '0.72rem',
                      marginBottom: '0.6rem',
                      padding: '0.4rem',
                      borderRadius: '6px',
                      background: 'var(--bg-void)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div title="Choose how many finite Static Dice from this operative's Available Pool to commit to this stage">
                      <div style={{ color: 'var(--text-muted)' }}>Commit: {ev.committedDice}d6</div>
                      <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
                        <button
                          type="button"
                          className="vtt-btn"
                          style={{ padding: '0 6px' }}
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              squad: p.squad.map((s, i) =>
                                i === slotIdx
                                  ? {
                                      ...s,
                                      committedDice: Math.max(0, ev.committedDice - 1),
                                    }
                                  : s
                              ),
                            }))
                          }
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="vtt-btn"
                          style={{ padding: '0 6px' }}
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              squad: p.squad.map((s, i) =>
                                i === slotIdx
                                  ? {
                                      ...s,
                                      committedDice: Math.min(
                                        ev.availableStaticDice,
                                        ev.committedDice + 1
                                      ),
                                    }
                                  : s
                              ),
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div title="Temporary Bonus Dice (e.g. Soldier Lock and Load +2d6 for [1 EF]). Returned to the box after rolling without depleting Static Pool.">
                      <div style={{ color: 'var(--text-muted)' }}>
                        Temp: {op.bonusDice >= 0 ? `+${op.bonusDice}` : op.bonusDice}d6
                      </div>
                      <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
                        <button
                          type="button"
                          className="vtt-btn"
                          style={{ padding: '0 6px' }}
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              squad: p.squad.map((s, i) =>
                                i === slotIdx ? { ...s, bonusDice: s.bonusDice - 1 } : s
                              ),
                            }))
                          }
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="vtt-btn"
                          style={{ padding: '0 6px' }}
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              squad: p.squad.map((s, i) =>
                                i === slotIdx ? { ...s, bonusDice: s.bonusDice + 1 } : s
                              ),
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div title="Adjust operative Hit Points (Natural 1 Backfires inflict 1 HP damage; 0 HP opens the Emergency Stabilization Window)">
                      <div style={{ color: 'var(--text-muted)' }}>HP Adjust</div>
                      <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
                        <button
                          type="button"
                          className="vtt-btn"
                          style={{ padding: '0 6px' }}
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              squad: p.squad.map((s, i) =>
                                i === slotIdx
                                  ? { ...s, currentHp: Math.max(0, s.currentHp - 1) }
                                  : s
                              ),
                            }))
                          }
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          className="vtt-btn"
                          style={{ padding: '0 6px' }}
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              squad: p.squad.map((s, i) =>
                                i === slotIdx
                                  ? { ...s, currentHp: Math.min(ev.maxHp, s.currentHp + 1) }
                                  : s
                              ),
                            }))
                          }
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Rolled Dice Display */}
                  <div
                    style={{
                      minHeight: '48px',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      background: 'var(--bg-void)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.35rem',
                      alignItems: 'center',
                      marginBottom: '0.55rem',
                    }}
                  >
                    {op.rolledDice.length === 0 ? (
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Ready to roll {ev.effectiveRollCount}d6 (Target {ev.threshold}+, E=
                        {Math.round(ev.effectiveRollCount * expectedSuccessPerDie(ev.threshold) * 100) /
                          100}{' '}
                        ES).
                      </span>
                    ) : (
                      op.rolledDice.map((val, dIdx) => {
                        const isHit = val >= ev.threshold;
                        const isBackfire = val === 1;
                        return (
                          <span
                            key={dIdx}
                            className={`die-cube ${
                              isHit ? 'hit' : isBackfire ? 'backfire' : 'miss'
                            }`}
                            title={
                              isHit
                                ? `Success (${val} >= ${ev.threshold}+)`
                                : isBackfire
                                ? 'Natural 1 Backfire! Inflicts 1 HP damage unless mitigated.'
                                : `Miss (${val} < ${ev.threshold}+)`
                            }
                          >
                            {val}
                          </span>
                        );
                      })
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.35rem',
                    }}
                  >
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#34d399' }}>
                      Hits: {ev.hits} {ev.backfires > 0 ? `• ⚠ ${ev.backfires} Backfire(s)` : ''}
                    </span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      {state.momentumTokens > 0 && ev.spentDice > 0 && (
                        <button
                          type="button"
                          className="vtt-btn"
                          style={{
                            fontSize: '0.68rem',
                            padding: '0.2rem 0.45rem',
                            borderColor: 'var(--currency-momentum)',
                            color: '#34d399',
                          }}
                          title="Spend [1 MOM] to restore 1 spent static die back to this operative's Available Pool (Skin-in-the-Game rule: must have rolled >= 1 die)"
                          onClick={() => handleRefundDieWithMomentum(slotIdx)}
                        >
                          ♻ +1 Die (-1 MOM)
                        </button>
                      )}
                      <button
                        type="button"
                        className="vtt-btn"
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                        title="Convert 1 rolled miss into a guaranteed hit (e.g. via reroll/calibration item or ability)"
                        onClick={() => handleConvertMissToHit(slotIdx)}
                      >
                        ⚡ Miss → Hit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              className="vtt-btn"
              onClick={() => setActiveTab('phase2_command')}
            >
              ◀ Back to Phase 2: Command & Roster
            </button>
            <button
              type="button"
              className="vtt-btn vtt-btn-primary"
              style={{ flex: 1, padding: '0.75rem', fontSize: '0.92rem', fontWeight: 700 }}
              onClick={() => setActiveTab('hq')}
            >
              Mission Complete: Proceed to Phase 4 HQ Downtime ▶
            </button>
          </div>
        </section>
      )}

      {/* TAB 2: SQUAD STAGING & 6-SLOT EQUIPMENT VALIDATOR */}
      {activeTab === 'squad' && (
        <section className="vtt-panel">
          <div className="vtt-panel-title">
            <span>AWAY TEAM ROSTER & 6-SLOT ANATOMICAL LOADOUT VALIDATOR</span>
          </div>
          <div className="vtt-grid-4">
            {state.squad.map((op, slotIdx) => {
              const ev = getOperativeEval(op);
              return (
                <div
                  key={op.slotIndex}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>
                    OPERATIVE SLOT {slotIdx + 1} (24-AGENT FOCUS MATRIX)
                  </label>
                  <select
                    value={op.characterId}
                    onChange={(e) => {
                      const newChar = characters.find((c) => c.id === e.target.value);
                      setState((p) => ({
                        ...p,
                        squad: p.squad.map((s, i) =>
                          i === slotIdx
                            ? {
                                ...s,
                                characterId: e.target.value,
                                currentHp: newChar?.stats?.hp_cap || 3,
                                spentDice: 0,
                                committedDice: 3,
                                rolledDice: [],
                              }
                            : s
                        ),
                      }));
                    }}
                    style={{
                      width: '100%',
                      padding: '0.4rem',
                      marginTop: '0.25rem',
                      marginBottom: '0.6rem',
                      borderRadius: '4px',
                      background: 'var(--bg-void)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-strong)',
                    }}
                  >
                    {characters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>

                  <div style={{ fontSize: '0.78rem', marginBottom: '0.65rem', color: '#cbd5e1' }}>
                    <SemanticText text={ev.char?.rules_text} />
                  </div>

                  {/* Equipped Items List */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--currency-credits)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    EQUIPPED ARMORY LOADOUT ({ev.equipped.length} items)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.65rem' }}>
                    {ev.equipped.map((it) => (
                      <div
                        key={it.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.35rem 0.5rem',
                          borderRadius: '4px',
                          background: 'var(--bg-void)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.76rem',
                        }}
                      >
                        <span>
                          <strong>{it.title}</strong>{' '}
                          <span style={{ color: 'var(--text-muted)' }}>
                            ({(it.stats?.slots_required || [' Belt ']).join('+')})
                          </span>
                        </span>
                        <button
                          type="button"
                          className="vtt-btn vtt-btn-danger"
                          style={{ padding: '1px 6px', fontSize: '0.68rem' }}
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              squad: p.squad.map((s, i) =>
                                i === slotIdx
                                  ? {
                                      ...s,
                                      equippedItemIds: s.equippedItemIds.filter(
                                        (id) => id !== it.id
                                      ),
                                    }
                                  : s
                              ),
                            }))
                          }
                        >
                          Unequip
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Equipment Dropdown */}
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      handleEquipItem(slotIdx, e.target.value);
                      e.target.value = '';
                    }}
                    style={{
                      width: '100%',
                      padding: '0.4rem',
                      borderRadius: '4px',
                      background: 'var(--bg-void)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.76rem',
                    }}
                  >
                    <option value="">+ Equip Item from Armory (87 Items)...</option>
                    {items.map((it) => (
                      <option key={it.id} value={it.id}>
                        [T{it.tier}] {it.title} ({(it.stats?.slots_required || ['Consumable']).join('+')}) —{' '}
                        {it.cost?.credits || 0} CR
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 3: SPONSORED HQ FACILITIES & LANDMARKS */}
      {activeTab === 'hq' && (
        <section className="vtt-panel">
          <div className="vtt-panel-title">
            <span>🏢 PHASE 4: HEADQUARTERS DOWNTIME (8-STEP BASE OPERATIONS LOOP)</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Chapter 7 Tabletop Rules
            </span>
          </div>

          {/* 8-Step Base Operations Cycle Reference */}
          <div style={{ padding: '0.85rem', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--currency-effort)', marginBottom: '0.4rem' }}>
              THE 8-STEP BASE OPERATIONS CYCLE (FIELD MANUAL)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <div><strong>1. Debrief & Dual-Stream Payouts:</strong> Baseline stipends + shared clearance bounty pool.</div>
              <div><strong>2. Stand-Down Auction:</strong> Rest an operative; winner double-deploys next drop.</div>
              <div><strong>3. Infirmary Recovery:</strong> Rest wounded operatives in recovery beds (5+/4+ healing).</div>
              <div><strong>4. Sponsored Modules:</strong> Sponsor facility upgrades for +1 PIP / +2 VP each.</div>
              <div><strong>5. Recruitment Bureau:</strong> Spend [8 CR] to draft a fresh specialist from the agency bench.</div>
              <div><strong>6. Quartermaster Armory:</strong> Buy weapons, armor, tech, and consumables with [CR].</div>
              <div><strong>7. Boardroom Perks & Agendas:</strong> Score faction agendas, unlock loyalty doctrines.</div>
              <div><strong>8. Next Drop Squad Assembly:</strong> Prepare 4-operative strike roster for next drop.</div>
            </div>
          </div>

          {/* Step 1: Debrief & Dual-Stream Payouts Calculator (BL-RULES-01) */}
          <div
            style={{
              padding: '0.85rem',
              borderRadius: '8px',
              background: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid var(--currency-effort)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--currency-credits)' }}>
                  💰 Step 1 Debrief & Dual-Stream Payouts Calculator (BL-RULES-01)
                </strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Baseline: [2 CR] per deployed operative + [1 PIP] per Faction • Shared clearance bounty pool split evenly (odd remainder to Squad Leader)
                </div>
              </div>
              <button
                type="button"
                className="vtt-btn vtt-btn-primary"
                onClick={() => handleDistributeMissionPayouts(bountyPoolCr, bountyPoolPip)}
                title="Calculate and deposit dual-stream mission payouts into player vaults"
              >
                💸 Claim & Distribute Payouts
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Shared Mission Pool Credits:</span>
                <input
                  type="number"
                  min={0}
                  value={bountyPoolCr}
                  onChange={(e) => setBountyPoolCr(Math.max(0, Number(e.target.value) || 0))}
                  style={{
                    width: '60px',
                    padding: '0.2rem 0.35rem',
                    borderRadius: '4px',
                    background: 'var(--bg-void)',
                    color: 'var(--currency-credits)',
                    border: '1px solid var(--border-strong)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Shared Mission Pool PIP:</span>
                <input
                  type="number"
                  min={0}
                  value={bountyPoolPip}
                  onChange={(e) => setBountyPoolPip(Math.max(0, Number(e.target.value) || 0))}
                  style={{
                    width: '60px',
                    padding: '0.2rem 0.35rem',
                    borderRadius: '4px',
                    background: 'var(--bg-void)',
                    color: 'var(--currency-pip)',
                    border: '1px solid var(--border-strong)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--currency-effort)', marginBottom: '0.5rem' }}>
            STEP 4: SPONSORED BASE MODULES (+2 VP PER SPONSORED FACILITY)
          </div>
          <div className="card-grid">
            {hqFacilities.map((hq) => (
              <div key={hq.id} className="at-card" style={{ padding: '0.9rem' }}>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '0.98rem' }}>{hq.title}</h3>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                  <SemanticText text={hq.rules_text} />
                </div>
                {(hq.modules || []).length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(hq.modules || []).map((mod: any) => {
                      const sponsorIdx = state.sponsoredModules[mod.name];
                      return (
                        <div
                          key={mod.name}
                          style={{
                            padding: '0.45rem',
                            borderRadius: '6px',
                            background: 'var(--bg-void)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '0.76rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{mod.name}</strong>
                            <span className="semantic-badge badge-currency-cr">
                              {mod.cost_credits} CR
                            </span>
                          </div>
                          <div style={{ color: '#94a3b8', margin: '0.2rem 0' }}>
                            <SemanticText text={mod.owner_benefit || mod.effect} />
                          </div>
                          <select
                            value={sponsorIdx ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setState((p) => {
                                const next = { ...p.sponsoredModules };
                                if (val === '') delete next[mod.name];
                                else next[mod.name] = Number(val);
                                return { ...p, sponsoredModules: next };
                              });
                            }}
                            style={{
                              width: '100%',
                              marginTop: '0.25rem',
                              padding: '0.25rem',
                              borderRadius: '4px',
                              background: 'var(--bg-card)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-subtle)',
                              fontSize: '0.72rem',
                            }}
                          >
                            <option value="">— Unbuilt / Unsponsored —</option>
                            {state.vaults.map((v) => (
                              <option key={v.playerIndex} value={v.playerIndex}>
                                Sponsored by {v.playerName} (+2 VP)
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              className="vtt-btn"
              onClick={() => setActiveTab('stage')}
            >
              ◀ Back to Phase 3: Tactical Mission
            </button>
            <button
              type="button"
              className="vtt-btn vtt-btn-primary"
              style={{ flex: 1, padding: '0.75rem', fontSize: '0.92rem', fontWeight: 700 }}
              onClick={() => setActiveTab('phase1_mission')}
            >
              Prepare Next Drop: Advance to Phase 1 Mission Select ↺
            </button>
          </div>
        </section>
      )}

      {/* TAB 4: MED BAY & CRITICAL TRAUMA ROLLER */}
      {activeTab === 'medbay' && (
        <section className="vtt-panel">
          <div className="vtt-panel-title">
            <span>HQ INFIRMARY & FIELD STABILIZATION / TRAUMA ENGINE</span>
          </div>
          <div className="vtt-grid-4">
            {state.squad.map((op, slotIdx) => {
              const ev = getOperativeEval(op);
              return (
                <div
                  key={op.slotIndex}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <strong>{ev.char?.title}</strong>
                  <div style={{ fontSize: '0.8rem', margin: '0.4rem 0' }}>
                    Current Health: <strong>{op.currentHp} / {ev.maxHp} HP</strong> • Crit Dice Penalty:{' '}
                    <strong>-{op.critInjuryDicePenalty}</strong> • Crit HP Penalty:{' '}
                    <strong>-{op.critInjuryHpPenalty}</strong>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className="vtt-btn vtt-btn-primary"
                      onClick={() => handleRollMedBay(slotIdx)}
                    >
                      🏥 Roll 2d6 Infirmary Recovery
                    </button>
                    <button
                      type="button"
                      className="vtt-btn vtt-btn-danger"
                      onClick={() => handleRollTraumaTable(slotIdx)}
                    >
                      🩸 Roll 1d6 Critical Injury Table (0 HP)
                    </button>
                    {(op.critInjuryDicePenalty > 0 || op.critInjuryHpPenalty > 0) && (
                      <button
                        type="button"
                        className="vtt-btn"
                        onClick={() =>
                          setState((p) => ({
                            ...p,
                            squad: p.squad.map((s, i) =>
                              i === slotIdx
                                ? {
                                    ...s,
                                    critInjuryDicePenalty: 0,
                                    critInjuryHpPenalty: 0,
                                    traumaNote: '',
                                  }
                                : s
                            ),
                          }))
                        }
                      >
                        ✨ Purge Critical Injury (3 [CR] Bionic Rehab)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 5: MONTE CARLO BALANCE & STATISTICS SIMULATOR */}
      {activeTab === 'simulator' && (
        <section className="vtt-panel">
          <div className="vtt-panel-title">
            <span>
              📊 MONTE CARLO STAGE SIMULATOR & 9.0 ES BALANCE AUDITOR ({liveSimulation.trials} TRIALS)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={simTrials}
                onChange={(e) => setSimTrials(Number(e.target.value))}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  background: 'var(--bg-void)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '0.78rem',
                }}
              >
                <option value={500}>500 Monte Carlo Trials</option>
                <option value={1000}>1,000 Monte Carlo Trials</option>
                <option value={5000}>5,000 Monte Carlo Trials</option>
              </select>
              <button
                type="button"
                className="vtt-btn vtt-btn-primary"
                onClick={() => setSimSeedBump((n) => n + 1)}
              >
                🔄 Re-Run Monte Carlo Simulation
              </button>
            </div>
          </div>

          {/* Simulation Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.85rem',
              marginBottom: '1.15rem',
            }}
          >
            <div className="wiki-pillar-card">
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                STAGE CLEAR PROBABILITY (≥ {state.targetDifficulty} HITS)
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
                {liveSimulation.clearProbabilityPct}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Avg Rolled Successes: {liveSimulation.averageSuccesses} (Theory:{' '}
                {liveSimulation.theoreticalExpectedSuccesses} ES)
              </div>
            </div>

            <div className="wiki-pillar-card">
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                PHASE 1 EARLY RESOLUTION RATE
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                {liveSimulation.earlyPhase1ClearProbabilityPct}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Support (4+/5+) saves dice when Phase 1 clears
              </div>
            </div>

            <div className="wiki-pillar-card">
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                MOMENTUM ([MOM]) GENERATION RATE
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#c084fc', marginTop: '0.2rem' }}>
                {liveSimulation.momentumProbabilityPct}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Avg Refunded Dice: +{liveSimulation.averageMomentumGenerated} [MOM] / stage
              </div>
            </div>

            <div className="wiki-pillar-card">
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                EXPECTED BACKFIRE ATTRITION
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f87171', marginTop: '0.2rem' }}>
                -{liveSimulation.averageHpLost} HP
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                0 HP Emergency Stabilization Risk: {liveSimulation.zeroHpCasualtyProbabilityPct}%
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '6px',
              background: 'rgba(0, 229, 255, 0.08)',
              borderLeft: '4px solid var(--currency-effort)',
              marginBottom: '1.25rem',
              fontSize: '0.86rem',
            }}
          >
            <strong>Simulator Tactical Verdict:</strong>{' '}
            <SemanticText text={liveSimulation.tacticalVerdict} />
          </div>

          {/* 24-Operative 9.0 ES Ledger Verification Table */}
          <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 0.6rem 0' }}>
            24-Operative 9.0 ES Mathematical Balance Ledger Audit
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>Operative</th>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>Class</th>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>Primary (3+)</th>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>Secondary (4+)</th>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>HP (1.5 ES)</th>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>Static Dice (0.5 ES)</th>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>Class Offset</th>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>Total Budget</th>
                </tr>
              </thead>
              <tbody>
                {characters.map((ch) => {
                  const hp = ch.stats?.hp_cap || 3;
                  const dice = ch.stats?.static_dice || 6;
                  const lc = (ch.category || '').toLowerCase();
                  const classOff = lc === 'survivalist' ? 1.0 : lc === 'scientist' ? 0.5 : 0.0;
                  const powerEs = Math.max(0.5, 9.0 - hp * 1.5 - dice * 0.5 - classOff);
                  const audit = evaluateCharacterBudgetES({
                    hpCap: hp,
                    staticDice: dice,
                    powerEs,
                    className: ch.category || 'soldier',
                  });
                  return (
                    <tr key={ch.id}>
                      <td style={{ padding: '0.45rem', border: '1px solid var(--border-subtle)' }}>
                        <strong>{ch.title}</strong>
                      </td>
                      <td style={{ padding: '0.45rem', border: '1px solid var(--border-subtle)', textTransform: 'capitalize' }}>
                        {ch.category}
                      </td>
                      <td style={{ padding: '0.45rem', border: '1px solid var(--border-subtle)' }}>
                        <FocusBadge focus={ch.focus_affinity?.primary} />
                      </td>
                      <td style={{ padding: '0.45rem', border: '1px solid var(--border-subtle)' }}>
                        <FocusBadge focus={ch.focus_affinity?.secondary} />
                      </td>
                      <td style={{ padding: '0.45rem', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>
                        {hp} HP ({audit.hpEs.toFixed(1)} ES)
                      </td>
                      <td style={{ padding: '0.45rem', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>
                        {dice}d6 ({audit.diceEs.toFixed(1)} ES)
                      </td>
                      <td style={{ padding: '0.45rem', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>
                        +{audit.classOffsetEs.toFixed(1)} ES
                      </td>
                      <td style={{ padding: '0.45rem', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: 700 }}>
                        {audit.totalEs.toFixed(1)} ES ✓
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tactical Combat & Telemetry Log */}
      <section className="vtt-panel">
        <div className="vtt-panel-title">
          <span>OPERATIONAL TELEMETRY & ACTION LOG</span>
        </div>
        <div
          style={{
            maxHeight: '150px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {state.combatLog.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
