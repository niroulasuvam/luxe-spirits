module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
      tsconfig: {
          module: "commonjs",
          moduleResolution: "node",
          target: "es2022",
          esModuleInterop: true,
          isolatedModules: true,
          rootDir: ".",
          ignoreDeprecations: "6.0"
      },
      diagnostics: {
        ignoreCodes: [151002]
      }
      }
    ]
  },
  roots: ["<rootDir>/src/__tests__"],
  testMatch: ["**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/__tests__/**"
  ]
};
