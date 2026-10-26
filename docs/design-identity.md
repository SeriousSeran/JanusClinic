# Janus website identity

Read this before changing layout, styling, imagery, or UI copy. Open the local **`/portfolio`** page for live specimens, desktop covers of all 43 original pages, and six mobile examples. `reference/portfolio/capture/pages.json` records the screenshot baseline's source commit and capture date.

This guide describes the existing design, observed from the original capture on 26 October 2026. A deliberate redesign can change these rules when requested by the user; routine additions should remain consistent.

## Character and brand

The site balances medical credibility with personal care: calm, warm, editorial, clear, and restrained. Credentials and useful treatment information provide confidence. Whitespace and photography provide warmth.

- Preserve the original logo image at `public/images/logo-header.png`, including its magenta artwork. Do not recreate it as text or recolor it.
- The soft pink on the homepage comes from the hero photograph. The interface palette is ivory, stone, charcoal, muted gray, and gold.
- Keep the original clinic, practitioner, treatment, and product assets. Do not introduce generic illustrations or unsupported before/after imagery as replacements.

## Exact color tokens

| Token | Value | Role |
| --- | --- | --- |
| `--color-background` | `#FAF7F4` | Page canvas; light text on dark panels |
| `--color-surface` | `#F0EBE3` | Alternating sections, card and field backgrounds |
| `--color-surface-dark` | `#E8E0D5` | Borders and fine separators |
| `--color-text` | `#1A1A1A` | Headings, body, dark panels and primary actions |
| `--color-muted` | `#6B6560` | Secondary copy, dates and captions |
| `--color-accent` | `#C9A97A` | Restrained details, underlines and focus outlines |

Gold has limited contrast on light backgrounds. Preserve the original identity while ensuring new text is readable; prefer charcoal or muted gray for new small copy. Do not add a second accent palette, gradients, oversized pill buttons, or heavy shadows to routine additions.

## Typography

Headings: **Cormorant Garamond**, normally weight 400, with occasional italic emphasis. Body/navigation/actions: **DM Sans**, usually 400 or 500. Both fonts are already local. The captured stylesheet contains their `@font-face` definitions and the `--font-serif` / `--font-sans` aliases.

| Class | Size | Line height | Tracking |
| --- | --- | --- | --- |
| `.text-display` | `clamp(2.75rem, 6vw, 5rem)` | `1` | `-0.02em` |
| `.text-h1` | `clamp(2.25rem, 4vw, 3.5rem)` | `1.05` | `-0.02em` |
| `.text-h2` | `clamp(1.75rem, 3vw, 2.5rem)` | `1.1` | `-0.01em` |
| `.text-h3` | `clamp(1.5rem, 2vw, 1.75rem)` | `1.2` | `0` |
| Body | `1rem` (16px) | `1.7` | Normal |
| `.text-small` | `0.8125rem` (13px) | `1.5` | Normal |
| `.text-label` | `0.6875rem` (11px), uppercase, 500 | `1.4` | `0.1em` |

At 1440px the homepage display heading is 80px; at 390px it is 44px. Detail-page H1s cap at 56px. Avoid page-specific font substitutions or bold geometric headlines.

## Layout and components

- `.container-content`: maximum **1200px including gutters**, centered. Horizontal padding **24px**, increasing to **40px at 768px**. At a 1440px viewport the inner content spans 1120px.
- `.section-padding`: **96px** top/bottom on desktop, **64px at widths up to and including 768px**. The exact 768px boundary differs from the grid breakpoint; inspect the stylesheet rather than rounding it away.
- Base spacing is **4px**. Typical grid gaps range from **24 to 64px**.
- Shared breakpoints are **768px**, **1024px**, and **1280px**. Desktop navigation begins at 768px; the homepage split hero changes around the 1024px layout breakpoint. Check the actual page template.
- Primary buttons: charcoal fill, ivory text, **13px / 500**, **14px vertical × 24px horizontal** padding, **2px** radius, **8px** icon gap. Secondary buttons use a fine deeper-stone border.
- Form fields: stone fill, **1px** deeper-stone border, **2px** radius, **12px × 16px** padding. Preserve semantic labels and visible keyboard focus.
- Navigation: a fine **1px gold underline**, animated over **250ms**. Other subtle transitions commonly use **200–300ms**. Keep reduced-motion support in new work.
- Cards: square imagery, understated borders or color separation, normal-weight serif titles, small supporting text. Preserve image focal points and aspect ratios; use `object-fit` intentionally.
- Editorial body copy uses `.prose-janus`, with **72ch** maximum width and paragraph line-height **1.8**. Gold rules and em-dash list markers provide small accents.

The source of truth is `public/_next/static/chunks/0ncapewydat_k.css`, plus representative page markup. This is a generated filename, so locate its replacement if the capture is refreshed. Do not hand-edit minified browser bundles to implement a component.

## Choose the closest page template

| New work resembles… | Inspect first | Preserve |
| --- | --- | --- |
| Homepage/landing | `/` | Split photography, generous headline space, alternating sections |
| Service index/category | `/services`, `/services/medical-cosmetic` | Numbered taxonomy, image-led grids, clear treatment links |
| Treatment detail | `/services/medical-cosmetic/botox` | Dark/image-led title area, readable treatment explanations, consultation CTA |
| Product grid/detail | `/products`, `/products/cinteric-gel` | Consistent pack photography, split product layout, LKR pricing, WhatsApp order links |
| Journal/article | `/journal`, `/journal/first-visit-guide` | Editorial hierarchy, article metadata, image-led lead, bounded reading measure |
| Practitioner | `/about` | Real portrait, verified credentials, biographical clarity |
| Contact | `/contact` | Clinic details beside a labeled form, useful hours and contact methods |
| Utility/legal | `/privacy`, `/terms`, `/promotions` | Quiet hierarchy and readable text; no unnecessary promotional styling |

## Voice and accessibility

Use clear, factual, medically responsible language. Do not invent credentials, prices, discounts, clinical outcomes, or testimonials. Avoid promises of guaranteed results. Keep consultation and order actions explicit; retain their intended destinations unless the user changes the booking workflow.

Check heading order, link purpose, alt text, keyboard operation, visible focus, text contrast, and overflow at 390px and 1440px. Do not treat color alone as an instruction. A visual identity is not a reason to preserve an accessibility or validation defect when the user asks to fix it.

## Source boundaries and verification

`public/` is a rendered capture with embedded Next.js data. A substantial content change may be overwritten by hydration if only the visible HTML is edited. Build maintained page/component source for larger changes. Keep original capture integrity separate from authored additions.

The reference page is in `reference/portfolio/`, served explicitly at `/portfolio`. It survives `npm run extract`, which replaces `public/`. Its CSS reuses the captured stylesheet; its own declarations cover only reference-page layout. It is marked noindex for search engines, which is not access control; do not put secrets there.

Before accepting a change:

1. Inspect the closest original page and the portfolio at desktop/mobile sizes.
2. Compare the result against reference screenshots; explain intentional differences.
3. Run `npm run check`, `npm test`, and `npm run test:browser`.
4. Verify changed images, links, focus, mobile navigation, and content after hydration. Do not send live form messages during tests.
5. Refresh visual baselines only after reviewing an intentional design change. Do not regenerate them merely to make a mismatch disappear.

To deliberately regenerate cover snapshots, start the local server and run `npm run capture:portfolio`. `PORTFOLIO_BASE_URL` can select another localhost port; `CHROMIUM_PATH` can select a system Chromium executable. The command stages a complete `reference/portfolio/capture/` set, rejects broken visible imagery, and replaces covers and inventory together after success; a failed capture leaves the previous references intact. Review the new covers and `pages.json` before committing.
