import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: 'preview-browser.spec.mjs', workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173', browserName: 'chromium',
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' },
    screenshot: 'only-on-failure', trace: 'retain-on-failure',
  },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1 --directory dist > /tmp/janus-static-preview-server.log 2>&1',
    url: 'http://127.0.0.1:4173/JanusClinic/', reuseExistingServer: false,
  },
});
