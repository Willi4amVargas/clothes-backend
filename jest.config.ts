/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transformIgnorePatterns: ["/node_modules/(?!(jose)/)"],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};