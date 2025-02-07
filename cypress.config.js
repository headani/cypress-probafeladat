const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://test.marso.dev',
    viewportWidth: 1920,
    viewportHeight: 1080,
    experimentalWebKitSupport: true,
  },
});
