import React from 'react';
import { GameComponent } from '../../components/ComponentCard';
import { FocusBadge, SemanticText } from '../../components/SemanticText';

export interface AgendaCardProps {
  agenda: GameComponent;
  onClaim?: () => void;
  canClaim?: boolean;
  claimedByPlayerName?: string | null;
  activeDirectorName?: string;
}

export function AgendaCard({
  agenda,
  onClaim,
  canClaim = true,
  claimedByPlayerName = null,
  activeDirectorName,
}: AgendaCardProps) {
  const payout = (agenda as any).payout || { vp: 2, credits: 1, pip: 0 };
  const primaryFocus = agenda.focus_affinity?.primary;

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        border: claimedByPlayerName
          ? '1px solid rgba(34, 197, 94, 0.4)'
          : '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '8px',
        padding: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        minWidth: '240px',
      }}
    >
      {/* Header: Type, Focus & Payout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: '#38bdf8',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            OPEN CORPORATE AGENDA
          </span>
          <h4 style={{ margin: '0.15rem 0', fontSize: '0.9rem', color: '#f8fafc' }}>
            {agenda.title}
          </h4>
        </div>
        {primaryFocus && <FocusBadge focus={primaryFocus} />}
      </div>

      {/* Payout Badges */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {payout.vp > 0 && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid #eab308',
              color: '#facc15',
            }}
          >
            +{payout.vp} VP
          </span>
        )}
        {payout.credits > 0 && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid #fbbf24',
              color: '#fde047',
            }}
          >
            +{payout.credits} CR
          </span>
        )}
        {payout.pip > 0 && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '4px',
              background: 'rgba(192, 132, 252, 0.15)',
              border: '1px solid #c084fc',
              color: '#e9d5ff',
            }}
          >
            +{payout.pip} PIP
          </span>
        )}
      </div>

      {/* Condition / Rules Body */}
      <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.45, flex: 1 }}>
        <SemanticText text={agenda.rules_text || agenda.body || ''} />
      </div>

      {/* Claim / Completion Status */}
      {claimedByPlayerName ? (
        <div
          style={{
            padding: '0.35rem',
            borderRadius: '4px',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22c55e',
            color: '#86efac',
            fontSize: '0.7rem',
            textAlign: 'center',
            fontWeight: 700,
          }}
        >
          ✓ Claimed by {claimedByPlayerName}
        </div>
      ) : onClaim ? (
        <button
          type="button"
          onClick={onClaim}
          disabled={!canClaim}
          className="tabletop-btn tabletop-btn-success"
          style={{ width: '100%', padding: '0.35rem', fontSize: '0.74rem' }}
          title={`Claim bounty for active Director (${activeDirectorName || 'Current Player'})`}
        >
          Claim Bounty ({activeDirectorName || 'Director'}) ▶
        </button>
      ) : null}
    </div>
  );
}
