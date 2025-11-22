#!/usr/bin/env python3

import os
import re
import json
import hashlib
import argparse
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
def walk_vault(config, cache, force_refresh=False):
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
            
            # Skip the index file itself
            if p.name == "AI_Index.md":
                continue

            rel_path = p.relative_to(vault)
            url = base_url + str(rel_path).replace(" ", "%20")

            # Check if content changed (or force refresh)
            file_hash = hash_file(p)
            cached_hash = cache.get(str(rel_path))

            if not force_refresh and cached_hash == file_hash:
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

            # Check if this is an index file or important file
            is_index = "_Index" in p.stem or "_index" in p.stem
            is_important = p.stem in config["important_files"]

            entries[section].append({
                "name": p.stem,
                "path": str(rel_path),
                "url": url,
                "desc": desc,
                "is_index": is_index,
                "is_important": is_important,
            })

    save_cache(updated_cache)
    return entries


# ----------------------------------------------------
# Group subdirectories with their parents
# ----------------------------------------------------
def group_hierarchical_sections(sections):
    """Group sections so that parent/child relationships are maintained"""
    # Separate into root-level and nested
    root_sections = {}
    
    for section in sections:
        parts = section.split('/')
        
        if len(parts) == 1:
            # Root level section
            if section not in root_sections:
                root_sections[section] = {'files': sections[section], 'children': {}}
        else:
            # Nested section - find or create parent hierarchy
            current = root_sections
            for i, part in enumerate(parts):
                path_so_far = '/'.join(parts[:i+1])
                
                if i == len(parts) - 1:
                    # This is the final part - add the actual data
                    if part not in current:
                        current[part] = {'files': sections[section], 'children': {}}
                    else:
                        current[part]['files'] = sections[section]
                else:
                    # Intermediate part - ensure structure exists
                    if part not in current:
                        current[part] = {'files': sections.get(path_so_far, []), 'children': {}}
                    current = current[part]['children']
    
    return root_sections


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
# Generate Markdown output recursively
# ----------------------------------------------------
def write_section(section_name, section_data, config, level=2):
    """Recursively write a section and its children"""
    md = []
    header = "#" * level
    
    # Count total files in this section and all children
    def count_files(data):
        count = len(data['files'])
        for child in data['children'].values():
            count += count_files(child)
        return count
    
    total_count = count_files(section_data)
    
    md.append(f"{header} {section_name} ({total_count} files)\n")
    
    # Sort files: index files first, then alphabetically
    files = sorted(section_data['files'], 
                   key=lambda x: (not x.get('is_index', False), x['name'].lower()))
    
    for e in files:
        star = config["emoji_presets"].get("important", "") if e.get('is_important') else ""
        index_emoji = config["emoji_presets"].get("_Index", "") if e.get('is_index') else ""
        
        emoji_str = f"{star}{index_emoji}" if (star or index_emoji) else ""
        emoji_str = f" {emoji_str}" if emoji_str else ""
        
        md.append(f"- **{e['name']}**{emoji_str}"
                  f" - {e['desc'] if e['desc'] else ''}"
                  f" - [GitHub]({e['url']})")
    
    md.append("")  # blank line
    
    # Recursively write children
    if section_data['children']:
        for child_name in sorted(section_data['children'].keys()):
            child_md = write_section(child_name, section_data['children'][child_name], 
                                    config, level + 1)
            md.extend(child_md)
    
    return md


# ----------------------------------------------------
# Generate Markdown output
# ----------------------------------------------------
def generate_markdown(entries, config):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    md = []

    md.append("# Campaign Files Index\n")
    md.append("This index is automatically generated.\n\n")

    # Calculate quick reference stats
    total_files = sum(len(files) for files in entries.values())
    key_files = config.get("important_files", [])
    
    # Count by category
    category_counts = {}
    for section, files in entries.items():
        # Get top-level category name
        top_level = section.split('/')[0]
        if top_level not in category_counts:
            category_counts[top_level] = 0
        category_counts[top_level] += len(files)
    
    # Quick Reference section
    md.append("## Quick Reference\n")
    md.append(f"- **Last Updated**: {now}")
    md.append(f"- **Total Files**: {total_files} across {len(entries)} directories")
    
    # Key files
    if key_files:
        key_file_list = ", ".join(key_files)
        md.append(f"- **Key Files**: {key_file_list}")
    
    # Category breakdown (show most relevant categories)
    relevant_cats = ['Characters/NPCs', 'Locations', 'Quests', 'Items', 'Factions', 'Session_Logs']
    cat_stats = []
    for cat in relevant_cats:
        if cat in category_counts:
            cat_name = cat.split('/')[-1]  # Get just the last part
            cat_stats.append(f"{cat_name}: {category_counts[cat]}")
    
    if cat_stats:
        md.append(f"- **Categories**: {' | '.join(cat_stats)}")
    
    md.append("\n")
    
    # Search tips for LLMs - MOVED TO TOP
    md.append("## How to Use This Index (For LLMs)\n")
    md.append("- **Index files** (📑) contain overviews and summaries of their categories")
    md.append("- **Important files** (⭐) contain core campaign information and should be prioritized")
    md.append("- Files are grouped hierarchically - check parent sections for context")
    md.append("- All GitHub links point to raw markdown files for easy fetching")
    md.append("- When searching for information:")
    md.append("  - Check the relevant _Index file first for an overview")
    md.append("  - Use file descriptions to identify the most relevant sources")
    md.append("  - Important files (⭐) often contain cross-references to other files")
    md.append("\n")

    # Group hierarchical sections
    grouped = group_hierarchical_sections(entries)
    
    # Sort root level sections by priority
    priority = config.get("directory_priority", [])
    sorted_roots = sort_sections(list(grouped.keys()), priority)
    
    for section_name in sorted_roots:
        section_data = grouped[section_name]
        md.extend(write_section(section_name, section_data, config))

    md.append(f"\n---\n*Generated: {now}*\n")
    
    return "\n".join(md)


# ----------------------------------------------------
# Main
# ----------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description='Generate campaign file index')
    parser.add_argument('--force', action='store_true', 
                       help='Force regeneration of all descriptions, ignoring cache')
    args = parser.parse_args()
    
    config = load_config()
    cache = load_cache() if not args.force else {}
    
    if args.force:
        print("⚠️  Force refresh enabled - regenerating all descriptions")
    
    entries = walk_vault(config, cache, force_refresh=args.force)
    markdown = generate_markdown(entries, config)

    with open("AI_Index.md", "w", encoding="utf-8") as f:
        f.write(markdown)

    print("✓ Index generated successfully.")


if __name__ == "__main__":
    main()