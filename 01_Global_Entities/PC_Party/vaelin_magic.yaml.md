---
name: Vaelin Magic Loadout
character: Vaelin Shadowleaf
type: character_loadout
domain: magic
summary: "This file contains Vaelin's known spells, spell-like invocations, and his current magical resources."
last_updated: 2026-04-30T14:23:29-05:00
resources:
  sorcery_points_current: 1
  sorcery_points_max: 2
  pact_slots_current: 2
  pact_slots_max: 2
  pact_slot_level: 1
  sorcerer_level_1_current: 3
  sorcerer_level_1_max: 3
  fey_step_current: 2
  fey_step_max: 2
  magical_cunning_current: 1
  magical_cunning_max: 1
spellcasting:
  ability: Charisma
  save_dc: 13
  attack_bonus: "+5"
  concentration: None
spells_and_abilities:
  - name: Fey Step
    source: Racial (Primal Elf)
    cost: 1 Fey Step Charge
    casting_time: 1 Bonus Action
    range: 30 ft
    duration: Instantaneous
    tags:
      - movement
      - combat
    notes: Teleport to an unoccupied space you can see.
  - name: Metamagic (Quickened Spell)
    source: Class (Sorcerer)
    type: Active Magic Modification
    notes: When you cast a spell that has a casting time of 1 action, you can spend 2 sorcery points to change the casting time to 1 bonus action for this casting.
  - name: Metamagic (Subtle Spell)
    source: Class (Sorcerer)
    type: Active Magic Modification
    notes: When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components.
  - name: Find Familiar (Pact of the Chain)
    source: Warlock Invocation
    cost: 10gp Incense
    casting_time: 1 Hour (Ritual)
    range: 10 ft
    duration: Instantaneous
    notes: Summons Lirael.
  - name: Disguise Self (Mask of Many Faces)
    source: Warlock Invocation
    cost: At-Will
    casting_time: 1 Action
    range: Self
    duration: 1 Hour
    tags:
      - movement
    notes: Cast Disguise Self without expending a spell slot.
  - name: Silent Image (Misty Visions)
    source: Warlock Invocation
    cost: At-Will
    casting_time: 1 Action
    range: 60 ft
    duration: 10 Minutes (Concentration)
    notes: Cast Silent Image without expending a spell slot or material components.
  - name: Control Flames
    source: Cantrip
    cost: At-Will
    casting_time: 1 Action
    range: 60 ft
    duration: Instantaneous or 1 Hour
    notes: Manipulate non-magical flames (expand, extinguish, change color).
  - name: Create Bonfire
    source: Cantrip
    cost: At-Will
    casting_time: 1 Action
    range: 60 ft
    duration: 1 Minute (Concentration)
    notes: Creates a 5ft hazard (Dex Save or 1d8 fire).
    tags: combat
  - name: Mage Hand
    source: Cantrip
    cost: At-Will
    casting_time: 1 Action
    range: 30 ft
    duration: 1 Minute
    notes: Spectral hand to manipulate objects.
  - name: Message
    source: Cantrip
    cost: At-Will
    casting_time: 1 Action
    range: 120 ft
    duration: 1 Round
    notes: Whisper a message to a target; they can reply in a whisper.
  - name: Minor Illusion
    source: Cantrip
    cost: At-Will
    casting_time: 1 Action
    range: 30 ft
    duration: 1 Minute
    notes: Create a sound or image.
    tags: combat
  - name: Prestidigitation
    source: Cantrip
    cost: At-Will
    casting_time: 1 Action
    range: 10 ft
    duration: Up to 1 Hour
    notes: Minor magical tricks (clean, soil, light/snuff, flavor).
  - name: Comprehend Languages
    source: Level 1 Spell
    cost: 1 Spell Slot / Ritual
    casting_time: 1 Action
    range: Self
    duration: 1 Hour
    notes: Understand spoken and written languages.
  - name: Detect Magic
    source: Level 1 Spell
    cost: 1 Spell Slot / Ritual
    casting_time: 1 Action
    range: Self (30ft radius)
    duration: 10 Minutes (Concentration)
    notes: See magical auras.
  - name: Feather Fall
    source: Level 1 Spell
    cost: 1 Spell Slot
    casting_time: 1 Reaction
    range: 60 ft
    duration: 1 Minute
    notes: Slow falling speed for up to 5 creatures.
  - name: Identify
    source: Level 1 Spell
    cost: 1 Spell Slot / Ritual
    casting_time: 1 Minute
    range: Touch
    duration: Instantaneous
    notes: Determine properties of a magic item. Requires 100gp pearl (not consumed).
  - name: Illusory Script
    source: Level 1 Spell
    cost: 1 Spell Slot / Ritual
    casting_time: 1 Minute
    range: Touch
    duration: 10 Days
    notes: Write hidden messages only designated creatures can read.
  - name: Unseen Servant
    source: Level 1 Spell
    cost: 1 Spell Slot / Ritual
    casting_time: 1 Action
    range: 60 ft
    duration: 1 Hour
    notes: Creates an invisible, mindless force to perform simple tasks.
recovery_rules:
  short_rest:
    - pact_slots
  long_rest:
    - sorcery_points
    - sorcerer_level_1
    - fey_step
    - magical_cunning
    - sorcerous_restoration
---

# Vaelin's Grimoire & Magic

> [!SYSTEM DIRECTIVE]
> **For the AI Dungeon Master:** This file represents the "Arcane Arsenal" domain. It contains Vaelin's known spells, spell-like invocations, and his current magical resources.
>
> **When to reference this file:**
> * **Spellcasting:** Whenever Vaelin declares he is casting a spell or using a magical invocation. Reference the specific `casting_time`, `range`, `duration`, and `cost` keys to properly resolve the mechanics.
> * **Saving Throws:** To find Vaelin's `save_dc` (13) when an enemy is forced to resist one of his spells (e.g., Create Bonfire).
> * **Resource Verification:** To ensure Vaelin has the available `pact_slots` or `sorcerer_level_X` slots required to cast a leveled spell. `pact_slot_level` indicates the power level at which Pact slots are currently cast.
> 
> **State Tracking Note:** The values in `resources` (spell slots, sorcery points, Fey Step charges) are actively modified during gameplay via remote dashboard tools. Always treat the numbers here as current.
