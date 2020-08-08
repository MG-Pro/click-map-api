module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'never'],
    quotes: [2, 'single', {avoidEscape: true}],
    'no-console': 'off',
    'prefer-template': 'off',
    'consistent-return': 'off',
    'object-curly-spacing': ['error', 'never'],
    'no-param-reassign': 'off',
    'import/extensions': ['error', 'always'],
    'object-curly-newline': 'off',
    'no-trailing-spaces': ['error', {
      skipBlankLines: true,
    }],
    'no-return-await': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'class-methods-use-this': 'off',
    'no-plusplus': 'off',
    'no-bitwise': 'off',
    'no-throw-literal': 'off',
    camelcase: ['error', {
      properties: 'never',
      ignoreDestructuring: true,
    }],
  },
}
