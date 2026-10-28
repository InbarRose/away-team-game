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
import { runGameSimulation, SimulationReport } from './gameSimulator';
import { OperativeCard } from './components/OperativeCard';
import { FactionDossierCard } from './components/FactionDossierCard';
import { StageCard } from './components/StageCard';
import { ArmoryItemCard } from './components/ArmoryItemCard';
import { TactileDiceTray } from './components/TactileDiceTray';
import { SecretObjectiveCard } from './components/SecretObjectiveCard';
import { AgendaCard } from './components/AgendaCard';
import { HQFacilityBoard, FacilitySponsorshipRecord } from './components/HQFacilityBoard';
import { FactionPerksConsole } from './components/FactionPerksConsole';

export interface VTTProps {
  components?: GameComponent[];
  onReturnToWiki?: () => void;
}

export interface FactionVault {
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

export interface DeployedOperative {
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

export type VTTFlowStep =
  | 'setup_players'
  | 'setup_factions'
  | 'setup_bench'
  | 'setup_agendas_objectives'
  | 'setup_campaign'
  | 'phase1_brief'
  | 'phase2_auction'
  | 'phase3_tactical'
  | 'phase4_hq';

export type VTTTabKey =
  | 'setup'
  | 'phase1_mission'
  | 'phase2_command'
  | 'stage'
  | 'squad'
  | 'hq'
  | 'medbay'
  | 'simulator';

export interface RolledDieRecord {
  dieValue: number;
  threshold: number;
  isHit: boolean;
  isBackfire: boolean;
  operativeName: string;
}

export interface VTTState {
  playerCount: number;
  flowStep: VTTFlowStep;
  setupDraftPlayerIndex: number;
  activeDirectorIndex: number; // Active Director at the tabletop console (Phase 4 / actions)
  activeTab: VTTTabKey;
  campaignId: string;
  missionIndex: number;
  stageIndex: number;
  sequenceStep: number; // 1..6 tactical micro-loop
  overrideFocus: string | null;
  secondaryConcurrentFocus: string | null;
  activeModifierId: string;
  targetDifficulty: number;
  doom: number; // [FAIL] tokens
  retriesUsed: number;
  momentumTokens: number;
  sponsoredModules: Record<string, number>;
  sponsoredFacilities: Record<string, FacilitySponsorshipRecord>;
  activePerkIds: Record<number, string[]>;
  vaults: FactionVault[];
  squad: DeployedOperative[];
  playerBenches: Record<number, string[]>;
  factionArmoryCaches: Record<number, string[]>; // Unequipped purchased items in player cache
  armoryMarketItemIds: string[]; // Active Quartermaster market display row
  openAgendaIds: string[]; // 3 Active face-up Open Corporate Agendas
  claimedAgendaIds: Record<string, number>; // agendaId -> playerIndex who claimed it
  playerSecretObjectives: Record<number, { dealtIds: string[]; selectedId: string | null; isRevealed: boolean }>;
  stageHits: number;
  stageBackfires: number;
  rolledDiceHistory: RolledDieRecord[];
  combatLog: string[];
  payoutsClaimed: boolean;
  negotiatedBountyCredits: Record<number, number>;
}

export const IN_GAME_PHASES = [
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
    title: '📊 Simulator & Telemetry',
    subtitle: 'Monte Carlo & Chaos Tests',
    badgeClass: 'badge-sim',
  },
] as const;

export const SETUP_STEPS = [
  { step: 'setup_players', label: '0.1 Players', subtitle: 'Table Seating' },
  { step: 'setup_factions', label: '0.2 Factions', subtitle: 'Dossier Draft' },
  { step: 'setup_bench', label: '0.3 Specialists', subtitle: 'Operative Draft' },
  { step: 'setup_agendas_objectives', label: '0.4 Objectives', subtitle: 'Secret Mandates' },
  { step: 'setup_campaign', label: '0.5 Campaign', subtitle: 'Campaign Track' },
] as const;

export const BOARD_GAME_PHASES = IN_GAME_PHASES; // Backward-compatibility alias

export const SEQUENCE_STEPS = [
  {
    step: 1,
    shortTitle: '1. Briefing & Swaps',
    fullTitle: 'Step 1: Stage Briefing, Modifiers & Dynamic Focus Swaps',
    coachHint:
      'Reveal Stage & attached Modifier. Squad Leader may declare Force Breach (shift to [Combat]) or Tactical Bypass (shift to [Infiltrate]/[Survival]). Recon & Scientist may spend [1 EF] for Step 1 powers.',
  },
  {
    step: 2,
    shortTitle: '2. Phase 1: Specialists (3+)',
    fullTitle: 'Step 2: Phase 1 Initiative — Primary Focus Specialists (3+)',
    coachHint:
      'Each player controlling a Primary Specialist independently chooses how many dice to roll (0 = Hold Back). Commit dice and roll at 3+. EARLY RESOLUTION: If rolled hits meet or exceed Target Difficulty D, the stage is cleared immediately and Phase 2 Support skips rolling!',
  },
  {
    step: 3,
    shortTitle: '3. Phase 2: Support (4+/5+)',
    fullTitle: 'Step 3: Phase 2 Initiative — Support Operatives (4+ Secondary / 5+ Out of Focus)',
    coachHint:
      'If Phase 1 Specialists did not clear Target D, each player controlling a remaining Support operative chooses how many dice to roll (0 = Hold Back). Secondary hits on 4+; Out of Focus hits on 5+. Every natural 1 Backfires for 1 HP damage.',
  },
  {
    step: 4,
    shortTitle: '4. Triage & 0 HP Check',
    fullTitle: 'Step 4: Post-Initiative Field Triage & Emergency Stabilization Window',
    coachHint:
      'If any operative reaches 0 HP, any Faction may spend [1 EF] to stabilize them to 1 HP. Unstabilized operatives trigger Dying Breath (successes count, but operative is KIA).',
  },
  {
    step: 5,
    shortTitle: '5. Resolution & [MOM]',
    fullTitle: 'Step 5: Stage Resolution & Operational Momentum ([MOM]) Distribution',
    coachHint:
      'Compare total successes vs Target D. If Successes >= D + 2, award Operational Momentum (MOM = Successes - D - 1). Squad Leader assigns die refunds to participating rollers.',
  },
  {
    step: 6,
    shortTitle: '6. Transition & Resupply',
    fullTitle: 'Step 6: Between-Stage Transition, Logistical Refresh & Retreat Check',
    coachHint:
      'Before revealing next stage, Squad Leader may spend [2 EF] (+1 die squad-wide) or [3 EF] (+2 dice squad-wide) to refresh dice pools, or call a Tactical Retreat if dice are exhausted.',
  },
];

const STORAGE_KEY = 'away_team_vtt_procedural_state_v3';

const DEFAULT_STATE: VTTState = {
  playerCount: 4,
  flowStep: 'setup_players',
  setupDraftPlayerIndex: 0,
  activeDirectorIndex: 0,
  activeTab: 'setup',
  campaignId: 'campaign-iron-dawn',
  missionIndex: 0,
  stageIndex: 0,
  sequenceStep: 1,
  overrideFocus: null,
  secondaryConcurrentFocus: null,
  activeModifierId: '',
  targetDifficulty: 3,
  doom: 0,
  retriesUsed: 0,
  momentumTokens: 0,
  sponsoredModules: {},
  sponsoredFacilities: {},
  activePerkIds: { 0: [], 1: [], 2: [], 3: [] },
  vaults: [
    { playerIndex: 0, playerName: 'Director 1', factionId: '', credits: 4, effort: 1, pip: 1, vp: 0, commandBid: 0, isSquadLeader: false },
    { playerIndex: 1, playerName: 'Director 2', factionId: '', credits: 4, effort: 1, pip: 1, vp: 0, commandBid: 0, isSquadLeader: false },
    { playerIndex: 2, playerName: 'Director 3', factionId: '', credits: 4, effort: 1, pip: 1, vp: 0, commandBid: 0, isSquadLeader: false },
    { playerIndex: 3, playerName: 'Director 4', factionId: '', credits: 4, effort: 1, pip: 1, vp: 0, commandBid: 0, isSquadLeader: false },
  ],
  squad: [
    { slotIndex: 0, ownerPlayer: 0, characterId: '', loyalty: 1, currentHp: 3, armorRemaining: 0, bonusDice: 0, committedDice: 3, spentDice: 0, critInjuryDicePenalty: 0, critInjuryHpPenalty: 0, traumaNote: '', equippedItemIds: [], rolledDice: [], inMedBay: false },
    { slotIndex: 1, ownerPlayer: 1, characterId: '', loyalty: 1, currentHp: 3, armorRemaining: 0, bonusDice: 0, committedDice: 3, spentDice: 0, critInjuryDicePenalty: 0, critInjuryHpPenalty: 0, traumaNote: '', equippedItemIds: [], rolledDice: [], inMedBay: false },
    { slotIndex: 2, ownerPlayer: 2, characterId: '', loyalty: 1, currentHp: 3, armorRemaining: 0, bonusDice: 0, committedDice: 3, spentDice: 0, critInjuryDicePenalty: 0, critInjuryHpPenalty: 0, traumaNote: '', equippedItemIds: [], rolledDice: [], inMedBay: false },
    { slotIndex: 3, ownerPlayer: 3, characterId: '', loyalty: 1, currentHp: 3, armorRemaining: 0, bonusDice: 0, committedDice: 3, spentDice: 0, critInjuryDicePenalty: 0, critInjuryHpPenalty: 0, traumaNote: '', equippedItemIds: [], rolledDice: [], inMedBay: false },
  ],
  playerBenches: { 0: [], 1: [], 2: [], 3: [] },
  factionArmoryCaches: { 0: [], 1: [], 2: [], 3: [] },
  armoryMarketItemIds: [
    'item-01-kinetic-carbine',
    'item-02-combat-shotgun',
    'item-03-stealth-fiber-rig',
    'item-04-sub-dermal-plating',
    'item-05-holographic-decoy',
    'item-06-tactical-stim-injector',
  ],
  openAgendaIds: [
    'agenda-01-overwhelming-force',
    'agenda-02-surgical-extraction',
    'agenda-03-asset-recovery',
  ],
  claimedAgendaIds: {},
  playerSecretObjectives: {
    0: { dealtIds: ['secret-01-human-capital-hegemony', 'secret-02-corporate-liquidity'], selectedId: 'secret-01-human-capital-hegemony', isRevealed: false },
    1: { dealtIds: ['secret-03-bureaucratic-monopoly', 'secret-04-armory-dominance'], selectedId: 'secret-03-bureaucratic-monopoly', isRevealed: false },
    2: { dealtIds: ['secret-05-institutional-overtime', 'secret-06-clean-asset-management'], selectedId: 'secret-05-institutional-overtime', isRevealed: false },
    3: { dealtIds: ['secret-07-directive-compliance', 'secret-08-infrastructure-mastery'], selectedId: 'secret-07-directive-compliance', isRevealed: false },
  },
  stageHits: 0,
  stageBackfires: 0,
  rolledDiceHistory: [],
  combatLog: ['[SYSTEM] Away Team Procedural Tabletop Engine initialized. Select Table Player Count to begin.'],
  payoutsClaimed: false,
  negotiatedBountyCredits: { 0: 2, 1: 2, 2: 1, 3: 1 },
};

export function VirtualTabletop({ components = rawAllComponents as GameComponent[], onReturnToWiki }: VTTProps) {
  const [state, setState] = useState<VTTState>(DEFAULT_STATE);
  const [simTrials, setSimTrials] = useState<number>(1000);
  const [simSeedBump, setSimSeedBump] = useState<number>(0);
  const [bountyPoolCr, setBountyPoolCr] = useState<number>(6);
  const [bountyPoolPip, setBountyPoolPip] = useState<number>(1);
  const [showRestartModal, setShowRestartModal] = useState<boolean>(false);
  const [simReport, setSimReport] = useState<SimulationReport | null>(null);
  const [simTab, setSimTab] = useState<'combat_monte_carlo' | 'deterministic_scenarios' | 'chaos_fuzzing'>('combat_monte_carlo');
  const [chaosRunsCount, setChaosRunsCount] = useState<number>(20);
  const [selectedScenario, setSelectedScenario] = useState<'smoke_clean_clear' | 'martyr_dying_breath'>('smoke_clean_clear');

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.vaults && parsed.squad) {
          setState((prev) => ({
            ...prev,
            ...parsed,
          }));
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

  // Component collections
  const factions = useMemo(() => components.filter((c) => c.component_type === 'faction'), [components]);
  const characters = useMemo(() => components.filter((c) => c.component_type === 'character'), [components]);
  const items = useMemo(() => components.filter((c) => c.component_type === 'item'), [components]);
  const modifiers = useMemo(() => components.filter((c) => c.component_type === 'modifier'), [components]);
  const campaigns = useMemo(() => components.filter((c) => c.component_type === 'campaign'), [components]);
  const missions = useMemo(() => components.filter((c) => c.component_type === 'mission' || c.component_type === 'side_mission'), [components]);
  const hqFacilities = useMemo(() => components.filter((c) => c.component_type === 'hq_facility' || c.component_type === 'hq_landmark'), [components]);
  const perks = useMemo(() => components.filter((c) => c.component_type === 'perk'), [components]);
  const agendas = useMemo(() => components.filter((c) => c.component_type === 'agenda'), [components]);
  const secretObjectives = useMemo(() => components.filter((c) => c.component_type === 'secret_objective'), [components]);

  // Active campaign object
  const activeCampaign = useMemo(() => {
    return campaigns.find((c) => c.id === state.campaignId) || campaigns[0];
  }, [campaigns, state.campaignId]);

  // Procedural active mission
  const activeMission = useMemo(() => {
    const missionIds = activeCampaign?.campaign_parameters?.missions || [];
    const targetId = missionIds[state.missionIndex] || missionIds[0];
    return missions.find((m) => m.id === targetId) || missions[0];
  }, [activeCampaign, missions, state.missionIndex]);

  // Procedural stages for active mission
  const activeStages = useMemo(() => {
    return activeMission?.stages || [];
  }, [activeMission]);

  // Active stage
  const currentStage = useMemo(() => {
    return activeStages[state.stageIndex] || activeStages[0] || {
      stage_number: 1,
      name: 'Initial Stage',
      preset_focus: 'combat',
      target_difficulty: 3,
    };
  }, [activeStages, state.stageIndex]);

  // Active stage modifier
  const activeModifier = useMemo(() => {
    return modifiers.find((m) => m.id === state.activeModifierId);
  }, [modifiers, state.activeModifierId]);

  // Current active focus
  const currentActiveFocus = state.overrideFocus || currentStage.preset_focus;

  // Active step metadata
  const activeStepMeta = useMemo(() => {
    return SEQUENCE_STEPS.find((s) => s.step === state.sequenceStep) || SEQUENCE_STEPS[0];
  }, [state.sequenceStep]);

  // Squad Summary for active stage
  const squadSummary = useMemo(() => {
    let totalCommittedDice = 0;
    let expectedSuccesses = 0;

    state.squad.slice(0, 4).forEach((op) => {
      const char = characters.find((c) => c.id === op.characterId);
      if (!char) return;
      const pri = (char.focus_affinity?.primary || '').toLowerCase();
      const sec = (char.focus_affinity?.secondary || '').toLowerCase();
      const cur = currentActiveFocus.toLowerCase();
      const thresh = pri === cur ? 3 : sec === cur ? 4 : 5;
      const dice = Math.min(op.committedDice, Math.max(0, (char.stats?.static_dice || 6) - op.spentDice));
      totalCommittedDice += dice;
      expectedSuccesses += dice * expectedSuccessPerDie(thresh);
    });

    return {
      totalCommittedDice,
      expectedSuccesses: Number(expectedSuccesses.toFixed(2)),
    };
  }, [characters, currentActiveFocus, state.squad]);

  // Monte Carlo simulation
  const liveSimulation = useMemo(() => {
    const squadProfiles = state.squad.slice(0, 4).map((op) => {
      const char = characters.find((c) => c.id === op.characterId);
      const pri = (char?.focus_affinity?.primary || '').toLowerCase();
      const sec = (char?.focus_affinity?.secondary || '').toLowerCase();
      const cur = currentActiveFocus.toLowerCase();
      const thresh: 3 | 4 | 5 = pri === cur ? 3 : sec === cur ? 4 : 5;
      const dice = Math.min(op.committedDice, Math.max(0, (char?.stats?.static_dice || 6) - op.spentDice));
      return {
        id: op.characterId || `op-${op.slotIndex}`,
        title: char?.title || `Operative ${op.slotIndex + 1}`,
        className: char?.category || 'Specialist',
        threshold: thresh,
        committedDice: dice,
        currentHp: op.currentHp,
        armorBuffer: op.armorRemaining,
      };
    });

    return simulateStageMonteCarlo(squadProfiles, state.targetDifficulty, simTrials);
  }, [characters, currentActiveFocus, simTrials, state.squad, state.targetDifficulty, simSeedBump]);

  // Combat logger
  const appendLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setState((p) => ({
      ...p,
      combatLog: [`[${time}] ${msg}`, ...p.combatLog.slice(0, 50)],
    }));
  };

  // Step 0.1: Player Count Selection
  const handleSelectPlayerCount = (count: number) => {
    const initialVaults: FactionVault[] = [];
    const initialSquad: DeployedOperative[] = [];
    const benches: Record<number, string[]> = {};

    const initialBountyCredits: Record<number, number> = {};
    const baseEven = Math.floor(6 / count);
    const rem = 6 % count;

    for (let i = 0; i < count; i++) {
      initialVaults.push({
        playerIndex: i,
        playerName: `Director ${i + 1}`,
        factionId: '',
        credits: 4,
        effort: 1,
        pip: 1,
        vp: 0,
        commandBid: 0,
        isSquadLeader: i === 0,
      });
      benches[i] = [];
      initialBountyCredits[i] = baseEven + (i === 0 ? rem : 0);
    }

    for (let s = 0; s < 4; s++) {
      initialSquad.push({
        slotIndex: s,
        ownerPlayer: s < count ? s : 0, // In 3P, slot 4 initially controlled by player 0 (Squad Leader)
        characterId: '',
        loyalty: 1,
        currentHp: 3,
        armorRemaining: 0,
        bonusDice: 0,
        committedDice: 3,
        spentDice: 0,
        critInjuryDicePenalty: 0,
        critInjuryHpPenalty: 0,
        traumaNote: '',
        equippedItemIds: [],
        rolledDice: [],
        inMedBay: false,
      });
    }

    const initialCaches: Record<number, string[]> = {};
    const initialObjectives: Record<number, { dealtIds: string[]; selectedId: string | null; isRevealed: boolean }> = {};
    const initialPerks: Record<number, string[]> = {};
    for (let i = 0; i < count; i++) {
      initialCaches[i] = [];
      initialPerks[i] = [];
      const s1 = secretObjectives[i * 2]?.id || `secret-${i * 2 + 1}`;
      const s2 = secretObjectives[i * 2 + 1]?.id || `secret-${i * 2 + 2}`;
      initialObjectives[i] = {
        dealtIds: [s1, s2],
        selectedId: s1,
        isRevealed: false,
      };
    }

    setState((p) => ({
      ...p,
      playerCount: count,
      vaults: initialVaults,
      squad: initialSquad,
      playerBenches: benches,
      factionArmoryCaches: initialCaches,
      playerSecretObjectives: initialObjectives,
      activePerkIds: initialPerks,
      sponsoredFacilities: {},
      activeDirectorIndex: 0,
      armoryMarketItemIds: items.slice(0, 6).map((it) => it.id),
      openAgendaIds: agendas.slice(0, 3).map((a) => a.id),
      claimedAgendaIds: {},
      payoutsClaimed: false,
      negotiatedBountyCredits: initialBountyCredits,
      setupDraftPlayerIndex: 0,
      flowStep: 'setup_factions',
      activeTab: 'setup',
    }));
    appendLog(`Table configured for ${count} Director(s). Commencing sequential Faction Draft.`);
  };

  // Step 0.2: Faction Claiming
  const handleClaimFaction = (factionId: string) => {
    const curIdx = state.setupDraftPlayerIndex;
    const fac = factions.find((f) => f.id === factionId);
    if (!fac) return;
    const startAssets = fac.starting_assets || { credits: 4, effort: 1, pip: 1 };

    const updatedVaults = state.vaults.map((v, i) =>
      i === curIdx
        ? {
            ...v,
            factionId,
            credits: startAssets.credits,
            effort: startAssets.effort,
            pip: startAssets.pip,
          }
        : v
    );

    const isLast = curIdx >= state.playerCount - 1;

    setState((p) => ({
      ...p,
      vaults: updatedVaults,
      setupDraftPlayerIndex: isLast ? 0 : curIdx + 1,
      flowStep: isLast ? 'setup_bench' : 'setup_factions',
    }));

    appendLog(
      `Director ${curIdx + 1} claimed ${fac.title}. Vault funded: [${startAssets.credits} CR, ${startAssets.effort} EF, ${startAssets.pip} PIP].`
    );

    if (isLast) {
      // Auto-deal 3 specialists to each player's bench
      const shuffledChars = [...characters].sort(() => Math.random() - 0.5);
      const newBenches: Record<number, string[]> = {};
      const newSquad = [...state.squad];

      for (let pIdx = 0; pIdx < state.playerCount; pIdx++) {
        const dealt = shuffledChars.slice(pIdx * 3, pIdx * 3 + 3).map((c) => c.id);
        newBenches[pIdx] = dealt;
        // Assign the first one as active deployed specialist
        if (pIdx < 4) {
          const char = characters.find((c) => c.id === dealt[0]);
          newSquad[pIdx].characterId = dealt[0];
          newSquad[pIdx].currentHp = char?.stats?.hp_cap || 3;
          newSquad[pIdx].equippedItemIds = []; // 0 items!
        }
      }

      // If 2 players, deal remaining slots 2 and 3
      if (state.playerCount === 2) {
        newSquad[2].characterId = newBenches[0][1] || '';
        newSquad[2].ownerPlayer = 0;
        newSquad[3].characterId = newBenches[1][1] || '';
        newSquad[3].ownerPlayer = 1;
      }
      // If 3 players, slot 4 is Vanguard Slot (handled by winning Squad Leader)
      if (state.playerCount === 3) {
        newSquad[3].characterId = newBenches[0][1] || '';
        newSquad[3].ownerPlayer = 0; // Squad Leader controls Vanguard slot
      }

      setState((p) => ({
        ...p,
        playerBenches: newBenches,
        squad: newSquad,
      }));
      appendLog('All Factions claimed. Dealt 3 Specialist Operatives to each Director bench with 0 starting items.');
    }
  };

  // Step 0.3: Active Operative Selection
  const handleSelectActiveOperative = (playerIdx: number, charId: string) => {
    const char = characters.find((c) => c.id === charId);
    if (!char) return;

    setState((p) => ({
      ...p,
      squad: p.squad.map((s) =>
        s.ownerPlayer === playerIdx && s.slotIndex === playerIdx
          ? {
              ...s,
              characterId: charId,
              currentHp: char.stats?.hp_cap || 3,
              spentDice: 0,
              equippedItemIds: [],
            }
          : s
      ),
    }));
    appendLog(`Director ${playerIdx + 1} assigned ${char.title} to their Active Deployment Slot.`);
  };

  // Step 0.4: Campaign Selection
  const handleSelectCampaign = (campId: string) => {
    const camp = campaigns.find((c) => c.id === campId);
    if (!camp) return;

    setState((p) => ({
      ...p,
      campaignId: campId,
      missionIndex: 0,
      stageIndex: 0,
      sequenceStep: 1,
      targetDifficulty: 3,
      flowStep: 'phase1_brief',
      activeTab: 'phase1_mission',
    }));
    appendLog(`Campaign locked: ${camp.title}. Initializing Mission 1 intelligence briefing.`);
  };

  // Phase 2: Command Auction Resolution
  const handleResolveCommandAuction = () => {
    let winnerIdx = 0;
    let bestBid = -1;
    let bestPip = -1;
    let bestLoy = -1;

    for (const v of state.vaults) {
      const op = state.squad.find((s) => s.ownerPlayer === v.playerIndex);
      const candLoy = op?.loyalty || 0;

      const isHigher =
        v.commandBid > bestBid ||
        (v.commandBid === bestBid && v.pip > bestPip) ||
        (v.commandBid === bestBid && v.pip === bestPip && candLoy > bestLoy);

      if (isHigher) {
        bestBid = v.commandBid;
        bestPip = v.pip;
        bestLoy = candLoy;
        winnerIdx = v.playerIndex;
      }
    }

    setState((prev) => ({
      ...prev,
      vaults: prev.vaults.map((v) => ({
        ...v,
        credits: v.playerIndex === winnerIdx ? Math.max(0, v.credits - v.commandBid) : v.credits,
        isSquadLeader: v.playerIndex === winnerIdx,
      })),
      // In 3P mode, winning Squad Leader takes command of the Vanguard Slot (Slot 4)
      squad:
        prev.playerCount === 3
          ? prev.squad.map((s, i) => (i === 3 ? { ...s, ownerPlayer: winnerIdx } : s))
          : prev.squad,
    }));

    appendLog(
      `👑 Command Auction resolved: ${state.vaults[winnerIdx].playerName} elected Squad Leader with bid of [${bestBid} CR]! (Tie-breakers: [${bestPip} PIP], candidate [${bestLoy} LOY]).`
    );
  };

  // Zero-Bid Roll-Off (BL-RULES-04)
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
      squad:
        prev.playerCount === 3
          ? prev.squad.map((s, i) => (i === 3 ? { ...s, ownerPlayer: winner.playerIndex } : s))
          : prev.squad,
    }));

    appendLog(
      `🎲 Zero-Bid High-Stakes Roll-Off (BL-RULES-04): ${rolls
        .map((r) => `${r.playerName}: ${r.roll}`)
        .join(', ')}. ${winner.playerName} rolled highest (${winner.roll}) and is thrust into Squad Leader for [0 CR]!`
    );
  };

  // Phase 3: Step 1 Dynamic Swap (BL-RULES-07)
  const handleDynamicSwap = (targetFocus: string, targetDiff: number) => {
    setState((p) => ({
      ...p,
      overrideFocus: targetFocus,
      targetDifficulty: targetDiff,
    }));
    appendLog(
      `🔀 Squad Leader executed Dynamic Focus Swap: Stage Focus is now [${targetFocus.toUpperCase()}] at Target Difficulty D=${targetDiff}. (Split Modifiers re-evaluated dynamically per BL-RULES-07).`
    );
  };

  // Player Sovereignty: Set individual operative dice commitment (0 = Hold Back)
  const handleSetOperativeCommittedDice = (slotIdx: number, count: number) => {
    setState((p) => {
      const op = p.squad[slotIdx];
      if (!op) return p;
      const char = characters.find((c) => c.id === op.characterId);
      const avail = Math.max(0, (char?.stats?.static_dice || 6) - op.spentDice);
      const safe = Math.max(0, Math.min(avail, count));
      return {
        ...p,
        squad: p.squad.map((s, i) => (i === slotIdx ? { ...s, committedDice: safe } : s)),
      };
    });
  };

  // Player Sovereignty: Roll dice for a single operative independently
  const handleRollSingleOperative = (slotIdx: number) => {
    const op = state.squad[slotIdx];
    if (!op || op.rolledDice.length > 0) return;
    const char = characters.find((c) => c.id === op.characterId);
    if (!char) return;

    const pri = (char.focus_affinity?.primary || '').toLowerCase();
    const sec = (char.focus_affinity?.secondary || '').toLowerCase();
    const cur = currentActiveFocus.toLowerCase();
    const isPri = pri === cur;
    const thresh = isPri ? 3 : sec === cur ? 4 : 5;

    const avail = Math.max(0, (char.stats?.static_dice || 6) - op.spentDice);
    const commit = Math.min(op.committedDice, avail);

    const rolled: number[] = [];
    const newRecords: RolledDieRecord[] = [];
    let newHits = 0;
    let newBackfires = 0;
    let wounds = 0;

    for (let i = 0; i < commit; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      rolled.push(val);
      const isHit = val >= thresh;
      const isBackfire = val === 1 && thresh === 5; // Natural 1 Out of Focus
      if (isHit) newHits++;
      if (isBackfire) {
        newBackfires++;
        wounds++;
      }
      newRecords.push({
        dieValue: val,
        threshold: thresh,
        isHit,
        isBackfire,
        operativeName: char.title,
      });
    }

    const totalHits = state.stageHits + newHits;
    const totalBackfires = state.stageBackfires + newBackfires;
    const meetsTarget = totalHits >= state.targetDifficulty;

    const updatedSquad = state.squad.map((s, idx) =>
      idx === slotIdx
        ? {
            ...s,
            rolledDice: rolled,
            spentDice: s.spentDice + commit,
            currentHp: Math.max(0, s.currentHp - wounds),
          }
        : s
    );

    // In Step 2 (Specialists): Check Early Resolution
    const isSpecialistStep = state.sequenceStep === 2;
    let nextStep = state.sequenceStep;

    if (isSpecialistStep && meetsTarget) {
      nextStep = 5; // Early resolution!
      appendLog(
        `🎯 ${char.title} rolled ${commit} dice [${rolled.join(', ')}] -> ${newHits} hit(s)! 🏆 EARLY RESOLUTION TRIGGERED! Stage cleared (${totalHits}/${state.targetDifficulty} D). Phase 2 Support skips rolling, preserving stamina!`
      );
    } else {
      appendLog(
        `🎲 ${char.title} rolled ${commit} dice [${rolled.join(', ')}] at ${thresh}+ focus -> ${newHits} hit(s)${wounds > 0 ? `, ${wounds} backfire wound(s)` : ''}. Stage total: ${totalHits}/${state.targetDifficulty} D.`
      );
    }

    setState((p) => ({
      ...p,
      squad: updatedSquad,
      stageHits: totalHits,
      stageBackfires: totalBackfires,
      rolledDiceHistory: [...p.rolledDiceHistory, ...newRecords],
      sequenceStep: nextStep,
    }));
  };

  // Phase 3: Step 2 Roll All Remaining Specialists (3+) with Early Resolution
  const handleRollSpecialists = () => {
    const records = [...state.rolledDiceHistory];
    let hits = state.stageHits;
    let backfires = state.stageBackfires;

    const updatedSquad = state.squad.map((op) => {
      const char = characters.find((c) => c.id === op.characterId);
      if (!char) return op;
      const pri = (char.focus_affinity?.primary || '').toLowerCase();
      const cur = currentActiveFocus.toLowerCase();
      if (pri !== cur) return op; // Only primary specialists roll in Step 2
      if (op.rolledDice.length > 0) return op; // Already rolled individually

      const avail = Math.max(0, (char.stats?.static_dice || 6) - op.spentDice);
      const commit = Math.min(op.committedDice, avail);
      const rolled: number[] = [];

      for (let i = 0; i < commit; i++) {
        const val = Math.floor(Math.random() * 6) + 1;
        rolled.push(val);
        const isHit = val >= 3;
        if (isHit) hits++;
        records.push({
          dieValue: val,
          threshold: 3,
          isHit,
          isBackfire: false,
          operativeName: char.title,
        });
      }

      return {
        ...op,
        rolledDice: rolled,
        spentDice: op.spentDice + commit,
      };
    });

    const meetsTarget = hits >= state.targetDifficulty;

    setState((p) => ({
      ...p,
      squad: updatedSquad,
      stageHits: hits,
      stageBackfires: backfires,
      rolledDiceHistory: records,
      sequenceStep: meetsTarget ? 5 : 3, // Early Resolution skips Step 3 & 4!
    }));

    if (meetsTarget) {
      appendLog(
        `🎯 PHASE 1 SPECIALIST ROLL: ${hits} Hits rolled vs Target D=${state.targetDifficulty}. 🏆 EARLY RESOLUTION TRIGGERED! Target cleared immediately—Phase 2 Support skips rolling, preserving stamina and preventing Backfire damage!`
      );
    } else {
      appendLog(
        `🎯 PHASE 1 SPECIALIST ROLL: ${hits} Hits rolled vs Target D=${state.targetDifficulty}. Target not met. Proceeding to Step 3: Phase 2 Support Roll (4+ Secondary / 5+ Out of Focus).`
      );
    }
  };

  // Phase 3: Step 3 Roll All Remaining Support (4+/5+) with Backfire 1s
  const handleRollSupport = () => {
    const records = [...state.rolledDiceHistory];
    let hits = state.stageHits;
    let backfires = state.stageBackfires;

    const updatedSquad = state.squad.map((op) => {
      const char = characters.find((c) => c.id === op.characterId);
      if (!char) return op;
      const pri = (char.focus_affinity?.primary || '').toLowerCase();
      const sec = (char.focus_affinity?.secondary || '').toLowerCase();
      const cur = currentActiveFocus.toLowerCase();
      if (pri === cur) return op; // Already rolled in Phase 1
      if (op.rolledDice.length > 0) return op; // Already rolled individually

      const thresh = sec === cur ? 4 : 5;
      const avail = Math.max(0, (char.stats?.static_dice || 6) - op.spentDice);
      const commit = Math.min(op.committedDice, avail);
      const rolled: number[] = [];
      let opWounds = 0;

      for (let i = 0; i < commit; i++) {
        const val = Math.floor(Math.random() * 6) + 1;
        rolled.push(val);
        const isHit = val >= thresh;
        const isBackfire = val === 1 && thresh === 5; // Natural 1 Out of Focus
        if (isHit) hits++;
        if (isBackfire) {
          backfires++;
          opWounds++;
        }
        records.push({
          dieValue: val,
          threshold: thresh,
          isHit,
          isBackfire,
          operativeName: char.title,
        });
      }

      return {
        ...op,
        rolledDice: rolled,
        spentDice: op.spentDice + commit,
        currentHp: Math.max(0, op.currentHp - opWounds),
      };
    });

    const hasCasualties = updatedSquad.some((op) => op.currentHp <= 0);

    setState((p) => ({
      ...p,
      squad: updatedSquad,
      stageHits: hits,
      stageBackfires: backfires,
      rolledDiceHistory: records,
      sequenceStep: hasCasualties ? 4 : 5,
    }));

    appendLog(
      `🎲 PHASE 2 SUPPORT ROLL: Total stage hits: ${hits} / ${state.targetDifficulty} D. Backfires: ${backfires} wound(s) inflicted.`
    );
  };

  // Phase 3: Step 4 Stabilize 0 HP Operative
  const handleStabilizeOperative = (slotIdx: number, donorPlayerIdx: number) => {
    const donorVault = state.vaults[donorPlayerIdx];
    if (donorVault.effort < 1) return;

    setState((p) => ({
      ...p,
      vaults: p.vaults.map((v, i) => (i === donorPlayerIdx ? { ...v, effort: v.effort - 1 } : v)),
      squad: p.squad.map((s, i) => (i === slotIdx ? { ...s, currentHp: 1 } : s)),
    }));

    const char = characters.find((c) => c.id === state.squad[slotIdx].characterId);
    appendLog(
      `💉 Emergency Field Triage: ${donorVault.playerName} spent [1 EF] to stabilize ${char?.title || 'Operative'} at 1 HP.`
    );
  };

  // Phase 3: Step 5 Stage Clear & Momentum Distribution
  const handleResolveStageOutcome = () => {
    const D = state.targetDifficulty;
    const S = state.stageHits;
    const cleared = S >= D;

    if (cleared) {
      const margin = S - D;
      const momentumEarned = margin >= 2 ? S - D - 1 : 0;

      setState((p) => ({
        ...p,
        momentumTokens: p.momentumTokens + momentumEarned,
        sequenceStep: 6,
      }));

      appendLog(
        `🏆 STAGE CLEARED! S=${S} vs D=${D} (Margin: +${margin}). ${
          momentumEarned > 0
            ? `Operational Momentum generated: +${momentumEarned} [MOM]!`
            : 'No Momentum generated (requires margin >= +2).'
        }`
      );
    } else {
      // Stage failed
      setState((p) => ({
        ...p,
        doom: p.doom + 1,
        sequenceStep: 6,
      }));
      appendLog(
        `❌ STAGE FAILED! Rolled ${S} Hits vs Target D=${D}. Task Force Dissolution tracker advanced: +1 [FAIL] (${state.doom + 1} / ${activeCampaign?.stats?.max_doom || 3}).`
      );
    }
  };

  // Phase 3: Step 5 Allocate Momentum Refund
  const handleAllocateMomentumRefund = (slotIdx: number) => {
    if (state.momentumTokens < 1) return;
    const op = state.squad[slotIdx];
    if (op.spentDice < 1) return;

    setState((p) => ({
      ...p,
      momentumTokens: p.momentumTokens - 1,
      squad: p.squad.map((s, i) => (i === slotIdx ? { ...s, spentDice: s.spentDice - 1 } : s)),
    }));

    const char = characters.find((c) => c.id === op.characterId);
    appendLog(`⚡ Squad Leader allocated [1 MOM] die refund: Restored +1 static die to ${char?.title}.`);
  };

  // Phase 3: Step 6 Logistical Refresh
  const handleLogisticalRefresh = (tier: 1 | 2) => {
    const squadLeader = state.vaults.find((v) => v.isSquadLeader);
    if (!squadLeader) return;
    const costEf = tier === 1 ? 2 : 3;
    const restoreDice = tier === 1 ? 1 : 2;

    if (squadLeader.effort < costEf) {
      appendLog(`⚠ Logistical Refresh requires [${costEf} EF]. Squad Leader has only [${squadLeader.effort} EF].`);
      return;
    }

    setState((p) => ({
      ...p,
      vaults: p.vaults.map((v) => (v.isSquadLeader ? { ...v, effort: v.effort - costEf } : v)),
      squad: p.squad.map((s) => ({ ...s, spentDice: Math.max(0, s.spentDice - restoreDice) })),
    }));

    appendLog(
      `📦 Logistical Refresh: Squad Leader spent [${costEf} EF] from Vault to restore +${restoreDice} static die/dice squad-wide!`
    );
  };

  // Phase 3: Step 6 Next Stage / Finish Mission
  const handleAdvanceToNextStage = () => {
    const nextIdx = state.stageIndex + 1;
    if (nextIdx < activeStages.length) {
      const nextStageObj = activeStages[nextIdx];
      // Attach random modifier
      const randomMod = modifiers[Math.floor(Math.random() * modifiers.length)];

      setState((p) => ({
        ...p,
        stageIndex: nextIdx,
        sequenceStep: 1,
        overrideFocus: null,
        targetDifficulty: nextStageObj.target_difficulty,
        activeModifierId: randomMod?.id || '',
        stageHits: 0,
        stageBackfires: 0,
        rolledDiceHistory: [],
        squad: p.squad.map((s) => ({ ...s, rolledDice: [] })),
      }));

      appendLog(`Advancing to Stage ${nextIdx + 1}: ${nextStageObj.name} (Focus: [${nextStageObj.preset_focus}], D=${nextStageObj.target_difficulty}).`);
    } else {
      // Mission Complete! Proceed to Phase 4 HQ Downtime
      setState((p) => ({
        ...p,
        flowStep: 'phase4_hq',
        activeTab: 'hq',
      }));
      appendLog(`🎖️ MISSION COMPLETE! All stages cleared. Squad evacuates to Agency HQ for Phase 4 Downtime.`);
    }
  };

  // Phase 4: Step 1 Adjust Negotiated Bounty Allocation per Player
  const handleSetNegotiatedBountyCredits = (playerIdx: number, delta: number) => {
    if (state.payoutsClaimed) return;
    setState((p) => {
      const current = p.negotiatedBountyCredits[playerIdx] || 0;
      const next = Math.max(0, current + delta);
      return {
        ...p,
        negotiatedBountyCredits: {
          ...p.negotiatedBountyCredits,
          [playerIdx]: next,
        },
      };
    });
  };

  // Reset to canonical even split with remainder to Squad Leader
  const handleResetCanonicalBountySplit = () => {
    if (state.payoutsClaimed) return;
    const activeCount = state.playerCount || 4;
    const leaderIdx = state.vaults.find((v) => v.isSquadLeader)?.playerIndex || 0;
    const evenCredits = Math.floor(bountyPoolCr / activeCount);
    const remainderCredits = bountyPoolCr % activeCount;

    const resetSplit: Record<number, number> = {};
    for (let i = 0; i < activeCount; i++) {
      resetSplit[i] = evenCredits + (i === leaderIdx ? remainderCredits : 0);
    }
    setState((p) => ({ ...p, negotiatedBountyCredits: resetSplit }));
  };

  // Phase 4: Step 1 Debrief & Dual-Stream Payouts (BL-RULES-01)
  const handleDistributeMissionPayouts = (bountyCredits: number, bountyPip: number) => {
    if (state.payoutsClaimed) return; // Prevent multi-click duplicate payouts bug

    const activeCount = state.playerCount || 4;
    const squadLeader = state.vaults.find((v) => v.isSquadLeader);
    const leaderIdx = squadLeader ? squadLeader.playerIndex : 0;

    // Stream 1: Guaranteed Per-Character Participating Stipend
    // Each deployed character earns +2 CR for their controlling Director.
    // Each participating faction earns +1 PIP.
    // In 3P mode, the Vanguard Slot operative earns +2 CR for the Squad Leader.
    const operativeStipends: Record<number, number> = {};
    for (let i = 0; i < activeCount; i++) operativeStipends[i] = 0;

    state.squad.slice(0, 4).forEach((op) => {
      const owner = op.ownerPlayer;
      if (operativeStipends[owner] !== undefined) {
        operativeStipends[owner] += 2; // +2 CR per deployed operative
      }
    });

    // Stream 2: Negotiated Shared Bounty Pool
    const allocatedBounty = { ...state.negotiatedBountyCredits };

    // Update surviving operatives loyalty & Squad Leader bonus
    const updatedSquad = state.squad.map((op) => {
      const isAlive = op.currentHp > 0;
      const isLeaderOp = op.ownerPlayer === leaderIdx;
      const loyGain = isAlive ? (isLeaderOp ? 2 : 1) : 0;
      return {
        ...op,
        loyalty: Math.min(4, op.loyalty + loyGain),
      };
    });

    // Deposit dual-stream earnings into vaults
    const updatedVaults = state.vaults.map((v) => {
      if (v.playerIndex >= activeCount) return v;
      const baseCr = operativeStipends[v.playerIndex] || 0;
      const poolCr = allocatedBounty[v.playerIndex] || 0;
      const isLeader = v.playerIndex === leaderIdx;
      const basePip = 1 + (isLeader ? 1 : 0); // +1 PIP participation (+1 PIP Squad Leader bonus)

      return {
        ...v,
        credits: v.credits + baseCr + poolCr,
        pip: v.pip + basePip,
      };
    });

    setState((prev) => ({
      ...prev,
      vaults: updatedVaults,
      squad: updatedSquad,
      payoutsClaimed: true, // Lock claiming!
    }));

    appendLog(
      `🏢 HQ Debrief (BL-RULES-01): Dual-stream mission payouts deposited into Faction Vaults! Stream 1: [2 CR] guaranteed per deployed operative + [1 PIP] per faction (+1 PIP / +2 LOY to Squad Leader). Stream 2: [${bountyCredits} CR] shared clearance pot distributed per player negotiations.`
    );
  };

  // Step 0.4: Select Secret Corporate Objective
  const handleSelectSecretObjective = (playerIdx: number, objectiveId: string) => {
    setState((p) => ({
      ...p,
      playerSecretObjectives: {
        ...p.playerSecretObjectives,
        [playerIdx]: {
          ...p.playerSecretObjectives[playerIdx],
          selectedId: objectiveId,
        },
      },
    }));
    const obj = secretObjectives.find((o) => o.id === objectiveId);
    appendLog(`Director ${playerIdx + 1} (${state.vaults[playerIdx]?.playerName}) selected and locked secret corporate objective: ${obj?.title || objectiveId}.`);
  };

  // Toggle secret objective privacy peek
  const handleToggleSecretObjectiveReveal = (playerIdx: number) => {
    setState((p) => ({
      ...p,
      playerSecretObjectives: {
        ...p.playerSecretObjectives,
        [playerIdx]: {
          ...p.playerSecretObjectives[playerIdx],
          isRevealed: !p.playerSecretObjectives[playerIdx]?.isRevealed,
        },
      },
    }));
  };

  // Claim Open Corporate Agenda
  const handleClaimAgenda = (agendaId: string) => {
    if (state.claimedAgendaIds[agendaId] !== undefined) return;
    const ag = agendas.find((a) => a.id === agendaId);
    if (!ag) return;
    const payout = (ag as any).payout || { vp: 2, credits: 1, pip: 0 };
    const pIdx = state.activeDirectorIndex;
    const v = state.vaults[pIdx];

    setState((p) => ({
      ...p,
      claimedAgendaIds: {
        ...p.claimedAgendaIds,
        [agendaId]: pIdx,
      },
      vaults: p.vaults.map((vault, i) =>
        i === pIdx
          ? {
              ...vault,
              credits: vault.credits + (payout.credits || 0),
              pip: vault.pip + (payout.pip || 0),
              vp: vault.vp + (payout.vp || 0),
            }
          : vault
      ),
    }));

    appendLog(`Director ${pIdx + 1} (${v.playerName}) claimed Open Agenda: ${ag.title}! Earned [+${payout.vp || 0} VP, +${payout.credits || 0} CR, +${payout.pip || 0} PIP].`);
  };

  // Switch Active Director at console
  const handleSwitchActiveDirector = (newIdx: number) => {
    setState((p) => ({
      ...p,
      activeDirectorIndex: newIdx,
    }));
  };

  // Phase 4: Step 6 Armory Purchase with market depletion & delivery target
  const handlePurchaseArmoryItem = (
    playerIdx: number,
    itemId: string,
    targetSlotIndex: number = -1,
    sendToCache: boolean = false
  ) => {
    const it = items.find((i) => i.id === itemId);
    if (!it) return;
    const costCr = it.cost?.credits || 0;
    const v = state.vaults[playerIdx];
    if (v.credits < costCr) return;

    // Remaining items in deck not currently in market
    const currentMarket = state.armoryMarketItemIds || [];
    const remainingDeck = items.filter(
      (item) => !currentMarket.includes(item.id) && item.id !== itemId
    );
    const replacementItem = remainingDeck[Math.floor(Math.random() * remainingDeck.length)];

    const updatedMarket = currentMarket
      .filter((id) => id !== itemId)
      .concat(replacementItem ? [replacementItem.id] : []);

    const updatedVaults = state.vaults.map((vault, i) =>
      i === playerIdx ? { ...vault, credits: vault.credits - costCr } : vault
    );

    let updatedSquad = [...state.squad];
    const updatedCaches = { ...state.factionArmoryCaches };
    if (!updatedCaches[playerIdx]) updatedCaches[playerIdx] = [];

    // Determine target operative slot
    const targetSlot =
      targetSlotIndex >= 0
        ? targetSlotIndex
        : state.squad.findIndex((s) => s.ownerPlayer === playerIdx);

    if (sendToCache || targetSlot < 0) {
      updatedCaches[playerIdx] = [...updatedCaches[playerIdx], itemId];
      appendLog(
        `Director ${playerIdx + 1} (${v.playerName}) purchased ${it.title} for [${costCr} CR] and placed it into Faction Armory Cache.`
      );
    } else {
      updatedSquad = updatedSquad.map((s, idx) =>
        idx === targetSlot
          ? {
              ...s,
              equippedItemIds: [...s.equippedItemIds, itemId],
              armorRemaining: s.armorRemaining + (it.stats?.armor_buffer || 0),
            }
          : s
      );
      const targetOpName =
        characters.find((c) => c.id === updatedSquad[targetSlot]?.characterId)?.title ||
        `Operative Slot ${targetSlot + 1}`;
      appendLog(
        `Director ${playerIdx + 1} (${v.playerName}) purchased ${it.title} for [${costCr} CR] and equipped it onto ${targetOpName}.`
      );
    }

    setState((p) => ({
      ...p,
      vaults: updatedVaults,
      squad: updatedSquad,
      factionArmoryCaches: updatedCaches,
      armoryMarketItemIds: updatedMarket,
    }));
  };

  // Equip item from Faction Cache to Operative
  const handleEquipFromCache = (playerIdx: number, itemId: string, targetSlotIndex: number) => {
    const it = items.find((i) => i.id === itemId);
    if (!it) return;

    const currentCache = state.factionArmoryCaches[playerIdx] || [];
    const itemIdx = currentCache.indexOf(itemId);
    if (itemIdx < 0) return;

    const updatedCache = [...currentCache];
    updatedCache.splice(itemIdx, 1);

    const updatedSquad = state.squad.map((s, idx) =>
      idx === targetSlotIndex
        ? {
            ...s,
            equippedItemIds: [...s.equippedItemIds, itemId],
            armorRemaining: s.armorRemaining + (it.stats?.armor_buffer || 0),
          }
        : s
    );

    const opName = characters.find((c) => c.id === updatedSquad[targetSlotIndex]?.characterId)?.title || `Operative ${targetSlotIndex + 1}`;
    appendLog(`Director ${playerIdx + 1} equipped ${it.title} from Faction Cache onto ${opName}.`);

    setState((p) => ({
      ...p,
      squad: updatedSquad,
      factionArmoryCaches: {
        ...p.factionArmoryCaches,
        [playerIdx]: updatedCache,
      },
    }));
  };

  // Unequip item from Operative and return to Faction Cache
  const handleUnequipItem = (slotIndex: number, itemId: string) => {
    const it = items.find((i) => i.id === itemId);
    const op = state.squad[slotIndex];
    if (!op) return;

    const itemIdx = op.equippedItemIds.indexOf(itemId);
    if (itemIdx < 0) return;

    const updatedEquipped = [...op.equippedItemIds];
    updatedEquipped.splice(itemIdx, 1);
    const armorSub = it?.stats?.armor_buffer || 0;

    const updatedSquad = state.squad.map((s, idx) =>
      idx === slotIndex
        ? {
            ...s,
            equippedItemIds: updatedEquipped,
            armorRemaining: Math.max(0, s.armorRemaining - armorSub),
          }
        : s
    );

    const pIdx = op.ownerPlayer;
    const currentCache = state.factionArmoryCaches[pIdx] || [];

    appendLog(`Operative returned ${it?.title || itemId} to Director ${pIdx + 1} Faction Cache.`);

    setState((p) => ({
      ...p,
      squad: updatedSquad,
      factionArmoryCaches: {
        ...p.factionArmoryCaches,
        [pIdx]: [...currentCache, itemId],
      },
    }));
  };

  // Refresh Quartermaster Market Row
  const handleRefreshArmoryMarket = (isFree: boolean = false) => {
    const pIdx = state.activeDirectorIndex;
    const v = state.vaults[pIdx];
    const cost = isFree ? 0 : 1;
    if (v.credits < cost) return;

    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const newMarket = shuffled.slice(0, 6).map((it) => it.id);

    setState((p) => ({
      ...p,
      vaults: p.vaults.map((vault, i) => (i === pIdx ? { ...vault, credits: vault.credits - cost } : vault)),
      armoryMarketItemIds: newMarket,
    }));

    appendLog(`Director ${pIdx + 1} refreshed the Quartermaster Armory Market row (cost: [${cost} CR]).`);
  };

  // Phase 4: Step 4 Sponsor HQ Facility Module
  const handleSponsorFacility = (
    facilityId: string,
    moduleName: string,
    costCr: number,
    pipReward: number,
    vpReward: number
  ) => {
    const pIdx = state.activeDirectorIndex;
    const v = state.vaults[pIdx];
    if (v.credits < costCr) return;

    const newSponsorships = {
      ...state.sponsoredFacilities,
      [facilityId]: {
        sponsoredByPlayer: pIdx,
        facilityId,
        moduleName,
        costCr,
        pipReward,
        vpReward,
      },
    };

    setState((p) => ({
      ...p,
      vaults: p.vaults.map((vault, i) =>
        i === pIdx
          ? {
              ...vault,
              credits: vault.credits - costCr,
              pip: vault.pip + pipReward,
              vp: vault.vp + vpReward,
            }
          : vault
      ),
      sponsoredFacilities: newSponsorships,
    }));

    appendLog(
      `🏛️ HQ SPONSORSHIP: Director ${pIdx + 1} (${v.playerName}) sponsored ${moduleName} for [${costCr} CR]! Awarded [+${pipReward} PIP] and [+${vpReward} VP]!`
    );
  };

  // Phase 4: Step 7 Unlock Faction Perk / Boardroom Doctrine
  const handleUnlockPerk = (perkId: string, costCr: number, costPip: number) => {
    const pIdx = state.activeDirectorIndex;
    const v = state.vaults[pIdx];
    const p = perks.find((x) => x.id === perkId);
    if (!p) return;

    // Check affordability (spend CR if possible, else PIP)
    let crSpend = 0;
    let pipSpend = 0;
    if (v.credits >= costCr) {
      crSpend = costCr;
    } else if (v.pip >= costPip) {
      pipSpend = costPip;
    } else {
      return;
    }

    const currentPerks = state.activePerkIds[pIdx] || [];
    if (currentPerks.includes(perkId)) return;

    setState((prev) => ({
      ...prev,
      vaults: prev.vaults.map((vault, i) =>
        i === pIdx
          ? {
              ...vault,
              credits: vault.credits - crSpend,
              pip: vault.pip - pipSpend,
            }
          : vault
      ),
      activePerkIds: {
        ...prev.activePerkIds,
        [pIdx]: [...currentPerks, perkId],
      },
    }));

    appendLog(
      `📜 BOARDROOM DOCTRINE: Director ${pIdx + 1} (${v.playerName}) unlocked Perk: ${p.title} (spent ${crSpend > 0 ? `[${crSpend} CR]` : `[${pipSpend} PIP]`})!`
    );
  };

  // Reset Tabletop
  const handleResetTabletop = () => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="vtt-tabletop">
      {/* ====================================================================
          TOP TABLETOP STATUS BAR: MISSION TELEMETRY, TRACKERS & RESET
         ==================================================================== */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <div>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '0.04em' }}>
              AWAY TEAM — PROCEDURAL TABLETOP
            </strong>
            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              • Core 6.0 Engine
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.74rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                background: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              📍 {activeMission?.title || 'Mission 1'}
            </span>
            <span
              style={{
                fontSize: '0.74rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                background: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid #dc2626',
                color: '#f87171',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
              }}
              title="Task Force Dissolution Tracker ([FAIL])"
            >
              💀 {state.doom} / {activeCampaign?.stats?.max_doom || 3} [FAIL]
            </span>
            <span
              style={{
                fontSize: '0.74rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                background: 'rgba(5, 150, 105, 0.15)',
                border: '1px solid #059669',
                color: '#34d399',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
              }}
              title="Operational Momentum ([MOM])"
            >
              ⚡ {state.momentumTokens} [MOM]
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {onReturnToWiki && (
            <button type="button" className="tabletop-btn" onClick={onReturnToWiki} title="Open Rules & Reference Wiki">
              📖 Rules Wiki
            </button>
          )}
          <button
            type="button"
            className="tabletop-btn"
            title="Export JSON Save File"
            onClick={() => {
              const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'away_team_procedural_save.json';
              a.click();
            }}
          >
            💾 Export Save
          </button>
          <button
            type="button"
            className="tabletop-btn tabletop-btn-danger"
            title="Start a new game or reset the tabletop"
            onClick={() => {
              if (!state.flowStep.startsWith('setup')) {
                setShowRestartModal(true);
              } else {
                handleResetTabletop();
              }
            }}
          >
            🎮 Start New Game
          </button>
        </div>
      </header>

      {/* ====================================================================
          CONFIRMATION MODAL: START NEW GAME (PREVENTS ACCIDENTAL MID-GAME RESETS)
         ==================================================================== */}
      {showRestartModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 25px rgba(239, 68, 68, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem' }}>
                Start a New Game?
              </h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.5, margin: '0.5rem 0 1.25rem 0' }}>
              You are currently playing an active campaign session (<strong>{activeMission?.title || 'Mission 1'}</strong>).
              Starting a new game will reset all Faction Vaults, Operative Rosters, Armory Inventories, and Campaign Progress back to Step 0.1 Setup.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="tabletop-btn"
                onClick={() => setShowRestartModal(false)}
                style={{ padding: '0.5rem 1rem' }}
              >
                Cancel / Resume Game
              </button>
              <button
                type="button"
                className="tabletop-btn tabletop-btn-danger"
                onClick={() => {
                  setShowRestartModal(false);
                  handleResetTabletop();
                }}
                style={{ padding: '0.5rem 1rem', fontWeight: 700 }}
              >
                Confirm: Start New Game ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PHASE NAVIGATION BAR: STRICT SEPARATION OF SETUP VS IN-GAME PHASES
         ==================================================================== */}
      <nav className="vtt-phase-nav" aria-label="Board Game Phase Progression">
        {state.flowStep.startsWith('setup') ? (
          /* SETUP PROGRESSION BAR (ONLY VISIBLE DURING SETUP) */
          <>
            {SETUP_STEPS.map((s) => {
              const isCurrent = state.flowStep === s.step;
              return (
                <div
                  key={s.step}
                  className={`vtt-phase-tab ${isCurrent ? 'active badge-setup' : ''}`}
                  style={{ cursor: 'default' }}
                >
                  <strong style={{ fontSize: '0.84rem' }}>{s.label}</strong>
                  <div style={{ fontSize: '0.66rem', color: isCurrent ? '#f1f5f9' : '#94a3b8', marginTop: '0.2rem' }}>
                    {s.subtitle}
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              className={`vtt-phase-tab ${state.activeTab === 'simulator' ? 'active badge-sim' : ''}`}
              onClick={() => setState((p) => ({ ...p, activeTab: 'simulator' }))}
            >
              <strong style={{ fontSize: '0.84rem' }}>📊 Sim & Telemetry</strong>
              <div style={{ fontSize: '0.66rem', color: state.activeTab === 'simulator' ? '#f1f5f9' : '#94a3b8', marginTop: '0.2rem' }}>
                Chaos & Smoke Tests
              </div>
            </button>
          </>
        ) : (
          /* IN-GAME CAMPAIGN PHASES (CANNOT NAVIGATE BACK TO SETUP MID-GAME) */
          IN_GAME_PHASES.map((p) => {
            const isCurrent =
              (p.id === 'phase1_mission' && state.flowStep === 'phase1_brief') ||
              (p.id === 'phase2_command' && state.flowStep === 'phase2_auction') ||
              (p.id === 'stage' && state.flowStep === 'phase3_tactical') ||
              (p.id === 'hq' && state.flowStep === 'phase4_hq') ||
              (p.id === 'simulator' && state.activeTab === 'simulator');

            return (
              <button
                key={p.id}
                type="button"
                className={`vtt-phase-tab ${isCurrent ? `active ${p.badgeClass}` : ''}`}
                onClick={() => {
                  if (p.id === 'simulator') {
                    setState((prev) => ({ ...prev, activeTab: 'simulator' }));
                  } else if (p.id === 'phase1_mission') {
                    setState((prev) => ({ ...prev, flowStep: 'phase1_brief', activeTab: 'phase1_mission' }));
                  } else if (p.id === 'phase2_command') {
                    setState((prev) => ({ ...prev, flowStep: 'phase2_auction', activeTab: 'phase2_command' }));
                  } else if (p.id === 'stage') {
                    setState((prev) => ({ ...prev, flowStep: 'phase3_tactical', activeTab: 'stage' }));
                  } else if (p.id === 'hq') {
                    setState((prev) => ({ ...prev, flowStep: 'phase4_hq', activeTab: 'hq' }));
                  }
                }}
              >
                <strong style={{ fontSize: '0.88rem' }}>{p.title}</strong>
                <div style={{ fontSize: '0.68rem', color: isCurrent ? '#f1f5f9' : '#94a3b8', marginTop: '0.2rem' }}>
                  {p.subtitle}
                </div>
              </button>
            );
          })
        )}
      </nav>

      {/* ====================================================================
          PHASE 0.1: SETUP — PLAYER COUNT SELECTION
         ==================================================================== */}
      {state.flowStep === 'setup_players' && state.activeTab !== 'simulator' && (
        <section className="card-stage" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
              STEP 0.1 // TABLE INITIALIZATION
            </span>
            <h2 style={{ margin: '0.25rem 0', fontSize: '1.4rem', color: '#f8fafc' }}>
              Select Table Player Count
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', margin: 0 }}>
              The Agency Away Team always deploys a strict strike team of exactly 4 Specialist Operatives.
              Choose how many Directors are seated at the council table:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            {[
              { count: 1, label: '👤 1 Player (Solo Directive)', desc: 'Single Director commands all 4 Operative deployment slots.' },
              { count: 2, label: '👥 2 Players (Duo Task Force)', desc: 'Each Director commands 2 Operative deployment slots.' },
              { count: 3, label: '🛡️ 3 Players (Trio + Vanguard Slot)', desc: 'Slots 1–3 assigned to players. Slot 4 is the Vanguard Slot, auctioned to the highest bidder!' },
              { count: 4, label: '🏛️ 4 Players (Full Agency Council)', desc: 'Standard semi-cooperative council: each Director deploys 1 Specialist Operative.' },
            ].map((cfg) => (
              <div
                key={cfg.count}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: '#182234',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#f8fafc' }}>{cfg.label}</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0.4rem 0 0 0', lineHeight: 1.45 }}>
                    {cfg.desc}
                  </p>
                </div>
                <button
                  type="button"
                  className="tabletop-btn tabletop-btn-primary"
                  onClick={() => handleSelectPlayerCount(cfg.count)}
                  style={{ width: '100%', padding: '0.55rem' }}
                >
                  Choose {cfg.count} Player{cfg.count > 1 ? 's' : ''} ▶
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================================
          PHASE 0.2: SETUP — SEQUENTIAL FACTION DRAFT
         ==================================================================== */}
      {state.flowStep === 'setup_factions' && state.activeTab !== 'simulator' && (
        <section>
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                STEP 0.2 // SEQUENTIAL FACTION SELECTION
              </span>
              <h2 style={{ margin: '0.2rem 0', fontSize: '1.35rem', color: '#f8fafc' }}>
                Director {state.setupDraftPlayerIndex + 1}: Browse & Claim Your Faction Dossier
              </h2>
              <div style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>
                Review lore, starting vault assets, passive base powers, and the 4-tier Loyalty Tree.
              </div>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                color: '#38bdf8',
                fontWeight: 700,
              }}
            >
              Draft Turn: Seat {state.setupDraftPlayerIndex + 1} of {state.playerCount}
            </span>
          </div>

          {/* Faction Dossiers Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {factions.map((f) => {
              const claimedBy = state.vaults.find((v) => v.factionId === f.id);
              const isClaimed = !!claimedBy;

              return (
                <FactionDossierCard
                  key={f.id}
                  faction={f}
                  isClaimed={isClaimed}
                  claimedByPlayerName={claimedBy?.playerName}
                  canClaim={!isClaimed}
                  onClaim={() => handleClaimFaction(f.id)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ====================================================================
          PHASE 0.3: SETUP — SPECIALIST OPERATIVE BENCH DRAFT (0 STARTING ITEMS)
         ==================================================================== */}
      {state.flowStep === 'setup_bench' && state.activeTab !== 'simulator' && (
        <section>
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                STEP 0.3 // SPECIALIST BENCH DRAFT (0 STARTING ITEMS)
              </span>
              <h2 style={{ margin: '0.2rem 0', fontSize: '1.35rem', color: '#f8fafc' }}>
                Review Dealt Specialist Operatives & Select Active Vanguard
              </h2>
              <div style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>
                Each Director received 3 Specialist Tarot cards into their Bench Tray (with 0 armory items). Select which specialist deploys for Drop 1:
              </div>
            </div>
            <button
              type="button"
              className="tabletop-btn tabletop-btn-success"
              style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
              onClick={() => setState((p) => ({ ...p, flowStep: 'setup_agendas_objectives' }))}
            >
              Lock Operatives & Deal Corporate Objectives ▶
            </button>
          </div>

          {/* Director Benches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {state.vaults.slice(0, state.playerCount).map((v) => {
              const benchCharIds = state.playerBenches[v.playerIndex] || [];
              const activeSquadCharId = state.squad.find((s) => s.ownerPlayer === v.playerIndex)?.characterId;

              return (
                <div
                  key={v.playerIndex}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '10px',
                    background: '#131d2e',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: '#f8fafc' }}>
                        {v.playerName} ({factions.find((f) => f.id === v.factionId)?.title || 'Faction'})
                      </strong>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                        Vault: {v.credits} CR • {v.effort} EF • {v.pip} PIP
                      </span>
                    </div>
                    <span style={{ fontSize: '0.76rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      Bench Tray: 3 Specialists (Click to activate)
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {benchCharIds.map((charId) => {
                      const char = characters.find((c) => c.id === charId);
                      if (!char) return null;
                      const isActive = activeSquadCharId === charId;

                      return (
                        <OperativeCard
                          key={charId}
                          character={char}
                          currentHp={char.stats?.hp_cap || 3}
                          maxHp={char.stats?.hp_cap || 3}
                          availableDice={char.stats?.static_dice || 6}
                          totalDice={char.stats?.static_dice || 6}
                          loyalty={1}
                          isActiveSquad={isActive}
                          isSelected={isActive}
                          onSelect={() => handleSelectActiveOperative(v.playerIndex, charId)}
                          actionButton={
                            <button
                              type="button"
                              className={`tabletop-btn ${isActive ? 'tabletop-btn-success' : 'tabletop-btn-primary'}`}
                              style={{ width: '100%', padding: '0.35rem' }}
                              onClick={() => handleSelectActiveOperative(v.playerIndex, charId)}
                            >
                              {isActive ? '✓ Active Deployment Slot' : 'Deploy This Operative'}
                            </button>
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ====================================================================
          PHASE 0.4: SETUP — POLITICAL AGENDAS & SECRET OBJECTIVES DRAFT
         ==================================================================== */}
      {state.flowStep === 'setup_agendas_objectives' && state.activeTab !== 'simulator' && (
        <section style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                STEP 0.4 // POLITICAL AGENDAS & SECRET CORPORATE OBJECTIVES
              </span>
              <h2 style={{ margin: '0.2rem 0', fontSize: '1.35rem', color: '#f8fafc' }}>
                Deal Open Agendas & Draft Secret Corporate Objectives
              </h2>
              <div style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>
                In accordance with Chapter 2 Step 6: 3 Open Agendas are dealt face-up to the table. Each Director is dealt 2 Secret Objectives and chooses 1 to keep face-down.
              </div>
            </div>
            <button
              type="button"
              className="tabletop-btn tabletop-btn-success"
              style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
              onClick={() => setState((p) => ({ ...p, flowStep: 'setup_campaign' }))}
            >
              Lock Objectives & Choose Campaign ▶
            </button>
          </div>

          {/* Open Corporate Agendas on the Table */}
          <div style={{ padding: '1rem', borderRadius: '8px', background: '#0e1726', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700 }}>
                🌐 OPEN TABLE AGENDAS (3 ACTIVE CONTRACTS)
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Any Director who fulfills an agenda during a mission claims its bounty immediately.
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
              {state.openAgendaIds.map((agId) => {
                const ag = agendas.find((a) => a.id === agId);
                if (!ag) return null;
                const claimedByPlayer = state.claimedAgendaIds[agId];
                const claimedByName = claimedByPlayer !== undefined ? state.vaults[claimedByPlayer]?.playerName : null;
                return (
                  <AgendaCard
                    key={agId}
                    agenda={ag}
                    claimedByPlayerName={claimedByName}
                  />
                );
              })}
            </div>
          </div>

          {/* Director Secret Objectives Draft Tray */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#f59e0b', marginBottom: '0.75rem', fontWeight: 700 }}>
              🔒 DIRECTORS' SECRET OBJECTIVE DRAFTS (KEEP 1 PER SEAT)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {state.vaults.slice(0, state.playerCount).map((v) => {
                const pObj = state.playerSecretObjectives[v.playerIndex] || { dealtIds: [], selectedId: null, isRevealed: false };
                const fac = factions.find((f) => f.id === v.factionId);

                return (
                  <div
                    key={v.playerIndex}
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: '#131d2e',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <strong style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                        {v.playerName} ({fac?.title || 'Faction'})
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                        Choose 1 Secret Objective to Keep
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      {pObj.dealtIds.map((objId) => {
                        const obj = secretObjectives.find((o) => o.id === objId);
                        if (!obj) return null;
                        const isSelected = pObj.selectedId === objId;

                        return (
                          <SecretObjectiveCard
                            key={objId}
                            objective={obj}
                            isRevealed={pObj.isRevealed}
                            onToggleReveal={() => handleToggleSecretObjectiveReveal(v.playerIndex)}
                            isSelected={isSelected}
                            showSelectButton={true}
                            onSelect={() => handleSelectSecretObjective(v.playerIndex, objId)}
                            ownerPlayerName={v.playerName}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          PHASE 0.5: SETUP — CAMPAIGN SELECTION
         ==================================================================== */}
      {state.flowStep === 'setup_campaign' && state.activeTab !== 'simulator' && (
        <section className="card-stage" style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
              STEP 0.4 // CAMPAIGN INITIALIZATION
            </span>
            <h2 style={{ margin: '0.25rem 0', fontSize: '1.4rem', color: '#f8fafc' }}>
              Select Active Campaign Dossier
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', margin: 0 }}>
              The selected campaign establishes the fixed procedural mission sequence, threat level, and Task Force Dissolution failure limit:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                style={{
                  padding: '1.1rem',
                  borderRadius: '8px',
                  background: '#182234',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '1.05rem', color: '#f8fafc' }}>{camp.title}</strong>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: '#f87171',
                        padding: '1px 6px',
                        borderRadius: '3px',
                        background: 'rgba(220, 38, 38, 0.15)',
                        border: '1px solid #dc2626',
                      }}
                    >
                      Max: {camp.stats?.max_doom || 3} [FAIL]
                    </span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.76rem', lineHeight: 1.45 }}>
                    <SemanticText text={camp.rules_text || camp.flavor_text || ''} />
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.74rem', color: '#cbd5e1' }}>
                    <strong>Missions:</strong> {camp.campaign_parameters?.missions?.length || 3} Procedural Missions
                  </div>
                </div>

                <button
                  type="button"
                  className="tabletop-btn tabletop-btn-primary"
                  onClick={() => handleSelectCampaign(camp.id)}
                  style={{ width: '100%', padding: '0.6rem', fontWeight: 700 }}
                >
                  Start {camp.title} ▶
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================================
          PHASE 1: MISSION BRIEFING & THREAT DECK PREVIEW
         ==================================================================== */}
      {state.flowStep === 'phase1_brief' && state.activeTab !== 'simulator' && (
        <section className="card-stage" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                PHASE 1 // MISSION {state.missionIndex + 1} BRIEFING
              </span>
              <h2 style={{ margin: '0.2rem 0', fontSize: '1.4rem', color: '#f8fafc' }}>
                {activeMission?.title}
              </h2>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                Campaign: {activeCampaign?.title} • Climax Threat Level
              </div>
            </div>
            <div
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                background: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid #eab308',
                textAlign: 'right',
              }}
            >
              <div style={{ fontSize: '0.64rem', color: '#fef08a' }}>CLEARANCE BOUNTY</div>
              <strong style={{ fontSize: '0.95rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                [{activeMission?.stats?.bounty_credits || 6} CR] • [{activeMission?.stats?.bounty_pip || 1} PIP]
              </strong>
            </div>
          </div>

          {/* Narrative Brief */}
          <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            <SemanticText text={activeMission?.rules_text || activeMission?.body || ''} />
          </div>

          {/* Procedural Stage Track Preview */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
              PROCEDURAL STAGE SEQUENCE ({activeStages.length} STAGES)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {activeStages.map((st: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: '#182234',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.78rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <strong style={{ color: '#f8fafc' }}>Stage {idx + 1}: {st.name}</strong>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#fbbf24', fontWeight: 700 }}>
                      D={st.target_difficulty}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <FocusBadge focus={st.preset_focus} />
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Preset Focus</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          {/* Active Table Open Agendas */}
          <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#0e1726', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.3rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>
                🌐 OPEN TABLE AGENDAS (ACTIVE CORPORATE CONTRACTS)
              </span>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                Acting Director: <strong style={{ color: '#38bdf8' }}>{state.vaults[state.activeDirectorIndex]?.playerName}</strong>
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {state.openAgendaIds.map((agId) => {
                const ag = agendas.find((a) => a.id === agId);
                if (!ag) return null;
                const claimedByPlayer = state.claimedAgendaIds[agId];
                const claimedByName = claimedByPlayer !== undefined ? state.vaults[claimedByPlayer]?.playerName : null;
                return (
                  <AgendaCard
                    key={agId}
                    agenda={ag}
                    claimedByPlayerName={claimedByName}
                    canClaim={claimedByPlayer === undefined}
                    onClaim={() => handleClaimAgenda(agId)}
                    activeDirectorName={state.vaults[state.activeDirectorIndex]?.playerName}
                  />
                );
              })}
            </div>
          </div>

<button
            type="button"
            className="tabletop-btn tabletop-btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}
            onClick={() => setState((p) => ({ ...p, flowStep: 'phase2_auction', activeTab: 'phase2_command' }))}
          >
            Assemble Strike Team & Conduct Command Auction ▶
          </button>
        </section>
      )}

      {/* ====================================================================
          PHASE 2: COMMAND AUCTION & ROSTER DEPLOYMENT
         ==================================================================== */}
      {state.flowStep === 'phase2_auction' && state.activeTab !== 'simulator' && (
        <section style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Command Auction Console */}
          <div
            style={{
              padding: '1.1rem 1.25rem',
              borderRadius: '10px',
              background: '#182234',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                  PHASE 2 // COMMAND AUCTION CONSOLE
                </span>
                <h3 style={{ margin: '0.2rem 0', fontSize: '1.25rem', color: '#f8fafc' }}>
                  Bid Credits [CR] to Claim Squad Leader Command
                </h3>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  Tie-Breakers: Highest [CR] Bid → Highest Vault [PIP] → Candidate Operative [LOY] → Roll-Off (BL-RULES-04)
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="tabletop-btn tabletop-btn-primary"
                  onClick={handleResolveCommandAuction}
                >
                  👑 Resolve Auction
                </button>
                <button
                  type="button"
                  className="tabletop-btn"
                  onClick={handleZeroBidRollOff}
                  title="Conduct 1d6 roll-off if all players bid [0 CR] or decline (BL-RULES-04)"
                >
                  🎲 0-Bid Roll-Off (BL-RULES-04)
                </button>
              </div>
            </div>

            {/* Bidding Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {state.vaults.slice(0, state.playerCount).map((v, idx) => (
                <div
                  key={v.playerIndex}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: v.isSquadLeader ? 'rgba(56, 189, 248, 0.12)' : '#111a2c',
                    border: v.isSquadLeader ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#f8fafc' }}>{v.playerName}</strong>
                    {v.isSquadLeader && (
                      <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.72rem' }}>
                        👑 SQUAD LEADER
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                    Vault Assets: {v.credits} CR • {v.effort} EF • {v.pip} PIP
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Credit Bid:</span>
                    <input
                      type="number"
                      min={0}
                      max={v.credits}
                      value={v.commandBid}
                      onChange={(e) => {
                        const val = Math.min(v.credits, Math.max(0, Number(e.target.value) || 0));
                        setState((p) => ({
                          ...p,
                          vaults: p.vaults.map((vault, i) => (i === idx ? { ...vault, commandBid: val } : vault)),
                        }));
                      }}
                      style={{
                        width: '60px',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '4px',
                        background: '#090d16',
                        color: '#fbbf24',
                        border: '1px solid #334155',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        textAlign: 'center',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Deployed Operatives */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
              AWAY TEAM DEPLOYMENT ROSTER (4 SLOTS)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {state.squad.map((op, slotIdx) => {
                const char = characters.find((c) => c.id === op.characterId);
                const ownerVault = state.vaults[op.ownerPlayer];
                const isVanguard = state.playerCount === 3 && slotIdx === 3;

                if (!char) return null;

                return (
                  <OperativeCard
                    key={slotIdx}
                    character={char}
                    currentHp={op.currentHp}
                    maxHp={char.stats?.hp_cap || 3}
                    availableDice={Math.max(0, (char.stats?.static_dice || 6) - op.spentDice)}
                    totalDice={char.stats?.static_dice || 6}
                    loyalty={op.loyalty}
                    isActiveSquad={true}
                    currentStageFocus={currentActiveFocus}
                    actionButton={
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', paddingTop: '0.2rem' }}>
                        {isVanguard
                          ? `🛡️ Vanguard Slot (Comm: ${ownerVault?.playerName})`
                          : `Owner: ${ownerVault?.playerName}`}
                      </div>
                    }
                  />
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="tabletop-btn tabletop-btn-success"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
            onClick={() => setState((p) => ({ ...p, flowStep: 'phase3_tactical', activeTab: 'stage' }))}
          >
            Deploy Away Team to Stage 1 ▶
          </button>
        </section>
      )}

      {/* ====================================================================
          PHASE 3: TACTICAL FIELD MISSION (THE CORE STAGE LOOP)
         ==================================================================== */}
      {state.flowStep === 'phase3_tactical' && state.activeTab !== 'simulator' && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Sequencer Bar & Rules Coach */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '10px',
              background: '#182234',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                TACTICAL MISSION MICRO-LOOP // STAGE {state.stageIndex + 1} OF {activeStages.length}
              </span>
              <div style={{ display: 'flex', gap: '0.45rem' }}>
                <button
                  type="button"
                  className="tabletop-btn"
                  onClick={() => setState((p) => ({ ...p, sequenceStep: Math.max(1, p.sequenceStep - 1) }))}
                  disabled={state.sequenceStep <= 1}
                >
                  ◀ Prev Step
                </button>
                <button
                  type="button"
                  className="tabletop-btn tabletop-btn-primary"
                  onClick={() => setState((p) => ({ ...p, sequenceStep: Math.min(6, p.sequenceStep + 1) }))}
                  disabled={state.sequenceStep >= 6}
                >
                  Next Step ▶
                </button>
              </div>
            </div>

            {/* 6-Step Sequencer Pills */}
            <div className="vtt-sequencer-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.4rem' }}>
              {SEQUENCE_STEPS.map((st) => {
                const isActive = state.sequenceStep === st.step;
                const isDone = state.sequenceStep > st.step;
                return (
                  <button
                    key={st.step}
                    type="button"
                    className={`vtt-step-pill ${isActive ? 'active' : isDone ? 'completed' : ''}`}
                    onClick={() => setState((p) => ({ ...p, sequenceStep: st.step }))}
                    style={{ padding: '0.45rem 0.6rem' }}
                  >
                    <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: isActive ? '#38bdf8' : isDone ? '#34d399' : '#64748b' }}>
                      {isDone ? '✓ DONE' : isActive ? '● ACTIVE' : `STEP 0${st.step}`}
                    </div>
                    <strong style={{ fontSize: '0.74rem' }}>{st.shortTitle}</strong>
                  </button>
                );
              })}
            </div>

            {/* Coach Hint */}
            <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <strong style={{ color: '#38bdf8' }}>💡 Step {state.sequenceStep} Coach: </strong>
              <SemanticText text={activeStepMeta.coachHint} />
            </div>
          </div>

          {/* Active Stage Card */}
          <StageCard
            stage={currentStage}
            totalStages={activeStages.length}
            activeFocus={currentActiveFocus}
            activeDifficulty={state.targetDifficulty}
            attachedModifier={activeModifier}
            isSquadLeader={true}
            onDynamicSwap={handleDynamicSwap}
            canSwap={state.sequenceStep === 1}
          />

          {/* Tactile Dice Tray */}
          <TactileDiceTray
            rolledDice={state.rolledDiceHistory}
            targetDifficulty={state.targetDifficulty}
            totalHits={state.stageHits}
            totalBackfires={state.stageBackfires}
            phaseLabel={
              state.sequenceStep <= 2
                ? 'Phase 1: Specialists (3+)'
                : state.sequenceStep === 3
                ? 'Phase 2: Support (4+/5+)'
                : 'Stage Resolution'
            }
          />

          {/* Micro-Loop Action Bar Based on Active Step */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '8px',
              background: '#182234',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <strong style={{ fontSize: '0.92rem', color: '#f8fafc' }}>
                Action Window: {activeStepMeta.shortTitle}
              </strong>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {state.sequenceStep === 1 && 'Declare Dynamic Focus Swaps or proceed to Phase 1 roll.'}
                {state.sequenceStep === 2 && 'Set committed dice on Primary Specialists and roll 3+.'}
                {state.sequenceStep === 3 && 'Set committed dice on Support Operatives and roll 4+/5+.'}
                {state.sequenceStep === 4 && 'Stabilize 0 HP operatives before they are marked KIA.'}
                {state.sequenceStep === 5 && 'Verify stage clearance and allocate Momentum die refunds.'}
                {state.sequenceStep === 6 && 'Logistical refresh and advance to next stage.'}
              </div>
            </div>

            <div>
              {state.sequenceStep === 1 && (
                <button
                  type="button"
                  className="tabletop-btn tabletop-btn-primary"
                  onClick={() => setState((p) => ({ ...p, sequenceStep: 2 }))}
                >
                  Confirm Briefing & Roll Specialists (3+) ▶
                </button>
              )}

              {state.sequenceStep === 2 && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="tabletop-btn tabletop-btn-primary"
                    onClick={handleRollSpecialists}
                    title="Roll all committed dice for eligible Phase 1 Specialists simultaneously"
                  >
                    🎲 Roll All Committed Specialists (3+) ▶
                  </button>
                  <button
                    type="button"
                    className="tabletop-btn"
                    onClick={() => setState((p) => ({ ...p, sequenceStep: 3 }))}
                    title="Skip Phase 1 (e.g. if all specialists hold back) and proceed to Phase 2 Support"
                  >
                    Skip to Step 3 Support ⏩
                  </button>
                </div>
              )}

              {state.sequenceStep === 3 && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="tabletop-btn tabletop-btn-primary"
                    onClick={handleRollSupport}
                    title="Roll all committed dice for eligible Phase 2 Support operatives simultaneously"
                  >
                    🎲 Roll All Committed Support (4+/5+) ▶
                  </button>
                  <button
                    type="button"
                    className="tabletop-btn"
                    onClick={() =>
                      setState((p) => ({
                        ...p,
                        sequenceStep: p.squad.some((s) => s.currentHp <= 0) ? 4 : 5,
                      }))
                    }
                    title="Conclude rolling and proceed to Triage / Resolution"
                  >
                    Finish Support Rolls ⏩
                  </button>
                </div>
              )}

              {state.sequenceStep === 4 && (
                <button
                  type="button"
                  className="tabletop-btn tabletop-btn-success"
                  onClick={() => setState((p) => ({ ...p, sequenceStep: 5 }))}
                >
                  Complete Triage & Resolve Stage ▶
                </button>
              )}

              {state.sequenceStep === 5 && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="tabletop-btn tabletop-btn-success"
                    onClick={handleResolveStageOutcome}
                  >
                    🏆 Verify Stage Clearance ▶
                  </button>
                </div>
              )}

              {state.sequenceStep === 6 && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="tabletop-btn"
                    onClick={() => handleLogisticalRefresh(1)}
                    title="Squad Leader spends [2 EF] to restore +1 static die squad-wide"
                  >
                    📦 Refresh +1 Die ([2 EF])
                  </button>
                  <button
                    type="button"
                    className="tabletop-btn tabletop-btn-primary"
                    onClick={handleAdvanceToNextStage}
                  >
                    {state.stageIndex + 1 < activeStages.length
                      ? 'Advance to Next Stage ▶'
                      : 'Mission Complete! Evac to HQ ▶'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4 Operatives Cards on the Field */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
              ACTIVE AWAY TEAM OPERATIVES IN THE FIELD
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {state.squad.map((op, slotIdx) => {
                const char = characters.find((c) => c.id === op.characterId);
                if (!char) return null;
                const avail = Math.max(0, (char.stats?.static_dice || 6) - op.spentDice);

                const pri = (char.focus_affinity?.primary || '').toLowerCase();
                const sec = (char.focus_affinity?.secondary || '').toLowerCase();
                const cur = currentActiveFocus.toLowerCase();
                const isPri = pri === cur;
                const thresh = isPri ? 3 : sec === cur ? 4 : 5;

                const hasRolled = op.rolledDice.length > 0;
                const isSpecialistStep = state.sequenceStep === 2;
                const isSupportStep = state.sequenceStep === 3;
                const isCurrentStepActive = (isSpecialistStep && isPri) || (isSupportStep && !isPri);
                const isVanguard = state.playerCount === 3 && slotIdx === 3;
                const ownerVault = state.vaults[op.ownerPlayer];

                return (
                  <OperativeCard
                    key={slotIdx}
                    character={char}
                    currentHp={op.currentHp}
                    maxHp={char.stats?.hp_cap || 3}
                    availableDice={avail}
                    totalDice={char.stats?.static_dice || 6}
                    loyalty={op.loyalty}
                    isActiveSquad={true}
                    currentStageFocus={currentActiveFocus}
                    actionButton={
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.45rem' }}>
                        {/* Player Attribution & Sovereignty Header */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.3rem 0.5rem',
                            borderRadius: '4px',
                            background: 'rgba(15, 23, 42, 0.75)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            fontSize: '0.7rem',
                          }}
                        >
                          <span style={{ color: '#94a3b8' }}>
                            {isVanguard ? (
                              <strong style={{ color: '#38bdf8' }}>👑 Vanguard Slot (Squad Leader)</strong>
                            ) : (
                              <span>
                                Player {op.ownerPlayer + 1}: <strong style={{ color: '#f8fafc' }}>{ownerVault?.playerName}</strong>
                              </span>
                            )}
                          </span>
                          {isPri ? (
                            <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.66rem' }}>
                              Specialist (3+)
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.66rem' }}>
                              Support ({thresh}+)
                            </span>
                          )}
                        </div>

                        {/* Status / Rolled Result */}
                        {hasRolled ? (
                          <div
                            style={{
                              padding: '0.4rem',
                              borderRadius: '5px',
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              fontSize: '0.72rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ color: '#34d399', fontWeight: 700 }}>
                              ✅ Rolled {op.rolledDice.length} Dice:
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#f8fafc' }}>
                              [{op.rolledDice.join(', ')}]
                            </span>
                          </div>
                        ) : (
                          /* Dedicated Dice Commitment Selector */
                          <div
                            style={{
                              padding: '0.5rem',
                              borderRadius: '6px',
                              background: isCurrentStepActive ? 'rgba(30, 41, 59, 0.85)' : 'rgba(15, 23, 42, 0.5)',
                              border: isCurrentStepActive ? '1px solid #0284c7' : '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.72rem' }}>
                              <span style={{ color: isCurrentStepActive ? '#38bdf8' : '#94a3b8', fontWeight: 600 }}>
                                {isCurrentStepActive ? '🎲 Choose Dice to Roll:' : 'Stamina Choice:'}
                              </span>
                              <strong style={{ color: '#f8fafc' }}>
                                {op.committedDice} of {avail} dice
                              </strong>
                            </div>

                            {/* Quick Select Buttons: 0 (Hold Back), 1, 2, 3, Max */}
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                              <button
                                type="button"
                                className="tabletop-btn"
                                style={{
                                  flex: 1,
                                  padding: '2px 4px',
                                  fontSize: '0.66rem',
                                  background: op.committedDice === 0 ? '#b45309' : undefined,
                                  borderColor: op.committedDice === 0 ? '#f59e0b' : undefined,
                                }}
                                onClick={() => handleSetOperativeCommittedDice(slotIdx, 0)}
                                title="Hold Back: Roll 0 dice. Preserves stamina and avoids all Backfire risk (forfeits [MOM] refunds)."
                              >
                                0 (Hold)
                              </button>
                              {[1, 2, 3].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  className="tabletop-btn"
                                  disabled={avail < num}
                                  style={{
                                    padding: '2px 6px',
                                    fontSize: '0.66rem',
                                    background: op.committedDice === num ? '#0369a1' : undefined,
                                  }}
                                  onClick={() => handleSetOperativeCommittedDice(slotIdx, num)}
                                >
                                  {num}
                                </button>
                              ))}
                              <button
                                type="button"
                                className="tabletop-btn"
                                disabled={avail === 0}
                                style={{
                                  padding: '2px 6px',
                                  fontSize: '0.66rem',
                                  background: op.committedDice === avail && avail > 0 ? '#0369a1' : undefined,
                                }}
                                onClick={() => handleSetOperativeCommittedDice(slotIdx, avail)}
                                title={`Commit all ${avail} remaining available dice`}
                              >
                                Max ({avail})
                              </button>
                            </div>

                            {/* Forecast & Explanation */}
                            <div style={{ fontSize: '0.66rem', color: op.committedDice === 0 ? '#f59e0b' : '#94a3b8', lineHeight: 1.3 }}>
                              {op.committedDice === 0 ? (
                                '🛡️ Holding back: 0 dice rolled. Safe from Backfire, but ineligible for [MOM] refunds.'
                              ) : (
                                <span>
                                  Forecast: ~{(op.committedDice * (thresh === 3 ? 4 / 6 : thresh === 4 ? 3 / 6 : 2 / 6)).toFixed(1)} Hits
                                  {thresh === 5 && ' • ⚠️ 16.7% Backfire risk/die'}
                                </span>
                              )}
                            </div>

                            {/* Individual Operative Roll Button */}
                            {isCurrentStepActive && (
                              <button
                                type="button"
                                className="tabletop-btn tabletop-btn-primary"
                                style={{ width: '100%', marginTop: '0.4rem', padding: '0.35rem', fontSize: '0.74rem', fontWeight: 700 }}
                                disabled={op.committedDice === 0}
                                onClick={() => handleRollSingleOperative(slotIdx)}
                                title={`Roll ${op.committedDice} dice for ${char.title} at ${thresh}+ focus`}
                              >
                                🎲 Roll {op.committedDice} Dice for {char.title} ({thresh}+)
                              </button>
                            )}
                          </div>
                        )}

                        {/* Momentum Refund Button in Step 5 */}
                        {state.sequenceStep === 5 && state.momentumTokens > 0 && op.spentDice > 0 && op.committedDice > 0 && (
                          <button
                            type="button"
                            className="tabletop-btn tabletop-btn-success"
                            style={{ padding: '0.3rem', fontSize: '0.72rem' }}
                            onClick={() => handleAllocateMomentumRefund(slotIdx)}
                          >
                            ⚡ Refund 1 Die ([1 MOM])
                          </button>
                        )}

                        {/* Triage Stabilize Button in Step 4 */}
                        {state.sequenceStep === 4 && op.currentHp <= 0 && (
                          <button
                            type="button"
                            className="tabletop-btn tabletop-btn-danger"
                            style={{ padding: '0.3rem', fontSize: '0.72rem' }}
                            onClick={() => handleStabilizeOperative(slotIdx, op.ownerPlayer)}
                          >
                            💉 Stabilize ([1 EF])
                          </button>
                        )}
                      </div>
                    }
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================
          PHASE 4: HEADQUARTERS DOWNTIME (BASE OPERATIONS & ECONOMY)
         ==================================================================== */}
      {state.flowStep === 'phase4_hq' && state.activeTab !== 'simulator' && (
        <section style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header & Debrief Payouts */}
          {/* Step 1: Debrief & Dual-Stream Payout Console */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '10px',
              background: '#182234',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                  PHASE 4 // HEADQUARTERS DOWNTIME (STEP 1: DEBRIEF & DUAL-STREAM PAYOUTS)
                </span>
                <h3 style={{ margin: '0.2rem 0', fontSize: '1.35rem', color: '#f8fafc' }}>
                  Dual-Stream Payout Model (BL-RULES-01)
                </h3>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  <strong>Stream 1:</strong> [2 CR] guaranteed per deployed character + [1 PIP] per faction • <strong>Stream 2:</strong> [{bountyPoolCr} CR] clearance pool negotiated by players.
                </div>
              </div>

              {/* Multi-Click Protected Deposit Button */}
              <div>
                {(() => {
                  const activeCount = state.playerCount || 4;
                  let allocatedSum = 0;
                  for (let i = 0; i < activeCount; i++) {
                    allocatedSum += state.negotiatedBountyCredits[i] || 0;
                  }
                  const unallocated = bountyPoolCr - allocatedSum;
                  const canClaim = !state.payoutsClaimed && unallocated === 0;

                  return (
                    <button
                      type="button"
                      className="tabletop-btn"
                      disabled={!canClaim}
                      onClick={() => handleDistributeMissionPayouts(bountyPoolCr, bountyPoolPip)}
                      style={{
                        padding: '0.65rem 1.35rem',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        background: state.payoutsClaimed
                          ? '#065f46'
                          : unallocated !== 0
                          ? '#78350f'
                          : '#0284c7',
                        borderColor: state.payoutsClaimed
                          ? '#10b981'
                          : unallocated !== 0
                          ? '#f59e0b'
                          : '#38bdf8',
                        color: '#f8fafc',
                        cursor: canClaim ? 'pointer' : 'not-allowed',
                      }}
                      title={
                        state.payoutsClaimed
                          ? 'Payouts have already been deposited for this mission.'
                          : unallocated !== 0
                          ? `Allocate the full ${bountyPoolCr} CR pool before depositing.`
                          : 'Deposit guaranteed character stipends and negotiated pool shares into vaults.'
                      }
                    >
                      {state.payoutsClaimed
                        ? '✅ Payouts Deposited into Vaults (Claimed)'
                        : unallocated !== 0
                        ? `⚠️ Allocate Full Pool (${unallocated > 0 ? `+${unallocated} CR left` : `${Math.abs(unallocated)} CR over`})`
                        : '💸 Claim & Deposit Dual-Stream Payouts into Vaults'}
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Interactive Player Payout Table */}
            <div style={{ background: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 2fr 1.5fr',
                  padding: '0.6rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                }}
              >
                <div>DIRECTOR / FACTION</div>
                <div>DEPLOYED CHARACTER(S)</div>
                <div>STREAM 1 (GUARANTEED)</div>
                <div>STREAM 2 (NEGOTIATED POOL)</div>
                <div>TOTAL DEPOSIT</div>
              </div>

              {state.vaults.slice(0, state.playerCount).map((v) => {
                // Find operatives deployed by this player
                const deployedOps = state.squad.filter((s) => s.ownerPlayer === v.playerIndex);
                const charNames = deployedOps
                  .map((op) => {
                    const c = characters.find((char) => char.id === op.characterId);
                    return c ? c.title : `Operative ${op.slotIndex + 1}`;
                  })
                  .join(', ');

                const isLeader = v.isSquadLeader;
                const guaranteedCr = deployedOps.length * 2; // +2 CR per character
                const guaranteedPip = 1 + (isLeader ? 1 : 0);
                const poolCr = state.negotiatedBountyCredits[v.playerIndex] || 0;
                const totalCr = guaranteedCr + poolCr;

                return (
                  <div
                    key={v.playerIndex}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 2fr 1.5fr 2fr 1.5fr',
                      padding: '0.75rem 0.85rem',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      fontSize: '0.78rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#f8fafc' }}>{v.playerName}</strong>
                      {isLeader && (
                        <span style={{ marginLeft: '0.4rem', color: '#38bdf8', fontSize: '0.66rem' }}>
                          👑 LEADER
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.74rem' }}>
                      {charNames || 'None'} ({deployedOps.length} agent{deployedOps.length !== 1 ? 's' : ''})
                    </div>
                    <div style={{ color: '#34d399', fontWeight: 600 }}>
                      +{guaranteedCr} CR • +{guaranteedPip} PIP
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="tabletop-btn"
                        style={{ padding: '1px 6px', fontSize: '0.72rem' }}
                        disabled={state.payoutsClaimed || poolCr <= 0}
                        onClick={() => handleSetNegotiatedBountyCredits(v.playerIndex, -1)}
                        title="Decrease negotiated credit share"
                      >
                        -
                      </button>
                      <strong style={{ minWidth: '32px', textAlign: 'center', color: '#fbbf24' }}>
                        {poolCr} CR
                      </strong>
                      <button
                        type="button"
                        className="tabletop-btn"
                        style={{ padding: '1px 6px', fontSize: '0.72rem' }}
                        disabled={state.payoutsClaimed}
                        onClick={() => handleSetNegotiatedBountyCredits(v.playerIndex, 1)}
                        title="Increase negotiated credit share"
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <strong style={{ color: '#fbbf24', fontSize: '0.88rem' }}>+{totalCr} CR</strong>
                      <span style={{ color: '#c084fc', marginLeft: '0.35rem' }}>+{guaranteedPip} PIP</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Negotiation Pool Status & Reset */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {(() => {
                  const activeCount = state.playerCount || 4;
                  let allocatedSum = 0;
                  for (let i = 0; i < activeCount; i++) {
                    allocatedSum += state.negotiatedBountyCredits[i] || 0;
                  }
                  const unallocated = bountyPoolCr - allocatedSum;

                  return (
                    <>
                      <span>
                        Shared Pool: <strong style={{ color: '#fbbf24' }}>{bountyPoolCr} CR</strong>
                      </span>
                      <span>
                        Allocated: <strong style={{ color: '#34d399' }}>{allocatedSum} CR</strong>
                      </span>
                      <span>
                        Unallocated:{' '}
                        <strong style={{ color: unallocated === 0 ? '#34d399' : '#f87171' }}>
                          {unallocated} CR
                        </strong>
                      </span>
                    </>
                  );
                })()}
              </div>

              {!state.payoutsClaimed && (
                <button
                  type="button"
                  className="tabletop-btn"
                  onClick={handleResetCanonicalBountySplit}
                  style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
                  title="Reset negotiated pool to canonical split (divided evenly with remainder to Squad Leader)"
                >
                  ⚖️ Reset to Canonical Split
                </button>
              )}
            </div>
          </div>

          {/* ====================================================================
              DIRECTOR SEAT SWITCHER & TABLETOP ACTION CONSOLE
             ==================================================================== */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '10px',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#38bdf8' }}>
                  DIRECTOR CONSOLE // SELECT ACTING SEAT
                </span>
                <h4 style={{ margin: '0.15rem 0', fontSize: '1.05rem', color: '#f8fafc' }}>
                  Current Active Director: {state.vaults[state.activeDirectorIndex]?.playerName} ({factions.find((f) => f.id === state.vaults[state.activeDirectorIndex]?.factionId)?.title || 'Faction'})
                </h4>
              </div>
              <button
                type="button"
                className="tabletop-btn"
                onClick={() => {
                  const nextIdx = (state.activeDirectorIndex + 1) % (state.playerCount || 4);
                  handleSwitchActiveDirector(nextIdx);
                }}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.76rem' }}
              >
                Pass Turn to Next Director ▶
              </button>
            </div>

            {/* Seated Directors Tab Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`, gap: '0.65rem' }}>
              {state.vaults.slice(0, state.playerCount).map((v) => {
                const isActive = v.playerIndex === state.activeDirectorIndex;
                const fac = factions.find((f) => f.id === v.factionId);
                return (
                  <button
                    key={v.playerIndex}
                    type="button"
                    onClick={() => handleSwitchActiveDirector(v.playerIndex)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: isActive ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' : '#111827',
                      border: isActive ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isActive ? '0 0 12px rgba(56, 189, 248, 0.25)' : 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: isActive ? '#38bdf8' : '#f8fafc', fontSize: '0.86rem' }}>
                        {v.playerName}
                      </strong>
                      {v.isSquadLeader && <span style={{ color: '#38bdf8', fontSize: '0.66rem' }}>👑 LEADER</span>}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {fac?.title || 'Neutral Faction'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.72rem', marginTop: '0.2rem' }}>
                      <span style={{ color: '#fbbf24', fontWeight: 700 }}>{v.credits} CR</span>
                      <span style={{ color: '#38bdf8', fontWeight: 700 }}>{v.effort} EF</span>
                      <span style={{ color: '#c084fc', fontWeight: 700 }}>{v.pip} PIP</span>
                      <span style={{ color: '#facc15', fontWeight: 700 }}>{v.vp} VP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ====================================================================
              ACTIVE DIRECTOR TABLETOP DESK: PIECES, GEAR RACK & SECRET OBJECTIVE
             ==================================================================== */}
          {(() => {
            const pIdx = state.activeDirectorIndex;
            const activeVault = state.vaults[pIdx] || state.vaults[0];
            const activeFac = factions.find((f) => f.id === activeVault.factionId);
            const activeOps = state.squad.filter((s) => s.ownerPlayer === pIdx);
            const activeCache = state.factionArmoryCaches[pIdx] || [];
            const activeObjState = state.playerSecretObjectives[pIdx];
            const activeObj = secretObjectives.find((o) => o.id === activeObjState?.selectedId);

            return (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(180deg, #131d2e 0%, #0a0f18 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#38bdf8' }}>
                      VIRTUAL DESK PIECES // {activeVault.playerName.toUpperCase()}
                    </span>
                    <h3 style={{ margin: '0.2rem 0', fontSize: '1.25rem', color: '#f8fafc' }}>
                      {activeFac?.title || 'Faction Directorate'} Desk & Operative Gear Rack
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Passive Trait:</span>
                    <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600 }}>
                      {activeFac?.passive_ability?.name || 'Standard Operational Protocols'}
                    </span>
                  </div>
                </div>

                {/* Desk Pieces Layout: Operatives Loadouts, Cache, Secret Objective */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                  {/* Left: Operative Loadouts & Anatomical Slots */}
                  <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#38bdf8', marginBottom: '0.5rem' }}>
                      OPERATIVE ANATOMICAL LOADOUTS (6 SLOTS: HEAD, BODY, HANDS, ACCESSORIES)
                    </div>
                    {activeOps.length === 0 ? (
                      <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>No operatives currently deployed in field.</div>
                    ) : (
                      activeOps.map((op) => {
                        const char = characters.find((c) => c.id === op.characterId);
                        return (
                          <div
                            key={op.slotIndex}
                            style={{
                              padding: '0.65rem',
                              borderRadius: '6px',
                              background: '#111a2c',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              marginBottom: '0.65rem',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                              <strong style={{ color: '#f8fafc', fontSize: '0.86rem' }}>
                                {char?.title || `Operative Slot ${op.slotIndex + 1}`}
                              </strong>
                              <span style={{ fontSize: '0.72rem', color: '#34d399' }}>
                                HP: {op.currentHp}/{char?.stats?.hp_cap || 3} {op.armorRemaining > 0 ? `• Armor: +${op.armorRemaining}` : ''}
                              </span>
                            </div>

                            {/* Equipped Items List with Unequip Button */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.35rem' }}>
                              {op.equippedItemIds.length === 0 ? (
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' }}>
                                  Empty loadout (0 / 6 anatomical slots equipped).
                                </div>
                              ) : (
                                op.equippedItemIds.map((itemId) => {
                                  const it = items.find((i) => i.id === itemId);
                                  return (
                                    <div
                                      key={itemId}
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        background: '#0f172a',
                                        fontSize: '0.72rem',
                                      }}
                                    >
                                      <span style={{ color: '#f8fafc' }}>
                                        🎒 {it?.title || itemId} {it?.stats?.slots_required?.[0] ? `[${it.stats.slots_required[0]}]` : ''}
                                      </span>
                                      <button
                                        type="button"
                                        className="tabletop-btn"
                                        onClick={() => handleUnequipItem(op.slotIndex, itemId)}
                                        style={{ padding: '1px 5px', fontSize: '0.66rem' }}
                                        title="Unequip item and return to Faction Cache"
                                      >
                                        Unequip
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Faction Armory Cache */}
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                        FACTION ARMORY CACHE ({activeCache.length} unequipped item{activeCache.length !== 1 ? 's' : ''})
                      </div>
                      {activeCache.length === 0 ? (
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic' }}>
                          Cache is empty. Purchase items at the Quartermaster below.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {activeCache.map((itemId) => {
                            const it = items.find((i) => i.id === itemId);
                            const defaultTargetSlot = activeOps[0]?.slotIndex ?? 0;
                            return (
                              <div
                                key={itemId}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '0.3rem 0.5rem',
                                  borderRadius: '4px',
                                  background: '#111827',
                                  fontSize: '0.72rem',
                                }}
                              >
                                <span style={{ color: '#cbd5e1' }}>📦 {it?.title || itemId}</span>
                                <button
                                  type="button"
                                  className="tabletop-btn tabletop-btn-primary"
                                  onClick={() => handleEquipFromCache(pIdx, itemId, defaultTargetSlot)}
                                  style={{ padding: '1px 6px', fontSize: '0.66rem' }}
                                >
                                  Equip to Operative ▶
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Secret Corporate Objective Card */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#f59e0b' }}>
                      DIRECTOR'S SECRET CORPORATE MANDATE
                    </div>
                    {activeObj ? (
                      <SecretObjectiveCard
                        objective={activeObj}
                        isRevealed={activeObjState?.isRevealed}
                        onToggleReveal={() => handleToggleSecretObjectiveReveal(pIdx)}
                        ownerPlayerName={activeVault.playerName}
                      />
                    ) : (
                      <div style={{ padding: '1rem', background: '#090d16', borderRadius: '8px', color: '#94a3b8', fontSize: '0.75rem' }}>
                        No secret objective currently assigned.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ====================================================================
              STEP 4: CORPORATE BASE OPERATIONS & HQ FACILITY BOARD
             ==================================================================== */}
          <HQFacilityBoard
            facilities={hqFacilities}
            sponsorships={state.sponsoredFacilities}
            activePlayerIndex={state.activeDirectorIndex}
            activePlayerName={state.vaults[state.activeDirectorIndex]?.playerName || 'Director 1'}
            activePlayerCredits={state.vaults[state.activeDirectorIndex]?.credits || 0}
            activePlayerPip={state.vaults[state.activeDirectorIndex]?.pip || 0}
            onSponsor={handleSponsorFacility}
            playerNames={Object.fromEntries(state.vaults.map((v) => [v.playerIndex, v.playerName]))}
            factionNames={Object.fromEntries(
              state.vaults.map((v) => [
                v.playerIndex,
                factions.find((f) => f.id === v.factionId)?.title || `Player ${v.playerIndex + 1}`,
              ])
            )}
          />

          {/* ====================================================================
              STEP 6: QUARTERMASTER ARMORY SUPPLY MARKET (WITH STOCK DEPLETION)
             ==================================================================== */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '10px',
              background: '#182234',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                  STEP 6 // QUARTERMASTER ARMORY SUPPLY MARKET
                </span>
                <h3 style={{ margin: '0.2rem 0', fontSize: '1.3rem', color: '#f8fafc' }}>
                  Procure Specialized Tactical Equipment
                </h3>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                  Acting Buyer: <strong style={{ color: '#38bdf8' }}>{state.vaults[state.activeDirectorIndex]?.playerName}</strong> • Vault:{' '}
                  <strong style={{ color: '#fbbf24' }}>{state.vaults[state.activeDirectorIndex]?.credits} CR</strong>. Purchased items are removed from market and replenished.
                </div>
              </div>

              <button
                type="button"
                className="tabletop-btn"
                onClick={() => handleRefreshArmoryMarket(false)}
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.76rem' }}
                title="Refresh Quartermaster market display row (cost: [1 CR])"
              >
                🔄 Refresh Market Display ([1 CR])
              </button>
            </div>

            {/* Market Row Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
              {(state.armoryMarketItemIds || []).map((itemId) => {
                const it = items.find((i) => i.id === itemId);
                if (!it) return null;
                const costCr = it.cost?.credits || 0;
                const buyerCredits = state.vaults[state.activeDirectorIndex]?.credits || 0;
                const defaultTargetSlot = state.squad.findIndex((s) => s.ownerPlayer === state.activeDirectorIndex);

                return (
                  <ArmoryItemCard
                    key={it.id}
                    item={it}
                    playerCredits={buyerCredits}
                    canPurchase={buyerCredits >= costCr}
                    onPurchase={() => handlePurchaseArmoryItem(state.activeDirectorIndex, it.id, defaultTargetSlot, false)}
                  />
                );
              })}
            </div>
          </div>

          {/* ====================================================================
              STEP 7: BOARDROOM DOCTRINES & FACTION PERKS
             ==================================================================== */}
          <FactionPerksConsole
            perks={perks}
            unlockedPerkIds={state.activePerkIds[state.activeDirectorIndex] || []}
            activePlayerIndex={state.activeDirectorIndex}
            activePlayerName={state.vaults[state.activeDirectorIndex]?.playerName || 'Director 1'}
            activePlayerCredits={state.vaults[state.activeDirectorIndex]?.credits || 0}
            activePlayerPip={state.vaults[state.activeDirectorIndex]?.pip || 0}
            onUnlockPerk={handleUnlockPerk}
          />

          {/* Advance to Next Mission */}
          <button
            type="button"
            className="tabletop-btn tabletop-btn-success"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
            onClick={() => {
              const nextMIdx = state.missionIndex + 1;
              const activeCount = state.playerCount || 4;
              const baseEven = Math.floor(bountyPoolCr / activeCount);
              const rem = bountyPoolCr % activeCount;
              const nextSplit: Record<number, number> = {};
              for (let i = 0; i < activeCount; i++) {
                nextSplit[i] = baseEven + (i === 0 ? rem : 0);
              }

              setState((p) => ({
                ...p,
                missionIndex: nextMIdx,
                stageIndex: 0,
                sequenceStep: 1,
                flowStep: 'phase1_brief',
                activeTab: 'phase1_mission',
                payoutsClaimed: false, // Reset for next debrief
                negotiatedBountyCredits: nextSplit,
                // Reset operative HP and spent dice in base
                squad: p.squad.map((s) => ({ ...s, spentDice: 0, currentHp: 3, rolledDice: [] })),
              }));
              appendLog(`Downtime completed. Advancing to Mission ${nextMIdx + 1} briefing.`);
            }}
          >
            Conclude HQ Downtime & Advance to Next Campaign Mission ▶
          </button>
        </section>
      )}

      {/* ====================================================================
          TAB 5: BALANCE, MONTE CARLO, DETERMINISTIC & CHAOS SIMULATOR CONSOLE
         ==================================================================== */}
      {state.activeTab === 'simulator' && (
        <section className="card-stage" style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#38bdf8' }}>
                STATISTICAL BALANCE & AUTOMATED TEST SIMULATOR
              </span>
              <h3 style={{ margin: '0.2rem 0', fontSize: '1.25rem', color: '#f8fafc' }}>
                Tabletop Verification Console
              </h3>
            </div>
            {/* Simulator Mode Switcher */}
            <div style={{ display: 'flex', gap: '0.4rem', background: '#090d16', padding: '0.3rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                type="button"
                className={`tabletop-btn ${simTab === 'combat_monte_carlo' ? 'tabletop-btn-primary' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => setSimTab('combat_monte_carlo')}
              >
                📊 Combat Monte Carlo
              </button>
              <button
                type="button"
                className={`tabletop-btn ${simTab === 'deterministic_scenarios' ? 'tabletop-btn-primary' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => setSimTab('deterministic_scenarios')}
              >
                🎯 Deterministic Smoke Scenarios
              </button>
              <button
                type="button"
                className={`tabletop-btn ${simTab === 'chaos_fuzzing' ? 'tabletop-btn-primary' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => setSimTab('chaos_fuzzing')}
              >
                🎲 Chaos Fuzz Simulator
              </button>
            </div>
          </div>

          {/* SUB-PANEL 1: COMBAT MONTE CARLO */}
          {simTab === 'combat_monte_carlo' && (
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#f1f5f9', fontSize: '1rem' }}>
                    Live Stage Probability vs Target D={state.targetDifficulty}
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.78rem' }}>
                    1,000-trial simulation based on current 4 deployed operatives and active Stage focus.
                  </p>
                </div>
                <button
                  type="button"
                  className="tabletop-btn tabletop-btn-primary"
                  onClick={() => setSimSeedBump((p) => p + 1)}
                >
                  🔄 Re-Run Monte Carlo
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', margin: '1rem 0' }}>
                <div style={{ padding: '1rem', borderRadius: '8px', background: '#182234', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>CLEAR PROBABILITY</div>
                  <strong style={{ fontSize: '1.6rem', color: liveSimulation.clearProbabilityPct >= 75 ? '#34d399' : '#fbbf24' }}>
                    {liveSimulation.clearProbabilityPct}%
                  </strong>
                </div>
                <div style={{ padding: '1rem', borderRadius: '8px', background: '#182234', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>EARLY RESOLUTION ODDS (PHASE 1)</div>
                  <strong style={{ fontSize: '1.6rem', color: '#38bdf8' }}>
                    {liveSimulation.earlyPhase1ClearProbabilityPct}%
                  </strong>
                </div>
                <div style={{ padding: '1rem', borderRadius: '8px', background: '#182234', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>OPERATIONAL MOMENTUM ODDS</div>
                  <strong style={{ fontSize: '1.6rem', color: '#a855f7' }}>
                    {liveSimulation.momentumProbabilityPct}%
                  </strong>
                </div>
                <div style={{ padding: '1rem', borderRadius: '8px', background: '#182234', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>EXPECTED BACKFIRES</div>
                  <strong style={{ fontSize: '1.6rem', color: '#f87171' }}>
                    {liveSimulation.averageBackfires} / trial
                  </strong>
                </div>
              </div>

              <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <strong>Tactical Verdict: </strong> {liveSimulation.tacticalVerdict}
              </div>
            </div>
          )}

          {/* SUB-PANEL 2: DETERMINISTIC SMOKE SCENARIOS */}
          {simTab === 'deterministic_scenarios' && (
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#f1f5f9', fontSize: '1rem' }}>
                    Deterministic Acceptance Scenarios
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.78rem' }}>
                    Execute fixed, repeatable game paths with predictable dice and state assertions.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    className="tabletop-select"
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value as any)}
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.84rem' }}
                  >
                    <option value="smoke_clean_clear">Scenario 1: Clean Clear Smoke Test</option>
                    <option value="martyr_dying_breath">Scenario 2: Martyr & Dying Breath Test</option>
                  </select>
                  <button
                    type="button"
                    className="tabletop-btn tabletop-btn-primary"
                    onClick={() => {
                      const rep = runGameSimulation(
                        { mode: 'deterministic', scenarioId: selectedScenario },
                        components
                      );
                      setSimReport(rep);
                      appendLog(`🎯 [SIMULATOR] Ran deterministic scenario ${selectedScenario}: ${rep.success ? 'PASSED ✅' : 'FAILED ❌'}.`);
                    }}
                  >
                    ▶ Run Scenario Test
                  </button>
                </div>
              </div>

              {simReport && simReport.mode === 'deterministic' && (
                <div style={{ marginTop: '1rem' }}>
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: simReport.success ? 'rgba(5, 150, 105, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${simReport.success ? '#059669' : '#ef4444'}`,
                      marginBottom: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: simReport.success ? '#34d399' : '#f87171' }}>
                        {simReport.success ? '✅ SCENARIO ACCEPTANCE PASSED' : '❌ SCENARIO FAILED'}
                      </strong>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                        Executed {simReport.totalStepsExecuted} discrete game engine steps across 1 full run. Deadlocks: {simReport.deadlocksDetected}. Invariant Violations: {simReport.invariantViolations.length}.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="tabletop-btn"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(simReport, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `away_team_deterministic_${selectedScenario}_report.json`;
                        a.click();
                      }}
                      title="Download full JSON telemetry export"
                    >
                      💾 Export Telemetry (JSON)
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: '#182234', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TOTAL CREDITS EARNED</div>
                      <strong style={{ fontSize: '1.2rem', color: '#38bdf8' }}>{simReport.summaryMetrics.totalCreditsEarned} CR</strong>
                    </div>
                    <div style={{ padding: '0.75rem', background: '#182234', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>FACILITIES SPONSORED</div>
                      <strong style={{ fontSize: '1.2rem', color: '#34d399' }}>{simReport.summaryMetrics.totalFacilitiesSponsored}</strong>
                    </div>
                    <div style={{ padding: '0.75rem', background: '#182234', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ITEMS PURCHASED</div>
                      <strong style={{ fontSize: '1.2rem', color: '#fbbf24' }}>{simReport.summaryMetrics.totalItemsPurchased}</strong>
                    </div>
                    <div style={{ padding: '0.75rem', background: '#182234', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>CASUALTIES SUSTAINED</div>
                      <strong style={{ fontSize: '1.2rem', color: '#f87171' }}>{simReport.summaryMetrics.totalCasualties}</strong>
                    </div>
                  </div>

                  <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                    <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '0.3rem' }}>SCENARIO EXECUTION LOG:</div>
                    {simReport.logs.map((log, idx) => (
                      <div key={idx} style={{ color: '#94a3b8', lineHeight: 1.5 }}>
                        [{log.phase} / Step {log.step}] <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{log.action}</span>: {log.details}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-PANEL 3: CHAOS FUZZ SIMULATOR */}
          {simTab === 'chaos_fuzzing' && (
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#f1f5f9', fontSize: '1rem' }}>
                    Automated Chaos / Fuzz Testing Loop
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.78rem' }}>
                    Simulates N complete playthroughs with stochastic player choices to expose deadlocks, race conditions, and negative balances.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                    Cycles:{' '}
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={chaosRunsCount}
                      onChange={(e) => setChaosRunsCount(Math.min(100, Math.max(5, parseInt(e.target.value) || 20)))}
                      style={{ width: '60px', padding: '0.35rem', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '4px', textAlign: 'center' }}
                    />
                  </label>
                  <button
                    type="button"
                    className="tabletop-btn tabletop-btn-primary"
                    onClick={() => {
                      const rep = runGameSimulation(
                        { mode: 'chaos', runs: chaosRunsCount, seed: Date.now() },
                        components
                      );
                      setSimReport(rep);
                      appendLog(`🎲 [CHAOS SIM] Completed ${rep.runsCompleted} cycles. Deadlocks: ${rep.deadlocksDetected}, Invariant Violations: ${rep.invariantViolations.length}.`);
                    }}
                  >
                    ⚡ Run Chaos Fuzzing
                  </button>
                </div>
              </div>

              {simReport && simReport.mode === 'chaos' && (
                <div style={{ marginTop: '1rem' }}>
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: simReport.success ? 'rgba(5, 150, 105, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${simReport.success ? '#059669' : '#ef4444'}`,
                      marginBottom: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: simReport.success ? '#34d399' : '#f87171' }}>
                        {simReport.success ? '✅ CHAOS FUZZ PASSED (0 DEADLOCKS)' : '❌ INVARIANT VIOLATION DETECTED'}
                      </strong>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                        Executed {simReport.totalStepsExecuted} total steps across {simReport.runsCompleted} automated campaign cycles.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="tabletop-btn"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(simReport, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `away_team_chaos_${simReport.runsCompleted}_cycles_telemetry.json`;
                        a.click();
                      }}
                      title="Download full JSON telemetry export"
                    >
                      💾 Export Chaos Telemetry (JSON)
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: '#182234', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>RUNS COMPLETED</div>
                      <strong style={{ fontSize: '1.2rem', color: '#38bdf8' }}>{simReport.runsCompleted} Cycles</strong>
                    </div>
                    <div style={{ padding: '0.75rem', background: '#182234', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>DEADLOCKS DETECTED</div>
                      <strong style={{ fontSize: '1.2rem', color: simReport.deadlocksDetected === 0 ? '#34d399' : '#ef4444' }}>
                        {simReport.deadlocksDetected}
                      </strong>
                    </div>
                    <div style={{ padding: '0.75rem', background: '#182234', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>INVARIANT VIOLATIONS</div>
                      <strong style={{ fontSize: '1.2rem', color: simReport.invariantViolations.length === 0 ? '#34d399' : '#ef4444' }}>
                        {simReport.invariantViolations.length}
                      </strong>
                    </div>
                    <div style={{ padding: '0.75rem', background: '#182234', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>AVG STEPS / RUN</div>
                      <strong style={{ fontSize: '1.2rem', color: '#fbbf24' }}>
                        {(simReport.totalStepsExecuted / (simReport.runsCompleted || 1)).toFixed(1)}
                      </strong>
                    </div>
                  </div>

                  {simReport.invariantViolations.length > 0 && (
                    <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.8rem' }}>
                      <strong>Invariant Violations:</strong>
                      <ul style={{ margin: '0.25rem 0 0 1rem' }}>
                        {simReport.invariantViolations.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                    <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '0.3rem' }}>CHAOS SAMPLE LOGS (FIRST 50 STEPS):</div>
                    {simReport.logs.slice(0, 50).map((log, idx) => (
                      <div key={idx} style={{ color: '#94a3b8', lineHeight: 1.5 }}>
                        [{log.phase} / Step {log.step}] <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{log.action}</span>: {log.details}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ====================================================================
          ACTION LOG / AUDIT TRAIL
         ==================================================================== */}
      <footer
        style={{
          marginTop: '1.5rem',
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: '#94a3b8',
          maxHeight: '120px',
          overflowY: 'auto',
        }}
      >
        <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.35rem' }}>
          OPERATIONAL ACTION LOG (AUDIT TRAIL):
        </div>
        {state.combatLog.map((log, idx) => (
          <div key={idx} style={{ lineHeight: 1.5, color: idx === 0 ? '#38bdf8' : '#94a3b8' }}>
            {log}
          </div>
        ))}
      </footer>
    </div>
  );
}
