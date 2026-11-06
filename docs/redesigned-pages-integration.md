# About us and Meet your Doctor integration

The approved separate page designs are integrated into the maintained `frontend/` React application. `/services/` is labelled About us; `/about/` is labelled Meet your Doctor. The combined-page experiment is excluded.

The integration preserves the existing header/footer, catalogs, Wellness collections, Salon filters, session operations, booking UI, dependency pins and Pages workflow. The pages use the existing `asset` prefix helper and `bookingHref(consultation.id)` rather than the private preview's different offering IDs or bundle-derived prefix. New routes are registered in `frontend/data/routes.json` so direct links and refresh work in local and project-prefixed exports.

Only the two page components and their scoped styles, practitioner portrait, route/navigation integration and relevant browser tests/configs are changed. The supplied portrait is retained exactly from owner-provided Drive file 11xUlNy4xYGo7IDK9IA70xYtP3XAjn9iY (original filename Gemini_Generated_Image_c2odj4c2odj4c2od.jpeg). Its filename indicates AI-generated/edited provenance; it is an owner-selected portrait, not evidence of treatment results. Credentials and professional background are carried from the existing captured practitioner profile, without new qualifications or outcomes.

The Services SVG, observers and event listeners clean up on unmount; reduced motion shows the complete path. As with the host application, these authored pages require JavaScript; the existing noscript links remain. No backend, real booking delivery or patient storage is introduced. No historical capture file is changed.
