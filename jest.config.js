module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  // Suche nach allen Dateien, die auf .test.ts enden, egal in welchem Unterordner:
  testMatch: ["**/*.test.ts", "**/*.test.tsx", "**/*.test.js"],
  moduleNameMapper: {
    "^@/app/(.*)$": "<rootDir>/app/$1"
  },
};
