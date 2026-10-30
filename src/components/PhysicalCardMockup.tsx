import React, { useState } from 'react';
import { GameComponent } from './ComponentCard';
import { FocusBadge, SemanticText } from './SemanticText';

export type CardViewMode = 'realistic' | 'proofing' | 'back';

export interface PhysicalCardMockupProps {
  item: GameComponent;
  initialMode?: CardViewMode;
  showControls?: boolean;
  scale?: number;
  onClose?: () => void;
}

export function PhysicalCardMockup({
  item,
  initialMode = 'realistic',
  showControls = true,
  scale = 1,
  onClose,
}: PhysicalCardMockupProps) {
  const [mode, setMode] = useState<CardViewMode>(initialMode);
  const [zoom, setZoom] = useState<number>(scale);
  const [artLoaded, setArtLoaded] = useState<boolean>(false);
  const [artError, setArtError] = useState<boolean>(false);
  const [copiedSvg, setCopiedSvg] = useState<boolean>(false);

  // Aspect ratio determination: Tarot (70:120) vs Poker (63:88)
  const isTarot =
    item.art_spec?.aspect_ratio === '70:120' ||
    ['character', 'campaign', 'mission'].includes(item.component_type);

  // Card dimensions in pixels (base 1mm = 5px)
  // Poker: 63mm x 88mm -> 315px x 440px
  // Tarot: 70mm x 120mm -> 350px x 600px
  const cardWidthMm = isTarot ? 70 : 63;
  const cardHeightMm = isTarot ? 120 : 88;
  const bleedMm = 3; // 3mm standard industrial printing bleed
  const safeMarginMm = 3; // 3mm safe cut margin

  const baseWidthPx = cardWidthMm * 5;
  const baseHeightPx = cardHeightMm * 5;
  const bleedPx = bleedMm * 5; // 15px

  // Text density calculation
  const rulesText = item.rules_text || item.body || '';
  const charCount = rulesText.length;
  const wordCount = rulesText.trim().split(/\s+/).filter(Boolean).length;
  const maxCharsBudget = isTarot ? 260 : 180;
  const isTextOverflow = charCount > maxCharsBudget;
  const isTextDense = charCount > maxCharsBudget * 0.8 && !isTextOverflow;

  // Colors & Faction styling
  const accentColor = item.color_hex || (item.focus_affinity?.primary ? getFocusColor(item.focus_affinity.primary) : '#38bdf8');

  const cr = item.cost?.credits ?? 0;
  const ef = item.cost?.effort ?? 0;
  const pip = item.cost?.pip ?? 0;

  // Generate downloadable/copyable standalone SVG representation
  const handleExportSvg = () => {
    const svgMarkup = generateCardSvg(item, isTarot, accentColor, mode === 'proofing');
    navigator.clipboard?.writeText(svgMarkup);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  return (
    <div className="physical-mockup-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
      {/* Proofing Toolbar & Inspection Controls */}
      {showControls && (
        <div
          className="mockup-toolbar"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '680px',
            padding: '0.6rem 0.85rem',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            gap: '0.6rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Mode Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              className={`tabletop-btn ${mode === 'realistic' ? 'tabletop-btn-primary' : ''}`}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.74rem' }}
              onClick={() => setMode('realistic')}
            >
              🎴 Real Card Finish
            </button>
            <button
              type="button"
              className={`tabletop-btn ${mode === 'proofing' ? 'tabletop-btn-primary' : ''}`}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.74rem' }}
              onClick={() => setMode('proofing')}
            >
              📐 Print Proof (Bleed & Cut)
            </button>
            <button
              type="button"
              className={`tabletop-btn ${mode === 'back' ? 'tabletop-btn-primary' : ''}`}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.74rem' }}
              onClick={() => setMode('back')}
            >
              🔄 Card Back
            </button>
          </div>

          {/* Scale & Export Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button
                type="button"
                className="tabletop-btn"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.1).toFixed(1)))}
                title="Zoom Out"
              >
                −
              </button>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', minWidth: '38px', textAlign: 'center', color: '#cbd5e1' }}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                className="tabletop-btn"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(1)))}
                title="Zoom In"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="tabletop-btn"
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem', color: copiedSvg ? '#34d399' : '#cbd5e1' }}
              onClick={handleExportSvg}
              title="Copy standalone vector SVG markup for Illustrator / InDesign"
            >
              {copiedSvg ? '✓ SVG COPIED' : '📋 EXPORT SVG'}
            </button>

            {onClose && (
              <button
                type="button"
                className="tabletop-btn"
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem', color: '#f87171' }}
                onClick={onClose}
              >
                ✕ Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Proofing Inspector Banner (Text Budget & Geometry Metrics) */}
      {mode === 'proofing' && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '680px',
            padding: '0.5rem 0.85rem',
            background: 'rgba(30, 41, 59, 0.75)',
            borderLeft: `3px solid ${isTextOverflow ? '#ef4444' : isTextDense ? '#f59e0b' : '#10b981'}`,
            borderRadius: '6px',
            fontSize: '0.74rem',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <span>
              📐 <strong>Trim Size:</strong> {cardWidthMm} × {cardHeightMm} mm ({isTarot ? 'Tarot' : 'Poker'})
            </span>
            <span>
              ✂️ <strong>Bleed:</strong> +{bleedMm}mm ({cardWidthMm + bleedMm * 2} × {cardHeightMm + bleedMm * 2} mm)
            </span>
            <span>
              🛡️ <strong>Safe Zone:</strong> -{safeMarginMm}mm inner
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              Copy: <strong>{charCount}</strong> chars ({wordCount} words)
            </span>
            <span
              style={{
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '0.68rem',
                background: isTextOverflow ? 'rgba(239, 68, 68, 0.2)' : isTextDense ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: isTextOverflow ? '#fca5a5' : isTextDense ? '#fcd34d' : '#6ee7b7',
                border: `1px solid ${isTextOverflow ? '#ef4444' : isTextDense ? '#f59e0b' : '#10b981'}`,
              }}
            >
              {isTextOverflow ? '⚠️ DENSE / OVERFLOW' : isTextDense ? '⚠️ NEAR LIMIT' : '✓ OPTIMAL READABILITY'}
            </span>
          </div>
        </div>
      )}

      {/* The Physical Card Stage */}
      <div
        className="physical-card-stage"
        style={{
          padding: mode === 'proofing' ? `${bleedPx * zoom}px` : '1.5rem',
          background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #090d16 100%)',
          borderRadius: '12px',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 8px 30px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Bleed Guide Markers when in Proofing Mode */}
        {mode === 'proofing' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              border: '1px dashed rgba(239, 68, 68, 0.5)',
              borderRadius: '8px',
            }}
          >
            {/* Bleed Label */}
            <span
              style={{
                position: 'absolute',
                top: 4,
                left: 8,
                fontSize: '0.6rem',
                fontFamily: 'var(--font-mono)',
                color: '#f87171',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              RED LINE = 3mm INDUSTRIAL BLEED ({cardWidthMm + bleedMm * 2} × {cardHeightMm + bleedMm * 2} mm)
            </span>

            {/* Corner Crop Marks */}
            <div style={{ position: 'absolute', top: bleedPx * zoom - 1, left: 0, width: bleedPx * zoom, borderTop: '1px solid #f87171' }} />
            <div style={{ position: 'absolute', top: 0, left: bleedPx * zoom - 1, height: bleedPx * zoom, borderLeft: '1px solid #f87171' }} />
            <div style={{ position: 'absolute', top: bleedPx * zoom - 1, right: 0, width: bleedPx * zoom, borderTop: '1px solid #f87171' }} />
            <div style={{ position: 'absolute', top: 0, right: bleedPx * zoom - 1, height: bleedPx * zoom, borderRight: '1px solid #f87171' }} />
            <div style={{ position: 'absolute', bottom: bleedPx * zoom - 1, left: 0, width: bleedPx * zoom, borderBottom: '1px solid #f87171' }} />
            <div style={{ position: 'absolute', bottom: 0, left: bleedPx * zoom - 1, height: bleedPx * zoom, borderLeft: '1px solid #f87171' }} />
            <div style={{ position: 'absolute', bottom: bleedPx * zoom - 1, right: 0, width: bleedPx * zoom, borderBottom: '1px solid #f87171' }} />
            <div style={{ position: 'absolute', bottom: 0, right: bleedPx * zoom - 1, height: bleedPx * zoom, borderRight: '1px solid #f87171' }} />
          </div>
        )}

        {/* ============================================================== */}
        {/* CARD VIEW: BACK FACE                                          */}
        {/* ============================================================== */}
        {mode === 'back' && (
          <div
            className="card-physical-face card-back"
            style={{
              width: `${baseWidthPx * zoom}px`,
              height: `${baseHeightPx * zoom}px`,
              borderRadius: `${(isTarot ? 18 : 15) * zoom}px`,
              background: 'linear-gradient(135deg, #090d16 0%, #151d2e 50%, #080c14 100%)',
              border: `${2 * zoom}px solid #334155`,
              boxShadow: mode === 'realistic'
                ? `0 ${10 * zoom}px ${25 * zoom}px rgba(0, 0, 0, 0.7), 0 0 0 ${1 * zoom}px rgba(255, 255, 255, 0.15)`
                : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: `${1.5 * zoom}rem`,
              position: 'relative',
              overflow: 'hidden',
              userSelect: 'none',
            }}
          >
            {/* Geometric Aerospace Lattice Back Pattern */}
            <div
              style={{
                position: 'absolute',
                inset: `${10 * zoom}px`,
                border: `${1 * zoom}px solid rgba(56, 189, 248, 0.3)`,
                borderRadius: `${(isTarot ? 12 : 10) * zoom}px`,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: `${14 * zoom}px`,
                border: `${1 * zoom}px solid rgba(255, 255, 255, 0.08)`,
                borderRadius: `${(isTarot ? 10 : 8) * zoom}px`,
                pointerEvents: 'none',
              }}
            />

            {/* Central Holographic Insignia Seal */}
            <div
              style={{
                width: `${90 * zoom}px`,
                height: `${90 * zoom}px`,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(15, 23, 42, 0.8) 70%)',
                border: `${2 * zoom}px solid rgba(56, 189, 248, 0.6)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: `0 0 ${20 * zoom}px rgba(56, 189, 248, 0.3)`,
              }}
            >
              <span style={{ fontSize: `${2.2 * zoom}rem` }}>🛸</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: `${0.55 * zoom}rem`,
                  color: '#38bdf8',
                  letterSpacing: '0.12em',
                  fontWeight: 800,
                  marginTop: '0.2rem',
                }}
              >
                AWAY TEAM
              </span>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: `${18 * zoom}px`,
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: `${0.55 * zoom}rem`,
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.1em',
              }}
            >
              OFFICIAL TABLETOP DECK • 320GSM LINEN FINISH
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CARD VIEW: FRONT FACE (REALISTIC OR PROOFING)                  */}
        {/* ============================================================== */}
        {mode !== 'back' && (
          <div
            className={`card-physical-face card-front ${mode === 'proofing' ? 'proofing-mode' : ''}`}
            style={{
              width: `${baseWidthPx * zoom}px`,
              height: `${baseHeightPx * zoom}px`,
              borderRadius: `${(isTarot ? 18 : 15) * zoom}px`,
              background: 'linear-gradient(180deg, #172133 0%, #0f1624 100%)',
              border: mode === 'proofing'
                ? `${1.5 * zoom}px dashed #00e5ff`
                : `${1.5 * zoom}px solid ${accentColor}`,
              boxShadow: mode === 'realistic'
                ? `0 ${12 * zoom}px ${30 * zoom}px rgba(0, 0, 0, 0.8), 0 0 0 ${1 * zoom}px rgba(255, 255, 255, 0.18)`
                : 'none',
              display: 'flex',
              flexDirection: 'column',
              padding: `${0.75 * zoom}rem`,
              position: 'relative',
              overflow: 'hidden',
              boxSizing: 'border-box',
              color: '#f8fafc',
            }}
          >
            {/* Linen Card Stock Tactile Texture Overlay */}
            {mode === 'realistic' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.05,
                  backgroundImage:
                    'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px), repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 2px)',
                  backgroundSize: '3px 3px',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Proofing Safe Zone Boundary Marker */}
            {mode === 'proofing' && (
              <div
                style={{
                  position: 'absolute',
                  inset: `${safeMarginMm * 5 * zoom}px`,
                  border: '1px dotted rgba(52, 211, 153, 0.65)',
                  borderRadius: `${(isTarot ? 14 : 11) * zoom}px`,
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 4,
                    fontSize: `${0.55 * zoom}rem`,
                    fontFamily: 'var(--font-mono)',
                    color: '#34d399',
                  }}
                >
                  SAFE CUT MARGIN (3mm)
                </span>
              </div>
            )}

            {/* 1. Header: Classification, Title & Cost Cluster */}
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: `${1 * zoom}px solid rgba(255, 255, 255, 0.12)`,
                paddingBottom: `${0.35 * zoom}rem`,
                marginBottom: `${0.35 * zoom}rem`,
                zIndex: 2,
              }}
            >
              <div style={{ flex: 1, paddingRight: `${0.5 * zoom}rem` }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: `${0.58 * zoom}rem`,
                    color: accentColor,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontWeight: 700,
                  }}
                >
                  {item.component_type.replace(/_/g, ' ')}
                  {item.category ? ` • ${item.category.replace(/_/g, ' ')}` : ''}
                  {item.tier ? ` • Tier ${item.tier}` : ''}
                </div>
                <h3
                  style={{
                    margin: `${0.1 * zoom}rem 0 0 0`,
                    fontSize: `${(isTarot ? 1.05 : 0.95) * zoom}rem`,
                    fontWeight: 800,
                    lineHeight: 1.15,
                    color: '#f8fafc',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.title}
                </h3>
              </div>

              {/* Stamped Cost Badges */}
              <div style={{ display: 'flex', gap: `${0.25 * zoom}rem`, flexShrink: 0 }}>
                {cr > 0 && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: `${0.65 * zoom}rem`,
                      fontWeight: 800,
                      padding: `${1 * zoom}px ${5 * zoom}px`,
                      borderRadius: `${3 * zoom}px`,
                      background: 'rgba(234, 179, 8, 0.2)',
                      border: `${1 * zoom}px solid #eab308`,
                      color: '#facc15',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    }}
                  >
                    {cr} CR
                  </span>
                )}
                {ef > 0 && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: `${0.65 * zoom}rem`,
                      fontWeight: 800,
                      padding: `${1 * zoom}px ${5 * zoom}px`,
                      borderRadius: `${3 * zoom}px`,
                      background: 'rgba(0, 229, 255, 0.18)',
                      border: `${1 * zoom}px solid #00e5ff`,
                      color: '#67e8f9',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    }}
                  >
                    {ef} EF
                  </span>
                )}
                {pip > 0 && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: `${0.65 * zoom}rem`,
                      fontWeight: 800,
                      padding: `${1 * zoom}px ${5 * zoom}px`,
                      borderRadius: `${3 * zoom}px`,
                      background: 'rgba(214, 51, 132, 0.2)',
                      border: `${1 * zoom}px solid #d63384`,
                      color: '#f472b6',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    }}
                  >
                    {pip} PIP
                  </span>
                )}
              </div>
            </header>

            {/* 2. Artwork Window Frame */}
            <div
              className="card-art-window"
              style={{
                width: '100%',
                height: `${(isTarot ? 180 : 130) * zoom}px`,
                position: 'relative',
                borderRadius: `${6 * zoom}px`,
                overflow: 'hidden',
                background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0b0f17 100%)',
                border: `${1 * zoom}px solid rgba(255, 255, 255, 0.12)`,
                marginBottom: `${0.4 * zoom}rem`,
                flexShrink: 0,
              }}
            >
              {item.art_spec?.asset_path && !artError ? (
                <img
                  src={item.art_spec.asset_path}
                  alt={item.title}
                  onLoad={() => setArtLoaded(true)}
                  onError={() => setArtError(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: artLoaded ? 'block' : 'none',
                  }}
                />
              ) : null}

              {(!artLoaded || artError) && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    padding: `${0.5 * zoom}rem`,
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <span style={{ fontSize: `${1.8 * zoom}rem` }}>
                    {item.component_type === 'character' ? '👤' : item.component_type === 'item' ? '⚔️' : '📋'}
                  </span>
                  <span style={{ fontSize: `${0.58 * zoom}rem`, fontFamily: 'var(--font-mono)', marginTop: `${0.2 * zoom}rem` }}>
                    {item.art_spec?.aspect_ratio || 'CARD ART'}
                  </span>
                </div>
              )}

              {/* Inset Vignette Shadow */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.65)',
                  pointerEvents: 'none',
                }}
              />

              {/* Corner Focus Badge Overlay */}
              {item.focus_affinity?.primary && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${4 * zoom}px`,
                    right: `${4 * zoom}px`,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top right',
                    zIndex: 3,
                  }}
                >
                  <FocusBadge focus={item.focus_affinity.primary} roleLabel="1°" />
                </div>
              )}
            </div>

            {/* 3. Stats & Equipment Slot Rib */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: `${0.35 * zoom}rem`,
                flexWrap: 'wrap',
                background: 'rgba(15, 23, 42, 0.75)',
                border: `${1 * zoom}px solid rgba(255, 255, 255, 0.08)`,
                borderRadius: `${4 * zoom}px`,
                padding: `${0.2 * zoom}rem ${0.4 * zoom}rem`,
                marginBottom: `${0.4 * zoom}rem`,
                minHeight: `${22 * zoom}px`,
                zIndex: 2,
              }}
            >
              {item.focus_affinity?.secondary && (
                <FocusBadge focus={item.focus_affinity.secondary} roleLabel="2°" />
              )}

              {item.stats?.hp_cap != null && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: `${0.62 * zoom}rem`,
                    fontWeight: 700,
                    color: '#f87171',
                  }}
                >
                  ❤️ {item.stats.hp_cap} HP
                </span>
              )}

              {item.stats?.static_dice != null && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: `${0.62 * zoom}rem`,
                    fontWeight: 700,
                    color: '#38bdf8',
                  }}
                >
                  🎲 {item.stats.static_dice} d6
                </span>
              )}

              {item.stats?.armor_buffer != null && item.stats.armor_buffer > 0 && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: `${0.62 * zoom}rem`,
                    fontWeight: 700,
                    color: '#a78bfa',
                  }}
                >
                  🛡️ +{item.stats.armor_buffer} Armor
                </span>
              )}

              {item.stats?.slots_required && item.stats.slots_required.length > 0 && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: `${0.58 * zoom}rem`,
                    color: '#cbd5e1',
                  }}
                >
                  {item.stats.slots_required.map((s) => `[${s}]`).join('+')}
                </span>
              )}

              {item.focus_affinity?.bridges && item.focus_affinity.bridges.length > 0 && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: `${0.58 * zoom}rem`,
                    color: '#d8b4fe',
                  }}
                >
                  Bridge: {item.focus_affinity.bridges.join(', ')}
                </span>
              )}

              {item.stats?.es_budget != null && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: `${0.58 * zoom}rem`,
                    color: '#f59e0b',
                    marginLeft: 'auto',
                  }}
                >
                  ⚡ {item.stats.es_budget} ES
                </span>
              )}
            </div>

            {/* 4. Structured Rules Text Panel (Tactile Inset) */}
            <div
              className="card-rules-box"
              style={{
                flex: 1,
                background: 'rgba(2, 6, 23, 0.65)',
                border: `${1 * zoom}px solid rgba(255, 255, 255, 0.08)`,
                borderRadius: `${5 * zoom}px`,
                padding: `${0.45 * zoom}rem ${0.55 * zoom}rem`,
                overflowY: 'auto',
                fontSize: `${(isTarot ? 0.72 : 0.68) * zoom}rem`,
                lineHeight: 1.4,
                color: '#e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                zIndex: 2,
              }}
            >
              <div>
                <SemanticText text={rulesText} />
              </div>

              {/* Art Visual Flavor Description Snippet */}
              {item.art_spec?.visual_description && (
                <div
                  style={{
                    marginTop: `${0.4 * zoom}rem`,
                    paddingTop: `${0.25 * zoom}rem`,
                    borderTop: `${1 * zoom}px solid rgba(255, 255, 255, 0.06)`,
                    fontStyle: 'italic',
                    fontSize: `${0.58 * zoom}rem`,
                    color: '#94a3b8',
                    lineHeight: 1.3,
                  }}
                >
                  “{item.art_spec.visual_description}”
                </div>
              )}
            </div>

            {/* 5. Collector's Imprint Footer */}
            <footer
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: `${0.35 * zoom}rem`,
                paddingTop: `${0.2 * zoom}rem`,
                borderTop: `${1 * zoom}px solid rgba(255, 255, 255, 0.08)`,
                fontSize: `${0.52 * zoom}rem`,
                fontFamily: 'var(--font-mono)',
                color: '#64748b',
                letterSpacing: '0.04em',
                zIndex: 2,
              }}
            >
              <span>AWAY TEAM • SET-01</span>
              <span>{item.id}</span>
              <span>
                {item.deck_copies ? `×${item.deck_copies} DECK` : 'UNIQUE'} • 300GSM
              </span>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Generates standalone SVG code representing the printed card
 */
function generateCardSvg(
  item: GameComponent,
  isTarot: boolean,
  accentColor: string,
  isProofing: boolean
): string {
  const width = isTarot ? 350 : 315;
  const height = isTarot ? 600 : 440;
  const bleed = 15;
  const totalW = isProofing ? width + bleed * 2 : width;
  const totalH = isProofing ? height + bleed * 2 : height;
  const xOffset = isProofing ? bleed : 0;
  const yOffset = isProofing ? bleed : 0;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}px" height="${totalH}px">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#172133" />
      <stop offset="100%" stop-color="#0f1624" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.5"/>
    </filter>
  </defs>

  ${isProofing ? `
  <!-- Bleed Boundary (3mm) -->
  <rect x="0" y="0" width="${totalW}" height="${totalH}" fill="#0b0f17" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="8" y="12" fill="#ef4444" font-family="monospace" font-size="9">3mm INDUSTRIAL BLEED</text>
  ` : ''}

  <!-- Card Die-Cut Perimeter -->
  <rect x="${xOffset}" y="${yOffset}" width="${width}" height="${height}" rx="${isTarot ? 18 : 15}" fill="url(#bgGrad)" stroke="${accentColor}" stroke-width="2" filter="${isProofing ? 'none' : 'url(#cardShadow)'}"/>

  <!-- Card Header -->
  <text x="${xOffset + 14}" y="${yOffset + 24}" fill="${accentColor}" font-family="monospace" font-size="9" font-weight="bold" letter-spacing="1">
    ${escapeXml(item.component_type.replace(/_/g, ' ').toUpperCase())}
  </text>
  <text x="${xOffset + 14}" y="${yOffset + 42}" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold">
    ${escapeXml(item.title)}
  </text>

  <!-- Art Box Placeholder -->
  <rect x="${xOffset + 14}" y="${yOffset + 54}" width="${width - 28}" height="${isTarot ? 180 : 130}" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="${xOffset + width / 2}" y="${yOffset + 54 + (isTarot ? 90 : 65)}" fill="#64748b" font-family="monospace" font-size="10" text-anchor="middle">
    [ART SPEC: ${escapeXml(item.art_spec?.aspect_ratio || '63:88')}]
  </text>

  <!-- Rules Panel -->
  <rect x="${xOffset + 14}" y="${yOffset + (isTarot ? 270 : 210)}" width="${width - 28}" height="${isTarot ? 270 : 180}" rx="6" fill="#020617" stroke="#1e293b" stroke-width="1"/>
  <text x="${xOffset + 22}" y="${yOffset + (isTarot ? 295 : 235)}" fill="#e2e8f0" font-family="sans-serif" font-size="11">
    ${escapeXml((item.rules_text || '').slice(0, 80))}...
  </text>

  <!-- Collector Footer -->
  <text x="${xOffset + 14}" y="${yOffset + height - 12}" fill="#475569" font-family="monospace" font-size="8">AWAY TEAM • SET-01</text>
  <text x="${xOffset + width - 14}" y="${yOffset + height - 12}" fill="#475569" font-family="monospace" font-size="8" text-anchor="end">${escapeXml(item.id)}</text>
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getFocusColor(focus: string): string {
  switch (focus.toLowerCase()) {
    case 'combat':
      return '#e03e3e';
    case 'infiltrate':
      return '#9b51e0';
    case 'intel':
      return '#00a3ff';
    case 'operations':
      return '#f2994a';
    case 'negotiate':
      return '#f2c94c';
    case 'survival':
      return '#219653';
    default:
      return '#38bdf8';
  }
}

/**
 * Reusable modal wrapper allowing any part of the site to view a physical card mockup
 */
export function PhysicalCardModal({
  item,
  onClose,
}: {
  item: GameComponent | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <div
      className="physical-card-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          maxWidth: '750px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <PhysicalCardMockup item={item} onClose={onClose} />
      </div>
    </div>
  );
}
