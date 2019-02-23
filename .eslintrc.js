module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'plugin:vue/essential',
    '@vue/prettier'
  ],
  // required to lint *.vue files
  plugins: ['vue', 'prettier'],

  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-undef': 'error',
    'no-unused-vars': 'warn',
    'no-else-return': 'warn',
    'vue/no-v-html': 'off'
  },
  globals: {
    _hmt: true,
    M: true,
    flvjs: true,
    setShareInfo: true,
    wx: true,
    ant: true,
    Ali: true
  }
}
