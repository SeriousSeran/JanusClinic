# Journal design review

The Journal index and eight existing article routes now use the shared Janus shell, rounded rose surfaces, responsive editorial cards, smooth lightweight transitions and reduced-motion support. The index features the existing first-visit story, with the seven remaining stories underneath rather than repeating that feature. Topic controls and search include all eight stories and have live result counts and an empty-state reset.

Article readers preserve original prose, titles, descriptions, publication dates and author attribution from the captured pages. Current image assignments are preserved exactly, including the existing product image. The approved doctor portrait is reused for the author link. A sanitized allowlist retains prose formatting and internal links; headings provide a linked contents list. Article pages include related stories and the existing consultation booking route.

Journal is the last link in the shared dropdown, after Book a visit, while the existing footer link stays intact. No catalogue, price, product checkout or doctor profile content was changed. Source extraction is reproducible with scripts/extract-journal.py.

Validation: TypeScript, original source audit, static link/image export, existing tests and Journal checks for original prose/metadata, image continuity, safe markup, exported routes and dropdown placement. The managed browser helper is absent, so desktop/mobile browser visual verification remains outstanding. Private Sites review only; GitHub unchanged.
