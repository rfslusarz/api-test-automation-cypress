const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports/json",
    overwrite: false,
    html: false,
    json: true,
    timestamp: "mmddyyyy_HHMMss",
  },

  e2e: {
    baseUrl: "https://jsonplaceholder.typicode.com",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",

    retries: {
      runMode: 2,
      openMode: 1,
    },

    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,

    setupNodeEvents(on, config) {
      on("task", {
        log(message) {
          console.log(`\n[CYPRESS LOG] ${message}`);
          return null;
        },
        table(data) {
          console.table(data);
          return null;
        },
      });

      return config;
    },
  },

  env: {
    API_BASE_URL: "https://jsonplaceholder.typicode.com",
    API_TIMEOUT: 15000,
    DEFAULT_USER_ID: 1,
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 3,
  },

  video: true,
  videoCompression: 32,
  screenshotOnRunFailure: true,
  downloadsFolder: "cypress/downloads",
});
