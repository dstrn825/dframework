/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const fs = require('fs-extra');
const inquirer = require('inquirer');
const path = require('path');
const chalk = require('chalk');

module.exports = async () => {
  console.log(chalk.yellow('◆'), chalk.reset("dstrn config"),chalk.yellow('◆'));
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

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'inputDir',
      message: 'enter the input directory path:',
      default: config.inputDir || './',
    },
    {
      type: 'input',
      name: 'outputDir',
      message: 'enter the output directory path:',
      default: config.outputDir || './build/',
    },
    {
      type: 'confirm',
      name: 'minify',
      message: 'enable minification?',
      default: config.minify || true,
    },
    {
      type: 'confirm',
      name: 'obfuscate',
      message: 'enable obfuscation?',
      default: config.obfuscate || true,
    },
    {
      type: 'confirm',
      name: 'moveWASMToRoot',
      message: 'move WASM files to root directory?',
      default: config.moveWASMToRoot || true,
    },
    {
      type: 'input',
      name: 'apiEndpoint',
      message: 'enter the API endpoint:',
      default: '/api',
    },
    {
      type: 'confirm',
      name: 'useRouter',
      message: 'use the web history router?',
      default: 'true',
    },
    {
      type: 'input',
      name: 'cssBundle',
      message: 'enter CSS files to bundle (comma-separated):',
      default: config?.cssBundle ? config?.cssBundle.join(', ') : "",
      filter: (input) => { 
        if (!input) return config?.cssBundle ? config?.cssBundle : [];
        return input.split(',').map((item) => item.trim());
      },
    },
    {
      type: 'input',
      name: 'jsBundle',
      message: 'enter JS files to bundle (comma-separated):',
      default: config?.jsBundle ? config?.jsBundle.join(', ') : "",
      filter: (input) => { 
        if (!input) return config?.jsBundle ? config?.jsBundle : [];
        return input.split(',').map((item) => item.trim());
      },
    },
    {
      type: 'input',
      name: 'entries',
      message: 'enter HTML files to process (comma-separated):',
      default: config?.entries ? config?.entries.join(', ') : "",
      filter: (input) => { 
        if (!input || input == "") return config?.entries ? config?.entries : [];
        return input.split(',').map((item) => item.trim());
      },
    },
    {
      type: 'input',
      name: 'exceptions',
      message: 'enter exceptions (comma-separated):',
      default: config?.exceptions ? config?.exceptions.join(', ') : "functions/",
      filter: (input) => { 
        if (!input || input == "") return config?.exceptions ? config?.exceptions : ["functions/"];
        return input.split(',').map((item) => item.trim());
      },
    },
    {
      type: 'input',
      name: 'blacklist',
      message: 'enter blacklist items (comma-separated):',
      default: config?.blacklist ? config?.blacklist?.join(', ') : "node_modules/, build/, .netlify/, .vscode/, .gitignore, dstrn.conf.js",
      filter: (input) => { 
        if (!input || input == "") return config?.blacklist ? config?.blacklist : ["node_modules/", "build/", ".netlify/", ".vscode/", ".gitignore", "dstrn.conf.js"];
        return input.split(',').map((item) => item.trim());
      },
    },
  ]);

  const updatedConfig = { ...config, ...answers };

  const configContent = `/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

module.exports = ${JSON.stringify(updatedConfig, null, 2)};\n`;

  const netlifyTomlPath = path.join(process.cwd(), 'netlify.toml');
  const netlifyTomlContent = `
[[redirects]]
  from = "${answers.apiEndpoint.startsWith("/") ? answers.apiEndpoint : "/"+answers.apiEndpoint}/:function"
  to = "/.netlify/functions/:function"
  status = 200
  force = true

[[redirects]]
  from = "/bundle/:file"
  to = "/:file"
  status = 200
  force = true

[[redirects]]
  from = "/"
  to = "/views/index.html"
  status = 200
  force = true

[[redirects]]
  from = "/:page"
  to = "/views/:page"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/views/error.html"
  status = 404

[[headers]]
  for = "/*"
  [headers.values]
  Access-Control-Allow-Origin = "*"
  `;

  const routerPath = path.join(process.cwd(), 'router.js');
  const routerContent = `/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const router = new dRouter('/');
router.controller = null;

// custom render function
const render = (template, scripts) => {
  return new Promise((resolve, reject) => {
    if(router.controller) { router.controller.abort(); router.controller = null };
    router.controller = new AbortController();
    const signal = controller.signal;
    
    // your code to run at the start of the transition

    fetch("../"+template, { signal })
      .then(response => {
        if (!response.ok) {
          throw new Error("failed to fetch "+template+": "+response.status);
        }
        return response.text();
      })
      .then(html => {
        setTimeout(() => { // using fake delay for the animation (optional)
          contentContainer.innerHTML = html;
          const existingScripts = document.querySelectorAll("script[data-page-script]");
          existingScripts.forEach(script => script.remove());
  
          if (scripts && scripts.length > 0) {
            let scriptsLoaded = 0;
  
            scripts.forEach((url) => {
              const script = document.createElement("script");
              script.src = "../" + url + '?cachebuster=' + new Date().getTime();
              script.dataset.pageScript = true;
              script.onload = () => {
                scriptsLoaded++;
                if (scriptsLoaded === scripts.length) {
                  resolve();
                }
              };
              document.body.appendChild(script);
            });
          } else {
            resolve();
          }
        // your code to end the transition
        }, 700);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// example route
router.on('/', function () {
  render("views/index.html", ["public/js/index.js"]);
});
router.resolve();
`;
  
  try {
    await fs.writeFile(configPath, configContent, 'utf-8');
    await fs.writeFile(netlifyTomlPath, netlifyTomlContent.trim());
    if(answers.useRouter){
      await fs.writeFile(routerPath, routerContent.trim());
    }

    console.log(chalk.green('◆'), 'configuration file updated successfully');
  } catch (err) {
    console.error(chalk.red('◆'), chalk.red('error writing configuration file: '), err.message);
    return;
  }
};
