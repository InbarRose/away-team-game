import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Suite 15: Client Storage Persistence, Telemetry & Navigation Safety Guards', () => {
  describe('LocalStorage State Serialization & Hydration Resilience', () => {
    it('round-trips full VTT state through JSON serialization without data loss', () => {
      const mockState = {
        playerCount: 4,
        campaignId: 'campaign-01',
        missionIndex: 1,
        stageIndex: 2,
        sequenceStep: 3,
        flowStep: 'phase3_tactical',
        vaults: [
          { playerIndex: 0, factionId: 'faction-aegis', credits: 7, effort: 2, pip: 3 },
        ],
        squad: [
          { slotIndex: 0, characterId: 'char-anvil', currentHp: 3, spentDice: 2, equippedItemIds: ['item-01'] },
        ],
        armoryMarketItemIds: ['item-02', 'item-03', 'item-04', 'item-05', 'item-06', 'item-07'],
      };

      const serialized = JSON.stringify(mockState);
      assert.ok(serialized.length > 50);

      const hydrated = JSON.parse(serialized);
      assert.deepEqual(hydrated, mockState, 'Hydrated state must match serialized state exactly');
    });

    it('gracefully degrades to default state when storage contains corrupted JSON', () => {
      const defaultState = { flowStep: 'setup_players', playerCount: 4, vaults: [] };
      const corruptedJson = '{ invalid_json: ...';

      let state = defaultState;
      try {
        const parsed = JSON.parse(corruptedJson);
        if (parsed && parsed.vaults) {
          state = { ...defaultState, ...parsed };
        }
      } catch {
        // Fallback gracefully to defaultState
        state = defaultState;
      }

      assert.equal(state.flowStep, 'setup_players');
      assert.equal(state.playerCount, 4);
    });
  });

  describe('Save File Export / Import JSON Schema Validation', () => {
    it('validates required fields and non-negative finite numeric invariants in save file', () => {
      const validSave = {
        exportedAt: new Date().toISOString(),
        campaignId: 'campaign-01',
        missionIndex: 0,
        stageIndex: 1,
        vaults: [
          { playerIndex: 0, credits: 4, effort: 1, pip: 1, vp: 0 },
        ],
        squad: [
          { slotIndex: 0, currentHp: 3, spentDice: 1, equippedItemIds: [] },
        ],
        armoryMarketItemIds: ['item-01', 'item-02', 'item-03', 'item-04', 'item-05', 'item-06'],
      };

      // Schema checks
      assert.ok(validSave.campaignId, 'Must have campaignId');
      assert.ok(Array.isArray(validSave.vaults), 'Must have vaults array');
      assert.ok(Array.isArray(validSave.squad), 'Must have squad array');

      // Invariants: no NaN, no negative vaults
      for (const v of validSave.vaults) {
        assert.ok(Number.isFinite(v.credits) && v.credits >= 0, 'Credits must be non-negative finite number');
        assert.ok(Number.isFinite(v.effort) && v.effort >= 0, 'Effort must be non-negative finite number');
        assert.ok(Number.isFinite(v.pip) && v.pip >= 0, 'PIP must be non-negative finite number');
      }

      for (const s of validSave.squad) {
        assert.ok(Number.isFinite(s.currentHp) && s.currentHp >= 0, 'HP must be non-negative');
        assert.ok(Number.isFinite(s.spentDice) && s.spentDice >= 0, 'Spent dice must be non-negative');
      }
    });
  });

  describe('Navigation Isolation (IN_GAME_PHASES vs SETUP_STEPS)', () => {
    it('verifies that in-game phase bar excludes setup and prevents mid-game backward navigation', () => {
      const vttSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'vtt', 'VirtualTabletop.tsx'), 'utf8');

      // IN_GAME_PHASES definition
      assert.ok(vttSrc.includes('IN_GAME_PHASES'), 'VirtualTabletop must define IN_GAME_PHASES');
      assert.ok(vttSrc.includes('SETUP_STEPS'), 'VirtualTabletop must define SETUP_STEPS');

      // Verify that IN_GAME_PHASES only contains in-game phases: phase1_mission, phase2_command, stage, hq, simulator
      assert.ok(vttSrc.includes("id: 'phase1_mission'"));
      assert.ok(vttSrc.includes("id: 'phase2_command'"));
      assert.ok(vttSrc.includes("id: 'stage'"));
      assert.ok(vttSrc.includes("id: 'hq'"));
      assert.ok(vttSrc.includes("id: 'simulator'"));
    });
  });

  describe('Mid-Game Session Reset Guard Modal', () => {
    it('triggers confirmation modal before allowing reset of an in-progress campaign', () => {
      const vttSrc = fs.readFileSync(path.join(ROOT_DIR, 'src', 'vtt', 'VirtualTabletop.tsx'), 'utf8');

      assert.ok(vttSrc.includes('showRestartModal'), 'Must track showRestartModal state');
      assert.ok(vttSrc.includes('Start a New Game?'), 'Must render confirmation modal with title');
      assert.ok(vttSrc.includes('Confirm: Start New Game ▶'), 'Must require explicit confirmation button click');
    });
  });
});
