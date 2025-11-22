import os
from pathlib import Path
from collections import defaultdict

vault_path = "/Users/stevelefler/Documents/Google_Drive/AI D&D/GemDM2"
github_base = "https://raw.githubusercontent.com/Smatek1001/AI_DnD/refs/heads/main/"
output_file = "AI_Index.md"

# Organize files by directory
file_tree = defaultdict(list)

for md_file in sorted(Path(vault_path).rglob("*.md")):
    if md_file.name == output_file:
        continue
    
    rel_path = md_file.relative_to(vault_path)
    parent = str(rel_path.parent) if str(rel_path.parent) != '.' else 'Root'
    file_tree[parent].append((md_file.stem, str(rel_path)))

# Write organized index
with open(os.path.join(vault_path, output_file), 'w') as f:
    f.write("# Campaign Files Index\n\n")
    f.write(f"**Base URL:** {github_base}\n\n")
    
    # Sort directories, but put 'Root' first
    sorted_dirs = sorted(file_tree.keys(), key=lambda x: ('', x) if x == 'Root' else ('~', x))
    
    for directory in sorted_dirs:
        if directory == 'Root':
            f.write("## Root Files\n\n")
        else:
            # Use directory depth for header level
            depth = directory.count(os.sep) + 2
            header = '#' * min(depth, 4)  # Cap at ####
            f.write(f"{header} {directory}/\n\n")
        
        for filename, rel_path in sorted(file_tree[directory]):
            github_url = github_base + str(rel_path).replace("\\", "/")
            f.write(f"- **{filename}** - [GitHub]({github_url})\n")
        
        f.write("\n")