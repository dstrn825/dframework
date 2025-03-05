/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const fs = require('fs');
const path = require('path');
const chalk = require("chalk");

module.exports = (entry) => {
  const configPath = path.resolve(process.cwd(), 'dstrn.conf.js');
  let config;
  if (fs.existsSync(configPath)) {
    config = require(configPath);
  } else {
    console.error(chalk.red('◆'),'configuration file not found, run', chalk.yellow(chalk.bold("dstrn init")),'first');
    return;
  }

  if (entry.endsWith('.js')) {
    config.jsBundle = config.jsBundle.filter((item) => item !== entry);
    console.log(chalk.green('◆'), chalk.reset("removed"), chalk.yellow(entry), chalk.reset("to the JS bundle"));

  } else if (entry.endsWith('.css')) {
    config.cssBundle = config.cssBundle.filter((item) => item !== entry);
    console.log(chalk.green('◆'), chalk.reset("removed"), chalk.cyan(entry), chalk.reset("to the CSS bundle"));
    
  } else {
    console.error(chalk.red('◆'), 'entry must be a js or css file');
    return;
  }

  fs.writeFileSync(configPath, "module.exports = "+JSON.stringify(config, null, 2), 'utf-8');
};
