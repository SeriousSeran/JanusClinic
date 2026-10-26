import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../capture-manifest.json', import.meta.url)));

test.beforeEach(async ({ page }) => {
  // Browser checks never contact the real clinic, analytics or map providers.
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.hostname === '127.0.0.1' ? route.continue() : route.abort();
  });
});

test('all captured routes return their actual HTML, including deep links', async ({ request }) => {
  expect(manifest.pages).toHaveLength(43);
  for (const entry of manifest.pages) {
    const path = new URL(entry.source_url).pathname || '/';
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(await response.text()).toContain('id="main-content"');
  }
  expect((await request.get('/this-page-does-not-exist')).status()).toBe(404);
});

test('desktop content, local images, fonts and client navigation work', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Where skin finds');
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator('main img').filter({ visible: true }).all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  expect(await page.evaluate(() => document.fonts.check('400 16px "DM Sans"'))).toBe(true);
  expect(await page.evaluate(() => document.fonts.check('400 16px "Cormorant Garamond"'))).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('desktop-home.png'), fullPage: true });
  await page.locator('header').getByRole('link', { name: 'Services', exact: true }).first().click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('What we treat');
  await page.getByRole('link', { name: 'BOTOX & Muscle Relaxing Injections', exact: true }).first().click();
  await expect(page).toHaveURL(/\/services\/medical-cosmetic\/botox$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('BOTOX');
  expect(errors).toEqual([]);
});

test('mobile menu opens, closes and navigates without horizontal overflow', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open navigation menu' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Close navigation menu' }).click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.getByLabel('Mobile navigation').getByRole('link', { name: 'Products', exact: true }).click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Products');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('mobile-products.png'), fullPage: true });
});

test('product orders retain WhatsApp links', async ({ page }) => {
  await page.goto('/products/cinteric-gel');
  const order = page.getByRole('link', { name: /Order via WhatsApp/ }).first();
  await expect(order).toHaveAttribute('href', /https:\/\/wa.me\/94777060404\?text=/);
  expect(decodeURIComponent(await order.getAttribute('href'))).toContain('Cinteric');
});

test('contact form hydrates and displays confirmation with a simulated provider response', async ({ page }) => {
  let submitted;
  await page.route('https://api.web3forms.com/submit', async route => {
    submitted = route.request().postData();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });
  await page.goto('/contact');
  await page.getByLabel('Full Name').fill('Local Test');
  await page.getByLabel('Phone Number').fill('+94 77 000 0000');
  await page.getByLabel('Email Address').fill('test@example.invalid');
  await page.getByLabel('Message', { exact: true }).fill('Local automated check; never delivered.');
  await page.getByRole('button', { name: 'Send Message', exact: true }).click();
  await expect(page.getByText('Thank you, message received.')).toBeVisible();
  expect(submitted).toContain('Local Test');
  expect(submitted).toContain('test@example.invalid');
});

test('identity portfolio preserves the site tokens and exposes every page reference', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return Object.fromEntries(['--color-background', '--color-text', '--color-accent', '--color-surface'].map(name => [name, style.getPropertyValue(name).trim()]));
  });
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Keep the Janus');
  await expect(page.locator('[data-portfolio-page]')).toHaveCount(manifest.pages.length);
  await expect(page.locator('#mobile-gallery img')).toHaveCount(6);
  expect(await page.evaluate(names => {
    const style = getComputedStyle(document.documentElement);
    return Object.fromEntries(names.map(name => [name, style.getPropertyValue(name).trim()]));
  }, Object.keys(tokens))).toEqual(tokens);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('h1')).toHaveCSS('font-family', /Cormorant Garamond/);
  await expect(page.locator('body')).toHaveCSS('font-family', /DM Sans/);
  await page.screenshot({ path: testInfo.outputPath('portfolio-desktop.png') });
  const inventory = await (await page.request.get('/portfolio/capture/pages.json')).json();
  expect(inventory.pages.map(p => p.route).sort()).toEqual(manifest.pages.map(p => new URL(p.source_url).pathname || '/').sort());
  for (const reference of inventory.pages) {
    for (const cover of [reference.desktop, reference.mobile].filter(Boolean)) {
      const response = await page.request.get('/portfolio/capture/' + cover);
      expect(response.status(), cover).toBe(200);
      expect(response.headers()['content-type']).toBe('image/jpeg');
    }
  }
  await page.getByRole('button', { name: 'Products', exact: true }).click();
  await expect(page.locator('#gallery-status')).toHaveText('8 of 43 captured pages');
  await expect(page.locator('[data-portfolio-page]:visible')).toHaveCount(8);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/portfolio/');
  await expect(page.locator('[data-portfolio-page]')).toHaveCount(43);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('portfolio-mobile.png') });
  const journal = page.getByRole('button', { name: 'Journal', exact: true });
  await journal.focus();
  await journal.press('Enter');
  await expect(page.locator('#gallery-status')).toHaveText('9 of 43 captured pages');
  await page.locator('[data-portfolio-page]:visible').first().click();
  await expect(page).toHaveURL(/\/journal$/);
});
