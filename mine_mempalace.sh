#!/bin/bash
set -e          # Exit immediately if a command exits with a non-zero status
set -u          # Treat unset variables as an error
set -o pipefail # Return the exit code of the last command in a pipe that failed

# ==========================================
# GemDM RAG Staging & Mining Pipeline v2
# ==========================================

# 1. Define Paths (Using $HOME to avoid tilde expansion bugs)
SOURCE_VAULT="$HOME/AI_DnD/"
STAGING_DIR="$HOME/AI_DnD-MemPalace_Staging/"
IGNORE_FILE="${SOURCE_VAULT}.mempalaceignore"

# --- NEW: DEFENSIVE LINE ---
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

# 3. Trigger the MemPalace Miner
echo "⛏️ Instructing MemPalace to mine the staging directory..."
cd "$STAGING_DIR"

# Using your verified absolute path
/Library/Frameworks/Python.framework/Versions/3.12/bin/mempalace mine .

echo "🎉 Mining complete!"