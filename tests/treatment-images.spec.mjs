import { test, expect } from '@playwright/test';
const prefix = info => info.config.metadata.repositoryPrefix || '';
test.beforeEach(async ({ page }) => {
 await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});
async function verifyImages(page, base) {
 const figures = page.locator('main .treatment-image');
 expect(await figures.count()).toBeGreaterThan(0);
 for (const figure of await figures.all()) {
  await figure.scrollIntoViewIfNeeded();
  const img = figure.locator('img');
  await expect.poll(()=>img.evaluate(i=>i.complete && i.naturalWidth>0)).toBe(true);
  await expect(img).toHaveAttribute('alt',/.{16,}/);
  await expect(img).toHaveAttribute('src',new RegExp('^'+base+'/site/assets/treatments/'));
  if(await figure.getAttribute('data-source')==='ai')await expect(figure.locator('figcaption')).toContainText('AI-generated illustration');
 }
}
test('every Wellness treatment and assessment has a visible, loaded and disclosed image',async({page},info)=>{
 const base=prefix(info);await page.goto(base+'/wellness/');
 await expect(page.locator('#wellness-assessment .treatment-image')).toHaveCount(1);
 await verifyImages(page,base);
 await page.goto(base+'/wellness/treatments/');
 const individual=page.locator('#treatments .treatment-image');
 await expect(individual).toHaveCount(13);
 await verifyImages(page,base);
 const card=page.locator('article').filter({has:page.locator('[data-offering-id="wellness-foot"]')}).first();
 await card.locator('summary').click();
 await expect(card.getByRole('link',{name:'Select Foot Massage in demo',exact:true})).toHaveAttribute('href',base+'/book/?offering=wellness-foot');
});
test('Cosmetic photos and all Salon variants retain relevant images and searchable prices',async({page},info)=>{
 const base=prefix(info);await page.goto(base+'/cosmetic/');
 await expect(page.locator('.treatment-item .treatment-image')).toHaveCount(8);
 await verifyImages(page,base);
 await page.goto(base+'/salon/');
 await page.locator('.catalog-category').evaluateAll(elements=>elements.forEach(e=>e.open=true));
 await expect(page.locator('[data-service-id] .treatment-image')).toHaveCount(123);
 // Shared images are checked once after every row's association/provenance is asserted.
 const rows=await page.locator('[data-service-id]').evaluateAll(elements=>elements.map(row=>{
  const figure=row.querySelector('.treatment-image');
  return {id:row.getAttribute('data-service-id'),imageId:figure.getAttribute('data-offering-id'),source:figure.getAttribute('data-source'),caption:figure.querySelector('figcaption').textContent};
 }));
 for(const row of rows){
  expect(row.imageId).toBe(row.id);
  if(row.source==='ai')expect(row.caption).toContain('AI-generated illustration');
 }
 const images=page.locator('.catalog-category .treatment-image img');
 await images.evaluateAll(imgs=>imgs.forEach(img=>img.loading='eager'));
 await expect.poll(()=>images.evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
 await page.getByLabel('Search salon services').fill('foot massage');
 await expect(page.locator('[data-service-id]')).toHaveCount(1);
 await expect(page.locator('[data-service-id="beauty-028"]')).toContainText('5,000');
 await expect(page.locator('[data-service-id="beauty-028"] .treatment-image')).toHaveAttribute('data-image-key','foot');
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),String(width)).toBe(true);
 }
});
test('a missing image keeps the treatment readable and bookable',async({page},info)=>{
 const base=prefix(info);
 await page.route('**/site/assets/treatments/massage*.webp',route=>route.abort());
 await page.goto(base+'/wellness/');
 const figure=page.locator('[data-offering-id="wellness-pain-relief"]');
 await figure.scrollIntoViewIfNeeded();
 await expect(figure.getByText('Image unavailable', {exact:true})).toBeVisible();
 await expect(figure.locator('figcaption')).toContainText('AI-generated illustration');
 const card=figure.locator('..');
 await card.locator('summary').click();
 await expect(card.getByRole('link',{name:'Select Pain Relief Massage in demo',exact:true})).toBeVisible();
 await expect(card).toContainText('6,500');
});
test('compact Salon booking labels retain their accessible names without crowding prices',async({page},info)=>{
 await page.setViewportSize({width:320,height:844});
 await page.goto(prefix(info)+'/salon/');
 await page.getByLabel('Search salon services').fill('foot massage');
 const row=page.locator('[data-service-id="beauty-028"]');
 await expect(row.getByRole('link',{name:'Book Foot massage',exact:true})).toBeVisible();
 const bounds=await row.locator('.catalog-book .sr-only').boundingBox();
 expect(bounds.width).toBeLessThanOrEqual(1);
 await expect(row).toContainText('5,000');
});
test('Wellness image disclosure meets normal-text contrast',async({page},info)=>{
 await page.goto(prefix(info)+'/wellness/');
 const contrast=await page.locator('#treatments .treatment-image figcaption').first().evaluate(el=>{
  const style=getComputedStyle(el);
  const rgb=value=>value.match(/[\d.]+/g).slice(0,3).map(Number);
  const background=rgb(getComputedStyle(el.closest('.surface')).backgroundColor);
  const opacity=Number(style.opacity);
  const foreground=rgb(style.color).map((channel,i)=>channel*opacity+background[i]*(1-opacity));
  const luminance=channels=>channels.map(channel=>{const s=channel/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;}).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
  const a=luminance(foreground),b=luminance(background);
  return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 });
 expect(contrast).toBeGreaterThanOrEqual(4.5);
});
