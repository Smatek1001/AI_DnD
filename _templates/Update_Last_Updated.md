<%*
const file = app.workspace.getActiveFile(); // Get the currently active note
if (!file) {
    new Notice("No active file open to update. Please open a note.");
    return;
}

// Read the current content of the file
let content = await app.vault.read(file);

// Regex to find the 'last_updated' line, accommodating various formats:
// - Quoted strings (e.g., "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DDTHH:mm:ss" or "any text")
// - Unquoted specific date formats (YYYY-MM-DD HH:mm:ss or YYYY-MM-DDTHH:mm:ss)
// - Other unquoted non-whitespace strings
const lineFinderRegex = /^last_updated:\s*(?:"[^"]*"|\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}|[^\s"]+)\s*$/m;

// Get the current date and time in the desired new ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
const newDate = tp.date.now("YYYY-MM-DDTHH:mm:ss");

// Construct the replacement line in the new format (unquoted)
const replacementLine = `last_updated: ${newDate}`;

// Check if a 'last_updated' line exists in any recognizable format
if (lineFinderRegex.test(content)) {
    // Replace the found line (whatever its old format was) with the new timestamp line
    content = content.replace(lineFinderRegex, replacementLine);
    // Write the modified content back to the file
    await app.vault.modify(file, content);
    new Notice("Last updated timestamp successfully updated to unquoted ISO 8601 format (YYYY-MM-DDTHH:mm:ss)!");
} else {
    // If the 'last_updated' line isn't found at all, notify the user.
    // Updated message to be more generic about the expected field name.
    new Notice("The 'last_updated' field was not found or its format was not recognized. Please ensure the line starts with 'last_updated:'.");
}
_%>