const fs = require('fs');
const path = require('path');
const { parseXHTML } = require('./parser');
const { createLuaEngine } = require('./luaEngine');

function compile(inputFile, outputFile) {
  try {
    const { htmlContent, luaScripts } = parseXHTML(inputFile);
    const luaEngineScript = createLuaEngine(luaScripts);

    const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XHTML Runtime</title>
    <script src="https://cdn.jsdelivr.net/npm/fengari-web@0.1.4/dist/fengari-web.js"></script>
</head>
<body>
    ${htmlContent}
    ${luaEngineScript}
    <script src="runtime.js"></script>
</body>
</html>`;

    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, finalHtml.trim());

    // Also copy the core runtime file
    const runtimeSrc = path.join(__dirname, '..', 'core', 'runtime.js');
    const runtimeDest = path.join(outputDir, 'runtime.js');
    fs.copyFileSync(runtimeSrc, runtimeDest);

  } catch (error) {
    console.error(`Error during compilation: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { compile };
