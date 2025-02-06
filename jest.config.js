/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/**/*.test.ts"],
  verbose: true, // Verbose indicates whether each individual test should be reported during the run ( ignored test will still get reported)
  forceExit: true,
  // clearMocks: true,
};
