import os
from pathlib import Path

vault_path = "/Users/stevelefler/Documents/Google_Drive/AI D&D/GemDM2"
github_base = "https://raw.githubusercontent.com/Smatek1001/AI_DnD/refs/heads/main/"
output_file = "AI_Index.md"

with open(os.path.join(vault_path, output_file), 'w') as f:
    f.write("# Campaign Files Index\n\n")
    
    for md_file in sorted(Path(vault_path).rglob("*.md")):
        if md_file.name == output_file:
            continue
            
        rel_path = md_file.relative_to(vault_path)
        title = md_file.stem
        github_url = github_base + str(rel_path).replace("\\", "/")
        
        # Read first few lines or YAML frontmatter for description
        with open(md_file, 'r', encoding='utf-8') as content:
            first_line = content.readline().strip()
            description = first_line if first_line.startswith('#') else "No description"
        
        f.write(f"- **{title}**: {description}\n")
        f.write(f"  - GitHub: {github_url}\n\n")