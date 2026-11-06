# JanusClinic customer-journey preview

Editable React + TypeScript + Vite with actual Glisse0.5.0 components. Public preview: https://seriousseran.github.io/JanusClinic/.

## What is implemented

- Compact mobile welcome and combined preview/booking bar, persistent selected-service context, and source-labelled clinic information.
- Dedicated Wellness collection routes, URL-backed treatment filters, and grouped Salon variants with Back/refresh restoration.

- Sage/teal identity throughout, original Janus logo and local fonts, three illustrative Sri Lankan portraits.
- Shared customer panel above Wellness, Salon and Cosmetic Care; unrestricted browsing.
- Wellness Collection:13 individual treatments,5 signature packages,3 monthly memberships, contour programmes, standalone free assessment, facilities/FAQ and booking entry points.
- Salon:123 services, current LKR prices, supplied durations and six wording-review notes.
- Cosmetic Care links to the original treatment guides; treatment pricing remains on consultation.
- Memory-only demo registration/sample verification, preselected offerings, Sri Lanka date/time preferences, editable review and explicit DEMO result. No real accounts, storage, messages, appointments, membership activation or payments.
- Seven authored entry routes plus preserved captured pages, portfolio49 historical covers and an updated learning PDF.
- A portable catalog photograph linked from Salon, independent of expired chat-attachment paths.

## Run

Use Node24 and Python3. Browser tests use system Chromium at `/usr/bin/chromium` (override with CHROMIUM_PATH).

```sh
npm ci --ignore-scripts
npm start
```

Open http://127.0.0.1:3000. Startup builds the complete root-path preview. After edits, run `npm run site:build` and refresh or restart. For GitHub-style static serving, run `npm run preview:build`, then `npm run preview:serve`, and open http://127.0.0.1:4173/JanusClinic/.

```sh
npm run typecheck
npm run check
npm test
npm run test:browser
npm run preview:build
npm run test:preview
```

Optional engine checks: `npx playwright install --with-deps firefox webkit`, then `npm run test:compat`. Host dependency installation needs suitable OS permissions. Report unsupported host setup separately from application failures.

## Edit and continue

Read [AGENTS.md](AGENTS.md), [the editing guide](docs/editing-the-website.md), [the implementation specification](specs/001-glisse-customer-journey/spec.md), [preview architecture](docs/github-preview.md), and [HANDOFF.md](HANDOFF.md).

- React source: `frontend/`; styling and Glisse overrides: `frontend/theme.css`.
- Wellness source: `frontend/data/wellness.json`; Salon source: `content/salon/catalog.draft.json`.
- Shared catalog/validation: `frontend/lib/`; prefix-safe navigation: `frontend/ui.tsx`.
- Original rendered capture: `public/` and `capture-manifest.json`; do not patch its minified bundles or silently change hashes.
- Design reference/PDF: `reference/portfolio/`; the historical covers are deliberately unchanged.
- Installed skills and Spec Kit: [tool guide](docs/agent-skills.md), `.agents/skills/`, `.specify/`.

Build artifacts `.build/`, `site/generated/` and `dist/` are ignored. Do not edit them. The Python authored-page templates were retired during React migration; no second maintained page renderer remains.

## Deployment and future live application

Main-branch pushes trigger the existing GitHub Pages workflow. It installs pinned dependencies, checks types and capture integrity, builds the static artifact and deploys it. Verify the actual published result before claiming a deployment.

Lovable migration, real phone verification, protected customer storage, server validation, clinic notifications/confirmation, staff administration, payments and recurring billing remain future integrations. Keep demonstration and live state distinct.

## Learning materials and attachment recovery

[Learning guide PDF](reference/portfolio/learning-guide.pdf) · [Editable guide source](docs/learning-guide.html). Run `npm run docs:pdf` with a local preview running; PORTFOLIO_BASE_URL can select another local origin or repository-prefix path.

The old `environment registry connect returned409 / environment_offline` attachment error belongs to the chat platform. Use `reference/catalogs/salon-catalog.jpg` or the website's Salon catalog link instead of expired `/tmp/codex-remote-attachments/` paths.

`npm run handoff:zip` creates an ignored source-only handoff ZIP. It includes approved decisions, skills and source, but excludes credentials, browser caches, installed dependencies, generated previews and customer data. Continue in the same GitHub repository; do not create another repository from the ZIP.
