#!/usr/bin/env node

/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const { program } = require('commander');
const path = require('path');

const loadCommand = (commandPath) => require(path.resolve(__dirname, '../commands', commandPath));

program.command('init').description('initialize a project').action(loadCommand('init'));
program.command('build').description('build the project').action(loadCommand('build'));
program.command('serve').description('start development mode').action(loadCommand('serve'));
program.command('config').description('edit configuration').action(loadCommand('config'));

const create = program.command('create').description('create resources');
create.command('function').description('create a new function').action(loadCommand('create/function'));
create.command('component').description('create a new component').action(loadCommand('create/component'));
create.command('manager').description('create a new manager').action(loadCommand('create/manager'));
create.command('script').description('create a new script').action(loadCommand('create/script'));
create.command('page').description('create a new page').action(loadCommand('create/page'));
create.command('style').description('create a new style').action(loadCommand('create/style'));

const blacklist = program.command('blacklist').description('manage blacklist');
blacklist.command('add <element>').description('add to blacklist').action(loadCommand('blacklist/add'));
blacklist.command('remove <element>').description('remove from blacklist').action(loadCommand('blacklist/remove'));
blacklist.command('list').description('list blacklist items').action(loadCommand('blacklist/list'));

const exceptions = program.command('exceptions').description('manage exceptions');
exceptions.command('add <exception>').description('add to exceptions').action(loadCommand('exceptions/add'));
exceptions.command('remove <exception>').description('remove from exceptions').action(loadCommand('exceptions/remove'));
exceptions.command('list').description('list exceptions items').action(loadCommand('exceptions/list'));

const entries = program.command('entries').description('manage entries');
entries.command('add <entry>').description('add to entries').action(loadCommand('entries/add'));
entries.command('remove <entry>').description('remove from entries').action(loadCommand('entries/remove'));
entries.command('list').description('list entries items').action(loadCommand('entries/list'));

const bundle = program.command('bundle').description('Manage bundled files');
bundle.command('add <file>').description('add to bundle').action(loadCommand('bundle/add'));
bundle.command('remove <file>').description('remove from bundle').action(loadCommand('bundle/remove'));
bundle.command('list').description('list bundle items').action(loadCommand('bundle/list'));

program.parse(process.argv);
