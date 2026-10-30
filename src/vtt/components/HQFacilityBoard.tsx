import React from 'react';
import { GameComponent } from '../../components/ComponentCard';
import { SemanticText } from '../../components/SemanticText';

export interface FacilitySponsorshipRecord {
  sponsoredByPlayer: number;
  facilityId: string;
  moduleName: string;
  costCr: number;
  pipReward: number;
  vpReward: number;
}

export interface HQFacilityBoardProps {
  facilities: GameComponent[];
  sponsorships: Record<string, FacilitySponsorshipRecord>;
  activePlayerIndex: number;
  activePlayerName: string;
  activePlayerCredits: number;
  activePlayerPip: number;
  onSponsor: (facilityId: string, moduleName: string, costCr: number, pipReward: number, vpReward: number) => void;
  playerNames: Record<number, string>;
  factionNames: Record<number, string>;
}

export function HQFacilityBoard({
  facilities,
  sponsorships,
  activePlayerIndex,
  activePlayerName,
  activePlayerCredits,
  activePlayerPip,
  onSponsor,
  playerNames,
  factionNames,
}: HQFacilityBoardProps) {
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
              color: '#38bdf8',
              letterSpacing: '0.05em',
            }}
          >
            STEP 4 // CORPORATE SPONSORSHIP OF BASE FACILITIES
          </span>
          <h4 style={{ margin: '0.15rem 0', fontSize: '1rem', color: '#f8fafc' }}>
            Headquarters Facility Network & Landmark Modules
          </h4>
        </div>
        <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
          Acting Sponsor:{' '}
          <strong style={{ color: '#38bdf8' }}>
            {activePlayerName} ({factionNames[activePlayerIndex] || 'Faction'})
          </strong>{' '}
          • Vault:{' '}
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>{activePlayerCredits} CR</span> /{' '}
          <span style={{ color: '#c084fc', fontWeight: 700 }}>{activePlayerPip} PIP</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '0.85rem',
        }}
      >
        {facilities.map((fac) => {
          const sponsorship = sponsorships[fac.id];
          const isSponsored = !!sponsorship;
          const costCr = fac.cost?.credits || 4;
          const costPip = fac.cost?.pip || 0;
          const pipReward = fac.component_type === 'hq_landmark' ? 2 : 1;
          const vpReward = pipReward * 2;
          const canAfford = activePlayerCredits >= costCr && activePlayerPip >= costPip;

          const sponsorPlayerIdx = sponsorship ? sponsorship.sponsoredByPlayer : null;
          const sponsorFactionName =
            sponsorPlayerIdx !== null ? factionNames[sponsorPlayerIdx] || `Player ${sponsorPlayerIdx + 1}` : '';

          return (
            <div
              key={fac.id}
              style={{
                background: isSponsored
                  ? 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)'
                  : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                border: isSponsored
                  ? '1px solid rgba(168, 85, 247, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
              }}
            >
              {/* Header: Title & Category */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      color: fac.component_type === 'hq_landmark' ? '#f59e0b' : '#38bdf8',
                      textTransform: 'uppercase',
                    }}
                  >
                    {fac.component_type === 'hq_landmark' ? '⭐ LANDMARK MODULE' : 'BASE FACILITY'} • TIER {fac.tier || 1}
                  </span>
                  <h4 style={{ margin: '0.15rem 0', fontSize: '0.92rem', color: '#f8fafc' }}>
                    {fac.title}
                  </h4>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(234, 179, 8, 0.15)',
                    border: '1px solid #eab308',
                    color: '#fbbf24',
                  }}
                >
                  {costCr} CR {costPip > 0 ? `+ ${costPip} PIP` : ''}
                </span>
              </div>

              {/* Facility Artwork Frame */}
              {fac.art_spec?.asset_path && (
                <div
                  style={{
                    width: '100%',
                    height: '75px',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    background: 'radial-gradient(circle, #1e293b 0%, #0f172a 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <img
                    src={fac.art_spec.asset_path}
                    alt={fac.title}
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

              {/* Rules / Effects */}
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.45, flex: 1 }}>
                <SemanticText text={fac.rules_text || fac.body || ''} />
              </div>

              {/* Sponsorship Status & Action Button */}
              {isSponsored ? (
                <div
                  style={{
                    padding: '0.45rem',
                    borderRadius: '5px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid #9333ea',
                    color: '#d8b4fe',
                    fontSize: '0.72rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                  }}
                >
                  <span>🏛️ SPONSORED:</span>
                  <span>{sponsorFactionName}</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="tabletop-btn tabletop-btn-primary"
                  disabled={!canAfford}
                  onClick={() => onSponsor(fac.id, fac.title, costCr, pipReward, vpReward)}
                  style={{
                    width: '100%',
                    padding: '0.45rem',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                  title={
                    canAfford
                      ? `Spend [${costCr} CR] to sponsor this module and gain [+${pipReward} PIP] / [+${vpReward} VP]`
                      : `Insufficient Funds: Needs [${costCr} CR] and [${costPip} PIP]`
                  }
                >
                  {canAfford
                    ? `Sponsor Facility ([${costCr} CR] ➔ +${pipReward} PIP, +${vpReward} VP)`
                    : `Needs [${costCr} CR]`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
