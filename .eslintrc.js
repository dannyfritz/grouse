module.exports = {
  parser: "babel-eslint",
  ignorePatterns: [ "utilities/asyncWait.polyfill.js" ],
  extends: "airbnb-base",
  globals: {
    SharedArrayBuffer: true,
    Atomics: true,
  },
  env: {
    browser: true,
  },
  rules: {
    "import/prefer-default-export": ["off"],
    "lines-between-class-members": ["error", "never"],
    "quotes": ["error", "double"],
    "no-lone-blocks": ["off"],
    "no-bitwise": ["off"],
  },
}
