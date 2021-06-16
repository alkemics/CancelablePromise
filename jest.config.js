module.exports = {
  testMatch: ['**/*.test.ts'],
  setupFiles: [
    '<rootDir>/node_modules/regenerator-runtime/runtime',
    '<rootDir>/node_modules/core-js/features/promise/index',
  ],
  transform: {
    '^.+\\.(j|t)s$': 'babel-jest',
  },
};
