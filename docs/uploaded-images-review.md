# Uploaded website image preview

The 6 November 2026 upload supplies 40 AI-generated treatment images. JPEG masters are preserved in the attachment workspace; optimized WebP copies and small thumbnails are used by the website. The source filenames and hashes are recorded in `site/uploaded-images.json`.

Homepage gateways and area heroes now show treatments instead of portraits. Treatment cards, booking thumbnails, cosmetic detail pages, salon detail pages, wellness offerings and relevant journal illustrations use topic-matched images. About us uses the supplied care preparation image. The approved doctor portrait is unchanged. Neutral tool imagery remains for children's service listings because the upload depicts adults. Product photographs remain because the upload contains no product replacements.

The complete collection can be inspected at `/image-review/`. The superficial-peel image is shown there as a reference only; no peel service was added to the catalogue. Prices, service descriptions, booking identifiers and treatment claims are unchanged. Generated scenes do not verify the clinic's actual staff, facilities or equipment.

This update is for the owner-private Sites preview. No GitHub push, merge or GitHub Pages deployment is authorized by this task.

Validation: TypeScript, source audit, prefixed static export and unit/integration tests. The export audits local links and image files. This environment does not include the managed browser inspection helper, so responsive browser appearance and interaction verification cannot be claimed.
