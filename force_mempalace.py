import chromadb
import os
import json

print("🔨 Initiating Dynamic Database Override...")

# Define paths
db_path = os.path.expanduser("~/.mempalace/palace")
config_path = os.path.expanduser("~/AI_DnD/Ω_HUD/Ω_HUD_scripts/mempalace_overrides.json")

# Connect to the local MemPalace database
client = chromadb.PersistentClient(path=db_path)
collection = client.get_collection("mempalace_drawers")

# Load the rules from the external JSON file
try:
    with open(config_path, 'r') as f:
        rules = json.load(f)
        exact_matches = rules.get("exact_matches", {})
        pattern_matches = rules.get("pattern_matches", {})
except FileNotFoundError:
    print(f"❌ Error: Could not find configuration file at {config_path}")
    exit(1)

# Fetch all records from the database
results = collection.get(include=["metadatas", "documents"])
updates_made = 0

# Loop through the database chunks
for i in range(len(results["ids"])):
    meta = results["metadatas"][i]
    doc_id = results["ids"][i]
    source_file = meta.get("source_file", "")
    current_room = meta.get("room", "")
    
    target_room = None

    # 1. Check for Exact Matches first
    for target_file, room in exact_matches.items():
        if target_file in source_file:
            target_room = room
            break

    # 2. Check for Pattern Matches if no exact match was found
    if not target_room:
        for pattern, room in pattern_matches.items():
            if pattern in source_file:
                target_room = room
                break

    # 3. Apply the update ONLY if it is in the wrong room
    if target_room and current_room != target_room:
        meta["room"] = target_room
        
        # Push the forcefully corrected metadata back into the database
        collection.update(
            ids=[doc_id],
            metadatas=[meta]
        )
        updates_made += 1
        
        # Extract just the filename for a cleaner console printout
        filename = source_file.split('/')[-1]
        print(f"✅ Routed chunk of '{filename}' into '{target_room}'")

if updates_made == 0:
    print("🛡️ No overrides needed. Database is perfectly aligned.")
else:
    print(f"🎉 Override Complete! {updates_made} database chunks successfully relocated.")