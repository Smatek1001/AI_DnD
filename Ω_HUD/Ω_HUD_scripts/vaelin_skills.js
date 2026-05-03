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

const hasJoAT = data.core.class_features.jack_of_all_trades || false;
const hasSecondStory = data.core.core_info.second_story_work || false;
const currentFilter = dv.current().skill_filter || "All";

// 3. Create Stable Container (Prevents Layout Shift)
// Min-height dynamically accounts for the filter shrinking/growing the list
const skillContainer = dv.el("div", "", {
    attr: {
        style: "min-height: 400px; contain: layout; display: flex; flex-direction: column; gap: 15px;"
    }
});

// 4. The 18 D&D Skills & Categories
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

// Helper: Calculate Proficiency Logic
const getProfDetails = (skillId) => {
    const type = skillData[skillId] || "None";
    if (type === "Expert") return { bonus: pb * 2, label: `⭐ Expert (+${pb*2})` };
    if (type === "Prof") return { bonus: pb, label: `👍 Proficient (+${pb})` };
    if (hasJoAT) return { bonus: Math.floor(pb / 2), label: `<span style="color: var(--text-faint);">🌓 JoAT (+${Math.floor(pb/2)})</span>` };
    return { bonus: 0, label: `<span style="color: var(--text-faint);">❌ Unproficient</span>` };
};

// Process Every Skill into HTML Rows
let skillRowsData = [];
for (let [id, info] of Object.entries(masterSkills)) {
    if (currentFilter !== "All" && info.cat !== currentFilter) continue;

    const statMod = helpers.getMod(stats[info.stat]);
    const prof = getProfDetails(id);
    const totalBonus = statMod + prof.bonus;

    skillRowsData.push({
        name: id.replace(/_/g, ' ').split(' ').map(w => helpers.capitalize(w)).join(' '),
        html: `<tr>
            <td>${id.replace(/_/g, ' ').split(' ').map(w => helpers.capitalize(w)).join(' ')}</td>
            <td>${helpers.capitalize(info.stat)}</td>
            <td><center>${helpers.formatMod(statMod)}</center></td>
            <td>${prof.label}</td>
            <td><center><b>${helpers.formatMod(totalBonus)}</b></center></td>
        </tr>`
    });
}

// Inject Second-Story Work (if applicable)
if (hasSecondStory && (currentFilter === "All" || currentFilter === "Thief/Agility" || currentFilter === "Physical")) {
    const statMod = helpers.getMod(stats.dex);
    const prof = getProfDetails("athletics");
    
    skillRowsData.push({
        name: "Athletics (Climbing)",
        html: `<tr>
            <td>Athletics (Climbing)</td>
            <td>Dex</td>
            <td><center>${helpers.formatMod(statMod)}</center></td>
            <td>${prof.label}</td>
            <td><center><b>${helpers.formatMod(statMod + prof.bonus)}</b></center></td>
        </tr>`
    });
}

// Sort alphabetically and compile HTML
skillRowsData.sort((a, b) => a.name.localeCompare(b.name));
const finalSkillRows = skillRowsData.map(row => row.html).join('');

// 5. Process Tools & Tool Synergy
const toolMap = {
    thieves_tools: { stat: "dex", skill: "sleight_of_hand", alts: ["Investigation", "Perception", "History"], cat: "Thief/Agility" },
    disguise_kit: { stat: "cha", skill: "deception", alts: ["Stealth", "Performance", "Intimidation"], cat: "Social" },
    forgery_kit: { stat: "int", skill: "deception", alts: ["Investigation", "History", "Perception"], cat: "Social" }
};

let finalToolRows = "";
for (let [id, type] of Object.entries(toolData)) {
    if (type === "None") continue;

    const mapData = toolMap[id] || { stat: "int", skill: null, alts: [], cat: "Other" };
    if (currentFilter !== "All" && mapData.cat !== currentFilter && mapData.cat !== "Other") continue;

    const statMod = helpers.getMod(stats[mapData.stat]);
    const isExpert = (type === "Expert");
    const totalBonus = statMod + (isExpert ? (pb * 2) : pb);

    let synergyLabel = "-";
    if (mapData.skill) {
        const skillLevel = skillData[mapData.skill] || "None";
        const formattedSkillName = mapData.skill.replace(/_/g, ' ').split(' ').map(w => helpers.capitalize(w)).join(' ');
        
        if (skillLevel !== "None") {
            const primaryText = (isExpert && skillLevel === "Expert") 
                ? `<div style="display: inline-block; text-align: center; line-height: 1.3;"><b><span style="color: var(--text-success);">⭐ Triple Adv (3d20) ⭐</span><br>(${formattedSkillName})</b></div>`
                : `<b>Advantage (${formattedSkillName})</b>`;
            
            const altText = mapData.alts.length > 0 ? `<br><span style="font-size: 0.8em; color: var(--text-muted);">Alts: ${mapData.alts.join(', ')}</span>` : "";
            synergyLabel = `${primaryText}${altText}`;
        }
    }

    finalToolRows += `<tr>
        <td>${id.replace(/_/g, ' ').split(' ').map(w => helpers.capitalize(w)).join(' ')}</td>
        <td>${helpers.capitalize(mapData.stat)}</td>
        <td><center>${helpers.formatMod(statMod)}</center></td>
        <td>${isExpert ? `⭐ Expert (+${pb*2})` : `👍 Proficient (+${pb})`}</td>
        <td><center><b>${helpers.formatMod(totalBonus)}</b></center></td>
        <td>${synergyLabel}</td>
    </tr>`;
}

// 6. Assemble the Final HTML Output
let combinedHtml = `
<table style="width: 100%;">
    <thead><tr><th>Skill</th><th>Stat</th><th><center>Stat Mod</center></th><th>Prof Level</th><th><center>Total Bonus</center></th></tr></thead>
    <tbody>${finalSkillRows}</tbody>
</table>`;

if (finalToolRows.length > 0) {
    combinedHtml += `
    <h3>🛠️ Tools & Synergy</h3>
    <table style="width: 100%;">
        <thead><tr><th>Tool</th><th>Default Stat</th><th><center>Stat Mod</center></th><th>Prof Level</th><th><center>Total Bonus</center></th><th>Synergy</th></tr></thead>
        <tbody>${finalToolRows}</tbody>
    </table>`;
}

skillContainer.innerHTML = combinedHtml;