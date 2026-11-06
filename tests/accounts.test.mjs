import test from 'node:test';
import assert from 'node:assert/strict';
import {DemoAccounts,safeNext,validPassword} from '../frontend/lib/accounts.ts';
const profile={name:'Demo customer',username:'demo.visitor',email:'guest@example.com',dateOfBirth:'1996-01-01',age:'',phone:'0771234567',gender:''};
const password='fictional long passphrase';
test('profile registration supports username/email login, one unique email, edits and password rotation',async()=>{
 const accounts=new DemoAccounts();const saved=await accounts.register(profile,password);
 assert.equal(saved.phone,'+94771234567');assert.match(saved.age,/^\d+$/);
 assert.equal((await accounts.login('DEMO.VISITOR',password)).email,profile.email);
 assert.equal((await accounts.login(' GUEST@EXAMPLE.COM ',password)).username,profile.username);
 await assert.rejects(accounts.login(profile.email,'wrong password'),/did not match/);
 await assert.rejects(accounts.register({...profile,username:'another'},password),/already used/);
 await assert.rejects(accounts.register({...profile,email:'other@example.com'},password),/already used/);
 const other=await accounts.register({...profile,username:'another',email:'other@example.com'},password);
 await assert.rejects(accounts.update(saved,{...saved,email:other.email},password,''),/already used/);
 await assert.rejects(accounts.update(saved,{...saved,email:'new@example.com'},'wrong',''),/current password/);
 const edited=await accounts.update(saved,{...saved,name:'Updated customer',email:'new@example.com'},password,'new fictional passphrase');
 assert.equal(edited.name,'Updated customer');await assert.rejects(accounts.login('guest@example.com',password),/did not match/);
 await assert.rejects(accounts.login(profile.username,password),/did not match/);
 assert.equal((await accounts.login('new@example.com','new fictional passphrase')).name,'Updated customer');
 const freshTab=new DemoAccounts();await assert.rejects(freshTab.login('new@example.com','new fictional passphrase'),/did not match/);
});
test('profile continuation preserves internal selection and rejects external redirects',()=>{
 assert.equal(safeNext('/book/?offering=quick-reset'),'/book/?offering=quick-reset');assert.equal(safeNext('/?contact-doctor=1'),'/?contact-doctor=1');
 for(const value of ['https://evil.example','//evil.example','/unknown/','javascript:alert(1)'])assert.equal(safeNext(value),'/book/');
 assert.equal(validPassword('too short'),false);assert.equal(validPassword('a'.repeat(15)),true);assert.equal(validPassword('a'.repeat(129)),false);
});
