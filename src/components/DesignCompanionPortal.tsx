import React, { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import rawDesignDocs from '../data/design_docs.json';

export interface DesignDoc {
  id: string;
  slug: string;
  title: string;
  order: number;
  summary: string;
  source_path: string;
  body: string;
}

const designDocs = rawDesignDocs as DesignDoc[];

interface DesignCompanionPortalProps {
  initialSlug?: string;
  onLaunchVTT: () => void;
  onOpenIssueModal: (template?: string) => void;
  onNavigateHome: () => void;
}

export function DesignCompanionPortal({
  initialSlug,
  onLaunchVTT,
  onOpenIssueModal,
  onNavigateHome,
}: DesignCompanionPortalProps) {
  const [activeTab, setActiveTab] = useState<'dossiers' | 'backlog' | 'adrs'>('dossiers');
  const [selectedDocSlug, setSelectedDocSlug] = useState<string>(
    initialSlug || designDocs[0]?.slug || '01_mathematical_engine_and_9es_ledger'
  );

  const activeDoc =
    designDocs.find((d) => d.slug === selectedDocSlug) || designDocs[0];

  return (
    <div className="design-portal-container">
      {/* 1. TOP HEADER & TELEMETRY */}
      <header className="design-portal-header">
        <div className="design-header-left">
          <div className="design-header-badge">
            <span className="badge-pulse"></span>
            <span>INTERNAL ENGINEERING DOSSIER • SYSTEM ARCHITECTURE</span>
          </div>
          <h1 className="design-portal-title">
            DESIGN <span className="text-gradient-cyan">COMPANION</span> & MATHEMATICAL LEDGER
          </h1>
          <p className="design-portal-sub">
            Independent systems documentation detailing the underlying mathematical engine (9.0 ES budget),
            the 50/35/15 challenge distribution, economic friction models, decision records, and active backlog.
          </p>
        </div>

        <div className="design-header-actions">
          <button
            type="button"
            className="design-cta-btn vtt-launch"
            onClick={onLaunchVTT}
            title="Launch 1,000-Trial Monte Carlo Stage & Mission Simulator"
          >
            🎲 Run Monte Carlo Simulator
          </button>
          <button
            type="button"
            className="design-cta-btn feedback-launch"
            onClick={() => onOpenIssueModal('gameplay_feedback.md')}
            title="Submit Gameplay & Balance Feedback on GitHub"
          >
            💡 Submit Balance Feedback
          </button>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION TABS */}
      <nav className="design-subnav">
        <button
          type="button"
          className={`design-subnav-btn ${activeTab === 'dossiers' ? 'active' : ''}`}
          onClick={() => setActiveTab('dossiers')}
        >
          <span className="tab-icon">📐</span>
          <span>Architectural Dossiers ({designDocs.length})</span>
        </button>
        <button
          type="button"
          className={`design-subnav-btn ${activeTab === 'backlog' ? 'active' : ''}`}
          onClick={() => setActiveTab('backlog')}
        >
          <span className="tab-icon">🧭</span>
          <span>Design Companion Audit & Backlog</span>
        </button>
        <button
          type="button"
          className={`design-subnav-btn ${activeTab === 'adrs' ? 'active' : ''}`}
          onClick={() => setActiveTab('adrs')}
        >
          <span className="tab-icon">📋</span>
          <span>Architecture Decision Records (ADRs)</span>
        </button>
      </nav>

      {/* 3. MAIN WORKSPACE */}
      <div className="design-workspace">
        {activeTab === 'dossiers' && (
          <div className="design-dossiers-layout">
            {/* Left Dossier Selector Sidebar */}
            <aside className="design-sidebar">
              <div className="design-sidebar-title">SYSTEM SPECIFICATIONS</div>
              <div className="design-doc-list">
                {designDocs.map((doc, idx) => (
                  <button
                    key={doc.slug}
                    type="button"
                    className={`design-doc-btn ${doc.slug === selectedDocSlug ? 'active' : ''}`}
                    onClick={() => setSelectedDocSlug(doc.slug)}
                  >
                    <div className="doc-num">0{idx + 1}</div>
                    <div className="doc-info">
                      <div className="doc-title">{doc.title}</div>
                      <div className="doc-summary">{doc.summary}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="design-sidebar-card">
                <h5>Lead Designer Intent</h5>
                <p>
                  All 8 initial rule edge cases (<code>BL-RULES-01</code> to <code>08</code>) have been officially codified,
                  and core balance behaviors (Momentum variance cushion, 2-HP glass-cannon vulnerability, and 3P Vanguard velocity)
                  are confirmed intentional.
                </p>
                <button
                  type="button"
                  className="sidebar-card-link"
                  onClick={() => setActiveTab('backlog')}
                >
                  View Resolved Decisions →
                </button>
              </div>
            </aside>

            {/* Main Content Reader */}
            <main className="design-content-area">
              {activeDoc ? (
                <article className="design-doc-article">
                  <div className="doc-header-banner">
                    <span className="doc-source-tag">SOURCE: {activeDoc.source_path}</span>
                    <h2 className="active-doc-heading">{activeDoc.title}</h2>
                    <p className="active-doc-lead">{activeDoc.summary}</p>
                  </div>

                  <div className="doc-markdown-body">
                    <MarkdownRenderer content={activeDoc.body} />
                  </div>
                </article>
              ) : (
                <div className="design-empty-state">Select a design document from the sidebar.</div>
              )}
            </main>
          </div>
        )}

        {activeTab === 'backlog' && (
          <div className="design-standalone-backlog">
            <div className="backlog-overview-card">
              <h3>🧭 Executive Design Companion Audit & Governance Backlog</h3>
              <p>
                Comprehensive audit of the <strong>Away Team 6.0 Engine</strong> ruleset, mathematical ledger (<code>9.0 ES</code>),
                edge-case timing windows, and simulation architecture. All 8 core rules timing questions have been codified
                with lead designer sign-off.
              </p>
            </div>

            <div className="backlog-section-grid">
              {/* Rules Decisions Table */}
              <div className="backlog-card">
                <div className="card-badge success">8 / 8 RULES CODIFIED & RESOLVED</div>
                <h4>Authoritative Rules Decisions Matrix</h4>
                <div className="backlog-table-wrap">
                  <table className="backlog-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>System / Chapter</th>
                        <th>Ambiguity / Edge Case</th>
                        <th>Adopted Designer Resolution</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>BL-RULES-01</code></td>
                        <td>Vault Economy & Payouts</td>
                        <td>Mission bounty shared pot vs per-faction</td>
                        <td><strong>Dual-Stream Model:</strong> <code>[2 CR]</code> / operative + <code>[1 PIP]</code> base stipend + equal split of remaining clearance pot, with odd remainder allocated by Squad Leader.</td>
                      </tr>
                      <tr>
                        <td><code>BL-RULES-02</code></td>
                        <td>Stage Resolution & Mortality</td>
                        <td>Lethal throw Dying Breath timing</td>
                        <td><strong>Dying Breath Rule:</strong> Successes rolled on a throw where Backfire reduces agent to <code>0 HP</code> lock in immediately for Stage Resolution in Step 5 even if operative dies in Step 4.</td>
                      </tr>
                      <tr>
                        <td><code>BL-RULES-03</code></td>
                        <td>Mortality & Vulture Claims</td>
                        <td>Order of stabilization and vulture claims</td>
                        <td><strong>Triage Right of First Refusal:</strong> Owning Faction first → Squad Leader second → Clockwise. <strong>Vulture Claims:</strong> Squad Leader declares first → Clockwise.</td>
                      </tr>
                      <tr>
                        <td><code>BL-RULES-04</code></td>
                        <td>Squad Leader Command</td>
                        <td>Zero-Credit Command Auction fallback</td>
                        <td><strong>Immediate d6 Roll-Off:</strong> If no player bids $\ge [1\text{ CR}]$, an immediate high-stakes d6 roll-off determines Squad Leader at <code>[0 CR]</code> cost.</td>
                      </tr>
                      <tr>
                        <td><code>BL-RULES-05</code></td>
                        <td>Classes & Focus</td>
                        <td>Technician bonus roll Early Resolution</td>
                        <td><strong>Phase 1 Window Extension:</strong> Technician <em>Adaptive Calibration</em> bonus rolls meeting Target Difficulty $D$ trigger Early Resolution and spare Phase 2 Support.</td>
                      </tr>
                      <tr>
                        <td><code>BL-RULES-06</code></td>
                        <td>Classes & Focus</td>
                        <td>Scientist Dual-Vector Phase 1 promotion</td>
                        <td><strong>Phase 1 Initiative Promotion:</strong> Operatives matching either the original or added Focus act in Phase 1 Initiative (<code>3+</code>). Meeting $D$ triggers Early Resolution.</td>
                      </tr>
                      <tr>
                        <td><code>BL-RULES-07</code></td>
                        <td>Squad Leader Swaps</td>
                        <td>Dynamic Focus Swaps vs Split Modifiers</td>
                        <td><strong>Dynamic Split Evaluation:</strong> Dynamic Focus Swaps alter the stage's active Focus immediately. Active Split-Effect Modifiers dynamically evaluate against the new Focus.</td>
                      </tr>
                      <tr>
                        <td><code>BL-RULES-08</code></td>
                        <td>Med Bay & Trauma</td>
                        <td>Critical Injury stacking at 0 Max HP</td>
                        <td><strong>Medically Grounded Protocol:</strong> Operatives reduced to <code>0 Max HP</code> are Ineligible to Deploy until at least 1 token is purged at Infirmary or Cybernetic Lab.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Confirmed Balance Models */}
              <div className="backlog-card">
                <div className="card-badge info">3 / 3 BALANCE PROPERTIES CONFIRMED</div>
                <h4>Confirmed Mathematical Balance Intent</h4>
                <div className="balance-insights-list">
                  <div className="balance-item">
                    <span className="balance-id">BL-BAL-01</span>
                    <div className="balance-body">
                      <h5>Operational Momentum as a Variance Cushion (Not an Over-Commitment Target)</h5>
                      <p>
                        Clearing by $\ge D + 2$ generates <code>[1 MOM]</code>. Intentionally over-committing ~3 extra dice
                        ($2.00\text{ ES}$) purely to farm <code>[1 MOM]</code> ($0.67\text{ ES}$ in a refunded die) is mathematically
                        net-negative. Momentum acts as an intentional variance cushion when normal rolls run hot, not an exploit loop.
                      </p>
                    </div>
                  </div>

                  <div className="balance-item">
                    <span className="balance-id">BL-BAL-02</span>
                    <div className="balance-body">
                      <h5>2-HP &quot;Glass Cannon&quot; Operatives & Backfire Vulnerability</h5>
                      <p>
                        Operatives with <code>2 HP / 8 Dice</code> (<em>Ghost Point</em>, <em>Virologist</em>, <em>Spymaster</em>) carry an intentional
                        <code>39.5%</code> mission attrition mortality risk from natural 1 Backfires. This intentionally elevates the value
                        of defensive <code>[Body]</code> armor and emergency <code>[1 EF]</code> field stabilization pacts.
                      </p>
                    </div>
                  </div>

                  <div className="balance-item">
                    <span className="balance-id">BL-BAL-03</span>
                    <div className="balance-body">
                      <h5>3-Player Vanguard Slot Loyalty Velocity</h5>
                      <p>
                        Double Loyalty accumulation (<code>[+2 LOY] = [4 VP]</code>) on the 3P Vanguard Slot is an intentional incentive
                        driving aggressive, high-stakes bidding (<code>[2–3 CR]</code>) in the Vanguard Auction, balancing the doubled static dice attrition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'adrs' && (
          <div className="design-standalone-adrs">
            <div className="backlog-overview-card">
              <h3>📋 Architecture Decision Records (ADRs)</h3>
              <p>
                Authoritative record of architectural, mathematical, and systemic governance decisions adopted across the Away Team platform.
              </p>
            </div>

            <div className="adrs-list">
              <div className="adr-item">
                <div className="adr-header">
                  <span className="adr-id">ADR-10</span>
                  <span className="adr-title">Rules 06–08 Codification & Balance Model Intent Confirmations</span>
                  <span className="adr-date">2026-10-25</span>
                </div>
                <p className="adr-text">
                  Codified Scientist Phase 1 initiative promotion (<code>BL-RULES-06</code>), Dynamic Split-Effect modifier interaction (<code>BL-RULES-07</code>),
                  and the Medically Grounded protocol for 0 Max HP operatives (<code>BL-RULES-08</code>). Confirmed intentionality of Momentum variance cushion (<code>BL-BAL-01</code>),
                  glass-cannon vulnerability (<code>BL-BAL-02</code>), and 3P Vanguard Loyalty velocity (<code>BL-BAL-03</code>).
                </p>
              </div>

              <div className="adr-item">
                <div className="adr-header">
                  <span className="adr-id">ADR-09</span>
                  <span className="adr-title">Internal Design Docs Split & Mission Failure Refactor ([FAIL])</span>
                  <span className="adr-date">2026-10-25</span>
                </div>
                <p className="adr-text">
                  Split internal balancing, ES math, and anti-dilution theory into <code>docs/design/</code> and a dedicated portal,
                  keeping player-facing rulebook in <code>/game/core/</code> clean with new Chapter 8 setup and glossary.
                  Thematically reframed &ldquo;Doom&rdquo; to corporate sci-fi <strong>Mission Failure Tracker ([FAIL])</strong> and Task Force Dissolution.
                </p>
              </div>

              <div className="adr-item">
                <div className="adr-header">
                  <span className="adr-id">ADR-08</span>
                  <span className="adr-title">Auto-Merge PR Workflow & Design Companion Backlog</span>
                  <span className="adr-date">2026-10-24</span>
                </div>
                <p className="adr-text">
                  Enforce atomic commits on side branches, PRs to <code>main</code>, automated CI verification, and auto-merge to <code>main</code>.
                  Maintain <code>BACKLOG.md</code> to track design companion rule audits and edge-case questions.
                </p>
              </div>

              <div className="adr-item">
                <div className="adr-header">
                  <span className="adr-id">ADR-07</span>
                  <span className="adr-title">Dedicated Wiki Pages, Inter-Clicky Links & 4-Tier Currency Taxonomy</span>
                  <span className="adr-date">2026-10-24</span>
                </div>
                <p className="adr-text">
                  Replaced popups with dedicated hash-routed Wiki pages, normalized compound tokens, and explicitly separated Primary Currencies (Credits, Effort, PIP)
                  from transient state (Momentum), character progression (Loyalty), and meta trackers (Failure, VP).
                </p>
              </div>

              <div className="adr-item">
                <div className="adr-header">
                  <span className="adr-id">ADR-06</span>
                  <span className="adr-title">Atomic Commits, Side-Branch PR Workflow & 5-Suite Automated Testing</span>
                  <span className="adr-date">2026-10-24</span>
                </div>
                <p className="adr-text">
                  Establish regression test suites covering repository layout, component schemas, 9.0 ES game math, VTT engine, and Monte Carlo simulator.
                </p>
              </div>

              <div className="adr-item">
                <div className="adr-header">
                  <span className="adr-id">ADR-01 to ADR-05</span>
                  <span className="adr-title">Repository Architecture, Canonical Ruleset & Custom Domain</span>
                  <span className="adr-date">2026-10-24</span>
                </div>
                <p className="adr-text">
                  Scaffolded the 208-file <code>/game/</code> hierarchy, 24-agent roster mapped to 9.0 ES budget, Astro + React/TS stack,
                  and custom domain configuration at <code>awayteam.inbarrose.com</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
