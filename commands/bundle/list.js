/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const fs = require('fs');
const path = require('path');
const chalk = require("chalk");

module.exports = () => {
  const configPath = path.resolve(process.cwd(), 'dstrn.conf.js');
  let config;
  if (fs.existsSync(configPath)) {
    config = require(configPath);
  } else {
    console.error(chalk.red('◆'),'configuration file not found, run', chalk.yellow(chalk.bold("dstrn init")),'first');
    return;
  }

  if (config.jsBundle.length == 0 && config.cssBundle.length == 0) {
    console.log(chalk.yellow('◆'), chalk.reset("no files found"));
    return;
  }

  if(config.jsBundle.length > 0){
    console.log(chalk.yellow('◆'), chalk.reset("JS bundle: "), chalk.yellow(config.jsBundle));
  }
  if(config.cssBundle.length > 0){
    console.log(chalk.yellow('◆'), chalk.reset("CSS bundle: "), chalk.cyan(config.cssBundle));
  }
};
