import React, { useEffect, useMemo, useState } from 'react';
import { GameComponent } from '../components/ComponentCard';
import { FocusBadge, SemanticText } from '../components/SemanticText';

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
  critInjuryDicePenalty: number;
  critInjuryHpPenalty: number;
  traumaNote: string;
  equippedItemIds: string[];
  rolledDice: number[];
  inMedBay: boolean;
}

interface VTTState {
  playerCount: number;
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

const STORAGE_KEY = 'away_team_vtt_state_v1';

const DEFAULT_STATE: VTTState = {
  playerCount: 4,
  campaignId: 'campaign-iron-dawn',
  missionId: 'mission-iron-dawn-1-black-market-intercept',
  stageIndex: 0,
  overrideFocus: null,
  secondaryConcurrentFocus: null,
  activeModifierId: '',
  targetDifficulty: 14,
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
      critInjuryDicePenalty: 0,
      critInjuryHpPenalty: 0,
      traumaNote: '',
      rolledDice: [],
      equippedItemIds: ['item-consumable-t1-field-trauma-medkit'],
      inMedBay: false,
    },
  ],
  combatLog: [
    '[SYSTEM] Away Team Virtual Tabletop initialized. Select a Mission Stage and roll Static Dice Pools.',
  ],
};

export function VirtualTabletop({ components }: VTTProps) {
  const [state, setState] = useState<VTTState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<'stage' | 'squad' | 'hq' | 'medbay'>('stage');

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.vaults && parsed.squad) {
          setState(parsed);
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

    let threshold = 5;
    let roleLabel = 'Phase 2: Vanguard Assist (5+)';
    let isOutOfFocus = true;

    if (primary && focusTargets.includes(primary)) {
      threshold = 3;
      roleLabel = 'Phase 1: Primary Specialist (3+)';
      isOutOfFocus = false;
    } else if (
      (secondary && focusTargets.includes(secondary)) ||
      itemBridges.some((b) => b && focusTargets.includes(b))
    ) {
      threshold = 4;
      roleLabel = 'Phase 1: Secondary/Bridge Specialist (4+)';
      isOutOfFocus = false;
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
        itemStaticDice +
        op.bonusDice -
        op.critInjuryDicePenalty
    );
    const maxHp = Math.max(
      1,
      (char?.stats?.hp_cap || 3) - op.critInjuryHpPenalty
    );

    const hits = op.rolledDice.filter((d) => d >= threshold).length;
    const backfires = isOutOfFocus ? op.rolledDice.filter((d) => d === 1).length : 0;

    return {
      char,
      equipped,
      threshold,
      roleLabel,
      isOutOfFocus,
      totalDice,
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
    for (const op of state.squad) {
      if (op.inMedBay || op.currentHp <= 0) continue;
      const ev = getOperativeEval(op);
      totalSuccesses += ev.hits;
      totalBackfires += ev.backfires;
    }
    const cleared = totalSuccesses >= state.targetDifficulty;
    const momentumEarned = totalSuccesses >= state.targetDifficulty + 2;
    return { totalSuccesses, totalBackfires, cleared, momentumEarned };
  }, [state.squad, state.targetDifficulty, effectivePrimaryFocus, state.secondaryConcurrentFocus]);

  // Roll all active operatives' static dice pools
  const handleRollSquadPools = () => {
    const nextSquad = state.squad.map((op) => {
      if (op.inMedBay || op.currentHp <= 0) {
        return { ...op, rolledDice: [] };
      }
      const ev = getOperativeEval(op);
      const rolled = Array.from({ length: ev.totalDice }, () =>
        Math.floor(Math.random() * 6) + 1
      );
      return { ...op, rolledDice: rolled };
    });

    setState((prev) => ({ ...prev, squad: nextSquad }));
    appendLog(
      `Rolled Static Dice Pools for active Away Team on [${effectivePrimaryFocus.toUpperCase()}] stage (Target Difficulty: ${state.targetDifficulty}).`
    );
  };

  // Resolve Command Auction
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
      `Command Auction resolved: ${state.vaults[winnerIdx].playerName} elected Squad Leader with a bid of ${bestBid} [CR] (tie-breaker: ${bestPip} [PIP]).`
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

    // Check slot usage (Head, Body, Legs, Pack, and up to 2 Hand slots)
    const candidateSlots = candidate.stats?.slots_required || [];
    let handCount = currentItems.reduce(
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
      {/* Top Macro Campaign & Doom Bar */}
      <section className="vtt-panel">
        <div className="vtt-panel-title">
          <span>AWAY TEAM VIRTUAL TABLETOP (VTT) — COMMAND & CAMPAIGN HUD</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="vtt-btn"
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
              💾 Export Save JSON
            </button>
            <button
              type="button"
              className="vtt-btn vtt-btn-danger"
              onClick={() => {
                setState(DEFAULT_STATE);
                localStorage.removeItem(STORAGE_KEY);
              }}
            >
              ↺ Reset Table
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.85rem',
            alignItems: 'center',
          }}
        >
          {/* Campaign Selector */}
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>
              ACTIVE CAMPAIGN DOSSIER
            </label>
            <select
              value={state.campaignId}
              onChange={(e) =>
                setState((prev) => ({ ...prev, campaignId: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '0.45rem',
                borderRadius: '6px',
                background: 'var(--bg-void)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-strong)',
              }}
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Mission Selector */}
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>
              ACTIVE MISSION / SIDE-MISSION
            </label>
            <select
              value={state.missionId}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  missionId: e.target.value,
                  stageIndex: 0,
                  overrideFocus: null,
                }))
              }
              style={{
                width: '100%',
                padding: '0.45rem',
                borderRadius: '6px',
                background: 'var(--bg-void)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-strong)',
              }}
            >
              {missions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Doom & Momentum Trackers */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                padding: '0.4rem 0.7rem',
                borderRadius: '6px',
                background: 'var(--currency-doom-bg)',
                border: '1px solid var(--currency-doom)',
              }}
            >
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                META CAMPAIGN DOOM CLOCK
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="vtt-btn"
                  onClick={() =>
                    setState((p) => ({ ...p, doom: Math.max(0, p.doom - 1) }))
                  }
                >
                  -
                </button>
                <strong style={{ fontSize: '1.05rem', color: '#ff8080' }}>
                  {state.doom} / {activeCampaign?.stats?.max_doom || 4} [DOOM]
                </strong>
                <button
                  type="button"
                  className="vtt-btn"
                  onClick={() =>
                    setState((p) => ({ ...p, doom: p.doom + 1 }))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div
              style={{
                padding: '0.4rem 0.7rem',
                borderRadius: '6px',
                background: 'var(--currency-momentum-bg)',
                border: '1px solid var(--currency-momentum)',
              }}
            >
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                IN-MISSION MOMENTUM (TRANSIENT)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="vtt-btn"
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      momentumTokens: Math.max(0, p.momentumTokens - 1),
                    }))
                  }
                >
                  -
                </button>
                <strong style={{ fontSize: '1.05rem', color: '#34d399' }}>
                  {state.momentumTokens} [MOM]
                </strong>
                <button
                  type="button"
                  className="vtt-btn"
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      momentumTokens: p.momentumTokens + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Player Faction Vaults & Command Auction */}
      <section className="vtt-panel">
        <div className="vtt-panel-title">
          <span>FACTION VAULTS & COMMAND AUCTION</span>
          <button
            type="button"
            className="vtt-btn vtt-btn-primary"
            onClick={handleResolveCommandAuction}
          >
            👑 Resolve Command Auction (Elect Squad Leader)
          </button>
        </div>

        <div className="vtt-grid-4">
          {state.vaults.map((v, idx) => {
            const fac = factions.find((f) => f.id === v.factionId) || factions[0];
            return (
              <div
                key={v.playerIndex}
                style={{
                  padding: '0.85rem',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  border: v.isSquadLeader
                    ? '2px solid var(--currency-credits)'
                    : '1px solid var(--border-subtle)',
                  borderTop: `4px solid ${fac?.color_hex || '#38bdf8'}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <strong>
                    {v.playerName} {v.isSquadLeader ? '👑 SQUAD LEADER' : ''}
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} title="Endgame Victory Point Score Tracker (Not a Spendable Currency)">
                    <span className="semantic-badge badge-currency-vp">🏆 {v.vp} VP</span>
                    <button
                      type="button"
                      className="vtt-btn"
                      style={{ padding: '0px 5px', fontSize: '0.68rem' }}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          vaults: prev.vaults.map((item, i) =>
                            i === idx ? { ...item, vp: Math.max(0, item.vp - 1) } : item
                          ),
                        }))
                      }
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="vtt-btn"
                      style={{ padding: '0px 5px', fontSize: '0.68rem' }}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          vaults: prev.vaults.map((item, i) =>
                            i === idx ? { ...item, vp: item.vp + 1 } : item
                          ),
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <select
                  value={v.factionId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setState((prev) => ({
                      ...prev,
                      vaults: prev.vaults.map((item, i) =>
                        i === idx ? { ...item, factionId: val } : item
                      ),
                    }));
                  }}
                  style={{
                    width: '100%',
                    padding: '0.35rem',
                    marginBottom: '0.45rem',
                    borderRadius: '4px',
                    background: 'var(--bg-void)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                  }}
                >
                  {factions.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title}
                    </option>
                  ))}
                </select>

                {/* Primary Spendable Currencies (3-Column Grid) */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.64rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.25rem',
                  }}
                >
                  PRIMARY VAULT CURRENCIES (SPENDABLE ASSETS)
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.4rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  {(
                    [
                      ['credits', 'CR', 'badge-currency-cr'],
                      ['effort', 'EF', 'badge-currency-ef'],
                      ['pip', 'PIP', 'badge-currency-pip'],
                    ] as const
                  ).map(([field, label, badgeClass]) => (
                    <div
                      key={field}
                      style={{
                        padding: '0.35rem',
                        borderRadius: '6px',
                        background: 'var(--bg-void)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div className={`semantic-badge ${badgeClass}`} style={{ marginBottom: '0.25rem' }}>
                        {label}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', margin: '0.15rem 0' }}>
                        {v[field]}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem' }}>
                        <button
                          type="button"
                          className="vtt-btn"
                          style={{ padding: '1px 6px' }}
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              vaults: prev.vaults.map((item, i) =>
                                i === idx
                                  ? { ...item, [field]: Math.max(0, item[field] - 1) }
                                  : item
                              ),
                            }))
                          }
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="vtt-btn"
                          style={{ padding: '1px 6px' }}
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              vaults: prev.vaults.map((item, i) =>
                                i === idx ? { ...item, [field]: item[field] + 1 } : item
                              ),
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Command Bid Input */}
                <div
                  style={{
                    marginTop: '0.55rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.76rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>Command Auction Bid ([CR]):</span>
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
                      width: '64px',
                      padding: '0.2rem 0.4rem',
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
            );
          })}
        </div>
      </section>

      {/* VTT Mode Sub-Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(
          [
            ['stage', '🎲 1. Active Stage Resolver & Static Dice Pool Engine'],
            ['squad', '🎒 2. Away Team Loadouts (6-Slot Equipment Validator)'],
            ['hq', '🏛 3. Sponsored HQ Facilities & Landmarks'],
            ['medbay', '🏥 4. Med Bay Triage & Critical Trauma Roller'],
          ] as const
        ).map(([tabKey, label]) => (
          <button
            key={tabKey}
            type="button"
            className={`vtt-btn ${activeTab === tabKey ? 'vtt-btn-primary' : ''}`}
            onClick={() => setActiveTab(tabKey)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: STAGE RESOLVER & DICE ENGINE */}
      {activeTab === 'stage' && (
        <section className="vtt-panel">
          <div className="vtt-panel-title">
            <span>
              ACTIVE STAGE: {currentStage?.name || 'Stage 1'} (Stage {state.stageIndex + 1} of{' '}
              {Math.max(1, activeStages.length)})
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {activeStages.map((st: any, sIdx: number) => (
                <button
                  key={sIdx}
                  type="button"
                  className={`vtt-btn ${state.stageIndex === sIdx ? 'vtt-btn-primary' : ''}`}
                  onClick={() =>
                    setState((p) => ({
                      ...p,
                      stageIndex: sIdx,
                      overrideFocus: null,
                      secondaryConcurrentFocus: null,
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
            <div>
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
                    setState((p) => ({ ...p, overrideFocus: 'combat' }));
                    appendLog(
                      'Squad Leader executed Force Breach (2 [EF]): Stage Focus shifted to [Combat] (+2 Target Difficulty).'
                    );
                  }}
                >
                  Force Breach → [Combat]
                </button>
                <button
                  type="button"
                  className="vtt-btn"
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => {
                    setState((p) => ({ ...p, overrideFocus: 'infiltrate' }));
                    appendLog(
                      'Squad Leader executed Tactical Bypass (2 [EF]): Stage Focus shifted to [Infiltrate].'
                    );
                  }}
                >
                  Bypass → [Infiltrate]
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>
                DIPLOMAT SHIFT / SCIENTIST DUAL-VECTOR FOCUS
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

            <div>
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

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                TARGET DIFFICULTY (3.5 × P + M)
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
                  ? '⚡ OPERATIONAL MOMENTUM ACHIEVED (>= D+2)! Gain +1 [MOM] token!'
                  : `Need ${Math.max(0, state.targetDifficulty + 2 - squadSummary.totalSuccesses)} more successes for Operational Momentum [MOM].`}{' '}
                • Out-of-Focus Natural 1 Backfires: <strong>{squadSummary.totalBackfires}</strong>
              </div>
            </div>

            <button
              type="button"
              className="vtt-btn vtt-btn-primary"
              style={{ fontSize: '0.95rem', padding: '0.6rem 1.2rem' }}
              onClick={handleRollSquadPools}
            >
              🎲 Roll All Active Static Dice Pools
            </button>
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
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>{ev.char?.title}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--currency-effort)', fontFamily: 'var(--font-mono)' }}>
                        {ev.roleLabel}
                      </div>
                    </div>
                    <span className="semantic-badge badge-currency-loy">LOY {op.loyalty}</span>
                  </div>

                  {/* Operative Affinity & Stats */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.55rem 0' }}>
                    <FocusBadge focus={ev.char?.focus_affinity?.primary} roleLabel="1°" />
                    <FocusBadge focus={ev.char?.focus_affinity?.secondary} roleLabel="2°" />
                    <span className="stat-pill" style={{ color: '#f87171' }}>
                      ♥ {op.currentHp}/{ev.maxHp} HP
                    </span>
                    <span className="stat-pill" style={{ color: '#38bdf8' }}>
                      🎲 {ev.totalDice} Pool
                    </span>
                  </div>

                  {/* Bonus Dice & HP Adjusters */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      marginBottom: '0.6rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>
                      Temp Dice ({op.bonusDice >= 0 ? `+${op.bonusDice}` : op.bonusDice}):{' '}
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
                      </button>{' '}
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
                    </span>

                    <span>
                      HP:{' '}
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
                      </button>{' '}
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
                    </span>
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
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        No dice rolled yet for this stage.
                      </span>
                    ) : (
                      op.rolledDice.map((val, dIdx) => {
                        const isHit = val >= ev.threshold;
                        const isBackfire = ev.isOutOfFocus && val === 1;
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
                                ? 'Natural 1 Out-of-Focus Backfire!'
                                : `Miss (${val} < ${ev.threshold}+)`
                            }
                          >
                            {val}
                          </span>
                        );
                      })
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}>
                      Hits: {ev.hits} {ev.backfires > 0 ? `• ⚠ ${ev.backfires} Backfire(s)` : ''}
                    </span>
                    <button
                      type="button"
                      className="vtt-btn"
                      style={{ fontSize: '0.72rem' }}
                      onClick={() => handleConvertMissToHit(slotIdx)}
                    >
                      ⚡ Convert 1 Miss → Hit
                    </button>
                  </div>
                </div>
              );
            })}
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
            <span>HQ BASE INFRASTRUCTURE — SPONSORED FACILITIES (+2 VP PER MODULE) & LANDMARKS</span>
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
