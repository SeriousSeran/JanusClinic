import salon from '../../content/salon/catalog.draft.json';
import wellness from '../data/wellness.json';
import content from '../../site/content.json';
import type { Offering } from './types';

const wellnessSource = wellness as Offering[];
export const wellnessOfferings = wellnessSource.filter(o => o.bookable !== false);
export const salonOfferings: Offering[] = salon.items.map(item => ({
  id: item.id, name: item.name, area: 'salon', kind: 'treatment',
  category: salon.categories.find(c => c.id === item.category_id)!.label,
  price: item.price_lkr, duration: item.duration_minutes ?? undefined,
  description: 'From the supplied Janus salon service menu.', reviewNote: ('review_note' in item ? item.review_note : undefined) as string | undefined,
  providerLabel: 'Salon therapist',
}));
export const cosmeticOfferings: Offering[] = content.cosmetic_treatments.map(t => ({
  id: 'cosmetic-' + t.slug, name: t.name, area: 'cosmetic', kind: 'treatment', category: 'Cosmetic Care',
  price: 0, description: t.detail, detailPath: '/services/medical-cosmetic/' + t.slug + '/',
}));
export const consultation: Offering = { id: 'initial-consultation', name: 'Free Initial Consultation', area: 'cosmetic', kind: 'assessment', category: 'Consultation', price: 0, description: 'Your first consultation is complimentary. Follow-up terms will be confirmed by the clinic.' };
export const allOfferings: Offering[] = [...wellnessOfferings, ...salonOfferings, ...cosmeticOfferings, consultation];
export const findOffering = (id: string) => [...allOfferings, ...wellnessSource.filter(o => o.bookable === false)].find(o => o.id === id);
export const regularValue = (offering: Offering): number => offering.inclusions?.reduce((sum, item) => {
  const included = findOffering(item.id);
  if (!included) throw new Error('Unknown included offering: ' + item.id);
  return sum + included.price * item.quantity;
}, 0) ?? offering.price;
const number = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 });
export const money = (price: number, maxPrice?: number) => price === 0 ? 'Complimentary' : `LKR ${number.format(price)}${maxPrice ? '–' + number.format(maxPrice) : ''}`;
export const offeringPrice = (o: Offering) => o.area === 'cosmetic' && o.kind === 'treatment' ? 'Price on consultation' : money(o.price, o.maxPrice);
export const bookingHref = (id: string) => '/book/?offering=' + encodeURIComponent(id);
