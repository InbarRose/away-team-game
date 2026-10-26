import React from 'react';

export interface TokenSpec {
  label: string;
  cssClass: string;
  categoryLabel: string;
  tooltip: string;
  wikiHash: string;
  glyph:
    | 'combat'
    | 'infiltrate'
    | 'intel'
    | 'ops'
    | 'negotiate'
    | 'survival'
    | 'cr'
    | 'ef'
    | 'pip'
    | 'loy'
    | 'fail'
    | 'doom'
    | 'mom'
    | 'vp'
    | 'slot';
}

export function navigateWiki(hash: string) {
  if (typeof window !== 'undefined') {
    window.location.hash = hash;
    window.dispatchEvent(new CustomEvent('wiki:navigate', { detail: hash }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export const SEMANTIC_TOKENS: Record<string, TokenSpec> = {
  '[Combat]': {
    label: 'Combat',
    cssClass: 'badge-focus-combat',
    categoryLabel: 'Focus (50% Primary)',
    tooltip: 'Combat Focus (50% Pyramid Primary) — Breach, Firefights, Suppression. Click to open Combat Focus Wiki page.',
    wikiHash: '#/wiki/focus/combat',
    glyph: 'combat',
  },
  '[Infiltrate]': {
    label: 'Infiltrate',
    cssClass: 'badge-focus-infiltrate',
    categoryLabel: 'Focus (35% Utility)',
    tooltip: 'Infiltrate Focus (35% Tactical Utility) — Stealth, Locks, Bypass. Click to open Infiltrate Focus Wiki page.',
    wikiHash: '#/wiki/focus/infiltrate',
    glyph: 'infiltrate',
  },
  '[Intel]': {
    label: 'Intel',
    cssClass: 'badge-focus-intel',
    categoryLabel: 'Focus (35% Utility)',
    tooltip: 'Intel Focus (35% Tactical Utility) — Decryption, Telemetry, Research. Click to open Intel Focus Wiki page.',
    wikiHash: '#/wiki/focus/intel',
    glyph: 'intel',
  },
  '[Operations]': {
    label: 'Operations',
    cssClass: 'badge-focus-ops',
    categoryLabel: 'Focus (35% Utility)',
    tooltip: 'Operations Focus (35% Tactical Utility) — Engineering, Sabotage, Rigging. Click to open Operations Focus Wiki page.',
    wikiHash: '#/wiki/focus/operations',
    glyph: 'ops',
  },
  '[Negotiate]': {
    label: 'Negotiate',
    cssClass: 'badge-focus-negotiate',
    categoryLabel: 'Focus (15% Specialist)',
    tooltip: 'Negotiate Focus (15% Niche Specialist) — Coercion, Diplomacy, Parley. Click to open Negotiate Focus Wiki page.',
    wikiHash: '#/wiki/focus/negotiate',
    glyph: 'negotiate',
  },
  '[Survival]': {
    label: 'Survival',
    cssClass: 'badge-focus-survival',
    categoryLabel: 'Focus (15% Specialist)',
    tooltip: 'Survival Focus (15% Niche Specialist) — Bio-Hazards, Triage, Hostile Environments. Click to open Survival Focus Wiki page.',
    wikiHash: '#/wiki/focus/survival',
    glyph: 'survival',
  },
  '[CR]': {
    label: 'CR',
    cssClass: 'badge-currency-cr',
    categoryLabel: 'Primary Vault Currency',
    tooltip: 'Primary Currency: Credits [CR] — Liquid corporate capital stored in Faction Vaults (Tradeable). Click for Economy Reference.',
    wikiHash: '#/wiki/concept/currencies',
    glyph: 'cr',
  },
  '[EF]': {
    label: 'EF',
    cssClass: 'badge-currency-ef',
    categoryLabel: 'Primary Vault Currency',
    tooltip: 'Primary Currency: Effort [EF] — Tactical operational fuel stored in Faction Vaults for Class Abilities & Complex Gear. Click for Economy Reference.',
    wikiHash: '#/wiki/concept/currencies',
    glyph: 'ef',
  },
  '[PIP]': {
    label: 'PIP',
    cssClass: 'badge-currency-pip',
    categoryLabel: 'Primary Vault Currency',
    tooltip: 'Primary Currency: Political Influence [PIP] — Boardroom leverage stored in Faction Vaults for HQ Sponsorships, Vulture Tax & Tie-Breakers.',
    wikiHash: '#/wiki/concept/currencies',
    glyph: 'pip',
  },
  '[MOM]': {
    label: 'MOM',
    cssClass: 'badge-currency-mom',
    categoryLabel: 'In-Mission Tactical State',
    tooltip: 'Transient Mission State: Operational Momentum [MOM] — Earned ONLY during a mission when clearing a stage by >= D+2 successes. Refunds 1 spent static die.',
    wikiHash: '#/wiki/concept/currencies',
    glyph: 'mom',
  },
  '[LOY]': {
    label: 'LOY',
    cssClass: 'badge-currency-loy',
    categoryLabel: 'Operative Progression Reward',
    tooltip: 'Operative Rank Reward: Loyalty [LOY] — Permanent personal rank on an operative card (Tiers 1–4). Cannot be spent or traded like a currency.',
    wikiHash: '#/wiki/concept/currencies',
    glyph: 'loy',
  },
  '[FAIL]': {
    label: 'FAIL',
    cssClass: 'badge-currency-fail',
    categoryLabel: 'Meta Campaign Tracker',
    tooltip: 'Meta Campaign Tracker: Mission Failure [FAIL] — Advances ONLY when a mission fails or retreats. Reaching Dissolution Threshold causes Task Force Dissolution.',
    wikiHash: '#/wiki/rule/campaign_engine',
    glyph: 'fail',
  },
  '[FAILURE]': {
    label: 'FAIL',
    cssClass: 'badge-currency-fail',
    categoryLabel: 'Meta Campaign Tracker',
    tooltip: 'Meta Campaign Tracker: Mission Failure [FAIL] — Advances ONLY when a mission fails or retreats.',
    wikiHash: '#/wiki/rule/campaign_engine',
    glyph: 'fail',
  },
  '[DOOM]': {
    label: 'DOOM',
    cssClass: 'badge-currency-doom',
    categoryLabel: 'Meta Campaign Tracker',
    tooltip: 'Meta Campaign Clock: Doom [DOOM] — Global catastrophe countdown track (not a player currency). Reaching Max Doom triggers campaign loss.',
    wikiHash: '#/wiki/rule/campaign_engine',
    glyph: 'doom',
  },
  '[VP]': {
    label: 'VP',
    cssClass: 'badge-currency-vp',
    categoryLabel: 'Endgame Score Tracker',
    tooltip: 'Victory Points [VP] — Endgame corporate supremacy score tracker (not a spendable currency).',
    wikiHash: '#/wiki/concept/currencies',
    glyph: 'vp',
  },
  '[Head]': {
    label: 'Head',
    cssClass: 'badge-slot',
    categoryLabel: 'Anatomical Slot',
    tooltip: 'Wearable Slot: [Head] (Optics, Neural Visors, Helmets). Click to browse Head gear.',
    wikiHash: '#/wiki/database/item?slot=wearable_head',
    glyph: 'slot',
  },
  '[Body]': {
    label: 'Body',
    cssClass: 'badge-slot',
    categoryLabel: 'Anatomical Slot',
    tooltip: 'Wearable Slot: [Body] (Armor Carapaces, Harnesses, Suits). Click to browse Body gear.',
    wikiHash: '#/wiki/database/item?slot=wearable_body',
    glyph: 'slot',
  },
  '[Legs]': {
    label: 'Legs',
    cssClass: 'badge-slot',
    categoryLabel: 'Anatomical Slot',
    tooltip: 'Wearable Slot: [Legs] (Exo-Greaves, Thrusters, Stabilizers). Click to browse Legs gear.',
    wikiHash: '#/wiki/database/item?slot=wearable_legs',
    glyph: 'slot',
  },
  '[Pack]': {
    label: 'Pack',
    cssClass: 'badge-slot',
    categoryLabel: 'Anatomical Slot',
    tooltip: 'Wearable Slot: [Pack] (Generators, Drone Bays, Field Rigs). Click to browse Pack gear.',
    wikiHash: '#/wiki/database/item?slot=wearable_pack',
    glyph: 'slot',
  },
  '[Hand L]': {
    label: 'Hand L',
    cssClass: 'badge-slot',
    categoryLabel: 'Anatomical Slot',
    tooltip: 'Equipment Slot: Left Hand. Click to browse Handheld weapons & tools.',
    wikiHash: '#/wiki/database/item?slot=handheld_1h',
    glyph: 'slot',
  },
  '[Hand R]': {
    label: 'Hand R',
    cssClass: 'badge-slot',
    categoryLabel: 'Anatomical Slot',
    tooltip: 'Equipment Slot: Right Hand. Click to browse Handheld weapons & tools.',
    wikiHash: '#/wiki/database/item?slot=handheld_1h',
    glyph: 'slot',
  },
  '[Hand]': {
    label: '1 Hand',
    cssClass: 'badge-slot',
    categoryLabel: 'Anatomical Slot',
    tooltip: 'Equipment Slot: 1 Hand. Click to browse Handheld weapons & tools.',
    wikiHash: '#/wiki/database/item?slot=handheld_1h',
    glyph: 'slot',
  },
  '[Consumable]': {
    label: 'Consumable',
    cssClass: 'badge-slot',
    categoryLabel: 'Item Class',
    tooltip: 'Single-use tactical item discarded upon activation. Click to browse Consumables.',
    wikiHash: '#/wiki/database/item?slot=consumable',
    glyph: 'slot',
  },
  '[Complex]': {
    label: 'Complex',
    cssClass: 'badge-slot',
    categoryLabel: 'Item Class',
    tooltip: 'Heavy deployable/autonomous hardware requiring Effort [EF] to activate. Click to browse Complex items.',
    wikiHash: '#/wiki/database/item?slot=complex',
    glyph: 'slot',
  },
  '[Continuous Drop]': {
    label: 'Continuous Drop',
    cssClass: 'badge-currency-doom',
    categoryLabel: 'Campaign Rule Tag',
    tooltip: 'Linked Mission Sequence — Squad deploys directly into next mission without HQ Downtime.',
    wikiHash: '#/wiki/rule/campaign_engine',
    glyph: 'doom',
  },
  '[No HQ]': {
    label: 'No HQ',
    cssClass: 'badge-currency-doom',
    categoryLabel: 'Campaign Rule Tag',
    tooltip: 'Full HQ Downtime skipped; only Emergency Field Triage ([2 CR] per 1 HP) available.',
    wikiHash: '#/wiki/rule/campaign_engine',
    glyph: 'doom',
  },
  '[Facility]': {
    label: 'Facility',
    cssClass: 'badge-focus-ops',
    categoryLabel: 'Mission Theme Tag',
    tooltip: 'Theme Tag: [Facility] — Triggers Safehouse Protocol after linked Continuous Drops.',
    wikiHash: '#/wiki/rule/campaign_engine',
    glyph: 'ops',
  },
  '[Urban]': {
    label: 'Urban',
    cssClass: 'badge-slot',
    categoryLabel: 'Mission Theme Tag',
    tooltip: 'Mission Theme Tag: [Urban]',
    wikiHash: '#/wiki/database/campaign_mission',
    glyph: 'slot',
  },
  '[Covert]': {
    label: 'Covert',
    cssClass: 'badge-focus-infiltrate',
    categoryLabel: 'Mission Theme Tag',
    tooltip: 'Mission Theme Tag: [Covert]',
    wikiHash: '#/wiki/database/campaign_mission',
    glyph: 'infiltrate',
  },
  '[Space]': {
    label: 'Space',
    cssClass: 'badge-focus-intel',
    categoryLabel: 'Mission Theme Tag',
    tooltip: 'Mission Theme Tag: [Space]',
    wikiHash: '#/wiki/database/campaign_mission',
    glyph: 'intel',
  },
  '[Planet]': {
    label: 'Planet',
    cssClass: 'badge-focus-survival',
    categoryLabel: 'Mission Theme Tag',
    tooltip: 'Mission Theme Tag: [Planet]',
    wikiHash: '#/wiki/database/campaign_mission',
    glyph: 'survival',
  },
};

// Auto-linked Wiki concepts, Classes, Factions, HQ Facilities & Rules
export const WIKI_ENTITY_LINKS: { pattern: string; label?: string; hash: string; title: string }[] = [
  // 8 Factions
  { pattern: 'Aegis Tactical Directorate', hash: '#/wiki/component/faction-aegis', title: 'Faction Dossier: Aegis Tactical Directorate' },
  { pattern: 'Nexus Cybernetics & Data', hash: '#/wiki/component/faction-nexus', title: 'Faction Dossier: Nexus Cybernetics & Data' },
  { pattern: 'Nexus Cybernetics', hash: '#/wiki/component/faction-nexus', title: 'Faction Dossier: Nexus Cybernetics & Data' },
  { pattern: 'Vanderbilt Sovereign Group', hash: '#/wiki/component/faction-vanderbilt', title: 'Faction Dossier: Vanderbilt Sovereign Group' },
  { pattern: 'Obsidian Syndicate', hash: '#/wiki/component/faction-obsidian', title: 'Faction Dossier: Obsidian Syndicate' },
  { pattern: 'Titan Heavy Logistics', hash: '#/wiki/component/faction-titan', title: 'Faction Dossier: Titan Heavy Logistics' },
  { pattern: 'Ascendant Bio-Tech', hash: '#/wiki/component/faction-ascendant', title: 'Faction Dossier: Ascendant Bio-Tech' },
  { pattern: 'Aurelius Media & Political Lobby', hash: '#/wiki/component/faction-aurelius', title: 'Faction Dossier: Aurelius Media & Political Lobby' },
  { pattern: 'Aurelius Media', hash: '#/wiki/component/faction-aurelius', title: 'Faction Dossier: Aurelius Media & Political Lobby' },
  { pattern: 'Ironclad Extraction Scavengers', hash: '#/wiki/component/faction-ironclad', title: 'Faction Dossier: Ironclad Extraction Scavengers' },
  { pattern: 'Ironclad Extraction', hash: '#/wiki/component/faction-ironclad', title: 'Faction Dossier: Ironclad Extraction Scavengers' },

  // 9 HQ Facilities & Landmarks
  { pattern: 'Cryo-Stasis Chamber', hash: '#/wiki/component/hq-landmark-cryo-stasis', title: 'HQ Landmark: Cryo-Stasis Chamber' },
  { pattern: 'Tactical Simulator', hash: '#/wiki/component/hq-landmark-tactical-simulator', title: 'HQ Landmark: Tactical Simulator' },
  { pattern: 'The War Room', hash: '#/wiki/component/hq-landmark-war-room', title: 'HQ Landmark: The War Room' },
  { pattern: 'Supply Lines', hash: '#/wiki/component/hq-landmark-supply-lines', title: 'HQ Landmark: Supply Lines' },
  { pattern: 'Recruitment Bureau', hash: '#/wiki/component/hq-recruitment-bureau', title: 'HQ Facility: Recruitment Bureau' },
  { pattern: 'Intel Array', hash: '#/wiki/component/hq-intel-array', title: 'HQ Facility: Intel Array' },
  { pattern: 'Quartermaster', hash: '#/wiki/component/hq-quartermaster', title: 'HQ Facility: Quartermaster' },
  { pattern: 'Infirmary', hash: '#/wiki/component/hq-infirmary', title: 'HQ Facility: Infirmary' },
  { pattern: 'Boardroom', hash: '#/wiki/component/hq-boardroom', title: 'HQ Facility: The Boardroom' },

  // Campaigns & Missions
  { pattern: 'Operation: Iron Dawn', hash: '#/wiki/component/campaign-iron-dawn', title: 'Campaign Dossier: Operation: Iron Dawn' },
  { pattern: 'Operation: Apex Extraction', hash: '#/wiki/component/campaign-apex-extraction', title: 'Campaign Dossier: Operation: Apex Extraction' },
  { pattern: 'Black-Market Intercept', hash: '#/wiki/component/mission-iron-dawn-1-black-market-intercept', title: 'Mission 1: Black-Market Intercept' },
  { pattern: 'Deep-Sea Laboratory Raid', hash: '#/wiki/component/mission-iron-dawn-2-deep-sea-laboratory-raid', title: 'Mission 2: Deep-Sea Laboratory Raid' },
  { pattern: 'Orbital Array Sabotage', hash: '#/wiki/component/mission-iron-dawn-3-orbital-array-sabotage', title: 'Mission 3: Orbital Array Sabotage' },
  { pattern: 'Signal Reconnaissance', hash: '#/wiki/component/mission-apex-extraction-1-signal-reconnaissance', title: 'Mission 1: Signal Reconnaissance' },
  { pattern: 'Black-Site Infiltration', hash: '#/wiki/component/mission-apex-extraction-2-black-site-infiltration', title: 'Mission 2: Black-Site Infiltration' },
  { pattern: 'VIP Exfiltration Escort', hash: '#/wiki/component/mission-apex-extraction-3-vip-exfiltration-escort', title: 'Mission 3: VIP Exfiltration Escort' },
  { pattern: 'Bioweapon Facility Decapitation', hash: '#/wiki/component/mission-apex-extraction-4-bioweapon-facility-decapitation', title: 'Mission 4: Bioweapon Facility Decapitation' },

  // 6 Classes & Class Abilities
  { pattern: 'Dual-Vector Mapping', hash: '#/wiki/class/scientist', title: 'Scientist Class Ability: Dual-Vector Mapping' },
  { pattern: 'Strategic Alignment', hash: '#/wiki/class/diplomat', title: 'Diplomat Class Ability: Strategic Alignment' },
  { pattern: 'Adaptive Calibration', hash: '#/wiki/class/technician', title: 'Technician Class Ability: Adaptive Calibration' },
  { pattern: 'Hostile Environment Mastery', hash: '#/wiki/class/survivalist', title: 'Survivalist Class Ability: Hostile Environment Mastery' },
  { pattern: 'Tactical Overwatch', hash: '#/wiki/class/recon', title: 'Recon Class Ability: Tactical Overwatch' },
  { pattern: 'Lock and Load', hash: '#/wiki/class/soldier', title: 'Soldier Class Ability: Lock and Load' },

  // Core Rules Systems
  { pattern: 'Command Auction', hash: '#/wiki/rule/squad_leader_command', title: 'Core Rules: Command Auction & Squad Leader' },
  { pattern: 'Stand-Down Auction', hash: '#/wiki/rule/vault_economy', title: 'Core Rules: Stand-Down Auction (HQ Downtime)' },
  { pattern: 'Logistical Refresh', hash: '#/wiki/rule/squad_leader_command', title: 'Core Rules: Squad Leader Logistical Refresh' },
  { pattern: 'Force Breach', hash: '#/wiki/rule/squad_leader_command', title: 'Core Rules: Dynamic Focus Swap — Force Breach' },
  { pattern: 'Tactical Bypass', hash: '#/wiki/rule/squad_leader_command', title: 'Core Rules: Dynamic Focus Swap — Tactical Bypass' },
  { pattern: 'Vulture Tax', hash: '#/wiki/rule/medbay_trauma', title: 'Core Rules: Field Casualty Looting & Vulture Tax' },
  { pattern: 'Critical Injuries', hash: '#/wiki/rule/medbay_trauma', title: 'Core Rules: Med Bay & Critical Injuries' },
  { pattern: 'Critical Injury', hash: '#/wiki/rule/medbay_trauma', title: 'Core Rules: Med Bay & Critical Injuries' },
  { pattern: 'Permanent Trauma', hash: '#/wiki/rule/medbay_trauma', title: 'Core Rules: Med Bay & Permanent Trauma' },
  { pattern: 'Med Bay', hash: '#/wiki/rule/medbay_trauma', title: 'Core Rules: Med Bay & Trauma Engine' },
  { pattern: 'Safehouse Protocol', hash: '#/wiki/rule/campaign_engine', title: 'Core Rules: Safehouse Protocol (Campaign Engine)' },
  { pattern: 'Secret Objectives', hash: '#/wiki/database/secret_objective', title: 'Component Database: Secret Objectives' },
  { pattern: 'Secret Objective', hash: '#/wiki/database/secret_objective', title: 'Component Database: Secret Objectives' },
  { pattern: 'Open Agendas', hash: '#/wiki/database/agenda', title: 'Component Database: Open Agendas' },
  { pattern: 'Open Agenda', hash: '#/wiki/database/agenda', title: 'Component Database: Open Agendas' },
  { pattern: 'Stage Modifiers', hash: '#/wiki/database/modifier', title: 'Component Database: Stage Modifiers' },
  { pattern: 'Stage Modifier', hash: '#/wiki/database/modifier', title: 'Component Database: Stage Modifiers' },
];

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
    case 'fail':
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

export function FocusBadge({
  focus,
  roleLabel,
}: {
  focus: string | null | undefined;
  roleLabel?: string;
}) {
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
    <a
      href={spec.wikiHash}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigateWiki(spec.wikiHash);
      }}
      className={`semantic-badge clickable ${spec.cssClass}`}
      title={spec.tooltip}
    >
      {renderGlyph(spec.glyph)}
      <span>{roleLabel ? `${roleLabel}: ${spec.label}` : spec.label}</span>
    </a>
  );
}

/**
 * Matches:
 * 1. Compound quantity tokens: [+1 CR], [-1 CR], [2–3 EF], [10+ LOY], [+15 VP], [+1 DOOM], [+1 MOM]
 * 2. Adjacent number + token: +1 [CR], 2 [EF], -1 [PIP]
 * 3. Standard bracketed tokens: [Combat], [Infiltrate], [CR], [EF], [Head], etc.
 */
const COMPOUND_OR_TOKEN_REGEX =
  /(\[[+-]?\d+(?:[–-]\d+|\+)?\s+(?:CR|EF|PIP|LOY|FAIL|FAILURE|DOOM|MOM|VP)\]|(?<![A-Za-z0-9_])[+-]?\d+(?:[–-]\d+|\+)?\s+\[(?:CR|EF|PIP|LOY|FAIL|FAILURE|DOOM|MOM|VP)\]|\[(?:Combat|Infiltrate|Intel|Operations|Negotiate|Survival|CR|EF|PIP|LOY|FAIL|FAILURE|DOOM|MOM|VP|Head|Body|Legs|Pack|Hand L|Hand R|Hand|Consumable|Complex|Continuous Drop|No HQ|Facility|Urban|Covert|Space|Planet)\])/g;

const ENTITY_REGEX = new RegExp(
  `\\b(${WIKI_ENTITY_LINKS.map((e) =>
    e.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  ).join('|')})\\b`,
  'g'
);

const ENTITY_LOOKUP = new Map(WIKI_ENTITY_LINKS.map((e) => [e.pattern, e]));

function renderAutoLinkedPlainText(segment: string, keyPrefix: string): React.ReactNode {
  if (!segment) return null;
  const subParts = segment.split(ENTITY_REGEX);
  if (subParts.length === 1) return segment;

  return subParts.map((sub, sIdx) => {
    const entity = ENTITY_LOOKUP.get(sub);
    if (entity) {
      return (
        <a
          key={`${keyPrefix}-ent-${sIdx}`}
          href={entity.hash}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigateWiki(entity.hash);
          }}
          className="wiki-inline-link"
          title={entity.title}
        >
          {sub}
        </a>
      );
    }
    return <React.Fragment key={`${keyPrefix}-txt-${sIdx}`}>{sub}</React.Fragment>;
  });
}

export function SemanticText({
  text,
  disableEntityLinks = false,
}: {
  text: string | null | undefined;
  disableEntityLinks?: boolean;
}) {
  if (!text) return null;
  const parts = text.split(COMPOUND_OR_TOKEN_REGEX);

  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;

        // 1. Direct match in SEMANTIC_TOKENS (e.g. [Combat], [CR], [Head])
        const directSpec = SEMANTIC_TOKENS[part];
        if (directSpec) {
          return (
            <a
              key={idx}
              href={directSpec.wikiHash}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateWiki(directSpec.wikiHash);
              }}
              className={`semantic-badge clickable ${directSpec.cssClass}`}
              title={`${directSpec.categoryLabel} — ${directSpec.tooltip}`}
            >
              {renderGlyph(directSpec.glyph)}
              <span>{directSpec.label}</span>
            </a>
          );
        }

        // 2. Compound bracketed token e.g. [+2 CR], [-1 PIP], [10+ LOY], [2–3 EF]
        const compoundBracketMatch = part.match(
          /^\[([+-]?\d+(?:[–-]\d+|\+)?)\s+(CR|EF|PIP|LOY|FAIL|FAILURE|DOOM|MOM|VP)\]$/
        );
        if (compoundBracketMatch) {
          const [, qty, unit] = compoundBracketMatch;
          const baseSpec = SEMANTIC_TOKENS[`[${unit}]`];
          if (baseSpec) {
            return (
              <a
                key={idx}
                href={baseSpec.wikiHash}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateWiki(baseSpec.wikiHash);
                }}
                className={`semantic-badge clickable ${baseSpec.cssClass}`}
                title={`${baseSpec.categoryLabel} — ${baseSpec.tooltip}`}
              >
                {renderGlyph(baseSpec.glyph)}
                <span>
                  {qty} {baseSpec.label}
                </span>
              </a>
            );
          }
        }

        // 3. Adjacent number + bracketed token e.g. "+2 [CR]" -> unified badge "+2 CR"
        const adjacentMatch = part.match(
          /^([+-]?\d+(?:[–-]\d+|\+)?)\s+\[(CR|EF|PIP|LOY|FAIL|FAILURE|DOOM|MOM|VP)\]$/
        );
        if (adjacentMatch) {
          const [, qty, unit] = adjacentMatch;
          const baseSpec = SEMANTIC_TOKENS[`[${unit}]`];
          if (baseSpec) {
            return (
              <a
                key={idx}
                href={baseSpec.wikiHash}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateWiki(baseSpec.wikiHash);
                }}
                className={`semantic-badge clickable ${baseSpec.cssClass}`}
                title={`${baseSpec.categoryLabel} — ${baseSpec.tooltip}`}
              >
                {renderGlyph(baseSpec.glyph)}
                <span>
                  {qty} {baseSpec.label}
                </span>
              </a>
            );
          }
        }

        if (disableEntityLinks) {
          return <React.Fragment key={idx}>{part}</React.Fragment>;
        }

        return (
          <React.Fragment key={idx}>
            {renderAutoLinkedPlainText(part, `seg-${idx}`)}
          </React.Fragment>
        );
      })}
    </>
  );
}
