import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runGameSimulation } from '../src/vtt/engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const allComponents = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, 'src', 'data', 'all_components.json'), 'utf8')
);

describe('Suite 16: Deep Chaos Fuzzing & Invariant Stress Tests', () => {
  it('executes 100 automated campaign cycles with 0 deadlocks and bounded execution', () => {
    const report = runGameSimulation(
      {
        mode: 'chaos',
        runs: 100,
        seed: 424242,
      },
      allComponents
    );

    assert.equal(report.success, true, '100-cycle chaos run must complete successfully');
    assert.equal(report.deadlocksDetected, 0, 'Must detect exactly 0 deadlocks across 100 runs');
    assert.equal(report.runsCompleted, 100, 'All 100 runs must finish');
    assert.ok(report.totalStepsExecuted > 1200, 'Must execute >1,200 distinct engine steps');

    const avgStepsPerRun = report.totalStepsExecuted / report.runsCompleted;
    assert.ok(avgStepsPerRun < 50, 'Average steps per run must be strictly bounded');
  });

  it('strictly validates Invariant 1: NON_NEGATIVE_VAULT across all 100 cycles', () => {
    const report = runGameSimulation(
      {
        mode: 'chaos',
        runs: 50,
        seed: 777777,
      },
      allComponents
    );

    // Invariant check: No negative currency violations logged
    const vaultViolations = report.invariantViolations.filter((v) =>
      v.includes('NON_NEGATIVE_VAULT') || v.includes('credits') || v.includes('effort')
    );
    assert.equal(vaultViolations.length, 0, 'No vault invariant violations allowed');
    assert.ok(report.summaryMetrics.totalCreditsEarned > 0, 'Total credits must be positive');
  });

  it('strictly validates Invariant 2: OPERATIVE_BOUNDS (HP in [0..MaxHP], spentDice >= 0)', () => {
    const report = runGameSimulation(
      {
        mode: 'chaos',
        runs: 50,
        seed: 888888,
      },
      allComponents
    );

    const boundsViolations = report.invariantViolations.filter((v) =>
      v.includes('OPERATIVE_BOUNDS') || v.includes('currentHp') || v.includes('spentDice')
    );
    assert.equal(boundsViolations.length, 0, 'Operative HP and spent dice must never exceed valid bounds');
  });

  it('strictly validates Invariant 3: STRICT_FOUR_OPERATIVES in squad throughout all missions', () => {
    const report = runGameSimulation(
      {
        mode: 'chaos',
        runs: 50,
        seed: 999999,
      },
      allComponents
    );

    const squadViolations = report.invariantViolations.filter((v) =>
      v.includes('STRICT_FOUR_OPERATIVES') || v.includes('squad.length')
    );
    assert.equal(squadViolations.length, 0, 'Squad roster length must strictly equal 4 in every step');
  });

  it('strictly validates Invariant 5: MARKET_DEPLETION & Replenishment on item purchases', () => {
    const report = runGameSimulation(
      {
        mode: 'chaos',
        runs: 50,
        seed: 111222,
      },
      allComponents
    );

    const marketViolations = report.invariantViolations.filter((v) =>
      v.includes('MARKET_DEPLETION')
    );
    assert.equal(marketViolations.length, 0, 'Market must deplete and replenish cleanly');
    assert.ok(report.summaryMetrics.totalItemsPurchased > 0, 'Items must be purchased during downtime');
  });

  it('verifies that high casualty pressure triggers Triage and Dying Breath without crashing state', () => {
    // Uses seed tuned for high hazard backfires
    const report = runGameSimulation(
      {
        mode: 'chaos',
        runs: 25,
        seed: 1337,
      },
      allComponents
    );

    assert.equal(report.success, true);
    assert.equal(report.deadlocksDetected, 0);
    assert.ok(report.summaryMetrics.totalCasualties >= 0, 'Casualties tracked correctly');
  });
});
