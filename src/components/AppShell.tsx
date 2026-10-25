import React, { useState } from 'react';
import { CoreRuleChapter, WikiPortal } from './WikiPortal';
import { GameComponent } from './ComponentCard';
import { VirtualTabletop } from '../vtt/VirtualTabletop';

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

  return (
    <div>
      <header className="at-navbar">
        <div className="at-brand">
          <span>AWAY TEAM</span>
          <span className="at-brand-badge">6.0 ENGINE • SEMI-CO-OP</span>
        </div>

        <nav className="at-nav-links">
          <button
            type="button"
            className={`at-nav-btn ${mode === 'wiki' ? 'active' : ''}`}
            onClick={() => setMode('wiki')}
          >
            📖 Wiki, Rulebook & Card Database ({components.length})
          </button>
          <button
            type="button"
            className={`at-nav-btn vtt-cta ${mode === 'vtt' ? 'active' : ''}`}
            onClick={() => setMode('vtt')}
          >
            🎲 Virtual Tabletop (VTT) Environment
          </button>
        </nav>
      </header>

      {mode === 'wiki' ? (
        <WikiPortal
          coreRules={coreRules}
          components={components}
          artManifest={artManifest}
        />
      ) : (
        <VirtualTabletop components={components} />
      )}
    </div>
  );
}
