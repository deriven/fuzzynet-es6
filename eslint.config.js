const js = require('@eslint/js')
const stylistic = require('@stylistic/eslint-plugin')
const globals = require('globals')

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        phaser: 'readonly'
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'arrow-spacing': 'error',
      'comma-dangle': ['error', 'never'],
      'comma-spacing': ['error', { after: true, before: false }],
      'eol-last': ['error', 'always'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'getter-return': 'off',
      indent: ['error', 2, { SwitchCase: 1 }],
      'keyword-spacing': ['error', { after: true, before: true }],
      'linebreak-style': ['error', 'windows'],
      'multiline-ternary': ['error', 'never'],
      'new-parens': 'error',
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
      'no-tabs': 'error',
      'no-trailing-spaces': 'error',
      'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
      'no-useless-assignment': 'off',
      'no-var': 'error',
      'object-curly-spacing': ['error', 'always'],
      'prefer-const': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      'space-before-function-paren': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': ['error', { nonwords: false, words: true }],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/computed-property-spacing': ['error', 'never'],
      '@stylistic/member-delimiter-style': 'off',
      '@stylistic/template-curly-spacing': ['error', 'never']
    }
  }
]