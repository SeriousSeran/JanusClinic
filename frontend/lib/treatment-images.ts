import data from '../data/treatment-images.json' with { type: 'json' };
import type { Offering } from './types';
export interface TreatmentImageData {
  key: string; src: string; thumbnail: string; width: number; height: number;
  alt: string; source: 'photo' | 'ai'; caption: string; origin: string; position: string;
}
const images = data.images as Record<string, Omit<TreatmentImageData, 'key'>>;
const offerings = data.offerings as Record<string, string>;
const salonFamilies = data.salonFamilies as Record<string, string>;
export function treatmentImage(offering: Pick<Offering, 'id' | 'area' | 'category'>): TreatmentImageData {
  const key = offerings[offering.id] ?? (offering.area === 'salon' ? salonFamilies[offering.category] : undefined) ?? 'fallback';
  return { ...images[key in images ? key : 'fallback'], key: key in images ? key : 'fallback' };
}
