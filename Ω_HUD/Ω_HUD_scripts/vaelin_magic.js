// 1. Load the toolkit
const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));
const data = helpers.getFiles(dv);

if (!data.magic) return;

const magic = data.magic;
const res = magic.resources;

// 2. Build the UI pieces
let html = "";

html += `<div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; padding: 1rem; background: var(--background-secondary); border-radius: 8px; border: 1px solid var(--background-modifier-border);">`;

// Top Row: Sorcery Points & Fey Step
html += `<div style="display: flex; justify-content: space-around; text-align: center; border-bottom: 1px solid var(--background-modifier-border); padding-bottom: 1rem;">`;
html += `<div><div style="font-size: 0.75em; color: var(--text-muted); text-transform: uppercase;">Sorcery Points</div><div style="font-size: 1.5em; font-weight: bold; color: #a29bfe;">` + helpers.createInput("number", "magic", "resources.sorcery_points_current") + ` / ${res.sorcery_points_max}</div></div>`;
html += `<div><div style="font-size: 0.75em; color: var(--text-muted); text-transform: uppercase;">Fey Step</div><div style="font-size: 1.5em; font-weight: bold; color: #55efc4;">` + helpers.createInput("number", "magic", "resources.fey_step_current") + ` / ${res.fey_step_max}</div></div>`;
html += `</div>`;

// Bottom Row: Spell Slots
html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 0.5rem;">`;
html += `<div><b style="color: var(--text-accent);">Sorcerer Slots</b><div style="margin-top: 5px; font-size: 0.9em;">Lvl 1: ` + helpers.createInput("number", "magic", "spell_slots.sorcerer_l1_current") + ` / ${magic.spell_slots.sorcerer_l1_max}</div></div>`;
html += `<div><b style="color: #fab1a0;">Pact Magic</b><div style="margin-top: 5px; font-size: 0.9em;">Lvl 1: ` + helpers.createInput("number", "magic", "spell_slots.pact_l1_current") + ` / ${magic.spell_slots.pact_l1_max}</div></div>`;
html += `</div>`;

html += `</div>`;

// 3. Render
container.innerHTML = html;