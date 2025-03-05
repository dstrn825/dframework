/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

module.exports = {
  "inputDir": "./",
  "outputDir": "./build/",
  "minify": true,
  "obfuscate": true,
  "moveWASMToRoot": true,
  "useRouter": true,
  "cssBundle": [],
  "jsBundle": [],
  "entries": [],
  "exceptions": [
    "functions/"
  ],
  "blacklist": [
    "node_modules/",
    "build/",
    ".netlify/",
    ".vscode/",
    ".gitignore",
    "dstrn.conf.js"
  ]
};
