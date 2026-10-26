// Explicitly regenerate visual reference covers after reviewing the site's design.
import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile, mkdtemp, rename, rm, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = fileURLToPath(new URL('../reference/portfolio/capture/', import.meta.url));
const manifest = JSON.parse(await readFile(new URL('../capture-manifest.json', import.meta.url)));
const base = new URL(process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:3000');
if (!['localhost', '127.0.0.1'].includes(base.hostname)) throw new Error('Capture a local development server only.');
const mobileRoutes = new Set(['/', '/services', '/services/medical-cosmetic/botox', '/products/cinteric-gel', '/journal/first-visit-guide', '/contact']);
const staging = await mkdtemp(fileURLToPath(new URL('../reference/portfolio/.capture-staging-', import.meta.url)));
const output = pathToFileURL(join(staging, 'next') + '/');
let browser;
let preserveStaging = false;
const pages = [];
try {
  await mkdir(new URL('previews/', output), { recursive: true });
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' });
  for (const entry of manifest.pages) {
    const route = new URL(entry.source_url).pathname || '/';
    const slug = route.replace(/^\//, '').replaceAll('/', '--') || 'home';
    const record = { route, desktop: `previews/${slug}-desktop.jpg` };
    for (const mobile of [false, ...(mobileRoutes.has(route) ? [true] : [])]) {
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 } });
      try {
        await context.route('**/*', request => {
          const r = request.request();
          return new URL(r.url()).origin === base.origin && ['GET', 'HEAD'].includes(r.method()) ? request.continue() : request.abort();
        });
        const page = await context.newPage();
        await page.goto(new URL(route, base).href);
        await page.evaluate(() => document.fonts.ready);
        // Load visible cover imagery, without waiting for offscreen lazy images.
        await page.locator('main img').evaluateAll(async images => {
          await Promise.all(images.filter(img => {
            const rect = img.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.top < innerHeight && rect.bottom > 0;
          }).map(img => img.complete ? Promise.resolve() : new Promise((resolve, reject) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', reject, { once: true });
          })));
          const broken = images.find(img => {
            const rect = img.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.top < innerHeight && rect.bottom > 0 && img.naturalWidth === 0;
          });
          if (broken) throw new Error('Broken cover image: ' + broken.getAttribute('src'));
        });
        record.title = (await page.locator('h1').innerText()).trim().replace(/\s+/g, ' ');
        const filename = `previews/${slug}-${mobile ? 'mobile' : 'desktop'}.jpg`;
        await page.screenshot({ path: fileURLToPath(new URL(filename, output)), type: 'jpeg', quality: 75, animations: 'disabled' });
        if (mobile) record.mobile = filename;
      } finally {
        await context.close();
      }
    }
    pages.push(record);
    console.log(`Captured ${pages.length}/${manifest.pages.length}: ${route}`);
  }
  await writeFile(new URL('pages.json', output), JSON.stringify({
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    capturedAt: new Date().toISOString(), desktopViewport: { width: 1280, height: 900 },
    mobileViewport: { width: 390, height: 844 }, pages,
  }, null, 2) + '\n');
  const previous = join(staging, 'previous');
  let hasPrevious = false;
  try { await access(destination); hasPrevious = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (hasPrevious) await rename(destination, previous);
  try {
    await rename(fileURLToPath(output), destination);
  } catch (error) {
    if (hasPrevious) {
      try { await rename(previous, destination); }
      catch (restoreError) {
        preserveStaging = true;
        console.error('Reference backup retained at ' + previous);
        throw new AggregateError([error, restoreError], 'Could not publish or restore reference covers.');
      }
    }
    throw error;
  }
} finally {
  try { await browser?.close(); }
  finally { if (!preserveStaging) await rm(staging, { recursive: true, force: true }); }
}
