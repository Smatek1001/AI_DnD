---
name: Lirael
type: monster_stat_block
character_ref: "[[Lirael]]"
tags: [familiar, mechanics]
last_session: 0
last_updated: "2026-04-16T14:38:18-05:00"
---

```yaml
mechanic_source: Pact of the Chain (Custom)

core_stats:
  size: Tiny
  type: Fey
  alignment: Chaotic Neutral
  ac: 15 (Natural Armor)
  hp: 10 # Matches standard 2024 Sprite durability
  base_speed: 10 ft., fly 40 ft.
  attributes:
    str: 3 (-4)
    dex: 18 (+4)
    con: 10 (+0)
    int: 14 (+2)
    wis: 13 (+1)
    cha: 14 (+2)

skills_and_senses:
  skills: [Stealth +6, Perception +3]
  senses: Passive Perception 13
  languages: Common, Sylvan, Elvish, Goblin. Telepathy.

actions_allowed:
  - Help # Primary Combat Action
  - Dash
  - Disengage
  - Dodge
  - Hide

custom_abilities:
  - name: "Default Invisibility"
    type: "Passive"
    description: "Lirael is naturally invisible unless she chooses to reveal herself, casts a spell, or loses concentration."
  
  - name: "Fey Step"
    type: "Bonus Action"
    description: "Teleports up to 30 feet to an unoccupied space she can see."
    
  - name: "Pixie Dust Form"
    type: "Action"
    description: "Transforms into a mote of pixie dust. Can move through spaces as narrow as 1 inch without squeezing."

  - name: "Audio Mimicry"
    type: "Action"
    description: "Can imitate voices and sounds flawlessly."
    
  - name: "Innate Spellcasting"
    spells: [Prestidigitation]

shapeshifting_forms:
  # Base stats remain the same. Forms grant specific movements, senses, and stealth advantages.
  # Every form has a Fey Hint that can be actively suppressed for stealth.
  - form: "Owl"
    speed: "Fly 60 ft."
    senses: "Darkvision 120ft, Advantage on Perception (Sight/Hearing)"
    traits: "Flyby (Provokes no opportunity attacks when flying out of an enemy's reach)"
    stealth: "Advantage in darkness or night skies"
    fey_hint: "Feathers shimmer like twilight; silent flight leaves a faint trail of stardust."

  - form: "Bat"
    speed: "Fly 30 ft."
    senses: "Blindsight 60ft"
    traits: "Echolocation (Cannot use blindsight while deafened)"
    stealth: "Advantage in caves or underground environments"
    fey_hint: "Wings have a subtle, bioluminescent violet glow."

  - form: "Spider"
    speed: "Climb 20 ft., Spider Climb (can walk on ceilings)"
    senses: "Web Sense, Tremorsense 30ft"
    traits: "Web Walker (Ignores movement restrictions caused by webbing)"
    stealth: "Advantage in urban crevices and webs"
    fey_hint: "Multiple eyes sparkle like tiny, faceted amethysts."

  - form: "Frog"
    speed: "Swim 20 ft., Jump"
    senses: "Amphibious, 360-degree vision (Advantage on visual Perception)"
    traits: "Standing Leap (Long jump up to 10 ft. and high jump up to 5 ft., with or without a running start)"
    stealth: "Advantage in swamps, sewers, or water"
    fey_hint: "Skin possesses an unnatural, pearlescent sheen."

  - form: "Squirrel"
    speed: "Climb 30 ft."
    senses: "Keen Smell (Advantage on smell-based Perception)"
    traits: "Nimble Escape (Can take the Disengage or Hide action as a bonus action)"
    stealth: "Advantage in forests, parks, or rooftops"
    fey_hint: "Tail flickers occasionally with harmless, static fairy-sparks."
```
