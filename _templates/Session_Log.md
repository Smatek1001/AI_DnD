---
last_updated: "{{date:YYYY-MM-DD HH:mm:ss}}"
chat_link: "" # Public share link to the corresponding chat session
dream_session: false # default to canonical reality
session_date: "{{date:YYYY-MM-DD}}"
session_title: "{{title}}"
campaign_day: 0 # The in-game day number this session's events took place on/ended
days_passed_since_campaign_start: 0 # Total cumulative in-game days passed since Campaign Day 1
pc_current_level: 0 # Level of the PC at the end of this session
xp_gained: 0
gold_gained_total: 0 # Total gold gained in this session
magic_items_acquired: [] # List names of magic items acquired this session for quick identification
level_up_occurred: false # Set to true if a PC leveled up this session
key_npcs_encountered: [] # [[NPC Name]]
key_locations_visited: [] # [[Location Name]]
quests_advanced: [] # [[Quest Name]]
quests_completed: [] # [[Quest Name]]
---

# Session Log - {{title}} ({{session_date}})

## I. Summary of Events

(Write a concise narrative summary of what transpired during this session. Focus on plot progression, major decisions made by the PC, key encounters, and significant revelations. Aim for a clear overview.)

## II. Player Character Progression & Status

### Current State at End of Session
* **Current HP:** (Value) / (Max HP)
* **XP Gained (this session):** {{xp_gained}}
* **New Level (if applicable):** {{pc_current_level}}

### Level Up Details (if applicable)
(If a PC leveled up this session, meticulously detail all choices made and changes applied. This is critical for reconstruction.)
* **PC Name:** [[Characters/PCs/{{PC_Name}}]]
    * **New Level Reached:** [e.g., Level 3]
    * **HP Gained:** [e.g., +8 HP (rolled 6 + 2 Con mod)]
    * **Ability Score Increase/Feat Taken:** [e.g., +2 Dexterity; or "Took Alert feat"]
    * **New Class Features Gained:** [e.g., "Rogue: Cunning Action, Rogue Subclass: Thief (Fast Hands)"]
    * **New Spells Learned/Prepared:** [e.g., "Learned Disguise Self, Silent Image", "Prepared Detect Magic"]
    * **New Proficiencies:** [e.g., "Gained proficiency in Disguise Kit from feat"]

### Item Acquisition, Loss & Disposition
(Detail every item, especially magical or valuable ones, gained, lost, consumed, or sold. Include charges, attunement, etc.)
* **Acquired:**
    * [e.g., 1x Potion of Healing (normal charges)]
    * [e.g., Staff of Blasting (attuned by PC, 5/5 charges) - from defeat of Archmage Kael]
    * [e.g., 20 ft. of hempen rope]
* **Lost/Consumed:**
    * [e.g., 1x Potion of Healing (consumed to heal 7 HP)]
    * [e.g., 1x Arrow of Slaying (consumed on the Dragon)]
    * [e.g., Ring of Protection (stolen by Shadow Thieves)]
* **Sold/Traded:**
    * [e.g., Sold 3x Daggers for 6 GP to local merchant]

### Financial Transactions
* **Starting Gold (this session):** (Optional, but helpful for audit)
* **Gold Gained:** [e.g., +15 GP from looting goblins]
* **Gold Spent:** [e.g., -5 GP for inn lodging, -10 GP for rope and rations]
* **Net Gold Change:** [e.g., +0 GP]
* **Current Gold (at end of session):** (Value)

### Lingering Conditions & Status Effects
(Note any long-term or persistent conditions, curses, diseases, or physical changes affecting the PC.)
* [e.g., "Elias gained 1 level of Exhaustion from forced march (current: 1 level)"]
* [e.g., "Cursed by the amulet - disadvantage on Wisdom saves until removed (Amulet of Zarthus)"]
* [e.g., "Gained a permanent scar on right cheek from goblin axe (cosmetic)"]

### Key Resource Usage & Regeneration
(Specifically for limited-use class features or item charges that are tracked per session.)
* [e.g., "Used 2 Bardic Inspiration dice"]
* [e.g., "Regained all Ki points on short rest"]
* [e.g., "Used 2 charges of Ring of the Ram (3 remaining)"]
* [e.g., "Consumed 1 ration and 0.5 gallons of water"]


## III. Key Encounters & Decisions

* (Detailed description of significant combat encounters, social interactions, or puzzles. Highlight critical choices made by the PC and their immediate outcomes.)

## IV. NPCs Encountered & Interactions

* (List NPCs who played a significant role in this session. Briefly describe their interactions with the PC and any changes in their status or disposition.)
    * [[NPC Name 1]]: (Brief notes on interaction)
    * [[NPC Name 2]]:

## V. Locations Visited & Explored

* (Notes on new areas the PC explored, or significant changes/discoveries in previously known locations.)
    * [[Location Name 1]]: (New discoveries/changes)
    * [[Location Name 2]]:

## VI. Quests Progress

* **Quests Advanced:**
    * [[Quest Name 1]]: (Describe how it progressed)
    * [[Quest Name 2]]:
* **Quests Completed:**
    * [[Quest Name 3]]: (Describe the resolution)
* **New Plot Hooks / Quests Uncovered:**
    * (Any new leads, mysteries, or direct quest offers that emerged.)

## VII. DM Notes (for your eyes only - for future reference)

(This section is for your personal notes as a DM to yourself. This is where you might jot down ideas for future sessions, things you need to remember about NPC reactions, specific plot points to introduce, or consequences to track. You can choose whether or not to include this when providing me the log.)

---
**Full Chat Session Link:** {{chat_link}}
(Paste the public share link to this session's chat here after the session concludes.)