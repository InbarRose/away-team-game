#!/usr/bin/env node
/**
 * AWAY TEAM — Instant Zero-Dependency Local Server
 * ------------------------------------------------
 * Runs manifests/generate_manifests.js and starts a local HTTP server on
 * http://localhost:4321 serving the full Wiki (with dedicated pages for every
 * component, Focus hub, Class hub, and Currency/Tracker guide), 200-Card Browser,
 * Art Manifest Exporter, and interactive Virtual Tabletop (VTT).
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
    <div class="at-brand" onclick="location.hash='#/wiki/rule/rules_overview'">
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

    const characters = components.filter(c => c.component_type === 'character');

    const BADGE_CLASS = {
      'Combat': ['badge-focus-combat', '#/wiki/focus/combat'],
      'Infiltrate': ['badge-focus-infiltrate', '#/wiki/focus/infiltrate'],
      'Intel': ['badge-focus-intel', '#/wiki/focus/intel'],
      'Operations': ['badge-focus-ops', '#/wiki/focus/operations'],
      'Negotiate': ['badge-focus-negotiate', '#/wiki/focus/negotiate'],
      'Survival': ['badge-focus-survival', '#/wiki/focus/survival'],
      'CR': ['badge-currency-cr', '#/wiki/concept/currencies'],
      'EF': ['badge-currency-ef', '#/wiki/concept/currencies'],
      'PIP': ['badge-currency-pip', '#/wiki/concept/currencies'],
      'LOY': ['badge-currency-loy', '#/wiki/concept/currencies'],
      'DOOM': ['badge-currency-doom', '#/wiki/rule/campaign_engine'],
      'MOM': ['badge-currency-mom', '#/wiki/concept/currencies'],
      'VP': ['badge-currency-vp', '#/wiki/concept/currencies'],
      'Head': ['badge-slot', '#/wiki/database/item'],
      'Body': ['badge-slot', '#/wiki/database/item'],
      'Legs': ['badge-slot', '#/wiki/database/item'],
      'Pack': ['badge-slot', '#/wiki/database/item'],
      'Hand L': ['badge-slot', '#/wiki/database/item'],
      'Hand R': ['badge-slot', '#/wiki/database/item'],
      'Hand': ['badge-slot', '#/wiki/database/item'],
      'Consumable': ['badge-slot', '#/wiki/database/item'],
      'Complex': ['badge-slot', '#/wiki/database/item'],
    };

    function formatSemantic(str = '') {
      let s = String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\`([^\`]+)\`/g, '<code>$1</code>');

      // Compound quantity tokens e.g. [+1 CR], [-1 PIP], [2 EF], [10+ LOY], [+3 VP]
      s = s.replace(/\\[([+-]?\\d+(?:[–-]\\d+|\\+)?)\\s+(CR|EF|PIP|LOY|DOOM|MOM|VP)\\]/g, (_, qty, unit) => {
        const [cls, href] = BADGE_CLASS[unit] || ['badge-slot', '#/wiki/concept/currencies'];
        return '<a href="' + href + '" class="semantic-badge clickable ' + cls + '">' + qty + ' ' + unit + '</a>';
      });

      // Standard tokens e.g. [Combat], [CR], [Head]
      s = s.replace(/\\[(Combat|Infiltrate|Intel|Operations|Negotiate|Survival|CR|EF|PIP|LOY|DOOM|MOM|VP|Head|Body|Legs|Pack|Hand L|Hand R|Hand|Consumable|Complex)\\]/g, (_, inner) => {
        const [cls, href] = BADGE_CLASS[inner] || ['badge-slot', '#/wiki/database/all'];
        return '<a href="' + href + '" class="semantic-badge clickable ' + cls + '">' + inner + '</a>';
      });
      return s;
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
      componentId: components[0]?.id || '',
      focusKey: 'combat',
      search: '',
      stageFocus: 'combat',
      targetDifficulty: 14,
      doom: 0,
      momentum: 0,
      squad: [
        { charId: 'agent-01-commander', hp: 3, bonusDice: 0, rolled: [] },
        { charId: 'agent-07-ghost-point', hp: 2, bonusDice: 0, rolled: [] },
        { charId: 'agent-19-spymaster', hp: 2, bonusDice: 0, rolled: [] },
        { charId: 'agent-13-combat-medic', hp: 3, bonusDice: 0, rolled: [] },
      ],
    };

    function syncFromHash() {
      const h = (location.hash || '').replace(/^#/, '');
      if (!h.startsWith('/wiki')) return;
      state.mode = 'wiki';
      const segs = h.slice(6).split('?')[0].split('/').filter(Boolean);
      if (segs[0] === 'rule' && segs[1]) { state.section = 'rulebook'; state.ruleSlug = segs[1]; }
      else if (segs[0] === 'component' && segs[1]) { state.section = 'component_page'; state.componentId = segs[1]; }
      else if (segs[0] === 'focus' && segs[1]) { state.section = 'focus_page'; state.focusKey = segs[1]; }
      else if (segs[0] === 'concept' && segs[1] === 'currencies') { state.section = 'currencies_guide'; }
      else if (segs[0] === 'database' && segs[1]) { state.section = segs[1]; }
      render();
    }

    window.addEventListener('hashchange', syncFromHash);

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
                  <span class="semantic-badge badge-currency-doom">META DOOM: \${state.doom}</span>
                  <span class="semantic-badge badge-currency-mom">IN-MISSION MOM: \${state.momentum}</span>
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

      const activeRule = coreRules.find(r => r.slug === state.ruleSlug) || coreRules[0];
      const activeComp = components.find(c => c.id === state.componentId) || components[0];

      const filtered = components.filter(c => {
        if (!['all','rulebook','component_page','currencies_guide','focus_page'].includes(state.section) && c.component_type !== state.section) return false;
        return true;
      });

      let mainHtml = '';
      if (state.section === 'rulebook') {
        mainHtml = \`<div class="rulebook-article">\${renderMarkdown(activeRule.body)}</div>\`;
      } else if (state.section === 'component_page' && activeComp) {
        mainHtml = \`
          <div class="wiki-breadcrumbs">
            <a href="#/wiki/database/all" class="wiki-breadcrumb-btn">Wiki Database</a> ›
            <a href="#/wiki/database/\${activeComp.component_type}" class="wiki-breadcrumb-btn">\${activeComp.component_type}</a> ›
            <strong>\${activeComp.title}</strong>
          </div>
          <div class="rulebook-article">
            <div style="padding:0.75rem 1rem;background:var(--bg-card);border-left:4px solid var(--currency-effort);border-radius:6px;margin-bottom:1rem">
              \${formatSemantic(activeComp.rules_text || '')}
            </div>
            \${renderMarkdown(activeComp.body || '')}
          </div>
        \`;
      } else {
        mainHtml = \`
          <div class="card-grid">
            \${filtered.map(c => \`
              <article class="at-card">
                <header class="at-card-header">
                  <div>
                    <a href="#/wiki/component/\${c.id}" class="at-card-title-link">\${c.title}</a>
                    <div class="at-card-subtitle">\${c.component_type} • \${c.category || ''}</div>
                  </div>
                  <div class="at-card-cost-cluster">
                    \${c.cost?.credits ? formatSemantic('[' + c.cost.credits + ' CR]') : ''}
                  </div>
                </header>
                <div class="at-card-art-frame">
                  <div class="at-card-art-meta"><span>ART SPEC • \${c.art_spec.aspect_ratio}</span><span>\${c.art_spec.asset_path}</span></div>
                  <p class="at-card-art-prompt">“\${c.art_spec.visual_description}”</p>
                </div>
                <div class="at-card-body">
                  <div>\${formatSemantic(c.rules_text || '')}</div>
                  <a href="#/wiki/component/\${c.id}" class="vtt-btn" style="align-self:flex-start;text-decoration:none">Open Wiki Page →</a>
                </div>
                <footer class="at-card-footer"><span>\${c.id}</span><span>×\${c.deck_copies || 1}</span></footer>
              </article>
            \`).join('')}
          </div>
        \`;
      }

      root.innerHTML = \`
        <div class="wiki-shell">
          <aside class="wiki-sidebar">
            <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);margin-bottom:0.5rem">1. CORE RULEBOOK (8)</div>
            \${coreRules.map(r => \`
              <a href="#/wiki/rule/\${r.slug}" style="display:block;padding:0.42rem 0.6rem;margin-bottom:0.2rem;border-radius:6px;background:\${state.section==='rulebook'&&state.ruleSlug===r.slug?'rgba(0,229,255,0.12)':'transparent'};color:var(--text-primary);font-size:0.8rem;text-decoration:none">
                \${r.title.replace(/^AWAY TEAM —\\s*/i, '')}
              </a>
            \`).join('')}
            <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);margin:1rem 0 0.5rem">2. COMPONENT WIKI PAGES (200)</div>
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
              <a href="#/wiki/database/\${sec}" style="display:block;padding:0.42rem 0.6rem;margin-bottom:0.2rem;border-radius:6px;background:\${state.section===sec?'var(--bg-card)':'transparent'};color:var(--text-primary);font-size:0.8rem;text-decoration:none">
                \${lbl}
              </a>
            \`).join('')}
          </aside>
          <main class="wiki-main">\${mainHtml}</main>
        </div>
      \`;
    }

    syncFromHash();
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
