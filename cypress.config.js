const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'tests/*.spec.js',
    screenshotsFolder: 'tests/screenshots',
    videosFolder: 'tests/videos',
    supportFile: false,
    screenshotOnRunFailure: false,
    video: false,
    fixturesFolder: false,
    setupNodeEvents() {},
    watchForFileChanges: false,
  },
});
