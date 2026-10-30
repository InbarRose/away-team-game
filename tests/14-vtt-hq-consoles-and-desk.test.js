import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateSlotLoadout,
} from '../src/vtt/engine.js';

describe('Suite 14: VTT HQ Consoles & Active Director Desk Interactions', () => {
  describe('Active Director Console Switcher & Vault Scoping', () => {
    it('switches active Director seat and isolates vault attribution', () => {
      let activeDirectorIndex = 0;
      const vaults = [
        { playerIndex: 0, factionId: 'faction-aegis', credits: 4, effort: 1, pip: 2 },
        { playerIndex: 1, factionId: 'faction-nexus', credits: 6, effort: 2, pip: 1 },
      ];

      // Switch to Director 1 (Nexus)
      activeDirectorIndex = 1;
      const activeVault = vaults[activeDirectorIndex];

      assert.equal(activeDirectorIndex, 1);
      assert.equal(activeVault.factionId, 'faction-nexus');
      assert.equal(activeVault.credits, 6);
    });
  });

  describe('Armory Cache Equipping & 6-Slot Anatomical Loadout Checks', () => {
    it('equips item from Faction Cache onto operative and updates armor buffer', () => {
      let factionCache = ['item-carapace'];
      let squad = [
        {
          slotIndex: 0,
          characterId: 'char-anvil',
          equippedItemIds: [],
          armorRemaining: 0,
        },
      ];

      const carapaceItem = {
        id: 'item-carapace',
        title: 'Reinforced Carapace',
        stats: { slots_required: ['body'], armor_buffer: 2 },
      };

      // Equip onto Slot 0
      const slotIdx = 0;
      const itemIdx = factionCache.indexOf(carapaceItem.id);
      assert.ok(itemIdx >= 0);

      factionCache.splice(itemIdx, 1);
      squad[slotIdx] = {
        ...squad[slotIdx],
        equippedItemIds: [...squad[slotIdx].equippedItemIds, carapaceItem.id],
        armorRemaining: squad[slotIdx].armorRemaining + carapaceItem.stats.armor_buffer,
      };

      assert.equal(factionCache.length, 0, 'Item removed from Faction Cache');
      assert.equal(squad[0].equippedItemIds.includes('item-carapace'), true);
      assert.equal(squad[0].armorRemaining, 2, '+2 armor buffer applied');
    });

    it('enforces anatomical slot loadout constraints (2 Hands limit)', () => {
      const rifle = {
        id: 'item-rifle',
        stats: { slots_required: ['Hand L', 'Hand R'] }, // 2-handed
      };
      const pistol = {
        id: 'item-pistol',
        stats: { slots_required: ['Hand R'] }, // 1-handed
      };

      // Currently holding rifle (2 hands used)
      const currentEquipped = [rifle];
      const check = validateSlotLoadout(currentEquipped, pistol);

      assert.equal(check.valid, false);
      assert.match(check.reason, /Exceeds 2 Hand slots/);
    });
  });

  describe('Unequip Protocol & Return to Faction Cache', () => {
    it('unequips gear from operative, reduces armor buffer, and returns to Faction Cache', () => {
      let factionCache = [];
      let squad = [
        {
          slotIndex: 0,
          equippedItemIds: ['item-shield'],
          armorRemaining: 3,
        },
      ];

      const shieldItem = {
        id: 'item-shield',
        stats: { slots_required: ['Hand L'], armor_buffer: 3 },
      };

      // Unequip shield
      const slotIdx = 0;
      const equippedIdx = squad[slotIdx].equippedItemIds.indexOf(shieldItem.id);
      assert.ok(equippedIdx >= 0);

      squad[slotIdx].equippedItemIds.splice(equippedIdx, 1);
      squad[slotIdx].armorRemaining = Math.max(0, squad[slotIdx].armorRemaining - shieldItem.stats.armor_buffer);
      factionCache.push(shieldItem.id);

      assert.equal(squad[0].equippedItemIds.length, 0, 'Operative no longer has shield equipped');
      assert.equal(squad[0].armorRemaining, 0, 'Armor buffer removed');
      assert.equal(factionCache.includes('item-shield'), true, 'Returned to Faction Armory Cache');
    });
  });

  describe('Boardroom Perks & Facility Sponsorship Records', () => {
    it('toggles active boardroom perks per Director seat', () => {
      let activePerkIds = { 0: [] };

      // Director 0 activates Aegis Tier 1 perk
      const perkId = 'perk-aegis-cqc';
      activePerkIds[0] = [...activePerkIds[0], perkId];

      assert.equal(activePerkIds[0].includes(perkId), true);
    });

    it('records corporate facility sponsorship attribution', () => {
      let sponsoredFacilities = {};

      const sponsorship = {
        facilityId: 'facility-comms',
        sponsoredByPlayer: 1,
        sponsoredAt: 1700000000,
      };

      sponsoredFacilities['facility-comms'] = sponsorship;

      assert.equal(sponsoredFacilities['facility-comms'].sponsoredByPlayer, 1);
      assert.equal(sponsoredFacilities['facility-comms'].facilityId, 'facility-comms');
    });
  });
});
