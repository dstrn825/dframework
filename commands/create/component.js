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

function hyphenName(input) {
  return input
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
}

module.exports = async () => {
  try {
    const { componentName, addListeners, shouldBundle, shouldImport } = await inquirer.prompt([
      {
        type: 'input',
        name: 'componentName',
        message: 'enter the name of the component:',
        default: "MyComponent",
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'component name cannot be empty';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'addListeners',
        message: 'should this component be able to emit events? (ex: click)',
        default: false
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

    const camelCaseName = transformString(componentName.trim());

    const componentsDir = path.resolve(process.cwd(), 'components');
    const componentDir = path.join(componentsDir, camelCaseName);

    if (fs.existsSync(componentDir)) {
      console.error(chalk.red('◆'), `component ${camelCaseName} already exists`);
      return;
    }

    await fs.ensureDir(componentDir);

    const jsFilePath = path.join(componentDir, `${camelCaseName}.js`);
    const listenerCode = `
    on(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
    }
    off(event, callback) {
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      }
    }
    emit(event, ...args) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(callback => callback(...args));
      }
    }`;
    const jsSampleCode = `// ${camelCaseName}.js
class ${camelCaseName} extends HTMLElement {
    constructor() {
      super();
      ${addListeners ? "this.listeners = { event: [] };" : ""}

      /* 
       * your custom attributes go here
       * example:
       * this.attribute = this.getAttribute("attribute") || "default value";
       */
    }
    async connectedCallback() {
        const html = await fetch("./content.html").then((res) => res.text()); // you can replace this with an HTML string for better performance
        this.#render(html);
    }

    #render(html) {
        this.innerHTML = html;

        /*
         * your custom code goes here
         * example:
         * this.querySelector("button").addEventListener("click", () => {
         *   console.log("button clicked");
         * });
         */
    }

    ${addListeners ? listenerCode : ""}

    /* 
    *  your custom methods go here
    *  example:
    *  async method() {
    *    console.log("method called");
    *  }
    */
}

customElements.define("${hyphenName(camelCaseName)}", ${camelCaseName});
    `;
    await fs.writeFile(jsFilePath, jsSampleCode);

    const htmlFilePath = path.join(componentDir, 'content.html');
    const htmlSampleContent = `<!-- your HTML content goes here -->`;
    await fs.writeFile(htmlFilePath, htmlSampleContent);

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

    console.log(chalk.green('◆'), chalk.reset("created component"), chalk.red(camelCaseName));
  } catch (error) {
    console.error(chalk.red('◆'), 'error creating component:', error.message);
  }
};