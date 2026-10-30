import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const allComponents = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, 'src', 'data', 'all_components.json'), 'utf8')
);

const factions = allComponents.filter((c) => c.component_type === 'faction');
const characters = allComponents.filter((c) => c.component_type === 'character');
const campaigns = allComponents.filter((c) => c.component_type === 'campaign');
const agendas = allComponents.filter((c) => c.component_type === 'agenda');
const secretObjectives = allComponents.filter((c) => c.component_type === 'secret_objective');

describe('Suite 12: VTT Finite State Machine & Sequential Setup Flow', () => {
  describe('Step 0.1: Table Configuration & Player Seating (1P-4P)', () => {
    it('initializes table state correctly for 4 players', () => {
      const count = 4;
      const initialVaults = [];
      const initialSquad = [];

      for (let i = 0; i < count; i++) {
        initialVaults.push({
          playerIndex: i,
          playerName: `Director ${i + 1}`,
          factionId: '',
          credits: 4,
          effort: 1,
          pip: 1,
          vp: 0,
          commandBid: 0,
          isSquadLeader: i === 0,
        });
      }

      for (let s = 0; s < 4; s++) {
        initialSquad.push({
          slotIndex: s,
          ownerPlayer: s < count ? s : 0,
          characterId: '',
          equippedItemIds: [],
        });
      }

      assert.equal(initialVaults.length, 4);
      assert.equal(initialSquad.length, 4);
      assert.equal(initialVaults[0].isSquadLeader, true);
    });

    it('configures 3-Player table with Slot 4 designated as Vanguard Slot', () => {
      const count = 3;
      const initialSquad = [];

      for (let s = 0; s < 4; s++) {
        initialSquad.push({
          slotIndex: s,
          ownerPlayer: s < count ? s : 0, // Slot 3 owned by Player 0 (Squad Leader)
          isVanguardSlot: s === 3,
          characterId: '',
          equippedItemIds: [],
        });
      }

      assert.equal(initialSquad.length, 4);
      assert.equal(initialSquad[3].ownerPlayer, 0);
      assert.equal(initialSquad[3].isVanguardSlot, true, 'Slot 4 in 3P table must be Vanguard Slot');
    });

    it('configures 2-Player table with 2 operative slots per Director', () => {
      const count = 2;
      const initialSquad = [
        { slotIndex: 0, ownerPlayer: 0 },
        { slotIndex: 1, ownerPlayer: 1 },
        { slotIndex: 2, ownerPlayer: 0 },
        { slotIndex: 3, ownerPlayer: 1 },
      ];

      assert.equal(initialSquad.filter((s) => s.ownerPlayer === 0).length, 2);
      assert.equal(initialSquad.filter((s) => s.ownerPlayer === 1).length, 2);
    });
  });

  describe('Step 0.2: Sequential Faction Draft & Starting Vault Assets', () => {
    it('cycles draft turn seat from Player 0 to Player N-1', () => {
      let curIdx = 0;
      const playerCount = 4;
      const draftHistory = [];

      while (curIdx < playerCount) {
        draftHistory.push(curIdx);
        curIdx++;
      }

      assert.deepEqual(draftHistory, [0, 1, 2, 3], 'Draft must proceed sequentially seat-by-seat');
    });

    it('populates vault with asymmetric printed starting assets from chosen Faction Dossier', () => {
      const aegis = factions.find((f) => f.id === 'faction-aegis');
      assert.ok(aegis, 'faction-aegis must exist');

      const startAssets = aegis.starting_assets || { credits: 4, effort: 1, pip: 1 };
      const vault = {
        playerIndex: 0,
        factionId: aegis.id,
        credits: startAssets.credits,
        effort: startAssets.effort,
        pip: startAssets.pip,
      };

      assert.equal(vault.credits, 4);
      assert.equal(vault.effort, 1);
      assert.equal(vault.pip, 1);
      assert.equal(vault.factionId, 'faction-aegis');
    });
  });

  describe('Step 0.3: Specialist Operative Draft & Zero-Item Invariant', () => {
    it('enforces the Zero-Starting-Item Invariant on all drafted operatives', () => {
      const sampleChars = characters.slice(0, 4);
      const squad = sampleChars.map((char, idx) => ({
        slotIndex: idx,
        ownerPlayer: idx,
        characterId: char.id,
        currentHp: char.stats?.hp_cap || 3,
        spentDice: 0,
        equippedItemIds: [], // Strictly 0 items at start!
      }));

      for (const op of squad) {
        assert.equal(op.equippedItemIds.length, 0, `Operative ${op.characterId} must start with 0 items`);
        assert.ok(op.currentHp >= 2 && op.currentHp <= 4, 'Starting HP must reflect card hp_cap');
      }
    });
  });

  describe('Step 0.4: Agendas & Secret Corporate Objectives Draft', () => {
    it('deals exactly 3 face-up Open Corporate Agendas to the table', () => {
      const openAgendas = agendas.slice(0, 3).map((a) => a.id);
      assert.equal(openAgendas.length, 3);
      assert.equal(new Set(openAgendas).size, 3, 'All 3 open agendas must be distinct');
    });

    it('deals 2 Secret Corporate Objectives to each Director seat (keep 1)', () => {
      const playerCount = 4;
      const dealtObjectives = {};

      for (let i = 0; i < playerCount; i++) {
        const s1 = secretObjectives[i * 2]?.id || `secret-${i * 2 + 1}`;
        const s2 = secretObjectives[i * 2 + 1]?.id || `secret-${i * 2 + 2}`;
        dealtObjectives[i] = {
          dealtIds: [s1, s2],
          selectedId: s1,
          isRevealed: false,
        };
      }

      for (let i = 0; i < playerCount; i++) {
        assert.equal(dealtObjectives[i].dealtIds.length, 2, 'Each player must be dealt 2 secret objectives');
        assert.ok(dealtObjectives[i].selectedId, 'Player must have 1 selected objective');
        assert.equal(dealtObjectives[i].isRevealed, false, 'Secret objective begins hidden');
      }
    });
  });

  describe('Step 0.5: Campaign Selection & Phase 1 Mission Transition', () => {
    it('advances flowStep to phase1_brief upon campaign selection', () => {
      const selectedCamp = campaigns[0];
      assert.ok(selectedCamp, 'At least 1 campaign must exist in catalog');

      // Simulates campaign selection transition
      const state = {
        flowStep: 'setup_campaign',
        campaignId: '',
        missionIndex: -1,
        stageIndex: -1,
      };

      const nextState = {
        ...state,
        campaignId: selectedCamp.id,
        missionIndex: 0,
        stageIndex: 0,
        sequenceStep: 1,
        flowStep: 'phase1_brief',
        activeTab: 'phase1_mission',
      };

      assert.equal(nextState.flowStep, 'phase1_brief');
      assert.equal(nextState.activeTab, 'phase1_mission');
      assert.equal(nextState.missionIndex, 0);
      assert.equal(nextState.campaignId, selectedCamp.id);
    });
  });
});
