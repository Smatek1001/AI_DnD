---
name: Vaelin Core Loadout
character: Vaelin Shadowleaf
type: character_loadout
domain: core
summary: "This file contains Vaelin's base physical and mental attributes, health, and learned proficiencies."
last_updated: 2026-05-01T00:18:16-05:00
vitals:
  hp_current: 16
  hp_max: 16
  hp_temp: 0
  hit_dice_current: 2
  hit_dice_max: 2
  hit_dice_size: d8
  exhaustion: 0
combat_base:
  proficiency_bonus: 2
  armor_class: 15
  initiative: 3
  sneak_attack: 1d8
  speed:
    unarmored_bonus: 10    # only applies when NOT wearing armor or using a shield
    walk: 30
  active_masteries:
    weapon_1: Rapier
    weapon_2: Shortbow
  equipped_armor: Studded Leather
senses:
  _override_notes: "Skulker: Dim light does not impose disadvantage on Wisdom (Perception) checks relying on sight."
  darkvision: 300 ft # Eyes of Night
  blindsight: 10 ft  # Skulker
ability_scores:
  str: 8 (-1)
  dex: 16 (+3)
  con: 10 (+0)
  int: 12 (+1)
  wis: 13 (+1)
  cha: 17 (+3)
proficiencies:
  saving_throws:
    - dex
    - cha
  skills:
    _override_notes: "Jack of All Trades: You can add half your Proficiency Bonus (round down) to any ability check you make that uses a skill proficiency you lack and that doesn't otherwise use your Proficiency Bonus."
    acrobatics: Prof
    deception: Prof
    insight: Expert
    perception: Expert
    persuasion: Prof
    sleight_of_hand: Prof
    stealth: Expert
  tools:
    disguise_kit: Prof
    forgery_kit: Prof
    thieves_tools: Expert
  weapons:
    - Simple
    - Melee (Finesse and Light only)
  armor:
    - Light
  languages:
    - Common
    - Elf
    - Sylvan
    - "Thieves' Cant"
    - Undercommon
core_info:
  level: 2
  class: Gestalt Rogue-Sorlock
  race: Primal Elf
  background: Espionage Operative
  alignment: "Neutral"
  conditions: None
  experience:
    tax_rate: 4           # gestalt-class tax
    gross_earned: 2850    # total pre-tax amount awarded by DM
    net_earned: 712.5     # post-tax xp used to determine level progression
class_features:
  eyes_of_night: true         # 300 ft darkvision
  jack_of_all_trades: true    # adds half (round down) proficiency bonus to non-proficient skills
---

# Vaelin's Core Attributes

> [!SYSTEM DIRECTIVE]
> **For the AI Dungeon Master:** This file represents the "Who & How" domain. It contains Vaelin's base physical and mental attributes, health, and learned proficiencies.
>
> **When to reference this file:**
> * **Skill Checks & Saving Throws:** To find Vaelin's ability modifiers, proficiencies, or expertise when resolving an action.
> * **Taking Damage & Healing:** To reference his current and maximum hit points (`hp_current` / `hp_max`).
> * **Base Combat Stats:** To check his base Armor Class, Initiative modifier, Movement Speed, or passive senses (Darkvision/Blindsight) before the start of an encounter.
