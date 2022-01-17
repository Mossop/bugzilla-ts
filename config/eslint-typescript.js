module.exports = {
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "prettier",
    "./eslint-overrides",
  ],

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },

  env: {
    es6: true,
  },
};
