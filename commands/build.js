/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const beautify = require('simply-beautiful');
const uglifyJS = require('uglify-js');
const javascriptObfuscator = require('javascript-obfuscator');
const chalk = require("chalk");
const ora = require('ora');

let config = {};
let bundlePaths = {};

function clearOutputDir() {
    const spinner = ora({ text: 'preparing', color: "yellow" }).start();
    const { outputDir } = config;
    const outputDirPath = path.resolve(process.cwd(), outputDir);
    fs.emptyDirSync(outputDirPath);
    spinner.succeed("cleaned build folder");
}
function copyFiles() {
    const spinner = ora({ text: 'copying files', color: "yellow" }).start();
    const { inputDir, outputDir, blacklist, moveWASMToRoot } = config;
    const inputDirPath = path.resolve(process.cwd(), inputDir);
    const outputDirPath = path.resolve(process.cwd(), outputDir);
    fs.ensureDirSync(outputDirPath);

    glob.sync(`${inputDirPath}/**/*`, { nodir: false }).forEach(file => {
        const relativePath = path.relative(inputDirPath, file);
        const isWasmFile = relativePath.endsWith('.wasm');
        
        if (file.includes(outputDir)) return;
        
        const destination = isWasmFile && moveWASMToRoot
            ? path.join(outputDirPath, path.basename(file))
            : path.join(outputDirPath, relativePath);

        if (!blacklist.some(black => relativePath.includes(black))) {
            if (fs.lstatSync(file).isDirectory()) fs.ensureDirSync(destination);
            else fs.copySync(file, destination);
        }
    });

    spinner.succeed("files copied");
}
function bundleFiles() {
    const { outputDir, jsBundle, cssBundle } = config;
    let bundledJSPath, bundledCSSPath;

    if(!jsBundle.length && !cssBundle.length) return;
    const spinner = ora({ text: 'bundling', color: "yellow" }).start();
    
    if (jsBundle.length > 0) {
        spinner.text = `bundling ${chalk.yellow("(JS)")}`;
        bundledJSPath = path.join(outputDir, `dbundle_${Date.now().toString(36)}.js`);
        let jsContent = '';

        jsBundle.forEach(jsFile => {
            const filePath = path.join(outputDir, jsFile);
            if (fs.existsSync(filePath)) {
                jsContent += fs.readFileSync(filePath, 'utf-8') + '\n';
                fs.removeSync(filePath);
            }
        });

        fs.writeFileSync(bundledJSPath, jsContent);
    }

    if (cssBundle.length > 0) {
        spinner.text = `bundling ${chalk.cyan("(CSS)")}`;
        bundledCSSPath = path.join(outputDir, `dbundle_${Date.now().toString(36)}.css`);
        let cssContent = '';

        cssBundle.forEach(cssFile => {
            const filePath = path.join(outputDir, cssFile);
            if (fs.existsSync(filePath)) {
                cssContent += fs.readFileSync(filePath, 'utf-8') + '\n';
                fs.removeSync(filePath);
            }
        });

        fs.writeFileSync(bundledCSSPath, cssContent);
    }

    bundlePaths = { js: bundledJSPath, css: bundledCSSPath };
    spinner.succeed(`files bundled into ${chalk.yellow(bundledJSPath)} ${(bundledJSPath && bundledCSSPath ? "and" : "")} ${chalk.cyan(bundledCSSPath)}`);
}
function updateHTML() {
    const { outputDir, entries, jsBundle, cssBundle } = config;
    if(!entries.length) return; 
    
    const spinner = ora({ text: 'updating references', color: "yellow" }).start();
    const outputDirPath = path.resolve(process.cwd(), outputDir);

    let html = "";
    entries.forEach(bundleEntry => {
        const htmlPath = path.join(outputDirPath, bundleEntry);

        if (fs.existsSync(htmlPath)) {
            let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

            if (jsBundle.length > 0) {
                const newJSBundleName = bundlePaths.js.split("/")[1];
                const newJSTag = `<script src="/bundle/${newJSBundleName}"></script>`;

                jsBundle.forEach(jsFile => {
                    const regex = new RegExp(`<script(?:\\s+type=["']text/javascript["'])?\\s+src=["'][^"']*${path.basename(jsFile)}["'].*<\/script>`, 'g');
                    htmlContent = htmlContent.replace(regex, '');
                });

                htmlContent = htmlContent.replace('</head>', `\t${newJSTag}\n</head>`);  
            }

            if (cssBundle.length > 0) {
                const newCSSBundleName = bundlePaths.css.split("/")[1];
                const newCSSTag = `<link rel="stylesheet" href="/bundle/${newCSSBundleName}">`;

                cssBundle.forEach(cssFile => {
                    const regex = new RegExp(`<link\\s+rel=["']stylesheet["']\\s+href=["'][^"']*${path.basename(cssFile)}["'].*?>`, 'g');
                    htmlContent = htmlContent.replace(regex, '');
                });

                htmlContent = htmlContent.replace('</head>', `\t${newCSSTag}\n</head>`);
            }

            fs.writeFileSync(htmlPath, htmlContent);
            html += bundleEntry+" ";
            spinner.text = `updated references for ${html}`
        }
    });
    spinner.succeed(`HTML references updated for ${chalk.red(html)}`);
}
function processJavaScript() {
    const spinner = ora({ text: `processing ${chalk.yellow("JavaScript")}`, color: "yellow" }).start();
    const { outputDir, exceptions, minify, obfuscate } = config;
    const outputDirPath = path.resolve(process.cwd(), outputDir);

    glob.sync(`${outputDirPath}/**/*.js`).forEach(jsFile => {
        const relativePath = path.relative(outputDirPath, jsFile);
        const shouldProcess = !exceptions.some(exception => relativePath.includes(exception));

        if (shouldProcess) {
            let jsContent = fs.readFileSync(jsFile, 'utf-8');

            spinner.text = `processing ${chalk.yellow(jsFile)}`

            if (minify) jsContent = uglifyJS.minify(jsContent).code;

            if (obfuscate) jsContent = javascriptObfuscator.obfuscate(jsContent).getObfuscatedCode();

            fs.writeFileSync(jsFile, jsContent);
        }
    });
    spinner.succeed(`all ${chalk.yellow("JavaScript")} files processed`);
}
function cleanEmptyFolders() {
    const spinner = ora({ text: `cleaning up`, color: "yellow" }).start();

    const { outputDir } = config;
    const outputDirPath = path.resolve(process.cwd(), outputDir);
    const isDirEmpty = folder => fs.readdirSync(folder).length === 0;

    glob.sync(`${outputDirPath}/**/*/`).forEach(folder => {
        if (isDirEmpty(folder)) {
            fs.removeSync(folder);
        }
    });
    spinner.succeed(`cleaned up build folder`);
}

module.exports = () => {
    try {
        console.log(chalk.yellow('◆'), chalk.reset("dstrn build"),chalk.yellow('◆'));
        const configPath = path.join(process.cwd(), 'dstrn.conf.js');
        try {
            if (fs.existsSync(configPath)) {
                config = require(configPath);
            } else {
                throw new Error("configuration file not found, run", chalk.yellow(chalk.bold("dstrn init")), "first");
            }
        } catch (err) {
            throw new Error("error reading configuration file:", err.message);
        }
    
        clearOutputDir();
        copyFiles();
        bundleFiles();
        updateHTML();
        processJavaScript();
        cleanEmptyFolders();
    
        console.log(chalk.green('◆'), "build completed");
    } catch (error) {
        console.error(chalk.red('◆'), chalk.red('error building project: '), error.message);
    }
};