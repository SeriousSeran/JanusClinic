import {test,expect} from '@playwright/test';
const base=info=>info.config.metadata.repositoryPrefix||'';
test('registration is optional to browsing and gates booking without losing treatment selection',async({page},info)=>{
 test.setTimeout(90000);const writes=[];page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
 await page.goto(base(info)+'/book/?offering=quick-reset');await expect(page).toHaveURL(/profile\//);await expect(page.locator('.booking-page')).toHaveCount(0);
 await page.getByLabel('Name *',{exact:true}).fill('Demo customer');await page.getByLabel('Username *',{exact:true}).fill('demo.visitor');await page.getByLabel('Email address *',{exact:true}).fill('guest@example.com');await page.getByLabel('Mobile number *',{exact:true}).fill('0771234567');await page.getByLabel('Date of birth *',{exact:true}).fill('1996-01-01');
 await page.getByLabel('Password *',{exact:true}).fill('fictional long passphrase');await page.getByLabel('Confirm password *',{exact:true}).fill('fictional long passphrase');await page.getByRole('button',{name:'Create my profile'}).click();
 await expect(page.locator('.profile-details')).toContainText('guest@example.com');await expect(page.locator('.booking-page')).toHaveCount(0);
 await page.getByRole('link',{name:'Book an appointment',exact:false}).filter({hasText:'Book an appointment'}).first().click();await expect(page.getByLabel('Offering (required)',{exact:true})).toHaveValue('quick-reset');
 await page.goto(base(info)+'/profile/');await expect(page.locator('.profile-demo')).toBeVisible(); // full reload clears demo accounts
 await expect(page.getByRole('button',{name:'Create my profile'})).toBeVisible();expect(writes).toEqual([]);
});
