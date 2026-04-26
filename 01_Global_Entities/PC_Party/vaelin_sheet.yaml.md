---
name: Vaelin Shadowleaf
type: character_sheet
character_ref: "[[Vaelin_Shadowleaf]]"
tags: [mechanics, pc, sheet]
last_session: 1
last_updated: "2026-04-26T01:44:45-05:00"
---

```yaml
character_details:
  name: Vaelin Shadowleaf
  level: 1
  class: Gestalt Rogue-Sorlock (Rogue / Sorcerer / Warlock)
  race: Primal Elf
  background: Espionage Operative
  alignment: Neutral
  size: Medium (Height: 70 inches, Weight: 150 lbs)
  xp: 
    gross_earned_xp: 500
    net_taxed_xp: 125
    gestalt_tax_rate: 4

core_stats:
  armor_class: 15 # Studded Leather Armor (12) + Dex Mod (+3)
  initiative: +3
  speed: 40 ft # +10 unarmored movement
  proficiency_bonus: +2
  senses:
    darkvision: 300 ft # Class ability (lvl 1 Eyes of Night)
    blindsight: 10 ft # Skulker feat
  passives:
    perception: 13
    insight: 13
    investigation: 11

attributes: # Format: Score (Modifier) [Proficiency Flag]
  str: 8 (-1)
  dex: 16 (+3) [Proficient]
  con: 10 (+0)
  int: 12 (+1)
  wis: 13 (+1)
  cha: 17 (+3) [Proficient]

proficiencies:
  saving_throws: [Dexterity, Charisma]
  armor: [Light Armor]
  weapons: [Simple Weapons, Melee (Finesse and Light only)]
  tools: 
    - Disguise Kit (+5)
    - Forgery Kit
    - "Thieves' Tools [Expertise]"
  skills:
    - Acrobatics (+3)
    - Athletics (-1)
    - Deception (+3)
    - Insight (+1) [Expertise]
    - Perception (+1) [Expertise]
    - Persuasion (+3)
    - Sleight of Hand (+3)
    - Stealth (+7) [Expertise]
  languages: [Common, "Thieves' Cant", Elf, Sylvan, Undercommon]

features_and_traits:
  racial:
    - Fey Ancestry: Advantage on saving throws against being Charmed.
    - Trance: Immune to magical sleep. Can finish a Long Rest in 4 hours while remaining conscious.
    - Fey Step: Cast Misty Step as a bonus action. Uses equal proficiency bonus per long rest.
    - Shape-changer: Can alter physical appearance (same as E:FA Changeling). Not available until level 3.
  background:
    - "Feat: [[feat_skulker]]"
  rogue:
    - Sneak Attack: 1d6 extra damage once per turn on an attack with advantage or an adjacent ally (requires Finesse or Ranged weapon).
    - Weapon Mastery: Can use the mastery properties of specific weapons.
  warlock:
    - Eldritch Invocations: Pact of the Chain, Mask of Many Faces, Misty Visions

actions_and_attacks:
  weapons:
    - name: Rapier
      attack: +5 to hit
      damage: 1d8+3 Piercing
      range: Melee
      properties: [Finesse]
      mastery: Vex (Hitting a creature grants Advantage on next attack roll against it)
    - name: Short Sword
      attack: +5 to hit
      damage: 1d6+3 Piercing
      range: Melee
      properties: [Finesse, Light]
      mastery: Vex
    - name: Dagger
      attack: +5 to hit
      damage: 1d4+3 Piercing
      range: 20/60 ft
      properties: [Finesse, Light, Thrown]
      mastery: Nick (Can make the extra Light weapon attack as part of the initial Attack action instead of a Bonus Action)
    - name: Short Bow
      attack: +5 to hit
      damage: 1d6+3 Piercing
      range: 80/320 ft
      properties: [Ammunition, Two-Handed]
      mastery: Vex

magic:
  spellcasting_ability: Charisma
  spell_save_dc: 13
  spell_attack_bonus: +5
  resources:
    sorcery_points: { current: 2, max: 2 }
    spell_slots:
      pact_magic_lvl_1: { current: 2, max: 2 }
      sorcerer_lvl_1: { current: 4, max: 4 }
  spells_known:
    cantrips:
      - Control Flame
      - Create Bonfire
      - Mage Hand
      - Message
      - Minor Illusion
      - Prestidigitation
    level_1:
      - Comprehend Languages
      - Detect Magic
      - Disguise Self (Mask of Many Faces)
      - Feather Fall
      - Find Familiar (Pact of the Chain)
      - Identify
      - Silent Image (Misty Visions)
      - Illusory Script
      - Unseen Servant

current_status:
  hp: { current: 8, max: 8, temp: 0 }
  hit_dice: { available: 1, max: 1, size: "d8" }
  conditions: []
  exhaustion: 0

inventory:
  wealth: { cp: 0, sp: 0, ep: 0, gp: 150, pp: 0 }
  equipped_gear:
    - Studded Leather Armor
    - Rapier
    - Shortbow
    - Quiver
    - Amulet of Proof Against Detection and Location (Takes the form of a silver leaf.)
  consumables:
    - Arrows: 22
    - Daggers: 6
    - Rations: 5
    - Oil Flasks: 5
  backpack:
    - "Thieves' Tools"
    - Disguise Kit
    - Forgery Kit
```
