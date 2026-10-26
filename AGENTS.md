# Working on JanusClinic

## Preserve the website's identity

Before changing a page's appearance or adding a page, read [docs/design-identity.md](docs/design-identity.md) and inspect the local `/portfolio` reference page. It includes exact design tokens, reusable patterns, all 43 original desktop page covers, and representative mobile covers. Start from the closest existing template.

Unless the user requests a design change, preserve the original logo and photography, Cormorant Garamond / DM Sans pairing, ivory and stone surfaces, charcoal text, muted gold details, generous spacing, and restrained square-edged components. Do not introduce an unrelated visual theme. Keep clinical claims, credentials, prices and testimonials factual.

## Follow the current brief

Read [docs/website-direction.md](docs/website-direction.md) for the planned Cosmetic / Salon / Wellness gateway, the requested Sri Lankan model imagery, and unresolved content decisions. The original portfolio is a design baseline; its existing foreign-model imagery is not a requirement to retain those models. The supplied salon catalog is a draft in `content/salon/catalog.draft.json`; do not publish its prices or ambiguous labels before owner confirmation. Do not invent the three planned wellness tiers.

## Respect source boundaries

- `public/` contains the original rendered capture and compiled Next.js browser code, not editable React source. Visible HTML edits can disagree with embedded hydration data. Use maintained source for substantial changes; do not patch minified bundles.
- `npm run extract` replaces the capture. Never run it as a routine install/startup step or use it to discard local edits. Preserve intentional work first.
- The authored reference page and its assets live in `reference/portfolio/`, outside the generated capture, and are served at `/portfolio` by `server.mjs`.
- `capture-manifest.json` verifies the original files. Review and account for deliberate edits rather than silently changing hashes to hide drift.
- Each cloud task is already isolated. Use this checkout; do not create another worktree unless requested.

## Validate meaningful behavior

Run `npm run check`, `npm test`, and `npm run test:browser` after relevant changes. Check desktop/mobile presentation, keyboard focus, semantic labels, image loading/cropping, navigation, and hydration. No live enquiries or orders during tests; the contact-provider response is simulated.

Use `npm run capture:portfolio` only to deliberately refresh approved visual references after review. Never refresh screenshot baselines simply to conceal a regression. Do not claim that static capture, simulated form delivery, or noindex metadata provides backend functionality, live delivery, or access control.
