import React, { useEffect, useMemo, useState } from 'react';
import { ComponentCard, GameComponent } from './ComponentCard';
import { MarkdownRenderer } from './MarkdownRenderer';
import { FocusBadge, navigateWiki, SemanticText } from './SemanticText';

export interface CoreRuleChapter {
  id: string;
  slug: string;
  title: string;
  source_path: string;
  body: string;
}

interface WikiPortalProps {
  coreRules: CoreRuleChapter[];
  components: GameComponent[];
  artManifest: any[];
}

type PortalSection =
  | 'rulebook'
  | 'currencies_guide'
  | 'focus_page'
  | 'class_page'
  | 'component_page'
  | 'all'
  | 'character'
  | 'item'
  | 'faction'
  | 'hq'
  | 'perk'
  | 'agenda'
  | 'secret_objective'
  | 'modifier'
  | 'campaign_mission'
  | 'art_pipeline';

const FOCUS_META: Record<
  string,
  {
    name: string;
    token: string;
    pyramidShare: string;
    tierRole: string;
    summary: string;
  }
> = {
  combat: {
    name: 'Combat',
    token: '[Combat]',
    pyramidShare: '50% of Stage Encounters (Tier 1 Primary Pillar)',
    tierRole: 'Firefights, Breaching, Suppression & Kinetic Defense',
    summary:
      'Combat is the dominant operational hazard across Away Team missions. 11 Operatives hold Primary [Combat] (3+) and 5 hold Secondary [Combat] (4+), while 8 Zero-Combat Specialists rely on Focus Bridge weapons (such as the Standard Issue Sidearm) or Squad Leader Tactical Bypass swaps.',
  },
  infiltrate: {
    name: 'Infiltrate',
    token: '[Infiltrate]',
    pyramidShare: '35% Combined Utility Pillar (Tier 2 Tactical Utility)',
    tierRole: 'Stealth Insertion, Mag-Lock Bypass, Covert Recon & Sabotage',
    summary:
      'Infiltrate governs stealthy entry vectors, security sensor evasion, and covert extraction routes. Squad Leaders can spend [2 EF] to execute a Tactical Bypass, shifting a stage focus to [Infiltrate].',
  },
  intel: {
    name: 'Intel',
    token: '[Intel]',
    pyramidShare: '35% Combined Utility Pillar (Tier 2 Tactical Utility)',
    tierRole: 'Mainframe Decryption, Telemetry Analysis, Bio-Research & Auditing',
    summary:
      'Intel governs data extraction, research vaults, and electronic warfare. Scientist and Recon operatives excel at turning [Intel] stages into extra [CR] and stage-scouting advantages.',
  },
  operations: {
    name: 'Operations',
    token: '[Operations]',
    pyramidShare: '35% Combined Utility Pillar (Tier 2 Tactical Utility)',
    tierRole: 'Heavy Engineering, Power Grid Siphons, Demolition & Drone Rigging',
    summary:
      'Operations covers physical infrastructure, reactor stabilization, and automated turret/drone deployments. Technicians and Breachers dominate [Operations] checks.',
  },
  negotiate: {
    name: 'Negotiate',
    token: '[Negotiate]',
    pyramidShare: '15% Combined Niche Pillar (Tier 3 High-Leverage Specialist)',
    tierRole: 'Executive Coercion, Hostage Parley, Syndicate Deals & Ceasefires',
    summary:
      'Negotiate appears in high-stakes social and corporate encounters. Diplomats can also use Strategic Alignment ([1 EF]) to shift a room into or out of [Negotiate].',
  },
  survival: {
    name: 'Survival',
    token: '[Survival]',
    pyramidShare: '15% Combined Niche Pillar (Tier 3 High-Leverage Specialist)',
    tierRole: 'Bio-Containment, Extreme Environments, Field Triage & Hazard Soak',
    summary:
      'Survival governs toxic atmospheres, alien bio-specimens, and structural meltdowns. Survivalists and Juggernauts anchor the squad during lethal environmental stages.',
  },
};

const CLASS_META: Record<
  string,
  {
    name: string;
    abilityName: string;
    cost: string;
    offsetEs: number;
    effect: string;
  }
> = {
  soldier: {
    name: 'Soldier',
    abilityName: 'Lock and Load',
    cost: '[1 EF]',
    offsetEs: 0.0,
    effect:
      'Activate before rolling (+2 temporary static dice for this stage) OR after rolling (re-roll up to 2 failed dice).',
  },
  recon: {
    name: 'Recon',
    abilityName: 'Tactical Overwatch',
    cost: '[1 EF]',
    offsetEs: 0.0,
    effect:
      'Activate during Step 1 (Briefing) to reduce the current stage Target Difficulty by -1 Success (to a minimum of 1) and peek at the top Stage Modifier.',
  },
  survivalist: {
    name: 'Survivalist',
    abilityName: 'Hostile Environment Mastery',
    cost: '[1 EF]',
    offsetEs: 1.0,
    effect:
      'Ignore all natural 1s (Backfires) rolled by this operative during this stage, OR restore 1 HP to a deployed operative.',
  },
  scientist: {
    name: 'Scientist',
    abilityName: 'Dual-Vector Mapping',
    cost: '[1 EF]',
    offsetEs: 0.5,
    effect:
      'Activate during Step 1 (Briefing). Choose any Focus category distinct from the room’s printed Focus and add it as a concurrent Operational Focus for the stage.',
  },
  diplomat: {
    name: 'Diplomat',
    abilityName: 'Strategic Alignment',
    cost: '[1 EF]',
    offsetEs: 0.0,
    effect:
      'Activate during Step 1 (Briefing) before dice are rolled. Shift the room’s primary Operational Focus to any other Focus category for the duration of the stage.',
  },
  technician: {
    name: 'Technician',
    abilityName: 'Adaptive Calibration',
    cost: '[1 EF]',
    offsetEs: 0.0,
    effect:
      'Activate after rolling to convert any 1 rolled miss into a guaranteed success, OR reduce the [EF] activation cost of an equipped [Complex] item by [-1 EF].',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  character: 'Specialist Operatives',
  item: 'Armory Equipment',
  faction: 'Faction Dossiers',
  hq_facility: 'HQ Sponsored Facilities',
  hq_landmark: 'HQ Standalone Landmarks',
  perk: 'Multi-Tier Perk Doctrines',
  agenda: 'Open Agendas',
  secret_objective: 'Secret Objectives',
  modifier: 'Stage Modifiers',
  campaign: 'Campaign Dossiers',
  mission: 'Campaign Mission Briefs',
  side_mission: 'Themed Side-Missions',
};

export function WikiPortal({ coreRules, components, artManifest }: WikiPortalProps) {
  const [activeSection, setActiveSection] = useState<PortalSection>('rulebook');
  const [selectedRuleSlug, setSelectedRuleSlug] = useState<string>(
    coreRules[0]?.slug || 'rules_overview'
  );
  const [selectedComponentId, setSelectedComponentId] = useState<string>(
    components[0]?.id || 'agent-01-commander'
  );
  const [selectedFocusKey, setSelectedFocusKey] = useState<string>('combat');
  const [selectedClassKey, setSelectedClassKey] = useState<string>('soldier');

  const [searchQuery, setSearchQuery] = useState('');
  const [focusFilter, setFocusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');

  // Synchronize with URL hash (#/wiki/...) for true multi-page Wiki navigation
  useEffect(() => {
    const applyHashRoute = (rawHash: string) => {
      const h = (rawHash || window.location.hash || '').replace(/^#/, '');
      if (!h.startsWith('/wiki')) return;

      const [pathPart, queryPart] = h.slice(6).split('?'); // remove '/wiki/'
      const segs = pathPart.split('/').filter(Boolean);
      const params = new URLSearchParams(queryPart || '');

      if (segs[0] === 'rule' && segs[1]) {
        setActiveSection('rulebook');
        setSelectedRuleSlug(segs[1]);
      } else if (segs[0] === 'component' && segs[1]) {
        setActiveSection('component_page');
        setSelectedComponentId(segs[1]);
      } else if (segs[0] === 'focus' && segs[1]) {
        setActiveSection('focus_page');
        setSelectedFocusKey(segs[1].toLowerCase());
      } else if (segs[0] === 'class' && segs[1]) {
        setActiveSection('class_page');
        setSelectedClassKey(segs[1].toLowerCase());
      } else if (segs[0] === 'concept' && segs[1] === 'currencies') {
        setActiveSection('currencies_guide');
      } else if (segs[0] === 'database' && segs[1]) {
        setActiveSection(segs[1] as PortalSection);
        const slotParam = params.get('slot');
        const focusParam = params.get('focus');
        setSubCategoryFilter(slotParam || 'all');
        setFocusFilter(focusParam || 'all');
      }
    };

    applyHashRoute(window.location.hash);

    const onHashChange = () => applyHashRoute(window.location.hash);
    const onCustomWikiNav = (e: Event) => {
      const custom = e as CustomEvent<string>;
      applyHashRoute(custom.detail);
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('wiki:navigate', onCustomWikiNav);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('wiki:navigate', onCustomWikiNav);
    };
  }, []);

  const activeRuleIndex = useMemo(
    () => Math.max(0, coreRules.findIndex((r) => r.slug === selectedRuleSlug)),
    [coreRules, selectedRuleSlug]
  );
  const activeRule = coreRules[activeRuleIndex] || coreRules[0];

  const activeComponent = useMemo(
    () => components.find((c) => c.id === selectedComponentId) || components[0],
    [components, selectedComponentId]
  );

  // Compute sibling components in the same category for Prev/Next Wiki navigation
  const categorySiblings = useMemo(() => {
    if (!activeComponent) return [];
    return components.filter((c) => c.component_type === activeComponent.component_type);
  }, [components, activeComponent]);

  const siblingIndex = useMemo(
    () => categorySiblings.findIndex((c) => c.id === activeComponent?.id),
    [categorySiblings, activeComponent]
  );

  // Compute Related / Backlinked Components for the current Component Wiki Page
  const relatedForComponent = useMemo(() => {
    if (!activeComponent) return { sameGroup: [], focusMatches: [], childOrParent: [] };

    const pFocus = activeComponent.focus_affinity?.primary?.toLowerCase();
    const sFocus = activeComponent.focus_affinity?.secondary?.toLowerCase();

    const sameGroup = components
      .filter(
        (c) =>
          c.id !== activeComponent.id &&
          c.component_type === activeComponent.component_type &&
          (activeComponent.category ? c.category === activeComponent.category : true)
      )
      .slice(0, 6);

    const focusMatches = pFocus
      ? components
          .filter(
            (c) =>
              c.id !== activeComponent.id &&
              c.component_type !== activeComponent.component_type &&
              (c.focus_affinity?.primary?.toLowerCase() === pFocus ||
                c.focus_affinity?.secondary?.toLowerCase() === pFocus ||
                (sFocus && c.focus_affinity?.primary?.toLowerCase() === sFocus))
          )
          .slice(0, 8)
      : [];

    // Campaign <-> Mission links
    let childOrParent: GameComponent[] = [];
    if (activeComponent.component_type === 'campaign') {
      const prefix = activeComponent.id.replace('campaign-', 'mission-');
      childOrParent = components.filter((c) => c.id.startsWith(prefix));
    } else if (activeComponent.component_type === 'mission') {
      const isIronDawn = activeComponent.id.includes('iron-dawn');
      const campId = isIronDawn ? 'campaign-iron-dawn' : 'campaign-apex-extraction';
      childOrParent = components.filter(
        (c) =>
          c.id === campId ||
          (c.component_type === 'mission' &&
            c.id !== activeComponent.id &&
            c.id.includes(isIronDawn ? 'iron-dawn' : 'apex-extraction'))
      );
    }

    return { sameGroup, focusMatches, childOrParent };
  }, [components, activeComponent]);

  // Filter components for database views
  const filteredComponents = useMemo(() => {
    return components.filter((c) => {
      if (activeSection === 'character' && c.component_type !== 'character') return false;
      if (activeSection === 'item' && c.component_type !== 'item') return false;
      if (activeSection === 'faction' && c.component_type !== 'faction') return false;
      if (
        activeSection === 'hq' &&
        c.component_type !== 'hq_facility' &&
        c.component_type !== 'hq_landmark'
      ) {
        return false;
      }
      if (activeSection === 'perk' && c.component_type !== 'perk') return false;
      if (activeSection === 'agenda' && c.component_type !== 'agenda') return false;
      if (activeSection === 'secret_objective' && c.component_type !== 'secret_objective')
        return false;
      if (activeSection === 'modifier' && c.component_type !== 'modifier') return false;
      if (
        activeSection === 'campaign_mission' &&
        !['campaign', 'mission', 'side_mission'].includes(c.component_type)
      ) {
        return false;
      }

      if (focusFilter !== 'all') {
        const p = c.focus_affinity?.primary?.toLowerCase();
        const s = c.focus_affinity?.secondary?.toLowerCase();
        const b = (c.focus_affinity?.bridges || []).map((x) => x.toLowerCase());
        if (p !== focusFilter && s !== focusFilter && !b.includes(focusFilter)) {
          return false;
        }
      }

      if (tierFilter !== 'all') {
        if (String(c.tier) !== tierFilter) return false;
      }

      if (subCategoryFilter !== 'all') {
        if (c.category !== subCategoryFilter) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = [
          c.id,
          c.title,
          c.category,
          c.rules_text,
          c.art_spec?.visual_description,
          ...(c.tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [components, activeSection, focusFilter, tierFilter, subCategoryFilter, searchQuery]);

  const availableSubCategories = useMemo(() => {
    const set = new Set<string>();
    for (const c of components) {
      if (activeSection === 'character' && c.component_type !== 'character') continue;
      if (activeSection === 'item' && c.component_type !== 'item') continue;
      if (c.category) set.add(c.category);
    }
    return Array.from(set).sort();
  }, [components, activeSection]);

  const handleDownloadJson = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const mapDatabaseSection = (type: string): PortalSection => {
    if (type === 'hq_facility' || type === 'hq_landmark') return 'hq';
    if (['campaign', 'mission', 'side_mission'].includes(type)) return 'campaign_mission';
    return type as PortalSection;
  };

  return (
    <div className="wiki-shell">
      {/* Sidebar Navigation */}
      <aside className="wiki-sidebar">
        {/* Global Quick Search */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="search"
            placeholder="🔍 Quick jump / search 200 cards..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (
                ['rulebook', 'currencies_guide', 'focus_page', 'class_page', 'component_page'].includes(
                  activeSection
                )
              ) {
                setActiveSection('all');
              }
            }}
            style={{
              width: '100%',
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-void)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
            }}
          />
        </div>

        {/* 1. Core Rulebook */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            marginBottom: '0.4rem',
          }}
        >
          1. Core Rulebook (/game/core)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1.1rem' }}>
          <button
            type="button"
            onClick={() => navigateWiki('#/wiki/concept/currencies')}
            style={{
              textAlign: 'left',
              padding: '0.42rem 0.6rem',
              borderRadius: '6px',
              border:
                activeSection === 'currencies_guide'
                  ? '1px solid var(--currency-credits)'
                  : '1px solid transparent',
              background:
                activeSection === 'currencies_guide'
                  ? 'rgba(255, 215, 0, 0.12)'
                  : 'transparent',
              color:
                activeSection === 'currencies_guide'
                  ? 'var(--currency-credits)'
                  : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: activeSection === 'currencies_guide' ? 700 : 600,
              cursor: 'pointer',
            }}
          >
            ★ Currencies vs. States & Trackers
          </button>

          {coreRules.map((ch) => {
            const isCurrent = activeSection === 'rulebook' && selectedRuleSlug === ch.slug;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => navigateWiki(`#/wiki/rule/${ch.slug}`)}
                style={{
                  textAlign: 'left',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  border: isCurrent ? '1px solid var(--currency-effort)' : '1px solid transparent',
                  background: isCurrent ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
                  color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: isCurrent ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {ch.title.replace(/^AWAY TEAM —\s*/i, '')}
              </button>
            );
          })}
        </div>

        {/* 2. Component Databases */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            marginBottom: '0.4rem',
          }}
        >
          2. Wiki Component Databases ({components.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1.1rem' }}>
          {(
            [
              ['all', `All Components (${components.length})`],
              ['character', 'Specialist Operatives (24)'],
              ['item', 'Armory Database (87)'],
              ['faction', 'Faction Dossiers (8)'],
              ['hq', 'HQ Facilities & Landmarks (9)'],
              ['perk', 'Multi-Tier Perks (12)'],
              ['agenda', 'Open Agendas (24)'],
              ['secret_objective', 'Secret Objectives (10)'],
              ['modifier', 'Stage Modifiers (12)'],
              ['campaign_mission', 'Campaigns & Missions (14)'],
              ['art_pipeline', '🎨 Art Manifest Pipeline (200)'],
            ] as [PortalSection, string][]
          ).map(([secKey, label]) => {
            const isCurrent = activeSection === secKey;
            return (
              <button
                key={secKey}
                type="button"
                onClick={() => navigateWiki(`#/wiki/database/${secKey}`)}
                style={{
                  textAlign: 'left',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  border: isCurrent ? '1px solid var(--border-strong)' : '1px solid transparent',
                  background: isCurrent ? 'var(--bg-card)' : 'transparent',
                  color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: isCurrent ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 3. Clickable Focus & Class Hubs */}
        <div
          style={{
            padding: '0.8rem',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              marginBottom: '0.45rem',
              color: 'var(--text-primary)',
            }}
          >
            FOCUS WIKI HUBS (50 / 35 / 15)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
            <FocusBadge focus="combat" />
            <FocusBadge focus="infiltrate" />
            <FocusBadge focus="intel" />
            <FocusBadge focus="operations" />
            <FocusBadge focus="negotiate" />
            <FocusBadge focus="survival" />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              marginBottom: '0.4rem',
              color: 'var(--text-primary)',
            }}
          >
            6 SPECIALIST CLASSES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
            {Object.entries(CLASS_META).map(([k, v]) => (
              <button
                key={k}
                type="button"
                className="wiki-inline-link"
                onClick={() => navigateWiki(`#/wiki/class/${k}`)}
              >
                {v.name}
              </button>
            ))}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              marginBottom: '0.3rem',
              color: 'var(--text-primary)',
            }}
          >
            PRIMARY VAULT CURRENCIES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.6rem' }}>
            <SemanticText text="[CR]" />
            <SemanticText text="[EF]" />
            <SemanticText text="[PIP]" />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              marginBottom: '0.3rem',
              color: 'var(--text-primary)',
            }}
          >
            STATES, REWARDS & TRACKERS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            <SemanticText text="[MOM]" />
            <SemanticText text="[LOY]" />
            <SemanticText text="[DOOM]" />
            <SemanticText text="[VP]" />
          </div>
        </div>
      </aside>

      {/* Main Wiki Viewport */}
      <main className="wiki-main">
        {/* ====================================================================
            VIEW 1: DEDICATED COMPONENT WIKI PAGE (#/wiki/component/<id>)
           ==================================================================== */}
        {activeSection === 'component_page' && activeComponent && (
          <div>
            {/* Breadcrumb & Prev/Next Bar */}
            <nav className="wiki-breadcrumbs">
              <button
                type="button"
                className="wiki-breadcrumb-btn"
                onClick={() => navigateWiki('#/wiki/database/all')}
              >
                Wiki Database
              </button>
              <span>›</span>
              <button
                type="button"
                className="wiki-breadcrumb-btn"
                onClick={() =>
                  navigateWiki(
                    `#/wiki/database/${mapDatabaseSection(activeComponent.component_type)}`
                  )
                }
              >
                {CATEGORY_LABELS[activeComponent.component_type] ||
                  activeComponent.component_type}
              </button>
              {activeComponent.category && (
                <>
                  <span>›</span>
                  <button
                    type="button"
                    className="wiki-breadcrumb-btn"
                    onClick={() =>
                      activeComponent.component_type === 'character'
                        ? navigateWiki(`#/wiki/class/${activeComponent.category}`)
                        : navigateWiki(
                            `#/wiki/database/${mapDatabaseSection(
                              activeComponent.component_type
                            )}?slot=${activeComponent.category}`
                          )
                    }
                  >
                    {activeComponent.category.replace(/_/g, ' ').toUpperCase()}
                  </button>
                </>
              )}
              <span>›</span>
              <strong style={{ color: 'var(--text-primary)' }}>{activeComponent.title}</strong>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem' }}>
                {siblingIndex > 0 && (
                  <button
                    type="button"
                    className="vtt-btn"
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                    onClick={() =>
                      navigateWiki(`#/wiki/component/${categorySiblings[siblingIndex - 1].id}`)
                    }
                  >
                    ← {categorySiblings[siblingIndex - 1].title.split('(')[0].trim()}
                  </button>
                )}
                {siblingIndex >= 0 && siblingIndex < categorySiblings.length - 1 && (
                  <button
                    type="button"
                    className="vtt-btn"
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                    onClick={() =>
                      navigateWiki(`#/wiki/component/${categorySiblings[siblingIndex + 1].id}`)
                    }
                  >
                    {categorySiblings[siblingIndex + 1].title.split('(')[0].trim()} →
                  </button>
                )}
              </div>
            </nav>

            {/* 2-Column Wiki Article + Infobox */}
            <div className="wiki-entity-layout">
              {/* Left Column: Full Wiki Article */}
              <div className="rulebook-article">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>WIKI ENTITY ID: {activeComponent.id}</span>
                  <span>SOURCE: /{activeComponent.source_path}</span>
                </div>

                {/* Quick Summary Callout */}
                {activeComponent.rules_text && (
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      borderLeft: '4px solid var(--currency-effort)',
                      marginBottom: '1.25rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--currency-effort)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      CARD RULES SUMMARY
                    </div>
                    <SemanticText text={activeComponent.rules_text} />
                  </div>
                )}

                <MarkdownRenderer content={activeComponent.body || ''} />

                {/* See Also & Cross-Referenced Wiki Pages */}
                <div className="wiki-related-section">
                  <h2>See Also & Cross-Referenced Wiki Pages</h2>

                  {relatedForComponent.childOrParent.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          color: 'var(--currency-credits)',
                        }}
                      >
                        LINKED CAMPAIGN & MISSION SEQUENCE
                      </div>
                      <div className="wiki-chip-list">
                        {relatedForComponent.childOrParent.map((rel) => (
                          <button
                            key={rel.id}
                            type="button"
                            className="wiki-chip-link"
                            onClick={() => navigateWiki(`#/wiki/component/${rel.id}`)}
                          >
                            <span>📋 {rel.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedForComponent.sameGroup.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        OTHER{' '}
                        {(
                          activeComponent.category || activeComponent.component_type
                        )
                          .replace(/_/g, ' ')
                          .toUpperCase()}{' '}
                        PAGES
                      </div>
                      <div className="wiki-chip-list">
                        {relatedForComponent.sameGroup.map((rel) => (
                          <button
                            key={rel.id}
                            type="button"
                            className="wiki-chip-link"
                            onClick={() => navigateWiki(`#/wiki/component/${rel.id}`)}
                          >
                            <span>{rel.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedForComponent.focusMatches.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        SYNERGISTIC COMPONENTS SHARING{' '}
                        {activeComponent.focus_affinity?.primary?.toUpperCase()} AFFINITY
                      </div>
                      <div className="wiki-chip-list">
                        {relatedForComponent.focusMatches.map((rel) => (
                          <button
                            key={rel.id}
                            type="button"
                            className="wiki-chip-link"
                            onClick={() => navigateWiki(`#/wiki/component/${rel.id}`)}
                          >
                            <span style={{ opacity: 0.65, fontSize: '0.7rem' }}>
                              [{rel.component_type}]
                            </span>
                            <span>{rel.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Wiki Infobox Sidebar */}
              <aside className="wiki-infobox">
                <div className="wiki-infobox-header">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--currency-effort)',
                      textTransform: 'uppercase',
                    }}
                  >
                    WIKI COMPONENT INFOBOX
                  </div>
                  <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.05rem' }}>
                    {activeComponent.title}
                  </h3>
                </div>

                {/* Art Spec Preview */}
                <div className="at-card-art-frame">
                  <div className="at-card-art-meta">
                    <span>ART SPEC ({activeComponent.art_spec.aspect_ratio})</span>
                    <span>{activeComponent.art_spec.asset_path}</span>
                  </div>
                  <p className="at-card-art-prompt" style={{ WebkitLineClamp: 6 }}>
                    “{activeComponent.art_spec.visual_description}”
                  </p>
                </div>

                <table className="wiki-infobox-table">
                  <tbody>
                    <tr>
                      <th>Type</th>
                      <td>
                        <button
                          type="button"
                          className="wiki-inline-link"
                          onClick={() =>
                            navigateWiki(
                              `#/wiki/database/${mapDatabaseSection(
                                activeComponent.component_type
                              )}`
                            )
                          }
                        >
                          {CATEGORY_LABELS[activeComponent.component_type] ||
                            activeComponent.component_type}
                        </button>
                      </td>
                    </tr>
                    {activeComponent.category && (
                      <tr>
                        <th>Class / Slot</th>
                        <td>
                          <button
                            type="button"
                            className="wiki-inline-link"
                            onClick={() =>
                              activeComponent.component_type === 'character'
                                ? navigateWiki(`#/wiki/class/${activeComponent.category}`)
                                : navigateWiki(
                                    `#/wiki/database/${mapDatabaseSection(
                                      activeComponent.component_type
                                    )}?slot=${activeComponent.category}`
                                  )
                            }
                          >
                            {activeComponent.category.replace(/_/g, ' ')}
                          </button>
                        </td>
                      </tr>
                    )}
                    {activeComponent.tier != null && (
                      <tr>
                        <th>Tier</th>
                        <td>Tier {activeComponent.tier}</td>
                      </tr>
                    )}
                    <tr>
                      <th>Cost</th>
                      <td>
                        {(activeComponent.cost?.credits ?? 0) > 0 && (
                          <SemanticText text={`[${activeComponent.cost?.credits} CR]`} />
                        )}
                        {(activeComponent.cost?.effort ?? 0) > 0 && (
                          <SemanticText text={`[${activeComponent.cost?.effort} EF]`} />
                        )}
                        {(activeComponent.cost?.pip ?? 0) > 0 && (
                          <SemanticText text={`[${activeComponent.cost?.pip} PIP]`} />
                        )}
                        {(activeComponent.cost?.credits ?? 0) === 0 &&
                          (activeComponent.cost?.effort ?? 0) === 0 &&
                          (activeComponent.cost?.pip ?? 0) === 0 && <span>—</span>}
                      </td>
                    </tr>
                    {(activeComponent.focus_affinity?.primary ||
                      activeComponent.focus_affinity?.secondary) && (
                      <tr>
                        <th>Focus Affinity</th>
                        <td style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {activeComponent.focus_affinity?.primary && (
                            <FocusBadge
                              focus={activeComponent.focus_affinity.primary}
                              roleLabel="1° (3+)"
                            />
                          )}
                          {activeComponent.focus_affinity?.secondary && (
                            <FocusBadge
                              focus={activeComponent.focus_affinity.secondary}
                              roleLabel="2° (4+)"
                            />
                          )}
                        </td>
                      </tr>
                    )}
                    {activeComponent.stats?.hp_cap != null && (
                      <tr>
                        <th>Health Cap</th>
                        <td>♥ {activeComponent.stats.hp_cap} HP</td>
                      </tr>
                    )}
                    {activeComponent.stats?.static_dice != null && (
                      <tr>
                        <th>Static Dice Pool</th>
                        <td>🎲 {activeComponent.stats.static_dice} d6</td>
                      </tr>
                    )}
                    {activeComponent.stats?.es_budget != null && (
                      <tr>
                        <th>ES Balance Budget</th>
                        <td>⚡ {activeComponent.stats.es_budget} ES</td>
                      </tr>
                    )}
                    {activeComponent.stats?.slots_required &&
                      activeComponent.stats.slots_required.length > 0 && (
                        <tr>
                          <th>Slots Required</th>
                          <td>
                            <SemanticText
                              text={activeComponent.stats.slots_required
                                .map((s) => `[${s}]`)
                                .join(' + ')}
                            />
                          </td>
                        </tr>
                      )}
                    {activeComponent.tags && activeComponent.tags.length > 0 && (
                      <tr>
                        <th>Tags</th>
                        <td style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {activeComponent.tags.map((t) => (
                            <span key={t} className="stat-pill" style={{ fontSize: '0.68rem' }}>
                              #{t}
                            </span>
                          ))}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </aside>
            </div>
          </div>
        )}

        {/* ====================================================================
            VIEW 2: CURRENCIES vs. MISSION STATES, REWARDS & TRACKERS PAGE
           ==================================================================== */}
        {activeSection === 'currencies_guide' && (
          <div className="rulebook-article">
            <nav className="wiki-breadcrumbs">
              <button
                type="button"
                className="wiki-breadcrumb-btn"
                onClick={() => navigateWiki('#/wiki/rule/rules_overview')}
              >
                Core Rulebook
              </button>
              <span>›</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                Currencies vs. Mission States, Operative Rewards & Meta Trackers
              </strong>
            </nav>

            <h1>Currencies, Mission States, Operative Rewards & Meta Trackers</h1>
            <p>
              In <strong>Away Team</strong>, not every badge or number is a currency. To make the rules
              and tabletop bookkeeping intuitive, the game divides its semantic metrics into{' '}
              <strong>four distinct categories</strong> based on where they live and how they behave:
            </p>

            <h2>1. The Three Primary Vault Currencies (Spendable Assets)</h2>
            <p>
              These three resources are stored directly in your <strong>Faction Vault</strong> on your
              player dashboard. You earn them, store them between missions, and spend them to pay costs:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Primary Currency</th>
                  <th>Badge</th>
                  <th>Tradeable Between Players?</th>
                  <th>How You Earn & Spend It</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Credits</strong>
                  </td>
                  <td>
                    <SemanticText text="[CR]" />
                  </td>
                  <td>
                    <strong>Yes</strong> (via Binding Promises)
                  </td>
                  <td>
                    Earned from stage clears, Open Agendas, and salvage powers. Spent to hire
                    operatives (<SemanticText text="[8 CR]" />), purchase gear at the{' '}
                    <SemanticText text="Quartermaster" />, sponsor HQ modules, and bid in the{' '}
                    <SemanticText text="Command Auction" />.
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Effort</strong>
                  </td>
                  <td>
                    <SemanticText text="[EF]" />
                  </td>
                  <td>
                    <strong>No</strong> (Vault-Bound)
                  </td>
                  <td>
                    Tactical energy stored in your Vault. Spent during missions to trigger any{' '}
                    <SemanticText text="[1 EF]" /> Class Ability, activate{' '}
                    <SemanticText text="[Complex]" /> hardware, execute Squad Leader Focus Swaps (
                    <SemanticText text="Force Breach" /> / <SemanticText text="Tactical Bypass" />), or
                    fund a <SemanticText text="Logistical Refresh" />.
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Political Influence</strong>
                  </td>
                  <td>
                    <SemanticText text="[PIP]" />
                  </td>
                  <td>
                    <strong>No</strong> (Vault-Bound)
                  </td>
                  <td>
                    Executive boardroom leverage. Spent to sponsor high-tier HQ modules & Landmarks,
                    pay the <SemanticText text="Vulture Tax" /> (<SemanticText text="[-1 PIP]" /> per 2
                    looted items), break Command Auction ties, and converts into{' '}
                    <SemanticText text="[2 VP]" /> per <SemanticText text="[1 PIP]" /> at endgame.
                  </td>
                </tr>
              </tbody>
            </table>

            <h2>2. Transient In-Mission Tactical Flow (Only During a Mission)</h2>
            <p>
              <strong>Operational Momentum</strong> (<SemanticText text="[MOM]" />) is{' '}
              <strong>not a Vault currency</strong> and is never carried back to Headquarters:
            </p>
            <ul>
              <li>
                <strong>When It Triggers:</strong> Earned <em>only during an active mission</em> when
                the squad clears a Stage by a margin of <strong>+2 or more successes</strong> above
                Target Difficulty (<SemanticText text="[+1 MOM]" />).
              </li>
              <li>
                <strong>What It Does:</strong> Immediately refunds <strong>1 spent static die</strong>{' '}
                from an operative’s exhausted pool back into their active pool, and triggers
                Momentum-reactive abilities (such as <SemanticText text="Aegis Tactical Directorate" />{' '}
                base power or <SemanticText text="Overwhelming Force" />). All Momentum resets at
                mission extraction.
              </li>
            </ul>

            <h2>3. Operative Progression Reward (Character-Bound Rank — Non-Tradeable)</h2>
            <p>
              <strong>Loyalty</strong> (<SemanticText text="[LOY]" />) is a{' '}
              <strong>personal progression reward attached to a specific Specialist Operative card</strong>
              —it is never spent or traded like money:
            </p>
            <ul>
              <li>
                <strong>How It Is Earned:</strong> Every operative who survives a mission earns{' '}
                <SemanticText text="[+1 LOY]" /> (and a victorious Squad Leader’s operative earns{' '}
                <SemanticText text="[+2 LOY]" /> total).
              </li>
              <li>
                <strong>What It Unlocks:</strong> As an operative’s rank climbs across{' '}
                <strong>Tier 1</strong> (<SemanticText text="[1 LOY]" />), <strong>Tier 2</strong> (
                <SemanticText text="[3 LOY]" />), <strong>Tier 3</strong> (
                <SemanticText text="[6 LOY]" />), and <strong>Tier 4 Corporate Icon</strong> (
                <SemanticText text="[10+ LOY]" />), they permanently unlock their Faction’s Loyalty Tree
                powers and Multi-Tier Perk doctrines. At campaign end, every{' '}
                <SemanticText text="[1 LOY]" /> on your living and Dead Pool operatives scores{' '}
                <SemanticText text="[2 VP]" />.
              </li>
            </ul>

            <h2>4. Macro-Campaign & Endgame Meta Trackers (Not Currencies)</h2>
            <p>
              These two trackers measure the macro state of the campaign and final victory—they are{' '}
              <strong>never owned as spendable currencies</strong>:
            </p>
            <ul>
              <li>
                <SemanticText text="[DOOM]" /> <strong>(The Doom Tracker — Meta Catastrophe Clock):</strong>{' '}
                Tracked globally on the active Campaign Dossier (<SemanticText text="Operation: Iron Dawn" />{' '}
                or <SemanticText text="Operation: Apex Extraction" />). Whenever a mission fails or the
                squad is wiped out, the clock advances by <SemanticText text="[+1 DOOM]" />. If it
                reaches the campaign’s Max Doom threshold, the entire coalition loses immediately.
              </li>
              <li>
                <SemanticText text="[VP]" /> <strong>(Victory Points — Endgame Supremacy Score):</strong>{' '}
                Your corporate supremacy score tracker. Accumulated from Sponsored HQ Modules (
                <SemanticText text="[+2 VP]" /> each), <SemanticText text="Open Agendas" />,{' '}
                <SemanticText text="Secret Objectives" /> (<SemanticText text="[15 VP]" /> /{' '}
                <SemanticText text="[10 VP]" /> / <SemanticText text="[5 VP]" />), Tier 4 Corporate
                Icons (<SemanticText text="[+3 VP]" />), and final Vault audits to crown the winning
                Director.
              </li>
            </ul>
          </div>
        )}

        {/* ====================================================================
            VIEW 3: DEDICATED FOCUS WIKI HUB (#/wiki/focus/<focusKey>)
           ==================================================================== */}
        {activeSection === 'focus_page' && FOCUS_META[selectedFocusKey] && (
          <div className="rulebook-article">
            <nav className="wiki-breadcrumbs">
              <button
                type="button"
                className="wiki-breadcrumb-btn"
                onClick={() => navigateWiki('#/wiki/rule/classes_and_focus')}
              >
                Classes & Focus Pyramid
              </button>
              <span>›</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {FOCUS_META[selectedFocusKey].name} Focus Hub
              </strong>
            </nav>

            <h1>
              <FocusBadge focus={selectedFocusKey} /> Focus Wiki Hub
            </h1>
            <p>
              <strong>Pyramid Share:</strong> {FOCUS_META[selectedFocusKey].pyramidShare} •{' '}
              <strong>Operational Domain:</strong> {FOCUS_META[selectedFocusKey].tierRole}
            </p>
            <p>{FOCUS_META[selectedFocusKey].summary}</p>

            <h2>
              Primary {FOCUS_META[selectedFocusKey].name} Specialists (Hit on 3+)
            </h2>
            <div className="wiki-chip-list" style={{ marginBottom: '1.25rem' }}>
              {components
                .filter(
                  (c) =>
                    c.component_type === 'character' &&
                    c.focus_affinity?.primary?.toLowerCase() === selectedFocusKey
                )
                .map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    className="wiki-chip-link"
                    onClick={() => navigateWiki(`#/wiki/component/${op.id}`)}
                  >
                    <span>👤 {op.title}</span>
                  </button>
                ))}
            </div>

            <h2>
              Secondary {FOCUS_META[selectedFocusKey].name} Specialists (Hit on 4+)
            </h2>
            <div className="wiki-chip-list" style={{ marginBottom: '1.25rem' }}>
              {components
                .filter(
                  (c) =>
                    c.component_type === 'character' &&
                    c.focus_affinity?.secondary?.toLowerCase() === selectedFocusKey
                )
                .map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    className="wiki-chip-link"
                    onClick={() => navigateWiki(`#/wiki/component/${op.id}`)}
                  >
                    <span>👤 {op.title}</span>
                  </button>
                ))}
            </div>

            <h2>
              Armory Gear, Perks & Agendas Linked to {FOCUS_META[selectedFocusKey].name}
            </h2>
            <div className="card-grid" style={{ marginTop: '1rem' }}>
              {components
                .filter(
                  (c) =>
                    c.component_type !== 'character' &&
                    (c.focus_affinity?.primary?.toLowerCase() === selectedFocusKey ||
                      c.focus_affinity?.secondary?.toLowerCase() === selectedFocusKey)
                )
                .map((comp) => (
                  <ComponentCard
                    key={comp.id}
                    item={comp}
                    onSelect={(item) => navigateWiki(`#/wiki/component/${item.id}`)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            VIEW 4: DEDICATED CLASS WIKI HUB (#/wiki/class/<classKey>)
           ==================================================================== */}
        {activeSection === 'class_page' && CLASS_META[selectedClassKey] && (
          <div className="rulebook-article">
            <nav className="wiki-breadcrumbs">
              <button
                type="button"
                className="wiki-breadcrumb-btn"
                onClick={() => navigateWiki('#/wiki/rule/classes_and_focus')}
              >
                Classes & Focus Pyramid
              </button>
              <span>›</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {CLASS_META[selectedClassKey].name} Class Hub
              </strong>
            </nav>

            <h1>{CLASS_META[selectedClassKey].name} Class Dossier (4 Operatives)</h1>
            <p>
              <strong>Signature Class Ability ({CLASS_META[selectedClassKey].abilityName}):</strong>{' '}
              Costs <SemanticText text={CLASS_META[selectedClassKey].cost} /> •{' '}
              <SemanticText text={CLASS_META[selectedClassKey].effect} />
            </p>
            <p>
              <strong>9.0 ES Budget Offset:</strong>{' '}
              <code>{CLASS_META[selectedClassKey].offsetEs} ES</code> (Leaving{' '}
              <code>{9.0 - CLASS_META[selectedClassKey].offsetEs} ES</code> for HP, Static Dice, and
              Unique Operative Power).
            </p>

            <h2>All 4 {CLASS_META[selectedClassKey].name} Operatives</h2>
            <div className="card-grid" style={{ marginTop: '1rem' }}>
              {components
                .filter(
                  (c) =>
                    c.component_type === 'character' && c.category === selectedClassKey
                )
                .map((op) => (
                  <ComponentCard
                    key={op.id}
                    item={op}
                    onSelect={(item) => navigateWiki(`#/wiki/component/${item.id}`)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            VIEW 5: CORE RULEBOOK CHAPTER PAGE (#/wiki/rule/<slug>)
           ==================================================================== */}
        {activeSection === 'rulebook' && activeRule && (
          <div className="rulebook-article">
            <nav className="wiki-breadcrumbs">
              <span>Core Rulebook</span>
              <span>›</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                Chapter {activeRuleIndex + 1}: {activeRule.title}
              </strong>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem' }}>
                {activeRuleIndex > 0 && (
                  <button
                    type="button"
                    className="vtt-btn"
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                    onClick={() =>
                      navigateWiki(`#/wiki/rule/${coreRules[activeRuleIndex - 1].slug}`)
                    }
                  >
                    ← {coreRules[activeRuleIndex - 1].title}
                  </button>
                )}
                {activeRuleIndex < coreRules.length - 1 && (
                  <button
                    type="button"
                    className="vtt-btn"
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                    onClick={() =>
                      navigateWiki(`#/wiki/rule/${coreRules[activeRuleIndex + 1].slug}`)
                    }
                  >
                    {coreRules[activeRuleIndex + 1].title} →
                  </button>
                )}
              </div>
            </nav>

            <MarkdownRenderer content={activeRule.body} />
          </div>
        )}

        {/* ====================================================================
            VIEW 6: ART PIPELINE MANIFEST INSPECTOR
           ==================================================================== */}
        {activeSection === 'art_pipeline' && (
          <div className="vtt-panel">
            <div className="vtt-panel-title">
              <span>Automated Asset & Image-Generation Manifest ({artManifest.length} Art Specs)</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="vtt-btn vtt-btn-primary"
                  onClick={() =>
                    handleDownloadJson('image_generation_manifest.json', artManifest)
                  }
                >
                  ⬇ Download image_generation_manifest.json
                </button>
                <button
                  type="button"
                  className="vtt-btn"
                  onClick={() => handleDownloadJson('all_components.json', components)}
                >
                  ⬇ Download all_components.json
                </button>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 0 }}>
              Click any component ID below to open its dedicated Wiki page.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card)', textAlign: 'left' }}>
                    <th style={{ padding: '0.55rem', border: '1px solid var(--border-subtle)' }}>Wiki Page</th>
                    <th style={{ padding: '0.55rem', border: '1px solid var(--border-subtle)' }}>Type</th>
                    <th style={{ padding: '0.55rem', border: '1px solid var(--border-subtle)' }}>Aspect</th>
                    <th style={{ padding: '0.55rem', border: '1px solid var(--border-subtle)' }}>Target Asset Path</th>
                    <th style={{ padding: '0.55rem', border: '1px solid var(--border-subtle)' }}>Visual Description Prompt</th>
                  </tr>
                </thead>
                <tbody>
                  {artManifest.map((entry) => (
                    <tr key={entry.id}>
                      <td style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>
                        <button
                          type="button"
                          className="wiki-inline-link"
                          onClick={() => navigateWiki(`#/wiki/component/${entry.id}`)}
                        >
                          {entry.title}
                        </button>
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)' }}>
                        {entry.component_type}
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>
                        {entry.aspect_ratio}
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                        {entry.asset_path}
                      </td>
                      <td style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)', color: '#cbd5e1' }}>
                        {entry.visual_description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====================================================================
            VIEW 7: FILTERABLE COMPONENT DATABASE BROWSE VIEWS
           ==================================================================== */}
        {![
          'rulebook',
          'currencies_guide',
          'focus_page',
          'class_page',
          'component_page',
          'art_pipeline',
        ].includes(activeSection) && (
          <div>
            <div
              className="vtt-panel"
              style={{
                marginBottom: '1.25rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', flex: 1 }}>
                <input
                  type="search"
                  placeholder="Filter cards by name, ID, rules, tags, or art prompt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    minWidth: '240px',
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-void)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                  }}
                />

                <select
                  value={focusFilter}
                  onChange={(e) => setFocusFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-void)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                  }}
                >
                  <option value="all">All Focus Affinities</option>
                  <option value="combat">[Combat]</option>
                  <option value="infiltrate">[Infiltrate]</option>
                  <option value="intel">[Intel]</option>
                  <option value="operations">[Operations]</option>
                  <option value="negotiate">[Negotiate]</option>
                  <option value="survival">[Survival]</option>
                </select>

                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-void)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                  }}
                >
                  <option value="all">All Tiers</option>
                  <option value="1">Tier 1</option>
                  <option value="2">Tier 2</option>
                  <option value="3">Tier 3</option>
                  <option value="4">Tier 4</option>
                </select>

                {availableSubCategories.length > 1 && (
                  <select
                    value={subCategoryFilter}
                    onChange={(e) => setSubCategoryFilter(e.target.value)}
                    style={{
                      padding: '0.5rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-strong)',
                      background: 'var(--bg-void)',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <option value="all">All Classes / Slots</option>
                    {availableSubCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--currency-effort)',
                }}
              >
                Showing {filteredComponents.length} of {components.length} Wiki pages
              </div>
            </div>

            <div className="card-grid">
              {filteredComponents.map((comp) => (
                <ComponentCard
                  key={comp.id}
                  item={comp}
                  onSelect={(c) => navigateWiki(`#/wiki/component/${c.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
