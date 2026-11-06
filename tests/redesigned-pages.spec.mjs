import {registerForBooking} from './profile-helper.mjs';
import {test,expect} from '@playwright/test';
const base=info=>info.config.metadata.repositoryPrefix||'';
test('integrated editorial pages preserve routes, profile and consultation context',async({page},info)=>{
 test.setTimeout(90000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of[360,390,768,1024,1440])for(const route of['services','about']){await page.setViewportSize({width,height:950});await page.goto(base(info)+'/'+route+'/');await expect(page.locator('h1')).toHaveCount(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await expect(page.locator('.about-hero')).toContainText('PGDCC');await expect(page.locator('.about-hero img')).toHaveJSProperty('complete',true);
 await page.screenshot({path:info.outputPath('doctor-desktop.png'),animations:'disabled'});
 await page.getByRole('link',{name:/Begin with a conversation/}).click();await registerForBooking(page);await expect(page).toHaveURL(/offering=initial-consultation/);await expect(page.locator('main')).toContainText('Free Initial Consultation');
 await page.goto(base(info)+'/services/');await expect(page.locator('[data-story]')).toHaveCount(8);const before=await page.locator('.river-progress').evaluate(e=>e.style.strokeDashoffset);await page.locator('[data-stone="3"]').scrollIntoViewIfNeeded();await expect.poll(()=>page.locator('.river-progress').evaluate(e=>e.style.strokeDashoffset)).not.toBe(before);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.river-progress')).toHaveCSS('stroke-dashoffset','0px');await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:info.outputPath('about-us-desktop.png'),animations:'disabled'});expect(errors).toEqual([]);
});
