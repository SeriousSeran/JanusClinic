# Liquid glass: reference findings for the Janus discussion

These are design recommendations, not an approved implementation. The owner asked to discuss liquid glass and requested installation/use of the listed agent skills.

Frontend Design supports a client-specific treatment and explicitly gives the owner's established visual direction priority over generic anti-template preferences. Janus therefore retains its logo, Cormorant Garamond / DM Sans, rose model portraits and approved factual content.

UI/UX Pro Max's verified `liquid-glass` result describes Apple native materials (SwiftUI/UIKit/AppKit), while its `glassmorphism` result describes the browser implementation. For this HTML/CSS website, use a liquid-glass-inspired frosted treatment rather than promise exact native optical behavior. A modest 10–20px backdrop blur, controlled ivory tint, fine edge highlights and opaque fallback are a reasonable starting point. Check text contrast over each actual background instead of adopting the reference's transparency values blindly.

Impeccable's context tool recognized the existing visual system. Its refinement guidance preserves incumbent identity; no automatic redesign or theme replacement follows from installing it. The project already has its identity and owner brief under docs/ even though optional PRODUCT.md / DESIGN.md metadata is absent.

Recommended scope for the visual comparison: navigation, shared account/welcome panel and mobile booking control. Keep prices, treatment explanations and input fields on readable solid surfaces. Consider subtler photo-caption glass as a secondary option. Preserve faces and avoid stacked blur layers, animated blur/refraction or a new animation dependency. Respect reduced motion/transparency and provide a solid fallback.

Agent Browser successfully opened the local preview and ran axe on its real page: 38 checks passed, zero automated violations, one incomplete item requiring manual review. This is an installation smoke check, not proof that the proposed glass treatment is accessible; that treatment is not yet implemented.

Next design step remains the offered comparison of subtle and more pronounced glass. No website design, customer account or booking delivery was changed by installing the tools.
