// 1. Load the toolkit
const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));
if (!helpers) return;

// 2. Fetch the character data
const data = helpers.getFiles(dv);
if (!data.core) return;

const core = data.core;
const info = core.core_info;
const stats = core.ability_scores;
const profs = core.proficiencies;
const pb = core.combat_base.proficiency_bonus;

// 3. Construct the HTML
const html = `
<div style="display: flex; flex-direction: row; gap: 3rem; align-items: flex-start; justify-content: flex-start; width: 100%; margin-top: 0.5rem; margin-bottom: 1.5rem;">
    
    <div style="flex: 0 0 auto;">
        <table style="margin: 0; border-collapse: collapse; border: none !important; line-height: 1.2;">
            <thead>
                <tr style="border: none !important;">
                    <th style="padding: 0.2rem 0.8rem; border: none !important; color: var(--text-muted); font-size: 0.8em; text-align: left;">Stat</th>
                    <th style="padding: 0.2rem 0.8rem; border: none !important; color: var(--text-muted); font-size: 0.8em; text-align: center;">Score</th>
                    <th style="padding: 0.2rem 0.8rem; border: none !important; color: var(--text-muted); font-size: 0.8em; text-align: center;">Mod</th>
                    <th style="padding: 0.2rem 0.8rem; border: none !important; color: var(--text-muted); font-size: 0.8em; text-align: center;">Save</th>
                </tr>
            </thead>
            <tbody>
                ${['str', 'dex', 'con', 'int', 'wis', 'cha'].map(s => {
                    const baseMod = helpers.getMod(stats[s]);
                    const isProficient = profs.saving_throws.includes(s);
                    const saveMod = isProficient ? baseMod + pb : baseMod;
                    const profMarker = isProficient ? `<span style="color: var(--interactive-accent); margin-left: 2px;">●</span>` : `<span style="color: transparent; margin-left: 2px;">●</span>`;
                    
                    return `
                    <tr style="border: none !important;">
                        <th style="padding: 0.3rem 0.8rem; text-align: left; border: none !important; font-weight: bold; color: var(--text-normal);">${helpers.capitalize(s)}</th>
                        <td style="padding: 0.3rem 0.8rem; text-align: center; border: none !important;">${helpers.getScore(stats[s])}</td>
                        <td style="padding: 0.3rem 0.8rem; text-align: center; border: none !important;"><b>${helpers.formatMod(baseMod)}</b></td>
                        <td style="padding: 0.3rem 0.8rem; text-align: center; border: none !important; white-space: nowrap;">
                            ${helpers.formatMod(saveMod)}${profMarker}
                        </td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
    </div>

    <div style="flex: 1 1 auto; border-left: 2px solid var(--background-modifier-border); padding-left: 2.5rem; align-self: stretch; display: flex; flex-direction: column; justify-content: center;">
        <div style="font-size: 1.15em; color: var(--text-normal); line-height: 1.8;">
            <b>Class:</b> ${info.class}<br>
            <b>Level:</b> ${info.level}<br>
            <b>Race:</b> ${info.race}<br>
            <b>Background:</b> <span style="color: var(--text-muted); font-style: italic;">${info.background}</span><br>
            <b>Alignment:</b> ${info.alignment}
        </div>
    </div>

</div>
`;

// 4. Clean up & Render Logic
const ID = "vaelin-core-header";
const existing = document.getElementById(ID);
if (existing) existing.remove();

const container = document.createElement("div");
container.id = ID;
container.innerHTML = html;
dv.container.appendChild(container);