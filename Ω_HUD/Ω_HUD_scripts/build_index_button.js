try {
    dv.container.innerHTML = "";
    
    const wrapper = dv.container.createEl("div");
    const btn = wrapper.createEl("button", { text: "🏗️ Build Master Index" });
    btn.setAttribute("style", "background: #9d4edd; color: white; font-weight: bold; padding: 10px 20px; border-radius: 5px; cursor: pointer; border: none; font-size: 1.1em; width: 100%;");

    btn.addEventListener("click", async () => {
        btn.innerText = "⏳ Building...";
        
        // 1. Set the destination path
        const indexPath = "!_GemDM_Master_Index.md";
        
        // 2. Fetch pages that have a 'summary', EXCLUDING those in 'Ω' directories
        const allPages = dv.pages().where(p => {
            if (!p.summary) return false;
            const inOmegaFolder = p.file.folder.split('/').some(folder => folder.startsWith('Ω'));
            return !inOmegaFolder;
        });
        
        // 3. Build the Frontmatter & Semantic Output
        // Uses Obsidian's native moment.js to match your exact timestamp format
        const timeStamp = window.moment ? window.moment().format() : new Date().toISOString();
        
        let out = "---\n";
        out += "name: GemDM Master Index\n";
        out += "type: system_instruction\n";
        out += "tags: [meta, index, system, routing]\n";
        out += "summary: \"The master directory and structural map of the Vault. Used by the GemDM to locate specific files, mechanics, and lore.\"\n";
        out += "location: \"System Core\"\n";
        out += `last_updated: ${timeStamp}\n`;
        out += "---\n\n";

        out += "# GemDM Master Index\n\n";
        out += "> [!SYSTEM DIRECTIVE]\n";
        out += "> **For the AI Dungeon Master:** This is the master routing table for the Vaelin Shadowleaf campaign. Use the exact filenames listed below as your primary search terms when querying the GitHub repository or your MemPalace database for lore and mechanics.\n\n";

        // 4. Group the markdown files using custom filters and add MemPalace Room brackets
        const categories = [
            { title: "PCs & Familiars [MemPalace Room: PC_Party]", filter: p => p.file.folder.includes("PC_Party") },
            { title: "Major NPCs [MemPalace Room: Major_NPCs]", filter: p => p.file.folder.includes("Major_NPCs") },
            { title: "Global Factions [MemPalace Room: Global_Factions]", filter: p => p.file.folder.includes("Global_Factions") },
            { title: "Duskhaven Locations [MemPalace Room: Duskhaven/Locations]", filter: p => p.file.folder.includes("Duskhaven/Locations") },
            { title: "Duskhaven NPCs [MemPalace Room: Duskhaven/NPCs]", filter: p => p.file.folder.includes("Duskhaven/NPCs") },
            { title: "Duskhaven Factions [MemPalace Room: Duskhaven/Factions]", filter: p => p.file.folder.includes("Duskhaven/Factions") },
            { title: "Game Mechanics & Rules [MemPalace Room: Mechanics]", filter: p => p.file.folder.includes("Mechanics") }
        ];

        let processedPaths = new Set();

        for (let cat of categories) {
            const pagesInCat = allPages.where(cat.filter).sort(p => p.file.name);
            if (pagesInCat.length > 0) {
                out += `## ${cat.title}\n`;
                for (let p of pagesInCat) {
                    out += `* **${p.file.name}.md:** ${p.summary}\n`;
                    processedPaths.add(p.file.path);
                }
                out += "\n";
            }
        }

        // 5. Catch-all for any files that didn't fit the above categories
        const otherPages = allPages.where(p => !processedPaths.has(p.file.path)).sort(p => p.file.name);
        if (otherPages.length > 0) {
            out += "## 📦 General Lore & Artifacts [MemPalace Room: general]\n";
            for (let p of otherPages) {
                out += `* **${p.file.name}.md:** ${p.summary}\n`;
            }
            out += "\n";
        }

        const abstractFilePath = app.vault.getAbstractFileByPath(indexPath);
        if (abstractFilePath) {
            await app.vault.modify(abstractFilePath, out);
        } else {
            await app.vault.create(indexPath, out);
        }

        new obsidian.Notice("Master Index successfully built!");
        btn.innerText = "✅ Index Updated!";
        btn.setAttribute("style", "background: #70e000; color: black; font-weight: bold; padding: 10px 20px; border-radius: 5px; cursor: pointer; border: none; font-size: 1.1em; width: 100%;");
        
        setTimeout(() => {
            btn.innerText = "🏗️ Build Master Index";
            btn.setAttribute("style", "background: #9d4edd; color: white; font-weight: bold; padding: 10px 20px; border-radius: 5px; cursor: pointer; border: none; font-size: 1.1em; width: 100%;");
        }, 3000);
    });

} catch (e) {
    dv.container.createEl("div", { text: `❌ ERROR: ${e.message}`, style: "color: red;" });
}