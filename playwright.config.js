const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});























// The overall pattern in all 3 tests
// Every test follows the same 4-step structure:

// Register mock — page.route() intercepts the URL
// Open blank page — page.goto("about:blank")
// Fire the request — page.evaluate() runs fetch() in the browser
// Assert the result — expect() checks status and body