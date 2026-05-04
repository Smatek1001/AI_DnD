# 🕵️‍♂️ MemPalace Diagnostic Dashboard
*This dashboard audits the Vault's taxonomy before the MemPalace ingestion script runs. Ensure all tables are clean before syncing.*

---

## 🚨 Tier 1: Orphaned or Malformed Files
*Files here are missing critical YAML frontmatter (like `type` or `tags`) or are sitting loose in the root directory. MemPalace will struggle to categorize these.*

```dataview
TABLE file.folder AS "Current Location", type, tags
FROM ""
WHERE (length(file.tags) = 0 AND !type) OR file.folder = ""
AND !contains(file.folder, "Ω")
AND file.name != "!_Diagnostic_Dashboard"
SORT file.name ASC
```

---

## 🏢 Tier 2: The Folder Taxonomy (The "Rooms")

_This groups all your files by their physical folder. Review this to ensure no files were accidentally dragged into the wrong folder (e.g., an NPC sitting in the Locations folder)._

```dataview
TABLE WITHOUT ID
  key AS "Folder (MemPalace Room)",
  length(rows) AS "File Count",
  rows.file.link AS "Files"
FROM ""
WHERE file.name != "!_Diagnostic_Dashboard"
AND !contains(file.folder, "Ω")
GROUP BY file.folder
SORT key ASC
```

---

## 🔗 Tier 3: Location / Hierarchy Verification

_If you use a `location` or `faction` variable in your YAML to establish relationships, this table will catch typos (e.g., "Duskhaven" vs "Dusk Haven")._

```dataview
TABLE type, location, faction
FROM ""
WHERE location OR faction
AND !contains(file.folder, "Ω")
SORT location ASC, faction ASC
```
