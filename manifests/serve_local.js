#!/usr/bin/env node
/**
 * AWAY TEAM — Instant Zero-Dependency Local Server
 * ------------------------------------------------
 * Runs manifests/generate_manifests.js and starts a local HTTP server on
 * http://localhost:4321 serving the full Wiki, 200-Card Browser, Art Manifest
 * Exporter, and interactive Virtual Tabletop (VTT) without requiring `npm install`.
 * (For full Astro + React hot-reloading development, use `npm install && npm run dev`.)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import './generate_manifests.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 4321);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

function buildStandaloneHtml() {
  const tokensCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'styles', 'tokens.css'), 'utf8');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AWAY TEAM — Rulebook Wiki, Card Browser & VTT (Local Server)</title>
  <style>${tokensCss}</style>
</head>
<body>
  <header class="at-navbar">
    <div class="at-brand">
      <span>AWAY TEAM</span>
      <span class="at-brand-badge">awayteam.inbarrose.com • LOCAL</span>
    </div>
    <nav class="at-nav-links">
      <button type="button" id="btn-wiki" class="at-nav-btn active">📖 Wiki, Rulebook & Card Database (200)</button>
      <button type="button" id="btn-vtt" class="at-nav-btn vtt-cta">🎲 Virtual Tabletop (VTT) Environment</button>
    </nav>
  </header>

  <div id="app-root"></div>

  <script type="module">
    const [coreRules, components, artManifest] = await Promise.all([
      fetch('/manifests/exports/core_rules.json').then(r => r.json()),
      fetch('/manifests/exports/all_components.json').then(r => r.json()),
      fetch('/manifests/exports/image_generation_manifest.json').then(r => r.json()),
    ]);

    const factions = components.filter(c => c.component_type === 'faction');
    const characters = components.filter(c => c.component_type === 'character');
    const items = components.filter(c => c.component_type === 'item');
    const missions = components.filter(c => c.component_type === 'mission' || c.component_type === 'side_mission');
    const modifiers = components.filter(c => c.component_type === 'modifier');

    const BADGE_MAP = {
      '[Combat]': 'badge-focus-combat',
      '[Infiltrate]': 'badge-focus-infiltrate',
      '[Intel]': 'badge-focus-intel',
      '[Operations]': 'badge-focus-ops',
      '[Negotiate]': 'badge-focus-negotiate',
      '[Survival]': 'badge-focus-survival',
      '[CR]': 'badge-currency-cr',
      '[EF]': 'badge-currency-ef',
      '[PIP]': 'badge-currency-pip',
      '[LOY]': 'badge-currency-loy',
      '[DOOM]': 'badge-currency-doom',
      '[MOM]': 'badge-currency-mom',
      '[VP]': 'badge-currency-vp',
      '[Head]': 'badge-slot',
      '[Body]': 'badge-slot',
      '[Legs]': 'badge-slot',
      '[Pack]': 'badge-slot',
      '[Hand L]': 'badge-slot',
      '[Hand R]': 'badge-slot',
      '[Consumable]': 'badge-slot',
      '[Complex]': 'badge-slot',
    };

    function formatSemantic(str = '') {
      const escaped = String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\`([^\`]+)\`/g, '<code>$1</code>');
      return escaped.replace(/\\[(Combat|Infiltrate|Intel|Operations|Negotiate|Survival|CR|EF|PIP|LOY|DOOM|MOM|VP|Head|Body|Legs|Pack|Hand L|Hand R|Consumable|Complex)\\]/g, (m, inner) => {
        const cls = BADGE_MAP[m] || 'badge-slot';
        return '<span class="semantic-badge ' + cls + '">' + inner + '</span>';
      });
    }

    function renderMarkdown(md = '') {
      return md.split(/\\r?\\n/).map(line => {
        const t = line.trim();
        if (!t) return '';
        if (t === '---') return '<hr style="border:none;border-top:1px solid var(--border-subtle);margin:1.25rem 0"/>';
        if (t.startsWith('# ')) return '<h1>' + formatSemantic(t.slice(2)) + '</h1>';
        if (t.startsWith('## ')) return '<h2>' + formatSemantic(t.slice(3)) + '</h2>';
        if (t.startsWith('### ')) return '<h3>' + formatSemantic(t.slice(4)) + '</h3>';
        if (t.startsWith('* ') || t.startsWith('- ')) return '<li>' + formatSemantic(t.slice(2)) + '</li>';
        return '<p>' + formatSemantic(t) + '</p>';
      }).join('');
    }

    let state = {
      mode: location.pathname === '/vtt' ? 'vtt' : 'wiki',
      section: 'rulebook',
      ruleSlug: coreRules[0]?.slug || 'rules_overview',
      search: '',
      focus: 'all',
      // VTT state
      missionId: missions[0]?.id || '',
      stageFocus: 'combat',
      targetDifficulty: 14,
      doom: 0,
      momentum: 0,
      vaults: [
        { name: 'Director P1', factionId: 'faction-aegis', cr: 12, ef: 3, pip: 2, vp: 0, leader: true },
        { name: 'Director P2', factionId: 'faction-nexus', cr: 12, ef: 3, pip: 2, vp: 0, leader: false },
        { name: 'Director P3', factionId: 'faction-vanderbilt', cr: 14, ef: 2, pip: 3, vp: 0, leader: false },
        { name: 'Director P4', factionId: 'faction-ascendant', cr: 12, ef: 3, pip: 2, vp: 0, leader: false },
      ],
      squad: [
        { charId: 'agent-01-commander', hp: 3, bonusDice: 0, rolled: [] },
        { charId: 'agent-07-ghost-point', hp: 2, bonusDice: 0, rolled: [] },
        { charId: 'agent-19-spymaster', hp: 2, bonusDice: 0, rolled: [] },
        { charId: 'agent-13-combat-medic', hp: 3, bonusDice: 0, rolled: [] },
      ],
    };

    const root = document.getElementById('app-root');
    document.getElementById('btn-wiki').onclick = () => { state.mode = 'wiki'; render(); };
    document.getElementById('btn-vtt').onclick = () => { state.mode = 'vtt'; render(); };

    function evalOp(slot) {
      const ch = characters.find(c => c.id === slot.charId) || characters[0];
      const p = ch?.focus_affinity?.primary?.toLowerCase();
      const s = ch?.focus_affinity?.secondary?.toLowerCase();
      let threshold = 5;
      let role = 'Phase 2: Out-of-Focus Assist (5+)';
      if (p === state.stageFocus) { threshold = 3; role = 'Phase 1: Primary Specialist (3+)'; }
      else if (s === state.stageFocus) { threshold = 4; role = 'Phase 1: Secondary Specialist (4+)'; }
      const pool = Math.max(1, (ch?.stats?.static_dice || 6) + slot.bonusDice);
      const hits = slot.rolled.filter(d => d >= threshold).length;
      const backfires = threshold === 5 ? slot.rolled.filter(d => d === 1).length : 0;
      return { ch, threshold, role, pool, hits, backfires };
    }

    function render() {
      document.getElementById('btn-wiki').classList.toggle('active', state.mode === 'wiki');
      document.getElementById('btn-vtt').classList.toggle('active', state.mode === 'vtt');

      if (state.mode === 'vtt') {
        const evals = state.squad.map(evalOp);
        const totalHits = evals.reduce((s, e) => s + e.hits, 0);
        const cleared = totalHits >= state.targetDifficulty;
        const momEarned = totalHits >= state.targetDifficulty + 2;

        root.innerHTML = \`
          <div class="vtt-container">
            <section class="vtt-panel">
              <div class="vtt-panel-title">
                <span>AWAY TEAM VIRTUAL TABLETOP (VTT) — STAGE & STATIC POOL DICE ENGINE</span>
                <div style="display:flex;gap:0.5rem">
                  <span class="semantic-badge badge-currency-doom">DOOM: \${state.doom}</span>
                  <span class="semantic-badge badge-currency-mom">MOMENTUM: \${state.momentum}</span>
                </div>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between;padding:0.85rem;background:var(--bg-card);border-radius:8px;margin-bottom:1rem">
                <div>
                  <label style="font-size:0.72rem;color:var(--text-secondary);display:block">STAGE OPERATIONAL FOCUS</label>
                  <select id="vtt-focus" style="padding:0.4rem;border-radius:4px;background:var(--bg-void);color:var(--text-primary);border:1px solid var(--border-strong)">
                    \${['combat','infiltrate','intel','operations','negotiate','survival'].map(f => \`
                      <option value="\${f}" \${state.stageFocus===f?'selected':''}>[\${f.toUpperCase()}]</option>
                    \`).join('')}
                  </select>
                </div>
                <div>
                  <div style="font-size:1rem;font-weight:800">
                    SQUAD TOTAL: \${totalHits} / \${state.targetDifficulty} SUCCESSES
                    \${cleared ? '✅ STAGE CLEARED!' : '⏳ ROLLING'}
                    \${momEarned ? ' ⚡ +1 [MOM] EARNED!' : ''}
                  </div>
                </div>
                <button id="vtt-roll-all" class="vtt-btn vtt-btn-primary" style="font-size:0.95rem;padding:0.6rem 1.2rem">
                  🎲 Roll All 4 Static Dice Pools
                </button>
              </div>

              <div class="vtt-grid-4">
                \${state.squad.map((slot, idx) => {
                  const ev = evals[idx];
                  return \`
                    <div style="padding:0.85rem;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:8px">
                      <select data-op-select="\${idx}" style="width:100%;padding:0.35rem;margin-bottom:0.4rem;background:var(--bg-void);color:var(--text-primary);border:1px solid var(--border-strong);border-radius:4px">
                        \${characters.map(c => \`<option value="\${c.id}" \${c.id===slot.charId?'selected':''}>\${c.title}</option>\`).join('')}
                      </select>
                      <div style="font-size:0.74rem;color:var(--currency-effort);font-family:var(--font-mono);margin-bottom:0.4rem">\${ev.role} • Pool: \${ev.pool}d6</div>
                      <div style="min-height:44px;padding:0.45rem;background:var(--bg-void);border-radius:6px;display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.4rem">
                        \${slot.rolled.length === 0 ? '<span style="font-size:0.75rem;color:var(--text-muted)">Click Roll above</span>' : slot.rolled.map(v => \`
                          <span class="die-cube \${v >= ev.threshold ? 'hit' : (ev.threshold===5 && v===1 ? 'backfire' : 'miss')}">\${v}</span>
                        \`).join('')}
                      </div>
                      <div style="font-size:0.78rem;font-weight:700;color:#34d399">Hits: \${ev.hits} \${ev.backfires ? '• ⚠ ' + ev.backfires + ' Backfire(s)' : ''}</div>
                    </div>
                  \`;
                }).join('')}
              </div>
            </section>
          </div>
        \`;

        document.getElementById('vtt-focus').onchange = (e) => { state.stageFocus = e.target.value; render(); };
        document.getElementById('vtt-roll-all').onclick = () => {
          state.squad = state.squad.map(slot => {
            const ev = evalOp(slot);
            return { ...slot, rolled: Array.from({ length: ev.pool }, () => Math.floor(Math.random() * 6) + 1) };
          });
          render();
        };
        root.querySelectorAll('[data-op-select]').forEach(sel => {
          sel.onchange = (e) => {
            const i = Number(sel.dataset.opSelect);
            state.squad[i].charId = e.target.value;
            state.squad[i].rolled = [];
            render();
          };
        });
        return;
      }

      const filtered = components.filter(c => {
        if (state.section !== 'all' && state.section !== 'rulebook' && c.component_type !== state.section) return false;
        if (state.focus !== 'all') {
          const p = c.focus_affinity?.primary?.toLowerCase();
          const s = c.focus_affinity?.secondary?.toLowerCase();
          if (p !== state.focus && s !== state.focus) return false;
        }
        if (state.search) {
          const q = state.search.toLowerCase();
          const hay = (c.id + ' ' + c.title + ' ' + (c.rules_text || '')).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      const activeRule = coreRules.find(r => r.slug === state.ruleSlug) || coreRules[0];

      root.innerHTML = \`
        <div class="wiki-shell">
          <aside class="wiki-sidebar">
            <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);margin-bottom:0.5rem">1. CORE RULEBOOK (8)</div>
            \${coreRules.map(r => \`
              <button data-rule="\${r.slug}" style="display:block;width:100%;text-align:left;padding:0.45rem 0.6rem;margin-bottom:0.2rem;border-radius:6px;background:\${state.section==='rulebook'&&state.ruleSlug===r.slug?'rgba(0,229,255,0.12)':'transparent'};border:1px solid \${state.section==='rulebook'&&state.ruleSlug===r.slug?'var(--currency-effort)':'transparent'};color:var(--text-primary);cursor:pointer;font-size:0.8rem">
                \${r.title.replace(/^AWAY TEAM —\\s*/i, '')}
              </button>
            \`).join('')}
            <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);margin:1rem 0 0.5rem">2. COMPONENT DATABASE (200)</div>
            \${[
              ['all', 'All Components (200)'],
              ['character', 'Operatives (24)'],
              ['item', 'Armory Items (87)'],
              ['faction', 'Factions (8)'],
              ['hq_facility', 'HQ Facilities (5)'],
              ['hq_landmark', 'HQ Landmarks (4)'],
              ['perk', 'Perks (12)'],
              ['agenda', 'Open Agendas (24)'],
              ['secret_objective', 'Secret Objectives (10)'],
              ['modifier', 'Stage Modifiers (12)'],
              ['mission', 'Missions (7)'],
              ['side_mission', 'Side-Missions (5)'],
            ].map(([sec, lbl]) => \`
              <button data-sec="\${sec}" style="display:block;width:100%;text-align:left;padding:0.45rem 0.6rem;margin-bottom:0.2rem;border-radius:6px;background:\${state.section===sec?'var(--bg-card)':'transparent'};border:1px solid \${state.section===sec?'var(--border-strong)':'transparent'};color:var(--text-primary);cursor:pointer;font-size:0.8rem">
                \${lbl}
              </button>
            \`).join('')}
          </aside>
          <main class="wiki-main">
            \${state.section === 'rulebook' ? \`
              <div class="rulebook-article">\${renderMarkdown(activeRule.body)}</div>
            \` : \`
              <div class="card-grid">
                \${filtered.map(c => \`
                  <article class="at-card">
                    <header class="at-card-header">
                      <div>
                        <h3 class="at-card-title">\${c.title}</h3>
                        <div class="at-card-subtitle">\${c.component_type} • \${c.category || ''}</div>
                      </div>
                      <div class="at-card-cost-cluster">
                        \${c.cost?.credits ? '<span class="semantic-badge badge-currency-cr">' + c.cost.credits + ' CR</span>' : ''}
                      </div>
                    </header>
                    <div class="at-card-art-frame">
                      <div class="at-card-art-meta"><span>ART SPEC • \${c.art_spec.aspect_ratio}</span><span>\${c.art_spec.asset_path}</span></div>
                      <p class="at-card-art-prompt">“\${c.art_spec.visual_description}”</p>
                    </div>
                    <div class="at-card-body"><div>\${formatSemantic(c.rules_text || '')}</div></div>
                    <footer class="at-card-footer"><span>\${c.id}</span><span>×\${c.deck_copies || 1}</span></footer>
                  </article>
                \`).join('')}
              </div>
            \`}
          </main>
        </div>
      \`;

      root.querySelectorAll('[data-rule]').forEach(btn => {
        btn.onclick = () => { state.section = 'rulebook'; state.ruleSlug = btn.dataset.rule; render(); };
      });
      root.querySelectorAll('[data-sec]').forEach(btn => {
        btn.onclick = () => { state.section = btn.dataset.sec; render(); };
      });
    }

    render();
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];

  if (urlPath === '/' || urlPath === '/vtt' || urlPath === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildStandaloneHtml());
    return;
  }

  const safeRel = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const candidatePaths = [
    path.join(ROOT_DIR, safeRel),
    path.join(ROOT_DIR, 'public', safeRel),
  ];

  for (const filePath of candidatePaths) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(` 🚀 AWAY TEAM Local Server running at:`);
  console.log(`    http://localhost:${PORT}`);
  console.log('====================================================');
});
