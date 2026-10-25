import React, { useState } from 'react';
import { FocusBadge, navigateWiki, SemanticText } from './SemanticText';

export interface GameComponent {
  id: string;
  title: string;
  component_type: string;
  category?: string;
  faction?: string;
  color_hex?: string;
  tier?: number | null;
  deck_copies?: number;
  cost?: {
    credits?: number;
    effort?: number;
    pip?: number;
  };
  focus_affinity?: {
    primary?: string | null;
    secondary?: string | null;
    bridges?: string[];
  };
  stats?: {
    es_budget?: number | null;
    hp_cap?: number | null;
    static_dice?: number | null;
    slots_required?: string[];
    armor_buffer?: number | null;
    stage_count?: number;
    max_doom?: number;
  };
  rules_text?: string;
  tags?: string[];
  art_spec: {
    asset_path: string;
    aspect_ratio: string;
    visual_description: string;
    art_style: string;
  };
  source_path?: string;
  body?: string;
  [key: string]: any;
}

export function ComponentCard({
  item,
  onSelect,
}: {
  item: GameComponent;
  onSelect?: (item: GameComponent) => void;
}) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cr = item.cost?.credits ?? 0;
  const ef = item.cost?.effort ?? 0;
  const pip = item.cost?.pip ?? 0;

  const wikiHref = `#/wiki/component/${item.id}`;

  const handleOpenPage = () => {
    if (onSelect) {
      onSelect(item);
    } else {
      navigateWiki(wikiHref);
    }
  };

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullPrompt = `${item.art_spec.visual_description} Style: ${item.art_spec.art_style} Aspect ratio ${item.art_spec.aspect_ratio}.`;
    navigator.clipboard?.writeText(fullPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1800);
  };

  return (
    <article
      className="at-card"
      style={
        item.color_hex
          ? { borderTop: `3px solid ${item.color_hex}` }
          : undefined
      }
    >
      {/* Header */}
      <header className="at-card-header">
        <div>
          <button
            type="button"
            className="at-card-title-link"
            onClick={handleOpenPage}
          >
            {item.title}
          </button>
          <div className="at-card-subtitle">
            {item.component_type.replace(/_/g, ' ')}
            {item.category ? ` • ${item.category.replace(/_/g, ' ')}` : ''}
            {item.tier ? ` • Tier ${item.tier}` : ''}
          </div>
        </div>
        <div className="at-card-cost-cluster">
          {cr > 0 && <SemanticText text={`[${cr} CR]`} />}
          {ef > 0 && <SemanticText text={`[${ef} EF]`} />}
          {pip > 0 && <SemanticText text={`[${pip} PIP]`} />}
        </div>
      </header>

      {/* Art Spec Blueprint Frame */}
      <div className="at-card-art-frame">
        {!imgError && item.art_spec?.asset_path && (
          <img
            src={item.art_spec.asset_path}
            alt={item.title}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{
              display: imgLoaded ? 'block' : 'none',
              width: '100%',
              maxHeight: '180px',
              objectFit: 'cover',
              borderRadius: '6px',
              marginBottom: '0.5rem',
            }}
          />
        )}
        <div className="at-card-art-meta">
          <span>ART SPEC • {item.art_spec.aspect_ratio}</span>
          <button
            type="button"
            onClick={handleCopyPrompt}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: copiedPrompt ? '#10B981' : '#94a3b8',
              borderRadius: '4px',
              padding: '1px 6px',
              fontSize: '0.64rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
            title="Copy generative art prompt to clipboard"
          >
            {copiedPrompt ? '✓ PROMPT COPIED' : 'COPY PROMPT'}
          </button>
        </div>
        <p className="at-card-art-prompt" title={item.art_spec.visual_description}>
          “{item.art_spec.visual_description}”
        </p>
        <div className="at-card-art-meta">
          <span style={{ opacity: 0.75 }}>{item.art_spec.asset_path}</span>
        </div>
      </div>

      {/* Stats & Focus Affinity Bar */}
      <div className="at-card-stats-bar">
        {item.focus_affinity?.primary && (
          <FocusBadge focus={item.focus_affinity.primary} roleLabel="1°" />
        )}
        {item.focus_affinity?.secondary && (
          <FocusBadge focus={item.focus_affinity.secondary} roleLabel="2°" />
        )}
        {item.stats?.hp_cap != null && (
          <span className="stat-pill" style={{ color: '#f87171' }}>
            ♥ {item.stats.hp_cap} HP
          </span>
        )}
        {item.stats?.static_dice != null && (
          <span className="stat-pill" style={{ color: '#38bdf8' }}>
            🎲 {item.stats.static_dice} Dice
          </span>
        )}
        {item.stats?.armor_buffer != null && item.stats.armor_buffer > 0 && (
          <span className="stat-pill" style={{ color: '#a78bfa' }}>
            🛡 {item.stats.armor_buffer} Armor
          </span>
        )}
        {item.stats?.es_budget != null && (
          <span className="stat-pill" style={{ color: '#fbbf24' }}>
            ⚡ {item.stats.es_budget} ES
          </span>
        )}
        {item.stats?.slots_required && item.stats.slots_required.length > 0 && (
          <span className="stat-pill">
            Slots: {item.stats.slots_required.map((s) => `[${s}]`).join(' + ')}
          </span>
        )}
      </div>

      {/* Rules Body */}
      <div className="at-card-body">
        <div>
          <SemanticText text={item.rules_text || 'See full component Wiki page for detailed rules.'} />
        </div>

        <a
          href={wikiHref}
          className="vtt-btn"
          style={{
            alignSelf: 'flex-start',
            marginTop: '0.35rem',
            fontSize: '0.75rem',
            textDecoration: 'none',
          }}
          onClick={(e) => {
            e.preventDefault();
            handleOpenPage();
          }}
        >
          Open Wiki Page →
        </a>
      </div>

      {/* Footer */}
      <footer className="at-card-footer">
        <span>ID: {item.id}</span>
        <span>{item.deck_copies ? `×${item.deck_copies} in deck` : 'Unique'}</span>
      </footer>
    </article>
  );
}
