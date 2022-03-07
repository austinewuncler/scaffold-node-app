import { copyFile, mkdir, readFile, writeFile } from 'fs/promises';
import { prompt } from 'inquirer';
import { resolve } from 'path';
import { format } from 'prettier';
import { cd, exec } from 'shelljs';

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

const copyConfig = async (config: string, destination: string) => {
  await copyFile(
    resolve(__dirname, 'configs', config),
    resolve(destination, config)
  );
};

const run = async () => {
  const { appName } = await getAppName();
  const directory = await createAppDirectory(appName);
  if (!directory) throw new Error('could not create app directory');
  await initializeApp(directory);
  await configurePackageJson(resolve(directory, 'package.json'));
  await copyConfig('tsconfig.json', directory);
  await copyConfig('.eslintrc.json', directory);
};

run();
