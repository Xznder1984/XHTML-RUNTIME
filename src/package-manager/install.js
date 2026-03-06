const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const packagesDir = 'packages';

function installPackage(packageName) {
    console.log(chalk.blue(`Attempting to install package: ${packageName}`));

    if (!fs.existsSync(packagesDir)) {
        fs.mkdirSync(packagesDir);
    }

    // In a real scenario, this would fetch from a remote registry.
    // Here, we'll simulate it by creating a dummy package file.
    const packagePath = path.join(packagesDir, `${packageName}.lua`);
    const packageContent = `-- ${packageName} package
-- Installed at ${new Date().toISOString()}`;

    fs.writeFileSync(packagePath, packageContent);

    console.log(chalk.green(`Successfully installed ${packageName} to ${packagesDir}/`));
}

module.exports = { installPackage };
