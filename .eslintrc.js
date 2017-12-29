const ERROR = 2
const WARN = 1
const OFF = 0

module.exports = {
  "extends": "standard",
  "plugins": [
      "standard",
      "promise"
  ],
  "rules": {
      "strict": "error",
      // "eqeqeq": "warn",
      "indent": [ERROR, 2],
      "semi": OFF,
      "one-var": OFF,
      "camelcase": WARN,
      'eol-last': OFF,
      "space-before-function-paren": OFF
  }
};
