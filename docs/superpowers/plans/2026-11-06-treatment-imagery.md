# Mixed treatment imagery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Illustrate every maintained treatment with appropriate existing photography or disclosed Sri Lankan adult AI imagery.
**Architecture:** A typed central image map resolves offering IDs and Salon categories to local assets. One reusable figure handles cropping, lazy loading, provenance and loading failure; existing page structures retain prices and booking controls.
**Tech Stack:** Existing React/TypeScript/Vite, CSS, Playwright; generated images optimized locally without new runtime dependencies.
**Spec:** docs/superpowers/specs/2026-11-06-treatment-imagery-design.md

## Global Constraints

- Preserve the original capture and historical portfolio.
- AI images are explicitly illustrative; never imply verified facilities, results or equipment.
- Salon price variants may share appropriate service-family images.
- Preserve pricing, provider differences and demo-only booking behavior.
- Prefix-safe local assets, responsive crops, accessible alt text and image failure fallback.

## Review Focus

- A newly added/unmapped offering still gets a neutral explicitly illustrative fallback.
- Salon category mappings do not substitute procedure images for unrelated services.
- Missing images leave names, prices and booking controls usable.
- Every AI image has a visible caption, including compact thumbnails.
- Image dimensions never cause overflow at 320px or hide controls.

### Task 1: Image library and mapping
**Files:** create `frontend/data/treatment-images.json`, `frontend/lib/treatment-images.ts`, `site/assets/treatments/`, `tests/treatment-images.test.mjs`.
**Interfaces:** export `treatmentImage(offering: Offering): TreatmentImage` with `src`, `alt`, `source`, and optional focal position. JSON holds provenance and reusable keys, offering and family assignments.
- [x] Write coverage/provenance/existing asset tests; run them to demonstrate missing map.
- [x] Inspect original treatment photos; create coordinated AI illustrations for gaps, with no fabricated equipment/rooms. Save optimized local assets.
- [x] Implement explicit IDs plus Salon service-family rules and neutral fallback, preserving original files.
- [x] Run coverage/provenance tests and typecheck; commit the library.

### Task 2: Page integration and validation
**Files:** create `frontend/TreatmentImage.tsx`; modify `frontend/App.tsx`, `frontend/pages/Wellness.tsx`, `frontend/theme.css`; add `tests/treatment-images.spec.mjs`; update editing/handoff docs.
**Interfaces:** `TreatmentImage({offering,compact?})` consumes task 1 metadata; visible generated caption and a fallback when loading fails.
- [x] Add browser assertions for coverage, disclosure, prefix-safe loaded images, mobile overflow and broken asset fallback; observe failure before integration.
- [x] Add figures to Cosmetic cards, visible Wellness treatment entries and free assessment; add compact figures to every Salon row without replacing its table/search.
- [x] Verify actual crops and quality at desktop/mobile; run typecheck, capture check, Node/browser/Pages checks, and inspect final diff.
- [x] Update image editing instructions and handoff; commit, push main, verify Pages and regenerated downloadable ZIP.
