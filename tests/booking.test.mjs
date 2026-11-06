import test from 'node:test';
import assert from 'node:assert/strict';
import { ageFromDateOfBirth, normalizePhone, colomboToday, validateCustomer, validateAppointment, formatPreferredDate } from '../frontend/lib/booking.ts';
const customer = { name: 'Demo customer', age: '30', email: 'guest@example.com', dateOfBirth: '1996-01-01', gender: '', phone: '0771234567' };
const draft = { offeringId: 'sample', date: '2027-01-02', time: 'Morning', notes: '' };
test('normalizes Sri Lankan mobile formats without inferring a provider', () => {
  for (const value of ['0771234567', '+94771234567', '94771234567', '077 123-4567']) assert.equal(normalizePhone(value), '+94771234567');
});
test('rejects malformed mobile numbers and non-mobile numbers', () => {
  for (const value of ['', '0111234567', '+44771234567', '077123456', '07712345678', '077abc4567', '++94771234567', '(077)1234567', '0094771234567']) assert.equal(normalizePhone(value), null, value);
});
test('validates contact email and date of birth and calculates age at birthday boundaries', () => {
 assert.deepEqual(validateCustomer(customer), {});
 assert.equal(ageFromDateOfBirth('2000-11-07','2026-11-06'),25);
 assert.equal(ageFromDateOfBirth('2000-11-07','2026-11-07'),26);
 assert.equal(ageFromDateOfBirth('2000-02-29','2026-02-28'),25);
 assert.equal(ageFromDateOfBirth('2000-02-29','2026-03-01'),26);
 for(const dob of ['', '2025-02-29','2099-01-01','1800-01-01'])assert.ok(validateCustomer({...customer,dateOfBirth:dob}).dateOfBirth);
 for(const email of ['', 'guest', 'guest@', 'guest @example.com'])assert.ok(validateCustomer({...customer,email}).email);
 assert.ok(validateCustomer({...customer,name:'  '}).name);
 assert.ok(validateCustomer({...customer,phone:'0111234567'}).phone);
});
test('calculates today in Asia/Colombo around UTC midnight', () => {
  assert.equal(colomboToday(new Date('2026-11-06T19:00:00Z')), '2026-11-07');
  assert.equal(colomboToday(new Date('2026-11-06T18:00:00Z')), '2026-11-06');
});
test('requires a real calendar date, offering and allowed time', () => {
  const today = '2026-11-07';
  assert.deepEqual(validateAppointment(draft, today), {});
  assert.deepEqual(validateAppointment({ ...draft, date: today, notes: '' }, today), {});
  for (const date of ['', '2026-11-06', '2027-02-29', '2027-02-30', '2027-13-01', '2027-1-02', 'not-a-date']) assert.ok(validateAppointment({ ...draft, date }, today).date, date);
  assert.deepEqual(validateAppointment({ ...draft, date: '2028-02-29' }, today), {});
  assert.ok(validateAppointment({ ...draft, offeringId: '' }, today).offeringId);
  for (const time of ['', 'Night', 'morning']) assert.ok(validateAppointment({ ...draft, time }, today).time);
  for (const time of ['Morning', 'Afternoon', 'Evening']) assert.deepEqual(validateAppointment({ ...draft, time }, today), {});
});
test('formats preferred dates without shifting calendar day', () => {
  assert.equal(formatPreferredDate('2027-01-02'), '2 January 2027');
});
