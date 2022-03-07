import { mkdir } from 'fs/promises';
import { prompt } from 'inquirer';
import { resolve } from 'path';
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
      else rej(new Error('could not initialize project'));
    });
  });

const run = async () => {
  const { appName } = await getAppName();
  const directory = await createAppDirectory(appName);
  if (!directory) throw new Error('could not create app directory');
  await initializeApp(directory);
};

run();
