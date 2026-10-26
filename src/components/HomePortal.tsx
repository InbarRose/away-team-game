import React from 'react';
import { GameComponent } from './ComponentCard';
import { CoreRuleChapter } from './WikiPortal';

interface HomePortalProps {
  coreRules: CoreRuleChapter[];
  components: GameComponent[];
  onNavigateWiki: (route?: string) => void;
  onNavigateVTT: () => void;
  onNavigateDesign: (docSlug?: string) => void;
  onOpenIssueModal: (template?: string) => void;
}

export function HomePortal({
  coreRules,
  components,
  onNavigateWiki,
  onNavigateVTT,
  onNavigateDesign,
  onOpenIssueModal,
}: HomePortalProps) {
  const componentCount = components.length;
  const factionCount = components.filter((c) => c.component_type === 'faction').length;
  const agentCount = components.filter((c) => c.component_type === 'character').length;
  const armoryCount = components.filter((c) => c.component_type === 'item').length;
  const missionCount = components.filter((c) =>
    ['mission', 'side_mission'].includes(c.component_type)
  ).length;

  return (
    <div className="home-portal-container">
      {/* 1. HERO COMMAND DECK */}
      <section className="home-hero">
        <div className="home-hero-badge">
          <span className="pulse-indicator"></span>
          <span>OFFICIAL DIGITAL HUB • 6.0 TABLETOP ENGINE</span>
        </div>

        <h1 className="home-hero-title">
          AWAY <span className="text-gradient-cyan">TEAM</span>
        </h1>

        <p className="home-hero-tagline">
          A semi-cooperative corporate tactical campaign game for 1 to 4 players.
        </p>

        <p className="home-hero-description">
          Embody rival executive <strong>Faction Directors</strong> within Agency Headquarters.
          Deploy 4-operative specialist squads into hostile sectors, manage finite static dice pools,
          and balance cutthroat private profit against the collective risk of <strong>Task Force Dissolution</strong>.
        </p>

        {/* Primary Call to Actions */}
        <div className="home-hero-actions">
          <button
            type="button"
            className="home-cta-btn primary"
            onClick={() => onNavigateWiki('#/wiki/print-rulebook')}
          >
            <span className="btn-icon">📘</span>
            <div className="btn-label-group">
              <span className="btn-title">Official Rulebook</span>
              <span className="btn-sub">Print-Style Rulebook & Tabletop Setup</span>
            </div>
          </button>

          <button
            type="button"
            className="home-cta-btn vtt"
            onClick={onNavigateVTT}
          >
            <span className="btn-icon">🎲</span>
            <div className="btn-label-group">
              <span className="btn-title">Virtual Tabletop & Simulator</span>
              <span className="btn-sub">Playable 7-Step Sequencer & Monte Carlo</span>
            </div>
          </button>

          <button
            type="button"
            className="home-cta-btn design"
            onClick={() => onNavigateDesign('01_mathematical_engine_and_9es_ledger')}
          >
            <span className="btn-icon">🔬</span>
            <div className="btn-label-group">
              <span className="btn-title">Design Companion & Math</span>
              <span className="btn-sub">9.0 ES Ledger & System Dossiers</span>
            </div>
          </button>
        </div>

        {/* Telemetry Stat Strip */}
        <div className="home-stat-strip">
          <div className="home-stat-item">
            <span className="stat-value">{componentCount}</span>
            <span className="stat-label">Components</span>
          </div>
          <div className="home-stat-divider"></div>
          <div className="home-stat-item">
            <span className="stat-value">{factionCount}</span>
            <span className="stat-label">Factions</span>
          </div>
          <div className="home-stat-divider"></div>
          <div className="home-stat-item">
            <span className="stat-value">{agentCount}</span>
            <span className="stat-label">Specialist Agents</span>
          </div>
          <div className="home-stat-divider"></div>
          <div className="home-stat-item">
            <span className="stat-value">{armoryCount}</span>
            <span className="stat-label">Armory Items</span>
          </div>
          <div className="home-stat-divider"></div>
          <div className="home-stat-item">
            <span className="stat-value">{missionCount}</span>
            <span className="stat-label">Missions</span>
          </div>
          <div className="home-stat-divider"></div>
          <div className="home-stat-item">
            <span className="stat-value">9.0 ES</span>
            <span className="stat-label">Math Balance</span>
          </div>
        </div>
      </section>

      {/* 2. THE THREE DIGITAL PILLARS */}
      <section className="home-section">
        <div className="section-header-centered">
          <span className="section-eyebrow">ECOSYSTEM ARCHITECTURE</span>
          <h2 className="section-title">Explore the Away Team Platform</h2>
          <p className="section-subtitle">
            Three interconnected environments designed for players, game masters, and system designers.
          </p>
        </div>

        <div className="home-pillars-grid">
          {/* Pillar 1: Rules Wiki */}
          <div className="home-pillar-card wiki-pillar">
            <div className="pillar-header">
              <span className="pillar-icon">📖</span>
              <span className="pillar-tag">PLAYER REFERENCE</span>
            </div>
            <h3 className="pillar-title">Rules Wiki & Component Database</h3>
            <p className="pillar-desc">
              Comprehensive static game reference detailing the complete 6.0 tabletop rules,
              the 50/35/15 Focus pyramid, the 4-tier currency taxonomy, and filterable databases
              for all 200 physical cards and tokens.
            </p>
            <ul className="pillar-feature-list">
              <li>✨ <strong>8 Core Rulebook Chapters</strong> with worked examples and setup diagrams</li>
              <li>📜 <strong>Emulated Print Rulebook Reader</strong> with book pagination and callouts</li>
              <li>🗂️ <strong>Card Browser</strong> for 24 Operatives, 87 Armory Items, and 8 Factions</li>
              <li>🎨 <strong>Asset Generation Manifests</strong> with standardized AI art prompts</li>
            </ul>
            <div className="pillar-footer">
              <button
                type="button"
                className="pillar-action-btn"
                onClick={() => onNavigateWiki('#/wiki/print-rulebook')}
              >
                Read Rulebook →
              </button>
              <button
                type="button"
                className="pillar-sub-btn"
                onClick={() => onNavigateWiki('#/wiki/database/all')}
              >
                Browse All Cards ({componentCount})
              </button>
            </div>
          </div>

          {/* Pillar 2: Virtual Tabletop */}
          <div className="home-pillar-card vtt-pillar">
            <div className="pillar-header">
              <span className="pillar-icon">🎲</span>
              <span className="pillar-tag">SIMULATION & PLAY</span>
            </div>
            <h3 className="pillar-title">Virtual Tabletop & Balance Engine</h3>
            <p className="pillar-desc">
              A browser-native virtual game environment to stage squads, test mission encounters,
              roll dice with automatic backfire and momentum calculations, and run high-iteration
              Monte Carlo statistical simulations.
            </p>
            <ul className="pillar-feature-list">
              <li>🎯 <strong>7-Step Mission Sequencer</strong> with live contextual rules coach hints</li>
              <li>🎲 <strong>True Static Dice Pools</strong> with spent tracking and momentum die refunds</li>
              <li>🏛️ <strong>4-Player Vaults</strong> for Credits, Effort, and Political Influence</li>
              <li>📊 <strong>1,000-Trial Monte Carlo Simulator</strong> with Phase 1 Early Resolution checks</li>
            </ul>
            <div className="pillar-footer">
              <button
                type="button"
                className="pillar-action-btn vtt-btn"
                onClick={onNavigateVTT}
              >
                Launch Tabletop →
              </button>
              <button
                type="button"
                className="pillar-sub-btn"
                onClick={onNavigateVTT}
              >
                Open Monte Carlo Tool
              </button>
            </div>
          </div>

          {/* Pillar 3: Design Companion */}
          <div className="home-pillar-card design-pillar">
            <div className="pillar-header">
              <span className="pillar-icon">🔬</span>
              <span className="pillar-tag">SYSTEMS ENGINEERING</span>
            </div>
            <h3 className="pillar-title">Design Companion & Mathematical Dossiers</h3>
            <p className="pillar-desc">
              Independent systems documentation separating internal developer math and theory
              from player-facing text. Includes the atomic Expected Success (ES) ledger, economic friction
              models, and the active product backlog.
            </p>
            <ul className="pillar-feature-list">
              <li>📐 <strong>Atomic 9.0 ES Ledger</strong> character budget formulas and offset math</li>
              <li>⚖️ <strong>Skewed Focus Pyramid & Anti-Dilution</strong> 50/35/15 challenge design</li>
              <li>🤝 <strong>Semi-Co-op Paradox</strong> anti-quarterbacking and incentive alignment</li>
              <li>🧭 <strong>Design Companion Audit</strong> with all 8 codified rule edge cases</li>
            </ul>
            <div className="pillar-footer">
              <button
                type="button"
                className="pillar-action-btn design-btn"
                onClick={() => onNavigateDesign()}
              >
                Open Design Companion →
              </button>
              <button
                type="button"
                className="pillar-sub-btn"
                onClick={() => onNavigateDesign('01_mathematical_engine_and_9es_ledger')}
              >
                View 9.0 ES Ledger
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE ENGINE PILLARS */}
      <section className="home-section dark-alt">
        <div className="section-header-centered">
          <span className="section-eyebrow">RULES ARCHITECTURE</span>
          <h2 className="section-title">The Four Mechanical Innovations of the 6.0 Engine</h2>
        </div>

        <div className="home-mechanics-grid">
          <div className="mechanic-card">
            <div className="mechanic-number">01</div>
            <h4>The Static Pool Paradigm</h4>
            <p>
              Operatives do not refresh dice each turn. Instead, each specialist begins a multi-stage
              operation with a static mission pool (6 to 8 dice). Spent dice remain exhausted until
              restored via Operational Momentum or Squad Leader Logistical Refreshes.
            </p>
          </div>

          <div className="mechanic-card">
            <div className="mechanic-number">02</div>
            <h4>The 50 / 35 / 15 Focus Pyramid</h4>
            <p>
              Encounter hazards follow a deliberate distribution: <strong>50% Combat</strong>,
              <strong>35% Operational Objectives</strong> (Intel, Infiltrate, Negotiate), and
              <strong>15% Friction Hazards</strong> (Operations, Survival). Primary Specialists roll at <code>3+</code>,
              while Out-of-Focus agents roll at <code>5+</code> with double exposure to Backfires.
            </p>
          </div>

          <div className="mechanic-card">
            <div className="mechanic-number">03</div>
            <h4>Operational Momentum ([MOM])</h4>
            <p>
              Clearing a stage with an excess margin of <code>≥ D + 2</code> successes generates Momentum.
              Only operatives who put &ldquo;skin in the game&rdquo; by committing dice can receive refunded dice,
              creating compelling tactical cooperation without quarterbacking.
            </p>
          </div>

          <div className="mechanic-card">
            <div className="mechanic-number">04</div>
            <h4>The Semi-Cooperative Paradox</h4>
            <p>
              Victory is strictly personal—the Faction Director with the most Victory Points ([VP]) wins.
              Yet neglecting team triage advances the global <strong>Mission Failure Tracker ([FAIL])</strong>.
              If failures exceed mission limits, the task force dissolves and everyone loses.
            </p>
          </div>
        </div>
      </section>

      {/* 4. GITHUB COMMUNITY, FEEDBACK & ISSUE TEMPLATES */}
      <section className="home-section community-section">
        <div className="community-card">
          <div className="community-info">
            <div className="community-badge">OPEN SOURCE & PLAYTESTING</div>
            <h3>Join the Design & Playtesting Effort</h3>
            <p>
              The entire Away Team digital platform—including rulebooks, component data manifests,
              generative art pipeline, and virtual tabletop engine—is fully open-source and version-controlled.
              Encountered a rules ambiguity, have a balance proposal, or want to suggest a new feature?
            </p>
            <div className="community-links">
              <a
                href="https://github.com/InbarRose/away-team-game"
                target="_blank"
                rel="noreferrer"
                className="github-main-link"
              >
                <svg className="github-svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>View on GitHub</span>
              </a>
              <span className="community-subtext">github.com/InbarRose/away-team-game</span>
            </div>
          </div>

          <div className="community-actions-panel">
            <span className="panel-title">Report an Issue / Submit Feedback</span>
            <div className="issue-template-buttons">
              <button
                type="button"
                className="issue-btn bug"
                onClick={() => onOpenIssueModal('bug_report.md')}
              >
                <span className="issue-icon">🐛</span>
                <div className="issue-text">
                  <span className="issue-title">Report a Bug or Rules Ambiguity</span>
                  <span className="issue-desc">Flag rules questions, calculation glitches, or VTT bugs</span>
                </div>
              </button>

              <button
                type="button"
                className="issue-btn feedback"
                onClick={() => onOpenIssueModal('gameplay_feedback.md')}
              >
                <span className="issue-icon">💡</span>
                <div className="issue-text">
                  <span className="issue-title">Gameplay & Balance Feedback</span>
                  <span className="issue-desc">Share playtest findings, character tuning, or ideas</span>
                </div>
              </button>

              <button
                type="button"
                className="issue-btn feature"
                onClick={() => onOpenIssueModal('feature_request.md')}
              >
                <span className="issue-icon">✨</span>
                <div className="issue-text">
                  <span className="issue-title">Request a Feature</span>
                  <span className="issue-desc">Suggest UI enhancements, VTT tools, or export options</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-title">AWAY TEAM DIGITAL HUB</span>
            <span className="footer-subtitle">6.0 Hybrid Tabletop Engine & Virtual Tabletop</span>
          </div>
          <div className="footer-links">
            <button type="button" onClick={() => onNavigateWiki('#/wiki/print-rulebook')}>
              Rulebook
            </button>
            <button type="button" onClick={() => onNavigateWiki('#/wiki/database/all')}>
              Card Database
            </button>
            <button type="button" onClick={onNavigateVTT}>
              Tabletop Simulator
            </button>
            <button type="button" onClick={() => onNavigateDesign()}>
              Design Companion
            </button>
            <a
              href="https://github.com/InbarRose/away-team-game"
              target="_blank"
              rel="noreferrer"
            >
              GitHub Source
            </a>
          </div>
        </div>
        <div className="footer-copy">
          Designed and engineered for high-tactical tabletop gaming. Hosted at awayteam.inbarrose.com.
        </div>
      </footer>
    </div>
  );
}
