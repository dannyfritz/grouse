module.exports = {
  extends: "airbnb-base",
  env: {
    browser: true,
  },
  rules: {
    "import/prefer-default-export": [0],
    "lines-between-class-members": ["error", "never"],
    "quotes": ["error", "double"]
  }
}
