module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  resetModules: true,
  clearMocks: true,

  testMatch: [`<rootDir>/test/**/*.test.{js,jsx,ts,tsx}`],
};
