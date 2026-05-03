const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));
const data = helpers.getFiles(dv);
const gestalt = dv.page("class_gestalt_rogue_sorlock.yaml.md");
const hud = dv.current(); 

if (!data.core || !data.magic || !gestalt) return;

// 1. Create Stable Container
const wrapper = dv.el("div", "", { 
    attr: { style: "min-height: 250px; contain: layout; display: flex; flex-direction: column; gap: 10px;" } 
});

const currentLevel = data.core.core_info.level;
const nextLevel = currentLevel + 1;
const currentStats = gestalt.progression.find(p => p.level === currentLevel) || { magic: {} };
const nextStats = gestalt.progression.find(p => p.level === nextLevel);

if (!nextStats) { 
    wrapper.innerHTML = "<p>✅ <b>Vaelin is at Max Level (20).</b></p>"; 
    return; 
}

const parseMagicString = (val) => {
    if (!val) return {};
    if (typeof val === 'object') return val;
    try { return new Function("return " + val)(); } catch (e) { return {}; }
};

const curSorc = parseMagicString(currentStats.magic?.sorcery);
const nxtSorc = parseMagicString(nextStats.magic?.sorcery);
const curPact = parseMagicString(currentStats.magic?.pact);
const nxtPact = parseMagicString(nextStats.magic?.pact);

// 2. Fetch & Calculate XP
const xpData = data.core.core_info.experience || { gross_earned: 0, net_earned: 0, tax_rate: 4 };
const taxRate = Number(xpData.tax_rate);
const netXp = Number(xpData.net_earned);
const stagedGross = Number(hud.staged_xp) || 0;
const stagedNet = stagedGross / taxRate;

const xpNeededForNext = nextStats.xp_required;
const xpOfCurrentLevel = currentStats.xp_required || 0;
const percentComplete = Math.min(100, Math.floor((Math.max(0, netXp - xpOfCurrentLevel) / (xpNeededForNext - xpOfCurrentLevel)) * 100));

// Logic Gate for Form Status
const canLevelUp = (netXp >= xpNeededForNext);

const corePath = `${helpers.FOLDER_PATH}/vaelin_core.yaml.md`;
const magicPath = `${helpers.FOLDER_PATH}/vaelin_magic.yaml.md`;
const hudPath = hud.file.path;

// 3. Render Top Projection & Apply XP Box
const projectionHtml = `
<div style="padding: 10px; background: var(--background-secondary); border-radius: 5px; border-left: 4px solid var(--interactive-accent);">
    🔮 <b>Projected Net Total:</b> ${netXp + stagedNet} / ${xpNeededForNext} 
    ${(stagedNet > 0 && (netXp + stagedNet) >= xpNeededForNext) ? `<span style="color: #ff3333; font-weight: bold; margin-left: 10px;">🚀 (TRIGGERS LEVEL UP!)</span>` : ""}
</div>`;
wrapper.innerHTML = projectionHtml;

// Attach Apply XP Button
const btnDiv = document.createElement("div"); 
const btn = document.createElement("button");
btn.innerText = "📥 Apply Staged XP";
btn.style.fontWeight = "bold";
btn.onclick = async () => {
    if (stagedGross === 0) return new Notice("No awarded XP to apply.");
    const coreFile = app.vault.getAbstractFileByPath(corePath); const hudFile = app.vault.getAbstractFileByPath(hudPath);
    if (coreFile && hudFile) {
        await app.fileManager.processFrontMatter(coreFile, fm => {
            if (!fm.core_info.experience) fm.core_info.experience = {};
            fm.core_info.experience.gross_earned = Number(fm.core_info.experience.gross_earned) + stagedGross;
            fm.core_info.experience.net_earned = Number(fm.core_info.experience.net_earned) + stagedNet;
        });
        await app.fileManager.processFrontMatter(hudFile, fm => { fm.staged_xp = 0; });
        new Notice(`Applied ${stagedGross} Gross XP (+${stagedNet} Net XP).`);
    }
};
btnDiv.appendChild(btn); wrapper.appendChild(btnDiv);

// 4. Render Progress Bar
let levelHtml = `<h3>🚀 Level ${currentLevel} ➔ ${nextLevel}</h3>`;
levelHtml += `<p><b>Target:</b> <span style="color: var(--text-accent); font-weight: bold;">${netXp}</span> / ${xpNeededForNext} Net XP</p>`;
levelHtml += `<progress value="${percentComplete}" max="100" style="width: 100%; height: 10px; accent-color: #9c27b0; margin-bottom: 15px;"></progress>`;

const levelDiv = document.createElement("div");
levelDiv.innerHTML = levelHtml;
wrapper.appendChild(levelDiv);

// ==========================================
// 5. THE DYNAMIC LEVEL-UP CHECKLIST
// ==========================================

let formHtml = "";

// Handle Folded/Disabled state vs Active state
if (!canLevelUp) {
    formHtml += `<details><summary style="cursor: pointer; font-weight: bold; color: var(--text-muted); margin-bottom: 10px; user-select: none;">🔒 Locked: Level Up Form (Needs ${xpNeededForNext - netXp} more Net XP)</summary>`;
    formHtml += `<div style="padding: 15px; border: 1px solid var(--background-modifier-border); border-radius: 5px; background: var(--background-primary-alt); opacity: 0.5; filter: grayscale(100%); pointer-events: none;">`;
    formHtml += `<h3 style="margin-top: 0; color: var(--text-muted);">Level Up Unavailable</h3>`;
} else {
    formHtml += `<div style="padding: 15px; border: 1px solid var(--interactive-accent); border-radius: 5px; background: var(--background-primary-alt);">`;
    formHtml += `<h3 style="margin-top: 0; color: var(--interactive-accent);">🎉 LEVEL UP AVAILABLE!</h3>`;
    formHtml += `<p>Adjust the target values below, then click Confirm to auto-update your core files.</p>`;
}

formHtml += `<table style="width: 100%; text-align: left; margin-bottom: 15px;">`;
formHtml += `<thead><tr><th>Stat</th><th>Current ➔ Target</th><th>New Value</th></tr></thead><tbody>`;

// Architect Upgrade: Calculate Default HP
const conMod = helpers.getMod(data.core.ability_scores.con);
const projectedHp = data.core.vitals.hp_max + 8 + conMod;

// Core Logic
if (data.core.vitals.hit_dice_max !== nextLevel) {
    formHtml += `<tr><td>Max Hit Dice</td><td>${data.core.vitals.hit_dice_max} ➡️ <b>${nextLevel}</b></td><td><input type="number" id="lu_hd" value="${nextLevel}" style="width: 60px; text-align: center;"></td></tr>`;
}
formHtml += `<tr><td>Max HP</td><td>${data.core.vitals.hp_max} ➡️ <b>?</b></td><td><input type="number" id="lu_hp" value="${projectedHp}" style="width: 60px; text-align: center;"> <i>(+8 & Con)</i></td></tr>`;

if (nextStats.prof_bonus !== data.core.combat_base.proficiency_bonus) {
    formHtml += `<tr><td>Prof Bonus</td><td>${data.core.combat_base.proficiency_bonus} ➡️ <b>${nextStats.prof_bonus}</b></td><td><input type="number" id="lu_pb" value="${nextStats.prof_bonus}" style="width: 60px; text-align: center;"></td></tr>`;
}
if (nextStats.sneak_attack && nextStats.sneak_attack !== data.core.combat_base.sneak_attack) {
    formHtml += `<tr><td>Sneak Attack</td><td>${data.core.combat_base.sneak_attack} ➡️ <b>${nextStats.sneak_attack}</b></td><td><input type="text" id="lu_sa" value="${nextStats.sneak_attack}" style="width: 60px; text-align: center;"></td></tr>`;
}

// ASI Logic
if (nextStats.features && nextStats.features.includes("ASI")) {
    formHtml += `<tr><td colspan="3" style="background: rgba(255, 215, 0, 0.1); text-align: center; padding: 5px;"><b>🌟 Ability Score Improvement</b></td></tr>`;
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(stat => {
        const currentVal = data.core.ability_scores[stat];
        formHtml += `<tr><td>${stat.toUpperCase()}</td><td>${currentVal} ➡️</td><td><input type="number" id="lu_${stat}" value="${currentVal}" style="width: 60px; text-align: center;"></td></tr>`;
    });
}

// Magic Logic - Pact
if (nextStats.sorcery_points !== data.magic.resources.sorcery_points_max) {
    formHtml += `<tr><td>Max Sorcery Pts</td><td>${data.magic.resources.sorcery_points_max} ➡️ <b>${nextStats.sorcery_points}</b></td><td><input type="number" id="lu_sp" value="${nextStats.sorcery_points}" style="width: 60px; text-align: center;"></td></tr>`;
}
if (nxtPact.slots !== data.magic.resources.pact_slots_max || nxtPact.level !== data.magic.resources.pact_slot_level) {
    formHtml += `<tr><td>Pact Slots</td><td>${data.magic.resources.pact_slots_max} (L${data.magic.resources.pact_slot_level}) ➡️ <b>${nxtPact.slots} (L${nxtPact.level})</b></td><td><input type="number" id="lu_pact_slots" value="${nxtPact.slots}" style="width: 40px; text-align: center;"> | Lvl: <input type="number" id="lu_pact_lvl" value="${nxtPact.level}" style="width: 40px; text-align: center;"></td></tr>`;
}

// Magic Logic - Dynamic Sorcerer Slots Loop
if (nxtSorc.slots) {
    for (let i = 0; i < nxtSorc.slots.length; i++) {
        const lvl = i + 1;
        const currentMax = data.magic.resources[`sorcerer_level_${lvl}_max`] || 0;
        const targetMax = nxtSorc.slots[i];
        
        if (targetMax > currentMax) {
            formHtml += `<tr><td>Sorc L${lvl} Slots</td><td>${currentMax} ➡️ <b>${targetMax}</b></td><td><input type="number" id="lu_sorc_l${lvl}" value="${targetMax}" style="width: 60px; text-align: center;"></td></tr>`;
        }
    }
}

formHtml += `</tbody></table>`;

// Build Manual Features Text
let manualUpdates = [];
const newSorCantrips = (nxtSorc.cantrips || 0) - (curSorc.cantrips || 0);
const newSorPrep = (nxtSorc.prepared || 0) - (curSorc.prepared || 0);
const newPactCantrips = (nxtPact.cantrips || 0) - (curPact.cantrips || 0);
const newPactPrep = (nxtPact.prepared || 0) - (curPact.prepared || 0);
const newInvocations = (nextStats.magic?.invocations || 0) - (currentStats.magic?.invocations || 0);

if (newSorCantrips > 0) manualUpdates.push(`+${newSorCantrips} Sorcerer Cantrip(s)`);
if (newSorPrep > 0) manualUpdates.push(`+${newSorPrep} Prepared Sorcerer Spell(s)`);
if (newPactCantrips > 0) manualUpdates.push(`+${newPactCantrips} Warlock Cantrip(s)`);
if (newPactPrep > 0) manualUpdates.push(`+${newPactPrep} Prepared Warlock Spell(s)`);
if (newInvocations > 0) manualUpdates.push(`+${newInvocations} Eldritch Invocation(s)`);

if (nextStats.features && nextStats.features.length > 0) {
    manualUpdates.push(`<b>New Features:</b> ${nextStats.features.join(", ")}`);
}

if (manualUpdates.length > 0) {
    formHtml += `<div class="callout" data-callout="warning" style="margin-top: 10px;"><div class="callout-title">Required Manual Actions</div><div class="callout-content"><ul>`;
    manualUpdates.forEach(update => formHtml += `<li>${update}</li>`);
    formHtml += `</ul><p><i>Add these spells and features manually to your Core/Magic YAML files.</i></p></div></div>`;
}

formHtml += `<div id="lvl-hook" style="margin-top: 15px; text-align: right;"></div></div>`;

if (!canLevelUp) {
    formHtml += `</details>`;
}

const formDiv = document.createElement("div");
formDiv.innerHTML = formHtml;
wrapper.appendChild(formDiv);

// Attach Level Up Database Write Logic
const confirmBtn = document.createElement("button");
confirmBtn.innerText = "✨ Confirm Level Up & Update Files";
confirmBtn.style.fontWeight = "bold";
confirmBtn.style.padding = "8px 16px";
confirmBtn.style.border = "none";
confirmBtn.style.borderRadius = "5px";

if (!canLevelUp) {
    confirmBtn.disabled = true;
    confirmBtn.style.cursor = "not-allowed";
    confirmBtn.style.backgroundColor = "var(--background-modifier-border)";
    confirmBtn.style.color = "var(--text-muted)";
} else {
    confirmBtn.style.backgroundColor = "var(--interactive-accent)";
    confirmBtn.style.color = "var(--text-on-accent)";
    confirmBtn.style.cursor = "pointer";
    
    confirmBtn.onclick = async () => {
        const getVal = (id, fallback) => {
            const el = document.getElementById(id);
            return el ? (el.type === 'number' ? Number(el.value) : el.value) : fallback;
        };

        const coreFile = app.vault.getAbstractFileByPath(corePath);
        const magicFile = app.vault.getAbstractFileByPath(magicPath);
        
        if (coreFile) {
            await app.fileManager.processFrontMatter(coreFile, fm => {
                fm.core_info.level = nextLevel;
                if (document.getElementById('lu_hd')) fm.vitals.hit_dice_max = getVal('lu_hd', fm.vitals.hit_dice_max);
                if (document.getElementById('lu_hp')) fm.vitals.hp_max = getVal('lu_hp', fm.vitals.hp_max);
                if (document.getElementById('lu_pb')) fm.combat_base.proficiency_bonus = getVal('lu_pb', fm.combat_base.proficiency_bonus);
                if (document.getElementById('lu_sa')) fm.combat_base.sneak_attack = getVal('lu_sa', fm.combat_base.sneak_attack);
                
                ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(stat => {
                    if (document.getElementById(`lu_${stat}`)) fm.ability_scores[stat] = getVal(`lu_${stat}`, fm.ability_scores[stat]);
                });
            });
        }
        
        if (magicFile) {
            await app.fileManager.processFrontMatter(magicFile, fm => {
                if (!fm.resources) fm.resources = {};
                if (document.getElementById('lu_sp')) fm.resources.sorcery_points_max = getVal('lu_sp', fm.resources.sorcery_points_max);
                if (document.getElementById('lu_pact_slots')) fm.resources.pact_slots_max = getVal('lu_pact_slots', fm.resources.pact_slots_max);
                if (document.getElementById('lu_pact_lvl')) fm.resources.pact_slot_level = getVal('lu_pact_lvl', fm.resources.pact_slot_level);
                
                for (let i = 1; i <= 9; i++) {
                    if (document.getElementById(`lu_sorc_l${i}`)) {
                        const newMax = getVal(`lu_sorc_l${i}`, fm.resources[`sorcerer_level_${i}_max`]);
                        fm.resources[`sorcerer_level_${i}_max`] = newMax;
                        fm.resources[`sorcerer_level_${i}_current`] = newMax;
                    }
                }
            });
        }
        new Notice(`Congratulations! Vaelin is now Level ${nextLevel}!`);
    };
}

wrapper.querySelector("#lvl-hook").appendChild(confirmBtn);