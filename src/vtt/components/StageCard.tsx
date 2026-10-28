import React from 'react';
import { FocusBadge, SemanticText } from '../../components/SemanticText';
import { GameComponent } from '../../components/ComponentCard';

export interface StageCardProps {
  stage: {
    stage_number: number;
    name: string;
    preset_focus: string;
    target_difficulty: number;
    dynamic_swap?: {
      type: string;
      target_focus: string;
      target_difficulty: number;
      cost: string;
      description: string;
    };
    failure_penalty?: string;
  };
  totalStages: number;
  activeFocus: string;
  activeDifficulty: number;
  attachedModifier?: GameComponent;
  isSquadLeader: boolean;
  onDynamicSwap?: (targetFocus: string, targetDifficulty: number) => void;
  canSwap?: boolean;
}

export function StageCard({
  stage,
  totalStages,
  activeFocus,
  activeDifficulty,
  attachedModifier,
  isSquadLeader,
  onDynamicSwap,
  canSwap = true,
}: StageCardProps) {
  const dynamicSwap = stage.dynamic_swap;
  const isSwapped = activeFocus.toLowerCase() !== stage.preset_focus.toLowerCase();

  return (
    <div className="card-stage">
      {/* Header: Stage Number & Difficulty */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: '#38bdf8',
              letterSpacing: '0.06em',
            }}
          >
            STAGE {stage.stage_number} OF {totalStages}
          </span>
          <h3 style={{ margin: '0.15rem 0', fontSize: '1.1rem', color: '#f8fafc' }}>
            {stage.name}
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid #eab308',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#fef08a' }}>TARGET:</span>
          <strong style={{ fontSize: '1.15rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
            D={activeDifficulty}
          </strong>
        </div>
      </div>

      {/* Active Room Focus Badge & Swap Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Active Room Focus:</span>
          <FocusBadge focus={activeFocus} />
        </div>
        {isSwapped && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid #a855f7',
              color: '#d8b4fe',
            }}
          >
            ⚡ Dynamic Focus Swap Active
          </span>
        )}
      </div>

      {/* Attached Stage Modifier */}
      {attachedModifier && (
        <div
          style={{
            padding: '0.6rem 0.8rem',
            borderRadius: '6px',
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.35)',
            fontSize: '0.76rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <strong style={{ color: '#f87171' }}>
              ⚠️ Attached Modifier: {attachedModifier.title}
            </strong>
            <span style={{ color: '#94a3b8', fontSize: '0.66rem' }}>
              Tier {attachedModifier.tier || 1}
            </span>
          </div>
          <div style={{ color: '#cbd5e1', lineHeight: 1.45 }}>
            <SemanticText text={attachedModifier.rules_text || attachedModifier.body || ''} />
          </div>
        </div>
      )}

      {/* Dynamic Focus Swap Option */}
      {dynamicSwap && onDynamicSwap && (
        <div
          style={{
            padding: '0.65rem 0.8rem',
            borderRadius: '6px',
            background: 'rgba(30, 41, 59, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <strong style={{ color: '#e2e8f0' }}>
              🔀 Squad Leader Lever: {dynamicSwap.type === 'force_breach' ? 'Force Breach' : 'Tactical Bypass'}
            </strong>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                color: '#38bdf8',
              }}
            >
              Cost: {dynamicSwap.cost}
            </span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
            {dynamicSwap.description}
          </div>
          <button
            type="button"
            className="tabletop-btn tabletop-btn-primary"
            disabled={!canSwap || !isSquadLeader || isSwapped}
            onClick={() => onDynamicSwap(dynamicSwap.target_focus, dynamicSwap.target_difficulty)}
            style={{ width: '100%', padding: '0.35rem' }}
            title={
              isSquadLeader
                ? `Execute ${dynamicSwap.type === 'force_breach' ? 'Force Breach' : 'Tactical Bypass'}: Shifts Focus to [${dynamicSwap.target_focus}] at D=${dynamicSwap.target_difficulty}`
                : 'Only the elected Squad Leader may declare Dynamic Focus Swaps'
            }
          >
            {isSwapped
              ? `Focus Swapped to [${activeFocus}]`
              : `Execute ${dynamicSwap.type === 'force_breach' ? 'Force Breach' : 'Tactical Bypass'} (Shift to [${dynamicSwap.target_focus}] at D=${dynamicSwap.target_difficulty})`}
          </button>
        </div>
      )}

      {/* Failure Penalty Warning */}
      {stage.failure_penalty && (
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.4rem' }}>
          <strong style={{ color: '#ef4444' }}>Failure Penalty: </strong>
          <span>{stage.failure_penalty}</span>
        </div>
      )}
    </div>
  );
}
