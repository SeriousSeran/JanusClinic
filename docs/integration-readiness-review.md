# Integration readiness review · 6 November 2026

Comparison base: `SeriousSeran/JanusClinic` main at `2b7e9a3e47e62b43dc5de5a9e6c5d63a40a09ed5`. The fetched remote includes the previously merged About us and Meet your Doctor pages and navigation reorder. This review does not push to GitHub or publish GitHub Pages.

## Corrections

- Normalize authored-route matching for links with or without trailing slashes. These links now stay inside React instead of unnecessarily reloading and clearing the memory-only session.
- Replace the registration history entry when continuing to the selected booking. Browser Back can return to the originating service/category rather than an obsolete registration stop.
- Package loader CSS with the app and inject the shared motion script in the exporter. No unbundled loader stylesheet/script warnings remain; both root and repository-prefixed exports carry the assets deliberately.
- Ask the Web Share capability check about both files and the message, matching the actual handoff payload.
- Make password changes atomic with the accompanying unique-identifier/profile check.
- Update browser-test registration helpers and navigation expectations for the separate profile flow. Add export regression coverage for new deep links, Google-only frames, local photo previews and treatment-specific booking destinations.
- Remove private-audience wording from visible page labels: a GitHub Pages publication will be public even when noindex. Private access remains a hosting setting of the review Site, not a property of these files.

## Verified

- TypeScript typecheck and original-capture integrity (43 pages, 63 assets, 4,654 original references).
- 23 unit/HTTP/export tests, including password rotation, duplicate identifiers, DOB boundaries, safe continuation, static CSP and treatment context.
- Both root application export and the exact workflow-style Pages build (`--base-path /JanusClinic --output dist/site`). The exporter audits all static local references, including every new route and review page.
- Portable handoff ZIP integrity. Package manifest and lockfile are compared to remote main; no dependency migration is required.
- A complete binary-capable integration patch is prepared against fetched main with new files included, then checked and applied to a temporary export of that commit. Changed-file byte comparisons verify the resulting snapshot against maintained source.

## Remaining limits before launch

- Profile records/password comparisons are a frontend memory-only demonstration. Refreshes and full document navigation to preserved legacy pages clear accounts. GitHub Pages cannot provide persistent accounts, verified emails, password recovery, server sessions or server-side booking authorization. A managed authentication/backend phase is needed for real members; do not remove the demo notices to imply otherwise.
- Booking is still a demonstration; there is no live scheduling, appointment delivery, payment or birthday-rewards backend.
- WhatsApp text links cannot attach files. Web Share depends on browser/device/app support and user choice; the site cannot force the target app or confirm delivery.
- The managed browser helper is unavailable in this environment. Desktop/mobile screenshots, full browser suites and Google Maps/WhatsApp device handoff must be verified before calling this production-ready. Static checks do not establish visual correctness.
- Existing published-hours/location confirmation notes and pending clinical/catalog content remain applicable.

The review extras (`/design-review/`, `/loading-preview/`, `/booking-preview/`, `/profile-preview/`) are clearly labelled examples. Their seeded profiles are local to read-only nested preview contexts and do not sign visitors into the main app. Keep these as review tools or remove them deliberately in the launch scope; they are not authentication shortcuts for the actual booking route.

## Prepared artifacts

`artifacts/janus-integration.patch` and `artifacts/janus-integration-manifest.json` describe the full source delta. Recheck remote main before applying: if its SHA changes, regenerate the patch against the new head rather than overwriting newer work. Do not restore generated dist files as maintained source. Merge/publication still require the owner's approval.
