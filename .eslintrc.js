module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },

  env: {
    node: true,
  },

  ignorePatterns: ["node_modules", "dist"],

  extends: ["./config/eslint-typescript"],
};
