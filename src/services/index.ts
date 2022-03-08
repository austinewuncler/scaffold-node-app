import { mkdir, readFile, writeFile } from 'fs/promises';
import ora from 'ora';
import { resolve } from 'path';
import { format } from 'prettier';
import { cd, exec } from 'shelljs';

import { eslintJs, eslintTs, tsconfig } from '../configs';

type Options = { typescript: boolean };

export const generateFiles = async (path: string, { typescript }: Options) => {
  const spinner = ora().start('generating files');
  await mkdir(path);
  await writeFile(
    resolve(path, '.eslintrc.json'),
    format(JSON.stringify(typescript ? eslintTs : eslintJs), { parser: 'json' })
  );
  const srcPath = resolve(path, 'src');
  await mkdir(srcPath);
  await writeFile(
    resolve(srcPath, typescript ? 'index.ts' : 'index.js'),
    '// entry point'
  );
  if (typescript) {
    await writeFile(
      resolve(path, 'tsconfig.json'),
      format(JSON.stringify(tsconfig), { parser: 'json' })
    );
  }
  spinner.succeed('files generated');
};

export const initialize = (path: string) =>
  new Promise<void>((res, rej) => {
    const spinner = ora().start('initializing project');
    cd(path);
    exec('npm init -y', { silent: true }, (code) => {
      if (code === 0) {
        spinner.succeed('project initialized');
        res();
      } else {
        spinner.fail('failed to initialize project');
        rej();
      }
    });
  });

export const installPackages = async (
  path: string,
  { typescript }: Options
) => {
  const spinner = ora().start('installing packages');
  const packageJsonPath = resolve(path, 'package.json');
  const packageJson = await readFile(packageJsonPath, { encoding: 'utf8' });
  const packageConfig = {
    ...JSON.parse(packageJson),
    scripts: typescript
      ? { start: 'node dist/index.js', build: 'tsc' }
      : { start: 'node src/index.js' },
    devDependencies: typescript
      ? {
          '@types/node': '^17.0.21',
          '@typescript-eslint/eslint-plugin': '^5.14.0',
          '@typescript-eslint/parser': '^5.14.0',
          eslint: '^8.10.0',
          'eslint-config-airbnb-base': '^15.0.0',
          'eslint-config-airbnb-typescript': '^16.1.0',
          'eslint-plugin-import': '^2.25.4',
          'eslint-plugin-simple-import-sort': '^7.0.0',
          typescript: '^4.6.2',
        }
      : {
          eslint: '^8.10.0',
          'eslint-config-airbnb-base': '^15.0.0',
          'eslint-plugin-import': '^2.25.4',
          'eslint-plugin-simple-import-sort': '^7.0.0',
        },
  };
  await writeFile(
    resolve(path, 'package.json'),
    format(JSON.stringify(packageConfig), { parser: 'json' })
  );
  return new Promise<void>((res, rej) => {
    cd(path);
    exec('npm install', { silent: true }, (code) => {
      if (code === 0) {
        spinner.succeed('packages installed');
        res();
      } else {
        spinner.fail('packages failed to install');
        rej();
      }
    });
  });
};
