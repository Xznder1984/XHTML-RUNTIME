const { exec } = require('child_process');
const chalk = require('chalk');

/**
 * Executes a shell command and logs its output.
 * @param {string} command The command to execute.
 * @param {string} description A description of the command's purpose.
 * @returns {Promise<void>}
 */
function runCommand(command, description) {
    console.log(chalk.blue(`Executing: ${description}`));
    return new Promise((resolve, reject) => {
        const process = exec(command);

        process.stdout.on('data', (data) => {
            console.log(chalk.gray(data.toString()));
        });

        process.stderr.on('data', (data) => {
            console.error(chalk.red(data.toString()));
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log(chalk.green('Command executed successfully.'));
                resolve();
            } else {
                console.error(chalk.red(`Command failed with exit code ${code}`));
                reject(`Command failed with exit code ${code}`);
            }
        });
    });
}

module.exports = { runCommand };
