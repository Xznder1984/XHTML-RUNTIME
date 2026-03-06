#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { compile } = require('./src/compiler/compiler');
const { startDevServer } = require('./src/dev-server/server');
const { generateProject } = require('./src/init/templates');
const { buildElectronApp } = require('./src/electron/main');
const { installPackage } = require('./src/package-manager/install');
const { publishPackage } = require('./src/package-manager/publish');

program.version(require('./package.json').version);

const xhtmlFile = 'index.xhtml';

program
  .command('init')
  .description('Create a new XHTML project')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action((options) => {
    generateProject(options.yes);
  });

program
  .command('build')
  .description('Compile .xhtml to .html')
  .action(() => {
    if (!fs.existsSync(xhtmlFile)) {
      console.error(chalk.red('No XHTML file found. Run: xhtml init'));
      process.exit(1);
    }
    compile(xhtmlFile, 'index.html');
    console.log(chalk.green('Build successful!'));
  });

program
  .command('dev')
  .description('Start the development server')
  .action(() => {
    if (!fs.existsSync(xhtmlFile)) {
      console.error(chalk.red('No XHTML file found. Run: xhtml init'));
      process.exit(1);
    }
    startDevServer();
  });

program
  .command('install <package>')
  .description('Install a package from XPM')
  .action((packageName) => {
    installPackage(packageName);
  });

program
  .command('publish')
  .description('Publish a package to XPM')
  .action(() => {
    publishPackage();
  });

program
  .command('electron')
  .description('Build an Electron app')
  .action(() => {
    if (!fs.existsSync(xhtmlFile)) {
      console.error(chalk.red('No XHTML file found. Run: xhtml init'));
      process.exit(1);
    }
    buildElectronApp();
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
