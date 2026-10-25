import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  computeFocusThreshold,
  evaluateDiceRoll,
  evaluateStageOutcome,
  calculateTargetDifficulty,
  resolveCommandAuction,
  validateSlotLoadout,
  evaluateMedBayRecovery,
  resolveCriticalInjuryRoll,
} from '../src/vtt/engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Suite 04: Semantic Design Tokens, SVG Assets & VTT Rules Engine Functionality', () => {
  it('defines all required Focus, Currency, and Faction color tokens in src/styles/tokens.css', () => {
    const css = fs.readFileSync(path.join(ROOT_DIR, 'src', 'styles', 'tokens.css'), 'utf8');
    const requiredHexes = [
      '#E03E3E', // Combat
      '#9B51E0', // Infiltrate
      '#00A3FF', // Intel
      '#F2994A', // Operations
      '#F2C94C', // Negotiate
      '#219653', // Survival
      '#FFD700', // Credits
      '#00E5FF', // Effort
      '#D63384', // PIP
      '#3B82F6', // Loyalty
      '#8B0000', // Doom
      '#10B981', // Momentum
      '#2C3E50', // Aegis
      '#00BCD4', // Nexus
      '#C5A059', // Vanderbilt
      '#1C1917', // Obsidian
      '#D97706', // Titan
      '#059669', // Ascendant
      '#4F46E5', // Aurelius
      '#92400E', // Ironclad
    ];
    for (const hex of requiredHexes) {
      assert.ok(
        css.toLowerCase().includes(hex.toLowerCase()),
        `src/styles/tokens.css missing required color hex: ${hex}`
      );
    }
  });

  it('includes valid SVG icon files for all 6 Focus types, 6 Currencies, and 8 Factions', () => {
    const iconFiles = [
      'assets/icons/focus-combat.svg',
      'assets/icons/focus-infiltrate.svg',
      'assets/icons/focus-intel.svg',
      'assets/icons/focus-ops.svg',
      'assets/icons/focus-negotiate.svg',
      'assets/icons/focus-survival.svg',
      'assets/icons/currency-credits.svg',
      'assets/icons/currency-effort.svg',
      'assets/icons/currency-pip.svg',
      'assets/icons/currency-loyalty.svg',
      'assets/icons/currency-doom.svg',
      'assets/icons/currency-momentum.svg',
      'assets/factions/faction-aegis.svg',
      'assets/factions/faction-nexus.svg',
      'assets/factions/faction-vanderbilt.svg',
      'assets/factions/faction-obsidian.svg',
      'assets/factions/faction-titan.svg',
      'assets/factions/faction-ascendant.svg',
      'assets/factions/faction-aurelius.svg',
      'assets/factions/faction-ironclad.svg',
    ];

    for (const rel of iconFiles) {
      const p = path.join(ROOT_DIR, rel);
      assert.ok(fs.existsSync(p), `Missing SVG asset: ${rel}`);
      const content = fs.readFileSync(p, 'utf8');
      assert.ok(content.includes('<svg') && content.includes('</svg>'), `Invalid SVG in ${rel}`);
    }
  });

  it('computes Focus thresholds (3+ Primary, 4+ Secondary/Bridge, 5+ Out of Focus) and Scientist Dual-Vector Mapping', () => {
    const primaryEval = computeFocusThreshold({
      primaryFocus: 'combat',
      secondaryFocus: 'survival',
      stagePrimaryFocus: 'combat',
    });
    assert.equal(primaryEval.threshold, 3);
    assert.equal(primaryEval.isOutOfFocus, false);

    const secondaryEval = computeFocusThreshold({
      primaryFocus: 'combat',
      secondaryFocus: 'survival',
      stagePrimaryFocus: 'survival',
    });
    assert.equal(secondaryEval.threshold, 4);
    assert.equal(secondaryEval.isOutOfFocus, false);

    const bridgeEval = computeFocusThreshold({
      primaryFocus: 'combat',
      secondaryFocus: 'survival',
      itemBridgeFocuses: ['intel'],
      stagePrimaryFocus: 'intel',
    });
    assert.equal(bridgeEval.threshold, 4);
    assert.equal(bridgeEval.isOutOfFocus, false);

    const outOfFocusEval = computeFocusThreshold({
      primaryFocus: 'combat',
      secondaryFocus: 'survival',
      stagePrimaryFocus: 'negotiate',
    });
    assert.equal(outOfFocusEval.threshold, 5);
    assert.equal(outOfFocusEval.isOutOfFocus, true);

    // Scientist Dual-Vector Mapping adds a concurrent stage focus
    const dualVectorEval = computeFocusThreshold({
      primaryFocus: 'intel',
      secondaryFocus: 'operations',
      stagePrimaryFocus: 'combat',
      stageConcurrentFocus: 'intel',
    });
    assert.equal(dualVectorEval.threshold, 3);
    assert.equal(dualVectorEval.isOutOfFocus, false);
  });

  it('evaluates static dice pools, Out-of-Focus Natural 1 Backfires, and Stage Momentum (>= D+2)', () => {
    const sampleRoll = [1, 1, 3, 4, 5, 6];

    // Primary Focus (3+): 3, 4, 5, 6 are hits (4 hits); 1s do NOT backfire
    const primaryRes = evaluateDiceRoll(sampleRoll, 3, false);
    assert.equal(primaryRes.hits, 4);
    assert.equal(primaryRes.backfires, 0);

    // Out-of-Focus (5+): 5, 6 are hits (2 hits); the two 1s trigger 2 Backfires
    const outRes = evaluateDiceRoll(sampleRoll, 5, true);
    assert.equal(outRes.hits, 2);
    assert.equal(outRes.backfires, 2);

    // Survivalist Hostile Environment Mastery ignores Natural 1s even Out of Focus
    const survivalistRes = evaluateDiceRoll(sampleRoll, 5, true, true);
    assert.equal(survivalistRes.hits, 2);
    assert.equal(survivalistRes.backfires, 0);

    // Stage Difficulty & Operational Momentum (D = 14)
    assert.equal(calculateTargetDifficulty(4, 0), 14);
    assert.deepEqual(evaluateStageOutcome(13, 14), {
      cleared: false,
      margin: -1,
      momentumEarned: false,
    });
    assert.deepEqual(evaluateStageOutcome(15, 14), {
      cleared: true,
      margin: 1,
      momentumEarned: false,
    });
    assert.deepEqual(evaluateStageOutcome(16, 14), {
      cleared: true,
      margin: 2,
      momentumEarned: true,
    });
  });

  it('resolves Command Auction tie-breakers (Highest CR -> Highest PIP -> Lowest Operative LOY)', () => {
    const tiedBids = [
      { playerIndex: 0, commandBid: 3, pip: 2, operativeLoyalty: 2 },
      { playerIndex: 1, commandBid: 3, pip: 4, operativeLoyalty: 3 },
      { playerIndex: 2, commandBid: 2, pip: 6, operativeLoyalty: 1 },
    ];
    const winnerByPip = resolveCommandAuction(tiedBids);
    assert.equal(winnerByPip.playerIndex, 1, 'Higher PIP must break a Credit bid tie');

    const tiedCrAndPip = [
      { playerIndex: 0, commandBid: 3, pip: 4, operativeLoyalty: 3 },
      { playerIndex: 1, commandBid: 3, pip: 4, operativeLoyalty: 1 },
    ];
    const winnerByLowLoy = resolveCommandAuction(tiedCrAndPip);
    assert.equal(
      winnerByLowLoy.playerIndex,
      1,
      'Lower deployed operative Loyalty must break a CR + PIP tie'
    );
  });

  it('enforces 6-Slot Anatomical Loadout constraints and Med Bay / Trauma tables', () => {
    const rifle2H = { stats: { slots_required: ['Hand L', 'Hand R'] } };
    const pistol1H = { stats: { slots_required: ['Hand'] } };
    const visorHead = { stats: { slots_required: ['Head'] } };
    const multiHarness = { stats: { slots_required: ['Head', 'Body'] } };
    const medkitConsumable = { stats: { slots_required: [] } };

    // Equipping a 1H pistol when already holding a 2H rifle must fail (3 hands > 2)
    assert.equal(validateSlotLoadout([rifle2H], pistol1H).valid, false);
    // Equipping a Multi-Slot [Head]+[Body] harness when [Head] is already occupied must fail
    assert.equal(validateSlotLoadout([visorHead], multiHarness).valid, false);
    // Equipping a [Head] visor with a 2H rifle is valid
    assert.equal(validateSlotLoadout([rifle2H], visorHead).valid, true);
    // Consumables with empty slots_required are always valid
    assert.equal(validateSlotLoadout([rifle2H, visorHead], medkitConsumable).valid, true);

    // Med Bay Recovery: [4, 5] heals 1 HP baseline (5+), or 2 HP with Surgical Wing (4+)
    assert.equal(evaluateMedBayRecovery([4, 5], false).hpRestored, 1);
    assert.equal(evaluateMedBayRecovery([4, 5], true).hpRestored, 2);

    // Critical Injury d6 Table
    assert.equal(resolveCriticalInjuryRoll(2).dicePenalty, 0);
    assert.equal(resolveCriticalInjuryRoll(4).dicePenalty, 1);
    assert.equal(resolveCriticalInjuryRoll(6).hpPenalty, 1);
  });

  it('enforces dedicated Wiki pages (no popups), inter-clicky links, compound quantity tokens, and the 4-tier currency/state/tracker taxonomy', () => {
    const wikiPortalSrc = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'components', 'WikiPortal.tsx'),
      'utf8'
    );
    const semanticSrc = fs.readFileSync(
      path.join(ROOT_DIR, 'src', 'components', 'SemanticText.tsx'),
      'utf8'
    );
    const vaultEconomyMd = fs.readFileSync(
      path.join(ROOT_DIR, 'game', 'core', 'vault_economy.md'),
      'utf8'
    );
    const allComponents = JSON.parse(
      fs.readFileSync(path.join(ROOT_DIR, 'manifests', 'exports', 'all_components.json'), 'utf8')
    );

    // 1. WikiPortal uses dedicated hash routes (#/wiki/component/..., #/wiki/focus/..., #/wiki/class/..., #/wiki/concept/currencies)
    assert.ok(wikiPortalSrc.includes('#/wiki/component/'));
    assert.ok(wikiPortalSrc.includes('#/wiki/focus/'));
    assert.ok(wikiPortalSrc.includes('#/wiki/class/'));
    assert.ok(wikiPortalSrc.includes('#/wiki/concept/currencies'));
    assert.ok(!wikiPortalSrc.includes('✕ Close Dossier'), 'Modal popups must be replaced by dedicated Wiki pages');

    // 2. SemanticText includes compound quantity regex and WIKI_ENTITY_LINKS
    assert.ok(semanticSrc.includes('WIKI_ENTITY_LINKS'));
    assert.ok(semanticSrc.includes('COMPOUND_OR_TOKEN_REGEX'));

    // 3. Vault Economy explicitly distinguishes the 3 Primary Vault Currencies from Non-Currency States/Rewards/Trackers
    assert.ok(vaultEconomyMd.includes('Three Primary Vault Currencies'));
    assert.ok(vaultEconomyMd.includes('Non-Currency States, Rewards & Meta Trackers'));

    // 4. No component rules_text or body has broken nested bold+backtick currency formatting like **+1 `[CR]`**
    for (const comp of allComponents) {
      assert.ok(
        !/\*\*[^*`]*`\[(?:CR|EF|PIP|LOY|DOOM|MOM|VP)\]`/.test(comp.body || ''),
        `Component ${comp.id} body contains unnormalized nested backtick currency formatting`
      );
    }
  });
});
