import React from 'react';

export interface TactileDiceTrayProps {
  rolledDice: {
    dieValue: number;
    threshold: number;
    isHit: boolean;
    isBackfire: boolean;
    operativeName: string;
  }[];
  targetDifficulty: number;
  totalHits: number;
  totalBackfires: number;
  phaseLabel: string;
}

export function TactileDiceTray({
  rolledDice,
  targetDifficulty,
  totalHits,
  totalBackfires,
  phaseLabel,
}: TactileDiceTrayProps) {
  const isCleared = totalHits >= targetDifficulty;

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #131d2e 0%, #0c121d 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '10px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🎲</span>
          <strong style={{ fontSize: '0.92rem', color: '#f8fafc' }}>
            Tactical Dice Tray — {phaseLabel}
          </strong>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.8rem' }}>
          <span>
            Hits Rolled:{' '}
            <strong style={{ color: isCleared ? '#34d399' : '#fbbf24', fontSize: '1.05rem' }}>
              {totalHits} / {targetDifficulty} D
            </strong>
          </span>
          {totalBackfires > 0 && (
            <span style={{ color: '#f87171' }}>
              ⚠️ Backfires: <strong>{totalBackfires} Wounds</strong>
            </span>
          )}
        </div>
      </div>

      {/* Dice Cubes Display */}
      {rolledDice.length === 0 ? (
        <div
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            color: '#64748b',
            fontStyle: 'italic',
            fontSize: '0.82rem',
            border: '1px dashed #334155',
            borderRadius: '8px',
          }}
        >
          No dice rolled yet for this phase. Set committed dice on eligible operatives and roll initiative.
        </div>
      ) : (
        <div className="tactile-dice-tray">
          {rolledDice.map((d, idx) => (
            <div
              key={idx}
              className={`tactile-die ${d.isHit ? 'hit' : d.isBackfire ? 'backfire' : 'miss'}`}
              title={`${d.operativeName}: Rolled ${d.dieValue} (Target: ${d.threshold}+)${
                d.isBackfire ? ' — NATURAL 1 BACKFIRE WOUND!' : d.isHit ? ' — SUCCESS!' : ' — Miss'
              }`}
            >
              {d.dieValue}
            </div>
          ))}
        </div>
      )}

      {/* Outcome Banner */}
      {rolledDice.length > 0 && (
        <div
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: '6px',
            background: isCleared ? 'rgba(5, 150, 105, 0.15)' : 'rgba(234, 179, 8, 0.15)',
            border: isCleared ? '1px solid #059669' : '1px solid #eab308',
            fontSize: '0.76rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: isCleared ? '#a7f3d0' : '#fef08a' }}>
            {isCleared
              ? `✓ Target Difficulty D=${targetDifficulty} MET! (${totalHits} Successes)`
              : `Pending: Need ${targetDifficulty - totalHits} more Success(es) to clear the stage.`}
          </span>
          {isCleared && totalHits >= targetDifficulty + 2 && (
            <span style={{ color: '#34d399', fontWeight: 700 }}>
              ⚡ Operational Momentum Earned (+{totalHits - targetDifficulty - 1} [MOM])
            </span>
          )}
        </div>
      )}
    </div>
  );
}
