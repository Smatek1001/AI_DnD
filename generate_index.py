import os
from pathlib import Path
from collections import defaultdict
import re

vault_path = "/Users/stevelefler/Documents/Google_Drive/AI D&D/GemDM2"
github_base = "https://raw.githubusercontent.com/Smatek1001/AI_DnD/refs/heads/main/"
output_file = "AI_Index.md"

# Files to mark as important (exclude templates)
key_files = {
    "00_Campaign_Index",
    "01_Current_Session_Context",
    "DM_Instructions",
    "House_Rules",
    "Campaign_Goals",
    "Campaign_Narrative"
}

# Files that are index files (should be listed first in each directory)
index_files_patterns = ["_Index", "_index"]

def extract_description(file_path):
    """Extract description from first heading or YAML frontmatter."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Skip template files entirely
            if '{{date:' in content or '<%*' in content or file_path.parts[-2] == '_templates':
                return ""
            
            # Try YAML frontmatter first
            yaml_match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
            if yaml_match:
                yaml_content = yaml_match.group(1)
                # Look for description field, but skip metadata fields
                desc_match = re.search(r'description:\s*["\']?([^"\'\n]+)["\']?', yaml_content)
                if desc_match:
                    desc = desc_match.group(1).strip()
                    # Skip if it's just metadata
                    if not desc.startswith('last_updated') and not desc.startswith('{{'):
                        return desc
            
            # Remove YAML frontmatter from content for further parsing
            content = re.sub(r'^---\s*\n.*?\n---\s*\n', '', content, flags=re.DOTALL)
            
            # Fall back to first heading or paragraph
            lines = content.split('\n')
            for i, line in enumerate(lines):
                line = line.strip()
                # Skip empty lines, comments, and metadata
                if not line or line.startswith('<!--') or line.startswith('last_updated'):
                    continue
                    
                if line.startswith('#'):
                    heading = line.lstrip('#').strip()
                    # If it's just the filename, try to get next meaningful line
                    if heading.replace('_', ' ').lower() != file_path.stem.replace('_', ' ').lower():
                        return heading
                    # Look for a subtitle or first paragraph
                    for next_line in lines[i+1:i+5]:
                        next_line = next_line.strip()
                        if next_line and not next_line.startswith('#') and not next_line.startswith('<!--'):
                            return next_line[:80] + ('...' if len(next_line) > 80 else '')
                elif line and not line.startswith('---'):
                    # First non-empty, non-heading line
                    return line[:80] + ('...' if len(line) > 80 else '')
    except Exception as e:
        pass
    return ""

# Organize files by directory
file_tree = defaultdict(list)
dir_file_counts = defaultdict(int)

for md_file in sorted(Path(vault_path).rglob("*.md")):
    if md_file.name == output_file:
        continue
    
    rel_path = md_file.relative_to(vault_path)
    parent = str(rel_path.parent) if str(rel_path.parent) != '.' else 'Root'
    
    description = extract_description(md_file)
    # Don't mark templates as key files
    is_key = md_file.stem in key_files and '_templates' not in md_file.parts
    is_index = any(pattern in md_file.stem for pattern in index_files_patterns)
    
    file_tree[parent].append((md_file.stem, str(rel_path), description, is_key, is_index))
    dir_file_counts[parent] += 1

# Build category map for quick navigation
category_map = {}
for directory in file_tree.keys():
    if directory == 'Root':
        continue
    top_level = directory.split(os.sep)[0]
    if top_level not in category_map:
        category_map[top_level] = []
    if directory == top_level:
        category_map[top_level].insert(0, directory)
    else:
        category_map[top_level].append(directory)

# Write organized index
with open(os.path.join(vault_path, output_file), 'w') as f:
    f.write("# Campaign Files Index\n\n")
    
    f.write("This index catalogs all files in the Duskhaven D&D campaign repository. ")
    f.write("Files are organized by type with descriptions and direct links to GitHub sources.\n\n")
    
    f.write(f"**Base URL:** {github_base}\n\n")
    
    # Quick navigation
    f.write("**Quick Navigation:**\n")
    nav_categories = []
    for cat in sorted(category_map.keys()):
        # Create anchor from category name
        anchor = cat.lower().replace('_', '')
        nav_categories.append(f"- [{cat}](#{anchor})")
    f.write('\n'.join(nav_categories))
    f.write("\n\n---\n\n")
    
    # Sort directories, but put 'Root' first
    sorted_dirs = sorted(file_tree.keys(), key=lambda x: ('', x) if x == 'Root' else ('~', x))
    
    for directory in sorted_dirs:
        file_count = dir_file_counts[directory]
        
        if directory == 'Root':
            f.write(f"## Root Files ({file_count} files)\n\n")
        else:
            # Use directory depth for header level
            depth = directory.count(os.sep) + 2
            header = '#' * min(depth, 4)  # Cap at ####
            f.write(f"{header} {directory}/ ({file_count} files)\n\n")
        
        for filename, rel_path, description, is_key, is_index in sorted(file_tree[directory], key=lambda x: (not x[4], x[0])):
            github_url = github_base + str(rel_path).replace("\\", "/")
            
            # Build the line
            key_marker = " ⭐" if is_key else ""
            index_marker = " 📑" if is_index else ""
            if description:
                f.write(f"- **{filename}**{key_marker}{index_marker} - {description} - [GitHub]({github_url})\n")
            else:
                f.write(f"- **{filename}**{key_marker}{index_marker} - [GitHub]({github_url})\n")
        
        f.write("\n")
    
    # Add footer with generation timestamp
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    f.write(f"\n---\n\n*Index generated: {timestamp}*\n")

print(f"Index generated successfully at {output_file}")
print(f"Total files indexed: {sum(dir_file_counts.values())}")
print(f"Total directories: {len(file_tree)}")