import chromadb
import os
import json

print("🔨 Initiating Database Brute Force...")

# Define paths
db_path = os.path.expanduser("~/.mempalace/palace")
config_path = os.path.expanduser("~/AI_DnD/Ω_HUD/Ω_HUD_scripts/mempalace_overrides.json")

# Connect to the local MemPalace database
client = chromadb.PersistentClient(path=db_path)
collection = client.get_collection("mempalace_drawers")

# Load the hit list from the external JSON file
try:
    with open(config_path, 'r') as f:
        hit_list = json.load(f)
except FileNotFoundError:
    print(f"❌ Error: Could not find configuration file at {config_path}")
    exit(1)

# Fetch all records from the database
results = collection.get(include=["metadatas", "documents"])
updates_made = 0

# Loop through the database and overwrite the metadata
for i in range(len(results["ids"])):
    meta = results["metadatas"][i]
    doc_id = results["ids"][i]
    source_file = meta.get("source_file", "")
    
    # Check if this chunk belongs to a file on our hit list
    for target_file, target_room in hit_list.items():
        if target_file in source_file:
            # Only update if it's currently in the wrong room
            if meta.get("room") != target_room:
                meta["room"] = target_room
                
                # Push the forcefully corrected metadata back into the database
                collection.update(
                    ids=[doc_id],
                    metadatas=[meta]
                )
                updates_made += 1
                print(f"✅ Forced chunk of '{target_file}' into '{target_room}'")

if updates_made == 0:
    print("🛡️ No overrides needed. Database is already perfectly aligned.")
else:
    print(f"🎉 Override Complete! {updates_made} database chunks successfully relocated.")