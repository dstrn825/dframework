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
    const configPath = path.resolve(process.cwd(), 'dstrn.conf.js');

    let config;
    try {
        if (fs.existsSync(configPath)) {
        config = require(configPath);
        } else {
        console.error(chalk.red('◆'),'configuration file not found, run', chalk.yellow(chalk.bold("dstrn init")),'first');
        return;
        }
    } catch (err) {
        console.error(chalk.red('◆'), chalk.red('error reading configuration file: '), err.message);
        if (err.code === 'MODULE_NOT_FOUND') {
        console.error(chalk.red('◆'), 'configuration file not found, run', chalk.yellow(chalk.bold("dstrn init")), 'first');
        return;
        }
    }

    const { scriptName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'scriptName',
        message: 'enter the name of the script:',
        default: "index",
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'script name cannot be empty';
          }
          return true;
        },
      }
    ]);

    let shouldBundle = false;
    let includedEntries = "none";
    if(config.useRouter){
        const { bundle, entries } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'bundle',
            message: 'should this script be bundled?',
            default: true,
          },
          {
            type: 'list',
            name: 'entries',
            message: 'select in which entries to include the script:',
            choices: () => {
              const entries = config.entries.map((entry) => {
                const entryName = path.basename(entry, '.html');
                return {
                  name: entryName,
                  value: entryName,
                };
              });
              return ['all pages', 'none', ...entries];
            },
          }
        ]);
        shouldBundle = bundle;
        includedEntries = entries || [];
    }

    const cleanedName = transformString(scriptName.trim());

    const jsDir = path.resolve(process.cwd(), 'public/js');
    await fs.ensureDir(jsDir);

    const jsPath = path.join(jsDir, `${cleanedName}.js`);
    if (fs.existsSync(jsPath)) {
        console.error(chalk.red('◆'), `script ${cleanedName} already exists`);
        return;
    }

    const jsSampleCode = `
/* ${cleanedName}.js */
(() => {
    // your code goes here
})();
    `;
    await fs.writeFile(jsPath, jsSampleCode);

    if(shouldBundle){
        if (config.jsBundle.includes(jsPath)) {
            console.error(chalk.red('◆'), `script ${cleanedName} already is already in bundle`);
        } else {
            config.jsBundle.push(jsPath);
            fs.writeFileSync(configPath, "module.exports = "+JSON.stringify(config, null, 2), 'utf-8');

            const routerPath = path.join(process.cwd(), 'router.js');
            if (fs.existsSync(routerPath)) {
                let routerContent = fs.readFileSync(routerPath, 'utf-8');
                
                if (includedEntries === 'all pages') {
                    const routeRegex = /render\([^)]+\)/g;
                    routerContent = routerContent.replace(routeRegex, (match) => {
                        if (!match.includes(`"js/${cleanedName}.js"`)) {
                            return match.replace(/\]/, `, "js/${cleanedName}.js"]`);
                        }
                        return match;
                    });
                } else if (includedEntries !== 'none') {
                    const routeRegex = new RegExp(`router\\.on\\([^)]+${includedEntries}[^{]+{[^}]+}\\);`);
                    routerContent = routerContent.replace(routeRegex, (match) => {
                        if (!match.includes(`"js/${cleanedName}.js"`)) {
                            return match.replace(/\]/, `, "js/${cleanedName}.js"]`);
                        }
                        return match;
                    });
                }
                
                fs.writeFileSync(routerPath, routerContent);
            }

            config.entries.forEach((entry) => {
                const entryName = path.basename(entry, '.html');
                if (includedEntries === 'all pages' || includedEntries === entryName) {
                    const entryPath = path.join(process.cwd(), entry);
                    let entryContent = fs.readFileSync(entryPath, 'utf-8');

                    const scriptTag = `<script src="/js/${cleanedName}.js" defer></script>`;
                    if (!entryContent.includes(scriptTag)) {
                        entryContent = entryContent.replace('</head>', `${scriptTag}\n</head>`);
                        fs.writeFileSync(entryPath, entryContent);
                    }
                }
            });
        }
    }

    console.log(chalk.green('◆'), chalk.reset("created page"), chalk.orange(cleanedName+".html"));
  } catch (error) {
    console.error(chalk.red('◆'), 'error creating page:', error.message);
  }
};