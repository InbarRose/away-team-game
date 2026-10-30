import React, { useState } from 'react';
import { GameComponent } from '../../components/ComponentCard';
import { SemanticText } from '../../components/SemanticText';

export interface SecretObjectiveCardProps {
  objective: GameComponent;
  isRevealed?: boolean;
  onToggleReveal?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
  showSelectButton?: boolean;
  ownerPlayerName?: string;
}

export function SecretObjectiveCard({
  objective,
  isRevealed = true,
  onToggleReveal,
  onSelect,
  isSelected = false,
  showSelectButton = false,
  ownerPlayerName,
}: SecretObjectiveCardProps) {
  const [localRevealed, setLocalRevealed] = useState(isRevealed);
  const revealed = onToggleReveal ? isRevealed : localRevealed;

  const toggle = () => {
    if (onToggleReveal) {
      onToggleReveal();
    } else {
      setLocalRevealed((p) => !p);
    }
  };

  const targetMetric = (objective as any).target_metric || objective.rules_text || '';
  const scoringTiers = (objective as any).scoring_tiers || {
    first_place_vp: 15,
    second_place_vp: 10,
    third_place_vp: 5,
  };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #18181b 0%, #09090b 100%)',
        border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '10px',
        padding: '0.9rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        boxShadow: isSelected
          ? '0 0 16px rgba(245, 158, 11, 0.3)'
          : '0 4px 14px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden',
        minWidth: '260px',
      }}
    >
      {/* Top Banner & Security Classification */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #f59e0b',
              color: '#fbbf24',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            🔒 TOP SECRET // ENDGAME
          </span>
          {ownerPlayerName && (
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              • {ownerPlayerName}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={toggle}
          style={{
            background: 'none',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            color: '#cbd5e1',
            fontSize: '0.68rem',
            padding: '2px 6px',
            cursor: 'pointer',
          }}
          title="Toggle privacy view to hide/peek secret corporate objective"
        >
          {revealed ? '👁️ Conceal' : '👁️ Peek'}
        </button>
      </div>

      {revealed ? (
        <>
          {/* Card Title & Mandate */}
          <div>
            <h4
              style={{
                margin: '0.2rem 0',
                fontSize: '0.95rem',
                color: '#fef3c7',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
              }}
            >
              {objective.title}
            </h4>
            <div style={{ fontSize: '0.68rem', color: '#a1a1aa', fontStyle: 'italic' }}>
              Corporate Audit Metric Directive
            </div>
          </div>

          {/* Secret Objective Art Frame */}
          {objective.art_spec?.asset_path && (
            <div
              style={{
                width: '100%',
                height: '75px',
                borderRadius: '5px',
                overflow: 'hidden',
                background: 'radial-gradient(circle, #1e293b 0%, #09090b 100%)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
              }}
            >
              <img
                src={objective.art_spec.asset_path}
                alt={objective.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLElement).parentElement!.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Target Metric Box */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '0.6rem',
              fontSize: '0.74rem',
              color: '#e4e4e7',
              lineHeight: 1.45,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: '#fbbf24',
                marginBottom: '0.2rem',
                textTransform: 'uppercase',
              }}
            >
              TARGET AUDIT GOAL
            </div>
            <SemanticText text={targetMetric} />
          </div>

          {/* Tiered VP Payouts */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.35rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                padding: '0.35rem 0.2rem',
                borderRadius: '5px',
                background: 'rgba(234, 179, 8, 0.12)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.58rem', color: '#fbbf24', fontWeight: 700 }}>
                1ST PLACE
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fef08a' }}>
                +{scoringTiers.first_place_vp} VP
              </div>
            </div>
            <div
              style={{
                padding: '0.35rem 0.2rem',
                borderRadius: '5px',
                background: 'rgba(148, 163, 184, 0.12)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.58rem', color: '#cbd5e1', fontWeight: 700 }}>
                2ND PLACE
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f1f5f9' }}>
                +{scoringTiers.second_place_vp} VP
              </div>
            </div>
            <div
              style={{
                padding: '0.35rem 0.2rem',
                borderRadius: '5px',
                background: 'rgba(180, 83, 9, 0.12)',
                border: '1px solid rgba(180, 83, 9, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.58rem', color: '#fdba74', fontWeight: 700 }}>
                3RD PLACE
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fed7aa' }}>
                +{scoringTiers.third_place_vp} VP
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Concealed / Classified View */
        <div
          style={{
            padding: '1.5rem 0.8rem',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '6px',
            border: '1px dashed rgba(245, 158, 11, 0.25)',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🔒</div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#f59e0b',
              letterSpacing: '0.08em',
            }}
          >
            CLASSIFIED CORPORATE MANDATE
          </div>
          <div style={{ fontSize: '0.66rem', color: '#71717a', marginTop: '0.3rem' }}>
            Click &ldquo;Peek&rdquo; above to inspect your secret endgame objective.
          </div>
        </div>
      )}

      {/* Select / Keep Button (Used in Setup Draft) */}
      {showSelectButton && onSelect && (
        <button
          type="button"
          onClick={onSelect}
          className="tabletop-btn"
          style={{
            width: '100%',
            padding: '0.45rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            background: isSelected ? '#f59e0b' : 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #f59e0b',
            color: isSelected ? '#18181b' : '#fbbf24',
          }}
        >
          {isSelected ? '✓ Objective Selected & Kept' : 'Keep This Secret Objective'}
        </button>
      )}
    </div>
  );
}
