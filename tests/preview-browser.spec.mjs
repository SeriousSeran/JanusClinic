import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const base = '/JanusClinic';
const manifest = JSON.parse(await readFile(new URL('../capture-manifest.json', import.meta.url)));

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

test('all preview pages load with real images and no captured runtime', async ({ page }) => {
  test.setTimeout(90000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const entry of manifest.pages) {
    const route = new URL(entry.source_url).pathname || '/';
    const response = await page.goto(base + route);
    expect(response.status(), route).toBe(200);
    await expect(page.locator('h1')).not.toBeEmpty();
    for (const image of await page.locator('main img').filter({ visible: true }).all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    expect(await page.locator('script[src*="/_next/"]').count()).toBe(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  }
  expect(errors).toEqual([]);
});

test('desktop navigation and FAQ expansion work on the static host', async ({ page }) => {
  await page.goto(base + '/');
  await page.locator('header').getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page).toHaveURL(/\/JanusClinic\/services\/$/);
  await page.getByRole('link', { name: 'BOTOX & Muscle Relaxing Injections', exact: true }).first().click();
  const faq = page.getByRole('button', { name: 'Does BOTOX hurt?' });
  await expect(faq).toHaveAttribute('aria-controls', /preview-answer-/);
  await faq.focus(); await faq.press('Enter');
  await expect(faq).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#' + await faq.getAttribute('aria-controls'))).toContainText('needles');
  await faq.click(); await expect(faq).toHaveAttribute('aria-expanded', 'false');
});

test('mobile menu works and no enquiry or booking is sent', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const writes = [];
  page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url()); });
  await page.goto(base + '/');
  const open = page.getByRole('button', { name: 'Open navigation menu' });
  await open.click(); await expect(open).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape'); await expect(open).toHaveAttribute('aria-expanded', 'false');
  await open.click();
  await page.getByLabel('Mobile navigation').getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/JanusClinic\/contact\/$/);
  await page.getByLabel('Full Name').fill('Preview test');
  await page.getByLabel('Phone Number').fill('0000000000');
  await page.getByRole('button', { name: 'Send Message', exact: true }).click();
  await expect(page.locator('#preview-notice')).toContainText('no booking or message was sent');
  await page.locator('main [data-preview-action]').first().click();
  expect(writes).toEqual([]);
  expect(await page.locator('a[href^="https://wa.me"], a[href^="tel:"], a[href^="mailto:"]').count()).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('portfolio gallery, all covers, and the PDF work under the repository prefix', async ({ page, request }) => {
  await page.goto(base + '/portfolio/');
  await expect(page.locator('[data-portfolio-page]')).toHaveCount(43);
  const inventory = await (await request.get(base + '/portfolio/capture/pages.json')).json();
  for (const entry of inventory.pages) {
    for (const image of [entry.desktop, entry.mobile].filter(Boolean)) {
      expect((await request.get(base + '/portfolio/capture/' + image)).status()).toBe(200);
    }
  }
  await page.getByRole('button', { name: 'Products', exact: true }).click();
  await expect(page.locator('[data-portfolio-page]:visible')).toHaveCount(8);
  await expect(page.locator('[data-portfolio-page]:visible').first()).toHaveAttribute('href', /\/JanusClinic\/products/);
  const pdf = await request.get(base + '/portfolio/learning-guide.pdf');
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
});
