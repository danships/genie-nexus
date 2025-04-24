import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
// import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  tseslint.configs.recommendedTypeChecked,
  // eslintPluginUnicorn.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{ts,test.ts}'],
    ignores: ['**/dist/**', '**/node_modules/**', 'eslint.config.mjs'],
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
]);
