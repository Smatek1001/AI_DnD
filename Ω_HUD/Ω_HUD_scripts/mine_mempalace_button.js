try {
    // 1. Create the UI Elements
    const wrapper = dv.container.createEl("div", { style: "margin-top: 10px;" });
    const btn = wrapper.createEl("button", { text: "⛏️ Sync & Mine MemPalace" });
    
    // Default Styling
    btn.setAttribute("style", "background: #f39c12; color: white; font-weight: bold; padding: 10px 20px; border-radius: 5px; cursor: pointer; border: none; font-size: 1.1em; width: 100%;");

    // 2. The Execution Logic
    btn.addEventListener("click", async () => {
        btn.innerText = "⏳ Syncing & Mining...";
        btn.style.opacity = "0.7";
        
        // Grab the native Node.js execution module
        const { exec } = require('child_process');
        
        // Dynamically get the absolute path to your vault (so it works anywhere!)
        const vaultPath = app.vault.adapter.getBasePath();
        const scriptPath = `${vaultPath}/mine_mempalace.sh`;
        
        // Execute the bash script
        exec(`bash "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                // If 'set -e' is active, this will now catch the mempalace failure!
                new Notice(`❌ Mining Failed: Check Console`);
                console.error("Full Error:", stderr);
                btn.innerText = "⚠️ Error (Check Console)";
                btn.style.background = "#e74c3c";
                btn.style.opacity = "1"; // 🛠️ ARCHITECT FIX: Reset opacity on error
                return;
            }
            
            // Success State!
            // We now show the ACTUAL terminal output in a Notice so you can verify it mined.
            new Notice(`✅ ${stdout.split('\n').slice(-2).join(' ')}`, 10000); 
            console.log("MemPalace Output:", stdout);
            
            btn.innerText = "✅ Database Updated!";
            btn.style.background = "#70e000";
            btn.style.opacity = "1"; // 🛠️ ARCHITECT FIX: Reset opacity on success
            
            setTimeout(() => {
                btn.innerText = "⛏️ Sync & Mine MemPalace";
                btn.style.background = "#f39c12";
            }, 3000);
        });
    });

} catch (e) {
    dv.container.createEl("div", { text: `❌ ERROR: ${e.message}`, style: "color: red;" });
}