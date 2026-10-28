import React from 'react';
import { GameComponent } from '../../components/ComponentCard';
import { FocusBadge, SemanticText } from '../../components/SemanticText';

export interface FactionPerksConsoleProps {
  perks: GameComponent[];
  unlockedPerkIds: string[];
  activePlayerIndex: number;
  activePlayerName: string;
  activePlayerCredits: number;
  activePlayerPip: number;
  onUnlockPerk: (perkId: string, costCr: number, costPip: number) => void;
}

export function FactionPerksConsole({
  perks,
  unlockedPerkIds,
  activePlayerIndex,
  activePlayerName,
  activePlayerCredits,
  activePlayerPip,
  onUnlockPerk,
}: FactionPerksConsoleProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          padding: '0.65rem 0.85rem',
          borderRadius: '8px',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              color: '#c084fc',
              letterSpacing: '0.05em',
            }}
          >
            STEP 7 // BOARDROOM DOCTRINES & FACTION PERKS
          </span>
          <h4 style={{ margin: '0.15rem 0', fontSize: '1rem', color: '#f8fafc' }}>
            Executive Perks & Tactical Doctrines
          </h4>
        </div>
        <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
          Active Executive: <strong style={{ color: '#c084fc' }}>{activePlayerName}</strong> • Vault:{' '}
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>{activePlayerCredits} CR</span> /{' '}
          <span style={{ color: '#c084fc', fontWeight: 700 }}>{activePlayerPip} PIP</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '0.85rem',
        }}
      >
        {perks.map((p) => {
          const isUnlocked = unlockedPerkIds.includes(p.id);
          const costCr = p.cost?.credits || 3;
          const costPip = p.cost?.pip || 1;
          const canAfford = activePlayerCredits >= costCr || activePlayerPip >= costPip;
          const primaryFocus = p.focus_affinity?.primary;

          return (
            <div
              key={p.id}
              style={{
                background: isUnlocked
                  ? 'linear-gradient(180deg, #2e1065 0%, #0f172a 100%)'
                  : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                border: isUnlocked
                  ? '1px solid #a855f7'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      color: '#c084fc',
                      textTransform: 'uppercase',
                    }}
                  >
                    DOCTRINE • TIER {p.tier || 3}
                  </span>
                  <h4 style={{ margin: '0.15rem 0', fontSize: '0.9rem', color: '#f8fafc' }}>
                    {p.title}
                  </h4>
                </div>
                {primaryFocus && <FocusBadge focus={primaryFocus} />}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.45, flex: 1 }}>
                <SemanticText text={p.rules_text || p.body || ''} />
              </div>

              {isUnlocked ? (
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
                  ✓ Unlocked & Active
                </div>
              ) : (
                <button
                  type="button"
                  className="tabletop-btn tabletop-btn-primary"
                  disabled={!canAfford}
                  onClick={() => onUnlockPerk(p.id, costCr, costPip)}
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.74rem' }}
                >
                  Unlock Doctrine ([{costCr} CR] or [{costPip} PIP])
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
