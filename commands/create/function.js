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
    const words = input.trim().split(/\s+/);
    const camelCase = words
        .map((word, index) => index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    const camelCaseName = camelCase[0].toUpperCase() + camelCase.slice(1);

    return camelCaseName;
}

module.exports = async () => {
  try {
    const { functionName, dbAccess, utilityAccess } = await inquirer.prompt([
      {
        type: 'input',
        name: 'functionName',
        message: 'enter the name of the function:',
        default: "MyFunction",
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'function name cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'dbAccess',
        message: 'should this function have access to the database?',
        default: true
      },
      {
        type: 'confirm',
        name: 'utilityAccess',
        message: 'do you want to include utility functions?',
        default: true
      }
    ]);

    const camelCaseName = transformString(functionName.trim());

    const functionsDir = path.resolve(process.cwd(), 'functions');
    const functionDir = path.join(functionsDir, camelCaseName);

    if (fs.existsSync(functionDir)) {
      console.error(chalk.red('◆'), `function ${camelCaseName} already exists`);
      return;
    }

    await fs.ensureDir(functionDir);

    const jsFilePath = path.join(functionDir, `${camelCaseName}.js`);
    const jsSampleCode = `// function ${camelCaseName}

${utilityAccess ? 'const utils = require("../lib/Utils");' : ''}
${dbAccess ? 'const { SteveAPI } = require("../lib/SteveAPI"); const Steve = new SteveAPI();' : ''}

const handler = async (event) => {
  try {
    /* example to get content of body
     * const body = JSON.parse(event.body);
     * if access to utility functions is enabled, you can also sanitize the content with utils.sanitize()
     */

    /* example to get url parameter
     * const { parameter } = event.pathParameters;
     */

    return {
      statusCode: 200,
      body: JSON.stringify(""),
    };

  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
    `;
    await fs.writeFile(jsFilePath, jsSampleCode);

    console.log(chalk.green('◆'), chalk.reset("created function"), chalk.green(camelCaseName));
  } catch (error) {
    console.error(chalk.red('◆'), 'error creating function:', error.message);
  }
};