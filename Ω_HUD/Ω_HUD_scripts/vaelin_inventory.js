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

// Combine weapons and equipment for unified inventory processing
const allItems = [...Object.values(weaponsObj), ...equipmentArr];

// 3. Render Wealth Section
const cp = wealth.cp || 0;
const sp = wealth.sp || 0;
const ep = wealth.ep || 0;
const gp = wealth.gp || 0;
const pp = wealth.pp || 0;
const gems = wealth.gems || 0;
const jewelry = wealth.jewelry || 0;
const art = wealth.art || 0;
const misc = wealth.misc || 0;

// Calculate Conversions (Standard 5e math)
const coinsInGp = (cp / 100) + (sp / 10) + (ep / 2) + gp + (pp * 10);
const otherWealthInGp = gems + jewelry + art + misc;
const grandTotalGp = coinsInGp + otherWealthInGp;

// Format the display string to only show coins you actually have (Ordered PP to CP)
const currentCoinsDisplay = Object.entries({pp, gp, ep, sp, cp})
    .filter(([_, amount]) => amount > 0)
    .map(([unit, amount]) => `**${amount}** ${unit.toUpperCase()}`)
    .join(" | ");

// Draw the header and totals
dv.paragraph(`### 💰 Wealth (Coins: ${coinsInGp.toFixed(2)} gp | Grand Total: ${grandTotalGp.toFixed(2)} gp)`);
if (currentCoinsDisplay) {
    dv.paragraph(`*Pouch:* ${currentCoinsDisplay}`);
}

// Generate the Meta Bind inputs using the centralized helper
let coinInputs = `**PP:** ${helpers.createInput("number", "inventory", "wealth.pp")} | `;
coinInputs += `**GP:** ${helpers.createInput("number", "inventory", "wealth.gp")} | `;
coinInputs += `**EP:** ${helpers.createInput("number", "inventory", "wealth.ep")} | `;
coinInputs += `**SP:** ${helpers.createInput("number", "inventory", "wealth.sp")} | `;
coinInputs += `**CP:** ${helpers.createInput("number", "inventory", "wealth.cp")}`;

let otherInputs = `**Gems:** ${helpers.createInput("number", "inventory", "wealth.gems")} | `;
otherInputs += `**Jewelry:** ${helpers.createInput("number", "inventory", "wealth.jewelry")} | `;
otherInputs += `**Art:** ${helpers.createInput("number", "inventory", "wealth.art")} | `;
otherInputs += `**Misc:** ${helpers.createInput("number", "inventory", "wealth.misc")}`;

dv.paragraph(`> [!info]- Manage Wealth\n> ${coinInputs}\n> \n> ${otherInputs}`);

// 4. Combat / Equipped Items
const equipped = allItems.filter(i => i.location === "Equipped" || i.location === "Worn").map(i => [
    `**${i.name}**`,
    i.damage || "N/A",
    i.mastery && i.mastery !== "N/A" ? `*${i.mastery}*` : "-",
    helpers.getSafeArray(i.tags).length > 0 ? helpers.getSafeArray(i.tags).join(", ") : "-"
]);

if (equipped.length > 0) {
    dv.header(3, "⚔️ Equipped");
    dv.table(["Item", "Damage/AC", "Mastery", "Properties"], equipped);
}

// 5. Consumables (Ammo, Rations, etc.)
let consRows = [];
for (const [key, value] of Object.entries(consumables)) {
    // Check if the consumable is nested (like arrows or daggers)
    if (typeof value === 'object' && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
            // Capitalize main category and subcategory (e.g., "Arrows - Quiver")
            let mainName = key.charAt(0).toUpperCase() + key.slice(1);
            let subName = subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            consRows.push([`${mainName} - ${subName}`, `**${subValue}**`]);
        }
    } else {
        // Standard non-nested consumables (e.g., "Rations")
        let name = key.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        consRows.push([name, `**${value}**`]);
    }
}

if (consRows.length > 0) {
    dv.header(3, "🏹 Supplies");
    dv.table(["Resource", "Quantity"], consRows);
}

// 6. Tools & Utility
const utility = allItems.filter(i => i.type === "Tool" || (i.location !== "Equipped" && i.location !== "Worn")).map(i => [
    i.name,
    i.location,
    i.notes || "-"
]);

if (utility.length > 0) {
    dv.header(3, "🎒 Tools & Gear");
    dv.table(["Item", "Location", "Notes"], utility);
}