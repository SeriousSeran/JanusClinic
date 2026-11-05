# Three-area gateway and Sri Lankan imagery

The owner requested implementation of the previously discussed Cosmetic / Salon / Wellness gateway and adult Sri Lankan model imagery on 5 November 2026. This document records that authorized direction and the implementation choices below.

## Intent

Make the first decision on the homepage clear: choose Cosmetic, Salon, or Wellness. Preserve Janus's ivory/stone interface, original magenta logo, Cormorant Garamond and DM Sans, fine gold detail, restrained buttons and generous spacing. Decorative portraits use adult Sri Lankan women, authentic skin texture and soft rose studio backgrounds.

## Approach

Use maintained static page templates and content outside the original capture; integrate them into the existing read-only Pages exporter and Node preview. This is the practical fit for the existing no-backend review site. Editing captured HTML alone risks hydration restoring its old content; rebuilding every original page in a new framework would unnecessarily expand this task. The original capture and 49 portfolio reference covers remain unchanged.

## Pages and navigation

- Homepage: short editorial introduction and three equally prominent image-led links for Cosmetic, Salon and Wellness. Supporting links reach practitioner information and the existing treatment inventory. Cosmetic opens an authored landing page linking to all eight existing medical-cosmetic treatment guides.
- Salon: an authored landing page with the supplied 123 active services, category navigation, current LKR prices, source pricing conditions and explicit small wording-review notes for ambiguous source labels. Body care and massage remain under Salon. No excluded LKR 5,000 root-touching entry. Do not publish uncertain contact details.
- Wellness: an authored landing page saying the programme is being developed. No invented three-tier names, packages, inclusions, prices or health claims. Link back to the other areas.
- Shared navigation on authored pages exposes all three areas, About, and Contact, with an accessible mobile menu. Existing captured-page navigation gains links back to the three areas in the review build so visitors can switch areas from deep pages.

## Images

Generate three editorial portraits of different adult Sri Lankan women for the three areas, soft rose backdrop, natural texture, understated styling. Use a maintained image manifest to replace only explicitly selected decorative hero/category photographs in the review build; do not replace real staff, clinic, product or procedural photographs. No suggestion that the models are actual patients or results. Label the AI illustrations discreetly and document prompts/provenance. Original images remain in the capture and historical portfolio.

## Source and review boundaries

Maintained website content lives under `site/`; Python templates/build logic is shared by the Pages build and a local authored-page handler. Compiled original bundles remain untouched. Pages remains visibly a design preview, noindex, with operational controls disabled. New routes work under `/JanusClinic/`, support direct refreshes, and remain reachable without JavaScript. Catalog source JSON remains the price source of truth. No new runtime dependency.

## Validation

Check all captured routes, new routes and direct links; compare desktop/mobile screenshots with the portfolio; verify natural image crops, local font loading, tab focus/mobile menu, prices/count/exclusions, undefined wellness status, no external form delivery, and all original checks. Deploy the tested change through the existing authorized main-branch Pages workflow, then verify the actual public URL.
