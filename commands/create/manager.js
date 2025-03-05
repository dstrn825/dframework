/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const beautify = require('simply-beautiful');

function transformString(input) {
    const words = input.trim().split(/\s+/);
    const camelCase = words
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    const camelCaseName = camelCase[0].toUpperCase() + camelCase.slice(1);

    return camelCaseName;
}

module.exports = async () => {
  try {
    const { managerName, shouldBundle, shouldImport } = await inquirer.prompt([
      {
        type: 'input',
        name: 'managerName',
        message: 'enter the name of the manager:',
        default: "MyManager",
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'manager name cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'shouldBundle',
        message: 'should this component be bundled?',
        default: true
      },
      {
        type: 'confirm',
        name: 'shouldImport',
        message: 'do you want to include this component in your HTML files?',
        default: true
      }
    ]);

    const camelCaseName = transformString(managerName.trim());

    const managersDir = path.resolve(process.cwd(), 'managers');
    const managerDir = path.join(managersDir, camelCaseName);

    if (fs.existsSync(managerDir)) {
      console.error(chalk.red('◆'), `manager ${camelCaseName} already exists`);
      return;
    }

    await fs.ensureDir(managerDir);

    const jsFilePath = path.join(managerDir, `${camelCaseName}.js`);
    const jsSampleCode = `// ${camelCaseName}.js
class ${camelCaseName} {
    constructor() {
      /* 
       * your custom attributes go here
       * example:
       * this.attribute = "value";
       */
    }
    
    /* 
     * your custom methods go here
     * example:
     * async method() {
     *   console.log("method called");
     * }
     */
};
window.${camelCaseName} = new ${camelCaseName}();
    `;
    await fs.writeFile(jsFilePath, jsSampleCode);

    const configPath = path.resolve(process.cwd(), 'dstrn.conf.js');
    let config;
    if (fs.existsSync(configPath)) {
      config = require(configPath);
    } else {
      console.error(chalk.red('◆'),'configuration file not found, run', chalk.yellow(chalk.bold("dstrn init")),'first');
      return;
    }

    if(shouldBundle){
        if (!config.jsBundle) config.jsBundle = [];
        config.jsBundle.push(jsFilePath);
        fs.writeFileSync(configPath, "module.exports = "+JSON.stringify(config, null, 2), 'utf-8');
    }
    if(shouldImport){
        for(const entry of config.entries){
            const htmlPath = path.resolve(process.cwd(), entry);
            if (fs.existsSync(htmlPath)) {
                let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
                const newJSTag = `<script src="./${jsFilePath}"></script>`;
                htmlContent = htmlContent.replace('</head>', `${newJSTag}\n</head>`);
                fs.writeFileSync(htmlPath, beautify.html(htmlContent));
            }
        }
    }

    console.log(chalk.green('◆'), chalk.reset("created manager"), chalk.blue(camelCaseName));
  } catch (error) {
    console.error(chalk.red('◆'), 'error creating manager:', error.message);
  }
};