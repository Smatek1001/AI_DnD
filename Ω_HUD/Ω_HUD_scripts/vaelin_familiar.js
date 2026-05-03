// 1. Load Data
const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));

// Load Lirael's Master Database (Static Stats & Live State)
const liraelPage = dv.page("lirael_stats.yaml.md") || dv.page("lirael_stats");
if (!liraelPage) {
    dv.paragraph("⚠️ **Error:** Could not locate Lirael's stats file.");
    return;
}

// Ensure state exists gracefully
const fam = liraelPage.state || { form: "Sprite", status: "Active", is_invisible: true };
const vitals = liraelPage.vitals || { hp_current: 10, hp_max: 10 };

// Fetch the UI memory from the HUD
const currentHud = dv.current();
const previousForm = currentHud.cached_familiar_form || "Sprite";

// 2. Smart Automation: Split-Brain Logic
if (fam.form !== previousForm) {
    // Action A: Update actual invisibility state in Lirael's stats file
    const statsPath = `${helpers.FOLDER_PATH}/lirael_stats.yaml.md`;
    const statsFile = app.vault.getAbstractFileByPath(statsPath);
    
    if (statsFile) {
        app.fileManager.processFrontMatter(statsFile, (fm) => {
            if (!fm.state) fm.state = {};
            fm.state.is_invisible = (fam.form === "Winged Nymph");
        });
    }

    // Action B: Update UI memory in HUD file
    const hudPath = currentHud.file.path;
    const hudFile = app.vault.getAbstractFileByPath(hudPath);
    
    if (hudFile) {
        app.fileManager.processFrontMatter(hudFile, (fm) => {
            fm.cached_familiar_form = fam.form;
        });
    }
}

// --- NEW: Dynamic Stealth Extraction ---
// Safely pulls the +8 (or whatever future modifier) directly from her skills array
const skillsList = liraelPage.skills_and_senses?.skills || [];
const stealthEntry = skillsList.find(s => s.toLowerCase().includes("stealth"));
const stealthMod = stealthEntry ? (stealthEntry.match(/[+-]\d+/) || ["+0"])[0] : "+0";

// 3. Dynamic Form Parsing Engine
let activeSpeed, activeSenses, activeTraits, activeStealth, activeHint;

if (fam.form === "Winged Nymph") {
    const baseAbilities = liraelPage.custom_abilities || [];
    const baseTraits = baseAbilities.map(a => a.name).join(", ");

    activeSpeed = liraelPage.core_stats?.base_speed || "10 ft | Fly 40 ft";
    activeSenses = liraelPage.skills_and_senses?.senses || "Passive Perception 13";
    activeTraits = baseTraits || "Default Invisibility, Fey Step, Pixie Dust Form, Audio Mimicry";
    activeStealth = `Normal (${stealthMod})`; 
    activeHint = "Tiny, winged, nymph-like Fey with otherworldly beauty.";
} else {
    const formsList = liraelPage.shapeshifting_forms || [];
    const foundForm = formsList.find(f => f.form === fam.form) || {};
    
    activeSpeed = foundForm.speed || "Unknown";
    activeSenses = foundForm.senses || "Unknown";
    activeTraits = foundForm.traits || "None";
    
    // Appends the numeric modifier to the situational advantage text
    const situationalStealth = foundForm.stealth || "Normal";
    activeStealth = `${situationalStealth} (${stealthMod})`;
    activeHint = foundForm.fey_hint || "No hint provided.";
}

// 4. Status Banners (Invisible / Dismissed)
let statusBanner = "";
if (fam.status === "Dismissed") {
    statusBanner = `<div style="background-color: rgba(128, 128, 128, 0.15); border-left: 4px solid gray; padding: 10px; margin-bottom: 10px;"><b>🌀 Lirael is currently dismissed into her pocket dimension.</b></div>`;
} else if (fam.is_invisible) {
    statusBanner = `<div style="background-color: rgba(138, 43, 226, 0.15); border-left: 4px solid #a333c8; padding: 10px; margin-bottom: 10px;"><b>👻 Lirael is currently INVISIBLE.</b></div>`;
}

if (statusBanner) dv.paragraph(statusBanner);

// 5. Render HP Bar - Linked to dynamic folder path
const maxHp = vitals.hp_max || 10;
const baseAc = liraelPage.core_stats?.ac || "15 (Natural Armor)";

dv.paragraph(`**HP:** \`INPUT[number:${helpers.FOLDER_PATH}/lirael_stats.yaml.md#vitals.hp_current]\` / **${maxHp}**<br><progress value="${vitals.hp_current}" max="${maxHp}" style="width: 100%; height: 8px; accent-color: #20b2aa; margin-top: 5px;"></progress>`);

// 6. Render Stat Block
dv.table(["Stat", "Value"], [
    ["🛡️ AC", `**${baseAc}**`],
    ["👟 Speed", activeSpeed],
    ["👀 Senses", activeSenses],
    ["✨ Traits", `*${activeTraits}*`],
    ["🥷 Stealth", activeStealth],
    ["🧚‍♀️ Fey Hint", `<span style="color: var(--text-muted); font-style: italic;">"${activeHint}"</span>`]
]);