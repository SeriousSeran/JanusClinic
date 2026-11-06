# Janus website review — 6 November 2026

Reviewed live preview https://seriousseran.github.io/JanusClinic/ at source revision5e812dd. This is an inspection and proposal; no application changes were made.

## Method and scope

Used the installed Frontend Design guidance for visual hierarchy, Impeccable's audit playbook/context loader for interface quality, and freshly fetched Vercel Web Interface Guidelines for accessibility and interaction checks. Agent Browser CLI is unavailable in this environment; used the repository's Playwright/Chromium setup for actual browsing, screenshots, measurements and a simulated sample booking. Five primary routes were inspected at390×844 and1440×1000; additional320×568 viewport checks covered those routes. No real customer information or clinic request was submitted.

Ran axe-core4.10.3 against initial/representative states on Home, Wellness, Salon, Cosmetic Care and Booking. One verified color-contrast violation appeared on Wellness. Other routes had no automatically detected violations in those states; contrast over glass/photography produced incomplete results requiring manual review. This is not a complete WCAG assessment or a real-device/performance certification. Impeccable's source detector returned no findings for the explicitly supplied frontend source files; that does not establish overall usability or semantic correctness. No claims about real-user Core Web Vitals are made.

## What to preserve

The ivory/sage/teal system, magenta Janus logo, local Cormorant Garamond/DM Sans, restrained glass surfaces and Sri Lankan editorial imagery form a coherent identity. Keep readable solid treatment/price/form content, explicit AI captions, searchable Salon catalog, separate foot-massage providers, consistent structured prices and clearly labelled demo limitations. No broken completed image requests or page overflow were observed in the sampled initial states; the existing image-specific test suite covers full image loading separately.

## Fix first: verified defects

### P1 — Floating booking CTA clears a selected offering

Location: `frontend/App.tsx:45` (shared floating link to `/book/`) and `frontend/pages/Booking.tsx:36` (offering reset when incoming query changes).

Reproduction on live mobile preview:
1. Open `/book/?offering=quick-reset`.
2. Choose Existing demo customer → Use sample registered customer → Simulate verification.
3. The offering selector correctly contains `quick-reset`.
4. Tap the persistent “Appointment request demo” control.
5. URL becomes `/book/`; the selector becomes empty.

Impact: a visitor loses the service/package they already chose. Proposed fix: on booking routes, make the persistent control continue the current step or hide the redundant control; preserve the selection in any generic booking link. Add a regression covering chosen package→identity→floating action. Show the selected service and price before identity, throughout all steps. Quick Reset is currently not visible in the initial identify screen, although its ID is carried correctly until the generic link clears it.

### P1 — Free-assessment eyebrow fails contrast

Location: `frontend/pages/Wellness.tsx:81`, `.wellness-assessment-layout > div:nth-child(1) > .eyebrow`; related inherited text rule in `frontend/theme.css` and dark-surface styles in `frontend/pages/wellness.css`.

Observed text: “07 · Complimentary assessment”. Computed foreground `#526168`, background `#213B45`,11px normal text. Axe reports1.84:1 contrast; normal text requires4.5:1 under WCAG1.4.3. Proposed fix: define an explicit readable on-dark text token and apply it to the eyebrow and supporting metadata. Add coverage for all small text on dark panels, beyond the image-caption regression already present.

## Next usability/design pass

### P2 — Compact the mobile welcome and fixed controls

Locations: `frontend/App.tsx:19`, `frontend/App.tsx:24`, `frontend/App.tsx:45`, `frontend/theme.css` mobile rules.

At390×844, the first image-led care choice starts around733px down the homepage; Salon starts1248px and Cosmetic Care1739px. Text shortcuts are present near the initial fold, but the stronger image choices sit lower. The floating booking panel is62px high and the preview bar69px:131px of persistent bottom controls, plus a66px header.

Propose a shorter account/welcome panel **above** the three areas, preserving the owner's ordering. Make the three destinations visually explicit immediately below it with small supporting thumbnails, and reduce the combined preview/booking chrome while retaining an unmistakable demo notice. Keep the sticky control out of the way on booking screens and apply safe-area spacing for physical phones. This is a layout improvement, not evidence of complete focus occlusion or failed touch gestures.

### P2 — Make Wellness shorter to explore

Location: `frontend/pages/Wellness.tsx:47` onward, `frontend/pages/wellness.css` service/category layout.

Measured mobile document height approximately23072px:27 viewport heights at844px. Desktop height approximately12492px. The mobile sub-navigation occupies multiple rows before the hero. All treatment cards, packages, membership cards/comparison, contour bundles, FAQs and repeated CTAs accumulate in one document.

Propose a concise overview with clear routes to Treatments, Packages and Memberships; keep the free assessment prominent. Add Restore/Relax/Contour filtering and search for individual treatments, show essential name/price/duration status first, and retain expandable detail content. Dedicated catalog routes can hold the full collections using the existing data source. Do not remove treatment availability, disclosures or approved prices. Keep memberships clearly monthly and packages one-time; avoid repeating the same contour product as separate booking inventory.

### P2 — Improve Salon scanning and return navigation

Location: `frontend/App.tsx:31`, central image map and Salon data.

The current search and category accordions are useful;123 rows with thumbnails and provenance captions still create substantial scanning inside categories. Propose selectable categories, clear active-filter/reset controls, and family groups for size/length variants with price selection. Keep the distinct providers visible. Preserve the query/category in the URL so Back, refresh and shared links restore the visitor's place. Avoid a large arbitrary dropdown when searching available offerings; maintain keyboard and screen-reader semantics.

### P2 — Add practical clinic confidence and genuine context

Locations: homepage/footer `frontend/App.tsx`, facilities `frontend/pages/Wellness.tsx:83`, treatment metadata.

Add a small clinic-information strip with management-confirmed location, opening hours and tap-to-call, plus a genuine clinic photograph. Keep practitioner credentials tied to verified source content. Replace conceptual imagery with genuine room/device photographs as the clinic supplies them. Publish confirmed duration, what the visit includes and preparation guidance on treatment detail views; do not invent pending details, reviews or clinical claims.

The current free assessment is independently accessible and consultation is complimentary; keep both explicit. This content work should be prepared before the patient-facing Lovable launch.

## Supporting maintainability/performance work

### P2 — Centralize surface/text tokens

Locations: `frontend/theme.css`, `frontend/pages/wellness.css`, `frontend/pages/booking.css`, `frontend/treatment-image.css`.

The palette is visually consistent but many literal hex colors repeat across files. Introduce a small explicit token set for background, surface, text, muted text, on-dark text, border and focus. This would have prevented the dark-panel eyebrow defect and should make later editing safer. Keep Glisse's tested preference fallback wrapper. No dark mode or new styling dependency is necessary for this task.

### P3 — Maintain asset and document discipline

Keep WebP thumbnails, shared service-family downloads and lazy treatment images. Consider responsive sources/high fetch priority for the actual above-fold hero after profiling; do not blanket-preload images. Impeccable reports missing PRODUCT.md/DESIGN.md, but existing identity/brief documents already exist: add concise entry-point documents linking to those authorities rather than duplicating their requirements. No general animation increase is recommended; preserve reduced-motion support.

## Audit health — scoped heuristic

| Dimension | Score /4 | Evidence/limitation |
| --- | --- | --- |
| Accessibility |2| Labels/semantics and fallback work exist; one confirmed normal-text contrast failure; glass contrast requires manual work. |
| Performance |3| Optimized shared images and lazy loading; JS bundle approximately361KB uncompressed; no field vitals measured. |
| Theming |2| Consistent visual palette with repeated literal colors and one verified on-dark inheritance defect. |
| Responsive layout |3| No document overflow on sampled phone/desktop widths; persistent mobile controls and long discovery pages need refinement; physical touch/safe areas not tested. |
| Implementation integrity |3| Coherent brand, structured offerings and transparent demo behavior; generic booking CTA loses selection. |
| Total |13/20| Focused usability/accessibility improvements warranted; this is a review heuristic, not a certification. |

Implementation integrity verdict: coherent product-specific visual system; correct the booking-state regression. No P0 blockers identified in sampled demo journeys. Priorities:P1 two verified defects; P2 mobile/discovery/clarity/content/token improvements; P3 asset/document polish.

## Recommended order

1. Fix selection preservation and the dark-panel text contrast, with targeted regressions (`$impeccable harden`, `$impeccable audit`).
2. Compact mobile chrome/welcome and improve booking-selection visibility (`$impeccable adapt`, `$impeccable clarify`).
3. Improve Wellness discovery and Salon filtering/variants (`$impeccable layout`, `$impeccable distill`).
4. Add clinic-confirmed information and real photography, then inspect representative desktop/mobile states (`$impeccable polish`).

Production authentication, OTP, clinic delivery, staff permissions and payments remain a separate Lovable/backend phase. Their intentional absence from this static demo is not counted as a preview defect. No security penetration test or clinical-content approval was performed.

## Implementation follow-up

The owner approved all proposals. The usability pass adds dedicated Wellness collections, URL-backed filters, Salon family selectors, persistent booking context, compact mobile chrome and semantic on-dark colors. Later visual inspection corrected a source assumption: the images/clinic files depict treatment scenes/still lifes rather than verified clinic interiors. Authored pages now use a published practitioner portrait or disclosed illustration and clearly mark verified room/equipment photos as pending. Published hours and exact locality still need current clinic confirmation; no management approval was invented.
