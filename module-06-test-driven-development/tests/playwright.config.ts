import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  retries: 0,
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  webServer: [
    {
      command: 'npm run start',
      cwd: '../todo-app/backend',
      url: 'http://localhost:4000/tasks',
      reuseExistingServer: true,
      timeout: 120_000
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173',
      cwd: '../todo-app/frontend',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: true,
      timeout: 120_000
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});