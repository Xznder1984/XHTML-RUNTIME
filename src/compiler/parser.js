const fs = require('fs');

function parseXHTML(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const luaScripts = [];
    const htmlParts = [];
    let lastIndex = 0;

    const regex = /<lua>([\s\S]*?)<\/lua>/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        // Add HTML content before the <lua> tag
        htmlParts.push(content.substring(lastIndex, match.index));
        // Store Lua script content
        luaScripts.push(match[1].trim());
        // Update lastIndex to the position after the </lua> tag
        lastIndex = match.index + match[0].length;
    }

    // Add the remaining HTML content after the last <lua> tag
    htmlParts.push(content.substring(lastIndex));

    return {
        htmlContent: htmlParts.join(''),
        luaScripts,
    };
}

module.exports = { parseXHTML };
