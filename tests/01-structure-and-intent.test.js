import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function countMdFiles(relDir) {
  const fullDir = path.join(ROOT_DIR, relDir);
  assert.ok(fs.existsSync(fullDir), `Directory must exist: ${relDir}`);
  const entries = fs.readdirSync(fullDir, { withFileTypes: true });
  let count = 0;
  for (const e of entries) {
    if (e.isDirectory()) {
      count += countMdFiles(path.join(relDir, e.name));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      count += 1;
    }
  }
  return count;
}

describe('Suite 01: Repository Architecture, Directory Layout & Design Intent', () => {
  it('contains governance, specification, and agile tracking documents', () => {
    for (const doc of ['AGENT_PLAN.md', 'PROJECT_STATUS.md', 'README.md', 'package.json']) {
      const p = path.join(ROOT_DIR, doc);
      assert.ok(fs.existsSync(p), `Missing required root file: ${doc}`);
      assert.ok(fs.statSync(p).size > 100, `File ${doc} should not be empty`);
    }
  });

  it('enforces the exact /game/ rulebook and component directory counts (208 total .md files)', () => {
    const expectedCounts = {
      'game/core': 8,
      'game/factions': 8,
      'game/hq': 9,
      'game/characters': 24,
      'game/items/handheld_t1': 16,
      'game/items/handheld_t2': 12,
      'game/items/wearables_t1': 16,
      'game/items/wearables_t2': 16,
      'game/items/multi_slot': 8,
      'game/items/consumables': 11,
      'game/items/complex': 8,
      'game/perks': 12,
      'game/agendas': 24,
      'game/secret_objectives': 10,
      'game/modifiers': 12,
      'game/campaigns': 2,
      'game/missions': 7,
      'game/side_missions': 5,
    };

    let total = 0;
    for (const [relDir, expected] of Object.entries(expectedCounts)) {
      const actual = countMdFiles(relDir);
      assert.equal(
        actual,
        expected,
        `Expected ${expected} Markdown files in ${relDir}, found ${actual}`
      );
      total += actual;
    }
    assert.equal(total, 208, 'Total Markdown files across /game/ must equal 208');
  });

  it('configures custom domain awayteam.inbarrose.com and GitHub Actions workflows', () => {
    const cnamePath = path.join(ROOT_DIR, 'public', 'CNAME');
    assert.ok(fs.existsSync(cnamePath), 'public/CNAME must exist');
    assert.equal(
      fs.readFileSync(cnamePath, 'utf8').trim(),
      'awayteam.inbarrose.com',
      'public/CNAME must be set to awayteam.inbarrose.com'
    );

    const astroConfig = fs.readFileSync(path.join(ROOT_DIR, 'astro.config.mjs'), 'utf8');
    assert.ok(
      astroConfig.includes('https://awayteam.inbarrose.com'),
      'astro.config.mjs must reference https://awayteam.inbarrose.com'
    );

    assert.ok(
      fs.existsSync(path.join(ROOT_DIR, '.github', 'workflows', 'deploy.yml')),
      '.github/workflows/deploy.yml must exist'
    );
    assert.ok(
      fs.existsSync(path.join(ROOT_DIR, '.github', 'workflows', 'test-pr.yml')),
      '.github/workflows/test-pr.yml must exist'
    );
  });
});
