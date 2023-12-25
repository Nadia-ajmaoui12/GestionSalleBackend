/* eslint-disable no-magic-numbers */
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['node', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    indent: ['error', 2],
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': ['error'],
    'no-console': 'warn',
    // Additional rules
    'no-alert': 'error', // Disallow the use of alert
    'no-debugger': 'error', // Disallow the use of debugger
    'no-extra-semi': 'error', // Disallow unnecessary semicolons
    'no-magic-numbers': ['error', { ignore: [0, 1], ignoreArrayIndexes: true }], // Disallow magic numbers, except 0 and 1
    'no-new': 'error', // Disallow unnecessary 'new' keyword when using constructor functions
    'no-param-reassign': 'error', // Disallow reassigning function parameters
    'no-prototype-builtins': 'error', // Disallow using Object.prototype methods directly
    'no-redeclare': 'error', // Disallow variable redeclaration
    'no-return-await': 'error', // Disallow unnecessary 'return await'
    'no-self-compare': 'error', // Disallow self-comparison
    'no-sequences': 'error', // Disallow the use of the comma operator
    'no-unmodified-loop-condition': 'error', // Disallow unmodified loop conditions
    'no-useless-call': 'error', // Disallow unnecessary calls to .call() and .apply()
    'no-useless-catch': 'error', // Disallow unnecessary catch clauses
    'no-useless-concat': 'error', // Disallow unnecessary concatenation of literals or template literals
    'no-useless-escape': 'error', // Disallow unnecessary escape characters
    'no-useless-return': 'error', // Disallow unnecessary return statements
    'no-void': 'error', // Disallow the use of void operator
    'no-warning-comments': [
      'warn',
      { terms: ['fixme', 'todo', 'xxx'], location: 'start' },
    ], // Disallow specified warning terms in comments
    'no-with': 'error', // Disallow the use of the with statement
    'prefer-regex-literals': 'error', // Disallow unnecessary construction of RegExp objects
    'require-await': 'error', // Disallow async functions which have no await expression
    'vars-on-top': 'error', // Require var declarations to be placed at the top of their containing scope
    yoda: 'error', // Require or disallow Yoda conditions
  },
};
