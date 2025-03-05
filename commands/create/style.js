/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

function transformString(input) {
    return input.trim().replace(/\s+/g, '-');
}

module.exports = async () => {
  try {
    const { styleName, shouldBundle } = await inquirer.prompt([
      {
        type: 'input',
        name: 'styleName',
        message: 'enter the name of the stylesheet:',
        default: "my-style",
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'stylesheet name cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'shouldBundle',
        message: 'should this stylesheet be bundled?',
        default: true
      }
    ]);

    const cleanedName = transformString(styleName.trim());

    const cssDir = path.resolve(process.cwd(), 'public/css');
    await fs.ensureDir(cssDir);

    const stylePath = path.join(cssDir, `${cleanedName}.css`);
    if (fs.existsSync(stylePath)) {
        console.error(chalk.red('◆'), `stylesheet ${cleanedName} already exists`);
        return;
    }

    const configPath = path.resolve(process.cwd(), 'dstrn.conf.js');
    let config;
    if (fs.existsSync(configPath)) {
        config = require(configPath);
    } else {
        console.error(chalk.red('◆'),'configuration file not found, run', chalk.yellow(chalk.bold("dstrn init")),'first');
        return;
    }

    const cssSampleCode = `/* ${cleanedName}.css */`;
    await fs.writeFile(stylePath, cssSampleCode);

    if(shouldBundle){
        if (!config.cssBundle) config.cssBundle = [];
        config.cssBundle.push(stylePath);
        fs.writeFileSync(configPath, "module.exports = "+JSON.stringify(config, null, 2), 'utf-8');
    }

    console.log(chalk.green('◆'), chalk.reset("created stylesheet"), chalk.cyan(cleanedName+".css"));
  } catch (error) {
    console.error(chalk.red('◆'), 'error creating stylesheet:', error.message);
  }
};