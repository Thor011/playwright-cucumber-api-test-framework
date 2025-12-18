import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for API testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL for API requests */
    baseURL: 'https://jsonplaceholder.typicode.com',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Extra HTTP headers */
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },

  /* Configure projects for different test types */
  projects: [
    {
      name: 'api-tests',
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
