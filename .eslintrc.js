/* eslint-disable sort-keys */
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
    'no-with': 'error', // Disallow the use of the with statement
    'prefer-regex-literals': 'error', // Disallow unnecessary construction of RegExp objects
    'require-await': 'error', // Disallow async functions which have no await expression
    'vars-on-top': 'error', // Require var declarations to be placed at the top of their containing scope
    yoda: 'error', // Require or disallow Yoda conditions
    camelcase: ['error', { properties: 'always' }],
    'object-curly-spacing': ['error', 'always'], // Enforce consistent spacing inside braces
    'semi-style': ['error', 'last'], // Require or disallow semicolons instead of ASI
    'arrow-spacing': 'error', // Enforce consistent spacing before and after the arrow in arrow functions
    'array-bracket-spacing': ['error', 'never'], // Enforce consistent spacing inside array brackets
    'func-call-spacing': ['error', 'never'], // Require or disallow spacing between function identifiers and their invocations
    'space-before-blocks': 'error', // Enforce consistent spacing before blocks
    'space-in-parens': ['error', 'never'], // Enforce consistent spacing inside parentheses
    'spaced-comment': ['error', 'always'], // Enforce consistent spacing after the // or /* in a comment
    'eol-last': ['error', 'always'], // Require or disallow newline at the end of files
    'no-dupe-keys': 'error', // Check for duplicate keys in object literals
    'no-whitespace-before-property': 'error', // Disallow whitespace before properties
    'no-trailing-spaces': 'error', // Disallow trailing spaces at the end of lines
    'no-multi-spaces': 'error', // Disallow multiple spaces
    'no-multiple-empty-lines': ['error', { max: 1 }], // Disallow multiple empty lines
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'keyword-spacing': ['error', { before: true, after: true }],
    'no-lonely-if': 'error',
    'no-nested-ternary': 'error',
    'no-unneeded-ternary': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
  },
};
