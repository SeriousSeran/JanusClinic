# GitHub Pages customer-journey preview

Every push to main runs the Pages workflow: install pinned npm dependencies, typecheck, verify the original capture, build React with Vite and combine it with sanitized captured pages. The public preview is https://seriousseran.github.io/JanusClinic/.

Ten React entry routes from `frontend/data/routes.json` have physical HTML files, including `/book/`, `/wellness/book/`, `/wellness/treatments/`, `/wellness/packages/`, `/wellness/memberships/` and `/wellness/body-contouring/`, so direct refreshes work without GitHub SPA rewrites. All module, stylesheet, image and font paths carry the repository prefix. The same pipeline builds root paths for the local Node server.

`scripts/build-site.mjs` builds Vite then calls `scripts/build-preview.py` with the matching compiled directory. The exporter preserves the original `public/` capture and manifest, strips captured Next.js/analytics/form delivery, carries forward 77 FAQ answers, copies the portfolio and learning PDF and validates static HTML references. React entry scripts are taken from the controlled build output; captured scripts remain stripped. CSP permits same-origin scripts and inline styling required by Glisse, data images used by its lens, and blocks native form delivery. It does not permit a backend connection to an outside provider.

The React app handles its own explicitly labelled demo forms; legacy contact and booking controls remain disabled. Neither entry point sends a clinic enquiry. The preview is noindex, which does not provide access control. Never put real customer information into source, static artifacts, sample fixtures or test data.

The generated theme applies sage/teal to legacy pages too; the original capture is unchanged. Historical portfolio covers remain the original baseline, while the guide explains the new palette and Glisse source.

Use `npm run preview:build` and `npm run test:preview`. Optional compatibility checks require Playwright Firefox/WebKit browser downloads and their host libraries; report separately if a host cannot run a browser. See `docs/editing-the-website.md` for source locations and the distinction between the interactive demo and the later live Lovable application.
