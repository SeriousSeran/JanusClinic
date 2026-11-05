# Current website direction

Updated 5 November 2026. This supplements the original capture and identity guide. The three-area homepage, Cosmetic landing page, Salon catalog, Wellness holding page and three illustrative Sri Lankan portraits are now implemented in maintained source and the read-only preview. A subsequent owner brief now defines the Wellness Collection and its three memberships, packages and treatments; these expanded pages and booking/account flows are still being designed.

## User's requirements

- A gateway homepage should let visitors choose **Cosmetic**, **Salon**, or **Wellness**. Exact public section names and separate/shared contact arrangements still need confirmation.
- Replace the foreign-model imagery with imagery of Sri Lankan women in the same aesthetic, including soft rose backgrounds. AI-generated model imagery is acceptable to the user. Use adult models; keep real practitioner, staff, clinic, and actual-result photographs authentic.
- Preserve the existing design identity: font pairing, warm neutral interface palette, restrained gold details, and calm clinical presentation. The original portfolio is a visual baseline, not a requirement to retain its current models.
- The salon section should use the supplied catalog of services and prices.
- The supplied Wellness Collection brief defines Essential / Silver (LKR 9,000 monthly), Balance / Gold (LKR 19,500 monthly), and Signature / Platinum (LKR 29,000 monthly), plus five signature packages and contour programmes. The owner has approved the supplied prices. Preserve source inclusions; do not invent missing durations, policy approval or clinical claims.
- The user wants an editable, extensible website and plans to use Lovable for the eventual patient-facing deployment. The learning guide explains a proposed migration; no Lovable project or deployment has been created in this task.

## Salon source material

- Photograph: `reference/catalogs/salon-catalog.jpg`.
- Structured draft: `content/salon/catalog.draft.json`.
- Human review copy: `docs/salon-catalog-review.md`.
- The photograph has 124 entries; the active catalog has **123 services** (43 hair and 80 beauty) in 11 categories after the owner excluded the duplicate root-touching entry. Source IDs are preserved rather than renumbered.
- Owner confirmed prices are current and in **LKR** on 26 October 2026. Keep only **Root Touching (Inova), LKR 6,800**; exclude the LKR 5,000 row. Some treatment/brand labels and contact details still need confirmation. The photograph itself is undated.
- **The existing Salon massage and body-care services remain under Salon.** The Wellness Collection adds its own distinct offerings. The owner confirmed that Salon Foot Massage (LKR 5,000 / 60 minutes) and Wellness Foot Massage (LKR 4,000 / duration pending) are performed by different people and must stay separate in the catalog and booking data.

## Still needed before a patient-facing launch

- Resolution of flagged catalog wording and any tax/fee or extra pricing conditions that should be shown. Current LKR prices are already confirmed.
- Which cosmetic treatments to retain or change, using the existing site as the starting inventory.
- Booking behavior and recipients for each section: WhatsApp, call, enquiry form, or actual scheduling.
- Current clinic address and contact numbers; the catalog and existing website use different address wording and the catalog adds a phone number.
- Approved image direction and any real clinic/staff assets.
- Missing wellness durations, clinical details and operational policies; the tiers and supplied prices are now defined and owner-approved.

Do not publish uncertain prices, silently reconcile conflicting contacts, promise confirmed appointment slots from an enquiry button, or infer wellness packages from individual catalog treatments.

## Subsequent owner decisions and design discussion

Visitors may browse freely; registration/login is required when booking. Use a shared account/welcome area above Wellness, Salon and Cosmetic Care. The first consultation is free, with no separate initial doctor-consultation fee; do not infer terms for follow-up visits. All supplied wellness treatment/package/membership/contour prices are finally approved. Membership/refund/cancellation policies remain proposed until separately confirmed. See `docs/wellness-brief-review.md` for reconciled requirements.

Liquid glass is now a design discussion, not an implemented or approved theme change. Consider its intensity and scope while preserving Janus identity and readable pricing/clinical information.
