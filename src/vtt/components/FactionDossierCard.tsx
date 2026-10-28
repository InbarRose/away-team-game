import React from 'react';
import { GameComponent } from '../../components/ComponentCard';
import { SemanticText } from '../../components/SemanticText';

export interface FactionDossierCardProps {
  faction: GameComponent;
  isClaimed?: boolean;
  claimedByPlayerName?: string;
  onClaim?: () => void;
  canClaim?: boolean;
  isSelected?: boolean;
}

export function FactionDossierCard({
  faction,
  isClaimed = false,
  claimedByPlayerName,
  onClaim,
  canClaim = true,
  isSelected = false,
}: FactionDossierCardProps) {
  const assets = faction.starting_assets || { credits: 4, effort: 1, pip: 1 };
  const basePower = faction.base_power;
  const loyaltyTiers = faction.loyalty_tiers || {};
  const colorHex = faction.color_hex || '#38bdf8';
  const artSpec = faction.art_spec;

  return (
    <div
      className={`card-faction-sheet ${isClaimed ? 'claimed' : ''} ${
        !canClaim && !isClaimed ? 'disabled' : ''
      }`}
      style={{
        borderLeft: `4px solid ${colorHex}`,
      }}
    >
      {/* Header: Title & Insignia */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: colorHex,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            FACTION DOSSIER • {faction.category?.replace(/_/g, ' ') || 'SYNDICATE'}
          </div>
          <h3 style={{ margin: '0.2rem 0', fontSize: '1.15rem', color: '#f8fafc' }}>
            {faction.title}
          </h3>
        </div>
        {isClaimed && (
          <span
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.18)',
              border: '1px solid #38bdf8',
              fontSize: '0.72rem',
              color: '#38bdf8',
              fontWeight: 700,
            }}
          >
            Claimed by {claimedByPlayerName || 'Player'}
          </span>
        )}
      </div>

      {/* Visual Seal / Insignia Placeholder */}
      <div
        className="card-art-placeholder"
        style={{ height: '70px', background: `radial-gradient(circle at 50% 50%, ${colorHex}22 0%, #0d131f 100%)` }}
        title={artSpec?.visual_description || faction.title}
      >
        <span style={{ fontSize: '1.5rem' }}>🏛️</span>
        <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>
          {faction.title} Official Corporate Seal
        </span>
      </div>

      {/* Strategic Identity & Starting Vault Assets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem', textAlign: 'center' }}>
        <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.62rem', color: '#f59e0b', fontWeight: 700 }}>STARTING CREDITS</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fbbf24' }}>
            {assets.credits} CR
          </div>
        </div>
        <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 700 }}>STARTING EFFORT</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8' }}>
            {assets.effort} EF
          </div>
        </div>
        <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.62rem', color: '#c084fc', fontWeight: 700 }}>STARTING INFLUENCE</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#c084fc' }}>
            {assets.pip} PIP
          </div>
        </div>
      </div>

      {/* Base Faction Doctrine / Power */}
      {basePower && (
        <div
          style={{
            padding: '0.65rem 0.8rem',
            borderRadius: '6px',
            background: 'rgba(15, 23, 42, 0.55)',
            border: `1px solid ${colorHex}44`,
            fontSize: '0.78rem',
          }}
        >
          <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.2rem' }}>
            ⚡ Base Power: {basePower.name}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.74rem', lineHeight: 1.45 }}>
            <SemanticText text={basePower.effect} />
          </div>
        </div>
      )}

      {/* 4-Tier Loyalty Progression Tree Preview */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
          FACTION LOYALTY PROGRESSION TREE (4 TIERS)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.72rem' }}>
          {Object.entries(loyaltyTiers).map(([tierKey, t]: [string, any]) => (
            <div
              key={tierKey}
              style={{
                display: 'flex',
                gap: '0.45rem',
                alignItems: 'flex-start',
                padding: '0.3rem 0.45rem',
                borderRadius: '4px',
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <span style={{ color: '#fbbf24', fontWeight: 700, minWidth: '45px' }}>
                [{t.loyalty_required} LOY]
              </span>
              <div>
                <strong style={{ color: '#e2e8f0' }}>{t.title}:</strong>{' '}
                <span style={{ color: '#94a3b8' }}>{t.effect}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Claim Button */}
      {onClaim && (
        <button
          type="button"
          className="tabletop-btn tabletop-btn-primary"
          disabled={!canClaim || isClaimed}
          onClick={onClaim}
          style={{ width: '100%', padding: '0.6rem', fontWeight: 700 }}
        >
          {isClaimed
            ? `Claimed by ${claimedByPlayerName || 'Another Player'}`
            : `Claim ${faction.title} for Your Seat`}
        </button>
      )}
    </div>
  );
}
