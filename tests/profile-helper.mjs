import {expect} from '@playwright/test';
export async function registerForBooking(page){
 await expect(page).toHaveURL(/profile\//);
 await page.getByLabel('Name *',{exact:true}).fill('Demo customer');await page.getByLabel('Username *',{exact:true}).fill('demo.visitor');await page.getByLabel('Email address *',{exact:true}).fill('guest@example.com');await page.getByLabel('Mobile number *',{exact:true}).fill('0771234567');await page.getByLabel('Date of birth *',{exact:true}).fill('1996-01-01');await page.getByLabel('Password *',{exact:true}).fill('fictional long passphrase');await page.getByLabel('Confirm password *',{exact:true}).fill('fictional long passphrase');await page.getByRole('button',{name:'Create my profile'}).click();await expect(page.locator('.profile-details')).toContainText('guest@example.com');await page.getByRole('link',{name:/Book an appointment/}).first().click();
}
