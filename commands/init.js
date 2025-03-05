/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

module.exports = async () => {
  try {
    console.log(chalk.yellow('◆'), chalk.reset("dstrn init"),chalk.yellow('◆'));
    execSync('npm init -y', { stdio: 'ignore' });
    execSync('npm install -g netlify-cli -y', { stdio: 'ignore' });

    const templateDir = path.resolve(__dirname, '../template');
    const destinationDir = process.cwd();

    fs.mkdirSync(destinationDir, { recursive: true });

    const copyRecursiveSync = (src, dest) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        entries.forEach((entry) => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyRecursiveSync(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    };

    copyRecursiveSync(templateDir, destinationDir);
    console.log(chalk.green('◆'), 'template files copied successfully');
    console.log(chalk.green('◆'),'project successfully created, run', chalk.yellow(chalk.bold("dstrn config")),'to configure');

  } catch (error) {
    console.error(chalk.red('◆'), chalk.red('error creating project: '), error.message);
  }
};
