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

  it('verifies resolution of rules BL-RULES-06 through BL-RULES-08 and confirmation of balance models BL-BAL-01 through BL-BAL-03', () => {
    const classesMd = fs.readFileSync(path.join(ROOT_DIR, 'game', 'core', 'classes_and_focus.md'), 'utf8');
    assert.ok(classesMd.includes('BL-RULES-06'), 'classes_and_focus.md must codify BL-RULES-06');
    assert.ok(classesMd.includes('Phase 1: The Specialists'), 'classes_and_focus.md must codify Phase 1 promotion for Scientist dual-vector');

    const cmdMd = fs.readFileSync(path.join(ROOT_DIR, 'game', 'core', 'squad_leader_command.md'), 'utf8');
    assert.ok(cmdMd.includes('BL-RULES-07'), 'squad_leader_command.md must codify BL-RULES-07');
    assert.ok(cmdMd.includes('Dynamic Split-Effect Modifier Interaction'), 'squad_leader_command.md must explain split modifier dynamic evaluation');

    const medbayMd = fs.readFileSync(path.join(ROOT_DIR, 'game', 'core', 'medbay_trauma.md'), 'utf8');
    assert.ok(medbayMd.includes('BL-RULES-08'), 'medbay_trauma.md must codify BL-RULES-08');
    assert.ok(medbayMd.includes('Medically Grounded Protocol'), 'medbay_trauma.md must codify Medically Grounded protocol');

    const mathEngineMd = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'design', '01_mathematical_engine_and_9es_ledger.md'), 'utf8');
    assert.ok(mathEngineMd.includes('BL-BAL-01'), 'math engine design doc must confirm BL-BAL-01');
    assert.ok(mathEngineMd.includes('BL-BAL-02'), 'math engine design doc must confirm BL-BAL-02');

    const economyMd = fs.readFileSync(path.join(ROOT_DIR, 'docs', 'design', '04_economy_and_valuation_models.md'), 'utf8');
    assert.ok(economyMd.includes('BL-BAL-03'), 'economy design doc must confirm BL-BAL-03');

    const backlogMd = fs.readFileSync(path.join(ROOT_DIR, 'BACKLOG.md'), 'utf8');
    for (let i = 1; i <= 8; i++) {
      const ruleId = 'BL-RULES-0' + i;
      assert.ok(backlogMd.includes(ruleId), 'BACKLOG.md must contain ' + ruleId);
    }
  });
  it('verifies VTT board game phase flow (Setup -> Phase 1 -> Phase 2 -> Phase 3 -> Phase 4 -> Sim) and Vanguard Slot mechanics', () => {
    const vttSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'vtt', 'VirtualTabletop.tsx'), 'utf8');
    assert.ok(vttSrc.includes('BOARD_GAME_PHASES'), 'VTT must export or define BOARD_GAME_PHASES');
    assert.ok(vttSrc.includes('vtt-phase-nav'), 'VTT must render vtt-phase-nav navigation bar');
    assert.ok(vttSrc.includes('handleZeroBidRollOff'), 'VTT must implement handleZeroBidRollOff for BL-RULES-04');
    assert.ok(vttSrc.includes('handleDistributeMissionPayouts'), 'VTT must implement handleDistributeMissionPayouts for BL-RULES-01');
    assert.ok(vttSrc.includes('Vanguard Slot'), 'VTT must support 3-player Vanguard Slot protocol');

    const tokensCss = fs.readFileSync(path.join(ROOT_DIR, 'src', 'styles', 'tokens.css'), 'utf8');
    assert.ok(tokensCss.includes('.vtt-phase-nav'), 'tokens.css must define .vtt-phase-nav');
    assert.ok(tokensCss.includes('.vtt-phase-tab'), 'tokens.css must define .vtt-phase-tab');
    assert.ok(tokensCss.includes('.rulebook-phase-badge'), 'tokens.css must define .rulebook-phase-badge');

    const wikiSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'WikiPortal.tsx'), 'utf8');
    assert.ok(wikiSrc.includes('rulebook-phase-badge badge-overview'), 'WikiPortal print rulebook must render chapter phase banners');
    assert.ok(wikiSrc.includes('rulebook-phase-badge badge-phase-3'), 'WikiPortal print rulebook must render tactical phase banner');
  });
  it('verifies Individual Operative Dice Sovereignty rules and VTT commitment controls', () => {
    // 1. Verify Core Rulebook Chapters
    const diceSystemMd = fs.readFileSync(path.join(ROOT_DIR, 'game', 'core', 'dice_system.md'), 'utf8');
    assert.ok(
      diceSystemMd.includes('Individual Dice Commitment Sovereignty & The Right to Hold Back'),
      'dice_system.md must contain Individual Dice Commitment Sovereignty section'
    );
    assert.ok(
      diceSystemMd.includes('Anti-Quarterbacking Protection'),
      'dice_system.md must document Anti-Quarterbacking Protection'
    );
    assert.ok(
      diceSystemMd.includes('The Right to Hold Back'),
      'dice_system.md must document the right to hold back (0 dice)'
    );
    assert.ok(
      diceSystemMd.includes('3-Player Vanguard Slot Governance'),
      'dice_system.md must document 3-player Vanguard Slot dice governance by Squad Leader'
    );

    const rulesOverviewMd = fs.readFileSync(path.join(ROOT_DIR, 'game', 'core', 'rules_overview.md'), 'utf8');
    assert.ok(
      rulesOverviewMd.includes('Individual Operative Dice Sovereignty'),
      'rules_overview.md must codify Individual Operative Dice Sovereignty'
    );

    const squadCommandMd = fs.readFileSync(path.join(ROOT_DIR, 'game', 'core', 'squad_leader_command.md'), 'utf8');
    assert.ok(
      squadCommandMd.includes('Command Limits & Operative Sovereignty'),
      'squad_leader_command.md must define command limits over teammate dice'
    );

    // 2. Verify VTT implementation
    const vttSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'vtt', 'VirtualTabletop.tsx'), 'utf8');
    assert.ok(
      vttSrc.includes('handleSetOperativeCommittedDice'),
      'VirtualTabletop.tsx must implement handleSetOperativeCommittedDice'
    );
    assert.ok(
      vttSrc.includes('handleRollSingleOperative'),
      'VirtualTabletop.tsx must implement handleRollSingleOperative for individual player agency'
    );
    assert.ok(
      vttSrc.includes('0 (Hold)'),
      'VirtualTabletop.tsx must render 0 (Hold) quick-select pill'
    );
    assert.ok(
      vttSrc.includes('Holding back: 0 dice rolled'),
      'VirtualTabletop.tsx must display feedback when holding back with 0 dice'
    );
    assert.ok(
      vttSrc.includes('Roll All Committed Specialists'),
      'VirtualTabletop.tsx must provide coordinated squad roll buttons'
    );

    // 3. Verify Engine coach hints
    const engineSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'vtt', 'engine.js'), 'utf8');
    assert.ok(
      engineSrc.includes('Each player independently chooses how many dice their specialist commits'),
      'engine.js must guide players on individual specialist dice commitment'
    );
    assert.ok(
      engineSrc.includes('each player with remaining Support operatives independently chooses how many dice to commit'),
      'engine.js must guide players on individual support dice commitment'
    );
  });
  it('verifies Dual-Stream Payout Model (BL-RULES-01), per-character stipends, negotiated pool, and multi-click claim lock', () => {
    // 1. Core Rulebook Verification
    const vaultEconomyMd = fs.readFileSync(path.join(ROOT_DIR, 'game', 'core', 'vault_economy.md'), 'utf8');
    assert.ok(
      vaultEconomyMd.includes('Step 1 Deep-Dive: Debrief & Dual-Stream Payouts (BL-RULES-01)'),
      'vault_economy.md must define Step 1 Dual-Stream Payout Model'
    );
    assert.ok(
      vaultEconomyMd.includes('Stream 1: Guaranteed Per-Character Deployment Stipend'),
      'vault_economy.md must codify Stream 1 per-character stipend'
    );
    assert.ok(
      vaultEconomyMd.includes('Stream 2: The Shared Clearance Bounty Pool (Negotiated Split)'),
      'vault_economy.md must codify Stream 2 negotiated bounty pool'
    );
    assert.ok(
      vaultEconomyMd.includes('Single-Claim Invariant'),
      'vault_economy.md must state Single-Claim Invariant to prevent duplicate payout claims'
    );

    // 2. VTT Implementation Verification
    const vttSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'vtt', 'VirtualTabletop.tsx'), 'utf8');
    assert.ok(
      vttSrc.includes('payoutsClaimed'),
      'VirtualTabletop.tsx must track payoutsClaimed state flag'
    );
    assert.ok(
      vttSrc.includes('negotiatedBountyCredits'),
      'VirtualTabletop.tsx must track negotiatedBountyCredits allocation'
    );
    assert.ok(
      vttSrc.includes('handleSetNegotiatedBountyCredits'),
      'VirtualTabletop.tsx must provide handleSetNegotiatedBountyCredits'
    );
    assert.ok(
      vttSrc.includes('handleResetCanonicalBountySplit'),
      'VirtualTabletop.tsx must provide handleResetCanonicalBountySplit'
    );
    assert.ok(
      vttSrc.includes('Payouts Deposited into Vaults (Claimed)'),
      'VirtualTabletop.tsx must lock button with claimed message after deposit'
    );
    assert.ok(
      vttSrc.includes('if (state.payoutsClaimed) return;'),
      'handleDistributeMissionPayouts must prevent multi-click duplicate payouts'
    );
  });

  it('verifies Quartermaster Armory Market depletion, item acquisition, and Director seat actions', () => {
    const vttSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'vtt', 'VirtualTabletop.tsx'), 'utf8');

    // 1. Market depletion and dynamic shop tracking
    assert.ok(
      vttSrc.includes('armoryMarketItemIds'),
      'VirtualTabletop.tsx must track armoryMarketItemIds in state'
    );
    assert.ok(
      vttSrc.includes('factionArmoryCaches'),
      'VirtualTabletop.tsx must track factionArmoryCaches in state'
    );
    assert.ok(
      vttSrc.includes('handlePurchaseArmoryItem'),
      'VirtualTabletop.tsx must implement handlePurchaseArmoryItem'
    );
    assert.ok(
      vttSrc.includes('handleEquipFromCache'),
      'VirtualTabletop.tsx must implement handleEquipFromCache'
    );
    assert.ok(
      vttSrc.includes('handleUnequipItem'),
      'VirtualTabletop.tsx must implement handleUnequipItem'
    );
    assert.ok(
      vttSrc.includes('handleRefreshArmoryMarket'),
      'VirtualTabletop.tsx must implement handleRefreshArmoryMarket'
    );

    // 2. Active Director Switcher
    assert.ok(
      vttSrc.includes('activeDirectorIndex'),
      'VirtualTabletop.tsx must track activeDirectorIndex in state'
    );
    assert.ok(
      vttSrc.includes('handleSwitchActiveDirector'),
      'VirtualTabletop.tsx must implement handleSwitchActiveDirector'
    );
    assert.ok(
      vttSrc.includes('Pass Turn to Next Director'),
      'VirtualTabletop.tsx must provide button to pass turn to next Director'
    );

    // 3. Components
    const armoryCardSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'vtt', 'components', 'ArmoryItemCard.tsx'), 'utf8');
    assert.ok(
      armoryCardSrc.includes('ArmoryItemCard'),
      'ArmoryItemCard component must be defined'
    );
  });

  it('verifies Open Corporate Agendas, Secret Corporate Objectives draft (Step 0.4), HQ Facility Board, and Boardroom Perks', () => {
    const vttSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'vtt', 'VirtualTabletop.tsx'), 'utf8');

    // 1. Agendas and Secret Objectives state & handlers
    assert.ok(
      vttSrc.includes('openAgendaIds'),
      'VirtualTabletop.tsx must track openAgendaIds in state'
    );
    assert.ok(
      vttSrc.includes('playerSecretObjectives'),
      'VirtualTabletop.tsx must track playerSecretObjectives in state'
    );
    assert.ok(
      vttSrc.includes('handleSelectSecretObjective'),
      'VirtualTabletop.tsx must implement handleSelectSecretObjective'
    );
    assert.ok(
      vttSrc.includes('handleToggleSecretObjectiveReveal'),
      'VirtualTabletop.tsx must implement handleToggleSecretObjectiveReveal'
    );
    assert.ok(
      vttSrc.includes('handleClaimAgenda'),
      'VirtualTabletop.tsx must implement handleClaimAgenda'
    );

    // 2. Setup Step 0.4: setup_agendas_objectives
    assert.ok(
      vttSrc.includes("'setup_agendas_objectives'"),
      'VirtualTabletop.tsx must include setup_agendas_objectives step in setup flow'
    );

    // 3. Corporate Facility Sponsorships and Perks
    assert.ok(
      vttSrc.includes('sponsoredFacilities'),
      'VirtualTabletop.tsx must track sponsoredFacilities in state'
    );
    assert.ok(
      vttSrc.includes('activePerkIds'),
      'VirtualTabletop.tsx must track activePerkIds in state'
    );
    assert.ok(
      vttSrc.includes('handleSponsorFacility'),
      'VirtualTabletop.tsx must implement handleSponsorFacility'
    );
    assert.ok(
      vttSrc.includes('handleUnlockPerk'),
      'VirtualTabletop.tsx must implement handleUnlockPerk'
    );

    // 4. Component files existence and validity
    assert.ok(
      fs.existsSync(path.join(ROOT_DIR, 'src', 'vtt', 'components', 'SecretObjectiveCard.tsx')),
      'SecretObjectiveCard.tsx must exist'
    );
    assert.ok(
      fs.existsSync(path.join(ROOT_DIR, 'src', 'vtt', 'components', 'AgendaCard.tsx')),
      'AgendaCard.tsx must exist'
    );
    assert.ok(
      fs.existsSync(path.join(ROOT_DIR, 'src', 'vtt', 'components', 'HQFacilityBoard.tsx')),
      'HQFacilityBoard.tsx must exist'
    );
    assert.ok(
      fs.existsSync(path.join(ROOT_DIR, 'src', 'vtt', 'components', 'FactionPerksConsole.tsx')),
      'FactionPerksConsole.tsx must exist'
    );
  });
});
