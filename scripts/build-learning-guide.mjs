import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const base = new URL(process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:3000');
if (!['localhost', '127.0.0.1'].includes(base.hostname)) throw new Error('Use a local development server.');
const html = await readFile(new URL('../docs/learning-guide.html', import.meta.url), 'utf8');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' });
try {
  const page = await browser.newPage();
  await page.route('**/*', route => new URL(route.request().url()).origin === base.origin ? route.continue() : route.abort());
  await page.goto(new URL('/robots.txt', base).href);
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: fileURLToPath(new URL('../reference/portfolio/learning-guide.pdf', import.meta.url)),
    preferCSSPageSize: true, printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-family:Arial,sans-serif;font-size:8px;color:#6b6560;width:100%;margin:0 18mm;display:flex;justify-content:space-between"><span>JanusClinic · Learning guide · 26 October 2026</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  });
  console.log('Created reference/portfolio/learning-guide.pdf');
} finally { await browser.close(); }
