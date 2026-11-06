# Janus usability improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Track completion with checkboxes.

**Goal:** Apply all improvements approved by “apply all” after the website inspection.
**Architecture:** Preserve the current React/Glisse design and structured catalogs. Split full Wellness collections into dedicated prefix-safe routes, share URL-based catalog filters, group only genuine Salon length variants, and keep booking context independent of generic navigation. Clinic content records source and confirmation status.
**Tech Stack:** Existing React/TypeScript/Vite, CSS, Node/Playwright; no new runtime dependency.
**Spec:** docs/reviews/2026-11-06-website-improvements.md (owner approved all proposals).

## Global Constraints
- Preserve Janus logo, fonts, palette, imagery disclosures, original capture and all approved prices.
- Keep welcome/registration above the three areas; browsing stays free.
- Keep memory-only demo, no real OTP/accounts/messages/payments.
- Do not invent clinic approval, hours, facilities, treatment duration or preparation advice.
- Existing main/Pages publication and handoff refresh remain authorized.

## Review Focus
- Generic booking controls must never clear a selected offering or date.
- Query changes and Back must retain filters without stealing typing focus or jumping the page.
- Grouping must preserve every123 Salon IDs/prices and separate crown/full-head/provider services.
- Deep routes must load/refresh on static Pages and retain all treatment imagery.
- Small-screen fixed controls, dark panels and long labels must remain readable and usable.

### Task 1: Booking, tokens, homepage and clinic context
**Files:** modify App.tsx, Booking.tsx, theme.css, wellness.css, booking.css, treatment-image.css; create ClinicInfo.tsx and data/clinic.json.
**Interfaces:** shared semantic color tokens; Booking owns a persistent selected-offering figure/summary; generic booking controls become a current-step anchor on booking routes. ClinicInfo consumes source-labelled approved/published data only.
- [x] Add browser regressions for preserved selection, initial/final summary and dark text; observe RED.
- [x] Implement booking controls/summary, smaller mobile welcome and combined safe-area-aware preview/booking bar, semantic tokens and clinic-information strip using existing clinic image.
- [x] Verify targeted checks and commit.

### Task 2: Shorter Wellness discovery and routes
**Files:** Wellness.tsx, wellness.css, ui.tsx, App.tsx, build-preview.py; create data/routes.json and lib/useCatalogFilters.ts.
**Interfaces:** route manifest shared by exporter/SPA; Wellness accepts section mode overview/treatments/packages/memberships/body-contouring; catalog filters use q/category URL parameters and Back subscriptions.
- [x] Add route/filter/overview-height tests; observe RED.
- [x] Implement compact overview, full dedicated collections, treatment filters/search/clear, all images and details; keep free assessment easy to find.
- [x] Verify static route refresh, pricing/image inventory and filter focus; commit.

### Task 3: Salon family comparison and return state
**Files:** extract pages/Salon.tsx; create lib/salon-families.ts; reuse URL filters; add Node/browser tests.
**Interfaces:** groupSalonOfferings returns stable family records with original offering variants. Only explicit Short/Medium/Long patterns group; crown areas stay separate. Native variant selector chooses exact original booking ID.
- [x] Write grouping/filter/Back tests; observe RED.
- [x] Add active category/search/reset, URL state and grouped variant selectors. Keep original row IDs/images available and correct price/provider/duration for the selected option.
- [x] Verify123 original entries, root touching6800, provider distinction, variant selection and Back; commit.

### Task 4: Review and delivery
**Files:** PRODUCT.md, DESIGN.md, editing guide, HANDOFF.md, verification record, learning PDF; relevant existing tests updated for approved new routes/layout.
- [x] Add concise context entry documents linking existing authorities; update instructions and learning material.
- [x] Typecheck, capture check, full Node/local/Pages browser checks; inspect320/390/1440 layouts and axe contrast, run Impeccable detector, obtain one independent whole-change review.
- [x] Fix important findings with regressions; verify, commit and publish main/Pages; confirm current downloadable handoff ZIP.
