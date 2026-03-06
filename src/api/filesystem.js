const fs = require('fs');
const path = require('path');

/**
 * Ensures a directory exists, creating it if it doesn't.
 * @param {string} dirPath The path to the directory.
 */
function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Reads a file, returning its content or null if it doesn't exist.
 * @param {string} filePath The path to the file.
 * @returns {string|null}
 */
function readFile(filePath) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    return null;
}

/**
 * Writes content to a file.
 * @param {string} filePath The path to the file.
 * @param {string} content The content to write.
 */
function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    ensureDirExists(dir);
    fs.writeFileSync(filePath, content);
}

module.exports = {
    ensureDirExists,
    readFile,
    writeFile,
};
