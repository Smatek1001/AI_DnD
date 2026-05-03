// 1. Load Data
const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));

const liraelPage = dv.page("lirael_stats.yaml.md") || dv.page("lirael_stats");
if (!liraelPage) {
    dv.el("div", "<p>⚠️ **Error:** Could not locate Lirael's stats file.</p>", { attr: { style: "min-height: 350px; contain: layout;" } });
    return;
}

const fam = liraelPage.state || { form: "Sprite", status: "Active", is_invisible: true };
const vitals = liraelPage.vitals || { hp_current: 10, hp_max: 10 };
const currentHud = dv.current();
const previousForm = currentHud.cached_familiar_form || "Sprite";

// Smart Automation: Split-Brain Logic
if (fam.form !== previousForm) {
    const statsPath = `${helpers.FOLDER_PATH}/lirael_stats.yaml.md`;
    const statsFile = app.vault.getAbstractFileByPath(statsPath);
    if (statsFile) {
        app.fileManager.processFrontMatter(statsFile, (fm) => {
            if (!fm.state) fm.state = {};
            fm.state.is_invisible = (fam.form === "Winged Nymph");
        });
    }
    const hudPath = currentHud.file.path;
    const hudFile = app.vault.getAbstractFileByPath(hudPath);
    if (hudFile) {
        app.fileManager.processFrontMatter(hudFile, (fm) => {
            fm.cached_familiar_form = fam.form;
        });
    }
}

const skillsList = liraelPage.skills_and_senses?.skills || [];
const stealthEntry = skillsList.find(s => s.toLowerCase().includes("stealth"));
const stealthMod = stealthEntry ? (stealthEntry.match(/[+-]\d+/) || ["+0"])[0] : "+0";

let activeSpeed, activeSenses, activeTraits, activeStealth, activeHint;
if (fam.form === "Winged Nymph") {
    const baseTraits = (liraelPage.custom_abilities || []).map(a => a.name).join(", ");
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
    activeStealth = `${foundForm.stealth || "Normal"} (${stealthMod})`;
    activeHint = foundForm.fey_hint || "No hint provided.";
}

let statusBanner = "";
if (fam.status === "Dismissed") {
    statusBanner = `<div style="background-color: rgba(128, 128, 128, 0.15); border-left: 4px solid gray; padding: 10px; margin-bottom: 10px;"><b>🌀 Lirael is currently dismissed into her pocket dimension.</b></div>`;
} else if (fam.is_invisible) {
    statusBanner = `<div style="background-color: rgba(138, 43, 226, 0.15); border-left: 4px solid #a333c8; padding: 10px; margin-bottom: 10px;"><b>👻 Lirael is currently INVISIBLE.</b></div>`;
}

const maxHp = vitals.hp_max || 10;
const baseAc = liraelPage.core_stats?.ac || "15 (Natural Armor)";

const famHtml = `
${statusBanner}
<p><b>HP:</b> \`INPUT[number:${helpers.FOLDER_PATH}/lirael_stats.yaml.md#vitals.hp_current]\` / <b>${maxHp}</b><br>
<progress value="${vitals.hp_current}" max="${maxHp}" style="width: 100%; height: 8px; accent-color: #20b2aa; margin-top: 5px;"></progress></p>
<table style="width: 100%;">
    <tbody>
        <tr><td>🛡️ AC</td><td><b>${baseAc}</b></td></tr>
        <tr><td>👟 Speed</td><td>${activeSpeed}</td></tr>
        <tr><td>👀 Senses</td><td>${activeSenses}</td></tr>
        <tr><td>✨ Traits</td><td><i>${activeTraits}</i></td></tr>
        <tr><td>🥷 Stealth</td><td>${activeStealth}</td></tr>
        <tr><td>🧚‍♀️ Fey Hint</td><td><span style="color: var(--text-muted); font-style: italic;">"${activeHint}"</span></td></tr>
    </tbody>
</table>
`;

// 3. Render with Markdown Parsing
dv.el("div", famHtml, {
    attr: { style: "min-height: 350px; contain: layout; display: flex; flex-direction: column; gap: 10px;" }
});