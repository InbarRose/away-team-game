import React, { useMemo, useState } from 'react';
import { ComponentCard, GameComponent } from './ComponentCard';
import { MarkdownRenderer } from './MarkdownRenderer';
import { FocusBadge } from './SemanticText';

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

export function WikiPortal({ coreRules, components, artManifest }: WikiPortalProps) {
  const [activeSection, setActiveSection] = useState<PortalSection>('rulebook');
  const [selectedRuleSlug, setSelectedRuleSlug] = useState<string>(
    coreRules[0]?.slug || 'rules_overview'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [focusFilter, setFocusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [selectedComponent, setSelectedComponent] = useState<GameComponent | null>(null);

  const activeRule = useMemo(
    () => coreRules.find((r) => r.slug === selectedRuleSlug) || coreRules[0],
    [coreRules, selectedRuleSlug]
  );

  // Filter components based on active section + filters
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

  return (
    <div className="wiki-shell">
      {/* Sidebar Navigation */}
      <aside className="wiki-sidebar">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem',
          }}
        >
          1. Core Rulebook (/game/core)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
          {coreRules.map((ch) => {
            const isCurrent = activeSection === 'rulebook' && selectedRuleSlug === ch.slug;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setActiveSection('rulebook');
                  setSelectedRuleSlug(ch.slug);
                }}
                style={{
                  textAlign: 'left',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: isCurrent ? '1px solid var(--currency-effort)' : '1px solid transparent',
                  background: isCurrent ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
                  color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: isCurrent ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {ch.title.replace(/^AWAY TEAM —\s*/i, '')}
              </button>
            );
          })}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem',
          }}
        >
          2. Component Databases ({components.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
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
                onClick={() => {
                  setActiveSection(secKey);
                  setSubCategoryFilter('all');
                }}
                style={{
                  textAlign: 'left',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: isCurrent ? '1px solid var(--border-strong)' : '1px solid transparent',
                  background: isCurrent ? 'var(--bg-card)' : 'transparent',
                  color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: isCurrent ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Semantic Legend Box */}
        <div
          style={{
            padding: '0.85rem',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.76rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
            }}
          >
            FOCUS PYRAMID (50 / 35 / 15)
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
            CURRENCIES & METRICS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            <span className="semantic-badge badge-currency-cr">CR</span>
            <span className="semantic-badge badge-currency-ef">EF</span>
            <span className="semantic-badge badge-currency-pip">PIP</span>
            <span className="semantic-badge badge-currency-loy">LOY</span>
            <span className="semantic-badge badge-currency-mom">MOM</span>
            <span className="semantic-badge badge-currency-doom">DOOM</span>
            <span className="semantic-badge badge-currency-vp">VP</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="wiki-main">
        {activeSection === 'rulebook' && activeRule && (
          <div className="rulebook-article">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>SOURCE: /{activeRule.source_path}</span>
              <span>ENGINE v6.0 • CANONICAL SPEC</span>
            </div>
            <MarkdownRenderer content={activeRule.body} />
          </div>
        )}

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
              Every component under <code>/game/**/*.md</code> includes structured <code>art_spec</code> metadata
              (<code>asset_path</code>, <code>aspect_ratio</code>, <code>visual_description</code>, and{' '}
              <code>art_style</code>) ready for downstream batch image generation tools.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card)', textAlign: 'left' }}>
                    <th style={{ padding: '0.55rem', border: '1px solid var(--border-subtle)' }}>ID</th>
                    <th style={{ padding: '0.55rem', border: '1px solid var(--border-subtle)' }}>Type</th>
                    <th style={{ padding: '0.55rem', border: '1px solid var(--border-subtle)' }}>Aspect</th>
                    <th style={{ padding: '0.55rem', border: '1px solid var(--border-subtle)' }}>Target Asset Path</th>
                    <th style={{ padding: '0.55rem', border: '1px solid var(--border-subtle)' }}>Visual Description Prompt</th>
                  </tr>
                </thead>
                <tbody>
                  {artManifest.map((entry) => (
                    <tr key={entry.id}>
                      <td style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>
                        {entry.id}
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

        {activeSection !== 'rulebook' && activeSection !== 'art_pipeline' && (
          <div>
            {/* Filter Controls Bar */}
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
                  placeholder="Search cards by name, ID, rules, tags, or art prompt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    minWidth: '260px',
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
                    <option value="all">All Sub-Categories</option>
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
                Showing {filteredComponents.length} of {components.length} components
              </div>
            </div>

            {/* Card Grid */}
            <div className="card-grid">
              {filteredComponents.map((comp) => (
                <ComponentCard
                  key={comp.id}
                  item={comp}
                  onSelect={(c) => setSelectedComponent(c)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal for Full Dossier Inspection */}
        {selectedComponent && (
          <div
            onClick={() => setSelectedComponent(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(4, 7, 13, 0.82)',
              backdropFilter: 'blur(6px)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="rulebook-article"
              style={{
                maxHeight: '88vh',
                overflowY: 'auto',
                width: '100%',
                maxWidth: '860px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>
                  ID: {selectedComponent.id} • SOURCE: /{selectedComponent.source_path}
                </span>
                <button
                  type="button"
                  className="vtt-btn vtt-btn-danger"
                  onClick={() => setSelectedComponent(null)}
                >
                  ✕ Close Dossier
                </button>
              </div>

              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--currency-effort)', marginBottom: '0.25rem' }}>
                  ART PIPELINE SPECIFICATION ({selectedComponent.art_spec.aspect_ratio} • {selectedComponent.art_spec.asset_path})
                </div>
                <div style={{ fontStyle: 'italic', color: '#cbd5e1' }}>
                  “{selectedComponent.art_spec.visual_description}”
                </div>
              </div>

              <MarkdownRenderer content={selectedComponent.body || selectedComponent.rules_text || ''} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
