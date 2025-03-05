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

    const { pageName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'pageName',
        message: 'enter the name of the page:',
        default: "index",
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'page name cannot be empty';
          }
          return true;
        },
      }
    ]);

    let shouldRoute = false;
    if(config.useRouter){
        const { route } = await inquirer.prompt([{
            type: 'confirm',
            name: 'route',
            message: 'should this page be routed?',
            default: true,
          }
        ]);
        shouldRoute = route;
    }

    const cleanedName = transformString(pageName.trim());

    const viewsDir = path.resolve(process.cwd(), 'views');
    await fs.ensureDir(viewsDir);

    const pagePath = path.join(viewsDir, `${cleanedName}.html`);
    if (fs.existsSync(pagePath)) {
        console.error(chalk.red('◆'), `page ${cleanedName} already exists`);
        return;
    }

    const pageSampleCode = shouldRoute ? `<!-- ${cleanedName}.html -->` : `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="icon" type="image/x-icon" href="../public/assets/favicon.ico">
    <link rel="stylesheet" href="../lib/dstrn.css"/>
    <script src="../lib/dstrn.js"></script>
    <title>${pageName}</title>
</head>

<body>
</body>

</html>`;
    await fs.writeFile(pagePath, pageSampleCode);

    if(shouldRoute){
        if (config.entries.includes(pagePath)) {
            console.error(chalk.red('◆'), `page ${cleanedName} already is already routed`);
        } else {
            config.entries.push(pagePath);
            fs.writeFileSync(configPath, "module.exports = "+JSON.stringify(config, null, 2), 'utf-8');
            const routerPath = path.join(process.cwd(), 'router.js');
            if (fs.existsSync(routerPath)) {
                const routerContent = fs.readFileSync(routerPath, 'utf-8');
                const newRoute = `router.on('/${cleanedName}', function () {
                    router.render("views/${cleanedName}.html", []);
                });`;
                const newRouterContent = routerContent.replace('router.resolve();', `${newRoute}\nrouter.resolve();`);
                fs.writeFileSync(routerPath, newRouterContent);
            }
        }
    }

    console.log(chalk.green('◆'), chalk.reset("created page"), chalk.red(cleanedName+".html"));
  } catch (error) {
    console.error(chalk.red('◆'), 'error creating page:', error.message);
  }
};