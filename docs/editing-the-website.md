# Editing the Janus review website

The new homepage and three area pages are maintained source. The other pages are still the original capture. The GitHub Pages site is for reviewing design changes; its booking and messaging controls remain disabled.

## Change a heading or description

Open `site/content.json`. The `home` object contains the homepage introduction; `areas` contains the three area labels, descriptions and image descriptions. Save your changes, run `npm run site:build`, and reload the local browser. `npm start` also rebuilds these pages at startup.

For the area-page introduction or shared header/footer, edit the corresponding file under `site/templates/`. Use the existing heading, spacing and button classes. Keep all three mobile area shortcuts and the logo intact.

## Change a salon service or price

Open `content/salon/catalog.draft.json`. Find the service by its stable `id`; change its `name` or `price_lkr` after confirmation. Keep prices as numbers, not strings containing “LKR”. The renderer formats commas and the LKR table heading. Categories control where each service appears, including body care under Salon for now. Do not restore the excluded LKR 5,000 root-touching row.

Six services include a `review_note` because their printed labels are unclear. Confirm the actual spelling before removing a note. Update the owner-confirmation record and visible confirmed-on date if the prices are reconfirmed. Update `site/templates/salon.html` if the displayed confirmation date changes.

## Change an image

Place the replacement WebP under `site/assets/`, then update its path and accurate alternative text in `site/content.json`. Update `site/imagery.json` with source/provenance. Its `replacements` map applies only to selected decorative images in captured review pages; other original images stay unchanged. Keep the AI disclosure for generated portraits. Never describe these models as actual patients or results.

The source PNGs were retained in the cloud workspace; portable optimized WebP copies are committed to Git. The three WebP files total approximately 430 KB. Format conversion preserves composition and does not alter the subjects.

## Define wellness later

The Wellness page intentionally has no packages or tier names. Once the actual three tiers have been agreed, add confirmed descriptions and prices to maintained content and replace the holding page. Until then, do not present packages as available. Massage and body care remain in Salon.

## Check and publish a preview change

```sh
npm run check
npm test
npm run test:browser
npm run preview:build
npm run test:preview
```

Review desktop and mobile screenshots under `test-results/local/` and `test-results/preview/`. Browser checks prevent live external submissions. Push a reviewed, tested change to `main`; the existing GitHub Actions workflow deploys the preview automatically. Check the actual deployment result and browser URL before assuming it is online.

Never edit `site/generated/`, `dist/` or minified captured bundles. Generated files are rebuilt from source. The original capture and historical portfolio covers remain references; do not refresh them just to hide a visual difference.
