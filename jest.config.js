module.exports = {
  testMatch: ['**/*.test.js'],
  setupFiles: ['<rootDir>/node_modules/regenerator-runtime/runtime'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
