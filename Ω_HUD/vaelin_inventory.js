// 1. Load the toolkit
const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));
if (!helpers) return;

// 2. Fetch inventory data
const data = helpers.getFiles(dv);
if (!data.inventory) return;

const inv = data.inventory;
const weaponsObj = inv.weapons || {}; 
const equipmentArr = inv.equipment || [];
const wealth = inv.wealth || {};
const consumables = inv.consumables || {};

// 3. Create Stable Container (Prevents Layout Shift)
// min-height is set to 600px as an estimate for Vaelin's standard gear loadout
const invContainer = dv.el("div", "", {
    attr: {
        style: "min-height: 600px; contain: layout; display: flex; flex-direction: column; gap: 15px;"
    }
});

// 4. Process Wealth Data
const cp = wealth.cp || 0;
const sp = wealth.sp || 0;
const ep = wealth.ep || 0;
const gp = wealth.gp || 0;
const pp = wealth.pp || 0;

const coinsInGp = (cp / 100) + (sp / 10) + (ep / 2) + gp + (pp * 10);
const otherWealthInGp = (wealth.gems || 0) + (wealth.jewelry || 0) + (wealth.art || 0) + (wealth.misc || 0);
const grandTotalGp = coinsInGp + otherWealthInGp;

const currentCoinsDisplay = Object.entries({pp, gp, ep, sp, cp})
    .filter(([_, amount]) => amount > 0)
    .map(([unit, amount]) => `<b>${amount}</b> ${unit.toUpperCase()}`)
    .join(" | ");

// 5. Process Tables (Equipped, Supplies, Tools)
const allItems = [...Object.values(weaponsObj), ...equipmentArr];

// Equipped Row Logic
const equippedRows = allItems
    .filter(i => i.location === "Equipped" || i.location === "Worn")
    .map(i => `<tr>
        <td><b>${i.name}</b></td>
        <td>${i.damage || "N/A"}</td>
        <td>${i.mastery && i.mastery !== "N/A" ? `<i>${i.mastery}</i>` : "-"}</td>
        <td>${helpers.getSafeArray(i.tags).join(", ") || "-"}</td>
    </tr>`).join('');

// Consumables Row Logic
let consRows = "";
for (const [key, value] of Object.entries(consumables)) {
    if (typeof value === 'object' && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
            let mainName = helpers.capitalize(key);
            let subName = subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            consRows += `<tr><td>${mainName} - ${subName}</td><td><b>${subValue}</b></td></tr>`;
        }
    } else {
        let name = key.replace(/_/g, ' ').split(' ').map(w => helpers.capitalize(w)).join(' ');
        consRows += `<tr><td>${name}</td><td><b>${value}</b></td></tr>`;
    }
}

// Tools Row Logic
const toolRows = allItems
    .filter(i => i.type === "Tool" || (i.location !== "Equipped" && i.location !== "Worn"))
    .map(i => `<tr><td>${i.name}</td><td>${i.location}</td><td>${i.notes || "-"}</td></tr>`)
    .join('');

// 6. Assemble Final HTML
invContainer.innerHTML = `
<div class="wealth-header">
    <h3>💰 Wealth (Coins: ${coinsInGp.toFixed(2)} gp | Grand Total: ${grandTotalGp.toFixed(2)} gp)</h3>
    <p><i>Pouch:</i> ${currentCoinsDisplay || "Empty"}</p>
</div>

<div class="callout" data-callout="info" data-callout-metadata="collapsed">
    <div class="callout-title">Manage Wealth</div>
    <div class="callout-content">
        PP: ${helpers.createInput("number", "inventory", "wealth.pp")} | 
        GP: ${helpers.createInput("number", "inventory", "wealth.gp")} | 
        SP: ${helpers.createInput("number", "inventory", "wealth.sp")} | 
        CP: ${helpers.createInput("number", "inventory", "wealth.cp")}
    </div>
</div>

<h3>⚔️ Equipped</h3>
<table style="width: 100%;">
    <thead><tr><th>Item</th><th>Damage/AC</th><th>Mastery</th><th>Properties</th></tr></thead>
    <tbody>${equippedRows}</tbody>
</table>

<h3>🏹 Supplies</h3>
<table style="width: 100%;">
    <thead><tr><th>Resource</th><th>Quantity</th></tr></thead>
    <tbody>${consRows}</tbody>
</table>

<h3>🎒 Tools & Gear</h3>
<table style="width: 100%;">
    <thead><tr><th>Item</th><th>Location</th><th>Notes</th></tr></thead>
    <tbody>${toolRows}</tbody>
</table>
`;