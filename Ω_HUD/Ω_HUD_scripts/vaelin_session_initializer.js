const helpers = eval(await dv.io.load("Ω_HUD_scripts/vaelin_helpers.js"));

// Wipes the canvas clean to prevent duplicates on refresh!
dv.container.innerHTML = "";

const data = helpers.getFiles(dv);
const hud = dv.current();
const session = hud.session || {};
const liraelPage = dv.page("lirael_stats.yaml.md") || dv.page("lirael_stats");

if (!data.core || !data.magic || !data.features || !data.inventory) {
    dv.paragraph("⚠️ *Error: Could not load all required character files.*");
    return;
}

const core = data.core;
const vitals = core.vitals;
const inv = data.inventory.consumables || {};

// 1. System Initiation Trigger
let rawSnapshot = `**[SYSTEM INITIATION: GAME STATE SNAPSHOT]**\n`;
rawSnapshot += `*This data represents Vaelin's exact current state. This supersedes any conflicting data in your RAG database and triggers Active Play Mode.*\n\n`;

// 2. Narrative State
rawSnapshot += `**🌐 Narrative State**\n`;
rawSnapshot += `* Location: ${session.location || "Unknown"}\n`;
rawSnapshot += `* Active Quest: ${session.active_quest || "None"}\n`;
rawSnapshot += `* Session Notes: ${session.notes || "None"}\n\n`;

// 3. MemPalace Retrieval Directive & Scene Setup
rawSnapshot += `**🧠 MemPalace Retrieval Directive**\n`;
rawSnapshot += `*Before generating your opening scene, silently query your MemPalace / knowledge base for the following context to ground the narrative:*\n`;
rawSnapshot += `1. Lore and sensory details regarding the current location: **${session.location || "Unknown"}**.\n`;
rawSnapshot += `2. Background history and stakes regarding the active quest: **${session.active_quest || "None"}**.\n`;
rawSnapshot += `3. Profiles and relationships for any NPCs or Factions mentioned in the Session Notes.\n`;
rawSnapshot += `4. The session summary for Session **${(session.number || 2) - 1}** to ensure seamless narrative continuity.\n`;
rawSnapshot += `5. **Environmental State:** Determine and clearly describe the current lighting, weather, and visibility conditions in your opening scene to establish stealth parameters.\n`;
rawSnapshot += `6. **State Reconciliation:** Compare this live snapshot with your Session ${(session.number || 2) - 1} diary entry. If there are major mechanical discrepancies, politely notify me using an OOC tag, but **always accept this snapshot as the ultimate canonical truth.**\n\n`;

// 4. Tactical & Passives
rawSnapshot += `**👁️ Tactical & Passives**\n`;

const passPerc = helpers.getPassiveSkill(core, 'wis', 'perception');
const passIns = helpers.getPassiveSkill(core, 'wis', 'insight');
const passInv = helpers.getPassiveSkill(core, 'int', 'investigation');

rawSnapshot += `* Passives: Perception (${passPerc}) | Insight (${passIns}) | Investigation (${passInv})\n`;

// Dynamic Senses
let activeSenses = [];
if (core.senses?.darkvision) activeSenses.push(`Darkvision (${core.senses.darkvision})`);
if (core.senses?.blindsight) activeSenses.push(`Blindsight (${core.senses.blindsight})`);
const sensesString = activeSenses.length > 0 ? activeSenses.join(", ") : "Normal";
rawSnapshot += `* Senses: ${sensesString}\n`;

const overrideNotes = core.senses?._override_notes || "None";
rawSnapshot += `* Key Traits: ${overrideNotes}\n\n`;

// 5. Vaelin's Vitals
rawSnapshot += `**❤️ Vaelin Shadowleaf (Level ${core.core_info.level})**\n`;
rawSnapshot += `* HP: ${vitals.hp_current} / ${vitals.hp_max} (Temp HP: ${vitals.hp_temp || 0})\n`;
rawSnapshot += `* Hit Dice: ${vitals.hit_dice_current} / ${vitals.hit_dice_max}\n`;
rawSnapshot += `* Conditions: ${core.core_info.conditions || "None"}\n\n`;

// 6. Magic & Resources
rawSnapshot += `**✨ Magic & Resources**\n`;
rawSnapshot += `* Concentration: ${data.magic.spellcasting?.concentration || "None"}\n`;

// Dynamic Resource Scanner
const scanResources = (resObj) => {
    let lines = "";
    for (let key in resObj) {
        if (key.endsWith('_max')) {
            const baseName = key.slice(0, -4);
            const currentKey = baseName + '_current';
            if (resObj.hasOwnProperty(currentKey)) {
                let formattedName = baseName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                lines += `* ${formattedName}: ${resObj[currentKey]} / ${resObj[key]}\n`;
            }
        }
    }
    return lines;
};

rawSnapshot += scanResources(data.magic.resources);
rawSnapshot += scanResources(data.features.resources);
rawSnapshot += `\n`;

// 7. Lirael's State
if (liraelPage) {
    const lVitals = liraelPage.vitals || {};
    const lState = liraelPage.state || {};
    const invisibleTag = lState.is_invisible ? " [Invisible]" : "";
    rawSnapshot += `**🧚‍♀️ Lirael (Familiar)**\n`;
    rawSnapshot += `* HP: ${lVitals.hp_current || 10} / ${lVitals.hp_max || 10}\n`;
    rawSnapshot += `* Form: ${lState.form || "Winged Nymph"}${invisibleTag}\n\n`;
}

// 8. In-Flight Ammo
rawSnapshot += `**🎒 Ammo & Consumables**\n`;
const arrowsExpended = inv.arrows?.expended || 0;
const arrowsQuiver = inv.arrows?.quiver || 0;
const daggersThrown = inv.daggers?.thrown || 0; 
const daggersBandolier = inv.daggers?.bandolier || 0;

rawSnapshot += `* Arrows: ${arrowsExpended} unrecovered (${arrowsQuiver} currently in quiver)\n`;
rawSnapshot += `* Daggers: ${daggersThrown} unrecovered (${daggersBandolier} currently on bandolier)\n`;

// --- The Styled Button ---
const btnDiv = dv.el("div", "");
const btn = btnDiv.createEl("button", { text: "📋 Copy Snapshot for GemDM" });

btn.setAttribute("style", "background: #3a86ff; color: white; font-weight: bold; padding: 10px 20px; border-radius: 5px; cursor: pointer; border: none; font-size: 1.1em; width: 100%;");

btn.onclick = async () => {
    btn.innerText = "⏳ Copying...";
    await navigator.clipboard.writeText(rawSnapshot);
    new Notice("State Snapshot copied to clipboard!");
    
    btn.innerText = "✅ Copied!";
    btn.setAttribute("style", "background: #70e000; color: black; font-weight: bold; padding: 10px 20px; border-radius: 5px; cursor: pointer; border: none; font-size: 1.1em; width: 100%;");
    
    setTimeout(() => {
        if (btn && btn.parentNode) {
            btn.innerText = "📋 Copy Snapshot for GemDM";
            btn.setAttribute("style", "background: #3a86ff; color: white; font-weight: bold; padding: 10px 20px; border-radius: 5px; cursor: pointer; border: none; font-size: 1.1em; width: 100%;");
        }
    }, 3000);
};

// Display Preview
let displayPreview = `> [!abstract]- 📋 Preview: GemDM State Snapshot\n`;
rawSnapshot.split('\n').forEach(line => displayPreview += `> ${line}\n`);
dv.paragraph(displayPreview);