import {registerForBooking} from './profile-helper.mjs';
import {test,expect} from '@playwright/test';
const prefix=info=>info.config.metadata.repositoryPrefix||'';
test.beforeEach(async({page})=>{await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());});
const sample=registerForBooking;
test('preselected package, edit flow and confirmation stay local and clearly simulated',async({page},info)=>{
 const base=prefix(info);const errors=[],writes=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
 await page.goto(base+'/book/?offering=quick-reset');await sample(page);
 await expect(page.getByLabel('Offering (required)',{exact:true})).toHaveValue('quick-reset');
 await page.getByLabel('Preferred date (required)',{exact:true}).fill('2099-12-20');await page.getByLabel('Preferred time (required)',{exact:true}).selectOption('Afternoon');await page.getByRole('button',{name:'Review demo request'}).click();
 await expect(page.locator('.booking-summary').first()).toContainText('Demo customer');await expect(page.locator('main')).toContainText('LKR 5,000');
 await page.getByRole('button',{name:'Edit appointment',exact:true}).click();await expect(page.getByLabel('Offering (required)',{exact:true})).toHaveValue('quick-reset');await expect(page.getByLabel('Preferred date (required)',{exact:true})).toHaveValue('2099-12-20');await page.getByRole('button',{name:'Review demo request'}).click();
 await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Create demo request preview'}).click();await expect(page.locator('main')).toContainText('Awaiting clinic confirmation (demonstration)');await expect(page.locator('main')).toContainText('No request was sent.');await expect(page.locator('main')).toContainText('DEMO-');
 await page.getByRole('link',{name:'Return to browsing'}).click();await expect(page.locator('.account-panel')).toContainText('Welcome, Demo customer');await page.reload();await expect(page.locator('.account-panel')).not.toContainText('Welcome, Demo customer');
 expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);expect(writes).toEqual([]);expect(errors).toEqual([]);
});
test('new demo registration validates inputs and retains the correct massage provider',async({page},info)=>{
 await page.goto(prefix(info)+'/book/?offering=beauty-028');await sample(page);await expect(page.locator('.booking-selection')).toContainText('LKR 5,000');await expect(page.locator('.booking-selection')).toContainText('Salon therapist');
 await page.getByLabel('Preferred date (required)',{exact:true}).fill('2000-01-01');await page.getByRole('button',{name:'Review demo request'}).click();await expect(page.locator('#date-error')).toBeVisible();
});
test('unknown offerings recover without exposing the internal price unit',async({page},info)=>{
 await page.goto(prefix(info)+'/book/?offering=wellness-cavitation-area');await sample(page);await expect(page.getByRole('main')).toContainText('linked offering was not found');await expect(page.getByLabel('Offering (required)',{exact:true})).toHaveValue('');expect(await page.locator('option[value="wellness-cavitation-area"]').count()).toBe(0);
 await page.getByLabel('Area',{exact:true}).selectOption('cosmetic');await page.getByLabel('Offering (required)',{exact:true}).selectOption('cosmetic-botox');await expect(page.locator('.booking-selection')).toContainText('Price on consultation');await expect(page.locator('.booking-selection')).not.toContainText('Complimentary');
});
test('portable catalog replaces expired attachment paths and all authored routes refresh',async({page,request},info)=>{
 const base=prefix(info);for(const route of ['/','/salon/','/cosmetic/','/wellness/','/book/','/wellness/book/','/wellness/body-contouring/']){const response=await page.goto(base+route);expect(response.status()).toBe(200);await expect(page.locator('h1')).not.toContainText('Loading');await expect(page.locator('header.site-header')).toBeVisible();}
 await page.goto(base+'/salon/');const source=page.getByRole('link',{name:'View original salon catalog photograph'});await expect(source).toHaveAttribute('href',base+'/site/assets/salon-catalog.jpg');const jpg=await request.get(base+'/site/assets/salon-catalog.jpg');expect(jpg.status()).toBe(200);expect((await jpg.body()).subarray(0,2).toString('hex')).toBe('ffd8');
});
test('Glisse, palette, breakpoints and reduced-motion fallback render without overflow',async({page},info)=>{
 for(const width of [320,390,768,1024,1440]){await page.setViewportSize({width,height:1000});await page.goto(prefix(info)+'/');await expect(page.locator('[data-area]')).toHaveCount(3);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),String(width)).toBe(true);}
 expect(await page.locator('.lg-glass').count()).toBeGreaterThan(3);expect(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim().toLowerCase())).toBe('#213b45');
 await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});await expect(page.locator('header')).toBeVisible();await expect.poll(()=>page.locator('.header-glass').evaluate(e=>getComputedStyle(e).backdropFilter)).toBe('none');
});

test('changing from membership to Salon resets incompatible types and exposes its services',async({page},info)=>{
 await page.goto(prefix(info)+'/book/?offering=membership-essential');await sample(page);await expect(page.getByLabel('Offering type',{exact:true})).toHaveValue('membership');await page.getByLabel('Area',{exact:true}).selectOption('salon');await expect(page.getByLabel('Offering type',{exact:true})).toHaveValue('');await expect(page.locator('#offeringId option')).toHaveCount(124);await expect(page.locator('#kind option[value="membership"]')).toHaveCount(0);
});
test('keyboard route changes move focus into destination content',async({page},info)=>{
 await page.goto(prefix(info)+'/');const link=page.getByLabel('Main navigation',{exact:true}).getByRole('link',{name:'Cosmetic Care',exact:true});await page.setViewportSize({width:1440,height:900});await link.focus();await link.press('Enter');await expect(page.getByRole('heading',{level:1})).toBeFocused();
});
