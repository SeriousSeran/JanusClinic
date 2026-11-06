# Product storefront and WhatsApp checkout

The Products page, seven existing product detail URLs, bag and checkout now use the shared Janus rose design with rounded surfaces, clear product packshots, responsive cards, search, category filtering and reduced-motion support.

Product names, prices, descriptions, usage and actual packshots come from the preserved product pages and their Product JSON-LD. No reviews, ratings, stock guarantees, new products or medical claims were added. Pickup is free as published; delivery availability and fees require clinic confirmation.

The cart supports add, quantity changes (maximum 20 per item), removal, empty state and subtotal. Only product IDs and quantities are kept in sessionStorage for the current tab. Checkout is available to guests and does not affect member-only appointment booking. Contact details remain in component memory. The user reviews an editable order before explicitly opening WhatsApp to the original product-order clinic number, +94 77 706 0404. This is distinct from the doctor’s direct number. No order is sent automatically, payment taken or confirmation implied; the bag stays available after handoff. Copy-message fallback is provided.

Reference consulted: Baymard Institute, Checkout UX Best Practices 2026, https://baymard.com/research-articles/current-state-of-checkout-ux (6 November 2026). Applied clear quantity controls, guest checkout, explicit required fields and an editable review; no delivery estimates were invented.

Validation: TypeScript, source audit, static export and unit/integration checks including cart normalization, original price fidelity, totals, delivery validation, WhatsApp encoding and exported routes. Managed browser helper is unavailable; browser responsive/interaction verification remains outstanding. Private Sites preview only; no GitHub publication.
