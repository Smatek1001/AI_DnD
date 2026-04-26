---
name: Gestalt Rogue-Sorlock
type: custom_class
tags: [class, gestalt, mechanics]
last_session: 0
homebrew: true
last_updated: "2026-04-25T14:33:49-05:00"
summary: "Vaelin's custom 'Gestalt' progression rules, combining Rogue, Sorcerer, and Warlock features into a unified leveling system with a shared spell slot mechanic and a 4x XP tax."
---

> [!SYSTEM DIRECTIVE]
> **For the AI Dungeon Master:** Vaelin uses a highly customized "Gestalt" progression system. DO NOT apply standard multiclassing rules.
> 1. He levels up in Rogue, Sorcerer, and Warlock simultaneously, but only gains the Hit Dice and proficiency bonus of a single class.
> 2. He uses a unified "Sorlock" spellcasting system: All known spells can be cast using either Warlock Pact slots or Sorcerer spell slots.
> 3. He requires exactly 4x the standard XP to advance a level.
> You must rely STRICTLY on the JSON progression table below for all leveling mechanics and feature acquisition.

```json
{
  "_rules": {
    "theme": "Operative for a secret society trained in espionage, possessing innate Fey magic corrupted by an Aberrant entity from the Far Realm.",
    "xp_tax": "Requires 4x standard XP to advance a level. Track total earned XP vs 1/4 XP to calculate against the standard advancement table.",
    "spellcasting_rule": "All known spells can be cast with either Warlock Pact slots or Sorcerer spell slots. All known spells are considered Sorlock spells."
  },
  "core_traits": {
    "primary_ability": ["Dexterity", "Charisma"],
    "hit_dice": "1d8",
    "hp_at_level_1": "8 + Con modifier",
    "hp_higher_levels": "8 + Con modifier",
    "saving_throws": ["Dex", "Cha"],
    "skill_proficiencies_granted": 4,
    "armor_training": ["Light armor"],
    "weapons": ["Simple Weapons", "Martial weapons (Finesse or Light)"],
    "tools": ["Thieves' Tools"],
    "starting_equipment_gp": 250
  },
  "progression": [
    {
      "level": 1,
      "xp_required": 0,
      "prof_bonus": 2,
      "sneak_attack": "1d8",
      "sorcery_points": 0,
      "eldritch_blast_beams": 1,
      "unarmored_movement_bonus_ft": 0,
      "magic": {
        "sorcery": { "cantrips": 4, "prepared_spells": 2, "slots": [2, 0, 0, 0, 0, 0, 0, 0, 0] },
        "pact": { "cantrips": 2, "prepared_spells": 2, "slots": 1, "slot_level": 1 },
        "invocations": 1
      },
      "features": ["Expertise", "Sneak Attack", "Thieves' Cant", "Weapon Mastery", "Spellcasting", "Innate Sorcery", "Eldritch Invocations", "Pact Magic", "Eldritch Invocation Options", "Eyes of Night (Twilight Cleric)"]
    },
    {
      "level": 2,
      "xp_required": 300,
      "prof_bonus": 2,
      "sneak_attack": "1d8",
      "sorcery_points": 2,
      "eldritch_blast_beams": 1,
      "unarmored_movement_bonus_ft": 10,
      "magic": {
        "sorcery": { "cantrips": 4, "prepared_spells": 4, "slots": [3, 0, 0, 0, 0, 0, 0, 0, 0] },
        "pact": { "cantrips": 2, "prepared_spells": 3, "slots": 2, "slot_level": 1 },
        "invocations": 3
      },
      "features": ["Cunning Action", "Font of Magic", "Metamagic", "Metamagic Options", "Magical Cunning", "Action Surge (Fighter)", "Expertise", "Jack of All Trades (Bard)", "Unarmored Movement (Monk)"]
    },
    {
      "level": 3,
      "xp_required": 900,
      "prof_bonus": 2,
      "sneak_attack": "2d8",
      "sorcery_points": 3,
      "eldritch_blast_beams": 1,
      "unarmored_movement_bonus_ft": 10,
      "magic": {
        "sorcery": { "cantrips": 4, "prepared_spells": 6, "slots": [4, 2, 0, 0, 0, 0, 0, 0, 0] },
        "pact": { "cantrips": 2, "prepared_spells": 4, "slots": 2, "slot_level": 2 },
        "invocations": 3
      },
      "features": ["Steady Aim", "Fast Hands (Thief Rogue)", "Second-Story Work (Thief Rogue)", "Mage Hand Legerdemain (Arcane Trickster Rogue)", "Ear for Deceit (Inquisitive Rogue)", "Eye for Detail (Inquisitive Rogue)", "Master of Intrigue (Mastermind Rogue)", "Psionic Spells", "Telepathic Speech", "Eyes of the Dark", "Strength of the Grave", "Archfey Spells", "Steps of the Fey", "GOO Spells", "Awakened Mind", "Psychic Spells", "Silver Tongue (Eloquence Bard)", "Shadow Arts (Shadow Monk)", "Umbral Sight (Gloomstalker Ranger)"]
    },
    {
      "level": 4,
      "xp_required": 2700,
      "prof_bonus": 2,
      "sneak_attack": "2d8",
      "sorcery_points": 4,
      "eldritch_blast_beams": 1,
      "unarmored_movement_bonus_ft": 10,
      "magic": {
        "sorcery": { "cantrips": 5, "prepared_spells": 7, "slots": [4, 3, 0, 0, 0, 0, 0, 0, 0] },
        "pact": { "cantrips": 3, "prepared_spells": 5, "slots": 2, "slot_level": 2 },
        "invocations": 3
      },
      "features": ["ASI"]
    },
    {
      "level": 5,
      "xp_required": 6500,
      "prof_bonus": 3,
      "sneak_attack": "3d8",
      "sorcery_points": 5,
      "eldritch_blast_beams": 2,
      "unarmored_movement_bonus_ft": 10,
      "magic": {
        "sorcery": { "cantrips": 5, "prepared_spells": 9, "slots": [4, 3, 2, 0, 0, 0, 0, 0, 0] },
        "pact": { "cantrips": 3, "prepared_spells": 6, "slots": 2, "slot_level": 3 },
        "invocations": 5
      },
      "features": ["Cunning Strike", "Uncanny Dodge", "Sorcerous Restoration"]
    },
    {
      "level": 6,
      "xp_required": 14000,
      "prof_bonus": 3,
      "sneak_attack": "3d8",
      "sorcery_points": 6,
      "eldritch_blast_beams": 2,
      "unarmored_movement_bonus_ft": 15,
      "magic": {
        "sorcery": { "cantrips": 5, "prepared_spells": 10, "slots": [4, 3, 3, 0, 0, 0, 0, 0, 0] },
        "pact": { "cantrips": 3, "prepared_spells": 7, "slots": 2, "slot_level": 3 },
        "invocations": 5
      },
      "features": ["Expertise", "Psionic Sorcery", "Psionic Defenses", "Hound of Ill Omen", "Misty Escape", "Clairvoyant Combatant", "ASI", "Shadow Step (Shadow Monk)", "Unfettered Mind (Knowledge Cleric)", "Steps of Night (Twilight Cleric)"]
    },
    {
      "level": 7,
      "xp_required": 23000,
      "prof_bonus": 3,
      "sneak_attack": "4d8",
      "sorcery_points": 7,
      "eldritch_blast_beams": 2,
      "unarmored_movement_bonus_ft": 15,
      "magic": {
        "sorcery": { "cantrips": 5, "prepared_spells": 11, "slots": [4, 3, 3, 1, 0, 0, 0, 0, 0] },
        "pact": { "cantrips": 3, "prepared_spells": 8, "slots": 2, "slot_level": 4 },
        "invocations": 6
      },
      "features": ["Evasion", "Reliable Talent", "Sorcery Incarnate"]
    },
    {
      "level": 8,
      "xp_required": 34000,
      "prof_bonus": 3,
      "sneak_attack": "4d8",
      "sorcery_points": 8,
      "eldritch_blast_beams": 2,
      "unarmored_movement_bonus_ft": 15,
      "magic": {
        "sorcery": { "cantrips": 5, "prepared_spells": 12, "slots": [4, 3, 3, 2, 0, 0, 0, 0, 0] },
        "pact": { "cantrips": 3, "prepared_spells": 9, "slots": 2, "slot_level": 4 },
        "invocations": 6
      },
      "features": ["ASI"]
    },
    {
      "level": 9,
      "xp_required": 48000,
      "prof_bonus": 4,
      "sneak_attack": "5d8",
      "sorcery_points": 9,
      "eldritch_blast_beams": 2,
      "unarmored_movement_bonus_ft": 15,
      "magic": {
        "sorcery": { "cantrips": 5, "prepared_spells": 14, "slots": [4, 3, 3, 3, 1, 0, 0, 0, 0] },
        "pact": { "cantrips": 3, "prepared_spells": 10, "slots": 2, "slot_level": 5 },
        "invocations": 7
      },
      "features": ["Supreme Sneak (Thief Rogue)", "Contact Patron", "Expertise", "Acrobatic Movement (Monk)"]
    },
    {
      "level": 10,
      "xp_required": 64000,
      "prof_bonus": 4,
      "sneak_attack": "5d8",
      "sorcery_points": 10,
      "eldritch_blast_beams": 2,
      "unarmored_movement_bonus_ft": 20,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 15, "slots": [4, 3, 3, 3, 2, 0, 0, 0, 0] },
        "pact": { "cantrips": 4, "prepared_spells": 10, "slots": 2, "slot_level": 5 },
        "invocations": 7
      },
      "features": ["ASI", "Metamagic", "Beguiling Defenses", "Eldritch Hex", "Thought Shield (GOO Warlock)"]
    },
    {
      "level": 11,
      "xp_required": 85000,
      "prof_bonus": 4,
      "sneak_attack": "6d8",
      "sorcery_points": 11,
      "eldritch_blast_beams": 3,
      "unarmored_movement_bonus_ft": 20,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 16, "slots": [4, 3, 3, 3, 2, 1, 0, 0, 0] },
        "pact": { "cantrips": 4, "prepared_spells": 11, "slots": 3, "slot_level": 5 },
        "invocations": 7
      },
      "features": ["Improved Cunning Strike", "Mystic Arcanum", "Cloak of Shadows (Shadow Monk)"]
    },
    {
      "level": 12,
      "xp_required": 100000,
      "prof_bonus": 4,
      "sneak_attack": "6d8",
      "sorcery_points": 12,
      "eldritch_blast_beams": 3,
      "unarmored_movement_bonus_ft": 20,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 16, "slots": [4, 3, 3, 3, 2, 1, 0, 0, 0] },
        "pact": { "cantrips": 4, "prepared_spells": 11, "slots": 3, "slot_level": 5 },
        "invocations": 8
      },
      "features": ["ASI"]
    },
    {
      "level": 13,
      "xp_required": 120000,
      "prof_bonus": 5,
      "sneak_attack": "7d8",
      "sorcery_points": 13,
      "eldritch_blast_beams": 3,
      "unarmored_movement_bonus_ft": 20,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 17, "slots": [4, 3, 3, 3, 2, 1, 1, 0, 0] },
        "pact": { "cantrips": 4, "prepared_spells": 12, "slots": 3, "slot_level": 5 },
        "invocations": 8
      },
      "features": ["Use Magic Device (Thief Rogue)", "Ghost Walk (Phantom Rogue)", "Mystic Arcanum"]
    },
    {
      "level": 14,
      "xp_required": 140000,
      "prof_bonus": 5,
      "sneak_attack": "7d8",
      "sorcery_points": 14,
      "eldritch_blast_beams": 3,
      "unarmored_movement_bonus_ft": 25,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 17, "slots": [4, 3, 3, 3, 2, 1, 1, 0, 0] },
        "pact": { "cantrips": 4, "prepared_spells": 12, "slots": 3, "slot_level": 5 },
        "invocations": 8
      },
      "features": ["Devious Strikes", "Revelation in Flesh", "Shadow Walk (Shadow Sorcerer)", "Bewitching Magic", "Create Thrall", "ASI", "Flight"]
    },
    {
      "level": 15,
      "xp_required": 165000,
      "prof_bonus": 5,
      "sneak_attack": "8d8",
      "sorcery_points": 15,
      "eldritch_blast_beams": 3,
      "unarmored_movement_bonus_ft": 25,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 18, "slots": [4, 3, 3, 3, 2, 1, 1, 1, 0] },
        "pact": { "cantrips": 4, "prepared_spells": 13, "slots": 3, "slot_level": 5 },
        "invocations": 9
      },
      "features": ["Slippery Mind", "Mystic Arcanum", "Shadowy Dodge (Gloomstalker Ranger)"]
    },
    {
      "level": 16,
      "xp_required": 195000,
      "prof_bonus": 5,
      "sneak_attack": "8d8",
      "sorcery_points": 16,
      "eldritch_blast_beams": 3,
      "unarmored_movement_bonus_ft": 25,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 18, "slots": [4, 3, 3, 3, 2, 1, 1, 1, 0] },
        "pact": { "cantrips": 4, "prepared_spells": 13, "slots": 3, "slot_level": 5 },
        "invocations": 9
      },
      "features": ["ASI"]
    },
    {
      "level": 17,
      "xp_required": 225000,
      "prof_bonus": 6,
      "sneak_attack": "9d8",
      "sorcery_points": 17,
      "eldritch_blast_beams": 4,
      "unarmored_movement_bonus_ft": 25,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 19, "slots": [4, 3, 3, 3, 2, 1, 1, 1, 1] },
        "pact": { "cantrips": 4, "prepared_spells": 14, "slots": 4, "slot_level": 5 },
        "invocations": 9
      },
      "features": ["Thief's Reflexes (Thief Rogue)", "Soul of Deceit (Mastermind Rogue)", "Metamagic", "Mystic Arcanum", "Action Surge (Fighter)", "Improved Cloak of Shadows (Shadow Monk)"]
    },
    {
      "level": 18,
      "xp_required": 265000,
      "prof_bonus": 6,
      "sneak_attack": "9d8",
      "sorcery_points": 18,
      "eldritch_blast_beams": 4,
      "unarmored_movement_bonus_ft": 30,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 20, "slots": [4, 3, 3, 3, 3, 1, 1, 1, 1] },
        "pact": { "cantrips": 4, "prepared_spells": 14, "slots": 4, "slot_level": 5 },
        "invocations": 10
      },
      "features": ["Elusive", "Warping Implosion", "Umbral Form (Shadow Sorcerer)"]
    },
    {
      "level": 19,
      "xp_required": 305000,
      "prof_bonus": 6,
      "sneak_attack": "10d8",
      "sorcery_points": 19,
      "eldritch_blast_beams": 4,
      "unarmored_movement_bonus_ft": 30,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 21, "slots": [4, 3, 3, 3, 3, 2, 1, 1, 1] },
        "pact": { "cantrips": 4, "prepared_spells": 15, "slots": 4, "slot_level": 5 },
        "invocations": 10
      },
      "features": ["Epic Boon"]
    },
    {
      "level": 20,
      "xp_required": 355000,
      "prof_bonus": 6,
      "sneak_attack": "10d8",
      "sorcery_points": 20,
      "eldritch_blast_beams": 4,
      "unarmored_movement_bonus_ft": 30,
      "magic": {
        "sorcery": { "cantrips": 6, "prepared_spells": 22, "slots": [4, 3, 3, 3, 3, 2, 2, 1, 1] },
        "pact": { "cantrips": 4, "prepared_spells": 15, "slots": 4, "slot_level": 5 },
        "invocations": 10
      },
      "features": ["Stroke of Luck", "Arcane Apotheosis", "Eldritch Master"]
    }
  ],
  "feature_definitions": {
    "Cunning Action": "Your quick thinking and agility allow you to move and act quickly. On your turn, you can take one of the following actions as a Bonus Action: Dash, Disengage, or Hide.",
    "Fast Hands (Thief Rogue)": "As a Bonus Action, you can do one of the following. Sleight of Hand. Make a Dexterity (Sleight of Hand) check to pick a lock or disarm a trap with Thieves' Tools or to pick a pocket. Use an Object. Take the Utilize action, or take the Magic action to use a magic item that requires that action.",
    "Second-Story Work (Thief Rogue)": "You've trained to get into especially hard-to-reach places. Climber. You gain a Climb Speed equal to your Speed. You can use Dexterity (Athletics) instead of Strength (Athletics) for Climbing checks. Jumper. You can determine your jump distance using your Dexterity rather than your Strength.",
    "Mage Hand Legerdemain (Arcane Trickster Rogue)": "When you cast Mage Hand, you can cast it as a Bonus Action, and you can make the spectral hand Invisible. You can control the hand as a Bonus Action, and through it, you can make Dexterity (Sleight of Hand) checks.",
    "Ear for Deceit (Inquisitive Rogue)": "Whenever you make a Wisdom (Insight) check to determine whether a creature is lying, treat a roll of 7 or lower on the d20 as an 8.",
    "Eye for Detail (Inquisitive Rogue)": "You can use a bonus action to make a Wisdom (Perception) check to spot a hidden creature or object or to make an Intelligence (Investigation) check to uncover or decipher clues.",
    "Master of Intrigue (Mastermind Rogue)": "You gain proficiency with the disguise kit, the forgery kit, and one gaming set of your choice. You also learn two languages of your choice. Additionally, you can unerringly mimic the speech patterns and accent of a creature that you hear speak for at least 1 minute, enabling you to pass yourself off as a native speaker of a particular land, provided that you know the language.",
    "Supreme Sneak (Thief Rogue)": "You gain the Stealth Attack (Cost: 1d6) Cunning Strike option. If you have the Hide action's Invisible condition, this attack doesn't end that condition on you if you end the turn behind Three-Quarters Cover or Total Cover.",
    "Use Magic Device (Thief Rogue)": "Attunement. You can attune to up to four magic items at once. Charges. Whenever you use a magic item property that expends charges, roll 1d6. On a roll of 6, you use the property without expending the charges. Scrolls. You can use any Spell Scroll, using Intelligence as your spellcasting ability for the spell. If the spell is a cantrip or a level 1 spell, you can cast it reliably. If the scroll contains a higher-level spell, you must first succeed on an Intelligence (Arcana) check (DC 10 plus the spell's level). On a successful check, you cast the spell from the scroll. On a failed check, the scroll disintegrates.",
    "Ghost Walk (Phantom Rogue)": "As a bonus action, you assume a spectral form for 10 minutes. While in this form, you have a flying speed of 10 feet, you can hover, and attack rolls have disadvantage against you. You can also move through creatures and objects as if they were difficult terrain, but you take 1d10 force damage if you end your turn inside a creature or an object. Once per long rest.",
    "Thief's Reflexes (Thief Rogue)": "You can take two turns during the first round of any combat. You take your first turn at your normal Initiative and your second turn at your Initiative minus 10.",
    "Soul of Deceit (Mastermind Rogue)": "Your thoughts can't be read by telepathy or other means, unless you allow it. You can present false thoughts by succeeding on a Charisma (Deception) check contested by the mind reader's Wisdom (Insight) check. Magic that would determine if you are telling the truth indicates you are being truthful if you so choose, and you can't be compelled to tell the truth by magic.",
    "Shadow Walk (Shadow Sorcerer)": "When you are in dim light or darkness, as a bonus action, you can magically teleport up to 120 feet to an unoccupied space you can see that is also in dim light or darkness.",
    "Umbral Form (Shadow Sorcerer)": "You can spend 6 sorcery points as a bonus action to magically transform yourself into a shadowy form for 1 minute. In this form, you have resistance to all damage except force and radiant damage, and you can move through other creatures and objects as if they were difficult terrain. You take 5 force damage if you end your turn inside an object.",
    "Thought Shield (GOO Warlock)": "Your thoughts can't be read by telepathy or other means unless you allow it. You also have resistance to psychic damage, and whenever a creature deals psychic damage to you, that creature takes the same amount of damage that you do.",
    "Eyes of Night (Twilight Cleric)": "You have darkvision out to a range of 300 feet. In that radius, you can see in dim light as if it were bright light and in darkness as if it were dim light.",
    "Action Surge (Fighter)": "On your turn, you can take one additional action, except the Magic action. Once per Short or Long Rest. At level 17, twice before a rest but only once on a turn.",
    "Unarmored Movement (Monk)": "Your speed increases by 10 feet while you aren't wearing armor or wielding a Shield. This bonus increases when you reach certain levels.",
    "Jack of All Trades (Bard)": "You can add half your Proficiency Bonus (round down) to any ability check you make that uses a skill proficiency you lack and that doesn't otherwise use your Proficiency Bonus.",
    "Silver Tongue (Eloquence Bard)": "When you make a Charisma (Persuasion) or Charisma (Deception) check, you can treat a d20 roll of 9 or lower as a 10.",
    "Shadow Arts (Shadow Monk)": "You gain Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet.",
    "Umbral Sight (Gloomstalker Ranger)": "You gain Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet. While entirely in Darkness, you have the Invisible condition to any creature that relies on Darkvision to see you in that Darkness.",
    "Shadow Step (Shadow Monk)": "While entirely within Dim Light or Darkness, you can use a Bonus Action to teleport up to 60 feet to an unoccupied space you can see that is also in Dim Light or Darkness. You then have Advantage on the next melee attack you make before the end of the current turn.",
    "Unfettered Mind (Knowledge Cleric)": "You gain telepathy out to 60 feet. When you use this telepathy, you can simultaneously contact a number of creatures equal to your Charisma modifier. Additionally, you gain proficiency in Intelligence saving throws, or one ability in which you lack it if already proficient.",
    "Steps of Night (Twilight Cleric)": "As a bonus action when you are in dim light or darkness, you can magically give yourself a flying speed equal to your walking speed for 1 minute. You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
    "Acrobatic Movement (Monk)": "While you aren't wearing armor or wielding a Shield, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the movement.",
    "Cloak of Shadows (Shadow Monk)": "When you are in an area of dim light or darkness, you can use your action to become invisible. You remain invisible until you make an attack, cast a spell, or are in an area of bright light.",
    "Shadowy Dodge (Gloomstalker Ranger)": "When a creature makes an attack roll against you, you can take a Reaction to impose Disadvantage on that roll. Whether the attack hits or misses, you can then teleport up to 30 feet to an unoccupied space you can see.",
    "Improved Cloak of Shadows (Shadow Monk)": "When your Cloak of Shadows feature is active, you are Partially Incorporeal. You can move through occupied spaces (creatures and objects) as if they were Difficult Terrain. If you end your turn in such a space, you are shunted to the last unoccupied space you were in.",
    "Flight": "Fly speed equal to your walking speed and can Hover."
  }
}
```
