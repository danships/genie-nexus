import { defineConfig, devices } from '@playwright/test';

export const config = defineConfig({
  testDir: './tests/ui',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: process.env['TEST_BASE_URL'] || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  timeout: 30 * 1000,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    ...(process.env['ALL']
      ? [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
          },
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
          },
        ]
      : []),
  ],
});

export default config;
