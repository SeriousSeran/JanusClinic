# Janus iOS-inspired interface · private review

This review applies a shared interaction and contour system to the maintained React pages and preserved linked detail pages. It retains Janus typefaces, original logo, source photography and clinical/catalog information. Deep rose remains the main brand theme; Salon, Wellness and their collections retain the existing palette. This is a web implementation inspired by iOS, not a native iOS app.

References reviewed:
- https://developer.apple.com/design/human-interface-guidelines/materials
- https://developer.apple.com/design/human-interface-guidelines/buttons

The implementation follows Apple's separation between a restrained floating glass navigation layer and readable solid content surfaces, prominent primary actions, minimum 44px control targets, visible press states, rounded grouped controls and accessibility preference fallbacks. Motion uses opacity/transform or simple color changes. No glass is added to clinical copy or prices.

`site/assets/ios-interface.css` supplies shared contours, image cropping, capsule actions, input states, navigation, booking progress, collection filters and legacy-detail styling. `frontend/App.tsx` adds menu focus containment, focus on opening, Escape support, scroll locking and inert content behind the expanded menu. Existing routes, filters, booking data and source content remain intact. `public/` is never edited. Legacy output receives the interface stylesheet through the exporter.

`/design-review/` lists all authored and preserved destinations with a local search filter. Its links are export-audited. The maintained footer links to this directory. Original booking/account operations remain fictional and memory-only; legacy delivery stays blocked.

Validation includes type checking, original capture integrity, unit tests and static export/link auditing. Managed browser infrastructure is unavailable in this session, so visual, keyboard and interaction checks across the complete redesigned route set remain pending. Do not treat CSS inspection or static-link auditing as a browser pass. The previous browser suites and contact map fixture remain available for a browser-enabled environment.

No GitHub push or GitHub Pages publication is part of this private review. For later integration include the maintained source files and exporter changes rather than generated bundles.
