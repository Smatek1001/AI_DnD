#!/bin/bash
set -e          # Exit immediately if a command exits with a non-zero status
set -u          # Treat unset variables as an error
set -o pipefail # Return the exit code of the last command in a pipe that failed

# ==========================================
# GemDM RAG Staging & Mining Pipeline v4
# ==========================================

# 1. Define Paths
SOURCE_VAULT="$HOME/AI_DnD/"
STAGING_DIR="$HOME/AI_DnD-MemPalace_Staging/"
IGNORE_FILE="${SOURCE_VAULT}.mempalaceignore"

# This ensures the staging directory exists before we try to sync or mine it.
mkdir -p "$STAGING_DIR"

echo "🚀 Starting RAG Staging Sync..."

# 2. Sync with Failsafe Logic
if [ -f "$IGNORE_FILE" ]; then
    echo "📄 Found .mempalaceignore. Applying dynamic exclusion rules..."
    rsync -av --delete --exclude-from="$IGNORE_FILE" "$SOURCE_VAULT" "$STAGING_DIR"
else
    echo "⚠️ WARNING: .mempalaceignore not found in root! Falling back to default hardcoded exclusions..."
    rsync -av --delete \
      --exclude='Ω_*' \
      --exclude='.git/' \
      --exclude='.obsidian/' \
      --exclude='.DS_Store' \
      "$SOURCE_VAULT" "$STAGING_DIR"
fi

echo "✅ Sync complete. Sanitized vault created."

# 2.5 The Scrubber [CURRENTLY DISABLED FOR PERFORMANCE]
# echo "🧽 Scrubbing rogue 'type:' tags from staging body text..."
# python3 -c '
# import os, re
# staging_dir = "'"$STAGING_DIR"'"
# for root, dirs, files in os.walk(staging_dir):
#     for f in files:
#         if f.endswith(".md"):
#             p = os.path.join(root, f)
#             with open(p, "r", encoding="utf-8") as file:
#                 content = file.read()
#             match = re.match(r"^(---\n.*?\n---\n)(.*)", content, re.DOTALL)
#             if match:
#                 frontmatter = match.group(1)
#                 body = match.group(2)
#                 new_body = body.replace("type:", "type")
#                 with open(p, "w", encoding="utf-8") as file:
#                     file.write(frontmatter + new_body)
# '
# echo "✅ Scrubbing complete. Body text neutered."

# 3. Trigger the MemPalace Miner
echo "⛏️ Instructing MemPalace to mine the staging directory..."
cd "$STAGING_DIR"

# Using your verified absolute python path
/Library/Frameworks/Python.framework/Versions/3.12/bin/mempalace mine .

echo "🎉 Mining complete! Triggering final Database overrides..."

# 4. Trigger the Brute Force Override
/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 "$SOURCE_VAULT/force_mempalace.py"

echo "🏁 Database Pipeline Execution Fully Complete!"