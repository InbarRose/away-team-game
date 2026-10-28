import React from 'react';
import { GameComponent } from '../../components/ComponentCard';
import { SemanticText } from '../../components/SemanticText';

export interface ArmoryItemCardProps {
  item: GameComponent;
  onPurchase?: () => void;
  canPurchase?: boolean;
  playerCredits?: number;
  onEquip?: () => void;
  canEquip?: boolean;
  isEquipped?: boolean;
}

export function ArmoryItemCard({
  item,
  onPurchase,
  canPurchase = true,
  playerCredits = 0,
  onEquip,
  canEquip = true,
  isEquipped = false,
}: ArmoryItemCardProps) {
  const costCr = item.cost?.credits || 0;
  const slots = item.stats?.slots_required || [];
  const armorBuffer = item.stats?.armor_buffer || 0;
  const bridges = item.focus_affinity?.bridges || [];

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #1e293b 0%, #111827 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '8px',
        padding: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Header: Title & Credit Cost */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: '#94a3b8',
              textTransform: 'uppercase',
            }}
          >
            ARMORY • TIER {item.tier || 1}
          </span>
          <h4 style={{ margin: '0.15rem 0', fontSize: '0.88rem', color: '#f8fafc' }}>
            {item.title}
          </h4>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid #eab308',
            color: '#fbbf24',
          }}
        >
          {costCr} CR
        </span>
      </div>

      {/* Anatomical Slot & Focus Bridge Badges */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {slots.map((s) => (
          <span
            key={s}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              padding: '1px 5px',
              borderRadius: '3px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
            }}
          >
            [{s}]
          </span>
        ))}
        {armorBuffer > 0 && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              padding: '1px 5px',
              borderRadius: '3px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #0284c7',
              color: '#7dd3fc',
            }}
          >
            +{armorBuffer} Armor Soak
          </span>
        )}
        {bridges.map((b) => (
          <span
            key={b}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              padding: '1px 5px',
              borderRadius: '3px',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid #9333ea',
              color: '#d8b4fe',
            }}
          >
            Bridge: [{b}] (4+)
          </span>
        ))}
      </div>

      {/* Rules / Effect Text */}
      <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.45, flex: 1 }}>
        <SemanticText text={item.rules_text || item.body || ''} />
      </div>

      {/* Action Button: Purchase or Equip */}
      {onPurchase && (
        <button
          type="button"
          className="tabletop-btn tabletop-btn-primary"
          disabled={!canPurchase || playerCredits < costCr}
          onClick={onPurchase}
          style={{ width: '100%', padding: '0.35rem', fontSize: '0.74rem' }}
          title={
            playerCredits >= costCr
              ? `Spend [${costCr} CR] to purchase ${item.title}`
              : `Insufficient Credits: You have [${playerCredits} CR], costs [${costCr} CR]`
          }
        >
          {playerCredits >= costCr ? `Buy for [${costCr} CR]` : `Needs [${costCr} CR]`}
        </button>
      )}

      {onEquip && (
        <button
          type="button"
          className="tabletop-btn tabletop-btn-success"
          disabled={!canEquip || isEquipped}
          onClick={onEquip}
          style={{ width: '100%', padding: '0.35rem', fontSize: '0.74rem' }}
        >
          {isEquipped ? 'Equipped' : 'Equip Gear'}
        </button>
      )}
    </div>
  );
}
