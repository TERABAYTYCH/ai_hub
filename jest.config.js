/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
  ],
  coverageDirectory: './coverage',
  verbose: true,
  moduleNameMapper: {
    '^@app/contracts$': '<rootDir>/../../libs/contracts/src/index.ts',
    '^@app/ui-kit$': '<rootDir>/../../libs/ui-kit/src/index.ts',
    '^@app/core-backend$': '<rootDir>/../../libs/core-backend/src/index.ts',
  },
};
