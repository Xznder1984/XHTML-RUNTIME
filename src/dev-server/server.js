const express = require('express');
const path = require('path');
const chokidar = require('chokidar');
const chalk = require('chalk');
const fs = require('fs');
const os = require('os');
const notifier = require('node-notifier');
const { compile } = require('../compiler/compiler');

const PORT = 3000;
const xhtmlFile = 'index.xhtml';
const compiledFile = 'index.html';

function startDevServer() {
    const app = express();
    app.use(express.json()); // Middleware to parse JSON bodies
    const serverRoot = path.resolve(process.cwd());

    // --- API Endpoints for the XHTML Runtime ---

    // Filesystem API
    app.post('/api/fs/read', (req, res) => {
        const filePath = path.join(serverRoot, req.body.path);
        // Security: a real app would need more robust sandboxing
        if (!filePath.startsWith(serverRoot)) {
            return res.status(403).send({ error: 'Access denied' });
        }
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            res.send({ content: data });
        });
    });

    // OS API
    app.get('/api/os/info', (req, res) => {
        res.send({
            platform: os.platform(),
            release: os.release(),
            arch: os.arch(),
            cpus: os.cpus().length,
        });
    });

    app.post('/api/os/notify', (req, res) => {
        const { title, message } = req.body;
        notifier.notify({
            title: title || 'XHTML Runtime',
            message: message || 'Notification from your app!',
        });
        res.status(200).send({ success: true });
    });

    // --- Dev Server and File Serving ---
    app.use(express.static(serverRoot));

    app.get('/', (req, res) => {
        compile(xhtmlFile, compiledFile); // Re-compile on every root request
        res.sendFile(path.join(serverRoot, compiledFile));
    });

    const server = app.listen(PORT, () => {
        console.log(chalk.blue(`Dev server running at http://localhost:${PORT}`));
        console.log(chalk.gray('Watching for changes...'));
    });

    const watcher = chokidar.watch(xhtmlFile, { persistent: true });

    watcher.on('change', (filePath) => {
        console.log(chalk.yellow(`${filePath} changed. Recompiling...`));
        compile(xhtmlFile, compiledFile);
    });
}

module.exports = { startDevServer };
