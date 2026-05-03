const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));
const data = helpers.getFiles(dv);
if (!data.core || !data.inventory || !data.magic) return;

const core = data.core;
const pb = core.combat_base.proficiency_bonus;
const stats = core.ability_scores;
const hasSecondStory = core.core_info.second_story_work || false;

const activeArmor = core.combat_base.equipped_armor || "Unarmored";
let calculatedAc = 10 + helpers.getMod(stats.dex);
if (activeArmor === "Studded Leather") calculatedAc = 12 + helpers.getMod(stats.dex);

const speedData = core.combat_base.speed || { walk: 30 };
const unarmoredBonus = (activeArmor === "Unarmored") ? Number(speedData.unarmored_bonus || 0) : 0;
let activeWalk = Number(speedData.walk || 30) + unarmoredBonus;

let extraSpeeds = [];
if (hasSecondStory) extraSpeeds.push(`Climb ${activeWalk}`);
if (speedData.swim) extraSpeeds.push(`Swim ${Number(speedData.swim) + unarmoredBonus}`);

let displaySpeed = `<span style="font-size: 1.8em; font-weight: bold;">${activeWalk} ft</span>`;
if (extraSpeeds.length > 0) displaySpeed += `<br><span style="font-size: 0.85em; color: var(--text-muted); font-weight: normal;">${extraSpeeds.join(' • ')}</span>`;

const passivePerception = helpers.getPassiveSkill(core, 'wis', 'perception');

const masteries = core.combat_base.active_masteries || { weapon_1: "None", weapon_2: "None" };
const activeMasteryArray = [masteries.weapon_1?.toLowerCase(), masteries.weapon_2?.toLowerCase()].filter(Boolean);
const equippedWeapons = Object.values(data.inventory.weapons || {}).filter(w => w.location === "Equipped" || w.location.includes("Bandolier"));

const sortOrder = dv.current().weapon_display_order || [];
equippedWeapons.sort((a, b) => {
    let indexA = sortOrder.indexOf(a.name); let indexB = sortOrder.indexOf(b.name);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
});

let weaponRows = equippedWeapons.map(w => {
    const tags = helpers.getSafeArray(w.tags).join(" ").toLowerCase();
    let statMod = (tags.includes("ranged") || (tags.includes("finesse") && helpers.getMod(stats.dex) >= helpers.getMod(stats.str))) ? helpers.getMod(stats.dex) : helpers.getMod(stats.str);
    const atkBonus = statMod + pb;
    const isMasteryActive = activeMasteryArray.some(m => m !== "none" && w.name.toLowerCase().includes(m));
    let masteryLabel = w.mastery !== "N/A" ? (isMasteryActive ? `<b>${w.mastery}</b>` : `<span style="color: var(--text-muted); text-decoration: line-through;">${w.mastery}</span>`) : "-";
    let icon = tags.includes("ranged") ? "🏹" : (tags.includes("thrown") ? "🗡️" : "⚔️");
    return `<tr><td>${icon} ${w.name}</td><td><center><b>${helpers.formatMod(atkBonus)}</b></center></td><td>${w.damage}</td><td>${w.range || "Melee"}</td><td>${masteryLabel}</td></tr>`;
}).join('');

let spellRows = data.magic.spells_and_abilities.filter(s => helpers.getSafeArray(s.tags).some(tag => tag.toLowerCase() === "combat")).map(s => {
    const spellAtk = helpers.getMod(stats.cha) + pb;
    const spellDc = 8 + helpers.getMod(stats.cha) + pb;
    const notesStr = s.notes ? s.notes.toLowerCase() : "";
    let atkOrDc = `<b>${helpers.formatMod(spellAtk)}</b>`;
    if (s.name === "Booming Blade") atkOrDc = `<b>Weapon</b>`;
    else if (notesStr.includes("save") || s.name === "Minor Illusion") atkOrDc = `<b>DC ${spellDc}</b>`;
    else if (s.name === "Fey Step" || (!notesStr.includes("attack") && helpers.getSafeArray(s.tags).includes("movement"))) atkOrDc = `-`;
    return `<tr><td>✨ ${s.name}</td><td><center>${atkOrDc}</center></td><td>Varies</td><td>Magic</td></tr>`;
}).join('');

const html = `
<table style="width: 100%; text-align: center;">
    <thead><tr><th>AC</th><th>Initiative</th><th>Speed</th><th>Passive Perception</th></tr></thead>
    <tbody><tr>
        <td><span style="font-size: 1.8em; font-weight: bold; color: var(--interactive-accent);">${calculatedAc}</span></td>
        <td><span style="font-size: 1.8em; font-weight: bold;">${helpers.formatMod(core.combat_base.initiative)}</span></td>
        <td>${displaySpeed}</td>
        <td><span style="font-size: 1.8em; font-weight: bold;">${passivePerception}</span></td>
    </tr></tbody>
</table>
<table style="width: 100%;">
    <thead><tr><th>Weapon</th><th><center>Atk/DC</center></th><th>Damage</th><th>Range</th><th>Mastery</th></tr></thead>
    <tbody>${weaponRows}</tbody>
</table>
${spellRows ? `<table style="width: 100%;"><thead><tr><th>Spell</th><th><center>Atk / DC</center></th><th>Damage</th><th>Type</th></tr></thead><tbody>${spellRows}</tbody></table>` : ''}
`;

dv.el("div", html, { attr: { style: "min-height: 300px; contain: layout; display: flex; flex-direction: column; gap: 10px;" } });