# Website Extraction Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Preserve the 43 public Janus pages and assets in a runnable repository.
**Architecture:** Static HTML and published Next.js browser assets served locally by a dependency-free Node.js HTTP server. An explicit refresh script performs extraction, with a manifest for provenance and integrity.
**Tech Stack:** Node.js 22+, Python 3, curl; Playwright with system Chromium for development checks.
**Spec:** docs/superpowers/specs/2026-10-26-website-extraction-design.md

## Global Constraints
- Preserve all 43 public sitemap pages and their visual presentation.
- Keep external integrations explicit; send no real enquiries during validation.
- No remote server-side source or administrative functionality is implied.
- Use the existing isolated checkout; do not create a worktree.

## Review Focus
- Deep links, trailing slashes, and Next client navigation must reach local pages.
- Next image queries must resolve only to local downloaded images.
- Encoded path traversal and unsupported methods must not expose files or modify data.
- Mobile navigation and existing form behavior must work after hydration.
- Missing capture files and incomplete refreshes must be detected.

### Task 1: Capture and local server
**Files:** package.json, server.mjs, scripts/extract.py, public/**, capture-manifest.json, tests/server.test.mjs, .gitignore
**Interfaces:** createSiteServer({root}) returns an unbound Node HTTP server; manifest.pages and manifest.assets identify paths and SHA256 digests.
- [x] Write real HTTP tests for page serving, image queries, 404s, traversal, HEAD, method restrictions, and client navigation fallback; run before implementation and observe failure.
- [x] Implement bounded same-origin extraction and save all pages, browser bundles, stylesheet font dependencies, original images, sitemap, and robots.txt. Use staged downloads and fail before publishing an incomplete capture.
- [x] Implement the server, npm commands, and integrity checks. Run node tests and archive checks; expect all to pass.

### Task 2: Browser verification and reusable environment
**Files:** tests/browser.spec.mjs, playwright.config.mjs, README.md, package-lock.json
**Interfaces:** npm start serves the captured website; npm run check validates manifest and links; npm run test:browser uses Chromium without sending enquiries.
- [x] Add desktop/mobile checks of page content, navigation, image loading, mobile menu, and existing form behavior; enforce no real POSTs during tests.
- [x] Install pinned browser-test dependencies; run server tests, capture checks and browser checks. Inspect source/local screenshots and diagnose differences.
- [x] Document startup, refresh, external integrations and extraction limits. Save tested install_script/start_skill configuration and the actual repository state.
- [x] Obtain an independent review of the implementation, resolve material findings, and verify final state.
