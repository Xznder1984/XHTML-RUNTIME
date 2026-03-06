const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const { compile } = require('../compiler/compiler');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // A preload script is still good practice for context isolation
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the pre-compiled HTML file.
  // In a packaged app, this will be in the `resources/app/dist` directory.
  const indexPath = path.join(__dirname, '..', '..', 'dist', 'index.html');
  win.loadFile(indexPath);
}

function buildElectronApp() {
    console.log(chalk.blue('Starting Electron build process...'));

    // 1. Ensure the preload script exists.
    const preloadPath = path.join(__dirname, 'preload.js');
    if (!fs.existsSync(preloadPath)) {
        fs.writeFileSync(preloadPath, '// Electron preload script');
    }

    // 2. Compile the XHTML source to the dist folder.
    console.log(chalk.yellow('Compiling XHTML for Electron...'));
    compile('index.xhtml', 'dist/index.html');
    
    // 3. Run electron-builder to package the app.
    console.log(chalk.yellow('Running electron-builder...'));
    const builder = exec('npm run package');

    builder.stdout.on('data', (data) => console.log(chalk.gray(data)));
    builder.stderr.on('data', (data) => console.error(chalk.red(data)));
    builder.on('close', (code) => {
        if (code === 0) {
            console.log(chalk.green('Electron app built successfully!'));
        } else {
            console.error(chalk.red(`Electron builder failed with code ${code}`));
        }
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

module.exports = { buildElectronApp };
