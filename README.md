# AWAY TEAM — Rulebook Wiki, Component Engine & Virtual Tabletop (VTT)

**Away Team** is a semi-cooperative tactical sci-fi tabletop game for 1–4 players (`6.0 Engine`). Players act as competing Corporate Directors within a fractured Defense Coalition—pooling operatives and equipment to survive lethal multi-stage missions while maneuvering for **Credits `[CR]`**, **Effort `[EF]`**, **Political Influence `[PIP]`**, **Loyalty `[LOY]`**, and **Victory Points `[VP]`**.

This repository serves three integrated purposes:
1. **Source-of-Truth Rulebook & Component Database (`/game/`):** `208` structured Markdown files (`8` Core Rulebook chapters + `200` game components with strict YAML frontmatter and generative art specifications).
2. **Automated Asset & Image-Generation Pipeline (`/manifests/`):** Zero-dependency Node.js manifest generator (`manifests/generate_manifests.js`) that validates every component's YAML schema and exports aggregated JSON manifests (`all_components.json`, `image_generation_manifest.json`, and category-specific JSON files) to `/manifests/exports/` and `/src/data/`.
3. **GitHub Pages Web Platform (`/src/` — Astro + React/TypeScript):**
   * **Rulebook & Component Wiki:** Semantic inline badges (`[Combat]`, `[Infiltrate]`, `[Intel]`, `[Operations]`, `[Negotiate]`, `[Survival]`, `[CR]`, `[EF]`, `[PIP]`, `[LOY]`, `[MOM]`, `[DOOM]`, `[VP]`), filterable 200-card browser, and art prompt inspector.
   * **Virtual Tabletop (VTT) Environment:** Interactive 4-Player Faction Vault dashboards, Command Auction resolver, 4-Operative Squad Staging with 6-slot anatomical loadout validation, Static Pool Dice Roller with Operational Momentum calculation, Sponsored HQ Facility tracker, and Med Bay / Critical Trauma roller.

---

## Repository Structure

```text
├── .github/workflows/deploy.yml    # Automated build & deploy to GitHub Pages
├── AGENT_PLAN.md                   # Master technical & architectural specification
├── PROJECT_STATUS.md               # Agile iteration tracker & ADR decision log
├── assets/
│   ├── factions/                   # 8 Faction SVG sigils
│   └── icons/                      # 6 Focus SVGs & 6 Currency/Metric SVGs
├── game/                           # Canonical Markdown source of truth (208 files)
│   ├── core/                       # 8 Core Rulebook chapters
│   ├── factions/                   # 8 Faction Dossiers (4-tier Loyalty trees)
│   ├── hq/                         # 5 Sponsored HQ Facilities (15 modules) + 4 Landmarks
│   ├── characters/                 # 24 Specialist Operatives (9.0 ES budget matrix)
│   ├── items/                      # 87 Armory Items (Handhelds, Wearables, Multi-Slot, Consumables, Complex)
│   ├── perks/                      # 12 Thematic Multi-Tier Perk Doctrines
│   ├── agendas/                    # 24 Open Agenda Cards
│   ├── secret_objectives/          # 10 Tiered Secret Objectives (15/10/5 VP)
│   ├── modifiers/                  # 12 Stage Modifier Cards (4 Split + 8 Generic)
│   ├── campaigns/                  # 2 Campaign Dossiers (Iron Dawn & Apex Extraction)
│   ├── missions/                   # 7 Fixed Campaign Mission Briefs
│   └── side_missions/              # 5 Themed Side-Missions
├── manifests/
│   ├── generate_manifests.js       # Frontmatter parser, schema validator & JSON exporter
│   └── exports/                    # Generated JSON manifests for tools & image generators
└── src/
    ├── components/                 # SemanticText, ComponentCard, MarkdownRenderer, WikiPortal, AppShell
    ├── data/                       # Auto-synced JSON bundles for Astro/React
    ├── pages/                      # Astro routes (index.astro, vtt.astro)
    ├── styles/                     # Semantic design tokens & tactical HUD stylesheet
    └── vtt/                        # Playable Virtual Tabletop (VirtualTabletop.tsx)
```

---

## Quick Start (Local Viewing & Development)

### Option A: Full Astro + React Dev Server (Recommended)
Runs the full Astro + React/TypeScript application (Wiki, 200-Card Browser, Art Manifest Exporter, and Interactive Virtual Tabletop) with hot-reloading at **`http://localhost:4321`**:
```bash
npm install
npm run dev
```

### Option B: Instant Zero-Dependency Local Server (No `npm install` required)
If you want to preview the Rulebook Wiki and 200-Card Database immediately using only built-in Node.js:
```bash
npm start
# or: node manifests/serve_local.js
```
Then open **`http://localhost:4321`** in your browser.

### Regenerate & Validate Component Manifests Only
```bash
npm run generate:manifests
```

---

## Custom Domain Deployment (`awayteam.inbarrose.com`)

The repository is pre-configured for **`https://awayteam.inbarrose.com`** via:
* [`public/CNAME`](file:///c:/dev/away-team-game/public/CNAME) (`awayteam.inbarrose.com`)
* [`astro.config.mjs`](file:///c:/dev/away-team-game/astro.config.mjs) (`site: 'https://awayteam.inbarrose.com'`, `base: '/'`)
* [`.github/workflows/deploy.yml`](file:///c:/dev/away-team-game/.github/workflows/deploy.yml)

### DNS & GitHub Pages Setup Steps
1. **DNS Provider (`inbarrose.com`):**
   * Add a **`CNAME`** record:
     * **Name / Host:** `awayteam`
     * **Target / Value:** `<your-github-username>.github.io.`
     * **TTL:** Automatic / `3600` (if using Cloudflare, set Proxy status to **DNS Only / Grey Cloud** initially so GitHub can issue the Let's Encrypt TLS certificate cleanly).
2. **GitHub Repository Settings:**
   * Go to **Settings → Pages**.
   * Under **Build and deployment → Source**, select **GitHub Actions**.
   * Under **Custom domain**, enter `awayteam.inbarrose.com` and click **Save**.
   * Once DNS verification completes, check **Enforce HTTPS**.
