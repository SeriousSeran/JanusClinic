import {test,expect} from '@playwright/test';
const base=info=>info.config.metadata.repositoryPrefix||'';
test('contact page preserves booking navigation and loads only the requested map',async({page},info)=>{
 test.setTimeout(60000);
 const mapRequests=[],writes=[];
 page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))writes.push(request.url());});
 await page.route('https://www.google.com/maps**',async route=>{mapRequests.push(route.request().url());await route.fulfill({contentType:'text/html',body:'<h1>Map test fixture</h1>'});});
 for(const width of [360,768,1440]){
  await page.setViewportSize({width,height:950});await page.goto(base(info)+'/contact/');
  await expect(page).toHaveTitle('Contact & Booking | Janus Estheti Clinique');
  await expect(page.locator('h1')).toContainText('Your next chapter.');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('main iframe')).toHaveCount(0);
 }
 expect(mapRequests).toEqual([]);
 await expect(page.locator('main a[href^="tel:"]')).toHaveAttribute('href','tel:+94777060404');
 await expect(page.locator('main a[href^="mailto:"]')).toHaveAttribute('href','mailto:janusclinique@gmail.com');
 await expect(page.locator('main a[href="https://share.google/cSlVqqcddb1tgUuCX"]')).toHaveCount(2);
 await page.getByRole('button',{name:'Load Google Maps'}).click();
 await expect(page.locator('iframe')).toBeFocused();
 await expect.poll(()=>mapRequests.length).toBe(1);
 expect(new URL(mapRequests[0]).searchParams.get('q')).toContain('Janus Medical Center');
 await page.locator('main').getByRole('link',{name:'Register / Sign in to book'}).first().click();
 await expect(page).toHaveURL(new RegExp(base(info)+'/profile/'));
 await expect(page.locator('main')).toContainText('Profile and');
 await page.goBack();await expect(page.locator('h1')).toContainText('Your next chapter.');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.contact-reach')).toHaveCSS('animation-name','none');
 expect(writes).toEqual([]);
});
