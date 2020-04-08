module.exports = {
  testMatch: ['**/*.test.js'],
  setupFiles: [
    '<rootDir>/node_modules/regenerator-runtime/runtime',
    '<rootDir>/node_modules/core-js/features/promise/index',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
