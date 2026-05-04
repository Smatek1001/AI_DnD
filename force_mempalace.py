import chromadb
import os
import json
import re

print("🔨 Initiating Frontmatter-Driven Database Alignment...")

# Define paths
db_path = os.path.expanduser("~/.mempalace/palace")
config_path = os.path.expanduser("~/AI_DnD/Ω_HUD/Ω_HUD_scripts/mempalace_overrides.json")

# Connect to the local MemPalace database
client = chromadb.PersistentClient(path=db_path)
collection = client.get_collection("mempalace_drawers")

# Load the type mappings from the external JSON file
try:
    with open(config_path, 'r') as f:
        rules = json.load(f)
        type_mapping = rules.get("type_mapping", {})
except FileNotFoundError:
    print(f"❌ Error: Could not find configuration file at {config_path}")
    exit(1)

# Fetch all records from the database
results = collection.get(include=["metadatas", "documents"])
updates_made = 0

# Cache dictionary to avoid reading the same markdown file 15 times for 15 chunks
file_type_cache = {}

# Loop through the database chunks
for i in range(len(results["ids"])):
    meta = results["metadatas"][i]
    doc_id = results["ids"][i]
    source_file = meta.get("source_file", "")
    current_room = meta.get("room", "")
    
    if not source_file.endswith(".md") or not os.path.exists(source_file):
        continue

    # Extract the YAML type (and cache it so we only read the hard drive once per file)
    yaml_type = None
    if source_file in file_type_cache:
        yaml_type = file_type_cache[source_file]
    else:
        try:
            with open(source_file, "r", encoding="utf-8") as f:
                content = f.read()
            # Regex to grab the frontmatter block
            fm_match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
            if fm_match:
                frontmatter = fm_match.group(1)
                # Regex to find 'type: something'
                type_match = re.search(r"^type:\s*([a-zA-Z0-9_]+)", frontmatter, re.MULTILINE)
                if type_match:
                    yaml_type = type_match.group(1).strip()
            
            file_type_cache[source_file] = yaml_type
        except Exception as e:
            print(f"⚠️ Could not read {source_file}: {e}")
            file_type_cache[source_file] = None

    # If we successfully extracted a type, check it against the JSON map
    if yaml_type and yaml_type in type_mapping:
        expected_room = type_mapping[yaml_type]
        
        # Apply the override if the database got it wrong
        if current_room != expected_room:
            meta["room"] = expected_room
            
            # Push the corrected metadata back into the database
            collection.update(
                ids=[doc_id],
                metadatas=[meta]
            )
            updates_made += 1
            
            filename = source_file.split('/')[-1]
            print(f"✅ Realigned chunk of '{filename}' (type: {yaml_type}) -> '{expected_room}'")

if updates_made == 0:
    print("🛡️ Frontmatter Sync Complete. Database is perfectly aligned.")
else:
    print(f"🎉 Architecture Enforced! {updates_made} database chunks successfully relocated based on YAML.")
