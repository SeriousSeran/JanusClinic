# Verification record

Current feature: `specs/001-glisse-customer-journey/`. Base commit before implementation:1629935. The original public capture is deliberately unchanged.

## Checks

- Original capture:43 pages,63 assets,4654 references verified.
- TypeScript: strict typecheck passed.
- Node tests:14 passed (catalog/data arithmetic, booking validation, server and export).
- Chromium local preview:16 browser tests passed.
- Chromium Pages-prefix preview:15 browser tests passed, including every captured page, new routes, complete demo booking/edit flow, unknown offering recovery, no writes/storage, portfolio/PDF, keyboard, breakpoints and opaque fallback.
- Firefox:3 compatibility tests passed. WebKit:3 compatibility tests passed, covering navigation, the mobile booking flow, no writes, and accessibility preference fallbacks.
- Independent review found an incompatible retained booking-type filter and missing destination focus after SPA navigation. Both were reproduced by new browser regressions before fixes, then covered by the green suites.
- A preference test reproduced retained backdrop blur. Investigation showed that Glisse's inline filters require avoiding its lens hook on opaque fallback panels, and CSS prefix minification removed the unprefixed fallback property. The shared wrapper now renders a plain element with explicit standard and WebKit filter overrides for those preferences. The regression passes.

## Browser host setup

Firefox and WebKit browser binaries were downloaded with the existing Playwright version. The cloud user could not install OS packages as root, so missing Debian runtime libraries were downloaded/extracted in user-owned cache locations. WebKit's launcher resets LD_LIBRARY_PATH; required libraries therefore also had to be placed in its user-owned sys/lib folder. No system settings or project runtime dependencies were changed for this host setup. WebKit’s preflight continued to report a library that its actual runtime could resolve, so the host-requirement preflight was skipped for that run; all three tests then executed and passed. Do not confuse a missing-host-library error with an application failure.

## Scope limits

This is a simulated customer journey. No real account ownership, SMS, clinic delivery, appointment confirmation, payments or staff permissions were tested because none are implemented. Native Safari hardware, assistive-technology sessions and actual low-end mobile hardware are not represented by desktop browser engines. Genuine missing facility photographs and unconfirmed clinical/operational policies remain content dependencies, not fabricated placeholders presented as fact.

The old chat attachment409/ environment_offline error is outside the application. The catalog's repository copy and exported JPEG endpoint are tested as the portable alternative; this does not repair the chat app's historical file identifier.

## Mixed treatment imagery · 6 November 2026

All144 authored treatments have image associations (13Wellness,8Cosmetic,123Salon), with matching image context for Wellness packages, memberships, contour programmes and assessment. Original capture remains unchanged. Seven new generated illustrations, one existing approved AI portrait and eight inspected photographic sources are optimized into a roughly820KB full/thumbnail library. AI captions are visible and photographic sources are not claimed as verified Janus staff, rooms or devices.

Image-map coverage/provenance/family/fallback tests failed before the map existed, then passed. All18Node tests and strict TypeScript checks pass. Five added image browser tests cover complete loading/association, generated disclosure, local/Pages prefixes, Salon search and320–1440px layouts, failed-image fallback and compact accessible booking labels. During visual review, the existing missing `.sr-only` utility was reproduced by a browser assertion and corrected; the added regression passes. Final local Chromium run passed21/21 browser tests. These include the unchanged legacy capture, complete demo booking flow and image checks. Independent review identified insufficient contrast caused by inherited caption opacity: a new browser regression measured3.435:1 before correction, then passed the4.5:1 threshold after making image captions opaque. No pricing, booking, correctness or security regressions were found. The reviewer did not authenticate original photographic provenance/device accuracy; captions explicitly remain illustrative. Final Pages-prefix Chromium suite:20/20 passed after the review correction. The Salon completeness test now batches its123 association/disclosure assertions and thumbnail-load checks; the same checks finish in2.5s rather than occasionally exceeding the30s case budget under concurrent load. No timeout was widened and no assertion was removed.
