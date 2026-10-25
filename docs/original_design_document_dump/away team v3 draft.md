# **AWAY TEAM — MASTER DESIGN DOCUMENT & SYSTEM RULEBOOK**

*Official Semi-Cooperative Edition*

## **📖 SECTION 1: SYSTEM ARCHITECTURE & PLAYER SCALING**

### **1.1 Core Game Concept**

**Away Team** is a semi-cooperative tactical sci-fi campaign game for 1 to 4 players. Players act as competitive Directors within a covert government agency, managing a changing roster of elite specialists stationed at a customizable Home Base. While the squad must work together to survive high-stakes missions and prevent the campaign from collapsing, individual victory is determined strictly by accumulating the most **Victory Points (VPs)** by the end of the campaign.

### **1.2 Player Count Scaling Matrix**

Every mission requires exactly **4 characters** to deploy. The player-to-character ratio scales smoothly across different group sizes:

* **Solo Mode:** A single player controls all 4 deployed characters, playing purely against the game's automated attrition engine. All competitive VP systems, auctions, and slot-trading mechanics are deactivated.  
* **2-Player Game:** Each player maintains a personal stash of characters and must deploy exactly **2 characters** to fill the 4 mandatory mission slots.  
* **3-Player Game:** Each player automatically assigns exactly **1 character** from their personal roster to fill slots 1, 2, and 3\. Slot 4 is designated as the *Unassigned Vanguard Slot*. Before the mission begins, the 3 players participate in an auction, bidding their personal VPs. The highest bidder wins the slot and deploys a **second** character from their personal roster.  
* **4-Player Game:** Each player maintains a personal stash of characters and deploys exactly **1 character** to fill their designated slot.

┌──────────────┬───────────────────────────────┬───────────────────────────────┐  
│ PLAYER COUNT │ MANDATORY DEPLOYMENT PER USER │ UNASSIGNED VANGUARD SLOTS     │  
├──────────────┼───────────────────────────────┼───────────────────────────────┤  
│ Solo Mode    │ 4 Characters Controlled       │ None                          │  
│ 2 Players    │ 2 Characters Deployed         │ None                          │  
│ 3 Players    │ 1 Character Deployed          │ 1 Slot (Resolved via Auction) │  
│ 4 Players    │ 1 Character Deployed          │ None                          │  
└──────────────┴───────────────────────────────┴───────────────────────────────┘

### **1.3 Campaign Termination & Loss Conditions**

The campaign continues until the final narrative chapter mission is either successfully resolved or completely failed. However, a campaign can terminate early via **Operational Collapse**:

* **The Rule:** If at any point during the Base Phase a player cannot field a character for their required deployment slot due to their personal roster being dead or in Convalescence, and no other player is willing or able to buy out the empty slot, the Agency suffers an **Operational Collapse**.  
* **Sudden Death Scoring:** The campaign ends immediately in absolute team defeat. Players freeze their tracks and trigger an emergency final scoring sequence to determine the individual winner based on VPs accumulated up to that point.

## **🪙 SECTION 2: THE FREE-MARKET PLAYER ECONOMY**

### **2.1 The Triple Currency Ecosystem**

Every resource in the game serves a functional purpose while simultaneously translating into final victory potential at the end of the campaign:

* **🪙 Credits:** Spent to buy armory gear, weapons, modifications, and fund base upgrades during the Base Phase. Can also be spent directly during missions to interact with stages (e.g., bribing guards, paying off modifiers). **1 Credit \= 1 VP** at the end of the game.  
* **🎖️ Loyalty:** Represents your political standing within the agency. It cannot be spent or traded between players; it must be earned through field actions. Holding certain thresholds of Loyalty unlocks powerful passive perks. **1 Loyalty \= 2 VPs** at the end of the game.  
* **🔮 Tokens:** Stored and tracked directly on individual character sheets (maximum of 5 tokens per character). Spent to fuel unique class and label active abilities. **1 Token \= 1 VP** at the end of the game.

### **2.2 The Law of Binding Promises**

At any point during a Stage Briefing or the Base Phase, players can trade Credits, Tokens, and Armory Items from their current character sheets to broker deals. Trades and promises of immediate tactical action (e.g., *"If you give me 2 Credits, I will spend my token to use Lock and Load right now"*) are legally binding and cannot be broken. **Loyalty cannot be traded between players.**

### **2.3 The Recruitment Auction**

When a new character card is discovered via mission bounties, milestones, or base upgrades, an immediate Recruitment Auction is triggered during the next Base Phase:

* **The Bidding Process:** Players use their current **Victory Points (VPs)** from their personal score track to bid. Bidding proceeds clockwise, starting with the player who unlocked the recruit.  
* **The Underdog Advantage:** If a player currently has *fewer* active characters than their required game slots, they receive a **\$-1\$ VP discount** on their final winning bid (minimum bid of 1 VP), making it easier for struggling players to secure reinforcements.

### **2.4 Slot-Trading & Extortion Auctions**

* **Involuntary Buyouts:** If a player *cannot* field a character for their required deployment slot due to injury or death, the slot goes to an open market auction. The remaining players bid VPs to steal the slot and deploy an extra character from their own stash. The winning VP bid is deducted from the buyer's track and **given directly to the bankrupt player** who couldn't field the character. The bankrupt player has zero say in who wins the auction or which character fills the slot.  
* **Voluntary Sellouts:** A player with healthy characters can choose to sit out and openly negotiate to sell their deployment spot to another player for Player Credits, In-Game Items, or direct VP transfers. The selling player retains absolute veto power.

### **2.5 Character Liquidation & Asset Stripping**

During the Base Phase, any player can sell a character card from their personal stash to a rival in exchange for a direct transfer of VPs. Before the card changes hands, the selling player retains the right to execute a **Mandatory Resource Offload**, stripping the character of weapons, armor, credits, and tokens to place them onto their other active characters. Alternatively, they can sell the character "fully loaded" to drive up the VP bidding price.

## **🎲 SECTION 3: THE MISSION PHASE & THE MICRO-LOOP**

### **3.1 Anatomy of a Stage Card**

A mission deck consists of a hidden, pre-shuffled, or strictly curated sequence of **Stage Cards**. Each card contains:

* **Stage Type (Label):** Defines the primary challenge (Combat, Survival, Intel, Operations, Negotiate, Infiltrate).  
* **Difficulty Rating:** The absolute number of successes required to pass the stage.  
* **Stage Modifier:** A unique twist or rule restriction applied to the current encounter.  
* **Clearance Reward:** Bounties granted upon successful completion.  
* **Failure Penalty:** Consequences suffered if the Difficulty Rating is not met.

### **3.2 The Dynamic Initiative Order**

When a Stage Card is revealed, players analyze the requirements and resolve the stage using a strict, multi-tiered initiative system:

#### **Step A: Phase 1 Initiative (The Specialists)**

Characters who possess the revealed stage's keyword as a **Primary Label** act first.

> 1. **Commitment:** Specialists coordinate and decide how many unexhausted dice to commit to the pool from their sheets.  
> 2. **The Specialist Roll:** Committed dice are rolled simultaneously.  
   * **Success:** Each die resulting in a **3+** adds \$+1\$ success toward meeting the Difficulty Rating.  
   * **Backfire (Damage):** Rolling a natural **1** results in 1 point of immediate, un-preventable physical damage to that specific character. They ignore higher support hazard windows.  
> 3. **Early Resolution:** If total successes meet or exceed the Difficulty Rating, the stage is instantly **Resolved with Success**. Move directly to Step D. All uncommitted dice on the remaining support characters are returned safely to their sheets, entirely bypassing their risk windows.

#### **Step B: Phase 2 Initiative (The Support)**

If the Specialists fail to clear the target rating, the remaining deployed characters must step up.

> 1. **Commitment:** Non-matching characters decide how many dice to commit from their remaining pools.  
> 2. **The High-Risk Roll:**  
   * **Success Threshold:** Characters with the keyword as a **Secondary Label** score successes on a **4+**. Characters with no relation to the label score successes on a **5+**.  
   * **High-Risk Backfire:** Rolling a natural **1 or 2** results in 1 point of immediate physical damage to that character.

#### **Step C: Post-Initiative Phase**

Certain character unique powers or passive class abilities trigger *after* all baseline dice have been rolled. Players may activate these triggers now to commit late-stage emergency dice or spend tokens to manipulate results.

#### **Step D: Aftermath & Attrition**

The stage concludes and results are tallied:

* **Success:** If the Difficulty Rating is met, the stage is cleared.  
* **Overkill (Exceeded Target):** If the team generates successes beyond the Difficulty Rating, an Overkill victory is achieved. **Every character** deployed on the active mission receives the stage's listed token, loyalty, or item bounty.  
* **Failure:** If the target rating is not met, the stage fails. The team suffers the listed failure penalty (e.g., team-wide health losses, item destruction, or advancing the global Doom Tracker). The mission continues to the next sequential stage unless the card explicitly dictates an immediate mission abort.

### **3.3 The Overkill Reward Matrix**

When an Overkill victory is achieved (target exceeded by \$\\ge 2\$), localized windfalls are unlocked:

┌─────────────────┬────────────────────────────────────────────────────────────┐  
│ STAGE TYPE      │ OVERKILL BOUNTY (TARGET EXCEEDED BY ≥ 2\)                    │  
├─────────────────┼────────────────────────────────────────────────────────────┤  
│ 🟥 \[Combat\]     │ The Spoils of War: \+2 Credits added to active sheets.       │  
│ 🟥 \[Survival\]   │ Hardened Veterans: \+1 Loyalty to every deployed character. │  
│ 🟦 \[Intel\]      │ Data Bonanza: \+1 Token to all, \+1 Credit to the closer.    │  
│ 🟦 \[Operations\] │ System Cache: The team draws 1 random Consumable item.     │  
│ 🟩 \[Negotiate\]  │ Political Favors: \+1 Loyalty to the character who rolled.  │  
│ 🟩 \[Infiltrate\] │ Clean Run: \+2 Credits to the character with most 6s.       │  
└─────────────────┴────────────────────────────────────────────────────────────┘

## **🩺 SECTION 4: HEALTH, MORTALITY, & THE BASE INJURY CYCLE**

### **4.1 Health & Death Tracking**

* **Variable Health:** Characters feature a baseline maximum health pool ranging from **3 to 5 Hit Points**, strictly balanced against their starting dice pools and unique powers.  
* **Sudden Death:** If a character's health drops to 0 mid-mission, they are killed instantly and their card is permanently purged from the player's personal stash.  
* **Emergency Stabilization:** Specific class abilities or consumables can override sudden death. By immediately spending tokens or discarding items precisely when a character hits 0 HP, they can stabilize that character at exactly 1 HP, resetting them instantly.

### **4.2 The Aftermath Injury Cycle**

Surviving characters do not automatically heal when returning to Home Base. For every missing hit point on a character's tracker, a \$d6\$ must be rolled against the Home Base Medical Chart:

┌────────────┬──────────────────┬──────────────────────────────────────────────┐  
│ D6 ROLL    │ RESULT           │ MECHANICAL CONSEQUENCE                       │  
├────────────┼──────────────────┼──────────────────────────────────────────────┤  
│ 5–6        │ Clean Healing    │ The missing hit point is restored fully.     │  
│ 3–4        │ Convalescence    │ Healed, but must sit out for 1–2 missions.│  
│ 1–2        │ Permanent Injury │ Permadebt: Max HP cap permanently lowered by 1.│  
└────────────┴──────────────────┴──────────────────────────────────────────────┘

### **4.3 Base Downtime Action: Rest & Recovery**

Instead of deploying on a mission card, the team can collectively vote to lock down Home Base to recuperate:

* **The Cost:** Advance the global **Doom Tracker by \$+1\$**.  
* **The Benefit:** Bypasses all \$d6\$ rolling on the Base Injury Chart. *Every single wounded character* resting on a player's bench automatically recovers up to 2 missing Health points, and any character currently locked in "Convalescence" becomes immediately eligible for deployment on the next mission.

## **🎛️ SECTION 5: THE LABEL MATRIX & CLASS BLUEPRINTS**

Each of the 6 classes is defined by **2 Primary Labels** (Specialists: roll first, hit on a **3+**, take damage on a natural 1 only) and **1 Secondary Label** (Support: roll second, hit on a **4+**, take damage on a 1 or 2, but unlock an active passive utility).

### **5.1 The Master Label Matrix**

┌──────────────┬───────────────────┬───────────────────┬────────────────────┐  
│ CLASS        │ PRIMARY LABEL 1   │ PRIMARY LABEL 2   │ SECONDARY LABEL    │  
├──────────────┼───────────────────┼───────────────────┼────────────────────┤  
│ 🟥 Soldier   │ \[Combat\]          │ \[Survival\]        │ \[Infiltrate\]       │  
│ 🟥 Officer   │ \[Combat\]          │ \[Negotiate\]       │ \[Survival\]         │  
│ 🟦 Scientist │ \[Intel\]           │ \[Survival\]        │ \[Operations\]       │  
│ 🟦 Engineer  │ \[Operations\]      │ \[Intel\]           │ \[Combat\]           │  
│ 🟩 Recon     │ \[Infiltrate\]      │ \[Intel\]           │ \[Negotiate\]        │  
│ 🟩 Diplomat  │ \[Negotiate\]       │ \[Operations\]      │ \[Infiltrate\]       │  
└──────────────┴───────────────────┴───────────────────┴────────────────────┘

### **5.2 Universal Label Abilities & Passives**

#### **🟥 Tactical Focus**

* **\[Combat\]**  
  * *Primary Passive (Overwhelm):* Natural 6s rolled in Phase 1 count as \$+2\$ successes instead of \$+1\$.  
  * *Secondary Passive (Suppressive Fire):* If this character rolls at least one success during the Support Phase, choose an ally; that ally ignores all Backfire damage they took during this stage.  
* **\[Survival\]**  
  * *Primary Passive (Endure):* Once per Survival stage, this character may completely ignore their first rolled Backfire damage point.  
  * *Secondary Passive (Environmental Shield):* Once per stage, this character can spend 1 token to completely absorb a Backfire hazard roll (a 1 or 2\) for any non-specialist ally rolling in the Support Phase.

#### **🟦 Intel & Technical Focus**

* **\[Intel\]**  
  * *Primary Passive (Calculated Risk):* When rolling in Phase 1 Initiative, the character can intentionally take 1 damage to add \$+2\$ automatic successes to the team pool.  
  * *Secondary Passive (Tactical Scan):* When this character rolls for an Intel stage, any success they throw counts as \$+2\$ successes toward the Difficulty Rating instead of \$+1\$.  
* **\[Operations\]**  
  * *Primary Passive (System Familiarity):* When resolving an Operations stage, this character can never have their item abilities locked or suppressed by stage modifiers.  
  * *Secondary Passive (Diagnostics):* Once per stage, this character can spend 1 token to let an ally reroll up to two dice that resulted in failures during Phase 1 Initiative.

#### **🟩 Social & Strategy Focus**

* **\[Negotiate\]**  
  * *Primary Passive (Authority):* When rolling in Phase 1 Initiative, this character treats both 3s and 4s as automatic successes.  
  * *Secondary Passive (Psychological Profile):* If this character rolls a natural 6 during the Support Phase, the team immediately recovers 1 token to use on any character's sheet.  
* **\[Infiltrate\]**  
  * *Primary Passive (Vanish):* This character cannot take Backfire damage while rolling on an Infiltrate stage, even if they roll a natural 1\.  
  * *Secondary Passive (Scout Ahead):* Before anyone rolls dice, this character can spend 1 token to permanently lower the current stage's Difficulty Rating by 1 (Minimum of 1).

## **👥 SECTION 6: COMPREHENSIVE CHARACTER REGISTRY**

### **6.1 Soldier Class**

*Class Active Ability:* **Lock and Load** — Spend 1 Token to add \$+2\$ dice to their pool before rolling on a **\[Combat\]** stage.

* **Sarah "Specter" Croft**  
  * **Health:** 3 \| **Starting Dice Pool:** 5 Dice  
  * **Labels:** Primary: \[Combat\], \[Survival\] \| Secondary: \[Infiltrate\]  
  * **Unique Power (Tactical Flank):** Croft may choose to completely skip Phase 1 Initiative. She acts during Step C (Post-Initiative), allowing her to evaluate the entire rolled pool before deciding exactly how many dice to commit from her sheet.  
* **Marcus "The Anvil" Vance**  
  * **Health:** 5 \| **Starting Dice Pool:** 3 Dice  
  * **Labels:** Primary: \[Combat\], \[Survival\] \| Secondary: \[Infiltrate\]  
  * **Unique Power (Kin kinetic Soak):** Marcus can intentionally choose to absorb any Backfire damage rolled by an ally on a \[Combat\] or \[Survival\] stage. If he does, he immediately gains 1 Token on his sheet.  
* **Draco "Gorgon" Vance**  
  * **Health:** 4 \| **Starting Dice Pool:** 4 Dice  
  * **Labels:** Primary: \[Combat\], \[Survival\] \| Secondary: \[Infiltrate\]  
  * **Unique Power (Suppressive Sweep):** When rolling in Phase 1 Initiative on a \[Combat\] stage, Draco can spend 1 Token to turn all rolled 2s into automatic successes.

### **6.2 Officer Class**

*Class Active Ability:* **Chain of Command** — Spend 1 Token to transfer up to 2 of their own tokens over to another character's sheet.

* **Commander Garret Vance**  
  * **Health:** 5 \| **Starting Dice Pool:** 3 Dice  
  * **Labels:** Primary: \[Combat\], \[Negotiate\] \| Secondary: \[Survival\]

  * **Unique Power (Direct Orders):** Once per stage, Garret can spend 1 Token to allow any ally to immediately reroll up to two dice that failed to score a success.  
* **Captain Elena Rostova**  
  * **Health:** 4 \| **Starting Dice Pool:** 4 Dice  
  * **Labels:** Primary: \[Combat\], \[Negotiate\] \| Secondary: \[Survival\]

  * **Unique Power (Tactical Rally):** When Elena rolls an Overkill success on a \[Combat\] or \[Negotiate\] stage, she can immediately distribute 1 bonus Token to *every* other character's sheet, ignoring standard token restrictions.  
* **Major Silas Thorne**  
  * **Health:** 4 \| **Starting Dice Pool:** 4 Dice  
  * **Labels:** Primary: \[Combat\], \[Negotiate\] \| Secondary: \[Survival\]

  * **Unique Power (Field Promotion):** Once per mission, when an ally earns Loyalty mid-stage, Silas can spend 1 Token to copy that reward, instantly adding \$+1\$ Loyalty to his own sheet.

### **6.3 Scientist Class**

*Class Active Ability:* **Field Medicine** — Spend 2 Tokens from this character's sheet immediately after a stage is completed to heal 1 missing Health point on any team member.

* **Dr. Aris Thorne**  
  * **Health:** 3 \| **Starting Dice Pool:** 3 Dice  
  * **Labels:** Primary: \[Intel\], \[Survival\] \| Secondary: \[Operations\]  
  * **Unique Power (Emergency Triage):** When an active ally drops to 0 Health mid-stage, Thorne can immediately spend 1 Token and discard 1 Consumable item to stabilize that character at 1 Health, resetting them instantly.  
* **Dr. Linnea Lindstrom**  
  * **Health:** 4 \| **Starting Dice Pool:** 3 Dice  
  * **Labels:** Primary: \[Intel\], \[Survival\] \| Secondary: \[Operations\]  
  * **Unique Power (Breakthrough):** Once per mission, during an \[Intel\] stage briefing, Lindstrom can reveal an alternative path. Swap the current stage card with the next card in the deck; the bypassed card is shuffled back into the mission pool.  
* **Dr. Naomi Kim**  
  * **Health:** 4 \| **Starting Dice Pool:** 3 Dice  
  * **Labels:** Primary: \[Intel\], \[Survival\] \| Secondary: \[Operations\]  
  * **Unique Power (Predictive Anatomy):** During the Aftermath Phase, Naomi can spend 2 Tokens to allow any benched character (including her own sheet) to completely bypass their roll on the Base Injury Chart, guaranteeing a Clean Healing result.

### **6.4 Engineer Class**

*Class Active Ability:* **Fortify Grid** — Spend 1 Token to allow the entire squad to ignore the "Stage Modifier" penalty text on an **\[Operations\]** or **\[Survival\]** stage card.

* **Apex (Corey Miller)**  
  * **Health:** 4 \| **Starting Dice Pool:** 4 Dice  
  * **Labels:** Primary: \[Operations\], \[Intel\] \| Secondary: \[Combat\]  
  * **Unique Power (Overclock):** Once per stage, Apex can sacrifice 1 Health to add \$+2\$ successes to an \[Operations\] stage without rolling any dice.  
* **Tess "Sprocket" Tanaka**  
  * **Health:** 3 \| **Starting Dice Pool:** 5 Dice  
  * **Labels:** Primary: \[Operations\], \[Intel\] \| Secondary: \[Combat\]  
  * **Unique Power (Jury-Rig):** Tess may spend 1 Token to count any temporary item or basic weapon modification as a matching class item for an ally during an \[Operations\] or \[Combat\] stage.  
* **Buster (Jaxom Reyes)**  
  * **Health:** 5 \| **Starting Dice Pool:** 3 Dice  
  * **Labels:** Primary: \[Operations\], \[Intel\] \| Secondary: \[Combat\]  
  * **Unique Power (Demolition Charge):** Once per mission, Buster can spend 2 Tokens to instantly bypass a \[Survival\] or \[Operations\] stage card without rolling dice. The stage counts as passed, but no Overkill bonuses can be triggered.

### **6.5 Recon Class**

*Class Active Ability:* **Scout Ahead** — Spend 1 Token during the Briefing Step to peek at the next two upcoming Stage Cards in the mission deck.

* **Ji-Yoon Park**  
  * **Health:** 4 \| **Starting Dice Pool:** 4 Dice  
  * **Labels:** Primary: \[Infiltrate\], \[Intel\] \| Secondary: \[Negotiate\]  
  * **Unique Power (Ghost Protocol):** If an \[Infiltrate\] stage is failed, Park can spend 2 Tokens to completely negate the failure penalty and force the team to move straight to the next stage.  
* **Kaelen "Echo" Cross**  
  * **Health:** 3 \| **Starting Dice Pool:** 5 Dice  
  * **Labels:** Primary: \[Infiltrate\], \[Intel\] \| Secondary: \[Negotiate\]  
  * **Unique Power (Target Acquired):** Before anyone rolls on a \[Combat\] or \[Intel\] stage, Cross can lock onto a target. All characters rolling in Phase 1 or Phase 2 score successes on a 4+ regardless of their label limitations for this stage.  
* **Vesper "Nyx" Gray**  
  * **Health:** 3 \| **Starting Dice Pool:** 5 Dice  
  * **Labels:** Primary: \[Infiltrate\], \[Intel\] \| Secondary: \[Negotiate\]  
  * **Unique Power (Shadow Siphon):** When Vesper rolls a natural 6 on an \[Infiltrate\] stage, she can choose to forgo gaining a Token to instead steal 1 Credit from a deployed teammate's character sheet.

### **6.6 Diplomat Class**

*Class Active Ability:* **Bribe/Leverage** — Spend 2 Tokens to automatically buy 1 success on a **\[Negotiate\]** or **\[Infiltrate\]** stage without rolling dice.

* **Soren de Witt**  
  * **Health:** 3 \| **Starting Dice Pool:** 4 Dice  
  * **Labels:** Primary: \[Negotiate\], \[Operations\] \| Secondary: \[Infiltrate\]  
  * **Unique Power (Double Agent):** During a \[Negotiate\] or \[Infiltrate\] stage, Soren can spend 1 Token to copy the unique power of an unselected character currently resting on the Home Base roster bench for this stage only.  
* **Aisha Rahman**  
  * **Health:** 4 \| **Starting Dice Pool:** 3 Dice  
  * **Labels:** Primary: \[Negotiate\], \[Operations\] \| Secondary: \[Infiltrate\]  
  * **Unique Power (Truce):** Once per mission, before Phase 1 Initiative rolls begin on a \[Negotiate\] or \[Combat\] stage, Aisha can spend 3 Tokens to automatically resolve and clear the stage successfully. No rewards are gained, but no dice are rolled, eliminating injury risk.  
* **Consul Thaddeus Finch**  
  * **Health:** 3 \| **Starting Dice Pool:** 4 Dice  
  * **Labels:** Primary: \[Negotiate\], \[Operations\] \| Secondary: \[Infiltrate\]  
  * **Unique Power (Extortionist):** When another player proposes a Credit trade or a slot buyout during the Base Phase, Finch can force that player to pay an additional \$+1\$ VP fee directly to his score track to finalize the deal.

## **🏬 SECTION 7: BASE UPGRADES & SHARED ARMORY VAULT**

### **7.1 Base Facility Upgrades & Costs**

During the Base Phase, players can spend their earned Credits to construct or upgrade Home Base facilities. Contributing to base upgrades awards the contributing player individual Victory Points based on their investment:

┌───────────────────────────────┬─────────────┬────────────────────────────────────────────┬─────────────┐  
│ FACILITY UPGRADE              │ CREDIT COST │ TEAM PASSIVE PERK                          │ ARCT. BONUS │  
├───────────────────────────────┼─────────────┼────────────────────────────────────────────┼─────────────┤  
│ Trauma Ward (Medical T1)      │ 6 Credits   │ Reroll one result of a 1-2 on Chart.       │ \+3 VPs      │  
│ Rehab Lab (Medical T2)        │ 10 Credits  │ Spend 3 tokens to erase a Perm Injury.     │ \+3 VPs      │  
│ Cybernetic Lab (Medical T3)   │ 16 Credits  │ Spend 5 Credits to remove a trauma trait.  │ \+4 VPs      │  
│ Mod Assembly (Armory T1)      │ 8 Credits   │ Unlocks "Mod Slots" on Weapons.            │ \+3 VPs      │  
│ Supply Network (Armory T2)    │ 12 Credits  │ Spend 2 tokens mid-mission to draw gear.│ \+3 VPs      │  
│ Prototype Foundry (Armory T3) │ 18 Credits  │ Treat natural 1s as standard failures once.│ \+4 VPs      │  
│ Cross-Training (Training T1)  │ 8 Credits   │ Pay credit fee to add a Secondary Label.   │ \+3 VPs      │  
│ Peak Conditioning (Training T2)│ 14 Credits │ Increase max HP by \+1 or starting pool \+1. │ \+3 VPs      │  
│ Agency HQ (Training T3)       │ 20 Credits  │ Token sheet storage cap raised from 5 to 7.│ \+5 VPs      │  
└───────────────────────────────┴─────────────┴────────────────────────────────────────────┴─────────────┘

### **7.2 Shared Armory Vault**

#### **Weapons**

* **Standard Issue Carbine (Weapon Slot):** *Combat stages only.* When scoring a success on a combat die, roll an additional "booster" die. This booster die scores a success on a 4+, but causes 1 Backfire damage on a natural 1\.  
* **Plasma Incinerator (Weapon Slot):** *Combat stages only.* When rolling a success on a combat die, you may intentionally choose to take 1 Backfire damage to convert that single success into \$+3\$ total successes toward the Difficulty Rating.

#### **Armor**

* **Hazard Aegis (Armor Slot):** Increases the character's maximum health cap by \$+1\$. Once per mission, completely ignore 1 point of Backfire damage caused by a Survival or Operations roll.  
* **Titanium Exosuit (Armor Slot):** Increases maximum health cap by \$+2\$. The character's starting dice pool is permanently reduced by \$-1\$ die while this item is equipped.

#### **Specialty Devices**

* **Omni-Tool Splicer (Specialty Device Slot):** *Operations stages only.* Once per mission, you may reroll any dice that resulted in a Backfire (1 or 2\) during the Support Phase.  
* **Neural Link Uplink (Specialty Device Slot):** *Intel and Operations stages only.* Once per mission, you can pay 2 Credits to look at the top card of the mission deck mid-stage, then choose to place it on the bottom of the deck.

#### **Consumables**

* **Vapor-Medkit (Consumable Slot — 1 Use):** Activate during the Base Phase to automatically bypass the Aftermath Injury Cycle roll for one missing health point, guaranteeing a Clean Healing result.  
* **Adrenaline Injector (Consumable Slot — 1 Use):** Discard mid-stage to instantly reset a character's exhausted dice pool, allowing them to participate in Phase 2 Initiative (Support Phase) with their maximum starting dice pool volume.

## **🗺️ SECTION 8: PROTOTYPE CAMPAIGN MODEL**

### **8.1 Macro Metrics: "Operation: Red Mercury"**

* **Act I Progress Threshold:** Reach 3 Progress Points to unlock the Story Operation: *The Obsidian Vault*.  
* **Campaign Doom Tracker Max:** 6 Doom Points. Reaching 6 instantly triggers the Final Stand Scenario: *The Last Stand*\[cite: 2\].

### **8.2 Available Side Operations**

#### **Side Operation A: Reconnaissance Grid Echo (Tier I — Easy)**

* **Composition Gating:** Requires \$\\ge 1\$ \[Infiltrate\] and \$\\ge 1\$ \[Intel\] label across the squad. Must deploy exactly 4 characters.  
* **Stage 1:** \[Infiltrate\] — Ghost Run (Difficulty: 3\)  
* **Stage 2:** \[Intel\] — Data Download (Difficulty: 3\)  
* **Bounties:** \$+1\$ Progress Point, 1x Universal Token allocated to the clearing character sheet.

#### **Side Operation B: Border Outpost Raid (Tier I — Easy)**

* **Composition Gating:** Requires \$\\ge 2\$ \[Combat\] and \$\\ge 1\$ \[Survival\] label across the squad. Must deploy exactly 4 characters.  
* **Stage 1:** \[Combat\] — Breach and Clear (Difficulty: 3\)  
* **Stage 2:** \[Survival\] — Toxic Fallout Run (Difficulty: 2\)  
* **Bounties:** \$+1\$ Progress Point, 1x Standard Issue Carbine added to Base Armory.

### **8.3 Core Story Operations**

#### **Story Operation: The Obsidian Vault (Act I Core Mission — Tier II — Hard)**

* **Composition Gating:** Requires \$\\ge 2\$ \[Operations\] labels, \$\\ge 2\$ \[Combat\] labels, and \$\\ge 1\$ \[Negotiate\] label across the squad. Must deploy exactly 4 characters.  
* **Stage 1: Perimeter Approach — \[Infiltrate\] (Difficulty: 5\)**  
  * *Stage Modifier (Laser Grid):* Any character who rolls a Backfire (1 or 2\) during the Support Phase takes 2 points of damage instead of 1\.  
* **Stage 2: Outer Vault Terminal — \[Operations\] (Difficulty: 5\)**  
  * *Stage Modifier (Security Lockout):* If this stage fails, instantly advance the global Doom Tracker by \$+2\$\[cite: 2\].  
* **Stage 3: Vault Interior Intercept — \[Combat\] (Difficulty: 6\)**  
  * *Stage Modifier (Heavy Enforcers):* The Specialist success threshold is raised from a 3+ to a 4+ for this stage.  
  * *Credit Interaction:* A player may spend **3 Credits** from their character sheet during the Briefing Step to bribe an inside asset, bypassing the Stage Modifier entirely and reducing the Specialist success threshold back to 3+.  
* **Stage 4: Corrupt Overseer — \[Negotiate\] (Difficulty: 4\)**  
  * *Stage Modifier (High Stakes):* Overkill success yields a unique permanent Base Artifact item: *Alien Datacore*.  
  * *Credit Interaction:* The team may collectively spend **4 Credits** from their active sheets to bypass this stage's dice-rolling sequence entirely by buying off the Overseer. No Overkill rewards are gained, but the stage is marked as cleared with zero injury risk.

#### **Elite Operation: Citadel Apex (Endgame Mission — Tier III — Elite)**

* **Composition Gating:** Requires \$\\ge 3\$ \[Combat\] labels, \$\\ge 2\$ \[Operations\] labels, and \$\\ge 2\$ \[Intel\] labels across the squad. Must deploy exactly 4 characters.  
* **Stage 1: Atmospheric Entry — \[Survival\] (Difficulty: 6\)**  
  * *Stage Modifier (Flak Fire):* Extreme hazard window. Characters acting during Phase 1 Initiative take Backfire damage on a 1 or 2\. Characters acting during Phase 2 Support take Backfire damage on a 1, 2, or 3\.  
* **Stage 2: Mainframe Decryption — \[Intel\] (Difficulty: 6\)**  
  * *Stage Modifier (AI Counter-Measure):* Tech lockout. All Specialty Devices are suppressed and cannot be triggered during this stage.  
* **Stage 3: Reactor Core Sabotage — \[Operations\] (Difficulty: 7\)**  
  * *Stage Modifier (Meltdown Imminent):* Strict countdown. If the team does not clear this stage on Phase 1 Initiative (Specialists), the global Doom Tracker instantly advances by \$+2\$.  
  * *Credit Interaction:* A player can spend **5 Credits** during the briefing to activate an auxiliary cooling line, reducing the baseline Difficulty Rating from 7 down to 5\.  
* **Stage 4: Dreadnought Commander — \[Combat\] (Difficulty: 8\)**  
  * *Stage Modifier (The Last Stand):* Sudden death parameters. Overkill clearance rewards the clearing characters with \$+3\$ Loyalty and a unique campaign victory token worth an immediate \$+5\$ VPs on their personal player track.

## **📊 SECTION 9: EXTENDED EXAMPLE OF PLAY**

### **9.1 Phase 1: The Base Phase (The 3-Player Vanguard Auction)**

Three players are running a campaign of **Away Team**. They select **Side Operation B: Border Outpost Raid**.

* **Gating Check:** The mission requires \$\\ge 2\$ \[Combat\] and \$\\ge 1\$ \[Survival\] labels.

Each player assigns their first mandatory character slot:

* **Player 1** assigns **Sarah "Specter" Croft** (Soldier: \[Combat\] / \[Survival\] Primaries).  
* **Player 2** assigns **Dr. Aris Thorne** (Scientist: \[Intel\] / \[Survival\] Primaries).  
* **Player 3** assigns **Apex** (Engineer: \[Operations\] / \[Intel\] Primaries).

Slot 4 is the Unassigned Vanguard Slot. An auction is triggered:

* Player 1 bids 1 VP.  
* Player 2 passes.  
* Player 3 bids 3 VPs.  
* Player 3 wins the auction, deducting 3 VPs from their scoring track. Player 3 double-deploys by assigning **Commander Garret Vance** (Officer: \[Combat\] / \[Negotiate\] Primaries) from their personal stash into Slot 4\.

### **9.2 Phase 2: The Mission Phase (Stage 1 Resolution)**

The players reveal **Stage 1: Breach and Clear — \[Combat\] Stage (Difficulty: 5\)**.

#### **Step A: Phase 1 Initiative (The Specialists)**

Sarah Croft (Player 1\) and Commander Vance (Player 3\) both have \[Combat\] as a Primary Label and act first.

* **Bargaining:** Sarah Croft has a unique power, *Tactical Flank*, which allows her to skip Phase 1 and act during Step C (Post-Initiative). She turns to Player 3: *"I will skip my Phase 1 turn to evaluate the pool at the end, minimizing my injury risk. If you spend your Officer token to use your class ability to support yourself, I will trade you 1 Credit from my sheet during the next Base Phase."* Player 3 agrees.  
* Commander Vance commits all 3 of his available dice. He rolls a **1, 4, and 5**.  
  * **Successes:** As a Primary Specialist, Vance scores successes on a **3+**. The 4 and 5 count as **2 successes**.  
  * **Backfire:** Vance rolled a natural **1**, taking 1 point of damage.  
  * **Primary Label Passive:** Vance's Officer passive (*Fire Discipline*) allows him to reroll one failure face that isn't a 1\. He rerolls the **4** and throws a **6**\! Vance now sits at **3 successes** total.

The stage requires 5 successes. 2 are still missing. We move to Phase 2\.

#### **Step B: Phase 2 Initiative (The Support)**

Apex (Player 3: \[Combat\] Secondary) and Dr. Thorne (Player 2: No Combat relation) must step up.

* **The Roll:** Apex commits 2 of his 4 dice. He throws a **2 and 4**.  
  * **Successes:** As a Secondary Label support character, Apex hits on a **4+**. His 4 counts as **1 success** (Team is at 4/5 successes).  
  * **Backfire:** He threw a 2, which triggers damage in the Support Phase.  
  * **Secondary Label Passive:** Apex resolves his \[Combat\] secondary passive (*Suppressive Fire*). Because he rolled at least one success, he shields Commander Vance from the 1 damage Vance sustained in Phase 1\! Vance's health track is restored to full. Apex takes 1 damage from his own rolled 2\.  
* Dr. Thorne chooses to commit 0 dice to avoid the high-risk Support Phase backfire window.

#### **Step C: Post-Initiative Phase**

The team is short by exactly 1 success. Sarah Croft's *Tactical Flank* now triggers. She evaluates the margin and cleanly commits 2 of her 5 dice.

* She rolls a **3 and 5**.  
* Both dice provide **successes** (total team successes: 6/5). The stage is successfully cleared.

#### **Step D: Stage Aftermath**

Because Croft contributed the final success to clear the stage, she immediately earns **\$+1\$ Loyalty (The Closer)**. Furthermore, because the team reached 6 successes against a Difficulty of 5, they triggered an Overkill victory on a \[Combat\] stage. The **Spoils of War** bonus triggers: \$+2\$ Credits are pulled from the bank and added directly to the active sheets of the contributing squad members.

### **9.3 Phase 3: The Aftermath Phase (The Dice Attrition Bonus)**

The mission concludes successfully. The players calculate the final **Dice Attrition Bonus** by counting total dice rolled across the mission:

* Sarah Croft (Player 1): 2 dice.  
* Dr. Thorne (Player 2): 0 dice.  
* Apex (Player 3): 2 dice.  
* Commander Vance (Player 3): 3 dice.

**Tally:** Player 3 rolled a total of 5 dice across their two characters. Player 1 rolled 2 dice. Player 2 rolled 0 dice.  
**The Payout:** Player 3 is the clear winner, earning **\$+2\$ Loyalty** on their track. Player 1 is the mid-roller, earning **\$+1\$ Loyalty**. Player 2 is the low-roller, earning **\$0\$ Loyalty** for rolling the least. All players convert their final scores, heal their veterans, and begin trading assets for the next layout.