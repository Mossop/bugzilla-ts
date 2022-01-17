module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  resetModules: true,
  clearMocks: true,

  testMatch: [`<rootDir>/src/**/*.test.{js,jsx,ts,tsx}`],
};
