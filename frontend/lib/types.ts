export type Area = 'wellness' | 'salon' | 'cosmetic';
export type OfferingKind = 'treatment' | 'package' | 'membership' | 'programme' | 'assessment';
export interface Offering {
  bookable?: boolean;
  id: string; name: string; area: Area; kind: OfferingKind; category: string;
  price: number; maxPrice?: number; duration?: number; description: string;
  inclusions?: { id: string; quantity: number }[]; tier?: string; reviewNote?: string;
  detailPath?: string; providerLabel?: string;
}
export interface DemoCustomer { username?: string; name: string; age: string; email: string; dateOfBirth: string; gender: string; phone: string }
export interface BookingDraft { offeringId: string; date: string; time: string; notes: string }
