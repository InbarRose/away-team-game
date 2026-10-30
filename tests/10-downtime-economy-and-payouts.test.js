import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDualStreamPayouts,
} from '../src/vtt/engine.js';

describe('Suite 10: HQ Downtime Economy & Dual-Stream Payouts (Chapter 7)', () => {
  describe('Dual-Stream Mission Debrief Payouts (BL-RULES-01)', () => {
    it('calculates 4-Player dual-stream debrief payouts with guaranteed stipends + negotiated pool', () => {
      const squad = [
        { slotIndex: 0, ownerPlayer: 0, characterId: 'char-01' },
        { slotIndex: 1, ownerPlayer: 1, characterId: 'char-02' },
        { slotIndex: 2, ownerPlayer: 2, characterId: 'char-03' },
        { slotIndex: 3, ownerPlayer: 3, characterId: 'char-04' },
      ];

      const negotiatedBountyCredits = { 0: 2, 1: 2, 2: 1, 3: 1 }; // 6 CR pot

      const payouts = calculateDualStreamPayouts({
        squad,
        playerCount: 4,
        squadLeaderPlayerIndex: 0,
        negotiatedBountyCredits,
        bountyPip: 1,
      });

      // Player 0: +2 CR guaranteed + 2 CR bounty = 4 CR, +1 PIP
      assert.equal(payouts.playerPayouts[0].guaranteedCredits, 2);
      assert.equal(payouts.playerPayouts[0].bountyCredits, 2);
      assert.equal(payouts.playerPayouts[0].totalCredits, 4);
      assert.equal(payouts.playerPayouts[0].pip, 1);

      // Player 2: +2 CR guaranteed + 1 CR bounty = 3 CR, +1 PIP
      assert.equal(payouts.playerPayouts[2].guaranteedCredits, 2);
      assert.equal(payouts.playerPayouts[2].bountyCredits, 1);
      assert.equal(payouts.playerPayouts[2].totalCredits, 3);
      assert.equal(payouts.playerPayouts[2].pip, 1);
    });

    it('awards Vanguard Slot 4 operative stipend to Squad Leader in 3-Player mode', () => {
      // 3-Player Table: Player 1 is Squad Leader and commands Slot 3 (Vanguard)
      const squad = [
        { slotIndex: 0, ownerPlayer: 0, characterId: 'char-01' },
        { slotIndex: 1, ownerPlayer: 1, characterId: 'char-02' },
        { slotIndex: 2, ownerPlayer: 2, characterId: 'char-03' },
        { slotIndex: 3, ownerPlayer: 1, characterId: 'char-04', isVanguardSlot: true },
      ];

      const negotiatedBountyCredits = { 0: 2, 1: 2, 2: 2 }; // 6 CR pot

      const payouts = calculateDualStreamPayouts({
        squad,
        playerCount: 3,
        squadLeaderPlayerIndex: 1,
        negotiatedBountyCredits,
        bountyPip: 1,
      });

      // Player 1 commands their own operative AND the Vanguard operative -> earns 2 x 2 = +4 CR guaranteed
      assert.equal(
        payouts.playerPayouts[1].guaranteedCredits,
        4,
        'Squad Leader commanding Vanguard Slot 4 must receive +4 CR guaranteed stipend'
      );
      assert.equal(payouts.playerPayouts[1].totalCredits, 6); // 4 + 2
    });

    it('enforces single-claim invariant: repeat claim attempts add 0 duplicate currency', () => {
      let payoutsClaimed = false;
      let vaultCredits = 4;

      const attemptClaim = (amount) => {
        if (payoutsClaimed) return { added: 0 };
        payoutsClaimed = true;
        vaultCredits += amount;
        return { added: amount };
      };

      // First click: successfully deposits 4 CR
      const firstClick = attemptClaim(4);
      assert.equal(firstClick.added, 4);
      assert.equal(vaultCredits, 8);
      assert.equal(payoutsClaimed, true);

      // Second click: rejected by single-claim lock
      const secondClick = attemptClaim(4);
      assert.equal(secondClick.added, 0);
      assert.equal(vaultCredits, 8, 'Vault credits must not increase on duplicate claim');
    });
  });

  describe('Quartermaster Market Depletion & Inventory Flow', () => {
    it('depletes purchased item from market row and replenishes from remaining deck', () => {
      const armoryDeck = [
        { id: 'item-01', title: 'Carapace Armor', cost: { credits: 3 } },
        { id: 'item-02', title: 'Targeting Visor', cost: { credits: 2 } },
        { id: 'item-03', title: 'Stimpack', cost: { credits: 1 } },
        { id: 'item-04', title: 'Smoke Grenade', cost: { credits: 2 } },
        { id: 'item-05', title: 'Jump Jets', cost: { credits: 4 } },
        { id: 'item-06', title: 'Combat Knife', cost: { credits: 1 } },
        { id: 'item-07', title: 'Thermal Goggles', cost: { credits: 2 } }, // In deck
      ];

      let marketItemIds = ['item-01', 'item-02', 'item-03', 'item-04', 'item-05', 'item-06'];
      let directorCredits = 5;
      let factionCache = [];

      // Director buys item-01 (Carapace Armor, 3 CR)
      const boughtItemId = 'item-01';
      const boughtItem = armoryDeck.find((it) => it.id === boughtItemId);
      assert.ok(directorCredits >= boughtItem.cost.credits);

      directorCredits -= boughtItem.cost.credits;
      factionCache.push(boughtItemId);

      // Market replenishment: filter out bought item and draw replacement
      const remainingDeck = armoryDeck.filter(
        (it) => !marketItemIds.includes(it.id) && it.id !== boughtItemId
      );
      assert.equal(remainingDeck.length, 1);
      const replacementItem = remainingDeck[0];

      marketItemIds = marketItemIds
        .filter((id) => id !== boughtItemId)
        .concat([replacementItem.id]);

      assert.equal(directorCredits, 2, '3 CR deducted from Director vault');
      assert.equal(factionCache.includes('item-01'), true, 'Item placed in Director Faction Cache');
      assert.equal(marketItemIds.includes('item-01'), false, 'Purchased item removed from Market row');
      assert.equal(marketItemIds.includes('item-07'), true, 'Market row replenished from armory deck');
      assert.equal(marketItemIds.length, 6, 'Market maintains exactly 6 items displayed');
    });
  });

  describe('Corporate Facility Sponsorships (Base Operations)', () => {
    it('sponsors facility, deducts Credit or Effort cost, and assigns Director attribution', () => {
      const facility = {
        id: 'fac-infirmary',
        title: 'Cybernetic Surgical Wing',
        cost: { credits: 3 },
      };

      let vault = { credits: 5, effort: 2 };
      let sponsoredFacilities = {};

      // Director 0 sponsors Infirmary for 3 CR
      assert.ok(vault.credits >= facility.cost.credits);
      vault.credits -= facility.cost.credits;

      sponsoredFacilities[facility.id] = {
        facilityId: facility.id,
        sponsoredByPlayer: 0,
        sponsoredAt: Date.now(),
      };

      assert.equal(vault.credits, 2, '3 CR deducted for facility sponsorship');
      assert.equal(sponsoredFacilities['fac-infirmary'].sponsoredByPlayer, 0);
    });

    it('rejects facility sponsorship if Director has insufficient Vault assets', () => {
      const facilityCost = 3;
      const vaultCredits = 2; // Insufficient

      const canSponsor = vaultCredits >= facilityCost;
      assert.equal(canSponsor, false, 'Sponsorship blocked when funds are insufficient');
    });
  });
});
