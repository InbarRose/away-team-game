import React, { useState } from 'react';
import { CoreRuleChapter, WikiPortal } from './WikiPortal';
import { GameComponent } from './ComponentCard';
import { VirtualTabletop } from '../vtt/VirtualTabletop';
import { navigateWiki } from './SemanticText';

interface AppShellProps {
  initialMode?: 'wiki' | 'vtt';
  coreRules: CoreRuleChapter[];
  components: GameComponent[];
  artManifest: any[];
}

export function AppShell({
  initialMode = 'wiki',
  coreRules,
  components,
  artManifest,
}: AppShellProps) {
  const [mode, setMode] = useState<'wiki' | 'vtt'>(initialMode);

  const openWikiRoute = (hash: string) => {
    setMode('wiki');
    setTimeout(() => navigateWiki(hash), 0);
  };

  return (
    <div>
      <header className="at-navbar">
        <div
          className="at-brand"
          onClick={() => openWikiRoute('#/wiki/home')}
          title="Return to Away Team Wiki Homepage"
        >
          <span>AWAY TEAM</span>
          <span className="at-brand-badge">6.0 ENGINE • SEMI-CO-OP</span>
        </div>

        <nav className="at-nav-links">
          <button
            type="button"
            className={`at-nav-btn ${mode === 'wiki' ? 'active' : ''}`}
            onClick={() => openWikiRoute('#/wiki/home')}
            title="Wiki Homepage: Abstract, Game Overview, Core Pillars & Quick Start"
          >
            🏠 Wiki Home
          </button>
          <button
            type="button"
            className="at-nav-btn"
            onClick={() => openWikiRoute('#/wiki/print-rulebook')}
            title="Emulated Official Print Board Game Rulebook with Callouts, Examples & Diagrams"
          >
            📘 Official Rulebook
          </button>
          <button
            type="button"
            className="at-nav-btn"
            onClick={() => openWikiRoute('#/wiki/database/all')}
            title="Browse all 200 Factions, Operatives, Items, Agendas, Modifiers & Missions"
          >
            🗂 Card Database ({components.length})
          </button>
          <button
            type="button"
            className="at-nav-btn"
            onClick={() => openWikiRoute('#/wiki/backlog')}
            title="Design Companion Audit: Rule Edge Cases, Balance Observations & Product Backlog"
          >
            🧭 Design Companion & Backlog
          </button>
          <button
            type="button"
            className={`at-nav-btn vtt-cta ${mode === 'vtt' ? 'active' : ''}`}
            onClick={() => setMode('vtt')}
            title="Playable 7-Step Sequenced Virtual Tabletop & Monte Carlo Balance Simulator"
          >
            🎲 Virtual Tabletop & Simulator
          </button>
        </nav>
      </header>

      {mode === 'wiki' ? (
        <WikiPortal
          coreRules={coreRules}
          components={components}
          artManifest={artManifest}
          onLaunchVTT={() => setMode('vtt')}
        />
      ) : (
        <VirtualTabletop components={components} />
      )}
    </div>
  );
}
