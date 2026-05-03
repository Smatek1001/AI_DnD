const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));
const data = helpers.getFiles(dv);

if (!data.core || !data.magic || !data.features) return;

const corePath = `${helpers.FOLDER_PATH}/vaelin_core.yaml.md`;
const magicPath = `${helpers.FOLDER_PATH}/vaelin_magic.yaml.md`;
const featPath = `${helpers.FOLDER_PATH}/vaelin_features.yaml.md`;
const liraelPath = `${helpers.FOLDER_PATH}/lirael_stats.yaml.md`;

const level = data.core.core_info.level;
const vitals = data.core.vitals;
const magicRes = data.magic.resources || {};

const liraelPage = dv.page("lirael_stats.yaml.md") || dv.page("lirael_stats");
const lVitals = liraelPage?.vitals || { hit_dice_current: 0, hp_current: 0, hp_max: 10 };

dv.paragraph(`<style>
    .rest-btn { background-color: var(--interactive-accent); color: var(--text-on-accent); padding: 4px 12px; border-radius: 4px; cursor: pointer; border: none; margin: 4px 4px 10px 0px; font-weight: bold; }
    .rest-btn:hover { opacity: 0.8; }
</style>`);

// ==========================================
// 1. HIT DICE SPENDERS (Manual Rolls)
// ==========================================
dv.header(3, "🩸 Spend Hit Dice");

// VAELIN
const hdDiv = dv.el("div", `🧝‍♂️ **Vaelin:** Spend <input type="number" id="hd_spent_val" style="width: 50px; text-align: center; font-weight: bold;" value="1" min="1" max="${vitals.hit_dice_current}"> HD to recover <input type="number" id="hp_rec_val" style="width: 60px; text-align: center; font-weight: bold;" value="0" min="0"> HP `, { style: "margin-bottom: 5px;" });
const hdBtn = hdDiv.createEl("button", { text: "🩹 Heal Vaelin", cls: "rest-btn" });

hdBtn.onclick = async () => {
    const spent = parseInt(document.getElementById("hd_spent_val").value) || 0;
    const hpGained = parseInt(document.getElementById("hp_rec_val").value) || 0;

    if (spent > vitals.hit_dice_current) {
        new Notice("Vaelin doesn't have enough Hit Dice remaining!");
        return;
    }

    const coreFile = app.vault.getAbstractFileByPath(corePath);
    if (coreFile) {
        await app.fileManager.processFrontMatter(coreFile, fm => {
            fm.vitals.hit_dice_current -= spent;
            fm.vitals.hp_current = Math.min(fm.vitals.hp_max, fm.vitals.hp_current + hpGained);
        });
        new Notice(`Vaelin spent ${spent} HD. Recovered ${hpGained} HP.`);
    }
};

// LIRAEL
const lHdDiv = dv.el("div", `🧚‍♀️ **Lirael:** Spend <input type="number" id="l_hd_spent_val" style="width: 50px; text-align: center; font-weight: bold;" value="1" min="1" max="${lVitals.hit_dice_current}"> HD to recover <input type="number" id="l_hp_rec_val" style="width: 60px; text-align: center; font-weight: bold;" value="0" min="0"> HP `, { style: "margin-bottom: 10px;" });
const lHdBtn = lHdDiv.createEl("button", { text: "🩹 Heal Lirael", cls: "rest-btn" });

lHdBtn.onclick = async () => {
    const spent = parseInt(document.getElementById("l_hd_spent_val").value) || 0;
    const hpGained = parseInt(document.getElementById("l_hp_rec_val").value) || 0;

    if (spent > lVitals.hit_dice_current) {
        new Notice("Lirael doesn't have enough Hit Dice remaining!");
        return;
    }

    const lFile = app.vault.getAbstractFileByPath(liraelPath);
    if (lFile) {
        await app.fileManager.processFrontMatter(lFile, fm => {
            if(!fm.vitals) return;
            fm.vitals.hit_dice_current -= spent;
            fm.vitals.hp_current = Math.min(fm.vitals.hp_max, fm.vitals.hp_current + hpGained);
        });
        new Notice(`Lirael spent ${spent} HD. Recovered ${hpGained} HP.`);
    }
};

// ==========================================
// 2. DYNAMIC RESTING ENGINE
// ==========================================
dv.header(3, "🏕️ Rest & Recovery");

const recoverTaggedResources = async (restTags) => {
    let recoveredNames = [];
    
    const processFile = async (filePath, dataObj) => {
        if (!dataObj || !dataObj.recovery_rules || !dataObj.resources) return;
        
        let toUpdate = [];
        restTags.forEach(tag => {
            if (dataObj.recovery_rules[tag]) toUpdate.push(...helpers.getSafeArray(dataObj.recovery_rules[tag]));
        });

        if (toUpdate.length > 0) {
            const tFile = app.vault.getAbstractFileByPath(filePath);
            if (tFile) {
                await app.fileManager.processFrontMatter(tFile, fm => {
                    if (!fm.resources) return;
                    toUpdate.forEach(res => {
                        const maxKey = res + "_max";
                        const curKey = res + "_current";
                        if (fm.resources[maxKey] !== undefined) {
                            fm.resources[curKey] = fm.resources[maxKey];
                            
                            let formattedName = res.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            if (!recoveredNames.includes(formattedName)) recoveredNames.push(formattedName);
                        }
                    });
                });
            }
        }
    };

    await processFile(magicPath, data.magic);
    await processFile(featPath, data.features);

    return recoveredNames;
};

// SHORT REST BUTTON
const srBtn = dv.el("button", "⏳ Short Rest", { cls: "rest-btn" });
srBtn.onclick = async () => {
    const recovered = await recoverTaggedResources(["short_rest"]);
    new Notice(`Short Rest Complete! Recovered: ${recovered.join(", ") || "Nothing"}`);
};

// LONG REST BUTTON
const lrBtn = dv.el("button", "⛺ Long Rest", { cls: "rest-btn" });
lrBtn.onclick = async () => {
    // 1. Handle Vaelin Vitals
    const coreFile = app.vault.getAbstractFileByPath(corePath);
    if (coreFile) {
        await app.fileManager.processFrontMatter(coreFile, fm => {
            fm.vitals.hp_current = fm.vitals.hp_max;
            fm.vitals.hp_temp = 0;
            fm.vitals.hit_dice_current = fm.vitals.hit_dice_max;
            if (fm.vitals.exhaustion !== undefined && fm.vitals.exhaustion > 0) {
                fm.vitals.exhaustion -= 1;
            }
        });
    }
    
    // 1b. Handle Lirael Vitals
    const lFile = app.vault.getAbstractFileByPath(liraelPath);
    if (lFile) {
        await app.fileManager.processFrontMatter(lFile, fm => {
            if (fm.vitals) {
                fm.vitals.hp_current = fm.vitals.hp_max;
                fm.vitals.hit_dice_current = fm.vitals.hit_dice_max;
            }
        });
    }

    // 2. Handle Tagged Features
    const recovered = await recoverTaggedResources(["short_rest", "long_rest"]);
    new Notice(`Long Rest Complete! HP & Hit Dice reset for the party. Recovered: ${recovered.join(", ")}`);
};

// ==========================================
// 3. ONCE-PER-REST CLASS FEATURES
// ==========================================
dv.header(3, "✨ Unique Rest Features");

// A. Magical Cunning / Eldritch Master Logic
const mcName = level >= 20 ? "Eldritch Master" : "Magical Cunning";
const mcAvailable = (magicRes.magical_cunning_current || 0) > 0;

if (mcAvailable) {
    const mcDiv = dv.el("div", "", { style: "display: flex; align-items: center; gap: 8px; margin-bottom: 8px;" });
    const mcBtn = mcDiv.createEl("button", { text: `🪄 ${mcName}`, cls: "rest-btn" });
    mcBtn.style.margin = "0"; 
    
    // Exact Math Calculation for Pact Slots
    const pactMax = magicRes.pact_slots_max || 0;
    const pactCur = magicRes.pact_slots_current || 0;
    const pactBaseRecover = level >= 20 ? pactMax : Math.ceil(pactMax / 2); 
    const pactActualRecover = Math.min(pactMax - pactCur, pactBaseRecover);
    
    const mcDesc = `Restores ${pactActualRecover} Pact Slot${pactActualRecover !== 1 ? 's' : ''}.`;
    mcDiv.createEl("span", { text: `(${mcDesc})`, style: "color: var(--text-muted); font-size: 0.9em; font-style: italic;" });

    mcBtn.onclick = async () => {
        const magicFile = app.vault.getAbstractFileByPath(magicPath);
        if (magicFile) {
            await app.fileManager.processFrontMatter(magicFile, fm => {
                if (!fm.resources) return;
                const max = fm.resources.pact_slots_max || 0;
                const cur = fm.resources.pact_slots_current || 0;
                const amountToRecover = level >= 20 ? max : Math.ceil(max / 2); 
                fm.resources.pact_slots_current = Math.min(max, cur + amountToRecover);
                fm.resources.magical_cunning_current = 0; // Mark as used!
            });
            new Notice(`${mcName} used! ${pactActualRecover} Pact Slot(s) recovered.`);
        }
    };
} else {
    dv.paragraph(`*<span style="color: var(--text-muted);">🪄 ${mcName} (Expended - Requires Long Rest)</span>*`);
}

// B. Sorcerous Restoration Logic (Unlocks at Level 5)
if (level >= 5) {
    const srAvailable = (magicRes.sorcerous_restoration_current || 0) > 0;
    
    if (srAvailable) {
        const srDiv = dv.el("div", "", { style: "display: flex; align-items: center; gap: 8px; margin-bottom: 8px;" });
        const srFeatureBtn = srDiv.createEl("button", { text: `🔮 Sorcerous Restoration`, cls: "rest-btn" });
        srFeatureBtn.style.margin = "0";
        
        // Exact Math Calculation for Sorcery Points
        const spMax = magicRes.sorcery_points_max || 0;
        const spCur = magicRes.sorcery_points_current || 0;
        const spBaseRecover = Math.floor(level / 2);
        const spActualRecover = Math.min(spMax - spCur, spBaseRecover);
        
        const srDesc = `Restores ${spActualRecover} Sorcery Point${spActualRecover !== 1 ? 's' : ''}.`;
        srDiv.createEl("span", { text: `(${srDesc})`, style: "color: var(--text-muted); font-size: 0.9em; font-style: italic;" });

        srFeatureBtn.onclick = async () => {
            const magicFile = app.vault.getAbstractFileByPath(magicPath);
            if (magicFile) {
                await app.fileManager.processFrontMatter(magicFile, fm => {
                    if (!fm.resources) return;
                    const max = fm.resources.sorcery_points_max || 0;
                    const cur = fm.resources.sorcery_points_current || 0;
                    const amountToRecover = Math.floor(level / 2); 
                    fm.resources.sorcery_points_current = Math.min(max, cur + amountToRecover);
                    fm.resources.sorcerous_restoration_current = 0; // Mark as used!
                });
                new Notice(`Sorcerous Restoration used! ${spActualRecover} Sorcery Point(s) recovered.`);
            }
        };
    } else {
        dv.paragraph(`*<span style="color: var(--text-muted);">🔮 Sorcerous Restoration (Expended - Requires Long Rest)</span>*`);
    }
} else {
    dv.paragraph(`*<span style="color: var(--text-muted);">🔒 Sorcerous Restoration (Unlocks at Level 5)</span>*`);
}