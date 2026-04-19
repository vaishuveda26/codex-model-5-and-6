module.exports = {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js']
    },
    {
      displayName: 'integration',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/integration/**/*.test.js']
    },
    {
      displayName: 'api',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/api/**/*.test.js']
    },
    {
      displayName: 'security',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/security/**/*.test.js']
    },
    {
      displayName: 'regression',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/regression/**/*.test.js']
    },
    {
      displayName: 'smoke',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/smoke/**/*.test.js']
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/frontend/**/*.test.jsx'],
      setupFilesAfterEnv: ['<rootDir>/tests/frontend/setupTests.js'],
      transform: {
        '^.+\\.[jt]sx?$': ['babel-jest', { configFile: '<rootDir>/tests/babel.config.cjs' }]
      },
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/tests/frontend/styleMock.js'
      }
    }
  ]
};