#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'fs/promises';
import { prompt } from 'inquirer';
import ora from 'ora';
import { resolve } from 'path';
import { format } from 'prettier';
import { cd, exec } from 'shelljs';

import configs from './configs';

const getAppName = () =>
  prompt([
    {
      name: 'appName',
      message: 'What is the name of your app?',
      validate: (input) => {
        if (!input) return 'name of app cannot be blank';
        if (input.includes('.'))
          return 'name of app should not include a period';
        return true;
      },
    },
  ]);

const createAppDirectory = async (appName: string) => {
  const directory = resolve(process.cwd(), appName);
  try {
    await mkdir(directory);
    return directory;
  } catch (error) {
    return false;
  }
};

const initializeApp = (directory: string) =>
  new Promise<void>((res, rej) => {
    cd(directory);
    exec('npm init -y', { silent: true }, (code) => {
      if (code === 0) res();
      else rej(new Error('could not initialize app'));
    });
  });

const configurePackageJson = async (packageJsonPath: string) => {
  const packageJson = await readFile(packageJsonPath, { encoding: 'utf8' });
  const packageConfig = JSON.parse(packageJson);
  const newPackageConfig = {
    ...packageConfig,
    scripts: { build: 'tsc', start: 'npm run build && node dist/index.js' },
    devDependencies: {
      '@types/node': '^17.0.21',
      '@typescript-eslint/eslint-plugin': '^5.13.0',
      '@typescript-eslint/parser': '^5.13.0',
      eslint: '^8.10.0',
      'eslint-config-airbnb-base': '^15.0.0',
      'eslint-config-airbnb-typescript': '^16.1.0',
      'eslint-config-prettier': '^8.5.0',
      'eslint-plugin-import': '^2.25.4',
      'eslint-plugin-simple-import-sort': '^7.0.0',
      typescript: '^4.6.2',
    },
  };
  const newPackageJson = format(JSON.stringify(newPackageConfig), {
    parser: 'json',
  });
  await writeFile(packageJsonPath, newPackageJson);
};

const createConfigs = async (destination: string) => {
  await writeFile(
    resolve(destination, '.eslintrc.json'),
    format(JSON.stringify(configs.eslintrc), { parser: 'json' })
  );
  await writeFile(
    resolve(destination, 'tsconfig.json'),
    format(JSON.stringify(configs.tsconfig), { parser: 'json' })
  );
};

const installDependencies = (directory: string) =>
  new Promise<void>((res, rej) => {
    cd(directory);
    const spinner = ora('Installing dependencies...').start();
    exec('npm i', { silent: true }, (code) => {
      if (code === 0) {
        spinner.succeed('Dependencies installed');
        res();
      } else {
        spinner.fail('Failed to install dependencies');
        rej(new Error('failed to install dependencies'));
      }
    });
  });

const run = async () => {
  const { appName } = await getAppName();
  const directory = await createAppDirectory(appName);
  if (!directory) throw new Error('could not create app directory');
  await initializeApp(directory);
  await configurePackageJson(resolve(directory, 'package.json'));
  createConfigs(directory);
  await installDependencies(directory);
};

run();
