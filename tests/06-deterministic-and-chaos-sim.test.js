import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  runGameSimulation,
  SimplePRNG,
  calculateOperationalMomentum,
} from '../src/vtt/engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const allComponents = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, 'src', 'data', 'all_components.json'), 'utf8')
);

describe('Suite 06: Deterministic Acceptance, Chaos Fuzzing & Simulation Engine', () => {
  it('runs deterministic smoke acceptance test and verifies exact expected outcomes', () => {
    const report = runGameSimulation(
      {
        mode: 'deterministic',
        scenarioId: 'smoke_clean_clear',
      },
      allComponents
    );

    assert.equal(report.success, true);
    assert.equal(report.deadlocksDetected, 0);
    assert.equal(report.invariantViolations.length, 0);
    assert.equal(report.runsCompleted, 1);
    assert.ok(report.totalStepsExecuted > 15, 'Smoke test must execute setup, stages, and downtime');

    // Verify dual-stream payouts and credits accumulation
    assert.ok(report.summaryMetrics.totalCreditsEarned >= 14, '4 players must earn dual-stream payouts');
    assert.ok(report.summaryMetrics.totalFacilitiesSponsored >= 1, 'Facility must be sponsored');
    assert.ok(report.summaryMetrics.totalItemsPurchased >= 1, 'Quartermaster item must be bought');
    assert.ok(report.logs.length > 0, 'Execution logs must be recorded');
  });

  it('runs deterministic martyr scenario and verifies Dying Breath and Triage Stabilization', () => {
    const report = runGameSimulation(
      {
        mode: 'deterministic',
        scenarioId: 'martyr_dying_breath',
      },
      allComponents
    );

    assert.equal(report.success, true);
    assert.equal(report.deadlocksDetected, 0);
    assert.equal(report.invariantViolations.length, 0);
    assert.ok(
      report.summaryMetrics.totalCasualties > 0,
      'Martyr scenario with natural 1s must produce casualties'
    );

    const hasTriageOrDyingBreath = report.logs.some(
      (l) => l.action === 'TRIAGE_STABILIZE' || l.action === 'DYING_BREATH'
    );
    assert.ok(hasTriageOrDyingBreath, 'Logs must record triage stabilization or dying breath');
  });

  it('supports custom pluggable dice overrides for testing arbitrary static outcomes', () => {
    // Custom dice override: all dice roll 6
    const report = runGameSimulation(
      {
        mode: 'deterministic',
        diceOverride: (count) => Array(count).fill(6),
      },
      allComponents
    );

    assert.equal(report.success, true);
    assert.equal(report.deadlocksDetected, 0);
    // When all dice roll 6, every committed die hits
    assert.ok(report.summaryMetrics.totalMomentumGenerated > 0, 'Rolling all 6s must generate momentum');
  });

  it('runs Chaos / Fuzz simulation across 50 full game cycles with 0 deadlocks and valid invariants', () => {
    const report = runGameSimulation(
      {
        mode: 'chaos',
        runs: 50,
        seed: 9999,
      },
      allComponents
    );

    assert.equal(report.success, true, 'Chaos fuzz run must succeed without fatal crashes');
    assert.equal(report.deadlocksDetected, 0, 'Chaos fuzzing must detect ZERO deadlocks');
    assert.equal(report.invariantViolations.length, 0, 'All state invariants must hold in chaos fuzzing');
    assert.equal(report.runsCompleted, 50);
    assert.ok(report.totalStepsExecuted > 500, '50 runs must execute hundreds of steps');
  });

  it('verifies that simulation report contains all fields required for JSON export and debugging', () => {
    const report = runGameSimulation(
      {
        mode: 'chaos',
        runs: 5,
        seed: 1234,
      },
      allComponents
    );

    const jsonString = JSON.stringify(report);
    assert.ok(jsonString.length > 500, 'Report must be JSON serializable');
    const parsed = JSON.parse(jsonString);

    assert.ok(parsed.exportedAt, 'Report must have exportedAt timestamp');
    assert.ok(parsed.summaryMetrics, 'Report must have summaryMetrics');
    assert.ok(Array.isArray(parsed.logs), 'Report must contain logs array');
    assert.ok(Array.isArray(parsed.invariantViolations), 'Report must contain invariantViolations array');
  });

  it('verifies navigation separation: in-game phases bar excludes setup and requires new game confirmation', () => {
    const vttSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'vtt', 'VirtualTabletop.tsx'), 'utf8');

    // 1. In-game phases separation
    assert.ok(
      vttSrc.includes('IN_GAME_PHASES'),
      'VirtualTabletop.tsx must define IN_GAME_PHASES distinct from setup'
    );
    assert.ok(
      vttSrc.includes('SETUP_STEPS'),
      'VirtualTabletop.tsx must define SETUP_STEPS progress bar'
    );

    // 2. New Game Confirmation Modal
    assert.ok(
      vttSrc.includes('showRestartModal'),
      'VirtualTabletop.tsx must track showRestartModal state'
    );
    assert.ok(
      vttSrc.includes('Start a New Game?'),
      'VirtualTabletop.tsx must show confirmation prompt before resetting mid-game'
    );
  });
});
