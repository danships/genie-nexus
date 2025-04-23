import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
// import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  {
    files: ['packages/**/*.{js,mjs,cjs,ts,test.ts}'],
    plugins: { js },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    extends: ['js/recommended'],
    rules: {
      curly: 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
    },
  },
  tseslint.configs.recommendedTypeChecked,
  // eslintPluginUnicorn.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
