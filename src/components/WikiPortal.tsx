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
  onLaunchVTT?: () => void;
}

type PortalSection =
  | 'home'
  | 'print_rulebook'
  | 'design_backlog'
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
    pyramidShare: '35% Combined Utility Pillar (Tier 2 Specialist Focus)',
    tierRole: 'Stealth Insertion, Mag-Lock Bypass, Covert Recon & Sabotage',
    summary:
      'Infiltrate governs stealthy entry vectors, security sensor evasion, and covert extraction routes. Squad Leaders can declare a Tactical Bypass to shift a [Combat] stage into [Infiltrate].',
  },
  intel: {
    name: 'Intel',
    token: '[Intel]',
    pyramidShare: '35% Combined Utility Pillar (Tier 2 Specialist Focus)',
    tierRole: 'Mainframe Decryption, Telemetry Analysis, Bio-Research & Auditing',
    summary:
      'Intel governs data extraction, research vaults, and electronic warfare. Scientist and Recon operatives excel at turning [Intel] stages into extra [CR] and stage-scouting advantages.',
  },
  operations: {
    name: 'Operations',
    token: '[Operations]',
    pyramidShare: '15% Combined Utility Friction Pillar (Tier 3 Utility Focus)',
    tierRole: 'Heavy Engineering, Power Grid Siphons, Demolition & Drone Rigging',
    summary:
      'Operations covers physical infrastructure, reactor stabilization, and automated turret/drone deployments. Technicians and Breachers dominate [Operations] checks.',
  },
  negotiate: {
    name: 'Negotiate',
    token: '[Negotiate]',
    pyramidShare: '35% Combined Utility Pillar (Tier 2 Specialist Focus)',
    tierRole: 'Executive Coercion, Hostage Parley, Syndicate Deals & Ceasefires',
    summary:
      'Negotiate appears in high-stakes social and corporate encounters. Diplomats can also use Strategic Alignment ([1 EF]) to elevate the entire squad to Secondary Focus (4+).',
  },
  survival: {
    name: 'Survival',
    token: '[Survival]',
    pyramidShare: '15% Combined Utility Friction Pillar (Tier 3 Utility Focus)',
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
    timing: string;
    effect: string;
  }
> = {
  soldier: {
    name: 'Soldier',
    abilityName: 'Lock and Load',
    cost: '[1 EF]',
    offsetEs: 0.0,
    timing: 'Step 2 / Step 3 (Before Rolling)',
    effect:
      'Draw +2 temporary dice from the supply box and add them to this operative’s active rolling pool for this phase only (does not deplete static pool).',
  },
  recon: {
    name: 'Recon',
    abilityName: 'Intel Reconnaissance',
    cost: '[1 EF]',
    offsetEs: 0.0,
    timing: 'Step 1 (Stage Briefing)',
    effect:
      'Peek at the upcoming Stage Card or top 2 Stage Modifier cards; choose to Bypass (replace with scouted card) or Hold Position (purge scouted hazard).',
  },
  survivalist: {
    name: 'Survivalist',
    abilityName: 'Emergency Field Medicine',
    cost: '[1 EF]',
    offsetEs: 1.0,
    timing: 'Step 4 (Post-Roll Triage)',
    effect:
      'Remove up to 2 Hit Points lost by a single operative during this specific stage (once per stage per Survivalist).',
  },
  scientist: {
    name: 'Scientist',
    abilityName: 'Dual-Vector Mapping',
    cost: '[1 EF]',
    offsetEs: 0.5,
    timing: 'Step 1 (Stage Briefing)',
    effect:
      'Choose any Focus category distinct from the room’s printed Focus and add it as a concurrent Operational Focus for the stage (enabling Phase 1 3+ rolls).',
  },
  diplomat: {
    name: 'Diplomat',
    abilityName: 'Strategic Alignment',
    cost: '[1 EF]',
    offsetEs: 0.0,
    timing: 'Step 1 (Stage Briefing)',
    effect:
      'Choose any Focus category (typically the room’s active Focus). For this stage, the entire active squad treats that category as at least Secondary Focus (4+).',
  },
  technician: {
    name: 'Technician',
    abilityName: 'Adaptive Calibration',
    cost: '[1 EF]',
    offsetEs: 0.0,
    timing: 'End of Step 2 (After Phase 1 Roll)',
    effect:
      'Allow any deployed operative with the room’s Primary Focus (3+) to immediately commit and roll additional static dice before moving to Phase 2 Support.',
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

const DESIGN_BACKLOG_RULES = [
  {
    id: 'BL-RULES-01',
    priority: 'P0 — High',
    system: 'Vault Economy & Mission Briefs (Debrief Step 1)',
    question: 'Mission Clearance Bounty Distribution (Per-Faction vs. Shared Agency Pot)',
    analysis:
      'Mission briefs specify a Base Clearance Bounty (e.g., Iron Dawn M1: [6 CR], [1 PIP]; M2: [8 CR], [2 PIP]). Playtesters will immediately ask whether each participating Faction receives the full printed bounty or whether the bounty is a shared pot divided across the 4 deployed slots.',
    recommendation:
      'Clarify as either (A) Per-Faction Payout (if Quartermaster prices assume [6–8 CR] income per player per mission) OR (B) Shared Contract Pot split per deployed operative slot with odd remainders claimed by the Squad Leader (adding strong economic incentive to the Command Auction).',
    link: '#/wiki/rule/vault_economy',
  },
  {
    id: 'BL-RULES-02',
    priority: 'P0 — High',
    system: 'Stage Resolution & Mortality (Step 2/3 vs Step 4)',
    question: 'The "Martyr’s Last Stand / Dying Breath" Success Counting Rule',
    analysis:
      'If an operative at 1 HP rolls [5, 4, 1], the natural 1 inflicts 1 Backfire damage (0 HP). If no player spends [1 EF] in Step 4 to stabilize them, do the 5 and 4 from their lethal roll still count toward clearing the stage in Step 5?',
    recommendation:
      'Yes ("Dying Breath Rule"). All rolled successes lock in during Step 2/3; stabilization occurs in Step 4. We documented this explicitly in a Golden Rule callout in Chapter 1 (rules_overview.md).',
    link: '#/wiki/rule/rules_overview',
  },
  {
    id: 'BL-RULES-03',
    priority: 'P1 — Medium',
    system: 'Mortality & Vulture Economy (medbay_trauma.md)',
    question: 'Turn Order Priority for Stabilization Offers & Vulture Looting Claims',
    analysis:
      'When an operative drops to 0 HP or dies and drops equipment, multiple rival Factions may want to extort a stabilization deal or pay [-1 PIP] (Vulture Tax) to claim dropped Tier 2 weapons before rolling off.',
    recommendation:
      'Standardize table declaration order as Squad Leader first, then clockwise around the table.',
    link: '#/wiki/rule/medbay_trauma',
  },
  {
    id: 'BL-RULES-04',
    priority: 'P1 — Medium',
    system: 'Squad Leader Command (squad_leader_command.md)',
    question: 'Zero-Credit Command Auction Poverty Fallback ([1 CR] Min vs [0 CR])',
    analysis:
      'The Command Auction specifies a [1 CR] minimum entry bid. If all 4 Factions spend down to [0 CR] during HQ Downtime Steps 4–6 (or all refuse to bid), how is the Squad Leader assigned?',
    recommendation:
      'Documented a [0 CR] Fallback Note: if no player bids [1 CR] or more, resolve at [0 CR] using the standard tie-breaker hierarchy ([PIP] → [LOY] → Roll-off).',
    link: '#/wiki/rule/squad_leader_command',
  },
  {
    id: 'BL-RULES-05',
    priority: 'P2 — Clarity',
    system: 'Classes & Focus (classes_and_focus.md)',
    question: 'Technician Adaptive Calibration & Phase 1 Early Resolution Window',
    analysis:
      'Technician spends [1 EF] after Phase 1 rolls so a Primary (3+) Specialist can commit additional static dice. Confirming that reaching Target Difficulty D with these bonus dice still triggers Early Resolution (skipping Phase 2 Support rolls) makes Technician’s timing window crystal clear.',
    recommendation:
      'Added an explicit Golden Rule callout in Chapter 3 (classes_and_focus.md) confirming Early Resolution applies.',
    link: '#/wiki/rule/classes_and_focus',
  },
  {
    id: 'BL-RULES-06',
    priority: 'P2 — Clarity',
    system: 'Classes & Focus (classes_and_focus.md)',
    question: 'Scientist Dual-Vector Mapping Phase 1 Initiative Promotion',
    analysis:
      'When Scientist adds a second concurrent Focus to a stage in Step 1, operatives holding Primary (3+) in that added Focus are promoted into Phase 1 Initiative (Specialists).',
    recommendation:
      'Added a step-by-step Example of Play in Chapter 3 showing Scientist promoting [Combat] operatives into Phase 1 inside an [Intel] room.',
    link: '#/wiki/rule/classes_and_focus',
  },
  {
    id: 'BL-RULES-07',
    priority: 'P2 — Clarity',
    system: 'Stage Modifiers & Dynamic Focus Swaps',
    question: 'Dynamic Focus Swaps Flipping Split-Effect Stage Modifiers',
    analysis:
      'Four Stage Modifiers have Split Effects ([Combat] vs [Non-Combat]). Because Dynamic Focus Swaps (Force Breach / Tactical Bypass) happen in Step 1 after the modifier is revealed, swapping a room from [Combat] to [Infiltrate] flips which half of the Split Modifier applies.',
    recommendation:
      'Keep this interaction—it makes Step 1 Briefing decisions and Recon’s Intel Reconnaissance feel deeply tactical.',
    link: '#/wiki/database/modifier',
  },
  {
    id: 'BL-RULES-08',
    priority: 'P3 — Edge Case',
    system: 'Med Bay & Trauma (medbay_trauma.md)',
    question: '2-HP Operatives Accumulating 2 Critical Injury / Trauma Tokens (0 Max HP)',
    analysis:
      'Glass-cannon operatives (2 HP cap) who suffer 2 unhealed Critical Injury or Permanent Trauma tokens (-1 Max HP each) would drop to 0 Max HP on launch.',
    recommendation:
      'Specify that an operative whose effective Max HP reaches 0 is Medically Grounded on the HQ bench until at least 1 token is healed or purged at the Cybernetic Lab.',
    link: '#/wiki/rule/medbay_trauma',
  },
];

export function WikiPortal({
  coreRules,
  components,
  artManifest,
  onLaunchVTT,
}: WikiPortalProps) {
  const [activeSection, setActiveSection] = useState<PortalSection>('home');
  const [selectedRuleSlug, setSelectedRuleSlug] = useState<string>(
    coreRules[0]?.slug || 'rules_overview'
  );
  const [printChapterFilter, setPrintChapterFilter] = useState<string>('all');
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
      if (!h || h === '/wiki' || h === '/wiki/' || h === '/wiki/home') {
        setActiveSection('home');
        return;
      }
      if (!h.startsWith('/wiki')) return;

      const [pathPart, queryPart] = h.slice(6).split('?'); // remove '/wiki/'
      const segs = pathPart.split('/').filter(Boolean);
      const params = new URLSearchParams(queryPart || '');

      if (segs[0] === 'home') {
        setActiveSection('home');
      } else if (segs[0] === 'print-rulebook' || segs[0] === 'rulebook') {
        setActiveSection('print_rulebook');
        if (segs[1]) setPrintChapterFilter(segs[1]);
      } else if (segs[0] === 'backlog') {
        setActiveSection('design_backlog');
      } else if (segs[0] === 'rule' && segs[1]) {
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

  const categorySiblings = useMemo(() => {
    if (!activeComponent) return [];
    return components.filter((c) => c.component_type === activeComponent.component_type);
  }, [components, activeComponent]);

  const siblingIndex = useMemo(
    () => categorySiblings.findIndex((c) => c.id === activeComponent?.id),
    [categorySiblings, activeComponent]
  );

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
        <div style={{ marginBottom: '0.9rem' }}>
          <input
            type="search"
            placeholder="🔍 Search 200 cards & rules..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (
                [
                  'home',
                  'print_rulebook',
                  'design_backlog',
                  'rulebook',
                  'currencies_guide',
                  'focus_page',
                  'class_page',
                  'component_page',
                ].includes(activeSection)
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

        {/* 0. Start Here & Rulebook Hub */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            marginBottom: '0.35rem',
          }}
        >
          0. Start Here & Rulebook
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => navigateWiki('#/wiki/home')}
            style={{
              textAlign: 'left',
              padding: '0.42rem 0.6rem',
              borderRadius: '6px',
              border:
                activeSection === 'home'
                  ? '1px solid var(--currency-effort)'
                  : '1px solid transparent',
              background:
                activeSection === 'home' ? 'rgba(0, 229, 255, 0.14)' : 'transparent',
              color:
                activeSection === 'home' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: activeSection === 'home' ? 700 : 600,
              cursor: 'pointer',
            }}
          >
            🏠 Wiki Homepage & Overview
          </button>

          <button
            type="button"
            onClick={() => navigateWiki('#/wiki/print-rulebook')}
            style={{
              textAlign: 'left',
              padding: '0.42rem 0.6rem',
              borderRadius: '6px',
              border:
                activeSection === 'print_rulebook'
                  ? '1px solid #a855f7'
                  : '1px solid transparent',
              background:
                activeSection === 'print_rulebook'
                  ? 'rgba(168, 85, 247, 0.16)'
                  : 'transparent',
              color:
                activeSection === 'print_rulebook' ? '#e9d5ff' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: activeSection === 'print_rulebook' ? 700 : 600,
              cursor: 'pointer',
            }}
          >
            📘 Official Print Rulebook (Full)
          </button>

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
            ★ 4-Tier Currencies & Trackers
          </button>

          <button
            type="button"
            onClick={() => navigateWiki('#/wiki/backlog')}
            style={{
              textAlign: 'left',
              padding: '0.42rem 0.6rem',
              borderRadius: '6px',
              border:
                activeSection === 'design_backlog'
                  ? '1px solid #10b981'
                  : '1px solid transparent',
              background:
                activeSection === 'design_backlog'
                  ? 'rgba(16, 185, 129, 0.14)'
                  : 'transparent',
              color:
                activeSection === 'design_backlog' ? '#6ee7b7' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: activeSection === 'design_backlog' ? 700 : 600,
              cursor: 'pointer',
            }}
          >
            🧭 Design Companion & Backlog
          </button>
        </div>

        {/* 1. Core Rulebook Chapters */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            marginBottom: '0.35rem',
          }}
        >
          1. Rulebook Chapters (/game/core)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18rem', marginBottom: '1rem' }}>
          {coreRules.map((ch, idx) => {
            const isCurrent = activeSection === 'rulebook' && selectedRuleSlug === ch.slug;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => navigateWiki(`#/wiki/rule/${ch.slug}`)}
                style={{
                  textAlign: 'left',
                  padding: '0.38rem 0.6rem',
                  borderRadius: '6px',
                  border: isCurrent ? '1px solid var(--currency-effort)' : '1px solid transparent',
                  background: isCurrent ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
                  color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: isCurrent ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {idx + 1}. {ch.title.replace(/^AWAY TEAM —\s*/i, '')}
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
            marginBottom: '0.35rem',
          }}
        >
          2. Component Databases ({components.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.18rem', marginBottom: '1rem' }}>
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
                  padding: '0.38rem 0.6rem',
                  borderRadius: '6px',
                  border: isCurrent ? '1px solid var(--border-strong)' : '1px solid transparent',
                  background: isCurrent ? 'var(--bg-card)' : 'transparent',
                  color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
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
            VIEW 0A: SLEEK WIKI HOMEPAGE (#/wiki/home)
           ==================================================================== */}
        {activeSection === 'home' && (
          <div>
            {/* Hero Abstract Banner */}
            <section className="wiki-hero-banner">
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--currency-effort)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                }}
              >
                OFFICIAL SYSTEM REFERENCE • 6.0 STATIC DICE ENGINE • 1–4 PLAYERS
              </div>
              <h1
                style={{
                  margin: '0 0 0.65rem 0',
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.2rem',
                  letterSpacing: '0.04em',
                }}
              >
                AWAY TEAM — Corporate Tactics, Attrition & Betrayal
              </h1>
              <p
                style={{
                  fontSize: '1.02rem',
                  color: '#dbe4f0',
                  maxWidth: '920px',
                  margin: '0 0 1rem 0',
                  lineHeight: 1.65,
                }}
              >
                <strong>Away Team</strong> is a semi-cooperative sci-fi tactical board game for{' '}
                <strong>1 to 4 Directors</strong>. You command rival corporate{' '}
                <strong>Factions</strong> inside a joint planetary task force. On the ground, your{' '}
                <strong>4 deployed Specialist Operatives</strong> must coordinate finite static dice
                pools to breach facilities, clear hazards, and stop the campaign{' '}
                <SemanticText text="[DOOM]" /> clock from collapsing. In the boardroom, however,{' '}
                <strong>only one Director can win</strong>—by hoarding{' '}
                <SemanticText text="[VP]" />, sponsoring HQ modules, extorting teammates at{' '}
                <code>0 HP</code>, and fulfilling hidden <SemanticText text="Secret Objectives" />.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="vtt-btn vtt-btn-primary"
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
                  onClick={() => navigateWiki('#/wiki/print-rulebook')}
                >
                  📘 Open Official Print Rulebook
                </button>
                <button
                  type="button"
                  className="vtt-btn"
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
                  onClick={() => navigateWiki('#/wiki/concept/currencies')}
                >
                  💰 4-Tier Currencies & Trackers Guide
                </button>
                <button
                  type="button"
                  className="vtt-btn"
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
                  onClick={() => navigateWiki('#/wiki/backlog')}
                >
                  🧭 Design Companion & Backlog
                </button>
                {onLaunchVTT && (
                  <button
                    type="button"
                    className="vtt-btn"
                    style={{
                      padding: '0.55rem 1.1rem',
                      fontSize: '0.88rem',
                      borderColor: '#10b981',
                      color: '#34d399',
                    }}
                    onClick={onLaunchVTT}
                  >
                    🎲 Launch Sequenced VTT & Simulator
                  </button>
                )}
              </div>

              {/* 4 Core Pillars */}
              <div className="wiki-pillar-grid">
                <div className="wiki-pillar-card">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--currency-effort)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    PILLAR I • FINITE ATTRITION
                  </div>
                  <strong style={{ fontSize: '0.96rem' }}>Non-Refreshing Static Dice</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                    Operatives enter a mission with <code>4–10 d6</code> static dice for the{' '}
                    <em>entire mission</em>. Every die committed to a room moves to the Spent Pool
                    unless refunded via <SemanticText text="[MOM]" /> or{' '}
                    <SemanticText text="Logistical Refresh" />.
                  </p>
                </div>

                <div className="wiki-pillar-card">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--currency-credits)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    PILLAR II • TABLE POLITICS
                  </div>
                  <strong style={{ fontSize: '0.96rem' }}>Auctioned Squad Leadership</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                    No alpha-gaming: players bid <SemanticText text="[CR]" /> in the{' '}
                    <SemanticText text="Command Auction" /> to claim the Squad Leader badge,
                    controlling Focus Swaps, <SemanticText text="[MOM]" /> refunds, and Retreats.
                  </p>
                </div>

                <div className="wiki-pillar-card">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: '#f472b6',
                      marginBottom: '0.25rem',
                    }}
                  >
                    PILLAR III • SEMI-CO-OP TENSION
                  </div>
                  <strong style={{ fontSize: '0.96rem' }}>Binding Deals & Vulture Looting</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                    When an ally drops to <code>0 HP</code>, extort <SemanticText text="[CR]" /> for{' '}
                    <SemanticText text="[1 EF]" /> stabilization—or let them become a Martyr and pay
                    the <SemanticText text="[-1 PIP]" /> <SemanticText text="Vulture Tax" /> to claim
                    their weapons.
                  </p>
                </div>

                <div className="wiki-pillar-card">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: '#34d399',
                      marginBottom: '0.25rem',
                    }}
                  >
                    PILLAR IV • ASYMMETRIC BALANCE
                  </div>
                  <strong style={{ fontSize: '0.96rem' }}>9.0 ES Mathematical Ledger</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
                    All 24 Specialists, 6 Classes, 8 Factions, and 87 Armory items are calibrated to
                    the atomic <strong>Expected Success (ES)</strong> standard.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick-Launch Portal Grid */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                margin: '0 0 0.85rem 0',
              }}
            >
              Explore the Away Team Reference Portal
            </h2>
            <div className="wiki-portal-grid">
              <div
                className="wiki-portal-card"
                onClick={() => navigateWiki('#/wiki/print-rulebook')}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: '#c084fc',
                    }}
                  >
                    DELUXE PRINT EMULATOR • 8 CHAPTERS
                  </div>
                  <h3 style={{ margin: '0.25rem 0 0.45rem 0' }}>
                    📘 Official Board Game Rulebook
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Read the complete rulebook formatted like a physical tabletop manual with Golden
                    Rule callouts, step-by-step Examples of Play, component diagrams, and back-cover
                    Quick Reference tables.
                  </p>
                </div>
                <div
                  style={{
                    marginTop: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    color: 'var(--currency-effort)',
                  }}
                >
                  Open Print-Style Rulebook →
                </div>
              </div>

              <div
                className="wiki-portal-card"
                onClick={() => navigateWiki('#/wiki/concept/currencies')}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--currency-credits)',
                    }}
                  >
                    ECONOMIC TAXONOMY • 4 TIERS
                  </div>
                  <h3 style={{ margin: '0.25rem 0 0.45rem 0' }}>
                    💰 Currencies vs. States & Trackers
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Clear visual breakdown of Spendable Vault Currencies (
                    <SemanticText text="[CR]" /> <SemanticText text="[EF]" />{' '}
                    <SemanticText text="[PIP]" />) vs. Mission Flow (<SemanticText text="[MOM]" />
                    ), Operative Rank (<SemanticText text="[LOY]" />), and Meta Trackers (
                    <SemanticText text="[DOOM]" /> <SemanticText text="[VP]" />).
                  </p>
                </div>
                <div
                  style={{
                    marginTop: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    color: 'var(--currency-effort)',
                  }}
                >
                  Read Taxonomy Guide →
                </div>
              </div>

              <div
                className="wiki-portal-card"
                onClick={() => navigateWiki('#/wiki/database/faction')}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: '#38bdf8',
                    }}
                  >
                    CORPORATE DOSSIERS • 8 FACTIONS
                  </div>
                  <h3 style={{ margin: '0.25rem 0 0.45rem 0' }}>
                    🏢 The 8 Competing Factions
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Inspect Aegis, Nexus, Vanderbilt, Obsidian, Titan, Ascendant, Aurelius, and
                    Ironclad—including starting Vaults and 4-Tier Loyalty Progression Trees.
                  </p>
                </div>
                <div
                  style={{
                    marginTop: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    color: 'var(--currency-effort)',
                  }}
                >
                  Browse 8 Factions →
                </div>
              </div>

              <div
                className="wiki-portal-card"
                onClick={() => navigateWiki('#/wiki/database/character')}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: '#f87171',
                    }}
                  >
                    STRIKE TEAM ROSTER • 24 OPERATIVES
                  </div>
                  <h3 style={{ margin: '0.25rem 0 0.45rem 0' }}>
                    👤 24 Specialist Operatives & 6 Classes
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Every operative is built on the <code>9.0 ES</code> budget across Soldier, Recon,
                    Survivalist, Scientist, Diplomat, and Technician classes.
                  </p>
                </div>
                <div
                  style={{
                    marginTop: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    color: 'var(--currency-effort)',
                  }}
                >
                  Browse 24 Operatives →
                </div>
              </div>

              <div
                className="wiki-portal-card"
                onClick={() => navigateWiki('#/wiki/database/item')}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: '#fb923c',
                    }}
                  >
                    QUARTERMASTER CACHE • 87 ITEMS
                  </div>
                  <h3 style={{ margin: '0.25rem 0 0.45rem 0' }}>
                    🔫 Armory Weapons, Rigs & Drones
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Filter Tier 1 & Tier 2 Handhelds, Wearables (<SemanticText text="[Head]" />{' '}
                    <SemanticText text="[Body]" /> <SemanticText text="[Legs]" />{' '}
                    <SemanticText text="[Pack]" />), Consumables, and <SemanticText text="[Complex]" />{' '}
                    rigs.
                  </p>
                </div>
                <div
                  style={{
                    marginTop: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    color: 'var(--currency-effort)',
                  }}
                >
                  Browse 87 Armory Items →
                </div>
              </div>

              <div
                className="wiki-portal-card"
                onClick={() => navigateWiki('#/wiki/backlog')}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: '#34d399',
                    }}
                  >
                    SYSTEMS COMPANION • RULES & BALANCE AUDIT
                  </div>
                  <h3 style={{ margin: '0.25rem 0 0.45rem 0' }}>
                    🧭 Design Companion & Product Backlog
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Review 8 surfaced rulebook edge-case questions (<code>BL-RULES-01</code> to{' '}
                    <code>08</code>), Monte Carlo balance findings, and upcoming VTT/Print milestones.
                  </p>
                </div>
                <div
                  style={{
                    marginTop: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    color: 'var(--currency-effort)',
                  }}
                >
                  Open Design Companion →
                </div>
              </div>
            </div>

            {/* At-a-Glance Sequence of Play & Focus Pyramid */}
            <div className="wiki-entity-layout">
              <div className="rulebook-article">
                <h2>At-a-Glance: How a Game of Away Team Flows</h2>
                <p>
                  A campaign plays across <strong>3 to 5 linked Missions</strong> (such as{' '}
                  <SemanticText text="Operation: Iron Dawn" /> or{' '}
                  <SemanticText text="Operation: Apex Extraction" />), alternating between two main
                  phases:
                </p>
                <ol>
                  <li>
                    <strong>Phase A — Tactical Field Mission (3–5 Stage Cards):</strong>
                    <ul>
                      <li>
                        <strong>Step 1 (Briefing & Swaps):</strong> Reveal Stage + Modifier. Squad
                        Leader may call <SemanticText text="Force Breach" /> or{' '}
                        <SemanticText text="Tactical Bypass" />; Recon, Scientist, and Diplomat may
                        trigger <SemanticText text="[1 EF]" /> abilities; players broker Binding
                        Promises.
                      </li>
                      <li>
                        <strong>Step 2 (Phase 1 — Specialists 3+):</strong> Operatives whose{' '}
                        <strong>Primary Focus</strong> matches the room commit static dice and roll at{' '}
                        <code>3+</code> (<code>1s</code> deal 1 HP Backfire). If they reach Target
                        Difficulty <code>D</code>, the stage clears immediately!
                      </li>
                      <li>
                        <strong>Step 3 (Phase 2 — Support 4+ / 5+):</strong> If more successes are
                        needed, remaining operatives commit static dice and roll at <code>4+</code>{' '}
                        (Secondary/Bridged) or <code>5+</code> (Out of Focus).
                      </li>
                      <li>
                        <strong>Step 4 (Triage & Stabilization):</strong> Trigger Survivalist{' '}
                        <SemanticText text="Emergency Field Medicine" /> or stabilize any{' '}
                        <code>0 HP</code> operative for <SemanticText text="[1 EF]" /> (otherwise KIA
                        Martyr + <SemanticText text="Vulture Tax" /> loot drop).
                      </li>
                      <li>
                        <strong>Step 5 (Resolution & Momentum):</strong> If cleared by{' '}
                        <code>D + 2</code> or more, generate{' '}
                        <code>Momentum = Successes - D - 1</code> (<SemanticText text="[MOM]" />),
                        immediately restoring spent static dice to participating rollers.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Phase B — 8-Step Agency HQ Downtime:</strong>
                    <ul>
                      <li>
                        Collect mission payouts & <SemanticText text="[+1 LOY]" /> survival ranks →
                        Bid on the <SemanticText text="Stand-Down Auction" /> → Roll Healing Dice at
                        the <SemanticText text="Infirmary" /> → Sponsor HQ Modules for{' '}
                        <SemanticText text="[+1 PIP]" /> → Hire at the{' '}
                        <SemanticText text="Recruitment Bureau" /> → Re-arm at the{' '}
                        <SemanticText text="Quartermaster" /> → Elect the next Squad Leader in the{' '}
                        <SemanticText text="Command Auction" />.
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>

              <aside className="wiki-infobox">
                <div className="wiki-infobox-header">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--currency-effort)',
                    }}
                  >
                    THE 50 / 35 / 15 CHALLENGE MATRIX
                  </div>
                  <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1rem' }}>
                    Skewed Focus Pyramid
                  </h3>
                </div>
                <table className="wiki-infobox-table">
                  <tbody>
                    <tr>
                      <th>Tier 1 (~50%)</th>
                      <td>
                        <FocusBadge focus="combat" />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          Mandatory frontline kinetic checks in every mission.
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Tier 2 (~35%)</th>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          <FocusBadge focus="intel" />
                          <FocusBadge focus="infiltrate" />
                          <FocusBadge focus="negotiate" />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          Core objective extraction, stealth bypasses, and executive parley.
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>Tier 3 (~15%)</th>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          <FocusBadge focus="operations" />
                          <FocusBadge focus="survival" />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          High-friction engineering lockouts and lethal bio-hazards.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </aside>
            </div>
          </div>
        )}

        {/* ====================================================================
            VIEW 0B: EMULATED OFFICIAL PRINT-STYLE BOARD GAME RULEBOOK
           ==================================================================== */}
        {activeSection === 'print_rulebook' && (
          <div className="print-rulebook-folio">
            {/* Top Folio Bar */}
            <div className="print-rulebook-topbar">
              <div>
                <strong style={{ color: '#f8fafc', letterSpacing: '0.06em' }}>
                  📘 AWAY TEAM — OFFICIAL TABLETOP RULEBOOK & FIELD MANUAL (v1.0)
                </strong>
                <span style={{ marginLeft: '0.75rem', color: 'var(--currency-effort)' }}>
                  • Illustrated Print Layout Emulator
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>Jump to Section:</span>
                <select
                  value={printChapterFilter}
                  onChange={(e) => setPrintChapterFilter(e.target.value)}
                  style={{
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-void)',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                  }}
                >
                  <option value="all">Full Print Rulebook (All 8 Chapters + Quick Ref)</option>
                  <option value="anatomy">0. Component Anatomy & Box Contents</option>
                  {coreRules.map((ch, idx) => (
                    <option key={ch.slug} value={ch.slug}>
                      Ch. {idx + 1}: {ch.title}
                    </option>
                  ))}
                  <option value="quickref">Back Cover: Quick Reference & Icon Glossary</option>
                </select>
              </div>
            </div>

            {/* Spread 0: Table of Contents & Component Anatomy */}
            {(printChapterFilter === 'all' || printChapterFilter === 'anatomy') && (
              <section className="print-rulebook-page">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span>SECTION 00 // BOX CONTENTS, TABLET OF CONTENTS & COMPONENT ANATOMY</span>
                  <span>FOLIO PAGE 01–02</span>
                </div>

                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.95rem', marginTop: 0 }}>
                  Welcome to the Agency: Box Contents & Component Anatomy
                </h1>
                <p style={{ color: '#cbd5e1', fontSize: '0.94rem' }}>
                  This manual emulates the physical rulebook included in the{' '}
                  <strong>Away Team Core Box</strong>. Every rule, callout, worked example of play,
                  and schematic diagram placeholder below is live-linked to the 200-component
                  database.
                </p>

                {/* Table of Contents Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '0.65rem',
                    margin: '1.15rem 0',
                  }}
                >
                  {coreRules.map((ch, idx) => (
                    <div
                      key={ch.id}
                      onClick={() => setPrintChapterFilter(ch.slug)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: 'var(--currency-effort)',
                        }}
                      >
                        CHAPTER 0{idx + 1} • PAGE {idx * 3 + 3}
                      </div>
                      <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>{ch.title}</strong>
                    </div>
                  ))}
                </div>

                {/* Component Anatomy Visual Placeholders */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                    gap: '1rem',
                    marginTop: '1.25rem',
                  }}
                >
                  <div className="rulebook-callout callout-diagram" style={{ margin: 0 }}>
                    <div className="rulebook-callout-header">
                      <span>🃏 COMPONENT DIAGRAM A</span>
                      <span>TAROT 70×120mm</span>
                    </div>
                    <div className="rulebook-callout-body" style={{ fontSize: '0.82rem' }}>
                      <strong>Specialist Operative Card Anatomy (24 Cards):</strong>
                      <ol style={{ paddingLeft: '1.2rem', margin: '0.4rem 0 0 0' }}>
                        <li>
                          <strong>Header & Class Icon:</strong> Operative Callsign & Class (
                          <code>Soldier</code>, <code>Recon</code>, etc.).
                        </li>
                        <li>
                          <strong>Focus Affinity Bar:</strong> Primary Focus (<SemanticText text="[Combat]" />{' '}
                          <code>3+</code>) & Secondary Focus (<code>4+</code>).
                        </li>
                        <li>
                          <strong>Stat Line (9.0 ES Budget):</strong> Max Hit Points (<code>2–5 HP</code>) &
                          Starting Static Dice Pool (<code>4–10 d6</code>).
                        </li>
                        <li>
                          <strong>Class Ability (<SemanticText text="[1 EF]" />) & Unique Power:</strong>{' '}
                          Timing window & tactical effect.
                        </li>
                        <li>
                          <strong>Personal Loyalty Track:</strong> Tracks <SemanticText text="[LOY]" /> from{' '}
                          <code>1</code> to <code>10+</code> (Tiers 1–4).
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div className="rulebook-callout callout-diagram" style={{ margin: 0 }}>
                    <div className="rulebook-callout-header">
                      <span>🔫 COMPONENT DIAGRAM B</span>
                      <span>POKER 63×88mm</span>
                    </div>
                    <div className="rulebook-callout-body" style={{ fontSize: '0.82rem' }}>
                      <strong>Armory Equipment Card Anatomy (87 Cards):</strong>
                      <ol style={{ paddingLeft: '1.2rem', margin: '0.4rem 0 0 0' }}>
                        <li>
                          <strong>Quartermaster Cost:</strong> Top-right <SemanticText text="[CR]" /> /{' '}
                          <SemanticText text="[PIP]" /> purchase price.
                        </li>
                        <li>
                          <strong>Anatomical Slot Tag:</strong> <SemanticText text="[Hand L]" />,{' '}
                          <SemanticText text="[Body]" />, <SemanticText text="[Head]" />,{' '}
                          <SemanticText text="[Legs]" />, <SemanticText text="[Pack]" />, or{' '}
                          <SemanticText text="[Complex]" />.
                        </li>
                        <li>
                          <strong>Focus Bridge / Elevation:</strong> Grants <code>4+</code> Secondary
                          threshold in the bridged Focus.
                        </li>
                        <li>
                          <strong>Stat Modifiers:</strong> Bonus Static Dice (<code>+1d6</code>) or Armor
                          Buffer soak.
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div className="rulebook-callout callout-diagram" style={{ margin: 0 }}>
                    <div className="rulebook-callout-header">
                      <span>🏛️ COMPONENT DIAGRAM C</span>
                      <span>PLAYER MAT</span>
                    </div>
                    <div className="rulebook-callout-body" style={{ fontSize: '0.82rem' }}>
                      <strong>Faction Dashboard & Vault Mat (8 Mats):</strong>
                      <ol style={{ paddingLeft: '1.2rem', margin: '0.4rem 0 0 0' }}>
                        <li>
                          <strong>The Faction Vault (Left):</strong> Stores the 3 spendable currencies (
                          <SemanticText text="[CR]" />, <SemanticText text="[EF]" />,{' '}
                          <SemanticText text="[PIP]" />) and unequipped Armory Cache.
                        </li>
                        <li>
                          <strong>4-Tier Loyalty Tree (Center):</strong> Unlocks Faction powers at{' '}
                          <SemanticText text="[1 LOY]" />, <SemanticText text="[3 LOY]" />,{' '}
                          <SemanticText text="[6 LOY]" />, and <SemanticText text="[10+ LOY]" />.
                        </li>
                        <li>
                          <strong>Dead Pool & Score Ledger (Right):</strong> Holds Martyr operatives (
                          <code>1 LOY = 2 VP</code>) and tracks endgame <SemanticText text="[VP]" />.
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Chapters I – VIII */}
            {coreRules
              .filter((ch) => printChapterFilter === 'all' || printChapterFilter === ch.slug)
              .map((ch) => {
                const realIdx = coreRules.findIndex((r) => r.slug === ch.slug);
                return (
                  <section key={ch.id} className="print-rulebook-page rulebook-article">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: 'var(--currency-effort)',
                        marginBottom: '0.6rem',
                      }}
                    >
                      <span>
                        CHAPTER 0{realIdx + 1} // {ch.slug.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span>
                        FOLIO PAGE {realIdx * 3 + 3}–{realIdx * 3 + 5}
                      </span>
                    </div>
                    <MarkdownRenderer content={ch.body} />
                  </section>
                );
              })}

            {/* Back-Cover Quick Reference Sheet */}
            {(printChapterFilter === 'all' || printChapterFilter === 'quickref') && (
              <section className="print-rulebook-page rulebook-article">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--currency-credits)',
                    marginBottom: '0.6rem',
                  }}
                >
                  <span>BACK COVER // EXECUTIVE QUICK REFERENCE & ICON GLOSSARY</span>
                  <span>FOLIO PAGE 28</span>
                </div>
                <h1>Back-Cover Quick Reference Sheet</h1>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h3>1. Stage Resolution (5 Steps)</h3>
                    <ol>
                      <li>
                        <strong>Step 1 — Briefing & Swaps:</strong> Reveal Stage + Modifier. Squad
                        Leader may call <SemanticText text="Force Breach" /> or{' '}
                        <SemanticText text="Tactical Bypass" />. Activate Step 1 Class Powers (
                        <SemanticText text="Intel Reconnaissance" />,{' '}
                        <SemanticText text="Dual-Vector Mapping" />,{' '}
                        <SemanticText text="Strategic Alignment" />).
                      </li>
                      <li>
                        <strong>Step 2 — Phase 1 (Specialists 3+):</strong> Primary Focus operatives
                        commit & roll static dice (<code>3+</code> hits, <code>1</code> Backfire). If
                        Hits ≥ <code>D</code>, <strong>Early Resolution</strong> clears stage!
                      </li>
                      <li>
                        <strong>Step 3 — Phase 2 (Support 4+ / 5+):</strong> Secondary/Bridged roll at{' '}
                        <code>4+</code>; Out-of-Focus roll at <code>5+</code>.
                      </li>
                      <li>
                        <strong>Step 4 — Triage & 0 HP Stabilization:</strong> Spend{' '}
                        <SemanticText text="[1 EF]" /> or Medkit to save <code>0 HP</code> operatives
                        at <code>1 HP</code>, or resolve KIA Martyr (<SemanticText text="[+2 PIP]" />) +{' '}
                        <SemanticText text="Vulture Tax" /> (<SemanticText text="[-1 PIP]" /> per 2
                        items).
                      </li>
                      <li>
                        <strong>Step 5 — Resolution & Momentum:</strong> If Hits ≥ <code>D + 2</code>,
                        gain <code>MOM = Hits - D - 1</code> (<SemanticText text="[1 MOM]" /> = restore
                        1 spent die to a roller).
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h3>2. Standard Tie-Breaker Hierarchy</h3>
                    <ol>
                      <li>
                        <strong>Highest Bid in Credits (<SemanticText text="[CR]" />)</strong>
                      </li>
                      <li>
                        <strong>Highest Faction Political Influence (<SemanticText text="[PIP]" />)</strong>
                      </li>
                      <li>
                        <strong>Highest Candidate Operative Loyalty (<SemanticText text="[LOY]" />)</strong>
                      </li>
                      <li>
                        <strong>Unmodified d6 Roll-Off</strong>
                      </li>
                    </ol>

                    <h3 style={{ marginTop: '1rem' }}>3. Final Executive [VP] Audit</h3>
                    <ul>
                      <li>
                        <strong>Open Agendas & HQ Sponsorships:</strong> Printed{' '}
                        <SemanticText text="[VP]" />
                      </li>
                      <li>
                        <strong>Remaining Vault Influence:</strong>{' '}
                        <SemanticText text="[1 PIP]" /> = <SemanticText text="[2 VP]" />
                      </li>
                      <li>
                        <strong>Living & Martyr Operative Loyalty:</strong>{' '}
                        <SemanticText text="[1 LOY]" /> = <SemanticText text="[2 VP]" /> (+
                        <SemanticText text="[3 VP]" /> per Tier 4 Icon)
                      </li>
                      <li>
                        <strong>Tiered Secret Objectives:</strong> 1st ={' '}
                        <SemanticText text="[+15 VP]" />, 2nd = <SemanticText text="[+10 VP]" />, 3rd
                        = <SemanticText text="[+5 VP]" />
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ====================================================================
            VIEW 0C: DESIGN COMPANION AUDIT & PRODUCT BACKLOG (#/wiki/backlog)
           ==================================================================== */}
        {activeSection === 'design_backlog' && (
          <div className="rulebook-article">
            <nav className="wiki-breadcrumbs">
              <button
                type="button"
                className="wiki-breadcrumb-btn"
                onClick={() => navigateWiki('#/wiki/home')}
              >
                Wiki Home
              </button>
              <span>›</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                Design Companion Review, Rule Edge Cases & Product Backlog
              </strong>
            </nav>

            <h1>🧭 Design Companion Review & Prioritized Backlog</h1>
            <p>
              As your <strong>Systems & UX Design Companion</strong>, I audited all 8 Core Rulebook
              chapters, the <code>9.0 ES</code> mathematical ledger, and all 200 components.{' '}
              <strong>Zero rules or numbers have been altered.</strong> Instead, explanations,
              examples, and callouts have been sharpened across the rulebook, while potential table
              ambiguities and balance questions are surfaced below as structured backlog items for your
              review.
            </p>

            <div className="rulebook-callout callout-tip">
              <div className="rulebook-callout-header">
                <span>✨ EXECUTIVE CRITIQUE</span>
                <span>WHAT SHINES IN THE 6.0 ENGINE</span>
              </div>
              <div className="rulebook-callout-body">
                <ul>
                  <li>
                    <strong>Operational Momentum (<SemanticText text="[MOM]" />) + Skin-in-the-Game:</strong>{' '}
                    Requiring an operative to commit at least <code>1 die</code> to qualify for{' '}
                    <SemanticText text="[MOM]" /> die refunds solves the classic semi-co-op "free
                    rider" problem.
                  </li>
                  <li>
                    <strong>Phase 1 Early Resolution (3+ Specialists):</strong> Letting Primary
                    Specialists clear a room in Step 2 before Phase 2 Support even touches the dice
                    makes squad composition and Scientist/Diplomat Step 1 powers feel immediately
                    rewarding.
                  </li>
                  <li>
                    <strong>Flat 16.7% Backfire (`1`) vs. Variable Hit Thresholds (`3+/4+/5+`):</strong>{' '}
                    Penalizing Out-of-Focus play via <em>dice inefficiency</em> (needing 2x the rolls,
                    thus 2x the exposure to natural <code>1s</code>) is intuitive and eliminates
                    convoluted hazard tables.
                  </li>
                </ul>
              </div>
            </div>

            <h2>1. Rulebook Edge-Case & Timing Backlog (For Designer Decision)</h2>
            <p>
              These 8 items represent questions playtesters will ask during live sessions. Click any
              linked chapter to inspect the current wording and callouts:
            </p>
            <table>
              <thead>
                <tr>
                  <th>ID & Priority</th>
                  <th>System / Chapter</th>
                  <th>Surfaced Question / Edge Case</th>
                  <th>Companion Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {DESIGN_BACKLOG_RULES.map((item) => (
                  <tr key={item.id}>
                    <td style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                      <strong>{item.id}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--currency-credits)' }}>
                        {item.priority}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="wiki-inline-link"
                        onClick={() => navigateWiki(item.link)}
                      >
                        {item.system}
                      </button>
                    </td>
                    <td>
                      <strong>{item.question}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {item.analysis}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      <SemanticText text={item.recommendation} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2>2. Mathematical & Monte Carlo Balance Insights (`9.0 ES` Ledger)</h2>
            <ul>
              <li>
                <strong>
                  <code>BL-BAL-01</code> — The <code>D + 1</code> "Clean Clear" Margin in Momentum:
                </strong>{' '}
                Because <SemanticText text="[MOM]" /> starts at <code>D + 2</code> (
                <code>MOM = Successes - D - 1</code>), rolling exactly <code>D + 1</code> yields{' '}
                <code>0 MOM</code>. In Monte Carlo simulations, intentionally committing extra dice
                purely to chase Momentum is EV-negative unless paired with{' '}
                <SemanticText text="Aegis Tactical Directorate" /> (<em>Kinetic Reclamation</em>{' '}
                <SemanticText text="[+1 EF]" />) or Tier 2 <em>Covering Fire</em>. Momentum works
                great as a "hot-roll rebate" cushion!
              </li>
              <li>
                <strong>
                  <code>BL-BAL-02</code> — 2-HP Glass Cannon Operatives (<code>2 HP / 8 Dice</code>):
                </strong>{' '}
                Operatives like <em>The Ghost Point</em>, <em>The Virologist</em>, and{' '}
                <em>The Spymaster</em> expect <code>1.33</code> natural <code>1s</code> across 8
                rolls—giving them a <strong>39.5% probability of hitting 0 HP</strong> across a full
                mission without Armor Buffer or healing. This strongly validates Tier 1{' '}
                <SemanticText text="[Body]" /> armor and <SemanticText text="[1 EF]" /> Emergency
                Stabilization.
              </li>
              <li>
                <strong>
                  <code>BL-BAL-03</code> — 3-Player Vanguard Slot Loyalty Velocity:
                </strong>{' '}
                In 3P mode, winning the Vanguard Auction deploys 2 operatives for that Faction,
                generating <SemanticText text="[+2 LOY]" /> (<SemanticText text="[4 VP]" />) on a
                surviving mission—making the Vanguard Auction worth at least{' '}
                <SemanticText text="[2 CR]" />–<SemanticText text="[3 CR]" />.
              </li>
            </ul>
          </div>
        )}

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
                onClick={() => navigateWiki('#/wiki/home')}
              >
                Wiki Home
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
                onClick={() => navigateWiki('#/wiki/home')}
              >
                Wiki Home
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
            <p>
              <SemanticText text={FOCUS_META[selectedFocusKey].summary} />
            </p>

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
              <strong>Timing:</strong> <code>{CLASS_META[selectedClassKey].timing}</code> •{' '}
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
              <button
                type="button"
                className="wiki-breadcrumb-btn"
                onClick={() => navigateWiki('#/wiki/print-rulebook')}
              >
                Official Rulebook
              </button>
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
          'home',
          'print_rulebook',
          'design_backlog',
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
