const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['dist/', 'coverage/', 'node_modules/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } },
    rules: {
      'no-unused-vars': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: { sourceType: 'module', globals: { ...globals.node } },
  },
  {
    files: ['public/**/*.js'],
    languageOptions: { sourceType: 'script', globals: { ...globals.browser } },
  },
  { files: ['tests/**/*.js'], languageOptions: { globals: { ...globals.jest } } },
];
