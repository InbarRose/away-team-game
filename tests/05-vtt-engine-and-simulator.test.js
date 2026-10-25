import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  VTT_SEQUENCE_STEPS,
  expectedSuccessPerDie,
  calculateOperationalMomentum,
  evaluateCharacterBudgetES,
  simulateStageMonteCarlo,
} from '../src/vtt/engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Suite 05: VTT 7-Step Sequencer, Monte Carlo Balance Simulator, Print Rulebook & Design Backlog', () => {
  it('defines all 7 guided VTT game loop sequencer steps with contextual rules coach hints', () => {
    assert.equal(VTT_SEQUENCE_STEPS.length, 7);
    for (let i = 0; i < 7; i++) {
      assert.equal(VTT_SEQUENCE_STEPS[i].step, i + 1);
      assert.ok(VTT_SEQUENCE_STEPS[i].shortTitle.length > 3);
      assert.ok(VTT_SEQUENCE_STEPS[i].fullTitle.length > 10);
      assert.ok(
        VTT_SEQUENCE_STEPS[i].coachHint.length > 40,
        `Step ${i + 1} must provide a detailed rules coach hint`
      );
    }
  });

  it('computes exact Expected Successes per die (3+, 4+, 5+) and Operational Momentum ([MOM] = S - D - 1 at >= D+2)', () => {
    assert.ok(Math.abs(expectedSuccessPerDie(3) - 4 / 6) < 1e-6);
    assert.ok(Math.abs(expectedSuccessPerDie(4) - 3 / 6) < 1e-6);
    assert.ok(Math.abs(expectedSuccessPerDie(5) - 2 / 6) < 1e-6);

    // Target Difficulty D = 3 (matching table in /game/core/dice_system.md)
    assert.equal(calculateOperationalMomentum(2, 3), 0);
    assert.equal(calculateOperationalMomentum(3, 3), 0); // Standard Clear (+0)
    assert.equal(calculateOperationalMomentum(4, 3), 0); // Clean Clear (+1)
    assert.equal(calculateOperationalMomentum(5, 3), 1); // +2 margin -> 1 MOM
    assert.equal(calculateOperationalMomentum(6, 3), 2); // +3 margin -> 2 MOM
    assert.equal(calculateOperationalMomentum(7, 3), 3); // +4 margin -> 3 MOM
  });

  it('verifies the 9.0 ES Character Budget equation including Scientist (+0.5 ES) and Survivalist (+1.0 ES) class offsets', () => {
    // Soldier: 3 HP (4.5) + 7 Dice (3.5) + 1.0 Power + 0.0 Offset = 9.0 ES
    const commander = evaluateCharacterBudgetES({
      hpCap: 3,
      staticDice: 7,
      powerEs: 1.0,
      className: 'soldier',
    });
    assert.equal(commander.totalEs, 9.0);

    // Scientist: 3 HP (4.5) + 6 Dice (3.0) + 1.0 Power + 0.5 Offset = 9.0 ES
    const medic = evaluateCharacterBudgetES({
      hpCap: 3,
      staticDice: 6,
      powerEs: 1.0,
      className: 'scientist',
    });
    assert.equal(medic.totalEs, 9.0);

    // Survivalist: 3 HP (4.5) + 5 Dice (2.5) + 1.0 Power + 1.0 Offset = 9.0 ES
    const ranger = evaluateCharacterBudgetES({
      hpCap: 3,
      staticDice: 5,
      powerEs: 1.0,
      className: 'survivalist',
    });
    assert.equal(ranger.totalEs, 9.0);
  });

  it('runs Monte Carlo stage simulations with Phase 1 Specialist Early Resolution and Backfire tracking', () => {
    // Deterministic seeded PRNG for reproducible test verification
    let seed = 42;
    const seededRng = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const strongSquad = [
      {
        id: 'agent-01-commander',
        title: 'The Commander',
        className: 'soldier',
        threshold: 3,
        committedDice: 5,
        currentHp: 3,
        armorBuffer: 0,
        ignoreFirstBackfire: true,
      },
      {
        id: 'agent-02-pointman',
        title: 'The Pointman',
        className: 'soldier',
        threshold: 3,
        committedDice: 4,
        currentHp: 3,
        armorBuffer: 0,
      },
      {
        id: 'agent-15-virologist',
        title: 'The Virologist',
        className: 'scientist',
        threshold: 5,
        committedDice: 2,
        currentHp: 2,
        armorBuffer: 0,
      },
    ];

    const res = simulateStageMonteCarlo(strongSquad, 4, 1000, seededRng);
    assert.equal(res.trials, 1000);
    assert.equal(res.totalDiceCommitted, 11);
    assert.ok(
      res.clearProbabilityPct > 85,
      `Expected >85% clear rate for 9 Specialist dice + 2 Support dice vs D=4, got ${res.clearProbabilityPct}%`
    );
    assert.ok(
      res.earlyPhase1ClearProbabilityPct > 80,
      `Expected >80% Phase 1 Early Resolution rate, got ${res.earlyPhase1ClearProbabilityPct}%`
    );
    assert.ok(res.momentumProbabilityPct > 50);
    assert.ok(res.tacticalVerdict.includes('HIGH CONFIDENCE CLEAR'));
  });

  it('verifies all 8 /game/core/ rulebook chapters contain callouts, Examples of Play ([!EXAMPLE]), and Diagram Blueprints ([!DIAGRAM])', () => {
    const coreDir = path.join(ROOT_DIR, 'game', 'core');
    const files = fs.readdirSync(coreDir).filter((f) => f.endsWith('.md'));
    assert.equal(files.length, 8, 'Must have all 8 Core Rulebook chapters');

    for (const file of files) {
      const content = fs.readFileSync(path.join(coreDir, file), 'utf8');
      assert.ok(
        content.includes('[!EXAMPLE]'),
        `Core chapter ${file} must include a worked Tabletop Example of Play (> [!EXAMPLE])`
      );
      assert.ok(
        content.includes('[!DIAGRAM]'),
        `Core chapter ${file} must include a Rulebook Diagram Blueprint (> [!DIAGRAM])`
      );
      assert.ok(
        /\[!(?:IMPORTANT|TIP|WARNING|NOTE)\]/.test(content),
        `Core chapter ${file} must include at least one rulebook callout box`
      );
    }
  });

  it('verifies BACKLOG.md, Wiki Homepage (#/wiki/home), Emulated Print Rulebook (#/wiki/print-rulebook), and Design Companion view (#/wiki/backlog)', () => {
    const backlogMd = fs.readFileSync(path.join(ROOT_DIR, 'BACKLOG.md'), 'utf8');
    assert.ok(backlogMd.includes('BL-RULES-01'));
    assert.ok(backlogMd.includes('BL-RULES-08'));
    assert.ok(backlogMd.includes('BL-BAL-01'));

    const wikiPortalSrc = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'components', 'WikiPortal.tsx'),
      'utf8'
    );
    assert.ok(wikiPortalSrc.includes('#/wiki/home'));
    assert.ok(wikiPortalSrc.includes('#/wiki/print-rulebook'));
    assert.ok(wikiPortalSrc.includes('#/wiki/backlog'));
    assert.ok(wikiPortalSrc.includes('print-rulebook-folio'));

    const vttSrc = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'vtt', 'VirtualTabletop.tsx'),
      'utf8'
    );
    assert.ok(vttSrc.includes('vtt-sequencer-bar'));
    assert.ok(vttSrc.includes('simulateStageMonteCarlo'));
  });
});
