const configs = {
  eslintrc: {
    env: { es2021: true, node: true },
    extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint', 'simple-import-sort'],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  tsconfig: {
    compilerOptions: {
      lib: ['es2021'],
      module: 'commonjs',
      target: 'es2021',

      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,

      outDir: './dist',
    },
    include: ['src/**/*ts'],
  },
};

export default configs;
