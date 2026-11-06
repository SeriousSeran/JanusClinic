# Working on JanusClinic

## Preserve the website's identity

Before changing a page's appearance or adding a page, read [docs/design-identity.md](docs/design-identity.md) and inspect the local `/portfolio` reference page. It includes exact design tokens, reusable patterns, all 43 original desktop page covers, and representative mobile covers. Start from the closest existing template.

Unless the user requests a design change, preserve the original logo and photography, Cormorant Garamond / DM Sans pairing, the currently approved ivory/sage surfaces, deep teal text, champagne gold details, generous spacing, and restrained square-edged components. Do not introduce an unrelated visual theme. Keep clinical claims, credentials, prices and testimonials factual.

## Follow the current brief

Read [docs/website-direction.md](docs/website-direction.md) for the planned Cosmetic / Salon / Wellness gateway, the requested Sri Lankan model imagery, and unresolved content decisions. The original portfolio is a design baseline; its existing foreign-model imagery is not a requirement to retain those models. The supplied salon catalog is in `content/salon/catalog.draft.json`: current LKR prices are owner-confirmed, only the LKR 6,800 root-touching option is active, and massage/body care belong under Salon for now. Use the 123 active entries, not excluded source rows. Resolve flagged labels and contact details before publishing those details. The subsequent Wellness Collection brief now defines three memberships and approved prices; read `docs/wellness-brief-review.md` for the current decisions rather than treating the earlier undefined-tier plan as current. Salon and Wellness foot massages are distinct services performed by different people.

## Respect source boundaries

- `public/` contains the original rendered capture and compiled Next.js browser code, not editable React source. Visible HTML edits can disagree with embedded hydration data. Use maintained source for substantial changes; do not patch minified bundles.
- `npm run extract` replaces the capture. Never run it as a routine install/startup step or use it to discard local edits. Preserve intentional work first.
- The authored reference page and its assets live in `reference/portfolio/`, outside the generated capture, and are served at `/portfolio` by `server.mjs`.
- `capture-manifest.json` verifies the original files. Review and account for deliberate edits rather than silently changing hashes to hide drift.
- Each cloud task is already isolated. Use this checkout; do not create another worktree unless requested.

## Validate meaningful behavior

Run `npm run check`, `npm test`, and `npm run test:browser` after relevant changes. Check desktop/mobile presentation, keyboard focus, semantic labels, image loading/cropping, navigation, and hydration. No live enquiries or orders during tests; the contact-provider response is simulated.

Use `npm run capture:portfolio` only to deliberately refresh approved visual references after review. Never refresh screenshot baselines simply to conceal a regression. Do not claim that static capture, simulated form delivery, or noindex metadata provides backend functionality, live delivery, or access control.

## GitHub Pages review preview

Read [docs/github-preview.md](docs/github-preview.md) before changing the export. The Pages artifact is a separate read-only build, not the regular Node application. Preserve the repository URL prefix, original capture integrity, disabled enquiry/booking actions, and preview label. Run `npm run preview:build` and `npm run test:preview` after relevant changes. Add new authored routes to the exporter deliberately; never assume a Node-only route is automatically published.

## Maintained React customer journey

The owner approved React/TypeScript/Vite with Glisse0.5.0 and the sage/teal palette across the website. Editable source lives in `frontend/`; the catalog remains in `content/salon/catalog.draft.json` and `frontend/data/wellness.json`. Read `docs/editing-the-website.md` and `specs/001-glisse-customer-journey/` before changes. The old Python page templates were retired; do not restore a second authored source of truth. Use shared prefix helpers for links and assets. `npm start` builds the complete local preview; Pages uses `npm run preview:build`. Generated `.build/`, `site/generated/` and `dist/` must not be edited.

The account/booking flow is a clearly labelled, memory-only demo. Preserve no writes/storage/OTP/delivery, fictional profiles and DEMO references. Glisse's inline filters need the adaptive Glass wrapper for forced-colors/reduced-transparency; do not rely only on stylesheet overrides. The first consultation and standalone assessment are free; cosmetic treatment prices remain on consultation. Keep all offerings and prices consistent, including the two distinct foot massages and the hidden common cavitation price unit.

## Installed design and planning skills

Read `docs/agent-skills.md` for the installed skills catalog, usage and tool setup. Skills live in `.agents/skills/`; source commits and file hashes are pinned in `.agents/skills-lock.json`. Select relevant skills for the task rather than loading every toolkit. Owner decisions and this repository's identity/source/preview rules override generic style prescriptions. Spec Kit's Codex skills and `.specify/` workflow are installed for major feature planning; reference the existing briefs instead of maintaining duplicate specifications. Run `npm run skills:check` when changing installed skills. Do not copy toolkit starters over the maintained website or add their example assets to the exported application without a feature need.
