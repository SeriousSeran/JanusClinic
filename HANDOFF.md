# Continue JanusClinic in the same repository

Repository: https://github.com/SeriousSeran/JanusClinic · Branch: main
Preview: https://seriousseran.github.io/JanusClinic/

## Owner-approved direction

Implement the plan in `specs/001-glisse-customer-journey/`. React/TypeScript/Vite maintained pages use real Glisse0.5.0. Sage/teal applies across the entire website. Preserve original logo/fonts, Sri Lankan illustrative portraits and the original captured public/ files. Home order: account/welcome panel, then Wellness, Salon, Cosmetic Care. Browse freely; identify/register when booking.

The first consultation and standalone Wellness assessment are free. All supplied Wellness prices are approved. Salon Foot Massage5000/60min and Wellness Foot Massage4000/duration pending are distinct services/providers. Contour Discovery/Starter is one offering. Membership refund/carry-forward/validity rules, treatment durations and unsupported clinical details remain pending; do not invent them.

## Implemented checkpoint

Seven React entry routes: `/`, `/salon/`, `/cosmetic/`, `/wellness/`, `/book/`, `/wellness/book/`, `/wellness/body-contouring/`. Wellness contains the complete12-section collection,13 individual treatments,5 signature packages,3 memberships and contour programmes. The shared booking demonstration supports new fictional customer details or sample verification, prefilled offerings, date/time preferences, editing, review and a DEMO reference. No persistence or live delivery exists. Profile state survives React navigation and resets on reload or navigation to a legacy static page.

Original43 routes are sanitized into both root-local and Pages builds. Original capture integrity is preserved. The portfolio contains current theme guidance plus unchanged historical covers. The learning PDF has been updated. Salon links to a stable exported copy of the catalog photograph.

## Known fixes and boundaries

- Expired chat attachment IDs could not open when the old cloud environment disconnected. That is a platform error, not an app exception. Source is preserved at `reference/catalogs/salon-catalog.jpg`; live copy `/site/assets/salon-catalog.jpg` works independently of attachment IDs.
- Area changes in booking reset incompatible types; choices reflect the selected area.
- SPA route navigation focuses destination content; booking steps retain their own focus handling.
- Glisse inline filters and CSS prefix minification require the shared adaptive Glass wrapper. Forced-colors/reduced-transparency swaps to a plain opaque panel and explicitly clears both backdrop-filter properties. Do not replace this with CSS-only fallback without testing it.
- Original Next/analytics/provider scripts stay removed from legacy preview pages. React entry modules are loaded only from the controlled Vite artifact.
- Cosmetic treatment price zero is an internal sentinel: display Price on consultation, never Complimentary.
- The hidden cavitation area pricing unit must never enter the booking picker.

## Start and verify

Use the same repository checkout and inspect current git status/log before changing anything. If main advanced since the ZIP, do not overwrite newer source with an old copy. Read AGENTS.md and docs/editing-the-website.md.

```sh
npm ci --ignore-scripts
npm run typecheck
npm run check
npm test
npm run test:browser
npm run preview:build
npm run test:preview
npm start
```

Node24, Python3 and system Chromium are used. Optional Firefox/WebKit tests need browser binaries and host libraries. Read `docs/verification.md` for the recorded verification evidence and remaining limitations. Never run extraction as routine startup or use it to discard intentional work.

## Next work

The owner chose customer journey only for this preview. Real authentication, database/privacy/access controls, clinic notification and confirmation, staff dashboard, payments and membership credits are deferred to the Lovable/live application. Keep the authoritative structured catalogs rather than copying prices into independent components.

The installed design skills and Spec Kit are documented in docs/agent-skills.md. Use relevant tools without overriding owner decisions or repeating planning approvals already given. No further approval is needed to finish fixes within this approved preview scope.
