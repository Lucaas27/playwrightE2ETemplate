import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import process from 'process';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, `src/environments/.env${process.env.NODE_ENV === 'prod' ? '' : '.qa'}`),
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './src/tests',

  /* Maximum time one test can run for. */
  timeout: 10 * 6000,

  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 10000,
  },

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 3 : 0,

  /* Opt out of parallel tests */
  workers: process.env.CI ? 3 : undefined,

  fullyParallel: false,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['allure-playwright'], ['json', { outputFile: 'playwright-report/results.json' }]]
    : [['list', { printSteps: true }], ['allure-playwright'], ['html', { open: 'never' }]],

  /* Set maximum number of slow test files to report and duration in milliseconds that is considered slow */
  reportSlowTests: { max: 5, threshold: 5 * 60000 },

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,

    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL,

    headless: true,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'on',
    /* Set viewport to null to use full screen */
    // viewport: null,

    /* Launch options to set window size */
    launchOptions: {
      args: ['--window-size=1920,1080'],
      devtools: true,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'auth', testMatch: /.*\.setup\.ts/ },
    {
      name: 'e2e',
      testMatch: 'e2e/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'src/tests/auth/auth.json',
      },
      dependencies: ['auth'],
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};
export default config;
