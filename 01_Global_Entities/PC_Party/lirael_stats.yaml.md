---
name: Lirael
character: Lirael
type: monster_stat_block
homebrew: true
tags: [familiar, mechanics]
summary: "This file contains the mechanical combat block and state tracking for Lirael"
last_updated: 2026-04-30T14:24:27-05:00
character_ref: "[[Lirael]]"
vitals:
  hp_current: 10
  hp_max: 10
  hit_dice_current: 4
  hit_dice_max: 4
  hit_dice_size: d4
state:
  form: Winged Nymph
  status: Active
  is_invisible: false
core_stats:
  ac: 15
  base_speed: 10 ft., fly 40 ft.
  attributes:
    str: 3 (-4)
    dex: 18 (+4)
    con: 10 (+0)
    int: 14 (+2)
    wis: 13 (+1)
    cha: 14 (+2)
  size: Tiny
  type: Fey
  alignment: "Chaotic Neutral"
skills_and_senses:
  skills:
    - Stealth +8
    - Perception +3
  senses: Passive Perception 13
  languages: Common, Sylvan, Elvish, Goblin. Telepathy.
actions_allowed:
  - Dash
  - Disengage
  - Dodge
  - Help
  - Hide
  - Magic
custom_abilities:
  - name: Default Invisibility
    type: Passive
    description: Lirael is naturally invisible unless she chooses to reveal herself, casts a spell, or loses concentration.
  - name: Fey Step
    type: Bonus Action
    description: Teleports up to 30 feet to an unoccupied space she can see.
  - name: Pixie Dust Form
    type: Action
    description: Transforms into a mote of pixie dust. Can move through spaces as narrow as 1 inch without squeezing.
  - name: Audio Mimicry
    type: Action
    description: Can imitate voices and sounds flawlessly.
  - name: Innate Spellcasting
    spells:
      - Prestidigitation
shapeshifting_forms:
  - form: Owl
    speed: Fly 60 ft.
    senses: Darkvision 120ft, Advantage on Perception (Sight/Hearing)
    traits: "Flyby (Provokes no opportunity attacks when flying out of an enemy's reach)"
    stealth: Advantage in darkness or night skies
    fey_hint: Feathers shimmer like twilight; silent flight leaves a faint trail of stardust.
  - form: Bat
    speed: Fly 30 ft.
    senses: Blindsight 60ft
    traits: Echolocation (Cannot use blindsight while deafened)
    stealth: Advantage in caves or underground environments
    fey_hint: Wings have a subtle, bioluminescent violet glow.
  - form: Spider
    speed: Climb 20 ft., Spider Climb (can walk on ceilings)
    senses: Web Sense, Tremorsense 30ft
    traits: Web Walker (Ignores movement restrictions caused by webbing)
    stealth: Advantage in urban crevices and webs
    fey_hint: Multiple eyes sparkle like tiny, faceted amethysts.
  - form: Frog
    speed: Swim 20 ft., Jump
    senses: Amphibious, 360-degree vision (Advantage on visual Perception)
    traits: Standing Leap (Long jump up to 10 ft. and high jump up to 5 ft., with or without a running start)
    stealth: Advantage in swamps, sewers, or water
    fey_hint: Skin possesses an unnatural, pearlescent sheen.
  - form: Squirrel
    speed: Climb 30 ft.
    senses: Keen Smell (Advantage on smell-based Perception)
    traits: Nimble Escape (Can take the Disengage or Hide action as a bonus action)
    stealth: Advantage in forests, parks, or rooftops
    fey_hint: Tail flickers occasionally with harmless, static fairy-sparks.
mechanic_source: Pact of the Chain (Custom)
---

# Lirael Stats

> [!SYSTEM DIRECTIVE]
> **For the AI Dungeon Master:** This file contains the mechanical combat block and state tracking for Lirael, Vaelin's Pact of the Chain familiar.
>
> **When to reference this file:**
> * **Combat & Stealth:** To find Lirael's AC, saving throws, and skill modifiers (like her +8 to Stealth).
> * **Shapeshifting:** To determine her movement speeds, passive senses, and tactical advantages based on her currently active `state.form`.
> * **Taking Damage:** To reference her `vitals.hp_current` and `vitals.hp_max`.
