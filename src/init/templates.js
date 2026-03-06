const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');

const defaultXHTML = `<h1>Hello from XHTML!</h1>
<p>This is a standard HTML file with a twist.</p>

<lua>
-- You can write Lua code right in your HTML!
print("Hello from Lua! The time is " .. os.date())
</lua>

<style>
  body {
    font-family: sans-serif;
    text-align: center;
    padding: 2em;
    background-color: #f0f0f0;
  }
  h1 {
    color: #333;
  }
</style>
`;

const defaultJSON = {
  name: 'new-xhtml-project',
  version: '1.0.0',
  description: 'A new project using XHTML Runtime.',
  author: '',
};

function generateProject(skipPrompts) {
  const xhtmlPath = path.join(process.cwd(), 'index.xhtml');
  const jsonPath = path.join(process.cwd(), 'xhtml.json');

  if (fs.existsSync(xhtmlPath) || fs.existsSync(jsonPath)) {
    console.error(chalk.red('An index.xhtml or xhtml.json file already exists in this directory.'));
    process.exit(1);
  }

  if (skipPrompts) {
    createFiles(defaultJSON);
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const projectConfig = { ...defaultJSON };

  rl.question(`Project name: (${projectConfig.name}) `, (name) => {
    projectConfig.name = name || projectConfig.name;
    rl.question(`Version: (${projectConfig.version}) `, (version) => {
      projectConfig.version = version || projectConfig.version;
      rl.question('Description: ', (description) => {
        projectConfig.description = description || projectConfig.description;
        rl.question('Author: ', (author) => {
          projectConfig.author = author || projectConfig.author;
          rl.close();
          createFiles(projectConfig);
        });
      });
    });
  });
}

function createFiles(config) {
  fs.writeFileSync('index.xhtml', defaultXHTML.trim());
  fs.writeFileSync('xhtml.json', JSON.stringify(config, null, 2));
  console.log(chalk.green('XHTML project created successfully!'));
  console.log('Run `xhtml dev` to start the development server.');
}

module.exports = { generateProject };
