const express = require('express');
const path = require('path');
const chokidar = require('chokidar');
const chalk = require('chalk');
const { compile } = require('../compiler/compiler');

const PORT = 3000;
const xhtmlFile = 'index.xhtml';
const compiledFile = 'index.html';

function startDevServer() {
    const app = express();
    const serverRoot = path.resolve(process.cwd());

    app.use(express.static(serverRoot));

    app.get('/', (req, res) => {
        compile(xhtmlFile, compiledFile);
        res.sendFile(path.join(serverRoot, compiledFile));
    });

    const server = app.listen(PORT, () => {
        console.log(chalk.blue(`Dev server running at http://localhost:${PORT}`));
        console.log(chalk.gray('Watching for changes in index.xhtml...'));
    });

    const watcher = chokidar.watch(xhtmlFile, {
        persistent: true,
    });

    watcher.on('change', (filePath) => {
        console.log(chalk.yellow(`
${filePath} changed. Recompiling...`));
        compile(xhtmlFile, compiledFile);
        console.log(chalk.green('Recompilation complete. Refresh your browser.'));
    });

    process.on('SIGINT', () => {
        console.log(chalk.red('
Shutting down dev server.'));
        watcher.close();
        server.close();
        process.exit();
    });
}

module.exports = { startDevServer };
