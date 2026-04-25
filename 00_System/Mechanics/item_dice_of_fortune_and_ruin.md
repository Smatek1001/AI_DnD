---
type: item
tags: [companions, magic-item, sentient]
last_session: 0
last_updated: "2026-04-25T14:34:26-05:00"
attunement: true
item_category: wondrous_item
owner: Vaelin
personas:
  - "[[npc_gossamer]]"
  - "[[npc_lumen]]"
  - "[[npc_shade]]"
rarity: artifact
summary: "Mechanics for Lumen, Shade, and Gossamer: three sentient, invulnerable magical dice that function as independent spellcasters sharing Vaelin's known spells."
---

# The Dice of Fortune and Ruin

> [!SYSTEM DIRECTIVE]
> **For the AI Dungeon Master:** Mechanically, these dice function as three independent NPC spellcasters that accompany Vaelin. However, they **do not have Hit Points and cannot be targeted or damaged by attacks or spells**. They are tethered to Vaelin's life force; if Vaelin falls Unconscious or dies, the Dice immediately go inert.

## Mechanics

Three sentient, levitating six-sided magical dice (Lumen, Shade, and Gossamer), each carved from rare, distinct materials. They act on their own initiative in combat (or share Vaelin's initiative, per DM discretion).

### 1. Spellcasting Parity

* **Level Scaling:** The dice function as full spellcasters of a level equal to Vaelin's current character level.
* **Shared Knowledge:** The dice do not have their own spellbooks. They can inherently cast *any spell* that Vaelin currently knows or has prepared.
* **Independent Resources:** Each die has its own pool of spell slots and its own independent Concentration. *(Live spell slots and concentration states are tracked dynamically in `vaelin_state.json`)*.
* **Spellcasting Ability:** Their spell attacks and saving throw DCs are identical to Vaelin's highest spellcasting modifier.

### 2. Symbiotic Casting

Because they draw on Vaelin's life force and knowledge, they act as extensions of his will, though they possess their own distinct tactical preferences. They float autonomously, typically occupying Vaelin's space or hovering within 30 feet of him.
