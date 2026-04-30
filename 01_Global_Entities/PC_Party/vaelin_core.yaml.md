---
name: Vaelin Core Loadout
character: Vaelin Shadowleaf
type: character_loadout
domain: core
summary: "This file contains Vaelin's base physical and mental attributes, health, and learned proficiencies."
last_updated: 2026-04-30T14:23:43-05:00
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
    unarmored_bonus: 10.   # only applies when NOT wearing armor or using a shield
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
  str: 8
  dex: 16
  con: 10
  int: 12
  wis: 13
  cha: 17
proficiencies:
  saving_throws:
    - dex
    - cha
  skills:
    _override_notes: "Jack of All Trades: Add +1 (half prof) to any skill not listed as Prof/Expert."
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
    tax_rate: 4           # gestalt tax
    gross_earned: 2100    # total amount awarded by DM
    net_earned: 525       # xp used to determine level progression
class_features:
  eyes_of_night: true         # 300 ft darkvision
  jack_of_all_trades: true    # adds half proficiency bonus to non-proficient skills
---

# Vaelin's Core Attributes

> [!SYSTEM DIRECTIVE]
> **For the AI Dungeon Master:** This file represents the "Who & How" domain. It contains Vaelin's base physical and mental attributes, health, and learned proficiencies.
>
> **When to reference this file:**
> * **Skill Checks & Saving Throws:** To find Vaelin's ability modifiers, proficiencies, or expertise when resolving an action.
> * **Taking Damage & Healing:** To reference his current and maximum hit points (`hp_current` / `hp_max`).
> * **Base Combat Stats:** To check his base Armor Class, Initiative modifier, Movement Speed, or passive senses (Darkvision/Blindsight) before the start of an encounter.
> 
> **State Tracking Note:** The values in `vitals` (such as HP and hit dice) are actively modified during gameplay via remote dashboard tools. Always treat the numbers here as current.
