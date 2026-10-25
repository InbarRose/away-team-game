#!/usr/bin/env node
/**
 * AWAY TEAM — Automated Component & Art Manifest Exporter
 * -------------------------------------------------------
 * Crawls all Markdown files under /game/, extracts and validates YAML frontmatter
 * and Markdown body content, and outputs structured JSON manifests under /manifests/exports/
 * (plus /src/data/ for the Wiki & VTT web application).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const GAME_DIR = path.join(ROOT_DIR, 'game');
const EXPORTS_DIR = path.join(__dirname, 'exports');
const SRC_DATA_DIR = path.join(ROOT_DIR, 'src', 'data');

// Optional gray-matter import with built-in YAML frontmatter parser fallback
let grayMatter = null;
try {
  const mod = await import('gray-matter');
  grayMatter = mod.default || mod;
} catch {
  // Fallback to internal YAML frontmatter parser when node_modules is not installed
}

/**
 * Built-in YAML frontmatter parser supporting nested objects, arrays of scalars,
 * arrays of objects, booleans, numbers, nulls, and quoted strings.
 */
function parseScalar(val) {
  const trimmed = val.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === '~') return null;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === '[]') return [];
  if (trimmed === '{}') return {};
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const inner = trimmed.slice(1, -1);
    return inner.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
  }
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((s) => parseScalar(s));
  }
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }
  return trimmed;
}

function parseYamlLines(lines, startIndex = 0, baseIndent = 0) {
  let result = undefined;
  let i = startIndex;

  while (i < lines.length) {
    const rawLine = lines[i];
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) {
      i++;
      continue;
    }

    const indent = rawLine.search(/\S/);
    if (indent < baseIndent) {
      break;
    }

    const trimmed = rawLine.trim();

    if (trimmed.startsWith('- ') || trimmed === '-') {
      if (result === undefined) result = [];
      const afterDash = trimmed.slice(1).trim();
      if (!afterDash) {
        const sub = parseYamlLines(lines, i + 1, indent + 2);
        result.push(sub.value);
        i = sub.nextIndex;
      } else if (afterDash.includes(':') && !afterDash.startsWith('"') && !afterDash.startsWith("'")) {
        // Inline object start inside array item: "- tier: 1"
        const colonIdx = afterDash.indexOf(':');
        const key = afterDash.slice(0, colonIdx).trim();
        const restVal = afterDash.slice(colonIdx + 1).trim();
        const itemObj = {};
        if (restVal === '') {
          const sub = parseYamlLines(lines, i + 1, indent + 4);
          itemObj[key] = sub.value;
          i = sub.nextIndex;
        } else {
          itemObj[key] = parseScalar(restVal);
          i++;
        }
        // Check subsequent keys at indent + 2
        while (i < lines.length) {
          const nextRaw = lines[i];
          if (!nextRaw.trim() || nextRaw.trim().startsWith('#')) {
            i++;
            continue;
          }
          const nextIndent = nextRaw.search(/\S/);
          if (nextIndent < indent + 2 || nextRaw.trim().startsWith('-')) break;
          const nextTrim = nextRaw.trim();
          const cIdx = nextTrim.indexOf(':');
          if (cIdx !== -1) {
            const k = nextTrim.slice(0, cIdx).trim();
            const v = nextTrim.slice(cIdx + 1).trim();
            if (v === '') {
              const subProp = parseYamlLines(lines, i + 1, nextIndent + 2);
              itemObj[k] = subProp.value;
              i = subProp.nextIndex;
            } else {
              itemObj[k] = parseScalar(v);
              i++;
            }
          } else {
            i++;
          }
        }
        result.push(itemObj);
      } else {
        result.push(parseScalar(afterDash));
        i++;
      }
    } else {
      if (result === undefined) result = {};
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) {
        i++;
        continue;
      }
      const key = trimmed.slice(0, colonIdx).trim();
      const restVal = trimmed.slice(colonIdx + 1).trim();
      if (restVal === '') {
        const sub = parseYamlLines(lines, i + 1, indent + 2);
        result[key] = sub.value ?? null;
        i = sub.nextIndex;
      } else {
        result[key] = parseScalar(restVal);
        i++;
      }
    }
  }

  return { value: result, nextIndex: i };
}

function parseMarkdownFile(content) {
  if (grayMatter) {
    const parsed = grayMatter(content);
    return { data: parsed.data || {}, content: (parsed.content || '').trim() };
  }

  const normalized = content.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return { data: {}, content: normalized.trim() };
  }
  const endMarker = normalized.indexOf('\n---\n', 4);
  if (endMarker === -1) {
    return { data: {}, content: normalized.trim() };
  }
  const yamlRaw = normalized.slice(4, endMarker);
  const body = normalized.slice(endMarker + 5).trim();
  const lines = yamlRaw.split('\n');
  const parsed = parseYamlLines(lines, 0, 0);
  return { data: parsed.value || {}, content: body };
}

function walkMarkdownFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results.sort();
}

function validateComponent(data, relPath) {
  const errors = [];
  const requiredTop = ['id', 'title', 'component_type', 'art_spec'];
  for (const field of requiredTop) {
    if (!data[field]) {
      errors.push(`[${relPath}] Missing required field: '${field}'`);
    }
  }
  if (data.art_spec) {
    const requiredArt = ['asset_path', 'aspect_ratio', 'visual_description', 'art_style'];
    for (const artField of requiredArt) {
      if (!data.art_spec[artField]) {
        errors.push(`[${relPath}] Missing required art_spec field: 'art_spec.${artField}'`);
      }
    }
  }
  return errors;
}

function main() {
  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  fs.mkdirSync(SRC_DATA_DIR, { recursive: true });

  const allFiles = walkMarkdownFiles(GAME_DIR);
  const allComponents = [];
  const coreRules = [];
  const validationErrors = [];
  const seenIds = new Map();

  for (const filePath of allFiles) {
    const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = parseMarkdownFile(raw);

    if (relPath.startsWith('game/core/')) {
      const slug = path.basename(filePath, '.md');
      const titleMatch = content.match(/^#\s+(.+)$/m);
      coreRules.push({
        id: `core-${slug.replace(/_/g, '-')}`,
        slug,
        title: data.title || (titleMatch ? titleMatch[1].trim() : slug),
        source_path: relPath,
        body: content,
      });
      continue;
    }

    const errs = validateComponent(data, relPath);
    if (errs.length > 0) {
      validationErrors.push(...errs);
    }

    if (data.id) {
      if (seenIds.has(data.id)) {
        validationErrors.push(
          `Duplicate component id '${data.id}' in ${relPath} and ${seenIds.get(data.id)}`
        );
      } else {
        seenIds.set(data.id, relPath);
      }
    }

    allComponents.push({
      ...data,
      source_path: relPath,
      body: content,
    });
  }

  // Build image generation manifest
  const imageGenerationManifest = allComponents
    .filter((c) => c.art_spec)
    .map((c) => ({
      id: c.id,
      title: c.title,
      component_type: c.component_type,
      category: c.category || null,
      faction: c.faction || 'neutral',
      tier: c.tier ?? null,
      asset_path: c.art_spec.asset_path,
      aspect_ratio: c.art_spec.aspect_ratio,
      visual_description: c.art_spec.visual_description,
      art_style: c.art_spec.art_style,
      full_prompt: `${c.art_spec.visual_description} Style: ${c.art_spec.art_style} Aspect Ratio: ${c.art_spec.aspect_ratio}.`,
    }));

  // Group into category manifests
  const byCategory = {
    factions: allComponents.filter((c) => c.component_type === 'faction'),
    hq_facilities: allComponents.filter(
      (c) => c.component_type === 'hq_facility' || c.component_type === 'hq_landmark'
    ),
    characters: allComponents.filter((c) => c.component_type === 'character'),
    items: allComponents.filter((c) => c.component_type === 'item'),
    perks: allComponents.filter((c) => c.component_type === 'perk'),
    agendas: allComponents.filter((c) => c.component_type === 'agenda'),
    secret_objectives: allComponents.filter((c) => c.component_type === 'secret_objective'),
    modifiers: allComponents.filter((c) => c.component_type === 'modifier'),
    campaigns_and_missions: allComponents.filter((c) =>
      ['campaign', 'mission', 'side_mission'].includes(c.component_type)
    ),
  };

  // Write JSON exports
  const writeJson = (targetDir, filename, payload) => {
    const outPath = path.join(targetDir, filename);
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  };

  writeJson(EXPORTS_DIR, 'all_components.json', allComponents);
  writeJson(EXPORTS_DIR, 'image_generation_manifest.json', imageGenerationManifest);
  writeJson(EXPORTS_DIR, 'core_rules.json', coreRules);

  for (const [key, list] of Object.entries(byCategory)) {
    writeJson(EXPORTS_DIR, `${key}.json`, list);
  }

  // Also write combined bundle into src/data/ for Astro/React Wiki & VTT
  writeJson(SRC_DATA_DIR, 'all_components.json', allComponents);
  writeJson(SRC_DATA_DIR, 'core_rules.json', coreRules);
  writeJson(SRC_DATA_DIR, 'image_generation_manifest.json', imageGenerationManifest);

  // Sync /assets/ directory to /public/assets/ so static icons & card art resolve at /assets/...
  const assetsSrc = path.join(ROOT_DIR, 'assets');
  const assetsDest = path.join(ROOT_DIR, 'public', 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.cpSync(assetsSrc, assetsDest, { recursive: true });
  }

  console.log('====================================================');
  console.log(' AWAY TEAM MANIFEST GENERATOR SUMMARY');
  console.log('====================================================');
  console.log(`Core Rulebook Chapters : ${coreRules.length}`);
  console.log(`Total Game Components  : ${allComponents.length}`);
  for (const [key, list] of Object.entries(byCategory)) {
    console.log(`  - ${key.padEnd(22)} : ${list.length}`);
  }
  console.log(`Art Specs Exported     : ${imageGenerationManifest.length}`);
  console.log(`Validation Errors      : ${validationErrors.length}`);
  if (validationErrors.length > 0) {
    console.error('\nValidation Errors Found:');
    for (const err of validationErrors) {
      console.error(`  ❌ ${err}`);
    }
    process.exitCode = 1;
  } else {
    console.log('✅ All parsed components passed schema and art_spec validation!');
  }
}

main();
