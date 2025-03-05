/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const path = require('path');

function getCurrentTimestamp() {
    return (new Date()).toLocaleTimeString();
}

module.exports = () => {
    console.log(chalk.yellow('◆'), chalk.reset("dstrn serve"),chalk.yellow('◆'));
    console.log(chalk.blue('◆'), chalk.reset('starting development server'));

    const projectDirectory = path.resolve(process.cwd(), "./");
    const devProcess = spawn('netlify', ['dev', '-p', '8250', '--offline'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: projectDirectory
    });

    const loadedFunctions = [];
  
    devProcess.stdout.on('data', (data) => {
      if(data.toString().includes('Loaded function')){
        loadedFunctions.push(data.toString().split('Loaded function')[1].split(' ')[1].split('\n')[0]);

      } else if (data.toString().includes('Server now ready')) {
        if(loadedFunctions.length)
            console.log(chalk.green('◆'), chalk.reset('functions loaded: '), chalk.reset(loadedFunctions));
        else
            console.log(chalk.green('◆'), chalk.reset('no functions loaded'));
        console.log(`
┌─────────────────────────────────────────────────┐
│                                                 │
│   ${chalk.yellow("◆")} server now ready on ${chalk.yellow("http://localhost:8250")}   │
│                                                 │
└─────────────────────────────────────────────────┘
        `);

      } else if (data.toString().includes('Server reloaded')){
        console.log(chalk.green('◆'), chalk.reset('server reloaded'));
      } else if(data.toString().includes('Rewrote URL')){
        const rewriteDetails = data.toString().split('Rewrote URL to')[1].split('\n')[0];
        console.log(chalk.reset(getCurrentTimestamp()), chalk.yellow('◆'), `rewrote URL to ${chalk.yellow(rewriteDetails.trim())}`);

      } else if(data.toString().includes('Request from')){
        const requestDetails = data.toString().split('Request from')[1].split('\n')[0];
        const [ip, methodAndEndpoint] = requestDetails.split(': ');
        const [method, endpoint] = methodAndEndpoint.split(' ');
        const methodText = method == 'GET' ? chalk.green("GET") : chalk.blue("POST");
        console.log(chalk.reset(getCurrentTimestamp()), chalk.yellow('◆'), methodText, ` in ${chalk.yellow(endpoint)}`);
        
      } else if(data.toString().includes('Response with status')){
        const responseDetails = data.toString().split('Response with status')[1].split('\n')[0];
        const [code, time] = responseDetails.split(' in ');
        const codeText = (200 <= Number(code) < 300) ? chalk.green(code) : chalk.red(code);
        const indicatorColor = (200 <= Number(code) < 300) ? chalk.green('◆') : chalk.red('◆');
        console.log(chalk.reset(getCurrentTimestamp()), indicatorColor,`responded code ${codeText} in ${chalk.yellow(time.trim())}`);

      } else if(data.toString().includes('Proxying to')){
        const proxyDetails = data.toString().split('Proxying to')[1].split('\n')[0];
        console.log(chalk.reset(getCurrentTimestamp()), chalk.yellow('◆'), `proxying to ${chalk.yellow(proxyDetails.trim())}`);
      }
    });
  

    devProcess.stderr.on('data', (data) => {
      if(data.toString().includes("DeprecationWarning")) return;
      console.error(chalk.red("──────────────────────────────────────────────────────────────"));
      console.error(chalk.reset(getCurrentTimestamp()),chalk.red("ERROR: "),chalk.reset(data.toString().replace("Error: ", "")));
      console.error(chalk.red("──────────────────────────────────────────────────────────────"));
    });
  
    devProcess.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('server stopped successfully'));
      } else {
        console.error(chalk.red(`server exited with code ${code}`));
      }
    });
};