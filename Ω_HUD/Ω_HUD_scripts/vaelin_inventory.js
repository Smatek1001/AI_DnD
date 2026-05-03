const helpers = eval(await dv.io.load("Ω_HUD/Ω_HUD_scripts/vaelin_helpers.js"));
const data = helpers.getFiles(dv);
if (!data.inventory) return;

const inv = data.inventory;
const wealth = inv.wealth || {};
const allItems = [...Object.values(inv.weapons || {}), ...(inv.equipment || [])];
const consumables = inv.consumables || {};

const coinsInGp = ((wealth.cp || 0) / 100) + ((wealth.sp || 0) / 10) + ((wealth.ep || 0) / 2) + (wealth.gp || 0) + ((wealth.pp || 0) * 10);
const grandTotalGp = coinsInGp + (wealth.gems || 0) + (wealth.jewelry || 0) + (wealth.art || 0) + (wealth.misc || 0);

const pouchCoins = Object.entries({pp: wealth.pp||0, gp: wealth.gp||0, ep: wealth.ep||0, sp: wealth.sp||0, cp: wealth.cp||0})
    .filter(([_, amount]) => amount > 0).map(([unit, amount]) => `<b>${amount}</b> ${unit.toUpperCase()}`).join(" | ");

const equippedRows = allItems.filter(i => i.location === "Equipped" || i.location === "Worn").map(i => `<tr>
    <td><b>${i.name}</b></td><td>${i.damage || "N/A"}</td><td>${i.mastery && i.mastery !== "N/A" ? `<i>${i.mastery}</i>` : "-"}</td><td>${helpers.getSafeArray(i.tags).join(", ") || "-"}</td></tr>`).join('');

let consRows = "";
for (const [key, value] of Object.entries(consumables)) {
    if (typeof value === 'object' && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
            consRows += `<tr><td>${helpers.capitalize(key)} - ${subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td><td><b>${subValue}</b></td></tr>`;
        }
    } else {
        consRows += `<tr><td>${key.replace(/_/g, ' ').split(' ').map(w => helpers.capitalize(w)).join(' ')}</td><td><b>${value}</b></td></tr>`;
    }
}

const toolRows = allItems.filter(i => i.type === "Tool" || (i.location !== "Equipped" && i.location !== "Worn")).map(i => `<tr><td>${i.name}</td><td>${i.location}</td><td>${i.notes || "-"}</td></tr>`).join('');

const html = `
<div class="wealth-header" style="margin-bottom: 15px;">
    <h3>💰 Wealth (Coins: ${coinsInGp.toFixed(2)} gp | Grand Total: ${grandTotalGp.toFixed(2)} gp)</h3>
    <p><i>Pouch:</i> ${pouchCoins || "Empty"}</p>
</div>
${equippedRows ? `<h3>⚔️ Equipped</h3><table style="width: 100%;"><thead><tr><th>Item</th><th>Damage/AC</th><th>Mastery</th><th>Properties</th></tr></thead><tbody>${equippedRows}</tbody></table>` : ''}
${consRows ? `<h3>🏹 Supplies</h3><table style="width: 100%;"><thead><tr><th>Resource</th><th>Quantity</th></tr></thead><tbody>${consRows}</tbody></table>` : ''}
${toolRows ? `<h3>🎒 Tools & Gear</h3><table style="width: 100%;"><thead><tr><th>Item</th><th>Location</th><th>Notes</th></tr></thead><tbody>${toolRows}</tbody></table>` : ''}
`;

dv.el("div", html, { attr: { style: "min-height: 400px; contain: layout; display: flex; flex-direction: column; gap: 10px;" } });