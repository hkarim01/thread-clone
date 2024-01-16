import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(ts|tsx|js)$": "babel-jest", // this is probably something you already had, if using ts-jest, it's probably fine to leave as ts-jest
  },
  moduleDirectories: ["node_modules", "<rootDir>/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // coveragePathIgnorePatterns: ["<rootDir>/lib/models", "<rootDir>/lib/actions"],
  // modulePathIgnorePatterns: ["<rootDir>/lib/models", "<rootDir>/lib/actions"],
};

module.exports = async () => ({
  ...(await createJestConfig(config)()),

  transformIgnorePatterns: ["<rootDir>/lib/actions", "<rootDir>/lib/models"],
});
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
