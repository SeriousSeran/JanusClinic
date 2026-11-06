import {test,expect} from '@playwright/test';
const prefix=info=>info.config.metadata.repositoryPrefix||'';
async function sample(page){await page.getByRole('button',{name:'Existing demo customer',exact:true}).click();await page.getByRole('button',{name:'Use sample registered customer'}).click();await page.getByRole('button',{name:'Simulate verification'}).click();}
test('booking selection is visible before identity and generic booking navigation preserves it',async({page},info)=>{
 await page.goto(prefix(info)+'/book/?offering=quick-reset');
 await expect(page.locator('.booking-context')).toContainText('Quick Reset');
 await expect(page.locator('.booking-context')).toContainText('5,000');
 await sample(page);
 await page.getByLabel('Preferred date (required)',{exact:true}).fill('2027-06-01');
 await page.getByRole('link',{name:'Continue booking',exact:true}).first().click();
 await expect(page.getByLabel('Offering (required)',{exact:true})).toHaveValue('quick-reset');
 await expect(page.getByLabel('Preferred date (required)',{exact:true})).toHaveValue('2027-06-01');
 await page.setViewportSize({width:390,height:844});
 await expect(page.locator('.mobile-booking')).toHaveCount(0);
});
test('mobile home gives care choices room and keeps combined preview controls compact',async({page},info)=>{
 await page.setViewportSize({width:390,height:844});await page.goto(prefix(info)+'/');
 const choices=page.getByLabel('Choose an area',{exact:true});
 expect((await choices.boundingBox()).y).toBeLessThan(590);
 expect((await page.locator('.preview-bar').boundingBox()).height).toBeLessThan(85);
 await expect(page.locator('.clinic-info')).toContainText('Gothami');
 await expect(page.locator('.clinic-info a[href="tel:+94777060404"]')).toBeVisible();
});
test('small text on the dark assessment panel uses readable on-dark color',async({page},info)=>{
 await page.goto(prefix(info)+'/wellness/');
 const contrast=await page.locator('#wellness-assessment .eyebrow').evaluate(el=>{
  const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
  const light=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
  const a=light(rgb(getComputedStyle(el).color)),b=light(rgb(getComputedStyle(el.closest('section')).backgroundColor));
  return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 });
 expect(contrast).toBeGreaterThanOrEqual(4.5);
});
test('Wellness collections have direct routes, filters and a substantially shorter overview',async({page},info)=>{
 const base=prefix(info);await page.setViewportSize({width:390,height:844});await page.goto(base+'/wellness/');
 expect(await page.evaluate(()=>document.documentElement.scrollHeight)).toBeLessThan(15000);
 await page.getByRole('link',{name:'Browse all treatments',exact:true}).click();
 await expect(page).toHaveURL(/\/wellness\/treatments\//);
 await expect(page.locator('#treatments .wellness-treatment')).toHaveCount(13);
 await page.getByLabel('Search wellness treatments').fill('foot');
 await expect(page.locator('#treatments .wellness-treatment')).toHaveCount(1);
 await expect(page).toHaveURL(/q=foot/);
 await page.reload();await expect(page.getByLabel('Search wellness treatments')).toHaveValue('foot');
 await page.getByRole('button',{name:'Clear filters',exact:true}).click();
 await page.getByRole('button',{name:'Contour',exact:true}).click();
 await expect(page.locator('#treatments .wellness-treatment')).toHaveCount(5);
 for(const route of ['packages','memberships','body-contouring']){await page.goto(base+'/wellness/'+route+'/');await page.reload();await expect(page.getByRole('heading',{level:1})).toBeVisible();}
});
test('Salon family prices and URL filters survive booking, Back and refresh',async({page},info)=>{
 const base=prefix(info);await page.goto(base+'/salon/');
 await page.getByLabel('Salon service categories').getByRole('link',{name:'Hair colour',exact:true}).click();
 await page.getByLabel('Search salon services').fill('global colour');
 await page.getByLabel('Variant for Full hair global colour',{exact:true}).selectOption('hair-015');
 const row=page.locator('[data-service-id="hair-015"]');await expect(row).toBeVisible();await expect(row).toContainText('19,000');
 await row.getByRole('link',{name:/Book/}).click();await expect(page.locator('.booking-context')).toContainText('Medium');
 await page.goBack();await expect(page.getByLabel('Search salon services')).toHaveValue('global colour');
 await expect(page.getByLabel('Variant for Full hair global colour',{exact:true})).toHaveValue('hair-015');
 await page.reload();await expect(page.getByLabel('Search salon services')).toHaveValue('global colour');
 await page.getByRole('button',{name:'Clear filters',exact:true}).click();await expect(page.locator('[data-service-id]')).toHaveCount(123);
});
test('unverified source imagery is never presented as a verified clinic interior',async({page},info)=>{
 await page.goto(prefix(info)+'/');
 await expect(page.locator('.clinic-info figcaption')).toContainText('Clinic photographs awaiting confirmation');
 await page.goto(prefix(info)+'/wellness/');
 await expect(page.locator('#facilities')).toContainText('Verified clinic photographs are pending');
 await expect(page.locator('#facilities img')).toHaveCount(0);
});
