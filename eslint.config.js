// @ts-check

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended';
// @ts-ignore
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from "eslint-plugin-simple-import-sort";
import headers from "eslint-plugin-headers";

export default tseslint.config(
  { ignores: ['dist','eslint.config.js', '.yarn/'] },
  {
    extends: [js.configs.recommended, prettier, ...tseslint.configs.recommended, reactRefresh.configs.vite, importPlugin.flatConfigs.recommended],
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      // @ts-ignore
      'react-hooks': reactHooks,
      // @ts-ignore
      'react': react,
      "simple-import-sort": simpleImportSort,
      headers
    },
    // @ts-ignore
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/padding-line-between-statements': 'off',
      '@typescript-eslint/prefer-enum-initializers': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/prefer-regexp-exec': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-implicit-any-catch': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/prefer-includes': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': ['error', {
        additionalHooks: '(useAsyncFn|useDebounceFn)'
      }],
      'import/no-deprecated': 'error',
      'import/no-unresolved': 'off',
      'import/no-cycle': ['error', { maxDepth: Infinity, ignoreExternal: true, allowUnsafeDynamicCyclicDependency: false }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'always', prev: '*', next: 'try' },
        { blankLine: 'always', prev: 'try', next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'import' },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' }
      ],
      'simple-import-sort/imports': [
        2,
        {
          groups: [
            ['^\u0000'], // all side-effects (0 at start)
            ['\u0000$', '^@mimir-wallet.*\u0000$', '^\\..*\u0000$'], // types (0 at end)
            ['^[^/\\.]'], // non-mimir-wallet
            ['^@mimir-wallet'], // mimir-wallet
            ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'] // local (. last)
          ]
        }
      ],
      'headers/header-format': [
        'error',
        {
          source: 'string',
          style: 'line',
          content: 'Copyright {startYear}-{endYear} dev.mimir authors & contributors\nSPDX-License-Identifier: Apache-2.0',
          trailingNewlines: 2,
          variables: {
            startYear: '2023',
            endYear: '2024'
          }
        }
      ]
    },
  },
)
