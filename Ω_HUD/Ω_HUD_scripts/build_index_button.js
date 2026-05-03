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
        
        // 3. Build the Semantic Output
        let out = "# GemDM Master Index\n\n";
        out += "> [!SYSTEM DIRECTIVE]\n";
        out += "> **For the AI Dungeon Master:** This is the master routing table for the Vaelin Shadowleaf campaign. Use the exact filenames listed below as your primary search terms when querying the GitHub repository or your MemPalace database for lore and mechanics.\n\n";

        // 4. Group the markdown files using custom filters and add MemPalace Room brackets
        const categories = [
            {
                header: "🗺️ Geography & Locations [MemPalace Room: locations]",
                filter: p => p.type === "location"
            },
            {
                header: "🗡️ Factions & Syndicates [MemPalace Room: factions]",
                filter: p => p.type === "faction"
            },
            {
                header: "👥 Major NPCs [MemPalace Room: npcs]",
                filter: p => p.type === "npc"
            },
            {
                header: "📜 Session Summaries & Diaries [MemPalace Room: session_logs]",
                filter: p => p.type === "session_summary",
                isSession: true
            },
            {
                header: "👤 PC Mechanics [MemPalace Room: pc_party]",
                filter: p => {
                    const name = p.file.name.toLowerCase();
                    return p.type === "pc" || name.includes("vaelin") || name.includes("lirael") || name.startsWith("class_") || name.startsWith("race_") || name.startsWith("background_") || name.startsWith("feat_");
                }
            },
            {
                header: "📂 System Rules & Lore [MemPalace Room: rules_and_homebrew]",
                filter: p => {
                    const name = p.file.name;
                    return p.type === "system" || name.startsWith("rule_") || name.includes("!_GemDM") || name.includes("MCP_") || name.includes("demographics");
                }
            }
        ];

        // Track processed pages to catch any leftovers
        let processedPaths = new Set();

        for (const cat of categories) {
            const pagesInCat = allPages.where(cat.filter).sort(p => p.file.name);
            
            if (pagesInCat.length > 0) {
                out += `## ${cat.header}\n`;
                if (cat.isSession) {
                    const groups = pagesInCat.groupBy(p => p.file.folder.split('/').pop());
                    const sortedGroups = groups.sort(g => g.key);
                    for (let group of sortedGroups) {
                        out += `> [!INFO]- 📁 ${group.key.replace(/_/g, " ")}\n`;
                        for (let p of group.rows.sort(p => p.file.name)) {
                            out += `> * **${p.file.name}.md:** ${p.summary}\n`;
                            processedPaths.add(p.file.path);
                        }
                        out += `> \n`;
                    }
                } else {
                    for (let p of pagesInCat) {
                        out += `* **${p.file.name}.md:** ${p.summary}\n`;
                        processedPaths.add(p.file.path);
                    }
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
    dv.container.innerHTML = "";
    dv.container.createEl("div", { text: `❌ ERROR: ${e.message}`, style: "color: red; background: rgba(255,0,0,0.1); padding: 10px;" });
}