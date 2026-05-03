// 1. Load the toolkit
const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));
if (!helpers) return;

// 2. Fetch data
const data = helpers.getFiles(dv);
if (!data.core) return;

const stats = data.core.ability_scores;
const skillData = data.core.proficiencies.skills || {};
const toolData = data.core.proficiencies.tools || {};
const pb = data.core.combat_base.proficiency_bonus;

// Fetch our YAML toggles
const hasJoAT = data.core.class_features.jack_of_all_trades || false;
const hasSecondStory = data.core.core_info.second_story_work || false;
const currentFilter = dv.current().skill_filter || "All";

// 3. The 18 D&D Skills & Categories
const masterSkills = {
    acrobatics: { stat: "dex", cat: "Thief/Agility" },
    animal_handling: { stat: "wis", cat: "Exploration" },
    arcana: { stat: "int", cat: "Knowledge" },
    athletics: { stat: "str", cat: "Physical" },
    deception: { stat: "cha", cat: "Social" },
    history: { stat: "int", cat: "Knowledge" },
    insight: { stat: "wis", cat: "Social" },
    intimidation: { stat: "cha", cat: "Social" },
    investigation: { stat: "int", cat: "Exploration" },
    medicine: { stat: "wis", cat: "Knowledge" },
    nature: { stat: "int", cat: "Knowledge" },
    perception: { stat: "wis", cat: "Exploration" },
    performance: { stat: "cha", cat: "Social" },
    persuasion: { stat: "cha", cat: "Social" },
    religion: { stat: "int", cat: "Knowledge" },
    sleight_of_hand: { stat: "dex", cat: "Thief/Agility" },
    stealth: { stat: "dex", cat: "Thief/Agility" },
    survival: { stat: "wis", cat: "Exploration" }
};

let skillRows = [];

// Helper: Calculate Proficiency Logic
const getProfDetails = (skillId) => {
    const type = skillData[skillId] || "None";
    if (type === "Expert") return { bonus: pb * 2, label: `⭐ Expert (+${pb*2})` };
    if (type === "Prof") return { bonus: pb, label: `👍 Proficient (+${pb})` };
    if (hasJoAT) return { bonus: Math.floor(pb / 2), label: `<span style="color: var(--text-faint);">🌓 JoAT (+${Math.floor(pb/2)})</span>` };
    return { bonus: 0, label: `<span style="color: var(--text-faint);">❌ Unproficient</span>` };
};

// 4. Process Every Skill
for (let [id, info] of Object.entries(masterSkills)) {
    if (currentFilter !== "All" && info.cat !== currentFilter) continue;

    const statMod = helpers.getMod(stats[info.stat]);
    const prof = getProfDetails(id);
    const totalBonus = statMod + prof.bonus;

    const displayName = id.replace(/_/g, ' ').split(' ').map(w => helpers.capitalize(w)).join(' ');
    const displayStat = helpers.capitalize(info.stat);

    skillRows.push([
        displayName,
        displayStat,
        `<center>${helpers.formatMod(statMod)}</center>`,
        prof.label,
        `<center><b>${helpers.formatMod(totalBonus)}</b></center>`
    ]);
}

// 4b. Inject Second-Story Work (if applicable)
if (hasSecondStory && (currentFilter === "All" || currentFilter === "Thief/Agility" || currentFilter === "Physical")) {
    const statMod = helpers.getMod(stats.dex); // Uses Dex instead of Str
    const prof = getProfDetails("athletics"); // Still uses Athletics proficiency
    const totalBonus = statMod + prof.bonus;

    skillRows.push([
        "Athletics (Climbing)",
        "Dex",
        `<center>${helpers.formatMod(statMod)}</center>`,
        prof.label,
        `<center><b>${helpers.formatMod(totalBonus)}</b></center>`
    ]);
}

skillRows.sort((a, b) => a[0].localeCompare(b[0]));
dv.table(["Skill", "Stat", "<center>Stat Mod</center>", "Prof Level", "<center>Total Bonus</center>"], skillRows);

// 5. Process Tools & Tool Synergy
const toolMap = {
    thieves_tools: { stat: "dex", skill: "sleight_of_hand", alts: ["Investigation", "Perception", "History"], cat: "Thief/Agility" },
    disguise_kit: { stat: "cha", skill: "deception", alts: ["Stealth", "Performance", "Intimidation"], cat: "Social" },
    forgery_kit: { stat: "int", skill: "deception", alts: ["Investigation", "History", "Perception"], cat: "Social" }
};

let toolRows = [];

for (let [id, type] of Object.entries(toolData)) {
    if (type === "None") continue;

    const mapData = toolMap[id] || { stat: "int", skill: null, alts: [], cat: "Other" };
    if (currentFilter !== "All" && mapData.cat !== currentFilter && mapData.cat !== "Other") continue;

    const statMod = helpers.getMod(stats[mapData.stat]);
    const isExpert = (type === "Expert");
    const profBonusApplied = isExpert ? (pb * 2) : pb;
    const totalBonus = statMod + profBonusApplied;

    // Synergy Logic Engine
    let synergyLabel = "-";
    if (mapData.skill) {
        const skillLevel = skillData[mapData.skill] || "None";
        const skillIsExpert = (skillLevel === "Expert");
        
        // Format the default skill name nicely!
        const formattedSkillName = mapData.skill.replace(/_/g, ' ').split(' ').map(w => helpers.capitalize(w)).join(' ');
        
        let primaryText = "";
        if (skillLevel !== "None") {
            if (isExpert && skillIsExpert) {
                // The Fix: The text-success color is now restricted to a span around the top line only
                primaryText = `<div style="display: inline-block; text-align: center; line-height: 1.3;"><b><span style="color: var(--text-success);">⭐ Triple Adv (3d20) ⭐</span><br>(${formattedSkillName})</b></div>`;
            } else {
                primaryText = `<b>Advantage (${formattedSkillName})</b>`;
            }
            
            // Append the alternate skills as a sub-text
            const altText = mapData.alts.length > 0 ? `<br><span style="font-size: 0.8em; color: var(--text-muted);">Alts: ${mapData.alts.join(', ')}</span>` : "";
            synergyLabel = `${primaryText}${altText}`;
        }
    }

    const displayName = id.replace(/_/g, ' ').split(' ').map(w => helpers.capitalize(w)).join(' ');
    const displayStat = helpers.capitalize(mapData.stat);
    const profLabel = isExpert ? `⭐ Expert (+${pb*2})` : `👍 Proficient (+${pb})`;

    toolRows.push([
        displayName,
        displayStat,
        `<center>${helpers.formatMod(statMod)}</center>`,
        profLabel,
        `<center><b>${helpers.formatMod(totalBonus)}</b></center>`,
        synergyLabel
    ]);
}

// 6. Render Tools Table
if (toolRows.length > 0) {
    dv.header(3, "🛠️ Tools & Synergy");
    dv.table(["Tool", "Default Stat", "<center>Stat Mod</center>", "Prof Level", "<center>Total Bonus</center>", "Synergy"], toolRows);
}