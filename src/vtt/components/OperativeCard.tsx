import React, { useState } from 'react';
import { GameComponent } from '../../components/ComponentCard';
import { PhysicalCardModal } from '../../components/PhysicalCardMockup';
import { FocusBadge } from '../../components/SemanticText';

export interface OperativeCardProps {
  character: GameComponent;
  currentHp: number;
  maxHp: number;
  availableDice: number;
  totalDice: number;
  loyalty: number;
  isActiveSquad?: boolean;
  isSelected?: boolean;
  equippedItemNames?: string[];
  currentStageFocus?: string;
  onSelect?: () => void;
  onActivateAbility?: () => void;
  abilityCostEffort?: number;
  canActivateAbility?: boolean;
  actionButton?: React.ReactNode;
}

export function OperativeCard({
  character,
  currentHp,
  maxHp,
  availableDice,
  totalDice,
  loyalty,
  isActiveSquad = false,
  isSelected = false,
  equippedItemNames = [],
  currentStageFocus,
  onSelect,
  onActivateAbility,
  abilityCostEffort = 1,
  canActivateAbility = false,
  actionButton,
}: OperativeCardProps) {
  const stats = character.stats || {};
  const primaryFocus = character.focus_affinity?.primary || 'combat';
  const secondaryFocus = character.focus_affinity?.secondary || 'intel';
  const classAbility = character.class_ability;
  const uniquePower = character.unique_power;
  const artSpec = character.art_spec;
  const [showMockup, setShowMockup] = useState(false);

  // Determine hit threshold for current stage
  let hitThreshold = 5;
  let thresholdLabel = '5+ (Out of Focus)';
  let isPrimary = false;

  if (currentStageFocus) {
    if (primaryFocus.toLowerCase() === currentStageFocus.toLowerCase()) {
      hitThreshold = 3;
      thresholdLabel = '3+ (Primary Focus)';
      isPrimary = true;
    } else if (secondaryFocus.toLowerCase() === currentStageFocus.toLowerCase()) {
      hitThreshold = 4;
      thresholdLabel = '4+ (Secondary Focus)';
    }
  }

  return (
    <div
      className={`card-tarot ${isSelected ? 'selected' : ''} ${
        isActiveSquad ? 'active-deployment' : ''
      }`}
      onClick={onSelect}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
    >
      {/* Header: Class & Callsign */}
      <div className="card-tarot-header">
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              color: '#38bdf8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {character.category || 'Specialist'} • Tier {character.tier || 1}
          </div>
          <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>
            {character.title}
          </strong>
        </div>
        <FocusBadge focus={primaryFocus} />
      </div>

      {/* Visual Portrait (Tarot Aspect 70×120) */}
      <div
        className="card-art-placeholder"
        style={{
          height: '135px',
          position: 'relative',
          overflow: 'hidden',
          padding: 0,
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowMockup(true);
        }}
        title={`Click to inspect physical Tarot proof: ${artSpec?.visual_description || character.title}`}
      >
        {artSpec?.asset_path ? (
          <img
            src={artSpec.asset_path}
            alt={character.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.95))',
            padding: '0.35rem 0.5rem 0.2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '0.68rem', color: '#e2e8f0', letterSpacing: '0.04em' }}>
            {character.category?.toUpperCase() || 'OPERATIVE'}
          </span>
          <span style={{ fontSize: '0.6rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            🎴 9.0 ES PROOF
          </span>
        </div>
      </div>

      {/* 9.0 ES Stat Strip: HP & Static Dice Pool */}
      <div className="card-stat-strip">
        <div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>HEALTH (MAX {maxHp})</div>
          <div style={{ fontWeight: 700, color: currentHp <= 1 ? '#f87171' : '#f1f5f9' }}>
            ❤️ {currentHp} / {maxHp} HP
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>STATIC DICE POOL</div>
          <div style={{ fontWeight: 700, color: '#38bdf8' }}>
            🎲 {availableDice} / {totalDice} d6
          </div>
        </div>
      </div>

      {/* Focus Threshold for Active Stage */}
      {currentStageFocus && (
        <div
          style={{
            padding: '0.35rem 0.5rem',
            borderRadius: '4px',
            background: isPrimary ? 'rgba(5, 150, 105, 0.2)' : 'rgba(30, 41, 59, 0.7)',
            border: isPrimary ? '1px solid #059669' : '1px solid #334155',
            fontSize: '0.72rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#94a3b8' }}>Room Hit Target:</span>
          <strong style={{ color: isPrimary ? '#34d399' : '#f8fafc' }}>
            {thresholdLabel}
          </strong>
        </div>
      )}

      {/* Class Ability Box */}
      {classAbility && (
        <div className="card-ability-box">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.2rem',
            }}
          >
            <strong style={{ color: '#e2e8f0', fontSize: '0.76rem' }}>
              ⚡ {classAbility.name}
            </strong>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                padding: '1px 5px',
                borderRadius: '3px',
                background: 'rgba(2, 132, 199, 0.2)',
                color: '#38bdf8',
                border: '1px solid #0284c7',
              }}
            >
              [{classAbility.cost_effort || abilityCostEffort} EF]
            </span>
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>
            {classAbility.effect}
          </div>
          {onActivateAbility && (
            <button
              type="button"
              className="tabletop-btn tabletop-btn-primary"
              disabled={!canActivateAbility}
              onClick={(e) => {
                e.stopPropagation();
                onActivateAbility();
              }}
              style={{ marginTop: '0.35rem', width: '100%', padding: '0.25rem' }}
              title={`Spend [${classAbility.cost_effort || abilityCostEffort} EF] from your Vault to activate ${classAbility.name}`}
            >
              Trigger Ability ([{classAbility.cost_effort || abilityCostEffort} EF])
            </button>
          )}
        </div>
      )}

      {/* Unique Power */}
      {uniquePower && (
        <div className="card-ability-box" style={{ background: 'rgba(15, 23, 42, 0.35)' }}>
          <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.74rem' }}>
            ⭐ {uniquePower.name}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '0.1rem' }}>
            {uniquePower.effect}
          </div>
        </div>
      )}

      {/* Equipped Armory Items */}
      {equippedItemNames.length > 0 && (
        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
          <span>🎒 Gear: </span>
          <span style={{ color: '#e2e8f0' }}>{equippedItemNames.join(', ')}</span>
        </div>
      )}

      {/* Footer: Loyalty Stars & Actions */}
      <div className="card-loyalty-meter">
        <span>LOYALTY TIER:</span>
        <span style={{ color: '#fbbf24', letterSpacing: '0.15em' }}>
          {'★'.repeat(Math.min(4, loyalty || 1))}
          {'☆'.repeat(Math.max(0, 4 - (loyalty || 1)))}
        </span>
      </div>

      {actionButton && <div style={{ marginTop: '0.2rem' }}>{actionButton}</div>}

      {showMockup && (
        <PhysicalCardModal item={character} onClose={() => setShowMockup(false)} />
      )}
    </div>
  );
}
