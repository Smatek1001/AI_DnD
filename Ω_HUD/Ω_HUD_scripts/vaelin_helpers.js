(() => {
    // Centralized folder path. If you ever move your files, just update this one line!
    const FOLDER_PATH = "01_Global_Entities/PC_Party";

    return {
        // EXPORT THE PATH FOR OTHER SCRIPTS TO USE
        FOLDER_PATH: FOLDER_PATH,

        // --- 1. DATA FETCHING ---
        getFiles: (dv) => {
            const fetch = (domain) => {
                const file = dv.pages(`"${FOLDER_PATH}"`).find(p => p.file.name.startsWith(`vaelin_${domain}`));
                return file;
            };

            return {
                core: fetch("core"),
                inventory: fetch("inventory"),
                magic: fetch("magic"),
                features: fetch("features"),
                identities: fetch("identities"),
                reputation: fetch("reputation")
            };
        },

        // --- 1b. SAFE ARRAY PARSER ---
        // Defensively ensures frontmatter lists are ALWAYS arrays, even if Obsidian parses them as strings
        getSafeArray: (frontmatterKey) => {
            if (!frontmatterKey) return []; // Catch null/undefined
            
            if (typeof frontmatterKey === 'string') {
                // If it's a string with commas, split it into a proper array
                if (frontmatterKey.includes(',')) {
                    return frontmatterKey.split(',').map(item => item.trim());
                }
                // If it's just a single string word, wrap it in an array
                return [frontmatterKey];
            }
            
            // If it is already an array, or something else, safely concat it
            return [].concat(frontmatterKey);
        },

// --- 2. D&D MATH HELPERS ---
        getScore: (scoreString) => {
            const cleanScore = parseInt(scoreString, 10);
            return isNaN(cleanScore) ? 10 : cleanScore;
        },
        
        getMod: (score) => {
            const cleanScore = parseInt(score, 10); 
            if (isNaN(cleanScore)) return 0; 
            return Math.floor((cleanScore - 10) / 2);
        },
        
        formatMod: (mod) => mod >= 0 ? `+${mod}` : `${mod}`,

        getPassiveSkill: function(core, statKey, skillKey) {
            const pb = core.combat_base?.proficiency_bonus || 2;
            const statMod = this.getMod(core.ability_scores?.[statKey] || 10);
            const skillProf = core.proficiencies?.skills?.[skillKey] || "None";
            const hasJoAT = core.class_features?.jack_of_all_trades || false; 
            
            let bonus = statMod;
            if (skillProf === "Expert") bonus += (pb * 2);
            else if (skillProf === "Prof") bonus += pb;
            else if (hasJoAT) bonus += Math.floor(pb / 2);
            
            return 10 + bonus;
        },
        
        // --- 3. STRING FORMATTING ---
        normalize: (str) => str ? str.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_') : "",

        // --- 4. META BIND UI GENERATORS ---
        createInput: (type, domain, propertyPath) => {
            return `\`INPUT[${type}:${FOLDER_PATH}/vaelin_${domain}.yaml.md#${propertyPath}]\``;
        },

        createButton: (command) => {
            return `\`BUTTON[${command}]\``;
        }, 

        capitalize: (str) => {
            if (!str) return "";
            return String(str).charAt(0).toUpperCase() + String(str).slice(1);
        }
    };
})();