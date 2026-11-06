import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: ['preview-browser.spec.mjs', 'gateway-browser.spec.mjs', 'journey.spec.mjs', 'treatment-images.spec.mjs', 'usability.spec.mjs', 'redesigned-pages.spec.mjs', 'contact-page.spec.mjs', 'profile-flow.spec.mjs'], workers: 1,
  outputDir: 'test-results/preview',
  metadata: { repositoryPrefix: '/JanusClinic' },
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
