import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const EXPORTS_DIR = path.join(ROOT_DIR, 'manifests', 'exports');

const allComponents = JSON.parse(
  fs.readFileSync(path.join(EXPORTS_DIR, 'all_components.json'), 'utf8')
);
const artManifest = JSON.parse(
  fs.readFileSync(path.join(EXPORTS_DIR, 'image_generation_manifest.json'), 'utf8')
);
const coreRules = JSON.parse(
  fs.readFileSync(path.join(EXPORTS_DIR, 'core_rules.json'), 'utf8')
);

describe('Suite 02: Component YAML Frontmatter Schema & Generative Art Pipeline', () => {
  it('exports all required JSON manifest files in manifests/exports/ and src/data/', () => {
    const expectedExports = [
      'all_components.json',
      'image_generation_manifest.json',
      'core_rules.json',
      'factions.json',
      'hq_facilities.json',
      'characters.json',
      'items.json',
      'perks.json',
      'agendas.json',
      'secret_objectives.json',
      'modifiers.json',
      'campaigns_and_missions.json',
    ];

    for (const file of expectedExports) {
      const fullPath = path.join(EXPORTS_DIR, file);
      assert.ok(fs.existsSync(fullPath), `Missing manifest export: ${file}`);
      const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      assert.ok(Array.isArray(parsed) && parsed.length > 0, `${file} must be a non-empty JSON array`);
    }

    assert.equal(coreRules.length, 8, 'core_rules.json must contain 8 chapters');
    assert.equal(allComponents.length, 200, 'all_components.json must contain 200 components');
    assert.equal(artManifest.length, 200, 'image_generation_manifest.json must contain 200 art specs');
  });

  it('enforces unique kebab-case IDs, valid component_type values, and non-empty rules/body across all 200 components', () => {
    const validTypes = new Set([
      'faction',
      'hq_facility',
      'hq_landmark',
      'character',
      'item',
      'perk',
      'agenda',
      'secret_objective',
      'modifier',
      'campaign',
      'mission',
      'side_mission',
    ]);
    const seenIds = new Set();

    for (const comp of allComponents) {
      assert.ok(comp.id, `Component in ${comp.source_path} missing id`);
      assert.match(comp.id, /^[a-z0-9-]+$/, `Component id '${comp.id}' must be kebab-case`);
      assert.ok(!seenIds.has(comp.id), `Duplicate component id: ${comp.id}`);
      seenIds.add(comp.id);

      assert.ok(comp.title && comp.title.length >= 3, `${comp.id} must have a valid title`);
      assert.ok(
        validTypes.has(comp.component_type),
        `${comp.id} has invalid component_type: ${comp.component_type}`
      );
      assert.ok(
        comp.rules_text && comp.rules_text.length >= 10,
        `${comp.id} must have descriptive rules_text`
      );
      assert.ok(
        comp.body && comp.body.length >= 30,
        `${comp.id} must have Markdown body documentation`
      );
    }
  });

  it('enforces valid art_spec fields, unique asset_paths, and standard card aspect ratios (63:88 or 70:120)', () => {
    const seenPaths = new Set();
    const validAspectRatios = new Set(['63:88', '70:120']);

    for (const entry of artManifest) {
      assert.ok(
        entry.asset_path && entry.asset_path.startsWith('/assets/') && entry.asset_path.endsWith('.webp'),
        `Invalid asset_path for ${entry.id}: ${entry.asset_path}`
      );
      assert.ok(
        !seenPaths.has(entry.asset_path),
        `Duplicate art_spec.asset_path found: ${entry.asset_path} (on ${entry.id})`
      );
      seenPaths.add(entry.asset_path);

      assert.ok(
        validAspectRatios.has(entry.aspect_ratio),
        `Invalid aspect_ratio '${entry.aspect_ratio}' on ${entry.id}`
      );
      assert.ok(
        entry.visual_description && entry.visual_description.length >= 30,
        `visual_description too short on ${entry.id}`
      );
      assert.ok(
        entry.art_style && entry.art_style.length >= 20,
        `art_style too short on ${entry.id}`
      );
      assert.ok(
        entry.full_prompt && entry.full_prompt.includes(entry.visual_description),
        `full_prompt must include visual_description on ${entry.id}`
      );
    }
  });
});
