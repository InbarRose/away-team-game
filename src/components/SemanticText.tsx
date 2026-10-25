import React from 'react';

export interface TokenSpec {
  label: string;
  cssClass: string;
  tooltip: string;
  glyph: 'combat' | 'infiltrate' | 'intel' | 'ops' | 'negotiate' | 'survival' | 'cr' | 'ef' | 'pip' | 'loy' | 'doom' | 'mom' | 'vp' | 'slot';
}

export const SEMANTIC_TOKENS: Record<string, TokenSpec> = {
  '[Combat]': {
    label: 'Combat',
    cssClass: 'badge-focus-combat',
    tooltip: 'Combat Focus (50% Pyramid Primary) — Breach, Firefights, Suppression',
    glyph: 'combat',
  },
  '[Infiltrate]': {
    label: 'Infiltrate',
    cssClass: 'badge-focus-infiltrate',
    tooltip: 'Infiltrate Focus (35% Tactical Utility) — Stealth, Locks, Bypass',
    glyph: 'infiltrate',
  },
  '[Intel]': {
    label: 'Intel',
    cssClass: 'badge-focus-intel',
    tooltip: 'Intel Focus (35% Tactical Utility) — Decryption, Telemetry, Research',
    glyph: 'intel',
  },
  '[Operations]': {
    label: 'Operations',
    cssClass: 'badge-focus-ops',
    tooltip: 'Operations Focus (35% Tactical Utility) — Engineering, Sabotage, Rigging',
    glyph: 'ops',
  },
  '[Negotiate]': {
    label: 'Negotiate',
    cssClass: 'badge-focus-negotiate',
    tooltip: 'Negotiate Focus (15% Niche Specialist) — Coercion, Diplomacy, Parley',
    glyph: 'negotiate',
  },
  '[Survival]': {
    label: 'Survival',
    cssClass: 'badge-focus-survival',
    tooltip: 'Survival Focus (15% Niche Specialist) — Bio-Hazards, Triage, Hostile Environments',
    glyph: 'survival',
  },
  '[CR]': {
    label: 'CR',
    cssClass: 'badge-currency-cr',
    tooltip: 'Credits [CR] — Hard currency for Recruiting, Armory Gear, HQ Modules & Command Bids',
    glyph: 'cr',
  },
  '[EF]': {
    label: 'EF',
    cssClass: 'badge-currency-ef',
    tooltip: 'Effort [EF] — Tactical fuel for Class Abilities, Complex Items & Logistical Refresh',
    glyph: 'ef',
  },
  '[PIP]': {
    label: 'PIP',
    cssClass: 'badge-currency-pip',
    tooltip: 'Political Influence [PIP] — Used for Vulture Tax, Policy Vetoes & Tie-Breakers',
    glyph: 'pip',
  },
  '[LOY]': {
    label: 'LOY',
    cssClass: 'badge-currency-loy',
    tooltip: 'Loyalty [LOY] — Operative rank (Tiers 1–4), unlocking Faction Tree powers & Endgame VPs',
    glyph: 'loy',
  },
  '[DOOM]': {
    label: 'DOOM',
    cssClass: 'badge-currency-doom',
    tooltip: 'Doom Tracker [DOOM] — Advances on mission failure or forced extraction; campaign lost at Max Doom',
    glyph: 'doom',
  },
  '[MOM]': {
    label: 'MOM',
    cssClass: 'badge-currency-mom',
    tooltip: 'Operational Momentum [MOM] — Earned by clearing a stage by >= D+2 successes',
    glyph: 'mom',
  },
  '[VP]': {
    label: 'VP',
    cssClass: 'badge-currency-vp',
    tooltip: 'Victory Points [VP] — Endgame corporate supremacy score',
    glyph: 'vp',
  },
  '[Head]': {
    label: 'Head',
    cssClass: 'badge-slot',
    tooltip: 'Wearable Slot: [Head] (Optics, Neural Visors, Helmets)',
    glyph: 'slot',
  },
  '[Body]': {
    label: 'Body',
    cssClass: 'badge-slot',
    tooltip: 'Wearable Slot: [Body] (Armor Carapaces, Harnesses, Suits)',
    glyph: 'slot',
  },
  '[Legs]': {
    label: 'Legs',
    cssClass: 'badge-slot',
    tooltip: 'Wearable Slot: [Legs] (Exo-Greaves, Thrusters, Stabilizers)',
    glyph: 'slot',
  },
  '[Pack]': {
    label: 'Pack',
    cssClass: 'badge-slot',
    tooltip: 'Wearable Slot: [Pack] (Generators, Drone Bays, Field Rigs)',
    glyph: 'slot',
  },
  '[Hand L]': {
    label: 'Hand L',
    cssClass: 'badge-slot',
    tooltip: 'Equipment Slot: Left Hand',
    glyph: 'slot',
  },
  '[Hand R]': {
    label: 'Hand R',
    cssClass: 'badge-slot',
    tooltip: 'Equipment Slot: Right Hand',
    glyph: 'slot',
  },
  '[Consumable]': {
    label: 'Consumable',
    cssClass: 'badge-slot',
    tooltip: 'Single-use tactical item discarded upon activation',
    glyph: 'slot',
  },
  '[Complex]': {
    label: 'Complex',
    cssClass: 'badge-slot',
    tooltip: 'Heavy deployable/autonomous hardware requiring Effort [EF] to activate',
    glyph: 'slot',
  },
  '[Continuous Drop]': {
    label: 'Continuous Drop',
    cssClass: 'badge-currency-doom',
    tooltip: 'Linked Mission Sequence — Squad deploys directly into next mission without HQ Downtime',
    glyph: 'doom',
  },
  '[No HQ]': {
    label: 'No HQ',
    cssClass: 'badge-currency-doom',
    tooltip: 'Full HQ Downtime skipped; only Emergency Field Triage (2 [CR] per 1 HP) available',
    glyph: 'doom',
  },
  '[Facility]': {
    label: 'Facility',
    cssClass: 'badge-focus-ops',
    tooltip: 'Theme Tag: [Facility] — Triggers Safehouse Protocol after linked Continuous Drops',
    glyph: 'ops',
  },
};

export function renderGlyph(glyph: TokenSpec['glyph']) {
  switch (glyph) {
    case 'combat':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <circle cx="12" cy="12" r="8" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
      );
    case 'infiltrate':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M14.5 4.5L19.5 9.5L7 22L2 17L14.5 4.5Z" />
        </svg>
      );
    case 'intel':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'ops':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M19.1 4.9l-2.8 2.8M7.7 16.3l-2.8 2.8" />
        </svg>
      );
    case 'negotiate':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <line x1="12" y1="3" x2="12" y2="21" />
          <path d="M5 7h14M5 7l-3 6h6l-3-6zM19 7l-3 6h6l-3-6z" />
        </svg>
      );
    case 'survival':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case 'cr':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
        </svg>
      );
    case 'ef':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'pip':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2" />
        </svg>
      );
    case 'loy':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M6 15l6-6 6 6M6 9l6-6 6 6" />
        </svg>
      );
    case 'doom':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <circle cx="12" cy="10" r="7" />
          <path d="M9 17v4h6v-4" />
        </svg>
      );
    case 'mom':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      );
    case 'vp':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M8 22v-4a4 4 0 0 1 8 0v4M6 4h12v6a6 6 0 0 1-12 0V4z" />
        </svg>
      );
    default:
      return null;
  }
}

export function FocusBadge({ focus, roleLabel }: { focus: string | null | undefined; roleLabel?: string }) {
  if (!focus) return null;
  const normalized = focus.toLowerCase();
  const mapKey: Record<string, string> = {
    combat: '[Combat]',
    infiltrate: '[Infiltrate]',
    intel: '[Intel]',
    operations: '[Operations]',
    ops: '[Operations]',
    negotiate: '[Negotiate]',
    survival: '[Survival]',
  };
  const key = mapKey[normalized];
  if (!key || !SEMANTIC_TOKENS[key]) {
    return <span className="semantic-badge badge-slot">{focus}</span>;
  }
  const spec = SEMANTIC_TOKENS[key];
  return (
    <span className={`semantic-badge ${spec.cssClass}`} title={spec.tooltip}>
      {renderGlyph(spec.glyph)}
      <span>{roleLabel ? `${roleLabel}: ${spec.label}` : spec.label}</span>
    </span>
  );
}

const TOKEN_REGEX = /(\[Combat\]|\[Infiltrate\]|\[Intel\]|\[Operations\]|\[Negotiate\]|\[Survival\]|\[CR\]|\[EF\]|\[PIP\]|\[LOY\]|\[DOOM\]|\[MOM\]|\[VP\]|\[Head\]|\[Body\]|\[Legs\]|\[Pack\]|\[Hand L\]|\[Hand R\]|\[Consumable\]|\[Complex\]|\[Continuous Drop\]|\[No HQ\]|\[Facility\])/g;

export function SemanticText({ text }: { text: string | null | undefined }) {
  if (!text) return null;
  const parts = text.split(TOKEN_REGEX);
  return (
    <>
      {parts.map((part, idx) => {
        const spec = SEMANTIC_TOKENS[part];
        if (spec) {
          return (
            <span key={idx} className={`semantic-badge ${spec.cssClass}`} title={spec.tooltip}>
              {renderGlyph(spec.glyph)}
              <span>{spec.label}</span>
            </span>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
}
