# Read-only design preview on GitHub Pages

This preview is for reviewing the project, not patient-facing clinic operations. Every push to `main` runs `.github/workflows/preview.yml` and deploys a fresh static artifact. GitHub's deployment environment and repository Pages settings provide the actual published URL.

## Build and check locally

```sh
npm run preview:build
npm run test:preview
```

To inspect the static export manually, run `npm run preview:serve`. The development server serves the `dist` folder; the project sits under `/JanusClinic/`, matching the GitHub Pages repository path. This server is separate from the regular Node app on port 3000.

The export uses only Python's standard library. Browser tests use the existing Playwright development dependency and system Chromium. `npm test` also checks the exported HTML and content.

## What the preview contains

- All 43 captured pages, local images/fonts/style, the authored design portfolio, its 49 reference covers, and the learning PDF.
- Ordinary page links, mobile navigation with keyboard handling, and 77 original FAQ answers extracted from captured page data.
- A persistent design-preview label. Forms and booking actions are disabled; no enquiry, WhatsApp message, email or telephone action is sent from preview controls.
- No captured Next.js runtime, analytics scripts, image-optimization server, or embedded map. The map area has a clear preview placeholder. Images use local originals instead of server resizing.
- No patient backend, accounts, transactions, or clinical-record collection. The preview is marked noindex; this is not access control, so keep confidential information out of published files.

`public/` and the regular local application remain intact. `scripts/build-preview.py` creates a separate generated artifact and verifies that its local HTML references resolve under the repository prefix. FAQ extraction must match every captured FAQ button; incomplete content fails the build rather than publishing empty interactions.

The shared portfolio module derives its deployment prefix from its module URL, so it works both in the regular local app and the Pages project subdirectory.

## Source of changes

Edit maintained source files, then build/test again; never edit `dist/` directly. The exporter currently reads the captured pages from `capture-manifest.json`, authored files under `reference/portfolio/`, and preview interactions under `preview/`. Add an export path and tests when introducing a new authored page elsewhere. Source catalog data and planning documents are not new visible salon pages until those pages are implemented.

The planned Cosmetic / Salon / Wellness gateway and Sri Lankan model imagery are recorded in `docs/website-direction.md`; publishing a preview does not itself implement that redesign.

## GitHub setup

Repository Pages must use **GitHub Actions** as its build source. The workflow verifies the original capture, builds a read-only artifact under the repository prefix, uploads it, and deploys to the `github-pages` environment with the required Pages and OIDC permissions. It can also be started with **Run workflow**.

The workflow keeps deployment permissions on the deploy job. No private token is committed. GitHub Pages access and plan restrictions still apply; this repository is public. Review this as a project showcase, and use appropriate hosting for the eventual live clinic site.
