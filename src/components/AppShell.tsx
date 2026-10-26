import React, { useEffect, useState } from 'react';
import { CoreRuleChapter, WikiPortal } from './WikiPortal';
import { GameComponent } from './ComponentCard';
import { VirtualTabletop } from '../vtt/VirtualTabletop';
import { HomePortal } from './HomePortal';
import { DesignCompanionPortal } from './DesignCompanionPortal';
import { navigateWiki } from './SemanticText';

export type AppMode = 'home' | 'wiki' | 'design' | 'vtt';

interface AppShellProps {
  initialMode?: AppMode;
  coreRules: CoreRuleChapter[];
  components: GameComponent[];
  artManifest: any[];
}

const GITHUB_REPO_URL = 'https://github.com/InbarRose/away-team-game';

export function AppShell({
  initialMode = 'home',
  coreRules,
  components,
  artManifest,
}: AppShellProps) {
  const [mode, setMode] = useState<AppMode>(initialMode);
  const [activeDesignSlug, setActiveDesignSlug] = useState<string | undefined>(undefined);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedIssueTemplate, setSelectedIssueTemplate] = useState<string | null>(null);

  // Synchronize hash routing with top-level modes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';
      if (!hash || hash === '#' || hash === '#/home' || hash === '#home') {
        setMode('home');
      } else if (hash.startsWith('#/design') || hash.startsWith('#design')) {
        setMode('design');
        const parts = hash.split('/');
        if (parts.length > 2 && parts[2]) {
          setActiveDesignSlug(parts[2]);
        }
      } else if (hash.startsWith('#/vtt') || hash.startsWith('#vtt')) {
        setMode('vtt');
      } else if (hash.startsWith('#/wiki') || hash.startsWith('#wiki')) {
        setMode('wiki');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openRoute = (targetMode: AppMode, hashRoute?: string) => {
    setMode(targetMode);
    if (hashRoute) {
      window.location.hash = hashRoute;
      setTimeout(() => navigateWiki(hashRoute), 0);
    } else {
      if (targetMode === 'home') window.location.hash = '#/home';
      else if (targetMode === 'vtt') window.location.hash = '#/vtt';
      else if (targetMode === 'design') window.location.hash = '#/design';
      else if (targetMode === 'wiki') window.location.hash = '#/wiki/print-rulebook';
    }
  };

  const handleOpenIssueModal = (template?: string) => {
    setSelectedIssueTemplate(template || null);
    setIssueModalOpen(true);
  };

  const handleLaunchGithubIssue = (templateName: string) => {
    const url = `${GITHUB_REPO_URL}/issues/new?template=${templateName}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIssueModalOpen(false);
  };

  return (
    <div className="at-app-container">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="at-navbar">
        {/* Brand / Logo */}
        <div
          className="at-brand"
          onClick={() => openRoute('home', '#/home')}
          title="Return to Away Team Homepage"
        >
          <span className="at-brand-title">AWAY TEAM</span>
          <span className="at-brand-badge">6.0 TABLETOP ENGINE</span>
        </div>

        {/* Center Primary Section Navigation */}
        <nav className="at-nav-links">
          <button
            type="button"
            className={`at-nav-btn ${mode === 'home' ? 'active' : ''}`}
            onClick={() => openRoute('home', '#/home')}
            title="Homepage & Platform Overview"
          >
            🏠 Home
          </button>

          <button
            type="button"
            className={`at-nav-btn ${mode === 'wiki' ? 'active' : ''}`}
            onClick={() => openRoute('wiki', '#/wiki/print-rulebook')}
            title="Official Rulebook, 200 Components Database & Currencies Guide"
          >
            📖 Rules Wiki
          </button>

          <button
            type="button"
            className={`at-nav-btn ${mode === 'design' ? 'active' : ''}`}
            onClick={() => openRoute('design', '#/design')}
            title="Design Companion, Mathematical Ledger (9.0 ES), and Engineering Dossiers"
          >
            🔬 Design Companion
          </button>

          <button
            type="button"
            className={`at-nav-btn vtt-cta ${mode === 'vtt' ? 'active' : ''}`}
            onClick={() => openRoute('vtt', '#/vtt')}
            title="Virtual Tabletop: 7-Step Mission Sequencer & Monte Carlo Simulator"
          >
            🎲 Virtual Tabletop
          </button>
        </nav>

        {/* Right Community & Action Links */}
        <div className="at-nav-actions">
          <button
            type="button"
            className="at-nav-action-btn issue-trigger"
            onClick={() => handleOpenIssueModal()}
            title="Report a bug, suggest rules feedback, or request features"
          >
            <span className="action-icon">💬</span>
            <span className="action-text">Feedback & Issues</span>
          </button>

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="at-nav-action-btn github-btn"
            title="View Source Repository on GitHub"
          >
            <svg
              className="github-svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="action-text">GitHub</span>
          </a>
        </div>
      </header>

      {/* 2. BODY CONTENT (BY MODE) */}
      <main className="at-main-content">
        {mode === 'home' && (
          <HomePortal
            coreRules={coreRules}
            components={components}
            onNavigateWiki={(route) => openRoute('wiki', route || '#/wiki/print-rulebook')}
            onNavigateVTT={() => openRoute('vtt', '#/vtt')}
            onNavigateDesign={(slug) => {
              setActiveDesignSlug(slug);
              openRoute('design', slug ? `#/design/${slug}` : '#/design');
            }}
            onOpenIssueModal={handleOpenIssueModal}
          />
        )}

        {mode === 'wiki' && (
          <WikiPortal
            coreRules={coreRules}
            components={components}
            artManifest={artManifest}
            onLaunchVTT={() => openRoute('vtt', '#/vtt')}
            onNavigateDesign={(slug) => {
              setActiveDesignSlug(slug);
              openRoute('design', slug ? `#/design/${slug}` : '#/design');
            }}
          />
        )}

        {mode === 'design' && (
          <DesignCompanionPortal
            initialSlug={activeDesignSlug}
            onLaunchVTT={() => openRoute('vtt', '#/vtt')}
            onOpenIssueModal={handleOpenIssueModal}
            onNavigateHome={() => openRoute('home', '#/home')}
          />
        )}

        {mode === 'vtt' && (
          <VirtualTabletop
            components={components}
            onNavigateWiki={(route) => openRoute('wiki', route)}
          />
        )}
      </main>

      {/* 3. GITHUB ISSUE / FEEDBACK MODAL */}
      {issueModalOpen && (
        <div className="at-modal-overlay" onClick={() => setIssueModalOpen(false)}>
          <div
            className="at-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="at-modal-header">
              <div className="modal-title-group">
                <span className="modal-badge">GITHUB ISSUES PIPELINE</span>
                <h3 className="modal-title">Submit Feedback & Report Issues</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIssueModalOpen(false)}
                title="Close modal"
              >
                ✕
              </button>
            </div>

            <p className="modal-lead">
              The Away Team engine and platform are maintained transparently on GitHub.
              Select an issue template below to open a pre-filled submission:
            </p>

            <div className="modal-templates-list">
              <button
                type="button"
                className="modal-template-btn bug"
                onClick={() => handleLaunchGithubIssue('bug_report.md')}
              >
                <div className="template-icon">🐛</div>
                <div className="template-info">
                  <span className="template-name">Report a Bug / Rules Ambiguity</span>
                  <span className="template-desc">
                    Flag rules calculation glitches, contradictory timing windows, or VTT errors.
                  </span>
                </div>
                <span className="template-arrow">→</span>
              </button>

              <button
                type="button"
                className="modal-template-btn feedback"
                onClick={() => handleLaunchGithubIssue('gameplay_feedback.md')}
              >
                <div className="template-icon">💡</div>
                <div className="template-info">
                  <span className="template-name">Gameplay & Balance Feedback</span>
                  <span className="template-desc">
                    Propose character stat tweaks, pricing adjustments, or encounter difficulty tuning.
                  </span>
                </div>
                <span className="template-arrow">→</span>
              </button>

              <button
                type="button"
                className="modal-template-btn feature"
                onClick={() => handleLaunchGithubIssue('feature_request.md')}
              >
                <div className="template-icon">✨</div>
                <div className="template-info">
                  <span className="template-name">Feature Request / UI Improvement</span>
                  <span className="template-desc">
                    Suggest enhancements for the Virtual Tabletop, Card Database, or export tools.
                  </span>
                </div>
                <span className="template-arrow">→</span>
              </button>
            </div>

            <div className="modal-footer">
              <a
                href={`${GITHUB_REPO_URL}/issues`}
                target="_blank"
                rel="noreferrer"
                className="modal-repo-link"
              >
                Browse all open issues & discussions on GitHub →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
