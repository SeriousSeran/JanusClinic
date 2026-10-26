# Janus Estheti Clinique website

A faithful local capture of **https://www.janusestheticlinique.com/**, extracted on 26 October 2026. It contains all **43 public sitemap pages** and **63 local assets** (images, font subsets, stylesheet, browser bundles, sitemap and robots file).

## Run

Requires Node.js 22 or newer. The website itself has no npm runtime dependencies and needs no build:

```sh
npm start
```

The server binds to loopback on port 3000 by default. Set `HOST` and `PORT` if another interface or port is needed. `npm run dev` watches the server file; reload the browser after editing captured HTML or CSS.

Every original clean URL works, including service, product and journal detail pages. HTML and assets are served from `public/`. Next.js image requests resolve to local original images; image resizing is not performed. Browser navigation falls back to local full-page HTML navigation because the original Next.js server is not part of this extraction.

## Install development checks

```sh
npm ci --ignore-scripts
npm run check
npm test
npm run test:browser
```

`npm run check` verifies SHA256 hashes and checks internal page, image, font and script references. Intentional edits to captured files will cause integrity checking to fail: review those edits and update the matching manifest hashes before treating the capture as verified.

Browser tests use system Chromium at `/usr/bin/chromium`. Set `CHROMIUM_PATH` to another installed Chromium executable if necessary. Browser tests automatically start the site when required and reuse an existing local server outside CI. Screenshots and traces are written under the ignored `test-results/` directory. All external requests are blocked during browser tests except a simulated Web3Forms response; no message is delivered to the clinic.

## What is preserved

- Home, About, Contact, Promotions, Privacy and Terms pages.
- Services, three treatment categories and 16 treatment detail pages.
- Products and seven product detail pages.
- Journal and eight full article pages.
- Original responsive HTML, CSS, local fonts, original images, and published Next.js client JavaScript, including mobile navigation and contact-form UI.
- Original canonical metadata and sitemap URLs, which continue to identify the original public site.

This is rendered public HTML plus compiled browser code, **not the original editable React/Next.js source**, backend, CMS, databases or provider accounts. Page content can be edited in its corresponding `public/<route>/index.html`, but that HTML also includes embedded Next.js data. For substantial content or behavior changes, rebuild the affected pages as maintained application source to avoid hydration inconsistencies.

## External integrations

Bookings and product orders retain their original WhatsApp destinations. Telephone, email and social links retain their original destinations. The Contact page embeds Google Maps and submits directly to the original Web3Forms endpoint; those features require visitor Internet access and working provider configuration. Live delivery has not been tested. The published page includes the provider's public form identifier; it is not a backend credential added by this project.

The original contact form disables native browser validation; this extraction preserves that behavior. A successful local UI check with a simulated response does not establish live delivery or server-side validation. The original placeholder Google Analytics ID is also retained. The published browser bundles additionally request `/_vercel/insights/script.js`; that Vercel analytics endpoint is part of the original hosting backend and returns 404 locally. Visitor-facing content and interactions do not depend on it, and no replacement analytics collector is implemented.

## Refresh the capture

Requires Python 3, curl, verified CA trust and HTTPS access to `janusestheticlinique.com` and `www.janusestheticlinique.com`:

```sh
npm run extract
npm run check
npm test
npm run test:browser
```

**Refreshing replaces the generated `public/` directory and capture manifest. Commit or back up local content edits first.** Downloads are staged and checked for successful completion before replacing the previous capture. No certificate verification is disabled. The capture manifest records origin URLs, timestamps, file sizes, hashes and external resource references. A source-site redesign may require updating asset discovery and browser expectations.

## Cloud startup

Use the existing `/workspace/JanusClinic` checkout; each cloud task is already isolated, so no extra worktree is required. Installed files and dependencies can persist in an environment snapshot, but the Node process must be started again for each new task. Start with `npm start`, then check the homepage and a detail page with local HTTP requests. The saved cloud startup instructions contain the same checks.
