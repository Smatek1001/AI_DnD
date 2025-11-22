#!/usr/bin/env python3

import os
import re
import json
import hashlib
from pathlib import Path
from datetime import datetime
from textwrap import indent

CONFIG_FILE = "index_config.json"
CACHE_FILE = ".indexcache.json"


# ----------------------------------------------------
# Utility: Hash file content so we can detect changes
# ----------------------------------------------------
def hash_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        h.update(f.read())
    return h.hexdigest()


# ----------------------------------------------------
# Load config
# ----------------------------------------------------
def load_config():
    default = {
        "vault_path": ".",
        "repo_raw_base": "",
        "exclude_dirs": [".git", ".obsidian", "__pycache__"],
        "file_extensions": [".md"],
        "directory_priority": [],
        "emoji_presets": {
            "_Index": "📑",
            "important": "⭐"
        },
        "important_files": []
    }

    if not Path(CONFIG_FILE).exists():
        print(f"[WARN] {CONFIG_FILE} not found. Creating default.")
        with open(CONFIG_FILE, "w") as f:
            json.dump(default, f, indent=2)
        return default
    
    with open(CONFIG_FILE) as f:
        cfg = json.load(f)

    return {**default, **cfg}


# ----------------------------------------------------
# Extract description from file
# Order:
# 1. YAML frontmatter title
# 2. First H1 heading
# 3. First meaningful line/sentence
# ----------------------------------------------------
def extract_description(text: str):
    # YAML title: title: Something
    yaml_title = re.search(r"^title:\s*(.+)$", text, re.MULTILINE)
    if yaml_title:
        return yaml_title.group(1).strip()

    # First H1
    h1 = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
    if h1:
        return h1.group(1).strip()

    # First sentence
    para = re.search(r"\n\n([^#\n].+?)[.?!]\s", text, re.DOTALL)
    if para:
        line = para.group(1).strip()
        if len(line) < 120:  # to avoid grabbing full paragraphs
            return line

    return None


# ----------------------------------------------------
# Load or initialize cache
# ----------------------------------------------------
def load_cache():
    if not Path(CACHE_FILE).exists():
        return {}
    with open(CACHE_FILE) as f:
        return json.load(f)


def save_cache(cache):
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)


# ----------------------------------------------------
# Walk vault and collect index entries
# ----------------------------------------------------
def walk_vault(config, cache):
    vault = Path(config["vault_path"]).resolve()
    base_url = config["repo_raw_base"].rstrip("/") + "/"

    entries = {}
    updated_cache = {}

    for root, dirs, files in os.walk(vault, topdown=True):
        # Filter directories
        dirs[:] = [d for d in dirs if d not in config["exclude_dirs"]]

        rel_dir = Path(root).relative_to(vault)
        section = str(rel_dir) if str(rel_dir) != "." else "Root"

        for name in files:
            p = Path(root) / name
            if p.suffix not in config["file_extensions"]:
                continue

            rel_path = p.relative_to(vault)
            url = base_url + str(rel_path).replace(" ", "%20")

            # Check if content changed
            file_hash = hash_file(p)
            cached_hash = cache.get(str(rel_path))

            if cached_hash == file_hash:
                # Use cached description if available
                desc = cache.get(str(rel_path) + ":desc")
            else:
                with open(p, "r", encoding="utf-8") as f:
                    text = f.read()
                desc = extract_description(text)
            
            updated_cache[str(rel_path)] = file_hash
            updated_cache[str(rel_path) + ":desc"] = desc

            if section not in entries:
                entries[section] = []

            entries[section].append({
                "name": p.stem,
                "path": str(rel_path),
                "url": url,
                "desc": desc,
            })

    save_cache(updated_cache)
    return entries


# ----------------------------------------------------
# Sort directories using priority list
# ----------------------------------------------------
def sort_sections(sections, priority_list):
    # Put priority dirs first, in given order
    sorted_sections = []

    for p in priority_list:
        if p in sections:
            sorted_sections.append(p)

    # Then alphabetical remaining
    remaining = sorted(s for s in sections if s not in sorted_sections)
    return sorted_sections + remaining


# ----------------------------------------------------
# Generate Markdown output
# ----------------------------------------------------
def generate_markdown(entries, config):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    md = []

    md.append("# Campaign Files Index\n")
    md.append("This index is automatically generated.\n\n")

    for section in sort_sections(entries.keys(), config["directory_priority"]):
        md.append(f"## {section}\n")

        for e in sorted(entries[section], key=lambda x: x["name"].lower()):
            star = config["emoji_presets"].get("important", "")
            is_imp = e["name"] in config["important_files"]
            icon = config["emoji_presets"].get("_Index", "")

            md.append(f"- **{e['name']}** {'⭐' if is_imp else ''}"
                      f" - {e['desc'] if e['desc'] else ''}"
                      f" - [GitHub]({e['url']})")

        md.append("")  # blank line

    md.append(f"\n---\nGenerated: {now}\n")
    return "\n".join(md)


# ----------------------------------------------------
# Main
# ----------------------------------------------------
def main():
    config = load_config()
    cache = load_cache()
    entries = walk_vault(config, cache)
    markdown = generate_markdown(entries, config)

    with open("AI_Index.md", "w", encoding="utf-8") as f:
        f.write(markdown)

    print("Index generated successfully.")


if __name__ == "__main__":
    main()
