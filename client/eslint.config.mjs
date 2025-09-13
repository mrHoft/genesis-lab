import { globalIgnores } from "eslint/config";
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  globalIgnores([".angular/**/*", "dist/**/*"]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      "@typescript-eslint/no-unused-vars": ['error', { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      'unicorn/empty-brace-spaces': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-null': 'off',
      'unicorn/numeric-separators-style': 'off'
    },
  },
]);
