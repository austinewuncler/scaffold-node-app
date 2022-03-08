#!/usr/bin/env node

import chalk from 'chalk';
import { program } from 'commander';
import { resolve } from 'path';
import { echo } from 'shelljs';

import { generateFiles, initialize, installPackages } from './services';

program
  .argument('<name>', 'the directory name of the app')
  .option('-t --typescript', 'typescript support', false)
  .action(async (name, options) => {
    const path = resolve(process.cwd(), name);
    echo(`creating new project in ${chalk.blue(path)}`);
    try {
      await generateFiles(path, options);
      await initialize(path);
      await installPackages(path, options);
    } catch (error: any) {
      echo(error.message);
    }
    echo('project successfully created');
  });

program.parse();
