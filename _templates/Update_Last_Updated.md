<%*
const file = app.workspace.getActiveFile(); // Get the currently active note
if (!file) {
    new Notice("No active file open to update. Please open a note.");
    return;
}

// Read the current content of the file
let content = await app.vault.read(file);

// Define the regular expression to find the 'last_updated' line.
// This regex now looks for 'last_updated:' followed by:
// - an optional quote,
// - any characters (the date string),
// - an optional closing quote.
// This makes it match whether the date is quoted or not.
const oldDateRegex = /^last_updated:\s*(?:".*?"|[^"\s]+)\s*$/m;

// Get the current date and time in the desired ISO 8601 format
const newDate = tp.date.now("YYYY-MM-DDTHH:mm:ss");

// Construct the new line to replace the old one (now without quotes around the date)
const replacementLine = `last_updated: ${newDate}`;

// Check if the 'last_updated' line exists in the content
if (oldDateRegex.test(content)) {
    // Replace the old line with the new timestamp line
    content = content.replace(oldDateRegex, replacementLine);
    // Write the modified content back to the file
    await app.vault.modify(file, content);
    new Notice("Last updated timestamp successfully updated (unquoted ISO 8601 format)!");
} else {
    // If the 'last_updated' line isn't found, notify the user.
    new Notice("The 'last_updated' field was not found in the frontmatter. Please ensure it exists in a recognized format (e.g., last_updated: YYYY-MM-DDTHH:mm:ss or last_updated: \"YYYY-MM-DDTHH:mm:ss\").");
}
_%>