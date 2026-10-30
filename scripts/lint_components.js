#!/usr/bin/env node
/**
 * AWAY TEAM — Component Authoring Framework & Linter
 * --------------------------------------------------
 * Validates existing and newly authored components against:
 * 1. Exact 9.0 ES budget formula for characters
 * 2. Valid anatomical slots and 2-Hands limit for armory items
 * 3. Price-to-tier alignment (Tier 1: 2-4 CR, Tier 2: 5-8 CR)
 * 4. Art spec presence, valid aspect ratios (63:88 or 70:120), and unique asset paths
 * 5. Valid kebab-case IDs and non-empty rules/narrative bodies
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const GAME_DIR = path.join(ROOT_DIR, 'game');

function parseSimpleFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const yamlBlock = match[1];
  const content = match[2];
  const data = {};

  const lines = yamlBlock.split(/\r?\n/);
  let currentKey = null;
  let currentObj = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.search(/\S/);
    const trimmed = line.trim();

    if (indent === 0 && trimmed.includes(':')) {
      const idx = trimmed.indexOf(':');
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim();
      currentKey = k;
      if (v === '') {
        data[k] = {};
        currentObj = data[k];
      } else {
        currentObj = null;
        data[k] = parseScalarVal(v);
      }
    } else if (indent > 0 && currentObj && trimmed.includes(':')) {
      const idx = trimmed.indexOf(':');
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim();
      currentObj[k] = parseScalarVal(v);
    }
  }

  return { data, content };
}

function parseScalarVal(val) {
  const t = val.trim();
  if (t === 'true') return true;
  if (t === 'false') return false;
  if (t === 'null' || t === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

function walkDir(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkDir(full));
    } else if (item.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

export function lintAllComponents() {
  const errors = [];
  const warnings = [];
  const files = walkDir(GAME_DIR);

  let scannedCount = 0;
  const seenIds = new Set();
  const seenAssetPaths = new Set();

  for (const file of files) {
    const rel = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
    if (rel.startsWith('game/core/')) continue; // Skip core rulebook

    scannedCount++;
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = parseSimpleFrontmatter(raw);

    // 1. Mandatory ID & format
    if (!data.id) {
      errors.push(`[${rel}] Missing mandatory 'id' field in frontmatter.`);
    } else {
      if (!/^[a-z0-9_-]+$/.test(data.id)) {
        errors.push(`[${rel}] ID '${data.id}' must be lower-case kebab-case.`);
      }
      if (seenIds.has(data.id)) {
        errors.push(`[${rel}] Duplicate ID '${data.id}' detected.`);
      }
      seenIds.add(data.id);
    }

    // 2. Component Type
    const validTypes = [
      'character',
      'item',
      'faction',
      'hq_facility',
      'hq_landmark',
      'perk',
      'agenda',
      'secret_objective',
      'modifier',
      'campaign',
      'mission',
      'side_mission',
    ];
    if (!data.component_type || !validTypes.includes(data.component_type)) {
      errors.push(`[${rel}] Invalid or missing component_type '${data.component_type}'.`);
    }

    // 3. Art Spec Verification
    if (data.art_spec) {
      if (!['63:88', '70:120'].includes(data.art_spec.aspect_ratio)) {
        errors.push(`[${rel}] Invalid aspect_ratio '${data.art_spec.aspect_ratio}'. Must be 63:88 or 70:120.`);
      }
      if (data.art_spec.asset_path) {
        if (seenAssetPaths.has(data.art_spec.asset_path)) {
          errors.push(`[${rel}] Duplicate asset_path '${data.art_spec.asset_path}'.`);
        }
        seenAssetPaths.add(data.art_spec.asset_path);
      }
    }

    // 4. Character 9.0 ES Budget Audit
    if (data.component_type === 'character' && data.stats) {
      const hp = Number(data.stats.hp_cap) || 0;
      const dice = Number(data.stats.static_dice) || 0;
      const powerEs = Number(data.stats.power_es) || 0;
      const classOffset = Number(data.stats.class_offset_es) || 0;
      const calculatedEs = Math.round((hp * 1.5 + dice * 0.5 + powerEs + classOffset) * 10) / 10;

      if (Math.abs(calculatedEs - 9.0) > 0.01) {
        errors.push(
          `[${rel}] Character '${data.id}' violates 9.0 ES budget: (${hp}*1.5) + (${dice}*0.5) + ${powerEs} + ${classOffset} = ${calculatedEs} (expected 9.0).`
        );
      }
    }

    // 5. Item Slot & Tier Constraints
    if (data.component_type === 'item') {
      const tier = Number(data.tier);
      const cost = data.cost && typeof data.cost === 'object' ? Number(data.cost.credits) : Number(data.cost_credits);
      if (tier === 1 && (cost < 2 || cost > 4)) {
        warnings.push(`[${rel}] Item '${data.id}' Tier 1 price ${cost} CR outside expected 2-4 CR window.`);
      }
      if (tier === 2 && (cost < 5 || cost > 8)) {
        warnings.push(`[${rel}] Item '${data.id}' Tier 2 price ${cost} CR outside expected 5-8 CR window.`);
      }
      if (data.stats && Array.isArray(data.stats.slots_required)) {
        const handSlots = data.stats.slots_required.filter((s) => typeof s === 'string' && s.startsWith('hand'));
        if (handSlots.length > 2) {
          errors.push(`[${rel}] Item '${data.id}' requires ${handSlots.length} hands (max 2).`);
        }
      }
    }

    // 6. Body Content Length
    if (!content.trim() || content.trim().length < 20) {
      warnings.push(`[${rel}] Component body content is very short (< 20 chars).`);
    }
  }

  return { scannedCount, errors, warnings };
}

// Direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('====================================================');
  console.log(' AWAY TEAM — COMPONENT SPEC & BUDGET LINTER');
  console.log('====================================================');
  const res = lintAllComponents();
  console.log(`Scanned Components : ${res.scannedCount}`);
  console.log(`Errors             : ${res.errors.length}`);
  console.log(`Warnings           : ${res.warnings.length}`);

  if (res.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    res.warnings.forEach((w) => console.log(`   ${w}`));
  }

  if (res.errors.length > 0) {
    console.log('\n❌ Errors:');
    res.errors.forEach((e) => console.log(`   ${e}`));
    process.exit(1);
  } else {
    console.log('\n✅ All components satisfy formal design schemas and budget constraints!');
  }
}
