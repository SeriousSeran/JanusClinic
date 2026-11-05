# Review of the supplied Janus Wellness Collection brief

Status: requirements review only. No account system, registration, appointment delivery, membership activation or payment processing has been implemented by this review. Existing preview remains unchanged.

## Understood direction

The parent Janus homepage should introduce a shared customer area before the three destinations, ordered Wellness, Salon, Cosmetic Care as shown in the sketch. A verified returning customer sees a greeting using their profile name. There is also a doctor-consultation entry point. Every area remains navigable into its services and detail pages. Booking links carry the chosen offering into one shared appointment-request flow.

The wellness destination becomes Janus Wellness Collection, with the tagline “Your Time. Your Body. Your Balance.” and Restore / Relax / Contour / Renew categories. The supplied brief now defines five signature packages, three monthly memberships, contour programmes and a standalone complimentary assessment. It supersedes the earlier requirement to leave wellness tiers undefined, with all supplied prices now approved by the owner; proposed policies and unconfirmed clinical/operational content remain subject to owner/clinic decisions.

## Decisions that change the result

1. **Browsing and registration:** the introductory wording may mean mandatory registration before visiting the three areas, while the written journey describes discovery before registration. Owner confirmed: browse freely, register/log in when booking. Use a visible shared account panel above the area choices without blocking browsing. No forced initial popup.
2. **Massage overlap:** the supplied Salon catalog has Foot Massage, 60 minutes, LKR 5,000. The new Wellness brief lists Foot Massage, duration unconfirmed, LKR 4,000. Owner confirmed the two foot massages are separate services performed by different people. Preserve Salon at LKR 5,000 / 60 minutes and Wellness at LKR 4,000 / duration pending. Give them distinct offering IDs and clearly identify the area/provider in the booking summary; provider names have not been supplied. Other differently named massages are not assumed to be the same treatment.
3. **Brand scope:** the new ivory/sage/teal/gold palette differs from the current ivory/stone/charcoal/gold interface and rose portraits. Recommendation: a wellness-only sub-brand retaining Janus logo and existing serif/sans pairing; leave parent gateway, Salon and Cosmetic identity consistent unless the owner requests a site-wide change.
4. **Photography:** the new wellness brief requests actual clinic/facility/equipment photos, whereas the earlier brief authorized illustrative Sri Lankan AI portraits. Recommendation: use real supplied clinic photographs for Wellness facilities and treatment evidence; preserve truthful image captions and do not present an AI room or procedure as real. New equipment/room photos and missing durations remain content dependencies.
5. **Consulting the doctor:** owner confirmed the first consultation is free, with no separate first doctor-consultation fee. Preserve a standalone free initial consultation/assessment booking path. Duration, availability and follow-up consultation terms are still unspecified; do not extend the free-first-visit rule to all follow-ups.
6. **Preview versus live platform:** the prior session deferred WhatsApp delivery to Lovable. Recommendation: develop the browsing/account/booking journey as an explicitly labelled interactive demonstration on the existing review site; implement real verified accounts, server validation, private storage, staff permissions, delivery and confirmation in the eventual Lovable-backed application. A simulated profile must never be presented as secure login or a saved real appointment.

## Shared booking requirements to retain

- One customer identity across all three areas; greeting uses the verified profile name, not an unverified typed phone number.
- New registration: full name, age, contact number, optional gender using the four supplied choices, privacy notice and consent. The clinic supplies minimum-age/guardian policy.
- Existing customer: securely verify ownership before returning any profile information. Live phone authentication needs a backend and SMS provider; a static host alone is insufficient.
- The first doctor consultation is free and independently bookable; do not invent follow-up consultation fees or terms.
- Selection context includes area, booking type and stable offering ID; displayed name and price come from authoritative content.
- Preferred date/time in Sri Lanka time, not guaranteed availability. Notes optional. Clinic confirms an actual appointment separately.
- Booking reference and “Request received” require an actual successful backend submission in the live application. Preview uses a visibly labelled demo outcome only.
- Membership CTAs submit enquiries until eligibility/payment are confirmed. No automatic billing or membership activation implied.
- Contour Discovery and Contour Starter share one product ID, with two cavitation area sessions; never create duplicate booking products.
- Complimentary assessment is independently selectable without a paid service.
- No automatic personal/clinical data transfer into WhatsApp. Preserve the earlier decision to defer live WhatsApp ordering until Lovable unless the owner changes it.

## Supplied prices and calculations

All package and membership arithmetic was checked against the listed individual wellness prices and is consistent.

| Offering | Regular value LKR | Offer LKR | Saving LKR |
| --- | ---: | ---: | ---: |
| Quick Reset | 5,500 | 5,000 | 500 |
| Restore Ritual | 10,000 | 8,900 | 1,100 |
| Serenity Experience | 14,000 | 12,900 | 1,100 |
| Contour Discovery / Contour Starter | 10,000 | 8,500 | 1,500 |
| Elixir Signature | 22,000 | 19,900 | 2,100 |
| Essential, monthly | 10,000 | 9,000 | 1,000 |
| Balance, monthly | 22,000 | 19,500 | 2,500 |
| Signature, monthly | 32,500 | 29,000 | 3,500 |
| Contour 4 | 20,000 | 17,000 | 3,000 |
| Contour 6 | 30,000 | 25,500 | 4,500 |

The brief's wellness floor of LKR 1,500 matches the vibration session. Fat freezing remains LKR 12,000–15,000 with assessment-dependent pricing. The owner has now explicitly approved all supplied prices, including treatment, package, membership and contour-programme pricing. This price approval does not automatically approve the separately proposed membership/cancellation/refund policies.

## Content and operational inputs for the eventual live version

These may be visibly pending during design review, but must not be invented: treatment durations; Detox/Elixir techniques and inclusions; contraindications and consent guidance; genuine facility photos; clinic address/official phone; hours/staff/rooms; consultation duration, availability and follow-up terms; package validity; membership carry-forward/refund/cancellation terms; appointment confirmation workflow; payment methods; privacy handling, staff access and minor/guardian policy. Carry-forward and gift-voucher language in the proposed FAQ must remain proposed until approved.

The existing page capture, its manifest and historical portfolio references remain intact. This review does not authorize publishing unapproved medical/commercial claims as confirmed or collecting real customer information on the public demonstration site.

## Liquid glass design discussion

The owner requested discussion of adding liquid glass after confirming the service/pricing/account decisions above. No liquid-glass product changes are approved or implemented yet. Evaluate translucent blurred surfaces, edge highlights and restrained shadows on navigation, shared account/welcome panel and persistent booking controls. Maintain readable solid surfaces for prices, clinical copy and input fields. Preserve Janus logo/type/photography and provide an opaque fallback where blur/transparency is unavailable or reduced transparency is requested. Decide the visual intensity through a mockup comparison before changing the design identity rules.
