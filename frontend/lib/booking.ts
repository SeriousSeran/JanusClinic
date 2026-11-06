import type { BookingDraft, DemoCustomer } from './types.ts';

export type FieldErrors = Record<string, string>;
export const preferredTimes = ['Morning', 'Afternoon', 'Evening'] as const;

export function normalizePhone(value: string): string | null {
  const compact = value.replace(/[\s-]/g, '');
  if (/^07\d{8}$/.test(compact)) return `+94${compact.slice(1)}`;
  if (/^\+?947\d{8}$/.test(compact)) return `+${compact.replace(/^\+/, '')}`;
  return null;
}

export function colomboToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (type: string) => parts.find(part => part.type === type)!.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function validateCustomer(customer: DemoCustomer): FieldErrors {
  const errors: FieldErrors = {};
  if (!customer.name.trim()) errors.name = 'Enter a fictional name for this demo.';
  if (!/^\d{1,3}$/.test(customer.age.trim()) || Number(customer.age) > 120) errors.age = 'Enter an age as a whole number from 0 to 120.';
  if (!normalizePhone(customer.phone)) errors.phone = 'Enter a fictional Sri Lankan mobile number, such as 0771234567.';
  return errors;
}

export function validateAppointment(draft: BookingDraft, today = colomboToday()): FieldErrors {
  const errors: FieldErrors = {};
  if (!draft.offeringId) errors.offeringId = 'Choose an offering for this demo.';
  const date = new Date(`${draft.date}T12:00:00Z`);
  const realDate = /^\d{4}-\d{2}-\d{2}$/.test(draft.date) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === draft.date;
  if (!realDate || draft.date < today) errors.date = 'Choose today or a future calendar date in Asia/Colombo.';
  if (!preferredTimes.some(time => time === draft.time)) errors.time = 'Choose Morning, Afternoon or Evening.';
  return errors;
}

export function formatPreferredDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Colombo', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00Z`));
}
