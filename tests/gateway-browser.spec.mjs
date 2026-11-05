import { test, expect } from '@playwright/test';

const prefix = info => info.config.metadata.repositoryPrefix || '';
test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

test('three homepage choices lead to distinct areas and cosmetic treatment guides', async ({ page }, info) => {
  const base = prefix(info);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + '/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Care, in every sense.');
  await expect(page.locator('[data-area]')).toHaveCount(3);
  for (const area of ['cosmetic', 'salon', 'wellness']) {
    const card = page.locator(`[data-area="${area}"]`);
    await expect(card).toHaveAttribute('href', `${base}/${area}/`);
    await expect.poll(() => card.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: info.outputPath('gateway-desktop.png'), fullPage: true });
  await page.locator('[data-area="cosmetic"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cosmetic.');
  await page.getByRole('link', { name: /BOTOX & Muscle Relaxing Injections/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('BOTOX');
  if (base) {
    await page.getByLabel('Janus areas').getByRole('link', { name: 'Salon', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Salon.');
  }
  expect(errors).toEqual([]);
});

test('salon exposes the confirmed catalog, body care, conditions and readable review notes', async ({ page }, info) => {
  const base = prefix(info);
  await page.goto(base + '/salon/');
  await expect(page.locator('[data-service-id]')).toHaveCount(123);
  await expect(page.locator('[data-service-id="hair-020"]')).toHaveCount(0);
  await page.getByLabel('Salon service categories').getByRole('link', { name: 'Hair colour', exact: true }).click();
  const rootTouch = page.locator('[data-service-id="hair-019"]');
  await expect(rootTouch).toBeVisible();
  await expect(rootTouch).toContainText('6,800');
  await page.getByLabel('Salon service categories').getByRole('link', { name: 'Body care', exact: true }).click();
  await expect(page.locator('#catalog-body-care')).toHaveAttribute('open', '');
  await expect(page.locator('#catalog-body-care')).toContainText('Full body massage');
  await expect(page.locator('[data-service-id="beauty-026"]')).toContainText('60 min');
  await expect(page.locator('[data-service-id="beauty-028"]')).toContainText('60 min');
  await expect(page.getByRole('heading', { name: 'A note on prices' })).toBeVisible();
  await expect(page.locator('.price-conditions')).toContainText('2,000');
  await page.getByLabel('Salon service categories').getByRole('link', { name: 'Cleanup / facial / threading', exact: true }).click();
  await expect(page.locator('[data-service-id="beauty-023"]')).toContainText('Wording to confirm');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('salon-mobile.png') });
});

test('wellness stays undefined and deep links open salon body care', async ({ page }, info) => {
  const base = prefix(info);
  await page.goto(base + '/wellness/');
  await expect(page.getByRole('main')).toContainText('being developed');
  await expect(page.getByRole('main')).not.toContainText(/LKR|Tier 1|Tier 2|Tier 3/);
  await page.getByRole('link', { name: 'Browse massage & body care' }).click();
  await expect(page.locator('#catalog-body-care')).toHaveAttribute('open', '');
  await expect(page.locator('#catalog-body-care')).toBeInViewport();
});

test('gateway navigation works by keyboard on small screens without overflow', async ({ page }, info) => {
  const base = prefix(info);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/');
  for (const area of ['Cosmetic', 'Salon', 'Wellness']) await expect(page.getByLabel('Choose an area', { exact: true }).getByRole('link', { name: area })).toBeInViewport();
  const open = page.getByRole('button', { name: 'Open navigation menu' });
  await open.focus(); await open.press('Enter');
  await expect(open).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  await expect(open).toHaveAttribute('aria-expanded', 'false');
  await open.click();
  await page.getByLabel('Mobile navigation').getByRole('link', { name: 'Wellness', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Wellness.');
  for (const route of ['/', '/cosmetic/', '/salon/', '/wellness/']) {
    await page.goto(base + route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
  await page.goto(base + '/');
  await page.screenshot({ path: info.outputPath('gateway-mobile.png'), fullPage: true });
});
