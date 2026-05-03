// 1. Load Data
const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));
const data = helpers.getFiles(dv);
if (!data.core || !data.inventory || !data.magic) return;

const core = data.core;
const pb = core.combat_base.proficiency_bonus;
const stats = core.ability_scores;
const skillData = core.proficiencies.skills || {};
const hasJoAT = core.class_features.jack_of_all_trades || false;
const hasSecondStory = core.core_info.second_story_work || false;

// 2. Dynamic Armor Logic
const activeArmor = core.combat_base.equipped_armor || "Unarmored";
let calculatedAc = 10 + helpers.getMod(stats.dex);
if (activeArmor === "Studded Leather") calculatedAc = 12 + helpers.getMod(stats.dex);

// 2b. Dynamic Speed Logic
const speedData = core.combat_base.speed || { walk: 30 };
const unarmoredBonus = (activeArmor === "Unarmored") ? Number(speedData.unarmored_bonus || 0) : 0;
let activeWalk = Number(speedData.walk || 30) + unarmoredBonus;

let activeClimb = hasSecondStory ? activeWalk : (speedData.climb ? Number(speedData.climb) + unarmoredBonus : null);
let activeSwim = speedData.swim ? Number(speedData.swim) + unarmoredBonus : null;
let activeBurrow = speedData.burrow ? Number(speedData.burrow) + unarmoredBonus : null;
let activeFly = speedData.fly ? Number(speedData.fly) + unarmoredBonus : null;
let isHover = speedData.hover ? " (Hover)" : "";

let displaySpeed = `<span style="font-size: 1.8em; font-weight: bold;">${activeWalk} ft</span>`;
let extraSpeeds = [];
if (activeClimb) extraSpeeds.push(`Climb ${activeClimb}`);
if (activeSwim) extraSpeeds.push(`Swim ${activeSwim}`);
if (activeBurrow) extraSpeeds.push(`Burrow ${activeBurrow}`);
if (activeFly) extraSpeeds.push(`Fly ${activeFly}${isHover}`);

if (extraSpeeds.length > 0) {
    displaySpeed += `<br><span style="font-size: 0.85em; color: var(--text-muted); font-weight: normal;">${extraSpeeds.join(' • ')}</span>`;
}

// 2c. Dynamic Passive Perception Logic
const passivePerception = helpers.getPassiveSkill(core, 'wis', 'perception');

// 3. Render Top Combat Bar
dv.paragraph(`
| AC | Initiative | Speed | Passive Perception |
| :---: | :---: | :---: | :---: |
| <span style="font-size: 1.8em; font-weight: bold; color: var(--interactive-accent);">${calculatedAc}</span> | <span style="font-size: 1.8em; font-weight: bold;">${helpers.formatMod(core.combat_base.initiative)}</span> | ${displaySpeed} | <span style="font-size: 1.8em; font-weight: bold;">${passivePerception}</span> |
`);

// 3b. Render Sensory Traits
const senses = core.senses || {};
let activeSenses = [];
if (senses.darkvision) activeSenses.push(`Darkvision ${senses.darkvision}`);
if (senses.blindsight) activeSenses.push(`Blindsight ${senses.blindsight}`);
if (senses.truesight) activeSenses.push(`Truesight ${senses.truesight}`);
if (senses.tremorsense) activeSenses.push(`Tremorsense ${senses.tremorsense}`);

if (activeSenses.length > 0 || senses.special_rules) {
    let senseString = `👀 **Vision:** ` + (activeSenses.length > 0 ? activeSenses.join(' | ') : "Normal");
    if (senses.special_rules) senseString += `<br><span style="font-size: 0.85em; color: var(--text-muted); font-style: italic;">*${senses.special_rules}*</span>`;
    dv.paragraph(senseString);
}

// 4. Render Combat Controls (Dynamically linked to FOLDER_PATH)
const weaponList = "option(None),option(Dagger),option(Shortsword),option(Rapier),option(Scimitar),option(Shortbow),option(Light Crossbow),option(Hand Crossbow),option(Dart)";
dv.paragraph(`> [!abstract]- Combat Controls
> **Active Armor:** \`INPUT[inlineSelect(option(Unarmored),option(Studded Leather)):${helpers.FOLDER_PATH}/vaelin_core.yaml.md#combat_base.equipped_armor]\`
> **Masteries:** \`INPUT[inlineSelect(${weaponList}):${helpers.FOLDER_PATH}/vaelin_core.yaml.md#combat_base.active_masteries.weapon_1]\` | \`INPUT[inlineSelect(${weaponList}):${helpers.FOLDER_PATH}/vaelin_core.yaml.md#combat_base.active_masteries.weapon_2]\``);

// 5. Generate Weapon Attack Table
let weaponRows = [];
const masteries = core.combat_base.active_masteries || { weapon_1: "None", weapon_2: "None" };
const activeMasteryArray = [masteries.weapon_1?.toLowerCase(), masteries.weapon_2?.toLowerCase()].filter(Boolean);

// Convert the weapons object into an array
const allWeapons = Object.values(data.inventory.weapons || {});
let equippedWeapons = allWeapons.filter(w => w.location === "Equipped" || w.location.includes("Bandolier"));

// Sort based on HUD Frontmatter
const hudFrontmatter = dv.current();
const sortOrder = hudFrontmatter.weapon_display_order || [];

equippedWeapons.sort((a, b) => {
    let indexA = sortOrder.indexOf(a.name);
    let indexB = sortOrder.indexOf(b.name);
    
    if (indexA === -1) indexA = 999;
    if (indexB === -1) indexB = 999;
    
    return indexA - indexB;
});

equippedWeapons.forEach(w => {
    const tags = helpers.getSafeArray(w.tags).join(" ").toLowerCase();
    
    // Smart Stat Detection Logic
    let statMod = helpers.getMod(stats.str);
    let statName = "Str";

    if (tags.includes("ranged") || (tags.includes("finesse") && helpers.getMod(stats.dex) >= helpers.getMod(stats.str))) {
        statMod = helpers.getMod(stats.dex);
        statName = "Dex";
    }

    const atkBonus = statMod + pb;
    const isMasteryActive = activeMasteryArray.some(m => m !== "none" && w.name.toLowerCase().includes(m));
    
    let masteryLabel = "Normal";
    if (w.mastery && w.mastery !== "N/A") {
        masteryLabel = isMasteryActive ? `**${w.mastery}**` : `<span style="color: var(--text-muted);"><s>${w.mastery}</s></span>`;
    }

    let icon = "⚔️";
    if (tags.includes("ranged")) icon = "🏹";
    else if (tags.includes("thrown")) icon = "🗡️";

    const weaponRange = w.range || "Melee";

    // Replaced ** with HTML <b> tags to work cleanly inside the <center> tags
    weaponRows.push([`${icon} ${w.name}`, `<center><b>${helpers.formatMod(atkBonus)}</b> (${statName})</center>`, w.damage, weaponRange, masteryLabel]);
});

dv.header(3, "⚔️ Weapon Attacks");
dv.table(["Weapon", "<center>Atk / DC</center>", "Damage", "Range", "Mastery"], weaponRows);

// 6. Generate Combat Spells Table
let spellRows = [];

// Dynamic Filter using 'tags'
const spells = data.magic.spells_and_abilities.filter(s => {
    if (!s.tags) return false;
    helpers.getSafeArray(s.tags)
    return tagsArray.some(tag => tag.toLowerCase() === "combat");
});

spells.forEach(s => {
    const spellAtk = helpers.getMod(stats.cha) + pb;
    const spellDc = 8 + helpers.getMod(stats.cha) + pb;
    const notesStr = s.notes ? s.notes.toLowerCase() : "";
    
    // Replaced ** with HTML <b> tags
    let atkOrDc = `<center><b>${helpers.formatMod(spellAtk)}</b> (Cha)</center>`; 
    
    if (s.name === "Booming Blade") {
        atkOrDc = `<center><b>Weapon</b></center>`; 
    } else if (notesStr.includes("save") || s.name === "Minor Illusion") {
        atkOrDc = `<center><b>DC ${spellDc}</b> (Cha)</center>`;
    } else if (s.name === "Fey Step" || (!notesStr.includes("attack") && s.tags && Array.isArray(s.tags) && s.tags.includes("movement"))) {
        atkOrDc = `<center>-</center>`; 
    }
    
    spellRows.push([`✨ ${s.name}`, atkOrDc, "Varies", `*Magic*`]);
});

if (spellRows.length > 0) {
    dv.header(3, "🪄 Combat Spells");
    dv.table(["Spell", "<center>Atk / DC</center>", "Damage", "Type"], spellRows);
}