const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));
const data = helpers.getFiles(dv);
const gestalt = dv.page("class_gestalt_rogue_sorlock.yaml.md");
const hud = dv.current(); 

if (!data.core || !data.magic || !gestalt) return;

const currentLevel = data.core.core_info.level;
const nextLevel = currentLevel + 1;
const currentStats = gestalt.progression.find(p => p.level === currentLevel) || { magic: { sorcery: {}, pact: {} } };
const nextStats = gestalt.progression.find(p => p.level === nextLevel);

if (!nextStats) {
    dv.paragraph("✅ **Vaelin is at Max Level (20).**");
    return;
}

// 1. Fetch XP Data
const xpData = data.core.core_info.experience || { gross_earned: 0, net_earned: 0, tax_rate: 4 };
const grossXp = Number(xpData.gross_earned);
const taxRate = Number(xpData.tax_rate);
const netXp = Number(xpData.net_earned);

// FETCH STAGED XP: We explicitly wrap it in Number() so the text field doesn't break the addition!
const stagedGross = Number(hud.staged_xp) || 0;
const stagedNet = stagedGross / taxRate;

const xpNeededForNext = nextStats.xp_required;
const xpOfCurrentLevel = currentStats.xp_required || 0;

// Progress Bar Math 
const xpEarnedThisLevel = Math.max(0, netXp - xpOfCurrentLevel);
const xpRequiredThisLevel = xpNeededForNext - xpOfCurrentLevel;
const percentComplete = Math.min(100, Math.floor((xpEarnedThisLevel / xpRequiredThisLevel) * 100));

// 2. Calculate Projection for the UI
const projectedNet = netXp + stagedNet;
let projectionAlert = "";
if (stagedNet > 0 && projectedNet >= xpNeededForNext) {
    // Uses inline styling to force bold and red text without relying on CSS classes
    projectionAlert = ` <span style="color: #ff3333; font-weight: bold;">🚀 (TRIGGERS LEVEL UP!)</span>`;
}

// 3. Render Interactive XP Control Panel
const corePath = `${helpers.FOLDER_PATH}/vaelin_core.yaml.md`;
const hudPath = hud.file.path;

let xpPanel = `> [!abstract]+ XP & Level Control\n`;
xpPanel += `> **Level:** \`VIEW[{${corePath}#core_info.level}]\` | **Tax Rate:** \`VIEW[{${corePath}#core_info.experience.tax_rate}]\`\n`;
xpPanel += `> **Gross Total:** \`VIEW[{${corePath}#core_info.experience.gross_earned}]\` | **Net Total:** \`VIEW[{${corePath}#core_info.experience.net_earned}]\`\n`;
xpPanel += `> \n`;
xpPanel += `> --- \n`;
xpPanel += `> 🎁 **XP Awarded by DM:** \`INPUT[text:${hudPath}#staged_xp]\` *(Net Gain: +${stagedNet})*\n`;
xpPanel += `> 🔮 **Projected Net Total:** ${projectedNet} / ${xpNeededForNext}${projectionAlert}\n`;

dv.paragraph(xpPanel);

// Create the Apply Button (using Obsidian's default button styling)
const btnDiv = dv.el("div", "");
const btn = btnDiv.createEl("button", { text: "📥 Apply & Zero Out" });

btn.onclick = async () => {
    if (stagedGross === 0) {
        new Notice("No awarded XP to apply.");
        return;
    }
    
    const coreFile = app.vault.getAbstractFileByPath(corePath);
    const hudFile = app.vault.getAbstractFileByPath(hudPath);
    
    if (coreFile && hudFile) {
        // Step A: Write the exact totals to the Core file (Safe because we forced them to be Numbers!)
        await app.fileManager.processFrontMatter(coreFile, (fm) => {
            if (!fm.core_info.experience) fm.core_info.experience = {};
            fm.core_info.experience.gross_earned = Number(fm.core_info.experience.gross_earned) + stagedGross;
            fm.core_info.experience.net_earned = Number(fm.core_info.experience.net_earned) + stagedNet;
        });
        
        // Step B: Zero out the HUD staging variable
        await app.fileManager.processFrontMatter(hudFile, (fm) => {
            fm.staged_xp = 0;
        });
        
        new Notice(`Applied ${stagedGross} Gross XP (+${stagedNet} Net XP).`);
    }
};

// 4. Render Progress Bar & Level Up Trigger
dv.header(3, `🚀 Level ${currentLevel} ➔ ${nextLevel}`);
dv.paragraph(`**Target:** <span style="color: var(--text-accent); font-weight: bold;">${netXp}</span> / ${xpNeededForNext} Net XP`);
dv.paragraph(`<progress value="${percentComplete}" max="100" style="width: 100%; height: 10px; accent-color: #9c27b0;"></progress>`);

if (netXp >= xpNeededForNext) {
    dv.paragraph(`> [!success] **LEVEL UP AVAILABLE!**\n> Vaelin has surpassed the ${xpNeededForNext} Net XP threshold. Update the fields below to match the targets!`);
    if (nextStats.features.includes("ASI")) {
        dv.paragraph(`> [!warning] **ABILITY SCORE IMPROVEMENT**\n> You gain an ASI or Feat this level! Don't forget to manually update your core Ability Scores in the YAML!`);
    }
} else {
    const netNeeded = xpNeededForNext - netXp;
    const grossNeeded = netNeeded * taxRate;
    dv.paragraph(`*Vaelin needs **${netNeeded}** more Net XP (approx **${grossNeeded}** Gross XP) to level up.*`);
}

// 5. Determine Stat Changes & Generate Meta Bind Inputs
let changes = [];

// --- BIOLOGICAL STATS ---
if (data.core.vitals.hit_dice_max !== nextLevel) {
    changes.push(["Max Hit Dice", `${data.core.vitals.hit_dice_max} ➡️ **${nextLevel}**`, `\`INPUT[number:${corePath}#vitals.hit_dice_max]\``]);
}
changes.push(["Increase Max HP", `Roll 1d8 + Con (or 5 + Con)`, `\`INPUT[number:${corePath}#vitals.hp_max]\``]);

// --- COMBAT STATS ---
if (nextStats.prof_bonus !== data.core.combat_base.proficiency_bonus) {
    changes.push(["Proficiency Bonus", `${data.core.combat_base.proficiency_bonus} ➡️ **${nextStats.prof_bonus}**`, `\`INPUT[number:${corePath}#combat_base.proficiency_bonus]\``]);
}
if (nextStats.sneak_attack !== data.core.combat_base.sneak_attack) {
    changes.push(["Sneak Attack", `${data.core.combat_base.sneak_attack} ➡️ **${nextStats.sneak_attack}**`, `\`INPUT[text:${corePath}#combat_base.sneak_attack]\``]);
}
if (nextStats.unarmored_bonus !== data.core.combat_base.speed.unarmored_bonus) {
    changes.push(["Unarmored Speed Bonus", `${data.core.combat_base.speed.unarmored_bonus || 0} ft ➡️ **${nextStats.unarmored_bonus} ft**`, `\`INPUT[number:${corePath}#combat_base.speed.unarmored_bonus]\``]);
}

// --- MAGIC STATS ---
const magicPath = `${helpers.FOLDER_PATH}/vaelin_magic.yaml.md`;
if (nextStats.sorcery_points !== data.magic.resources.sorcery_points_max) {
    changes.push(["Max Sorcery Points", `${data.magic.resources.sorcery_points_max} ➡️ **${nextStats.sorcery_points}**`, `\`INPUT[number:${magicPath}#resources.sorcery_points_max]\``]);
}
if (nextStats.magic.pact.slots !== data.magic.resources.pact_slots_max || nextStats.magic.pact.level !== data.magic.resources.pact_slot_level) {
    const currentPact = `${data.magic.resources.pact_slots_max} (L${data.magic.resources.pact_slot_level || 1})`;
    const nextPact = `**${nextStats.magic.pact.slots} (L${nextStats.magic.pact.level})**`;
    const inputString = `Slots: \`INPUT[number:${magicPath}#resources.pact_slots_max]\` | Lvl: \`INPUT[number:${magicPath}#resources.pact_slot_level]\``;
    changes.push(["Pact Slots", `${currentPact} ➡️ ${nextPact}`, inputString]);
}
if (nextStats.magic.sorcery.slots[0] !== data.magic.resources.sorcerer_level_1_max) {
    changes.push(["Sorcerer 1st-Level Slots", `${data.magic.resources.sorcerer_level_1_max} ➡️ **${nextStats.magic.sorcery.slots[0]}**`, `\`INPUT[number:${magicPath}#resources.sorcerer_level_1_max]\``]);
}

// --- MANUAL UPDATES ---
let manualUpdates = [];
const newSorCantrips = nextStats.magic.sorcery.cantrips - (currentStats.magic?.sorcery?.cantrips || 0);
const newSorPrep = nextStats.magic.sorcery.prepared - (currentStats.magic?.sorcery?.prepared || 0);
const newPactCantrips = nextStats.magic.pact.cantrips - (currentStats.magic?.pact?.cantrips || 0);
const newPactPrep = nextStats.magic.pact.prepared - (currentStats.magic?.pact?.prepared || 0);
const newInvocations = nextStats.magic.invocations - (currentStats.magic?.invocations || 0);

if (newSorCantrips > 0) manualUpdates.push(`+${newSorCantrips} Sorcerer Cantrip(s)`);
if (newSorPrep > 0) manualUpdates.push(`+${newSorPrep} Prepared Sorcerer Spell(s)`);
if (newPactCantrips > 0) manualUpdates.push(`+${newPactCantrips} Warlock Cantrip(s)`);
if (newPactPrep > 0) manualUpdates.push(`+${newPactPrep} Prepared Warlock Spell(s)`);
if (newInvocations > 0) manualUpdates.push(`+${newInvocations} Eldritch Invocation(s)`);

const newFeatures = nextStats.features.join(", ");
if (newFeatures) manualUpdates.push(`**Features:** ${newFeatures}`);

if (manualUpdates.length > 0) {
    changes.push(["Manual Upgrades", manualUpdates.join("<br>"), "*(Add these manually to your Core/Magic YAMLs)*"]);
}

// 5. Render Checklist Table
if (changes.length > 0) {
    dv.table(["Stat", "Current ➔ Target", "Update Here"], changes);
} else {
    dv.paragraph("*(All auto-tracked stats are up to date for the next level!)*");
}