# Three-area gateway implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Publish the authorized three-area homepage, salon catalog, wellness holding page and Sri Lankan decorative imagery in the existing review site.

**Architecture:** Shared Python rendering creates maintained HTML for `/`, `/cosmetic/`, `/salon/` and `/wellness/`. The preview exporter sanitizes these with the same prefix, CSP and operational restrictions as existing pages. The Node server serves maintained pages and assets alongside the unchanged capture.

**Tech Stack:** Existing Node HTTP server, Python standard library, HTML/CSS/vanilla JS, existing Playwright.

**Spec:** `docs/superpowers/specs/2026-11-05-gateway-and-imagery-design.md`

## Global constraints

- Original capture, clinician/clinic/product/procedure imagery and portfolio baselines remain unchanged.
- Keep exact identity tokens and local fonts; adult Sri Lankan AI portraits are illustrative.
- Salon uses 123 active LKR services, root touching 6,800 only; body care stays Salon.
- Do not invent wellness tiers or new clinical claims/contact details.
- New routes support project prefix and read-only Pages controls, without new dependencies.

## Review focus

- A direct deep link must offer return links to all three areas.
- Rendering must escape catalog wording and preserve every active service/condition.
- Subdirectory deployment must resolve authored scripts, images, routes and PDF.
- Keyboard/mobile navigation must retain focus visibility and avoid hidden focus traps.
- Unconfirmed labels must not look owner-confirmed, and wellness must not imply available packages.

### Task 1: Maintained gateway, routes and catalog

Files: `site/`, `scripts/render_site.py`, `server.mjs`, `scripts/build-preview.py`, `tests/preview.test.mjs`, `tests/server.test.mjs`.
Interfaces: `render_pages() -> dict[route, html]`, `site/assets/` served at `/site/assets/`, optional local build into `site/generated/`.
- [x] Add failing export/server assertions for the three-area home, authored routes, prices/count/exclusion and preservation of original capture.
- [x] Run the tests and confirm expected missing-feature failures.
- [x] Implement shared semantic templates and reusable layout, hero and footer; generate catalog from source JSON, with category anchors and review notes.
- [x] Integrate authored pages/assets into Pages and local server; add area switcher on captured preview pages.
- [x] Verify static references, tests, escaping and local path restrictions.

### Task 2: Imagery, layout and browser review

Files: `site/assets/`, `site/imagery.json`, `site/site.css`, `tests/browser.spec.mjs`, `tests/preview-browser.spec.mjs`, docs.
- [x] Generate and inspect the three adult Sri Lankan portraits, record provenance and explicit decorative-image mapping.
- [x] Add meaningful gateway navigation, catalog keyboard/category, wellness, image/crop and small-screen tests; observe missing behavior before implementing it.
- [x] Apply the existing visual identity and responsive layout; integrate mapped imagery only in maintained/review pages.
- [x] Run `npm run check`, `npm test`, `npm run test:browser`, `npm run preview:build`, `npm run test:preview`; inspect desktop/mobile screenshots.
- [x] Request independent whole-change review, resolve findings, update contributor guidance and plan checkboxes.
Publication follows the existing authorized Pages workflow: commit/push the tested changes, watch deployment, and verify the live homepage and new routes. The workflow run records the publication result.

Verification on 5 November 2026: original capture check passed (43 pages, 63 assets, 4654 references); Node tests 4/4; local browser tests 10/10; Pages browser tests 8/8. Independent review found one Important omission (four catalog durations), fixed with a failing-then-passing export regression and full green suites. Desktop/mobile screenshots inspected; no overflow at 320, 768, 1024 or 1440px. No deferred review findings.
