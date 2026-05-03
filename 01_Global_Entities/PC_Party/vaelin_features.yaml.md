---
name: Vaelin Features Loadout
character: Vaelin Shadowleaf
type: character_loadout
domain: features
summary: "This file contains the specific racial traits, class features, and feats that allow Vaelin to bypass or modify the standard rules of D&D 5e."
last_updated: 2026-05-03T11:51:11-05:00
resources:
  action_surge_current: 1
  action_surge_max: 1
features:
  - name: Fey Ancestry
    source: Racial (Primal Elf)
    type: Passive Defense
    notes: You have Advantage on saving throws against being Charmed.
  - name: Trance
    source: Racial (Primal Elf)
    type: Passive Utility
    notes: You are immune to magical sleep. You can finish a Long Rest in 4 hours while remaining conscious.
  - name: Skulker
    source: Background Feat
    type: Passive Stealth
    notes: "You can try to hide when you are lightly obscured from the creature from which you are hiding. When you are hidden and miss with a ranged weapon attack, making the attack doesn't reveal you. Dim light doesn't impose disadvantage on your Wisdom (Perception) checks relying on sight."
  - name: Actor
    source: Background Feat
    type: Passive Social
    notes: "You have advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person. You can mimic the speech of another person or the sounds made by other creatures. You must have heard the person speaking, or heard the creature make the sound, for at least 1 minute. A successful Wisdom (Insight) check contested by your Charisma (Deception) check allows a listener to determine that the effect is faked."
  - name: Sneak Attack
    source: Class (Rogue)
    type: Passive Combat
    notes: "Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon. You don't need advantage if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll."
  - name: Weapon Mastery
    source: Class (Rogue)
    type: Passive Combat
    notes: You can use the mastery properties of specific weapons you are proficient with (tracked in the Inventory loadout).
  - name: Jack of All Trades
    source: Class Feature
    type: Passive Skill
    notes: "You can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus."
  - name: Eyes of Night
    source: Class Feature
    type: Passive Utility
    notes: You possess darkvision out to a range of 300 feet.
recovery_rules:
  short_rest:
    - action_surge
  long_rest: []
---

# Vaelin's Traits & Features

> [!SYSTEM DIRECTIVE]
> **For the AI Dungeon Master:** This file represents the "Rule Breakers" domain. It contains the specific racial traits, class features, and feats that allow Vaelin to bypass or modify the standard rules of D&D 5e.
>
> **When to reference this file:**
> * **Stealth & Hiding:** To verify the mechanics of the *Skulker* feat when resolving stealth in dim light or when lightly obscured.
> * **Combat Resolution:** To verify the triggering conditions and damage dice for *Sneak Attack*.
> * **Resting:** To verify the duration and conditions of a Long Rest via the *Trance* trait.
> * **Rule Exceptions:** Whenever Vaelin attempts an action that seems to conflict with standard rules (e.g., casting a spell silently, hiding in plain sight), check this file for an explicit override.
> 
> **Note:** Spell-like abilities (such as Fey Step and Warlock Invocations) are tracked in the Arcane Arsenal (Magic) domain file, not here.
