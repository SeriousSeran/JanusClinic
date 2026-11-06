# Execution plan

1. Shared interfaces, authoritative offering catalog and unit regressions.
2. Independent Wellness content/UI and booking demo modules; root owns React shell, theme, Salon/Cosmetic, routing and build integration.
3. Integrate Vite output into static exporter and local server, retain legacy sanitization and capture integrity; expose portable catalog source.
4. Browser/unit tests cover source price arithmetic, identities, unknown selection, dates, phone validation, edit flow, no writes/storage, links/fonts/images, mobile/keyboard, Glisse and fallbacks.
5. Inspect desktop/mobile, independent review, fixes, all checks; publish verified Pages deployment and create documented handoff ZIP.

Native source boundaries: frontend/lib/types.ts interfaces fixed; wellness JSON is Offering[]. Root catalog helper exports allOfferings, wellnessOfferings, salonOfferings, cosmeticOfferings, findOffering(id), regularValue(offering), money(price,maxPrice?), bookingHref(id). Shared frontend/ui.tsx exports Link, BookLink, asset(path); customer context frontend/session.tsx exports useDemoSession with customer/setCustomer. Routing uses Link; no persisted personal details. Booking module default props { initialOfferingId?: string }; Wellness module default no props. Scope owned files explicitly assigned to avoid concurrent edits. Work in current checkout per AGENTS.
