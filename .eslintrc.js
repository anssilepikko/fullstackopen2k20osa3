module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      "single", { "allowTemplateLiterals": true }
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': 'error',
    'no-console': 0,
  }
}