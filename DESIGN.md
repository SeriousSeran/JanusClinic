# Janus design entry point

Read [the approved identity guide](docs/design-identity.md), [editing instructions](docs/editing-the-website.md) and `/portfolio/` before UI changes. Historical portfolio covers are references; current owner-approved React/Glisse decisions override historical colors and source templates.

Current authority: `frontend/theme.css` semantic tokens, Cormorant Garamond headings/DM Sans body, original magenta logo, ivory/sage/deep teal/champagne palette, restrained glass navigation and readable solid clinical/price/form surfaces. Use explicit on-dark tokens and preserve the tested opaque preferences wrapper.

Reuse `TreatmentImage` and `frontend/data/treatment-images.json`. Keep visible AI provenance, natural Sri Lankan adult styling, real-photo context and no before/after promises. Layout must support320px, keyboard/focus, reduced motion/transparency, prefix-safe direct routes and all catalog prices.

The current overview keeps welcome above the three areas and compact mobile choices. Full Wellness collections have dedicated routes; filters and Salon variants use URL state. `frontend/data/routes.json` is shared by SPA navigation and the static exporter. No second design system or styling dependency is needed.
