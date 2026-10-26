# Janus Estheti Clinique public website extraction

## Intent and scope
Populate the empty JanusClinic repository with a faithful, locally runnable copy of https://www.janusestheticlinique.com/. Preserve all 43 public sitemap pages, their copy, layout, responsive presentation, images, fonts, metadata, and existing browser interactions. The goal is extraction, without a visual redesign.

## Approaches
The user selected a faithful local copy over rebuilding an editable application. Downloading the rendered HTML and published browser assets preserves the original appearance and behavior and avoids introducing a new framework build. Rebuilding would produce more convenient component source but introduce visual differences and require recreating unavailable application source.

## Implementation choices
These are the implementer's choices: save page HTML and static assets in a public directory, retain the published Next.js browser bundles, and serve them using a small Node.js server with no production dependencies. Preserve clean page URLs. Resolve Next.js image URLs to downloaded local original images with appropriate content types. Handle client navigation with the local HTML pages rather than relying on a remote Next.js server. Include a repeatable extraction script, a capture manifest, and README instructions.

Keep external destinations such as WhatsApp, telephone, email, social links, Google Maps, and the original Web3Forms contact endpoint explicit. No live enquiries or purchases will be sent during validation. Public extraction cannot recover server-side source, administrative tools, provider accounts, or databases. Canonical metadata continues to identify the original site. Google Maps and form delivery require Internet access in the visitor's browser.

## Validation and completion
Verify that all 43 pages load locally, linked internal pages and local assets resolve, images and fonts load, and unknown routes return 404. Check representative desktop and mobile rendering and navigation, mobile menu behavior, and contact-form validation without sending a message. Document any difference or limitation discovered. Save tested cloud installation and startup instructions after the implementation works. Leave the local project ready for review; deployment of a replacement public website is outside this task.
