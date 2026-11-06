# Pre-integration audit · 7 November 2026

Read-only comparison against SeriousSeran/JanusClinic main at d21edccd59ba8461b4a6e878872d50e7a6330669. No GitHub push, PR merge or Pages deployment.

A merge from the old local base produced six conflicts: frontend/App.tsx, frontend/data/routes.json, frontend/pages/Services.tsx, frontend/pages/services.css, scripts/build-preview.py and site/assets/ios-interface.css. Compared each with current main. The reviewed preview supersedes the older homepage/routes/image-export versions and retains the live menu visibility fix. Current main has no files deleted by this update, and no dependency, lockfile or workflow changes are required. A binary-capable patch is prepared directly against fetched main, rather than merging the obsolete base.

Fixed an additional navigation inconsistency: preserved treatment-page dropdowns now put Journal last, matching the React pages. Current product, Journal, registration and image routes use repository-prefix helpers. The original capture and all existing product prices remain unchanged.

Validation covers TypeScript, original source integrity, the exact Pages build destination/prefix, source handoff ZIP integrity and all unit/HTTP/export tests. Browser QA is unavailable: managed browser helper cua_repl.js is absent, and Sites instructions prohibit substituting another browser-control path. Desktop/mobile visual checks and real browser interactions therefore remain outstanding.

Existing production limits: accounts and bookings are labelled memory-only demonstrations and do not create persistent accounts or confirmed appointments. WhatsApp ordering prepares a draft which the visitor sends; stock, delivery fees and payment require clinic confirmation. No live order or message is sent by this audit. These limitations are not solved by publishing static files to GitHub Pages.
