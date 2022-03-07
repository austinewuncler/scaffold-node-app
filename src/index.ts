#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { resolve } from 'path';
import { echo } from 'shelljs';

import { generateFiles, initialize, installPackages } from './services';

const command = new Command('scafnode');

command
  .argument('<name>', 'the directory name of the spp')
  .action(async (name) => {
    const path = resolve(process.cwd(), name);
    echo(`creating new project in ${chalk.blue(path)}`);
    try {
      await generateFiles(path);
      await initialize(path);
      await installPackages(path);
    } catch (error: any) {
      echo(error.message);
    }
  });

command.parse();
