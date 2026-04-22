/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/ui-kit$': '<rootDir>/src/index.ts',
    '^@app/ui-kit/(.*)$': '<rootDir>/src/$1',
    '^@app/contracts$': '<rootDir>/../../contracts/src/index.ts',
    '^@app/contracts/(.*)$': '<rootDir>/../../contracts/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
