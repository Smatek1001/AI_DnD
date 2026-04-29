---
type: character_loadout
last_session: 3
last_updated: "2026-04-28T23:07:09-05:00"
attuned_items: 0
attunement_slots: 3
character: Vaelin Shadowleaf
consumables:
  arrows:
    quiver: 22
    expended: 0
  daggers:
    bandolier: 6
    thrown: 0
  rations: 5
  oil_flasks: 17
domain: inventory
equipment:
  - name: Studded Leather
    type: Armor
    quantity: 1
    location: Worn
    tags:
      - light-armor
    mastery: N/A
    damage: AC 12 + Dex
    range: N/A
    notes: ""
  - name: "Thieves' Tools"
    type: Tool
    quantity: 1
    location: Belt
    tags:
      - tool
      - proficient
      - infiltration
    mastery: N/A
    damage: N/A
    range: N/A
    notes: Used for bypass and infiltration in Duskhaven.
  - name: Disguise Kit
    type: Tool
    quantity: 1
    location: Backpack
    tags:
      - tool
      - proficient
      - social
    mastery: N/A
    damage: N/A
    range: N/A
    notes: Used to physically alter appearance, forge credentials, and bypass security.
  - name: Forgery Kit
    type: Tool
    quantity: 1
    location: Backpack
    tags:
      - tool
      - proficient
      - social
    mastery: N/A
    damage: N/A
    range: N/A
    notes: Used to forge documents, wax seals, and official Society/Syndicate paperwork.
summary: "This file is the single source of truth for Vaelin's physical weapons, armor, tools, consumable tracking, and monetary wealth."
wealth:
  pp: 0
  gp: 150
  ep: 0
  sp: 0
  cp: 0
  gems: 0
  jewelry: 0
  art: 0
  misc: 0
weapons:
  rapier:
    name: Rapier
    type: Weapon
    location: Equipped
    tags:
      - melee
      - finesse
    mastery: Vex
    damage: 1d8 piercing
    range: Melee
    notes: ""
  shortsword:
    name: Shortsword
    type: Weapon
    location: Equipped
    tags:
      - melee
      - finesse
      - light
    mastery: Vex
    damage: 1d6 piercing
    range: Melee
    notes: ""
  dagger:
    name: Dagger
    type: Weapon
    location: Equipped
    tags:
      - melee
      - thrown
      - finesse
      - light
    mastery: Nick
    damage: 1d4 piercing
    range: Melee / 20/60
    notes: ""
  shortbow:
    name: Shortbow
    type: Weapon
    location: Equipped
    tags:
      - ranged
      - two-handed
    mastery: Vex
    damage: 1d6 piercing
    range: 80/320
    notes: Ammunition tracked in consumables.arrows
---

# Vaelin's Arsenal & Inventory

> [!SYSTEM DIRECTIVE]
> **For the AI Dungeon Master:** This file represents the "Physical Arsenal & Assets" domain. It is the single source of truth for Vaelin's physical weapons, armor, tools, consumable tracking, and monetary wealth.
>
> **When to reference this file:**
> * **Combat (Physical):** To determine weapon damage dice, damage types, active Weapon Masteries (e.g., Vex, Nick), and available ammunition.
> * **Economy & Trade:** To check Vaelin's available funds (`wealth`) for bribes, purchases, or tavern lodging.
> * **Looting:** To verify if Vaelin possesses specific physical items, lockpicks, or kits required to bypass physical obstacles.
> 
> **State Tracking Note:** The values in `wealth` and `consumables` are actively modified during gameplay via remote dashboard tools. Always treat the numbers here as current.
