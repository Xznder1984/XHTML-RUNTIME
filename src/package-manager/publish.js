const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const chalk = require('chalk');

function publishPackage() {
    console.log(chalk.blue('Attempting to publish package...'));

    const manifestPath = 'xhtml.json';
    if (!fs.existsSync(manifestPath)) {
        console.error(chalk.red('No xhtml.json manifest found. Are you in a project root?'));
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const packageName = manifest.name || 'package';
    const version = manifest.version || '1.0.0';
    const archiveName = `${packageName}-${version}.zip`;

    const output = fs.createWriteStream(archiveName);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    output.on('close', () => {
        console.log(chalk.green(`Package ${archiveName} created successfully.`));
        console.log(`Total size: ${(archive.pointer() / 1024).toFixed(2)} KB`);
        console.log('In a real scenario, this file would now be uploaded to a registry.');
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    // Add files to be packaged
    archive.file('index.xhtml', { name: 'index.xhtml' });
    archive.file('xhtml.json', { name: 'xhtml.json' });

    archive.finalize();
}

module.exports = { publishPackage };
