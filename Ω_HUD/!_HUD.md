---
last_updated: 2026-04-29T02:40:33-05:00
cached_familiar_form: Winged Nymph
session:
  number: 5
  date: 2026-05-04
  active_quest: completed The Blacksalt Breach
  location: The Black Oven
  notes: Vaelin impersonated a Harbor Syndicate boss to flawlessly rescue a captive goblin, securing wealth and a powerful debt from Magpie Miri. He is now ready to meet with Talia to fill her in on the hook set into Magpie Miri.
skill_filter: All
staged_xp: "0"
weapon_display_order:
  - Rapier
  - Shortsword
  - Shortbow
  - Dagger
---

# HUD

> [!todo]- System & Stat
> <div style="display: flex; gap: 10px; align-items: flex-start;">
> <div style="flex: 1;">
> 
> ```dataviewjs
> dv.executeJs(await dv.io.load("Ω_HUD_scripts/vaelin_session_initializer.js"));
> ```
> </div>
> <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
> 
> ```dataviewjs
> dv.executeJs(await dv.io.load("Ω_HUD_scripts/build_index_button.js"));
> ```
> 
> ```dataviewjs
> dv.executeJs(await dv.io.load("Ω_HUD_scripts/mine_mempalace_button.js"));
> ```
> </div>
> </div>

---

## 🌐 Session Status

**Session Number:** `INPUT[number:session.number]` `BUTTON[increment-session]` | **Session Date:** `INPUT[date:session.date]` `BUTTON[set-today]`

**Quest:** `INPUT[text:session.active_quest]` | **Location:** `INPUT[text:session.location]`

### 📝 Scratchpad

`INPUT[textArea(class(my-large-text-area)):session.notes]`

`BUTTON[clear-notes]`

---

## 👤 Vaelin Shadowleaf

```dataviewjs
dv.executeJs(await dv.io.load("Ω_HUD_scripts/vaelin_core_stats.js"));
````

---

## 🧚‍♀️ Lirael

> [!abstract]+ Lirael Controls
> 
> **Form:** `INPUT[inlineSelect(option(Winged Nymph),option(Owl),option(Bat),option(Spider),option(Frog),option(Squirrel)):01_Global_Entities/PC_Party/lirael_stats.yaml.md#state.form]`
> 
> **Status:** `INPUT[inlineSelect(option(Active),option(Dismissed)):01_Global_Entities/PC_Party/lirael_stats.yaml.md#state.status]` | **Invisible:** `INPUT[toggle:01_Global_Entities/PC_Party/lirael_stats.yaml.md#state.is_invisible]`
> 
> **HP:** `INPUT[number:01_Global_Entities/PC_Party/lirael_stats.yaml.md#vitals.hp_current]` / `VIEW[{01_Global_Entities/PC_Party/lirael_stats.yaml.md#vitals.hp_max}]`

```dataviewjs
await dv.view("Ω_HUD_scripts/vaelin_familiar");
```

---

## ⚔️ Combat

> [!abstract]- Combat Controls
> 
> **Armor:** `INPUT[inlineSelect(option(Unarmored),option(Studded Leather)):01_Global_Entities/PC_Party/vaelin_core.yaml.md#combat_base.equipped_armor]`
> 
> **Masteries:** `INPUT[inlineSelect(option(None),option(Dagger),option(Shortsword),option(Rapier),option(Scimitar),option(Shortbow),option(Light Crossbow),option(Hand Crossbow),option(Dart)):01_Global_Entities/PC_Party/vaelin_core.yaml.md#combat_base.active_masteries.weapon_1]` | `INPUT[inlineSelect(option(None),option(Dagger),option(Shortsword),option(Rapier),option(Scimitar),option(Shortbow),option(Light Crossbow),option(Hand Crossbow),option(Dart)):01_Global_Entities/PC_Party/vaelin_core.yaml.md#combat_base.active_masteries.weapon_2]`

> [!abstract]- Weapon Loadout Manager
> 
> ⚔️ **Rapier:** `INPUT[inlineSelect(option(Equipped),option(Backpack)):01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#weapons.rapier.location]`
> 
> ⚔️ **Shortsword:** `INPUT[inlineSelect(option(Equipped),option(Backpack)):01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#weapons.shortsword.location]`
> 
> 🗡️ **Daggers:** `INPUT[inlineSelect(option(Equipped),option(Backpack)):01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#weapons.dagger.location]`
> 
> 🏹 **Shortbow:** `INPUT[inlineSelect(option(Equipped),option(Backpack)):01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#weapons.shortbow.location]`

> [!info]- Ammunition Tracker (Combat & Recovery)
> 
> **Shortbow Arrows**
> 
> Quiver: `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#consumables.arrows.quiver]` | Fired/Unrecovered: `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#consumables.arrows.expended]`
> 
> **Thrown Daggers**
> 
> Bandolier: `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#consumables.daggers.bandolier]` | Thrown/Unrecovered: `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#consumables.daggers.thrown]`


```dataviewjs
await dv.view("Ω_HUD_scripts/vaelin_combat");
```

> [!abstract]+ Vitals Control
> 
> **HP:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_core.yaml.md#vitals.hp_current]` / `$= dv.page("01_Global_Entities/PC_Party/vaelin_core.yaml.md").vitals.hp_max` | **Temp:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_core.yaml.md#vitals.hp_temp]`
> 
> `$= const p = dv.page("01_Global_Entities/PC_Party/vaelin_core.yaml.md"); dv.el("progress", "", {attr: {value: p.vitals.hp_current, max: p.vitals.hp_max, style: "width: 100%; height: 12px; accent-color: #e91e63;"}})`
> 
> `$= const p = dv.page("01_Global_Entities/PC_Party/vaelin_core.yaml.md"); if(p.vitals.hp_temp > 0) { dv.el("progress", "", {attr: {value: p.vitals.hp_temp, max: p.vitals.hp_max, style: "width: 100%; height: 6px; accent-color: #ffd700; margin-top: -8px;"}})}`
> 
> **Hit Dice:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_core.yaml.md#vitals.hit_dice_current]` / `$= dv.page("01_Global_Entities/PC_Party/vaelin_core.yaml.md").vitals.hit_dice_max`
> 
> **Conditions:** `INPUT[text:01_Global_Entities/PC_Party/vaelin_core.yaml.md#vitals.conditions]`

> [!abstract]+ Tactical Resources
> 
> **Action Surge:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_features.yaml.md#resources.action_surge_current]` / `$= dv.page("01_Global_Entities/PC_Party/vaelin_features.yaml.md").resources.action_surge_max`

---

## ✨ Magic & Spellcasting

> [!abstract]+ Non-Spellcasting Magical Resources
> 
> **Fey Step:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_magic.yaml.md#resources.fey_step_current]` / `$= dv.page("01_Global_Entities/PC_Party/vaelin_magic.yaml.md").resources.fey_step_max`

> [!abstract]+ Spellcasting Resources
> 
> **Concentrating On:** `INPUT[text:01_Global_Entities/PC_Party/vaelin_magic.yaml.md#spellcasting.concentration]`
> 
> **Sorcery Points:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_magic.yaml.md#resources.sorcery_points_current]` / `$= dv.page("01_Global_Entities/PC_Party/vaelin_magic.yaml.md").resources.sorcery_points_max`
> 
> **Pact Magic (L1):** `INPUT[number:01_Global_Entities/PC_Party/vaelin_magic.yaml.md#resources.pact_slots_current]` / `$= dv.page("01_Global_Entities/PC_Party/vaelin_magic.yaml.md").resources.pact_slots_max`
> 
> **Sorcerer Slots (L1):** `INPUT[number:01_Global_Entities/PC_Party/vaelin_magic.yaml.md#resources.sorcerer_level_1_current]` / `$= dv.page("01_Global_Entities/PC_Party/vaelin_magic.yaml.md").resources.sorcerer_level_1_max`

> [!info]+ Known Spells
> 
> **Cantrips:** `$= dv.page("01_Global_Entities/PC_Party/vaelin_magic.yaml.md").spells_and_abilities.filter(s => s.source.includes("Cantrip")).map(s => s.name).join(', ')`
> 
> **Level 1 Spells:** `$= dv.page("01_Global_Entities/PC_Party/vaelin_magic.yaml.md").spells_and_abilities.filter(s => s.source.includes("Level 1")).map(s => s.name).join(', ')`
> 
> **Innate & Invocations:** `$= dv.page("01_Global_Entities/PC_Party/vaelin_magic.yaml.md").spells_and_abilities.filter(s => !s.source.includes("Cantrip") && !s.source.includes("Level 1")).map(s => s.name).join(', ')`

```dataviewjs
await dv.view("Ω_HUD_scripts/vaelin_magic");
```

---

## ⛺ Rest and Recovery

Current HP: `VIEW[{01_Global_Entities/PC_Party/vaelin_core.yaml.md#vitals.hp_current}]` / `VIEW[{01_Global_Entities/PC_Party/vaelin_core.yaml.md#vitals.hp_max}]`

Current Hit Dice: `VIEW[{01_Global_Entities/PC_Party/vaelin_core.yaml.md#vitals.hit_dice_current}]` / `VIEW[{01_Global_Entities/PC_Party/vaelin_core.yaml.md#vitals.hit_dice_max}]`

```dataviewjs
await dv.view("Ω_HUD_scripts/vaelin_rest_and_recovery");
```

---

## 🎭 Skills

**Filter:** `INPUT[inlineSelect(option(All),option(Social),option(Exploration),option(Knowledge),option(Thief/Agility),option(Physical)):skill_filter]`

```dataviewjs
await dv.view("Ω_HUD_scripts/vaelin_skills");
```

---

## 🎒 Inventory

> [!info]+ Manage Wealth
> 
> **PP:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#wealth.pp]` | **GP:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#wealth.gp]` | **EP:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#wealth.ep]` | **SP:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#wealth.sp]` | **CP:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#wealth.cp]`
> 
> **Gems:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#wealth.gems]` | **Jewelry:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#wealth.jewelry]` | **Art:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#wealth.art]` | **Misc:** `INPUT[number:01_Global_Entities/PC_Party/vaelin_inventory.yaml.md#wealth.misc]`

```dataviewjs
await dv.view("Ω_HUD_scripts/vaelin_inventory");
```

---

# 🆙 Level Up Checklist

> [!abstract]+ XP & Level Control
> **Level:** `VIEW[{01_Global_Entities/PC_Party/vaelin_core.yaml.md#core_info.level}]` | **Tax Rate:** `VIEW[{01_Global_Entities/PC_Party/vaelin_core.yaml.md#core_info.experience.tax_rate}]`
> **Gross Total:** `VIEW[{01_Global_Entities/PC_Party/vaelin_core.yaml.md#core_info.experience.gross_earned}]` | **Net Total:** `VIEW[{01_Global_Entities/PC_Party/vaelin_core.yaml.md#core_info.experience.net_earned}]`
> 
> ---
> 🎁 **New Staged XP to Apply:** `INPUT[text:staged_xp]`

```dataviewjs
await dv.view("Ω_HUD_scripts/vaelin_level_up");
```
